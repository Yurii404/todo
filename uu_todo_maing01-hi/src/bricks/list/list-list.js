//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "../config/config";
import List from "./list";
import { ModalManager } from "./modal-manager";
//@@viewOff:imports

const ListList = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "ListList",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    lists: UU5.PropTypes.array.isRequired,
    onCreate: UU5.PropTypes.func,
    onUpdate: UU5.PropTypes.func,
    onDelete: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    lists: [],
    onCreate: () => {},
    onUpdate: () => {},
    onDelete: () => {}
  },
  //@@viewOff:defaultProps


  render({ lists,  onUpdate, onDelete }) {
    //@@viewOn:render
    if (lists.length === 0) {
      return <UU5.Common.Error content="No lists!" />;
    }


    //          // items={[{ id: "lists", href: "lists", content: <Home /> }]}
    return (
      <div>
        {lists.map(list => {
          return(
          <ModalManager>
          <List
            key={list.id}
            list={list}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
          </ModalManager>
        )})}
      </div>
    );
    //@@viewOff:render
  }
});

export default ListList;
