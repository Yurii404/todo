//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent,useDataList, useState, useData } from "uu5g04-hooks";
import Config from "../config/config";
import Calls from "../../calls";
//@@viewOff:imports


const ItemProvider = createComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "ItemProvider",
  //@@viewOff:statics

  render({ children }) {
    //@@viewOn:hooks

    let url = window.top.location.href;
    let id = url.slice(-24)

    let itemDataValues = useDataList({
      pageSize: 200,
      handlerMap: {
        load: Calls.listItems,
        createItem: Calls.createItem,
        updateItem: Calls.updateItem,
        deleteItem: Calls.deleteItem,
        setFinalState: Calls.setFinalState
      }
    });

    let { state, data, newData, pendingData, errorData, handlerMap } = itemDataValues;
    //@@viewOff:hooks

    let datas = [];


    if(data) {
      data.forEach(item => {
        if (item.data.listId === id) {
          datas.push(item)
        }
      })
    }

    data = datas;


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

export default ItemProvider;
