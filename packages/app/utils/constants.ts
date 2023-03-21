import { GaslessOnboarding } from '@gelatonetwork/gasless-onboarding'

if (!process.env.NEXT_PUBLIC_RPC) throw new Error('NEXT_PUBLIC_RPC not found')
const NEXT_PUBLIC_RPC = process.env.NEXT_PUBLIC_RPC

export const CONTRACT_ADDRESS = ''

export const gaslessWalletConfig = {
  apiKey: process.env.NEXT_PUBLIC_GASLESSWALLET_KEY,
}

let origin
if (typeof window !== 'undefined') {
  origin = window.location.origin
}

export const loginConfig = {
  domains: ['http://localhost:3000/', origin],
  chain: {
    id: 5,
    rpcUrl: NEXT_PUBLIC_RPC,
  },
  openLogin: {
    redirectUrl: `http://localhost:3000/`,
  },
}

export const gaslessOnboarding = new GaslessOnboarding(loginConfig, gaslessWalletConfig)
