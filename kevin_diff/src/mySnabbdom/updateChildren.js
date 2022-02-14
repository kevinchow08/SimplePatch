import pathVnode from "./patchVnode";
import createElement from "./createElement";
// 思路： 首先满足条件：oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx，进行循环。开始进行如下规则的匹配，更新
// （1），新前与旧前节点key值匹配，匹配到直接调用pathVnode(oldStartVnode, newStartVnode)进行节点更新操作，同时并移动指针，continue跳出本次循环。匹配不到进行下一步（2）
// （2），新后与旧后节点key值匹配，匹配到直接调用pathVnode(oldEndVnode, newEndVnode)进行节点更新操作，同时并移动指针，continue跳出本次循环。匹配不到进行下一步（3）
// （3），新后与旧前节点key值匹配，匹配到后：更新旧前节点，并将旧前对应的节点移动到旧后之后，同时并移动指针，continue跳出本次循环。匹配不到进行下一步（4）
// （4），新前与旧后节点key值匹配。匹配到后：更新旧后节点，并将旧后对应的节点移动到旧前之前，同时并移动指针，continue跳出本次循环。
// 其次，以上命中一种情况，对应指针进行变动，并continue跳出本次循环，进行下一次循环。（注意：3,4情况，会涉及到节点移动）
//      以上情况都匹配不到，拿到新前所指定的节点，在旧节点中寻找：
//      找到则：先更新该旧节点，然后移动它，到旧前之前。
//      找不到则：创建该新节点为真实DOM，并添加到旧前之前。
// 最后，当该循环条件oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx 不再满足时，即循环结束时。
// 看看新节点，旧节点。谁有剩余。若新节点有剩余，则是需要新增。若旧节点有剩余，则是需要删除。

const checkSameVnode = (a, b) => {
    return a.key === b.key && a.sel === b.sel
}

// oldCh代表：旧节点集合
// newCh代表：新节点集合
export default function updateChildren (parentElm, oldCh, newCh) {
    console.log('开始进行子节点比对')
    // 定义指针。
    let oldStartIndex = 0
    let newStartIndex = 0

    let oldEndtIndex = oldCh.length - 1
    let newEndIndex = newCh.length - 1

    // 定义指针所对应的节点。
    let oldStartVnode = oldCh[oldStartIndex]
    let newStartVnode = newCh[newStartIndex]

    let oldEndVnode = oldCh[oldEndtIndex]
    let newEndVnode = newCh[newEndIndex]

    // 初始化一个keyMap：用来存放未处理的旧节点的key和index的映射关系
    let keyMap = null

    while (oldStartIndex <= oldEndtIndex && newStartIndex <= newEndIndex) {
        if (!oldStartVnode) {
            oldStartVnode = oldCh[++oldStartIndex]
        } else if (!newStartVnode) {
            newStartVnode = newCh[++newStartIndex]
        } else if (!oldEndVnode) {
            oldEndVnode = oldCh[++oldEndtIndex]
        } else if (!newEndVnode) {
            newEndVnode = newCh[++newEndIndex]
        } else if (checkSameVnode(newStartVnode, oldStartVnode)) {
            // 情况1节点比对匹配上：
            // 节点更新操作。
            pathVnode(oldStartVnode, newStartVnode)
            newStartVnode = newCh[++newStartIndex]
            oldStartVnode = oldCh[++oldStartIndex]
            continue
        } else if (checkSameVnode(newEndVnode, oldEndVnode)) {
            // 情况2节点匹配上：
            // 节点更新操作。
            pathVnode(oldEndVnode, newEndVnode)
            newEndVnode = newCh[--newEndIndex]
            oldEndVnode = oldCh[--oldEndtIndex]
            continue
        } else if (checkSameVnode(newEndVnode, oldStartVnode)) {
            // 节点更新操作。
            pathVnode(oldStartVnode, newEndVnode)
            const moveVnode = oldStartVnode
            oldCh[oldStartIndex] = undefined
            parentElm.insertBefore(moveVnode.elm, oldEndVnode.elm.nextSibling)
            newEndVnode = newCh[--newEndIndex]
            oldStartVnode = oldCh[++oldStartIndex]
            continue
        } else if (checkSameVnode(newStartVnode, oldEndVnode)) {
            // 情况3节点匹配上：
            pathVnode(oldEndVnode, newStartVnode)
            const moveVnode = oldEndVnode
            oldCh[oldEndtIndex] = undefined
            parentElm.insertBefore(moveVnode.elm, oldStartVnode.elm)
            newStartVnode = newCh[++newStartIndex]
            oldEndVnode = oldCh[--oldEndtIndex]
            continue
        } else {
            // 将未处理的旧节点的key和index的映射关系存起来
            if (!keyMap) {
                keyMap = {}
                for (let i = oldStartIndex; i <= oldEndtIndex; i++) {
                    const key = oldCh[i].key
                    if (key) {
                        keyMap[key] = i
                    }
                }
            }
            console.log(keyMap)
            // 判断新前节点的key是否在keyMap中找到匹配的旧节点key
            const indexInOld = keyMap[newStartVnode.key]
            if (indexInOld && newStartVnode.sel === oldCh[indexInOld].sel) {
                // 新前节点key值在旧节点中有对应同key值节点，且标签相同。（同一节点）
                // 节点更新
                pathVnode(oldCh[indexInOld], newStartVnode)
                const moveVnode = oldCh[indexInOld]
                // 打标记
                oldCh[indexInOld] = undefined
                // 节点移动
                parentElm.insertBefore(moveVnode.elm, oldStartVnode.elm)
            } else {
                // 如果没有未处理的旧节点中没有匹配得到。就创建一个新elm，并移动添加。
                const newElem = createElement(newStartVnode)
                // 添加
                parentElm.insertBefore(newElem, oldStartVnode.elm)
            }

            newStartVnode = newCh[++newStartIndex]
        }
    }

    // 循环结束后，查看剩余。
    if (newStartIndex <= newEndIndex) {
        // 新节点有剩余，则：旧节点添加这些剩余新节点,把所有剩余的新节点，都要插入到oldStartIdx之前
        // 此时，oldStartIdx大概率指向null，等价于：oldCh.appendChild(newCh[i])
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            parentElm.insertBefore(createElement(newCh[i]), oldCh[oldStartIndex].elm)
        }
    } else if (oldStartIndex <= oldEndtIndex) {
        for (let i = oldStartIndex; i <= oldEndtIndex; i++) {
            if (oldCh[i]) {
                parentElm.removeChild(oldCh[i].elm)
            }
        }
    }
}
