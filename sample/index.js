/* Contains sample code for the SDK. */
const AinftJs = require('ainft-js').default;

async function main() {
  const ainftJs = new AinftJs();
  const status = await ainftJs.getStatus();
  console.log('Got status: ', status);
}

main();
