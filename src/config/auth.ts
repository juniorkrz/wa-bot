import { useMultiFileAuthState } from '@whiskeysockets/baileys'

export async function loadAuthState() {
  return useMultiFileAuthState('auth')
}
