import config from '../tamagui.config'
import { TamaguiProvider, TamaguiProviderProps } from '@my/ui'
import { TRPCProvider } from './trpc' //mobile only
import { configureChains, createClient, mainnet, WagmiConfig } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import React, { useState, useEffect } from 'react'

const { provider, webSocketProvider } = configureChains(
  [mainnet, polygonMumbai],
  [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})

function ClientOnly({ children }: { children: React.ReactNode }) {
  // State / Props
  const [hasMounted, setHasMounted] = useState(false)

  // Hooks
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Render
  if (!hasMounted) return null

  return <div>{children}</div>
}

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  return (
    <TamaguiProvider config={config} disableInjectCSS defaultTheme="light" {...rest}>
      <ClientOnly>
        <WagmiConfig client={client}>
          <TRPCProvider>{children}</TRPCProvider>
        </WagmiConfig>
      </ClientOnly>
    </TamaguiProvider>
  )
}
