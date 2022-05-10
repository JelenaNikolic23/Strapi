import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { backend_address as serverip } from "../../config/backend";
import jwt from "jsonwebtoken";

class LoginPageFL extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      frontline_id: 0,
      redirect: false
    };
  }
  componentDidMount() {
    const { persist_code } = this.props.match.params;
    axios
      .post(`${serverip}/api/loginFL`, {
        persist_code: persist_code
      })
      .then(res => {
        const token = jwt.decode(res.data.token);

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

          // console.log(localStorage.getItem("token"));
          // console.log(localStorage.getItem("username"));
          // console.log(localStorage.getItem("fullname"));
          // console.log(localStorage.getItem("email"));
          // console.log(localStorage.getItem("frontline_id"));
          // console.log("======== FL GROUPS ========");
          // console.log(localStorage.getItem("frontline_groups"));

          this.setRedirect(token.frontline_id);
        }
      })
      .catch(e => console.log(e));
  }

  setRedirect = frontline_id => {
    this.setState({
      redirect: true,
      frontline_id: frontline_id
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      const redirectURL = "/admin/reports/people/" + this.state.frontline_id;
      return <Redirect to={redirectURL} />;
    }
  };

  render() {
    return (
      <div>
        <p>Učitavanje u toku...</p>
        {this.renderRedirect()}
      </div>
    );
  }
}

export default LoginPageFL;
