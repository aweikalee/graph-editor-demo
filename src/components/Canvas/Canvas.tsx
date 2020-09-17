import React, { useCallback, useEffect, useRef } from 'react'
import clsx from 'clsx'
import Layer from '../Layer'
import { Control, Selected as ControlSelected } from '../Control'
import { ILayer } from '../../types'
import styles from './Canvas.module.css'
import { useSelected } from './useSelected'
import { useKeyDown } from './useKeyDown'
import { useControlState } from './useControlState'
import { useChangeState } from './useChangeState'
import { useSubmit } from './useSubmit'
import { calcChange, mergeState } from './utils'
import { useOnMove } from './useOnMove'
import { useOnScale } from './useOnScale'
import { useOnRotate } from './useOnRotate'

export interface ICanvasProps extends React.HTMLAttributes<HTMLDivElement> {
    layers: ILayer[]
    onUpdate?: (layers: ICanvasProps['layers']) => void
}

const Component = React.forwardRef<HTMLDivElement, ICanvasProps>(
    (props, ref) => {
        const { layers, onUpdate, className, ...others } = props

        const el = useRef<HTMLDivElement>(null)
        React.useImperativeHandle(ref, () => el.current!)

        /* shift 是否处于按下 */
        const shiftKey = useKeyDown('Shift')

        /* 被选中的 */
        const {
            state: selected,
            add: addSelected,
            remove: removeSelected,
            clear: clearSelected,
        } = useSelected()

        /* 控制框的基础状态 */
        const controlState = useControlState()
        const { state: control, reset: resetControl } = controlState

        /* 修改（暂存区） */
        const changeState = useChangeState()
        const { state: change, changing, reset: resetChange } = changeState

        /* 获取画布相对于页面的位置 用于后续 Mouse 的坐标计算 */
        const setChangingBase = useCallback(
            (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                const rect = el.current!.getBoundingClientRect()
                const c = changing.current
                c.baseX = rect.x
                c.baseY = rect.y
            },
            [el, changing]
        )

        /* layers selected 变动 重置 change 和 control */
        useEffect(() => {
            resetChange()
            resetControl(layers, selected)
        }, [resetControl, resetChange, layers, selected])

        /* 提交修改内容 */
        const { submit } = useSubmit({
            layers,
            selected,
            control,
            change,
            onUpdate,
        })

        /* 移动 */
        const { onMoveStart } = useOnMove({
            changeState,
            submit,
        })

        /* 缩放 */
        const { onScaleStart } = useOnScale({
            controlState,
            changeState,
            submit,
        })

        /* 旋转 */
        const { onRotateStart } = useOnRotate({
            controlState,
            changeState,
            submit,
        })

        return (
            <div
                className={clsx(styles.canvas, className)}
                ref={el}
                onClick={(e) => {
                    e.stopPropagation()
                    if (!shiftKey) {
                        if (changing.current.changed) {
                            changing.current.changed = false
                        } else {
                            clearSelected()
                        }
                    }
                }}
                {...others}
            >
                {/* 图层 */}
                {layers.map((layer) => {
                    const { id, ...others } = layer
                    if (control && selected.includes(id)) {
                        mergeState(
                            others,
                            calcChange(layer, change, {
                                x: control.x,
                                y: control.y,
                            })
                        )
                    }
                    return (
                        <Layer
                            {...others}
                            key={id}
                            onClick={(e) => {
                                e.stopPropagation()
                                if (e.shiftKey) {
                                    addSelected(layer)
                                } else {
                                    clearSelected()
                                    addSelected(layer)
                                }
                            }}
                        />
                    )
                })}

                {/* 选中的框 */}
                {selected.map((id) => {
                    const layer = layers.find((v) => v.id === id)
                    if (!layer) return null

                    const { id: _id, ...others } = layer
                    if (control && selected.includes(id)) {
                        mergeState(
                            others,
                            calcChange(layer, change, {
                                x: control.x,
                                y: control.y,
                            })
                        )
                    }
                    return (
                        <ControlSelected
                            {...others}
                            key={id}
                            onClick={(e) => {
                                e.stopPropagation()
                                if (e.shiftKey) {
                                    removeSelected(layer)
                                } else {
                                    clearSelected()
                                    addSelected(layer)
                                }
                            }}
                            onMouseDown={(e) => {
                                e.stopPropagation()
                                setChangingBase(e)
                                onMoveStart(e)
                            }}
                        />
                    )
                })}

                {/* 控制器 */}
                {control && (
                    <Control
                        style={{ zIndex: shiftKey ? -1 : undefined }}
                        {...mergeState({ ...control }, change)}
                        scaleOnlyBoth={selected.length > 1}
                        onMoveStart={(e) => {
                            e.stopPropagation()
                            setChangingBase(e)
                            onMoveStart(e)
                        }}
                        onScaleStart={(e, index) => {
                            e.stopPropagation()
                            setChangingBase(e)
                            onScaleStart(e, index)
                        }}
                        onRotateStart={(e) => {
                            e.stopPropagation()
                            setChangingBase(e)
                            onRotateStart(e)
                        }}
                    />
                )}
            </div>
        )
    }
)

Component.displayName = 'Canvas'
export default Component
