// @side bar icons
import Dashboard from "./assets/img/pocetna.svg";
import LibraryBooks from "./assets/img/izvestaji.svg";
import LocationOn from "./assets/img/evaluacije.svg";
//import School from "@material-ui/icons/School";
// background images
import staff from "./assets/img/zaposleni.jpg";
import shop from "./assets/img/shop.jpg";
import retailMap from "./assets/img/5g+-evaluation.jpg";
import feedback from "./assets/img/feedback.jpg";
import coaching from "./assets/img/coaching.jpg";
import evaluation7P from "./assets/img/7p-evaluation.jpg";
import regions from "./assets/img/regions.jpg";
import prodavnica from "./assets/img/prodavnica.jpg";

// core components/views for /admin layout
import Home from "./views/Home/Home.jsx";
import Evaluations from "./views/Evaluations/Evaluations.jsx";
import Reports from "./views/Reports/Reports.jsx";
// core components/views for /admin/evaluations layout
import Evaluation5G from "./views/Evaluations/5G/Evaluation5G.jsx";
import ShopReport from "./views/Evaluations/ShopReport/ShopReport.jsx";
import Feedback from "./views/Evaluations/Feedback/Feedback.jsx";
import Coaching from "./views/Evaluations/Coaching/Coaching.jsx";
import Evaluation7P from "./views/Evaluations/7P/7P.jsx";
// core components/views for /admin/reports layout
import Regions from "./views/Reports/Regions/Regions.jsx";
import RegionProfile from "./views/Reports/Regions/Profile.jsx";
import Shops from "./views/Reports/Shops/Shops.jsx";
import ShopProfile from "./views/Reports/Shops/Profile.jsx";
import People from "./views/Reports/People/People.jsx";
import Profile from "./views/Reports/People/Profile.jsx";
import Detailed5G from "./views/Reports/People/Detailed5G.jsx";
import Detailed7P from "./views/Reports/People/Detailed7P";
import DetailedShopReport from "./views/Reports/Shops/ProfileComponents/DetailedShopReport/DetailedShopReport.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Početna",
    icon: Dashboard,
    component: Home,
    layout: "/admin",
  },
  {
    path: "/evaluations",
    name: "Evaluacije",
    icon: LocationOn,
    component: Evaluations,
    layout: "/admin",
  },
  {
    path: "/reports",
    name: "Izveštaji",
    icon: LibraryBooks,
    component: Reports,
    layout: "/admin",
  },
  {
    path: "/5G",
    name: "5G",
    backgroundImage: "url(" + retailMap + ")",
    component: Evaluation5G,
    layout: "/admin/evaluations",
  },
  {
    path: "/7P",
    name: "7P",
    backgroundImage: "url(" + evaluation7P + ")",
    component: Evaluation7P,
    layout: "/admin/evaluations",
  },
  {
    path: "/shop-report",
    name: "Shop Report",
    backgroundImage: "url(" + shop + ")",
    component: ShopReport,
    layout: "/admin/evaluations",
  },
  {
    path: "/feedback",
    name: "Feedback",
    backgroundImage: "url(" + feedback + ")",
    component: Feedback,
    layout: "/admin/evaluations",
  },
  {
    path: "/coaching",
    name: "Coaching",
    backgroundImage: "url(" + coaching + ")",
    component: Coaching,
    layout: "/admin/evaluations",
  },
  // {
  //   path: "/performance",
  //   name: "Performance",
  //   backgroundImage: "url(" + performance + ")",
  //   component: Performance,
  //   layout: "/admin/evaluations"
  // },
  {
    path: "/regions",
    name: "Regioni",
    category: "reports",
    backgroundImage: "url(" + regions + ")",
    component: Regions,
    layout: "/admin/reports",
  },
  {
    path: "/regions/:region_id",
    name: "Region Profile",
    icon: LocationOn,
    component: RegionProfile,
    layout: "/admin/reports",
  },
  {
    path: "/shops",
    name: "Prodavnice",
    category: "reports",
    backgroundImage: "url(" + prodavnica + ")",
    component: Shops,
    layout: "/admin/reports",
  },
  {
    path: "/shops/:shop_id",
    name: "Shop Profile",
    icon: LocationOn,
    component: ShopProfile,
    layout: "/admin/reports",
  },
  {
    path: "/shops/:shop_id/:shopReport_id",
    name: "Shop Profile",
    icon: LocationOn,
    component: DetailedShopReport,
    layout: "/admin/reports",
  },
  {
    path: "/people",
    name: "Zaposleni",
    category: "reports",
    backgroundImage: "url(" + staff + ")",
    component: People,
    layout: "/admin/reports",
  },
  {
    path: "/people/:frontline_id",
    name: "Profile",
    icon: LocationOn,
    component: Profile,
    layout: "/admin/reports",
  },
  {
    path: "/people/:frontline_id/:evaluationId",
    name: "Evaluation",
    icon: LocationOn,
    component: Detailed5G,
    layout: "/admin/reports",
  },
  {
    path: "/people/7P/:frontline_id/:evaluationId",
    name: "Evaluation7P",
    icon: LocationOn,
    component: Detailed7P,
    layout: "/admin/reports",
  },
];

export default dashboardRoutes;
