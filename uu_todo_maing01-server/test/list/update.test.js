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

describe("Testing the update list uuCmd...", () => {
  test("HDS", async () => {

    let dtoInCreate = {
      id: listId,
      name: "Daily routine",
      description: "My daily tasks",
      deadline: "2021-12-15"
    };

    let result = null;

    result = await TestHelper.executePostCommand("list/create", dtoInCreate, session);
    listId = result.id;

    let dtoInUpdate = {
      id: listId,
      name: "Daily updated",
      description: "My daily tasks",
      deadline: "2021-12-15"
    };


    result = await TestHelper.executePostCommand("list/update", dtoInUpdate, session);

    expect.assertions(2)
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();

  });



});


// expect.assertions(3)
// try {
//   let result = await TestHelper.executePostCommand("list/update", dtoIn, session);
// } catch (e) {
//
// expect(e.status).toEqual(400);
// expect(e.data.uuAppErrorMap["uiujui"]).toBeDefined();
//
// }
