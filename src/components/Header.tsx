import { ConnectButton } from '@/components/button/ConnectButton.tsx'
import NavMenu from '@/components/icons/set/NavMenu.tsx'
import TikoLogo from '@/components/icons/set/TikoLogo.tsx'

export const Header = () => {
  return (
    <div
      className={'flex justify-between items-center px-[20px] py-[14px] w-full h-[52px] sticky z-[100] bg-gray-950'}
    >
      <div className='flex items-center gap-2'>
        <NavMenu size={24} />
        <TikoLogo size={55} />
      </div>
      <div>
        <ConnectButton />
      </div>
    </div>
  )
}
