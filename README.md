# ainft-js

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
const AinftJs = require('@ainft-team/ainft-js');
const ainftJs = new AinftJs(<YOUR_ACCESS_KEY>, <NFT_SERVER_URL>, <AIN_BLOCKCHAIN_URL>, <CHAIN_ID>);
```

NFT_SERVER_URLs
- dev(testnet): https://ainft-api-dev.ainetwork.ai
- prod(mainnet): https://ainft-api.ainetwork.ai

### AIN_BLOCKCHAIN
Testnet
  - url: https://testnet-api.ainetwork.ai
  - chainId: 0

Mainnet
  - url: https://mainnet-api.ainetwork.ai
  - chainId: 1


## Tests
```bash
yarn test
```
