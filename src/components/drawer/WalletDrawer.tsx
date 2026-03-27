import { memo, useCallback, useMemo, useState } from 'react'
import { Drawer } from '@/components/drawer'
import { useTranslation } from '@/hooks/useTranslation'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import { useToast } from '@/hooks/useToast'
import { useRouter } from '@/hooks/useRouter'
import { shortenAddress } from '@/utils'
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
} from '@/components/icons'
import { IdentityExceptionDrawer } from '@/components/drawer/IdentityExceptionDrawer'

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

  /** Render the correct KYC icon based on status */
  const kycIcon = useMemo(() => {
    // Verified & no pending step => green verified
    if (kycStatus === KYC_OVERALL_STATUS.VERIFIED && !pendingStep.step) {
      return <KycVerified size={20} />
    }
    // Issue (blacklist) => red exception
    if (kycStatus === KYC_OVERALL_STATUS.ISSUE) {
      return <KycException size={20} />
    }
    // Has pending step (expired / additional info) => yellow additional info
    if (pendingStep.step) {
      return <KycAdditionalInfo size={20} />
    }
    // Default: unverified => yellow unverified
    return <KycUnverified size={18} />
  }, [kycStatus, pendingStep.step])

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
      <div className="flex flex-col">
        {/* Wallet Address Row */}
        <div className="flex items-center justify-between px-5 py-5">
          <span className="text-[16px] font-medium text-white">
            {t('walletAddress')}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-medium text-white">
              {shortenAddress(account || '', 4, 4)}
            </span>
            <button className="flex items-center justify-center" onClick={handleCopy}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.7188 4H5.78125C4.79749 4 4 4.79749 4 5.78125V12.7188C4 13.7025 4.79749 14.5 5.78125 14.5H12.7188C13.7025 14.5 14.5 13.7025 14.5 12.7188V5.78125C14.5 4.79749 13.7025 4 12.7188 4Z"
                  stroke="white"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.9844 4L12 3.25C11.9987 2.78628 11.8139 2.34192 11.486 2.01402C11.1581 1.68612 10.7137 1.50132 10.25 1.5H3.5C2.97005 1.50157 2.46225 1.71278 2.08752 2.08752C1.71278 2.46225 1.50157 2.97005 1.5 3.5V10.25C1.50132 10.7137 1.68612 11.1581 2.01402 11.486C2.34192 11.8139 2.78628 11.9987 3.25 12H4"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Verification Status Row */}
        <div
          className="flex items-center justify-between px-5 py-5"
          onClick={isKycClickable ? handleKycClick : undefined}
          style={{ cursor: isKycClickable ? 'pointer' : 'default' }}
        >
          <span className="text-[16px] font-medium text-white">
            {t('verificationStatus')}
          </span>
          {kycIcon}
        </div>

        {/* Disconnect */}
        <div
          className="flex items-center justify-center gap-2 border-t border-[#232427] px-5 py-4 cursor-pointer"
          onClick={handleDisconnect}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.46138 8.9248L5.07388 9.5373C5.16138 9.6248 5.24888 9.6248 5.24888 9.5373L6.21138 8.57481C6.29888 8.48731 6.29888 8.39981 6.21138 8.31231L5.59888 7.7873C5.51138 7.6998 5.42388 7.6998 5.33638 7.7873L4.46138 8.6623C4.37388 8.7498 4.37388 8.8373 4.46138 8.9248Z"
              fill="white"
            />
            <path
              d="M7.4375 9.71231C7.35 9.62481 7.2625 9.62481 7.175 9.71231L7.0875 9.7998L5.425 11.3748C4.6375 12.1623 3.325 12.1623 2.5375 11.3748C1.75 10.6748 1.75 9.3623 2.625 8.57481L4.2875 6.9123L4.375 6.82481V6.5623L3.7625 5.94981C3.675 5.86231 3.5875 5.86231 3.5 5.94981L1.75 7.69981C0.4375 9.01231 0.4375 11.0248 1.75 12.3373C2.3625 12.9498 3.2375 13.2998 4.025 13.2998C4.9 13.2998 5.6875 12.9498 6.3875 12.3373L8.05 10.6748L8.1375 10.5873C8.225 10.4998 8.225 10.4123 8.1375 10.3248L7.4375 9.71231ZM12.8625 11.3748L10.0625 8.57481L10.15 8.4873L12.25 6.2998C12.8625 5.6873 13.2125 4.8998 13.2125 4.0248C13.2125 3.1498 12.8625 2.3623 12.25 1.7498C11.025 0.524805 8.925 0.524805 7.6125 1.7498L5.5125 3.9373L5.425 4.0248L2.7125 1.2248C2.625 1.1373 2.45 1.1373 2.45 1.2248L1.8375 1.8373C1.75 1.9248 1.75 2.0123 1.8375 2.0998L1.925 2.1873L12.075 12.3373C12.1625 12.4248 12.25 12.4248 12.3375 12.3373L12.95 11.7248C12.95 11.6373 12.95 11.5498 12.8625 11.3748ZM6.3 4.8123L8.575 2.6248C9.3625 1.8373 10.675 1.8373 11.4625 2.6248C11.8125 2.9748 12.075 3.4998 12.075 4.0248C12.075 4.5498 11.8125 5.07481 11.4625 5.51231L9.275 7.69981L9.1875 7.7873L8.1375 6.7373L9.5375 5.3373L9.625 5.2498V5.07481L9.0125 4.3748H8.75L7.2625 5.8623L6.3 4.8123Z"
              fill="white"
            />
          </svg>
          <span className="text-[14px] font-medium text-white">
            {t('Disconnect')}
          </span>
        </div>
      </div>
    </Drawer>

    <IdentityExceptionDrawer
      open={exceptionDrawerOpen}
      onOpenChange={setExceptionDrawerOpen}
    />
    </>
  )
})

WalletDrawer.displayName = 'WalletDrawer'
