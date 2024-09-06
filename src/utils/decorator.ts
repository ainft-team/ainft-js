import Ain from '@ainblockchain/ain-js';
import { AinftError } from '../error';

export function authenticated(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = function (...args: any[]) {
    try {
      const ain = (this as any).ain as Ain;
      ain.signer.getAddress();
    } catch (error) {
      throw new AinftError(
        'unauthenticated',
        `method '${propertyKey}' must be set a private key or signer.`
      );
    }
    return method.apply(this, args);
  };
}
