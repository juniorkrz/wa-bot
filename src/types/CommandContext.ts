import { WASocket, proto } from '@whiskeysockets/baileys'

export interface CommandContext {
  sock: WASocket
  jid: string
  message: proto.IWebMessageInfo
  args: string[]
}
