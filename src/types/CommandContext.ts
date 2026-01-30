import type { WASocket, proto, GroupMetadata, AnyMessageContent } from '@whiskeysockets/baileys'

export interface CommandContext {
  // Core
  sock: WASocket
  jid: string
  message: proto.IWebMessageInfo
  args: string[]

  // Sender
  sender: string
  phone?: string

  // Chat info
  isGroup?: boolean
  group?: GroupMetadata

  // Permissions
  isBotAdmin: boolean
  isGroupAdmin: boolean
  amAdmin: boolean
  isBanned: boolean
  isVip: boolean

  // Utils
  reply: (
    content: string | AnyMessageContent,
    options?: { quoted?: boolean }
  ) => Promise<void>

  react: (emoji: string) => Promise<void>

  // Metadata
  prefix: string
  body: string
  command: string
  timestamp: number
}
