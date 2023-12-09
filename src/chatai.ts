import Ain from "@ainblockchain/ain-js";
import Ainize from "@ainize-team/ainize-sdk";
import BaseAI from "./baseai";

export default class ChatAI extends BaseAI {
  constructor(ain: Ain, ainize: Ainize) {
    super(ain, ainize);
  }

  createAssistant(): void {}
  updateAssistant(): void {}
  deleteAssistant(): void {}
  getAssistant(): void {}
  listAssistants(): void {}

  createThread(): void {}
  updateThread(): void {}
  deleteThread(): void {}
  getThread(): void {}
  listThreads(): void {}

  createMessage(): void {}
  updateMessage(): void {}
  getMessage(): void {}
  listMessages(): void {}
}
