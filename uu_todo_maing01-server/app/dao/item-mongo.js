"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ItemMongo extends UuObjectDao {

  async createUuSchema(){
    await super.createIndex({ awid: 1 , _id : 1}, { unique: true });
    await super.createIndex({ awid: 1 , listId : 1, state : 1});
    await super.createIndex({ awid: 1 ,  state : 1});
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }
  async get(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.findOne(filter);
  }

  async update(uuObject) {
    let filter = {
      id: uuObject.id,
      awid: uuObject.awid,

    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async list(awid, pageInfo = {}) {
    let filter = {
      awid,
    };
    return super.find(filter, pageInfo);
  }

  async listByState(awid,dtoIn) {
    let filter = {
      awid,
      state : dtoIn.state

    };
    return super.find(filter, dtoIn.pageInfo);
  }

  async listBylistId(awid,dtoIn) {
    let filter = {
      awid,
      listId : dtoIn.listId

    };
    return super.find(filter, dtoIn.pageInfo);
  }

  async listByListIdAndState(awid,dtoIn) {
    let filter = {
      awid,
      state : dtoIn.state,
      listId : dtoIn.listId
    };
    return super.find(filter, dtoIn.pageInfo);
  }

  async setFinalState(awid, id, uuObject) {
    let filter = {
      awid,
      id

    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async delete(awid, id) {
    let filter = {
      awid,
      id
    };
    return await super.deleteOne(filter);
  }

  async deleteManyByListId(awid, id) {
    let filter = {
      awid,
      listId : id
    };
    return await super.deleteMany(filter);
  }


}

module.exports = ItemMongo;
