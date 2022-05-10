import React from "react";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import RegionalManagerHome from "./Home Components/RegionalManagerHome.jsx";
import ShopManagerHome from "./Home Components/ShopManagerHome";
import HeadHomePage from "./Home Components/HeadHomePage.jsx";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const elearningrole = localStorage.getItem("elearningrole");

    const frontLineNestDepth = JSON.parse(
      localStorage.getItem("frontline_groups")
    );

    const nestDepth = frontLineNestDepth[0].nest_depth;

    return (
      <>
        {nestDepth <= 1 && elearningrole == 2 ? <HeadHomePage /> : null}

        {nestDepth == 2 && elearningrole == 2 ? <RegionalManagerHome /> : null}

        {nestDepth == 3 && elearningrole == 2 ? <ShopManagerHome /> : null}
      </>
    );
  }
}

//export default withStyles(styles)(Home);
export default Home;
