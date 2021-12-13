import Dexie from "dexie";

export const db = new Dexie("myDatabase");

const createDB = name => {
  let db = new Dexie(name);
};

db.version(1).stores({
  contact_list: "id,name", // Primary key and indexed props
});

const testContact = [
  {
    id: 123,
    name: "clas",
    messageList: [],
  },
  {
    id: 233,
    name: "tom",
    messageList: [],
  },
];

db.contact_list.bulkPut(testContact);

// db.contact_list.each(function (contact) {
//   console.log(contact.name);
// });


// db.each("contact_list", (item) => {
//   console.log(item);
// })