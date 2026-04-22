// 0 限价单 1 市价单
export type OrderType = 0 | 1

// 交易方向
export const OrderSide = {
  Buy: 0,
  Sell: 1,
} as const
export type OrderSide = (typeof OrderSide)[keyof typeof OrderSide]

// 订单状态
export const OrderState = {
  PendingSubmit: 0,
  PartialFilled: 1,
  Failed: 2,
  Cancelled: 3,
  Filled: 5,
  PendingCancel: 8,
  PendingFill: 9,
} as const
export type OrderState = (typeof OrderState)[keyof typeof OrderState]

// 0 未风控 1 已风控
export type RiskType = 0 | 1

// 0 Day(当日有效) 1 GTD(指定日期有效) 2 GTC(一直有效)
export type Tif = 0 | 1 | 2

// 订单失败/取消原因
export const OrderReason = {
  None: 0,
  System: 1,
  MarketClose: 2,
  Void: 3,
  Rejected: 4,
  PriceDeviation: 5,
  UserNotFound: 6,
  PricePrecision: 7,
} as const
export type OrderReason = (typeof OrderReason)[keyof typeof OrderReason]

// 0 仅盘中 4 盘前+盘后
export type SessionType = 0 | 4 | 3

export interface IOpenOrder {
  id: string
  chainId: number
  orderId: string
  stockId: number
  orderType: OrderType
  tif: Tif
  side: OrderSide
  validDate: number
  amount: string
  size: string
  price: string
  state: OrderState
  settledAmount: string
  settledSize: string
  txTime: number
  txHash: string
  reason: OrderReason
  currency: string
  sessionType: SessionType
}

export interface IOrder {
  id: string
  orderId: string
  chainId: number
  stockId: number
  orderType: OrderType
  side: OrderSide
  tif: Tif
  validDate: number
  // 委托金额
  amount: string
  // 委托数量
  size: string
  // 委托价格
  price: string
  // 订单状态
  state: OrderState
  // 成交金额
  settledAmount: string
  // 成交数量
  settledSize: string
  reason: OrderReason
  txTime: number
  tradeTime: number
  txHash: string
  currency: string
  commission: string
  fee: string
  sessionType: SessionType
}

export interface ITrade {
  // 成交金额
  amount: string
  chainId: number
  id: string
  orderId: string
  orderType: OrderType
  side: OrderSide
  // 成交数量
  size: string
  stockId: number
  txHash: string
  txTime: number
  reason: OrderReason
  currency: string
}
