var LocalStrategy = require('passport-local').Strategy

function initialize(passport, getUserById) {
    const authenticateUser = (id, done) => {
        const estudante = getUserById(id)
        if (estudante == null) {
            return (null, false, { message: "No user found" });
        }
        return done(null, estudante);
    }
    passport.use(new LocalStrategy({ usernameField: 'id' }, authenticateUser))
    passport.serializeUser((estudante, done) => { done(null, estudante.id) })
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize