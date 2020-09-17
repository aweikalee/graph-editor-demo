import React from 'react'
import clsx from 'clsx'
import styles from './Rect.module.css'

export interface IRectAttrs {
    width?: number
    height?: number
}

const Component = React.forwardRef<HTMLDivElement, IRectAttrs>((props, ref) => {
    const { width = 100, height = 100, ...others } = props
    return (
        <div
            {...others}
            className={clsx(styles.rect)}
            ref={ref}
            style={{
                width,
                height,
            }}
        ></div>
    )
})

Component.displayName = 'Rect'
export default Component

export function getSize(attrs: IRectAttrs): { width: number; height: number } {
    return {
        width: attrs.width ?? 0,
        height: attrs.height ?? 0,
    }
}
