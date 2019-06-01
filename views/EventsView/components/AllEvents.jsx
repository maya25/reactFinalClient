import React, { useState, useContext, useEffect, useCallback } from "react";
import Loader from "react-loader";
import SiteModal from "../../../components/SiteModal/SiteModal";
import Box from "../../../components/Box/Box";
import UserStore from "../../../stores/UserStore";
import { EventsApi } from "../../../utils/api";
import { getDateRange, generateNormalizedArray } from "../../../utils/helpers";
import FormField from "../../../components/FormField/FormField";
import Select from "../../../components/Select/Select";
import DatePicker from "../../../components/DatePicker/DatePicker";
import { eventTypes } from "../consts";
import moment from "moment";
import classNames from "classnames";
import { Redirect } from "react-router-dom";

const dateFormat = "DD/MM/YYYY";
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const generateCategorySelect = categories => {
  return categories.map(cat => ({
    text: eventTypes[cat] || cat,
    value: cat
  }));
};

const AllEvents = () => {
  const [allowedDates, setAllowedDates] = useState(
    getDateRange(new Date(), 10)
  );
  const [guests, setGuests] = useState(1);
  const [room, setRoom] = useState();
  const [success, setSuccess] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("");
  let [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const userStore = useContext(UserStore);
  const { user } = userStore.user;

  const handleSubmit = useCallback(
    async id => {
      const _event = events.find(ev => ev._id === id);
      setLoading(true);
      try {
        await EventsApi.add(_event._id, guests);
        await userStore.updateUser();
        setModalText("נרשמת לאירוע בהצלחה!");
        setModalOpen(true);
        setSuccess(true);
      } catch (e) {
        setModalText("לא ניתן להירשם לאירוע זה");
        setModalOpen(true);
      }
      setLoading(false);
    },
    [events, guests]
  );

  const filterEvents = (_events, _category, _date) => {
    const _mDate = moment(_date, dateFormat)
      .startOf("day")
      .toISOString();
    return _events.filter(event => {
      const isInDate =
        moment(event.string.date, dateFormat).toISOString() === _mDate;
      return (
        isInDate &&
        event.category
          .map(x => x.toLowerCase())
          .includes(_category.toLowerCase())
      );
    });
  };

  const handleCategoryChange = useCallback(
    event => {
      const cat = event.target.value;
      setCategory(cat);
      setFilteredEvents(filterEvents(events, cat, date));
    },
    [category, date]
  );

  const handleDateChange = useCallback(
    date => {
      setDate(date);
      setFilteredEvents(filterEvents(events, category, date));
    },
    [category, date]
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await EventsApi.get(user.hotel);
        const _events = result.data.data;
        setEvents(_events);
        const _categories = _events
          .map(ev => ev.category.map(cat => cat.toLowerCase()))
          .flat()
          .filter(onlyUnique);
        setCategories(generateCategorySelect(_categories));
        const currentCategory = _categories[0];
        setCategory(currentCategory);
        const _dates = _events.map(ev => ev.string.date).filter(onlyUnique);
        setAllowedDates(_dates.map(x => moment(x, dateFormat).toDate()));
        setDate(new Date());
        setFilteredEvents(
          filterEvents(
            _events,
            currentCategory,
            moment(new Date()).format(dateFormat)
          )
        );

        const room = await userStore.getRoomData();
        setRoom(room);
      } catch (e) {
        setEvents(null);
      }
      setLoading(false);
    })();
  }, []);

  if (redirect) {
    return <Redirect to="/events/summary" />;
  }

  return (
    <Loader loaded={!loading}>
      <Box>
        <Box>
          <FormField title="קטגוריה">
            <Select
              placeholder="בחר קטגוריה"
              items={categories}
              value={category}
              detailed
              onChange={handleCategoryChange}
            />
          </FormField>
          <FormField title="כמות משתתפים">
            <Select
              items={generateNormalizedArray(room ? room.guest_amount : 1)}
              value={guests}
              onChange={event => setGuests(event.target.value)}
            />
          </FormField>
          <FormField title="בחר תאריך">
            <DatePicker
              selected={date}
              onChange={handleDateChange}
              allowedDates={allowedDates}
            />
          </FormField>
        </Box>
        {filteredEvents.length === 0 ? (
          <Box>לא נמצאו אירועים</Box>
        ) : (
          <EventList events={filteredEvents} onItemClick={handleSubmit} />
        )}
      </Box>
      <SiteModal
        open={modalOpen}
        title="אירועים ופעילויות"
        text={modalText}
        onClose={() => (success ? setRedirect(true) : setModalOpen(false))}
      />
    </Loader>
  );
};

const EventList = ({ events, onItemClick }) => (
  <ul className="event-list">
    {events.map((event, idx) => (
      <EventItem key={idx} {...event} onClick={onItemClick} />
    ))}
  </ul>
);
const EventItem = ({
  _id,
  name,
  onClick,
  location,
  string,
  content,
  counter,
  capacity
}) => {
  const _onClick = () => {
    onClick(_id);
  };
  return (
    <li
      onClick={_onClick}
      className={classNames("event-item", { full: counter === capacity })}
    >
      <div className="event-item-top">
        <h3 className="event-item-name">{name}</h3>
        <span className="event-item-details">
          {location}, {string.time}
        </span>
      </div>
      <p className="event-item-content">{content}</p>
    </li>
  );
};

export default AllEvents;
