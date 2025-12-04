import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Success.css';
import { donationAPI, donationCategoryAPI } from '../utils/api';

const Success = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const errRef = useRef();

  const donationAmounts = [10, 25, 50, 100, 250, 500];

  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [showDonationSection, setShowDonationSection] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser] = useState(() => {
    const saved = localStorage.getItem('gaza_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authToken] = useState(() => localStorage.getItem('gaza_token') || '');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await donationCategoryAPI.getAll();
        setCategories(response || []);
      } catch (error) {
        console.error('❌ Failed to load donation categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setIsLoggedIn(false);
    navigate('/accueil');
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

  const resetDonationForm = () => {
    setSelectedAmount(null);
    setCustomAmount('');
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalAmount = Number(selectedAmount ?? customAmount);

    if (!finalAmount || isNaN(finalAmount)) {
      setErrMsg('Veuillez sélectionner ou entrer un montant valide');
      errRef.current?.focus();
      return;
    }

    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setErrMsg('Veuillez remplir tous les champs de paiement');
      errRef.current?.focus();
      return;
    }

    if (!categories.length || !selectedCategoryId) {
      setErrMsg('Aucun service de don disponible pour le moment');
      errRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const donationData = {
        category_id: selectedCategoryId,
        amount: finalAmount,
        donor_name: currentUser ? currentUser.name : cardName,
        donor_email: currentUser ? currentUser.email : `${cardName.toLowerCase().replace(/\s+/g, '')}@guest.com`,
        message: `Don sécurisé via carte ${cardNumber.slice(-4)}`,
      };

      if (currentUser?.id) {
        donationData.user_id = currentUser.id;
      }

      console.log('🔵 Submitting donation from Success page:', donationData);

      await donationAPI.create(donationData, {
        token: authToken || undefined,
      });

      console.log('✅ Donation submitted successfully from Success page');

      sessionStorage.setItem('donationAmount', finalAmount);
      setSuccess(true);
      resetDonationForm();
      setErrMsg('');
    } catch (err) {
      console.error('❌ Donation error on Success page:', err);
      setErrMsg(err.message || 'Erreur lors du traitement du don');
      errRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="header">
        <div className="header-left">
          <div className="flag-logo">
            <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
              <rect width="900" height="600" fill="white"/>
              <rect width="900" height="200" fill="#000000"/>
              <rect y="200" width="900" height="200" fill="#ffffff"/>
              <rect y="400" width="900" height="200" fill="#007A5E"/>
              <polygon points="0,0 200,300 0,600" fill="#CE1126"/>
            </svg>
          </div>
          <span className="logo-text">GAZA</span>
        </div>
        <nav className="nav-menu">
          <button className="nav-btn" onClick={() => handleNavigate('/accueil')}>Accueil</button>
          <button className="nav-btn" onClick={() => handleNavigate('/temoignages')}>Témoignages</button>
          <button className="nav-btn" onClick={() => handleNavigate('/dons')}>Dons</button>
          <button className="nav-btn" onClick={() => handleNavigate('/admin')}>Administarateur</button>
          {isLoggedIn && (
            <button className="nav-btn logout-btn" onClick={handleLogout}>Déconnexion</button>
          )}
        </nav>
      </header>

      {!showDonationSection ? (
        <>
          {/* Success Message Section */}
          <section className="success-section">
            <div className="success-container">
              <div className="success-icon">✓</div>
              <h1>Connexion réussie!</h1>
              <p className="success-message">Bienvenue! Vous allez être redirigé vers la page de donation.</p>
              
              {/* Donation Categories Section */}
              <div className="donation-categories">
                <div className="category-card">
                  <div className="card-icon">❤️</div>
                  <h3>Aide Médicale</h3>
                  <p>Fournitures médicales et soins essentiels</p>
                </div>
                <div className="category-card">
                  <div className="card-icon">🏗️</div>
                  <h3>Reconstruction</h3>
                  <p>Reconstruction des maisons et infrastructures</p>
                </div>
                <div className="category-card">
                  <div className="card-icon">🤝</div>
                  <h3>Aide Humanitaire</h3>
                  <p>Nourriture, eau et abris d'urgence</p>
                </div>
              </div>

              {/* Impact Cards Section */}
              <div className="impact-cards-section">
                <div className="impact-card">
                  <h4>50€</h4>
                  <p>Fournitures médicales pour une famille</p>
                </div>
                <div className="impact-card">
                  <h4>100€</h4>
                  <p>Kit alimentaire pour un mois</p>
                </div>
                <div className="impact-card">
                  <h4>250€</h4>
                  <p>Matériaux de reconstruction</p>
                </div>
              </div>

              <button className="skip-btn" onClick={() => setShowDonationSection(true)}>
                Aller directement aux dons →
              </button>
            </div>
          </section>
        </>
      ) : (
        <>
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
                    resetDonationForm();
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

          <section className="donation-section">
              <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                {errMsg}
              </p>

              <div className="gradient-header-bar"></div>

              <div className="donation-container">
                <div className="top-section">
                  <div className="flag-center">
                    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
                      <rect width="900" height="600" fill="white"/>
                      <rect width="900" height="200" fill="#000000"/>
                      <rect y="200" width="900" height="200" fill="#ffffff"/>
                      <rect y="400" width="900" height="200" fill="#007A5E"/>
                      <polygon points="0,0 200,300 0,600" fill="#CE1126"/>
                    </svg>
                  </div>

                  <p className="donation-text">
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

                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Traitement...' : `Confirmer le don de ${selectedAmount || customAmount || '0'}€`}
                  </button>

                  <p className="security-info">
                    🔒 Paiement sécurisé • Reçu fiscal automatique
                  </p>
                </form>
              </footer>
            </section>
        </>
      )}

      {/* Footer */}
      <footer className="footer" id="footer-section">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🇵🇸 Gaza Support</h3>
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
    </div>
  );
};

export default Success;
