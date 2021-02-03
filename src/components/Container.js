import React, { useState, useCallback } from 'react';
import { Distribution } from './Distribution';
import { DustBin } from './DustBin';
import { Box } from './Box';
import { ItemTypes } from './ItemTypes';
import update from 'immutability-helper';
import Uniqid from './Uniqid';
import Constants from './Constants';
import { snapToGrid as doSnapToGrid } from './snapToGrid';
import { DraggableBox } from './DraggableBox';
import { useDrop } from 'react-dnd';
const useLocalStorage = Constants.useLocalStorage;

const buckets = {
    "cartesian": null, 
    "templated_inputs_row1": null,
    "templated_inputs_row2": null,
    "templated_outputs_row1": null,
    "templated_outputs_row2": null,
    "templated_addons_row1": null,
    "templated_addons_row2": null
};

const plugsAndSockets = [ItemTypes.PLUGS_1, ItemTypes.PLUGS_2, ItemTypes.PLUGS_3, ItemTypes.PLUGS_4, ItemTypes.PLUGS_5, 
    ItemTypes.SOCKETS_1, ItemTypes.SOCKETS_2, ItemTypes.SOCKETS_3];
    
    const allTypes = [ItemTypes.PLUGS_1, ItemTypes.PLUGS_2, ItemTypes.PLUGS_3, ItemTypes.PLUGS_4, ItemTypes.PLUGS_5, 
        ItemTypes.SOCKETS_1, ItemTypes.SOCKETS_2, ItemTypes.SOCKETS_3, ItemTypes.PILOT_LIGHTS, 
        ItemTypes.MULTIMETER, ItemTypes.LIVE_PINS_INPUT, ItemTypes.LIVE_PINS_OUTPUT, 
    ItemTypes.PINS_INPUT_1, ItemTypes.PINS_INPUT_2];

const style = {
    width: '100%',
    // marginRight: '0.5rem',
    marginBottom: '0.5rem',
    color: 'white',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
    float: 'left',
};

