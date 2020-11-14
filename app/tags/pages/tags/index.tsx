import React from 'react'
import { CustomBlitzPage } from 'blitz'

import Layout from 'app/layouts/Layout'

import { getServerSideProps as baseGetServerSideProps } from 'utils/server'

import TagListPagination from 'app/tags/components/TagListPagination'

const TagsIndex: CustomBlitzPage = ({ cookies }) => {
  return (
    <Layout title="Tags" cookies={cookies}>
      <TagListPagination pathname="/tags" />
    </Layout>
  )
}

export const getServerSideProps = baseGetServerSideProps

export default TagsIndex
