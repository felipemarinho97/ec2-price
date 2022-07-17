const spot_prices = require('./spot_prices.json')
const imap = require('./instances/imap.json')

const plist = []

for (let key in spot_prices) {
    const instance = spot_prices[key]

    for (let key2 in instance) {
        const region = instance[key2]
        const instance_type = imap[key]

        if (region.spot_max != Number.MAX_VALUE && region.spot_min != null) {
            plist.push({
                instance: key,
                region: key2,
                spot_max: parseFloat(region.spot_max),
                spot_min: parseFloat(region.spot_min),
                spot_avg: (parseFloat(region.spot_min) + parseFloat(region.spot_max)) / 2,
                vcpus: instance_type.vCPU,
                memory: instance_type.memory,
                arch: instance_type.arch[0],
                generation: instance_type.generation
            })
        }
    }

}

// sort by spot_min
function sortBy(field) {
    plist.sort((a, b) => a[field] - b[field])
}

sortBy('spot_max')


// to JSON
console.log(JSON.stringify(plist, null, 2))

// to CSV
// const csv = ['instance,region,spot_max,spot_min,spot_avg,vcpus,memory,arch,genration']
// plist.forEach(({ instance, region, spot_max, spot_min, spot_avg, vcpus, memory, arch, generation }) => {
//     csv.push(
//         [
//             instance,
//             region,
//             spot_max,
//             spot_min,
//             spot_avg,
//             vcpus,
//             memory,
//             arch,
//             generation
//         ].join(','))
// })
// console.log(csv.join('\n'))
