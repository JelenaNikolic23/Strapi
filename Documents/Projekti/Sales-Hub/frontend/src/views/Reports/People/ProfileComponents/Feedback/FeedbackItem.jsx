import React, { useState } from "react";
import { feedbackPdfPath } from "../../../../../config/backend";

// core components
import ReadMoreAndLess from "react-read-more-less";
import Tooltip from "@material-ui/core/Tooltip";
import FeedbackUploadFile from "./FeedbackUploadFile";
import Link from "@material-ui/core/Link";
import { PictureAsPdfOutlined, GetAppOutlined } from "@material-ui/icons";

// PDF generation Template
import { feedbackPDF } from "./Feedback.pdfTemplate";

const FeedbackItem = ({ feedback }) => {
  const evaluatorID = parseInt(localStorage.getItem("frontline_id"));

  const [fileScan, setFileScan] = useState(feedback.fileScan);

  return (
    <div
      style={{
        border: "1px solid #ECECEC",
        borderRadius: "6px",
        padding: "10px 15px",
        margin: "15px 0",
        minHeight: "140px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: "500" }}>{feedback.evaluator}</span>
          <span>{feedback.date.split("T")[0]}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Utisak: {feedback.score}</span>
        </div>
      </div>
      <ReadMoreAndLess
        className="read-more-content"
        charLimit={250}
        readMoreText="Pogledaj više"
        readLessText="Pogledaj manje"
      >
        {feedback.feedback}
      </ReadMoreAndLess>
      <div
        className="icons"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "10px",
        }}
      >
        {evaluatorID === feedback.evaluator_id && (
          <>
            <Tooltip id="tooltip-top" title="Preuzmi PDF" placement="top">
              <PictureAsPdfOutlined
                color="action"
                style={{ padding: "0 5px", cursor: "pointer" }}
                onClick={() => feedbackPDF(feedback)}
              />
            </Tooltip>
            <FeedbackUploadFile id={feedback.id} setFileScan={setFileScan} />
          </>
        )}

        {fileScan && (
          <>
            <Link
              //href={`/uploads/feedbacks/scanFiles/${fileScan}`} // putanja za test
              href={`/sales-box/uploads/feedbacks/scanFiles/${fileScan}`} // putanja za produkciju
              target="_blank"
            >
              <Tooltip
                id="tooltip-top"
                title="Preuzmi skenirani feedback"
                placement="top"
              >
                <GetAppOutlined
                  color="action"
                  style={{ padding: "0 5px", cursor: "pointer" }}
                />
              </Tooltip>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackItem;
