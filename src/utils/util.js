import bcrypt from "bcrypt"; 
import passport from "passport";

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password); 
export { createHash, isValidPassword};

const passportCall = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if (error) {
                return next(error);
            }
            if (!user) {
                return res.status(401).send({ error: info.message || "Usuario no autenticado" });
            }

            req.user = user;
            next();
        })(req, res, next);
    };
};

const authorization = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).send({ message: "Acceso denegado. Solo para administradores." });
        }
        next();
    };
};

const calcularTotal = (products) => {
    let total = 0; 

    products.forEach( item => {
        total += item.product.price * item.quantity;
    })

    return total; 
}

export { passportCall, authorization, calcularTotal };