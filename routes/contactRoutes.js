const express = require('express');
const { getAllContacts, createContact, getContactById, updateContactById, deleteContactById } = require('../controllers/contactController');
const validateToken = require('../middleware/validateTokenHandler');
const router = express.Router();


router.use(validateToken);
router.route('/').get(getAllContacts).post(createContact);
router.route('/:id').get(getContactById).put(updateContactById).delete(deleteContactById);



module.exports = router;