import React from "react";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Autocomplete from "components/Autocomplete/Autocomplete.jsx";
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Search from "@material-ui/icons/Search";

const useStyles = makeStyles(theme => ({
  cardHeader: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
}));

const CardHeaderSearch = ({
  title,
  searchItems,
  selectItem,
  selectedItemName,
  searchPlaceholder,
}) => {
  const classes = useStyles();

  return (
    <CardHeader color="primary" className={classes.cardHeader}>
      <h4 className={classes.cardTitleWhite}>{title}</h4>
      <GridContainer
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <GridItem
          xs={12}
          sm={12}
          md={12}
          style={{
            display: "flex",
            alignItems: "flex-end",
            marginBottom: "-10px",
            marginTop: "15px",
          }}
        >
          <div
            className={classes.searchWrapper}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Autocomplete
              searchItems={searchItems}
              selectedItemHandler={selectItem}
              selectedItem={selectedItemName}
              placeholder={searchPlaceholder}
            />
            <Button color="white" aria-label="edit" justIcon round>
              <Search />
            </Button>
          </div>
        </GridItem>
      </GridContainer>
    </CardHeader>
  );
};

export default CardHeaderSearch;
