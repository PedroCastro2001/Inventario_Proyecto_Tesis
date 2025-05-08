export const requireLogin = (req, res, next) => {
    /*if (!req.session.user) {
        return res.status(401).json({ message: "No autorizado, debes iniciar sesión" });
    }*/
    next(); 
};