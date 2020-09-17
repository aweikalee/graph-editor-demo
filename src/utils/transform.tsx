export type ITransformKey =
    | 'rotate'
    | 'rotateX'
    | 'rotateY'
    | 'rotateZ'
    | 'rotate3D'
    | 'scale'
    | 'scaleX'
    | 'scaleY'
    | 'scale3D'
    | 'skew'
    | 'skewX'
    | 'skewY'
    | 'translate'
    | 'translateX'
    | 'translateY'
    | 'translateZ'
    | 'translate3D'

export function transform(
    values: { [K in ITransformKey]?: string | number }
): string {
    return (Object.keys(values) as ITransformKey[])
        .map((key) => `${key}(${values[key]})`)
        .join(' ')
}
