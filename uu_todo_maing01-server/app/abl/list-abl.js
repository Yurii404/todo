"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/list-error.js");

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
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
  },
  listDoesNotExist: {
    code: `${Errors.Delete.UC_CODE}listDoesNotExist`,
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`,
  },
};

class ListAbl {

  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("list");
    this.itemDao = DaoFactory.getDao("item");
    this.mainDao = DaoFactory.getDao("todoInstance");
  }


  async create(awid, dtoIn, uuAppErrorMap = {}) {

    //HDS 2
    let uuList = null;

    try {
      uuList = await this.mainDao.getByAwid(awid);
    } catch (e) {
      throw  new Errors.Create.TodoInstanceDoesNotExist({ uuAppErrorMap }, e);
    }

    if (uuList.state !== "active" && uuList.state !== "underConstruction") {
      throw  new Errors.Create.TodoInstanceIsNotInProperState({ uuAppErrorMap }, {
        awid,
        state: uuList.state,
        expectedState: "active",
      });
    }

    // HDS 1
    let validationResult = this.validator.validate("listCreateDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    //HDS 3
    let recievedDate = new Date(dtoIn.deadline);

    if (dtoIn.deadline) {
      if (recievedDate.setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)) {
        throw new Errors.Create.DeadlineDateIsFromThePast({ uuAppErrorMap }, { deadline: dtoIn.deadline })
      }
    }
    //HDS 4
    const uuObject = { ...dtoIn, awid };
    uuList = null;

    try {
      uuList = await this.dao.create(uuObject);
    } catch (err) {
      throw new Errors.Create.ListDaoCreateFailed({ uuAppErrorMap }, err);
    }

    // HDS 5
    return {
      ...uuList,
      uuAppErrorMap,
    };

  }

  async get(awid, dtoIn, uuAppErrorMap = {}) {

    //HDS 2
    let uuTodo = null;

    try {
      uuTodo = await this.mainDao.getByAwid(awid);
    } catch (e) {
      throw  new Errors.Get.TodoInstanceDoesNotExist({ uuAppErrorMap }, e);
    }

    if (uuTodo.state !== "active" && uuTodo.state !== "underConstruction") {
      throw  new Errors.Get.TodoInstanceIsNotInProperState({ uuAppErrorMap }, {
        awid,
        state: uuTodo.state,
        expectedState: "active",
      });
    }

    // HDS 1
    let validationResult = this.validator.validate("listGetDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // HDS 3
    const uuList = await this.dao.get(awid, dtoIn.id);
    if(!uuList){
      throw new Errors.Get.ListDoesNotExist({ uuAppErrorMap }, {list:dtoIn.id});
    }

    // HDS 4
    return {
      ...uuList,
      uuAppErrorMap,
    };

  }

  async update(awid, dtoIn, uuAppErrorMap = {}) {

    //HDS 2
    let uuList = null;

    try {
      uuList = await this.mainDao.getByAwid(awid);
    } catch (e) {
      throw  new Errors.Update.TodoInstanceDoesNotExist({ uuAppErrorMap }, e);
    }

    if (uuList.state !== "active" && uuList.state !== "underConstruction") {
      throw  new Errors.Update.TodoInstanceIsNotInProperState({ uuAppErrorMap }, {
        awid,
        state: uuList.state,
        expectedState: "active",
      });
    }

    // HDS 1
    let validationResult = this.validator.validate("listUpdateDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    //HDS 3
    let recievedDate = new Date(dtoIn.deadline);

    if (dtoIn.deadline) {
      if (recievedDate.setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)) {
        throw new Errors.Update.DeadlineDateIsFromThePast({ uuAppErrorMap }, { deadline: dtoIn.deadline })
      }
    }
    //HDS 4
    const uuObject = { ...dtoIn, awid };
    uuList = null;

    try {
      uuList = await this.dao.update(uuObject);
    } catch (err) {
      throw new Errors.Update.ListDaoUpdateFailed({ uuAppErrorMap }, err);
    }


    // HDS 5
    return {
      ...uuList,
      uuAppErrorMap,
    };

  }

  async list(awid, dtoIn, uuAppErrorMap = {}) {

    //HDS 2
    let uuList = null;

    try {
      uuList = await this.mainDao.getByAwid(awid);
    } catch (e) {
      throw  new Errors.List.TodoInstanceDoesNotExist({ uuAppErrorMap }, e);
    }

    if (uuList.state !== "active" && uuList.state !== "underConstruction") {
      throw  new Errors.List.TodoInstanceIsNotInProperState({ uuAppErrorMap }, {
        awid,
        state: uuList.state,
        expectedState: "active",
      });
    }

    // HDS 1
    let validationResult = this.validator.validate("listListDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );


    // HDS 2

    if(!dtoIn.pageInfo){
      dtoIn.pageInfo = {
        pageIndex : null,
        pageSize : null
      };
    }
    if(!dtoIn.pageInfo.pageIndex){
      dtoIn.pageInfo.pageIndex = 0;
    }
    if(!dtoIn.pageInfo.pageSize){
      dtoIn.pageInfo.pageSize = 1000;
    }

    // HDS 3



    let uuListOfItem = await this.dao.list(awid, dtoIn.pageInfo);

    // HDS 4
    return {
      uuAppErrorMap,
      ...uuListOfItem
    }

  }

  async delete(awid, dtoIn, uuAppErrorMap = {}) {
    //HDS 2
    let uuList = null;

    try {
      uuList = await this.mainDao.getByAwid(awid);
    } catch (e) {
      throw  new Errors.Delete.TodoInstanceDoesNotExist({ uuAppErrorMap }, e);
    }

    if (uuList.state !== "active" && uuList.state !== "underConstruction") {
      throw  new Errors.Delete.TodoInstanceIsNotInProperState({ uuAppErrorMap }, {
        awid,
        state: uuList.state,
        expectedState: "active",
      });
    }

    // HDS 1
    let validationResult = this.validator.validate("listDeleteDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // default value
    if(!dtoIn.forceDelete){
      dtoIn.forceDelete = false
    }

    // HDS 3
    uuList = null;
    uuList = await this.dao.get(awid, dtoIn.id);

    if(!uuList){

      ValidationHelper.addWarning(
        uuAppErrorMap,
        WARNINGS.ListDoesNotExist.code,
        { awid }
      );

      return {
        ...dtoIn,
        uuAppErrorMap,
      };
    }

    // HDS 4

    if(dtoIn.forceDelete === false){

    dtoIn.state = "active";

    let activeItem = await this.itemDao.listByListIdAndState(awid, dtoIn );

    if(activeItem){
      throw new Errors.Delete.ListContainsActiveItems({ uuAppErrorMap }, {
        id: dtoIn.id,
        itemList: activeItem
      })
    }
    }

    // HDS 5
    try {
      await this.itemDao.deleteManyByListId(awid, dtoIn.id);
    }catch (e){
      throw new Errors.Delete.ItemsWasNotDelete({uuAppErrorMap}, e)
    }


    //HDS 6

    try {
      await this.dao.delete(awid, dtoIn.id);
    }catch (e){
      throw new Errors.Delete.ListWasNotDelete({uuAppErrorMap}, e)
    }

    // HDS 7
    return {
      uuAppErrorMap
    }


  }

}
module.exports = new ListAbl();
