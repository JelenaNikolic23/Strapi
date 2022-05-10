import React from "react";
import { Link } from "react-router-dom";
// nodejs library to set properties for components
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "components/Table/Table.jsx";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));

function ProdajniPristupCategory({ steps = [], evaluation5G = [] }) {
  const classes = useStyles();

  // This will be put in the table first table
  const evaluationData = evaluation5G.map(item => {
    return [
      item.fullname,
      <strong style={{ marginLeft: "1rem" }}>{item.score}</strong>,
      <Link to={`/admin/reports/people/${item.userId}/${item.id}`}>
        Prikaži
      </Link>
    ];
  });

  // This will be put in the table second table
  const stepData = steps.map(step => {
    return [
      step.stepName,
      <strong style={{ marginLeft: "1rem" }}>{step.stepValue}</strong>
    ];
  });

  return (
    <>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          Prodajni Pristup
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ marginTop: "-2rem" }}>
          <div>
            <h6 style={{ color: "#AAAAAA", marginBottom: "-1rem" }}>
              5G Evaluacija
            </h6>
            <Table
              className={classes.root}
              tableHeaderColor="primary"
              tableHead={["Prodavac", "Ocena", "Detaljnije"]}
              tableData={evaluationData}
            />
          </div>
        </ExpansionPanelDetails>
        <ExpansionPanelDetails>
          <Table
            tableHeaderColor="primary"
            tableHead={["Korak", "Ocena"]}
            tableData={stepData}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </>
  );
}

ProdajniPristupCategory.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  steps: PropTypes.array,
  evaluation5G: PropTypes.array
};

export default ProdajniPristupCategory;
