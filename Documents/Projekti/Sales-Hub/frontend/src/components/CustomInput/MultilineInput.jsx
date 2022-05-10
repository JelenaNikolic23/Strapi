import React from "react";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import InputLabel from "@material-ui/core/InputLabel";

const MultilineInput = ({
  name,
  label,
  mandatory,
  placeholder,
  inputValue,
  handleInputChange,
}) => {
  return (
    <GridContainer>
      <GridItem xs={ 12 } sm={ 12 } md={ 12 }>
        <InputLabel>
          <h5 style={ { color: "#AAAAAA", marginRight: "5px" } }>
            { label }
            { "  " }
            { mandatory && (
              <span style={ { color: "red", fontSize: "0.80rem" } }>
                &nbsp;&nbsp; * obavezno
              </span>
            ) }
          </h5>
        </InputLabel>
        <CustomInput
          id="evaluation-input"
          formControlProps={ {
            fullWidth: true,
          } }
          inputProps={ {
            name: name ? name : "feedback",
            placeholder: placeholder,
            value: inputValue,
            onChange: handleInputChange,
            multiline: true,
            rows: 5,
          } }
        />
      </GridItem>
    </GridContainer>
  );
};

export default MultilineInput;
