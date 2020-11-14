/**
 * MIT License
 *
 * Copyright (c) 2020 Mustafa Turhan
 * Modified by Ray Andrew <raydreww@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * sSOFTWARE.
 */

import React from 'react'
import gfm from 'remark-gfm'

import {
  Text,
  Code,
  Divider,
  List,
  Checkbox,
  ListItem,
  Heading,
  Image,
} from '@chakra-ui/core'
import ReactMarkdown, { CustomReactMarkdownProps } from 'react-markdown'

import Table from './Table'

import Link from './ExternalLink'

function getCoreProps(props) {
  return props['data-sourcepos']
    ? { 'data-sourcepos': props['data-sourcepos'] }
    : {}
}

export type Renderers = { [nodeType: string]: React.ElementType }

export const defaultOpts: Renderers = {
  paragraph: (props) => {
    const { children } = props
    return (
      <Text mb={2} fontFamily="journal">
        {children}
      </Text>
    )
  },
  emphasis: (props) => {
    const { children } = props
    return (
      <Text as="em" fontFamily="journal">
        {children}
      </Text>
    )
  },
  blockquote: (props) => {
    const { children } = props
    return (
      <Code p={2} fontFamily="journal">
        {children}
      </Code>
    )
  },
  code: (props) => {
    const { language, value } = props
    const className = language && `language-${language}`
    return (
      <pre {...getCoreProps(props)}>
        <Code p={2} className={className}>
          {value}
        </Code>
      </pre>
    )
  },
  delete: (props) => {
    const { children } = props
    return (
      <Text as="del" fontFamily="journal">
        {children}
      </Text>
    )
  },
  thematicBreak: () => <Divider my={4} />,
  link: Link,
  img: Image,
  linkReference: Link,
  imageReference: Image,
  text: (props) => {
    const { children } = props
    return (
      <Text as="span" fontFamily="journal">
        {children}
      </Text>
    )
  },
  list: (props) => {
    const { start, ordered, children, depth } = props
    const attrs = getCoreProps(props) as any
    if (start !== null && start !== 1 && start !== undefined) {
      attrs.start = start.toString()
    }
    let styleType = 'disc'
    if (ordered) styleType = 'decimal'
    if (depth === 1) styleType = 'circle'
    return (
      <List
        spacing={4}
        as={ordered ? 'ol' : 'ul'}
        styleType={styleType}
        pl={4}
        {...attrs}
      >
        {children}
      </List>
    )
  },
  listItem: (props) => {
    const { children, checked } = props
    let checkbox: React.ReactNode | null = null
    if (checked !== null && checked !== undefined) {
      checkbox = (
        <Checkbox isChecked={checked} isReadOnly>
          {children}
        </Checkbox>
      )
    }
    return (
      <ListItem
        {...getCoreProps(props)}
        listStyleType={checked !== null ? 'none' : 'inherit'}
      >
        {checkbox || children}
      </ListItem>
    )
  },
  definition: () => null,
  heading: (props) => {
    const { level, children } = props
    // const sizes = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs']
    const sizes = ['24px', '20px', '18px', '18px', '18px', '18px']
    return (
      <Heading
        as={`h${level}` as any}
        my={4}
        fontWeight="semibold"
        fontFamily="journal"
        fontSize={sizes[`${level - 1}`]}
        // size={sizes[`${level - 1}`]}
        textTransform="uppercase"
        {...getCoreProps(props)}
      >
        {children}
      </Heading>
    )
  },
  inlineCode: (props) => {
    const { children } = props
    return <Code {...getCoreProps(props)}>{children}</Code>
  },
  table: Table,
  tableHead: Table.Head,
  tableBody: Table.Body,
  tableRow: Table.Row,
  tableCell: Table.Cell,
}

function ChakraUIRenderer(theme = defaultOpts): Renderers {
  return {
    paragraph: theme.paragraph,
    emphasis: theme.emphasis,
    blockquote: theme.blockquote,
    code: theme.code,
    delete: theme.delete,
    thematicBreak: theme.thematicBreak,
    link: theme.link,
    img: theme.img,
    linkReference: theme.linkReference,
    imageReference: theme.imageReference,
    text: theme.text,
    list: theme.list,
    listItem: theme.listItem,
    definition: theme.definition,
    heading: theme.heading,
    inlineCode: theme.inlineCode,
    table: theme.table,
    tableHead: theme.tableHead,
    tableBody: theme.tableBody,
    tableRow: theme.tableRow,
    tableCell: theme.tableCell,
  }
}

export const Markdown = ({
  children,
  ...props
}: Omit<CustomReactMarkdownProps, 'renderers'> & {
  children: string
}) => {
  return (
    <ReactMarkdown
      {...props}
      plugins={[...(props.plugins || []), gfm]}
      renderers={ChakraUIRenderer()}
    >
      {children}
    </ReactMarkdown>
  )
}

export default Markdown
