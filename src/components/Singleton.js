class Singleton {

    static controller = null

    static getGridBoxId(item) {
        let shortClassName = "grid-box-item-" + item.name;
        let className = "grid-box " + shortClassName;
        return {shortClassName: shortClassName, className: className, id: shortClassName + "-" + item.uniqid};
    }

    static removeItem(item) {
        let distributions = Singleton.__singletonRef.controller.containerRef.state['distributions'];
        let totalDroppedItems = distributions[item.distribution].totalDroppedItems;
        let items = [];
        for(var i in totalDroppedItems) {
            if(!(totalDroppedItems[i].uniqid == item.uniqid)) {
                items.push(totalDroppedItems[i]);
            }
        }
        if(item.breaker_item) {
            let cartesian_totalDroppedItems = distributions[1].totalDroppedItems;
            let new_items = [];
            for(var i in cartesian_totalDroppedItems) {
                if(cartesian_totalDroppedItems[i].uniqid !== item.breaker_item.uniqid) {
                    new_items.push(cartesian_totalDroppedItems[i]);
                }
            }
            distributions[1].totalDroppedItems = new_items;
            localStorage.setItem("cartesian: items", JSON.stringify(new_items));
        }
        distributions[item.distribution].totalDroppedItems = items;
        Singleton.__singletonRef.controller.containerRef.setState({distributions: distributions});
        localStorage.setItem(item.distribution_name + ": items", JSON.stringify(items));
    }

}

export default Singleton;