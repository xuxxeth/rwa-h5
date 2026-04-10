import * as DialogPrimitive from '@radix-ui/react-dialog'
import { TittleBar } from '@/components/TittleBar'
import { SettingSwitch } from '@/components/ui/setting-switch'
import { SettingItem } from '@/components/ui/setting-item'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { useTranslation } from '@/hooks/useTranslation'
import storage from '@/utils/storage'
import { CA_LANGUAGE } from '@/config/constants'
import { useSettingStore } from '@/stores/settingStore'

const languageOptions = [
  { code: 'zh', label: '繁体中文' },
  { code: 'en', label: 'EN' },
]

export const Settings = () => {
  const { t, i18n } = useTranslation()
  const open = useSettingStore(s => s.open)
  const setOpen = useSettingStore(s => s.setOpen)
  const showConfirm = useSettingStore(s => s.showConfirm)
  const setShowConfirm = useSettingStore(s => s.setShowConfirm)

  const handleLanguageChange = (code: string) => {
    storage.setItem(CA_LANGUAGE, code)
    i18n.changeLanguage(code)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className='fixed inset-0 z-[200] bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />
        <DialogPrimitive.Content className='fixed inset-y-0 left-0 z-[201] w-full bg-[#131416] shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left'>
          {/* 隐藏的标题，满足无障碍 */}
          <DialogPrimitive.Title className='sr-only'>{t('Setting')}</DialogPrimitive.Title>
          <DialogPrimitive.Description className='sr-only'>
            App settings panel
          </DialogPrimitive.Description>

          {/* 标题栏 */}
          <TittleBar title={t('Setting')} onBack={() => setOpen(false)} />

          {/* 内容区域 */}
          <div className='flex flex-1 flex-col'>
            {/* 设置列表 */}
            <div className='flex flex-col px-5'>
              {/* 交易确认弹窗 */}
              <SettingItem label={t('v2.hd.h3')}>
                <SettingSwitch checked={showConfirm} onCheckedChange={setShowConfirm} />
              </SettingItem>

              {/* Language */}
              <SettingItem label={t('Language')}>
                <LanguageSwitcher
                  value={i18n.language}
                  options={languageOptions}
                  onChange={handleLanguageChange}
                />
              </SettingItem>

              {/* 网络费代币 */}
              <SettingItem label={t('v2.hd.h4')}>
                <div className='flex items-center gap-2'>
                  <img src='/images/tokens/bnb.png' alt='BNB' className='h-5 w-5 rounded-full' />
                  <span className='text-[14px] text-white font-normal'>BNB</span>
                </div>
              </SettingItem>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export default Settings
