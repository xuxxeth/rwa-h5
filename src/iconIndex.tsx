import './index.css'
import { createRoot } from 'react-dom/client'
import { ICON_KEYS, getIcon } from '@/components/icons'
import { useState } from 'react'
import type { IconKey } from '@/components/icons/types.ts'
import { useToast } from '@/hooks/useToast.tsx'
import { toast, Toaster } from 'sonner'



function capitalizeFirstLetter(string: string) {
  if (!string) return string
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

// eslint-disable-next-line react-refresh/only-export-components
function IconPage () {
  const { toastSuccess } = useToast()
  
  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value)
    toast.success(`复制成功: ${value}`)
    event?.stopPropagation()
  }

  const [type] = useState('js')

  return (
    <div className="p-2 font-mono">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-8">
        {ICON_KEYS.map((key) => {
          const value = type === 'component' ? `${capitalizeFirstLetter(key)}Icon` : key
          return (
            <div
              className="hover:text-deep flex cursor-pointer flex-col items-center justify-center rounded-sm pt-4 text-white shadow-sm transition duration-300 ease-out hover:scale-105 hover:bg-indigo-100"
              onClick={handleCopy.bind(null, `<${value} size={}/>`)}
              key={key}
            >
              {getIcon(key as IconKey, {
                type: 'primary',
                size: 20,
              })}
              <span className="text mt-0.5 select-none">{value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}


createRoot(document.getElementById('root')!).render(
  <>
    <Toaster position='top-right' toastOptions={{ classNames: { toast: '!text-white !bg-zinc-800 !border-zinc-700' } }} />
    <IconPage />
  </>
)
