#!/bin/bash

curl 'https://instances.vantage.sh/' > /tmp/costs
curl 'https://instances.vantage.sh/instances.json' > instances/instances.json

cat /tmp/costs | grep 'var _pricing' > /tmp/pricing.js

echo 'console.log(JSON.stringify(_pricing))' > /tmp/t.js

cat /tmp/pricing.js /tmp/t.js > /tmp/u.js

node /tmp/u.js > out.json