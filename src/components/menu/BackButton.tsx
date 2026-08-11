import { PAGE_FROM } from "@/config/constants"
import { useRouter } from "@/hooks/useRouter"
import type { IRwa } from "@/service/base/types"
import storage from "@/utils/storage"
import { useEffect, useRef } from "react"


export function BackButton({ rwa }: { rwa?: IRwa | null }) {
  const router = useRouter()
  const backTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (backTimerRef.current) {
        window.clearTimeout(backTimerRef.current)
      }
    }
  }, [])

  return (
    <button className='flex h-[34px] w-[30] items-center active:scale-95'
      onClick={e => {
        e.stopPropagation()
        const pageFrom = storage.getItem(PAGE_FROM)
        if (backTimerRef.current) {
          window.clearTimeout(backTimerRef.current)
        }
        if (pageFrom) {
          storage.removeItem(PAGE_FROM)
          if (pageFrom === '/trade' && rwa) {
            router.push('/trade/' + rwa.symbol)
          } else {
            router.push(pageFrom)
          }
        } else {
          if (backTimerRef.current) {
            window.clearTimeout(backTimerRef.current)
          }

          backTimerRef.current = window.setTimeout(() => {
            router.replace('/')
          }, 300)

          router.back()
        }
        
      }}
    >
      <img src="/images/v0.4/back.png" className="w-5 h-5" />
    </button>
  )
}
