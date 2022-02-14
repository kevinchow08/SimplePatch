import {
 init,
 classModule,
 propsModule,
 styleModule,
 eventListenersModule,
 h,
} from 'snabbdom';

const patch = init([
 // Init patch function with chosen modules
 classModule, // makes it easy to toggle classes
 propsModule, // for setting properties on DOM elements
 styleModule, // handles styling on elements with support for animations
 eventListenersModule, // attaches event listeners
]);

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

const divContainer = document.getElementById('container')
const buttonBtn = document.getElementById('btn')

const vnode1 = h('ul', {}, [
 h('li', { key: 'A' }, 'A'),
 h('li', { key: 'B' }, 'B'),
 h('li', { key: 'C' }, 'C'),
 h('li', { key: 'D' }, 'D')
]);


// snabbdom的patch使用。
patch(divContainer, vnode1)

const vnode2 = h('ul', {}, [
 h('li', { key: 'D' }, 'D'),
 h('li', { key: 'A' }, 'A'),
 h('li', { key: 'C' }, 'C'),
 h('li', { key: 'B' }, 'B')
]);

buttonBtn.onclick = function () {
 patch(vnode1, vnode2)
}




