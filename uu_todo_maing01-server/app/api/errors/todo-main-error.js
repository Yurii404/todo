"use strict";
const TodoMainUseCaseError = require("./todo-main-use-case-error.js");

const Init = {
  UC_CODE: `${TodoMainUseCaseError.ERROR_PREFIX}init/`,

  InvalidDtoIn: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  sysUuAppWorkspaceProfileSetFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sys/setProfileFailed`;
      this.message = "Call sys/uuAppWorkspace/profile/set failed.";
    }
  },
  TodoInstanceCreateDaoFailed	: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}todoInstanceDaoCreateFailedd`;
      this.message = "TodoInstance DAO create failed.";
    }
  },

  CreateAwscFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}createAwscFailed`;
      this.message = "Create uuAwsc failed.";
    }
  },
};

module.exports = {
  Init,
};
