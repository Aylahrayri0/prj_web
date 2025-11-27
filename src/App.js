import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Dons from "./pages/Dons";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import Success from "./pages/Success";
import SuccessConfirmation from "./pages/SuccessConfirmation";
import Temoignages from "./pages/Temoignages";
import Administrateur from "./pages/Administrateur";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const loggedInStatus = localStorage.getItem("loggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/accueil" element={<Accueil isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/dons" element={<Dons isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/inscription" element={<Inscription setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/connexion" element={<Connexion setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/success" element={<Success isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/success-confirmation" element={<SuccessConfirmation />} />
        <Route path="/temoignages" element={<Temoignages />} />
        <Route path="/administrateur" element={<Administrateur />} />
      </Routes>
    </Router>
  );
}

export default App;
