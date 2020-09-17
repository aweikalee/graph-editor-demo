/// <reference types="react-scripts" />
declare module '*.css' {
    const content: {
        [key: string]: string
    }
    export = content
}

declare module 'resize-observer-polyfill/src/utils/geometry'
