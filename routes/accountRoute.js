// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to register a new account
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Deliver account view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountView)
  )

// Route to build the account update view
router.get(
    "/update/:account_id",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateView)
)

// Process the account update
router.post(
    "/update",
    utilities.checkLogin,
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)

// Process the password change
router.post(
    "/change-password",
    utilities.checkLogin,
    regValidate.changePasswordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.changePassword)
)

// Route to log out
router.get("/logout", utilities.handleErrors(accountController.logout));

module.exports = router;
