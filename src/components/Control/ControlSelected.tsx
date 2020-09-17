import React, { useMemo } from 'react'
import clsx from 'clsx'
import * as getSize from '../Shape/getSize'
import { transform } from '../../utils'
import { ILayerBase } from '../../types'
import styles from './Control.module.css'

export interface IControlSelectedProps
    extends React.HTMLAttributes<HTMLDivElement>,
        ILayerBase {}

const Component = React.forwardRef<HTMLDivElement, IControlSelectedProps>(
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
            style,
            ...others
        } = props

        const { width: widthBase, height: heightBase } = useMemo(
            () => getSize[type](attributes),
            [type, attributes]
        )

        const width = useMemo(() => Math.abs(widthBase * scaleX), [
            widthBase,
            scaleX,
        ])
        const height = useMemo(() => Math.abs(heightBase * scaleY), [
            heightBase,
            scaleY,
        ])

        return (
            <div
                className={clsx(styles['control-selected'], className)}
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
                {...others}
            ></div>
        )
    }
)

Component.displayName = 'ControlSelected'
export default Component
