import React, { useState, useCallback } from 'react';
import { Distribution } from './Distribution';
import { DustBin } from './DustBin';
import { Box } from './Box';
import { ItemTypes } from './ItemTypes';
import update from 'immutability-helper';
import Uniqid from './Uniqid';

export const Container = () => {
    // total dropped items overall including ones dropped in and dropped out of the grid
    const [distributions, setDistributions] = useState([
        { accepts: [ItemTypes.PILOT_LIGHTS, ItemTypes.MULTIMETER], lastDroppedItem: null, 
            totalDroppedItems: [], e_name: "cartesian" },
        { accepts: [ItemTypes.PLUGS, ItemTypes.SOCKETS], lastDroppedItem: null, 
            totalDroppedItems: [], e_name: "templated" }
    ]);
    const [boxes] = useState([
        { name: 'Plugs', type: ItemTypes.PLUGS, uniqid: null, distribution: null },
        { name: 'Sockets', type: ItemTypes.SOCKETS, uniqid: null, distribution: null },
        { name: 'Pilot Lights', type: ItemTypes.PILOT_LIGHTS, uniqid: null, distribution: null },
        { name: 'Multimeter', type: ItemTypes.MULTIMETER, uniqid: null, distribution: null }
    ]);
    const [droppedBoxNames, setDroppedBoxNames] = useState([]);
    function isDropped(boxName) {
        return droppedBoxNames.indexOf(boxName) > -1;
    }
    const handleDrop = useCallback((index, item) => {
        const { name } = item;
        item.uniqid = Uniqid(item.name);
        item.distribution = index;
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

    const [dustbins, setDustBin] = useState([
        { accepts: [ItemTypes.PLUGS, ItemTypes.SOCKETS, 
            ItemTypes.PILOT_LIGHTS, ItemTypes.MULTIMETER] },
    ]);
    
    const handleDustBinDrop = useCallback((num, item) => {
        alert(JSON.stringify(item));
        const distribution = item.distribution;
        let droppedItems = distributions[distribution].totalDroppedItems;
        
        // search by uniqid
        let newDroppedItems = [];
        for(var i = 0; i < droppedItems.length; i++) {
            if(item.uniqid === droppedItems[i].uniqid) {
                //found = i;
            } else {
                newDroppedItems.push(droppedItems[i]);
            }
        }

        setDistributions(update(distributions, {
            [distribution]: {
                totalDroppedItems: {
                    $set: newDroppedItems
                }
            },
        }))
    }, [distributions]);
    return (<div className="AppInnerContainer">
            <div style={{ overflow: 'hidden', clear: 'both' }}>
                {distributions.map(({ accepts, lastDroppedItem, totalDroppedItems }, index) => (<Distribution accept={accepts} 
                lastDroppedItem={lastDroppedItem} 
                totalDroppedItems={totalDroppedItems} 
                onDrop={(item) => handleDrop(index, item)} key={index}/>))}
            </div>

            <div style={{ overflow: 'hidden', clear: 'both' }}>
                {boxes.map(({ name, type }, index) => (<Box name={name} type={type} isDropped={isDropped(name)} key={index}/>))}
            </div>

        {dustbins.map(({accepts}, num) => (
            <DustBin key={num} accept={accepts} onDrop={(item) => handleDustBinDrop(num, item)}></DustBin>
        ))}
            
		</div>);
};
