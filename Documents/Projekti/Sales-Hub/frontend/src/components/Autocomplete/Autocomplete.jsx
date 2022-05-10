import React, { Component } from "react";
import Downshift from "downshift";
import Paper from "@material-ui/core/Paper";

// @material-ui/core components
import Input from "@material-ui/core/Input";
import withStyles from "@material-ui/core/styles/withStyles";
// AutoComplete component jss styles
import autocompleteStyle from "../../assets/jss/material-dashboard-react/components/autocompleteStyle.jsx";

class Autocomplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      inputValue: ""
    };

    this.getItems = this.getItems.bind(this);
    this.selectItem = this.selectItem.bind(this);
  }

  componentDidUpdate(prevProps) {
    // Check if value of prop has changed and then set state with value of that prop
    if (this.props.selectedItem !== prevProps.selectedItem) {
      this.setState({ inputValue: this.props.selectedItem });
    }
  }

  getItems() {
    return this.props.searchItems;
  }

  selectItem(selectedItem) {
    if (selectedItem.fullname) {
      this.props.selectedItemHandler(selectedItem); // set parent state with selected item data
      this.setState({ inputValue: selectedItem.fullname }); // set full name of selected item
    } else {
      this.setState({ inputValue: selectedItem.target.value });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Downshift
          onChange={selection => {
            document.getElementById("search_input").innerText =
              selection.fullname;
            return this.selectItem(selection);
          }}
          itemToString={item => (item ? item.fullname : "")}
        >
          {({
            getInputProps,
            getItemProps,
            getLabelProps,
            getMenuProps,
            isOpen,
            inputValue,
            highlightedIndex,
            selectedItem
          }) => (
            <div>
              {/* <label {...getLabelProps()}>Prodajno mesto</label> */}
              <Input
                {...getInputProps({
                  placeholder: this.props.placeholder,
                  value: this.state.inputValue,
                  onChange: this.selectItem,
                  id: "search_input",
                  style: {
                    color: "white"
                  }
                })}
                classes={{
                  underline: classes.underline
                }}
              />
              <ul
                style={{
                  listStyle: "none",
                  marginLeft: "-38px",
                  width: "70px",
                  position: "absolute",
                  zIndex: 1
                }}
                {...getMenuProps()}
              >
                {isOpen ? (
                  <Paper className={classes.paper}>
                    {this.getItems()
                      .filter(
                        item =>
                          !inputValue ||
                          item.fullname
                            .toLowerCase()
                            .includes(inputValue.toLowerCase()) ||
                          (item.hasOwnProperty("group_name") &&
                            item.group_name
                              .toLowerCase()
                              .includes(inputValue.toLowerCase()))
                      )
                      .map((item, index) => (
                        <li
                          {...getItemProps({
                            key: item.id,
                            index,
                            item,
                            className: classes.menuItem
                          })}
                        >
                          {item.hasOwnProperty("group_name")
                            ? item.fullname + " (" + item.group_name + ")"
                            : item.fullname}
                        </li>
                      ))}
                  </Paper>
                ) : null}
              </ul>
            </div>
          )}
        </Downshift>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            flexWrap: "wrap"
          }}
        />
      </div>
    );
  }
}

export default withStyles(autocompleteStyle)(Autocomplete);
