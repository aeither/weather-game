import { formatTokenBalance } from '@my/api/src/utils'
import { Button, H1, H3, Image, Paragraph, Text, XStack, YStack } from '@my/ui'
import useGaslessOnboarding from 'app/lib/hooks/use-gasless-onboarding'
import useSwapper, { TOKEN_A_ADDRESS, TOKEN_B_ADDRESS } from 'app/lib/hooks/use-swapper'
import { BigNumber, utils } from 'ethers'
import ky from 'ky'
import React, { useEffect } from 'react'
import { useLink } from 'solito/link'
import { trpc } from '../../lib/utils/trpc'

export function HomeScreen() {
  const userLinkProps = useLink({
    href: '/user/nate',
  })

  const { login, logout, walletAddress, contractAction, gaslessWallet } =
    useGaslessOnboarding()
  const { swap, approveToken, mintToken, topUpSwapper } = useSwapper(gaslessWallet)
  const { data, isLoading, error } = trpc.entry.allTokens.useQuery()
  console.log('🚀 ~ file: screen.tsx:20 ~ HomeScreen ~ data:', data)
  const createTask = trpc.entry.createTask.useMutation()

  // const { data: tokenAmounts, isLoading: isLoadingTokenAmounts } = useContractReads({
  //   contracts: [
  //     {
  //       address: TOKEN_A_ADDRESS,
  //       abi: ['function balanceOf(address)'],
  //       functionName: 'balanceOf',
  //       chainId: polygonMumbai.id,
  //       args: [walletAddress],
  //     },
  //     {
  //       address: TOKEN_B_ADDRESS,
  //       abi: ['function balanceOf(address)'],
  //       functionName: 'balanceOf',
  //       chainId: polygonMumbai.id,
  //       args: [walletAddress],
  //     },
  //   ],
  // })
  console.log('🚀 ~ file: screen.tsx:39 ~ HomeScreen ~ tokenAmounts:', data)

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
      {data?.map((token) => (
        <>
          <Text>{token.name}</Text>
          <Text>{formatTokenBalance(token.balance)}</Text>
        </>
      ))}

      <Button onPress={fetchTest}>Fetch gelato oracles</Button>
      <Button onPress={contractAction}>gasless remix store action</Button>
      <Button
        onPress={async () => {
          const { taskId, tx } = await createTask.mutateAsync()
        }}
      >
        Create Task
      </Button>

      {walletAddress && (
        <>
          <Button onPress={() => mintToken(TOKEN_A_ADDRESS, walletAddress)}>
            Mint Token A
          </Button>
          <Button onPress={() => mintToken(TOKEN_B_ADDRESS, walletAddress)}>
            Mint Token B
          </Button>
        </>
      )}
      <Button onPress={() => approveToken(TOKEN_A_ADDRESS)}>Approve Token A</Button>
      <Button onPress={() => approveToken(TOKEN_B_ADDRESS)}>Approve Token B</Button>
      <Button
        onPress={() => {
          swap(20)
        }}
      >
        Swap
      </Button>
      <Button onPress={() => topUpSwapper(TOKEN_A_ADDRESS)}>Top Up Token A</Button>
      <Button onPress={() => topUpSwapper(TOKEN_B_ADDRESS)}>Top Up Token B</Button>
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
