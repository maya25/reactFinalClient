import React, { useEffect, useContext, useState, useCallback } from "react";
import "./RestaurantView.scss";
import PageHeading from "../../components/PageHeading/PageHeading";
import { metadata, names } from "./consts";
import UserStore from "../../stores/UserStore";
import { MealsApi } from "../../utils/api";
import Loader from "react-loader";
import {
  getDateRangeByDate,
  generateTimes,
  getDateRange
} from "../../utils/helpers";
import MealBooking from "../../components/MealBooking/MealBooking";
import { Redirect } from "react-router-dom";
import Coupons from "../Coupons/Coupons";

const RestaurantView = () => {
  const userStore = useContext(UserStore);
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState([]);
  const [meal, setMeal] = useState();
  const [room, setRoom] = useState();
  const [goHome, setGoHome] = useState(false);
  const [goCoupons, setGoCoupons] = useState(false);
  const [couponData, setCouponData] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      setLoading(true);
      try {
        const mealsResult = await MealsApi.get(userStore.hotelId);
        const _meals = mealsResult.data.data;
        setMeals(mealsResult.data.data);
        const selectedMeal = _meals[0];
        selectedMeal.selected = true;
        setMeal(selectedMeal);
        setRoom(await userStore.getRoomData());
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const handleLinkClick = useCallback(
    id => {
      if (meal._id === id) return;
      const _meal = meals.find(m => m._id === id);
      const _meals = meals.map(m => ({
        ...m,
        selected: m._id === id
      }));
      setMeals(_meals);
      setMeal(_meal);
    },
    [meal, meals]
  );

  const _pageLinks = meals.map(meal => ({
    title: names[meal.name.toLowerCase()] || meal.name,
    id: meal._id,
    selected: meal.selected
  }));

  const allowedTimes = meal
    ? generateTimes(parseInt(meal.startTime), parseInt(meal.endTime))
    : ["08:00"];
  const allowedDates = room
    ? getDateRangeByDate(new Date(), new Date(room.enddate))
    : getDateRange(new Date(), 5);

  const onFinishedOrder = (success, data) => {
    if (success) {
      setGoHome(true);
    } else {
      setCouponData(data);
      setGoCoupons(true);
    }
  };


  if (goCoupons) {
    return <Coupons {...couponData} />
  }

  if (goHome) {
    return <Redirect to="/orders/myorders" />;
  }

  return (
    <Loader loaded={!loading}>
      <PageHeading
        title={metadata.title}
        icon={metadata.icon}
        links={_pageLinks}
        isStatic
        onStaticClick={handleLinkClick}
      />
      <div className="restaurant-view">
        <MealBooking
          allowedTimes={allowedTimes}
          allowedDates={allowedDates}
          maxGuests={room ? room.guest_amount : 1}
          mealId={meal ? meal._id : ""}
          mealName={meal ? names[meal.name.toLowerCase()] : ""}
          onFinishedOrder={onFinishedOrder}
        />
      </div>
    </Loader>
  );
};

export default RestaurantView;
