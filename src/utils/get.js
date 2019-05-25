const https = require('https');

module.exports = (url) => {
    return new Promise((resolve, reject) => {
        const res = https.get(url, (res) => {
            let data = '';
            
            res.on('data', (d) => data += d);
            res.on('end', () => resolve(data));
        });
        
        res.on('error', reject);
    });
};
