// Simple local database for storing registered users
// In production, this would be a real backend database

const DB_KEY = 'prj_web_users';

// Initialize database with empty array if not exists
const initializeDb = () => {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    localStorage.setItem(DB_KEY, JSON.stringify([]));
  }
};

// Get all registered users
export const getAllUsers = () => {
  initializeDb();
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

// Check if email is already registered
export const emailExists = (email) => {
  const users = getAllUsers();
  return users.some(user => user.email.toLowerCase() === email.toLowerCase());
};

// Register a new user
export const registerUser = (username, email, password) => {
  if (emailExists(email)) {
    return { success: false, message: 'Cet email est déjà utilisé' };
  }

  const users = getAllUsers();
  const newUser = {
    id: Date.now(),
    username: username,
    email: email.toLowerCase(),
    password: password, // In production, this should be hashed!
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(DB_KEY, JSON.stringify(users));

  return { success: true, message: 'Utilisateur enregistré avec succès', user: newUser };
};

// Verify login credentials
export const verifyLogin = (email, password) => {
  const users = getAllUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { success: false, message: 'Cet email n\'est pas inscrit' };
  }

  // In production, compare hashed passwords!
  if (user.password !== password) {
    return { success: false, message: 'Mot de passe incorrect' };
  }

  return { success: true, message: 'Connexion réussie', user: { id: user.id, username: user.username, email: user.email } };
};

// Get user by email
export const getUserByEmail = (email) => {
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

// Clear all users (for testing/reset)
export const clearAllUsers = () => {
  localStorage.setItem(DB_KEY, JSON.stringify([]));
};
