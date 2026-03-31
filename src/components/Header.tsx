import { ConnectButton } from '@/components/button/ConnectButton.tsx'
import NavMenu from '@/components/icons/set/NavMenu.tsx'
import TikoLogo from '@/components/icons/set/TikoLogo.tsx'
import { useSettingStore } from '@/stores/settingStore'
import { SwitchButton } from '@/components/button/SwitchChainButton.tsx'

export const Header = () => {
  const setOpen = useSettingStore((s) => s.setOpen)

  return (
    <div
      className={
        'flex justify-between items-center px-[20px] py-[14px] w-full h-[52px] fixed top-0 left-0 z-[100] bg-gray-950'
      }
    >
      <div className='flex items-center gap-2'>
        <NavMenu size={24} className='cursor-pointer' onClick={() => setOpen(true)} />
        <TikoLogo size={55} className='cursor-pointer' onClick={() => window.location.href = import.meta.env.VITE_HOME_URL} />
      </div>
      <div>
        <SwitchButton />
        <ConnectButton />
      </div>
    </div>
  )
}
