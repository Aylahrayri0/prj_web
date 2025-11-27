import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyLogin } from '../utils/authDb';
import { donationAPI, donationCategoryAPI } from '../utils/api';
import "./Dons.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Dons = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const errRef = useRef();
  const userRef = useRef();
  const loginErrRef = useRef();

  const donationAmounts = [10, 25, 50, 100, 250, 500];

  // Login states
  const [showLoginForm, setShowLoginForm] = useState(!isLoggedIn);
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [loginErrMsg, setLoginErrMsg] = useState('');

  // Donation states
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch donation categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await donationCategoryAPI.getAll();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setLoginErrMsg('');
  }, [user, pwd]);

  useEffect(() => {
    setErrMsg('');
  }, [selectedAmount, customAmount, cardNumber, cardName, expiryDate, cvv]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!user || !pwd) {
      setLoginErrMsg('Veuillez remplir tous les champs');
      loginErrRef.current?.focus();
      return;
    }

    const userEmail = user.toLowerCase().trim();

    if (!EMAIL_REGEX.test(userEmail)) {
      setLoginErrMsg('Veuillez entrer une adresse email valide');
      loginErrRef.current?.focus();
      return;
    }

    try {
      const result = verifyLogin(userEmail, pwd);
      
      if (result.success) {
        console.log('Connexion réussie:', result.user);
        localStorage.setItem("loggedIn", "true");
        setIsLoggedIn(true);
        setShowLoginForm(false);
      } else {
        setLoginErrMsg(result.message);
        loginErrRef.current?.focus();
      }
    } catch (err) {
      setLoginErrMsg('Erreur lors de la connexion');
      loginErrRef.current?.focus();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setIsLoggedIn(false);
    setShowLoginForm(true);
    setUser('');
    setPwd('');
    setLoginErrMsg('');
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalAmount = selectedAmount || customAmount;

    if (!finalAmount) {
      setErrMsg('Veuillez sélectionner ou entrer un montant');
      errRef.current?.focus();
      return;
    }

    if (!selectedCategory) {
      setErrMsg('Veuillez sélectionner une catégorie');
      errRef.current?.focus();
      return;
    }

    if (!donorName || !donorEmail) {
      setErrMsg('Veuillez entrer votre nom et email');
      errRef.current?.focus();
      return;
    }

    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setErrMsg('Veuillez remplir tous les champs de paiement');
      errRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      // Create donation in backend
      const donationData = {
        category_id: parseInt(selectedCategory),
        amount: parseFloat(finalAmount),
        donor_name: donorName,
        donor_email: donorEmail,
        message: message || null,
        status: 'completed'
      };

      const response = await donationAPI.create(donationData);
      
      console.log('Donation created:', response);
      sessionStorage.setItem('donationAmount', finalAmount);
      setSuccess(true);

      // Reset form
      setTimeout(() => {
        setSelectedAmount(null);
        setCustomAmount('');
        setDonorName('');
        setDonorEmail('');
        setMessage('');
        setCardNumber('');
        setCardName('');
        setExpiryDate('');
        setCvv('');
        setSuccess(false);
        sessionStorage.removeItem('donationAmount');
      }, 5000);

    } catch (err) {
      setErrMsg('Erreur lors du traitement du don: ' + err.message);
      errRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Green Top Bar */}
      <div style={{
        width: '100%',
        height: '8px',
        background: 'linear-gradient(90deg, #4caf50 0%, #45a049 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000
      }}></div>

      {/* Navigation Header */}
      <header className="header" style={{ marginTop: '8px' }}>
        <div className="header-left" style={{ paddingLeft: '40px' }}>
          <div className="flag-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img 
              src="/d5246caa268f230b17f5803d45ede1e6.jpg" 
              alt="Palestine Flag" 
              style={{
                width: '45px',
                height: '30px',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                objectFit: 'cover'
              }}
            />
            <span className="logo-text" style={{ fontSize: '24px', fontWeight: '700', color: '#333' }}>GAZA</span>
          </div>
        </div>
        <nav className="nav-menu">
          <button className="nav-btn" onClick={() => navigate('/accueil')}>Accueil</button>
          <button className="nav-btn">Témoignages</button>
          <button className="nav-btn active" onClick={() => navigate('/dons')}>Dons</button>
          <button className="nav-btn">Administarateur</button>
          {isLoggedIn && (
            <button className="nav-btn logout-btn" onClick={handleLogout}>Déconnexion</button>
          )}
        </nav>
      </header>

      {success && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '40px', maxWidth: '600px', width: '100%', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px', color: '#4caf50' }}>✓</div>
            <h1 style={{ fontSize: '42px', fontWeight: '700', marginBottom: '15px', color: '#4caf50' }}>Don Confirmé!</h1>
            <p style={{ fontSize: '16px', marginBottom: '20px', color: '#666' }}>
              Votre générosité aide à reconstruire Gaza et à apporter de l'espoir
            </p>
            <div style={{ background: '#f5f5f5', borderRadius: '10px', padding: '20px', marginBottom: '30px' }}>
              <p style={{ fontSize: '16px', color: '#333', marginBottom: '10px' }}>
                Merci de votre coopération avec nous!
              </p>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                Merci de votre contribution et de votre soutien.
              </p>
              <p style={{ fontSize: '18px', fontWeight: '700', color: '#CE1126' }}>
                Montant du don: {sessionStorage.getItem('donationAmount')}€
              </p>
            </div>
            <button 
              onClick={() => {
                setSuccess(false);
                setSelectedAmount(null);
                setCustomAmount('');
                setCardNumber('');
                setCardName('');
                setExpiryDate('');
                setCvv('');
                sessionStorage.removeItem('donationAmount');
              }} 
              style={{ 
                padding: '12px 35px', 
                background: '#4caf50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '15px', 
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#45a049';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#4caf50';
              }}
            >
              Refaire un don
            </button>
          </div>
        </div>
      )}

      {showLoginForm ? (
        <section className="connexion-section" style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '60px' }}>
          <div style={{ maxWidth: '600px', width: '100%', margin: '0 20px' }}>
            {/* Message */}
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.6' }}>
                Votre générosité aide à reconstruire Gaza et à apporter de l'espoir
              </p>
            </div>

            {/* Connexion / Inscription Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '50px' }}>
              <button 
                onClick={() => {}} 
                style={{ 
                  padding: '15px 30px', 
                  border: '2px solid #4caf50', 
                  background: 'white', 
                  color: '#4caf50', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#4caf50';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#4caf50';
                }}
              >
                ← Connexion
              </button>
              <button 
                onClick={() => navigate('/inscription')} 
                style={{ 
                  padding: '15px 30px', 
                  background: '#4caf50', 
                  color: 'white', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  borderRadius: '8px', 
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#45a049';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#4caf50';
                }}
              >
                👤 Inscription
              </button>
            </div>

            {/* Login Form Container */}
            <div className="connexion-container" style={{ background: 'white', borderRadius: '20px', padding: '50px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <h1 style={{ color: '#333', marginBottom: '30px', textAlign: 'center', fontSize: '28px' }}>Se connecter</h1>

              <p
                ref={loginErrRef}
                className={loginErrMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
                style={{ color: '#d32f2f', marginBottom: '20px', textAlign: 'center', fontSize: '14px' }}
              >
                {loginErrMsg}
              </p>

              <form onSubmit={handleLoginSubmit} className="connexion-form">
                {/* Email Field */}
                <div className="form-group" style={{ marginBottom: '25px' }}>
                  <label htmlFor="email" style={{ color: '#333', fontWeight: '600', marginBottom: '10px', display: 'block', fontSize: '15px' }}>Email</label>
                  <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', padding: '12px 15px', background: '#f9f9f9', transition: 'all 0.3s ease' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#4caf50'; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e0e0e0'; }}>
                    <span className="input-icon" style={{ fontSize: '20px' }}>📧</span>
                    <input
                      type="email"
                      id="email"
                      ref={userRef}
                      autoComplete="off"
                      onChange={(e) => setUser(e.target.value)}
                      value={user}
                      required
                      placeholder="votre@email.com"
                      style={{ border: 'none', background: 'transparent', flex: 1, outline: 'none', fontSize: '15px', color: '#333' }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="form-group" style={{ marginBottom: '30px' }}>
                  <label htmlFor="password" style={{ color: '#333', fontWeight: '600', marginBottom: '10px', display: 'block', fontSize: '15px' }}>Mot de passe</label>
                  <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', padding: '12px 15px', background: '#f9f9f9', transition: 'all 0.3s ease' }} onFocus={(e) => { e.currentTarget.style.borderColor = '#4caf50'; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#e0e0e0'; }}>
                    <span className="input-icon" style={{ fontSize: '20px' }}>🔒</span>
                    <input
                      type="password"
                      id="password"
                      onChange={(e) => setPwd(e.target.value)}
                      value={pwd}
                      required
                      placeholder="Votre mot de passe"
                      style={{ border: 'none', background: 'transparent', flex: 1, outline: 'none', fontSize: '15px', color: '#333' }}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn" 
                  style={{ width: '100%', padding: '14px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => { e.target.style.background = '#45a049'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.3)'; }}
                  onMouseLeave={(e) => { e.target.style.background = '#4caf50'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'; }}
                >
                  Se connecter
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '25px', color: '#666', fontSize: '14px' }}>
                🔒 Vos données sont protégées et sécurisées
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="donation-section">
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
            {errMsg}
          </p>

          <div className="gradient-header-bar"></div>

          <div className="donation-container">
            <div className="top-section">
            <div className="flag-center">
              <img 
                src="/d5246caa268f230b17f5803d45ede1e6.jpg" 
                alt="Palestine Flag" 
                style={{
                  width: '150px',
                  height: '100px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  objectFit: 'cover'
                }}
              />
            </div>              <p className="donation-text">
                Votre générosité aide à reconstruire Gaza et à apporter de l'espoir
              </p>
            </div>
          </div>

          <div className="security-section">
            <p className="security-message">
              🔒 Vos données sont protégées et sécurisées
            </p>
          </div>

          <footer className="donation-footer">
            <h1>Choisissez un montant</h1>

            <div className="amount-selector">
              {donationAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={`amount-btn ${selectedAmount === amount ? 'selected' : ''}`}
                  onClick={() => handleAmountSelect(amount)}
                >
                  {amount}€
                </button>
              ))}
            </div>

            <div className="custom-amount">
              <label htmlFor="customAmount">Montant personnalisé</label>
              <input
                type="number"
                id="customAmount"
                placeholder="Montant personnalisé"
                value={customAmount}
                onChange={handleCustomAmount}
                min="1"
              />
            </div>

            <form onSubmit={handleSubmit} className="donation-form">
              <div className="form-section">
                <h2>Sélectionnez une catégorie</h2>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                  style={{ marginBottom: '20px', padding: '10px', fontSize: '14px' }}
                >
                  <option value="">Choisir une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} {cat.description ? `- ${cat.description}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-section">
                <h2>Vos informations</h2>

                <label htmlFor="donorName">Nom complet</label>
                <input
                  type="text"
                  id="donorName"
                  placeholder="Votre nom complet"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  required
                />

                <label htmlFor="donorEmail">Email</label>
                <input
                  type="email"
                  id="donorEmail"
                  placeholder="votre@email.com"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  required
                />

                <label htmlFor="message">Message (Optionnel)</label>
                <textarea
                  id="message"
                  placeholder="Partagez votre message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="3"
                ></textarea>
              </div>

              <div className="form-section">
                <h2>Informations de paiement</h2>

                <label htmlFor="cardNumber">Numéro de carte</label>
                <input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength="19"
                  required
                />

                <label htmlFor="cardName">Nom sur la carte</label>
                <input
                  type="text"
                  id="cardName"
                  placeholder="NOM PRÉNOM"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />

                <div className="card-details">
                  <div>
                    <label htmlFor="expiryDate">Date d'expiration</label>
                    <input
                      type="text"
                      id="expiryDate"
                      placeholder="MM/AA"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      maxLength="5"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength="3"
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Traitement...' : `Confirmer le don de ${selectedAmount || customAmount || '0'}€`}
              </button>

              <p className="security-info">
                🔒 Paiement sécurisé • Reçu fiscal automatique
              </p>
            </form>
          </footer>
        </section>
      )}

      <div className="security-section">
        <p className="security-message">
          🔒 Vos données sont protégées et sécurisées
        </p>
      </div>

      {/* Footer */}
      <footer className="footer" id="footer-section">
        <div className="footer-content">
          <div className="footer-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <img 
                src="/d5246caa268f230b17f5803d45ede1e6.jpg" 
                alt="Palestine Flag" 
                style={{
                  width: '40px',
                  height: '27px',
                  borderRadius: '4px',
                  objectFit: 'cover'
                }}
              />
              <h3 style={{ margin: 0 }}>Gaza Support</h3>
            </div>
            <p>Association humanitaire dédiée au soutien et à la reconstruction de Gaza. Ensemble, nous bâtissons l'espoir.</p>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <p>📍 123 Rue de la Solidarité, Casablanca, Maroc</p>
            <p>📧 contact@soutien-gaza.org</p>
            <p>📞 +212 522 123 456</p>
          </div>

          <div className="footer-section">
            <h3>Confiance</h3>
            <p>✅ Organisation certifiée et reconnue</p>
            <p>✅ Transparence totale sur l'utilisation des dons</p>
            <p>✅ Rapports d'activité réguliers</p>
          </div>

          <div className="footer-section">
            <h3>Liens rapides</h3>
            <ul className="footer-links">
              <li onClick={() => navigate('/accueil')}>→ Accueil</li>
              <li onClick={() => navigate('/dons')}>→ Faire un don</li>
              <li>→ Témoignages</li>
              <li>→ Mentions légales</li>
              <li>→ Politique de confidentialité</li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-partners">
          <h3>Nos partenaires de confiance</h3>
          <div className="partners">
            <div className="partner">🇲🇦 Association Marocaine</div>
            <div className="partner">❤️ ONG Internationale</div>
            <div className="partner">🤝 Croissant Rouge</div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Fait avec <span className="heart">❤</span> pour Gaza</p>
          <p>© 2024 Plateforme de Soutien à Gaza. Tous droits réservés.</p>
          <p>100% des dons vont directement aux bénéficiaires</p>
        </div>
      </footer>
    </>
  );
};

export default Dons;
