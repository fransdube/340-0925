const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid = ''
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + Util.fixBrokenPaths(vehicle.inv_thumbnail)
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View '
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailGrid = async function(data){
  let grid = ''
  if(data.length > 0){
    const vehicle = data[0]
    grid = '<div id="detail-display" class="detail-grid">'
    grid += '<div class="detail-img">'
    grid += '<img src="' + Util.fixBrokenPaths(vehicle.inv_image)
    +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
    +' on CSE Motors" />'
    grid += '</div>'
    grid += '<div id="detail-data" class="detail-data">'
    grid += '<h2>' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>'
    grid += '<ul>'
    grid += '<li><strong>Price:</strong> $'
    + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</li>'
    grid += '<li><strong>Description:</strong> ' + vehicle.inv_description + '</li>'
    grid += '<li><strong>Color:</strong> ' + vehicle.inv_color + '</li>'
    grid += '<li><strong>Miles:</strong> '
    + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</li>'
    grid += '</ul>'
    grid += '</div>'
    grid += '</div>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

/* ************************************
* Fix broken paths
* ************************************ */
Util.fixBrokenPaths = function(path) {
  return path.replace(/vehicles\/vehicles/g, "vehicles");
}

module.exports = Util