import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';

import Ainft721Object from '../../ainft721Object';
import { AssistantCreateParams, AssistantTransactionResult } from '../../types';
import {
  buildSetValueTransactionBody,
  validateAi,
  validateObject,
  validateObjectOwnership,
  validateService,
  validateServiceName,
  validateToken,
} from '../../util';

export default class Assistants {
  private ain: Ain;
  private ainize: Ainize;

  constructor(ain: Ain, ainize: Ainize) {
    this.ain = ain;
    this.ainize = ainize;
  }

  async create({
    config,
    description,
    instructions,
    metadata,
    model,
    name,
    tokenId,
  }: AssistantCreateParams): Promise<AssistantTransactionResult> {
    const appId = Ainft721Object.getAppId(config.objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwnership(appId, address, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateServiceName(config.provider, config.api);
    await validateAi(appId, serviceName, this.ain);

    const service = await validateService(serviceName, this.ainize);

    // TODO(jiyoung): replace with ainize.request() function after deployment of ainize service.
    // const response = await service.request(<REQUEST_DATA>);
    // NOTE(jiyoung): mocked assistant.
    const assistant = {
      id: 'asst_000000000000000000000001',
      model: model,
      name: name,
      instructions: instructions,
      description: description || null,
      metadata: metadata || {},
      created_at: 0,
    };

    const isEmpty = Object.keys(assistant.metadata).length === 0;

    const ref = `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}`;
    const txBody = buildSetValueTransactionBody(ref, {
        id: assistant.id,
        config: {
          model: assistant.model,
          name: assistant.name,
          instructions: assistant.instructions,
          ...(assistant.description && { description: assistant.description }),
          ...(!isEmpty && { metadata: assistant.metadata }),
      },
    });

    // TODO(jiyoung): implement failure handling logic.
    const txResult = await this.ain.sendTransaction(txBody);
    return { ...txResult, assistant: assistant };
  }
}
