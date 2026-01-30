import {
    type WASocket,
    type proto,
    type AnyMessageContent,
    areJidsSameUser,
    isJidGroup
} from '@whiskeysockets/baileys'
import { CommandContext } from '../types/CommandContext.js'
import { amAdminOfGroup, getPhoneFromJid, toQuotedMessage } from './baileys.js'
import { botConfig } from '../config/bot.js'

type BaseContext = Pick<
    CommandContext,
    'sock' | 'jid' | 'message'
>

export const createContextHelpers = (
    base: BaseContext
) => {
    const { sock, jid, message } = base

    const reply: CommandContext['reply'] = async (
        content,
        options
    ) => {
        const msg: AnyMessageContent =
            typeof content === 'string'
                ? { text: content }
                : content

        await sock.sendMessage(
            jid,
            msg,
            options?.quoted
                ? { quoted: toQuotedMessage(message) }
                : undefined
        )
    }

    const react: CommandContext['react'] = async (emoji) => {
        await sock.sendMessage(jid, {
            react: {
                text: emoji,
                key: message.key
            }
        })
    }

    return {
        reply,
        react
    }
}

export const getExtraContext = async (sock: WASocket, key: proto.IMessageKey, jid: string) => {
    // Get the sender of the message
    const sender = key.participant
        ? key.participant
        : jid
    // Is this a Group?
    const isGroup = isJidGroup(jid)
    // If so, get the group
    const group = isGroup
        ? await sock.groupMetadata(jid)//await getFullCachedGroupMetadata(jid)// TODO: Use cache
        : undefined
    // Get the sender phone
    const phone = getPhoneFromJid(sender)
    // Is the sender an bot admin?
    const isBotAdmin = botConfig.admins.includes(phone)
    // Is the sender an admin of the group?
    const isGroupAdmin = group
        ? group.participants
            .find((p) => areJidsSameUser(p.id, sender))
            ?.admin?.endsWith('admin') !== undefined
        : false
    // Is the Bot an admin of the group?
    const amAdmin = amAdminOfGroup(group)
    // Is sender banned?
    const isBanned = phone
        ? false//await isUserBanned(phone)// TODO: Implement bans
        : false
    // Is sender VIP?
    const isVip = false//await senderIsVip(sender)// TODO: Implement bans

    // Message timestamp
    const timestamp = Date.now()

    return {
        sender,
        isGroup,
        group,
        isBotAdmin,
        isGroupAdmin,
        amAdmin,
        isBanned,
        isVip,
        timestamp
    }
}