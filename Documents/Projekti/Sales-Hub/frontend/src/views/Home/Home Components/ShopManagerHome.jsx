import React, { Component } from "react";
import GridItem from "components/Grid/GridItem.jsx";
import ShopManagerAllChallenges from "./components/ShopManagerAllChallenges";
import GridContainer from "components/Grid/GridContainer.jsx";

class ShopManagerHome extends Component {
  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <ShopManagerAllChallenges />
        </GridItem>
      </GridContainer>
    );
  }
}

export default ShopManagerHome;
