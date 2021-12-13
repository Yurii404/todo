//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useRef, useState } from "uu5g04-hooks";
import Config from "./config/config";
import ItemList from "../bricks/item/item-list";
import ItemProvider from "../bricks/item/item-provider";
import ItemCreate from "../bricks/item/item-create";

//@@viewOff:imports

const Mode = {
  WITH_COMPLETE: "WITH_COMPLETE",
  WITHOUT_COMPLETE: "WITHOUT_COMPLETE",
};

const Items = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Items",
  //@@viewOff:statics

  render() {
    //@@viewOn:hooks
    const createItemRef = useRef();
    const updateItemRef = useRef();
    const deleteItemRef = useRef();
    const setFinalStateItemRef = useRef();

    const [mode, setMode] = useState(Mode.WITHOUT_COMPLETE);
    //@viewOff:hooks

    //@@viewOn:private
    function showError(content) {
      UU5.Environment.getPage().getAlertBus().addAlert({
        content,
        colorSchema: "red",
      });
    }
    async function handleSetFinalStateItem(id, state) {
      try {
        await setFinalStateItemRef.current({ id: id, state: state });
      } catch {
        showError(`Set state failed!`);
      }
    }

    async function handleCreateItem(item) {
      try {
        await createItemRef.current(item);
      } catch {
        showError(`Creation of ${item.text} failed!`);
      }
    }

    /* eslint no-unused-vars: "off" */
    async function handleUpdateItem(item) {
      try {
        await updateItemRef.current(item);
      } catch {
        showError(`Update of ${item.text} failed!`);
      }
    }

    async function handleDeleteItem(item) {
      try {
        await deleteItemRef.current({ id: item.id });
      } catch {
        showError(`Deletion of ${item.text} failed!`);
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    function renderLoad() {
      return <UU5.Bricks.Loading />;
    }

    function setModeWith() {
      setMode(Mode.WITH_COMPLETE);
    }
    function setModeWithout() {
      setMode(Mode.WITHOUT_COMPLETE);
    }

    function returnWithoutCompletedElement(items) {
      let listOfActive = [];

      items.forEach((item) => {
        console.log(item);
        if (item.data.state === "active") {
          listOfActive.push(item);
        }
      });
      return (
        <>
          <ItemCreate onCreate={handleCreateItem} />
          <ItemList
            name={"listActive"}
            items={listOfActive}
            onDelete={handleDeleteItem}
            onUpdate={handleUpdateItem}
            setFinalState={handleSetFinalStateItem}
          />
          <UU5.Bricks.Button colorSchema="primary" onClick={setModeWith}>
            Show completed task
          </UU5.Bricks.Button>
        </>
      );
    }

    function returnWithCompleteElement(items) {
      let listOfActive = [];
      let listOfCompleted = [];

      items.forEach((item) => {
        console.log(item);
        if (item.data.state === "active") {
          listOfActive.push(item);
        } else {
          listOfCompleted.push(item);
        }
      });
      return (
        <>
          <ItemCreate onCreate={handleCreateItem} />
          <ItemList
            name={"listActive"}
            items={listOfActive}
            onDelete={handleDeleteItem}
            onUpdate={handleUpdateItem}
            setFinalState={handleSetFinalStateItem}
          />
          <UU5.Bricks.Button colorSchema="primary" onClick={setModeWithout}>
            Hide completed task
          </UU5.Bricks.Button>
          <ItemList
            name={"listCompleted"}
            items={listOfCompleted}
            onDelete={handleDeleteItem}
            onUpdate={handleUpdateItem}
            setFinalState={handleSetFinalStateItem}
          />
        </>
      );
    }

    function renderReady(items) {
      switch (mode) {
        case Mode.WITH_COMPLETE:
          return returnWithCompleteElement(items);
        case Mode.WITHOUT_COMPLETE:
          return returnWithoutCompletedElement(items);
      }
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
          return <UU5.Bricks.Error content="Error happened!" error={errorData.error} errorData={errorData.data} />;
      }
    }

    return (
      <UU5.Bricks.Container style={"padding : 5px"}>
        <ItemProvider>
          {({ state, data, errorData, pendingData, handlerMap }) => {
            createItemRef.current = handlerMap.createItem;
            updateItemRef.current = handlerMap.updateItem;
            deleteItemRef.current = handlerMap.deleteItem;
            setFinalStateItemRef.current = handlerMap.setFinalState;

            switch (state) {
              case "pending":
              case "pendingNoData":
                return renderLoad();
              case "error":
              case "errorNoData":
                return renderError(errorData);
              case "itemPending":
              case "ready":
              case "readyNoData":
              default: {
                return renderReady(data);
              }
            }
          }}
        </ItemProvider>
      </UU5.Bricks.Container>
    );
    //@@viewOff:render
  },
});

export default Items;
