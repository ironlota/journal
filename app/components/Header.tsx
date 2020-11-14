import React from 'react'
import {
  Box,
  Button,
  Heading,
  Flex,
  FlexProps,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/core'

import { GiHamburgerMenu } from 'react-icons/gi'

import useMainColor from 'app/hooks/useMainColor'
import { useCurrentUser } from 'app/hooks/useCurrentUser'

import Logo from './Logo'
import ThemeToggler from './ThemeToggler'
import Menu from './Menu'
import Link from './Link'

const Header = (props: FlexProps) => {
  // const borderColor = useColorModeValue('gray.400', 'gray.300')
  const color = useMainColor()

  const currentUser = useCurrentUser()

  const [show, setShow] = React.useState(false)
  const handleToggle = React.useCallback(() => setShow(!show), [show, setShow])

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 6 }}
      // padding={{ base: 4, md: 0 }}
      borderBottomWidth="1px"
      // borderColor={borderColor}
      color={color}
      {...props}
    >
      <Link
        href="/"
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Flex align="center" ml="8px" mr={6}>
          <Logo w="32px" h="32px" mr="12px" />
          <Heading as="h1" size="lg" fontSize="22px" letterSpacing="-.05rem">
            RAY ANDREW
          </Heading>
        </Flex>
      </Link>

      <Box display={{ base: 'flex', md: 'none' }}>
        <ThemeToggler mr={currentUser ? 3 : 0} />

        {currentUser && (
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={handleToggle}
            icon={<GiHamburgerMenu />}
            aria-label="menu"
            variant="outlined"
            color={color}
          />
        )}
      </Box>

      <Menu show={show} authorized={!!currentUser} />

      {currentUser && (
        <Box display={{ base: 'none', md: 'flex' }}>
          <Link href="/api/logout">
            <Button as="div">
              <strong>LOGOUT</strong>
            </Button>
          </Link>
        </Box>
      )}

      <Box
        display={{ base: 'none', md: 'flex' }}
        // mt={{ base: 4, md: 0 }}
        ml="8px"
      >
        <ThemeToggler />
      </Box>
    </Flex>
  )
}

export default Header
