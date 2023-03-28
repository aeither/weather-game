import { GaslessWallet } from '@gelatonetwork/gasless-wallet'
import { utils } from 'ethers'

export const TOKEN_A_ADDRESS = '0xF15c5A73803716bA7312c84146621Da20F086cF1'
export const TOKEN_B_ADDRESS = '0x002A1Ac1E59D616585a9Fc0913e5b06a9DbB9d6C'
const SwapperAddress = '0x0CA03a3560A305fEd2803B336A6D5C8Ccff12891'

export default function useSwapper(gaslessWallet: GaslessWallet | undefined) {
  const swap = async (amount: number) => {
    if (!gaslessWallet) return

    const CONTRACT_ABI = ['function swap(uint256, uint256)']
    let IContract = new utils.Interface(CONTRACT_ABI)
    let txData = IContract.encodeFunctionData('swap', [amount, BigInt(0)])
    const { taskId } = await gaslessWallet.sponsorTransaction(SwapperAddress, txData)

    console.log(`https://relay.gelato.digital/tasks/status/${taskId}`)
  }

  const mintToken = async (address: string) => {
    if (!gaslessWallet) return

    const CONTRACT_ABI = ['function mint(address, uint256)']
    let IContract = new utils.Interface(CONTRACT_ABI)
    let txData = IContract.encodeFunctionData('mint', [SwapperAddress, BigInt(20000)])
    const { taskId } = await gaslessWallet.sponsorTransaction(address, txData)

    console.log(`https://relay.gelato.digital/tasks/status/${taskId}`)
  }

  const approveToken = async (address: string) => {
    if (!gaslessWallet) return

    const CONTRACT_ABI = ['function approve(address, uint256)']
    let IContract = new utils.Interface(CONTRACT_ABI)
    let txData = IContract.encodeFunctionData('approve', [SwapperAddress, BigInt(20000)])
    const { taskId } = await gaslessWallet.sponsorTransaction(address, txData)

    console.log(`https://relay.gelato.digital/tasks/status/${taskId}`)
  }

  return {
    swap,
    mintToken,
    approveToken,
  }
}
