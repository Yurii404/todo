//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "../config/config";
import Item from "./item";
import { ModalManager } from "../list/modal-manager";
//@@viewOff:imports

const ItemList = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "ItemList",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    items: UU5.PropTypes.array.isRequired,
    onCreate: UU5.PropTypes.func,
    onUpdate: UU5.PropTypes.func,
    onDelete: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    items: [],
    onCreate: () => {},
    onUpdate: () => {},
    onDelete: () => {}
  },
  //@@viewOff:defaultProps

  render({ items,  onUpdate, onDelete, setFinalState }) {
    //@@viewOn:render
    if (items.length === 0) {
      return <UU5.Common.Error content="No items!" />;
    }


    return (
      <div>
        {items.map(item => {
          // if(item.data.state ==="active"){
          return(
          <ModalManager>
          <Item
            key={item.data.id}
            item={item.data}
            onUpdate={onUpdate}
            onDelete={onDelete}
            setFinalState={setFinalState}
          />
          </ModalManager>
        )
        // }
        })}
      </div>
    );
    //@@viewOff:render
  }
});

export default ItemList;
