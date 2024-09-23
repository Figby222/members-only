import { body, query, validationResult } from "express-validator";
import db from "../db/queries.mjs";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import authUtil from "../lib/authorizationUtil.mjs";
const { checkLoggedIn } = authUtil;
import passport from "../config/passport.mjs";
import "dotenv/config";

const validateUser = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username must not be empty")
        .isLength({ min: 6, max: 25 }).withMessage("Username must be between 6 & 25 characters")
        .isEmail().withMessage("Username must be formatted like so: example@example.com")
        .custom(async (username) => {
            const user = await db.findUserByUsername(username);
            return !!user;
        }).withMessage("Username not available"),
    body("first_name")
        .trim()
        .notEmpty().withMessage("First Name must not be empty"),
    body("last_name")
        .trim()
        .notEmpty().withMessage("Last Name must not be empty"),
    body("password")
        .trim()
        .notEmpty().withMessage("Password must not be empty")
        .isLength({ min: 6, max: 100 }).withMessage("Password must be between 6 and 100 characters"),
    body("confirm_password")
        .trim()
        .custom((confirmPassword, { req }) => {
            return confirmPassword === req.body.password;
        }).withMessage("Confirm Password field must be the same as password")
    
]

const validateClubRegistration = [
    body("secret_password")
        .custom((secretPassword) => {
            return secretPassword === process.env.SECRET_CLUB_PASSWORD;
        }).withMessage("Incorrect password")
]

const validateMessage = [
    body("title")
        .notEmpty().withMessage("Title must not be empty")
        .isLength({ max: 30 }).withMessage("Title contain a maximum of 30 characters"),
    body("text")
        .notEmpty().withMessage("Message must not be empty")
        .isLength({ max: 255 }).withMessage("Message must contain a maximum of 255 characters")
]

const validateAdminRegistration = [
    body("secret_admin_password")
        .custom((secretPassword) => {
            return secretPassword === process.env.SECRET_ADMIN_CLUB_PASSWORD;
        }).withMessage("incorrect password")
]

async function indexRouteGet(req, res) {
    const messages = await db.getMessages();

    if (req.isAuthenticated()) {
        res.render("index", { title: "Message Board", messages: messages, user: req.user });
        return;
    }

    res.render("index", { title: "Message Board", messages: messages })

}

function signUpFormGet(req, res) {
    res.render("sign-up-form", { user: {} });
}

const signUpPost = [
    validateUser,
    asyncHandler(async (req, res) => {
        const errorsResult = validationResult(req);
        if (!errorsResult.isEmpty()) {
            res.render("sign-up-form", { errors: errorsResult.errors, user: { ...req.body }});
            return;
        }
    
        bcrypt.hash(req.body.password, 10, async function (err, hashedPassword) {
            if (err) {
                throw err;
            }
    
            await db.insertUser({
                username: req.body.username,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                password: hashedPassword
            })
            
            res.redirect("/");
        })
    
    })
]

const joinClubPageGet = [
    checkLoggedIn,
    (req, res) => {
        res.render("join-club-form");
    }
]

const joinClubPost = [
    checkLoggedIn,
    validateClubRegistration,
    asyncHandler(async (req, res) => {
        const errorsResult = validationResult(req);
        if (!errorsResult.isEmpty()) {
            res.render("join-club-form", { errors: errorsResult.errors });
            return;
        }
    
        await db.setMember(req.user.id);
    
        res.redirect("/");
    })
]

function loginPageGet(req, res) {
    res.render("log-in-form");
}

const loginPost = [
    passport.authenticate("local", {
        failureRedirect: "/log-in",
        failureMessage: "Incorrect username or password",
        successRedirect: "/",
        successMessage: "Welcome back!"
    }),
    (req, res) => {
        res.redirect("/");
    }
]

const createMessagePageGet = [
    checkLoggedIn,
    (req, res) => {
        res.render("create-message-form", { message: {} });
    }
]

const createMessagePost = [
    checkLoggedIn,
    validateMessage,
    asyncHandler(async (req, res) => {
        const errorsResult = validationResult(req);
        if (!errorsResult.isEmpty()) {
            res.render("create-message-form", { errors: errorsResult.errors, message: { ...req.body }});
            return;
        }
    
        await db.insertMessage({
            title: req.body.title,
            text: req.body.text,
            timestamp: new Date(Date.now()).toISOString(),
            creator_id: req.user.id
        })
    
        res.redirect("/");
    })
]

const joinAdminsPageGet = [
    checkLoggedIn,
    (req, res) => {
        res.render("join-admins-form");
    }
]

const joinAdminsPost = [
    checkLoggedIn,
    validateAdminRegistration,
    asyncHandler(async (req, res) => {
        const errorsResult = validationResult(req);
        if (!errorsResult.isEmpty()) {
            res.render("join-admins-form", { errors: errorsResult.errors });
            return;
        }
    
        await db.setAdmin(req.user.id);
    
        res.redirect("/");
    })
]

export { indexRouteGet, signUpFormGet, signUpPost, joinClubPageGet, joinClubPost, loginPageGet, loginPost, createMessagePageGet, createMessagePost, joinAdminsPageGet, joinAdminsPost };