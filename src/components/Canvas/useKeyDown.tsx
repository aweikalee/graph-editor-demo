import { useEffect, useState } from 'react'

/**
 * 判断按键是否处于按下状态
 * @param keyName 按键名 选用 KeyboardEvent['key'] 做判断
 */
export function useKeyDown(keyName: string) {
    const [keyDown, setKeyDown] = useState(false)
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== keyName) return
            setKeyDown(true)
        }
        let onKeyUp = (e: KeyboardEvent) => {
            if (e.key !== keyName) return
            setKeyDown(false)
        }
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('keyup', onKeyUp)
        }
    }, [setKeyDown, keyName])

    return keyDown
}
