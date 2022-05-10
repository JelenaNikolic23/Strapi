import React, { useState } from "react";

import EditActionPlan from "./EditActionPlan.jsx";
// Core components
import GridItem from "components/Grid/GridItem.jsx";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

function ActionPlanTask({ id, task, removeActionPlan, editActionPlan }) {
  // State based on the edit button
  const [isEditing, toggle] = useState(false);
  return (
    <ListItem style={{ minHeight: "4rem" }}>
      {isEditing ? (
        <EditActionPlan
          editActionPlan={editActionPlan}
          id={task}
          task={task}
          toggleEditForm={toggle}
        />
      ) : (
        <>
          <GridItem xs={12} sm={12} md={12}>
            <ListItemText>{task}</ListItemText>
          </GridItem>
          <GridItem xs={12} sm={12} md={2}>
            <ListItemSecondaryAction>
              <IconButton
                aria-label="Delete"
                onClick={() => removeActionPlan(id)}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton aria-label="Edit" onClick={toggle}>
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </GridItem>
          {/* </GridContainer> */}
        </>
      )}
    </ListItem>
  );
}

export default ActionPlanTask;
