import React from "react";

import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import Table from "components/Table/Table.jsx";

const styles = {
  content: { justifyContent: "space-between", fontWeight: 200 },
  challengeName: { fontWeight: 200, maxWidth: "80%", paddingRight: "5px" },
  details: { justifyContent: "space-between" },
  text: { fontWeight: 200 }
};

function ChallengesList(props) {
  const { classes, challenge } = props;

  const actionsData = challenge.actions.map(action => {
    return [
      <Checkbox checked={action.completed} color="primary" />,
      action.task
    ];
  });

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
        <Typography className={classes.challengeName}>
          {challenge.challenge}
        </Typography>
        <Typography style={{ color: challenge.resolved ? "green" : "red" }}>
          {challenge.resolved ? "Rešen" : "Nije Rešen"}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        classes={{
          root: classes.details
        }}
      >
        <Typography className={classes.text}>
          Kreirao:
          <br />
          {challenge.creator.fullname}
        </Typography>
        <Typography className={classes.text}>
          {" "}
          Rok:
          <br />
          {challenge.deadline.split("T")[0]}
        </Typography>
      </ExpansionPanelDetails>
      <ExpansionPanelDetails style={{ marginTop: "-2rem" }}>
        <Table
          tableHeaderColor="primary"
          tableHead={["Status", "Akcije za rešavanje izazova"]}
          tableData={actionsData}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default withStyles(styles)(ChallengesList);
