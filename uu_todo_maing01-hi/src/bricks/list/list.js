//@@viewOn:imports
import UU5, { Forms } from "uu5g04";
import { createVisualComponent, useState } from "uu5g04-hooks";
import Config from "../config/config";
import Calls from "../../calls";
import { ModalManager, useContextModal } from "./modal-manager";

//@@viewOff:imports

const Mode = {
  SHOW: "SHOW",
  MODIFY: "MODIFY",
};

const url = location.protocol + "//" + location.host + UU5.Environment.getAppBasePath();

const List = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "List",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    list: UU5.PropTypes.shape({
      id: UU5.PropTypes.id,
      name: UU5.PropTypes.string.isRequired,
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

  render({ list, onDelete, onUpdate }) {
    let { data } = list;

    const [open, close] = useContextModal();
    const [mode, setMode] = useState(Mode.BUTTON);

    function handleModifyClick() {
      setMode(Mode.MODIFY);
    }

    function handleSave() {
      console.log(data);
      onUpdate(data);
      setMode(Mode.SHOW);
    }

    function handleCancel() {
      setMode(Mode.SHOW);
    }

    //@@viewOn:private
    async function handleDelete() {
      setMode(Mode.SHOW);
      onDelete(data);
      UU5.Environment.setRoute({
        url: { useCase: "" },
      });
    }

    function changeUrl() {
      UU5.Environment.setRoute({
        url: { useCase: "list", parameters: { listId: data.id } },
      });
    }

    function confirmModal() {
      open({
        header: (
          <UU5.Bricks.Text style={"font-size: 1em; position:absolute; top:15px; left:225px"}>
            Confirm delete list
          </UU5.Bricks.Text>
        ),
        content: (
          <UU5.Bricks.Container>
            <UU5.Bricks.Div>
              <UU5.Bricks.Text style={"font-size: 1.4em;"}>
                Do you realy want to delete this list and all his items?
              </UU5.Bricks.Text>
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
              value={data.name}
            />

            <UU5.Bricks.Button style={" background-color: transparent;"} onClick={confirmModal}>
              <UU5.Bricks.Icon icon="mdi-delete" />
            </UU5.Bricks.Button>

            <UU5.Bricks.Button
              style={" background-color: transparent;"}
              onClick={() => {
                data.name = document.getElementById("name-input").value;
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
      return (
        <UU5.Bricks.Card>
          <UU5.Bricks.Label
            onClick={changeUrl}
            style={"margin : 20px; background-color: transparent; color:black"}
            content={data.name}
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

export default List;
