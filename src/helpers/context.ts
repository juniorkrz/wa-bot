import type {
    WASocket,
    proto,
    AnyMessageContent
} from '@whiskeysockets/baileys'
import { CommandContext } from '../types/CommandContext.js'
import { toQuotedMessage } from './baileys.js'

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
