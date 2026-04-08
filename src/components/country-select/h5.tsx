

import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { memo, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { kycApi } from "@/service/kyc/api";
import { RESPONSE_CODE } from "@/config/constants";
import type { ISupportedCountry } from "@/service/kyc/types";
import { useTranslation } from "@/hooks/useTranslation";
import { LazyImage } from "../image/LazyImage";
import { H5Dialog } from "../dialog/H5Dialog";

export type ICountryCode = {
  code: string,
  icon: string,
  en: string,
  cn: string
}

export type CountrySelectProps = {
  defaultValue?: string;
  value?: string;
  onChange?: (code: ISupportedCountry) => void;
  className?: string
  placeHolder?: string
}


const CountrySelectH5 = memo(
  ({
    defaultValue,
    value, 
    onChange, 
    className,
    placeHolder
  }: CountrySelectProps) => {
    const { t, i18n } = useTranslation()
    const [countryList, setCountryList] = useState<ISupportedCountry[]>([])
    const [currentCode, setCurrentCode] = useState('')
    const [currentCountry, setCurrentCountry] = useState<ISupportedCountry>({code: '', zhName: '', enName: ''})
    const [open, setOpen] = useState(false)
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
      if (defaultValue && countryList.length > 0) {
        setCurrentCode(defaultValue)
        const _country = countryList.find(country => country.code === defaultValue) || countryList[0]
        if (_country) {
          setCurrentCountry(_country)
          onChange && onChange(_country)
          if (!defaultValue) {
            setCurrentCode(_country.code)
          }
        }
      }
    }, [defaultValue, countryList.length]) 

    const fetchedRef = useRef(false)
    useEffect(() => {
      if (fetchedRef.current) return
      fetchedRef.current = true
      kycApi.getSupportedCountries()
        .then(res => {
          if (res.code === RESPONSE_CODE.SUCCESS) {
            const _list = (res.data || []).sort((a, b) => {
              return i18n.language === 'en' ? a.enName.localeCompare(b.enName, undefined, { sensitivity: 'base' }) : a.zhName.localeCompare(b.zhName, undefined, { sensitivity: 'base' });
            });
            setCountryList(_list)
            if (_list[0]) {
              setCurrentCode(_list[0].code)
              setCurrentCountry(_list[0])
            }
          }
        })
    }, [i18n])

    return (
      <H5Dialog
        onOpenChange={open => {
          setOpen(open)
        }}
        title={placeHolder}
        trigger={
          <div 
            className={cn(
              "px-3 py-0 h-[38px] shadow-none flex items-center justify-between rounded-[4px] bg-[#1A1B1E] border border-solid border-[rgba(255,255,255,0)]",
              className,
              open ? 'border-[#ffffff]' : ''
            )}
          >
            <div className="flex items-center gap-2 w-full text-white">
              {currentCode ? (
                <div className=" flex items-center gap-x-2 w-full">
                  
                  <span className=" font-normal text-[14px]">{i18n.language === 'en' ? currentCountry.enName : currentCountry.zhName}</span>
                </div>
              ) : (
                <span className="md:text-[14px] text-5">{placeHolder || 'Please select'} </span>
              )}
            </div>
            <img src="/images/v2/icons/arrow-down.png" className={cn(
              "w-[16px]",
              open ? " rotate-180" : ""
            )} />
          </div>
        }
      >
        <div className="border-none p-0">
          <div className="sticky top-0 z-50 py-3 px-6">
            <div className=" relative">
              <LazyImage src="/images/v2/icons/search.png" className="w-3 h-3 absolute left-2 top-[13px]" />
              <input 
                type="text"
                placeholder={t('kyc.t4')}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="text-[14px] w-full px-3 pl-6 py-2 rounded-[6px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0)] text-white placeholder-[#9DA3AF] focus:outline-none focus:border-white"
              />
            </div>
            
          </div>
          <div
            data-vaul-no-drag
            className="h-[60vh] overflow-y-auto overscroll-contain px-6"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {countryList
              .filter(ct1 => i18n.language === 'en' ? ct1.enName.toLowerCase().includes(searchText.toLowerCase()) : ct1.zhName.toLowerCase().includes(searchText.toLowerCase())
                
              )
              .map(ct2 => (
                <button
                  type="button"
                  key={ct2.code}
                  data-vaul-no-drag
                  className="data-[highlighted]:bg-[#1D1D1D] relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 h-[34px]"
                  onClick={() => {
                    setCurrentCode(ct2.code)
                    setCurrentCountry(ct2)
                    onChange?.(ct2)
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault()
                    setCurrentCode(ct2.code)
                    setCurrentCountry(ct2)
                    onChange?.(ct2)
                  }}
                >
                  <div className="flex items-center justify-between w-full gap-2 text-white text-[16px]">
                    <div className=" flex items-center gap-x-2">
                      <span>{i18n.language === 'en' ? ct2.enName : ct2.zhName}</span>
                    </div>
                    <span
                      className="ml-auto data-[state=checked]:block hidden text-[#9CFF3A]"
                      data-state={ct2.code === currentCode ? 'checked' : ''}
                    >
                      <Check className="h-4 w-4 text-[#009DFF]" />
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>
        
      </H5Dialog>
    )
    
  }
)

export { CountrySelectH5 }

