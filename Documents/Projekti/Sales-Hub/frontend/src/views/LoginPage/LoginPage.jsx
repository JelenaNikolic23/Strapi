import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { backend_address as serverip } from "../../config/backend";
import jwt from "jsonwebtoken";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
// @material-ui/icons
import People from "@material-ui/icons/People";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import loginPageStyle from "assets/jss/material-dashboard-react/views/loginPage.jsx";

import image from "assets/img/backgroung.png";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      showPassword: false,
      open: false,
      // we use this to make the card to appear after the page has been rendered
      cardAnimaton: "cardHidden",
      elearningrole: "",
      frontline_id: "",
      redirect: false,
    };
    this.inputChange = this.inputChange.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.handleMouseDownPassword = this.handleMouseDownPassword.bind(this);
    this.loginSubmit = this.loginSubmit.bind(this);
    this.closeSnackbar = this.closeSnackbar.bind(this);
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }

  // Updating username and password input fileds on change
  inputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  // Toggle Show/hide password in input field
  handleClickShowPassword() {
    this.setState({ ...this.state, showPassword: !this.state.showPassword });
  }

  handleMouseDownPassword(event) {
    event.preventDefault();
  }

  loginSubmit(e) {
    e.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password,
    };

    axios
      .post(`${serverip}/api/login`, user)
      .then((res) => {
        const token = jwt.decode(res.data.token);

        // Seting the local storage with esential user data
        if (token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("username", token.username);
          localStorage.setItem("fullname", token.fullname);
          localStorage.setItem("email", token.email);
          localStorage.setItem("frontline_id", token.frontline_id);
          localStorage.setItem("elearningrole", token.elearningrole);
          localStorage.setItem(
            "frontline_groups",
            JSON.stringify(token.frontline_groups)
          );

          // id and role will be used when rendering redirect after succesfull login
          this.setState({
            elearningrole: token.elearningrole,
            frontline_id: token.frontline_id,
          });

          // Calling set redirect
          this.setRedirect();
        }
      })
      .catch((err) => this.setState({ open: true }));
  }

  setRedirect = () => {
    this.setState({
      redirect: true,
    });
  };

  renderRedirect = () => {
    const { elearningrole, frontline_id, redirect } = this.state;

    // If redirect is true then user with basic salesman role will be redirected diretly to his profile,
    // user with managers role will be redicreted to admin dashboard
    if (redirect) {
      if (elearningrole === 1) {
        return <Redirect to={`/admin/reports/people/${frontline_id}`} />;
      } else {
        return <Redirect to="/admin/dashboard" />;
      }
    }
  };

  closeSnackbar() {
    this.setState({ open: false });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <form onSubmit={this.loginSubmit} className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>SalesBox</h4>
                    </CardHeader>
                    <CardBody>
                      <CustomInput
                        labelText="Username"
                        id="user"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: "text",
                          name: "username",
                          value: this.state.username,
                          onChange: this.inputChange,
                          autoFocus: true,

                          endAdornment: (
                            <InputAdornment position="end">
                              <People className={classes.inputIconsColor} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <CustomInput
                        labelText="Password"
                        id="pass"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: this.state.showPassword ? "text" : "password",
                          name: "password",
                          value: this.state.password,
                          onChange: this.inputChange,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={this.handleClickShowPassword}
                                onMouseDown={this.handleMouseDownPassword}
                                edge="end"
                              >
                                {this.state.showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </CardBody>
                    <div className={classes.divider} />
                    <CardFooter className={classes.cardFooter}>
                      {this.renderRedirect()}
                      <Button type="submit" round color="primary" size="lg">
                        Login
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
                <Snackbar
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  open={this.state.open}
                  // autoHideDuration={10000}
                  message={
                    <span
                      id="message-id"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <ErrorIcon style={{ marginRight: "5px" }} />
                      Domen ili lozinka nisu validni
                    </span>
                  }
                  ContentProps={{
                    "aria-describedby": "message-id",
                    classes: {
                      root: classes.root,
                    },
                  }}
                  onClose={this.closeSnackbar}
                  action={[
                    <IconButton
                      onClick={this.closeSnackbar}
                      color="inherit"
                      key="close"
                      aria-label="close"
                    >
                      <CloseIcon />
                    </IconButton>,
                  ]}
                />
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(LoginPage);
