import Ain from '@ainblockchain/ain-js';
import Ainize from '@ainize-team/ainize-js';
import OpenAI from 'openai';

import Ainft721Object from '../../ainft721Object';
import { AssistantCreateParams, AssistantTransactionResult } from '../../types';
import {
  buildSetTransactionBody,
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
  // TODO(jiyoung): [TEMP] openai instance is temporarily initialized.
  // it should be removed when ainize service is deployed.
  private openai: OpenAI;

  constructor(ain: Ain, ainize: Ainize) {
    this.ain = ain;
    this.ainize = ainize;
    this.openai = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'],
    });
  }

  async create({
    objectId,
    provider,
    api,
    tokenId,
    model,
    name,
    instructions,
    description,
  }: AssistantCreateParams): Promise<AssistantTransactionResult> {
    const appId = Ainft721Object.getAppId(objectId);
    const address = this.ain.signer.getAddress();

    await validateObject(appId, this.ain);
    await validateObjectOwnership(appId, address, this.ain);
    await validateToken(appId, tokenId, this.ain);

    const serviceName = validateServiceName(provider, api);
    const service = await validateService(serviceName, this.ainize);

    await validateAi(appId, serviceName, this.ain);

    // TODO(jiyoung): replace with ainize.request() function after deployment of ainize service.
    // const response = await service.request(<REQUEST_DATA>);
    try {
      var assistant = await this.openai.beta.assistants.create({
        model: model,
        name: name,
        instructions: instructions,
        description: description,
      });
    } catch (error) {
      throw new Error(`Failed to create assistant: ${error}`);
    }

    const txBody = buildSetTransactionBody({
      type: 'SET_VALUE',
      ref: `/apps/${appId}/tokens/${tokenId}/ai/${serviceName}`,
      value: {
        id: assistant.id,
        config: {
          model: assistant.model,
          name: assistant.name,
          instructions: assistant.instructions,
          ...(assistant.description && { description: assistant.description }),
        },
      },
    });

    // TODO(jiyoung): implement failure handling logic.
    const result = await this.ain.sendTransaction(txBody);
    return {
      txHash: result.tx_hash,
      assistant: assistant,
    };
  }
}
