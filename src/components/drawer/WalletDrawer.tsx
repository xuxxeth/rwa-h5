import { memo, useCallback, useMemo, useState } from 'react'
import { Drawer } from '@/components/drawer'
import { useTranslation } from '@/hooks/useTranslation'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import { useToast } from '@/hooks/useToast'
import { useRouter } from '@/hooks/useRouter'
import { useKycStatus } from '@/hooks/useKycStatus'
import { useSignatureValidStatus } from '@/hooks/useSignature'
import { useVerifyTip } from '@/components/market-trading/VerifyIdentity'
import { usePendingStep } from '@/hooks/usePendingStep'
import { KYC_OVERALL_STATUS } from '@/service/kyc/types'
import {
  KycUnverified,
  KycVerified,
  KycException,
  KycAdditionalInfo,
  Disconnect,
} from '@/components/icons'
import { IdentityExceptionDrawer } from '@/components/drawer/IdentityExceptionDrawer'
import { Address } from '@/components/Address.tsx'

interface WalletDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const WalletDrawer = memo(({ open, onOpenChange }: WalletDrawerProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { toastError } = useToast()
  const { account, handleDisConnect } = useActiveWeb3()

  const { kycStatus } = useKycStatus()
  const [isSignatureValid] = useSignatureValidStatus()
  const { verifyTip } = useVerifyTip()
  const pendingStep = usePendingStep()

  const [exceptionDrawerOpen, setExceptionDrawerOpen] = useState(false)

  const handleCopy = useCallback(async () => {
    if (!account) return
    try {
      await navigator.clipboard.writeText(account)
    } catch {
      // silent
    }
  }, [account])

  const handleDisconnect = useCallback(async () => {
    await handleDisConnect()
    onOpenChange(false)
    toastError({ title: t('walletDisconnect') })
  }, [handleDisConnect, onOpenChange, toastError, t])

  const handleKycClick = useCallback(() => {
    if (kycStatus === KYC_OVERALL_STATUS.ISSUE) {
      setExceptionDrawerOpen(true)
      return
    }
    onOpenChange(false)
    router.push('identity')
  }, [onOpenChange, router, kycStatus])

  /** Render the correct KYC icon + label based on status */
  const kycInfo = useMemo(() => {
    // Verified & no pending step => green verified
    if (kycStatus === KYC_OVERALL_STATUS.VERIFIED && !pendingStep.step) {
      return { icon: <KycVerified size={20} />, label: t('verified'), color: '#25A750' }
    }
    // Issue (blacklist) => red exception
    if (kycStatus === KYC_OVERALL_STATUS.ISSUE) {
      return { icon: <KycException size={20} />, label: t('issue'), color: '#CA3F64' }
    }
    // Has pending step (expired / additional info) => yellow additional info
    if (pendingStep.step) {
      return { icon: <KycAdditionalInfo size={20} />, label: t('kyc.t51'), color: '#FFB219' }
    }
    // Default: unverified => yellow unverified
    return { icon: <KycUnverified size={18} />, label: t('notVerified'), color: '#FFB219' }
  }, [kycStatus, pendingStep.step, t])

  /** Whether clicking KYC status should navigate */
  const isKycClickable = useMemo(() => {
    // Verified with no pending step is not clickable
    if (kycStatus === KYC_OVERALL_STATUS.VERIFIED && !pendingStep.step) {
      return false
    }
    return true
  }, [kycStatus, pendingStep.step])

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} title={t('Wallet')}>
        <div className='flex flex-col'>
          {/* Wallet Address Row */}
          <div className='flex items-center justify-between px-5 py-5'>
            <span className='text-[16px] font-medium text-white'>{t('walletAddress')}</span>
            {/*<div className='flex items-center gap-2'>
              <span className='text-[16px] font-medium text-white'>
                {shortenAddress(account || '', 4, 4)}
              </span>
              <button className='flex items-center justify-center' onClick={handleCopy}>
                <CopyAddress size={16} />
              </button>
            </div>*/}
            <Address className='text-[16px] font-medium text-white' address={account || ''} />
          </div>

          {/* Verification Status Row */}
          <div
            className='flex items-center justify-between px-5 py-5'
            onClick={isKycClickable ? handleKycClick : undefined}
            style={{ cursor: isKycClickable ? 'pointer' : 'default' }}
          >
            <span className='text-[16px] font-medium text-white'>{t('verificationStatus')}</span>
            <div className={'flex items-center gap-[4px]'}>
              {kycInfo.icon}
              <span className={'text-[14px]'} style={{ color: kycInfo.color }}>{kycInfo.label}</span>
            </div>
          </div>

          {/* Disconnect */}
          <div
            className='flex items-center justify-center gap-2 border-t border-[#232427] px-5 py-4 cursor-pointer'
            onClick={handleDisconnect}
          >
            <Disconnect size={14} />
            <span className='text-[14px] font-medium text-white'>{t('Disconnect')}</span>
          </div>
        </div>
      </Drawer>

      <IdentityExceptionDrawer open={exceptionDrawerOpen} onOpenChange={setExceptionDrawerOpen} />
    </>
  )
})

WalletDrawer.displayName = 'WalletDrawer'
