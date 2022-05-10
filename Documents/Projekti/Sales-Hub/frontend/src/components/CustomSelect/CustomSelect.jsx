import React from "react";
import PropTypes from "prop-types";
// material-ui components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import styles from "assets/jss/material-dashboard-react/customSelectStyle.jsx";

class CustomSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: "",
      multipleSelect: []
    };
  }
  handleSimple = event => {
    this.setState({ [event.target.name]: event.target.value });
    this.props.getValue(event.target.value);
  };
  handleMultiple = event => {
    this.setState({ multipleSelect: event.target.value });
  };
  render() {
    const { classes, items, title } = this.props;
    // Loop to create selectable MenuItems for given values
    const menuItems = items.map(item => {
      return (
        <MenuItem
          classes={{
            root: classes.selectMenuItem,
            selected: classes.selectMenuItemSelected
          }}
          value={item}
          key={item}
        >
          {item}
        </MenuItem>
      );
    });

    return (
      <FormControl fullWidth className={classes.selectFormControl}>
        <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
          {title}
        </InputLabel>
        <Select
          MenuProps={{}}
          classes={{}}
          value={this.state.selectValue}
          onChange={this.handleSimple}
          inputProps={{
            name: "selectValue",
            id: "select-value"
          }}
        >
          <MenuItem
            disabled
            classes={{
              root: classes.selectMenuItem
            }}
          >
            {title}
          </MenuItem>
          {menuItems}
        </Select>
      </FormControl>
    );
  }
}

CustomSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  getValue: PropTypes.func.isRequired
};

export default withStyles(styles)(CustomSelect);
