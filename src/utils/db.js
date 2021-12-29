import Dexie from "dexie";
import { ref } from "vue";
import { Account } from "../services/api";

class DBWrapper {
  constructor() {
    this.db = new Dexie(localStorage.getItem("id"));
    this.db.version(1).stores({
      contact_list: "id,name,avatar", // Primary key and indexed props
    });
  }

  init(name) {
    this.db = new Dexie(name);
    this.db.version(1).stores({
      contact_list: "id,name",
    });
  }

  async addContact(contact) {
    var objString = JSON.stringify(contact);
    var temp = JSON.parse(objString);
    temp.messageList = [];
    if (temp.id != null) {
      return await this.db.contact_list.add(temp);
    }
  }

  async updateContact(id) {
    await Account.get(id).then(res => {
      this.db.contact_list.update(id, {
        name: res.data.name,
        avatar: res.data.avatar,
      });
    });
    window.api.send("updateModel", id);
  }

  async getContact(id) {
    console.log("getContact", id);
    return await this.db.contact_list.get({ id: id });
  }
  async getContactList() {
    let contactList = await this.db.contact_list;
    return contactList ? contactList.toArray() : [];
  }
  async appendMessage(id, message) {
    if (id == null) {
      return;
    }
    let messageString = JSON.stringify(message);
    let copiedMessage = JSON.parse(messageString);
    let contactToAppend = await this.db.contact_list.get({ id: id });
    if (contactToAppend === undefined) {
      await Account.get(id).then(res => {
        this.addContact(res.data);
        contactToAppend = {
          messageList: [],
        };
        // contactToAppend.messageList = [];
      });
    }
    contactToAppend.messageList.push(copiedMessage);
    // console.log("contactToAppend", contactToAppend);
    return this.db.contact_list.where({ id: id }).modify({
      messageList: contactToAppend.messageList,
    });
  }

  async setOfflineMessage(messages) {
    for (let item of messages) {
      await this.appendMessage(item.from, item);
    }
  }
}

const db = new DBWrapper();
window.api.receive("appendMessage", async data => {
  await db.appendMessage(data.key, data.message);
  window.api.send("updateModel", data.message.from);
});
export default db;
