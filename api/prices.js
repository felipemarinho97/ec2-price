const { allowCors } = require("../util");
const prices = require('./best.json')

export default allowCors((req, res) => {
    const {
        query: { maxPrice, minCpu, minMemory, region, arch, generation, sortBy },
    } = req;

    console.log(maxPrice, minCpu, minMemory, region, arch, generation, sortBy);
    const _arch = arch;
    const _generation = generation;
    const _region = region;

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
    );

    if (sortBy) {
        // check if is numeric
        if (!isNaN(parseFloat(prices[0][sortBy]))) {
            filtered.sort((a, b) => a[sortBy.toLowerCase()] - b[sortBy.toLowerCase()]);
        } else {
            filtered.sort((a, b) => a[sortBy.toLowerCase()].localeCompare(b[sortBy.toLowerCase()]));
        }
    }

    if (filtered.length === 0) {
        res.status(404).json({ message: "Not found" });
        return;
    }

    res.json(filtered);
});