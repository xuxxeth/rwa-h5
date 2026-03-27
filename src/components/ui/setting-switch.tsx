import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cn } from '@/utils'

const SettingSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-[18px] w-[36px] shrink-0 cursor-pointer items-center rounded-full',
      'border-2 border-transparent shadow-sm transition-colors',
      'focus-visible:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-brand data-[state=unchecked]:bg-gray-700',
      className,
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-[13.5px] w-[13.5px] rounded-full shadow-lg ring-0 transition-transform',
        'data-[state=checked]:translate-x-[16.5px] data-[state=unchecked]:translate-x-[1px]',
        'data-[state=checked]:bg-[#131927] data-[state=unchecked]:bg-white',
      )}
    />
  </SwitchPrimitives.Root>
))
SettingSwitch.displayName = 'SettingSwitch'

export { SettingSwitch }
