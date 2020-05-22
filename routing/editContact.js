const express = require("express");
const Joi = require("@hapi/joi");
const router = express.Router();
const contactsActions = require("../contacts");

const isValidRequest = (req, res, next) => {
  const rules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  });
  const validationResult = rules.validate(req.body);
  if (validationResult.error) {
    res.status(400).send({ message: "missing required name field" });
    return;
  }
  next();
};
router.post("/", isValidRequest, async (req, res) => {
  const { name, email, phone } = req.body;
  const newContact = await contactsActions.addContact(name, email, phone);
  res.status(201).send(newContact);
});

router.delete("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const isIdIn = await contactsActions.removeContact(contactId);
  console.log(contactId);

  if (isIdIn) {
    res.status(200).send({ message: "contact deleted" });
  } else {
    res.status(404).send({ message: "Not found" });
  }
});

router.patch("/:contactId", isValidRequest, async (req, res) => {
  const propertiesForUpdate = Object.entries(req.body);
  const { contactId } = req.params;
  const newContact = await contactsActions.updateContact(
    contactId,
    propertiesForUpdate
  );
  if (newContact) {
    res.status(200).send(newContact);
  } else res.header({ message: "Not found" }).status(404).send();
});

module.exports = router;