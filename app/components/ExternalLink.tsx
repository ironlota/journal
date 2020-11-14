import { Link, LinkProps, Icon } from '@chakra-ui/core'
import { FiExternalLink } from 'react-icons/fi'

export default function ExternalLink({
  children,
  ...props
}: Omit<LinkProps, 'isExternal'>) {
  return (
    <Link {...props} isExternal display="flex">
      {children}
      <Icon as={FiExternalLink} ml={2} mt={1} boxSize={4} />
    </Link>
  )
}
