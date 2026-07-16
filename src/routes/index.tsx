import { lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'

// 懒加载页面
const Components = lazy(() => import('../views/components'))
// Markets children routes
const IndexPage = lazy(() => import('../views/index'))
const MarketTrading = lazy(() => import('../views/trade'))
const Identity = lazy(() => import('../views/identity'))
const Orders = lazy(() => import('../views/orders'))
const Home = lazy(() => import('../views/home'));
const Referral = lazy(() => import('../views/referral'))
const Kline = lazy(() => import('../views/kline'))
const Assets = lazy(() => import('../views/assets'))
const Stock = lazy(() => import('../views/stock'))

// 路由表
const routes: RouteObject[] = [
  {
    path: '/',
    element: <IndexPage />,
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/kline',
    element: <Kline />
  },
  {
    path: '/assets',
    element: <Assets />
  },
  {
    path: '/trade/:symbol?',
    element: <MarketTrading />,
  },
  {
    path: '/stock/:symbol?',
    element: <Stock />,
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
