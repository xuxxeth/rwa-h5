import { lazy } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'

const Home = lazy(() => import('../views/home/v2'))
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
    element: <Home />,
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
    path: '/identity',
    element: <Identity />,
  },

  {
    path: '/com',
    element: <Components />,
  },

  {
    path: '*', // 兜底路由
    element: <Home/>,
  },
]

export default routes
