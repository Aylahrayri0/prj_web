import { useNavigate } from "react-router-dom";
import "./MainHeader.css";

const NAV_ITEMS = [
  { key: "accueil", label: "Accueil", path: "/accueil" },
  { key: "dons", label: "Dons", path: "/dons" },
  { key: "temoignages", label: "Témoignages", path: "/temoignages" },
  { key: "administrateur", label: "Administrateur", path: "/administrateur" },
];

const MainHeader = ({ activeKey = "accueil" }) => {
  const navigate = useNavigate();

  return (
    <header className="main-header">
      <div className="main-header-brand">
        <img
          src="/d5246caa268f230b17f5803d45ede1e6.jpg"
          alt="Drapeau de la Palestine"
          className="main-header-flag"
        />
        <span className="main-header-title">GAZA</span>
      </div>
      <nav className="main-header-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`main-header-btn${
              item.key === activeKey ? " active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default MainHeader;
