;(function (e, n) {
  typeof exports == 'object' && typeof module != 'undefined'
    ? n(exports)
    : typeof define == 'function' && define.amd
    ? define(['exports'], n)
    : ((e = typeof globalThis != 'undefined' ? globalThis : e || self), n((e.VarletLowcodeProfile = {})))
})(this, function (e) {
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
    i = {
      name: 'Input',
      description: 'A varlet input component',
      slots: [{ name: 'prepend-icon' }, { name: 'append-icon' }],
      codegen: { name: 'var-input' },
    },
    r = {
      name: 'Space',
      description: 'A varlet space component',
      slots: [{ name: 'default' }],
      codegen: { name: 'var-space' },
    }
  const c = 'Varlet',
    d = '@varlet/ui',
    s = 'latest',
    l = [n, a, t, o, i, r]
  ;(e.library = c),
    (e.materials = l),
    (e.packageName = d),
    (e.packageVersion = s),
    Object.defineProperties(e, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: 'Module' } })
})
