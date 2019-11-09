const fs = require('fs');
const PromisePool = require('es6-promise-pool');
const Path = require('path');
const httpGet = require('./utils/get');
const convertCase = require('./utils/convertCase');
const TYPES = require('./iconTypes');
const getIconUrl = require('./utils/getIconUrl');

const basePath = './icons';

if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
}

for (const type of TYPES) {
    if (!fs.existsSync(Path.join(basePath, type))) {
        fs.mkdirSync(Path.join(basePath, type));
    }
}

function fetchIcon(index, totalCount, iconId) {
    const promises = [];
    
    for (const type of TYPES) {
        promises.push(
            httpGet(getIconUrl(type, iconId))
                .then(svg => {
                    if (svg.includes('Error 404 (Not Found)')) {
                        console.info(iconId, 'does not have type', type);
                        return;
                    }
                    
                    fs.writeFile(Path.join(basePath, type, convertCase(iconId) + '.svg'), svg, () => {});
                }),
        )
    }
    
    console.info('Fetching', iconId, `(${index}/${totalCount})`);
    return Promise.all(promises);
}

module.exports.fetchIcons = async () => {
    const response = JSON.parse(await httpGet('https://material.io/resources/icons/static/data.json'));
    const {categories} = response;
    const icons = [];
    
    for (const category of categories) {
        for (const icon of category.icons) {
            icons.push(icon.id);
        }
    }

    const totalCount = icons.length;
    
    console.log('Total icons:', totalCount);

    const pool = new PromisePool(() => {
        if (icons.length === 0) {
            return null;
        }
        
        return fetchIcon(totalCount - icons.length + 1, totalCount, icons.shift());
    }, 4);
    
    await pool.start();
};

module.exports.iconsPath = basePath;
