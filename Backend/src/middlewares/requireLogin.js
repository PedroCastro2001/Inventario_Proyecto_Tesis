/* export const requireLogin = (req, res, next) => {
    /*if (!req.session.user) {
        return res.status(401).json({ message: "No autorizado, debes iniciar sesión" });
    }
    next(); 
};*/
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET || 'hospitalvn';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer token"
  console.log('HEADER AUTH:', authHeader); // 👈 agrega esta línea

  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
    req.user = user; // Guardamos info del usuario en req
    next();
  });
};