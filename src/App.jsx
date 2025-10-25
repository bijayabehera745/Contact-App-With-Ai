// --- FILENAME: src/App.jsx (UPDATED) ---

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ContactCard from './ContactCard';
import Sidebar from './Sidebar'; // New import
import ContactDetailPanel from './ContactDetailPanel'; // New import
import './App.css';

// Your API URLs
const API_URL = 'https://contact-app-oa5s.onrender.com/api/contacts/';
const LOGIN_URL = 'https://contact-app-oa5s.onrender.com/api-token-auth/';

function App() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  
  // Auth State
  const [token, setToken] = useState(localStorage.getItem('apiToken') || '');
  
  // Login Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Add Contact Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // New state for selected contact
  const [selectedContact, setSelectedContact] = useState(null);

  // 1. Function to fetch contacts
  const fetchContacts = () => {
    setError(null);
    axios.get(API_URL)
      .then(res => setContacts(res.data))
      .catch(err => {
        console.error("Error fetching contacts:", err);
        setError('Could not fetch contacts. (Check CORS or Render logs)');
      });
  };

  // 2. Fetch contacts on initial load
  useEffect(() => {
    fetchContacts();
  }, []); // The empty array [] means this runs only once

  // 3. Filter contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contacts, searchTerm]);

  // 4. Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    
    axios.post(LOGIN_URL, { username, password })
      .then(res => {
        const receivedToken = res.data.token;
        setToken(receivedToken);
        localStorage.setItem('apiToken', receivedToken); // Save token
        setUsername(''); // Clear form
        setPassword(''); // Clear form
      })
      .catch(err => {
        console.error("Login error:", err);
        setError('Invalid username or password.');
      });
  };

  // 5. Handle Logout
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('apiToken');
    setSelectedContact(null); // Clear selected contact on logout
  };

  // 6. Handle Add Contact
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    
    const newContact = { name: newName, email: newEmail, phone: newPhone };

    axios.post(API_URL, newContact, {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(res => {
      setNewName('');
      setNewEmail('');
      setNewPhone('');
      setShowAddForm(false); // Close the form
      fetchContacts(); // Refresh list
    })
    .catch(err => {
      console.error("Error adding contact:", err);
      setError('Failed to add contact. Is your token correct?');
    });
  };

  // 7. Handle Delete Contact
  const handleDelete = (idToDelete) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;

    axios.delete(`${API_URL}${idToDelete}/`, {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(() => {
      fetchContacts(); // Refresh list
      // Clear detail panel if the deleted contact was the selected one
      if (selectedContact && selectedContact.id === idToDelete) {
        setSelectedContact(null); 
      }
    }) 
    .catch(err => {
      console.error("Error deleting contact:", err);
      setError('Failed to delete contact. Is your token correct?');
    });
  };

  // New function to handle contact selection
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };
  
  // Function passed to Sidebar to show add form in main content
  const handleShowAddForm = () => {
      if(token){ // Only show if logged in
          setShowAddForm(true);
      } else {
          setError("Please log in to add contacts."); // Or some other feedback
      }
  };

  return (
    <div className="app-container">
      {/* --- Left Sidebar --- */}
      <Sidebar onAddContactClick={handleShowAddForm} /> {/* Pass handler */}

      {/* --- Main Content Area --- */}
      <div className="main-content">
        <div className="main-header">
          <div className="total-contacts">{contacts.length} Total Contacts</div>
          <div className="header-controls">
            <input 
              type="search" 
              placeholder="Search by name or email..." 
              className="search-bar" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <select className="filter-select">
              <option value="all">Filter by</option>
              <option value="recent">Recent</option>
              <option value="alphabetical">A-Z</option>
            </select>
            {/* Icons for grid/list view would go here later */}
          </div>
        </div>

        {/* --- Login/Add Form Section --- */}
        <div className="login-add-section">
          {token ? (
            <div>
              <p className="logged-in-message">Logged In</p>
              <button onClick={handleLogout} className="logout-button">Log Out</button>
              
              {/* Add Contact Form - shown when `showAddForm` is true */}
              {showAddForm && (
                <form onSubmit={handleAddSubmit} className="add-contact-form-main" style={{ marginTop: '20px' }}>
                  <h3>Add New Contact</h3>
                  <input type="text" placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                  <input type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
                  <input type="tel" placeholder="Phone (Optional)" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                  <button type="submit">Save Contact</button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="logout-button" style={{marginTop:'5px'}}>Cancel</button>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleLogin} className="login-form">
              <h3>Log In</h3>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Log In</button>
            </form>
          )}
        </div>
        
        {/* --- Contact List --- */}
        <div className="contact-list">
          {error && <p className="error-message">{error}</p>}
          {filteredContacts.length > 0 ? (
            filteredContacts.map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                isLoggedIn={!!token}
                onDelete={handleDelete}
                onSelect={handleSelectContact} // Pass new prop
                isSelected={selectedContact && selectedContact.id === contact.id} // Pass new prop
              />
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>
              {contacts.length > 0 ? "No contacts match your search." : "No contacts found."}
            </p>
          )}
        </div>
      </div>

      {/* --- Right Detail Panel --- */}
      <ContactDetailPanel selectedContact={selectedContact} />
    </div>
  );
}

export default App;