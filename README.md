Configuration
=============

For staging and prod deployments use the following script:

```
#!/usr/bin/env bash

SRV_PROD=http://52.21.77.232
SRV_STAG=http://192.168.99.100

if [ -z "$1" ]; then
  echo usage: $0 prod\|stag
  exit
fi

SRV=$SRV_STAG
if [ $1 = "prod" ]; then
  SRV=$SRV_PROD
fi

echo Deploying to $1: $SRV
slc build --git
slc deploy -s scheduler $SRV
```