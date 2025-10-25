import React from "react";

const ContactCard = ({ contact, isLoggedIn, onDelete }) => {
  return (
    <div className="contact-card">
      {isLoggedIn && (
        <button
          className="delete-button"
          onClick={() => onDelete(contact.id)}
        >
          &times;
        </button>
      )}
      <h3>{contact.name}</h3>
      <p>Email: {contact.email}</p>
      <p>Phone: {contact.phone}</p>
    </div>
  );
};

export default ContactCard;