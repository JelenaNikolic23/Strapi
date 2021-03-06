import React from "react";
import axios from "axios";
import { backend_address as serverip } from "../../../../config/backend";
import request_config from "../../../../helpers/RequestConfig";

import Button from "components/CustomButtons/Button.jsx";
import Typography from "@material-ui/core/Typography";

function FormSubmit({ setSavedReportId, setNotification, kategorije }) {
  console.log(kategorije);
  const {
    ShopPerformans,
    ProdajniPristup,
    ManagementOsoblja,
    MerchAndShopLayout,
    AdministrativniPoslovi
  } = kategorije;

  const selectedEvaluation = localStorage.getItem("selectedEvaluation");
  const selectedShop = JSON.parse(localStorage.getItem("selectedShop"));
  const globalComment = JSON.parse(localStorage.getItem("GlobalComment"));

  const evaluator = {
    frontline_id: localStorage.getItem("frontline_id"),
    fullname: localStorage.getItem("fullname"),
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    frontline_groups: JSON.parse(localStorage.getItem("frontline_groups"))
  };

  const ShopReport = {
    type: "ShopReport",
    evaluation: {
      categories: [
        {
          categoryName: "Shop Performans",
          categorySteps: [
            {
              stepName: `Small Screen Consumer GA target je ostvaren?`,
              stepValue: ShopPerformans.A1
            },
            {
              stepName: `Small Screen SoHo GA target je ostvaren?`,
              stepValue: ShopPerformans.A2
            },
            {
              stepName: `Large Screen GA target je ostvaren?`,
              stepValue: ShopPerformans.A3
            },
            {
              stepName: `Pre paid GA target je ostvaren?`,
              stepValue: ShopPerformans.A4
            },
            {
              stepName: `Overall Renewal target je ostvaren?`,
              stepValue: ShopPerformans.A5
            },
            {
              stepName: `Overall upselling target je ostvaren?`,
              stepValue: ShopPerformans.A6
            },
            {
              stepName: `Overall Accessories target je ostvaren?`,
              stepValue: ShopPerformans.A7
            },
            {
              stepName: `Pre to post target za konzjumer je ostvaren?`,
              stepValue: ShopPerformans.A8
            },
            {
              stepName: `Kosmos target za konzjumer je ostvaren?`,
              stepValue: ShopPerformans.A9
            },
            {
              stepName: `Target banke je ostvaren?`,
              stepValue: ShopPerformans.A10
            },
            {
              stepName: `Da li prodavci znaju target shopa i trenutni performans?`,
              stepValue: ShopPerformans.A11
            },
            {
              stepName: `Da li prodavac zna svoj dnevni target i mese??no ostvarenje (run rate i trenutni %)?`,
              stepValue: ShopPerformans.A12
            }
          ],
          categoryComment: ShopPerformans.feedback
        },
        {
          categoryName: "Management Osoblja",
          categorySteps: [
            {
              stepName: `Shop Manager pru??a podr??ku prodavcima u front office-u?`,
              stepValue: ManagementOsoblja.C1
            },
            {
              stepName: `Shop Manager isporu??uje prodajni rezultat baziran na njenim/njegovim li??nim targetima? Ostvaruje individulane targete?`,
              stepValue: ManagementOsoblja.C2
            },
            {
              stepName: `Raspored smena pokriva pikove pose??enosti prodavnice?`,
              stepValue: ManagementOsoblja.C3
            },
            {
              stepName: `Zaposleni u prodavnici su informisani o najnovijim procedurama, proizvodima/uslugama, kampanjama, Incentivima u prodaji, izmenama na sistemima i sl.?`,
              stepValue: ManagementOsoblja.C4
            },
            {
              stepName: `Shop manager redovno daje feedback ??lanovima tima?`,
              stepValue: ManagementOsoblja.C5
            },
            {
              stepName: `Korisnici ne ??ekaju dugo da budu uslu??eni (minimal waiting time)?`,
              stepValue: ManagementOsoblja.C6
            },
            {
              stepName: `Postoje li izlasci korisnika iz prodavnice koji su ostali neuslu??eni - da im se niko nije obratio (low walkout rate)?`,
              stepValue: ManagementOsoblja.C7
            }
          ],
          categoryComment: ManagementOsoblja.feedback
        },
        {
          categoryName: "Merchandising and Shop Layout",
          categorySteps: [
            {
              stepName: `Shop je ??ist i spreman za korisnike?`,
              stepValue: MerchAndShopLayout.D1
            },
            {
              stepName: `Spoljna reklama je ??ista i u potpunosti funkcionalna?`,
              stepValue: MerchAndShopLayout.D2
            },
            {
              stepName: `Komunikacione podloge i paneli (uklj. Logo Wall) su u skladu sa poslednjim komunikacionim standardima?`,
              stepValue: MerchAndShopLayout.D3
            },
            {
              stepName: `Svi ??ivi ure??aji su uklju??eni, konektovani na punjenje i propisno obezbe??eni?`,
              stepValue: MerchAndShopLayout.D4
            },
            {
              stepName: `Svi ??ivi ure??aji su izlo??eni po poslednjim mer??ndajzing standardima  (layout, pozicija, cene, info blokovi, retail mode i sl.)?`,
              stepValue: MerchAndShopLayout.D5
            },
            {
              stepName: `Dodatne oprema je izlo??ena propisno sa istaknutim cenama?`,
              stepValue: MerchAndShopLayout.D6
            },
            {
              stepName: `Back office is je ??ist i propisno ure??en?`,
              stepValue: MerchAndShopLayout.D7
            },
            {
              stepName: `Svi materijali su slo??eni i sortirani na mestima predvi??enim za njih (ormari, ostave, police???)?`,
              stepValue: MerchAndShopLayout.D8
            },
            {
              stepName: `IT oprema (lap-topovi, ??tampa??i, TV, alarmne centrale itd.) funkcioni??e kako treba`,
              stepValue: MerchAndShopLayout.D9
            },
            {
              stepName: `Atmosfera u prodavnici je odr??avana u skladu sa preporu??enim standardima (muzika, osve??iva??i, osvetljenje...)`,
              stepValue: MerchAndShopLayout.D10
            },
            {
              stepName: `Prodavci nose propisane uniforme, prilago??ene Telenor retail standardima (??iste, ispeglane)?`,
              stepValue: MerchAndShopLayout.D11
            }
          ],
          categoryComment: MerchAndShopLayout.feedback
        },
        {
          categoryName: "Administrativni Poslovi",
          categorySteps: [
            {
              stepName: `Svi administrativni poslovi su zavr??eni na vreme?`,
              stepValue: AdministrativniPoslovi.E1
            },
            {
              stepName: `Da li je individualni performans prodavaca evaluiran od strane shop manager-a na  nedeljnom nivou?`,
              stepValue: AdministrativniPoslovi.E2
            },
            {
              stepName: `Pretplatni??ki ugovori i ostala dokumentacija je poslata u Arhivu?`,
              stepValue: AdministrativniPoslovi.E3
            },
            {
              stepName: `Zalihama robe se upravlja na prodajnom mestu u skladu sa kategorizacijom prodavnice?`,
              stepValue: AdministrativniPoslovi.E4
            },
            {
              stepName: `Oglasne i bele table su a??urirane redovno i u skladu sa o??ekivanjima?`,
              stepValue: AdministrativniPoslovi.E5
            },
            {
              stepName: `Knjige na prodajnom mestu su ura??ene, od??tampane, potpisane, verifikovane pe??atom za  poslednji radni dan?`,
              stepValue: AdministrativniPoslovi.E6
            },
            {
              stepName: `Koa??ing sesije, Development planovi zaposlenih i Evaluacije su dokumentovani u skladu sa standardima?`,
              stepValue: AdministrativniPoslovi.E7
            },
            {
              stepName: `Zadaci definisani od strane Regionalnog menad??era su zavr??eni na vreme?`,
              stepValue: AdministrativniPoslovi.E8
            }
          ],
          categoryComment: AdministrativniPoslovi.feedback
        }
      ],
      ProdajniPristup: {
        evaluation5G: selectedEvaluation,
        categorySteps: [
          {
            stepName: `Odnos Ponuda / Uslu??eni korisnici (Offer Rate)? (5 points for ratio >2.  =1 for ratio <1)
                  `,
            stepValue: ProdajniPristup.B1
          },
          {
            stepName: `Prodavac zna elemente poslednjeg feedback-a i deluje u skladu sa dobijenim smernicama
                  `,
            stepValue: ProdajniPristup.B2
          },
          {
            stepName: `Prodavac zna definisane akcije iz poslednje kou??ing sesije i deluje u skladu sa njima (menja obrazac pona??anja)`,
            stepValue: ProdajniPristup.B3
          }
        ]
      }
    },
    shop: selectedShop,
    evaluator,
    globalComment: globalComment
  };

  function submitForm(e) {
    //e.preventDefault();

    // Axios post request - add evaluation to MongoDB
    axios
      .post(`${serverip}/api/shopReports/add`, ShopReport, request_config())
      .then(res => {
        setNotification("ShopReportSuccess");
        const id = res.data.id;
        const shopData = res.data.shopData;
        localStorage.setItem("ShopReportID", id);
        localStorage.setItem(`ShopData`, JSON.stringify(shopData));
        localStorage.removeItem("selectedShop");
        localStorage.removeItem("ProdajniPristup");
        localStorage.removeItem("ShopPerformans");
        localStorage.removeItem("ManagementOsoblja");
        localStorage.removeItem("MerchAndShopLayout");
        localStorage.removeItem("AdministrativniPoslovi");
        localStorage.removeItem("lastDayEvaluations");
        localStorage.removeItem("selectedEvaluation");
        localStorage.removeItem("CompletedSteps");
        setSavedReportId(id);
      })
      .catch(err => {
        setNotification("ShopReportFailed");
        console.log(err);
      });
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography component={"span"} style={{ marginBottom: "1rem" }}>
        Svi koraci su ura??eni
      </Typography>
      <Button color="primary" onClick={submitForm}>
        Snimi Shop Report
      </Button>
    </div>
  );
}

export default FormSubmit;
