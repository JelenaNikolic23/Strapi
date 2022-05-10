import React, { Component } from "react";
import TopAndLow5Evaluators5G from "./components/TopAndLow5Evaluators5G.jsx";
import Evaluators5GPerMonth from "./components/Evaluators5GPerMonth";
import ShopReportsPerMonth from "./components/ShopReportsPerMonth.jsx";
import ShopReportChallenges from "./components/ShopReportChallenges";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

class HeadHomePage extends Component {
  render() {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <TopAndLow5Evaluators5G />
        </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <Evaluators5GPerMonth />
        </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <ShopReportsPerMonth />
        </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <ShopReportChallenges />
        </GridItem>
      </GridContainer>
    );
  }
}

export default HeadHomePage;
