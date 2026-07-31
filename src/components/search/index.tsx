import { useRef, useState, type ChangeEvent, type FocusEvent, type MouseEvent } from "react"
import { LazyImage } from "../image/LazyImage"
import { Input } from "../ui/input"
import { useTranslation } from "@/hooks/useTranslation"
import { cn } from "@/utils/tw"
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock"
import { HistoryItem, SearchContent, type SearchContentRef } from "./SearchContent"

function SearchInput(props: {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void 
}) {
  const { t } = useTranslation()
  const { lock, unlock } = useBodyScrollLock()
  const [searchTerm, setSearchTerm] = useState("")
  const [focus, setFocus] = useState(false)
  const [listTop, setListTop] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const [listHeight, setListHeight] = useState(0)

  const searchRef = useRef<HTMLDivElement>(null)
  const searchContentRef = useRef<SearchContentRef>(null)

  const onFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFocus(true)
    lock()
    if (searchRef.current) {
      const searchRect = searchRef.current.getBoundingClientRect()
      const top = searchRect.top + searchRect.height
      const bodyHeight = document.body.clientHeight
      setListTop(top)
      setContentHeight(bodyHeight - top)
      setListHeight(bodyHeight - top - 50)

      searchContentRef.current?.handleGetHistory()
    }
  }
  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    // setFocus(false)
  }

  const onCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setSearchTerm('')
    searchContentRef.current?.resetSearch()
    setFocus(false)
    unlock()
  }

  return (
    <>
      <div ref={searchRef} className="flex items-center justify-between gap-x-3">
        <div className={cn(
          "bg-[#1A1B1E] rounded-[4px] overflow-hidden flex items-center px-2 h-[42px] border border-[#1A1B1E] flex-1",
          focus ? "border-[rgba(156,255,58,0.5)]" : ""
        )}>
          <LazyImage src="/images/v2/icons/search.png" className="w-[14px] " />
          <Input className="pl-1 h-[40px] placeholder:text-[#737A87] text-[14px] text-white font-normal " placeholder={t('v2.tx.t36')}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              // props.onChange(e)
              searchContentRef.current?.handleSearchChange(e.target.value)
            }}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
        {
          focus && <button className="text-[14px] font-medium text-[#9CFF3A]" onClick={onCancel} >取消</button>
        }
      </div>
      
      <SearchContent
        ref={searchContentRef}
        show={focus}
        top={listTop}
        height={contentHeight}
        listHeight={listHeight}
      />
      
    </>
  )
}

export { SearchInput }