# ainft-js

[![Docs](https://img.shields.io/badge/Docs-blue)](https://ainft-team.github.io/ainft-js/)
[![Tutorial](https://img.shields.io/badge/Tutorial-gre)](https://docs.ainetwork.ai/ainfts/developer-reference/ainft-tutorial)
[![GitHub](https://img.shields.io/github/license/ainft-team/ainft-js.svg?color=blue)](https://github.com/ainft-team/ainft-js/blob/master/LICENSE)
[![Npm](https://img.shields.io/npm/v/@ainft-team/ainft-js)](https://www.npmjs.com/package/@ainft-team/ainft-js)

The ainft-js is typescript SDK to interact with AIN blockchain and create and manage AINFT.

## AINFT Factory

The AINFT Factory is a component consisting of AINFT Factory server and ainft-js. AINFT Factory supports the following two features:

- AINFT: Supports creating and managing AINFT, the NFT of the Ain blockchain.
- Tokenomics: Supports functions for activating tokenomics in NFT communities.

You can see reference about AINFT Factory: https://docs.ainetwork.ai/ainfts/ainft.

## Installation

```sh
npm install @ainft-team/ainft-js
```

## Usage

First, install the application and import the SDK to get started:

```js
import AinftJs from '@ainft-team/ainft-js';
```

### Configuration

To initialize the SDK with a private key, create an instance of **\`AinftJs\`** as follows. If you don't have an account, create one through the AIN wallet or by using script at **\`examples/wallet/createAccount.js\`**;

```js
const ainft = new AinftJs({
  privateKey: '<YOUR_PRIVATE_KEY>',
});
```

Alternatively, you can use the AIN wallet for authentication and transaction signing in the Chrome browser.

```js
const ainft = new AinftJs({
  signer: new AinWalletSigner(),
});
```

### Connecting to the Testnet

To connect to the AIN blockchain testnet, configure the SDK with the testnet endpoints:

```js
const ainft = new AinftJs({
  privateKey: '<YOUR_PRIVATE_KEY>',
  baseUrl: 'https://ainft-api-dev.ainetwork.ai',
  blockchainUrl: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});
```

## Features

### AINFT

You can create AINFT object and mint AINFT though AINFT object. Below modules support it.

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

- `getToken(tokenId)`: Gets AINFT that was minted by AINFT object.
- `transfer(from, to, tokenId)`: Transfers AINFT to other account.
- `mint(to, tokenId)`: Mints AINFT.

## AINFT Token API

Introducing the main API functions that can be used in the `ainftToken` module.

- `setMetadata(metadata)`: Sets metadata of AINFT.

## AI API
We provide AI API functions, including chat, assistant, thread, and message.
To use these functions follow streamlined steps:
1. **Initialization**: Before using any AI functions, initialize the event channel with the `open()` method.
2. **Using AI functions**: After opening the event channel, you can use AI function.
3. **Closure**: Ensure to close the event channel with the `close()` method when the functions are no longer needed.

```js
import AinftJs from '@ainft-team/ainft-js';

const ainft = new AinftJs({
  privateKey: '<YOUR_PRIVATE_KEY>',
  baseUrl: 'https://ainft-api-dev.ainetwork.ai',
  blockchainUrl: 'https://testnet-api.ainetwork.ai',
  chainId: 0,
});

async function main() {
  await ainft.open(); // open event channel

  // your ai function usage here
  // ...

  await ainft.close(); // close event channel to free up resource
}

main();
```

## AINFT tutorial

You can view the [tutorial document](https://docs.ainetwork.ai/ainfts/developer-reference/ainft-tutorial) at the following link. and You can also look at scripts created for tutorials in the [tutorial directory](https://github.com/ainft-team/ainft-js/tree/main/examples).

Tutorial scripts

- [createAinftObject](https://github.com/ainft-team/ainft-js/blob/master/examples/nft/createAinftObject.js)
- [mintAinft](https://github.com/ainft-team/ainft-js/blob/master/examples/nft/mintNft.js)
- [transferAinft](https://github.com/ainft-team/ainft-js/blob/master/examples/nft/transferNft.js)
- [retrieveAinft](https://github.com/ainft-team/ainft-js/blob/master/examples/nft/retrieve.js)
- [searchAinft](https://github.com/ainft-team/ainft-js/blob/master/examples/nft/search.js)

## API Documentation

API documentation is available at https://ainft-team.github.io/ainft-js.

## License

MIT License
