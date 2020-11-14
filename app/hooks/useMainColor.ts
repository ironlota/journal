import { useColorModeValue } from '@chakra-ui/core'

import * as colors from 'app/colors'

export function useMainColor() {
  const currentColor = useColorModeValue(colors.MAIN_LIGHT, colors.MAIN_DARK)
  return currentColor
}

export function useInvertMainColor() {
  const currentColor = useColorModeValue(colors.MAIN_DARK, colors.MAIN_LIGHT)
  return currentColor
}

export default useMainColor
