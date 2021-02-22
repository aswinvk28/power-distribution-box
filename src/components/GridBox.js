import React, { useState, useCallback, useLayoutEffect } from 'react';
import { useDrag } from 'react-dnd';
import update from 'immutability-helper';
import { useEffect } from 'react'
import { fromEvent } from 'rxjs'
import { map, throttleTime } from 'rxjs/operators'
import { ItemTypes } from './ItemTypes';
import { snapToGrid as doSnapToGrid } from './snapToGrid';
import DistributionMenu from './DistributionMenu';
import $ from 'jquery';
import Singleton from './Singleton';
import Constants from './Constants';
const style = {
    border: '1px dashed gray',
    backgroundColor: 'transparent',
    padding: '0.1px',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
    zIndex: 1000,
};
export const GridBox = ({ name, type, uniqid, distribution, image, top, left, width, 
    height, distribution_name, description, container, breaker, breaker_item, e_name, isDropped }) => {
    // specify an id for styling purposes
    let {className, id} = Singleton.getGridBoxId({name, uniqid});

    // useDrag denotes draggable
    const [{ opacity, initialOffset, currentOffset, clientOffset, item, isDragging, canDrag }, drag] = useDrag({
        // add attributes here
        item: { name, type, uniqid, distribution, image, width, height, distribution_name, description },
        collect: (monitor) => ({
            item: monitor.getItem(),
            opacity: monitor.isDragging() ? 0.4 : 1,
            initialOffset: monitor.getInitialClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            clientOffset: monitor.getClientOffset(),
            canDrag: monitor.canDrag(),
            isDragging: monitor.isDragging()
        })
    });

    let grid_heights = Object.fromEntries(container.controller.grid_heights);

    let position = useMousePosition();

    // // mouse tracking
    function useMousePosition() {
        const [x, setX] = useState(null)
        const [y, setY] = useState(null)

        useLayoutEffect(() => {
            // Subscribe to the mousemove event
            const sub = fromEvent(document, 'drag')
            // Extract out current mouse position from the event
            .pipe(map(event => [event.clientX, event.clientY]))
            // We have closure over the updater functions for our two state variables
            // Use these updaters to bridge the gap between RxJS and React
            .subscribe(([newX, newY]) => {
                setX(newX + window.scrollX)
                setY(newY + window.scrollY)
            })

            // When the component unmounts, remove the event listener
            return () => {
                sub.unsubscribe()
            }
            // We use [] here so that this effect fires exactly once.
            // (After the first render)
        }, [])

        // moving
        if(isDragging && x && y) {
            container.setDragDrop(true);
            let [left, top] = doSnapToGrid(x, y);
            let offset = {left: 0, top: 0};
            if(distribution_name == "cartesian") {
                offset = $('#cartesian_distribution_container').offset();
            } else if(distribution_name == "templated") {
                offset = $('#templated_distribution_container').offset();
            }
            let item = getItem(uniqid);
            let breaker_item = item.breaker_item;
            // save item
            if(item && (left-offset['left']) >= 0 && (left-offset['left']) <= (Constants.drawingScale * 450)
            && (top-offset['top']-40) >= 0 && (top-offset['top']-40) <= (Constants.drawingScale * (grid_heights[container.state['distributionSize']]-50))) {
                item.left = (left-offset['left'])+'px';
                item.top = (top-offset['top']-40)+'px';
                saveItem(item);
                // breaker_item attribute is null for others
                if(breaker_item) {
                    breaker_item.left = item.left;
                    breaker_item.top = item.top;
                    saveItem(breaker_item);
                }
            }
            // disable select option on moving out of the window for each boxes
            // if(item && (top-offset['top']-40) >= 461.9) {
            //     $(container.selectRef.options[1]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[2]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[3]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[4]).attr('disabled', 'disabled');
            // } else if(item && (top-offset['top']-40) >= 368.0) {
            //     $(container.selectRef.options[2]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[3]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[4]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[1]).removeAttr("disabled");
            // } else if(item && (top-offset['top']-40) >= 274.0) {
            //     $(container.selectRef.options[3]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[4]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[2]).removeAttr("disabled");
            //     $(container.selectRef.options[1]).removeAttr("disabled");
            // } else if(item && (top-offset['top']-40) >= 189.4) {
            //     $(container.selectRef.options[4]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[3]).removeAttr("disabled");
            //     $(container.selectRef.options[2]).removeAttr("disabled");
            //     $(container.selectRef.options[1]).removeAttr("disabled");
            // } else {
            //     $(container.selectRef.options[4]).removeAttr("disabled");
            //     $(container.selectRef.options[3]).removeAttr("disabled");
            //     $(container.selectRef.options[2]).removeAttr("disabled");
            //     $(container.selectRef.options[1]).removeAttr("disabled");
            // }
        } else {
            container.setDragDrop(false);
        }

        return { mouseX: x, mouseY: y }
    }
    function getItem(uniqid) {
        let items = container.getTotalDroppedItems(item.distribution);
        for(var i in items) {
            if(uniqid == items[i].uniqid) {
                return items[i];
            }
        }
        return null;
    }
    function saveItem(item) {
        let items = container.getTotalDroppedItems(item.distribution);
        for(var i in items) {
            if(items[i].uniqid == item.uniqid) {
                items[i] = item;
                break;
            }
        }
        container.setTotalDroppedItems(items, item.distribution, item.distribution_name);
    }
    // function default_breaker() {
    //     if('default' in breaker) {
    //         return (
    //             <img key="0" className="breaker-default" src={breaker.default.image} width="30px" height="auto" style={{marginLeft: "15px"}} />
    //         )
    //     }
    //     return null;
    // }

    // width = (parseFloat(width.replace('px', ''))).toString() + 'px';

    return (<div ref={drag} style={{...style, opacity, top, left}} className={className} id={id}>
            <DistributionMenu key={id} image={image} name={name} width={width} height="auto" name={name} type={type} 
            uniqid={uniqid} distribution_name={distribution_name} distribution={distribution}
            breaker_item={breaker_item} />
		</div>);
};
