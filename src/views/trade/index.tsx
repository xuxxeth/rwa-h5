import { lazy, useCallback, useEffect, useMemo } from 'react'
import { useRwas } from '@/hooks/useRwaBalances'
import { useTokens } from '@/hooks/useTokens'
import { SessionStatusBar } from './components/SessionStatusBar'
import { BuySellTabs } from './components/BuySellTabs'
import { OrderTypeSelector } from './components/OrderTypeSelector'
import { SessionPicker } from './components/SessionPicker'
import { AmountInput } from './components/AmountInput'
import { TradeSummary } from './components/TradeSummary'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button.tsx'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import { useTradeStore } from '@/stores/tradeStore'
import { useBaseStore } from '@/stores/baseStore'
import { useTranslation } from '@/hooks/useTranslation'
import { useRouter } from '@/hooks/useRouter'
import { MARKET_STATUS } from '@/config/constants'
import { ConnectButtonText } from '@/components/button/ConnectButtonText'
import SignButton from '@/components/button/SignButton'
import { TradeType } from '@/hooks/useCaCommon'
import { parseAmount, truncateUP, formatTokenAmountWithCommas, INTEGER_REGEX, symbolToLower } from '@/utils'
import { useTokenBalance } from '@/hooks/useTokenBalances'
import { useTrading } from '@/hooks/useTrading'
import { useTxToast } from '@/hooks/useTxToast'
import { useCalcFee } from '@/hooks/useCalcFee'
import { useToast } from '@/hooks/useToast'
import { useTradeStoreBindings } from '@/components/markets/TradeBox/useTradeStoreBindings'
import { useOrderBase } from '@/components/markets/TradeBox/useOrderBase'
import { useEffectivePrice } from '@/components/markets/TradeBox/useEffectivePrice'
import { useApproveAmount } from '@/components/markets/TradeBox/useApproveAmount'
import { useRealtimePriceSync } from '@/components/markets/TradeBox/useRealtimePriceSync'
import { useTxStepLifecycle } from '@/components/markets/TradeBox/useTxStepLifecycle'
import { useLimitOrder } from '@/components/markets/TradeBox/useLimitOrder'
import { useLimitOrderUIState } from '@/components/markets/TradeBox/useLimitOrderUIState'
import { useTradeGateState } from '@/components/markets/TradeBox/useTradeGateState'
import { useTradeCallbacks } from '@/components/markets/TradeBox/useTradeCallbacks'
import { useShowDialog } from '@/components/dialog/DialogController'
import { OrderConfirmDrawer } from '@/components/drawer/OrderConfirmDrawer'
import { SymbolSelectDrawer } from '@/components/drawer/SymbolSelectDrawer'
import { USDSelectDrawer } from '@/components/drawer/USDSelectDrawer'
import { MarketCloseTips } from './components/MarketCloseTips.tsx'
const KycState = lazy(() => import("@/components/kyc-state"));


