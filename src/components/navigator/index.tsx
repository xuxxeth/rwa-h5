import { memo } from "react";
import { LazyImage } from "../image/LazyImage";

const NavigatorH5 = memo(
  ({
    title,
    showBack = true,
    onBack
  }: {
    title: string | React.ReactNode,
    showBack?: boolean
    onBack?: () => void
  }) => {
    return (
      <div className=" text-white text-[18px] h-[56px] flex items-center pl-4 pr-10">
        <div className=" shrink-0 w-6 h-6"
          onClick={() => onBack?.()}
        >
          {
            showBack && <LazyImage src="/images/icons/back.png" className="w-6 h-6" />
          }
          
        </div>
        <div className=" w-full flex justify-center">{title}</div>
      </div>
    )
  }
)

export { NavigatorH5 }

