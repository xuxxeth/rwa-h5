import { CountrySelect } from '@/components/country-select'
import { DatePicker, FormatStr } from '@/components/date-range-picker'
import { DoctypeSelect } from '@/components/doctype-select'
import { LazyImage } from '@/components/image/LazyImage'
import { KycInput } from '@/components/input/KycInput'
import { Select } from '@/components/select'
import { Button } from '@/components/ui/button'
import { usePersistentForm } from '@/hooks/usePersistentForm'
import { useTranslation } from '@/hooks/useTranslation'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Upload } from './Upload'
import { cn } from '@/utils/tw'
import { EmploymentSelect } from '@/components/employment-select'
import { IncomeSelect } from '@/components/income-select'
import { format } from 'date-fns/format'
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
import { parseISO } from 'date-fns'
import {
  Text,
} from './Upload/shared'
import { FormItemBox, FormItemLabel, InputBox, retryRefresh, SectionBox, SectionTitle } from './BaseInfo'


export const calcYearDate = function () {
  const now = new Date()

  // 计算最小日期（65岁 —— 最早生日）
  const minDate = new Date(now.getFullYear() - 65, now.getMonth(), now.getDate()).getTime()

  // 计算最大日期（18岁 —— 最晚生日）
  const maxDate = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate() - 1).getTime()

  return {
    minDate,
    maxDate,
    defaultDate: maxDate,
  }
}

interface FormData {
  // 基础信息
  firstName: string
  lastName: string
  fullName: string
  gendar: number // 0女，1男
  dob: string // 出生日期
  email: string
  // 证件信息
  type: number // 0身份证, 1护照
  issueCountry: string
  no: string
  residentAddress: string
  useCertificateAddress?: boolean // 是否使用证件地址
  // 工作信息
  employment: number // 就业情况
  description: string // 就业 时 必填
  // 收信息
  source: number
  approvedProtocols: string[]
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
    const [dateOptions, setDateOptions] = useState({
      minDate: 0,
      maxDate: 0,
      defaultDate: 0,
    })
    const genderList = [
      { value: '1', label: t('gender.male') },
      { value: '0', label: t('gender.female') },
    ]
    const {
      register,
      handleSubmit,
      watch,
      setValue,
      reset,
      clear,
      formState: { errors },
    } = usePersistentForm<FormData>('kycImageInfo', {
      firstName: userInfo?.basicInfo.firstName,
      lastName: '',
      fullName: '',
      gendar: 1,
      email: '',
      type: 1,
      employment: 1,
      source: 1,
      issueCountry: 'CHN',
      residentAddress: '',
      useCertificateAddress: false,
      description: '',
      approvedProtocols: [],
      idCardFront: '',
      idCardBack: '',
      idCard: '',
      passport: '',
      addressCertification: '',
      incomeCertifications: [],
    })
    const firstName = watch('firstName')
    const lastName = watch('lastName')
    const fullName = watch('fullName')
    const email = watch('email')
    const no = watch('no')
    const type = watch('type')
    const issueCountry = watch('issueCountry')
    const gendar = watch('gendar')
    const dob = watch('dob')
    const useCertificateAddress = watch('useCertificateAddress')
    const residentAddress = watch('residentAddress')
    const employment = watch('employment')
    const description = watch('description')
    const idCardFront = watch('idCardFront')
    const idCardBack = watch('idCardBack')
    const idCard = watch('idCard')
    const passport = watch('passport')
    const addressCertification = watch('addressCertification')
    const incomeCertifications = watch('incomeCertifications')

    const source = watch('source')

    const preAccount = useRef<string | undefined>(undefined)

    const [submiting, setSubmiting] = useState(false)

    const onSubmit = async (data: FormData) => {
      if (type === 0) {
        // 身份证，正反面都要传
        if (!data.idCardFront) {
          toastError({ title: t('kyc.t56') })
          return
        }
        if (!data.idCardBack) {
          toastError({ title: t('kyc.t57') })
          return
        }
        if (!data.idCard) {
          toastError({ title: t('kyc.t59') })
          return
        }
      }
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
      // 这里要再次判断一下dob，防止用户修改系统时间绕过前端校验
      const dobDate = parseISO(data.dob).getTime()
      if (dobDate < dateOptions.minDate || dobDate > dateOptions.maxDate) { 
        toastError({ title: t('kyc.t67') })
        return
      }

      const params: IKycSubmitData = {
        type: 1,
        basicInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: data.fullName,
          gender: data.gendar,
          dob: data.dob,
          email: data.email,
        },
        idInfo: {
          type: data.type,
          issueCountry: data.issueCountry,
          no: data.no,
          residentAddress: data.useCertificateAddress ? '' : data.residentAddress,
          useCertificateAddress: data.useCertificateAddress,
          files: {
            idCardFront: data.type === 0 ? data.idCardFront || '' : '',
            idCardBack: data.type === 0 ? data.idCardBack || '' : '',
            idCard: data.type === 0 ? data.idCard || '' : '',
            passport: data.type === 0 ? '' : data.passport || '',
            addressCertification: data.addressCertification || '',
          },
        },
        workInfo: {
          employment: data.employment,
          description: data.employment === 4 ? data.description : '',
        },
        incomeInfo: {
          source: data.source || 1,
        },
        extraInfo: {
          incomeCertifications: (data.incomeCertifications || []).filter(key => key),
        },
        // approvedProtocols: [
        //   "AML-Policy-v3.0",
        //   "Privacy-Agreement-v2.1"
        // ]
      }
      console.log(params)

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
    }
    const dobRef = useRef(dob)
    const dobInitRef = useRef(false)

    useEffect(() => {
      dobRef.current = dob // 每次更新时同步
    }, [dob])
    useEffect(() => {
      const dateOptions = calcYearDate()
      setDateOptions(dateOptions)
      if (!dobInitRef.current) {
        dobInitRef.current = true
        setTimeout(() => {
          setValue('dob', dobRef.current || format(dateOptions.maxDate, FormatStr))
        }, 500)
      }
    }, [dob])

    useEffect(() => {
      if (userInfo && userInfo.basicInfo.firstName) {
        reset({
          ...userInfo.basicInfo,
          ...userInfo.idInfo,
          ...userInfo.workInfo,
          ...userInfo.incomeInfo,
          ...userInfo.extraInfo,
          ...userInfo.idInfo.files,
          gendar: userInfo.basicInfo.gender,
        })
      }
    }, [userInfo])

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
          <SectionBox className='pb-5'>
            <div className=' flex items-center mb-5'>
              <SectionTitle>{t('identity.upload.uploadId')}</SectionTitle>
              <span className='text-[#CA3F64] ml-1 flex items-center'>*</span>
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
          <SectionBox className='pb-5'>
            {/* 上传地址证明 */}
            <div className=' flex items-center mb-5'>
              <SectionTitle>{t('identity.upload.uploadAddr')}</SectionTitle>
              {
                !useCertificateAddress && <span className='text-[#CA3F64] ml-1 flex items-center'>*</span>
              }
              
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
            <SectionTitle>{t('kyc.t19')}</SectionTitle>
            
            <div className="my-5">
              <Text text='uploadIncome' className=' text-[#9DA3AF]' />
              <Text text='extraTips' className='text-sm mt-2' />
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
