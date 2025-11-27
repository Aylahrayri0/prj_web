import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SuccessConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount } = location.state || { amount: '0' };

  return (
    <section className="success-confirmation" style={{ background: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', marginBottom: '1000px' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', width: '100%', color: '#333' }}>
        <div style={{ fontSize: '100px', marginBottom: '30px', animation: 'pulse 1s infinite', color: '#4caf50' }}>✓</div>
        <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '20px', color: '#4caf50' }}>Donation Confirmed!</h1>
        <p style={{ fontSize: '20px', marginBottom: '30px', color: '#666', lineHeight: '1.6' }}>
          Your generosity helps rebuild Gaza and bring hope
        </p>
        <div style={{ background: '#4caf50', borderRadius: '12px', padding: '25px', marginBottom: '40px', border: 'none' }}>
          <p style={{ fontSize: '18px', color: 'white', fontWeight: '600', marginBottom: '10px' }}>
            Thank you for your cooperation with us!
          </p>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', marginBottom: '15px' }}>
            Thank you for your contribution and support.
          </p>
          <p style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>
            Donation Amount: {amount}€
          </p>
        </div>
        <button 
          onClick={() => navigate('/dons')} 
          style={{ 
            padding: '14px 40px', 
            background: '#4caf50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '16px', 
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#45a049';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#4caf50';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
          }}
        >
          Make Another Donation
        </button>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
      `}</style>
    </section>
  );
}
