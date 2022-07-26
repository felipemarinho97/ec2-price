const instances = require('./instances.json')
const fs = require('fs')

// transform into a map
let iMap = {}

function lowerCaseObjectKeys(obj) {
    const newObj = {}
    for (let key in obj) {
        newObj[key.toLowerCase()] = obj[key]
    }
    return newObj
}

instances.forEach(i => {
    delete i.pricing
    delete i.availability_zones
    iMap[i.instance_type] = lowerCaseObjectKeys(i)
})

const imap = JSON.stringify(iMap, null, 2)
// console.log(JSON.stringify(instances[0]))

fs.writeFileSync('./instances/imap.json', imap)
fs.writeFileSync('./api/instance-meta.json', JSON.stringify(iMap))