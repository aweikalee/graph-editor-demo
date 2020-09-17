import { useCallback } from 'react'
import { useStateRef } from '../../utils'
import { ICanvasProps } from './Canvas'
import { useChangeState } from './useChangeState'
import { useControlState } from './useControlState'
import { useSelected } from './useSelected'
import { calcChange, mergeState } from './utils'

export function useSubmit({
    layers,
    selected,
    control,
    change,
    onUpdate,
}: {
    layers: ICanvasProps['layers']
    selected: ReturnType<typeof useSelected>['state']
    control: ReturnType<typeof useControlState>['state']
    change: ReturnType<typeof useChangeState>['state']
    onUpdate: ICanvasProps['onUpdate']
}) {
    const layersRef = useStateRef(layers)
    const selectedRef = useStateRef(selected)
    const controlRef = useStateRef(control)
    const changeRef = useStateRef(change)
    const onUpdateRef = useStateRef(onUpdate)

    const submit = useCallback(() => {
        const layers = layersRef.current
        const selected = selectedRef.current
        const control = controlRef.current
        const change = changeRef.current

        onUpdateRef.current?.(
            layers.map((layer) => {
                if (!selected.includes(layer.id)) return layer

                const res = { ...layer }
                mergeState(
                    res,
                    calcChange(res, change, control ?? { x: res.x, y: res.y })
                )
                return res
            })
        )
    }, [layersRef, selectedRef, controlRef, changeRef, onUpdateRef])

    return { submit }
}
