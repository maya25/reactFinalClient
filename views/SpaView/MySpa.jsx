import React, { useEffect, useState, useCallback, useContext } from "react";
import Loader from "react-loader";
import UserStore from "../../stores/UserStore";
import { treatmentNames } from "./consts";
import { UserApi, SpaApi } from "../../utils/api";
import Box from "../../components/Box/Box";
import CancelButton from "../../components/CancelButton/CancelButton";
import SiteModal from "../../components/SiteModal/SiteModal";

const MySpa = () => {
  const userStore = useContext(UserStore);
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
      await updateTreatments();
    })();
  }, []);

  const updateTreatments = useCallback(() => {
    (async () => {
      setLoading(true);
      const result = await UserApi.spa();
      setTreatments(result.data.data.map(treatment => treatment.appointment));
      setLoading(false);
    })();
  });

  const handleTreatmentCancel = useCallback(
    (id) => {
      (async () => {
        setLoading(true);
        await SpaApi.delete(id);
        updateTreatments();
        setModalText('טיפול בוטל בהצלחה!');
        setModalOpen(true);
      })();
    },
    [treatments]
  );

  return (
    <Box>
      <Loader loaded={!loading}>
        <MySpaList list={treatments} onItemCancel={handleTreatmentCancel} />
      </Loader>
      <SiteModal
        open={modalOpen}
        title="הטיפולים שלי"
        text={modalText}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
};

const MySpaList = ({ list, onItemCancel }) => {
  if (!list || !list.length) {
    return <span>לא נמצאו טיפולים</span>;
  }
  return (
    <ul>
      {list.map((item, idx) => (
        <MySpaItem {...item} onCancel={onItemCancel} key={idx} />
      ))}
    </ul>
  );
};

const MySpaItem = ({ therepist, _id, onCancel, string }) => {
  return (
    <li className="my-spa-item">
      <div>
        {therepist}<br />
        {string.date},{' '}{string.time}
      </div>
      <CancelButton onClick={() => onCancel(_id)} />
    </li>
  );
};

export default MySpa;
