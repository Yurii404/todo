const { TestHelper } = require("uu_appg01_server-test");
let session = null;
let listId = null;
beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  session = await TestHelper.login("Authorities", false, false);

  let dtoIn = {
    code: "61a729529832f205a471dff4",
    name: "uuAppg01Server AppModel",
    uuAppProfileAuthorities: "urn:uu:GGPLUS4U",
  };
  await TestHelper.executePostCommand("sys/uuAppWorkspace/init", dtoIn, session);
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing the delete list uuCmd...", () => {
  test("HDS", async () => {
    let dtoInCreate = {
      id: listId,
      name: "Daily routine",
      description: "My daily tasks",
      deadline: "2021-12-15",
    };

    let result = null;

    result = await TestHelper.executePostCommand("list/create", dtoInCreate, session);
    listId = result.id;

    let dtoInGet = {
      id: listId,
      forceDelete: true,
    };

    result = await TestHelper.executeGetCommand("list/get", dtoInGet, session);

    expect.assertions(2);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("Invalid DtoIn", async () => {
    let dtoInGet = {};

    let expectedError = {
      code: `uu-todo-main/list/get/invalidDtoIn`,
      message: "DtoIn is not valid.",
    };

    expect.assertions(3);

    try {
      await TestHelper.executeGetCommand("list/get", dtoInGet, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.code).toEqual(expectedError.code);
      expect(error.message).toEqual(expectedError.message);
    }
  });

  test("Unsupported keys", async () => {
    let dtoInCreate = {
      id: listId,
      name: "Daily routine",
      description: "My daily tasks",
      deadline: "2021-12-15",
    };

    let result = null;

    result = await TestHelper.executePostCommand("list/create", dtoInCreate, session);
    listId = result.id;

    let dtoInGet = {
      id: listId,
      some: 12345,
    };

    let expectedWarning = {
      code: `uu-todo-main/list/get/unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
      unsupportedKeys: ["$.some"],
    };

    result = await TestHelper.executeGetCommand("list/get", dtoInGet, session);

    expect.assertions(4);
    expect(result.status).toEqual(200);
    expect(result.uuAppErrorMap[expectedWarning.code]).toBeDefined();
    expect(result.uuAppErrorMap[expectedWarning.code].message).toEqual(expectedWarning.message);
    expect(result.uuAppErrorMap[expectedWarning.code].paramMap.unsupportedKeyList).toEqual(
      expectedWarning.unsupportedKeys
    );
  });
});
