const invModel = require("../models/inventory-model")
const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
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
    const reviews = await reviewModel.getReviewsByInventoryId(inventory_id)
    if (data.length > 0) {
      const vehicle = data[0]
      let nav = await utilities.getNav()
      const className = vehicle.inv_make + " " + vehicle.inv_model
      res.render("./inventory/detail", {
        title: className,
        nav,
        vehicle,
        reviews,
        errors: null,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData.length > 0) {
    return res.json(invData)
  } else {
    return res.json([])
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemDataResult = await invModel.getInventoryByInventoryId(inv_id)
  const itemData = itemDataResult[0]
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })
  }
}

module.exports = invCont