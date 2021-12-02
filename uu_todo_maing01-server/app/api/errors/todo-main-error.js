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

const Update = {
  UC_CODE: `${TodoMainUseCaseError.ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  TodoInstanceDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}todoDoesNotExist`;
      this.message = "TodoInstance does not exist..";
    }
  },
  TodoInstanceIsNotInProperState: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}todoIsNotInCorrectState`;
      this.message = "The application is not in proper state.";
    }
  },
  TodoInstanceDaoUpdateByAwidFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}todoInstanceDaoUpdateByAwidFailed`;
      this.message = "The update of todoInstance by todoInstance DAO updateByAwid failed.";
    }
  },


};

const SetState = {
  UC_CODE: `${TodoMainUseCaseError.ERROR_PREFIX}setState/`,

  InvalidDtoIn: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  TodoInstanceDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}todoDoesNotExist`;
      this.message = "TodoInstance does not exist..";
    }
  },
  TodoInstanceIsNotInProperState: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}todoesIsNotInCorrectState`;
      this.message = "The application is not in proper state.";
    }
  },
  TodoInstanceDaoUpdateByAwidFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}todoInstanceDaoUpdateByAwidFailed`;
      this.message = "The update of todoInstance by todoInstance DAO updateByAwid failed.";
    }
  },


};

module.exports = {
  Init,
  Update,
  SetState
};
