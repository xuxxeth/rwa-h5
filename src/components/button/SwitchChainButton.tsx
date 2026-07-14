import { useEffect, useId, useMemo, useState } from 'react'
import storage from '@/utils/storage'
import { useBaseStore } from '@/stores/baseStore'
import { useTranslation } from '@/hooks/useTranslation'

import { useActiveWeb3 } from "@/hooks/useActiveWe3";
import { useAppStore } from "@/stores/appStore";
import { LAST_CONNECTED_CHAIN_ID } from "@/config/storage";
import { useSwitchChainAction } from '@/hooks/useSwitchChainAction'
import { useToast } from '@/hooks/useToast'

export function SwitchButton() {
  const { t } = useTranslation();
  const { toastError } = useToast();


  const {
    handleSwitchChain,
    isChainSupported,
    chainId
  } = useActiveWeb3();


  const chains = useBaseStore(
    state => state.chainList
  );


  const setCurrentChain =
    useBaseStore(
      state => state.setCurrentChain
    );


  const setCurrentChainId =
    useAppStore(
      state => state.setCurrentChainId
    );


  const currentChainId =
    useAppStore(
      state => state.currentChainId
    );


  const [open,setOpen] = useState(false);


  const currentChain = useMemo(()=>{

    return chains
      .filter(chain => chain.state === 1)
      .find(
        chain => chain.id === currentChainId
      );

  },[
    chains,
    currentChainId
  ]);






  /**
   * 初始化恢复上一次链
   */
  useEffect(()=>{

    if(!chains[0]){
      return;
    }


    const lastChainId =
      Number(
        storage.getItem(
          LAST_CONNECTED_CHAIN_ID
        ) || chains[0].id
      );


    const chain =
      chains
      .filter(
        chain => chain.state === 1
      )
      .find(
        chain => chain.id === lastChainId
      );


    if(chain){

      handleSwitchChain(
        chain.id
      );

    }else{

      handleSwitchChain(
        chains[0].id
      );

    }


  },[
    chains
  ]);



  /**
   * 同步钱包真实 chain
   */
  useEffect(()=>{

    if(
      !chainId ||
      !isChainSupported ||
      !chains[0]
    ){
      return;
    }


    const chain =
      chains
      .filter(
        chain => chain.state === 1
      )
      .find(
        chain => chain.id === chainId
      )
      ||
      chains[0];


    storage.setItem(
      LAST_CONNECTED_CHAIN_ID,
      String(chain.id)
    );


    setCurrentChainId(
      chainId
    );


    setCurrentChain(
      chain
    );


  },[
    chains,
    chainId,
    isChainSupported
  ]);



  

  return null
}
