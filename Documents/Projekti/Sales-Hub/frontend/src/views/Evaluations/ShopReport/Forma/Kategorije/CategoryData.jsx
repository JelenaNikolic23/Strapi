import React from "react";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
// Rating stars components
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";

const useStyles = makeStyles({
  root: {
    padding: "13px"
  },
  checked: {
    color: `#033E8C !important`
  },
  checkedIcon: {
    width: "20px",
    height: "20px",
    border: "1px solid black",
    borderRadius: "3px"
  },
  uncheckedIcon: {
    width: "0px",
    height: "0px",
    padding: "10px",
    border: "1px solid black",
    borderRadius: "3px"
  },
  radio: {
    color: `#033E8C !important`
  },
  radioChecked: {
    width: "20px",
    height: "20px",
    border: `1px solid #033E8C`,
    borderRadius: "50%"
  },
  radioUnchecked: {
    width: "0px",
    height: "0px",
    padding: "10px",
    border: "1px solid black",
    borderRadius: "50%"
  },
  upDivider: {
    marginTop: "0px",
    marginBottom: "30px",
    textAlign: "center"
  }
});

function CategoryData(props) {
  const classes = useStyles();
  const { kategorija, handleChange, data } = props;

  // First we filter data tu exclude feedback and then we map that array to return jsx
  //const filteredData = data.filter((item, index) => index !== 0);
  let filteredData;
  (() => {
    if (data[0].feedbackName) {
      return (filteredData = data.filter((item, index) => index !== 0));
    } else {
      return (filteredData = data);
    }
  })();

  const formBody = filteredData.map(item => {
    return (
      <div key={item.text}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            {item.text}
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <>
              <FormControl style={{ display: "flex" }}>
                <RadioGroup
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "116%"
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div className={classes.wrapperDiv}>
                      <FormControlLabel
                        control={
                          <Radio
                            checked={kategorija[item.stateName] === 1}
                            onChange={handleChange}
                            value={1}
                            name={item.checkboxName}
                            aria-label="Shop Report"
                            icon={
                              <FiberManualRecord
                                className={classes.radioUnchecked}
                              />
                            }
                            checkedIcon={
                              <FiberManualRecord
                                className={classes.radioChecked}
                              />
                            }
                            classes={{
                              checked: classes.radio
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="1"
                      />
                    </div>
                    <div className={classes.wrapperDiv}>
                      <FormControlLabel
                        control={
                          <Radio
                            checked={kategorija[item.stateName] === 2}
                            onChange={handleChange}
                            value={2}
                            name={item.checkboxName}
                            aria-label="Shop Report"
                            icon={
                              <FiberManualRecord
                                className={classes.radioUnchecked}
                              />
                            }
                            checkedIcon={
                              <FiberManualRecord
                                className={classes.radioChecked}
                              />
                            }
                            classes={{
                              checked: classes.radio
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="2"
                      />
                    </div>
                    <div className={classes.wrapperDiv}>
                      <FormControlLabel
                        control={
                          <Radio
                            checked={kategorija[item.stateName] === 3}
                            onChange={handleChange}
                            value={3}
                            name={item.checkboxName}
                            aria-label="Shop Report"
                            icon={
                              <FiberManualRecord
                                className={classes.radioUnchecked}
                              />
                            }
                            checkedIcon={
                              <FiberManualRecord
                                className={classes.radioChecked}
                              />
                            }
                            classes={{
                              checked: classes.radio
                            }}
                          />
                        }
                        classes={{
                          label: classes.label
                        }}
                        label="3"
                      />
                    </div>
                  </div>
                  <div className={classes.wrapperDiv}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={kategorija[item.stateName] === 0}
                          onChange={handleChange}
                          value={0}
                          name={item.checkboxName}
                          aria-label="Shop Report"
                          icon={
                            <FiberManualRecord
                              className={classes.radioUnchecked}
                            />
                          }
                          checkedIcon={
                            <FiberManualRecord
                              className={classes.radioChecked}
                            />
                          }
                          classes={{
                            checked: classes.radio
                          }}
                        />
                      }
                      classes={{
                        label: classes.label
                      }}
                      label="N/A"
                    />
                  </div>
                </RadioGroup>
              </FormControl>
            </>
          </GridItem>
        </GridContainer>
        <div className={classes.upDivider} />
      </div>
    );
  });

  return (
    <div>
      {formBody}
      {data[0].feedbackName ? (
        <>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <InputLabel>
                <h5 style={{ marginRight: "5px" }}>
                  Komentar{"  "}
                  {/* <span style={{ color: "red", fontSize: "0.80rem" }}>
                    &nbsp;&nbsp; * obavezno
                  </span> */}
                </h5>
              </InputLabel>
              <CustomInput
                labelText="Ovde napiši svoja zapažanja"
                id="about-me"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  name: data[0].feedbackName, // Fedback name is alsways first element in  data array
                  value: kategorija.feedback,
                  onChange: handleChange,
                  multiline: true,
                  rows: 5
                }}
              />
            </GridItem>
          </GridContainer>
          <div className={classes.upDivider} />
        </>
      ) : // <div className={classes.upDivider} />
      null}
    </div>
  );
}

export default CategoryData;
