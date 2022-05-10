import React, { useState, useEffect } from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../config/backend";
import request_config from "../../../helpers/RequestConfig";

// core components
import Category from "../5G/Category";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeaderSearch from "components/Card/CardHeaderSearch.jsx";
import CardBody from "components/Card/CardBody.jsx";
import MultilineInput from "components/CustomInput/MultilineInput.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Modal from "components/Modal/Modal";
import SubmitNotification from "components/Snackbar/SubmitNotification.jsx";

import data from "./evaluation7pData";

const Evaluation7P = () => {
  const [evaluation, setEvaluation] = useState({
    P1A: "10",
    P1B: "10",
    P2A: "10",
    P2B: "10",
    P3A: "10",
    P3B: "10",
    P4A: "10",
    P4B: "10",
    P5A: "10",
    P5B: "10",
    P6A: "10",
    P6B: "10",
    P7A: "10",
    P7B: "10",
    feedback: "",
  });

  const [usersArray, setUsersArray] = useState([]);

  const [selectedUser, setSelecedtUser] = useState({});
  const [evaluator, setEvaluator] = useState({});

  const [evaluationSaved, setEvaluationSaved] = useState(false);
  const [evaluationSaveError, setEvaluationSaveError] = useState(false);

  useEffect(() => {
    setEvaluator({
      frontline_id: localStorage.getItem("frontline_id"),
      fullname: localStorage.getItem("fullname"),
      username: localStorage.getItem("username"),
      email: localStorage.getItem("email"),
      frontline_groups: JSON.parse(localStorage.getItem("frontline_groups")),
    });

    const getUsers = async () => {
      let res = await axios.get(`${serverip}/api/users`, request_config());
      let { users } = res.data;
      setUsersArray(users);
    };
    getUsers();

    if (JSON.parse(localStorage.getItem("selectedUser"))) {
      const selectedUser = JSON.parse(localStorage.getItem("selectedUser"));

      setSelecedtUser(selectedUser);
    }
  }, []);

  const setUser = (selectedUser) => {
    setSelecedtUser(selectedUser);
  };

  const handleChangeEnabled = (event) => {
    setEvaluation({
      ...evaluation,
      [event.target.name]: event.target.value,
    });
  };

  const closeSnackbar = () => {
    setEvaluationSaved(false);
  };

  const closeSnackbarError = () => {
    setEvaluationSaveError(false);
  };

  const prepareStepScore = (stepScore) => {
    switch (stepScore) {
      case "10":
        return 10;
      case "0":
        return 0;
      case "na":
        return 0;
      default:
        return null;
    }
  };

  const prepareStepValue = (stepVal) => {
    switch (stepVal) {
      case "10":
        return "Da";
      case "0":
        return "Ne";
      case "na":
        return "na";
      default:
        return null;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const {
      P1A,
      P1B,
      P2A,
      P2B,
      P3A,
      P3B,
      P4A,
      P4B,
      P5A,
      P5B,
      P6A,
      P6B,
      P7A,
      P7B,
      feedback,
    } = evaluation;

    // Broj n/a obeleženih polja
    let formWeight = 140;

    formWeight -= P1A === "na" ? 10 : 0;
    formWeight -= P1B === "na" ? 10 : 0;
    formWeight -= P2A === "na" ? 10 : 0;
    formWeight -= P2B === "na" ? 10 : 0;
    formWeight -= P3A === "na" ? 10 : 0;
    formWeight -= P3B === "na" ? 10 : 0;
    formWeight -= P4A === "na" ? 10 : 0;
    formWeight -= P4B === "na" ? 10 : 0;
    formWeight -= P5A === "na" ? 10 : 0;
    formWeight -= P5B === "na" ? 10 : 0;
    formWeight -= P6A === "na" ? 10 : 0;
    formWeight -= P6B === "na" ? 10 : 0;
    formWeight -= P7A === "na" ? 10 : 0;
    formWeight -= P7B === "na" ? 10 : 0;

    // Vrednosti su prvobitno bile u string formatu jer radio button ne moze da posalje u state neki value ako je u number formatu. Ovde ih sve konvertujemo u number format kako bi dobili finalni score
    const totalScore =
      ((prepareStepScore(P1A) +
        prepareStepScore(P1B) +
        prepareStepScore(P2A) +
        prepareStepScore(P2B) +
        prepareStepScore(P3A) +
        prepareStepScore(P3B) +
        prepareStepScore(P4A) +
        prepareStepScore(P4B) +
        prepareStepScore(P5A) +
        prepareStepScore(P5B) +
        prepareStepScore(P6A) +
        prepareStepScore(P6B) +
        prepareStepScore(P7A) +
        prepareStepScore(P7B)) /
        formWeight) *
      100;

    const newEvaluation = {
      type: "7P",
      evaluation: {
        score: Math.round(totalScore),
        categories: [
          {
            categoryName: "Priprema",
            categoryWeight: 20,
            categoryScore: prepareStepScore(P1A) + prepareStepScore(P1B),
            categorySteps: [
              {
                stepName:
                  "Prodavac pregleda sve dostupne informacije koje vidi na ekranu (do kad traje i razlog UO, uređaj koji koristi, račun i stavke na njemu, aktivne/dostupne kampanje, tarifne dodatke, ako je prepaid broj: koliko često dopunjuje svoj broj, da li je adresa u footprintu).",
                stepWeight: 10,
                stepScore: prepareStepScore(P1A),
                stepValue: prepareStepValue(P1A),
              },
              {
                stepName:
                  "Prodavac pregleda sve ugovore korisnika i sve informacije u vezi sa brojevima (do kad traje i razlog UO, uređaj koji koristi, račun i stavke na njemu, aktivne/dostupne kampanje, tarifne dodatke, ako je prepaid broj: koliko često dopunjuje svoj broj)",
                stepWeight: 10,
                stepScore: prepareStepScore(P1B),
                stepValue: prepareStepValue(P1B),
              },
            ],
          },
          {
            categoryName: "Predstavljanje",
            categoryWeight: 20,
            categoryScore: prepareStepScore(P2A) + prepareStepScore(P2B),
            categorySteps: [
              {
                stepName:
                  "Prodavac se predstavlja tako što zvuči kao komšija koji se nalazi na korisniku dobro poznatoj lokaciji.",
                stepWeight: 10,
                stepScore: prepareStepScore(P2A),
                stepValue: prepareStepValue(P2A),
              },
              {
                stepName:
                  "Prodavac otvara razgovor sa prijatnim pitanjem poput „kako ste“; „kako provodite vreme“ i sl.",
                stepWeight: 10,
                stepScore: prepareStepScore(P2B),
                stepValue: prepareStepValue(P2B),
              },
            ],
          },
          {
            categoryName: "Pecanje",
            categoryWeight: 20,
            categoryScore: prepareStepScore(P3A) + prepareStepScore(P3B),
            categorySteps: [
              {
                stepName:
                  "Prodavac ne pita da li korisnik ima vremena već mudro kaže „verujem da imate 2 min...“",
                stepWeight: 10,
                stepScore: prepareStepScore(P3A),
                stepValue: prepareStepValue(P3A),
              },
              {
                stepName:
                  "Prodavac peca korisnika koristeći reči poput popusti, novine, specijalne akcije, samo do kraja meseca, specijalna mogućnost za Vas i sl…",
                stepWeight: 10,
                stepScore: prepareStepScore(P3B),
                stepValue: prepareStepValue(P3B),
              },
            ],
          },
          {
            categoryName: "Pravac",
            categoryWeight: 20,
            categoryScore: prepareStepScore(P4A) + prepareStepScore(P4B),
            categorySteps: [
              {
                stepName: "Prodavac testira ideju šta bi tu sve moglo.",
                stepWeight: 10,
                stepScore: prepareStepScore(P4A),
                stepValue: prepareStepValue(P4A),
              },
              {
                stepName:
                  "Prodavac brzo i spontano povede razgovor u drugom smeru ako ga korisnik odbije za prvu ideju.",
                stepWeight: 10,
                stepScore: prepareStepScore(P4B),
                stepValue: prepareStepValue(P4B),
              },
            ],
          },
          {
            categoryName: "Potencijal",
            categoryWeight: 20,
            categoryScore: prepareStepScore(P5A) + prepareStepScore(P5B),
            categorySteps: [
              {
                stepName:
                  "Prodavac uključuje korisnika kroz prijatna pitanja kako bi mu stvorio želju za kupovinom.",
                stepWeight: 10,
                stepScore: prepareStepScore(P5A),
                stepValue: prepareStepValue(P5A),
              },
              {
                stepName: "Prodavac koristi jezik korisnika.",
                stepWeight: 10,
                stepScore: prepareStepScore(P5B),
                stepValue: prepareStepValue(P5B),
              },
            ],
          },
          {
            categoryName: "Ponuda",
            categoryWeight: 20,
            categoryScore: prepareStepScore(P6A) + prepareStepScore(P6B),
            categorySteps: [
              {
                stepName:
                  "Prodavac se nadovezuje na ono što je čuo u prethodnom koraku.",
                stepWeight: 10,
                stepScore: prepareStepScore(P6A),
                stepValue: prepareStepValue(P6A),
              },
              {
                stepName:
                  "Prodavac iznosi konkretnu ponudu i ne opterećuje korisnika svim cenama, načinima plaćanja i opcijama.",
                stepWeight: 10,
                stepScore: prepareStepScore(P6B),
                stepValue: prepareStepValue(P6B),
              },
            ],
          },
          {
            categoryName: "Pozdrav",
            categoryWeight: 20,
            categoryScore: prepareStepScore(P7A) + prepareStepScore(P7B),
            categorySteps: [
              {
                stepName:
                  "Prodavac zatvara razgovor prijatno tako da zna kada će korisnik doći u prodavnicu/ostaje na vezi dok korisnik odgovori sa DA.",
                stepWeight: 10,
                stepScore: prepareStepScore(P7A),
                stepValue: prepareStepValue(P7A),
              },
              {
                stepName:
                  "Prodavac zadržava prijatan ton i ako korisnik nije zainteresovan ističući zašto je dobro da dođe u prodavnicu.",
                stepWeight: 10,
                stepScore: prepareStepScore(P7B),
                stepValue: prepareStepValue(P7B),
              },
            ],
          },
        ],
        feedback: feedback,
      },
      user: {
        frontline_id: selectedUser.id,
        fullname: selectedUser.fullname,
        username: selectedUser.username,
        email: selectedUser.email,
        group_name: selectedUser.group_name,
        group_id: selectedUser.group_id,
        group_nest_left: selectedUser.group_nest_left,
        group_nest_right: selectedUser.group_nest_right,
        group_nest_depth: selectedUser.group_nest_depth,
        group_parent_id: selectedUser.group_parent_id,
      },
      evaluator: {
        frontline_id: evaluator.frontline_id,
        fullname: evaluator.fullname,
        username: evaluator.username,
        email: evaluator.email,
        frontline_groups: evaluator.frontline_groups,
      },
    };

    // Axios post request - add evaluation to MongoDB
    axios
      .post(`${serverip}/api/7ps/add`, newEvaluation, request_config())
      .then((res) => {
        // Remove selectedUser from local storage
        localStorage.removeItem("selectedUser");

        setEvaluationSaved(true);
        setEvaluation({
          P1A: "10",
          P1B: "10",
          P2A: "10",
          P2B: "10",
          P3A: "10",
          P3B: "10",
          P4A: "10",
          P4B: "10",
          P5A: "10",
          P5B: "10",
          P6A: "10",
          P6B: "10",
          P7A: "10",
          P7B: "10",
          feedback: "",
        });
        setSelecedtUser({});
      })
      .catch((err) => {
        console.log(err);
        setEvaluationSaveError(true);
      });
  };

  const categoriesMap = data.map((cat, i) => {
    return (
      <Category
        key={data[i].categoryName}
        data={data[i]}
        //classes={classes}
        checkedA={evaluation[data[i].stepAcheckboxName]}
        checkedB={evaluation[data[i].stepBcheckboxName]}
        nameHandler={handleChangeEnabled}
      />
    );
  });

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <form onSubmit={onSubmit}>
            <Card>
              <CardHeaderSearch
                title="7P Evaluacija"
                searchItems={usersArray}
                selectItem={setUser}
                selectedItemName={selectedUser.fullname}
                searchPlaceholder="Pretraga prodavaca"
              />
              <CardBody>
                {categoriesMap}
                <MultilineInput
                  label="Posavetuj prodavca"
                  mandatory
                  placeholder="ponudi konkretne ideje koje će prodavcu pomoći da vodi efikasnije razgovore sa korisnicima"
                  inputValue={evaluation.feedback}
                  handleInputChange={handleChangeEnabled}
                />
              </CardBody>
              <CardFooter>
                <Modal
                  submit="submit"
                  selectedUser={selectedUser}
                  disabled={
                    Object.entries(selectedUser).length === 0 ||
                    evaluation.feedback.length === 0
                      ? true
                      : false
                  }
                />
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
      <SubmitNotification
        success={evaluationSaved}
        error={evaluationSaveError}
        closeSnackbarSuccess={closeSnackbar}
        closeSnackbarError={closeSnackbarError}
      />
    </>
  );
};

export default Evaluation7P;
