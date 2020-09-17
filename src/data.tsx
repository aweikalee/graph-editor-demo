import { ILayer } from './types'

const data: ILayer[] = []

let count = 0
function add(props: Partial<ILayer>) {
    data.push({
        id: `${count++}`,
        type: 'rect',
        x: 0,
        y: 0,
        rotate: 0,
        scaleX: 1,
        scaleY: 1,
        ...props,
    })
}

add({
    type: 'rect',
    x: 400,
    y: 100,
    rotate: 30,
    attributes: {
        width: 100,
        height: 200,
    },
})

add({
    type: 'rect',
    x: 400,
    y: 200,
    rotate: 130,
    attributes: {
        width: 100,
        height: 200,
    },
})

add({
    type: 'rect',
    x: 400,
    y: 200,
    scaleX: 0.5,
    scaleY: 3,
    attributes: {
        width: 200,
        height: 100,
    },
})

add({
    type: 'rect',
    x: 300,
    y: 300,
    scaleX: 3,
    scaleY: 0.5,
    attributes: {
        width: 200,
        height: 100,
    },
})

add({
    type: 'rect',
    x: 300,
    y: 100,
    attributes: {
        width: 100,
        height: 100,
    },
})

for (let i = 0; i < 50; i += 1) {
    add({
        type: 'rect',
        x: i * 10,
        y: i * 10,
        attributes: {
            width: 100,
            height: 100,
        },
    })
}

export default data
