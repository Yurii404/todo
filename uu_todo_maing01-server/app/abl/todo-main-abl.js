"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, AppClientTokenService, UuAppWorkspace, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const { AppClient } = require("uu_appg01_server");
const Errors = require("../api/errors/todo-main-error.js");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`,
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`,
  },
};

const logger = LoggerFactory.get("TodoMainAbl");

class TodoMainAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("todoInstance");
  }

  async init(uri, dtoIn, session, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    // HDS 1
    let validationResult = this.validator.validate("sysUuAppWorkspaceInitDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    // HDS 2
    const schemas = ["todoInstance", "list", "item"];
    let schemaCreateResults = schemas.map(async (schema) => {
      try {
        return await DaoFactory.getDao(schema).createUuSchema();
      } catch (e) {
        // A3
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
      }
    });
    await Promise.all(schemaCreateResults);


    // HDS 3
    const {uuAppProfileAuthorities, ...restDtoIn} = dtoIn;

    if (dtoIn.uuAppProfileAuthorities) {
      try {
        await Profile.set(awid, "Authorities", dtoIn.uuAppProfileAuthorities);
      } catch (e) {
        if (e instanceof UuAppWorkspaceError) {
          // A4
          throw new Errors.Init.sysUuAppWorkspaceProfileSetFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
        }
        throw e;
      }
    }

    // HDS 4 - HDS N
    const uuObject= {
      awid,
      ...restDtoIn,
      state : "actual"
    }

    let uuTodoInstance = null

    try {
      uuTodoInstance = this.dao.create(uuObject);
    }catch (e){
      throw new Errors.Init.TodoInstanceCreateDaoFailed({ uuAppErrorMap},e );
    }


    return {
      ...uuTodoInstance,
      uuAppErrorMap: uuAppErrorMap,
    };
  }

  async update(awid, dtoIn, uuAppErrorMap = {}) {

    //HDS 2
    let uuList = null;

    try {
      uuList = await this.dao.getByAwid(awid);
    } catch (e) {
      throw  new Errors.Update.TodoInstanceDoesNotExist({ uuAppErrorMap }, e);
    }

    console.log(uuList + "_-------------------------------------------------")

    if (uuList.state !== "active" && uuList.state !== "underConstruction") {
      throw  new Errors.Update.TodoInstanceIsNotInProperState({ uuAppErrorMap }, {
        awid,
        state: uuList.state,
        expectedState: "active",
      });
    }

    // HDS 1
    let validationResult = this.validator.validate("todoInstanceUpdateDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    //HDS 4
    const uuObject = { ...dtoIn, awid };
    uuList = null;

    try {
      uuList = await this.dao.update(uuObject);
    } catch (err) {
      throw new Errors.Update.TodoInstanceDaoUpdateByAwidFailed({ uuAppErrorMap }, err);
    }


    // HDS 5
    return {
      ...uuList,
      uuAppErrorMap,
    };

  }
}

module.exports = new TodoMainAbl();
