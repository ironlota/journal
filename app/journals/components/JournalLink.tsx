import { Text } from '@chakra-ui/core'

import Link, { LinkProps } from 'app/components/Link'

export default function JournalLink({ children, ...props }: LinkProps) {
  return (
    <Link {...props} mb={{ base: 2, md: 0 }}>
      <Text as="time" fontSize="lg">
        {children}
      </Text>
    </Link>
  )
}
