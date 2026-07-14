import { memo, useCallback, useMemo, useState } from 'react'
import { Drawer } from '@/components/drawer'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/hooks/useToast'
import { useAppStore } from '@/stores/appStore'
import { useBaseStore } from '@/stores/baseStore'
import { LazyImage } from '../image/LazyImage'
import { useSwitchChainAction } from '@/hooks/useSwitchChainAction'

interface SwitchChainDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ChainListDrawer = memo(({ open, onOpenChange }: SwitchChainDrawerProps) => {
  const { t } = useTranslation()
  const { toastError } = useToast()
  const currentChainId = useAppStore(state => state.currentChainId)
  const chainList = useBaseStore(state => state.chainList)

  const supportedChains = useMemo(
    () => chainList.filter(chain => chain.state === 1),
    [chainList]
  )

  const chains = useMemo(() => {
    return supportedChains
  }, [supportedChains])

  const networkText = useMemo(() => chains.filter(c => c.state === 1).map(chain => chain.displayName).join(' / '), [chains])

  const {
    switchToChain
  } = useSwitchChainAction();

  const handleSelectChain = async(
    chainId:number
  )=>{

    try {

      const ok =
        await switchToChain(
          chainId
        );


      if(!ok){

        toastError({
          title:t("switchNetwork")
        });

      }


    } catch(error){

      console.error(
        "switch chain error:",
        error
      );

      toastError({
        title:t("switchNetwork")
      });

    }

  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} title={t('multiChain.t1')}>
        <div className='flex flex-col pb-11'>
          {
            chains.map(chain => (
              <div key={chain.id} className='flex items-center justify-between px-4 py-4'
                onClick={e => {
                  e.stopPropagation()
                  handleSelectChain(chain.id)
                    
                }}
              >
            
                <div className=' text-white font-normal text-[14px] flex items-center gap-x-[4px]'>
                  <div className='w-[24px] h-[24px]'>
                    {chain?.icon && <LazyImage src={chain?.icon} className='w-full h-full' />}
                  </div>
                  
                  {chain?.displayName ?? '--'}
                </div>
                {
                  currentChainId === chain.id && <LazyImage src='/images/referral/chain_check.png' className='w-5 h-5' />
                }
              </div>
            ))
          }
          


          
        </div>
      </Drawer>

    </>
  )
})

ChainListDrawer.displayName = 'ChainListDrawer'
