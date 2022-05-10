import React, { useState, useEffect } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../../../config/backend";
import request_config from "../../../../../helpers/RequestConfig";
// Components created for action plans
import AddChallengeAndDeadline from "./AddChallengeAndDeadline.jsx";
import AddActionPlan from "./AddActionPlan.jsx";
import ActionPlansList from "./ActionPlansList.jsx";
import ShopPictures from "./ShopPictures.jsx";
import Notifications from "../../Forma/Notification.jsx";
//import ShopGlobalCom from "./ShopGlobalCom.jsx";

// core ui components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import Icon from "@material-ui/core/Icon";
import { Button } from "@material-ui/core";

export default function ActionPlans() {
  const [selectedDate, setSelectedDate] = useState(Date.now());
  const [challenge, setChallenge] = useState();
  const [actionPlans, setActionPlans] = useState([]);
  const [notification, setNotification] = useState();
  const [open, setOpen] = useState(true);
  //const [globalComments, setGlobalComments] = useState();

  function handleDateChange(date) {
    setSelectedDate(date);
  }

  const addActionPlan = newActionPlan => {
    setActionPlans([...actionPlans, { task: newActionPlan, completed: false }]);
  };

  const removeActionPlan = actionPlanId => {
    //filter out the action plan that is being removed
    const updatedActionPlans = actionPlans.filter(
      plan => plan.task !== actionPlanId
    );
    setActionPlans(updatedActionPlans);
  };

  const editActionPlan = (actionPlanId, newActionPlan) => {
    const updatedActionPlans = actionPlans.map(plan =>
      plan.task === actionPlanId ? { ...plan, task: newActionPlan } : plan
    );
    setActionPlans(updatedActionPlans);
  };

  const submitPlans = () => {
    const plans = {
      challenge: challenge,
      deadline: selectedDate,
      resolved: false,
      actions: actionPlans
    };

    const shopReportId = localStorage.getItem("ShopReportID");
    const ShopData = JSON.parse(localStorage.getItem("ShopData"));

    const noviPlan = {
      ...plans,
      owner: shopReportId,
      creator: {
        frontline_id: localStorage.getItem("frontline_id"),
        fullname: localStorage.getItem("fullname"),
        email: localStorage.getItem("email"),
        frontline_groups: JSON.parse(localStorage.getItem("frontline_groups"))
      },
      shop: {
        id: ShopData.id,
        fullname: ShopData.fullname,
        nest_left: ShopData.nest_left,
        nest_right: ShopData.nest_right,
        nest_depth: ShopData.nest_depth,
        parent_id: ShopData.parent_id,
        parent_name: ShopData.parent_name
      }
    };

    if (plans) {
      // Axios post request - add evaluation to MongoDB
      axios
        .post(
          `${serverip}/api/actionPlans/${shopReportId}/add`,
          noviPlan,
          request_config()
        )
        .then(res => {
          setOpen(false);
          setChallenge("");
          setActionPlans([]);
          setSelectedDate(Date.now());
          setNotification("ActionPlanSuccess");
          setOpen(true);
        })
        .catch(err => {
          setOpen(false);
          console.log(err);
          setOpen(true);
          setNotification("ActionPlanFailed");
        });
    }
  };

  // const addGlobalComment = comment => {
  //   setGlobalComments(comment);
  //   localStorage.setItem(`GlobalComment`, JSON.stringify(comment));
  // };
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <h5>Kreiranje Izazova i Akcionih planova</h5>
        <Card style={{ backgroundColor: "#f2f2f2" }}>
          <CardHeader
            style={{ textAlign: "unset", marginTop: "1rem" }}
            stats
            icon
          >
            <GridContainer>
              <GridItem xs={12} sm={12} md={2}>
                <CardIcon color="primary">
                  <Icon>notification_important</Icon>
                </CardIcon>
              </GridItem>
              <AddChallengeAndDeadline
                challenge={challenge}
                setChallenge={setChallenge}
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
              />
            </GridContainer>
          </CardHeader>
          <CardBody>
            <AddActionPlan addActionPlan={addActionPlan} />
            <ActionPlansList
              actionPlans={actionPlans}
              removeActionPlan={removeActionPlan}
              editActionPlan={editActionPlan}
            />
          </CardBody>
          <CardFooter>
            <Button
              disabled={!challenge || !actionPlans.length ? true : false}
              color="primary"
              onClick={submitPlans}
            >
              Sačuvaj
            </Button>
          </CardFooter>
        </Card>
        <Notifications notificationType={notification} open={open} />
      </GridItem>
      <GridItem
        xs={12}
        sm={12}
        md={12}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          marginTop: "1.5rem"
        }}
      >
        <h4 style={{ marginRight: "1rem" }}>Dodavanje Slika</h4>
        <ShopPictures />
      </GridItem>
      <GridItem
        xs={12}
        sm={12}
        md={12}
        style={{ marginTop: "1.5rem", marginBottom: "2.5rem" }}
      >
        {/* <h4>Globalni Komentari</h4> */}
        {/* <ShopGlobalCom
          globalComments={globalComments}
          addGlobalComment={addGlobalComment}
        /> */}
      </GridItem>
    </GridContainer>
  );
}
