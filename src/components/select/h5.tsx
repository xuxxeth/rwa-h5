

import { cn } from "@/lib/utils";
import { memo, useEffect, useState } from "react";
import { H5Dialog } from "../dialog/H5Dialog";
import { Check } from "lucide-react";
import { H5DialogIOS } from "../dialog/H5DialogIOS";

export type ItemProps = {
  value: string,
  label: string
}

export type SelectProps = {
  defaultValue?: string;
  value?: string;
  data?: ItemProps[];
  placeholder?: string
  onChange?: (item: ItemProps) => void;
  className?: string;
  activeColor?: string
}

const SelectH5 = memo(
  ({
    defaultValue,
    value, 
    data = [],
    placeholder,
    onChange, 
    className,
    activeColor
  }: SelectProps) => {
    const [curretnValue, setCurrentValue] = useState('')
    const [currentItem, setCurrentItem] = useState<ItemProps | null>(null)
    const [open, setOpen] = useState(false)

    const handleSelect = (item: ItemProps) => {
      setCurrentValue(item.value)
      setCurrentItem(item)
      onChange?.(item)
    }
    
    useEffect(() => {
      if (defaultValue) {
        setCurrentValue(defaultValue)
        const _current = data.find(item => item.value === defaultValue)
        if (_current) {
          setCurrentItem(_current)
        }
      }
    }, [defaultValue, data]) 

    return (
      <H5DialogIOS 
        onOpenChange={open => {
          setOpen(open)
        }}
        title={placeholder}
        trigger={
          <div 
            className={cn(
              "px-3 py-0 h-[38px] shadow-none flex items-center justify-between rounded-[4px] bg-[#1A1B1E] border border-solid border-[rgba(255,255,255,0)]",
              className,
              open ? 'border-[rgba(156,255,58,0.5)]' : ''
            )}
            style={{borderColor: open ? activeColor ? activeColor : '' : ''}}
          >
            <div className="flex items-center gap-2 w-[280px] text-white">
              {currentItem ? (
                <span className=" font-normal text-[14px]">{currentItem?.label}</span>
              ) : (
                <span className="text-[14px] text-5 text-[rgba(255,255,255,0.3)]">{placeholder ?? ''}</span>
              )}
            </div>
            <img src="/images/v2/icons/arrow-down.png" className={cn(
              "w-[16px]",
              open ? " rotate-180" : ""
            )} />
          </div>
        }
      >
        <div className="px-6 pt-3">
          {data.map(item => (
            <button
              type="button"
              key={item.value}
              data-vaul-no-drag
              className="data-[highlighted]:bg-[#1D1D1D] relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 h-[34px] font-normal"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                handleSelect(item)
              } }
              onTouchEnd={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleSelect(item)
              }}
            >
              <div className="flex items-center justify-between gap-2 text-white text-[14px] w-full font-normal">
                <span>{item.label}</span>
                
                <span
                  className="ml-auto data-[state=checked]:block hidden text-[#9CFF3A]"
                  data-state={item.value === curretnValue ? 'checked' : ''}
                >
                  <Check className="h-4 w-4 text-[#009DFF]" />
                </span>
              </div>
              
            </button>
          ))}
        </div>
      </H5DialogIOS>
    )
    
  }
)

export { SelectH5 }




