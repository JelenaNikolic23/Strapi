import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import Warning from "@material-ui/icons/Warning";
// core components
import Snackbar from "components/Snackbar/Snackbar.jsx";

import image from "assets/img/backgroung.png";

class ErrorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ open: true }), 600);
  }

  render() {
    //const { classes } = this.props;
    return (
      <div>
        <div
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <Snackbar
            place="tc"
            color="danger"
            icon={Warning}
            message="GREŠKA - nemate pravo pristupa."
            open={this.state.open}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(withStyles)(ErrorPage);
