;(function (d, b) {
  typeof exports == 'object' && typeof module != 'undefined'
    ? b(exports)
    : typeof define == 'function' && define.amd
    ? define(['exports'], b)
    : ((d = typeof globalThis != 'undefined' ? globalThis : d || self), b((d.VarletLowcodeCore = {})))
})(this, function (d) {
  'use strict'
  const b = (t) => Object.prototype.toString.call(t) === '[object Object]',
    it = (t) => Array.isArray(t),
    J = (t) => {
      Object.keys(t).forEach((e) => {
        e.startsWith('_') && Reflect.deleteProperty(t, e)
      })
    },
    at = (t, e) => {
      if (t.length) {
        const n = t.indexOf(e)
        if (n > -1) return t.splice(n, 1)
      }
    },
    st = (t) => t.replace(/-/g, '')
  var C,
    ct = new Uint8Array(16)
  function ut() {
    if (
      !C &&
      ((C =
        (typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
        (typeof msCrypto != 'undefined' &&
          typeof msCrypto.getRandomValues == 'function' &&
          msCrypto.getRandomValues.bind(msCrypto))),
      !C)
    )
      throw new Error(
        'crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported'
      )
    return C(ct)
  }
  var ft =
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i
  function lt(t) {
    return typeof t == 'string' && ft.test(t)
  }
  for (var l = [], A = 0; A < 256; ++A) l.push((A + 256).toString(16).substr(1))
  function pt(t) {
    var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0,
      n = (
        l[t[e + 0]] +
        l[t[e + 1]] +
        l[t[e + 2]] +
        l[t[e + 3]] +
        '-' +
        l[t[e + 4]] +
        l[t[e + 5]] +
        '-' +
        l[t[e + 6]] +
        l[t[e + 7]] +
        '-' +
        l[t[e + 8]] +
        l[t[e + 9]] +
        '-' +
        l[t[e + 10]] +
        l[t[e + 11]] +
        l[t[e + 12]] +
        l[t[e + 13]] +
        l[t[e + 14]] +
        l[t[e + 15]]
      ).toLowerCase()
    if (!lt(n)) throw TypeError('Stringified UUID is invalid')
    return n
  }
  function L(t, e, n) {
    t = t || {}
    var r = t.random || (t.rng || ut)()
    if (((r[6] = (r[6] & 15) | 64), (r[8] = (r[8] & 63) | 128), e)) {
      n = n || 0
      for (var a = 0; a < 16; ++a) e[n + a] = r[a]
      return e
    }
    return pt(r)
  }
  var V = ((t) => ((t.PAGE = 'Page'), (t.TEXT = 'Text'), t))(V || {}),
    U = ((t) => ((t.OBJECT_BINDING = 'Object'), (t.EXPRESSION_BINDING = 'Expression'), t))(U || {})
  function X() {
    let t = { id: L(), name: 'Page' }
    function e(o) {
      return o.name === 'Page'
    }
    function n(o) {
      return o.name === 'Text'
    }
    function r(o) {
      return b(o) && o.type === 'Expression'
    }
    function a(o) {
      return b(o) && o.type === 'Object'
    }
    function s() {
      return st(L())
    }
    function f(o) {
      return JSON.parse(JSON.stringify(o))
    }
    function c(o, v, _) {
      if (!v(o, _ != null ? _ : null) && b(o.slots)) {
        for (const M of Object.values(o.slots))
          if (it(M.children) && M.children.length > 0) for (const Le of M.children) c(Le, v, M.children)
      }
    }
    function i(o, v) {
      let _ = null
      return (
        c(o, ($) => {
          if ($.id === v) return (_ = $), !0
        }),
        _
      )
    }
    function u(o, v) {
      if (o.id === v) throw new Error('Cannot delete itself')
      return (
        c(o, (_, $) => {
          if (_.id === v) return at($, _), !0
        }),
        o
      )
    }
    function h(o) {
      return (
        c(o, (v) => {
          if ((J(v), b(v.slots))) for (const _ of Object.values(v.slots)) J(_)
        }),
        o
      )
    }
    function m(o) {
      return { type: 'Expression', value: o }
    }
    function p(o) {
      return { type: 'Object', value: o }
    }
    function g(o) {
      return (t = h(f(o))), t
    }
    function y() {
      return f(t)
    }
    return {
      generateId: s,
      isSchemaPageNode: e,
      isSchemaTextNode: n,
      isExpressionBinding: r,
      isObjectBinding: a,
      createExpressionBinding: m,
      createObjectBinding: p,
      cloneSchemaNode: f,
      visitSchemaNode: c,
      findSchemaNodeById: i,
      removeSchemaNodeById: u,
      importSchema: g,
      exportSchema: y,
    }
  }
  var N = X(),
    dt = typeof global == 'object' && global && global.Object === Object && global,
    ht = dt,
    gt = typeof self == 'object' && self && self.Object === Object && self,
    yt = ht || gt || Function('return this')(),
    R = yt,
    mt = R.Symbol,
    O = mt,
    K = Object.prototype,
    vt = K.hasOwnProperty,
    _t = K.toString,
    E = O ? O.toStringTag : void 0
  function bt(t) {
    var e = vt.call(t, E),
      n = t[E]
    try {
      t[E] = void 0
      var r = !0
    } catch {}
    var a = _t.call(t)
    return r && (e ? (t[E] = n) : delete t[E]), a
  }
  var St = Object.prototype,
    wt = St.toString
  function Ot(t) {
    return wt.call(t)
  }
  var Pt = '[object Null]',
    Et = '[object Undefined]',
    W = O ? O.toStringTag : void 0
  function Y(t) {
    return t == null ? (t === void 0 ? Et : Pt) : W && W in Object(t) ? bt(t) : Ot(t)
  }
  function Tt(t) {
    return t != null && typeof t == 'object'
  }
  var jt = '[object Symbol]'
  function z(t) {
    return typeof t == 'symbol' || (Tt(t) && Y(t) == jt)
  }
  function $t(t, e) {
    for (var n = -1, r = t == null ? 0 : t.length, a = Array(r); ++n < r; ) a[n] = e(t[n], n, t)
    return a
  }
  var Ct = Array.isArray,
    G = Ct,
    It = 1 / 0,
    Z = O ? O.prototype : void 0,
    k = Z ? Z.toString : void 0
  function q(t) {
    if (typeof t == 'string') return t
    if (G(t)) return $t(t, q) + ''
    if (z(t)) return k ? k.call(t) : ''
    var e = t + ''
    return e == '0' && 1 / t == -It ? '-0' : e
  }
  function Q(t) {
    var e = typeof t
    return t != null && (e == 'object' || e == 'function')
  }
  var xt = '[object AsyncFunction]',
    Mt = '[object Function]',
    At = '[object GeneratorFunction]',
    Nt = '[object Proxy]'
  function Rt(t) {
    if (!Q(t)) return !1
    var e = Y(t)
    return e == Mt || e == At || e == xt || e == Nt
  }
  var zt = R['__core-js_shared__'],
    H = zt,
    tt = (function () {
      var t = /[^.]+$/.exec((H && H.keys && H.keys.IE_PROTO) || '')
      return t ? 'Symbol(src)_1.' + t : ''
    })()
  function Gt(t) {
    return !!tt && tt in t
  }
  var Ht = Function.prototype,
    Dt = Ht.toString
  function Ft(t) {
    if (t != null) {
      try {
        return Dt.call(t)
      } catch {}
      try {
        return t + ''
      } catch {}
    }
    return ''
  }
  var Bt = /[\\^$.*+?()[\]{}|]/g,
    Jt = /^\[object .+?Constructor\]$/,
    Lt = Function.prototype,
    Vt = Object.prototype,
    Ut = Lt.toString,
    Xt = Vt.hasOwnProperty,
    Kt = RegExp(
      '^' +
        Ut.call(Xt)
          .replace(Bt, '\\$&')
          .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
        '$'
    )
  function Wt(t) {
    if (!Q(t) || Gt(t)) return !1
    var e = Rt(t) ? Kt : Jt
    return e.test(Ft(t))
  }
  function Yt(t, e) {
    return t == null ? void 0 : t[e]
  }
  function et(t, e) {
    var n = Yt(t, e)
    return Wt(n) ? n : void 0
  }
  function Zt(t, e) {
    return t === e || (t !== t && e !== e)
  }
  var kt = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    qt = /^\w*$/
  function Qt(t, e) {
    if (G(t)) return !1
    var n = typeof t
    return n == 'number' || n == 'symbol' || n == 'boolean' || t == null || z(t)
      ? !0
      : qt.test(t) || !kt.test(t) || (e != null && t in Object(e))
  }
  var te = et(Object, 'create'),
    T = te
  function ee() {
    ;(this.__data__ = T ? T(null) : {}), (this.size = 0)
  }
  function ne(t) {
    var e = this.has(t) && delete this.__data__[t]
    return (this.size -= e ? 1 : 0), e
  }
  var re = '__lodash_hash_undefined__',
    oe = Object.prototype,
    ie = oe.hasOwnProperty
  function ae(t) {
    var e = this.__data__
    if (T) {
      var n = e[t]
      return n === re ? void 0 : n
    }
    return ie.call(e, t) ? e[t] : void 0
  }
  var se = Object.prototype,
    ce = se.hasOwnProperty
  function ue(t) {
    var e = this.__data__
    return T ? e[t] !== void 0 : ce.call(e, t)
  }
  var fe = '__lodash_hash_undefined__'
  function le(t, e) {
    var n = this.__data__
    return (this.size += this.has(t) ? 0 : 1), (n[t] = T && e === void 0 ? fe : e), this
  }
  function S(t) {
    var e = -1,
      n = t == null ? 0 : t.length
    for (this.clear(); ++e < n; ) {
      var r = t[e]
      this.set(r[0], r[1])
    }
  }
  ;(S.prototype.clear = ee),
    (S.prototype.delete = ne),
    (S.prototype.get = ae),
    (S.prototype.has = ue),
    (S.prototype.set = le)
  function pe() {
    ;(this.__data__ = []), (this.size = 0)
  }
  function I(t, e) {
    for (var n = t.length; n--; ) if (Zt(t[n][0], e)) return n
    return -1
  }
  var de = Array.prototype,
    he = de.splice
  function ge(t) {
    var e = this.__data__,
      n = I(e, t)
    if (n < 0) return !1
    var r = e.length - 1
    return n == r ? e.pop() : he.call(e, n, 1), --this.size, !0
  }
  function ye(t) {
    var e = this.__data__,
      n = I(e, t)
    return n < 0 ? void 0 : e[n][1]
  }
  function me(t) {
    return I(this.__data__, t) > -1
  }
  function ve(t, e) {
    var n = this.__data__,
      r = I(n, t)
    return r < 0 ? (++this.size, n.push([t, e])) : (n[r][1] = e), this
  }
  function P(t) {
    var e = -1,
      n = t == null ? 0 : t.length
    for (this.clear(); ++e < n; ) {
      var r = t[e]
      this.set(r[0], r[1])
    }
  }
  ;(P.prototype.clear = pe),
    (P.prototype.delete = ge),
    (P.prototype.get = ye),
    (P.prototype.has = me),
    (P.prototype.set = ve)
  var _e = et(R, 'Map'),
    be = _e
  function Se() {
    ;(this.size = 0), (this.__data__ = { hash: new S(), map: new (be || P)(), string: new S() })
  }
  function we(t) {
    var e = typeof t
    return e == 'string' || e == 'number' || e == 'symbol' || e == 'boolean' ? t !== '__proto__' : t === null
  }
  function x(t, e) {
    var n = t.__data__
    return we(e) ? n[typeof e == 'string' ? 'string' : 'hash'] : n.map
  }
  function Oe(t) {
    var e = x(this, t).delete(t)
    return (this.size -= e ? 1 : 0), e
  }
  function Pe(t) {
    return x(this, t).get(t)
  }
  function Ee(t) {
    return x(this, t).has(t)
  }
  function Te(t, e) {
    var n = x(this, t),
      r = n.size
    return n.set(t, e), (this.size += n.size == r ? 0 : 1), this
  }
  function w(t) {
    var e = -1,
      n = t == null ? 0 : t.length
    for (this.clear(); ++e < n; ) {
      var r = t[e]
      this.set(r[0], r[1])
    }
  }
  ;(w.prototype.clear = Se),
    (w.prototype.delete = Oe),
    (w.prototype.get = Pe),
    (w.prototype.has = Ee),
    (w.prototype.set = Te)
  var je = 'Expected a function'
  function D(t, e) {
    if (typeof t != 'function' || (e != null && typeof e != 'function')) throw new TypeError(je)
    var n = function () {
      var r = arguments,
        a = e ? e.apply(this, r) : r[0],
        s = n.cache
      if (s.has(a)) return s.get(a)
      var f = t.apply(this, r)
      return (n.cache = s.set(a, f) || s), f
    }
    return (n.cache = new (D.Cache || w)()), n
  }
  D.Cache = w
  var $e = 500
  function Ce(t) {
    var e = D(t, function (r) {
        return n.size === $e && n.clear(), r
      }),
      n = e.cache
    return e
  }
  var Ie = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
    xe = /\\(\\)?/g,
    Me = Ce(function (t) {
      var e = []
      return (
        t.charCodeAt(0) === 46 && e.push(''),
        t.replace(Ie, function (n, r, a, s) {
          e.push(a ? s.replace(xe, '$1') : r || n)
        }),
        e
      )
    }),
    Ae = Me
  function Ne(t) {
    return t == null ? '' : q(t)
  }
  function Re(t, e) {
    return G(t) ? t : Qt(t, e) ? [t] : Ae(Ne(t))
  }
  var ze = 1 / 0
  function Ge(t) {
    if (typeof t == 'string' || z(t)) return t
    var e = t + ''
    return e == '0' && 1 / t == -ze ? '-0' : e
  }
  function He(t, e) {
    e = Re(e, t)
    for (var n = 0, r = e.length; t != null && n < r; ) t = t[Ge(e[n++])]
    return n && n == r ? t : void 0
  }
  function j(t, e, n) {
    var r = t == null ? void 0 : He(t, e)
    return r === void 0 ? n : r
  }
  function nt() {
    let t = []
    function e(i, u, h) {
      const m = i.find((g) => {
        if (!g.profile) return !1
        const y = j(window, g.profile),
          o = y.materials.some((_) => _.name === u),
          v = h === y.library
        return o && v
      })
      if (!m) throw new Error(`Component not found by name: ${u} and library: ${h}`)
      const p = j(window, `${m.profile}.library`)
      return j(window, `${p}.${u}`)
    }
    function n(i, u, h) {
      for (const m of i) {
        if (!m.profile) continue
        const p = j(window, m.profile)
        if (p.library === h) {
          for (const g of p.materials) if (g.name === u) return g
        }
      }
      throw new Error(`Material not found by name: ${u} and library: ${h}`)
    }
    function r(i, u, h) {
      for (const m of i) {
        if (!m.profile) continue
        const p = j(window, m.profile)
        if (p.library === h) {
          for (const g of p.materials) if (g.name === u) return p
        }
      }
      throw new Error(`Profile not found by name: ${u} and library: ${h}`)
    }
    function a(i) {
      return i.reduce((u, h) => (u.push(...h.resources), u), [])
    }
    async function s(i, u) {
      const h = []
      function m(p) {
        return new Promise((g, y) => {
          p.addEventListener('load', () => {
            g(void 0)
          }),
            p.addEventListener('error', () => {
              y()
            })
        })
      }
      for (const p of i)
        if (p.resources)
          for (const g of p.resources) {
            let y
            g.endsWith('.css')
              ? ((y = u.createElement('link')), (y.rel = g), u.head.append(y), h.push(m(y)))
              : ((y = u.createElement('script')), (y.src = g), u.body.append(y), await m(y))
          }
      await Promise.all(h)
    }
    function f(i) {
      return (t = JSON.parse(JSON.stringify(i))), t
    }
    function c() {
      return JSON.parse(JSON.stringify(t))
    }
    return {
      findComponent: e,
      findMaterial: n,
      findProfile: r,
      getResources: a,
      loadResources: s,
      importAssets: f,
      exportAssets: c,
    }
  }
  var F = nt()
  function rt() {
    const t = []
    function e(s, f) {
      t.push({ event: s, listener: f, once: !1 })
    }
    function n(s, f) {
      t.push({ event: s, listener: f, once: !0 })
    }
    function r(s, f) {
      const c = t.findIndex((i) => i.event === s && i.listener === f)
      c !== -1 && t.splice(c, 1)
    }
    function a(s, ...f) {
      const c = []
      t.forEach((i) => {
        i.event === s && (i.listener(...f), i.once && c.push(i))
      }),
        c.forEach((i) => {
          r(i.event, i.listener)
        })
    }
    return { on: e, once: n, off: r, emit: a }
  }
  var B = rt()
  function De() {
    const t = [],
      e = [],
      n = { useSkeletonPlugin: r, useSelectorPlugin: a, exportSkeletonPlugins: s, exportSelectorPlugins: f }
    function r(c) {
      return t.some((i) => i.name === c.name)
        ? (console.warn('Skeleton plugins registered with the same name will be automatically ignored'), n)
        : (t.push(c), n)
    }
    function a(c) {
      return e.some((i) => i.name === c.name)
        ? (console.warn('Selector plugins registered with the same name will be automatically ignored'), n)
        : (e.push(c), n)
    }
    function s() {
      return t
    }
    function f() {
      return e
    }
    return n
  }
  var Fe = De(),
    ot = ((t) => ((t.SCHEMA_CHANGE = 'schema-change'), (t.ASSETS_CHANGE = 'assets-change'), t))(ot || {})
  const Be = N.importSchema,
    Je = F.importAssets
  ;(N.importSchema = function (t) {
    const e = Be.call(this, t)
    return B.emit('schema-change', e), e
  }),
    (F.importAssets = function (t) {
      const e = Je.call(this, t)
      return B.emit('assets-change', e), e
    }),
    (d.BuiltInEvents = ot),
    (d.BuiltInSchemaNodeBindingTypes = U),
    (d.BuiltInSchemaNodeNames = V),
    (d.assetsManager = F),
    (d.createAssetsManager = nt),
    (d.createEventManager = rt),
    (d.createSchemaManager = X),
    (d.eventsManager = B),
    (d.pluginsManager = Fe),
    (d.schemaManager = N),
    Object.defineProperties(d, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: 'Module' } })
})
