import React from "react";
import { Link, Route, Switch, NavLink } from "react-router-dom";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import Eval from "../../views/Evaluations/Eval/Eval.jsx";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const CardLink = props => {
  const { classes, routes, title, param } = props;
  return (
    <div>
      <GridItem xs={6} sm={6} md={4}>
        <Card profile style={{ cursor: "pointer" }}>
          <CardBody profile>
            <h5 className={classes.cardTitle}>{props.title}</h5>
          </CardBody>
          <CardFooter style={{ justifyContent: "center" }}>
            <Link to={`/admin/5G`}>
              <Button color="primary" round>
                Odaberi
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </GridItem>
      <Switch>
        <Route
          exact
          path={`/admin/evaluations/${props.param}`}
          component={Eval}
        />
      </Switch>
    </div>
  );
};

CardLink.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  profile: PropTypes.bool
};

export default withStyles(styles)(CardLink);
