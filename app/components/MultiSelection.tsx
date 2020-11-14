import React from 'react'

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
} from '@chakra-ui/core'

import { useMultipleSelection, useCombobox } from 'downshift'

import { AiOutlineCaretDown } from 'react-icons/ai'

type Item<T> = {
  label: string
  value: T
}

type MultiSelectionProps<T, U extends Item<T>> = {
  name: string
  items: U[]
}

function MultiSelection<T, U extends Item<T> = Item<T>>({
  name,
  items,
  ...props
}: MultiSelectionProps<T, U> & BoxProps) {
  //   const items = React.useMemo(() => [...defItems, { label: '', value: '' }], [
  //     defItems,
  //   ])
  const [inputValue, setInputValue] = React.useState('')
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection<U>({})

  const getFilteredItems = (_items: U[]) =>
    items.filter(
      (item) =>
        selectedItems.indexOf(item) < 0 &&
        item.label.toLowerCase().startsWith(inputValue.toLowerCase()),
    )

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useCombobox({
    inputValue,
    items: getFilteredItems(items),
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
            // selectItem(null)
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
        <FormLabel {...getLabelProps()}>Choose some elements:</FormLabel>
        <div>
          {selectedItems.map((selectedItem, index) => (
            <TagC
              key={`selected-item-${index}`}
              size="lg"
              borderRadius="full"
              variant="solid"
              mb={2}
              mr={2}
              // colorScheme="green"
            >
              <TagLabel>{selectedItem.label}</TagLabel>
              <TagCloseButton
                onClick={() => removeSelectedItem(selectedItem)}
              />
            </TagC>
            // <span
            //   // style={selectedItemStyles}
            //   key={`selected-item-${index}`}
            //   {...getSelectedItemProps({ selectedItem, index })}
            // >
            //   {selectedItem.label}
            //   <span
            //     // style={selectedItemIconStyles}
            //     onClick={() => removeSelectedItem(selectedItem)}
            //   >
            //     &#10005;
            //   </span>
            // </span>
          ))}
          <Flex {...getComboboxProps()} direction="row" align="center">
            <Input
              {...getInputProps(getDropdownProps({ preventKeyAction: isOpen }))}
              mr={2}
            />
            <IconButton
              {...getToggleButtonProps()}
              aria-label="toggle menu"
              icon={<AiOutlineCaretDown />}
              // mb={1}
            />
          </Flex>
        </div>
        <List {...getMenuProps()} spacing={2}>
          {isOpen &&
            getFilteredItems(items).map((item, index) => (
              <ListItem
                style={
                  highlightedIndex === index
                    ? { backgroundColor: '#bde4ff' }
                    : {}
                }
                key={`${item}${index}`}
                {...getItemProps({ item, index })}
              >
                {item.label}
              </ListItem>
            ))}
        </List>
      </FormControl>
    </Box>
  )
}

export default MultiSelection
