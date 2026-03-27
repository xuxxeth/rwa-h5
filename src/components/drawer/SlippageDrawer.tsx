import { memo, useEffect, useState } from 'react'
import { Drawer } from '@/components/drawer'
import { Button } from '@/components/ui/button'
import { NumberInput } from '@/components/v2/input/NumberInput'
import { useTradeStore } from '@/stores/tradeStore'
import { useTranslation } from '@/hooks/useTranslation'
import { DEFAULT_SLIPPAGE } from '@/config/constants'
import { SLIPPAGE_INPUT_REGEX } from '@/utils/regex'
import { cn } from '@/lib/utils'

/** Figma 预设选项 */
const PRESETS = [
  { label: null, value: DEFAULT_SLIPPAGE, recommended: true },
  { label: '0.1%', value: 0.1, recommended: false },
  { label: '0.5%', value: 0.5, recommended: false },
] as const

export const SlippageDrawer = memo(() => {
  const { t } = useTranslation()
  const open = useTradeStore((s) => s.slippageDrawerOpen)
  const setOpen = useTradeStore((s) => s.setSlippageDrawerOpen)
  const slippage = useTradeStore((s) => s.slippage)
  const updateSlippage = useTradeStore((s) => s.updateSlippage)

  // 'preset' | 'custom'
  const [mode, setMode] = useState<'preset' | 'custom'>('preset')
  const [selectedPreset, setSelectedPreset] = useState(DEFAULT_SLIPPAGE)
  const [customValue, setCustomValue] = useState('')

  // 打开时同步当前 slippage 到本地状态
  useEffect(() => {
    if (!open) return
    const preset = PRESETS.find((p) => p.value === slippage)
    if (preset) {
      setMode('preset')
      setSelectedPreset(preset.value)
      setCustomValue('')
    } else {
      setMode('custom')
      setCustomValue(String(slippage))
    }
  }, [open, slippage])

  const customNum = Number(customValue)
  const isCustomValid = customValue !== '' && customNum > 0 && customNum <= 3
  const canConfirm = mode === 'preset' || isCustomValid

  const handleConfirm = () => {
    const value = mode === 'preset' ? selectedPreset : customNum
    updateSlippage(value)
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} title={t('调整滑点')}>
      <div className="flex flex-col border-t border-gray-700">
        {/* 预设选项 */}
        <div className="flex gap-2 px-5 py-3">
          {PRESETS.map((p) => {
            const active = mode === 'preset' && selectedPreset === p.value
            return (
              <button
                key={p.value}
                className={cn(
                  'flex flex-1 items-center justify-center rounded-[8px] border px-4 py-3 text-[16px]',
                  active
                    ? 'border-green-50 bg-[rgba(37,167,80,0.2)] text-green-100'
                    : 'border-gray-750 text-white',
                )}
                onClick={() => {
                  setMode('preset')
                  setSelectedPreset(p.value)
                }}
              >
                {p.recommended
                  ? `${t('推荐')} ${p.value}%`
                  : p.label}
              </button>
            )
          })}
        </div>

        {/* 自定义输入 */}
        <div className="flex flex-col gap-3 px-5 py-3">
          <div
            className={cn(
              'flex items-center justify-between rounded-[8px] border px-4 py-3',
              mode === 'custom' ? 'border-gray-750' : 'border-gray-750',
            )}
            onClick={() => setMode('custom')}
          >
            <span className="text-[16px] text-white">{t('自定义')}</span>
            <div className="flex items-center gap-4">
              <NumberInput
                className="w-[80px] text-center text-[16px] h-auto"
                placeholder="0.3～1"
                regex={SLIPPAGE_INPUT_REGEX}
                value={customValue}
                onInput={(v) => {
                  setCustomValue(v)
                  setMode('custom')
                }}
                onFocus={() => setMode('custom')}
              />
              <span className="text-[16px] text-white">%</span>
            </div>
          </div>

          {/* 确认按钮 */}
          <Button
            disabled={!canConfirm}
            className="h-[48px] w-full rounded-[8px]"
            onClick={handleConfirm}
          >
            {t('Confirm')}
          </Button>
        </div>
      </div>
    </Drawer>
  )
})

SlippageDrawer.displayName = 'SlippageDrawer'
