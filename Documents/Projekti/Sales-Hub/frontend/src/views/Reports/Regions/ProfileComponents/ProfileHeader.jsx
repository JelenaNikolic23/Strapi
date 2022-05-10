import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { backend_address as serverip } from "../../../../config/backend";
import request_config from "../../../../helpers/RequestConfig";
// @material-ui/core components
import Icon from "@material-ui/core/Icon";
import Chip from "@material-ui/core/Chip";
import StoreIcon from "@material-ui/icons/Store";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";

class ProfileHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {},
      shops: []
    };
  }
  componentDidMount() {
    const { region_id } = this.props;

    // Call backend API - Regions details
    if (region_id) {
      axios
        .get(`${serverip}/api/regions/single/${region_id}`, request_config())
        .then(region => {
          this.setState({ region: region.data });
        })
        .catch(error => {
          console.log(error);
        });
    }
    // Call backend API - Get shops
    if (region_id) {
      axios
        .get(`${serverip}/api/shops/region/${region_id}`, request_config())
        .then(shops => {
          this.setState({ shops: shops.data.groups_array });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  render() {
    const { classes } = this.props;
    const { shops } = this.state;

    // Shop chips
    const shopsChips = shops.map(shop => {
      return (
        <Link to={`/admin/reports/shops/${shop.id}`}>
          <Chip
            icon={<StoreIcon />}
            label={shop.name}
            clickable
            className={classes.chip}
            color="primary"
            variant="outlined"
            style={{ margin: "5px" }}
            key={shop.id}
          />
        </Link>
      );
    });

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <Card>
              <CardHeader stats icon>
                <CardIcon color="primary">
                  <Icon>layers</Icon>
                </CardIcon>
                <h4
                  className={classes.cardTitle}
                  style={{ display: "flex", justifyContent: "flexStart" }}
                >
                  {this.state.region.name}
                </h4>
                <p
                  className={classes.cardCategory}
                  style={{ display: "flex", justifyContent: "flexStart" }}
                >
                  {this.state.region.parentName}
                </p>
              </CardHeader>
              <CardBody />
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader stats>
                <p className={classes.cardCategory}>Prodavnice</p>
              </CardHeader>
              <CardBody>{shopsChips}</CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default ProfileHeader;
