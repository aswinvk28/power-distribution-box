import React, { useState, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import update from 'immutability-helper';
import $ from 'jquery';
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
    if(currentOffset && e_name == "cartesian") {
        styleCopy = Object.assign({}, style);
        styleCopy['left'] = currentOffset.x;
        styleCopy['top'] = currentOffset.y;
    }
    return (<div ref={drag} style={{...styleCopy, opacity}}>
			{isDropped ? <s>{name}</s> : name}
		</div>);
};
