class Singleton {

    static controller = null

    static getGridBoxId(item) {
        let shortClassName = "grid-box-item-" + item.name;
        let className = "grid-box " + shortClassName;
        return {shortClassName: shortClassName, className: className, id: shortClassName + "-" + item.uniqid};
    }

    static removeItem(item) {
        console.log(Singleton.__singletonRef.controller);
        let distributions = Singleton.__singletonRef.controller.containerRef.state['distributions'];
        let totalDroppedItems = distributions[item.distribution].totalDroppedItems;
        let items = []
        for(var i in totalDroppedItems) {
            if(!totalDroppedItems[i].uniqid == item.uniqid) {
                items.push(totalDroppedItems[i]);
            }
        }
        distributions[item.distribution].totalDroppedItems = items;
        Singleton.__singletonRef.controller.containerRef.setState({distributions: distributions});
        localStorage.setItem(item.distribution_name + ": items", JSON.stringify(items));
    }

}

export default Singleton;