import {
  GaslessOnboarding,
  GaslessWalletInterface,
} from '@gelatonetwork/gasless-onboarding'
import { GaslessWallet } from '@gelatonetwork/gasless-wallet'
import { CONTRACT_ADDRESS, gaslessOnboarding } from 'app/lib/utils/constants'
import { utils } from 'ethers'
import { useState } from 'react'

export default function useGaslessOnboarding() {
  const [walletAddress, setWalletAddress] = useState<string>()
  const [gaslessWallet, setGaslessWallet] = useState<GaslessWallet>()

  const login = async () => {
    try {
      await gaslessOnboarding.init()
      await gaslessOnboarding.login()

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

    setGaslessWallet(undefined)
    setWalletAddress(undefined)
  }

  const contractAction = async () => {
    if (!gaslessWallet) return
    try {
      const CONTRACT_ABI = ['function store(uint256)']
      let IContract = new utils.Interface(CONTRACT_ABI)
      let txData = IContract.encodeFunctionData('store', [BigInt(111)])
      console.log(
        '🚀 ~ file: use-gasless-onboarding.tsx:43 ~ contractAction ~ txData:',
        txData
      )

      const { taskId } = await gaslessWallet.sponsorTransaction(CONTRACT_ADDRESS, txData)

      console.log(taskId)
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect(() => {

  // }, []);

  return {
    login,
    logout,
    walletAddress,
    contractAction,
  }
}
