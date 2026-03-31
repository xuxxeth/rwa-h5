'use client'
import { useTradeStore } from '@/stores/tradeStore'
import { cn } from '@/utils/tw'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { useTranslation } from './useTranslation'
import { openScanUrl } from '@/utils/scan'
import CloseX from '@/components/icons/set/CloseX'
import OpenOutline from '@/components/icons/set/OpenOutline'
import ToastSuccess from '@/components/icons/set/ToastSuccess'
import ToastError from '@/components/icons/set/ToastError'

interface CustomToastOptions {
  action: string // place | cancel
  approveed?: boolean
  duration?: number
  onClick?: () => void
}

interface ToastItemProps {
  t: string | number
  action: string // place | cancel
  approveed?: boolean
  onClick?: () => void
}

interface StepDef {
  step: number
  label: string
  labelIng: string
}

function StepIcon({ state }: { state: 'done' | 'active' | 'pending' | 'error' }) {
  if (state === 'done') {
    return (
      <div className='flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-green-100 bg-gray-850 p-2'>
        <ToastSuccess size={18} />
      </div>
    )
  }
  if (state === 'error') {
    return (
      <div className='flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-red-100 bg-gray-850 p-2'>
        <ToastError size={18} />
      </div>
    )
  }
  if (state === 'active') {
    return (
      <div className='flex h-[34px] w-[34px] animate-spin items-center justify-center rounded-[8px] bg-gray-850 p-2'
        style={{
          border: '1px solid transparent',
          backgroundImage: 'linear-gradient(#232427, #232427), conic-gradient(from 180deg, #F7AC19 50%, #282A2F 50%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      />
    )
  }
  // pending
  return (
    <div className='flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-gray-500 bg-gray-850 p-2' />
  )
}

export function TxToastItem({ t, action, approveed, onClick }: ToastItemProps) {
  const { t: $t } = useTranslation()

  const buyStepsList: StepDef[] = [
    { step: 0, label: $t('v2.tx.t1'), labelIng: $t('v2.tx.t2') },
    { step: 1, label: $t('v2.tx.t5'), labelIng: $t('v2.tx.t6') },
    { step: 2, label: $t('v2.tx.t71'), labelIng: $t('v2.tx.t71') },
  ]
  const sellStepsList: StepDef[] = [
    { step: 1, label: $t('v2.tx.t5'), labelIng: $t('v2.tx.t6') },
    { step: 2, label: $t('v2.tx.t71'), labelIng: $t('v2.tx.t71') },
  ]

  const stepsList =
    action === 'place' ? (approveed ? buyStepsList.slice(1) : buyStepsList) : sellStepsList

  const txStep = useTradeStore((state) => state.txStep)
  const currentStep = useMemo(
    () => stepsList.find((s) => s.step === txStep),
    [txStep, stepsList],
  )

  const txError = useTradeStore((state) => state.txError)
  const txSuccess = useTradeStore((state) => state.txSuccess)

  const successMsg = useMemo(() => {
    if (txStep > 2 && !txError) return action === 'place' ? $t('v2.tx.t72') : $t('v2.tx.t73')
  }, [txStep, action, txError, $t])

  const descText = txSuccess.msg
    ? txSuccess.msg
    : txError
      ? txError
      : successMsg
        ? successMsg
        : (currentStep?.labelIng ?? '')

  return (
    <div className='w-[375px] overflow-hidden rounded-[8px]'>
      {/* Header */}
      <div className='flex items-center justify-between gap-1.5 border border-gray-750 bg-gray-800 px-3 py-1.5'>
        <span className='text-[12px] font-medium text-white'>
          {$t('v2.tx.t71')}
        </span>
        <button
          className={'text-white'}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            toast.dismiss(t)
            onClick?.()
          }}
        >
          <CloseX size={16} />
        </button>
      </div>

      {/* Body */}
      <div className='relative border border-t-0 border-gray-750 bg-gray-850 p-3'>
        {/* Steps row */}
        <div className='flex w-full items-center justify-between'>
          {stepsList.map((step, index) => {
            const state: 'done' | 'active' | 'pending' | 'error' =
              txStep > step.step
                ? 'done'
                : txStep === step.step
                  ? txError
                    ? 'error'
                    : 'active'
                  : 'pending'

            return (
              <div key={step.step} className='flex flex-1 items-center'>
                <StepIcon state={state} />
                {index < stepsList.length - 1 && (
                  <div className='mx-2 h-[1px] flex-1'>
                    <div
                      className={cn(
                        'h-full w-full transition-colors duration-300',
                        txStep > step.step ? 'bg-green-100' : 'bg-gray-500',
                      )}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {/* Step labels */}
        <div className='mt-2 flex w-full items-center justify-between'>
          {stepsList.map((step, index) => (
            <div
              key={step.step}
              className={cn(
                'flex-1 text-[12px] font-medium leading-[1.25em]',
                txStep > step.step ? 'text-white' : txStep === step.step ? 'text-white' : 'text-gray-400',
                index === 0 ? 'text-left' : index === stepsList.length - 1 ? 'text-right' : 'text-center',
              )}
            >
              {step.label}
            </div>
          ))}
        </div>

        {/* Description */}
        <div className='mt-2 flex items-center justify-between border-t border-gray-750 pt-2 text-[12px] font-normal'>
          <span className='text-gray-400'>{descText}</span>
          {txSuccess.tx && (
            <button
              className='inline-flex items-center gap-1 text-[12px] font-medium text-blue-50'
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                openScanUrl(txSuccess.tx)
              }}
            >
              {$t('v2.tx.t0')}
              <OpenOutline size={14} color='#009DFF' />
            </button>
          )}
        </div>

        {/* 底部背景条 */}
        <div className='absolute bottom-0 left-0 right-0 h-[3px] rounded-[10px] bg-gray-700' />
        {/* 进度条 */}
        <div className='absolute bottom-0 left-0 h-[3px] bg-green-100 transition-all duration-300'
          style={{ width: `${Math.min(((txStep - stepsList[0].step) / stepsList.length) * 100, 100)}%` }}
        />
      </div>
    </div>
  )
}

let currentToastId: string | number | undefined

export function getCurrentToastId() {
  return currentToastId
}

export function setCurrentToastId(id?: string | number) {
  currentToastId = id
}

export function useTxToast() {
  function toastFun({ duration, action, approveed, onClick }: CustomToastOptions) {
    toast.custom(
      (t) => {
        setCurrentToastId(t)
        return (
          <TxToastItem t={t} action={action} approveed={approveed} onClick={onClick} />
        )
      },
      { duration: duration || 120000 },
    )
  }


  function toastTxSteps(data: CustomToastOptions) {
    toastFun({ ...data })
  }
  function dismissTxToast() {
    if (getCurrentToastId()) {
      toast.dismiss(getCurrentToastId())
      setCurrentToastId(undefined)
    }
  }

  return { toastTxSteps, dismissTxToast }
}
