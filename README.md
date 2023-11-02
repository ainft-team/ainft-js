# ainft-js

[![Docs](https://img.shields.io/badge/Docs-blue)](https://ainft-team.github.io/ainft-js/)
[![Tutorial](https://img.shields.io/badge/Tutorial-gre)](https://docs.ainetwork.ai/ainfts/developer-reference/ainft-tutorial)
[![GitHub](https://img.shields.io/github/license/ainft-team/ainft-js.svg?color=blue)](https://github.com/ainft-team/ainft-js/blob/master/LICENSE)
[![Npm](https://img.shields.io/npm/v/@ainft-team/ainft-js)](https://www.npmjs.com/package/@ainft-team/ainft-js)

The ainft-js is typescript SDK to interact with AIN blockchain and create and manage AINFT.

## AINFT Factory
The AINFT Factory is a component consisting of AINFT Factory server and ainft-js.  AINFT Factory supports the following two features:
- AINFT: Supports creating and managing AINFT, the NFT of the Ain blockchain.
- Tokenomics: Supports functions for activating tokenomics in NFT communities.

You can see reference about AINFT Factory: https://docs.ainetwork.ai/ainfts/ainft.

## Getting start

```bash
npm install @ainft-team/ainft-js
```

After installing the app, you can then import and use the SDK
```javascript
const AinftJs = require('@ainft-team/ainft-js').default;

// Enter the private key for the account you want to use to create and manage AINFT.
// If you don't have an account, you can create it through ain wallet,
// or you can leverage tools/create_account.js.
const ainftJs = new AinftJs(<YOUR_PRIVATE_KEY>);
```

If you want to connect to the testnet of the Ain blockchain, you can set the Ain blockchain endpoint.
```javascript
const config = {
  ainftServerEndpoint: 'https://ainft-api-dev.ainetwork.ai',
  ainBlockchainEndpoint: 'https://testnet-api.ainetwork.ai'
}
const ainftJs = new AinftJs(<YOUR_PRIVATE_KEY>, config);
```

## Features
### AINFT
You can create AINFT object and mint AINFT though AINFT object. Below modules support it.
Ain blockchain에서 AINFT object를 만들고, 이를 통해 AINFT를 민팅할 수 있습니다. 아래 모듈들은 그런 작업들을 도와줍니다.
- `nft`: Creates AINFT object and Searches AINFTs and AINFT objects.
- `ainft721Object`: It is AINFT object class. Mints AINFTs and Transfers it to other accounts.
- `ainftToken`: It is AINFT class. Updates metadata.

You can learn how to make AINFT in [tutorials](https://docs.ainetwork.ai/ainfts/developer-reference/ainft-tutorial).

### Tokenomics
Features for activating tokenomics in NFT communities.
- `credit`: Create and manage community-specific credits.
- `event`: Create and manage events where user can take action and receive rewards. This is a function for credit mining.
- `store`: You can create items, register them in the store, and sell them. This is a function for consuming credit.


## NFT API
Introducing the main API functions that can be used in the `nft` module.

- `create(name, symbol)`: Creates AINFT object.
- `register(ainftObjectId)`: Register AINFT object created to AINFT Factory server.
- `get(ainftObjectId)`: Gets AINFT object instance by id.
- `getAinftsByAinftObject(ainftObjectId, limit, cursor)`: Gets information of AINFTs by AINFT object.
- `getAinftsByAccount(address, limit, cursor)`: Gets information of AINFTs by user address.
- `searchAinftObjects(searchParams)`: Search for AINFT object. You can use ainft object id, name, symbol for searching.
- `searchAinfts(searchParams)`: Search for AINFT. You can use ainft object id, name, symbol, token id, user address for searching.

## AINFT721 Object API
Introducing the main API functions that can be used in the `ainftObject` module.
`ainft721Object` module의 주요 API를 소개합니다.

- `getToken(tokenId)`: Gets AINFT that was minted by AINFT object.
- `transfer(from, to, tokenId)`: Transfers AINFT to other account.
- `mint(to, tokenId)`: Mints AINFT.

## AINFT Token API
Introducing the main API functions that can be used in the `ainftToken` module.

- `setMetadata(metadata)`: Sets metadata of AINFT.


## AINFT tutorial
You can view the [tutorial document](https://docs.ainetwork.ai/ainfts/developer-reference/ainft-tutorial) at the following link. and You can also look at scripts created for tutorials in the [tutorial directory](https://github.com/ainft-team/ainft-js/tree/main/tutorials).

Tutorial scripts
- [createAinftObject](https://github.com/ainft-team/ainft-js/blob/master/tutorials/createAinftObject.js)
- [mintAinft](https://github.com/ainft-team/ainft-js/blob/master/tutorials/mintAinft.js)
- [transferAinft](https://github.com/ainft-team/ainft-js/blob/master/tutorials/transferAinft.js)
- [retrieveAinft](https://github.com/ainft-team/ainft-js/blob/master/tutorials/retrieveAinft.js)
- [searchAinft](https://github.com/ainft-team/ainft-js/blob/master/tutorials/searchAinft.js)

## API Documentation
API documentation is available at https://ainft-team.github.io/ainft-js.

## License
MIT License