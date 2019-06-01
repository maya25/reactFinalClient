import React from "react";
import DatePicker from "../DatePicker/DatePicker";
import Select from "../Select/Select";
import Box from "../Box/Box";
import FormField from "../FormField/FormField";
import Form from "../Form/Form";
import "./MealBooking.scss";
import SubmitButton from "../SubmitButton/SubmitButton";
import { generateNormalizedArray } from "../../utils/helpers";
import UserStore from "../../stores/UserStore";
import SiteModal from "../SiteModal/SiteModal";
import Loader from "react-loader";
import moment from "moment";
import { OrderApi } from "../../utils/api";
import { Link } from "react-router-dom";

class MealBooking extends React.Component {
  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleGuestsChange = this.handleGuestsChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);

    this.state = {
      time: props.allowedTimes[0],
      date: props.allowedDates[0],
      guests: 1,
      modalOpen: false,
      modalTitle: "",
      modalText: "",
      loading: false,
      success: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mealId !== this.props.mealId) {
      this.setState({
        time: this.props.allowedTimes[0],
        date: this.props.allowedDates[0]
      });
    }
  }

  async handleFormSubmit() {
    try {
      const { date, time, guests } = this.state;
      const { mealName, mealId } = this.props;
      const userStore = this.context;
      this.setState({ loading: true });
      const _date = moment(date).format("MM/DD/YYYY");
      // _date.hours(parseInt(time.split(":")[0]));
      // _date.minutes(parseInt(time.split(":")[1]));
      try {
        const result = await OrderApi.add(
          userStore.hotelId,
          mealId,
          guests,
          _date
        );
        if (result.data.data.voucher) {
          this.setState({
            loading: false,
            modalOpen: true,
            modalText: "לא ניתן להזמין שולחן לזמן זה"
          });
          return;
        }
        this.setState({
          loading: false,
          modalTitle: mealName,
          modalOpen: true,
          modalText: this.getMealSummary(mealName, date, time),
          success: true
        });
      } catch (e) {
        this.setState({
          loading: false,
          modalOpen: true,
          modalText: "לא ניתן להזמין שולחן לזמן זה"
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  handleTimeChange(event) {
    this.setState({ time: event.target.value });
  }

  getMealSummary(mealName, date, time) {
    return `נשמר לך שולחן ב${mealName} \n
    שעה ${time}, תאריך ${moment(date).format("DD/MM/YYYY")}. 
    להזכירך, השריון תקף לחצי שעה הראשונה של הארוחה בלבד
   `;
  }

  handleGuestsChange(event) {
    this.setState({
      guests: event.target.value
    });
  }

  handleDateChange(value) {
    this.setState({
      date: value
    });
  }

  render() {
    const {
      guests,
      date,
      modalOpen,
      modalText,
      modalTitle,
      loading,
      time
    } = this.state;
    const {
      maxGuests,
      allowedDates,
      allowedTimes,
      mealId,
      mealName
    } = this.props;

    return (
      <Loader loaded={!loading}>
        <div className="meal-booking">
          <Form onSubmit={this.handleFormSubmit}>
            <div className="disclaimer">
              <Box>
                <p>
                  אורח יקר,
                  <br />
                  באפשרותך לשריין מקום לארוחה לפי תאריך, שעה ומספר סועדים.
                  לידיעתך, השריון תקף לחצי שעה הראשונה של הארוחה בלבד.
                  <br />
                  שעות פעילות ב{mealName}:{" "}
                  <strong>
                    {allowedTimes[0]} - {allowedTimes[allowedTimes.length - 2]}
                  </strong>
                  <br />
                  <Link to="/orders/myorders">ההזמנות שלי</Link>
                </p>
              </Box>
            </div>
            <Box>
              <Box>
                <FormField title="בחר מספר אורחים">
                  <Select
                    items={generateNormalizedArray(maxGuests)}
                    value={guests}
                    onChange={this.handleGuestsChange}
                    name="guests"
                  />
                </FormField>
              </Box>
              <Box>
                <FormField title="בחר תאריך">
                  <DatePicker
                    selected={date}
                    onChange={this.handleDateChange}
                    allowedDates={allowedDates}
                  />
                </FormField>
              </Box>
              {/* <Box>
                <FormField title="בחר שעה">
                  <Select
                    items={allowedTimes}
                    value={time}
                    onChange={this.handleTimeChange}
                  />
                </FormField>
              </Box> */}
              <Box>
                <SubmitButton>הזמן</SubmitButton>
              </Box>
            </Box>
          </Form>
          <SiteModal
            open={modalOpen}
            title={modalTitle}
            text={modalText}
            onClose={() =>
              this.props.onFinishedOrder(this.state.success, {
                mealId,
                date
              })
            }
          />
        </div>
      </Loader>
    );
  }
}

MealBooking.contextType = UserStore;

export default MealBooking;
