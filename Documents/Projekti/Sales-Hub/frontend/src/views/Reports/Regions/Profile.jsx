import React, { Component } from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import ProfileHeader from "./ProfileComponents/ProfileHeader.jsx";
import Average5GByShopChart from "./ProfileComponents/Average5GByShopChart.jsx";
import Evaluations5GTable from "./ProfileComponents/Evaluations5GTable.jsx";
import Evaluations7PTable from "./ProfileComponents/Evaluations7PTable.jsx"

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

const styles = {
  ...dashboardStyle,
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  rootPaper: {
    width: "100%",
    overflowX: "auto"
  }
};

class Profile extends Component {
  render() {
    const { classes } = this.props;
    const { region_id } = this.props.match.params;

    return (
      <div>
        <ProfileHeader region_id={region_id} classes={classes} />
        <GridContainer>
          <Average5GByShopChart region_id={region_id} classes={classes} />
          <Evaluations5GTable region_id={region_id} tooltip={classes.tooltip}/>
          <Evaluations7PTable region_id={region_id} tooltip={classes.tooltip}/>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(Profile);
