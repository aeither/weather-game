import { Button, H1, H3, Image, Paragraph, Text, XStack, YStack } from '@my/ui'
import useGO from 'app/hooks/use-go'
import ky from 'ky'
import React, { useEffect } from 'react'
import { useLink } from 'solito/link'
import { trpc } from '../../utils/trpc'

export function HomeScreen() {
  const userLinkProps = useLink({
    href: '/user/nate',
  })

  const { login, logout, walletAddress } = useGO()
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

      <Text>{walletAddress || 'Connect'}</Text>

      <XStack space ai="center">
        <Button onPress={login} theme={'gray'}>
          login
        </Button>
        <Button onPress={logout} theme={'gray'}>
          logout
        </Button>
      </XStack>
    </YStack>
  )
}
