
import { BottomTabBar } from "@/components/menu/BottomTabBar"
import { useEffect, useMemo, useState } from "react"
import CandleIcon from "./CandleIcon"
import RefIcon from "./RefIcon"
import { useTranslation } from "@/hooks/useTranslation"
import { useRouter } from "@/hooks/useRouter"

const BOTTOM_MENUS_PATH = ['/referral', '/trade']

export function BottomMenus() {
  const { t } = useTranslation()
  const router = useRouter()
  const [active, setActive] = useState("trade")
  // http://localhost:8001/referral/3MNVNRPBY6
  // 这样的地址就识别错误了，怎么解
  const isBottomMenus = useMemo(
    () => {
      return BOTTOM_MENUS_PATH.some(path => router.location.pathname !== '/' && router.location.pathname.startsWith(path)) || router.location.pathname === '/'
    },
    [router.location.pathname]
  )

  useEffect(() => {
    const pathname = router.location.pathname
    if (pathname.startsWith('/trade')) {
      setActive('trade')
    } else if (pathname.startsWith('/referral')) {
      setActive('ref')
    }
  }, [router.location.pathname])

  const [keyboardOpen, setKeyboardOpen] = useState(false)

  useEffect(() => {
    const vv = window.visualViewport

    if (!vv) return

    const initialHeight = vv.height

    const onResize = () => {
      setKeyboardOpen(
        vv.height < initialHeight * 0.8
      )
    }

    vv.addEventListener('resize', onResize)

    return () => {
      vv.removeEventListener('resize', onResize)
    }
  }, [])

  console.log('keyboardOpen: ', keyboardOpen)

  if (!isBottomMenus || keyboardOpen) return null

  return (
    <BottomTabBar
      activeKey={active}
      onChange={(key) => {
        setActive(key)
        if (key === 'trade') {
          router.push('/trade')
        } else if (key === 'ref') {
          router.push('/referral')
        }
      }}
      tabs={[
        {
          key: "trade",
          label: t("Trade"),
          icon: <CandleIcon />,
        },
        {
          key: "ref",
          label: t("ref.t34"),
          icon: (
            <RefIcon />
          ),
        },
        
      ]}
      
    />
  )   
}