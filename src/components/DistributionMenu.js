import React from 'react';
import ReactDOM from "react-dom";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Singleton from './Singleton'

class DistributionMenu extends React.Component {

    constructor(props) {
        super(props)
    }

    handleClick(event) {
        Singleton.removeItem(this.item)
    }
    
    render() {
        let { image, name, width, height } = this.props;
        this.item = {image, name, width, height};
        return (
            <div className="distribution-box-menu">
                <ContextMenuTrigger id="distribution-box-contextmenu">
                    <div className="well"></div>
                    <img src={image} alt={name} title={name} width={width} height={height} />
                </ContextMenuTrigger>
            
                <ContextMenu id="distribution-box-contextmenu">
                    <MenuItem data={{}} onClick={this.handleClick}>Remove</MenuItem>
                </ContextMenu>
            </div>
        )
    }

}

export default DistributionMenu;