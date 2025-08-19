

const HandlerApp = {
    formatCurrency: (value) => {
        value = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'USD',
            currencyDisplay: 'narrowSymbol',
            currencySign: 'standard'
        }).format(value);
    },
    formatPercentage: (value) => {
        value = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        return new Intl.NumberFormat('es-CO', {
            style: 'decimal',
        }).format(value) + '%';
    }
};

export default HandlerApp;