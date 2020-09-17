import React, { useMemo } from 'react'
import clsx from 'clsx'
import { transform } from '../../utils'
import { ILayerState } from '../../types'
import styles from './Control.module.css'

const SCALE_BUTTON = [
    {
        top: 0,
        left: '50%',
    },
    {
        top: 0,
        left: '100%',
    },
    {
        top: '50%',
        left: '100%',
    },
    {
        top: '100%',
        left: '100%',
    },
    {
        top: '100%',
        left: '50%',
    },
    {
        top: '100%',
        left: 0,
    },
    {
        top: '50%',
        left: 0,
    },
    {
        top: 0,
        left: 0,
    },
]

export interface IControlProps
    extends React.HTMLAttributes<HTMLDivElement>,
        ILayerState {
    width: number
    height: number
    onMoveStart?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    onScaleStart?: (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number
    ) => void
    onRotateStart?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    scaleOnlyBoth?: boolean
}

const Component = React.forwardRef<HTMLDivElement, IControlProps>(
    (props, ref) => {
        const {
            width: widthProp,
            height: heightProp,
            x,
            y,
            rotate,
            scaleX,
            scaleY,
            onMoveStart,
            onScaleStart,
            onRotateStart,
            onMouseDown,
            scaleOnlyBoth = false,
            className,
            style,
            ...others
        } = props

        const width = useMemo(() => Math.abs(widthProp * scaleX), [
            widthProp,
            scaleX,
        ])
        const height = useMemo(() => Math.abs(heightProp * scaleY), [
            heightProp,
            scaleY,
        ])

        return (
            <div
                className={clsx(styles.control, className)}
                style={{
                    ...style,
                    width,
                    height,
                    transform: transform({
                        translate: `${x - width / 2}px, ${y - height / 2}px`,
                        rotate: `${rotate}deg`,
                    }),
                }}
                ref={ref}
                onMouseDown={(e) => {
                    onMoveStart?.(e)
                    onMouseDown?.(e)
                }}
                {...others}
            >
                {/* scale button */}
                {SCALE_BUTTON.map(({ top, left }, index) => {
                    if (scaleOnlyBoth && index % 2 === 0) {
                        return null
                    }
                    return (
                        <div
                            className={clsx(styles.scale)}
                            key={index}
                            style={{
                                top,
                                left,
                                cursor: getCursor(index, rotate),
                            }}
                            onMouseDown={(e) => onScaleStart?.(e, index)}
                        ></div>
                    )
                })}

                {/* rotate buuton */}
                <div
                    className={clsx(styles.rotate)}
                    onMouseDown={(e) => onRotateStart?.(e)}
                >
                    <span role="img" aria-label="rotate">
                        🔃
                    </span>
                </div>
            </div>
        )
    }
)

Component.displayName = 'Control'
export default Component

const CURSOR_MAP = [
    'n-resize',
    'ne-resize',
    'e-resize',
    'se-resize',
    's-resize',
    'sw-resize',
    'w-resize',
    'nw-resize',
]
function getCursor(index: number, rotate: number) {
    return CURSOR_MAP[(index + Math.round(rotate / 45)) % 8]
}
