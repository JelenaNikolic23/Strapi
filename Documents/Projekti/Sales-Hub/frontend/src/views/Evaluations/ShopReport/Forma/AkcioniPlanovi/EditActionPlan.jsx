import React from "react";
// Hook
import useInputState from "./hooks/useInputState";
// Components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";

function EditActionPlan({ id, task, toggleEditForm, editActionPlan }) {
  const [value, handleChange, reset] = useInputState(task);
  return (
    <CustomInput
      labelText="Akcioni plan"
      id="akcioni-plan"
      style={{ marginBottom: "1rem" }}
      formControlProps={{
        fullWidth: true,
        style: {
          marginBottom: "2rem"
        }
      }}
      inputProps={{
        margin: "dense",
        type: "text",
        name: "akcioni plan",
        autoFocus: true,
        value: value,
        onChange: handleChange,
        onKeyPress: e => {
          if (e.key === "Enter") {
            e.preventDefault();
            editActionPlan(id, value);
            reset();
            toggleEditForm();
          }
        },

        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={e => {
                e.preventDefault();
                editActionPlan(id, value);
                reset();
                toggleEditForm();
              }}
              style={{ color: "green" }}
            >
              <Icon>add_circle</Icon>
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
}

export default EditActionPlan;
