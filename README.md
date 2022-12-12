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
const ainftJs = new AinftJs(<YOUR_ACCESS_KEY>, <NFT_SERVER_ENDPOINT>, <AIN_BLOCKCHAIN_ENDPOINT>, <CHAIN_ID>);
```

NFT_SERVER_ENDPOINT
- dev(testnet): https://ainft-api-dev.ainetwork.ai
- prod(mainnet): https://ainft-api.ainetwork.ai

### AIN_BLOCKCHAIN
Testnet
  - Endpoint: https://testnet-api.ainetwork.ai
  - ChainId: 0

Mainnet
  - Endpoint: https://mainnet-api.ainetwork.ai
  - ChainId: 1


## Tests
```bash
yarn test
```
