import React from 'react'
import type { IconKey, SvgIconProps } from './types'

import Add from './set/Add.tsx'
import NavMenu from './set/NavMenu.tsx'
import TikoLogo from './set/TikoLogo.tsx'
import SessionPreMarket from './set/PreMarket.tsx'
import SessionMarketOpen from './set/MarketOpen.tsx'
import SessionAfterHours from './set/AfterHours.tsx'
import SessionNight from './set/Night.tsx'
import SessionClosed from './set/Closed.tsx'
import KycUnverified from './set/KycUnverified.tsx'
import KycVerified from './set/KycVerified.tsx'
import KycException from './set/KycException.tsx'
import KycAdditionalInfo from './set/KycAdditionalInfo.tsx'
import CopyIcon from './set/Copy.tsx'
import Disconnect from './set/Disconnect.tsx'
import Yes from './set/Yes.tsx'
import InfoWarning from './set/InfoWarning.tsx'

export {
  Add,
  NavMenu,
  TikoLogo,
  SessionPreMarket,
  SessionMarketOpen,
  SessionAfterHours,
  SessionNight,
  SessionClosed,
  KycUnverified,
  KycVerified,
  KycException,
  KycAdditionalInfo,
  CopyIcon,
  Disconnect,
  Yes,
  InfoWarning
}


const Components: Record<string, React.FC<SvgIconProps>> = {}
const modules = import.meta.glob('./set/**/*', { eager: true })
for (const path in modules) {
  const mod = modules[path as string] as any
  // 提取组件名：去掉路径前缀和后缀，并转换成 PascalCase
  const fileName = path
    ?.split('/')
    ?.pop()
    ?.replace(/\.\w+$/, '')
  if (fileName) {
    const componentName = fileName
      .split(/[-_]/g)
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join('')
    const component = mod.default ?? Object.values(mod)[0]
    if (typeof component === 'function' || (component != null && component.$$typeof != null)) {
      Components[componentName] = component
    }
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const ICON_KEYS = Object.keys(Components) as Array<keyof typeof Components>


// eslint-disable-next-line react-refresh/only-export-components
export const getIcon = (key: IconKey, props: SvgIconProps) => {
  const Icon = Components[key]
  return <Icon {...props} />
}
