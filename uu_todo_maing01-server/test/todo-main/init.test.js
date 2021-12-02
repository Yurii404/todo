const { TestHelper } = require("uu_appg01_server-test");

beforeAll(async () => {

  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing the init uuCmd...", () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    let dtoIn = {
      code: "61a729529832f205a471dff4",
      name: "uuAppg01Server AppModel",
      uuAppProfileAuthorities: "urn:uu:GGPLUS4U",
    };
    let result = await TestHelper.executePostCommand("sys/uuAppWorkspace/init", dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });


});
