export function throttle<T extends (...args: any[]) => void>(
    method: T,
    interval = 100
): T {
    let time = 0

    return ((...args: any[]) => {
        const now = Date.now()
        if (now - time > interval) {
            method(...args)
            time = now
        }
    }) as T
}
