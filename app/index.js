const $ = require('jquery')
const component = require('./component')

document.body.appendChild(component())
$('#app').append(component())