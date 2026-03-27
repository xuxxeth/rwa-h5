import CopySVG from '@/assets/portfolio/copy.svg?react'
import IconWithTooltip from '@/components/icon-tooltip'
import { useRef, useState } from 'react'

type CopyButtonProps = {
  className?: string
  copyText: string
}

function fallbackCopy(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.readOnly = true
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  textarea.setSelectionRange(0, text.length)
  const copied = document.execCommand('copy')
  textarea.remove()
  return copied
}

async function doCopy(text: string) {
  if (!text) return false

  try {
    console.log('==>window.isSecureContext', window.isSecureContext)
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      console.log('===>copy 1 成功 clipboard.writeText')
      return true
    }
  } catch {}

  try {
    return fallbackCopy(text)
  } catch {
    return false
  }
}

function CopyButton({ className, copyText }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    const copySucceeded = await doCopy(copyText)
    console.log('===>copy 最终成功', copySucceeded)
    if (!copySucceeded) return

    setCopied(true)
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  return (
    <IconWithTooltip tooltip='copied' tooltipClassName='px-2 py-1' open={copied}>
      <button
        type='button'
        onClick={handleCopy}
        className={className || 'text-gray-400 hover:text-white'}
      >
        <CopySVG className='w-4 h-4' />
      </button>
    </IconWithTooltip>
  )
}

export default CopyButton
