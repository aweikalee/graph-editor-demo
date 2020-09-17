import React, { useState } from 'react'
import Canvas from './components/Canvas'
import mockData from './data'
import { ILayer } from './types'

function App() {
    const [data, setData] = useState<ILayer[]>(mockData)
    return <Canvas layers={data} onUpdate={setData} />
}

export default App
