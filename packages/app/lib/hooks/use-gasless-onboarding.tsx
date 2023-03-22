import { GaslessWalletInterface } from '@gelatonetwork/gasless-onboarding'
import { GaslessWallet } from '@gelatonetwork/gasless-wallet'
import { SafeEventEmitterProvider } from '@web3auth/base'
import { CONTRACT_ADDRESS, gaslessOnboarding, NFT_ABI } from 'app/lib/utils/constants'
import { Contract, ethers, utils } from 'ethers'
import { useEffect, useState } from 'react'

export default function useGaslessOnboarding() {
  const [walletAddress, setWalletAddress] = useState<string>()
  const [gaslessWallet, setGaslessWallet] = useState<GaslessWallet>()
  const [web3AuthProvider, setWeb3AuthProvider] =
    useState<SafeEventEmitterProvider | null>(null)
  const [contract, setContract] = useState<Contract | null>(null)

  const login = async () => {
    try {
      await gaslessOnboarding.init()
      const provider = await gaslessOnboarding.login()
      if (provider) {
        setWeb3AuthProvider(provider)
      }

      const gaslessWallet: GaslessWalletInterface = gaslessOnboarding.getGaslessWallet()
      if (!gaslessWallet.isInitiated()) await gaslessWallet.init()
      const address = gaslessWallet.getAddress()
      setGaslessWallet(gaslessWallet)
      setWalletAddress(address)
    } catch (error) {
      console.log(error)
    }
  }

  const logout = async () => {
    await gaslessOnboarding?.logout()

    setWeb3AuthProvider(null)
    setGaslessWallet(undefined)
    setWalletAddress(undefined)
  }

  const contractAction = async () => {
    if (!gaslessWallet) return
    try {
      // const CONTRACT_ABI = ['function store(uint256)']
      // let IContract = new utils.Interface(CONTRACT_ABI)
      // let txData = IContract.encodeFunctionData('store', [BigInt(111)])
      // const { taskId } = await gaslessWallet.sponsorTransaction(CONTRACT_ADDRESS, txData)

      const txData = await contract?.populateTransaction['store']?.(100)
      if (!txData?.data) return
      let tx = await gaslessWallet?.sponsorTransaction(CONTRACT_ADDRESS, txData?.data)
      console.log(`https://relay.gelato.digital/tasks/status/${tx?.taskId}`)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!web3AuthProvider) return
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      NFT_ABI,
      new ethers.providers.Web3Provider(web3AuthProvider).getSigner()
    )
    setContract(contract)
  }, [web3AuthProvider])

  return {
    login,
    logout,
    walletAddress,
    contractAction,
  }
}
