import h from './mySnabbdom/h.js'
import patch from "./mySnabbdom/patch.js";

function component() {
    const element = document.createElement('div')
    element.setAttribute('id', 'container')
    element.innerHTML = 'Hello World'

    return element;
}

function generateButton() {
    const btn = document.createElement('button')
    btn.setAttribute('id', 'btn')
    btn.innerText = '按我改变DOM'
    return btn
}

const container = component()
const btn = generateButton()
document.body.appendChild(container);
document.body.insertBefore(btn, container)

// 目前还是Virtual DOM，不是真正的DOM
const myVnode1 = h('ul', {}, [
    h('li', { key: 'A' }, 'A'),
    h('li', { key: 'B' }, 'B'),
    h('li', { key: 'C' }, 'C'),
    h('li', { key: 'D' }, 'D')
])

const divContainer = document.getElementById('container')
const buttonBtn = document.getElementById('btn')

patch(divContainer, myVnode1)

const myVnode2 = h('ul', {}, [
    h('li', { key: 'D' }, 'D'),
    h('li', { key: 'C' }, 'C'),
    h('li', { key: 'B' }, 'B'),
    h('li', { key: 'A' }, 'A')
])

buttonBtn.onclick = function () {
    patch(myVnode1, myVnode2)
}
