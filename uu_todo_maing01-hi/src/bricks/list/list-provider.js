//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent,useDataList, useState } from "uu5g04-hooks";
import Config from "../config/config";
import Calls from "../../calls";
//@@viewOff:imports


const ListProvider = createComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "ListProvider",
  //@@viewOff:statics

  render({ children }) {
    //@@viewOn:hooks
    let listDataValues = useDataList({
      pageSize: 200,
      handlerMap: {
        load: Calls.listLists,
        createList: Calls.createList,
        updateList: Calls.updateList,
        deleteList: Calls.deleteList
      }
    });

    let { state, data, newData, pendingData, errorData, handlerMap } = listDataValues;
    //@@viewOff:hooks

    //@@viewOn:render
    return children({
      state,
      data,
      newData,
      pendingData,
      errorData,
      handlerMap
    });
    //@@viewOff:render
  }
});

export default ListProvider;
