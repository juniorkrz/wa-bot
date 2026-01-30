import { Command } from "../types/command.js"
import { getAllCommands } from '../core/registry.js'

const help: Command = {
    name: 'help',
    aliases: ['ajuda', 'menu'],
    description: 'Lista comandos disponíveis',

    async execute({ sock, jid }) {
        const text = getAllCommands()
            .map(c => `!${c.name} - ${c.description ?? ''}`)
            .join('\n')

        await sock.sendMessage(jid, { text })
    }
}

export default help
