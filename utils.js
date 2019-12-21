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
