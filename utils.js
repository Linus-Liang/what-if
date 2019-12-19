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

ko.bindingHandlers.fixed = {
    update: function (element, valueAccessor, allBindings) {
        const numberValue = ko.utils.unwrapObservable(valueAccessor());
        if (isNaN(numberValue) || !numberValue) {
            ko.bindingHandlers.text.update(element, () => '');
            return;
        }
        
        const text = numberValue.toFixed(allBindings.get('digits') || 0);
        const terminationChar = allBindings.get('percent') ? '%' : '';
        ko.bindingHandlers.text.update(element, () => text + terminationChar);
    }
}
