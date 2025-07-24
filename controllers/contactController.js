const asyncHandler = require("express-async-handler");

const Contact = require('../models/contactModel');

// desc - Get all contacts
// route - GET /api/contacts
// access - Private

const { get } = require("http");

const getAllContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});

// desc - Create a new contact
// route - POST /api/contacts/:id
// access - Private

const createContact = asyncHandler(async (req, res) => {
    
    // console.log("Token validation successful");

    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        throw new Error('Please provide all fields');
    }
   

    const contact = await Contact.create({
        name,
        email,
        phone,  
        user_id: req.user.id // Associate contact with the logged-in user
    });

    console.log(req.body);
    res.status(201).json({ contact });
});


// desc - Get a contact by ID
// route - GET /api/contacts/:id    
// access - private

const getContactById = asyncHandler(async (req, res) => {
    try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      // If contact is not found
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // If found, return the contact
    res.status(200).json({
      success: true,
      data: contact,
    });

  } catch (error) {
    // If ID is invalid (e.g., not a proper Mongo ObjectId)
    res.status(500).json({
      success: false,
      message: "Server error or invalid ID",
      error: error.message,
    });
  }
});

// desc - Update a contact by ID
// route - PUT /api/contacts/:id
// access - Public

const updateContactById = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact  not found');
    }   

    if(contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error('User not authorized to update this contact');
    } 

    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
        new: true});

    res.status(200).json(updatedContact);
});

// desc - Delete a contact by ID
// route - DELETE /api/contacts/:id 
// access - Public

const deleteContactById = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }

    if(contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error('User not authorized to delete this contact');
    }

    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Contact deleted successfully' , data: contact });
});

module.exports = {
    getAllContacts,
    createContact,
    getContactById,
    updateContactById,
    deleteContactById
}; 