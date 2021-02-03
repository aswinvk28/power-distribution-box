import React from 'react';
import { useDrop } from 'react-dnd';
import { GridBox } from './GridBox';
import Constants from './Constants';
const useLocalStorage = Constants.useLocalStorage;

let style = {
    marginBottom: '0.5rem',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
};

export const Distribution = ({ accept, lastDroppedItem, totalDroppedItems, e_name, onDrop, }) => {
    // useDrop denotes droppable
    const [{ isOver, canDrop, initialOffset, currentOffset }, drop] = useDrop({
        accept,
        drop: onDrop,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            initialOffset: monitor.getInitialClientOffset(),
            currentOffset: monitor.getSourceClientOffset()
        }),
        canDrop: (item, monitor) => {
            return (item.distribution != null) || (item.distribution != undefined) ? false : true;
        }
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
			{e_name.indexOf("addons") > -1 ? 'addons' : ''}
            {e_name.indexOf("inputs") > -1 ? 'inputs' : ''}
            {e_name.indexOf("outputs") > -1 ? 'outputs' : ''}

            {
                totalDroppedItems.map(({name, type, uniqid, distribution}, index) =>  {
                    return (
                        <GridBox name={name} type={type} uniqid={uniqid} key={index}
                        distribution={distribution} e_name={e_name}
                        isDropped={true} />
                    )
                })
            }
		</div>);
};
