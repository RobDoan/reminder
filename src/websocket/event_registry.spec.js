import { register, processorForEvent } from './event_registry'

describe('Event Registry', () => {
  it('#register and #processorForEvent', () => {
    const functionProcessor = jest.fn()
    const regexProcessor = jest.fn()
    const stringMatcherProcessor = jest.fn()
    const afunctionMatcher = (command) => command === 'aFunction'
    const regexMatcher = /remove/i
    const stringMatcher = 'notify'
    register(afunctionMatcher, functionProcessor)
    register(regexMatcher, regexProcessor)
    register(stringMatcher, stringMatcherProcessor)

    expect(processorForEvent({ command: 'aFunction' }).processor).toBe(
      functionProcessor
    )
    expect(processorForEvent({ command: 'Remove' }).processor).toBe(
      regexProcessor
    )
    expect(processorForEvent({ command: 'notify' }).processor).toBe(
      stringMatcherProcessor
    )
  })
})
