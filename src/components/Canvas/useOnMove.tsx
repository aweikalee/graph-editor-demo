import { useCallback, useEffect } from 'react'
import { throttle } from '../../utils'
import { useChangeState } from './useChangeState'

export function useOnMove({
    changeState,
    submit,
}: {
    changeState: ReturnType<typeof useChangeState>
    submit: () => void
}) {
    const { changing, setState: setChange } = changeState

    const onMove = useCallback(
        throttle((e: MouseEvent) => {
            const c = changing.current
            if (!c.changing) return
            c.changed = true
            setChange((state) => ({
                ...state,
                x: e.pageX - c.startX,
                y: e.pageY - c.startY,
            }))
        }, 16),
        [changing, setChange]
    )

    const onMoveEnd = useCallback(() => {
        window.removeEventListener('mousemove', onMove)
        const c = changing.current
        c.changing = false
        submit()
    }, [changing, submit, onMove])

    const onMoveStart = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const c = changing.current
            c.changing = true
            c.changed = false
            c.startX = e.pageX
            c.startY = e.pageY
            window.addEventListener('mousemove', onMove)
            window.addEventListener('mouseup', onMoveEnd, {
                once: true,
            })
        },
        [onMove, onMoveEnd, changing]
    )

    useEffect(
        () => () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onMoveEnd)
        },
        [onMove, onMoveEnd]
    )

    return { onMoveStart }
}
