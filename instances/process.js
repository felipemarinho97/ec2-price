const instances = require('./instances.json')
const fs = require('fs')

// transform into a map
let iMap = {}

instances.forEach(i => {
    delete i.pricing
    delete i.availability_zones
    iMap[i.instance_type] = i
})

const imap = JSON.stringify(iMap, null, 2)
// console.log(JSON.stringify(instances[0]))

fs.writeFileSync('./imap.json', imap)