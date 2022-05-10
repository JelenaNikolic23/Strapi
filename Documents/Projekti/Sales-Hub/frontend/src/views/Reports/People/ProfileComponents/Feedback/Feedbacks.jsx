import React, { useEffect, useState } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../../../config/backend";
import request_config from "../../../../../helpers/RequestConfig";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import FeedbackItem from "./FeedbackItem";

function Feedbacks({ frontline_id }) {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    // Axios Get request - Get feedbacks
    if (frontline_id) {
      axios
        .get(`${serverip}/api/feedbacks/user/${frontline_id}`, request_config())
        .then(feedbacks => {
          // Map data to get just fields we need to display feedbacks
          const feedbackData = feedbacks.data.map(item => ({
            feedback: item.feedback,
            score: item.score,
            evaluator: item.evaluator.fullname,
            evaluator_id: item.evaluator.frontline_id,
            user: item.user.fullname,
            date: item.date,
            id: item._id,
            fileScan: item.fileScan
          }));
          setFeedbackData(feedbackData);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);

  return (
    <GridItem xs={12} sm={12} md={12}>
      <Card>
        <CardHeader color="primary">
          <span>Feedbacks</span>
        </CardHeader>
        <CardBody>
          {feedbackData.length ? (
            feedbackData.map(feedback => (
              <FeedbackItem key={feedback.id} feedback={feedback} />
            ))
          ) : (
            <span>Zaposleni još uvek nije dobio ni jedan feedback</span>
          )}
        </CardBody>
      </Card>
    </GridItem>
  );
}

export default Feedbacks;
