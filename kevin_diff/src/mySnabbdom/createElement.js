export default function createElement (vNode) {
    // 创建真实DOM
    let domNode = document.createElement(vNode.sel)
    if (vNode.text !== '' && (!vNode.children || vNode.children.length === 0) ) {
        // 该vNode节点，只有text
        domNode.innerText = vNode.text
    } else if (Array.isArray(vNode.children) && vNode.children.length > 0) {
        for (let i = 0; i < vNode.children.length; i++) {
            const childDom = createElement(vNode.children[i])
            domNode.appendChild(childDom)
        }
    }
    // 给vNode节点elem属性赋值，使其有对应的真实DOM
    vNode.elm = domNode
    return vNode.elm
}
