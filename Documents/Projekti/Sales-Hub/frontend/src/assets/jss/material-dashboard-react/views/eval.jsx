import {
  primaryColor,
  blackColor,
  hexToRgb
} from "assets/jss/material-dashboard-react.jsx";

const evalStyles = {
  tooltip: {
    padding: "10px 15px",
    marginBottom: "10px",
    minWidth: "130px",
    lineHeight: "1.7em",
    border: "none",
    borderRadius: "3px",
    boxShadow:
      "0 8px 10px 1px rgba(" +
      hexToRgb(blackColor) +
      ", 0.14), 0 3px 14px 2px rgba(" +
      hexToRgb(blackColor) +
      ", 0.12), 0 5px 5px -3px rgba(" +
      hexToRgb(blackColor) +
      ", 0.2)",
    maxWidth: "400px",
    textAlign: "center",
    fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: "400",
    textShadow: "none",
    textTransform: "none",
    letterSpacing: "normal",
    wordBreak: "normal",
    wordSpacing: "normal",
    wordWrap: "normal",
    whiteSpace: "normal",
    lineBreak: "auto"
  },
  root: {
    padding: "13px"
  },
  checked: {
    color: primaryColor[0] + "!important"
  },
  checkedIcon: {
    width: "20px",
    height: "20px",
    border: "1px solid rgba(" + hexToRgb(blackColor) + ", .54)",
    borderRadius: "3px"
  },
  uncheckedIcon: {
    width: "0px",
    height: "0px",
    padding: "10px",
    border: "1px solid rgba(" + hexToRgb(blackColor) + ", .54)",
    borderRadius: "3px"
  },
  radio: {
    color: primaryColor[0] + "!important"
  },
  radioChecked: {
    width: "20px",
    height: "20px",
    border: "1px solid " + primaryColor[0],
    borderRadius: "50%"
  },
  radioUnchecked: {
    width: "0px",
    height: "0px",
    padding: "10px",
    border: "1px solid rgba(" + hexToRgb(blackColor) + ", .54)",
    borderRadius: "50%"
  },
  cardHeader: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  divider: {
    marginTop: "30px",
    marginBottom: "0px",
    textAlign: "center"
  },
  miniDivider: {
    marginTop: "15px",
    marginBottom: "0px",
    textAlign: "center"
  },
  upDivider: {
    marginTop: "0px",
    marginBottom: "30px",
    textAlign: "center"
  },
  snackbarRoot: {
    backgroundColor: "#4caf50"
  },
  snackbarRootError: {
    backgroundColor: "#f55a4e"
  },
  icon: {
    fontSize: "16px",
    marginLeft: "5px",
    marginBottom: "-2px"
  },
  h3: {
    color: "#AAAAAA",
    display: "inline-block",
    cursor: "help"
  },
  h3Basic: {
    color: "#AAAAAA",
    display: "inline-block"
  }
};

export default evalStyles;
