import {
  grayColor,
  //primaryColor,
  //infoColor,
  successColor,
  //warningColor,
  dangerColor,
  //roseColor,
  whiteColor,
  //blackColor,
  //hexToRgb,
  primaryBoxShadow,
  defaultFont,
} from "assets/jss/material-dashboard-react.jsx";

const autocompleteStyle = {
  menuItem: {
    ...defaultFont,
    fontSize: "13px",
    padding: "10px 20px",
    margin: "0 5px",
    borderRadius: "2px",
    WebkitTransition: "all 150ms linear",
    MozTransition: "all 150ms linear",
    OTransition: "all 150ms linear",
    MsTransition: "all 150ms linear",
    transition: "all 150ms linear",
    display: "block",
    clear: "both",
    fontWeight: "400",
    lineHeight: "1.42857143",
    color: grayColor[8],
    whiteSpace: "nowrap",
    height: "unset",
    cursor: "pointer",
    "&:hover": {
      //backgroundColor: primaryColor[0],
      backgroundColor: "rgba(0, 35, 64, 0.8)",
      color: whiteColor,
      ...primaryBoxShadow,
    },
  },
  disabled: {
    "&:before": {
      backgroundColor: "transparent !important",
    },
  },
  underline: {
    "&:hover:not($disabled):before,&:before": {
      borderColor: grayColor[4] + " !important",
      borderWidth: "1px !important",
    },
    "&:after": {
      //borderColor: primaryColor[0]
      borderColor: whiteColor,
    },
  },
  underlineError: {
    "&:after": {
      borderColor: dangerColor[0],
    },
  },
  underlineSuccess: {
    "&:after": {
      borderColor: successColor[0],
    },
  },
  labelRoot: {
    ...defaultFont,
    color: grayColor[3] + " !important",
    //color: whiteColor + " !important",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "1.42857",
  },
  labelRootError: {
    color: dangerColor[0],
  },
  labelRootSuccess: {
    color: successColor[0],
  },
  paper: {
    width: "300px",
    boxShadow: "6px 10px 6px -3px rgba(211,211,211,1)",
  },
};

export default autocompleteStyle;
