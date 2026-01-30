import { startBot } from './bot.js'

startBot().catch(err => {
  console.error('Erro ao iniciar bot:', err)
})
