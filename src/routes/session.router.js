import { Router } from 'express'
import passport from 'passport';
import { JWT_COOKIE_NAME } from '../utils.js';
import { githubcallbackController, userLoginController, userRegisterController, githubController } from '../controller/session.controller.js';
const router = Router()

// API para crear usuarios en la DB
router.post('/register', passport.authenticate('register', { failureRedirect: '/failRegister'}), userRegisterController)
router.get('/failRegister', (req, res) => {res.send({ error: 'Faileed!'})})

//api para login
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body
//     //busca por email
//     const user = await userModel.findOne({email}).lean().exec()
//     if(!user) {
//         return res.render('userError', {
//             error: 'User not found, please re-try.',
//             statusCode: 401,
//             user: false
//         })
//     }

//     //si encuentra el email en la BD. consulta la contraseña
//     if (!isValidPassword(user, password)) {
//         return res.render('userError', { 
//             statusCode: 403, 
//             error: 'Incorrect password, please re-try.',
//             user: false
//         })
//     }
//     //si es valido se graba em session
//     req.session.user = user
//     res.redirect('/')
// })


// API para login
router.post('/login', passport.authenticate('login', { failureRedirect: '/failLogin'}), userLoginController)
router.get('/failLogin', (req, res) => {res.send({ error: 'Failedddd!'})})

//vista para logout
router.get('/logout', (req, res) => { res.clearCookie(JWT_COOKIE_NAME).redirect('/login')
})

//github
router.get('/github', passport.authenticate('github', { scope: ['user:email']}), githubController)
router.get('/api/session/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), githubcallbackController)

export default router