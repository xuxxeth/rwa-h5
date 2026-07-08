import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEffect, useId, useMemo, useState } from 'react'
import { cn } from '@/utils'
import storage from '@/utils/storage'
import { getChainIconById } from '@/utils/chains'
import { useBaseStore } from '@/stores/baseStore'
import { useTranslation } from '@/hooks/useTranslation'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'

import { useActiveWeb3 } from "@/hooks/useActiveWe3";
import { useAppStore } from "@/stores/appStore";
import { LAST_CONNECTED_CHAIN_ID } from "@/config/storage";

export function ChainItem({
  title,
  icon,
  selected,
  disabled,
  onClick,
}: {
  title?: string
  icon?: string
  disabled?: boolean
  selected?: boolean
  onClick?: () => void
}) {
  const { t } = useTranslation()
  return (
    <div
      onClick={() => onClick && onClick()}
      className={cn(
        'flex items-center justify-between py-3 cursor-pointer font-medium ',
        selected ? 'text-[#FFFFFF] ' : 'text-[#6C86AD]'
      )}
    >
      <div className='flex items-center'>
        <div className='w-6 h-6 mr-2'>
          <img src={icon} className='w-6 h-6' alt='' />
        </div>

        <span className={cn('text-[14px]', disabled ? 'text-[#909090]' : '')}>{title}</span>
      </div>

      {selected && <img src='/images/icons/selected.png' className='w-3' alt='' />}
      {disabled && (
        <div className='text-[10px] text-[#4779FF] h-[16px] px-[8px] flex items-center rounded-[4px] bg-[rgba(71,121,255,0.1)]'>
          {t('Coming Soon')}
        </div>
      )}
    </div>
  )
}

export function SwitchButton() {
  const { handleSwitchChain, isChainSupported, chainId } = useActiveWeb3()
  const chains = useBaseStore(state => state.chainList)
  const [open, setOpen] = useState(false)

  const setCurrentChain = useBaseStore(state => state.setCurrentChain)
  const setCurrentChainId = useAppStore(state => state.setCurrentChainId)

  useEffect(() => {
    if (chains[0]) {
      const _chainId = Number(storage.getItem(LAST_CONNECTED_CHAIN_ID) || chains[0].id)
      const chain = chains.filter(chain => chain.state === 1).find(chain => chain.id === _chainId)
      
      if (chain && chain.state === 1) {
        handleSwitchChain(chain.id)
      } else {
        handleSwitchChain(chains[0].id)
      }
    }
  }, [chains])

  // 如果真实钱包chain切换，则更新当前链
  useEffect(() => {
    if (chainId && isChainSupported && chains[0]) {
      const chain = (chains.filter(chain => chain.state === 1).find(chain => chain.id === chainId)) || chains[0]

      if (chain) {
        storage.setItem(LAST_CONNECTED_CHAIN_ID, String(chain.id))
        setCurrentChainId(chainId)
        setCurrentChain(chain)
      }
    }
  }, [chains, chainId, isChainSupported])

  return null
}
