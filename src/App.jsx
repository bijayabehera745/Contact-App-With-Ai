import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ContactCard from './ContactCard';
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
    .then(() => fetchContacts()) // Refresh list
    .catch(err => {
      console.error("Error deleting contact:", err);
      setError('Failed to delete contact. Is your token correct?');
    });
  };

  return (
    <div className="app-container">
      <h1>My Contact List</h1>

      <div className="header-controls">
        <input 
          type="search" 
          placeholder="Search by name or email..." 
          className="search-bar" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        
        {/* --- LOGIN/LOGOUT UI --- */}
        {token ? (
          <div className="login-box">
            <span>Logged In</span>
            <button onClick={handleLogout} className="logout-button">Log Out</button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="login-box">
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

      {/* --- ADD CONTACT BUTTON AND FORM --- */}
      {token && (
        <div className="add-contact-container">
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="add-contact-toggle"
          >
            {showAddForm ? 'Cancel' : 'Add New Contact'}
          </button>
          
          {showAddForm && (
            <form onSubmit={handleAddSubmit} className="add-contact-form">
              <h3>Add New Contact</h3>
              <input type="text" placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
              <input type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
              <input type="tel" placeholder="Phone (Optional)" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
              <button type="submit">Save Contact</button>
            </form>
          )}
        </div>
      )}
      
      {/* --- CONTACT LIST --- */}
      <div className="contact-grid">
        {error && <p className="error-message">{error}</p>}
        {filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              isLoggedIn={!!token}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p>{contacts.length > 0 ? "No contacts match your search." : "No contacts found."}</p>
        )}
      </div>
    </div>
  );
}

export default App;