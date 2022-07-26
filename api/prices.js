const { allowCors } = require("../util");
const prices = require('./best.json')
const meta = require('./instance-meta.json');

export default allowCors((req, res) => {
    const {
        query: { maxPrice, minCpu, minMemory, region, arch, generation, sortBy, include, limit },
    } = req;

    console.log({ maxPrice, minCpu, minMemory, region, arch, generation, sortBy, include, limit });
    const _arch = arch;
    const _generation = generation;
    const _region = region;

    const toInclude = typeof include == 'string' ? [include] : include ? include : [];

    const filtered = prices.filter(
        ({ spot_max, spot_min, vcpus, memory, arch, generation, region }) => {
            return (
                (maxPrice === undefined || maxPrice === '' || spot_max <= parseFloat(maxPrice)) &&
                (minCpu === undefined || minCpu === '' || vcpus >= parseFloat(minCpu)) &&
                (minMemory === undefined || minMemory === '' || memory >= parseFloat(minMemory)) &&
                (_region === undefined || _region === '' || region === _region.toLowerCase()) &&
                (_arch === undefined || _arch === '' || arch === _arch.toLowerCase()) &&
                (_generation === undefined || _generation === '' || generation === _generation.toLowerCase())
            );
        }
    ).map(e => { return { ...e } })

    if (filtered.length === 0) {
        res.status(404).json({ message: "Not found" });
        return;
    }

    if (toInclude.length > 0) {
        filtered.forEach((price) => {
            const instance = price.instance;
            const instanceMeta = meta[instance];

            toInclude.forEach((include) => {
                const val = instanceMeta[include]
                // check if is object
                if (typeof val === 'object') {
                    price[include] = JSON.stringify(val)
                }
                else {
                    price[include] = val;
                }
            }
            );
        });
    }

    if (sortBy) {
        let sortByLower = sortBy.toLowerCase();
        let direction = 'asc';
        if (sortByLower.charAt(0) === '-') {
            direction = 'desc';
            sortByLower = sortBy.substring(1);
        } else if (sortByLower.charAt(0) === '+') {
            sortByLower = sortBy.substring(1);
        }
        const field = filtered[0]
        if (field == null || field[sortByLower] == null) {
            res.status(404).json({ message: `Field ${sortByLower} not found` });
            return;
        }

        // check if is numeric
        if (!isNaN(parseFloat(field[sortByLower]))) {
            filtered.sort((a, b) => {
                let vals = [parseFloat(a[sortByLower]), parseFloat(b[sortByLower])];
                if (direction === 'asc') {
                    return vals[0] - vals[1];
                }

                return vals[1] - vals[0];
            });
        } else {
            filtered.sort((a, b) => {
                let vals = [a[sortByLower], b[sortByLower]];
                if (direction === 'asc') {
                    return vals[0].localeCompare(vals[1]);
                }

                return vals[1].localeCompare(vals[0]);
            });
        }
    }

    if (limit) {
        const limitInt = parseInt(limit);
        if (limitInt > 0) {
            filtered.splice(limitInt);
        }
    }

    res.json(filtered);
});