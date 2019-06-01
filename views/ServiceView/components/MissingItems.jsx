import React, { useState, useCallback, useContext, useEffect } from "react";
import Form from "../../../components/Form/Form";
import FormField from "../../../components/FormField/FormField";
import { settings } from "../consts";
import Select from "../../../components/Select/Select";
import { generateNormalizedArray } from "../../../utils/helpers";
import Box from "../../../components/Box/Box";
import SubmitButton from "../../../components/SubmitButton/SubmitButton";
import TextArea from "../../../components/TextArea/TextArea";
import UserStore from "../../../stores/UserStore";
import { ServiceApi } from "../../../utils/api";
import Loader from "react-loader";
import { Redirect } from "react-router-dom";
import SiteModal from "../../../components/SiteModal/SiteModal";

const generateItem = (item, quantity) => ({ item, quantity });
const MissingItems = () => {
  const { missingItems } = settings;
  const [room, setRoom] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [covers, setCovers] = useState(0);
  const [pillows, setPillows] = useState(0);
  const [shampoos, setShampoos] = useState(0);
  const [towels, setTowel] = useState(0);
  const [requests, setRequests] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modal, setModal] = useState({
    text: "",
    title: "ניקיון"
  });
  const userStore = useContext(UserStore);
  const { user } = userStore.user;
  const handleCoversChange = event => setCovers(event.target.value);
  const handlePillowsChange = event => setPillows(event.target.value);
  const handleShampoosChange = event => setShampoos(event.target.value);
  const handleTowelsChange = event => setTowel(event.target.value);
  const handleRequestsChange = event => setRequests(event.target.value);

  const handleFormSubmit = useCallback(async () => {
    const items = [
      generateItem("covers", covers),
      generateItem("pillows", pillows),
      generateItem("shampoos", shampoos),
      generateItem("towels", towels),
      generateItem(`notes - ${requests}`, 1)
    ].filter(item => item.quantity > 0);
    try {
      setLoading(true);
      await ServiceApi.missingItems(user.room, items);
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
        text: "לא ניתן להזמין חוסרים כרגע, מתנצלים על אי הנוחות"
      });
      setModalOpen(true);
    }
  }, [
    modal,
    user.room,
    modalOpen,
    covers,
    pillows,
    shampoos,
    towels,
    requests
  ]);

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
            <FormField title="שמיכה">
              <Select
                items={generateNormalizedArray(missingItems.maxCovers)}
                value={covers}
                onChange={handleCoversChange}
              />
            </FormField>
            <FormField title="כריות">
              <Select
                items={generateNormalizedArray(missingItems.maxPillows)}
                value={pillows}
                onChange={handlePillowsChange}
              />
            </FormField>
            <FormField title="מגבות">
              <Select
                items={generateNormalizedArray(missingItems.maxTowels)}
                value={towels}
                onChange={handleTowelsChange}
              />
            </FormField>
            <FormField title="שמפו">
              <Select
                items={generateNormalizedArray(missingItems.maxShampoos)}
                value={shampoos}
                onChange={handleShampoosChange}
              />
            </FormField>
            <FormField title="שונות">
              <TextArea value={requests} onChange={handleRequestsChange} />
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
