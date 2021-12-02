const { TestHelper } = require("uu_appg01_server-test");
let session = null;
let listId = null;
let itemId = null;
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
    let result = null;

    let dtoInCreateList = {
      id: listId,
      name: "Daily routine",
      description: "My daily tasks",
      deadline: "2021-12-15"
    };

    result = await TestHelper.executePostCommand("list/create", dtoInCreateList, session);
    listId = result.id;

    let dtoInCreateItem = {
      listId: listId,
      text: "Learn programming",
      highPriority: true
    };

    result = await TestHelper.executePostCommand("item/create", dtoInCreateItem, session);
    itemId = result.id;

    let dtoInSetFinalState = {
      id: itemId,
      state: "completed"
    };

    result = await TestHelper.executePostCommand("item/setFinalState", dtoInSetFinalState, session);

    expect.assertions(2)
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();

  });

  test("Invalid DtoIn", async () => {

    let result = null;

    let dtoInCreateList = {
      id: listId,
      name: "Daily routine",
      description: "My daily tasks",
      deadline: "2021-12-15"
    };

    result = await TestHelper.executePostCommand("list/create", dtoInCreateList, session);
    listId = result.id;

    let dtoInCreateItem = {
      listId: listId,
      text: "Learn programming",
      highPriority: true
    };

    result = await TestHelper.executePostCommand("item/create", dtoInCreateItem, session);
    itemId = result.id;

    let dtoInSetFinalState = {};

    let expectedError = {
      code: `uu-todo-main/item/setFinalState/invalidDtoIn`,
      message: "DtoIn is not valid.",
    };

    expect.assertions(3)

    try {
      result = await TestHelper.executePostCommand("item/setFinalState", dtoInSetFinalState, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.code).toEqual(expectedError.code)
      expect(error.message).toEqual(expectedError.message);
    }
  });

  test("Unsupported keys", async () => {

    let result = null;

    let dtoInCreateList = {
      id: listId,
      name: "Daily routine",
      description: "My daily tasks",
      deadline: "2021-12-15"
    };

    result = await TestHelper.executePostCommand("list/create", dtoInCreateList, session);
    listId = result.id;

    let dtoInCreateItem = {
      listId: listId,
      text: "Learn programming",
      highPriority: true
    };

    result = await TestHelper.executePostCommand("item/create", dtoInCreateItem, session);
    itemId = result.id;

    let dtoInSetFinalState = {
      id: itemId,
      state: "completed",
      some : 12345
    };


    let expectedWarning = {
      code: `uu-todo-main/item/setFinalState/unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
      unsupportedKeys: ["$.some"],
    };

    result = await TestHelper.executePostCommand("item/setFinalState", dtoInSetFinalState, session);

    expect.assertions(4)
    expect(result.status).toEqual(200);
    expect(result.uuAppErrorMap[expectedWarning.code]).toBeDefined();
    expect(result.uuAppErrorMap[expectedWarning.code].message).toEqual(expectedWarning.message);
    expect(result.uuAppErrorMap[expectedWarning.code].paramMap.unsupportedKeyList).toEqual(expectedWarning.unsupportedKeys);

  });

  test("Item Does Not Exist", async () => {

    let result = null;

    let dtoInCreateList = {
      id: listId,
      name: "Daily routine",
      description: "My daily tasks",
      deadline: "2021-12-15"
    };

    result = await TestHelper.executePostCommand("list/create", dtoInCreateList, session);
    listId = result.id;

    let dtoInCreateItem = {
      listId: listId,
      text: "Learn programming",
      highPriority: true
    };

    result = await TestHelper.executePostCommand("item/create", dtoInCreateItem, session);
    itemId = result.id;

    let dtoInSetFinalState = {
      id: listId,
      state: "completed"
    };


    let expectedError = {
      code: `uu-todo-main/item/setFinalState/itemDoesNotExist`,
      message: "Item with given id does not exist.",
    };

    expect.assertions(3)

    try {
      await TestHelper.executePostCommand("item/setFinalState", dtoInSetFinalState, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.code).toEqual(expectedError.code)
      expect(error.message).toEqual(expectedError.message);
    }
  });

  test("Item Is Not In Correct State", async () => {

    let result = null;

    let dtoInCreateList = {
      id: listId,
      name: "Daily routine",
      description: "My daily tasks",
      deadline: "2021-12-15"
    };

    result = await TestHelper.executePostCommand("list/create", dtoInCreateList, session);
    listId = result.id;

    let dtoInCreateItem = {
      listId: listId,
      text: "Learn programming",
      highPriority: true
    };

    result = await TestHelper.executePostCommand("item/create", dtoInCreateItem, session);
    itemId = result.id;

    let dtoInSetFinalState = {
      id: itemId,
      state: "completed"
    };

    await TestHelper.executePostCommand("item/setFinalState", dtoInSetFinalState, session);

    let expectedError = {
      code: `uu-todo-main/item/setFinalState/itemIsNotInCorrectState`,
      message: "Item is not in correct state.",
    };

    expect.assertions(3)

    try {
      await TestHelper.executePostCommand("item/setFinalState", dtoInSetFinalState, session);
    } catch (error) {
      expect(error.status).toEqual(400);
      expect(error.code).toEqual(expectedError.code)
      expect(error.message).toEqual(expectedError.message);
    }
  });

});
