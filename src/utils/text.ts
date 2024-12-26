import { CSSProperties } from 'vue'

const measureWidth = (text: string, ctx: CanvasRenderingContext2D) =>
    ctx.measureText(text).width

const ellipsis = '...'
export const cutText = (
    text?: string,
    width: number = 200,
    lineNum: number = 2,
    fontStyle: CSSProperties = {}
) => {
    if (!text) return ''

    const totalWidth = width * lineNum
    const { fontSize, fontFamily, fontWeight } = fontStyle

    const ctx = document.createElement('canvas').getContext('2d')

    if (ctx) {
        ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`
        if (measureWidth(text, ctx) <= totalWidth) return text

        let left = 0,
            right = text.length - 1
        while (left < right) {
            const mid = Math.floor((left + right) / 2),
                extractedText = text.substring(0, mid + 1) + ellipsis,
                textWidth = measureWidth(extractedText, ctx)

            if (textWidth === totalWidth) return extractedText

            if (textWidth > totalWidth) {
                right = mid - 1
            } else {
                left = mid + 1
            }
        }

        return text.substring(0, right - 1) + ellipsis
    } else {
        return text
    }
}
