import React from "react";
import { NavLink } from "react-router-dom";

// nodejs library to set properties for components
//import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";

import navigationCards from "../../assets/jss/material-dashboard-react/views/navigationCards.jsx";

import routes from "routes.js";

class Reports extends React.Component {
  render() {
    const { classes } = this.props;
    const elearningrole = JSON.parse(localStorage.getItem("elearningrole"));
    const frontLineNestDepth = JSON.parse(
      localStorage.getItem("frontline_groups")
    );

    const nestDepth = frontLineNestDepth[0].nest_depth;

    const cardLinks = routes.map((prop, key) => {
      if (prop.category === "reports") {
        if (prop.name === "Regioni" && nestDepth === 3 && elearningrole === 2) {
          return false;
        } else {
          return (
            <GridItem xs={6} sm={6} md={4} key={key}>
              <NavLink to={prop.layout + prop.path}>
                <Card
                  className={classes.card}
                  style={{ backgroundImage: prop.backgroundImage }}
                >
                  <div className={classes.titleDiv}>
                    <h6 style={{ color: "#fff", fontWeight: "bold" }}>
                      {prop.name}
                    </h6>
                  </div>
                </Card>
              </NavLink>
            </GridItem>
          );
        }
      } else {
        return null;
      }
    });
    return (
      <div>
        <GridContainer>{cardLinks}</GridContainer>
      </div>
    );
  }
}

export default withStyles(navigationCards)(Reports);
