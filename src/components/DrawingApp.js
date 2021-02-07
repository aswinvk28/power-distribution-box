import '../App.css';
import React from 'react'
import PowerDist from './PowerDist'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function DrawingApp() {
    return (
        <div className="App">
            <DndProvider backend={HTML5Backend}>
                <PowerDist ref={powerdist => this.powerdist = powerdist} />
            </DndProvider>
        </div>
    )
}

export default DrawingApp;