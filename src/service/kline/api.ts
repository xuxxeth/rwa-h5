import client, { type ApiResponse } from "../client";
import type { ICandlesItem, ICandlesParams, IMinuteItem, IMinuteParams } from "./types";

type RequestConfig = Parameters<typeof client.get>[2]

export const klineApi = {
  getCandles: (params: ICandlesParams, config?: RequestConfig) =>
    client.get<ApiResponse<ICandlesItem[]>>('/v1/quote/public/candles', { ...params }, config),
  getMinute: (params: IMinuteParams, config?: RequestConfig) =>
    client.get<ApiResponse<IMinuteItem>>('/v1/quote/public/tick', { ...params }, config)
};
