import { formatTokenBalance } from '@my/api/src/utils'
import { Button, Card, H1, H2, Image, Paragraph, XGroup, XStack, YStack } from '@my/ui'
import { Cloud, CloudRain, Sun } from '@tamagui/lucide-icons'
import useGaslessOnboarding from 'app/lib/hooks/use-gasless-onboarding'
import useWeatherGame from 'app/lib/hooks/use-weather-game'
import ky from 'ky'
import React, { useEffect } from 'react'
import { trpc } from '../../lib/utils/trpc'

function formatAddress(address) {
  if (!address) {
    return ''
  }

  const prefix = address.slice(0, 6)
  const suffix = address.slice(-4)

  return `${prefix}...${suffix}`
}

export function HomeScreen() {
  const { login, logout, walletAddress, gaslessWallet } = useGaslessOnboarding()
  const { swap, approveToken, mintToken, topUpSwapper, predict } =
    useWeatherGame(gaslessWallet)
  const { data, isLoading, error } = trpc.entry.allTokens.useQuery(
    {
      address: walletAddress,
    },
    { enabled: !!walletAddress }
  )

  const [countdown, setCountdown] = React.useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()
      const remainingSeconds = (60 - minutes - 1) * 60 + (60 - seconds)
      setCountdown(remainingSeconds)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    console.log(data)
  }, [isLoading])

  if (error) {
    return <Paragraph>{error.message}</Paragraph>
  }

  return (
    <YStack f={1} jc="center" ai="center" p="$4" space>
      <YStack space="$4" maw={600} px="$3" pt="$10">
        <XStack jc="center" ai="flex-end" fw="wrap" space="$2" mt="$-2">
          <H1 ta="center" mt="$2">
            Weather Forecaster Game
          </H1>
        </XStack>
      </YStack>

      <>
        {walletAddress ? (
          <>
            <YStack space="$2" br={'$4'} bc="$gray3" p="$4" ai={'center'}>
              <Paragraph size="$2" fow="800">
                {formatAddress(walletAddress)}
              </Paragraph>
              {data?.map((token) => (
                <>
                  <Paragraph>Reward Amount: </Paragraph>
                  <Paragraph>{formatTokenBalance(token.balance)} WTG</Paragraph>
                </>
              ))}
              <XStack space="$2" ai="center">
                <Button onPress={logout} theme={'gray'}>
                  logout
                </Button>
              </XStack>
            </YStack>
          </>
        ) : (
          <>
            <YStack space="$2" br={'$4'} bc="$gray3" p="$4" ai={'center'}>
              <Paragraph>{'Login with your email to get started'}</Paragraph>
              <XStack space="$2" ai="center">
                <Button onPress={login} theme={'yellow'}>
                  login
                </Button>
              </XStack>
            </YStack>
          </>
        )}
      </>

      <XGroup size="$3" $gtSm={{ size: '$5' }}>
        <XGroup.Item>
          <Button
            size="$3"
            icon={Cloud}
            onClick={() => {
              predict('Clouds')
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

      <Card
        theme="dark"
        elevate
        animation="bouncy"
        hoverStyle={{ scale: 0.975 }}
        bordered
        size="$5"
        w={250}
        h={300}
      >
        <Card.Header padded>
          <H2>London</H2>
          <Paragraph theme="alt1">Current</Paragraph>
        </Card.Header>
        <Card.Footer padded>
          <XStack f={1} />
          <Button br="$10">{formatTime(countdown)}</Button>
        </Card.Footer>
        <Card.Background>
          <Image
            pos="absolute"
            width={300}
            height={300}
            resizeMode="cover"
            als="center"
            src="https://images.unsplash.com/photo-1517758478390-c89333af4642?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1467&q=80"
          />
        </Card.Background>
      </Card>
    </YStack>
  )
}
