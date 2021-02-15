import React, { useRef } from 'react';
import ReactDOM from "react-dom";
import { ContextMenuTrigger, ContextMenu, ContextMenuItem } from 'rctx-contextmenu';
import Singleton from './Singleton'

class DistributionMenu extends React.Component {

    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(uniqid, distribution, distribution_name) {
        return (
            (event) => {
                Singleton.removeItem({ uniqid, distribution, distribution_name })
            }
        )
    }

    render() {
        let { image, name, width, height, uniqid, distribution, distribution_name } = this.props;
        this.item = {image, name, width, height};
        return (
            <div className="distribution-box-menu">
                <ContextMenuTrigger
                    id={"context-menu-"+uniqid}
                >
                    <div className="box">
                        <img src={image} alt={name} title={name} width={width} height={height} />
                    </div>
                </ContextMenuTrigger>
            
                <ContextMenu id={"context-menu-"+uniqid}>
                    <ContextMenuItem onClick={this.handleClick(uniqid, distribution, distribution_name)}>Remove</ContextMenuItem>
                </ContextMenu>
            </div>
        )
    }

}

export default DistributionMenu;