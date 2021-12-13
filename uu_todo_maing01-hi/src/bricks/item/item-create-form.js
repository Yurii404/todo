//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "../config/config";
import "uu5g04-forms";
//@@viewOff:imports

const ItemCreateForm = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "ItemCreateForm",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onSubmit: UU5.PropTypes.func,
    onCancel: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onSubmit: () => {},
    onCancel: () => {},
  },
  //@@viewOff:defaultProps

  render({ onSave, onCancel }) {
    //@@viewOn:render
    return (
      <UU5.Forms.Form onSave={onSave} onCancel={onCancel}>
        <UU5.Bricks.Label>Name</UU5.Bricks.Label>
        <UU5.Forms.Text name="text" />
        <UU5.Forms.Controls buttonSubmitProps={{ content: "Create" }} />
      </UU5.Forms.Form>
    );
    //@@viewOff:render
  },
});

export default ItemCreateForm;
