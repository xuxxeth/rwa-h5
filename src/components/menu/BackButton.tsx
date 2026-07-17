import { PAGE_FROM } from "@/config/constants"
import { useRouter } from "@/hooks/useRouter"
import storage from "@/utils/storage"


export function BackButton() {
  const router = useRouter()

  return (
    <button className='flex h-[34px] w-[30] items-center active:scale-95'
      onClick={e => {
        e.stopPropagation()
        const pageFrom = storage.getItem(PAGE_FROM)
        if (pageFrom) {
          storage.removeItem(PAGE_FROM)
          router.push(pageFrom)
        } else {
          router.back()
        }
        
      }}
    >
      <img src="/images/v0.4/back.png" className="w-5 h-5" />
    </button>
  )
}