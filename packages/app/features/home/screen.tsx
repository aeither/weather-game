import { formatTokenBalance } from '@my/api/src/utils'
import {
  Button,
  H1,
  H3,
  Paragraph,
  Text,
  XGroup,
  XStack,
  YStack,
  Toast,
  ToastProvider,
  ToastImperativeProvider,
  useToast,
} from '@my/ui'
import { Cloud, CloudRain, Sun } from '@tamagui/lucide-icons'
import useGaslessOnboarding from 'app/lib/hooks/use-gasless-onboarding'
import useWeatherGame, {
  TOKEN_A_ADDRESS,
  TOKEN_B_ADDRESS,
} from 'app/lib/hooks/use-weather-game'
import ky from 'ky'
import React, { useEffect } from 'react'
import { trpc } from '../../lib/utils/trpc'

const CurrentToast = () => {
  const { currentToast } = useToast()

  if (!currentToast || currentToast.isHandledNatively) return null
  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="bouncy"
    >
      <YStack>
        <Toast.Title>{currentToast.title}</Toast.Title>
        {!!currentToast.message && (
          <Toast.Description>{currentToast.message}</Toast.Description>
        )}
      </YStack>
    </Toast>
  )
}

const ToastButton = () => {
  const toast = useToast()

  return (
    <Button
      onPress={() => {
        toast.show('Successfully saved!', {
          message: "Don't worry, we've got your data.",
        })
      }}
    >
      Single Toast
    </Button>
  )
}

export function HomeScreen() {
  const { login, logout, walletAddress, contractAction, gaslessWallet } =
    useGaslessOnboarding()
  const { swap, approveToken, mintToken, topUpSwapper, predict } =
    useWeatherGame(gaslessWallet)
  const { data, isLoading, error } = trpc.entry.allTokens.useQuery({
    address: walletAddress,
  })
  const createTask = trpc.entry.createTask.useMutation()
  const [open, setOpen] = React.useState(false)
  const timerRef = React.useRef(0)

  const fetchTest = async () => {
    const json = await ky.get('https://relay.gelato.digital/oracles').json()
    console.log('🚀 ~ file: screen.tsx:36 ~ fetchTest ~ json:', json)
  }

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    console.log(data)
  }, [isLoading])

  if (error) {
    return <Paragraph>{error.message}</Paragraph>
  }

  return (
    <ToastProvider>
      <ToastImperativeProvider options={{}}>
        <CurrentToast />
        <YStack f={1} jc="center" ai="center" p="$4" space>
          <YStack space="$4" maw={600} px="$3">
            <XStack jc="center" ai="flex-end" fw="wrap" space="$2" mt="$-2">
              <H1 ta="center" mt="$2">
                Weather Forecaster Game
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

          <ToastButton />

          <XGroup size="$3" $gtSm={{ size: '$5' }}>
            <XGroup.Item>
              <Button
                size="$3"
                icon={Cloud}
                onClick={() => {
                  // predict('Clouds')
                  setOpen(true)
                }}
              >
                Clouds
              </Button>
            </XGroup.Item>
            <XGroup.Item>
              <Button size="$3" icon={CloudRain} onClick={() => predict('Rain')}>
                Rain
              </Button>
            </XGroup.Item>
            <XGroup.Item>
              <Button size="$3" icon={Sun} onClick={() => predict('Clear')}>
                Clear
              </Button>
            </XGroup.Item>
          </XGroup>
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
      </ToastImperativeProvider>
    </ToastProvider>
  )
}
