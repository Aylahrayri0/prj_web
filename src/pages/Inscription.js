import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { emailExists as checkEmailExists, registerUser } from '../utils/authDb';
import "./Inscription.css";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Inscription = () => {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Focus on username input on mount
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Validate username
  useEffect(() => {
    const result = USER_REGEX.test(user);
    setValidName(result);
  }, [user]);

  // Validate email
  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
    
    // Check if email already exists in database
    if (result) {
      const exists = checkEmailExists(email);
      setEmailExists(exists);
    } else {
      setEmailExists(false);
    }
  }, [email]);

  // Validate password and match
  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  // Clear error message
  useEffect(() => {
    setErrMsg('');
  }, [user, email, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = EMAIL_REGEX.test(email);
    const v3 = PWD_REGEX.test(pwd);

    if (!v1 || !v2 || !v3) {
      setErrMsg('Entrée invalide');
      errRef.current.focus();
      return;
    }

    if (emailExists) {
      setErrMsg('Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.');
      errRef.current.focus();
      return;
    }

    try {
      // Register user in database
      const result = registerUser(user, email, pwd);
      
      if (result.success) {
        console.log('Utilisateur enregistré:', result.user);
        setSuccess(true);
        setTimeout(() => {
          navigate('/connexion');
        }, 1500);
      } else {
        setErrMsg(result.message);
        errRef.current.focus();
      }
    } catch (err) {
      setErrMsg('Erreur lors de l\'inscription');
      errRef.current.focus();
    }
  };

  const renderValidationIcon = (isValid, hasValue) => {
    if (isValid) {
      return <span className="valid-icon">✓</span>;
    }
    if (!isValid && hasValue) {
      return <span className="invalid-icon">✗</span>;
    }
    return null;
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
          <button className="nav-btn" onClick={() => navigate('/dons')}>Dons</button>
          <button className="nav-btn">Administarateur</button>
        </nav>
      </header>

      {success ? (
        <section className="inscription-success">
          <div className="success-container">
            <h1>✓ Inscription réussie!</h1>
            <p>Votre compte a été créé avec succès.</p>
            <p>Vous pouvez maintenant vous connecter.</p>
            <button onClick={() => navigate('/connexion')} className="back-btn">
              Se connecter →
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* White Section with Form */}
          <section className="inscription-top-section" style={{
            background: 'linear-gradient(135deg, #f5f5f5 0%, #f9f9f9 100%)',
            paddingTop: '80px',
            paddingBottom: '60px',
            minHeight: 'calc(100vh - 200px)'
          }}>
            <div className="inscription-container" style={{
              maxWidth: '500px',
              margin: '0 auto',
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <div className="inscription-tabs">
                <button className="tab-btn active">👤 Inscription</button>
                <button className="tab-btn" onClick={() => navigate('/connexion')}>
                  Connexion →
                </button>
              </div>

              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>

              <h1>Créer un compte</h1>

              <form onSubmit={handleSubmit} className="inscription-form">
                {/* Username Field */}
                <div className="form-group">
                  <label htmlFor="username">
                    Nom d'utilisateur
                    {renderValidationIcon(validName, user)}
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      id="username"
                      ref={userRef}
                      autoComplete="off"
                      onChange={(e) => setUser(e.target.value)}
                      value={user}
                      required
                      aria-invalid={validName ? "false" : "true"}
                      aria-describedby="uidnote"
                      onFocus={() => setUserFocus(true)}
                      onBlur={() => setUserFocus(false)}
                      placeholder="Votre nom d'utilisateur"
                    />
                  </div>
                  <p
                    id="uidnote"
                    className={userFocus && user && !validName ? "instructions" : "offscreen"}
                  >
                    <span className="info-icon">ℹ</span>
                    4 à 24 caractères. Doit commencer par une lettre.
                  </p>
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="email">
                    Email
                    {emailExists ? <span className="invalid-icon">✗</span> : renderValidationIcon(validEmail, email)}
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      id="email"
                      autoComplete="off"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                      aria-invalid={validEmail || (!validEmail && email) ? "true" : "false"}
                      aria-describedby="emailnote"
                      placeholder="Votre adresse email"
                    />
                  </div>
                  {emailExists && (
                    <p className="error-message">
                      <span className="error-icon">⚠</span>
                      <span>Cet email est déjà utilisé. <button type="button" onClick={() => navigate('/connexion')} className="link-btn">Se connecter</button></span>
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label htmlFor="password">
                    Mot de passe
                    {renderValidationIcon(validPwd, pwd)}
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type="password"
                      id="password"
                      onChange={(e) => setPwd(e.target.value)}
                      value={pwd}
                      required
                      aria-invalid={validPwd ? "false" : "true"}
                      aria-describedby="pwdnote"
                      onFocus={() => setPwdFocus(true)}
                      onBlur={() => setPwdFocus(false)}
                      placeholder="Créez un mot de passe sécurisé"
                    />
                  </div>
                  <p
                    id="pwdnote"
                    className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
                  >
                    <span className="info-icon">ℹ</span>
                    8 à 24 caractères avec majuscules, minuscules, chiffre et caractère spécial.
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div className="form-group">
                  <label htmlFor="confirm_pwd">
                    Confirmez le mot de passe
                    {renderValidationIcon(validMatch && matchPwd, matchPwd)}
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔐</span>
                    <input
                      type="password"
                      id="confirm_pwd"
                      onChange={(e) => setMatchPwd(e.target.value)}
                      value={matchPwd}
                      required
                      aria-invalid={validMatch ? "false" : "true"}
                      aria-describedby="confirmnote"
                      placeholder="Confirmez votre mot de passe"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!validName || !validEmail || emailExists || !validPwd || !validMatch}
                  className="submit-btn"
                >
                  S'inscrire
                </button>
              </form>

              <p className="login-link">
                Déjà inscrit? 
                <button
                  type="button"
                  onClick={() => navigate('/connexion')}
                  className="link-btn"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </section>

          {/* Security Info Section */}
          <section className="security-section">
            <div className="security-content">
              <p>
                <span className="security-icon">🔒</span>
                Vos données sont protégées et sécurisées
              </p>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Inscription;
