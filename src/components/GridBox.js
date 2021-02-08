import React, { useState, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import update from 'immutability-helper';
import { useEffect } from 'react'
import { fromEvent } from 'rxjs'
import { map, throttleTime } from 'rxjs/operators'
import { ItemTypes } from './ItemTypes';
import { snapToGrid as doSnapToGrid } from './snapToGrid';
import DistributionMenu from './DistributionMenu';
import $ from 'jquery';
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
export const GridBox = ({ name, type, uniqid, distribution, image, top, left, e_name, isDropped }) => {
    let shortClassName = "grid-box-item-" + name;
    let className = "grid-box " + shortClassName;

    // specify an id for styling purposes
    let id = shortClassName + "-" + uniqid;

    let width = widths[type];

    // useDrag denotes draggable
    const [{ opacity, initialOffset, currentOffset, clientOffset, item }, drag] = useDrag({
        // add attributes here
        item: { name, type, uniqid, distribution, image, top, left, width },
        collect: (monitor) => ({
            item: monitor.getItem(),
            opacity: monitor.isDragging() ? 0.4 : 1,
            initialOffset: monitor.getInitialClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            clientOffset: monitor.getClientOffset(),
            canDrag: monitor.canDrag()
        })
    });
    function saveItem(item) {
        let key = item.distribution == 0 ? "cartesian: items" : "templated: items";
        let items = JSON.parse(localStorage.getItem(key));
        for(var i in items) {
            if(items[i] == item.uniqid) {
                items[i] = item;
                break;
            }
        }
        localStorage.setItem(key, JSON.stringify(items));
    }
    return (<div ref={drag} style={{...style, opacity, top, left}} className={className} id={id}>
            <DistributionMenu image={image} name={name} width={widths[type]} height="auto" />
		</div>);
};
