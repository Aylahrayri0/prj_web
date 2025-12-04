import "./Temoignages.css";
import React from "react";
import { testimonialAPI } from '../utils/api';
import MainHeader from "../components/MainHeader";

const FALLBACK_TESTIMONIALS = [
  {
    id: "fallback-1",
    name: "Amina B.",
    country: "Maroc",
    date: "2024-05-01",
    message: "Nous sommes à vos côtés jour et nuit.",
    color: "green",
    approved: true,
  },
  {
    id: "fallback-2",
    name: "Jean L.",
    country: "France",
    date: "2024-04-22",
    message: "Que la paix revienne rapidement.",
    color: "green",
    approved: true,
  },
  {
    id: "fallback-3",
    name: "Sara K.",
    country: "Canada",
    date: "2024-03-18",
    message: "Force et courage au peuple de Gaza.",
    color: "green",
    approved: true,
  },
];

// Testimonials page component with message submission functionality
export default function Temoignages() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [testimonials, setTestimonials] = React.useState([]);
  const [formData, setFormData] = React.useState({
    name: '',
    country: '',
    message: ''
  });
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [pendingCount, setPendingCount] = React.useState(0);
  const [usingFallback, setUsingFallback] = React.useState(false);

  // Load approved testimonials from backend on page load
  React.useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const response = await testimonialAPI.getAll();
        // Laravel returns array directly, not wrapped in data
        const data = Array.isArray(response) ? response : (response?.data || []);

        if (data && Array.isArray(data)) {
          const formattedTestimonials = data.map((testimonial) => {
            const isApproved = testimonial.approved === true || testimonial.approved === 1;
            const createdAt = testimonial.created_at ? new Date(testimonial.created_at) : new Date();
            return {
              id: testimonial.id ?? `testimonial-${Math.random().toString(36).slice(2)}`,
              name: testimonial.name || 'Anonyme',
              country: testimonial.country || 'Unknown',
              date: createdAt.toISOString().split('T')[0],
              message: testimonial.content || testimonial.message || '—',
              color: isApproved ? 'green' : 'red',
              approved: isApproved,
            };
          });

          const approvedTestimonials = formattedTestimonials.filter(t => t.approved);
          const pendingOnly = formattedTestimonials.length - approvedTestimonials.length;
          setPendingCount(pendingOnly);

          if (approvedTestimonials.length === 0) {
            setTestimonials(FALLBACK_TESTIMONIALS);
            setUsingFallback(true);
          } else {
            setTestimonials(approvedTestimonials);
            setUsingFallback(false);
          }
        } else {
          setTestimonials(FALLBACK_TESTIMONIALS);
          setUsingFallback(true);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setErrorMessage('Impossible de se connecter au serveur. Affichage des témoignages de démonstration.');
        setTestimonials(FALLBACK_TESTIMONIALS);
        setUsingFallback(true);
        setPendingCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSubmitSuccess(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSubmitSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Submit testimonial to backend
      const response = await testimonialAPI.create({
        name: formData.name,
        country: formData.country,
        message: formData.message,
        rating: 5
      });
      
      console.log('Testimonial submitted successfully:', response);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({ name: '', country: '', message: '' });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      alert('Erreur: Impossible de se connecter au serveur.\n\nVérifiez que:\n1. Le backend Laravel est démarré (php artisan serve)\n2. Le serveur tourne sur http://localhost:8000\n3. La base de données est configurée\n\nErreur: ' + err.message);
    }
  };

  return (
    <div className="temoignages-container">
      <MainHeader activeKey="temoignages" />

      {/* Main Section */}
      <section className="temoignages-section">
        {/* Title Section */}
        <div className="temoignages-title-section">
          <div className="heart-badge">💝 Messages du cœur 💝</div>
          <h1 className="main-title">Témoignages</h1>
          <p className="subtitle">Partagez votre message de solidarité avec Gaza</p>
          <button className="submit-btn" onClick={handleOpenModal}>📝 Envoyer un message de soutien</button>
        </div>

        {isLoading && <div className="info-banner info-loading">Chargement des témoignages...</div>}
        {errorMessage && <div className="info-banner info-error">{errorMessage}</div>}
        {usingFallback && !errorMessage && (
          <div className="info-banner info-warning">
            Les témoignages ci-dessous sont fournis à titre d'exemple en attendant la validation de nouveaux messages.
          </div>
        )}
        {!isLoading && testimonials.length === 0 && (
          <div className="info-banner info-empty">Aucun témoignage n'est disponible pour le moment.</div>
        )}

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
                <span className={`status-pill ${testimonial.approved ? 'approved' : 'pending'}`}>
                  {testimonial.approved ? 'Validé' : 'En attente'}
                </span>
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
                {submitSuccess ? (
                  <div className="success-message">
                    <div className="success-icon">✓</div>
                    <h3>Message envoyé avec succès!</h3>
                    <p>Votre message sera affiché après validation par l'administrateur.</p>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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
