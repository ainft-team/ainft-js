import Ain from "@ainblockchain/ain-js";
import Ainize from "@ainize-team/ainize-sdk";
import AI from "./ai";

export default class ChatAI extends AI {
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
