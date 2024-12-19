export const cutText = (text: string = '', length: number = 32) => {
    return text.length > length ? text.substring(0, length) + '...' : text
}