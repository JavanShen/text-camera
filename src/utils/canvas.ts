type WrapTextOpt = Partial<{
    x: number
    y: number
}>
/** Canvas渲染换行文字 */
export const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    opt: WrapTextOpt = {}
) => {
    let { x = 0, y = 0 } = opt

    let splitArr = text.split(''),
        line = splitArr[0] || '',
        maxWidth =
            (ctx.canvas.width
                ? ctx.canvas.width / (window.devicePixelRatio || 1)
                : 300) - x,
        lineHeight = Number(
            (
                window.getComputedStyle(ctx.canvas).lineHeight ??
                window.getComputedStyle(document.body).lineHeight
            ).replace('px', '')
        )

    for (let i = 1; i < splitArr.length; i++) {
        let curLine = line + splitArr[i],
            w = ctx.measureText(curLine).width

        if (w > maxWidth) {
            ctx.fillText(line, x, y)
            line = splitArr[i]
            y += lineHeight
        } else {
            line = curLine
        }
    }

    ctx.fillText(line, x, y)
}
