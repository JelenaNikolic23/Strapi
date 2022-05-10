import React, { useEffect } from "react";

// Matarial UI Core Components
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ArrowDown from "@material-ui/icons/KeyboardArrowDown";
import ArrowUp from "@material-ui/icons/KeyboardArrowUp";

// Category Component
import CategoryData from "./Kategorije/CategoryData.jsx";
import ProdajniPristup from "./ProdajniPristup/ProdajniPristup.jsx";
import FormSubmit from "./FormSubmit.jsx";

// Shop report data
import {
  ShopPerformans,
  // ProdajniPristupCategory,
  ManagementOsoblja,
  MerchAndShopLayout,
  AdministrativniPoslovi
} from "./ShopReportData";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginLeft: "-1rem"
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actionsContainer: {
    marginBottom: theme.spacing(2)
  },
  resetContainer: {
    padding: theme.spacing(3)
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(-1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  completed: {
    display: "inline-block"
  }
}));

function getSteps() {
  return [
    "Shop Performans",
    "Prodajni Pristup - 5G",
    "Management Osoblja",
    "Merch & Shop Layout",
    "Administrativni Poslovi"
  ];
}

export default function StepperForm(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(-1);
  const [completed, setCompleted] = React.useState({});
  const [disabled, setDisabled] = React.useState(true);

  const steps = getSteps();

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <CategoryData
            kategorija={props.kategorije.ShopPerformans}
            handleChange={props.handleChange}
            data={ShopPerformans}
          />
        );
      case 1:
        return (
          <ProdajniPristup
            kategorija={props.kategorije.ProdajniPristup}
            handleChange={props.handleChange}
          />
        );
      case 2:
        return (
          <CategoryData
            kategorija={props.kategorije.ManagementOsoblja}
            handleChange={props.handleChange}
            data={ManagementOsoblja}
          />
        );
      case 3:
        return (
          <CategoryData
            kategorija={props.kategorije.MerchAndShopLayout}
            handleChange={props.handleChange}
            data={MerchAndShopLayout}
          />
        );
      case 4:
        return (
          <CategoryData
            kategorija={props.kategorije.AdministrativniPoslovi}
            handleChange={props.handleChange}
            data={AdministrativniPoslovi}
          />
        );
      default:
        return "Unknown step";
    }
  }

  useEffect(() => {
    if (props.kategorije.selectedShop.fullname) {
      setDisabled(false);
    }
  }, [props.kategorije.selectedShop]);

  useEffect(() => {
    if (localStorage.getItem("CompletedSteps") !== null) {
      setCompleted(JSON.parse(localStorage.getItem("CompletedSteps")));
    }
  }, []);

  function totalSteps() {
    return steps.length;
  }

  function completedSteps() {
    return Object.keys(completed).length;
  }

  function isLastStep() {
    return activeStep === totalSteps() - 1;
  }

  function allStepsCompleted() {
    return completedSteps() === totalSteps();
  }

  function handleNext() {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
    // Saving completed steps to local storage to persist progress if page refresh happens
    localStorage.setItem("CompletedSteps", JSON.stringify(completed));
    props.scrollToTop();
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
    props.scrollToTop();
  }

  const handleStep = step => () => {
    setActiveStep(step);
  };

  function handleComplete() {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  }

  // function handleReset() {
  //   setActiveStep(0);
  //   setCompleted({});
  // }

  return (
    <div className={classes.root}>
      <Stepper nonLinear activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            {activeStep !== index ? (
              <StepButton
                onClick={handleStep(index)}
                completed={completed[index]}
                disabled={disabled}
              >
                {label}
                <ArrowDown className={classes.rightIcon} />
              </StepButton>
            ) : (
              <StepButton
                onClick={() => setActiveStep(-1)}
                completed={completed[index]}
                disabled={disabled}
              >
                {label}
                <ArrowUp className={classes.rightIcon} />
              </StepButton>
            )}
            )}
            <StepContent>
              {/* <div>
                {allStepsCompleted() ? (
                  <div>
                    <Typography
                      component={"span"}
                      className={classes.instructions}
                    >
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Button onClick={handleReset}>Reset</Button>
                  </div>
                ) : ( */}
              <div>
                <Typography component={"span"} className={classes.instructions}>
                  {/* <div className={classes.instructions}> */}
                  {getStepContent(activeStep)}
                  {/* </div> */}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    flexWrap: "wrap"
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={() => handleBack()}
                      className={classes.button}
                    >
                      Nazad
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleNext()}
                      className={classes.button}
                    >
                      Dalje
                    </Button>
                  </div>
                  {activeStep !== steps.length &&
                    (completed[activeStep] ? (
                      <Typography
                        component={"span"}
                        variant="caption"
                        className={classes.completed}
                      >
                        Step {activeStep + 1} already completed
                      </Typography>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        //onClick={handleComplete}
                        onClick={e => handleComplete()}
                      >
                        {completedSteps() === totalSteps() - 1
                          ? "Finish"
                          : "Complete"}
                      </Button>
                    ))}
                </div>
              </div>
              {/* )}
              </div> */}
            </StepContent>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <FormSubmit
            setSavedReportId={props.setSavedReportId}
            setNotification={props.setNotification}
            kategorije={props.kategorije}
          />
        ) : null}
      </div>
    </div>
  );
}
