import { observable, decorate } from "mobx";
import menuItems from "../utils/menuItems";
import { createContext } from "react";
import { maintenance } from '../utils/icons';

const _items = [...menuItems, { title: 'התנתק', iconUrl: maintenance, urlTarget: '/logout' }];

class MenuStore {
  active = false;
  items = _items;
  homeItems = menuItems;

  toggleMenu = () => {
    this.active = !this.active;
  }

  closeMenu = () => {
    this.active = false;
  }
}


decorate(MenuStore, {
  active: observable,
  items: observable,
  homeItems: observable
});

export default createContext(new MenuStore());