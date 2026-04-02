import { shortenAddress } from '@/utils'
import { Copy } from '@/components/Copy.tsx'

export const Address = ({ address, className = '' }: { address: string; className?: string }) => {
  if (address)
    return (
      <div className={`flex items-center gap-[4px] ${className}`}>
        <span>{shortenAddress(address)}</span>
        <Copy content={address}  className="text-white"/>
      </div>
    )

  return <></>
}
