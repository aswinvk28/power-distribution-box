import React from 'react'
import Controller from './Controller'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import $ from 'jquery';

window.setCache = function() {
    if(localStorage.getItem("cartesian: size")) {
        $('#unit_size2').val(localStorage.getItem("cartesian: size"));
    }
    if(localStorage.getItem("templated: size")) {
        $('#unit_size1').val(localStorage.getItem("templated: size"));
    }
}

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