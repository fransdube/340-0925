// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidate = require("../utilities/inventory-validation")

// Route to build management view
router.get("/", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildManagementView));

// Route to build add classification view
router.get("/add-classification", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification));

// Route to build add inventory view
router.get("/add-inventory", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory));

// Route to get inventory for AJAX Route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build the edit inventory view
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to trigger an intentional error
router.get("/error", utilities.handleErrors(invController.triggerError));

// Process the add classification data
router.post(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType,
    classificationValidate.classificationRules(),
    classificationValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Process the add inventory data
router.post(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkAccountType,
    classificationValidate.inventoryRules(),
    classificationValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

// Process the update inventory data
router.post(
    "/update",
    utilities.checkLogin,
    utilities.checkAccountType,
    classificationValidate.inventoryRules(),
    classificationValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

module.exports = router;