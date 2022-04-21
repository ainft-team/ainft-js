import { getStatus } from '../src/index';

describe("Status", () => {
  it("should return health", async () => {
    expect(await getStatus()).toMatchObject({ health: true });
  });
});
