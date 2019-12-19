const Util = {
    add: (array) => array.reduce((left, right) => left + right),
    sum: (array, funcOrProp) => {
        if (!array || array.length === 0) {
            return 0;
        }
        if (typeof(funcOrProp) === 'function') {
            return Util.add(array.map(funcOrProp));
        }
        return Util.add(array.map(item => item[funcOrProp]));
    },
}

ko.bindingHandlers.percent = {
    update: function (element, valueAccessor, allBindings) {
        const numberValue = ko.utils.unwrapObservable(valueAccessor());
        if (!numberValue) {
            return;
        }
        
        const text = numberValue.toFixed(allBindings.get('fracDigits') || 0);
        ko.bindingHandlers.text.update(element, () => text);
    }
}
