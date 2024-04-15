export const Path = {
  apps: () => {
    return {
      value: () => '/apps',
    };
  },
  app: (appId: string) => {
    return {
      value: () => `${Path.apps().value()}/${appId}`,
      ai: (serverName: string) => {
        return {
          value: () => `${Path.app(appId).value()}/ai/${serverName}`,
        };
      },
      tokens: () => {
        return {
          value: () => `${Path.app(appId).value()}/tokens`,
        };
      },
      token: (tokenId: string) => {
        return {
          value: () => `${Path.app(appId).tokens().value()}/${tokenId}`,
          ai: () => {
            return {
              value: () => `${Path.app(appId).token(tokenId).value()}/ai`,
              config: () => {
                return {
                  value: () => `${Path.app(appId).token(tokenId).ai().value()}/config`,
                };
              },
              history: (address: string) => {
                return {
                  value: () => `${Path.app(appId).token(tokenId).ai().value()}/${address}`,
                  threads: () => {
                    return {
                      value: () =>
                        `${Path.app(appId).token(tokenId).ai().history(address).value()}/threads`,
                    };
                  },
                  thread: (threadId: string) => {
                    return {
                      value: () =>
                        `${Path.app(appId)
                          .token(tokenId)
                          .ai()
                          .history(address)
                          .threads()
                          .value()}/${threadId}`,
                      messages: () => {
                        return {
                          value: () =>
                            `${Path.app(appId)
                              .token(tokenId)
                              .ai()
                              .history(address)
                              .thread(threadId)
                              .value()}/messages`,
                        };
                      },
                      message: (messageId: string) => {
                        return {
                          value: () =>
                            `${Path.app(appId)
                              .token(tokenId)
                              .ai()
                              .history(address)
                              .thread(threadId)
                              .messages()
                              .value()}/${messageId}`,
                        };
                      },
                    };
                  },
                };
              },
            };
          },
        };
      },
    };
  },
};
