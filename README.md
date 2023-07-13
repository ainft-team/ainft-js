# ainft-js

[![Docs](https://img.shields.io/badge/Docs-blue)](https://ainft-team.github.io/ainft-js/)
[![Tutorial](https://img.shields.io/badge/Tutorial-gre)](https://docs.ainetwork.ai)
[![GitHub](https://img.shields.io/github/license/ainft-team/ainft-js.svg?color=blue)](https://github.com/ainft-team/ainft-js/blob/master/LICENSE)
[![Npm](https://img.shields.io/npm/v/@ainft-team/ainft-js)](https://www.npmjs.com/package/@ainft-team/ainft-js)

A TypeScript SDK for the AINFT Server, a service by AI Network for NFT-related requests from
NFT bots, NFT frontends, and/or NFT devices.

## Requirements
- node >= 12

## Usage

```bash
yarn install
yarn build
```

```javascript
const AinftJs = require('@ainft-team/ainft-js').default;
const ainftJs = new AinftJs(<YOUR_PRIVATE_KEY>, <AINFT_SERVER_ENDPOINT>);
```

AINFT_SERVER_ENDPOINT
- dev(testnet): https://ainft-api-dev.ainetwork.ai
- prod(mainnet): https://ainft-api.ainetwork.ai

If you use **dev** AINFT_SERVER_ENDPOINT, it will connect to ain blockchain **testnet**.  
If you use **prod** AINFT_SERVER_ENDPOINT, it will connect to ain blockchain **mainnet**.

## Getting Start with Native NFT
### App
First, Create app to use in ain blockchain. (If you have a app, you can skip this)
```javascript
const appId = <YOUR_APP_ID>;
const res = await ainftJs.auth.createApp(appId);
```

And register app to AINFT Factory.
```javascript
await ainftJs.auth.registerBlockchainApp(appId);
await ainftJs.auth.delegateApp(appId);
```
Finished innitial setup to use.

### Native NFT
First, Create NFT collection.
```javascript
const appId = <YOUR_APP_ID>;
const collectionID = <YOUR_COLLECTION_ID>;
const res = await ainftJs.nft.createNftCollection({
  appId,
  chain: 'AIN',
  network: <'testnet' | 'mainnet'>,
  collectionId,
  symbol: <YOUR_COLLECTION_SYMBOL>,
  name: <YOUR_COLLECTION_NAME>,
});
```

and you can mint native NFT to anyone you want.
```javascript
const appId = <YOUR_APP_ID>;
const collectionId = <YOUR_COLLECTION_ID>;
const res = await ainftJs.nft.mintNft({
  appId,
  collectionId,
  chain: 'AIN',
  network: <'testnet' | 'mainnet'>,
  toAddress: <RECEIVER_ADDRESS>,
  metadata: <INITIAL_METADATA>,
});
```

After minting, you can transfer native NFT to anyone you want.
```javascript
const appId = <YOUR_APP_ID>;
const collectionId = <YOUR_COLLECTION_ID>;
const tokenId = <YOUR_TOKEN_ID>;
const res = await ainftJs.nft.transferNft({
  appId,
  collectionId,
  chain: 'AIN',
  network: <'testnet' | 'mainnet'>,
  tokenId,
  toAddress: <RECEIVER_ADDRESS>
});
```