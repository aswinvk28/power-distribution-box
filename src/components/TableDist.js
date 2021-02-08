import React, { useState, useCallback, useEffect } from 'react';
import $ from 'jquery';
import { Distribution } from './Distribution';

export default class TableDist extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        $(document.getElementById(this.e_name)).css('height', ($(document).width() * 0.40 / 681 * 1455).toString() + "px");
        document.getElementById(this.e_name + "_distribution_container").style.height = 
        (1137 * $(document.getElementById(this.e_name)).outerWidth() / 681).toString() + "px"; // outerWidth
    }

    render() {
        const {accept, lastDroppedItem, totalDroppedItems, e_name, onDrop, index} = this.props;
        this.e_name = e_name;
        return (
            <Distribution accept={accept} 
            lastDroppedItem={lastDroppedItem} 
            totalDroppedItems={totalDroppedItems} 
            e_name={e_name}
            onDrop={onDrop} key={index}/>
        )
    }

}