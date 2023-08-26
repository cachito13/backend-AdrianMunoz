
export const userRegisterController = async(req, res) => { res.redirect('/login')}

export const userLoginController = async (req, res) => {res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products')}

export const githubController = async(req, res) => {}
export const githubcallbackController = async(req, res) => {
    req.session.user = req.user
    res.redirect('/products')
}

