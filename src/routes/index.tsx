import { lazy } from 'react'
import { type RouteObject } from 'react-router-dom'

// 懒加载页面
// const Home = lazy(() => import('../views/home'))

const Home = lazy(() => import('../views/home/v2'))

const LiteTrade = lazy(() => import('../views/lite-trade/indexv2'))
const NotFound = lazy(() => import('../views/not-found'))
const Components = lazy(() => import('../views/components'))
// Markets children routes
const MarketTrading = lazy(() => import('../views/trade'))
const Identity = lazy(() => import('../views/identity'))
// const Assets = lazy(() => import('../views/assets'))
const Portfolio = lazy(() => import('../views/assets/v2'))

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
    path: '/lite-trade/:symbol?',
    element: <LiteTrade />,
  },
  
  {
    path: '/order',
    element: <Portfolio />,
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
    element: <NotFound />,
  },
]

export default routes
