import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

// @material-ui/core components
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons
import People from "@material-ui/icons/People";
//core components
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import GridItem from "components/Grid/GridItem.jsx";

// Button
import Favorite from "@material-ui/icons/Favorite";
import Button from "components/CustomButtons/Button.jsx";

export class MojInput extends Component {
  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={7}>
          <CustomInput
            id="regular"
            inputProps={{
              placeholder: "Regular"
            }}
            formControlProps={{
              fullWidth: true
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={7}>
          <CustomInput
            labelText="Success input"
            id="success"
            success
            formControlProps={{
              fullWidth: true
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={7}>
          <Button color="info" round>
            Submit
          </Button>
        </GridItem>
      </GridContainer>
    );
  }
}

export default MojInput;
