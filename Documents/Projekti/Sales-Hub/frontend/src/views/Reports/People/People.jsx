import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { backend_address as serverip } from "../../../config/backend";
import request_config from "../../../helpers/RequestConfig";
// Table with search and pagination
import MaterialTable from "components/Table/TablePaginationSearch.jsx";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
//import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
//import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
//import CardFooter from "components/Card/CardFooter.jsx";

export class People extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }
  componentDidMount() {
    // const users = localStorage.getItem("salesmen");
    // const usersArr = users.split(",");
    // this.setState({ users: usersArr });

    axios
      .get(`${serverip}/api/users`, request_config())
      .then(usersData => {
        const usersArray = usersData.data.users;
        //console.log(usersData.data);
        this.setState({ users: usersArray });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { classes } = this.props;

    const userDataRender = user => {
      const profile_url = `/admin/reports/people/${user.id}`;
      return [
        <Link
          to={profile_url}
          style={{
            color: "#033E8C",
            lineHeight: "25px",
            height: "25px"
          }}
        >
          <Icon
            style={{
              verticalAlign: "middle"
            }}
          >
            account_circle
          </Icon>{" "}
          <span
            style={{
              verticalAlign: "middle"
            }}
          >
            {user.fullname}
          </span>
        </Link>
      ];
    };

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Zaposleni</h4>
            </CardHeader>
            <CardBody>
              <MaterialTable
                tableData={this.state.users}
                tableHeaderColor="primary"
                tableHead={[
                  {
                    title: "Ime i Prezime",
                    field: "fullname",
                    render: userDataRender
                  },
                  { title: "Email", field: "email" }
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default withStyles(withStyles)(People);
