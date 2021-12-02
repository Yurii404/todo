"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TodoMainMongo extends UuObjectDao {
  async createUuSchema() {
    await super.createIndex({ awid: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async getByAwid(awid) {
    let filter = {
      awid
    };
    return await super.findOne(filter);
  }

  async update(uuObject) {
    let filter = {
      awid: uuObject.awid,

    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }


}

module.exports = TodoMainMongo;
