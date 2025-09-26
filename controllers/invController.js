const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const formData = req.session.formData || {}
  delete req.session.formData

  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: formData.classification_name,
  })
}

/* ****************************************
*  Process new classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const addResult = await invModel.addClassification(classification_name)

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you have added ${classification_name} to the classifications.`
    )
    res.redirect("/inv")
  } else {
    req.flash("notice", "Sorry, the addition failed.")
    req.session.formData = { classification_name }
    res.redirect("/inv/add-classification")
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const formData = req.session.formData || {}
  delete req.session.formData
  let classificationList = await utilities.buildClassificationList(formData.classification_id)

  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null,
    ...formData,
  })
}

/* ****************************************
*  Process new inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const addResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, you have added ${inv_make} ${inv_model} to the inventory.`
    )
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the addition failed.")
    req.session.formData = req.body
    res.redirect("/inv/add-inventory")
  }
}

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