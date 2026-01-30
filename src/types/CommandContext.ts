import type { WASocket, proto, GroupMetadata, AnyMessageContent, MiscMessageGenerationOptions } from '@whiskeysockets/baileys'

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
  sendMessage: (
    content: string | AnyMessageContent,
    options?: MiscMessageGenerationOptions
  ) => Promise<void>

  reply: (
    content: string | AnyMessageContent,
    options?: MiscMessageGenerationOptions
  ) => Promise<void>

  react: (emoji: string) => Promise<void>

  // Metadata
  prefix: string
  body: string
  command: string
  timestamp: number
}
