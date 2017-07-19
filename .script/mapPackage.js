const mapPackage = (config) => {
    const newPackage = {};
    const keyValue = ['name', 'version', 'description', 'author', 'displayName']
    newPackage.meta = keyValue.reduce((p, v) => {
    p[v] = config.codingIdePackage[v] || config[v] || ''
    return p
    }, {})
    newPackage.codingIdePackage = Object.assign(config.codingIdePackage, newPackage.meta)    
    return newPackage
}

module.exports = mapPackage;
