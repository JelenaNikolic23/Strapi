import React from "react";
import CardHeader from "components/Card/CardHeader.jsx";
import GridItem from "components/Grid/GridItem.jsx";

// Date Picker Utils
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    "& label.Mui-focused": {
      color: "white"
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "white"
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: "white"
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "white"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white"
      },
      "&:hover fieldset": {
        borderColor: "white"
      },
      "&.Mui-focused fieldset": {
        borderColor: "white"
      }
    }
  }
});

function CardHeaderPicker({ title, submitDates, dateFrom, dateTo }) {
  const classes = useStyles();

  const dateNow = new Date();
  const [selectedDateFrom, setSelectedDateFrom] = React.useState(
    dateFrom !== undefined ? dateFrom : dateNow.setMonth(dateNow.getMonth() - 1)
  );
  const [selectedDateTo, setSelectedDateTo] = React.useState(
    dateTo !== undefined ? dateTo : new Date()
  );

  const handleDate = () => {
    let dateFrom = selectedDateFrom;
    let dateTo = selectedDateTo.toISOString();

    submitDates(dateFrom, dateTo);
  };

  const handleDateChangeFrom = date => {
    setSelectedDateFrom(date);
  };

  const handleDateChangeTo = date => {
    setSelectedDateTo(date);
  };

  return (
    <CardHeader color="primary">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container>
          <GridItem xs={12} sm={12} md={4}>
            <h4>{title}</h4>
          </GridItem>
          <GridItem xs={5} sm={12} md={3}>
            <DatePicker
              classes={{
                root: classes.root,
                underline: classes.underline
              }}
              inputProps={{
                style: {
                  fontFamily: "Arial",
                  color: "white",
                  underline: "white"
                }
              }}
              InputLabelProps={{
                style: { fontFamily: "Arial", color: "white" }
              }}
              format="yyyy-MM-dd"
              margin="normal"
              id="date-picker-from"
              label="od"
              value={selectedDateFrom}
              onChange={handleDateChangeFrom}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </GridItem>
          <GridItem xs={5} sm={12} md={3}>
            <DatePicker
              classes={{
                root: classes.root
              }}
              inputProps={{ style: { fontFamily: "Arial", color: "white" } }}
              InputLabelProps={{
                style: { fontFamily: "Arial", color: "white" }
              }}
              format="yyyy-MM-dd"
              margin="normal"
              id="date-picker-to"
              label="do"
              value={selectedDateTo}
              onChange={handleDateChangeTo}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </GridItem>
          <GridItem xs={4} sm={4} md={2}>
            <Button
              size="small"
              color="primary"
              onClick={handleDate}
              style={{
                color: "#fff",
                textAlign: "center",
                marginTop: "24px",
                border: "1px solid #FFF",
                fontSize: "12px"
              }}
            >
              Pretraži
            </Button>
          </GridItem>
        </Grid>
      </MuiPickersUtilsProvider>
    </CardHeader>
  );
}

export default CardHeaderPicker;
