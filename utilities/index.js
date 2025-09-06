const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  list += '<li><a href="/inv/type/1" title="See our inventory of Classic vehicles">Classic</a></li>'
  list += '<li><a href="/inv/type/2" title="See our inventory of Sports vehicles">Sports</a></li>'
  list += '<li><a href="/inv/type/3" title="See our inventory of SUV vehicles">SUV</a></li>'
  list += '<li><a href="/inv/type/4" title="See our inventory of Truck vehicles">Truck</a></li>'
  list += '<li><a href="/inv/type/5" title="See our inventory of Used vehicles">Used</a></li>'
  list += "</ul>"
  return list
}

module.exports = Util
