import IconWithTooltip from "@/components/icon-tooltip"
import { LazyImage } from "@/components/image/LazyImage"
import { BackButton } from "@/components/menu/BackButton"
import type { IRwa } from "@/service/base/types"
import { memo } from "react"

export const StockInfo = memo(
  ({inputToken}: {inputToken?: IRwa | null}) => {
    return (
      <div className='flex items-center gap-2 px-4 '>
        <BackButton />
        <div className='w-6 h-6'>
          {inputToken?.icon && <LazyImage src={inputToken?.icon} className="w-6 h-6 rounded-full" />}
        </div>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-1 text-[18px] font-bold leading-none'>
            <span>{inputToken?.symbol || '--'}</span>
            <LazyImage src='/images/v0.4/arrow-down.png' className='w-[9px]' />
          </div>
          <div className='mt-1 text-[12px] text-[#9DA3AF] max-w-[60px] truncate'>{inputToken?.name || '--'}</div>
        </div>

        <button className=''>
          <LazyImage src='/images/v2/icons/collect.png' className='w-4 h-4' />
        </button>
      </div>
      // <div className="flex items-center">
      //   <div className="w-[40px] h-[40px]">
      //     {
      //       inputToken?.icon && <LazyImage src={inputToken?.icon} className="w-[40px] h-[40px] rounded-full" />
      //     }
      //   </div>
      //   <div className="ml-2 mr-1 ">
      //     <div className="flex items-baseline gap-x-1">
      //       <div className="text-[18px] font-medium text-white">{inputToken?.symbol || '--'}</div>
      //     </div>
      //     <IconWithTooltip triggerClassName=" justify-start" tooltip={inputToken?.name ?? ' '}>
      //       <div className=" text-[12px] font-normal text-[#9DA3AF] max-w-[60px] truncate">{inputToken?.name || '--'}</div>
      //     </IconWithTooltip>
      //   </div>
      // </div>
    )
  }
)