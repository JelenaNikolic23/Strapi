import React, { Component } from "react";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
// Shop Profile Components
import ProfileHeader from "./ProfileComponents/ProfileHeader.jsx";
import Average5GByUserChart from "./ProfileComponents/Average5GByUserChart.jsx";
import Evaluations5GTable from "./ProfileComponents/Evaluations5GTable.jsx";
import Evaluations7PTable from "./ProfileComponents/Evaluations7PTable"
import ShopReportsList from "./ProfileComponents/ShopReportsList.jsx";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

export class Profile extends Component {
  render() {
    const { classes } = this.props;
    const shop_id = this.props.match.params.shop_id;

    return (
      <>
        <ProfileHeader shop_id={shop_id} classes={classes} />
        <GridContainer>
          <Average5GByUserChart shop_id={shop_id} classes={classes} />
          <Evaluations5GTable shop_id={shop_id} tooltip={classes.tooltip} />
          <Evaluations7PTable shop_id={shop_id} tooltip={classes.tooltip} />
          <ShopReportsList shop_id={shop_id} />
        </GridContainer>
      </>
    );
  }
}

export default withStyles(dashboardStyle)(Profile);
