import { observable, computed, action, decorate } from "mobx";
import { UserApi, RoomApi } from "../utils/api";
import { createContext } from "react";
import { get, set, remove } from "../utils/storage";

class UserStore {
  constructor() {
    this.user = get("user");
  }

  async login(email, password) {
    const result = await UserApi.login(email, password);
    if (result == null) return;
    const user = result.data.data;
    set("user", user);
    this.user = user;
    return this.user;
  }

  logout() {
    remove("user");
    this.user = null;
  }
  async updateUser() {
    const result = await UserApi.me();
    const user = result.data;
    user.user = {...user.data, hote: this.user.hotel};
    user.token = this.user.token;
    set("user", user);
    this.user = user;
  }

  async signUp(email, password, firstName, lastName, address, phone) {
    await UserApi.signUp(email, password, firstName, lastName, address, phone);
  }

  async getRoomData() {
    return (
      this.room ||
      (this.room = (await RoomApi.get(this.user.user.room)).data.data)
    );
  }

  get token() {
    if (this.user) {
      return this.user.token;
    }
    return null;
  }

  get hotelId() {
    if (this.user) {
      return this.user.user.hotel;
    }
    return null;
  }

  get isLoggedIn() {
    return this.user != null;
  }
}

decorate(UserStore, {
  isLoggedIn: computed,
  login: action,
  logout: action,
  signUp: action,
  updateUser: action,
  getRoomData: action,
  user: observable,
  token: computed,
  hotelId: computed
});

export default createContext(new UserStore());
