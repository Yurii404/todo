const { TestHelper } = require("uu_appg01_server-test");
let session = null;
let listId = null;
beforeAll(async () => {

  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  session = await TestHelper.login("AwidLicenseOwner", false, false);

  let dtoIn = {
    code: "61a729529832f205a471dff4",
    name: "uuAppg01Server AppModel",
    uuAppProfileAuthorities: "urn:uu:GGPLUS4U",
  };
  result = await TestHelper.executePostCommand("sys/uuAppWorkspace/init", dtoIn, session);
  listId = result.id;

});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing the update list uuCmd...", () => {
  test("HDS", async () => {


    let result = null;

    let dtoInSetState = {
      state : "active"
    };


    result = await TestHelper.executePostCommand("todoInstance/setState", dtoInSetState, session);

    expect.assertions(2)
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();

  });



});
