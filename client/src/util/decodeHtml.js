const decodeHtml = (input) => {
  var e = document.createElement("div")
  e.innerHTML = input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue
}

export default decodeHtml