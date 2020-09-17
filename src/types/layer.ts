import { IType } from './type'

export interface ILayerState {
    x: number
    y: number
    rotate: number
    scaleX: number
    scaleY: number
}

export interface ILayerBase<K extends IType = IType> extends ILayerState {
    type: K
    attributes?: any
}

export interface ILayer<K extends IType = IType> extends ILayerBase<K> {
    id: string
}
