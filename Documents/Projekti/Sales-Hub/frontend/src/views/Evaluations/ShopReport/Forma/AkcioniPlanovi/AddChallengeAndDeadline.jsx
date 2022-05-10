import React from "react";
// Components and utilities for date picker
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
// Essential components
import GridItem from "components/Grid/GridItem.jsx";
import TextField from "@material-ui/core/TextField";

export default function AddChallengeAndDeadline({
  challenge,
  setChallenge,
  selectedDate,
  handleDateChange
}) {
  return (
    //<GridContainer>
    <>
      <GridItem xs={12} sm={12} md={8}>
        <TextField
          autoFocus
          value={challenge}
          onChange={function(e) {
            setChallenge(e.target.value);
          }}
          margin="normal"
          label="Kreiraj Izazov"
          placeholder="Kreiraj novi izazov"
          fullWidth
          multiline
        />
      </GridItem>
      <GridItem xs={12} sm={12} md={2}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            margin="normal"
            disablePast
            //variant="inline"
            id="izazov-deadline"
            label="Deadline"
            format="MM/dd/yyyy"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </MuiPickersUtilsProvider>
      </GridItem>
    </>
    //</GridContainer>
  );
}
