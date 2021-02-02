import React from 'react';
import { useDrop } from 'react-dnd';
const style = {
    height: '24rem',
    width: '24rem',
    marginRight: '0.5rem',
    marginBottom: '0.5rem',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
    float: 'left',
};
export const Distribution = ({ accept, lastDroppedItem, totalDroppedItems, onDrop, }) => {
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
    return (<div ref={drop} style={{ ...style, backgroundColor }}>
			{isActive
        ? 'Release to drop'
        : `This dustbin accepts: ${accept.join(', ')}`}

            {totalDroppedItems && (<p>All dropped: {JSON.stringify(totalDroppedItems)}</p>)}
		</div>);
};
