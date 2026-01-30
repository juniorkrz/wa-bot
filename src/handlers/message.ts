import { WASocket, proto } from '@whiskeysockets/baileys'
import { getCommand } from '../core/registry.js'

const PREFIX = '!'

export async function handleMessage(
    sock: WASocket,
    message: proto.IWebMessageInfo
) {
    if (!message.message || message.key?.fromMe) return

    const text =
        message.message.conversation ||
        message.message.extendedTextMessage?.text

    if (!text?.startsWith(PREFIX)) return

    const [name, ...args] = text
        .slice(PREFIX.length)
        .trim()
        .split(/\s+/)

    const command = getCommand(name)
    if (!command) return

    const jid = message.key?.remoteJid
    if (!jid) return

    try {
        await command.execute({
            sock,
            jid,
            message,
            args
        })
    } catch (err) {
        console.error(err)
        await sock.sendMessage(jid, {
            text: '❌ Erro ao executar comando'
        })
    }
}
