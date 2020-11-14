import {
  Suspense as BaseSuspense,
  SuspenseProps as BaseSuspenseProps,
} from 'react'
import { Box, CircularProgress } from '@chakra-ui/core'

import useMainColor from 'app/hooks/useMainColor'

type SuspenseProps = Omit<BaseSuspenseProps, 'fallback'>

const Progress = ({ color }: { color: string }) => {
  return (
    <Box
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      zIndex={10}
    >
      <CircularProgress isIndeterminate color={color} />
    </Box>
  )
}

const Suspense: React.FC<SuspenseProps> = (props) => {
  const color = useMainColor()
  return <BaseSuspense {...props} fallback={<Progress color={color} />} />
}

export default Suspense
