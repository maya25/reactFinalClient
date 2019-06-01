import { pool } from "../../utils/icons";
import Spa from "./Spa";
import MySpa from "./MySpa";

export const metadata = {
  title: "ספא",
  icon: pool
};

export const treatmentNames = ["מסאז' ברגליים", "מסאז' בגב", "טיפולי פנים"];

export const pageLinks = [
  {
    title: "הזמנת טיפול",
    component: Spa,
    path: "/spa/treatments"
  },
  {
    title: "הטיפולים שלי",
    component: MySpa,
    path: "/spa/mytreatments"
  }
];
