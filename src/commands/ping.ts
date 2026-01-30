import { Command } from "../types/command.js"

const ping: Command = {
    name: 'ping',
    aliases: ['teste'],
    description: 'Responde pong',

    async execute({ sock, jid }) {
        await sock.sendMessage(jid, { text: 'pong 🏓' })
    }
}

export default ping
