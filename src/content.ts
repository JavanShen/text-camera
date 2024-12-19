import { createApp, defineCustomElement } from 'vue'
import ShareImage from './ShareImage.ce.vue'
import App from './App.vue'

const ShareImageElement = defineCustomElement(ShareImage)

window.customElements.define('share-image', ShareImageElement)

const container = document.createElement('div')
container.setAttribute('id', 'share-image-container')

document.body.insertAdjacentElement('beforeend', container)

createApp(App).mount(container)