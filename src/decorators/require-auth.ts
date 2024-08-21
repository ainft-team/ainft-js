import Ain from '@ainblockchain/ain-js';

export function requireAuth(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const ain = (this as any).ain as Ain;
    if (!ain.signer.getAddress()) {
      throw new Error(`${propertyKey} requires a default account to be set.`);
    }
    return originalMethod.apply(this, args);
  };
}
