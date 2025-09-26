const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        // classification_name is required and must be string
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a classification name.")
            .isAlphanumeric()
            .withMessage("Classification name cannot contain spaces or special characters."),
    ]
}

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("notice", "Classification validation failed.")
        req.flash("errors", errors.array())
        req.session.formData = { classification_name }
        res.redirect("/inv/add-classification")
        return
    }
    next()
}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide a make."),
        body("inv_model")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide a model."),
        body("inv_year")
            .trim()
            .isNumeric()
            .isLength({ min: 4, max: 4 })
            .withMessage("Please provide a valid year."),
        body("inv_description")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a description."),
        body("inv_image")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide an image path."),
        body("inv_thumbnail")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a thumbnail path."),
        body("inv_price")
            .trim()
            .isNumeric()
            .withMessage("Please provide a valid price."),
        body("inv_miles")
            .trim()
            .isNumeric()
            .withMessage("Please provide valid miles."),
        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a color."),
        body("classification_id")
            .trim()
            .isNumeric()
            .withMessage("Please select a classification."),
    ]
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("notice", "Inventory validation failed.")
        req.flash("errors", errors.array())
        req.session.formData = req.body
        res.redirect("/inv/add-inventory")
        return
    }
    next()
}

module.exports = validate