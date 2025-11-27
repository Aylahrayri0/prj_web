import "./Administrateur.css";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function Administrateur() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [adminCode, setAdminCode] = React.useState("");
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
  const [messages, setMessages] = React.useState([
    { id: 1, name: "Sarah M.", country: "France", message: "Solidarité totale avec Gaza...", date: "2024-11-15", status: "En attente", isPinned: false },
    { id: 2, name: "Ahmed K.", country: "Maroc", message: "قلبي مع غزة. كل يوم أدعو...", date: "2024-11-14", status: "Approuvé", isPinned: true },
    { id: 3, name: "Maria G.", country: "España", message: "Gaza libre, Gaza de pie...", date: "2024-11-13", status: "Approuvé", isPinned: false },
    { id: 4, name: "John P.", country: "USA", message: "Unconditional support for Gaza...", date: "2024-11-12", status: "En attente", isPinned: false },
  ]);

  // Dashboard statistics
  const statistics = {
    donationsToday: 5,
    donationsWeek: 28,
    donationsMonth: 125,
    totalAmount: 12500,
    messagesReceived: 542,
    visitors: 8934,
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminCode === "ADMIN2024") {
      setIsLoggedIn(true);
      setLoginError("");
      setAdminCode("");
    } else {
      setLoginError("Code administrateur incorrect. Veuillez réessayer.");
    }
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

  const deleteMessage = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      setMessages(messages.filter(m => m.id !== id));
    }
  };

  const approveMessage = (id) => {
    setMessages(messages.map(m => m.id === id ? { ...m, status: "Approuvé" } : m));
  };

  const rejectMessage = (id) => {
    setMessages(messages.map(m => m.id === id ? { ...m, status: "Rejeté" } : m));
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
            <button className="nav-btn">Dons</button>
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
                <label htmlFor="code">Code Administrateur</label>
                <input
                  type="password"
                  id="code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Entrez le code administrateur"
                  className="login-input"
                />
              </div>
              
              {loginError && <div className="error-message">{loginError}</div>}
              
              <button type="submit" className="login-btn">Se Connecter</button>
            </form>

            <p className="login-help">Code: ADMIN2024</p>
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
          <button className="nav-btn">Dons</button>
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

              <div className="messages-grid">
                {messages.map(msg => (
                  <div key={msg.id} className={`message-card ${msg.status.toLowerCase()}`}>
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
                      <span className={`status-badge ${msg.status.toLowerCase()}`}>{msg.status}</span>
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
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
