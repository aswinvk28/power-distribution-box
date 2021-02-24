import React, { useRef } from 'react';
import ReactDOM from "react-dom";
import { ContextMenuTrigger, ContextMenu, ContextMenuItem, Submenu } from 'rctx-contextmenu';
import Singleton from './Singleton';
import { ItemTypes } from './ItemTypes';
import Constants from './Constants';
import Uniqid from './Uniqid';
import $ from 'jquery';

class DistributionMenu extends React.Component {

    constructor(props) {
        super(props)
        this.container = this.props.container;
        this.handleClick = this.handleClick.bind(this);
        this.changeToMCB = this.changeToMCB.bind(this);
        this.changeToRCD = this.changeToRCD.bind(this);
    }

    handleClick(event) {
        const { uniqid, distribution, distribution_name, breaker_item } = this.props;
        Singleton.removeItem({ uniqid, distribution, distribution_name, breaker_item });
    }

    changeToMCB(event) {
        let { breaker_item, box_item } = this.props;
        if(breaker_item.breaker_type == Constants.ElementType.MCB) {
            event.preventDefault();
            return false;
        }
        const e_name = breaker_item.distribution_name;
        const index = breaker_item.distribution;
        let items = this.container.getTotalDroppedItems(index);
        let new_breaker_item = null;

        let new_items = [];
        items.map((item, index) => {
            if(item.uniqid == breaker_item.uniqid) {
                new_breaker_item = {...this.container.state['breakers'][breaker_item.order + 1]};
                new_breaker_item.uniqid = Uniqid(new_breaker_item.name);
                new_breaker_item.left = breaker_item.left;
                new_breaker_item.top = breaker_item.top;
                new_breaker_item.width = breaker_item.size.width;
                new_breaker_item.height = breaker_item.size.height;
                new_items.push(new_breaker_item);
            } else {
                new_items.push(item);
            }
        });

        let dist1 = this.container.setTotalDroppedItems(new_items, index, e_name);
        // save input/output element
        items = this.container.getTotalDroppedItems(box_item.distribution);
        new_items = [];
        items.map((item, index) => {
            if(item.uniqid == box_item.uniqid) {
                box_item.breaker_item = new_breaker_item;
                new_items.push(box_item);
            } else {
                new_items.push(item);
            }
        });
        let dist2 = this.container.setTotalDroppedItems(new_items, box_item.distribution, box_item.distribution_name);
        this.container.setDistributions([dist2[0], dist1[1]]);
    }

    changeToRCD(event) {
        let { breaker_item, box_item } = this.props;
        if(breaker_item.breaker_type == Constants.ElementType.RCD) {
            event.preventDefault();
            return false;
        }
        const e_name = breaker_item.distribution_name;
        const index = breaker_item.distribution;
        // save breaker
        let items = this.container.getTotalDroppedItems(index);
        let new_breaker_item = null;
        let new_items = [];
        items.map((item, index) => {
            if(item.uniqid == breaker_item.uniqid) {
                new_breaker_item = {...this.container.state['breakers'][breaker_item.order + 1]};
                new_breaker_item.uniqid = Uniqid(new_breaker_item.name);
                new_breaker_item.left = breaker_item.left;
                new_breaker_item.top = breaker_item.top;
                new_breaker_item.width = breaker_item.size.width;
                new_breaker_item.height = breaker_item.size.height;
                new_items.push(new_breaker_item);
            } else {
                new_items.push(item);
            }
        });
        let dist1 = this.container.setTotalDroppedItems(new_items, index, e_name);
        // save input/output element
        items = this.container.getTotalDroppedItems(box_item.distribution);
        new_items = [];
        items.map((item, index) => {
            if(item.uniqid == box_item.uniqid) {
                box_item.breaker_item = new_breaker_item;
                new_items.push(box_item);
            } else {
                new_items.push(item);
            }
        });
        let dist2 = this.container.setTotalDroppedItems(new_items, box_item.distribution, box_item.distribution_name);
        this.container.setDistributions([dist2[0], dist1[1]]);
    }

    render() {
        let { image, name, type, width, height, uniqid, distribution, distribution_name, breaker_item, mcb, rcd } = this.props;
        this.item = {image, name, width, height};
        let className = mcb ? "mcb-item" : rcd ? "rcd-item" : "";
        let menu = <ContextMenu id={"context-menu-"+uniqid}>
                        <ContextMenuItem onClick={this.handleClick}>Remove</ContextMenuItem>
                        <ContextMenuItem>
                            <Submenu title="Breakers">
                                <ContextMenuItem onClick={this.changeToMCB}><i className="mcb-option fas fa-toggle-on">-</i> MCB</ContextMenuItem>
                                <ContextMenuItem onClick={this.changeToRCD}><i className="rcd-option fas fa-toggle-on">-</i> RCD</ContextMenuItem>
                            </Submenu>
                        </ContextMenuItem>
                    </ContextMenu>
        if(type === ItemTypes.BREAKERS) {
            menu = <ContextMenu id={"context-menu-"+uniqid}>
                    </ContextMenu>;
        }
        return (
            <div className={"distribution-box-menu "+className} id={"distribution-box-menu-"+uniqid} key={"distribution-box-menu-"+uniqid}>
                <ContextMenuTrigger 
                    id={"context-menu-"+uniqid} disableWhileShiftPressed={true}
                >
                    <div className="box">
                        <img src={image} alt={name} title={name} width={width} height={height} />
                    </div>
                </ContextMenuTrigger>

                {menu}
            </div>
        )
    }

}

export default DistributionMenu;