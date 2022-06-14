var VarletLowcodeProfile = (function (e) {
  'use strict'
  var n = {
      name: 'Button',
      description: 'A varlet button component',
      slots: [{ name: 'default' }],
      codegen: { name: 'var-button' },
    },
    a = {
      name: 'Card',
      description: 'A varlet card component',
      slots: [
        { name: 'image' },
        { name: 'title' },
        { name: 'subtitle' },
        { name: 'description' },
        { name: 'content' },
        { name: 'extra' },
        { name: 'close-button' },
      ],
      codegen: { name: 'var-card' },
    },
    t = {
      name: 'Countdown',
      description: 'A varlet countdown component',
      slots: [{ name: 'default', hasSlotProps: !0 }],
      codegen: { name: 'var-countdown' },
    },
    o = {
      name: 'Dialog.Component',
      description: 'A varlet dialog component',
      slots: [{ name: 'default' }, { name: 'title' }],
      codegen: { name: 'var-dialog' },
    },
    r = {
      name: 'Input',
      description: 'A varlet input component',
      slots: [{ name: 'prepend-icon' }, { name: 'append-icon' }],
      codegen: { name: 'var-input' },
    },
    c = {
      name: 'Space',
      description: 'A varlet space component',
      slots: [{ name: 'default' }],
      codegen: { name: 'var-space' },
    }
  const i = 'Varlet',
    l = [n, a, t, o, r, c]
  return (
    (e.library = i),
    (e.materials = l),
    Object.defineProperties(e, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: 'Module' } }),
    e
  )
})({})
