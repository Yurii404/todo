//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useRef } from "uu5g04-hooks";
import Config from "./config/config";
import ListList from "../bricks/list/list-list";
import ListProvider from "../bricks/list/list-provider";
import ListCreate from "../bricks/list/list-create";

//@@viewOff:imports

const Items = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Jokes",
  //@@viewOff:statics

  render() {
    //@@viewOn:hooks

    //@viewOff:hooks

    //@@viewOn:private




    //@@viewOff:private

    //@@viewOn:render
    function renderLoad() {
      return <UU5.Bricks.Loading />;
    }

    function renderReady(lists) {
      return (
        <>
          {/*<ListCreate onCreate={handleCreateJoke} />*/}
          {/*<ListList lists={lists} onDelete={handleDeleteJoke} onUpdate={handleUpdateJoke} />*/}
          {/*<UU5.Briks.Text>Welcome to Items</UU5.Briks.Text>*/}
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
      <UU5.Bricks.Container >
        <UU5.Bricks.Text>Welcome to Items</UU5.Bricks.Text>
      </UU5.Bricks.Container>
    );
    //@@viewOff:render
  }
});

export default Items;
