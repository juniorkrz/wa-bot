import { WASocket, areJidsSameUser, isJidGroup, proto } from '@whiskeysockets/baileys'
import { getCommand } from '../core/registry.js'
import { botConfig } from '../config/bot.js'
import { amAdminOfGroup, getPhoneFromJid } from '../helpers/baileys.js'
import { createContextHelpers } from '../helpers/context.js'

export async function handleMessage(
    sock: WASocket,
    message: proto.IWebMessageInfo
) {
    if (!message.message) return

    const key = message.key
    if (!key || key.fromMe) return

    // Get the jid of the chat
    const jid = key.remoteJid
    if (!jid) return

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

    const text =
        message.message.conversation ||
        message.message.extendedTextMessage?.text

    if (!text) return

    const prefix = botConfig.prefixes.find(p =>
        text.startsWith(p)
    )

    if (!prefix) return

    // body
    const body = text
        .slice(prefix.length)
        .trim()

    const [commandName, ...args] = text
        .slice(prefix.length)
        .trim()
        .split(/\s+/)

    if (!commandName) return

    const command = getCommand(commandName.toLowerCase())
    if (!command) return

    const helpers = createContextHelpers({
        sock,
        jid,
        message
    })

    const ctx = {
        sock,
        jid,
        message,
        args,

        sender,
        phone,

        isGroup,
        group,

        isBotAdmin,
        isGroupAdmin,
        amAdmin,
        isBanned,
        isVip,

        ...helpers,

        prefix,
        body,
        command: commandName,
        timestamp
    }


    try {
        await command.execute(ctx)

    } catch (err) {
        console.error(err)
        await sock.sendMessage(jid, {
            text: '❌ Erro ao executar comando'
        })
    }
}
