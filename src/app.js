#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const util = require('util');
const PromisePool = require('es6-promise-pool');
const {fetchIcons, iconsPath} = require('./fetchIcons');

const readContent = util.promisify(fs.readFile);
const writeContent = util.promisify(fs.writeFile);

const basePath = './components';

if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
}

const TEMPLATE = fs.readFileSync(path.join(__dirname, 'componentTemplate.vue')).toString();

async function createComponent({type, file}) {
    const svgContent = (await readContent(path.join(iconsPath, type, file))).toString();
    const matches = svgContent.match(/\sd="(.*?)"/g);
    
    if (!Array.isArray(matches)) {
        console.warn('No path match for', file, `(${type})`);
        return;
    }
    
    const svgPath = matches.map(
        m => m.match(/d="(.*?)"/)[1],
    ).reduce(
        (path, currentPath) => path.length > currentPath.length ? path : currentPath,
        '',
    );
    
    const iconName = file.substring(0, file.indexOf('.'));
    
    await writeContent(
        path.join(basePath, type, iconName + '.vue'),
        TEMPLATE
            .replace(/\{\{icon\}\}/g, iconName)
            .replace(/\{\{path\}\}/g, svgPath),
    );
}

(async function() {
    await fetchIcons();
    const files = [];
    
    const types = fs.readdirSync(iconsPath);
    
    for (const type of types) {
        if (!fs.existsSync(path.join(basePath, type))) {
            fs.mkdirSync(path.join(basePath, type));
        }
        
        files.push(
            ...fs.readdirSync(path.join(iconsPath, type))
                .map(file => {
                    return {
                        type,
                        file,
                    };
                }),
        );
    }
    
    const pool = new PromisePool(() => {
        if (files.length === 0) {
            return null;
        }
        
        return createComponent(files.shift());
    }, 4);
    await pool.start();
    console.info('Finished');
})();
