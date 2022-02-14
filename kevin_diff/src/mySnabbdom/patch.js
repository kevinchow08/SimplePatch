import VNode from './vNode.js'
import createElement from './createElement.js'
import patchVnode from './patchVnode.js'

export default function (oldVnode, newVnode) {
    // 判断第一个参数，是DOM还是VNode。
    if (!oldVnode.hasOwnProperty('sel')) {
        oldVnode = VNode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode)
    }
    // 判断是否是同一个节点
    if (oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
        console.log('是同一个节点')
        patchVnode(oldVnode, newVnode)
    } else {
        console.log('不是同一个节点，先插入新节点，再删除旧节点。')
        // 将新的虚拟节点转成真正的节点
        let newVnodeElem = createElement(newVnode)
        if (oldVnode.elm.parentNode && newVnodeElem) {
            oldVnode.elm.parentNode.insertBefore(newVnodeElem, oldVnode.elm)
        }
        oldVnode.elm.parentNode.removeChild(oldVnode.elm)
    }
}
