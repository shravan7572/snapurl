const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const { loginmodel } = require("./model/modeldb")

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  "https://snapurl-3ill.onrender.com/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await loginmodel.findOne({ email: profile.emails[0].value })

        if (!user) {
            user = await loginmodel.create({
                firstname: profile.name.givenName,
                lastname:  profile.name.familyName,
                email:     profile.emails[0].value,
                googleId:  profile.id
            })
        }

        done(null, user)
    } catch(e) {
        done(e, null)
    }
}))

module.exports = passport