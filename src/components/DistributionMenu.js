import React from 'react';
import ReactDOM from "react-dom";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

class DistributionMenu extends React.Component {

    constructor(props) {
        super(props)
    }

    handleClick() {

    }
    
    render() {
        let { image, name, width, height } = this.props;
        return (
            <div className="distribution-box-menu">
                <ContextMenuTrigger id="same_unique_identifier">
                    <div className="well"></div>
                    <img src={image} alt={name} title={name} width={width} height={height} />
                </ContextMenuTrigger>
            
                <ContextMenu id="same_unique_identifier">
                    <MenuItem data={{}} onClick={this.handleClick}>Remove</MenuItem>
                </ContextMenu>
            </div>
        )
    }

}

export default DistributionMenu;