import React, { useState, useCallback, useEffect } from 'react';
import { fromEvent } from 'rxjs'
import { map, throttleTime } from 'rxjs/operators'
import { snapToGrid as doSnapToGrid } from './snapToGrid';
import { useDrop } from 'react-dnd';
import { GridBox } from './GridBox';
import Constants from './Constants';
import { HighlightComponent } from './HighlightComponent';
import $ from 'jquery';
const useLocalStorage = Constants.useLocalStorage;

let style = {
    marginBottom: '0.5rem',
    padding: '5%',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal'
};

export const Distribution = ({ accept, lastDroppedItem, totalDroppedItems, e_name, onDrop, }) => {
    let currentItem = null;

    // useDrop denotes droppable
    const [{ isOver, canDrop, initialOffset, currentOffset, clientOffset, item }, drop] = useDrop({
        accept,
        drop: onDrop,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            initialOffset: monitor.getInitialClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            clientOffset: monitor.getClientOffset(),
            item: monitor.getItem()
        }),
        canDrop: (item, monitor) => {
            return (item.distribution != null) || (item.distribution != undefined) ? false : true;
        },
        hover: (item, monitor) => {
            currentItem = item;
            // specify an id for styling purposes
            let id = "element-box-item-" + item.name;
            item.dragElementId = id;
            item.highlightComponent = "highlight-component-" + item.name;
            return false;
        }
    });
    const isActive = isOver && canDrop;
    let backgroundColor = 'transparent';
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

    let $elem = <div></div>;
    if(item && clientOffset && currentOffset && document.getElementById(item.dragElementId)) {
        $elem = <HighlightComponent item={item} currentOffset={currentOffset}
        clientOffset={clientOffset} />
    }

    let position = useMousePosition();

    // // mouse tracking
    function useMousePosition() {
        const [x, setX] = useState(null)
        const [y, setY] = useState(null)

        useEffect(() => {
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

        if(canDrop && item && document.getElementById(item.highlightComponent)) {
            // left and top are saved on refresh
            let [left, top] = doSnapToGrid(x, y);
            document.getElementById(item.highlightComponent).style.left = left.toString() + "px";
            document.getElementById(item.highlightComponent).style.top = top.toString() + "px";
            document.getElementById(item.dragElementId).style.left = left.toString() + "px";
            document.getElementById(item.dragElementId).style.top = top.toString() + "px";
            item.left = left.toString() + "px";
            item.top = top.toString() + "px";
        }

        return { mouseX: x, mouseY: y }
    }

    return (<div style={{ ...style }} className={e_name} id={e_name}>
            <em style={{position: 'absolute', fontSize: '24px', color: 'rgb(50, 55, 165)'}}>
            {e_name.indexOf("addons") > -1 ? 'addons' : ''}
            {e_name.indexOf("inputs") > -1 ? 'inputs' : ''}
            {e_name.indexOf("outputs") > -1 ? 'outputs' : ''}
            </em>

            {$elem}

            <div ref={drop} style={{ backgroundColor }} className="distribution_container" id={e_name + "_distribution_container"}>
                {
                    totalDroppedItems.map((item, index) =>  {
                        return (
                            <GridBox name={item.name} type={item.type} uniqid={item.uniqid} key={item.index}
                            distribution={item.distribution} image={item.image} e_name={e_name}
                            top={item.top} left={item.left}
                            isDropped={true} />
                        )
                    })
                }
            </div>
		</div>);
};
