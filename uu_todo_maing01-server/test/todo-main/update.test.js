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

    let dtoInUpdate = {
      code: "61a729529832f205a471dff4",
      name: "uuAppg01Server AppModel",
      uuAppProfileAuthorities: "urn:uu:GGPLUS4U"
    };


    result = await TestHelper.executePostCommand("todoInstance/update", dtoInUpdate, session);

    expect.assertions(2)
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();

  });

  test("Invalid DtoIn", async () => {

    let dtoInSetState = {
      name : 123124
    };

    let expectedError = {
      code: `uu-todo-main/update/invalidDtoIn`,
      message: "DtoIn is not valid.",
    };
    expect.assertions(3)

    try {
      await TestHelper.executePostCommand("todoInstance/update", dtoInSetState, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.code).toEqual(expectedError.code)
      expect(error.message).toEqual(expectedError.message);
    }
  });

  test("Unsupported keys", async () => {

    let dtoIn = {
      code: "61a729529832f205a471dff4",
      name: "uuAppg01Server AppModel",
      id: 12345
    };

    let expectedWarning = {
      code: `uu-todo-main/update/unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
      unsupportedKeys: ["$.id"],
    };


    let result = await TestHelper.executePostCommand("todoInstance/update", dtoIn, session);

    expect.assertions(4)
    expect(result.status).toEqual(200);
    expect(result.uuAppErrorMap[expectedWarning.code]).toBeDefined();
    expect(result.uuAppErrorMap[expectedWarning.code].message).toEqual(expectedWarning.message);
    expect(result.uuAppErrorMap[expectedWarning.code].paramMap.unsupportedKeyList).toEqual(expectedWarning.unsupportedKeys);

  });



});
