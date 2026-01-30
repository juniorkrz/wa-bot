import { botConfig } from "../config/bot.js"
import { emojis } from "../helpers/emojis.js"
import { getRandomItemFromArray, spintax } from "../helpers/utils.js"
import { Command } from "../types/Command.js"

const ping: Command = {
    name: 'ping',
    aliases: ['teste'],
    description: 'Responde pong',

    async execute(ctx) {
        const { timestamp } = ctx
        // Responde 'Pong' e reage a mensagem:
        const time = <number>timestamp
        const ms = Date.now() - time

        // Mensagem a ser enviada
        const text = `Pong! ${emojis.ping}\n\n${getRandomItemFromArray(emojis.wait)} ` +
            `Tempo de resposta do {${botConfig.name}|bot} foi de *${ms}ms*.`

        const reply = spintax(text)

        await ctx.reply(reply, { quoted: true })
        await ctx.react(getRandomItemFromArray(emojis.ping))
    }
}

export default ping
