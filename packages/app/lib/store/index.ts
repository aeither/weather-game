import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
  publicKey: string | undefined
  setPublicKey: (publicKey: string | undefined) => void
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      publicKey: undefined,
      setPublicKey: (publicKey) => set(() => ({ publicKey: publicKey })),
    }),
    {
      name: 'storage', // unique name
    }
  )
)
