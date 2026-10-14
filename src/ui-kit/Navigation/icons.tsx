import type { ComponentProps, FC } from 'react'
import { MessageFillIcon, SettingsFillIcon } from '../../assets/icons'

export type NavIconName = 'message' | 'settings'

type IconComponent = FC<ComponentProps<'svg'>>

const icons: Record<NavIconName, IconComponent> = {
  message: MessageFillIcon,
  settings: SettingsFillIcon,
}

type NavIconProps = {
  name: NavIconName
}

export function NavIcon({ name }: NavIconProps) {
  const Icon = icons[name]
  return <Icon width={24} height={24} aria-hidden />
}
