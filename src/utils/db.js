import Dexie from "dexie";
import { ref } from "vue";
import { Account } from "../services/api";
// export const db = new Dexie("myDatabase");

// const createDB = name => {
//   let db = new Dexie(name);
// };

// db.version(1).stores({
//   contact_list: "id,name", // Primary key and indexed props
// });

// const testContact = [
//   {
//     id: "123",
//     name: "clas",
//     messageList: [],
//   },
//   {
//     id: "233",
//     name: "tom",
//     messageList: [],
//   },
// ];

// db.contact_list.bulkPut(testContact);

// db.contact_list.each(function (contact) {
//   console.log(contact.name);
// });

// db.each("contact_list", (item) => {
//   console.log(item);
// })

class DBWrapper {
  constructor() {
    this.db = new Dexie(localStorage.getItem("id"));
    this.db.version(1).stores({
      contact_list: "id,name", // Primary key and indexed props
    });
    // const testContact = [
    //   {
    //     id: "123",
    //     name: "clas",
    //     messageList: [],
    //   },
    //   {
    //     id: "233",
    //     name: "tom",
    //     messageList: [],
    //   },
    // ];

    // this.db.contact_list.bulkPut(testContact);
  }

  init(name) {
    this.db = new Dexie(name);
    this.db.version(1).stores({
      contact_list: "id,name", // Primary key and indexed props
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

const contactList = ref([]);

const db = new DBWrapper();

export default db;
