import React, { Component } from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";

import dashboardStyle from "../../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

import ProfileHeader from "./ProfileComponents/ProfileHeader";
import Avg5GChartByMonth from "./ProfileComponents/Avg5GChartByMonth";
import WorstSteps5GChart from "./ProfileComponents/WorstSteps5GChart";
import Evaluations5GTable from "./ProfileComponents/Evaluations5GTable.jsx";
import Evaluations7PTable from "./ProfileComponents/Evaluations7PTable.jsx";
import Feedbacks from "./ProfileComponents/Feedback/Feedbacks";
import CoachingReport from "./ProfileComponents/Coaching/CoachingReport.jsx";

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
  }
};

export class Profile extends Component {
  render() {
    const { frontline_id } = this.props.match.params;
    const { classes } = this.props;
    return (
      <div>
        <ProfileHeader classes={classes} frontline_id={frontline_id} />
        <GridContainer>
          <Avg5GChartByMonth classes={classes} frontline_id={frontline_id} />
          <WorstSteps5GChart classes={classes} frontline_id={frontline_id} />
          <Evaluations5GTable
            frontline_id={frontline_id}
            tooltip={classes.tooltip}
          />
           <Evaluations7PTable
            frontline_id={frontline_id}
            tooltip={classes.tooltip}
          />
          <Feedbacks frontline_id={frontline_id} />
          <CoachingReport frontline_id={frontline_id} />
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(styles)(Profile);
