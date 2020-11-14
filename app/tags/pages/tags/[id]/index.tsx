import React from 'react'

import { useQuery, useParam, CustomBlitzPage } from 'blitz'

import { getServerSideProps as baseGetServerSideProps } from 'utils/server'

import getTag from 'app/tags/queries/getTag'

import Layout from 'app/layouts/Layout'

import TagEntry from 'app/tags/components/TagEntry'

type TagProps = {
  id: number
}

const Tag = ({ id }: TagProps) => {
  const [tag] = useQuery(getTag, { where: { id } })

  return <TagEntry tag={tag} />
}

const ShowTagPage: CustomBlitzPage = ({ cookies }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const id = useParam('id', 'number')!

  return (
    <Layout title={`Tag id: ${id}`} cookies={cookies}>
      <Tag id={id} />
    </Layout>
  )
}

export const getServerSideProps = baseGetServerSideProps

export default ShowTagPage
