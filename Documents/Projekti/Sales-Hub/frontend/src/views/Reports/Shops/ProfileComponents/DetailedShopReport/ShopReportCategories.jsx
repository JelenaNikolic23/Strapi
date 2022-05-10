import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "components/Table/Table.jsx";

function ShopReportCategories({ steps = [], name, comment }) {
  // This will be put in the table
  const stepData = steps.map(step => {
    return [
      step.stepName,
      <strong style={{ marginLeft: "1rem" }}>
        {step.stepValue == 0 ? "N/A" : step.stepValue}
      </strong>
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
          {name}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{ marginTop: "-2rem" }}>
          <Table
            tableHeaderColor="primary"
            tableHead={["Korak", "Ocena"]}
            tableData={stepData}
          />
        </ExpansionPanelDetails>
        <ExpansionPanelDetails>
          <div>
            <h3 style={{ color: "#AAAAAA", marginTop: "-1rem" }}>Komentar</h3>
            <p>
              {comment !== ""
                ? comment
                : "Nema dodatnih komentara za ovu kategoriju"}
            </p>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </>
  );
}

ShopReportCategories.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  name: PropTypes.string,
  steps: PropTypes.array,
  comment: PropTypes.string
};

export default ShopReportCategories;
