export const getRandomItemFromArray = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

export const spintax = (text: string) => {
    const pattern = /\{([^{}]+)\}/g

    while (pattern.test(text)) {
        text = text.replace(pattern, (match, p1) => {
            const options = p1.split('|')
            return getRandomItemFromArray(options)
        })
    }

    return text
}

export const strCapitalize = (str: string): string => {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1)
}
