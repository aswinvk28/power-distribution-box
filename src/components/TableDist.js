import React, { useState, useCallback, useEffect } from 'react';
import $ from 'jquery';
import { Distribution } from './Distribution';

export default class TableDist extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {accept, lastDroppedItem, totalDroppedItems, e_name, onDrop, index} = this.props;
        this.e_name = e_name;
        return (<Distribution container={this.props.container} accept={accept} 
            lastDroppedItem={lastDroppedItem} 
            totalDroppedItems={totalDroppedItems} 
            e_name={e_name}
            onDrop={onDrop} key={index}/>
        )
    }

}