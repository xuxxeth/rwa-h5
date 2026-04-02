import { lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'

// 懒加载页面
const Components = lazy(() => import('../views/components'))
// Markets children routes
const MarketTrading = lazy(() => import('../views/trade'))
const Identity = lazy(() => import('../views/identity'))
const Orders = lazy(() => import('../views/orders'))
// 路由表
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to={'/trade'} replace />,
  },
  {
    path: '/trade/:symbol?',
    element: <MarketTrading />,
  },
  {
    path: '/orders',
    element: <Orders />,
  },
  {
    path: '/identity/liveness-complete',
    element: <Identity />
  },
  {
    path: '/identity',
    element: <Identity />,
  },
  {
    path: '/com',
    element: <Components />,
  },

  {
    path: '*', // 兜底路由
    element: <Navigate to={'/trade'} replace />,
  },
]

export default routes
