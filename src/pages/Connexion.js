import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyLogin } from "../utils/authDb";
import MainHeader from "../components/MainHeader";
import "./Connexion.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Connexion = ({ setIsLoggedIn }) => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Focus on username input on mount
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Clear error message
  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !pwd) {
      setErrMsg('Veuillez remplir tous les champs');
      errRef.current?.focus();
      return;
    }

    const userEmail = user.toLowerCase().trim();

    // Check if email format is valid
    if (!EMAIL_REGEX.test(userEmail)) {
      setErrMsg('Veuillez entrer une adresse email valide');
      errRef.current?.focus();
      return;
    }

    try {
      // Verify login credentials with database
      const result = verifyLogin(userEmail, pwd);
      
      if (result.success) {
        console.log('Connexion réussie:', result.user);
        // Save login status to localStorage
        localStorage.setItem("loggedIn", "true");
        setIsLoggedIn(true);
        setSuccess(true);
        setTimeout(() => {
          navigate('/success');
        }, 1500);
      } else {
        setErrMsg(result.message);
        errRef.current?.focus();
      }
    } catch (err) {
      setErrMsg('Erreur lors de la connexion');
      errRef.current?.focus();
    }
  };

  return (
    <>
      <MainHeader activeKey="dons" />

      <div style={{ paddingTop: '75px' }}>
      {success ? (
        <section className="connexion-success">
          <div className="success-container">
            <h1>✓ Connexion réussie!</h1>
            <p>Bienvenue!</p>
            <p className="redirect-msg">Redirection en cours...</p>
          </div>
        </section>
      ) : (
        <section className="connexion-section">
          <div className="connexion-container">
            <div className="connexion-tabs">
              <button className="tab-btn active">← Connexion</button>
              <button className="tab-btn" onClick={() => navigate('/inscription')}>
                👤 Inscription
              </button>
            </div>

            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>

            <h1>Se connecter</h1>

            <form onSubmit={handleSubmit} className="connexion-form">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                    placeholder="Votre mot de passe"
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                Se connecter
              </button>
            </form>

            <p className="signup-link">
              Pas encore inscrit? <br />
              <button
                type="button"
                onClick={() => navigate('/inscription')}
                className="link-btn"
              >
                Créer un compte
              </button>
            </p>

            <p className="security-info">
              🔒 Vos données sont protégées et sécurisées
            </p>
          </div>
        </section>
      )}
      </div>
    </>
  );
};

export default Connexion;
