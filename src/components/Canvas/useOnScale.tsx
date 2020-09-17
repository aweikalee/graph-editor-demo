import { useCallback, useEffect } from 'react'
import { throttle, useStateRef } from '../../utils'
import { IScaleType, useChangeState } from './useChangeState'
import { useControlState } from './useControlState'

const SCALE_TYPE: IScaleType[] = ['y', 'both', 'x', 'both']

export function useOnScale({
    controlState,
    changeState,
    submit,
}: {
    controlState: ReturnType<typeof useControlState>
    changeState: ReturnType<typeof useChangeState>
    submit: () => void
}) {
    const { state: control } = controlState
    const { changing, setState: setChange } = changeState
    const controlRef = useStateRef(control)

    const onScale = useCallback(
        throttle((e: MouseEvent) => {
            const c = changing.current
            if (!(c.changing && controlRef.current)) return
            c.changed = true
            const { x, y } = controlRef.current

            const res: {
                scaleX?: number
                scaleY?: number
            } = {}
            const scaleX = (e.pageX - c.baseX - x) / (c.startX - c.baseX - x)
            const scaleY = (e.pageY - c.baseY - y) / (c.startY - c.baseY - y)
            switch (c.scaleType) {
                case 'x':
                    res.scaleX = scaleX
                    break
                case 'y':
                    res.scaleY = scaleY
                    break
                default:
                    if (Math.abs(scaleX) > Math.abs(scaleY)) {
                        res.scaleX = scaleX
                        res.scaleY = scaleX
                    } else {
                        res.scaleX = scaleY
                        res.scaleY = scaleY
                    }
            }
            setChange((state) => ({
                ...state,
                ...res,
            }))
        }, 16),
        [changing, setChange]
    )

    const onScaleEnd = useCallback(() => {
        window.removeEventListener('mousemove', onScale)
        const c = changing.current
        c.changing = false
        submit()
    }, [changing, submit, onScale])

    const onScaleStart = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
            const c = changing.current
            c.changing = true
            c.changed = false
            c.startX = e.pageX
            c.startY = e.pageY
            c.scaleType = SCALE_TYPE[index % 4]
            window.addEventListener('mousemove', onScale)
            window.addEventListener('mouseup', onScaleEnd, {
                once: true,
            })
        },
        [onScale, onScaleEnd, changing]
    )

    useEffect(
        () => () => {
            window.removeEventListener('mousemove', onScale)
            window.removeEventListener('mouseup', onScaleEnd)
        },
        [onScale, onScaleEnd]
    )

    return { onScaleStart }
}
