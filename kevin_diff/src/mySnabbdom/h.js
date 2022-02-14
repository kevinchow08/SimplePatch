import VNode from './vNode.js'

// 调用h函数会生成虚拟节点，虚拟节点构成virtual dom

// 这是一个低配版本的h函数，这个函数必须接受3个参数，缺一不可
// 相当于它的重载功能较弱。
// 也就是说，调用的时候形态必须是下面的三种之一：
// 形态① h('div', {}, '文字')
// 形态② h('div', {}, [])
// 形态③ h('div', {}, h())

export default function (sel, data, c) {
    // 检查参数个数
    if (arguments.length !== 3) {
        throw new Error('sorry, 目前是一个简化版的h函数，请务必传入3个参数')
    }
    // 下面针对第三个参数c进行判断。
    if (typeof c === 'string' || typeof c === 'number') {
        // 说明现在调用h函数是形态①
        return VNode(sel, data, undefined, c, undefined)
    } else if (Array.isArray(c)) {
        // 说明现在调用h函数是形态②
        const children = []
        for (let i = 0; i < c.length; i++) {
            // 确保第三个参数数组中每个都是VNode对象。
            if (!(typeof c[i] === 'object' && c[i].hasOwnProperty('sel'))) {
                throw new Error('sorry, 传入的children中有一项不是VNode对象')
            }
            children.push(c[i])
        }
        return VNode(sel, data, children, undefined, undefined)
    } else if (typeof c === 'object' && c.hasOwnProperty('sel')) {
        // 说明现在调用h函数是形态③
        // 即，传入的c是唯一的children
        const children = [c]
        return VNode(sel, data, children, undefined, undefined)
    } else {
        throw new Error('传入的第三个参数类型不对')
    }
}
