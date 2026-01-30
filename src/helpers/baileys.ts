import { GroupMetadata, jidNormalizedUser, proto, WAMessage } from '@whiskeysockets/baileys'
import { getSocket } from '../bot.js'

export function getQuotedMessage(
  message: proto.IWebMessageInfo
) {
  return message.message?.extendedTextMessage?.contextInfo?.quotedMessage
}

export const getPhoneFromJid = (jid: string | undefined) => {
  return jidNormalizedUser(jid).replace(/\D/g, '')
}

const normalizeLid = (lid: string) =>
  lid.split(':')[0] + '@lid'

export const amAdminOfGroup = (group?: GroupMetadata): boolean => {
  if (!group) return false

  const sock = getSocket()
  const myLid = sock.user?.lid
  if (!myLid) return false

  const me = group.participants.find(
    (p) => p.id === normalizeLid(myLid)
  )

  return me?.admin === 'admin' || me?.admin === 'superadmin'
}

export const toQuotedMessage = (
  message: proto.IWebMessageInfo
): WAMessage | undefined => {
  if (!message.key) return undefined

  return message as WAMessage
}