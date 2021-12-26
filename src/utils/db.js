import Dexie from "dexie";
import { ref } from "vue";
import { Account } from "../services/api";

class DBWrapper {
  constructor() {
    this.db = new Dexie(localStorage.getItem("id"));
    this.db.version(1).stores({
      contact_list: "id,name", // Primary key and indexed props
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
    return await this.db.contact_list.add(temp);
  }

  async getContactList() {
    let contactList = await this.db.contact_list;
    return contactList ? contactList.toArray() : [];
  }

  async getContact(id) {
    let contact = await this.db.contact_list.get({ id: id });
    return contact;
  }

  async appendMessage(id, message) {
    let messageString = JSON.stringify(message);
    let copiedMessage = JSON.parse(messageString);
    let contactToAppend = await this.db.contact_list.get({ id: id });
    if (contactToAppend.length == 0) {
      let contact = await Account.search(id);
      this.addContact(content);
    }
    contactToAppend.messageList.push(copiedMessage);
    console.log("contactToAppend", contactToAppend);
    return this.db.contact_list.where({ id: id }).modify({
      messageList: contactToAppend.messageList,
    });
  }
}

const db = new DBWrapper();

window.api.receive("appendMessage", async data => {
  console.log("append");
  //TODO change here to get appendMessage result and pass to ipc
  await db.appendMessage(data.key, data.message);
  // let contactList = await db.getContactList();
  let contactList;
  window.api.send("updateModel", data.key);
});

export default db;
