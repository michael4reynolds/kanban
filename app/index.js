const component = require('./component')
require('./sass-styles.scss')
require('./main.css')

document.body.appendChild(component())
document.getElementById('app').appendChild(component())