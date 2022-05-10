import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { backend_address as serverip } from "../../../../config/backend";
import request_config from "../../../../helpers/RequestConfig";
// Component UI
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Icon from "@material-ui/core/Icon";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";

class ProfileHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shop: {},
      users: []
    };
  }

  componentDidMount() {
    const { shop_id } = this.props;
    // Call backend API - Shop details
    if (shop_id) {
      axios
        .get(`${serverip}/api/shops/single/${shop_id}`, request_config())
        .then(shop => {
          this.setState({ ...this.state, shop: shop.data });
        })
        .catch(error => {
          console.log(error);
        });
    }
    // Call backend API - Get users
    if (shop_id) {
      axios
        .get(`${serverip}/api/users/shop/${shop_id}`, request_config())
        .then(users => {
          this.setState({ ...this.state, users: users.data.users });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  render() {
    const { classes } = this.props;
    const { shop, users } = this.state;

    // Create clickable Chips which will display all salesman working in this shop
    const usersChips = users.map(user => {
      return (
        <Link to={`/admin/reports/people/${user.id}`} key={user.id}>
          <Chip
            icon={<FaceIcon />}
            label={user.fullname}
            clickable
            className={classes.chip}
            color="primary"
            variant="outlined"
            style={{ margin: "5px" }}
          />
        </Link>
      );
    });

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader stats icon>
              <CardIcon color="primary">
                <Icon>store</Icon>
              </CardIcon>
              <h3
                className={classes.cardTitle}
                style={{ display: "flex", justifyContent: "flexStart" }}
              >
                {shop.name}
              </h3>
              <p
                className={classes.cardCategory}
                style={{ display: "flex", justifyContent: "flexStart" }}
              >
                {shop.parentName}
              </p>
            </CardHeader>
            <CardBody />
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader stats>
              <p className={classes.cardCategory}>Prodavci</p>
            </CardHeader>
            <CardBody>{usersChips}</CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

export default ProfileHeader;
