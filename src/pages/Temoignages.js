import "./Temoignages.css";
import { useNavigate } from "react-router-dom";
import React from "react";

// Testimonials page component with message submission functionality
export default function Temoignages() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [testimonials, setTestimonials] = React.useState([
    {
      id: 1,
      name: "Sarah M.",
      country: "France",
      date: "2024-11-15",
      message: "Solidarité totale avec le peuple de Gaza. Leur résilience est une inspiration pour le monde entier. Nous ne vous oublions pas.",
      color: "red"
    },
    {
      id: 2,
      name: "Ahmed K.",
      country: "Maroc",
      date: "2024-11-14",
      message: "قلبي مع غزة. كل يوم أدعو من أجل السلام وإعادة الإعمار. معاً نحن أقوى.",
      color: "green"
    },
    {
      id: 3,
      name: "Maria G.",
      country: "España",
      date: "2024-11-13",
      message: "Gaza libre, Gaza de pie. Su valentia nos inspira a todos. Sigan luchando, el mundo entero los apoya.",
      color: "red"
    },
    {
      id: 4,
      name: "John P.",
      country: "USA",
      date: "2024-11-12",
      message: "Unconditional support for Gaza. Justice will prevail. Stay strong, we stand with you.",
      color: "green"
    },
    {
      id: 5,
      name: "Yasmine B.",
      country: "Tunisie",
      date: "2024-11-11",
      message: "من كل قلبي مع غزة. لسبم وحكم في هذه المحبة.",
      color: "red"
    },
    {
      id: 6,
      name: "Mohamed A.",
      country: "México",
      date: "2024-11-10",
      message: "Gaza vivirá, Gaza vencerá. Su determinación es admirable. Que la paz regrese pronto.",
      color: "green"
    },
    {
      id: 7,
      name: "Emma L.",
      country: "UK",
      date: "2024-11-09",
      message: "My heart breaks for Gaza. Your strength and resilience inspire us all. We will never forget.",
      color: "red"
    },
    {
      id: 8,
      name: "Fatima Z.",
      country: "Palestine",
      date: "2024-11-08",
      message: "غزة الحرة. صمودكم لهما جميعاً. يحن معكم حتى النصر.",
      color: "green"
    },
    {
      id: 9,
      name: "Carlos R.",
      country: "Argentina",
      date: "2024-11-07",
      message: "Todo mi apoyo para Gaza. La justicia prevalecerá. Fuerza hermanos.",
      color: "red"
    },
    {
      id: 10,
      name: "Aisha M.",
      country: "Belgique",
      date: "2024-11-06",
      message: "La solidarité n'a pas de frontières. Gaza dans nos cœurs pour toujours.",
      color: "green"
    }
  ]);
  const [formData, setFormData] = React.useState({
    name: '',
    country: '',
    message: ''
  });

  // Load approved testimonials from backend on page load
  React.useEffect(() => {
    fetch('http://localhost:8000/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          const backendTestimonials = data.data.map(testimonial => ({
            id: testimonial.id,
            name: testimonial.name,
            country: testimonial.email || testimonial.country,
            date: testimonial.created_at ? testimonial.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            message: testimonial.message || testimonial.content,
            color: Math.random() > 0.5 ? "red" : "green"
          }));
          setTestimonials(backendTestimonials);
        }
      })
      .catch(err => console.log('Error fetching testimonials:', err));
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add new testimonial to the list with current date
    const today = new Date().toISOString().split('T')[0];
    const newTestimonial = {
      id: testimonials.length + 1,
      name: formData.name,
      country: formData.country,
      message: formData.message,
      date: today,
      color: Math.random() > 0.5 ? "red" : "green"
    };
    
    // Add to testimonials list
    setTestimonials(prev => [newTestimonial, ...prev]);
    
    // Increment message counter in localStorage
    const currentCount = parseInt(localStorage.getItem('newMessagesCount') || '0');
    localStorage.setItem('newMessagesCount', (currentCount + 1).toString());
    
    // Store the new message for admin panel
    const newMessages = JSON.parse(localStorage.getItem('newMessages') || '[]');
    const messageForAdmin = {
      id: Math.max(...newMessages.map(m => m.id || 0), 0) + 1,
      name: formData.name,
      country: formData.country,
      message: formData.message,
      date: today,
      status: "En attente",
      isPinned: false
    };
    newMessages.push(messageForAdmin);
    localStorage.setItem('newMessages', JSON.stringify(newMessages));
    
    // Send to backend
    fetch('http://localhost:8000/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        country: formData.country,
        message: formData.message,
        rating: 5,
        image_url: null
      })
    }).catch(err => console.log('Testimonial sent'));
    
    // Reset form and close modal
    setFormData({ name: '', country: '', message: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="temoignages-container">
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
          <button className="nav-btn active">Témoignages</button>
          <button className="nav-btn" onClick={() => navigate('/administrateur')}>Administrateur</button>
        </nav>
      </header>

      {/* Main Section */}
      <section className="temoignages-section">
        {/* Title Section */}
        <div className="temoignages-title-section">
          <div className="heart-badge">💝 Messages du cœur 💝</div>
          <h1 className="main-title">Témoignages</h1>
          <p className="subtitle">Partagez votre message de solidarité avec Gaza</p>
          <button className="submit-btn" onClick={handleOpenModal}>📝 Envoyer un message de soutien</button>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={`testimonial-card ${testimonial.color}`}>
              <div className="card-header">
                <div className={`avatar ${testimonial.color}-avatar`}>❤</div>
                <div className="card-info">
                  <span className="author-name">{testimonial.name}</span>
                  <span className={`country-badge ${testimonial.color}`}>{testimonial.country}</span>
                </div>
                <span className="card-date">{testimonial.date}</span>
              </div>
              <p className="card-message">"{testimonial.message}"</p>
            </div>
          ))}
        </div>

        {/* Modal Popup */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Envoyer un message de soutien</h2>
                <button className="close-btn" onClick={handleCloseModal}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="name">Nom *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Votre nom"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">Pays *</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Votre pays"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message de soutien *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Écrivez votre message de soutien..."
                    rows="6"
                    required
                  />
                </div>
                <div className="modal-buttons">
                  <button type="button" className="cancel-btn" onClick={handleCloseModal}>Annuler</button>
                  <button type="submit" className="submit-form-btn">Envoyer</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
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
              <li>→ Accueil</li>
              <li>→ Faire un don</li>
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
