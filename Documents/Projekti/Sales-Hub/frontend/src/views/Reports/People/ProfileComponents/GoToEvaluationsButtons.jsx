import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles({
  container: {
    fontWeight: "500",
    height: 48,
    display: "flex",
    justifyContent: "center"
  },
  buttonGroup: {
    width: "20%",
    height: 48,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center"
  },
  button: {
    margin: "0 10px",
    border: "1.5px solid rgba(0, 0, 0, 0.54)",
    color: "rgba(0, 0, 0, 0.54)",
    width: "20px",
    height: "20px",
    borderRadius: "3px",
    padding: "3px",
    cursor: "pointer",
    "&:hover": {
      background: "rgba(0, 0, 0, 0.33)",
      color: "white"
    }
  }
});

const GoToEvaluationsButtons = props => {
  const classes = useStyles();
  const elearningRole = localStorage.getItem("elearningrole");

  const setSelectedUser = () => {
    localStorage.setItem("selectedUser", JSON.stringify(props.user));
  };
  // If elearningRole is greater then 1 we will return buttons else return nothing
  return elearningRole > 1 ? (
    <div className={classes.container}>
      <div className={classes.buttonGroup}>
        <Tooltip title="5G Evaluacija" placement="top">
          <Link
            to="/admin/evaluations/5G"
            className={classes.button}
            onClick={setSelectedUser}
          >
            5G
          </Link>
        </Tooltip>
        <Tooltip title="Feedback" placement="top">
          <Link
            to="/admin/evaluations/Feedback"
            className={classes.button}
            onClick={setSelectedUser}
          >
            Fb
          </Link>
        </Tooltip>
        <Tooltip title="Coaching" placement="top">
          <Link
            to="/admin/evaluations/Coaching"
            className={classes.button}
            onClick={setSelectedUser}
          >
            Ch
          </Link>
        </Tooltip>
      </div>
    </div>
  ) : null;
};

export default GoToEvaluationsButtons;
