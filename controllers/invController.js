const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  let className
  if (data.length > 0) {
    className = data[0].classification_name
  } else {
    const classificationData = await invModel.getClassificationNameById(classification_id)
    if (classificationData) {
      className = classificationData.classification_name
    } else {
      // Handle case where classification_id is not found
      className = "Unknown"
    }
  }
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

module.exports = invCont