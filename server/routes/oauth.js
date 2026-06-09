const express = require("express")
const passport = require("../config")
const jwt = require("jsonwebtoken")

const oauthroute = express.Router()


oauthroute.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
)

oauthroute.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "https://snapurlapp.vercel.app/?error=oauth_failed" }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )
       res.redirect(`https://snapurlapp.vercel.app/oauth-success?token=${token}`)   
    }
)

module.exports = oauthroute