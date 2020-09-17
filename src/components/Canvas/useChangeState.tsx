import { useState, useCallback, useRef } from 'react'
import { ILayerState } from '../../types'

export type IScaleType = 'x' | 'y' | 'both'

export function useChangeState() {
    const [state, setState] = useState<ILayerState>(createChangeState())
    const changing = useRef({
        changing: false,
        changed: false,

        /* 记录画布位置 */
        baseX: 0,
        baseY: 0,

        /* 记录鼠标起始点 */
        startX: 0,
        startY: 0,

        scaleType: 'both' as IScaleType,
    })

    const reset = useCallback(() => setState(createChangeState()), [setState])

    return { state, setState, reset, changing }
}

export function createChangeState() {
    return {
        x: 0,
        y: 0,
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
    }
}
