import React, { Component } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../../../config/backend";
import request_config from "../../../../../helpers/RequestConfig";

import { withStyles } from "@material-ui/core/styles";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LensIcon from "@material-ui/icons/Lens";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import RichTextEditor from "components/RichTextEditor/RichTextEditor.jsx";
import Button from "components/CustomButtons/Button.jsx";

const styles = {
  content: { justifyContent: "space-between", fontWeight: 200 },
  challengeName: { fontWeight: 200, maxWidth: "60%", paddingRight: "5px" },
  details: { justifyContent: "space-between" },
  text: { fontWeight: 200 },
  acceptButtonWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "2rem"
  }
};

class CoachingItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accepted: props.report.accepted
    };
    this.handleAcceptCoaching = this.handleAcceptCoaching.bind(this);
  }

  handleAcceptCoaching(reportId) {
    axios
      .post(
        `${serverip}/api/coachings/updateAccepted`,
        { coaching_id: reportId },
        request_config()
      )
      .then(() => {
        console.log("Coaching updated to accepted.");
        this.setState({ accepted: true });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { classes, report, userId } = this.props;
    const { accepted } = this.state;
    const acceptedTooltip = accepted
      ? "Kouči je prihvatio aktivnosti"
      : "Kouči nije prihvatio aktivnosti";

    return (
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          classes={{
            content: classes.content
          }}
        >
          <Tooltip
            id="tooltip-top"
            title={acceptedTooltip}
            placement="top-start"
          >
            <Typography className={classes.challengeName}>
              {accepted ? (
                <LensIcon
                  style={{
                    color: "green",
                    fontSize: "1rem",
                    marginBottom: "-2px",
                    marginRight: "5px"
                  }}
                />
              ) : (
                <LensIcon
                  style={{
                    color: "#BBB",
                    fontSize: "1rem",
                    marginBottom: "-2px",
                    marginRight: "5px"
                  }}
                />
              )}

              {report.topic}
            </Typography>
          </Tooltip>
          <Typography style={{ fontWeight: 200 }}>
            {report.date.split("T")[0]}
          </Typography>
        </ExpansionPanelSummary>
        <hr />
        <ExpansionPanelDetails
          style={{ paddingBottom: "0" }}
          classes={{
            root: classes.details
          }}
        >
          <Typography>
            Kreirao: <b>{report.evaluator.fullname}</b>
          </Typography>
        </ExpansionPanelDetails>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <h5 style={{ marginLeft: "30px" }}>
              Aktivnosti za unapređenje znanja
            </h5>
            <ExpansionPanelDetails style={{ marginLeft: "10px" }}>
              <RichTextEditor data={report.actionKnowledge} readOnly={true} />
            </ExpansionPanelDetails>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <h5 style={{ marginLeft: "20px" }}>
              Aktivnosti za unapređenje veština
            </h5>
            <ExpansionPanelDetails>
              <RichTextEditor data={report.actionSkills} readOnly={true} />
            </ExpansionPanelDetails>
          </GridItem>
          {!accepted && userId === report.user.frontline_id ? (
            <GridItem xs={12} sm={12} md={12}>
              <div className={classes.acceptButtonWrapper}>
                <Button
                  color="primary"
                  name={report._id}
                  onClick={() => this.handleAcceptCoaching(report._id)}
                >
                  Prihvatam aktivnosti
                </Button>
              </div>
            </GridItem>
          ) : null}
        </GridContainer>
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(CoachingItem);
