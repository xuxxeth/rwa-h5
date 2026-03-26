import React from 'react'
import type { IconKey, SvgIconProps } from './types'

import Add from './set/Add.tsx'
import NavMenu from './set/NavMenu.tsx'
import TikoLogo from './set/TikoLogo.tsx'
import SessionPreMarket from './set/SessionPreMarket.tsx'
import SessionMarketOpen from './set/SessionMarketOpen.tsx'
import SessionAfterHours from './set/SessionAfterHours.tsx'
import SessionNight from './set/SessionNight.tsx'
import SessionClosed from './set/SessionClosed.tsx'

export {
Add,
NavMenu,
TikoLogo,
SessionPreMarket,
SessionMarketOpen,
SessionAfterHours,
SessionNight,
SessionClosed
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
