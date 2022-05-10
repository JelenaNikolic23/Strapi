import React from "react";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

// @material-ui/core components
import Divider from "@material-ui/core/Divider";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import evalStyle from "assets/jss/material-dashboard-react/views/eval.jsx";

// @material-ui/icons
import Icon from "@material-ui/core/Icon";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";

const useStyles = makeStyles(evalStyle);

export default function Category(props) {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.up("md"));
  const { data, checkedA, checkedB, nameHandler } = props;
  const classes = useStyles();

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={5}>
          <Tooltip
            id="tooltip-top"
            title={data.tooltipText}
            placement="right"
            classes={{ tooltip: classes.tooltip }}
          >
            <h3 className={classes.h3}>
              {data.categoryName}
              <Icon className={classes.icon}>info</Icon>
            </h3>
          </Tooltip>
        </GridItem>

        <GridItem xs={12} sm={12} md={8}>
          <p>{data.stepAname}</p>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <div>
            <FormControl
              style={{
                display: "flex",
                paddingLeft: matchesMd ? "30px" : "0px",
                paddingTop: matchesMd ? "8px" : "0px",
              }}
            >
              <RadioGroup
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div className={classes.wrapperDiv}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={checkedA === "10"}
                        onChange={nameHandler}
                        value={10}
                        name={data.stepAcheckboxName}
                        aria-label="Gradi Odnos"
                        icon={
                          <FiberManualRecord
                            className={classes.radioUnchecked}
                          />
                        }
                        checkedIcon={
                          <FiberManualRecord className={classes.radioChecked} />
                        }
                        classes={{
                          checked: classes.radio,
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                    }}
                    label="Da"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={checkedA === "0"}
                        onChange={nameHandler}
                        value={0}
                        name={data.stepAcheckboxName}
                        aria-label="Gradi Odnos"
                        icon={
                          <FiberManualRecord
                            className={classes.radioUnchecked}
                          />
                        }
                        checkedIcon={
                          <FiberManualRecord className={classes.radioChecked} />
                        }
                        classes={{
                          checked: classes.radio,
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                    }}
                    label="Ne"
                  />
                </div>
                <div className={classes.wrapperDiv}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={checkedA === "na"}
                        onChange={nameHandler}
                        value={"na"}
                        name={data.stepAcheckboxName}
                        aria-label="Gradi Odnos"
                        icon={
                          <FiberManualRecord
                            className={classes.radioUnchecked}
                          />
                        }
                        checkedIcon={
                          <FiberManualRecord className={classes.radioChecked} />
                        }
                        classes={{
                          checked: classes.radio,
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                    }}
                    label="N/A"
                  />
                </div>
              </RadioGroup>
            </FormControl>
          </div>
        </GridItem>
      </GridContainer>
      <div className={classes.miniDivider} />
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <p>{data.stepBname}</p>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <div>
            <FormControl
              style={{
                display: "flex",
                paddingLeft: matchesMd ? "30px" : "0px",
                paddingTop: matchesMd ? "8px" : "0px",
              }}
            >
              <RadioGroup
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div className={classes.wrapperDiv}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={checkedB === "10"}
                        onChange={nameHandler}
                        value={10}
                        name={data.stepBcheckboxName}
                        aria-label="G2"
                        icon={
                          <FiberManualRecord
                            className={classes.radioUnchecked}
                          />
                        }
                        checkedIcon={
                          <FiberManualRecord className={classes.radioChecked} />
                        }
                        classes={{
                          checked: classes.radio,
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                    }}
                    label="Da"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={checkedB === "0"}
                        onChange={nameHandler}
                        value={0}
                        name={data.stepBcheckboxName}
                        aria-label="G2"
                        icon={
                          <FiberManualRecord
                            className={classes.radioUnchecked}
                          />
                        }
                        checkedIcon={
                          <FiberManualRecord className={classes.radioChecked} />
                        }
                        classes={{
                          checked: classes.radio,
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                    }}
                    label="Ne"
                  />
                </div>
                <div className={classes.wrapperDiv}>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={checkedB === "na"}
                        onChange={nameHandler}
                        value={"na"}
                        name={data.stepBcheckboxName}
                        aria-label="G2"
                        icon={
                          <FiberManualRecord
                            className={classes.radioUnchecked}
                          />
                        }
                        checkedIcon={
                          <FiberManualRecord className={classes.radioChecked} />
                        }
                        classes={{
                          checked: classes.radio,
                        }}
                      />
                    }
                    classes={{
                      label: classes.label,
                    }}
                    label="N/A"
                  />
                </div>
              </RadioGroup>
            </FormControl>
          </div>
        </GridItem>
      </GridContainer>
      <div className={classes.upDivider} />
      <Divider variant="middle" />
      <div className={classes.divider} />
    </div>
  );
}
