import { useEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface BottomTabItem {
  key: string
  label: string
  icon: ReactNode
}

interface BottomTabBarProps {
  tabs: BottomTabItem[]
  activeKey: string
  onChange: (key: string) => void

  centerButton?: {
    icon: ReactNode
    label?: string
    onClick: () => void
  }

  hideOnKeyboard?: boolean
  className?: string
}

function useKeyboardVisible() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const viewport = window.visualViewport

    if (!viewport) return

    const handleResize = () => {
      setVisible(
        viewport.height < window.innerHeight - 150
      )
    }

    viewport.addEventListener("resize", handleResize)

    return () => {
      viewport.removeEventListener(
        "resize",
        handleResize
      )
    }
  }, [])

  return visible
}

export function BottomTabBar({
  tabs,
  activeKey,
  onChange,
  centerButton,
  hideOnKeyboard = true,
  className,
}: BottomTabBarProps) {
  const keyboardVisible = useKeyboardVisible()

  if (hideOnKeyboard && keyboardVisible) {
    return null
  }

  const hasCenterButton = Boolean(centerButton)

  return (
    <>
      <nav
        className={cn(
          `
          fixed
          bottom-0
          left-0
          right-0
          z-[49]
          border-t
          border-[#1A1B1E]
          bg-[#131416]
          `,
          className
        )}
      >
        <div
          className={cn(
            "grid h-16 grid-cols-4",
            
          )}
          style={{
            paddingBottom:
              "env(safe-area-inset-bottom)",
          }}
        >
          {tabs.map((tab) =>
              renderTab(
                tab,
                activeKey,
                onChange
              )
            )}
        </div>
      </nav>
    </>
  )
}

function renderTab(
  tab: BottomTabItem,
  activeKey: string,
  onChange: (key: string) => void
) {
  const active = tab.key === activeKey

  return (
    <button
      key={tab.key}
      type="button"
      onClick={() => onChange(tab.key)}
      className={cn(
        `
        flex
        flex-col
        items-center
        justify-center
        gap-1
        text-xs
        transition-colors
        `,
        active
          ? "text-[#9CFF3A]"
          : "text-[#737A87]"
      )}
    >
      {tab.icon}

      <span>{tab.label}</span>
    </button>
  )
}