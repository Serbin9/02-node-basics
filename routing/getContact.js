const express = require("express");
const router = express.Router();
const contactsActions = require("../contacts");

router.get("/", async (req, res) => {
  const allContacts = await contactsActions.listContacts();
  res.send(allContacts);
});
router.get("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const contactById = await contactsActions.getContactById(contactId);
  if (contactById) {
    res.send(contactById);
  } else {
    res.status(404).send({ message: "Not found" });
  }
});

module.exports = router;