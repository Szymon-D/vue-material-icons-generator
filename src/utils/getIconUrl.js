module.exports = (type, iconId) => `https://fonts.gstatic.com/s/i/materialicons${getFirstUrlPartByType(type)}/${iconId}/v1/24px.svg?download=true`

function getFirstUrlPartByType(type) {
    if (type === 'Baseline') {
        return '';
    }
    else if (type === 'Outline') {
        return 'outlined';
    }
    
    return type.toLowerCase();
}
