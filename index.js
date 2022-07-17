const fs = require('fs')
const p = require('./out.json')

const index = p.index
const data = p.data

// map index to a list of values
const values = []
Object.entries(index).forEach(([key, value]) => values[value] = key)
// console.log(values)

// replace all keys from data with index values
function replace(obj) {
    if (typeof obj === 'object') {
        Object.entries(obj).forEach(([key, value]) => {
            obj[values[parseInt(key)]] = replace(value)
            delete obj[key]
        })
    }

    return obj
}

const newData = replace(data)
// console.log(newData['t1.micro'])

for (let key in newData) {
    const instance = newData[key]

    for (let key in instance) {
        const region = instance[key]

        const linux = region.linux
        instance[key] = {}
        if (linux !== undefined) {
            const spot_max = linux['spot_max']
            const spot_min = linux['spot_min']
            const on_demand = linux['ondemand']

            instance[key].spot_max = spot_max
            instance[key].spot_min = spot_min
            // instance[key].on_demand = on_demand
        }
    }

}

const spot_prices = JSON.stringify(newData, null, 2)

fs.writeFileSync('./spot_prices.json', spot_prices)