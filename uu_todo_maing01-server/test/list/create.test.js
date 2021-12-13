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

    expect.assertions(2);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
  });

  test("Invalid DtoIn", async () => {
    let dtoInCreate = {};

    let expectedError = {
      code: `uu-todo-main/list/create/invalidDtoIn`,
      message: "DtoIn is not valid.",
    };

    expect.assertions(3);

    try {
      await TestHelper.executePostCommand("list/create", dtoInCreate, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.code).toEqual(expectedError.code);
      expect(error.message).toEqual(expectedError.message);
    }
  });

  test("Unsupported keys", async () => {
    let dtoInCreate = {
      name: "Daily routine",
      description: "My daily tasks",
      deadline: "2021-12-15",
      some: 123456,
    };

    let expectedWarning = {
      code: `uu-todo-main/list/create/unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
      unsupportedKeys: ["$.some"],
    };

    result = await TestHelper.executePostCommand("list/create", dtoInCreate, session);

    expect.assertions(4);
    expect(result.status).toEqual(200);
    expect(result.uuAppErrorMap[expectedWarning.code]).toBeDefined();
    expect(result.uuAppErrorMap[expectedWarning.code].message).toEqual(expectedWarning.message);
    expect(result.uuAppErrorMap[expectedWarning.code].paramMap.unsupportedKeyList).toEqual(
      expectedWarning.unsupportedKeys
    );
  });

  test("Deadline Date Is From The Past", async () => {
    let dtoInCreate = {
      id: listId,
      name: "Daily routine",
      description: "My daily tasks",
      deadline: "2020-12-15",
    };

    let expectedError = {
      code: `uu-todo-main/list/create/deadlineIsFromThePast`,
      message: "Deadline date is from the past and therefore cannot be met.",
    };

    expect.assertions(3);

    try {
      await TestHelper.executePostCommand("list/create", dtoInCreate, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.code).toEqual(expectedError.code);
      expect(error.message).toEqual(expectedError.message);
    }
  });
});
