import { GaslessWallet } from '@gelatonetwork/gasless-wallet'
import { BigNumber, ethers, utils } from 'ethers'

export const TOKEN_A_ADDRESS = '0xF15c5A73803716bA7312c84146621Da20F086cF1'
export const TOKEN_B_ADDRESS = '0x002A1Ac1E59D616585a9Fc0913e5b06a9DbB9d6C'
const SwapperAddress = '0x0CA03a3560A305fEd2803B336A6D5C8Ccff12891'
const WeatherAddress = '0xF15c5A73803716bA7312c84146621Da20F086cF1'

export default function useSwapper(gaslessWallet: GaslessWallet | undefined) {
  const swap = async (amount: number) => {
    if (!gaslessWallet) return
    const formattedAmount = BigNumber.from(amount).mul(BigNumber.from(10).pow(18))
    console.log("🚀 ~ file: use-swapper.tsx:12 ~ swap ~ formattedAmount:", formattedAmount)

    const CONTRACT_ABI = ['function swap(uint256, uint256)']
    let IContract = new utils.Interface(CONTRACT_ABI)
    let txData = IContract.encodeFunctionData('swap', [formattedAmount, BigInt(0)])
    const { taskId } = await gaslessWallet.sponsorTransaction(SwapperAddress, txData)

    console.log(`https://relay.gelato.digital/tasks/status/${taskId}`)
  }
  const topUpSwapper = async (tokenAddress: string) => {
    if (!gaslessWallet) return
    const amount = BigNumber.from(200).mul(BigNumber.from(10).pow(18))

    const CONTRACT_ABI = ['function mint(address, uint256)']
    let IContract = new utils.Interface(CONTRACT_ABI)
    let txData = IContract.encodeFunctionData('mint', [SwapperAddress, amount])

    const { taskId: taskId } = await gaslessWallet.sponsorTransaction(
      tokenAddress,
      txData
    )

    console.log(`https://relay.gelato.digital/tasks/status/${taskId}`)
  }

  const mintToken = async (tokenAddress: string, walletAddress: string) => {
    if (!gaslessWallet) return
    const amount = BigNumber.from(200).mul(BigNumber.from(10).pow(18))

    const CONTRACT_ABI = ['function mint(address, uint256)']
    let IContract = new utils.Interface(CONTRACT_ABI)
    let txData = IContract.encodeFunctionData('mint', [walletAddress, amount])
    const { taskId } = await gaslessWallet.sponsorTransaction(tokenAddress, txData)

    console.log(`https://relay.gelato.digital/tasks/status/${taskId}`)
  }

  const approveToken = async (tokenAddress: string) => {
    if (!gaslessWallet) return
    const tokenAmount = ethers.constants.MaxUint256

    const CONTRACT_ABI = ['function increaseAllowance(address, uint256)']
    let IContract = new utils.Interface(CONTRACT_ABI)
    let txData = IContract.encodeFunctionData('increaseAllowance', [
      SwapperAddress,
      tokenAmount,
    ])
    const { taskId } = await gaslessWallet.sponsorTransaction(tokenAddress, txData)

    console.log(`https://relay.gelato.digital/tasks/status/${taskId}`)
  }

  return {
    swap,
    mintToken,
    approveToken,
    topUpSwapper,
  }
}
