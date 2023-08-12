import passport from "passport"
import local from 'passport-local'
import UserModel from '../dao/models/user.model.js'

import GitHubStrategy from 'passport-github2'
import cartModel from "../dao/models/cart.model.js"
import passport_jwt from "passport-jwt";
import { createHash, extractCookie, generateToken, isValidPassword, JWT_PRIVATE_KEY } from '../utils.js'

const JWTStrategy = passport_jwt.Strategy
const ExtractJWT = passport_jwt.ExtractJwt

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { name, surname, email, age } = req.body;
        try {
            const user = await UserModel.findOne({ email: username });
            if (user) {
             
                return done(null, false, { message: 'User already exists' });
            }
    
            // Verifica que los datos a guardar sean válidos antes de crear el usuario
            if (!name || !surname || !age || !email || !password) {
             
                return done(null, false, { message: 'Missing required fields' });
            }
            //crea un carrito
            const cartNewUser = await cartModel.create({});
            const newUser = {
                name,
                surname,
                email,
                age,
                password: createHash(password),
                cart: cartNewUser._id,
            };
            if (
                newUser.email === "adminCoder@coder.com" &&
                bcrypt.compareSync("adminCod3r123", newUser.password)
              ) {
                newUser.role = "Admin";
              }
            const result = await UserModel.create(newUser);
            return done(null, result);
        } catch (err) {
           
            return done(err, false, { message: 'Error while registering user' });
        }
    }));
    
    

// Archivo: passport-config.js

passport.use('login', new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            console.log('User not found');
            return done(null, false);
        }
        if(!isValidPassword(user, password)) return done(null, false)

        const token = generateToken(user)
        user.token = token

        return done(null, user)
    } catch (error) {
        
    }
}));
//github
passport.use('github', new GitHubStrategy({
    clientID: 'Iv1.11c2fcb59aae9951',
    clientSecret: '7d9b68f1ac287b64f0ba7b300f5ea1818eac47b7',
    callbackURL: 'http://localhost:8080/api/session/githubcallback'
}, async(accessToken, refreshToken, profile, done) => {
    try {
        console.log("GitHub Profile name:", profile._json.name);
        console.log("GitHub Profile Email:", profile._json.email); // Agregamos el console.log para imprimir el email
        const user = await UserModel.findOne({ email: profile._json.email });
        if (user) {
            return done(null, user);
        }

        const newUser = await UserModel.create({
            name: profile._json.name,
            surname: " ",
            email: profile._json.email,
            age: " ",
            password: " ",
            role: 'Usuario/a' 
        });
        return done(null, newUser);
    } catch (err) {
        return done(`Error to login with GitHub: ${err}`);
    }
}));
//jwt
passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
    secretOrKey: JWT_PRIVATE_KEY
}, async(jwt_payload, done) => {
    done(null, jwt_payload)
}))

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {

    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});



}

export default initializePassport