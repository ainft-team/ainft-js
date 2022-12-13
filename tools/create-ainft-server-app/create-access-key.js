const ainUtil = require('@ainblockchain/ain-util');

const main = () => {
  const newAccount = ainUtil.createAccount();
  console.log(`\nAccessKey: ${newAccount.private_key}`);

  console.log(`\nAccount information`);
  console.log(newAccount);

  process.exit(0);
};

main();
