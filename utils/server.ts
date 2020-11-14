import { GetServerSidePropsContext } from 'next'

export function redirect404(res: GetServerSidePropsContext['res']) {
  if (res.headersSent) return
  res.statusCode = 302
  res.setHeader('Location', '/404')
  res.end()
}

export type ServerSideProps<T> = { props: T } | Promise<{ props: T }>

export function getCookies(
  req: GetServerSidePropsContext['req'],
): string | undefined {
  return req.headers.cookie ?? ''
}

export function getServerSideProps({
  req,
}: GetServerSidePropsContext): ServerSideProps<{ cookies?: string }> {
  return {
    props: {
      cookies: getCookies(req),
    },
  }
}
