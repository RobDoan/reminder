import { find } from 'lodash'
const EventRegisties = []

function matcherGenerator(matcher) {
  if (typeof matcher === 'function') return matcher
  if (matcher instanceof RegExp) {
    return function (command) {
      return matcher.test(command)
    }
  }
  return function (command) {
    return matcher === command
  }
}

export function register(event, processor) {
  const matcher = matcherGenerator(event)
  EventRegisties.push({ matcher, processor })
}

export function processorForEvent(eventMessage) {
  const { command } = eventMessage
  return find(EventRegisties, ({ matcher }) => matcher.call(this, command))
}
