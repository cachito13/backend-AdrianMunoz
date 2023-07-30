import passport from "passport"
import local from 'passport-local'
import UserModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'

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
    
            const newUser = {
                name, surname, email, age, password: createHash(password)
            };
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

        if (!isValidPassword(user, password)) {
           
            return done(null, false);
        }

        console.log('Authentication successful');
        return done(null, user);
    } catch (err) {
        console.error('Error:', err);
        return done(err);
    }
}));

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






    // passport.use('login', new LocalStrategy({
    //     usernameField: 'email'
    // }, async(email, password, done) => {
    //     try {
           
    //         const user = await UserModel.findOne({ email})
    //         console.log(user)
    //         if (!user ) {
    //             return done(null, false)
    //         }

    //         if (!isValidPassword(user, password)) return done(null, false)
    //         return done(null, user)
            
    //     } catch(err) {

    //     }
    // }))

    // //graba solamente el id en la session
    // passport.serializeUser((user, done) => {
    //     done(null, user._id)
    // })

    // passport.deserializeUser(async (id, done) => {
    //     const user = await UserModel.findById(id)
    //     done(null, user)
    // })

}

export default initializePassport