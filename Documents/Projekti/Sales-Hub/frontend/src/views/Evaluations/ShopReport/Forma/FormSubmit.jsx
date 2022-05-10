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
              stepName: `Da li prodavac zna svoj dnevni target i mesečno ostvarenje (run rate i trenutni %)?`,
              stepValue: ShopPerformans.A12
            }
          ],
          categoryComment: ShopPerformans.feedback
        },
        {
          categoryName: "Management Osoblja",
          categorySteps: [
            {
              stepName: `Shop Manager pruža podršku prodavcima u front office-u?`,
              stepValue: ManagementOsoblja.C1
            },
            {
              stepName: `Shop Manager isporučuje prodajni rezultat baziran na njenim/njegovim ličnim targetima? Ostvaruje individulane targete?`,
              stepValue: ManagementOsoblja.C2
            },
            {
              stepName: `Raspored smena pokriva pikove posećenosti prodavnice?`,
              stepValue: ManagementOsoblja.C3
            },
            {
              stepName: `Zaposleni u prodavnici su informisani o najnovijim procedurama, proizvodima/uslugama, kampanjama, Incentivima u prodaji, izmenama na sistemima i sl.?`,
              stepValue: ManagementOsoblja.C4
            },
            {
              stepName: `Shop manager redovno daje feedback članovima tima?`,
              stepValue: ManagementOsoblja.C5
            },
            {
              stepName: `Korisnici ne čekaju dugo da budu usluženi (minimal waiting time)?`,
              stepValue: ManagementOsoblja.C6
            },
            {
              stepName: `Postoje li izlasci korisnika iz prodavnice koji su ostali neusluženi - da im se niko nije obratio (low walkout rate)?`,
              stepValue: ManagementOsoblja.C7
            }
          ],
          categoryComment: ManagementOsoblja.feedback
        },
        {
          categoryName: "Merchandising and Shop Layout",
          categorySteps: [
            {
              stepName: `Shop je čist i spreman za korisnike?`,
              stepValue: MerchAndShopLayout.D1
            },
            {
              stepName: `Spoljna reklama je čista i u potpunosti funkcionalna?`,
              stepValue: MerchAndShopLayout.D2
            },
            {
              stepName: `Komunikacione podloge i paneli (uklj. Logo Wall) su u skladu sa poslednjim komunikacionim standardima?`,
              stepValue: MerchAndShopLayout.D3
            },
            {
              stepName: `Svi živi uređaji su uključeni, konektovani na punjenje i propisno obezbeđeni?`,
              stepValue: MerchAndShopLayout.D4
            },
            {
              stepName: `Svi živi uređaji su izloženi po poslednjim merčndajzing standardima  (layout, pozicija, cene, info blokovi, retail mode i sl.)?`,
              stepValue: MerchAndShopLayout.D5
            },
            {
              stepName: `Dodatne oprema je izložena propisno sa istaknutim cenama?`,
              stepValue: MerchAndShopLayout.D6
            },
            {
              stepName: `Back office is je čist i propisno uređen?`,
              stepValue: MerchAndShopLayout.D7
            },
            {
              stepName: `Svi materijali su složeni i sortirani na mestima predviđenim za njih (ormari, ostave, police…)?`,
              stepValue: MerchAndShopLayout.D8
            },
            {
              stepName: `IT oprema (lap-topovi, štampači, TV, alarmne centrale itd.) funkcioniše kako treba`,
              stepValue: MerchAndShopLayout.D9
            },
            {
              stepName: `Atmosfera u prodavnici je održavana u skladu sa preporučenim standardima (muzika, osveživači, osvetljenje...)`,
              stepValue: MerchAndShopLayout.D10
            },
            {
              stepName: `Prodavci nose propisane uniforme, prilagođene Telenor retail standardima (čiste, ispeglane)?`,
              stepValue: MerchAndShopLayout.D11
            }
          ],
          categoryComment: MerchAndShopLayout.feedback
        },
        {
          categoryName: "Administrativni Poslovi",
          categorySteps: [
            {
              stepName: `Svi administrativni poslovi su završeni na vreme?`,
              stepValue: AdministrativniPoslovi.E1
            },
            {
              stepName: `Da li je individualni performans prodavaca evaluiran od strane shop manager-a na  nedeljnom nivou?`,
              stepValue: AdministrativniPoslovi.E2
            },
            {
              stepName: `Pretplatnički ugovori i ostala dokumentacija je poslata u Arhivu?`,
              stepValue: AdministrativniPoslovi.E3
            },
            {
              stepName: `Zalihama robe se upravlja na prodajnom mestu u skladu sa kategorizacijom prodavnice?`,
              stepValue: AdministrativniPoslovi.E4
            },
            {
              stepName: `Oglasne i bele table su ažurirane redovno i u skladu sa očekivanjima?`,
              stepValue: AdministrativniPoslovi.E5
            },
            {
              stepName: `Knjige na prodajnom mestu su urađene, odštampane, potpisane, verifikovane pečatom za  poslednji radni dan?`,
              stepValue: AdministrativniPoslovi.E6
            },
            {
              stepName: `Koačing sesije, Development planovi zaposlenih i Evaluacije su dokumentovani u skladu sa standardima?`,
              stepValue: AdministrativniPoslovi.E7
            },
            {
              stepName: `Zadaci definisani od strane Regionalnog menadžera su završeni na vreme?`,
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
            stepName: `Odnos Ponuda / Usluženi korisnici (Offer Rate)? (5 points for ratio >2.  =1 for ratio <1)
                  `,
            stepValue: ProdajniPristup.B1
          },
          {
            stepName: `Prodavac zna elemente poslednjeg feedback-a i deluje u skladu sa dobijenim smernicama
                  `,
            stepValue: ProdajniPristup.B2
          },
          {
            stepName: `Prodavac zna definisane akcije iz poslednje koučing sesije i deluje u skladu sa njima (menja obrazac ponašanja)`,
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
        Svi koraci su urađeni
      </Typography>
      <Button color="primary" onClick={submitForm}>
        Snimi Shop Report
      </Button>
    </div>
  );
}

export default FormSubmit;
