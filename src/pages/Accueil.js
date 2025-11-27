// accueil.js
import "./Accueil.css";
import { useNavigate } from "react-router-dom";

export default function Accueil({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setIsLoggedIn(false);
    navigate('/accueil');
  };

  const handleDonClick = () => {
    if (isLoggedIn) {
      navigate('/dons');
    } else {
      navigate('/connexion');
    }
  };

  return (
    <div className="container">
      {/* Navigation Header */}
      <header className="header">
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
          <button className="nav-btn active" onClick={() => navigate('/')}>Accueil</button>
          <button className="nav-btn" onClick={() => navigate('/temoignages')}>Témoignages</button>
          <button className="nav-btn" onClick={handleDonClick}>Dons</button>
          <button className="nav-btn" onClick={() => navigate('/administrateur')}>Administrateur</button>
          {isLoggedIn && (
            <button className="nav-btn logout-btn" onClick={handleLogout}>Déconnexion</button>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero" style={{ backgroundImage: "url('/palestine.png') "}}>
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>PLATEFORME DE SOUTIEN À GAZA</h1>
          <p>Rendez-les heureux, s'il vous plaît</p>
          <button className="don-btn" onClick={handleDonClick}>FAIRE UN DON MAINTENANT</button>
        </div>
      </section>

      {/* Donation Categories Section - REMOVED */}

      {/* Auth Buttons Section - REMOVED */}

      {/* Articles Section */}
      <section className="articles">
        <h2>Articles et actualités</h2>
        <p className="subtitle">Suivez l'évolution de nos actions sur le terrain</p>

        <div className="articles-container">
          <div className="card-wrapper">
            <div className="card">
              <img src="/gaza-bg.jpg" alt="campagne" />
              <div className="card-content">
                <span className="date">📅 2024-11-15</span>
                <h3>Lancement de la campagne de reconstruction</h3>
                <p>
                  Une nouvelle initiative visant à reconstruire 500 maisons pour les familles déplacées a été lancée cette semaine.
                </p>
                <button className="read-more-btn">Lire la suite →</button>
              </div>
            </div>
            <button className="en-savoir-plus" onClick={scrollToTop}>En savoir plus</button>
          </div>

          <div className="temoignages-wrapper">
            <div className="temoignages-side">
              <button className="heart-btn">💝 Messages du cœur 💝</button>
              <h2>Témoignages</h2>
              <p className="temo-subtitle">Messages de soutien de notre communauté</p>

              <div className="messages">
                <div className="msg-card red">
                  <div className="msg-header">
                    <div className="avatar red-avatar">❤</div>
                    <div className="msg-info">
                      <span className="name">Sarah M.</span>
                      <span className="badge">France</span>
                    </div>
                    <span className="msg-date">2024-11-15</span>
                  </div>
                  <p className="msg-text">
                    "Solidarité totale avec le peuple de Gaza. Leur résilience est une inspiration pour le monde entier. Nous ne vous oublions pas."
                  </p>
                </div>

                <div className="msg-card green">
                  <div className="msg-header">
                    <div className="avatar green-avatar">❤</div>
                    <div className="msg-info">
                      <span className="name">Ahmed K.</span>
                      <span className="badge">Maroc</span>
                    </div>
                    <span className="msg-date">2024-11-14</span>
                  </div>
                  <p className="msg-text">
                    "قلبي مع غزة. كل يوم أدعو من أجل السلام وإعادة الإعمار. معاً نحن أقوى."
                  </p>
                </div>
              </div>
            </div>
            <button className="en-savoir-plus" onClick={scrollToTop}>En savoir plus</button>
          </div>
        </div>

        <div className="buttons-container">
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact">
        <div className="impact-title">
          <h2>Découvrez comment vos dons transforment des vies à Gaza</h2>
        </div>

        <div className="impact-containers">
          {/* Impact Item 1 */}
          <div className="impact-item">
            <div className="impact-image">
              <img src="a7d153ee15c2afe5515e4cb0f11b08ba.jpg" alt="Aide alimentaire" />
            </div>
            <div className="impact-content">
              <div className="impact-icon">❤️</div>
              <h3>Toujours donner sans se souvenir et toujours recevoir sans oublier</h3>
              <ul className="impact-points">
                <li>Donner ne précède pas seulement recevoir : c'est la raison.</li>
                <li>Des milliers de familles reçoivent une aide alimentaire chaque mois grâce à votre générosité.</li>
              </ul>
              <button className="impact-btn">Votre soutien fait la différence</button>
            </div>
          </div>

          {/* Impact Item 2 */}
          <div className="impact-item reverse">
            <div className="impact-image">
              <img src="8af264c3a1fba39764d8f4dc9741667f.jpg" alt="Secours et sauvetage" />
            </div>
            <div className="impact-content">
              <div className="impact-icon">❤️</div>
              <h3>Chaque vie compte, chaque seconde compte</h3>
              <ul className="impact-points">
                <li>Nos équipes de secours travaillent 24h/24 pour sauver des vies.</li>
                <li>Votre soutien permet de fournir l'équipement vital nécessaire aux opérations de sauvetage.</li>
              </ul>
              <button className="impact-btn">Votre soutien fait la différence</button>
            </div>
          </div>

          {/* Impact Item 3 */}
          <div className="impact-item">
            <div className="impact-image">
              <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=500&h=400&fit=crop" alt="Reconstruction" />
            </div>
            <div className="impact-content">
              <div className="impact-icon">❤️</div>
              <h3>Ensemble, reconstruisons l'espoir</h3>
              <ul className="impact-points">
                <li>Chaque contribution aide à reconstruire des vies brisées.</li>
                <li>Votre générosité offre un avenir meilleur aux enfants de Gaza.</li>
              </ul>
              <button className="impact-btn">Votre soutien fait la différence</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Always show */}
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
              <li onClick={() => navigate('/')}>→ Accueil</li>
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
}
