import React, { useRef } from 'react';
import ReactDOM from "react-dom";
import { ContextMenuTrigger, ContextMenu, ContextMenuItem } from 'rctx-contextmenu';
import Singleton from './Singleton'
import { ItemTypes } from './ItemTypes';

class DistributionMenu extends React.Component {

    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(uniqid, distribution, distribution_name, breaker_item) {
        return (
            (event) => {
                Singleton.removeItem({ uniqid, distribution, distribution_name, breaker_item })
            }
        )
    }

    render() {
        let { image, name, type, width, height, uniqid, distribution, distribution_name, breaker_item } = this.props;
        this.item = {image, name, width, height};
        let menu = <ContextMenu id={"context-menu-"+uniqid}>
                        <ContextMenuItem onClick={this.handleClick(uniqid, distribution, distribution_name, breaker_item)}>Remove</ContextMenuItem>
                    </ContextMenu>
        if(type === ItemTypes.BREAKERS) {
            menu = <ContextMenu id={"context-menu-"+uniqid}>
                    </ContextMenu>;
        }
        return (
            <div className="distribution-box-menu">
                <ContextMenuTrigger
                    id={"context-menu-"+uniqid}
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