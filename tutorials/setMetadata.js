const AinftJs = require('@ainft-team/ainft-js').default;

const myPrivateKey = 'your-private-key';
const ainftJs = new AinftJs(myPrivateKey, 'https://ainft-api-dev.ainetwork.ai');

const appId = 'my_first_native_nft';
const collectionId = 'my_first_collection';
const tokenId = '2';
const metadata = {
	name: 'Native NFT Explorer',
  description: 'He is an explorer who pioneers AI networks.',
	image: 'https://images.ctfassets.net/9o7r47v65nft/2YvQoZFlzYjJmx2k1oQryI/7f9c9bc30458ad1b940a77c310704467/OG_tag.png'
}

ainftJs.nft.setNftMetadata({
	chain: 'AIN',
	network: 'testnet',
	appId,
	contractAddress: collectionId,
	tokenId,
	metadata,
}).then((res) => {
	console.log(JSON.stringify(res, null, 2));
}).catch((error) => {
	console.log(error);
});