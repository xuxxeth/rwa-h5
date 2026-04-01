import { Button } from '@/components/ui/button'
import { usePersistentForm } from '@/hooks/usePersistentForm'
import { useTranslation } from '@/hooks/useTranslation'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Upload } from './Upload'

import storage from '@/utils/storage'
import { KYC_UPLOAD_STORAGE_KEY } from './Upload/shared'
import { useToast } from '@/hooks/useToast'
import { kycApi } from '@/service/kyc/api'
import type { IKycDetail, IKycSubmitData } from '@/service/kyc/types'
import { RESPONSE_CODE } from '@/config/constants'
import type { ApiResponse } from '@/service/client'
import { WarningInfo } from './WarningInfo'
import { useActiveWeb3 } from '@/hooks/useActiveWe3'
import useDebouncedUnmount from '@/hooks/useDebouncedUnmount'
import {
  Text,
} from './Upload/shared'
import { retryRefresh, SectionBox, SectionTitle, type BaseInfoFormData } from './BaseInfo'
import { H5Dialog } from '@/components/dialog/H5Dialog'

export const TitleWithTip = ({
  title,
  tip,
  required = true
}: {
  title: string
  tip?: string | React.ReactNode
  required?: boolean
}) => {
  return (
    <H5Dialog 
      trigger={
        <div className=' flex items-center gap-x-1'>
          {
            required && <span className='text-[#CA3F64] flex items-center'>*</span>
          }
          
          <SectionTitle>{title}</SectionTitle>
          <img src="/images/h5/icons/info.png" className='w-[14px] h-[14px]' alt="" />
        </div>
      }
      title={title}
    >
      <div className='px-6 py-5 text-[16px] font-normal'>
        {tip}
      </div>
    </H5Dialog>
  )
}

interface FormData {
  
  idCardFront?: string
  idCardBack?: string
  idCard?: string
  passport?: string
  addressCertification?: string
  incomeCertifications?: string[]
}

