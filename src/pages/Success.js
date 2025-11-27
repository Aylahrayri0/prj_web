import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Success.css';

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalAmount = selectedAmount || customAmount;

    if (!finalAmount) {
      setErrMsg('Veuillez sélectionner ou entrer un montant');
      errRef.current?.focus();
      return;
    }

    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setErrMsg('Veuillez remplir tous les champs de paiement');
      errRef.current?.focus();
      return;
    }

    try {
      console.log({
        montant: finalAmount,
        carte: cardNumber,
        nom: cardName,
        expiration: expiryDate,
        cvv: cvv
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedAmount(null);
        setCustomAmount('');
        setCardNumber('');
        setCardName('');
        setExpiryDate('');
        setCvv('');
      }, 2000);
    } catch (err) {
      setErrMsg('Erreur lors du traitement du don');
      errRef.current?.focus();
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
              <rect width="900" height="200" fill="#CE1126"/>
              <rect y="200" width="900" height="200" fill="white"/>
              <rect y="400" width="900" height="200" fill="#007A5E"/>
              <polygon points="0,0 200,300 0,600" fill="black"/>
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
          {success ? (
            <section className="donation-success">
              <h1>Merci pour votre générosité!</h1>
              <p>
                Votre générosité aide à reconstruire Gaza et à apporter de l'espoir
              </p>
              <button onClick={() => navigate('/accueil')} className="back-btn">Retour à l'accueil</button>
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
                    <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
                      <rect width="900" height="600" fill="white"/>
                      <rect width="900" height="200" fill="#CE1126"/>
                      <rect y="200" width="900" height="200" fill="white"/>
                      <rect y="400" width="900" height="200" fill="#007A5E"/>
                      <polygon points="0,0 200,300 0,600" fill="black"/>
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

                  <button type="submit" className="submit-btn">
                    Confirmer le don de {selectedAmount || customAmount || '0'}€
                  </button>

                  <p className="security-info">
                    🔒 Paiement sécurisé • Reçu fiscal automatique
                  </p>
                </form>
              </footer>
            </section>
          )}
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
