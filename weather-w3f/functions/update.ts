import { Web3Function, Web3FunctionContext } from '@gelatonetwork/web3-functions-sdk'
import { Contract, utils } from 'ethers'
import ky from 'ky' // we recommend using ky as axios doesn't support fetch by default

const WEATHER_ABI = [
  'function lastUpdated() external view returns(uint256)',
  'function updateCondition(string)',
]

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { secrets, gelatoArgs, provider } = context

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

  let condition = ''
  try {
    const weatherApi = await secrets.get('WEATHER_API')
    if (!weatherApi) return { canExec: false, message: `WEATHER_API not set in secrets` }

    const weatherData: any = await ky.get(weatherApi, { timeout: 5_000, retry: 0 }).json()
    condition = weatherData.weather[0].main
  } catch (err) {
    return { canExec: false, message: `Call failed` }
  }
  console.log(`Updating condition: ${condition}`)

  // Return execution call data
  const weatherInterface = new utils.Interface(WEATHER_ABI)
  return {
    canExec: true,
    callData: weatherInterface.encodeFunctionData('updateCondition', [condition]),
  }
})

// response sample
// const data = {
//   coord: { lon: -0.1257, lat: 51.5085 },
//   weather: [{ id: 804, main: 'Clouds', description: 'overcast clouds', icon: '04d' }],
//   base: 'stations',
//   main: {
//     temp: 281.42,
//     feels_like: 278.32,
//     temp_min: 280.4,
//     temp_max: 282.04,
//     pressure: 1012,
//     humidity: 77,
//   },
//   visibility: 10000,
//   wind: { speed: 5.66, deg: 190 },
//   clouds: { all: 100 },
//   dt: 1680025325,
//   sys: { type: 2, id: 2075535, country: 'GB', sunrise: 1679982346, sunset: 1680027923 },
//   timezone: 3600,
//   id: 2643743,
//   name: 'London',
//   cod: 200,
// }
