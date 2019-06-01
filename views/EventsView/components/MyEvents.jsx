import React, { useEffect, useState, useCallback } from "react";
import { UserApi, EventsApi } from "../../../utils/api";
import Loader from "react-loader";
import Box from "../../../components/Box/Box";
import CancelButton from "../../../components/CancelButton/CancelButton";
import SiteModal from "../../../components/SiteModal/SiteModal";

const MyEvents = () => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await updateEvents();
      } catch (e) { }
    })();
  }, []);

  const updateEvents = useCallback(() => {
    (async () => {
      setLoading(true);
      const result = await UserApi.events();
      const _events = result.data.data.map(ev => ({
        ...ev.reservation.event,
        qrcode: ev.reservation.qrcode,
        _id: ev.reservation._id
      }));
      setEvents(_events);
      setLoading(false);
    })();
  });

  const handleCancel = useCallback(id => {
    (async () => {
      setLoading(true);
      await EventsApi.delete(id);
      setModalOpen(true);
      updateEvents();
    })();
  });

  return (
    <Box>
      <Loader loaded={!loading}>
        <MyEventList events={events} onCancel={handleCancel} />
      </Loader>
      <SiteModal
        open={modalOpen}
        title="הפעילויות שלי"
        text="הזמנה בוטלה בהצלחה!"
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
};

const MyEventList = ({ events, onCancel }) => {
  if (!events || !events.length) {
    return 'לא נמצאו פעילויות';
  }

  return (
    <ul className="event-list">
      {events.map((event, idx) => (
        <MyEventItem key={idx} {...event} onCancel={onCancel} />
      ))}
    </ul>
  );
}
const MyEventItem = ({ _id, qrcode, name, location, string, content, onCancel }) => {
  return (
    <li className="my-event-item">
      <div className="my-event-item-top">
        <div className="my-event-left">
          <CancelButton onClick={() => onCancel(_id)} />
          <h3 className="my-event-item-name">{name}</h3>
        </div>
        <span className="my-event-item-details">
          {location}, {string.date} {string.time}
        </span>
      </div>
      <p className="my-event-item-content">{content}</p>
      <Box>
        <img src={qrcode} />
      </Box>
    </li>
  );
};


export default MyEvents;