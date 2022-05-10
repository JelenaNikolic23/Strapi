import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { backend_address as serverip } from "../../../config/backend";
import request_config from "../../../helpers/RequestConfig";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
import Divider from "@material-ui/core/Divider";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// Components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "../../../components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import MultilineInput from "components/CustomInput/MultilineInput.jsx";
import Modal from "components/Modal/Modal";
import SubmitNotification from "components/Snackbar/SubmitNotification.jsx";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "0px",
    textDecoration: "none",
  },
  divider: {
    marginTop: "30px",
    marginBottom: "0px",
    textAlign: "center",
  },
  miniDivider: {
    marginTop: "15px",
    marginBottom: "0px",
    textAlign: "center",
  },
  upDivider: {
    marginTop: "0px",
    marginBottom: "30px",
    textAlign: "center",
  },
};

export function Detailed5G(props) {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.up("md"));

  const [categories, setCategories] = useState([]);
  const [evaluatorName, setEvaluatorName] = useState("");
  const [salesmanName, setSalesmanName] = useState("");
  const [evaluationScore, setEvaluationScore] = useState("");
  const [evaluationDate, setEvaluationDate] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackReply, setFeedbackReply] = useState("");
  const [isEmpty, setIsEmpty] = useState(true);
  const [fetched, setFetched] = useState(false);
  const [salesmanId, setSalesmanId] = useState("");
  const [evaluationSaved, setEvaluationSaved] = useState(false);
  const [evaluationSaveError, setEvaluationSaveError] = useState(false);

  useEffect(() => {
    const { evaluationId } = props.match.params;

    // Call Api to get evaluation by id
    if (evaluationId) {
      axios
        .get(`${serverip}/api/evaluations/${evaluationId}`, request_config())
        .then(evaluation => {
          setCategories(evaluation.data.evaluation.categories);
          setEvaluatorName(evaluation.data.evaluator.fullname);
          setEvaluationDate(evaluation.data.date);
          setSalesmanName(evaluation.data.user.fullname);
          setEvaluationScore(evaluation.data.evaluation.score);
          setSalesmanId(evaluation.data.user.frontline_id);
          setFeedback(evaluation.data.evaluation.feedback);
          setFeedbackReply(
            evaluation.data.evaluation.feedbackReply
              ? evaluation.data.evaluation.feedbackReply
              : ""
          );
          setIsEmpty(evaluation.data.evaluation.feedbackReply ? false : true);
          setFetched(true);
          // UPDATE EVALUATION TO SEEN
          const frontline_id = localStorage.getItem("frontline_id");

          if (parseInt(frontline_id) === evaluation.data.user.frontline_id) {
            axios
              .get(
                `${serverip}/api/evaluations/updateSeen/${evaluationId}`,
                request_config()
              )
              .then(() => {
                console.log("Evaluation updated to seen.");
              })
              .catch(error => {
                console.log(error);
              });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  const closeSnackbar = () => {
    setEvaluationSaved(false);
  };

  const closeSnackbarError = () => {
    setEvaluationSaveError(false);
  };

  const onSubmit = e => {
    e.preventDefault();
    const { evaluationId } = props.match.params;
    const body = {
      feedbackReply: feedbackReply,
    };

    // Axios post request - add 7p to MongoDB
    axios
      .post(
        `${serverip}/api/evaluations/feedbackReplay/${evaluationId}`,
        body,
        request_config()
      )
      .then(res => {
        setIsEmpty(false);
        setFeedbackReply(res.data.evaluation.feedbackReply);
        setEvaluationSaved(true);
      })
      .catch(err => {
        console.log(err);
        setEvaluationSaveError(true);
      });
  };

  const handleChangeEnabled = e => {
    setFeedbackReply(e.target.value);
  };

  const { classes } = props;
  // Maping the categories to extract all necesery data for evaluation details
  const evalJSX = categories.map(category => {
    const steps = category.categorySteps.map(step => {
      // Create Icon and label
      let stepValue = "";
      let stepIcon = "";
      if (step.stepValue === "Da") {
        stepIcon = (
          <Icon
            style={{
              color: "green",
              fontSize: "36px",
              marginTop: "14px",
            }}
          >
            done
          </Icon>
        );
        stepValue = step.stepValue;
      } else if (step.stepValue === "Ne") {
        stepIcon = (
          <Icon
            style={{
              color: "red",
              fontSize: "36px",
              marginTop: "14px",
              paddingTop: "4px",
            }}
          >
            close
          </Icon>
        );
        stepValue = step.stepValue;
      } else if (step.stepValue === "na") {
        stepIcon = "";
        stepValue = "N/A";
      }
      // We loop thru category steps to get step names and step value and return them in jsx
      return (
        <div key={step.stepName}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={9}>
              {step.stepValue === "na" ? (
                <p
                  style={{
                    color: "#AAAAAA",
                    textDecoration: "line-through",
                    paddingTop: matchesMd && "10px",
                  }}
                >
                  {step.stepName}
                </p>
              ) : (
                <p style={{ paddingTop: matchesMd && "10px" }}>
                  {step.stepName}
                </p>
              )}
            </GridItem>
            <GridItem
              xs={12}
              sm={12}
              md={3}
              style={{
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <p
                style={{
                  color: "#AAAAAA",
                  fontWeight: "400",
                  fontSize: "24px",
                  marginRight: "5px",
                  height: "inherit",
                }}
              >
                {stepValue}
              </p>
              {stepIcon}
            </GridItem>
          </GridContainer>
          <div className={classes.miniDivider} />
        </div>
      );
    });
    // We return category names from the first map and steps variable which is reuslt of second map above
    return (
      <div key={category.categoryName}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <h3 style={{ color: "#AAAAAA" }}>{category.categoryName}</h3>
          </GridItem>
        </GridContainer>
        {steps}
        <div className={classes.upDivider} />
        <Divider variant="middle" />
        <div className={classes.divider} />
      </div>
    );
  });

  const frontline_id = localStorage.getItem("frontline_id");
  const isSalesman =
    parseInt(frontline_id) === parseInt(props.match.params.frontline_id)
      ? true
      : false;

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <div style={{ marginBottom: "12px" }}>
                <h4 className={classes.cardTitleWhite}>5G Evaluacija</h4>
              </div>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <h5 className={classes.cardTitleWhite}>
                    Ocenjen: <strong>{salesmanName}</strong>
                  </h5>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <h5 className={classes.cardTitleWhite}>
                    Ukupna Ocena: <strong>{evaluationScore}</strong>
                  </h5>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <h5 className={classes.cardTitleWhite}>
                    Evaluator: <strong>{evaluatorName}</strong>
                  </h5>
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <h5 className={classes.cardTitleWhite}>
                    Datum: <strong>{evaluationDate.split("T")[0]}</strong>
                  </h5>
                </GridItem>
              </GridContainer>
            </CardHeader>
            <CardBody>
              {evalJSX}
              <h3 style={{ color: "#AAAAAA" }}>Savet prodavcu</h3>
              <p>{feedback}</p>
            </CardBody>
            <div className={classes.upDivider} />
            <Divider variant="middle" />
            <div className={classes.divider} />
            {!isEmpty ? (
              <CardBody>
                <h3 style={{ color: "#AAAAAA" }}>Reakcija prodavca</h3>
                <p>{feedbackReply}</p>
              </CardBody>
            ) : isSalesman ? (
              <CardBody>
                <form onSubmit={onSubmit}>
                  <MultilineInput
                    name="feedbackReply"
                    label="Reakcija prodavca"
                    placeholder="napiši kako si usvojio savet koji ti evaluator dao"
                    inputValue={feedbackReply}
                    handleInputChange={handleChangeEnabled}
                  />
                  <Modal
                    submit="submit"
                    message="Da li potvrđujete svoj odgovor?"
                    disabled={feedbackReply.length ? false : true}
                  />
                </form>
              </CardBody>
            ) : null}
            <CardFooter>
              <Link to={`/admin/reports/people/${salesmanId}`}>
                <Button color="primary">Profil prodavca</Button>
              </Link>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <SubmitNotification
        success={evaluationSaved}
        error={evaluationSaveError}
        closeSnackbarSuccess={closeSnackbar}
        closeSnackbarError={closeSnackbarError}
        text="Odgovor je sačuvan"
      />
    </div>
  );
}

export default withStyles(styles)(Detailed5G);
