describe("ChatAi", () => {
  it("should have private key", async () => {
    const privateKey = process.env['PRIVATE_KEY'];
    expect(privateKey).toBeDefined();
  });
});
