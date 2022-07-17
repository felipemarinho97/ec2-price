const { allowCors } = require("../util");
const prices = require('./best.json')

export default allowCors((req, res) => {
    const {
        query: { field },
    } = req;

    console.log(field);

    if (field === 'sortBy') {
        res.json(Object.keys(prices[0]));
        return;
    }

    if (field === 'include') {
        const meta = require('./instance-meta.json');
        res.json(Object.keys(meta['t2.micro']));
        return;
    }

    if (prices[0][field] === undefined) {
        res.status(404).json({ message: "Not found" });
        return;
    }

    const options = {};
    prices.forEach((price) => {
        const value = price[field];

        options[value] = 0
    });

    res.json(Object.keys(options));
});