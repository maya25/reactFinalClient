import axios from "axios";
import { get } from "./storage";

const BASE_URL = "https://mayhotel.herokuapp.com";
const generateUrl = path => `${BASE_URL}/${path}`;

const getToken = () => {
  const user = get("user");
  if (user && user.token) {
    return user.token;
  }
};

const getHeaders = (authorized = false) => {
  const headers = {
    "Content-Type": "application/json"
  };

  if (authorized) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

const http = {
  get: async (path, auth = false) =>
    await axios.get(generateUrl(path), {
      headers: getHeaders(auth)
    }),
  post: async (path, data, auth = false) =>
    await axios.post(generateUrl(path), data, {
      headers: getHeaders(auth)
    }),
  put: async (path, data) => await axios.put(generateUrl(path), data),
  delete: async (path, data, auth = false) =>
    await axios.request({
      url: generateUrl(path),
      method: "DELETE",
      data: data,
      headers: getHeaders(auth)
    })
};

export const UserApi = {
  get: async userId => await http.get(`users/${userId}`),
  me: async () => await http.get("users/me", true),
  login: async (email, password) =>
    await http.post(`users/login`, { email, password }),
  signUp: async (email, password, firstName, lastName, address, phone) =>
    await http.post(`users`, {
      email,
      password,
      firstName,
      lastName,
      address,
      phone
    }),
  events: async () => await http.get("users/me/events", true),
  spa: async () => await http.get("users/me/spa", true),
  orders: async () => await http.get("users/me/orders", true),
  vouchers: async () => await http.get("users/me/vouchers", true)
};

export const OrderApi = {
  add: async (hotel, meal_id, amount, date) =>
    await http.post(
      "hotels/meals/orders",
      {
        meal_id,
        amount,
        date
      },
      true
    ),
  getAll: async hotelId => await http.get(`hotels/meals/all/${hotelId}`),
  delete: async order_id => await http.delete(`hotels/meals/orders/${order_id}`, {}, true)
};

export const RoomApi = {
  get: async hotel_id => await http.get(`hotels/rooms/${hotel_id}`)
};

export const ServiceApi = {
  get: async hotel_id => await http.get(`hotels/rooms/services/${hotel_id}`),
  cleaning: async (room_id, date) =>
    await http.post("hotels/rooms/services/clean", { room_id, date }),
  wakeUp: async (room_id, date) =>
    await http.post("hotels/rooms/services/alarm", { room_id, date }),
  maintenance: async (room_id, desc) =>
    await http.post("hotels/rooms/services/maintenance", { room_id, desc }),
  missingItems: async (room_id, items) =>
    await http.post("hotels/rooms/services/missing", { room_id, items })
};

export const EventsApi = {
  get: async hotel_id => await http.get(`hotels/events/${hotel_id}`),
  add: async (event_id, amount) =>
    await http.post(
      "hotels/events/reservation",
      {
        event_id,
        amount
      },
      true
    ),
  delete: async reservation_id =>
    http.delete(`hotels/events/reservation/${reservation_id}`, {}, true)
};

export const MealsApi = {
  get: async hotel_id => await http.get(`hotels/meals/${hotel_id}`)
};

export const SpaApi = {
  get: async hotel_id => await http.get(`hotels/spa/${hotel_id}/available`),
  add: async appointment_id =>
    await http.post(
      "hotels/spa/appointment",
      {
        appointment_id
      },
      true
    ),
  delete: async appointment_id =>
    await http.delete(`hotels/spa/appointment/${appointment_id}`, {}, true)
};

export const VoucherApi = {
  add: async (meal_id, user_id, date, value) =>
    await http.post(`hotels/meals/orders/vouchers`, {
      meal_id,
      user_id,
      date,
      value
    }),
  delete: async voucher_id =>
    await http.delete(`hotels/meals/orders/vouchers`, {
      voucher_id
    })
};
