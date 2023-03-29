import { Web3Function, Web3FunctionContext } from '@gelatonetwork/web3-functions-sdk'
import { Contract, utils } from 'ethers'

const WEATHER_ABI = [
  'function lastUpdated() external view returns(uint256)',
  'function rewardPrediction()',
]

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { gelatoArgs, provider } = context

  // Retrieve Last weather update time
  const weatherAddress = '0xB676A1Ef4b6FFd2f2b5B88D197206c98bD1d8df6'
  let lastUpdated
  let weatherContract
  try {
    weatherContract = new Contract(weatherAddress, WEATHER_ABI, provider)
    lastUpdated = parseInt(await weatherContract.lastUpdated())
    console.log(`Last weather update: ${lastUpdated}`)
  } catch (err) {
    return { canExec: false, message: `Rpc call failed` }
  }

  // Check if it's ready for a new update
  const nextUpdateTime = lastUpdated + 3600 // 1h
  const timestamp = gelatoArgs.blockTime
  console.log(`Next weather update: ${nextUpdateTime}`)
  if (timestamp < nextUpdateTime) {
    return { canExec: false, message: `Time not elapsed` }
  }

  // Return execution call data
  const weatherInterface = new utils.Interface(WEATHER_ABI)
  return {
    canExec: true,
    callData: weatherInterface.encodeFunctionData('rewardPrediction'),
  }
})
