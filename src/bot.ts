import makeWASocket, {
  DisconnectReason,
} from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'
import { Boom } from '@hapi/boom'

import { loadAuthState } from './config/auth.js'
import { handleMessage } from './handlers/message.js'


export async function startBot() {
  const { state, saveCreds } = await loadAuthState()

  const sock = makeWASocket({
    auth: state
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.log('📲 Escaneie o QR Code abaixo:')
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut

      if (shouldReconnect) startBot()
    }

    if (connection === 'open') {
      console.log('🔥 Bot conectado com sucesso')
    }
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      await handleMessage(sock, msg)
    }
  })

  return sock
}
