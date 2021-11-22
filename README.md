# Web3 ProviderEngine

Safle Web3 Engine is a tool for composing your own [web3 providers](https://github.com/ethereum/wiki/wiki/JavaScript-API#web3).

### Composable

Built to be modular - works via a stack of 'sub-providers' which are like normal web3 providers but only handle a subset of rpc methods.

The subproviders can emit new rpc requests in order to handle their own;  e.g. `eth_call` may trigger `eth_getAccountBalance`, `eth_getCode`, and others.
The provider engine also handles caching of rpc request results.

```js
const ProviderEngine = require('@getsafle/safle-web3-engine');
const { CacheSubprovider, FixtureSubprovider, FilterSubprovider, HookedWalletSubprovider, NonceSubprovider, SubscriptionsSubprovider, RpcSubprovider } = require('@getsafle/safle-web3-engine/subproviders');

var engine = new ProviderEngine()

// static results
this.engine.addProvider(new FixtureSubprovider({
  net_listening: true,
  eth_hashrate: '0x00',
  eth_mining: false,
  eth_syncing: true,
}));

this.engine.addProvider(new CacheSubprovider());

this.engine.addProvider(new SubscriptionsSubprovider());

this.engine.addProvider(new FilterSubprovider());

this.engine.addProvider(new NonceSubprovider());

// id mgmt
engine.addProvider(new HookedWalletSubprovider({
  getAccounts: function(cb){ ... },
  approveTransaction: function(cb){ ... },
  signTransaction: function(cb){ ... },
}))

// data source
engine.addProvider(new RpcSubprovider({
  rpcUrl: 'https://testrpc.metamask.io/',
}))

// log new blocks
engine.on('block', function(block){
  console.log('================================')
  console.log('BLOCK CHANGED:', '#'+block.number.toString('hex'), '0x'+block.hash.toString('hex'))
  console.log('================================')
})

// network connectivity error
engine.on('error', function(err){
  // report connectivity errors
  console.error(err.stack)
})

// start polling for blocks
engine.start()

var web3 = new Web3(engine)
```
## Running tests

```bash
npm test
```
