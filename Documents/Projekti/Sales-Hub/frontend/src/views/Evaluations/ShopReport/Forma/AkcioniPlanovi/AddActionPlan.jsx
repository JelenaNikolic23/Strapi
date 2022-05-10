import React from "react";
// Hook
import useInputState from "./hooks/useInputState";
// Components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Paper from "@material-ui/core/Paper";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import CustomInput from "components/CustomInput/CustomInput.jsx";

function AddActionPlan({ addActionPlan }) {
  const [value, handleChange, reset] = useInputState("");
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Paper
          style={{
            margin: "1rem 0",
            padding: "0 1rem",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <CustomInput
            labelText="Akcioni plan"
            id="akcioni-plan"
            style={{ width: "60%" }}
            formControlProps={{
              //fullWidth: true
              style: {
                width: "100%"
              }
            }}
            inputProps={{
              type: "text",
              name: "username",
              placeholder: "dodaj akcione planove",
              value: value,
              onChange: handleChange,
              onKeyPress: e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addActionPlan(value);
                  reset();
                }
              },

              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={e => {
                      e.preventDefault();
                      addActionPlan(value);
                      reset();
                    }}
                    style={{ color: "green" }}
                  >
                    <Icon>add_circle</Icon>
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Paper>
      </GridItem>
    </GridContainer>
  );
}

export default AddActionPlan;
