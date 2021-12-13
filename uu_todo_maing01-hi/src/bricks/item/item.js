//@@viewOn:imports
import UU5, { Forms } from "uu5g04";
import { createVisualComponent, useState } from "uu5g04-hooks";
import Config from "../config/config";
import Calls from "../../calls";
import { ModalManager, useContextModal } from "../list/modal-manager";
//@@viewOff:imports

const Mode = {
  SHOW: "SHOW",
  MODIFY: "MODIFY",
};

const url = UU5.Common.Url.parse(window.top.location.href);

const Item = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Item",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    item: UU5.PropTypes.shape({
      id: UU5.PropTypes.id,
      text: UU5.PropTypes.string.isRequired,
    }),

    onUpdate: UU5.PropTypes.func,
    onDelete: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    list: null,

    onUpdate: () => {},
    onDelete: () => {},
  },
  //@@viewOff:defaultProps

  render({ item, onDelete, onUpdate, setFinalState }) {
    let data = item;

    const [open, close] = useContextModal();
    const [mode, setMode] = useState(Mode.BUTTON);

    function handleModifyClick() {
      setMode(Mode.MODIFY);
    }

    function handleSave() {
      let dtoIn = {
        id: data.id,
        text: data.text,
        highPriority: data.highPriority,
      };

      onUpdate(dtoIn);
      setMode(Mode.SHOW);
    }

    function handleCancel() {
      setMode(Mode.SHOW);
    }

    //@@viewOn:private
    async function handleDelete() {
      setMode(Mode.SHOW);
      onDelete(data);
    }

    function changeCheckBoxToComplete() {
      data.state = "completed";
      setFinalState(data.id, data.state);
    }

    function confirmModal() {
      open({
        header: (
          <UU5.Bricks.Text style={"font-size: 1em; position:absolute; top:15px; left:225px"}>
            Confirm delete item
          </UU5.Bricks.Text>
        ),
        content: (
          <UU5.Bricks.Container>
            <UU5.Bricks.Div>
              <UU5.Bricks.Text style={"font-size: 1.4em;"}>Do you realy want to delete this items?</UU5.Bricks.Text>
            </UU5.Bricks.Div>
          </UU5.Bricks.Container>
        ),
        footer: (
          <UU5.Bricks.Container style={"padding: 10px ;"}>
            <UU5.Bricks.Button
              size={"l"}
              style={"margin-left: 25%; background-color: transparent;"}
              onClick={() => {
                close();
                setMode(Mode.SHOW);
              }}
            >
              Cancel
            </UU5.Bricks.Button>
            <UU5.Bricks.Button size={"l"} style={"margin-left: 15%; background-color: #ff4747;"} onClick={handleDelete}>
              Delete
            </UU5.Bricks.Button>
          </UU5.Bricks.Container>
        ),
      });
    }

    function renderModify() {
      return (
        <UU5.Bricks.Card>
          <UU5.Forms.Form style={"margin:10px;"}>
            <UU5.Forms.Text
              style={"width: 60%; padding-bottom: 20px;display: inline-block; margin-right: 250px"}
              id={"name"}
              value={data.text}
            />

            <UU5.Bricks.Button style={" background-color: transparent;"} onClick={confirmModal}>
              <UU5.Bricks.Icon icon="mdi-delete" />
            </UU5.Bricks.Button>

            <UU5.Bricks.Button
              style={" background-color: transparent;"}
              onClick={() => {
                data.text = document.getElementById("name-input").value;
                handleSave();
              }}
            >
              <UU5.Bricks.Icon icon="mdi-check" />
            </UU5.Bricks.Button>

            <UU5.Bricks.Button style={" background-color: transparent;"} onClick={handleCancel}>
              <UU5.Bricks.Icon icon="mdi-close" />
            </UU5.Bricks.Button>
          </UU5.Forms.Form>
        </UU5.Bricks.Card>
      );
    }

    function renderShow() {
      if (data.state === "active") {
        return (
          <UU5.Bricks.Card style={"margin: 2px 3px 10px"}>
            <UU5.Forms.Checkbox
              onChange={changeCheckBoxToComplete}
              style={"padding-left:20px; margin-top: 15px;margin-bottom: 10px; display: inline-block; "}
            />
            <UU5.Bricks.Label
              style={" position:absolute; top:20px; left:70px;background-color: transparent; color:black"}
              content={data.text}
            />
            <UU5.Bricks.Button
              style={"position:absolute; top:15px; right:40px; background-color: transparent; "}
              onClick={handleModifyClick}
            >
              <UU5.Bricks.Icon icon="mdi-pencil" />
            </UU5.Bricks.Button>
          </UU5.Bricks.Card>
        );
      } else {
        return (
          <UU5.Bricks.Card style={"margin: 2px 3px 10px; opacity:.6; "}>
            <UU5.Forms.Checkbox
              onChange={changeCheckBoxToComplete}
              value={1}
              style={"padding-left:20px; margin-top: 15px;margin-bottom: 10px; display: inline-block; "}
            />
            <UU5.Bricks.Label
              style={
                "text-decoration: line-through; position:absolute; top:20px; left:70px;background-color: transparent; color:black"
              }
              content={data.text}
            />
            <UU5.Bricks.Button
              style={"position:absolute; top:15px; right:40px; background-color: transparent; "}
              onClick={handleModifyClick}
            >
              <UU5.Bricks.Icon icon="mdi-pencil" />
            </UU5.Bricks.Button>
          </UU5.Bricks.Card>
        );
      }
    }

    //@@viewOff:private

    //@@viewOn:render
    if (!data) {
      return null;
    }

    switch (mode) {
      case Mode.MODIFY:
        return renderModify();
      default:
        return renderShow();
    }

    //@@viewOff:render
  },
});

export default Item;
