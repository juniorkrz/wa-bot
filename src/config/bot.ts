function parsePrefixes(value?: string): string[] {
  if (!value) return ['!']
  return value
    .split(';')
    .map(p => p.trim())
    .filter(Boolean)
}

export const botConfig = {
  prefixes: parsePrefixes(process.env.BOT_PREFIXES)
}
