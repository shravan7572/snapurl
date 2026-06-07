const express = require("express")
const passport = require("../config")
const jwt = require("jsonwebtoken")

const oauthroute = express.Router()

// Step 1 — redirect to Google
oauthroute.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
)

// Step 2 — Google calls back here
oauthroute.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/?error=oauth_failed" }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )
        // send token to frontend via URL param
       res.redirect(`http://localhost:5173/oauth-success?token=${token}`)   
    }
)

module.exports = oauthroute