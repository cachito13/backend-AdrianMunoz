import { Router } from 'express'
import userModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from "../utils.js";
import passport from 'passport';

const router = Router()
//api para register
// router.post('/register', async(req, res) => {
//     const userNew = {
//         name: req.body.creatingName,
//         surname: req.body.creatingSurname,
//         age: req.body.creatingAge,
//         email: req.body.creatingEmail,
//         password: createHash(req.body.creatingPassword)
//     }

//     if(userNew.email === 'adminCoder@coder.com'){
//         userNew.role = 'Administrador/a'
//     } else{
//         userNew.role = 'Usuario/a'
//     }
    
//     const user = new userModel(userNew)
//     await user.save()
//     res.redirect('/login')
// })



// API para crear usuarios en la DB
router.post('/register', passport.authenticate('register', {
    failureRedirect: '/failRegister'
}), async(req, res) => {
    res.redirect('/login')
})
router.get('/failRegister', (req, res) => {
    res.send({ error: 'Faileed!'})
})


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
router.post('/login', passport.authenticate('login', { failureRedirect: '/failLogin'}), async (req, res) => {
    res.redirect('/products')
})

router.get('/failLogin', (req, res) => {
    res.send({ error: 'Failedddd!'})
})


//vista para logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
           
            res.redirect('/userError')
        } else res.redirect('/login')
    })
})
//github
router.get('/github', passport.authenticate('github', { scope: ['user:email']}),
async(req, res) => {})

router.get('/api/session/githubcallback', passport.authenticate('github', {
    failureRedirect: '/login'
}), async(req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})
export default router