 #!/bin/bash

echo 'Spawn wave'


 TX=$(../bin/run transaction:create 1000 101 100000000 --asset='{"intensity":"extreme"}' --passphrase="rent decline soap link atom click frown wrap device busy head beyond" | jq -r '.transaction')
 
 echo $TX

../bin/run transaction:send $TX