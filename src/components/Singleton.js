class Singleton {

    static controller = null

    static getGridBoxId(item) {
        let shortClassName = "grid-box-item-" + item.name;
        let className = "grid-box " + shortClassName;
        return {shortClassName: shortClassName, className: className, id: shortClassName + "-" + item.uniqid};
    }

    static removeItem(item) {

    }

}

export default Singleton;