//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useDataList } from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config.js";
import Lsi from "../config/lsi.js";
import ListList from "../bricks/list/list-list";
import ListProvider from "../bricks/list/list-provider";
import ListCreate from "../bricks/list/list-create";
import Home from "../routes/home";
import { ModalManager } from "../bricks/list/modal-manager";
import List from "../bricks/list/list";
import Calls from "../calls";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:static
  displayName: Config.TAG + "Left",
  //@@viewOff:static
};

export const Left = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private
    // const dataListResult = useDataList({
    //   pageSize: 200,
    //   handleMap: {
    //     load: Calls.listLists
    //   }
    // })
    // console.log(dataListResult)
    // const { data } = dataListResult;
    // console.log(data)
    // let lists = []

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <Plus4U5.App.Left
        {...props}
        logoProps={{
          backgroundColor: UU5.Environment.colors.blue.c700,
          backgroundColorTo: UU5.Environment.colors.blue.c500,
          title: "uuTodo",
          companyLogo: Plus4U5.Environment.basePath + "assets/img/unicorn-logo.svg",
          generation: "1",
        }}
        //aboutItems={[{ content: <UU5.Bricks.Lsi lsi={Lsi.left.about} />, href: "about" }]}
        helpHref={null}
      >
        <Home />
        <Plus4U5.App.MenuTree
          Bottom
          // NOTE Item "id" equals to useCase so that item gets automatically selected when route changes (see spa-autheticated.js).
        />
      </Plus4U5.App.Left>
    );
    //@@viewOff:render
  },
});

export default Left;
