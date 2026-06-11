'use client'

import { Button } from '@/components/ui/button'
import { LazyImage } from '@/components/image/LazyImage'
import { DialogController, useShowDialog } from "@/components/dialog/DialogController"
import { useTranslation } from '@/hooks/useTranslation'
import { KycInput } from '@/components/input/KycInput'
import { lazy, useEffect, useMemo, useState } from 'react'
import { useRouter } from '@/hooks/useRouter'
import { shortenAddress, validateInviteCode } from '@/utils'
import IconWithTooltip from '@/components/icon-tooltip'
import CopyButton from '@/components/button/copyButton'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import { useReferralStore } from '@/stores/referralStore'
import { useToast } from '@/hooks/useToast'
import { RESPONSE_CODE } from '@/config/constants'

const TikoInviteModal = lazy(() => import('@/components/referral/TikoInviteModal'))

export default function InviteCard({ code, ratio }: { code: string | undefined; ratio: number | undefined }) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3()
  const router = useRouter()
  const { toastError, toastSuccess } = useToast()
  const [inviteCode, setInviteCode] = useState('')
  const [myInvite, setMyInvite] = useState('')

  const inviteLink = useMemo(() => {
    return `${window.location.origin}/referral/${encodeURIComponent(myInvite)}`
  }, [myInvite])


  const bindCodeDialog = useShowDialog()
  const viewInviteDialog = useShowDialog()
  const inviteDialog = useShowDialog()

  useEffect(() => {
    if (router.params?.inviteCode) {
      if (validateInviteCode(router.params.inviteCode)) {
        setInviteCode(router.params.inviteCode)
      }
    }
  }, [router.params?.inviteCode])

  const isValidInviteCode = useMemo(() => {
    return validateInviteCode(inviteCode)
  }, [inviteCode])

  useEffect(() => {
    if (code) {
      setMyInvite(code)
    }
  }, [code])

  const relationship = useReferralStore(state => state.relationship)
  // 获取邀请关系
  const getRelationship = useReferralStore(state => state.getRelationship)
  const bindRelationship = useReferralStore(state => state.bindRelationship)

  useEffect(() => {
    if (account) {
      getRelationship()
    }
  }, [account, getRelationship])

  const [bindLoading, setBindLoading] = useState(false)

  return (
    <>
      {/* 右侧输入邀请码按钮 */}
      <div className="flex justify-center mb-8">
        <button className="flex gap-[8px] items-center rounded-[8px] px-[12px] transition-colors cursor-pointer group"
          onClick={() => {
            if (relationship?.referrer) {
              viewInviteDialog.show()
              return
            }
            bindCodeDialog.show()
          }}
        >
          {
            !relationship?.referrer && (
              <div className="relative size-[13px]">
                <LazyImage src="/images/referral/add_active.png" className="size-full" />
              </div>
            )
          }
          <p className="font-normal text-[14px] whitespace-nowrap text-white">
            { relationship?.referrer ? t("ref.t13") : t("ref.t12") }
          </p>
        </button>
      </div>
      
      <div className="w-full rounded-[16px] bg-[#1A1B1E] px-4 py-6 relative ">
        
        {/* top */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-normal text-white">
              {t("ref.t14")}
            </span>

            <IconWithTooltip
              tooltip={t("ref.t141")}
            >
              <div className="flex h-4 w-4 items-center justify-center ">
                <LazyImage src='/images/referral/info.png' className='w-4 h-4' />
              </div>
            </IconWithTooltip>
            
          </div>

          <div className="rounded-[8px] bg-[#080B12] px-[10px] h-[30px] flex items-center ">
            <span className="text-[14px] font-medium text-[#9BFF2E]">
              {ratio ? `${ratio}%` : '--'}
            </span>
          </div>
        </div>

        {/* line */}
        <div className="my-4 h-px w-full bg-[#282A2F]" />

        {/* content */}
        <div className="rounded-[6px] bg-[#131416] px-4">
          {/* invite code */}
          <div className="h-[52px] flex items-center justify-between gap-4">
            <span className="text-[14px] text-[#8D93A1] shrink-0">
              {t("ref.t15")}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[14px] text-white ">
                {myInvite || '--'}
              </span>

              <CopyButton copyText={myInvite} />
            </div>
          </div>

          {/* invite link */}
          <div className="h-[52px] flex items-center justify-between gap-4">
            <span className="text-[14px] text-[#8D93A1] shrink-0">
              {t("ref.t16")}
            </span>

            <div className="flex items-center gap-2">
              <span className="max-w-[140px] text-right truncate text-[14px] text-white inline-block">
                {myInvite ? inviteLink : '--'}
              </span>

              <CopyButton className='w-4 h-4' copyText={inviteLink} />
            </div>
          </div>
        </div>

        {/* button */}
        <Button
          className="
            mt-5
            h-[48px]
            w-full
            rounded-[8px]
            bg-[#98FF2F]
            text-[16px]
            font-semibold
            text-black
            hover:bg-[#8df028]
          "
          disabled={!myInvite}
          onClick={() => {
            inviteDialog.show()
          }}
        >
          {t("ref.t17")}
        </Button>
      </div>
    
      <DialogController
        className="p-0 bg-[#131416]"
        headerClassName="px-4 py-4 border-b border-[#232427] text-left"
        overlayClassName='z-[49]'
        title={t("ref.t12")}
        open={bindCodeDialog.open}
        openChange={flag => {
          bindCodeDialog.setOpen(flag)
          setBindLoading(false)
        }}
      >
        <div className='w-[90vw] max-w-[480px] p-6 pt-2 font-normal'>
          
          <div className='font-medium text-[16px] text-white'>
            {t("ref.t18")}
          </div>
          <KycInput placeholder={t("ref.t15")} 
            className='my-4 h-[42px] border-[#232427]'
            focusClassName='focus:border-[#232427]'
            value={inviteCode}
            regex='^[A-Za-z0-9]{0,10}$'
            onChange={(e) => {
              const inputRegex = RegExp('^[A-Za-z0-9]{0,10}$')
              if (inputRegex.test(e.target.value)) {
                setInviteCode(e.target.value)
              }
            }}
          />
          <div className='text-[#9DA3AF] text-[12px] font-normal mb-6'>
            * {t("ref.t19")}
          </div>
          <Button
            className="
              w-full
              text-[16px]
              font-semibold
              text-black 
            "
            loading={bindLoading}
            disabled={!isValidInviteCode || bindLoading}
            onClick={() => {
              setBindLoading(true)
              bindRelationship(inviteCode)
                .then(res => {
                  if (res.code === RESPONSE_CODE.SUCCESS) {
                    toastSuccess({title: t("ref.t33")})
                    bindCodeDialog.hide()
                    setTimeout(() => {
                      router.push('/referral')
                    }, 800)
                  } else {
                    toastError({title: res.message || "Error"})
                  }
                })
                .catch(() => {
                  toastError({title: "Error"})
                })
                .finally(() => {
                  setBindLoading(false)
                })
            }}
            
          >
            {t('Confirm')}
          </Button>
          
        </div>

      </DialogController>
      <DialogController
        className="p-0 bg-[#131416]"
        headerClassName="px-4 py-4 border-b border-[#232427] text-left"
        overlayClassName='z-[49]'
        title={t("ref.t13")}
        open={viewInviteDialog.open}
        openChange={viewInviteDialog.setOpen}
      >
        <div className='w-[90vw] max-w-[480px] p-6 pt-2 font-normal'>
          
          <div className='font-medium text-[16px] text-white mb-4'>
            {t("ref.t21")}
          </div>
          <div className='h-[42px] flex items-center justify-between gap-2 mb-6 bg-[#1A1B1E] rounded-[4px] px-4'>
            <span className='text-[#9CFF3A] text-[14px] font-medium'>{shortenAddress(relationship?.referrer || '')}</span>
            <CopyButton className='w-4 h-4' copyText={relationship?.referrer || ''} />
          </div>
          <Button
            className="
              w-full
              text-[16px]
              font-semibold
              text-black 
            "
            onClick={() => {
              viewInviteDialog.hide()
            }}
          >
            {t('Confirm')}
          </Button>
          
        </div>

      </DialogController>
      <TikoInviteModal open={inviteDialog.open} onClose={inviteDialog.hide} inviteCode={myInvite} qrCodeSrc={inviteLink} />
    </>
  )
}