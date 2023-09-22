const fs = require('fs')
const _ = require('lodash')
const p = require('./out.json')
const regions = require('./regions.json') // its a list of regions

const allRegionData = {}

// replace all keys from data with index values
function replace(obj, values) {
    if (typeof obj === 'object') {
        Object.entries(obj).forEach(([key, value]) => {
            obj[values[parseInt(key)]] = replace(value, values)
            delete obj[key]
        })
    }

    return obj
}

// for each region, replace the keys and add to allRegionData
regions.forEach(region => {
    console.log(`Region: ${region}`)
    const p = require(`./instances/pricing/pricing_${region}.json`)
    const index = p.index
    const data = p.data

    // map index to a list of values
    const values = []
    Object.entries(index).forEach(([key, value]) => values[value] = key)
    // console.log(`Values: ${values}`)

    const newData = replace(data, values)
    // console.log(newData['t1.micro'])

    allRegionData[region] = newData

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
})

// merge allRegionData values into one object
let newData = {}
Object.entries(allRegionData).forEach(([key, value]) => {
    newData = _.merge(newData, value)
})



const spot_prices = JSON.stringify(newData, null, 2)

fs.writeFileSync('./spot_prices.json', spot_prices)