const ImageInfo = memo(
  ({
    rejectReason,
    userInfo,
    refresh,
    onResetRetry,
  }: {
    rejectReason?: string
    userInfo?: IKycSubmitData
    refresh?: () => Promise<ApiResponse<IKycDetail>>
    onResetRetry?: () => void
  }) => {
    const { t } = useTranslation()
    const { account } = useActiveWeb3()
    const { toastSuccess, toastError } = useToast()
    const {
      register,
      handleSubmit,
      watch,
      setValue,
      reset,
      clear,
      formState: { errors },
    } = usePersistentForm<FormData>('kycImageInfo', {
      
      idCardFront: '',
      idCardBack: '',
      idCard: '',
      passport: '',
      addressCertification: '',
      incomeCertifications: [],
    })
    const {
      watch: baseWatch,
    } = usePersistentForm<BaseInfoFormData>('kycBaseInfo', {
      
    })
    const firstName = baseWatch('firstName')
    const lastName = baseWatch('lastName')
    const fullName = baseWatch('fullName')
    const email = baseWatch('email')
    const no = baseWatch('no')
    const type = baseWatch('type')
    const issueCountry = baseWatch('issueCountry')
    const gendar = baseWatch('gendar')
    const dob = baseWatch('dob')
    const useCertificateAddress = baseWatch('useCertificateAddress')
    const residentAddress = baseWatch('residentAddress')
    const employment = baseWatch('employment')
    const description = baseWatch('description')
    const idCardFront = watch('idCardFront')
    const idCardBack = watch('idCardBack')
    const idCard = watch('idCard')
    const passport = watch('passport')
    const addressCertification = watch('addressCertification')
    const incomeCertifications = watch('incomeCertifications')

    const source = baseWatch('source')

    const preAccount = useRef<string | undefined>(undefined)

    const [submiting, setSubmiting] = useState(false)

    const onSubmit = useCallback(async (data: FormData) => {
      // if (type === 0) {
      //   // 身份证，正反面都要传
      //   if (!data.idCardFront) {
      //     toastError({ title: t('kyc.t56') })
      //     return
      //   }
      //   if (!data.idCardBack) {
      //     toastError({ title: t('kyc.t57') })
      //     return
      //   }
      //   if (!data.idCard) {
      //     toastError({ title: t('kyc.t59') })
      //     return
      //   }
      // }
      if (type === 1) {
        // 只判断护照
        if (!data.passport) {
          toastError({ title: t('kyc.t58') })
          return
        }
      }
      // 无地址证明
      if (!useCertificateAddress && !data.addressCertification) {
        toastError({ title: t('kyc.t61') })
        return
      }

      const params: IKycSubmitData = {
        type: 1,
        basicInfo: {
          firstName: firstName,
          lastName: lastName,
          fullName: fullName,
          gender:  gendar,
          dob: dob,
          email: email,
        },
        idInfo: {
          type: type,
          issueCountry: issueCountry,
          no: no,
          residentAddress: useCertificateAddress ? '' : residentAddress,
          useCertificateAddress: useCertificateAddress,
          files: {
            idCardFront: type === 0 ? data.idCardFront || '' : '',
            idCardBack: type === 0 ? data.idCardBack || '' : '',
            idCard: type === 0 ? data.idCard || '' : '',
            passport: type === 0 ? '' : data.passport || '',
            addressCertification: data.addressCertification || '',
          },
        },
        workInfo: {
          employment: employment ,
          description: employment === 4 ? description : '',
        },
        incomeInfo: {
          source: source || 1,
        },
        extraInfo: {
          incomeCertifications: (data.incomeCertifications || []).filter(key => key),
        },
        // approvedProtocols: [
        //   "AML-Policy-v3.0",
        //   "Privacy-Agreement-v2.1"
        // ]
      }

      if (submiting) return
      setSubmiting(true)
      const res = await kycApi.submitKyc(params)

      if (res?.code === RESPONSE_CODE.SUCCESS) {
        if (refresh) {
          const detailRes = await retryRefresh(refresh)
          setSubmiting(false)
          
          if (detailRes.code === RESPONSE_CODE.SUCCESS && detailRes.data?.overallStatus) {
            // toastSuccess({ title: '提交成功' })
            clear()
          }
        } else {
          // toastSuccess({ title: '提交成功' })
          clear()
          setSubmiting(false)
        }
      } else {
        toastError({ title: res?.message || 'Error' })
        setSubmiting(false)
      }
    }, [
      firstName,
      lastName,
      fullName,
      gendar,
      dob,
      email,
      type,
      issueCountry,
      no,
      residentAddress,
      description,
      source,
      employment,
      useCertificateAddress
    ])
    useEffect(() => {
      if (account && preAccount.current && account !== preAccount.current) {
        clear()
        storage.removeItem(KYC_UPLOAD_STORAGE_KEY)
        storage.removeItem('kycImageInfo')
      }
      preAccount.current = account
    }, [account])

    // 组件卸载时重置重试状态，使用防抖避免 StrictMode 下的重复执行
    useDebouncedUnmount(onResetRetry)

    return (
      <>
        {rejectReason && <WarningInfo text={rejectReason} />}
        <form onSubmit={handleSubmit(onSubmit)} className='w-full mt-2'>
          <SectionBox className='px-6 py-5 mb-0'>
            <div className='mb-4'>
              <TitleWithTip title={t('identity.upload.uploadId')} tip={t('identity.upload.passportTips')} />
            </div>

            {/* 上传证件 */}
            <Upload
              type={'passport'}
              keys={type === 1 ? passport : [idCardFront || '', idCardBack || '', idCard || '']}

              onChanged={keys => {
                setValue('passport', keys as string)
                // if (type === 1) {
                //   setValue('passport', keys as string)
                // } else {
                //   setValue('idCardFront', keys[0])
                //   setValue('idCardBack', keys[1])
                //   setValue('idCard', keys[2])
                // }
              }}
            />
          </SectionBox>
          <SectionBox className='px-6 py-5 mb-0'>
            {/* 上传地址证明 */}
            <div className=' flex items-center mb-4'>
              <div>
                <TitleWithTip title={t('identity.upload.uploadAddr')} tip={
                  <div>
                    <Text text='validAddrInc' className='mb-1 text-white text-[16px]' />
                    <ul className='list-disc pl-3.5'>
                      {['addr2', 'addr3', 'addr4', 'addr5', 'addr6', 'addr7'].map(item => (
                        <li key={item}>
                          <Text text={item} className='text-[16px] text-white' />
                        </li>
                      ))}
                    </ul>
                    <Text text='addrEnsure' className='text-white text-[16px] mb-1 mt-2' />
                    <ul className='list-disc pl-3.5'>
                      {['ensure1', 'ensure2', 'ensure3', 'ensure4', 'ensure5'].map(item => (
                        <li key={item}>
                          <Text text={item} className='text-[16px] text-white' />
                        </li>
                      ))}
                    </ul>
                    <Text text='addrNote' className='text-white text-[16px] mb-1 mt-2' />
                    <ul className='list-disc pl-3.5'>
                      {['note1', 'note2'].map(item => (
                        <li key={item}>
                          <Text text={item} className='text-[16px] text-white' />
                        </li>
                      ))}
                    </ul>
                  </div>
                } />
              </div>
            </div>
            <Upload
              type='address'
              keys={addressCertification}
              onChanged={keys => {
                setValue('addressCertification', keys as string)
              }}
            />
          </SectionBox>
          <SectionBox>
            <div className='mb-5'>
              <TitleWithTip title={t('identity.upload.uploadIncome')} tip={t('identity.upload.extraTips')} required={false} />
            </div>
            
            <Upload
              type='extra'
              keys={incomeCertifications}
              onChanged={keys => {
                // const _keys = (keys as string[]).filter(key => key)
                setValue('incomeCertifications', keys as string[])
              }}
            />
            <div className='h-2'></div>
          </SectionBox>
          <div className='flex items-center text-base text-[#909090] py-3 px-6'>
            <span className='text-[#CA3F64] mr-1 flex items-center'>*</span>
            {t('kyc.t20')}
          </div>
          {/* <div className='mt-8 flex gap-x-2 items-start'>
            <div className=' shrink-0 relative top-[2px]'>
              <CheckBox />
            </div>
            <div className='text-[rgba(255,255,255,0.6)] text-[16px]'>
              {t('identity.aggree1')}
              <a href='' target='_blank' className='text-[rgba(26,133,255,1)]'>
                {t('identity.aggree3')}
              </a>
              {t('identity.aggree2')}
            </div>
          </div> */}
          <div className='flex justify-center mt-8 px-6'>
            <Button
              disabled={submiting}
              loading={submiting}
              type='submit'
              className='bg-white text-black w-full lg:w-[400px] rounded-[8px]'
            >
              {t('identity.continue')}
            </Button>
          </div>
        </form>
      </>
    )
  }
)

export { ImageInfo }
