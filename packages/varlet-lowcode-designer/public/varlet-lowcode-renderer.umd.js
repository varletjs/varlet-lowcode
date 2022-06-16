var m = Object.defineProperty
var p = Object.getOwnPropertySymbols
var w = Object.prototype.hasOwnProperty,
  g = Object.prototype.propertyIsEnumerable
var a = (o, e, n) => (e in o ? m(o, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (o[e] = n)),
  u = (o, e) => {
    for (var n in e || (e = {})) w.call(e, n) && a(o, n, e[n])
    if (p) for (var n of p(e)) g.call(e, n) && a(o, n, e[n])
    return o
  }
;(function (o, e) {
  typeof exports == 'object' && typeof module != 'undefined'
    ? e(exports, require('vue'), require('@varlet/lowcode-core'))
    : typeof define == 'function' && define.amd
    ? define(['exports', 'vue', '@varlet/lowcode-core'], e)
    : ((o = typeof globalThis != 'undefined' ? globalThis : o || self),
      e((o.VarletLowcodeRenderer = {}), o.Vue, o.VarletLowcodeCore))
})(this, function (exports, vue, lowcodeCore) {
  'use strict'
  const isPlainObject = (o) => Object.prototype.toString.call(o) === '[object Object]',
    isArray = (o) => Array.isArray(o)
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
      var o
      const setup = eval(`(${(o = props.schema.code) != null ? o : 'function setup() { return {} }'})`),
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
          const { value: t, type: r } = e
          if (r === lowcodeCore.BuiltInSchemaNodeBindingTypes.EXPRESSION_BINDING) return getExpressionBindingValue(t, n)
          if (r === lowcodeCore.BuiltInSchemaNodeBindingTypes.OBJECT_BINDING) return t
        }
        return e
      }
      function getComponent(e, n) {
        return lowcodeCore.assetsManager.findComponent(props.assets, e, n)
      }
      function getPropsBinding(e) {
        var t
        return Object.entries((t = e.props) != null ? t : {}).reduce(
          (r, [s, d]) => ((r[s] = getBindingValue(d, e)), r),
          {}
        )
      }
      function withDesigner(e) {
        return (
          props.mode === 'designer',
          vue.h(getComponent(e.name, e.library), getPropsBinding(e), renderSchemaNodeSlots(e))
        )
      }
      function withCondition(e) {
        return e.filter((n) => {
          var t
          return Boolean(getBindingValue((t = n.if) != null ? t : !0, n))
        })
      }
      function withScopedVariables(e, n, t) {
        const r = u(u({}, n._slotProps), t._slotProps)
        return (
          (t._slotProps = r),
          e.forEach((s) => {
            n._item && (s._item = n._item), n._index && (s._index = n._index), (s._slotProps = r)
          }),
          e
        )
      }
      function withLoop(e) {
        const n = []
        return (
          e.forEach((t) => {
            if (!Object.hasOwn(t, 'for')) {
              n.push(t)
              return
            }
            let r = getBindingValue(t.for, t)
            isArray(r) || (r = Array.from({ length: Number(r) || 0 })),
              r.forEach((s, d) => {
                const i = cloneSchemaNode(t)
                i._item || (i._item = {}),
                  i._index || (i._index = {}),
                  (i._item[i.id] = s),
                  (i._index[i.id] = d),
                  n.push(i)
              })
          }),
          n
        )
      }
      function renderSchemaNode(e) {
        if (e.name === lowcodeCore.BuiltInSchemaNodeNames.TEXT) {
          const n = getBindingValue(e.textContent, e)
          return isPlainObject(n) ? JSON.stringify(n) : n.toString()
        }
        return withDesigner(e)
      }
      function renderSchemaNodeSlots(e) {
        return isPlainObject(e.slots)
          ? Object.entries(e.slots).reduce(
              (n, [t, r]) => (
                (n[t] = (s) => {
                  var c
                  r._slotProps || (r._slotProps = {}), (r._slotProps[e.id] = s)
                  const d = (c = r.children) != null ? c : [],
                    i = withCondition(d),
                    l = withScopedVariables(i, e, r)
                  return withLoop(l).map((f) => renderSchemaNode(f))
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
  })
  const schema = vue.shallowRef({
      id: lowcodeCore.schemaManager.generateId(),
      name: lowcodeCore.BuiltInSchemaNodeNames.PAGE,
    }),
    assets = vue.shallowRef([])
  function init(o) {
    ;(this.app = vue.createApp({
      setup() {
        return () => vue.h(RendererComponent, { schema: schema.value, assets: assets.value, mode: 'designer' })
      },
    })),
      this.app.mount(o)
  }
  Object.assign(RendererComponent, { app: null, init, schema, assets }),
    (exports.default = RendererComponent),
    Object.defineProperties(exports, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: 'Module' } })
})
