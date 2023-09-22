#!/bin/bash
set +o noclobber

cat regions.json | jq -r '.[]' | while read region; do
  curl "https://instances.vantage.sh/pricing_${region}.json" > instances/pricing/pricing_${region}.json
done
curl 'https://instances.vantage.sh/instances.json' > instances/instances.json
