const fs = require("fs");
const path = require("path");
const { promises: fsPromises } = fs;
const contactsPath = path.join(__dirname, "/db/contacts.json");

function _getFileData() {
  return fsPromises
    .readFile(contactsPath, "utf-8")
    .then((data) => JSON.parse(data))
    .catch((err) => err);
}
function _randomInteger(min = 0, max = 99) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
function listContacts(req, resp) {
  _getFileData()
    .then((data) => {
      resp.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getContactById({ req, resp, contactId }) {
  _getFileData()
    .then((data) => {
      const contact = data.find((item) => item.id == contactId);
      if (contact) {
        resp.send(contact);
      } else {
        resp.status(404).send({ message: "Not found" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function removeContact({ resp, contactId }) {
  _getFileData()
    .then((data) => {
      const contact = data.find((item) => item.id == contactId);
      if (!contact) {
        resp.status(404).send({ message: "Not found" });
      }
      const filteredContacts = data.filter((item) => item.id != contactId);
      fsPromises
        .writeFile(contactsPath, JSON.stringify(filteredContacts, "", 2))
        .then(() => {
          resp.status(200).send({ message: "contact deleted" });
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

function addContact({ name, email, phone, resp }) {
  _getFileData().then((data) => {
    const contact = {
      id: _randomInteger(),
      name,
      email,
      phone,
    };
    data.push(contact);
    fsPromises
      .writeFile(contactsPath, JSON.stringify(data, "", 2))
      .then(() => {
        resp.status(201).send(contact);
      })
      .catch((err) => {
        resp.send(err);
      });
  });
}

function updateContact({ req, resp, id }) {
  _getFileData().then((data) => {
    const contact = data.findIndex((item) => item.id == id);
    if (contact == -1) {
      resp.status(404).send({ message: "Not found" });
    } else {
      Object.assign(data[contact], { ...req.body });
      fsPromises
        .writeFile(contactsPath, JSON.stringify(data, null, 2))
        .then(() => {
          resp.send(data[contact]);
        });
    }
  });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};