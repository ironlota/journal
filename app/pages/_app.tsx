import React from 'react'

import { AppProps, ErrorComponent, useRouter, Router } from 'blitz'

import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { queryCache } from 'react-query'

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  return (
    <>
      <ErrorBoundary
        FallbackComponent={RootErrorFallback}
        resetKeys={[router.asPath]}
        onReset={() => {
          // This ensures the Blitz useQuery hooks will automatically refetch
          // data any time you reset the error boundary
          queryCache.resetErrorBoundaries()
        }}
      >
        {getLayout(<Component {...pageProps} />)}
      </ErrorBoundary>
    </>
  )
}

const RedirectToLogin = React.memo(({ callback }: { callback: () => void }) => {
  const cb = React.useCallback(callback, [callback])
  React.useEffect(() => {
    Router.push('/api/auth')

    return () => {
      cb()
    }
  }, [cb])
  return null
})

const RedirectTo404 = React.memo(({ callback }: { callback: () => void }) => {
  const cb = React.useCallback(callback, [callback])
  React.useEffect(() => {
    Router.replace('/404')

    return () => {
      cb()
    }
  }, [cb])
  return null
})

const RedirectTo403 = React.memo(({ callback }: { callback: () => void }) => {
  const cb = React.useCallback(callback, [callback])
  React.useEffect(() => {
    Router.replace('/403')

    return () => {
      cb()
    }
  }, [cb])
  return null
})

function RootErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  if (error?.name === 'AuthenticationError') {
    return <RedirectToLogin callback={resetErrorBoundary} />
  } else if (error?.name === 'AuthorizationError') {
    return (
      // <ErrorComponent
      //   statusCode={(error as any).statusCode}
      //   title="Sorry, you are not authorized to access this"
      // />
      <RedirectTo403 callback={resetErrorBoundary} />
    )
  } else {
    return (
      <RedirectTo404 callback={resetErrorBoundary} />
      // <ErrorComponent
      //   statusCode={(error as any)?.statusCode || 400}
      //   title={error?.message || error?.name}
      // />
    )
  }
}
