import React, { useState, useCallback, useContext, useEffect } from "react";
import Form from "../../../components/Form/Form";
import FormField from "../../../components/FormField/FormField";
import { getDateRange, getDateRangeByDate } from "../../../utils/helpers";
import Box from "../../../components/Box/Box";
import SubmitButton from "../../../components/SubmitButton/SubmitButton";
import DatePicker from "../../../components/DatePicker/DatePicker";
import UserStore from "../../../stores/UserStore";
import { ServiceApi } from "../../../utils/api";
import moment from "moment";
import SiteModal from "../../../components/SiteModal/SiteModal";
import Loader from "react-loader";
import { Redirect } from "react-router-dom";

const Cleaning = () => {
  const [room, setRoom] = useState();
  const [redirect, setRedirect] = useState(false);
  const [success, setSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState({
    text: "",
    title: "ניקיון"
  });
  const [loading, setLoading] = useState(false);
  const allowedDates = room
    ? getDateRangeByDate(new Date(), new Date(room.enddate))
    : getDateRange(new Date(), 5);
  const [date, setDate] = useState();
  const userStore = useContext(UserStore);
  const { user } = userStore.user;
  const handleDateChange = selectedDate => setDate(selectedDate);
  const handleFormSubmit = useCallback(async () => {
    try {
      setLoading(true);
      await ServiceApi.cleaning(user.room, moment(date).format("MM/DD/YYYY"));
      setSuccess(true);
      setModal({
        ...modal,
        text: "בקשתך התקבלה ותטופל בהתאם"
      });
      setModalOpen(true);
    } catch (e) {
      setModal({
        ...modal,
        text: "בקשה נכשלה. נסה תאריך אחר."
      });
      setModalOpen(true);
    }
    setLoading(false);
  }, [date, modal, user.room]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const _room = await userStore.getRoomData();
        setRoom(_room);
        setDate(allowedDates[0]);
      } catch (e) {}
      setLoading(false);
    })();
  }, [room]);

  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <Loader loaded={!loading}>
      <Form onSubmit={handleFormSubmit}>
        <Box>
          <Box>
            <FormField title="בחר תאריך">
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                allowedDates={allowedDates}
              />
            </FormField>
          </Box>
          <Box>
            <SubmitButton>שלח</SubmitButton>
          </Box>
        </Box>
      </Form>
      <SiteModal
        open={modalOpen}
        text={modal.text}
        title={modal.title}
        onClose={() => (success ? setRedirect(true) : setModalOpen(false))}
      />
    </Loader>
  );
};

export default Cleaning;
