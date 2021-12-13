"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/item-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`,
  },
  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`,
  },
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`,
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`,
  },
  setFinalStateUnsupportedKeys: {
    code: `${Errors.SetFinalState.UC_CODE}unsupportedKeys`,
  },
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
  },
};

class ItemAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("item");
    this.listDao = DaoFactory.getDao("list");
    this.mainDao = DaoFactory.getDao("todoInstance");
  }

  async delete(awid, dtoIn, uuAppErrorMap = {}) {
    //HDS 2
    let uuList = null;

    try {
      uuList = await this.mainDao.getByAwid(awid);
    } catch (e) {
      throw new Errors.Delete.TodoInstanceDoesNotExist({ uuAppErrorMap }, e);
    }

    if (uuList.state !== "active" && uuList.state !== "underConstruction") {
      throw new Errors.Delete.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        {
          awid,
          state: uuList.state,
          expectedState: "active",
        }
      );
    }

    // HDS 1
    let validationResult = this.validator.validate("itemDeleteDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // HDS 2
    let uuItem = await this.dao.get(awid, dtoIn.id);

    if (!uuItem) {
      throw new Errors.Delete.ItemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    // if(uuItem.state !== "active"){
    //   throw  new Errors.Delete.ItemIsNotInCorrectState({uuAppErrorMap}, {
    //     id: dtoIn.id,
    //     currentState: uuItem.state,
    //     expectedState: "active"
    //   });
    // }

    // HDS 3

    uuItem = await this.dao.delete(awid, dtoIn.id);

    // HDS 4
    return {
      uuAppErrorMap,
      ...uuItem,
    };
  }

  async setFinalState(awid, dtoIn, uuAppErrorMap = {}) {
    //HDS 2
    let uuList = null;

    try {
      uuList = await this.mainDao.getByAwid(awid);
    } catch (e) {
      throw new Errors.SetFinalState.TodoInstanceDoesNotExist({ uuAppErrorMap }, e);
    }

    if (uuList.state !== "active" && uuList.state !== "underConstruction") {
      throw new Errors.SetFinalState.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        {
          awid,
          state: uuList.state,
          expectedState: "active",
        }
      );
    }

    // HDS 1
    let validationResult = this.validator.validate("itemSetFinalStateDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.setFinalStateUnsupportedKeys.code,
      Errors.SetFinalState.InvalidDtoIn
    );

    // HDS 3
    let uuItem = await this.dao.get(awid, dtoIn.id);

    if (!uuItem) {
      throw new Errors.SetFinalState.ItemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }
    if (uuItem.state !== "active") {
      throw new Errors.SetFinalState.ItemIsNotInCorrectState(
        { uuAppErrorMap },
        {
          id: dtoIn.id,
          currentState: uuItem.state,
          expectedState: "active",
        }
      );
    }

    // HDS 4

    uuItem.state = dtoIn.state;

    uuItem = await this.dao.setFinalState(awid, dtoIn.id, uuItem);

    // HDS 4
    return {
      uuAppErrorMap,
      ...uuItem,
    };
  }

  async list(awid, dtoIn, uuAppErrorMap = {}) {
    //HDS 2
    let uuList = null;

    try {
      uuList = await this.mainDao.getByAwid(awid);
    } catch (e) {
      throw new Errors.List.TodoInstanceDoesNotExist({ uuAppErrorMap }, e);
    }

    if (uuList.state !== "active" && uuList.state !== "underConstruction") {
      throw new Errors.List.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        {
          awid,
          state: uuList.state,
          expectedState: "active",
        }
      );
    }

    // HDS 1
    let validationResult = this.validator.validate("itemListDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // HDS 2

    if (!dtoIn.pageInfo) {
      dtoIn.pageInfo = {
        pageIndex: null,
        pageSize: null,
      };
    }
    if (!dtoIn.pageInfo.pageIndex) {
      dtoIn.pageInfo.pageIndex = 0;
    }
    if (!dtoIn.pageInfo.pageSize) {
      dtoIn.pageInfo.pageSize = 1000;
    }

    //HDS 3
    let uuListOfItem = null;

    if (!!dtoIn.state && !!dtoIn.listId) {
      uuListOfItem = await this.dao.listByListIdAndState(awid, dtoIn);
    } else if (!!dtoIn.state) {
      uuListOfItem = await this.dao.listByState(awid, dtoIn);
    } else if (!!dtoIn.listId) {
      uuListOfItem = await this.dao.listBylistId(awid, dtoIn);
    } else {
      uuListOfItem = await this.dao.list(awid, dtoIn);
    }

    // HDS 4
    return {
      uuAppErrorMap,
      ...uuListOfItem,
    };
  }

  async create(awid, dtoIn, session, uuAppErrorMap = {}) {
    //HDS 2
    let uuList = null;

    try {
      uuList = await this.mainDao.getByAwid(awid);
    } catch (e) {
      throw new Errors.Create.TodoInstanceDoesNotExist({ uuAppErrorMap }, e);
    }

    if (uuList.state !== "active" && uuList.state !== "underConstruction") {
      throw new Errors.Create.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        {
          awid,
          state: uuList.state,
          expectedState: "active",
        }
      );
    }

    // HDS 1
    let validationResult = this.validator.validate("itemCreateDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // HDS 3
    dtoIn.state = "active";

    // HDS 4
    uuList = null;
    uuList = await this.listDao.get(awid, dtoIn.listId);

    if (!uuList) {
      throw new Errors.Create.ListDoesNotExist({ uuAppErrorMap }, { listId: dtoIn.listId });
    }

    //HDS 5
    const uuObject = { ...dtoIn, awid };
    let uuItem = null;

    try {
      uuItem = await this.dao.create(uuObject);
    } catch (err) {
      throw new Errors.Create.ItemDaoCreateFailed({ uuAppErrorMap }, err);
    }

    // HDS 5
    return {
      ...uuItem,
      uuAppErrorMap,
    };
  }

  async get(awid, dtoIn, uuAppErrorMap = {}) {
    //HDS 2
    let uuTodo = null;

    try {
      uuTodo = await this.mainDao.getByAwid(awid);
    } catch (e) {
      throw new Errors.Get.TodoInstanceDoesNotExist({ uuAppErrorMap }, e);
    }

    if (uuTodo.state !== "active" && uuTodo.state !== "underConstruction") {
      throw new Errors.Get.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        {
          awid,
          state: uuTodo.state,
          expectedState: "active",
        }
      );
    }

    // HDS 1
    let validationResult = this.validator.validate("itemGetDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // HDS 3
    const uuItem = await this.dao.get(awid, dtoIn.id);
    if (!uuItem) {
      throw new Errors.Get.ItemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }

    // HDS 4
    return {
      ...uuItem,
      uuAppErrorMap,
    };
  }

  async update(awid, dtoIn, uuAppErrorMap = {}) {
    //HDS 2
    let uuList = null;

    try {
      uuList = await this.mainDao.getByAwid(awid);
    } catch (e) {
      throw new Errors.Update.TodoInstanceDoesNotExist({ uuAppErrorMap }, e);
    }

    if (uuList.state !== "active" && uuList.state !== "underConstruction") {
      throw new Errors.Update.TodoInstanceIsNotInProperState(
        { uuAppErrorMap },
        {
          awid,
          state: uuList.state,
          expectedState: "active",
        }
      );
    }

    // HDS 1
    let validationResult = this.validator.validate("itemUpdateDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // HDS 3
    let uuItem = await this.dao.get(awid, dtoIn.id);

    if (!uuItem) {
      throw new Errors.Update.ItemDoesNotExist({ uuAppErrorMap }, { id: dtoIn.id });
    }
    if (uuItem.state !== "active") {
      throw new Errors.Update.ItemIsNotInCorrectState(
        { uuAppErrorMap },
        {
          id: dtoIn.id,
          currentState: item.state,
          expectedState: active,
        }
      );
    }

    // HDS 4
    // if(!dtoIn.listId){
    //   throw new Errors.Update.ListDoesNotExist({})
    // }

    //HDS 4
    const uuObject = { ...dtoIn, awid };
    uuList = null;

    try {
      uuList = await this.dao.update(uuObject);
    } catch (err) {
      throw new Errors.Update.ItemDaoUpdateFailed({ uuAppErrorMap }, err);
    }

    // HDS 5
    return {
      ...uuList,
      uuAppErrorMap,
    };
  }
}

module.exports = new ItemAbl();
