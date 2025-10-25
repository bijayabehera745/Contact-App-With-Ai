// --- FILENAME: src/ContactCard.jsx (UPDATED) ---

import React from "react";

const ContactCard = ({ contact, isLoggedIn, onDelete, onSelect, isSelected }) => {
  return (
    <div 
      className={`contact-card ${isSelected ? 'selected' : ''}`} 
      onClick={() => onSelect(contact)}
    >
      <div className="contact-card-avatar"></div> {/* Placeholder for avatar */}
      <div className="contact-info">
        <h3>{contact.name}</h3>
        <p>{contact.email}</p>
      </div>
      <div className="contact-actions">
        {contact.phone && <span className="phone-number">{contact.phone}</span>}
        {isLoggedIn && (
          <button
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent onSelect from firing when deleting
              onDelete(contact.id);
            }}
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactCard;