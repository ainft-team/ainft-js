import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';
import AinizeAuth from '../../src/auth/ainizeAuth';

const ain = new Ain('https://testnet-api.ainetwork.ai', 0);
const ainize = new Ainize(0);
ain.wallet.clear();
ain.wallet.addAndSetDefaultAccount(process.env['PRIVATE_KEY']!);

describe('Ainize Authentication', () => {
  it('should login after initialization', async () => {
    const auth = AinizeAuth.getInstance();
    await auth.login(ain, ainize);

    expect(auth.isLoggedIn).toBe(true);
  });

  it('should logout after initialization', async () => {
    const auth = AinizeAuth.getInstance();
    await auth.logout(ainize);

    expect(auth.isLoggedIn).toBe(false);
  });
});
