import React from "react";
import PropTypes from "prop-types";
import { convertToRaw } from "draft-js";
import MUIRichTextEditor from "mui-rte";

const RichTextEditor = ({ label, getEditorState, readOnly, data }) => {
  function change(editorState) {
    // We use content of editor state by converting it to object
    if (getEditorState) {
      getEditorState(convertToRaw(editorState.getCurrentContent()));
    }
  }

  return (
    <MUIRichTextEditor
      label={label}
      onChange={change}
      readOnly={readOnly}
      value={data}
      controls={
        readOnly
          ? []
          : [
              "title",
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "highlight",
              "link",
              "numberList",
              "bulletList",
              "quote",
              "undo",
              "redo",
              "clear"
            ]
      }
    />
  );
};

RichTextEditor.propTypes = {
  label: PropTypes.string,
  getEditorState: PropTypes.func.isRequired
};

export default RichTextEditor;
