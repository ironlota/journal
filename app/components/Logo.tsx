import { Box, BoxProps } from '@chakra-ui/core'

import { IconBaseProps } from 'react-icons/lib'
import { GiBookmark } from 'react-icons/gi'

import useMainColor from 'app/hooks/useMainColor'

type LogoProps = BoxProps & Omit<IconBaseProps, 'size'>

const Logo = (props: LogoProps) => {
  const color = useMainColor()
  return <Box {...props} as={GiBookmark} color={color} />
}

export default Logo
