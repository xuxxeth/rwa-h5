import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface SettingStore {
  /** Settings 抽屉是否打开 */
  open: boolean
  setOpen: (open: boolean) => void

  showConfirm: boolean
  setShowConfirm: (show: boolean) => void
}

export const useSettingStore = create<SettingStore>()(
  persist((set) => ({
    open: false,
    setOpen: (open: boolean) => {
      set({ open })
    },

    showConfirm: true,
    setShowConfirm: (show: boolean) => {
      set({ showConfirm: show })
    },
  }),
  {
    name: "CA_WEB_SETTING",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      showConfirm: state.showConfirm,
    }),
  })
)
