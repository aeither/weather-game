import { GaslessOnboarding } from '@gelatonetwork/gasless-onboarding'
import { GaslessWallet } from '@gelatonetwork/gasless-wallet'
import { CONTRACT_ADDRESS, gaslessOnboarding } from 'app/lib/utils/constants'
import { utils } from 'ethers'
import { useState } from 'react'

export default function useGO() {
  const [walletAddress, setWalletAddress] = useState<string>()
  const [gobMethod, setGOBMethod] = useState<GaslessOnboarding>()
  const [gaslessWallet, setGaslessWallet] = useState<GaslessWallet>()

  const login = async () => {
    try {
      await gaslessOnboarding.init()
      await gaslessOnboarding.login()

      const gaslessWallet = gaslessOnboarding.getGaslessWallet()
      const address = gaslessWallet.getAddress()

      setGOBMethod(gaslessOnboarding)
      setGaslessWallet(gaslessWallet)
      console.log('🚀 ~ file: use-go.tsx:26 ~ login ~ gaslessWallet:', gaslessWallet)
      setWalletAddress(address)
    } catch (error) {
      console.log(error)
    }
  }

  const logout = async () => {
    await gobMethod?.logout()
  }

  const contractAction = async () => {
    if (!gaslessWallet) return
    try {
      let IContract = new utils.Interface('CONTRACT_ABI') // TODO
      let txData = IContract.encodeFunctionData('actions', ['param1', 'param2'])

      const { taskId } = await gaslessWallet.sponsorTransaction(CONTRACT_ADDRESS, txData)

      console.log(taskId)
    } catch (error) {
      console.log(error)
    }
  }

  

  return {
    login,
    logout,
    walletAddress,
  }
}
