import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import axios from "axios";
import { backend_address as serverip } from "../../config/backend";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
// @material-ui/icons
import Check from "@material-ui/icons/Check";
// core components
import tasksStyle from "assets/jss/material-dashboard-react/components/tasksStyle.jsx";

class ActionPlansTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actions: this.props.actions
    };
  }

  toggleAction = actionId => {
    const updatedAction = this.state.actions.map(action =>
      action._id === actionId
        ? { ...action, completed: !action.completed }
        : action
    );

    this.setState({ actions: updatedAction });
  };

  updateAction = action => e => {
    const token = localStorage.getItem("token");
    const request_config = {
      headers: {
        Authorization: "Bearer " + token
      }
    };

    const actionPlans = {
      challengeId: this.props.challengeId,
      actionId: action._id,
      completedAction: !action.completed
    };

    // Axios post request - update Action to true
    axios
      .post(
        `${serverip}/api/actionPlans/updateActionCompleted`,
        actionPlans,
        request_config
      )
      .then(updatedAction => {
        console.log(updatedAction.data);
        this.toggleAction(action._id);
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    const {
      classes,
      rtlActive,
      tableHead,
      tableHeaderColor,
      challengeId
    } = this.props;
    const tableCellClasses = classnames(classes.tableCell, {
      [classes.tableCellRTL]: rtlActive
    });

    return (
      <Table className={classes.table}>
        {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    <b>{prop}</b>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
        <TableBody>
          {this.state.actions.map(action =>
            action.completed ? (
              <TableRow
                key={action._id}
                className={classes.tableRow}
                style={{ textDecoration: "line-through" }}
              >
                <TableCell className={tableCellClasses}>
                  <Checkbox
                    action={action}
                    challengeId={challengeId}
                    checked={action.completed}
                    value={action.completed}
                    tabIndex={-1}
                    onClick={this.updateAction(action)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.root
                    }}
                  />
                </TableCell>
                <TableCell className={tableCellClasses}>
                  {action.task}
                </TableCell>
              </TableRow>
            ) : (
              <TableRow
                key={action._id}
                className={classes.tableRow}
                style={{ textDecoration: "none" }}
              >
                <TableCell className={tableCellClasses}>
                  <Checkbox
                    checked={action.completed}
                    tabIndex={-1}
                    onClick={this.updateAction(action)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.root
                    }}
                  />
                </TableCell>
                <TableCell className={tableCellClasses}>
                  {action.task}
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    );
  }
}

ActionPlansTable.propTypes = {
  classes: PropTypes.object.isRequired,
  tasksIndexes: PropTypes.arrayOf(PropTypes.number),
  tasks: PropTypes.arrayOf(PropTypes.node),
  rtlActive: PropTypes.bool
};

export default withStyles(tasksStyle)(ActionPlansTable);
