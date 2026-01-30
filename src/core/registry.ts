import ping from '../commands/ping.js'
import help from '../commands/help.js'
import { Command } from '../types/command.js'

const commands: Command[] = [
  ping,
  help
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
