import React, { useMemo } from 'react'
import clsx from 'clsx'
import * as Shape from './Shape'
import * as getSize from './Shape/getSize'
import { transform } from '../utils'
import { ILayerBase } from '../types'
import styles from './Layer.module.css'

const SHAPE = {
    rect: Shape.Rect,
}

export interface ILayerProps
    extends React.HTMLAttributes<HTMLDivElement>,
        ILayerBase {}

const Component = React.forwardRef<HTMLDivElement, ILayerProps>(
    (props, ref) => {
        const {
            type,
            x,
            y,
            rotate,
            scaleX,
            scaleY,
            attributes,
            className,
            ...others
        } = props

        const { width, height } = useMemo(() => getSize[type](attributes), [
            type,
            attributes,
        ])

        const Shape = SHAPE[type]

        return (
            <div
                {...others}
                className={clsx(styles.layer, className)}
                ref={ref}
                style={{
                    width,
                    height,
                    transform: transform({
                        translate: `${x - width / 2}px, ${y - height / 2}px`,
                        rotate: `${rotate}deg`,
                        scaleX,
                        scaleY,
                    }),
                }}
            >
                {Shape && <Shape {...attributes} />}
            </div>
        )
    }
)

Component.displayName = 'Layer'
export default Component
