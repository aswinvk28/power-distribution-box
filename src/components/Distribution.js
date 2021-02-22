import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { fromEvent } from 'rxjs'
import { map, throttleTime } from 'rxjs/operators'
import { snapToGrid as doSnapToGrid } from './snapToGrid';
import { useDrop, useDrag } from 'react-dnd';
import { GridBox } from './GridBox';
import Constants from './Constants';
import { HighlightComponent } from './HighlightComponent';
import $ from 'jquery';
import Singleton from './Singleton';
const useLocalStorage = Constants.useLocalStorage;

let style = {
    marginBottom: '0.5rem',
    textAlign: 'center',
    padding: '66px',
    fontSize: '1rem',
    lineHeight: 'normal'
};

export const Distribution = ({ accept, lastDroppedItem, totalDroppedItems, e_name, container, onDrop, }) => {
    let currentItem = null;

    // useDrop denotes droppable
    const [{ isOver, canDrop, initialOffset, currentOffset, clientOffset, diffOffset, item }, drop] = useDrop({
        accept,
        drop: onDrop,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            initialOffset: monitor.getInitialClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            clientOffset: monitor.getClientOffset(),
            diffOffset: monitor.getInitialSourceClientOffset(),
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
        backgroundColor = '#AAA';
    }
    else if (canDrop) {
        backgroundColor = 'darkkhaki';
    }
    let $elem = <div></div>;
    if(item && clientOffset && currentOffset && document.getElementById(item.dragElementId)) {
        $elem = <HighlightComponent item={item} currentOffset={currentOffset}
        clientOffset={clientOffset} />
    }

    let drag_drop = false;
    if(canDrop || container.drag_drop) {
        drag_drop = true;
    } else {
        drag_drop = false;
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

        let offset = null;
        let dragElement = null;
        let w = null, h = null;

        // left and top are saved on refresh
        let [left, top] = doSnapToGrid(x, y);

        if(item) {
            dragElement = $('#'+item.dragElementId).find('img')/*, highlightComponent = $('#'+item.highlightComponent)*/;
            w = dragElement.width();
            h = dragElement.height();

            if(item.distribution_name == "cartesian") {
                offset = $('#cartesian_distribution_container').offset();
            } else if(item.distribution_name == "templated") {
                offset = $('#templated_distribution_container').offset();
            }

            if(canDrop) {
                if(item.distribution_name == "cartesian") {
                    item.left = ((left-offset['left']-w/2)).toString() + "px"; // !important
                    item.top = ((top-offset['top']-h/2)).toString() + "px"; // !important
                    
                    // code to reinstate highlight component if required
                    /*let width = $('#boxes_container_draggable_holder').width();
                    let width2 = $('#templated').parent().width();
                    let width3 = ($('#cartesian').parent().width() - 500*Constants.drawingScale) / 2;
                    let offset2 = $('#cartesian').offset();*/
                    // highlightComponent.css('width', (parseFloat((item.width).replace('px', '')) * Constants.drawingScale).toString() + 'px');
                    // highlightComponent.css('height', (parseFloat((item.height).replace('px', '')) * Constants.drawingScale).toString() + 'px');
                    // highlightComponent.css('left', ((left-offset2['left']-width+width2+width3+185)).toString() + "px");
                    // highlightComponent.css('top', ((top-offset['top'])).toString() + "px");
                } else if(item.distribution_name == "templated") {
                    item.left = ((left-offset['left']-w/2)).toString() + "px"; // !important
                    item.top = ((top-offset['top']-h/2)).toString() + "px"; // !important
                    
                    // code to reinstate highlight component if required
                    /*let width = $('#boxes_container_draggable_holder').width();
                    let width2 = ($('#templated').parent().width() - 500*Constants.drawingScale) / 2;
                    let offset2 = $('#templated').offset();*/
                    // highlightComponent.css('width', (parseFloat((item.width).replace('px', '')) * Constants.drawingScale).toString() + 'px');
                    // highlightComponent.css('height', (parseFloat((item.height).replace('px', '')) * Constants.drawingScale).toString() + 'px');
                    // highlightComponent.css('left', ((left-offset['left'])).toString() + "px");
                    // highlightComponent.css('top', ((top-offset['top'])).toString() + "px");
                }
            }

            // disable select option on moving out of the window for each boxes
            // collectively exhaustive events on coinciding with marginal line
            // if((top-offset['top']) >= 461.9) {
            //     $(container.selectRef.options[1]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[2]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[3]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[4]).attr('disabled', 'disabled');
            // } else if((top-offset['top']) >= 368.0) {
            //     $(container.selectRef.options[2]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[3]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[4]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[1]).removeAttr("disabled");
            // } else if((top-offset['top']) >= 274.0) {
            //     $(container.selectRef.options[3]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[4]).attr('disabled', 'disabled');
            //     $(container.selectRef.options[2]).removeAttr("disabled");
            //     $(container.selectRef.options[1]).removeAttr("disabled");
            // } else if((top-offset['top']) >= 189.4) {
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
        }

        return { mouseX: x, mouseY: y }
    }

    const [distributionSize, setDistributionSize] = useState(0);
    useLayoutEffect(() => {
        const size = localStorage.getItem("cartesian: size");
        if (size) {
            setDistributionSize(size);
            // predetermined heights
            heights = Object.fromEntries(container.controller.grid_heights);
            document.getElementById(e_name + "_distribution_container").style.height = 
            (heights[distributionSize] * $(document.getElementById(e_name)).outerWidth() / 681).toString() + "px"; // outerWidth
        }
    }, [distributionSize]);

    if(!totalDroppedItems) {
        totalDroppedItems = [];
    }

    // markers or alerts for placing elements over multiple sizes
    
    let $elements = null;
    switch(distributionSize) {
        case "24U":
            $elements = (
                <div className="sizing-variations">
                    <div className="size-8U" data-drop-size="8U">
                        8U
                    </div>
                    <div className="size-12U" data-drop-size="12U">
                        12U
                    </div>
                    <div className="size-16U" data-drop-size="16U">
                        16U
                    </div>
                    <div className="size-20U" data-drop-size="20U">
                        20U
                    </div>
                    <div className="size-24U" data-drop-size="24U">
                        24U
                    </div>
                </div>
            )
            break;

        case "20U":
            $elements = (
                <div className="sizing-variations">
                    <div className="size-8U" data-drop-size="8U">
                        8U
                    </div>
                    <div className="size-12U" data-drop-size="12U">
                        12U
                    </div>
                    <div className="size-16U" data-drop-size="16U">
                        16U
                    </div>
                    <div className="size-20U" data-drop-size="20U">
                        20U
                    </div>
                </div>
            )
            break;

        case "16U":
            $elements = (
                <div className="sizing-variations">
                    <div className="size-8U" data-drop-size="8U">
                        8U
                    </div>
                    <div className="size-12U" data-drop-size="12U">
                        12U
                    </div>
                    <div className="size-16U" data-drop-size="16U">
                        16U
                    </div>
                </div>
            )
            break;

        case "12U":
            $elements = (
                <div className="sizing-variations">
                    <div className="size-8U" data-drop-size="8U">
                        8U
                    </div>
                    <div className="size-12U" data-drop-size="12U">
                        12U
                    </div>
                </div>
            )
            break;

        case "8U":

            break;

        default:
            break;
    }

    let distribution_width = (Constants.drawingScale * 681).toString() + 'px';
    let grid_width = (Constants.drawingScale * 500).toString() + 'px';
    let heights = Object.fromEntries(Singleton.__singletonRef.controller.heights);
    let grid_heights = Object.fromEntries(Singleton.__singletonRef.controller.grid_heights);
    // let distribution_height = (Constants.drawingScale * heights[container.state['distributionSize']]).toString() + 'px';
    let grid_height = (Constants.drawingScale * grid_heights[container.state['distributionSize']]).toString() + 'px';
    let padding = (66 * Constants.drawingScale).toString() + 'px';

    return (<div className="col-lg-6 col-md-6 col-sm-6">
        <div style={{ ...style, padding, width: distribution_width }} className={e_name} id={e_name} data-size={container.state['distributionSize']}>


            <div ref={drop} style={{ width: grid_width, height: grid_height, backgroundColor, backgroundSize: (container.controller.state['value']-50+100)*2.0 + '%' }} className="distribution_container" id={e_name + "_distribution_container"}>
            {$elem}
            {drag_drop == true ? $elements : null}
                {
                    totalDroppedItems.map((item, index) =>  {
                        return (
                            <GridBox container={container} name={item.name} type={item.type} uniqid={item.uniqid} key={"gridbox-" + index}
                            distribution={item.distribution} image={item.image} e_name={e_name}
                            top={item.top} left={item.left} width={item.width} height={item.height}
                            distribution_name={item.distribution_name} description={item.description} 
                            breaker={item.breaker} 
                            breaker_item={item.breaker_item}
                            isDropped={true} />
                        )
                    })
                }
            </div>
		</div></div>);
};
