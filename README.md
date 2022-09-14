# ec2-price

A website made for looking up spot prices of EC2 instances.

Access here: https://ec2-price.vercel.app

It also has a API with the same filters available at: https://ec2-price.vercel.app/api/prices?maxPrice=&minCpu=&minMemory=&region=&arch=&generation=&sortBy=

## Updating

```bash
$ make download
$ make build
$ make deploy
```

EC2 instance prices are updated every week.

# CLI for ec2-price 

There is a CLI for `ec2-price`. It is a simple wrapper around the API. You can install with:

```bash
$ curl -sL https://raw.githubusercontent.com/felipemarinho97/ec2-price/master/ec2-price | tee ~/.local/bin/ec2-price > /dev/null
```

## Usage example

```bash
$ ec2-price --min-memory 10 --min-cpu 2 --arch x86_64 --include family,physical_processor,clock_speed_ghz,gpu --limit 5 
arch    clock_speed_ghz  family                           generation  gpu  instance         memory  physical_processor                               region          spot_avg  spot_max  spot_min  vcpus
x86_64  2.3 GHz          Memory optimized                 current     0    r4.large         15.25   Intel Xeon E5-2686 v4 (Broadwell)                us-east-2       0.0199    0.0199    0.0199    2
x86_64  2.5 GHz          Memory optimized                 previous    0    r3.large         15.25   Intel Xeon E5-2670 v2 (Ivy Bridge)               us-east-2       0.0198    0.0206    0.019     2
x86_64  3.1 GHz          Memory optimized                 current     0    r5b.large        16      Intel Xeon Platinum 8259 (Cascade Lake)          us-east-2       0.0209    0.0209    0.0209    2
x86_64  2.5 GHz          Memory optimized                 current     0    r5a.large        16      AMD EPYC 7571                                    us-east-2       0.0209    0.0209    0.0209    2
x86_64  2.5 GHz          Memory optimized                 current     0    r5n.large        16      Intel Xeon Platinum 8259 (Cascade Lake)          us-east-2       0.0209    0.0209    0.0209    2
```