import { WASocket, proto } from '@whiskeysockets/baileys'
import { getCommand } from '../core/registry.js'
import { botConfig } from '../config/bot.js'
import { createContextHelpers, getExtraContext } from '../helpers/context.js'

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

    const extraContext = await getExtraContext(sock, key, jid)

    const ctx = {
        sock,
        jid,
        message,
        args,

        ...extraContext,

        ...helpers,

        prefix,
        body,
        command: commandName
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
