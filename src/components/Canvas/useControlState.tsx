import { useState, useCallback } from 'react'
import { ILayer, ILayerBase, ILayerState } from '../../types'
import { rotateVector } from '../../utils'
import * as getSizeBase from '../Shape/getSize'
import { useSelected } from './useSelected'

export interface IControlState extends ILayerState {
    width: number
    height: number
}

/**
 * 根据 selected 设置 Control 的基础状态
 */
export function useControlState() {
    const [state, setState] = useState<IControlState | null>(null)
    const reset = useCallback(
        (
            layers: ILayer[],
            selected: ReturnType<typeof useSelected>['state']
        ) => {
            /* 根据 selected 的 id 获取所有 layer */
            const arr = layers.filter((layer) => selected.includes(layer.id))

            if (arr.length === 0) {
                return setState(null)
            }

            /* 当 layer 只有一项时 */
            if (arr.length === 1) {
                const { x, y, rotate } = arr[0]
                const { width, height } = getSize(arr[0])
                return setState({
                    x,
                    y,
                    width,
                    height,
                    rotate,
                    scaleX: 1,
                    scaleY: 1,
                })
            }

            /* 当 layer 多项时 */
            let x1: number
            let y1: number
            let x2: number
            let y2: number

            arr.forEach((layer) => {
                const { x, y, rotate } = layer
                const { width, height } = getSize(layer)

                /* 计算旋转后各点的坐标 */
                const rect = {
                    x1: -width / 2,
                    y1: -height / 2,
                    x2: width / 2,
                    y2: height / 2,
                }
                const _rotate = (rotate * Math.PI) / 180
                const p = [
                    rotateVector(rect.x1, rect.y1, _rotate),
                    rotateVector(rect.x1, rect.y2, _rotate),
                    rotateVector(rect.x2, rect.y1, _rotate),
                    rotateVector(rect.x2, rect.y2, _rotate),
                ]

                /* 选择极值 */
                x1 = Math.min(x1 ?? Infinity, ...p.map((v) => v[0] + x))
                y1 = Math.min(y1 ?? Infinity, ...p.map((v) => v[1] + y))
                x2 = Math.max(x2 ?? -Infinity, ...p.map((v) => v[0] + x))
                y2 = Math.max(y2 ?? -Infinity, ...p.map((v) => v[1] + y))
            })

            setState({
                x: (x1! + x2!) / 2,
                y: (y1! + y2!) / 2,
                width: x2! - x1!,
                height: y2! - y1!,
                rotate: 0,
                scaleX: 1,
                scaleY: 1,
            })
        },
        [setState]
    )

    return { state, setState, reset }
}

function getSize(layer: ILayerBase) {
    const { type, attributes, scaleX, scaleY } = layer
    const { width, height } = getSizeBase[type](attributes)
    return {
        width: width * scaleX,
        height: height * scaleY,
    }
}
