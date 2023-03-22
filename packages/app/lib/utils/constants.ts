import {
  GaslessOnboarding,
  GaslessWalletConfig,
  GaslessWalletInterface,
  LoginConfig,
} from '@gelatonetwork/gasless-onboarding'

if (!process.env.NEXT_PUBLIC_RPC) throw new Error('NEXT_PUBLIC_RPC not found')
const NEXT_PUBLIC_RPC = process.env.NEXT_PUBLIC_RPC

if (!process.env.NEXT_PUBLIC_1BALANCE_API_KEY)
  throw new Error('NEXT_PUBLIC_1BALANCE_API_KEY not found')
const NEXT_PUBLIC_1BALANCE_API_KEY = process.env.NEXT_PUBLIC_1BALANCE_API_KEY

// export const CONTRACT_ADDRESS = '0x5CE7a9550Fb049E19a9AB02D6fE210624BEa9822' // goerli
export const CONTRACT_ADDRESS = '0x23685Fcf721Da8D86c59D651db1E5251B0169446' //mumbai

let origin
if (typeof window !== 'undefined') {
  origin = window.location.origin
}

export const loginConfig: LoginConfig = {
  domains: [origin],
  chain: {
    // id: 5, // eth-goerli
    id: 80001, // polygon-mumbai
    rpcUrl: NEXT_PUBLIC_RPC,
  },
  openLogin: {
    redirectUrl: origin,
  },
}

export const gaslessWalletConfig: GaslessWalletConfig = {
  apiKey: NEXT_PUBLIC_1BALANCE_API_KEY,
}

export const gaslessOnboarding = new GaslessOnboarding(loginConfig, gaslessWalletConfig)

export const NFT_ABI = [
  {
    inputs: [],
    name: 'retrieve',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'num',
        type: 'uint256',
      },
    ],
    name: 'store',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
