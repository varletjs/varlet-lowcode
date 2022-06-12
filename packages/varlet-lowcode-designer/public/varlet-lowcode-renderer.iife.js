var m = Object.defineProperty
var l = Object.getOwnPropertySymbols
var y = Object.prototype.hasOwnProperty,
  v = Object.prototype.propertyIsEnumerable
var c = (t, e, n) => (e in t ? m(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (t[e] = n)),
  a = (t, e) => {
    for (var n in e || (e = {})) y.call(e, n) && c(t, n, e[n])
    if (l) for (var n of l(e)) v.call(e, n) && c(t, n, e[n])
    return t
  }
var VarletLowcodeRenderer = (function (exports, vue, lowCode) {
  'use strict'
  function _interopDefaultLegacy(t) {
    return t && typeof t == 'object' && 'default' in t ? t : { default: t }
  }
  var lowCode__default = _interopDefaultLegacy(lowCode)
  const isPlainObject = (t) => Object.prototype.toString.call(t) === '[object Object]',
    isArray = (t) => Array.isArray(t)
  Object.assign(window, {
    ref: vue.ref,
    reactive: vue.reactive,
    computed: vue.computed,
    watch: vue.watch,
    onBeforeMount: vue.onBeforeMount,
    onMounted: vue.onMounted,
    onBeforeUpdate: vue.onBeforeUpdate,
    onUpdated: vue.onUpdated,
    onBeforeUnmount: vue.onBeforeUnmount,
    onUnmounted: vue.onUnmounted,
  })
  var RendererComponent = vue.defineComponent({
      name: 'VarletLowCodeRenderer',
      props: {
        mode: { type: String, default: 'render' },
        schema: { type: Object, required: !0, default: () => ({}) },
        assets: { type: Array, required: !0, default: () => [] },
      },
      setup(props) {
        var t
        const setup = eval(`(${(t = props.schema.code) != null ? t : 'function setup() { return {} }'})`),
          ctx = setup()
        function cloneSchemaNode(e) {
          return JSON.parse(JSON.stringify(e))
        }
        function hoistWindow() {
          Object.assign(window, ctx)
        }
        function hasScopedVariables(e) {
          return ['$item', '$index', '$slotProps'].some((n) => e.includes(n))
        }
        function resolveScopedExpression(expression, schemaNode) {
          ;(window.$item = schemaNode._item),
            (window.$index = schemaNode._index),
            (window.$slotProps = schemaNode._slotProps)
          const resolved = eval(expression)
          return delete window.$item, delete window.$index, delete window.$slotProps, resolved
        }
        function getExpressionBindingValue(expression, schemaNode) {
          return hasScopedVariables(expression) ? resolveScopedExpression(expression, schemaNode) : eval(expression)
        }
        function getBindingValue(e, n) {
          if (isPlainObject(e)) {
            const { value: o, type: r } = e
            if (r === lowCode.BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING) return getExpressionBindingValue(o, n)
            if (r === lowCode.BuiltInSchemaNodeBindingTypes.OBJECT_BINDING) return o
          }
          return e
        }
        function getComponent(e) {
          return lowCode__default.default.assetsManager.findComponent(props.assets, e)
        }
        function getPropsBinding(e) {
          var o
          return Object.entries((o = e.props) != null ? o : {}).reduce(
            (r, [u, d]) => ((r[u] = getBindingValue(d, e)), r),
            {}
          )
        }
        function withDesigner(e) {
          return props.mode === 'designer', vue.h(getComponent(e.name), getPropsBinding(e), renderSchemaNodeSlots(e))
        }
        function withCondition(e) {
          return e.filter((n) => {
            var o
            return Boolean(getBindingValue((o = n.if) != null ? o : !0, n))
          })
        }
        function withScopedVariables(e, n, o) {
          const r = a(a({}, n._slotProps), o._slotProps)
          return (
            (o._slotProps = r),
            e.forEach((u) => {
              n._item && (u._item = n._item), n._index && (u._index = n._index), (u._slotProps = r)
            }),
            e
          )
        }
        function withLoop(e) {
          const n = []
          return (
            e.forEach((o) => {
              if (!Object.hasOwn(o, 'for')) {
                n.push(o)
                return
              }
              let r = getBindingValue(o.for, o)
              isArray(r) || (r = Array.from({ length: Number(r) || 0 })),
                r.forEach((u, d) => {
                  const s = cloneSchemaNode(o)
                  s._item || (s._item = {}),
                    s._index || (s._index = {}),
                    (s._item[s.id] = u),
                    (s._index[s.id] = d),
                    n.push(s)
                })
            }),
            n
          )
        }
        function renderSchemaNode(e) {
          if (e.name === lowCode.BuiltInSchemaNodeNames.TEXT) {
            const n = getBindingValue(e.textContent, e)
            return isPlainObject(n) ? JSON.stringify(n) : n.toString()
          }
          return withDesigner(e)
        }
        function renderSchemaNodeSlots(e) {
          return isPlainObject(e.slots)
            ? Object.entries(e.slots).reduce(
                (n, [o, r]) => (
                  (n[o] = (u) => {
                    var p
                    r._slotProps || (r._slotProps = {}), (r._slotProps[e.id] = u)
                    const d = (p = r.children) != null ? p : [],
                      s = withCondition(d),
                      f = withScopedVariables(s, e, r)
                    return withLoop(f).map((g) => renderSchemaNode(g))
                  }),
                  n
                ),
                {}
              )
            : {}
        }
        return (
          hoistWindow(), () => vue.h('div', { class: 'varlet-low-code-renderer' }, renderSchemaNodeSlots(props.schema))
        )
      },
    }),
    getRandomValues,
    rnds8 = new Uint8Array(16)
  function rng() {
    if (
      !getRandomValues &&
      ((getRandomValues =
        (typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
        (typeof msCrypto != 'undefined' &&
          typeof msCrypto.getRandomValues == 'function' &&
          msCrypto.getRandomValues.bind(msCrypto))),
      !getRandomValues)
    )
      throw new Error(
        'crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported'
      )
    return getRandomValues(rnds8)
  }
  var REGEX =
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i
  function validate(t) {
    return typeof t == 'string' && REGEX.test(t)
  }
  for (var byteToHex = [], i = 0; i < 256; ++i) byteToHex.push((i + 256).toString(16).substr(1))
  function stringify(t) {
    var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0,
      n = (
        byteToHex[t[e + 0]] +
        byteToHex[t[e + 1]] +
        byteToHex[t[e + 2]] +
        byteToHex[t[e + 3]] +
        '-' +
        byteToHex[t[e + 4]] +
        byteToHex[t[e + 5]] +
        '-' +
        byteToHex[t[e + 6]] +
        byteToHex[t[e + 7]] +
        '-' +
        byteToHex[t[e + 8]] +
        byteToHex[t[e + 9]] +
        '-' +
        byteToHex[t[e + 10]] +
        byteToHex[t[e + 11]] +
        byteToHex[t[e + 12]] +
        byteToHex[t[e + 13]] +
        byteToHex[t[e + 14]] +
        byteToHex[t[e + 15]]
      ).toLowerCase()
    if (!validate(n)) throw TypeError('Stringified UUID is invalid')
    return n
  }
  function v4(t, e, n) {
    t = t || {}
    var o = t.random || (t.rng || rng)()
    if (((o[6] = (o[6] & 15) | 64), (o[8] = (o[8] & 63) | 128), e)) {
      n = n || 0
      for (var r = 0; r < 16; ++r) e[n + r] = o[r]
      return e
    }
    return stringify(o)
  }
  const schema = vue.shallowRef({ id: v4(), name: lowCode.BuiltInSchemaNodeNames.PAGE }),
    assets = vue.shallowRef([])
  ;(window.onSchemaChange = (t) => {
    schema.value = t
  }),
    (window.onAssetsChange = (t) => {
      assets.value = t
    })
  function init(t) {
    ;(this.app = vue.createApp({
      setup() {
        return () => vue.h(RendererComponent, { schema: schema.value, assets: assets.value, mode: 'designer' })
      },
    })),
      this.app.mount(t)
  }
  return (
    Object.assign(RendererComponent, { app: null, init }),
    (exports.default = RendererComponent),
    Object.defineProperties(exports, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: 'Module' } }),
    exports
  )
})({}, Vue, VarletLowcodeCore)
