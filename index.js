const p = require('./out.json')

const index = p.index
const data = p.data

// map index to a list of values
const values =  []
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

for (let key in newData) {
    const instance = newData[key]

    for (let key in instance) {
        const region = instance[key]

        const linux = region.linux
        if (linux !== undefined) {
            const spot_max = linux['spot_max']
            const spot_min = linux['spot_min']

            instance[key] = { spot_max, spot_min }
        }
        else {
            instance[key] = { spot_max: Number.MAX_VALUE, spot_min: Number.MAX_VALUE }
        }
    }

}

console.log(JSON.stringify(newData, null, 2))