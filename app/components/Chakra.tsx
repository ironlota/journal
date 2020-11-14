import {
  ChakraProvider,
  ChakraProviderProps,
  cookieStorageManager,
  localStorageManager,
  extendTheme,
} from '@chakra-ui/core'
import { ReactNode } from 'react'

interface ChakraProps extends ChakraProviderProps {
  cookies?: string
  children: ReactNode
}

const theme = extendTheme({
  fonts: {
    // body: 'system-ui, sans-serif',
    journal: 'Lato, sans-serif',
    // heading: 'Lato, serif',
    // mono: 'Menlo, monospace',
  },
  styles: {
    global: {
      'html, body, body > div:first-child, div#__next, div#__next > div, div#__next > div > div': {
        height: 'full',
      },
    },
  },
})

export const Chakra = ({ children, cookies, ...props }: ChakraProps) => {
  return (
    <ChakraProvider
      {...props}
      colorModeManager={
        cookies ? cookieStorageManager(cookies) : localStorageManager
      }
      theme={theme}
    >
      {children}
    </ChakraProvider>
  )
}

export default Chakra
