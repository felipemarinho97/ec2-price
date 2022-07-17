const instances = require('./instances.json')

// transform into a map
let iMap = {}

instances.forEach(i => {
    iMap[i.instance_type] = i
})

console.log(JSON.stringify(iMap))