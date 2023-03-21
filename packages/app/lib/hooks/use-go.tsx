import {
  GaslessOnboarding,
  GaslessWalletConfig,
  GaslessWalletInterface,
  LoginConfig,
} from '@gelatonetwork/gasless-onboarding'
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
      const CONTRACT_ABI = ['function store(uint256)']
      let IContract = new utils.Interface(CONTRACT_ABI)
      let txData = IContract.encodeFunctionData('store', [111])

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
