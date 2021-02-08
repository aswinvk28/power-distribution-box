import React, { useState, useCallback, useEffect } from 'react';
import { fromEvent } from 'rxjs'
import { map, throttleTime } from 'rxjs/operators'
import { snapToGrid as doSnapToGrid } from './snapToGrid';
import $ from 'jquery';

export const HighlightComponent = ({ item, currentOffset, clientOffset }) => {
    let width = $(document.getElementById(item.dragElementId)).width();
    let height = $(document.getElementById(item.dragElementId)).height();

    let id = "highlight-component-" + item.name;

    return (
        <div className="highlight-component" id={id} style={{
            position: 'absolute',
            opacity: 0.4,
            display: 'block',
            zIndex: 100,
            backgroundColor: 'pink',
            width: (width).toString() + 'px',
            height: (height).toString() + 'px',
        }}></div>
    )
}