const shortContent = (text, maxLength = 100) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return `${text.substring(0, maxLength)}...`
}

export { shortContent }
