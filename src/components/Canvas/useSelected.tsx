import { useState, useCallback } from 'react'
import { ILayer } from '../../types'

export function useSelected() {
    const [state, setState] = useState<ILayer['id'][]>([])

    /* 添加 */
    const add = useCallback(
        (layer: ILayer) => {
            setState((state) => {
                if (state.includes(layer.id)) return state
                return [...state, layer.id]
            })
        },
        [setState]
    )

    /* 移除 */
    const remove = useCallback(
        (layer: ILayer) => {
            setState((state) => {
                if (!state.includes(layer.id)) return state
                return state.filter((id) => id !== layer.id)
            })
        },
        [setState]
    )

    /* 清空 */
    const clear = useCallback(() => {
        setState([])
    }, [setState])

    return {
        state,
        setState,
        add,
        remove,
        clear,
    }
}