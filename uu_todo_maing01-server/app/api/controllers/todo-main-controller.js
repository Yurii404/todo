"use strict";
const TodoMainAbl = require("../../abl/todo-main-abl.js");

class TodoMainController {
  init(ucEnv) {
    return TodoMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new TodoMainController();
