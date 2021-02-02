import React from 'react';
import { useDrop } from 'react-dnd';
const style = {
    height: '350px',
    marginRight: '10%',
    marginLeft: '5%',
    width: '90%',
    marginBottom: '0.5rem',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '5rem',
    lineHeight: 'normal',
    float: 'left',
};
export const DustBin = ({ accept, onDrop, }) => {
    // useDrop denotes droppable
    const [{ isOver, canDrop }, drop] = useDrop({
        accept,
        drop: onDrop,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });
    const isActive = isOver && canDrop;
    let backgroundColor = '#222';
    if (isActive) {
        backgroundColor = 'darkgreen';
    }
    else if (canDrop) {
        backgroundColor = 'darkkhaki';
    }
    return (<div ref={drop} style={{ ...style, backgroundColor }} className="dustbin-container">
		DUSTBIN</div>);
};
