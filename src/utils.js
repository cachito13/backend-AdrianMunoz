//hasheo de pasword
import bcrypt from 'bcrypt'
import  jwt  from 'jsonwebtoken'

export const JWT_PRIVATE_KEY = 'secret'
export const JWT_COOKIE_NAME = 'coderCookieToken'

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)


}
//jwt
export const generateToken = user => {
    const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '24h' })
    return token
}
export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null
}
export const passportCall = strategy => {
    return async(req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if (err) return next(err)
            if (!user) return res.status(401).render('errors/base', { error: info.messages ? info.messages : info.toString() })
            
            req.user = user
            next()
        })(req, res, next)
    }
}
export const handlePolicies = policies => (req, res, next) => {
    const user = req.user.user || null
    console.log('handlePolicies: ', user)
    if (policies.includes('ADMIN')) {
        if (user.role !== 'admin') {
            return res.status(403).render('errors/base', {
                error: 'Need to be an ADMIN'
            })
        }
    }
    return next()
}