export const TradePage = () => {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const { toastError } = useToast()
  const { account, isSameChain } = useActiveWeb3()
  const orderDialog = useShowDialog()
  const tokenDialog = useShowDialog()
  const outputTokenDialog = useShowDialog()

  // ── Store bindings (reuses tradeStore + baseStore + kycStore + settingStore) ──
  const {
    marketInfo,
    freshTokenBalances,
    riskUserConfig,
    showConfirm,
    updateLimitPrice,
    updateInputSize,
    updateExpires,
    setTxError,
    setTxSuccess,
    setTxStep,
    updateSlippage,
    limitPrice,
    inputSize,
    expires,
    inputToken,
    outputToken,
    action,
    realtimeData,
    slippage,
  } = useTradeStoreBindings()

  const updateInputToken = useTradeStore(state => state.updateInputToken)
  const updateOutputToken = useTradeStore(state => state.updateOutputToken)
  const tokenWithBalance = useBaseStore(state => state.tokenWithBalance)
  const rwaList = useRwas()
  const tokenList = useTokens()

  // ── Output token list with balance (same logic as USDTSelect) ──
  const tokenListWithBalance = useMemo(() => {
    return tokenList.map(token => ({
      ...token,
      ...tokenWithBalance[symbolToLower(token.symbol)]
    }))
  }, [tokenList, tokenWithBalance])

  const hasMultipleOutputTokens = tokenListWithBalance.length > 1

  // ── Token selector callback (same logic as CurrencyInputPanel v2) ──
  const handleTokenClick = useCallback(() => {
    tokenDialog.setOpen(true)
  }, [])

  // ── Output token selector callback (same logic as USDTSelect) ──
  const handleOutputTokenClick = useCallback(() => {
    if (hasMultipleOutputTokens) {
      outputTokenDialog.setOpen(true)
    }
  }, [hasMultipleOutputTokens])

  // ── Token initialization from route param (same logic as CurrencyInputPanel) ──
  useEffect(() => {
    if (!router.params.symbol) {
      rwaList[0] && updateInputToken(rwaList[0])
    } else {
      const _rwa = rwaList.find(rwa => rwa.symbol.toLowerCase() === router.params.symbol?.toLowerCase())
      _rwa && updateInputToken(_rwa)
    }
  }, [rwaList.length, inputToken, router.params])

  useEffect(() => {
    if (tokenList[0]) {
      updateOutputToken(tokenList[0])
    }
  }, [tokenList.length])

  const marketTradeState = useBaseStore(state => state.marketTradeState)
  const tradeType = useTradeStore(state => state.tradeType)
  const sessionType = useTradeStore(state => state.sessionType)
  const isMarketCloseDisabled = marketTradeState !== MARKET_STATUS.OPEN && tradeType === TradeType.MARKET
  // ── Effective price (with slippage for market orders) ──
  const effectivePrice = useEffectivePrice({
    tradeType,
    action,
    limitPrice,
    slippage,
  })

  // ── Payment token address ──
  const paymentToken = useMemo(
    () => (action === 'buy' ? outputToken?.address : inputToken?.address),
    [action, inputToken?.address, outputToken?.address]
  )

  // ── Token balances ──
  const inputTokenBalance = useTokenBalance(inputToken?.symbol || '')
  const outputTokenBalance = useTokenBalance(outputToken?.symbol || '')

  // ── Realtime price sync ──
  const { inputTokenPrice, handlePriceInput, handleChangePrice } = useRealtimePriceSync({
    inputToken,
    rwaPrice: inputTokenBalance,
    realtimeData,
    tradeType,
    limitPrice,
    updateLimitPrice,
  })

  // Sync limitPrice from realtime for market orders
  useEffect(() => {
    if (tradeType !== TradeType.MARKET) return
    const initialPrice = truncateUP(String(inputTokenPrice?.price ?? realtimeData?.p ?? 0), 2)
    if (initialPrice !== limitPrice) {
      updateLimitPrice(initialPrice)
    }
  }, [tradeType, inputTokenPrice?.price, realtimeData?.p, limitPrice, updateLimitPrice])

  // Reset input size on buy/sell switch
  useEffect(() => {
    updateInputSize('')
  }, [action, updateInputSize])

  // ── Order value ──
  const orderValue = useOrderBase(effectivePrice, inputSize)

  // ── Fee calculation ──
  const { estimatedFee, platformFee, brokerageFee, tradingActivityFee, allOrderValue } = useCalcFee(
    orderValue,
    inputSize,
    action === 'buy',
    inputToken?.feeRate
  )

  // ── Approve amount ──
  const approveAmount = useApproveAmount({
    paymentToken,
    orderValue,
    inputSize,
    action,
    inputToken,
    outputToken,
    estimatedFee,
    parseAmount,
  })

  // ── Trading contract interaction ──
  const { placeOrder, txStep, approvalState, refetchAllowance } = useTrading(
    paymentToken as `0x${string}`,
    approveAmount
  )

  // ── Tx toast lifecycle ──
  const { toastTxSteps, dismissTxToast } = useTxToast()
  const { handleStartStep } = useTxStepLifecycle({
    txStep,
    approvalState,
    setTxStep,
    setTxError,
    setTxSuccess,
    dismissTxToast,
    toastTxSteps,
    refetchAllowance,
  })

  // ── Place order logic ──
  const order = useLimitOrder({
    placeOrder,
    inputToken,
    outputToken,
    effectivePrice,
    inputSize,
    expires,
    action,
    tradeType,
    sessionType,
    slippage,
    marketInfo,
    riskUserConfig,
    t,
    toastError,
    onStart: handleStartStep,
    onSuccess: () => {
      freshTokenBalances()
      updateInputSize('')
    },
    onError: (message: string) => {
      setTxError(message)
    },
  })

  // ── UI state (button text, disabled, insufficient) ──
  const uiState = useLimitOrderUIState({
    limitPrice,
    orderValue,
    inputSize,
    inputToken,
    outputToken,
    action,
    inputTokenBalance,
    outputTokenBalance,
    t,
    language: i18n.language,
  })

  // ── Button variant ──
  const buttonVariant = useMemo(() => (action === 'buy' ? 'primary' : 'warning'), [action])

  // ── Callbacks ──
  const { handlePriceChange, handleSizeChange, handleSlippageChange } = useTradeCallbacks({
    onPriceInput: handlePriceInput,
    updateInputSize,
    updateExpires,
    updateSlippage,
  })

  // ── Gate state (connect/sign/kyc) ──
  const {
    isSignatureValid,
    refreshIsSignatureValid,
    kycButtonText,
    isPageReady,
  } = useTradeGateState({
    account,
    isSameChain,
    inputToken,
    outputToken,
    inputTokenBalance,
    outputTokenBalance,
    approvalState,
    action,
    riskUserConfig,
    t,
  })

  // ── Balance display strings ──
  const inputBalanceDisplay = account
    ? `${formatTokenAmountWithCommas(inputTokenBalance?.balance || '0')} ${inputToken?.symbol || ''}`
    : undefined
  const outputBalanceDisplay = account
    ? `${formatTokenAmountWithCommas(outputTokenBalance?.balance || '0')} ${outputToken?.symbol || ''}`
    : undefined

  return (
    <div className='flex min-h-screen flex-col bg-gray-950'>
      <div className='flex flex-col gap-3 px-5 py-[10px]'>
        <KycState />
        {/* 交易时段状态栏 */}
        <SessionStatusBar />

        {/* 交易操作区 */}
        <div className='flex flex-col gap-2'>
          {/* 买入/卖出 Tab */}
          <BuySellTabs />

          {/* 市价/限价 + 历史 */}
          <OrderTypeSelector />

          {/* 交易时段选择 (limit orders only) */}
          <SessionPicker />

          {/* Price input (read-only for market orders) */}
          {tradeType === TradeType.LIMIT && <AmountInput
            label={tradeType === TradeType.MARKET ? t('v3.price') : t('v2.tx.t24')}
            value={limitPrice}
            onChange={handlePriceChange}
            tokenSymbol={outputToken?.symbol}
            readOnly={tradeType === TradeType.MARKET}
            showDropdown={false}
          />}

          {/* Size input */}
          <AmountInput
            label={t('v2.tx.t25')}
            value={inputSize}
            onChange={handleSizeChange}
            tokenSymbol={inputToken?.symbol}
            tokenLogo={inputToken?.icon}
            balance={action === 'sell' ? inputBalanceDisplay : undefined}
            showDropdown
            onTokenClick={handleTokenClick}
            regex={INTEGER_REGEX}
            isInsufficient={uiState.isSellInsufficient}
          />

          {/* Estimated pay / receive (read-only, with output token switch like USDTSelect) */}
          <AmountInput
            label={action === 'buy' ? t('v2.tx.t26') : t('v2.tx.t27')}
            value={allOrderValue}
            onChange={() => {}}
            tokenSymbol={outputToken?.symbol}
            tokenLogo={outputToken?.icon}
            balance={action === 'buy' ? outputBalanceDisplay : undefined}
            showDropdown={hasMultipleOutputTokens}
            onTokenClick={handleOutputTokenClick}
            readOnly
            isInsufficient={uiState.isBuyInsufficient}
          />
        </div>

        {/* 操作按钮 + 摘要 */}
        <div className='flex flex-col gap-3'>
          {(!account || !isSameChain) ? (
            <ConnectButtonText className='h-[48px] rounded-md text-[14px]' />
          ) : !isSignatureValid ? (
            <SignButton
              className='w-full h-[48px] rounded-md text-[14px]'
              refreshIsSignatureValid={refreshIsSignatureValid}
            />
          ) : kycButtonText ? (
            <Button
              variant='secondary'
              size='lg'
              className='w-full'
              onClick={() => router.push('/identity')}
            >
              {kycButtonText}
            </Button>
          ) : (
            <Button
              variant={buttonVariant}
              size='lg'
              className='w-full !text-white'
              loading={order.loading}
              disabled={uiState.disabled || isMarketCloseDisabled || order.loading}
              onClick={() => {
                if (showConfirm) {
                  orderDialog.setOpen(true)
                  return
                }
                order.submit()
              }}
            >
              {uiState.buttonText}
            </Button>
          )}

          {Number(orderValue) > 0 && <TradeSummary
            fromAmount={`${inputSize} ${inputToken?.symbol || ''}`}
            toAmount={`${allOrderValue} ${outputToken?.symbol || ''}`}
            slippage={slippage}
            limitPrice={limitPrice}
            symbol={inputToken?.symbol || ''}
            usdSymbol={outputToken?.symbol || 'USDT'}
            estimatedFee={estimatedFee}
            platformFee={platformFee}
            brokerageFee={brokerageFee}
            tradingActivityFee={tradingActivityFee}
            networkFeeInNative={marketInfo.networkFeeInNative}
            isBuy={action === 'buy'}
            decimals={inputToken?.decimals ?? 6}
          />}
        </div>

        <MarketCloseTips />
        
        {/* 底部信息 */}
        <Footer />
      </div>

      {/* Token selector drawer */}
      <SymbolSelectDrawer
        open={tokenDialog.open}
        onOpenChange={tokenDialog.setOpen}
        onClick={(token) => {
          router.push('/trade/' + token.symbol)
        }}
      />

      {/* Output token selector drawer */}
      <USDSelectDrawer
        open={outputTokenDialog.open}
        onOpenChange={outputTokenDialog.setOpen}
        onClick={(token) => {
          updateOutputToken(token)
        }}
      />

      {/* Order confirmation drawer */}
      <OrderConfirmDrawer
        open={orderDialog.open}
        onOpenChange={orderDialog.setOpen}
        action={action}
        tradeType={tradeType}
        sessionType={sessionType}
        slippage={slippage}
        orderValue={orderValue}
        platformFee={platformFee}
        brokerageFee={brokerageFee}
        tradingActivityFee={tradingActivityFee}
        estimatedFee={estimatedFee}
        feeRate={inputToken?.feeRate ?? ''}
        networkFeeInNative={marketInfo.networkFeeInNative}
        onClick={() => {
          orderDialog.hide()
          order.submit()
        }}
      />
    </div>
  )
}

export default TradePage
