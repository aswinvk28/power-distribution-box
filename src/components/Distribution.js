import React from 'react';
import { useDrop } from 'react-dnd';
import { GridBox } from './GridBox';
import Constants from './Constants';
const useLocalStorage = Constants.useLocalStorage;

const style = {
    marginBottom: '0.5rem',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
};

export const Distribution = ({ accept, lastDroppedItem, totalDroppedItems, e_name, onDrop, }) => {
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
    if(!totalDroppedItems) {
        totalDroppedItems = [];
    }
    if(totalDroppedItems) {
        localStorage.setItem(e_name + ": items", JSON.stringify(totalDroppedItems));
    }
    return (<div ref={drop} style={{ ...style, backgroundColor }} className={e_name}>
			{isActive
        ? 'Release to drop'
        : `accepts: ${accept.join(', ')}`}

            {
                totalDroppedItems.map(({name, type, uniqid, distribution}, index) =>  {
                    return (
                        <GridBox name={name} type={type} uniqid={uniqid} 
                        distribution={distribution} isDropped={true} />
                    )
                })
            }
		</div>);
};
