import { GaslessOnboarding } from '@gelatonetwork/gasless-onboarding'

if (!process.env.NEXT_PUBLIC_RPC) throw new Error('NEXT_PUBLIC_RPC not found')
const NEXT_PUBLIC_RPC = process.env.NEXT_PUBLIC_RPC

if (!process.env.NEXT_PUBLIC_1BALANCE_API_KEY)
  throw new Error('NEXT_PUBLIC_1BALANCE_API_KEY not found')
const NEXT_PUBLIC_1BALANCE_API_KEY = process.env.NEXT_PUBLIC_1BALANCE_API_KEY

export const CONTRACT_ADDRESS = ''

export const gaslessWalletConfig = {
  apiKey: NEXT_PUBLIC_1BALANCE_API_KEY,
}

let origin
if (typeof window !== 'undefined') {
  origin = window.location.origin
}

export const loginConfig = {
  domains: [origin],
  chain: {
    id: 5,
    rpcUrl: NEXT_PUBLIC_RPC,
  },
  openLogin: {
    redirectUrl: origin,
  },
}

export const gaslessOnboarding = new GaslessOnboarding(loginConfig, gaslessWalletConfig)
