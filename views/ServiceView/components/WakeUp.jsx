import React, { useState, useCallback, useContext, useEffect } from "react";
import Form from "../../../components/Form/Form";
import FormField from "../../../components/FormField/FormField";
import Select from "../../../components/Select/Select";
import { getDateRange, getDateRangeByDate } from "../../../utils/helpers";
import Box from "../../../components/Box/Box";
import SubmitButton from "../../../components/SubmitButton/SubmitButton";
import { settings } from "../consts";
import DatePicker from "../../../components/DatePicker/DatePicker";
import moment from "moment";
import { ServiceApi } from "../../../utils/api";
import UserStore from "../../../stores/UserStore";
import Loader from "react-loader";
import SiteModal from "../../../components/SiteModal/SiteModal";
import { Redirect } from "react-router-dom";

const WakeUp = () => {
  const { wakeUp } = settings;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [time, setTime] = useState(wakeUp.times[0]);
  const [date, setDate] = useState();
  const [room, setRoom] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState({
    text: "",
    title: "השכמה"
  });
  const userStore = useContext(UserStore);
  const { user } = userStore.user;
  const handleDateChange = selectedDate => setDate(selectedDate);
  const handleTimeChange = event => setTime(event.target.value);
  const allowedDates = room
    ? getDateRangeByDate(new Date(), new Date(room.enddate))
    : getDateRange(new Date(), 5);

  const handleFormSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const [hours, minutes] = time.split(":");
      const _date = moment(date);
      _date.hours(parseInt(hours));
      _date.minutes(parseInt(minutes));
      await ServiceApi.wakeUp(user.room, _date.toISOString());
      setSuccess(true);
      setModal({
        ...modal,
        text: "בקשתך התקבלה ותטופל בהתאם"
      });
      setModalOpen(true);
    } catch (e) {
      setModal({
        ...modal,
        text: "לא עובד"
      });
      setModalOpen(true);
    }
    setLoading(false);
  }, [date, time, modal, modalOpen, loading, user.room]);

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
            <FormField title="בחר שעה">
              <Select
                items={wakeUp.times}
                value={time}
                onChange={handleTimeChange}
              />
            </FormField>
          </Box>
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
            <SubmitButton>הזמן</SubmitButton>
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

export default WakeUp;
