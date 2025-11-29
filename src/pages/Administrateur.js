import "./Administrateur.css";
import { useNavigate } from "react-router-dom";
import React from "react";
import { adminTestimonialAPI } from '../utils/api';

export default function Administrateur() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [adminCode, setAdminCode] = React.useState("");
  const [adminName, setAdminName] = React.useState("");
  const [loginError, setLoginError] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("dashboard");

  // Sample donation data
  const [donations, setDonations] = React.useState([
    { id: 1, name: "Sarah M.", amount: 150, method: "Carte Bancaire", date: "2024-11-15", status: "Confirmé" },
    { id: 2, name: "Ahmed K.", amount: 250, method: "PayPal", date: "2024-11-14", status: "Confirmé" },
    { id: 3, name: "Maria G.", amount: 100, method: "Virement", date: "2024-11-13", status: "En attente" },
    { id: 4, name: "John P.", amount: 500, method: "Carte Bancaire", date: "2024-11-12", status: "Confirmé" },
    { id: 5, name: "Yasmine B.", amount: 75, method: "PayPal", date: "2024-11-11", status: "Confirmé" },
  ]);

  // Sample messages data
  const [messages, setMessages] = React.useState([]);
  const [loadingMessages, setLoadingMessages] = React.useState(true);

  // Dashboard statistics
  const [statistics, setStatistics] = React.useState({
    donationsToday: 5,
    donationsWeek: 28,
    donationsMonth: 125,
    totalAmount: 12500,
    messagesReceived: 4,
    visitors: 8934,
  });

  // Fetch testimonials from backend when component loads or when logged in
  React.useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoadingMessages(true);
        // Fetch all testimonials from admin endpoint
        const response = await adminTestimonialAPI.getAll();
        console.log('Admin testimonials response:', response);
        
        if (response.data) {
          const formattedMessages = response.data.map(testimonial => ({
            id: testimonial.id,
            name: testimonial.name,
            country: testimonial.country || testimonial.email || 'Unknown',
            message: testimonial.content,
            date: testimonial.created_at ? testimonial.created_at.split(' ')[0] : new Date().toISOString().split('T')[0],
            status: testimonial.approved == 1 ? "Approuvé" : "En attente",
            isPinned: false
          }));
          setMessages(formattedMessages);
          setStatistics(prev => ({
            ...prev,
            messagesReceived: formattedMessages.length
          }));
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Validate email
    if (email !== "marialmoudn2005@gmail.com") {
      setLoginError("Email incorrect. Vous n'êtes pas un administrateur.");
      return;
    }
    
    // Validate admin code
    if (adminCode !== "maryamaya") {
      setLoginError("Code administrateur incorrect. Veuillez réessayer.");
      return;
    }
    
    // Validate admin name
    if (adminName !== "maryam" && adminName !== "aya") {
      setLoginError("Nom d'administrateur incorrect. Veuillez entrer 'maryam' ou 'aya'.");
      return;
    }
    
    // Login successful
    setIsLoggedIn(true);
    setLoginError("");
    setEmail("");
    setAdminCode("");
    setAdminName("");
    
    // Send email notification
    fetch('http://localhost:8000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, adminName })
    }).catch(err => console.log('Email notification sent'));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminCode("");
    navigate("/");
  };

  const deleteDonation = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette donation ?")) {
      setDonations(donations.filter(d => d.id !== id));
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      try {
        await adminTestimonialAPI.delete(id);
        setMessages(messages.filter(m => m.id !== id));
        setStatistics(prev => ({
          ...prev,
          messagesReceived: prev.messagesReceived - 1
        }));
      } catch (err) {
        console.error('Error deleting message:', err);
        alert('Erreur lors de la suppression du message');
      }
    }
  };

  const approveMessage = async (id) => {
    try {
      await adminTestimonialAPI.approve(id);
      setMessages(messages.map(m => m.id === id ? { ...m, status: "Approuvé" } : m));
    } catch (err) {
      console.error('Error approving message:', err);
      alert('Erreur lors de l\'approbation du message');
    }
  };

  const rejectMessage = async (id) => {
    try {
      await adminTestimonialAPI.reject(id);
      setMessages(messages.map(m => m.id === id ? { ...m, status: "Rejeté" } : m));
    } catch (err) {
      console.error('Error rejecting message:', err);
      alert('Erreur lors du rejet du message');
    }
  };

  const togglePin = (id) => {
    setMessages(messages.map(m => m.id === id ? { ...m, isPinned: !m.isPinned } : m));
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-container">
        <header className="header">
          <div className="header-left">
            <div className="flag-logo">
              <img src="d5246caa268f230b17f5803d45ede1e6.jpg" alt="Palestine" className="palestine-logo" />
            </div>
            <span className="logo-text">GAZA</span>
          </div>
          <nav className="nav-menu">
            <button className="nav-btn" onClick={() => navigate('/')}>Accueil</button>
            <button className="nav-btn" onClick={() => navigate('/dons')}>Dons</button>
            <button className="nav-btn" onClick={() => navigate('/temoignages')}>Témoignages</button>
            <button className="nav-btn active">Administrateur</button>
          </nav>
        </header>

        <div className="login-container">
          <div className="login-box">
            <h1>Accès Administrateur</h1>
            <p className="login-subtitle">Veuillez entrer le code administrateur pour accéder à cette section</p>
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Administrateur</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrez votre email"
                  className="login-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="adminName">Nom d'Administrateur</label>
                <input
                  type="text"
                  id="adminName"
                  value={adminName}
                  placeholder="Entrez nom d'administrateur"
                  onChange={(e) => setAdminName(e.target.value.toLowerCase())}
                  className="login-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="code">Code Administrateur</label>
                <input
                  type="password"
                  id="code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Entrez le code administrateur"
                  className="login-input"
                  required
                />
              </div>
              
              {loginError && <div className="error-message">{loginError}</div>}
              
              <button type="submit" className="login-btn">Se Connecter</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="flag-logo">
            <img src="d5246caa268f230b17f5803d45ede1e6.jpg" alt="Palestine" className="palestine-logo" />
          </div>
          <span className="logo-text">GAZA</span>
        </div>
        <nav className="nav-menu">
          <button className="nav-btn" onClick={() => navigate('/')}>Accueil</button>
          <button className="nav-btn" onClick={() => navigate('/dons')}>Dons</button>
          <button className="nav-btn" onClick={() => navigate('/temoignages')}>Témoignages</button>
          <button className="nav-btn active">Administrateur</button>
        </nav>
      </header>

      {/* Admin Dashboard */}
      <div className="admin-dashboard">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-info">
            <div className="admin-avatar">👨‍💼</div>
            <h3>Admin</h3>
          </div>

          <nav className="admin-nav">
            <button 
              className={`admin-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Tableau de bord
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === 'donations' ? 'active' : ''}`}
              onClick={() => setActiveTab('donations')}
            >
              💰 Gestion des Dons
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              💬 Gestion des Messages
            </button>
          </nav>

          <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
        </aside>

        {/* Main Content */}
        <main className="admin-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <section className="admin-section">
              <h2>Tableau de Bord</h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-content">
                    <div className="stat-label">Dons Aujourd'hui</div>
                    <div className="stat-value">{statistics.donationsToday}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <div className="stat-label">Dons Cette Semaine</div>
                    <div className="stat-value">{statistics.donationsWeek}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📆</div>
                  <div className="stat-content">
                    <div className="stat-label">Dons Ce Mois</div>
                    <div className="stat-value">{statistics.donationsMonth}</div>
                  </div>
                </div>

                <div className="stat-card highlight">
                  <div className="stat-icon">💵</div>
                  <div className="stat-content">
                    <div className="stat-label">Montant Total Collecté</div>
                    <div className="stat-value">${statistics.totalAmount.toLocaleString()}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">💬</div>
                  <div className="stat-content">
                    <div className="stat-label">Messages Reçus</div>
                    <div className="stat-value">{statistics.messagesReceived}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <div className="stat-label">Visiteurs</div>
                    <div className="stat-value">{statistics.visitors.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="charts-section">
                <div className="chart-container">
                  <h3>Dons par Jour (Cette Semaine)</h3>
                  <div className="bar-chart">
                    <div className="bar" style={{ height: '60%' }}><span>Lun</span></div>
                    <div className="bar" style={{ height: '75%' }}><span>Mar</span></div>
                    <div className="bar" style={{ height: '55%' }}><span>Mer</span></div>
                    <div className="bar" style={{ height: '85%' }}><span>Jeu</span></div>
                    <div className="bar" style={{ height: '70%' }}><span>Ven</span></div>
                    <div className="bar" style={{ height: '90%' }}><span>Sam</span></div>
                    <div className="bar" style={{ height: '45%' }}><span>Dim</span></div>
                  </div>
                </div>

                <div className="chart-container">
                  <h3>Montant des Dons par Méthode</h3>
                  <div className="pie-chart">
                    <div className="pie-segment" style={{ background: '#22c55e', width: '40%' }}>
                      <span>40% Carte</span>
                    </div>
                    <div className="pie-segment" style={{ background: '#3b82f6', width: '35%' }}>
                      <span>35% PayPal</span>
                    </div>
                    <div className="pie-segment" style={{ background: '#f59e0b', width: '25%' }}>
                      <span>25% Virement</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Donations Tab */}
          {activeTab === 'donations' && (
            <section className="admin-section">
              <div className="section-header">
                <h2>Gestion des Dons</h2>
                <span className="badge">{donations.length} donations</span>
              </div>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nom du Donateur</th>
                      <th>Montant</th>
                      <th>Méthode</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map(donation => (
                      <tr key={donation.id}>
                        <td>{donation.name}</td>
                        <td className="amount">${donation.amount}</td>
                        <td>{donation.method}</td>
                        <td>{donation.date}</td>
                        <td>
                          <span className={`status-badge ${donation.status === 'Confirmé' ? 'confirmed' : 'pending'}`}>
                            {donation.status}
                          </span>
                        </td>
                        <td className="actions">
                          <button className="edit-btn" title="Éditer">✏️</button>
                          <button className="delete-btn" onClick={() => deleteDonation(donation.id)} title="Supprimer">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <section className="admin-section">
              <div className="section-header">
                <h2>Gestion des Messages</h2>
                <span className="badge">{messages.length} messages</span>
              </div>

              {loadingMessages ? (
                <div className="loading-message" style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                  <p>⏳ Chargement des messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="no-messages" style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                  <p>📭 Aucun message pour le moment.</p>
                  <p style={{fontSize: '14px', marginTop: '10px'}}>Les messages envoyés par les visiteurs apparaîtront ici.</p>
                </div>
              ) : (
                <div className="messages-grid">
                  {messages.map(msg => (
                    <div key={msg.id} className={`message-card ${msg.status.toLowerCase().replace(' ', '-')}`}>
                      <div className="message-header">
                        <div className="message-info">
                          <h4>{msg.name}</h4>
                          <span className="country">{msg.country}</span>
                        </div>
                        <div className="message-actions">
                          <button 
                            className={`pin-btn ${msg.isPinned ? 'pinned' : ''}`}
                            onClick={() => togglePin(msg.id)}
                            title={msg.isPinned ? "Désépingler" : "Épingler"}
                          >
                            📌
                          </button>
                        </div>
                      </div>

                      <p className="message-text">"{msg.message}"</p>

                      <div className="message-date">{msg.date}</div>

                      <div className="message-footer">
                        <span className={`status-badge ${msg.status.toLowerCase().replace(' ', '-')}`}>{msg.status}</span>
                        <div className="message-buttons">
                          {msg.status !== 'Approuvé' && (
                            <button className="approve-btn" onClick={() => approveMessage(msg.id)}>✓ Approuver</button>
                          )}
                          {msg.status !== 'Rejeté' && (
                            <button className="reject-btn" onClick={() => rejectMessage(msg.id)}>✗ Rejeter</button>
                          )}
                          <button className="delete-btn" onClick={() => deleteMessage(msg.id)}>🗑️ Supprimer</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
