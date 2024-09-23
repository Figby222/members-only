import { body, query, validationResult } from "express-validator";
import db from "../db/queries.mjs";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

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

function indexRouteGet(req, res) {
    res.render("index", { title: "Node Template" });
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

function joinClubPageGet(req, res) {
    res.render("join-club-form");
}

export { indexRouteGet, signUpFormGet, signUpPost, joinClubPageGet };