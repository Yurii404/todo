//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useRef } from "uu5g04-hooks";
import Config from "./config/config";
import ListList from "../bricks/list/list-list";
import ListProvider from "../bricks/list/list-provider";
import ListCreate from "../bricks/list/list-create";

//@@viewOff:imports

const Home = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Jokes",
  //@@viewOff:statics

  render() {
    //@@viewOn:hooks
    const createListRef = useRef();
    const updateListRef = useRef();
    const deleteListRef = useRef();
    //@viewOff:hooks

    //@@viewOn:private
    function showError(content) {
      UU5.Environment.getPage()
        .getAlertBus()
        .addAlert({
          content,
          colorSchema: "red"
        });
    }

    async function handleCreateJoke(list) {
      try {
        await createListRef.current(list);
      } catch {
        showError(`Creation of ${list.name} failed!`);
      }
    }

    /* eslint no-unused-vars: "off" */
    async function handleUpdateJoke(list) {
      try {
        await updateListRef.current(list);
      } catch {
        showError(`Update of ${list.name} failed!`);
      }
    }

    async function handleDeleteJoke(list) {
      try {
        await deleteListRef.current({ id: list.id, forceDelete:true });
      } catch {
        showError(`Deletion of ${list.name} failed!`);
      }
    }
    //@@viewOff:private

    //@@viewOn:render
    function renderLoad() {
      return <UU5.Bricks.Loading />;
    }

    function renderReady(lists) {
      return (
        <>
          <ListCreate  onCreate={handleCreateJoke} />
          <ListList lists={lists} onDelete={handleDeleteJoke} onUpdate={handleUpdateJoke} />
        </>
      );
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
        <ListProvider >
          {({ state, data, errorData, pendingData, handlerMap }) => {
            createListRef.current = handlerMap.createList;
            updateListRef.current = handlerMap.updateList;
            deleteListRef.current = handlerMap.deleteList;

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
              default:
                return renderReady(data);
            }
          }}
        </ListProvider>
      </UU5.Bricks.Container>
    );
    //@@viewOff:render
  }
});

export default Home;
