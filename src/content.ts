import { createApp, defineCustomElement } from 'vue'
import ShareImage from './ShareImage.ce.vue'
import App from './App.vue'

const ShareImageElement = defineCustomElement(ShareImage)

window.customElements.define('text-camera', ShareImageElement)

const container = document.createElement('div')
container.setAttribute('id', 'text-camera-container')

document.body.insertAdjacentElement('afterend', container)

createApp(App).mount(container)