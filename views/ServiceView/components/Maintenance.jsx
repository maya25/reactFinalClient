import React, { useState, useContext, useCallback, useEffect } from "react";
import Form from "../../../components/Form/Form";
import FormField from "../../../components/FormField/FormField";
import { settings } from "../consts";
import Select from "../../../components/Select/Select";
import Box from "../../../components/Box/Box";
import SubmitButton from "../../../components/SubmitButton/SubmitButton";
import TextArea from "../../../components/TextArea/TextArea";
import UserStore from "../../../stores/UserStore";
import { ServiceApi } from "../../../utils/api";
import Loader from "react-loader";
import SiteModal from "../../../components/SiteModal/SiteModal";
import { Redirect } from "react-router-dom";

const MissingItems = () => {
  const { maintenance } = settings;
  const subjects = Object.keys(maintenance.subjects).map(key => ({
    value: key.toUpperCase(),
    text: maintenance.subjects[key]
  }));
  const [room, setRoom] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [subject, setSubject] = useState(subjects[0].value);
  const [notes, setNotes] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState({
    text: "",
    title: "תחזוקה"
  });
  const userStore = useContext(UserStore);
  const { user } = userStore.user;
  const handleSubjectChange = event => setSubject(event.target.value);
  const handleNotesChange = event => setNotes(event.target.value);

  const handleFormSubmit = useCallback(async () => {
    const _subjectDesc = subjects.find(x => x.value === subject).text;
    const description = `${_subjectDesc} - ${notes}`;
    try {
      setLoading(true);
      await ServiceApi.maintenance(user.room, description);
      setLoading(false);
      setSuccess(true);
      setModal({
        ...modal,
        text: "בקשתך התקבלה ותטופל בהתאם"
      });
      setModalOpen(true);
    } catch (e) {
      setModal({
        ...modal,
        text: "לא ניתן להזמין תחזוקה כרגע, מתנצלים על אי הנוחות"
      });
      setModalOpen(true);
    }
  }, [modal, user.room, modalOpen, subject, notes]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const _room = await userStore.getRoomData();
        setRoom(_room);
      } catch (e) {}
      setLoading(false);
    })();
  }, [room]);

  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <Loader loaded={!loading}>
      <Box>
        <Form onSubmit={handleFormSubmit}>
          <Box>
            <FormField title="נושא הבעיה">
              <Select
                placeholder="בחר את נושא הבעיה"
                detailed
                items={subjects}
                value={subject}
                onChange={handleSubjectChange}
                naturalSize
              />
            </FormField>
            <FormField title="תיאור הבעיה">
              <TextArea
                value={notes}
                onChange={handleNotesChange}
                placeholder="לדוגמא: המזגן בחדר 003 לא עובד"
              />
            </FormField>
          </Box>
          <Box>
            <SubmitButton>שלח</SubmitButton>
          </Box>
        </Form>
      </Box>
      <SiteModal
        open={modalOpen}
        text={modal.text}
        title={modal.title}
        onClose={() => (success ? setRedirect(true) : setModalOpen(false))}
      />
    </Loader>
  );
};
export default MissingItems;
