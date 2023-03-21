import {
  Anchor,
  Button,
  H1,
  H3,
  Paragraph,
  Separator,
  XStack,
  YStack,
  Image,
} from '@my/ui'
import React, { useEffect } from 'react'
import { useLink } from 'solito/link'
import { trpc } from '../../utils/trpc'
import { SignedIn, SignedOut, useAuth } from '../../utils/clerk'
import ky from 'ky'

export function HomeScreen() {
  const { signOut, userId } = useAuth()
  const userLinkProps = useLink({
    href: '/user/nate',
  })
  const signInLinkProps = useLink({
    href: '/signin',
  })
  const signUpLinkProps = useLink({
    href: '/signup',
  })

  const { data, isLoading, error } = trpc.entry.all.useQuery()

  const fetchTest = async () => {
    const json = await ky.get('https://relay.gelato.digital/oracles').json()
    console.log('🚀 ~ file: screen.tsx:36 ~ fetchTest ~ json:', json)
  }

  useEffect(() => {
    console.log(data)
  }, [isLoading])

  if (error) {
    return <Paragraph>{error.message}</Paragraph>
  }

  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <YStack space="$4" maw={600} px="$3">
        <XStack jc="center" ai="flex-end" fw="wrap" space="$2" mt="$-2">
          <Image
            src="https://raw.githubusercontent.com/chen-rn/CUA/main/apps/nextjs/public/favicon.ico"
            accessibilityLabel="create-universal-app logo"
            width={50}
            height={50}
            mt="$2"
          />
          <H1 ta="center" mt="$2">
            create-universal-app
          </H1>
        </XStack>
      </YStack>

      {/* START */}
      <Button onPress={fetchTest}>Fetch</Button>
      {/* END */}

      <H3 ta="center">Some Demos</H3>
      <YStack p="$2">
        <Paragraph>tRPC Query Demo</Paragraph>
        {data?.map((entry) => (
          <Paragraph opacity={0.5} key={entry.id}>
            {entry.id}
          </Paragraph>
        ))}
      </YStack>

      <XStack space>
        <Button {...userLinkProps} theme={'gray'}>
          User Page(Routing)
        </Button>
      </XStack>

      <SignedOut>
        <XStack space ai="center">
          <Button {...signInLinkProps} theme={'gray'}>
            Sign In(Clerk)
          </Button>
          <Button {...signUpLinkProps} theme={'gray'}>
            Sign Up(Clerk)
          </Button>
        </XStack>
      </SignedOut>

      <SignedIn>
        <Button
          onPress={() => {
            signOut()
          }}
          theme={'red'}
        >
          Sign Out
        </Button>
      </SignedIn>
    </YStack>
  )
}
