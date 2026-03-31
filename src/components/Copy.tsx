import { CopyIcon, Yes} from '@/components/icons'
import { useState, type MouseEventHandler } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'
import { useThrottleFn } from 'ahooks'

export const Copy = ({ content, className = '' }: { content?: string; className?: string }) => {
  const [, copy] = useCopyToClipboard()
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const { run: onCopyFn } = useThrottleFn(
    (text: string) => {
      copy(text)
        .then(rs => rs)
        .finally(() => {
          // toast.success({
          //   title: t`Copy success`,
          // })
          setTimeout(() => {
            setIsCopied(false)
          }, 1000)
          setIsCopied(true)
        })
    },
    { wait: 1000 }
  )
  const onCopy: MouseEventHandler<HTMLDivElement> = e => {
    e.preventDefault()
    e.stopPropagation()
    if (content) {
      onCopyFn(content)
    }
  }
  return (
    <div className={`h-[12px] w-[12px] align-middle cursor-pointer ${className}`}>
      {isCopied ? (
        <div
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <Yes size={12} className='!text-brand' />
        </div>
      ) : (
        <div onClick={onCopy}>
          <CopyIcon size={12} />
        </div>
      )}
    </div>
  )
}
