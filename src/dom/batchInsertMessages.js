/* @flow */

const scope = {
  batchInProgress: false,
  queue: [],
}

function flushQueue (): void {
  while (scope.queue.length > 0) {
    const [vnode, node] = scope.queue.pop()
    vnode.insert(node)
  }
}

export function queueInsertMessage (vnode: VirtualNode, node: HTMLElement): void {
  scope.queue.push([vnode, node])
}

export function batchInsertMessages (callback: Function): void {
  if (scope.batchInProgress === false) {
    scope.batchInProgress = true
    callback()
    flushQueue()
    scope.batchInProgress = false
  } else {
    callback()
  }
}