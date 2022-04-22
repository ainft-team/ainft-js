/* Contains sample code for the SDK. */
const ainftJs = require('ainft-js');

async function main() {
  const status = await ainftJs.getStatus();
  console.log('Got status: ', status);
}

main();
