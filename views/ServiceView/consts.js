import { cleaning } from "../../utils/icons";
import MissingItems from "./components/MissingItems";
import Maintenance from "./components/Maintenance";
import WakeUp from "./components/WakeUp";
import Cleaning from "./components/Cleaning";
import { generateTimes } from "../../utils/helpers";

export const metadata = {
  title: "שירות חדרים",
  icon: cleaning
};

export const pageLinks = [
  {
    title: "חוסרים",
    component: MissingItems,
    path: "/room-service/missing-items"
  },
  {
    title: "תחזוקה",
    component: Maintenance,
    path: "/room-service/maintenance"
  },
  {
    title: "השכמה",
    component: WakeUp,
    path: "/room-service/wake-up"
  },
  {
    title: "ניקיון",
    component: Cleaning,
    path: "/room-service/cleaning"
  }
];

export const settings = {
  missingItems: {
    maxCovers: 4,
    maxPillows: 2,
    maxShampoos: 2,
    maxTowels: 2,
    maxRequestChars: 200
  },
  maintenance: {
    subjects: {
      tv: "טלוויזיה מקולקלת",
      safe: "כספת תקולה",
      ac: "מזגן לא עובד",
      shower: "אין מים חמים במקלחת",
      remote: "שלט מקולקל",
      kettle: "קומקום לא עובד"
    }
  },
  wakeUp: {
    times: generateTimes()
  }
};
