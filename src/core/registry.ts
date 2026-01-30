import ping from '../commands/ping.js'
import help from '../commands/help.js'
import quote from '../commands/quoted.js'
import { Command } from '../types/Command.js'

const commands: Command[] = [
  ping,
  help,
  quote
]

export function getCommand(name: string): Command | undefined {
  return commands.find(cmd =>
    cmd.name === name ||
    cmd.aliases?.includes(name)
  )
}

export function getAllCommands() {
  return commands
}
