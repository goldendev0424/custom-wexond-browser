import { observable, action, makeObservable } from 'mobx';

import { ITabGroup } from '../models';
import { Store } from '.';
import { ipcRenderer } from 'electron';
const BLUE_500 = '#21b0f3';
const RED_500 = '#F44336';
const PINK_500 = '#E91E63';
const PURPLE_500 = '#9C27B0';
const DEEP_PURPLE_500 = '#673AB7';
const INDIGO_500 = '#3F51B5';
const CYAN_500 = '#00BCD4';
const LIGHT_BLUE_500 = '#03A9F4';
const TEAL_500 = '#009688';
const GREEN_500 = '#4CAF50';
const LIGHT_GREEN_500 = '#8BC34A';
const LIME_500 = '#CDDC39';
const YELLOW_500 = '#FFEB3B';
const AMBER_500 = '#FFC107';
const ORANGE_500 = '#FF9800';
const DEEP_ORANGE_500 = '#FF5722';
const BLUE_GRAY_500 = '#607D8B';

export class TabGroupsStore {
  public list: ITabGroup[] = [];

  public palette: string[] = [
    BLUE_500,
    RED_500,
    PINK_500,
    PURPLE_500,
    DEEP_PURPLE_500,
    INDIGO_500,
    CYAN_500,
    LIGHT_BLUE_500,
    TEAL_500,
    GREEN_500,
    LIGHT_GREEN_500,
    LIME_500,
    YELLOW_500,
    AMBER_500,
    ORANGE_500,
    DEEP_ORANGE_500,
    BLUE_GRAY_500,
  ];

  private store: Store;

  public constructor(store: Store) {
    makeObservable(this, { list: observable, addGroup: action });

    this.store = store;

    ipcRenderer.on('edit-tabgroup', (e, t) => {
      if (t) {
        const group = this.getGroupById(t.id);
        if (t.name != null) group.name = t.name;
        if (t.color) group.color = t.color;
        store.tabs.updateTabsBounds(true);
      }
    });
  }

  public getGroupById(id: number) {
    return this.list.find((x) => x.id === id);
  }

  public addGroup() {
    const tabGroup = new ITabGroup(this.store, this);
    this.list.push(tabGroup);
    return tabGroup;
  }
}
