import React, { useState, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import update from 'immutability-helper';
import { useEffect } from 'react'
import { fromEvent } from 'rxjs'
import { map, throttleTime } from 'rxjs/operators'
import { ItemTypes } from './ItemTypes';
import { snapToGrid as doSnapToGrid } from './snapToGrid';
const style = {
    border: '1px dashed gray',
    backgroundColor: 'transparent',
    padding: '0.1px',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
};
let styleCopy = {};
// define the widths here
let widths = {};
widths[ItemTypes.PLUGS] = "40px";
widths[ItemTypes.SOCKETS] = "40px";
widths[ItemTypes.PILOT_LIGHTS] = "20px";
widths[ItemTypes.MULTIMETER] = "50px";
widths[ItemTypes.LIVE_PINS_INPUT] = "50px";
widths[ItemTypes.LIVE_PINS_OUTPUT] = "50px";
widths[ItemTypes.PINS_INPUT_1] = "40px";
widths[ItemTypes.PINS_INPUT_2] = "40px";
widths[ItemTypes.PLUGS_1] = "40px";
widths[ItemTypes.PLUGS_2] = "40px";
widths[ItemTypes.PLUGS_3] = "40px";
widths[ItemTypes.PLUGS_4] = "40px";
widths[ItemTypes.PLUGS_5] = "40px";
widths[ItemTypes.SOCKETS_1] = "40px";
widths[ItemTypes.SOCKETS_2] = "40px";
widths[ItemTypes.SOCKETS_3] = "40px";
export const GridBox = ({ name, type, uniqid, distribution, image, e_name, isDropped }) => {
    let shortClassName = "grid-box-item-" + name;
    let className = "grid-box " + shortClassName;
    let width = "20px";
    if(name == ItemTypes.LIVE_PINS_INPUT || name == ItemTypes.LIVE_PINS_OUTPUT) {
        width = "50px";
    }
    
    // specify an id for styling purposes
    let id = shortClassName + "-" + uniqid;

    let position = useMousePosition();

    // useDrag denotes draggable
    const [{ opacity, initialOffset, currentOffset, clientOffset }, drag] = useDrag({
        // add attributes here
        item: { name, type, uniqid, distribution, image },
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.4 : 1,
            initialOffset: monitor.getInitialClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            clientOffset: monitor.getClientOffset()
        })
    });
    useEffect(() => {
        // left and top are saved on refresh
        if(currentOffset && e_name == "cartesian") {
            document.getElementById(id).style.position = "absolute";
            let [left, top] = doSnapToGrid(clientOffset.x, currentOffset.y);
            document.getElementById(id).style.left = left.toString() + "px";
            document.getElementById(id).style.top = top.toString() + "px";
        }
    }, [])
    // mouse tracking
    function useMousePosition() {
        const [x, setX] = useState(null)
        const [y, setY] = useState(null)
        
        useEffect(() => {
            // Subscribe to the mousemove event
            const sub = fromEvent(document, 'mousemove')
            // Extract out current mouse position from the event
            .pipe(map(event => [event.clientX, event.clientY]))
            // We have closure over the updater functions for our two state variables
            // Use these updaters to bridge the gap between RxJS and React
            .subscribe(([newX, newY]) => {
                setX(newX)
                setY(newY)
            })
        
            // When the component unmounts, remove the event listener
            return () => {
                sub.unsubscribe()
            }
            // We use [] here so that this effect fires exactly once.
            // (After the first render)
        }, [])
        
        return { mouseX: x, mouseY: y }
    }
    return (<div ref={drag} style={{...style, opacity}} className={className} id={id}>
            <img src={image} alt={name} title={name} width={widths[type]} height="auto" />
		</div>);
};
