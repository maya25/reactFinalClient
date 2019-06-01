import { event } from "../../utils/icons";
import AllEvents from "./components/AllEvents";
import MyEvents from "./components/MyEvents";

export const metadata = {
  title: "אירועים ופעילויות",
  icon: event
};

export const pageLinks = [
  {
    title: "ראשי",
    component: AllEvents,
    path: "/events/all"
  },
  {
    title: "הפעילויות שלי",
    component: MyEvents,
    path: "/events/summary"
  }
];

export const eventTypes = {
  'kids': 'ילדים',
  'adults': 'מבוגרים',
  'gambling': 'הימורים',
  'family': 'משפחה'
}