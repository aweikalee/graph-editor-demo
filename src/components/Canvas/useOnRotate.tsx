import { useCallback, useEffect } from 'react'
import { rotationAngleY, throttle, useStateRef } from '../../utils'
import { useChangeState } from './useChangeState'
import { useControlState } from './useControlState'

export function useOnRotate({
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

    const onRotate = useCallback(
        throttle((e: MouseEvent) => {
            const c = changing.current
            if (!(c.changing && controlRef.current)) return
            c.changed = true
            const { x, y } = controlRef.current

            const curRotate = rotationAngleY(e.pageX - x, e.pageY - y)
            const startRotate = rotationAngleY(c.startX - x, c.startY - y)
            const rotate = ((curRotate - startRotate) / Math.PI) * 180
            setChange((state) => ({
                ...state,
                rotate,
            }))
        }, 16),
        [changing, setChange, controlRef]
    )

    const onRotateEnd = useCallback(() => {
        window.removeEventListener('mousemove', onRotate)
        const c = changing.current
        c.changing = false
        submit()
    }, [changing, submit, onRotate])

    const onRotateStart = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const c = changing.current
            c.changing = true
            c.changed = false
            c.startX = e.pageX
            c.startY = e.pageY
            window.addEventListener('mousemove', onRotate)
            window.addEventListener('mouseup', onRotateEnd, {
                once: true,
            })
        },
        [onRotate, onRotateEnd, changing]
    )

    useEffect(
        () => () => {
            window.removeEventListener('mousemove', onRotate)
            window.removeEventListener('mouseup', onRotateEnd)
        },
        [onRotate, onRotateEnd]
    )

    return { onRotateStart }
}
