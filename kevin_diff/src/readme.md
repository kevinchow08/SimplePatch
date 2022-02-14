## 虚拟dom的概念与vue patch的流程

### Vue 通过建立一个虚拟DOM来追踪自己要如何改变真实的DOM

render函数返回h().

h函数返回Vnode节点。

而Vnode节点就是一个个JS对象，它描述了这个节点的标签名(tag),唯一key值，文本值(text)，子节点(children)，及对应的真实dom(elm).

### 为什么要有虚拟DOM？

我们可以用JS模拟出一个虚拟DOM节点。当数据发生变化时，我们对比变化前后的虚拟DOM节点，通过DOM-Diff算法计算出需要更新的地方，然后去更新需要更新的视图，从而尽可能少的操作DOM，减少性能消耗。

### 其实VNode的作用是相当大的:

我们在视图渲染之前，把写好的template模板先编译成VNode并缓存下来，等到数据发生变化页面需要重新渲染的时候，我们把数据发生变化后生成的VNode与前一次缓存下来的VNode进行对比，找出差异，然后更新有差异的DOM节点，最终达到以最少操作真实DOM更新视图的目的

### Patch：
**对比新旧两份VNode并找出差异的过程就是所谓的DOM-Diff过程，DOM-Diff算法是整个虚拟DOM的核心所在**。
在Vue中，把DOM-Diff过程叫做patch过程。patch,意为“补丁”，即指对旧的VNode修补。

一句话总结patch：**以新的VNode为基准，改造旧的oldVNode使之成为跟新的VNode一样，这就是patch过程要干的事**
Patch的过程：**深度优先遍历，同层节点比对**

整个patch无非就是干三件事：**创建节点，删除节点，更新节点**。

而创建节点：实际上只有3种类型的节点能够被创建并插入到DOM中，它们分别是：元素节点、文本节点、注释节点

### 重点复杂点在更新节点：更新节点patchVnode()流程：
以新的VNode为基准：
1. 如果VNode和oldVNode均为静态节点:
静态节点无论数据发生任何变化都与它无关，所以都为静态节点的话则直接跳过，无需处理，return.
2. 如果VNode是文本节点，那么只需看oldVNode是否也是文本节点，如果是，那就比较两个文本是否不同，如果不同则把oldVNode里的文本改成跟VNode的文本一样。如果oldVNode不是文本节点，那么不论它是什么，直接调用setTextNode方法把它改成文本节点，并且文本内容跟VNode相同。
3. 如果VNode是元素节点：即新节点中有子节点 
   1. 看oldVnode是否也有子节点，如果有，则进行精细化比对，调用updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
   2. 看oldVnode是否是只文本节点，如果是的话，就将其文本清空，遍历Vnode中的子节点，并依次插入oldVnode.elm中

### 更新节点中重点关注：新旧Vnode都包含子节点的情况=》优化策略：
采用双端节点的方式：

首先满足条件：while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx)进行循环。开始进行如下规则的匹配，更新。
1. 新前与旧前节点key值匹配，匹配到直接调用pathVnode(oldStartVnode, newStartVnode)进行节点更新操作，同时并移动指针，continue跳出本次循环。匹配不到进行下一步2
2. 新后与旧后节点key值匹配，匹配到直接调用pathVnode(oldEndVnode, newEndVnode)进行节点更新操作，同时并移动指针，continue跳出本次循环。匹配不到进行下一步3
3. 新后与旧前节点key值匹配，匹配到后：更新旧前节点，并将旧前对应的节点移动到旧后之后，同时并移动指针，continue跳出本次循环。匹配不到进行下一步4
4. 新前与旧后节点key值匹配。匹配到后：更新旧后节点，并将旧后对应的节点移动到旧前之前，同时并移动指针，continue跳出本次循环。
其次，以上命中一种情况，对应指针进行变动，并continue跳出本次循环，进行下一次循环。（注意：3,4情况，会涉及到节点移动）

以上情况都匹配不到，拿到新前所指定的节点，在旧节点中寻找：
1. 找到则：先更新该旧节点，然后移动它，到旧前之前。并将找到的那个旧节点置为undefined。以防止之后循环指针指向undefined时，可以跳过。
2. 找不到则：创建该新节点为真实DOM，并添加到旧前之前。

最后，当该循环条件oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx 不再满足时，即循环结束时。
看看新节点，旧节点。谁有剩余。若新节点有剩余，则是需要新增。若旧节点有剩余，则是需要删除。

具体细节可查看手写的简易patch实现





