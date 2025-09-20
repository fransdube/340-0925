const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    if (data.length > 0) {
      const grid = await utilities.buildClassificationGrid(data)
      let nav = await utilities.getNav()
      const className = data[0].classification_name
      res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
      })
    } else {
      const err = new Error("No vehicles found")
      err.status = 404
      throw err
    }
  } catch (error) {
    next(error)
  }
}



/* ***************************
 *  Build inventory by inventory id view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventoryByInventoryId(inventory_id)
    if (data.length > 0) {
      const grid = await utilities.buildDetailGrid(data)
      let nav = await utilities.getNav()
      const className = data[0].inv_make + " " + data[0].inv_model
      res.render("./inventory/detail", {
        title: className,
        nav,
        grid,
      })
    } else {
      const err = new Error("No vehicle found")
      err.status = 404
      throw err
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Trigger an intentional error
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  try {
    throw new Error("Intentional error")
  } catch (error) {
    next(error)
  }
}

module.exports = invCont