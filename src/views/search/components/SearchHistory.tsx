import { LazyImage } from "@/components/image/LazyImage";

function HistoryItem() {
  return (
    <div className="flex gap-x-1 items-center px-3 h-[32px] bg-[#1A1B1E] rounded-[6px]">
      <div className="w-[16px] h-[16px]">
        <LazyImage src="/images/tokens/AAPL.png" className="w-[16px] h-[16px] rounded-full" />
      </div>
      <span className="text-[#C7CCD6] text-[12px] font-medium">AAPLc</span>
    </div>
  )
}

function SearchHistory() {

  return (
    <div className="px-4">
      <div className="flex items-center justify-between">
        <span className="text-[#FFFFFF] text-[16px] font-semibold">搜索历史</span>
        <button>
          <LazyImage src="/images/h5/icons/delete2.png" className="w-[14px]" />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-1">
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
        <HistoryItem />
      </div>
    </div>
  )
}

export { SearchHistory }