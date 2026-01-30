import { CommandContext } from "./CommandContext.js"

export interface Command {
  name: string
  aliases?: string[]
  description?: string
  execute(ctx: CommandContext): Promise<void>
}