export const Container = ({ snapToGrid }) => {
    // load from localStorage the distributions

    let cartesianDroppedItems = null, 
    templatedInput1DroppedItems = null, templatedInput2DroppedItems = null, templatedOutput1DroppedItems = null,
    templatedOutput2DroppedItems = null, templatedAddon1DroppedItems = null, templatedAddon2DroppedItems = null;
    if(useLocalStorage) {
        cartesianDroppedItems = localStorage.getItem("cartesian" + ": items");
        templatedInput1DroppedItems = localStorage.getItem("templated_inputs_row1" + ": items");
        templatedInput2DroppedItems = localStorage.getItem("templated_inputs_row2" + ": items");
        templatedOutput1DroppedItems = localStorage.getItem("templated_outputs_row1" + ": items");
        templatedOutput2DroppedItems = localStorage.getItem("templated_outputs_row2" + ": items");
        templatedAddon1DroppedItems = localStorage.getItem("templated_addons_row1" + ": items");
        templatedAddon2DroppedItems = localStorage.getItem("templated_addons_row2" + ": items");
        if(!cartesianDroppedItems) {
            cartesianDroppedItems = [];
        } else {
            cartesianDroppedItems = JSON.parse(cartesianDroppedItems);
        }
        if(!templatedInput1DroppedItems) {
            templatedInput1DroppedItems = [];
        } else {
            templatedInput1DroppedItems = JSON.parse(templatedInput1DroppedItems);
        }
        if(!templatedInput2DroppedItems) {
            templatedInput2DroppedItems = [];
        } else {
            templatedInput2DroppedItems = JSON.parse(templatedInput2DroppedItems);
        }
        if(!templatedOutput1DroppedItems) {
            templatedOutput1DroppedItems = [];
        } else {
            templatedOutput1DroppedItems = JSON.parse(templatedOutput1DroppedItems);
        }
        if(!templatedOutput2DroppedItems) {
            templatedOutput2DroppedItems = [];
        } else {
            templatedOutput2DroppedItems = JSON.parse(templatedOutput2DroppedItems);
        }
        if(!templatedAddon1DroppedItems) {
            templatedAddon1DroppedItems = [];
        } else {
            templatedAddon1DroppedItems = JSON.parse(templatedAddon1DroppedItems);
        }
        if(!templatedAddon2DroppedItems) {
            templatedAddon2DroppedItems = [];
        } else {
            templatedAddon2DroppedItems = JSON.parse(templatedAddon2DroppedItems);
        }
    }
    
    // total dropped items overall including ones dropped in and dropped out of the grid
    const [distributions, setDistributions] = useState([
        { accepts: [ItemTypes.PILOT_LIGHTS, ItemTypes.MULTIMETER], lastDroppedItem: null, 
            totalDroppedItems: cartesianDroppedItems, e_name: "cartesian" },
        { accepts: plugsAndSockets, lastDroppedItem: null, 
            totalDroppedItems: templatedInput1DroppedItems, e_name: "templated_inputs_row1" },
        { accepts: plugsAndSockets, lastDroppedItem: null, 
            totalDroppedItems: templatedInput2DroppedItems, e_name: "templated_inputs_row2" },
        { accepts: plugsAndSockets, lastDroppedItem: null, 
            totalDroppedItems: templatedOutput1DroppedItems, e_name: "templated_outputs_row1" },
        { accepts: plugsAndSockets, lastDroppedItem: null, 
            totalDroppedItems: templatedOutput2DroppedItems, e_name: "templated_outputs_row2" },
        { accepts: plugsAndSockets, lastDroppedItem: null, 
            totalDroppedItems: templatedAddon1DroppedItems, e_name: "templated_addons_row1" },
        { accepts: plugsAndSockets, lastDroppedItem: null, 
            totalDroppedItems: templatedAddon2DroppedItems, e_name: "templated_addons_row2" }
    ]);
    const [boxes, setBoxes] = useState([
        { name: 'Plugs@1', type: ItemTypes.PLUGS_1, uniqid: null, 
        distribution: null, left: 0, top: 0, index: 0, image: 'images/dist_box/Output-Plug-1.png' },
        { name: 'Plugs@2', type: ItemTypes.PLUGS_2, uniqid: null, 
        distribution: null, left: 0, top: 0, index: 0, image: 'images/dist_box/Output-Plug-2.png' },
        { name: 'Plugs@3', type: ItemTypes.PLUGS_3, uniqid: null, 
        distribution: null, left: 0, top: 0, index: 0, image: 'images/dist_box/Output-Plug-3.png' },
        { name: 'Plugs@4', type: ItemTypes.PLUGS_4, uniqid: null, 
        distribution: null, left: 0, top: 0, index: 0, image: 'images/dist_box/Output-Plug-4.png' },
        { name: 'Plugs@5', type: ItemTypes.PLUGS_5, uniqid: null, 
        distribution: null, left: 0, top: 0, index: 0, image: 'images/dist_box/Output-Plug-5.png' },
        { name: 'Sockets@1', type: ItemTypes.SOCKETS_1, uniqid: null, 
        distribution: null, left: 0, top: 0, index: 1, image: 'images/dist_box/Output-Socket-1.png' },
        { name: 'Sockets@2', type: ItemTypes.SOCKETS_2, uniqid: null, 
        distribution: null, left: 0, top: 0, index: 1, image: 'images/dist_box/Output-Socket-2.png' },
        { name: 'Sockets@3', type: ItemTypes.SOCKETS_3, uniqid: null, 
        distribution: null, left: 0, top: 0, index: 1, image: 'images/dist_box/Output-Socket-3.png' },
        { name: 'Pilot Lights', type: ItemTypes.PILOT_LIGHTS, uniqid: null, 
        distribution: null, left: 0, top: 0, index: 2, image: '' },
        { name: 'Multimeter', type: ItemTypes.MULTIMETER, uniqid: null, 
        distribution: null, left: 0, top: 0, index: 3, image: '' },
        { name: 'Live Pins Input', type: ItemTypes.LIVE_PINS_INPUT, uniqid: null, 
        distribution: null, left: 0, top: 0, index: 4, image: 'images/dist_box/Live-Pins-Inputs.png' },
        { name: 'Loop Through', type: ItemTypes.LIVE_PINS_OUTPUT, uniqid: null, 
        distribution: null, left: 0, top: 0, index: 5, image: 'images/dist_box/Live-Pins-Outputs.png' },
        { name: 'Pins Input@1', type: ItemTypes.PINS_INPUT_1, uniqid: null, 
        distribution: null, left: 0, top: 0, index: 4, image: 'images/dist_box/Inputs-Pin-1.png' },
        { name: 'Pins Input@2', type: ItemTypes.PINS_INPUT_2, uniqid: null, 
        distribution: null, left: 0, top: 0, index: 5, image: 'images/dist_box/Inputs-Pin-2.png' },
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
        { accepts: allTypes },
    ]);
    
    const handleDustBinDrop = useCallback((num, item) => {
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

    const moveBox = useCallback((index, uniqid, left, top) => {
        setBoxes(update(boxes, {
            [index]: {
                $merge: { left, top },
            },
        }));
    }, [boxes]);
    const [, drop] = useDrop({
        accept: allTypes,
        drop(item, monitor) {
            const delta = monitor.getDifferenceFromInitialOffset();
            let left = Math.round(item.left + delta.x);
            let top = Math.round(item.top + delta.y);
            if (snapToGrid) {
                ;
                [left, top] = doSnapToGrid(left, top);
            }
            moveBox(item.index, item.uniqid, left, top);
            return undefined;
        },
    });

    // render the draggable box
    function renderBox(item, index) {
        return (<DraggableBox key={index} id={index}
        name={item.name} type={item.type} 
        uniqid={item.uniqid}
        distribution={item.distribution}
        image={item.image}
        isDropped={isDropped(item.name)}
        {...item} />)
    }

    return (<div className="AppInnerContainer">
    <div style={{ overflow: 'hidden', clear: 'both' }}>
        <div style={style} className="templated-distributions-container">
            {distributions.map(({ accepts, lastDroppedItem, totalDroppedItems, e_name }, index) => (<Distribution accept={accepts} 
            lastDroppedItem={lastDroppedItem} 
            totalDroppedItems={totalDroppedItems} 
            e_name={e_name}
            onDrop={(item) => handleDrop(index, item)} key={index}/>))}
        </div>
    </div>

    <div drop={drop} style={{ overflow: 'hidden', clear: 'both', marginTop: "15px", width: "90%",
    height: 300, border: '1px solid black', position: 'relative' }} className="boxes-container">
        {boxes.map((item, index) => (
            renderBox(item, index)
        ))}
    </div>

    {dustbins.map(({accepts}, num) => (
        <DustBin key={num} accept={accepts} onDrop={(item) => handleDustBinDrop(num, item)}></DustBin>
    ))}
        
    </div>);
};
