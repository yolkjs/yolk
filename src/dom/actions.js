/* @flow */

import {VirtualElement} from './VirtualElement'
import {VirtualText} from './VirtualText'
import {createElement} from './createElement'
import {isDefined} from '../util/isDefined'

export const create = (node: HTMLElement, next: VirtualElement | VirtualText, index: number): Function => (children: Array<VirtualElement | VirtualText>): void => {
  const child: Node = createElement(next)
  const before: Node = node.children[index]

  if (isDefined(before)) {
    node.insertBefore(child, before)
    children.splice(index, 0, next)
  } else {
    node.appendChild(child)
    children.push(next)
  }

  next.insert(child) // queue up
}

export const update = (node: HTMLElement, previous: VirtualElement | VirtualText, next: VirtualElement | VirtualText, index: number): Function => (children: Array<VirtualElement | VirtualText>): void => {
  const child: Node = node.children[index]
  previous.patch(next, child)
  children.splice(index, 0, previous)
}

export const move = (node: HTMLElement, previous: VirtualElement | VirtualText, next: VirtualElement | VirtualText, oldIndex: number, newIndex: number): Function => {
  const child: Node = node.children[oldIndex]

  return (children: Array<VirtualElement | VirtualText>): void => {
    const before: Node = node.children[newIndex]

    if (isDefined(before)) {
      node.insertBefore(child, before)
      children.splice(newIndex, 0, previous)
    } else {
      node.appendChild(child)
      children.push(previous)
    }

    previous.patch(next, child)
  }
}

export const remove = (node: HTMLElement, previous: VirtualElement | VirtualText, index: number): Function => {
  const child: Node = node.children[index]

  return (): void => {
    previous.predestroy(child)
    node.removeChild(child)
    previous.destroy()
  }
}
