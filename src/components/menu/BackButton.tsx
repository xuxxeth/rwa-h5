import { useRouter } from "@/hooks/useRouter"


export function BackButton() {
  const router = useRouter()

  return (
    <button className='flex h-[34px] w-[30] items-center active:scale-95'
      onClick={e => {
        e.stopPropagation()
        router.back()
      }}
    >
      <img src="/images/v0.4/back.png" className="w-5 h-5" />
    </button>
  )
}