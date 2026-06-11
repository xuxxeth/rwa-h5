import { lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'

// 懒加载页面
const Components = lazy(() => import('../views/components'))
// Markets children routes
const MarketTrading = lazy(() => import('../views/trade'))
const Identity = lazy(() => import('../views/identity'))
const Orders = lazy(() => import('../views/orders'))
const Home = lazy(() => import('../views/home'));
const Referral = lazy(() => import('../views/referral'))

// 路由表
const routes: RouteObject[] = [
  {
    path: '/',
    element: <MarketTrading />,
  },
  {
    path: '/home',
    element: <Home />
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
    path: '/referral/:inviteCode?',
    element: <Referral />,
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
