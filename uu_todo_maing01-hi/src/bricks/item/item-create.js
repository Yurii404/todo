//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent, useState } from "uu5g04-hooks";
import Config from "../config/config";
import ItemCreateForm from "./item-create-form.js";
//@@viewOff:imports

const Mode = {
  BUTTON: "BUTTON",
  FORM: "FORM",
};

const ItemCreate = createComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "ItemCreate",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onCreate: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onCreate: () => {},
  },
  //@@viewOff:defaultProps

  render({ onCreate }) {
    //@viewOn:hooks
    const [mode, setMode] = useState(Mode.BUTTON);
    //@viewOff:hooks

    //@@viewOn:private
    function handleAddClick() {
      setMode(Mode.FORM);
    }

    function handleSave(opt) {
      let url = window.top.location.href;

      let id = url.slice(-24);

      let dtoIn = {
        listId: id,
        text: opt.values.text,
      };

      onCreate(dtoIn);
      setMode(Mode.BUTTON);
    }

    function handleCancel() {
      setMode(Mode.BUTTON);
    }
    //@@viewOff:private

    //@@viewOn:render
    function renderButton() {
      return (
        <UU5.Bricks.Button
          onClick={handleAddClick}
          style={"margin-bottom: 15px ;width : 100%"}
          colorSchema="primary"
          content="Add item"
        />
      );
    }

    function renderForm() {
      return <ItemCreateForm onSave={handleSave} onCancel={handleCancel} />;
    }

    switch (mode) {
      case Mode.BUTTON:
        return renderButton();
      default:
        return renderForm();
    }
    //@@viewOff:render
  },
});

export default ItemCreate;
