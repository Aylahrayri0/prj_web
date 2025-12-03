import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import { authAPI, donationAPI, donationCategoryAPI } from "../utils/api";
import "./Dons.css";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Dons = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const errRef = useRef();
  const userRef = useRef();
  const loginErrRef = useRef();
  const registerUserRef = useRef();

  const donationAmounts = [10, 25, 50, 100, 250, 500];

  // Auth form states
  const [showLoginForm, setShowLoginForm] = useState(!isLoggedIn);
  const [activeTab, setActiveTab] = useState('inscription'); // 'inscription' or 'connexion'
  
  // Login states
  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [loginErrMsg, setLoginErrMsg] = useState('');

  // Registration states
  const [regUser, setRegUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [regEmail, setRegEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [regPwd, setRegPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [regErrMsg, setRegErrMsg] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Donation categories
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Authenticated user
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('gaza_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('gaza_token') || '');

  // Donation states
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Focus on registration username input when inscription tab is active
  useEffect(() => {
    if (!showLoginForm) {
      return;
    }
    if (activeTab === 'inscription') {
      registerUserRef.current?.focus();
    } else if (activeTab === 'connexion') {
      userRef.current?.focus();
    }
  }, [activeTab, showLoginForm]);

  // Validate registration username
  useEffect(() => {
    const result = USER_REGEX.test(regUser);
    setValidName(result);
  }, [regUser]);

  // Validate registration email
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(regEmail));
  }, [regEmail]);

  // Validate registration password and match
  useEffect(() => {
    const result = PWD_REGEX.test(regPwd);
    setValidPwd(result);
    const match = regPwd === matchPwd;
    setValidMatch(match);
  }, [regPwd, matchPwd]);

  // Clear registration error message
  useEffect(() => {
    setRegErrMsg('');
  }, [regUser, regEmail, regPwd, matchPwd]);

  useEffect(() => {
    setLoginErrMsg('');
  }, [user, pwd]);

  useEffect(() => {
    setErrMsg('');
  }, [selectedAmount, customAmount, cardNumber, cardName, expiryDate, cvv]);

  useEffect(() => {
    setShowLoginForm(!isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await donationCategoryAPI.getAll();
        const list = Array.isArray(response) ? response : (response?.data || []);
        setCategories(list);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories de don:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  // Handle registration submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(regUser);
    const v2 = EMAIL_REGEX.test(regEmail);
    const v3 = PWD_REGEX.test(regPwd);

    if (!v1 || !v2 || !v3) {
      setRegErrMsg('Entrée invalide');
      return;
    }

    try {
      await authAPI.register({
        name: regUser.trim(),
        email: regEmail.toLowerCase().trim(),
        password: regPwd,
      });
      setRegSuccess(true);
      setRegErrMsg('');
      setTimeout(() => {
        setActiveTab('connexion');
        setRegSuccess(false);
        // Clear registration fields
        setRegUser('');
        setRegEmail('');
        setRegPwd('');
        setMatchPwd('');
      }, 1500);
    } catch (err) {
      const fallback = 'Erreur lors de l\'inscription';
      if (err?.payload?.errors?.email) {
        setRegErrMsg(err.payload.errors.email[0]);
      } else {
        setRegErrMsg(err.message || fallback);
      }
    }
  };

  const renderValidationIcon = (isValid, hasValue) => {
    if (isValid) {
      return <span style={{ color: '#4caf50', marginLeft: '8px' }}>✓</span>;
    }
    if (!isValid && hasValue) {
      return <span style={{ color: '#d32f2f', marginLeft: '8px' }}>✗</span>;
    }
    return null;
  };

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
      const response = await authAPI.login({
        email: userEmail,
        password: pwd,
      });
      const token = response.token;
      const loggedInUser = response.user;
      if (token && loggedInUser) {
        localStorage.setItem('gaza_token', token);
        localStorage.setItem('gaza_user', JSON.stringify(loggedInUser));
        localStorage.setItem('loggedIn', 'true');
        setAuthToken(token);
        setCurrentUser(loggedInUser);
        setIsLoggedIn(true);
        setShowLoginForm(false);
        setUser('');
        setPwd('');
        navigate('/success');
        return;
      }
      setLoginErrMsg('Impossible de traiter la connexion');
      loginErrRef.current?.focus();
    } catch (err) {
      setLoginErrMsg(err.message || 'Erreur lors de la connexion');
      loginErrRef.current?.focus();
    }
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
      // Create donation with user info if logged in, otherwise use card name
      const donationData = {
        category_id: selectedCategoryId,
        amount: finalAmount,
        donor_name: currentUser ? currentUser.name : cardName,
        donor_email: currentUser ? currentUser.email : `${cardName.toLowerCase().replace(/\s+/g, '')}@guest.com`,
        message: `Don sécurisé via carte ${cardNumber.slice(-4)}`,
      };

      // Add user_id only if user is logged in
      if (currentUser && currentUser.id) {
        donationData.user_id = currentUser.id;
      }

      console.log('🔵 Submitting donation:', donationData);

      const response = await donationAPI.create(donationData, {
        token: authToken || undefined,
      });

      console.log('✅ Donation submitted successfully!');
      console.log('✅ Response:', response);

      sessionStorage.setItem('donationAmount', finalAmount);
      setSuccess(true);
      setSelectedAmount(null);
      setCustomAmount('');
      setCardNumber('');
      setCardName('');
      setExpiryDate('');
      setCvv('');
      setErrMsg('');
    } catch (err) {
      console.error('❌ Donation error:', err);
      setErrMsg(err.message || 'Erreur lors du traitement du don');
      errRef.current?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MainHeader activeKey="dons" />

      <div style={{ paddingTop: '75px' }}>
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
          <div style={{ width: '100%', maxWidth: '640px', margin: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.6' }}>
                Votre générosité aide à reconstruire Gaza et à apporter de l'espoir
              </p>
            </div>

            <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: '12px', overflow: 'hidden', marginBottom: '30px', border: '1px solid #e0e0e0' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('inscription')}
                  style={{
                    padding: '14px 0',
                    background: activeTab === 'inscription' ? '#4caf50' : '#f5f5f5',
                    color: activeTab === 'inscription' ? 'white' : '#4caf50',
                    fontWeight: 600,
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  👤 Inscription
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('connexion')}
                  style={{
                    padding: '14px 0',
                    background: activeTab === 'connexion' ? '#4caf50' : '#f5f5f5',
                    color: activeTab === 'connexion' ? 'white' : '#4caf50',
                    fontWeight: 600,
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Connexion →
                </button>
              </div>

              {activeTab === 'inscription' ? (
                <>
                  <h1 style={{ color: '#333', marginBottom: '20px', textAlign: 'center', fontSize: '28px' }}>Créer un compte</h1>
                  <p
                    ref={errRef}
                    className={regErrMsg ? "errmsg" : "offscreen"}
                    aria-live="assertive"
                    style={{ color: '#d32f2f', marginBottom: regErrMsg ? '20px' : '0', textAlign: 'center', fontSize: '14px' }}
                  >
                    {regErrMsg}
                  </p>

                  {regSuccess ? (
                    <div style={{ textAlign: 'center', padding: '30px 10px', background: '#f5fdf7', borderRadius: '12px', border: '1px solid #c8e6c9', color: '#2e7d32' }}>
                      <h2 style={{ marginBottom: '10px' }}>✓ Inscription réussie</h2>
                      <p>Vous pouvez maintenant vous connecter avec vos identifiants.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleRegisterSubmit} className="inscription-form">
                      <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label htmlFor="regUsername" style={{ color: '#333', fontWeight: 600, marginBottom: '10px', display: 'block', fontSize: '15px' }}>
                          Nom d'utilisateur
                          {renderValidationIcon(validName, regUser)}
                        </label>
                        <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', padding: '12px 15px', background: '#f9f9f9', transition: 'all 0.3s ease' }}>
                          <span className="input-icon" style={{ fontSize: '20px' }}>👤</span>
                          <input
                            type="text"
                            id="regUsername"
                            ref={registerUserRef}
                            autoComplete="off"
                            onChange={(e) => setRegUser(e.target.value)}
                            value={regUser}
                            required
                            aria-invalid={validName ? 'false' : 'true'}
                            aria-describedby="reg-username-help"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                            placeholder="Votre nom d'utilisateur"
                            style={{ border: 'none', background: 'transparent', flex: 1, outline: 'none', fontSize: '15px', color: '#333' }}
                          />
                        </div>
                        <p
                          id="reg-username-help"
                          className={userFocus && regUser && !validName ? 'instructions' : 'offscreen'}
                          style={{ color: '#555', fontSize: '12px', marginTop: '8px' }}
                        >
                          4 à 24 caractères. Doit commencer par une lettre.
                        </p>
                      </div>

                      <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label htmlFor="regEmail" style={{ color: '#333', fontWeight: 600, marginBottom: '10px', display: 'block', fontSize: '15px' }}>
                          Email
                          {renderValidationIcon(validEmail, regEmail)}
                        </label>
                        <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', padding: '12px 15px', background: '#f9f9f9', transition: 'all 0.3s ease' }}>
                          <span className="input-icon" style={{ fontSize: '20px' }}>📧</span>
                          <input
                            type="email"
                            id="regEmail"
                            autoComplete="off"
                            onChange={(e) => setRegEmail(e.target.value)}
                            value={regEmail}
                            required
                            aria-invalid={validEmail ? 'false' : 'true'}
                            placeholder="Votre adresse email"
                            style={{ border: 'none', background: 'transparent', flex: 1, outline: 'none', fontSize: '15px', color: '#333' }}
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label htmlFor="regPwd" style={{ color: '#333', fontWeight: 600, marginBottom: '10px', display: 'block', fontSize: '15px' }}>
                          Mot de passe
                          {renderValidationIcon(validPwd, regPwd)}
                        </label>
                        <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', padding: '12px 15px', background: '#f9f9f9', transition: 'all 0.3s ease' }}>
                          <span className="input-icon" style={{ fontSize: '20px' }}>🔒</span>
                          <input
                            type="password"
                            id="regPwd"
                            onChange={(e) => setRegPwd(e.target.value)}
                            value={regPwd}
                            required
                            aria-invalid={validPwd ? 'false' : 'true'}
                            aria-describedby="reg-pwd-help"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            placeholder="Créez un mot de passe sécurisé"
                            style={{ border: 'none', background: 'transparent', flex: 1, outline: 'none', fontSize: '15px', color: '#333' }}
                          />
                        </div>
                        <p
                          id="reg-pwd-help"
                          className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}
                          style={{ color: '#555', fontSize: '12px', marginTop: '8px' }}
                        >
                          8 à 24 caractères avec majuscules, minuscules, chiffre et caractère spécial.
                        </p>
                      </div>

                      <div className="form-group" style={{ marginBottom: '30px' }}>
                        <label htmlFor="regMatchPwd" style={{ color: '#333', fontWeight: 600, marginBottom: '10px', display: 'block', fontSize: '15px' }}>
                          Confirmez le mot de passe
                          {renderValidationIcon(validMatch && matchPwd, matchPwd)}
                        </label>
                        <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', padding: '12px 15px', background: '#f9f9f9', transition: 'all 0.3s ease' }}>
                          <span className="input-icon" style={{ fontSize: '20px' }}>🔐</span>
                          <input
                            type="password"
                            id="regMatchPwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? 'false' : 'true'}
                            placeholder="Confirmez votre mot de passe"
                            style={{ border: 'none', background: 'transparent', flex: 1, outline: 'none', fontSize: '15px', color: '#333' }}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!validName || !validEmail || !validPwd || !validMatch}
                        className="submit-btn"
                        style={{ width: '100%', padding: '14px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' }}
                        onMouseEnter={(e) => { e.target.style.background = '#45a049'; }}
                        onMouseLeave={(e) => { e.target.style.background = '#4caf50'; }}
                      >
                        S'inscrire
                      </button>
                    </form>
                  )}

                  <p style={{ textAlign: 'center', marginTop: '25px', color: '#666', fontSize: '14px' }}>
                    Déjà inscrit ?{' '}
                    <button type="button" onClick={() => setActiveTab('connexion')} style={{ background: 'none', border: 'none', color: '#4caf50', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Se connecter</button>
                  </p>
                </>
              ) : (
                <>
                  <h1 style={{ color: '#333', marginBottom: '20px', textAlign: 'center', fontSize: '28px' }}>Se connecter</h1>
                  <p
                    ref={loginErrRef}
                    className={loginErrMsg ? "errmsg" : "offscreen"}
                    aria-live="assertive"
                    style={{ color: '#d32f2f', marginBottom: loginErrMsg ? '20px' : '0', textAlign: 'center', fontSize: '14px' }}
                  >
                    {loginErrMsg}
                  </p>

                  <form onSubmit={handleLoginSubmit} className="connexion-form">
                    <div className="form-group" style={{ marginBottom: '25px' }}>
                      <label htmlFor="email" style={{ color: '#333', fontWeight: '600', marginBottom: '10px', display: 'block', fontSize: '15px' }}>Email</label>
                      <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', padding: '12px 15px', background: '#f9f9f9', transition: 'all 0.3s ease' }}>
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

                    <div className="form-group" style={{ marginBottom: '30px' }}>
                      <label htmlFor="password" style={{ color: '#333', fontWeight: '600', marginBottom: '10px', display: 'block', fontSize: '15px' }}>Mot de passe</label>
                      <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '2px solid #e0e0e0', borderRadius: '10px', padding: '12px 15px', background: '#f9f9f9', transition: 'all 0.3s ease' }}>
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
                      onMouseEnter={(e) => { e.target.style.background = '#45a049'; }}
                      onMouseLeave={(e) => { e.target.style.background = '#4caf50'; }}
                    >
                      Se connecter
                    </button>
                  </form>

                  <p style={{ textAlign: 'center', marginTop: '25px', color: '#666', fontSize: '14px' }}>
                    Nouveau sur la plateforme ?{' '}
                    <button type="button" onClick={() => setActiveTab('inscription')} style={{ background: 'none', border: 'none', color: '#4caf50', cursor: 'pointer', fontWeight: 600, padding: 0 }}>Créer un compte</button>
                  </p>
                </>
              )}
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

            {categories.length > 0 && (
              <div className="category-chip" style={{ marginTop: '12px', fontSize: '14px', color: '#555' }}>
                Catégorie sélectionnée : {categories.find(c => c.id === selectedCategoryId)?.name ?? categories[0].name}
              </div>
            )}

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
      </div>
    </>
  );
};

export default Dons;
