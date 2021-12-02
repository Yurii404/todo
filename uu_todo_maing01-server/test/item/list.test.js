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
  test("HDS by List", async () => {
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

    let dtoInList= {};

    result = await TestHelper.executeGetCommand("item/list", dtoInList, session);

    expect.assertions(2)
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();

  });

  test("HDS by listByState", async () => {
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

    let dtoInList= {
      state: "active"
    };

    result = await TestHelper.executeGetCommand("item/list", dtoInList, session);

    expect.assertions(2)
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();

  });

  test("HDS by listByListId", async () => {
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

    let dtoInList= {
      listId: listId
    };

    result = await TestHelper.executeGetCommand("item/list", dtoInList, session);

    expect.assertions(2)
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();

  });

  test("HDS by listByListIdAndState", async () => {
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

    let dtoInList= {
      listId: listId,
      state: "active"
    };

    result = await TestHelper.executeGetCommand("item/list", dtoInList, session);

    expect.assertions(2)
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();

  });



});
