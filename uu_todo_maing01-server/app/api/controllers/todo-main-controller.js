"use strict";
const TodoMainAbl = require("../../abl/todo-main-abl.js");

class TodoMainController {
  init(ucEnv) {
    return TodoMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  update(ucEnv) {
    return TodoMainAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  setState(ucEnv) {
    return TodoMainAbl.setState(ucEnv.getUri().getAwid(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new TodoMainController();
