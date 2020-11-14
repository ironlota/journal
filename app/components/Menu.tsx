import React from 'react'

import { Box, Button } from '@chakra-ui/core'

import Link from './Link'
import ExternalLink from './ExternalLink'

interface MenuItemProps {
  href: string
  isExternal?: boolean
}

const MenuItem: React.FC<MenuItemProps> = ({
  children,
  isExternal = false,
  href,
}) => {
  const Component = isExternal ? ExternalLink : Link

  return (
    <Component href={href} display="flex" mx={2} mt={{ base: 4, md: 0 }}>
      {/* <Text display="block"> */}
      {children}
      {/* </Text> */}
    </Component>
  )
}

export type MenuProps = { show: boolean; authorized: boolean }

const Menu = ({ show, authorized }: MenuProps) => {
  return authorized ? (
    <Box
      display={{ base: show ? 'block' : 'none', md: 'flex' }}
      width={{ base: 'full', md: 'auto' }}
      alignItems="center"
      flexGrow={1}
    >
      <MenuItem href="https://blog.rayandrew.me" isExternal>
        Blog
      </MenuItem>
      <MenuItem href="https://publications.rayandrew.me" isExternal>
        Publications
      </MenuItem>
      {/* <MenuItem href="https://todo.rayandrew.me" isExternal>
        To-Do
      </MenuItem> */}
      <MenuItem href="https://dev-diary.rayandrew.me" isExternal>
        Dev Diary
      </MenuItem>
      <MenuItem href="/tags">Tags</MenuItem>
      {/* <Box align="center"></Box> */}
      <Box display={{ base: 'flex', md: 'none' }}>
        <Link href="/api/logout">
          <Button as="div" mt={4}>
            <strong>LOGOUT</strong>
          </Button>
        </Link>
      </Box>
    </Box>
  ) : null
}

export default Menu
