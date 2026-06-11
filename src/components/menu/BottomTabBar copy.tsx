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
      {hasCenterButton && (
        <button
          type="button"
          onClick={centerButton?.onClick}
          className="
            fixed
            left-1/2
            z-[101]
            flex
            h-14
            w-14
            -translate-x-1/2
            items-center
            justify-center
            rounded-full
            border
            border-border
            bg-primary
            text-primary-foreground
            shadow-lg
            transition-transform
            active:scale-95
          "
          style={{
            bottom:
              "calc(28px + env(safe-area-inset-bottom))",
          }}
        >
          {centerButton?.icon}
        </button>
      )}

      <nav
        className={cn(
          `
          fixed
          bottom-0
          left-0
          right-0
          z-[100]
          border-t
          border-border
          bg-background/80
          backdrop-blur-xl
          `,
          className
        )}
      >
        <div
          className={cn(
            "grid h-16",
            hasCenterButton
              ? "grid-cols-5"
              : `grid-cols-${tabs.length}`
          )}
          style={{
            paddingBottom:
              "env(safe-area-inset-bottom)",
          }}
        >
          {hasCenterButton ? (
            <>
              {renderTab(
                tabs[0],
                activeKey,
                onChange
              )}

              {renderTab(
                tabs[1],
                activeKey,
                onChange
              )}

              <div />

              {renderTab(
                tabs[2],
                activeKey,
                onChange
              )}

              {renderTab(
                tabs[3],
                activeKey,
                onChange
              )}
            </>
          ) : (
            tabs.map((tab) =>
              renderTab(
                tab,
                activeKey,
                onChange
              )
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
          ? "text-primary"
          : "text-muted-foreground"
      )}
    >
      {tab.icon}

      <span>{tab.label}</span>
    </button>
  )
}