import { useColorMode, IconButton, IconButtonProps } from '@chakra-ui/core'
import { HiMoon, HiSun } from 'react-icons/hi'

import useMainColor from 'app/hooks/useMainColor'

export default function ThemeToggler(
  props: Omit<IconButtonProps, 'aria-label'>,
) {
  const { colorMode, toggleColorMode } = useColorMode()
  const color = useMainColor()

  return (
    <IconButton
      {...props}
      aria-label="toggle"
      icon={colorMode === 'light' ? <HiMoon /> : <HiSun />}
      onClick={toggleColorMode}
      color={color}
      variant="ghost"
    />
  )
}
