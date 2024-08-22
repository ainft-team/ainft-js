import Ain from '@ainblockchain/ain-js';

export function authenticated(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = function (...args: any[]) {
    try {
      const ain = (this as any).ain as Ain;
      ain.signer.getAddress();
    } catch (error) {
      throw new Error(`method '${propertyKey}' must be set a private key or signer.`);
    }
    return method.apply(this, args);
  };
}
