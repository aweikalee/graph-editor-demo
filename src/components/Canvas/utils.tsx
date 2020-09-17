import { ILayer, ILayerState } from '../../types'
import { rotateVector } from '../../utils'

export function mergeState<T extends ILayerState = ILayerState>(
    target: T,
    values: ILayerState
): T {
    target.x += values.x
    target.y += values.y
    target.rotate += values.rotate
    target.scaleX *= values.scaleX
    target.scaleY *= values.scaleY
    return target
}

export function calcChange(
    layer: ILayer,
    change: ILayerState,
    center: { x: number; y: number }
): ILayerState {
    let x = layer.x - center.x
    let y = layer.y - center.y

    /* 位移 */
    x += change.x
    y += change.y

    /* 缩放 */
    x *= change.scaleX
    y *= change.scaleY

    /* 旋转 */
    ;[x, y] = rotateVector(x, y, (change.rotate * Math.PI) / 180)

    x += center.x - layer.x
    y += center.y - layer.y

    return {
        ...change,
        x,
        y,
    }
}
