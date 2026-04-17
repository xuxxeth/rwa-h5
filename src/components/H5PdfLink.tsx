import { useEffect, useRef, useCallback, type ReactNode } from 'react'
import { useToast } from '@/hooks/useToast'
import { useTranslation } from '@/hooks/useTranslation'

export function H5PdfLink(props: {
  href: string
  children: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}) {
  const { toastInfo } = useToast()
  const { t } = useTranslation()

  // 使用 useRef 记录定时器和监听器引用，方便在 useEffect 中清理
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const listenerRef = useRef<(() => void) | null>(null)
  // 记录当前是否已经有 Toast 在展示中
  const isToastShowingRef = useRef<boolean>(false)
  const toastResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 提取公共的清理函数，使用 useCallback 包裹以保持引用稳定
  const clearTimersAndListeners = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (listenerRef.current) {
      document.removeEventListener('visibilitychange', listenerRef.current)
      listenerRef.current = null
    }
  }, [])

  // 确保组件卸载时，强行清理可能还挂着的定时器和监听器
  useEffect(() => {
    return () => {
      clearTimersAndListeners()
      if (toastResetTimerRef.current) {
        clearTimeout(toastResetTimerRef.current)
      }
    }
  }, [clearTimersAndListeners])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 优先执行父组件传进来的点击事件
    if (props.onClick) {
      props.onClick(e)
    }

    // 防抖：在每次新的点击发生前，先清理掉上一次可能还未执行完的定时器和监听器
    clearTimersAndListeners()

    const ua = navigator.userAgent
    const isAndroid = /android/i.test(ua)
    console.log('ua', ua)
    console.log('isAndroid', isAndroid)
    const isOKX = /OKX/i.test(ua)
    console.log('isOKX', isOKX)

    if (isAndroid && isOKX) {
      e.preventDefault()
      e.stopPropagation()
    }

    // 1. 先定义好新的监听器，挂载到 listenerRef.current 上
    // 监听页面隐藏（说明成功跳转、跳到新标签页或拉起了系统下载管理器）
    listenerRef.current = () => {
      // 只要页面不可见（跳走了、拉起下载了、切后台了），立刻清理定时器，避免误报
      if (document.visibilityState === 'hidden') {
        clearTimersAndListeners()
      }
    }

    // 2. 然后启动新的定时器
    // 无论是什么设备、什么浏览器，只要 800 毫秒后页面没切走（没拉起下载，没跳新窗口）
    // 我们就认为它不支持当前的跳转行为，统一给出提示
    timerRef.current = setTimeout(() => {
      // 再次确认页面是可见的，并且当前没有 Toast 正在展示时，才弹出提示
      if (document.visibilityState === 'visible' && !isToastShowingRef.current) {
        toastInfo({ title: t('viewPdf'), duration: 5000 })

        // 标记 Toast 正在展示
        isToastShowingRef.current = true
        // 设置 5 秒（与 duration 同步）后重置展示状态，允许再次弹出
        toastResetTimerRef.current = setTimeout(() => {
          isToastShowingRef.current = false
          toastResetTimerRef.current = null
        }, 5000)
      }

      // 注意：这里只清理定时器引用，不要调用 clearTimersAndListeners 移除监听器。
      // 因为用户如果没跳走，800ms 弹完 Toast 后，页面依然可能发生 visibilitychange
      // 监听器留着给后续可能的逻辑（或者等下一次点击/组件卸载时再清理）是更安全的做法，
      // 避免干扰连续的、或者迟来的页面状态变化。
      timerRef.current = null
    }, 800)

    // 3. 最后，绑定这个新的监听器到 document 上
    document.addEventListener('visibilitychange', listenerRef.current)
  }

  return (
    <a
      href={props.href}
      target='_blank'
      rel='noopener noreferrer'
      className={props.className}
      onClick={handleClick}
    >
      {props.children}
    </a>
  )
}
