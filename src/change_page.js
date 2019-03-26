var elem = document.createElement("div")
elem.textContent = "Тексттексттексттекст"
elem.className = "injected-element-fixed-widget"

console.log('Added element')

document.body.appendChild(elem)
