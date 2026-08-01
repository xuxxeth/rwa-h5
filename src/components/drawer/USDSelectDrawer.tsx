import { memo, useId, useMemo } from 'react'
import { Drawer } from '@/components/drawer'
import { useTranslation } from '@/hooks/useTranslation'
import { useTokens } from '@/hooks/useTokens'
import { useTokenBalance } from '@/hooks/useTokenBalances'
import { useBaseStore } from '@/stores/baseStore'
import { LazyImage } from '@/components/image/LazyImage'
import { NoData } from '@/components/markets/NoData'
import { formatTokenAmountWithCommas, symbolToLower } from '@/utils'
import type { IToken } from '@/service/base/types'

/* ────────────────────────── types ────────────────────────── */

interface USDSelectDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClick?: (token: IToken) => void
}

/* ────────────────────────── sub-components ───────────────── */

/** Holdings column (balance + USD equivalent) */
const TokenHoldings = memo(({ address }: { address: string }) => {
  const tokenBalance = useTokenBalance(address)?.balance ?? '0'
  // For stablecoins the price ≈ 1, display balance as USD equivalent
  const usdValue = tokenBalance

  return (
    <div className="flex flex-col items-stretch">
      <span className="text-right text-[16px] font-normal text-white">
        {formatTokenAmountWithCommas(tokenBalance)}
      </span>
      <span className="text-right text-[14px] font-normal text-[#9DA3AF]">
        ≈ ${formatTokenAmountWithCommas(usdValue)}
      </span>
    </div>
  )
})
TokenHoldings.displayName = 'TokenHoldings'

/** Single token row */
const TokenRow = memo(
  ({ token, onClick }: { token: IToken & { balance?: string }; onClick?: (t: IToken) => void }) => (
    <div
      className="flex cursor-pointer items-center gap-1 px-5 py-2 active:bg-[#232427]"
      onClick={() => onClick?.(token)}
    >
      {/* Name section – fixed 140px */}
      <div className="flex w-[140px] shrink-0 items-center gap-2">
        <LazyImage src={token.icon} className="h-8 w-8 shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-col justify-center">
          <span className="truncate text-[16px] font-normal text-white">{token.symbol}</span>
          <span className="truncate text-[14px] font-normal text-[#9DA3AF]">{token.name}</span>
        </div>
      </div>

      {/* Holdings – fill */}
      <div className="flex-1">
        <TokenHoldings address={token.address} />
      </div>
    </div>
  ),
)
TokenRow.displayName = 'TokenRow'

/* ────────────────────────── main component ──────────────── */

export const USDSelectDrawer = memo(
  ({ open, onOpenChange, onClick }: USDSelectDrawerProps) => {
    const { t } = useTranslation()
    const tokenWithBalance = useBaseStore((s) => s.tokenWithBalance)
    const tokenList = useTokens()
    const _id = useId()

    /* ── merge balance ── */
    const tokenListWithBalance = useMemo(
      () =>
        tokenList.map((token) => ({
          ...token,
          ...tokenWithBalance[symbolToLower(token.address)],
        })),
      [tokenList, tokenWithBalance],
    )

    return (
      <Drawer open={open} onOpenChange={onOpenChange} title={t('Select a token')}>
        <div className="flex flex-col gap-4 bg-[#1A1B1E] pt-4">
          {/* ── Token list ── */}
          <div className="flex flex-col gap-2">
            <div className="scroll-box max-h-[60vh] overflow-y-auto">
              {tokenListWithBalance.map((token, index) => (
                <TokenRow
                  key={`${_id}-${index}`}
                  token={token}
                  onClick={(t) => {
                    onOpenChange(false)
                    onClick?.(t)
                  }}
                />
              ))}
              {tokenListWithBalance.length <= 0 && (
                <div className="py-[100px]">
                  <NoData />
                </div>
              )}
            </div>
          </div>
        </div>
      </Drawer>
    )
  },
)

USDSelectDrawer.displayName = 'USDSelectDrawer'
