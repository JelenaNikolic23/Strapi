import React, { Component } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../config/backend";
import request_config from "../../../helpers/RequestConfig";
// @material-ui/core styles
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import Search from "@material-ui/icons/Search";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Autocomplete from "components/Autocomplete/Autocomplete.jsx";
import StepperForm from "./Forma/StepperForm.jsx";
import ActionPlans from "./Forma/AkcioniPlanovi/ActionPlans.jsx";
import evalStyle from "../../../assets/jss/material-dashboard-react/views/eval.jsx";
import Notifications from "./Forma/Notification.jsx";

export class ShopReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ShopPerformans: {
        A1: 1,
        A2: 1,
        A3: 1,
        A4: 1,
        A5: 1,
        A6: 1,
        A7: 1,
        A8: 1,
        A9: 1,
        A10: 1,
        A11: 1,
        A12: 1,
        feedback: ""
      },
      ProdajniPristup: {
        B1: 1,
        B2: 1,
        B3: 1
      },
      ManagementOsoblja: {
        C1: 1,
        C2: 1,
        C3: 1,
        C4: 1,
        C5: 1,
        C6: 1,
        C7: 1,
        feedback: ""
      },
      MerchAndShopLayout: {
        D1: 1,
        D2: 1,
        D3: 1,
        D4: 1,
        D5: 1,
        D6: 1,
        D7: 1,
        D8: 1,
        D9: 1,
        D10: 1,
        D11: 1,
        feedback: ""
      },
      AdministrativniPoslovi: {
        E1: 1,
        E2: 1,
        E3: 1,
        E4: 1,
        E5: 1,
        E6: 1,
        E7: 1,
        E8: 1,
        feedback: ""
      },
      actionPlans: [],
      shopsArray: [],
      selectedShop: {},
      evaluator: {},
      lastDayEvaluations: [],
      savedReportId: "",
      notification: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.setShop = this.setShop.bind(this);
    this.addActionPlans = this.addActionPlans.bind(this);
    this.setSavedReportId = this.setSavedReportId.bind(this);
    this.setNotification = this.setNotification.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem("ShopPerformans") !== null) {
      this.setState({
        ShopPerformans: JSON.parse(localStorage.getItem("ShopPerformans"))
      });
    }
    if (localStorage.getItem("ProdajniPristup") !== null) {
      this.setState({
        ProdajniPristup: JSON.parse(localStorage.getItem("ProdajniPristup"))
      });
    }
    if (localStorage.getItem("ManagementOsoblja") !== null) {
      this.setState({
        ManagementOsoblja: JSON.parse(localStorage.getItem("ManagementOsoblja"))
      });
    }
    if (localStorage.getItem("MerchAndShopLayout") !== null) {
      this.setState({
        MerchAndShopLayout: JSON.parse(
          localStorage.getItem("MerchAndShopLayout")
        )
      });
    }
    if (localStorage.getItem("AdministrativniPoslovi") !== null) {
      this.setState({
        AdministrativniPoslovi: JSON.parse(
          localStorage.getItem("AdministrativniPoslovi")
        )
      });
    }
    if (localStorage.getItem("selectedShop") !== null) {
      this.setState(
        { selectedShop: JSON.parse(localStorage.getItem("selectedShop")) },
        function() {
          // Get 5G evaluations created in last 24h for selected shop

          if (this.state.selectedShop.id)
            axios
              .get(
                `${serverip}/api/evaluations/lastDay/${
                  this.state.selectedShop.id
                }`,
                request_config()
              )
              .then(evaluations => {
                this.setState(
                  { lastDayEvaluations: evaluations.data },
                  function() {
                    localStorage.setItem(
                      `lastDayEvaluations`,
                      JSON.stringify(this.state.lastDayEvaluations)
                    );
                  }
                );
              })
              .catch(error => {
                console.log(error);
              });
        }
      );
    } else {
      this.setState({ selectedShop: {} });
    }

    this.setState({
      evaluator: {
        frontline_id: localStorage.getItem("frontline_id"),
        fullname: localStorage.getItem("fullname"),
        username: localStorage.getItem("username"),
        email: localStorage.getItem("email"),
        frontline_groups: JSON.parse(localStorage.getItem("frontline_groups"))
      }
    });

    axios
      .get(`${serverip}/api/shops`, request_config())
      .then(shopsData => {
        const shopsArray = shopsData.data.groups_array;
        this.setState({ shopsArray: shopsArray });
      })
      .catch(error => {
        console.log(error);
      });
  }

  setNotification(status) {
    this.setState({
      notification: status
    });
  }

  setShop(selectedShop) {
    this.setState(
      {
        selectedShop: selectedShop
      },
      function() {
        // Get 5G evaluations created in last day for this shop

        if (this.state.selectedShop.id)
          axios
            .get(
              `${serverip}/api/evaluations/lastDay/${
                this.state.selectedShop.id
              }`,
              request_config()
            )
            .then(evaluations => {
              this.setState(
                { lastDayEvaluations: evaluations.data },
                function() {
                  localStorage.setItem(
                    `lastDayEvaluations`,
                    JSON.stringify(this.state.lastDayEvaluations)
                  );
                }
              );
            })
            .catch(error => {
              console.log(error);
            });
      }
    );
  }

  addActionPlans(newPlan) {
    this.setState({
      actionPlans: [...this.state.actionPlans, newPlan]
    });
    console.log(this.state.actionPlans);
  }

  setSavedReportId(id) {
    this.setState({
      savedReportId: id
    });
  }

  handleChange(event) {
    event.persist();

    // We use split to get category and item name from event.target.name
    const name = event.target.name.split(" ");
    const category = name[0]; // example ShopPerformans
    const item = name[1]; // example A1

    // Feedback value is string and radiobutton is number so we use if statement to handle both cases
    if (item !== "feedback") {
      this.setState({
        [category]: {
          ...this.state[category],
          [item]: parseInt(event.target.value)
        }
      });
    } else {
      this.setState(prevState => ({
        [category]: {
          ...prevState[category],
          [item]: event.target.value
        }
      }));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.ShopPerformans !== this.state.ShopPerformans) {
      localStorage.setItem(
        `ShopPerformans`,
        JSON.stringify(this.state.ShopPerformans)
      );
    }
    if (prevState.ProdajniPristup !== this.state.ProdajniPristup) {
      localStorage.setItem(
        `ProdajniPristup`,
        JSON.stringify(this.state.ProdajniPristup)
      );
    }
    if (prevState.ManagementOsoblja !== this.state.ManagementOsoblja) {
      localStorage.setItem(
        `ManagementOsoblja`,
        JSON.stringify(this.state.ManagementOsoblja)
      );
    }
    if (prevState.MerchAndShopLayout !== this.state.MerchAndShopLayout) {
      localStorage.setItem(
        `MerchAndShopLayout`,
        JSON.stringify(this.state.MerchAndShopLayout)
      );
    }
    if (
      prevState.AdministrativniPoslovi !== this.state.AdministrativniPoslovi
    ) {
      localStorage.setItem(
        `AdministrativniPoslovi`,
        JSON.stringify(this.state.AdministrativniPoslovi)
      );
    }

    if (prevState.selectedShop !== this.state.selectedShop) {
      localStorage.setItem(
        `selectedShop`,
        JSON.stringify(this.state.selectedShop)
      );
    }

    // if (localStorage.getItem("ShopReportID") !== null) {
    //   const savedReportId = localStorage.getItem("ShopReportID");
    // }
  }

  render() {
    const { classes } = this.props;
    const { shopsArray, selectedShop } = this.state;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <form onSubmit={this.onSubmit}>
              <Card>
                <CardHeader color="primary" className={classes.cardHeader}>
                  <h4 className={classes.cardTitleWhite}>Shop Report</h4>
                  <GridContainer
                    style={{
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        marginBottom: "-10px",
                        marginTop: "15px"
                      }}
                    >
                      <div
                        className={classes.searchWrapper}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Autocomplete
                          selectedItemHandler={this.setShop}
                          searchItems={shopsArray}
                          selectedItem={selectedShop.fullname}
                          placeholder="Pretraga prodavnica"
                        />
                        <Button color="white" aria-label="edit" justIcon round>
                          <Search />
                        </Button>
                      </div>
                    </GridItem>
                  </GridContainer>
                </CardHeader>
                <CardBody>
                  {!this.state.savedReportId.length ? (
                    <StepperForm
                      kategorije={this.state}
                      handleChange={this.handleChange}
                      scrollToTop={this.props.scrollToTop}
                      addActionPlans={this.addActionPlans}
                      style={{ width: "100%" }}
                      setSavedReportId={this.setSavedReportId}
                      setNotification={this.setNotification}
                    />
                  ) : (
                    <ActionPlans
                      addActionPlans={this.addActionPlans}
                      setNotification={this.setNotification}
                      notificationType={this.state.notification}
                    />
                  )}
                </CardBody>
              </Card>
            </form>
          </GridItem>
          <Notifications
            notificationType={this.state.notification}
            open={true}
          />
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(evalStyle)(ShopReport);
