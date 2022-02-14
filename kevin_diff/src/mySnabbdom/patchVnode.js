import createElement from './createElement.js'
import updateChildren from "./updateChildren.js";

// 节点更新方法
export default function pathVnode (oldVnode, newVnode) {
    // 若新老节点是指向同一个对象
    if (oldVnode === newVnode) return
    if (newVnode.text !== undefined && (!newVnode.children || newVnode.children.length === 0)) {
        // 如果新节点中有text，没有children节点。
        if (oldVnode.text !== newVnode.text) {
            // 清空老节点
            // oldVnode.elm.innerHTML = ''
            oldVnode.elm.innerText = newVnode.text
        }
    } else {
        // 新节点中有children节点
        if (oldVnode.children !== undefined && oldVnode.children.length > 0) {
            // 老节点中也有children。
            console.log('新老节点都有children,需要精细化比较。')
            // 第一个参数是方便上树使用。
            updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
        } else {
            // 老节点中是文字text，新节点中有children节点。
            // 清空老节点中内容。
            oldVnode.elm.innerHTML = ''
            // 遍历新节点的children，创建children的真实DOM，并上树（添加到老节点的真实DOM之上）
            for (let i = 0; i < newVnode.children.length; i++) {
                const chDom = createElement(newVnode.children[i])
                oldVnode.elm.appendChild(chDom)
            }
        }
    }
}
