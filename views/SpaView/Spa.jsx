import React, { useEffect, useContext, useState, useCallback } from "react";
import Box from "../../components/Box/Box";
import { SpaApi } from "../../utils/api";
import UserStore from "../../stores/UserStore";
import Loader from "react-loader";
import FormField from "../../components/FormField/FormField";
import DatePicker from "../../components/DatePicker/DatePicker";
import { getDateRangeByDate, getDateRange } from "../../utils/helpers";
import moment from "moment";
import Select from "../../components/Select/Select";
import { treatmentNames } from "./consts";
import SiteModal from "../../components/SiteModal/SiteModal";
import { Redirect } from "react-router-dom";

const getTextSummary = (therapist, date, time, treatment) =>
  `הזמנתך התקבלה. טיפול ${treatment} נקבע בתאריך ${date}, בשעה ${time}. שם המטפל/ת: ${therapist}`;

const Spa = () => {
  const userStore = useContext(UserStore);
  const [room, setRoom] = useState();
  const [date, setDate] = useState();
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [success, setSuccess] = useState(false);
  const [treatments, setTreatments] = useState([]);
  const [treatmentName, setTreatmentName] = useState(treatmentNames[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await SpaApi.get(userStore.hotelId);
      const _treatments = result.data.data.filter(t => !t.occupied);
      setTreatments(_treatments);
      const room = await userStore.getRoomData();
      setRoom(room);
      setLoading(false);
    })();
  }, []);

  const handleTreatmentClick = useCallback(
    id => {
      (async () => {
        setLoading(true);
        try {
          await SpaApi.add(id);
          const treatment = treatments.find(t => t._id === id);
          setSuccess(true);
          setModalText(
            getTextSummary(
              treatment.therepist,
              treatment.string.date,
              treatment.string.time,
              treatmentName
            )
          );
          setModalOpen(true);
        } catch (e) {
          setModalText("לא ניתן להזמין את הטיפול");
          setModalOpen(true);
        }
        setLoading(false);
      })();
    },
    [treatments]
  );

  const handleDateChange = useCallback(date => {
    setDate(date);
  });

  const allowedDates = room
    ? getDateRangeByDate(new Date(), new Date(room.enddate))
    : getDateRange(new Date(), 5);

  const dateStr = moment(date).format("MM/DD/YYYY");
  const _treatments = treatments.filter(
    treatment => moment(treatment.date).format("MM/DD/YYYY") === dateStr
  );

  if (redirect) {
    return <Redirect to="/spa/mytreatments" />;
  }

  return (
    <Loader loaded={!loading}>
      <Box className="spa-view">
        <FormField title="בחר תאריך">
          <DatePicker
            onChange={handleDateChange}
            allowedDates={allowedDates}
            selected={date || allowedDates[0]}
          />
        </FormField>
        <FormField title="בחר סוג טיפול">
          <Select
            items={treatmentNames}
            value={treatmentName}
            onChange={event => setTreatmentName(event.target.value)}
          />
        </FormField>
        <FormField title="בחר טיפול">
          <SpaList list={_treatments} onItemClick={handleTreatmentClick} />
        </FormField>
      </Box>
      <SiteModal
        open={modalOpen}
        text={modalText}
        title="ספא"
        onClose={() => (success ? setRedirect(true) : setModalOpen(false))}
      />
    </Loader>
  );
};

const SpaList = ({ list, onItemClick }) => {
  if (!list || !list.length) {
    return <span>לא נמצאו טיפולים לתאריך זה</span>;
  }
  return (
    <ul>
      {list.map((item, idx) => (
        <SpaItem {...item} onClick={onItemClick} key={idx} />
      ))}
    </ul>
  );
};

const SpaItem = ({ therepist, _id, onClick, string }) => {
  const _onClick = () => {
    onClick(_id);
  };
  return (
    <li onClick={_onClick} className="spa-item">
      {therepist}, {string.time}
    </li>
  );
};

export default Spa;
