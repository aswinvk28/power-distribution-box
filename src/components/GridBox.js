import React, { useState, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import update from 'immutability-helper';
import { useEffect } from 'react'
import { fromEvent } from 'rxjs'
import { map, throttleTime } from 'rxjs/operators'
const style = {
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
};
let styleCopy = {};
export const GridBox = ({ name, type, uniqid, distribution, e_name, isDropped }) => {
    // useDrag denotes draggable
    const [{ opacity, initialOffset, currentOffset }, drag] = useDrag({
        // add attributes here
        item: { name, type, uniqid, distribution },
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.4 : 1,
            initialOffset: monitor.getInitialClientOffset(),
            currentOffset: monitor.getSourceClientOffset()
        }),
        isDragging: (monitor) => {
            let monitor_initialOffset = monitor.getInitialClientOffset();
            let monitor_currentOfset = monitor.getSourceClientOffset();

            return {
                initialOffset: monitor_initialOffset,
                currentOffset: monitor_currentOfset,
            }
        }
    });
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
    let position = useMousePosition();
    // left and top are saved on refresh
    if(currentOffset && e_name == "cartesian") {
        styleCopy = Object.assign({}, style);
        styleCopy['left'] = "100px";
        styleCopy['top'] = currentOffset.y;
    }
    let className = "grid-box grid-box-item-" + name;
    return (<div ref={drag} style={{...styleCopy, opacity}} className={className}>
			{isDropped ? <s>{name}</s> : name}
		</div>);
};
