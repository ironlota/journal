import React from 'react'

import { Tag } from 'db'

import {
  Box,
  Flex,
  Input,
  FormControl,
  FormLabel,
  IconButton,
  BoxProps,
  List,
  ListItem,
  Tag as TagC,
  TagLabel,
  TagCloseButton,
  useColorMode,
  Text,
} from '@chakra-ui/core'

import { mode } from '@chakra-ui/theme-tools'

import { useMultipleSelection, useCombobox } from 'downshift'

import { AiOutlineCaretDown } from 'react-icons/ai'

// import useMainColor from 'app/hooks/useMainColor'

// import Link from 'app/components/Link'

// type Item<T> = {
//   label: string
//   value: T
// }

type JournalSelectTagsProps = {
  name: string
  label?: string
  items: Tag[]
  value: Tag[]
  onChange: (values: Tag[]) => void
}

function JournalSelectTags({
  name,
  label,
  items,
  value = [],
  onChange,
  ...props
}: JournalSelectTagsProps & BoxProps) {
  const onChangeCb = React.useCallback((values: Tag[]) => onChange(values), [
    onChange,
  ])

  // const color = useMainColor()
  const colorModeValue = useColorMode()

  const listBg = mode('gray.100', 'whiteAlpha.200')(colorModeValue)

  const [inputValue, setInputValue] = React.useState('')
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection<Tag>({
    initialSelectedItems: value,
    onSelectedItemsChange: ({ selectedItems }) => {
      onChangeCb(selectedItems || [])
    },
  })

  const getFilteredItems = (_items: Tag[]) =>
    items.filter(
      (item) =>
        !selectedItems.find((it) => it.name === item.name) &&
        item.name.toLowerCase().startsWith(inputValue.toLowerCase()),
    )

  const filteredItems = getFilteredItems(items)

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    // getMenuProps,
    getInputProps,
    getComboboxProps,
    // highlightedIndex,
    getItemProps,
    // selectItem,
  } = useCombobox({
    inputValue,
    items: filteredItems,
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          setInputValue(inputValue!)
          break
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (selectedItem) {
            setInputValue('')
            addSelectedItem(selectedItem)
            // selectItem({})
          }

          break
        default:
          break
      }
    },
  })
  return (
    <Box {...props}>
      <FormControl id={name}>
        {label && (
          <FormLabel mb={4} {...getLabelProps()}>
            {label}
          </FormLabel>
        )}
        <Box>
          {selectedItems.length > 0 && (
            <Box mb={4}>
              {selectedItems.map((selectedItem, index) => {
                const tagColor =
                  colorModeValue.colorMode === 'dark'
                    ? selectedItem.darkColor
                    : selectedItem.lightColor

                return (
                  <TagC
                    {...getSelectedItemProps({ selectedItem })}
                    key={`${selectedItem.name}-${selectedItem.id}-${index}`}
                    textTransform="uppercase"
                    size="lg"
                    borderRadius="full"
                    variant="solid"
                    mt={2}
                    mr={2}
                    color={tagColor}
                    bg={listBg}
                    _hover={{
                      bg: mode('gray.200', 'whiteAlpha.300')(colorModeValue),
                    }}
                  >
                    <TagLabel>{selectedItem.name}</TagLabel>
                    <TagCloseButton
                      onClick={() => removeSelectedItem(selectedItem)}
                    />
                  </TagC>
                )
              })}
            </Box>
          )}
          <Flex {...getComboboxProps()} direction="row" align="center">
            <Input
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
              mr={2}
            />
            <IconButton
              {...getToggleButtonProps()}
              aria-label="toggle menu"
              icon={<AiOutlineCaretDown />}
            />
          </Flex>
        </Box>
        {isOpen && (
          <List
            // {...getMenuProps({ ref })}
            spacing={4}
            bg={listBg}
            borderRadius="lg"
          >
            {filteredItems.map((item, index) => (
              <ListItem
                {...getItemProps({ item, index })}
                key={`${item}${index}`}
                mt={index === 0 ? 2 : 0}
                textTransform="uppercase"
                _hover={{
                  bg: mode('gray.200', 'whiteAlpha.300')(colorModeValue),
                  borderRadius: 'md',
                }}
              >
                <Text ml={4} py={2}>
                  {item.name}
                </Text>
              </ListItem>
            ))}
          </List>
        )}
      </FormControl>
    </Box>
  )
}

export default JournalSelectTags
