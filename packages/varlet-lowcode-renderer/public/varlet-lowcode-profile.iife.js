var VarletLowcodeProfile = (function (t) {
  'use strict'
  var e = { name: 'Button', description: 'A varlet button component' },
    n = { name: 'Card', description: 'A varlet card component', slots: ['default', 'title', 'description'] },
    o = { name: 'Countdown', description: 'A varlet countdown component' },
    a = { name: 'Dialog.Component', description: 'A varlet dialog component' },
    r = { name: 'Input', description: 'A varlet input component' },
    i = { name: 'Space', description: 'A varlet space component' }
  const c = 'Varlet',
    l = [e, n, o, a, r, i]
  return (
    (t.library = c),
    (t.materials = l),
    Object.defineProperties(t, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: 'Module' } }),
    t
  )
})({})
