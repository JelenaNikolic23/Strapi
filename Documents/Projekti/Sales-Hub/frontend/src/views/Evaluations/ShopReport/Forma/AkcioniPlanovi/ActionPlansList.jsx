import React from "react";

import ActionPlanTask from "./ActionPlanTask.jsx";

import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";

export default function ActionPlansList({
  actionPlans,
  removeActionPlan,
  editActionPlan
}) {
  // If there are action plans we will loop them and display them
  if (actionPlans.length)
    return (
      <Paper>
        <List>
          {actionPlans.map((action, i) => {
            return (
              <div key={action.task}>
                <ActionPlanTask
                  id={action.task}
                  task={action.task}
                  key={action.task}
                  removeActionPlan={removeActionPlan}
                  editActionPlan={editActionPlan}
                />
                {i < actionPlans.length - 1 && <Divider />}
              </div>
            );
          })}
        </List>
      </Paper>
    );
  return null;
}
