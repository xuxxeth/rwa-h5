import { useTranslation } from "@/hooks/useTranslation"
import { cn } from "@/lib/utils"
import { advancedSort, divide, formatLargeNumber, isLess, multiply, sum, textPrefix, toFixed, truncate } from "@/utils"
import type { IAssetItem } from "@/views/assets/assetsList"
import AssetsPieChart, { COLORS, type ChartData } from "@/views/assets/v2/pieChart"
import { useMemo, useState } from "react"

function AssetsRatio({
  assetsList,
  estimatedBalance
}: {
  assetsList: IAssetItem[]
  estimatedBalance: string
}) {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(-1)

  const chartData = useMemo(() => {
    if (!assetsList || assetsList.length === 0) return []

    // 1. 预处理数据：转换 value 为数字并过滤掉 0 值
    const validData = assetsList.filter(item => item.value !== undefined && item.value !== '0')

    // 2. 按价值降序排序
    const sortedData = validData
      .sort((a, b) => advancedSort(a.value, b.value, 'desc'))
      .map(item => ({
        name: item.name!,
        value: parseFloat(item.value || '0'),
        symbol: item.symbol,
        holdings: item.holdings || '0',
      }))

    let top6: ChartData[] = []

    if (sortedData.length > 6) {
      const top5 = sortedData.slice(0, 5)
      const others = sortedData.slice(5)
      const othersValue = others.reduce((acc, cur) => sum(acc, cur.value), '0')
      const othersHoldings = others.reduce((acc, cur) => sum(acc, cur.holdings), '0')
      const othersItem: ChartData = {
        name: t('portfolio.others'),
        value: parseFloat(othersValue),
        symbol: t('portfolio.others'),
        holdings: othersHoldings,
      }
      top6 = [...top5, othersItem]
    } else {
      top6 = sortedData.slice(0, 6)
    }

    return top6.map(item => {
      const ratio = divide(item.value, estimatedBalance)
      const isTooSmall = isLess(ratio, '0.01')
      return {
        ...item,
        ratio: multiply(toFixed(divide(item.value, estimatedBalance), 4), 100),
        isTooSmall,
      }
    })
  }, [assetsList, estimatedBalance])

  const chartDataToList = Array.from({ length: Math.ceil(chartData.length / 3) }, (_, idx) =>
    chartData.slice(idx * 3, idx * 3 + 3)
  )

  return (
    <div className=" min-h-[138px] flex items-center justify-between w-full">
      <div className="flex-1 shrink-0">
        <div
            className='w-full h-[132px]'
            style={{
              backgroundImage: 'url(/images/v2/portfolio/pie-bg.svg)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: `left 33px top 30px`,
            }}
          >
            <AssetsPieChart
              chartData={chartData}
              activeIndex={activeIndex}
              onActiveIndexChange={setActiveIndex}
            />
          </div>
      </div>
      <div className=" flex-1 w-full">
        <div className='flex flex-col'>
          {chartDataToList.map((list, listIdx) => {
            return (
              <>
                {list.map((item, idx) => {
                  const index = listIdx * 3 + idx
                  const color = COLORS[index % COLORS.length]
                  const isActive = activeIndex === index
                  return (
                    <div
                      key={item.name + idx}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(-1)}
                      className={cn(
                        'flex flex-row cursor-pointer items-center rounded-[4px] py-1 transition-all duration-300 relative mt-2',
                        isActive ? ' bg-opacity-08 rounded-[4px]' : ''
                      )}
                    >
                      <div
                        className={`absolute left-0 mr-1 rounded-tl-[4px] rounded-bl-[4px] top-0 bottom-0 w-[3px] transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundColor: color }}
                      />
                      <div
                        style={{
                          backgroundColor: color,
                          borderColor: color,
                        }}
                        className={cn(
                          'w-1.5 h-1.5 border rounded-[50%] mr-2',
                          isActive ? 'scale-110 shadow-[0_0_8px_rgba(0,0,0,0.5)]' : ''
                        )}
                      ></div>
                      <div
                        className={cn(
                          'text-xs/[15px] text-gray-400 flex items-center justify-between w-full',
                          isActive ? 'text-white' : ''
                        )}
                      >
                        <div className="flex items-center">
                          {item.symbol}{' '}
                          {textPrefix(formatLargeNumber(truncate(item.value, 2)), '$')} 
                        </div>
                        <div>
                          {!item.isTooSmall ? item.ratio : '<1'}%
                        </div>
                        
                      </div>
                    </div>
                  )
                })}
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { AssetsRatio }