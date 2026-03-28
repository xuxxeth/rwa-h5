

import { Select as SelectCom, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { memo, useEffect, useState } from "react";
import { H5Dialog } from "../dialog/H5Dialog";
import { Check } from "lucide-react";

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
      <H5Dialog 
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
            <div className="flex items-center gap-2 w-[70px] text-white">
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
            <div key={item.value} className="data-[highlighted]:bg-[#1D1D1D] relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 h-[34px]"
              onClick={() => {
                setCurrentValue(item.value)
                setCurrentItem(item)
                onChange && onChange(item)
              }}
            >
              <div className="flex items-center justify-between gap-2 text-white text-[14px] w-full">
                <span>{item.label}</span>
                
                <span
                  className="ml-auto data-[state=checked]:block hidden text-[#9CFF3A]"
                  data-state={item.value === curretnValue ? 'checked' : ''}
                >
                  <Check className="h-4 w-4 text-[#009DFF]" />
                </span>
              </div>
              
            </div>
          ))}
        </div>
      </H5Dialog>
    )
    
  }
)

export { SelectH5 }





