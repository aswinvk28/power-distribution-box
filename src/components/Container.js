import React, { useState, useCallback } from 'react';
import { NativeTypes } from 'react-dnd-html5-backend';
import { Distribution } from './Distribution';
import { Box } from './Box';
import { ItemTypes } from './ItemTypes';
import update from 'immutability-helper';

export const Container = () => {
    // total dropped items overall including ones dropped in and dropped out of the grid
    const [distributions, setDistributions] = useState([
        { accepts: [ItemTypes.PILOT_LIGHTS, ItemTypes.MULTIMETER], lastDroppedItem: null, totalDroppedItems: [], e_name: "positional" },
        { accepts: [ItemTypes.PLUGS, ItemTypes.SOCKETS], lastDroppedItem: null, totalDroppedItems: [], e_name: "referential" }
    ]);
    const [boxes] = useState([
        { name: 'Plugs', type: ItemTypes.PLUGS },
        { name: 'Sockets', type: ItemTypes.SOCKETS },
        { name: 'Pilot Lights', type: ItemTypes.PILOT_LIGHTS },
        { name: 'Multimeter', type: ItemTypes.MULTIMETER }
    ]);
    const [droppedBoxNames, setDroppedBoxNames] = useState([]);
    function isDropped(boxName) {
        return droppedBoxNames.indexOf(boxName) > -1;
    }
    const handleDrop = useCallback((index, item) => {
        let bin = distributions[index];
        const { e_name } = bin;
        const { name } = item;
        setDroppedBoxNames(update(droppedBoxNames, name ? { $push: [name] } : { $push: [] }));
        setDistributions(update(distributions, {
            [index]: {
                lastDroppedItem: {
                    $set: item,
                },
                totalDroppedItems: {
                    $push: [item]
                }
            },
        }));
    }, [droppedBoxNames, distributions]);
    return (<div>
			<div style={{ overflow: 'hidden', clear: 'both' }}>
                {distributions.map(({ accepts, lastDroppedItem, totalDroppedItems }, index) => (<Distribution accept={accepts} 
                lastDroppedItem={lastDroppedItem} 
                totalDroppedItems={totalDroppedItems} 
                onDrop={(item) => handleDrop(index, item)} key={index}/>))}
			</div>

			<div style={{ overflow: 'hidden', clear: 'both' }}>
				{boxes.map(({ name, type }, index) => (<Box name={name} type={type} isDropped={isDropped(name)} key={index}/>))}
			</div>
		</div>);
};
