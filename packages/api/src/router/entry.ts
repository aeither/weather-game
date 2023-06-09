//grab the images for the corresponding user
import { AutomateSDK } from '@gelatonetwork/automate-sdk'
import { TRPCError } from '@trpc/server'
import { ethers } from 'ethers'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

if (!process.env.PROVIDER_URL) throw new Error('PROVIDER_URL not found')
export const PROVIDER_URL = process.env.PROVIDER_URL

if (!process.env.PRIVATE_KEY) throw new Error('PRIVATE_KEY not found')
export const PRIVATE_KEY = process.env.PRIVATE_KEY

if (!process.env.MORALIS_API_TOKEN) throw new Error('MORALIS_API_TOKEN not found')
const MORALIS_API_TOKEN = process.env.MORALIS_API_TOKEN

if (!process.env.WEATHER_API) throw new Error('WEATHER_API not found')
const WEATHER_API = process.env.WEATHER_API

export const entryRouter = router({
  weather: publicProcedure.query(async ({ ctx }) => {
    const res = await fetch(WEATHER_API)
      .then((response) => response.json())
      .catch((err) => console.error(err))
    return res
  }),

  allTokens: publicProcedure
    .input(
      z.object({
        address: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (!input.address)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found in database.',
        })

      const data = fetch(
        `https://deep-index.moralis.io/api/v2/${input.address}/erc20?chain=mumbai`,
        {
          headers: {
            Accept: 'application/json',
            'X-Api-Key': MORALIS_API_TOKEN,
          },
        }
      ).then((r) => r.json())

      return data
    }),

  createTask: publicProcedure.mutation(async ({ ctx, input }) => {
    const chainId = 80001 // mumbai
    const oracleAddress = '0xF8f476047EBF7335EF1181a6ad4A0D0B3c07c031'
    const oracleAbi = [
      'function lastUpdated() external view returns(uint256)',
      'function updatePrice(uint256)',
    ]

    // Instanciate provider & signer
    const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY as string, provider)
    const automate = new AutomateSDK(chainId, wallet)

    // Deploy Web3Function on IPFS
    console.log('Deploying Web3Function on IPFS...')
    const cid = 'QmVZozSAz4UiBqF3Jzfu58ebjFxb2b16M51j9q8QwEPRTN' // TODO: Update
    console.log(`Web3Function IPFS CID: ${cid}`)

    // Create task using automate-sdk
    console.log('Creating automate task...')
    const oracleInterface = new ethers.utils.Interface(oracleAbi)

    const { taskId, tx } = await automate.createTask({
      name: 'Web3Function - Eth Oracle',
      execAddress: oracleAddress,
      execSelector: oracleInterface.getSighash('updatePrice'),
      dedicatedMsgSender: true,
      web3FunctionHash: cid,
      web3FunctionArgs: {
        oracle: '0xF8f476047EBF7335EF1181a6ad4A0D0B3c07c031',
        currency: 'ethereum',
      },
    })

    // await tx.wait()
    console.log(`Task created, taskId: ${taskId} (tx hash: ${tx.hash})`)
    console.log(`> https://beta.app.gelato.network/task/${taskId}?chainId=${chainId}`)
    return { taskId, tx }
  }),
})
