import React from 'react'
import Controller from './Controller'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function DrawingApp() {
    return (
        <div className="App">
            <DndProvider backend={HTML5Backend}>
                <Controller />
            </DndProvider>
        </div>
    )
}

export default DrawingApp;