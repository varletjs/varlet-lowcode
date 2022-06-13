var VarletLowcodeCore = (function (h) {
  'use strict'
  const A = (t) => Object.prototype.toString.call(t) === '[object Object]',
    Y = (t) => Array.isArray(t),
    M = (t) => {
      Object.keys(t).forEach((e) => {
        e.startsWith('_') && Reflect.deleteProperty(t, e)
      })
    },
    Z = (t, e) => {
      if (t.length) {
        const r = t.indexOf(e)
        if (r > -1) return t.splice(r, 1)
      }
    }
  var N = ((t) => ((t.PAGE = 'Page'), (t.TEXT = 'Text'), t))(N || {}),
    z = ((t) => ((t.OBJECT_BINDING = 'Object'), (t.EXPRESSION_BINDING = 'Expression'), t))(z || {})
  function x() {
    let t
    function e(a) {
      return JSON.parse(JSON.stringify(a))
    }
    function r(a, s, c) {
      if (!s(a, c != null ? c : null) && A(a.slots)) {
        for (const S of Object.values(a.slots))
          if (Y(S.children) && S.children.length > 0) for (const Te of S.children) r(Te, s, S.children)
      }
    }
    function n(a, s) {
      let c = null
      return (
        r(a, (u) => {
          if (u.id === s) return (c = u), !0
        }),
        c
      )
    }
    function f(a, s) {
      if (a.id === s) throw new Error('Cannot delete itself')
      return (
        r(a, (c, u) => {
          if (c.id === s) return Z(u, c), !0
        }),
        a
      )
    }
    function o(a) {
      return (
        r(a, (s) => {
          if ((M(s), A(s.slots))) for (const c of Object.values(s.slots)) M(c)
        }),
        a
      )
    }
    function i(a) {
      return (t = o(e(a))), t
    }
    function l() {
      return e(t)
    }
    return {
      cloneSchemaNode: e,
      visitSchemaNode: r,
      findSchemaNodeById: n,
      removeSchemaNodeById: f,
      importSchema: i,
      exportSchema: l,
    }
  }
  var O = x(),
    q = typeof global == 'object' && global && global.Object === Object && global,
    Q = q,
    k = typeof self == 'object' && self && self.Object === Object && self,
    tt = Q || k || Function('return this')(),
    P = tt,
    et = P.Symbol,
    g = et,
    G = Object.prototype,
    rt = G.hasOwnProperty,
    nt = G.toString,
    _ = g ? g.toStringTag : void 0
  function at(t) {
    var e = rt.call(t, _),
      r = t[_]
    try {
      t[_] = void 0
      var n = !0
    } catch {}
    var f = nt.call(t)
    return n && (e ? (t[_] = r) : delete t[_]), f
  }
  var ot = Object.prototype,
    it = ot.toString
  function st(t) {
    return it.call(t)
  }
  var ct = '[object Null]',
    ut = '[object Undefined]',
    F = g ? g.toStringTag : void 0
  function H(t) {
    return t == null ? (t === void 0 ? ut : ct) : F && F in Object(t) ? at(t) : st(t)
  }
  function ft(t) {
    return t != null && typeof t == 'object'
  }
  var lt = '[object Symbol]'
  function w(t) {
    return typeof t == 'symbol' || (ft(t) && H(t) == lt)
  }
  function ht(t, e) {
    for (var r = -1, n = t == null ? 0 : t.length, f = Array(n); ++r < n; ) f[r] = e(t[r], r, t)
    return f
  }
  var pt = Array.isArray,
    T = pt,
    dt = 1 / 0,
    D = g ? g.prototype : void 0,
    R = D ? D.toString : void 0
  function J(t) {
    if (typeof t == 'string') return t
    if (T(t)) return ht(t, J) + ''
    if (w(t)) return R ? R.call(t) : ''
    var e = t + ''
    return e == '0' && 1 / t == -dt ? '-0' : e
  }
  function L(t) {
    var e = typeof t
    return t != null && (e == 'object' || e == 'function')
  }
  var gt = '[object AsyncFunction]',
    yt = '[object Function]',
    _t = '[object GeneratorFunction]',
    vt = '[object Proxy]'
  function bt(t) {
    if (!L(t)) return !1
    var e = H(t)
    return e == yt || e == _t || e == gt || e == vt
  }
  var mt = P['__core-js_shared__'],
    C = mt,
    B = (function () {
      var t = /[^.]+$/.exec((C && C.keys && C.keys.IE_PROTO) || '')
      return t ? 'Symbol(src)_1.' + t : ''
    })()
  function St(t) {
    return !!B && B in t
  }
  var Ot = Function.prototype,
    Pt = Ot.toString
  function wt(t) {
    if (t != null) {
      try {
        return Pt.call(t)
      } catch {}
      try {
        return t + ''
      } catch {}
    }
    return ''
  }
  var Tt = /[\\^$.*+?()[\]{}|]/g,
    Ct = /^\[object .+?Constructor\]$/,
    jt = Function.prototype,
    Et = Object.prototype,
    $t = jt.toString,
    It = Et.hasOwnProperty,
    At = RegExp(
      '^' +
        $t
          .call(It)
          .replace(Tt, '\\$&')
          .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
        '$'
    )
  function Mt(t) {
    if (!L(t) || St(t)) return !1
    var e = bt(t) ? At : Ct
    return e.test(wt(t))
  }
  function Nt(t, e) {
    return t == null ? void 0 : t[e]
  }
  function K(t, e) {
    var r = Nt(t, e)
    return Mt(r) ? r : void 0
  }
  function zt(t, e) {
    return t === e || (t !== t && e !== e)
  }
  var xt = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    Gt = /^\w*$/
  function Ft(t, e) {
    if (T(t)) return !1
    var r = typeof t
    return r == 'number' || r == 'symbol' || r == 'boolean' || t == null || w(t)
      ? !0
      : Gt.test(t) || !xt.test(t) || (e != null && t in Object(e))
  }
  var Ht = K(Object, 'create'),
    v = Ht
  function Dt() {
    ;(this.__data__ = v ? v(null) : {}), (this.size = 0)
  }
  function Rt(t) {
    var e = this.has(t) && delete this.__data__[t]
    return (this.size -= e ? 1 : 0), e
  }
  var Jt = '__lodash_hash_undefined__',
    Lt = Object.prototype,
    Bt = Lt.hasOwnProperty
  function Kt(t) {
    var e = this.__data__
    if (v) {
      var r = e[t]
      return r === Jt ? void 0 : r
    }
    return Bt.call(e, t) ? e[t] : void 0
  }
  var Ut = Object.prototype,
    Xt = Ut.hasOwnProperty
  function Vt(t) {
    var e = this.__data__
    return v ? e[t] !== void 0 : Xt.call(e, t)
  }
  var Wt = '__lodash_hash_undefined__'
  function Yt(t, e) {
    var r = this.__data__
    return (this.size += this.has(t) ? 0 : 1), (r[t] = v && e === void 0 ? Wt : e), this
  }
  function p(t) {
    var e = -1,
      r = t == null ? 0 : t.length
    for (this.clear(); ++e < r; ) {
      var n = t[e]
      this.set(n[0], n[1])
    }
  }
  ;(p.prototype.clear = Dt),
    (p.prototype.delete = Rt),
    (p.prototype.get = Kt),
    (p.prototype.has = Vt),
    (p.prototype.set = Yt)
  function Zt() {
    ;(this.__data__ = []), (this.size = 0)
  }
  function b(t, e) {
    for (var r = t.length; r--; ) if (zt(t[r][0], e)) return r
    return -1
  }
  var qt = Array.prototype,
    Qt = qt.splice
  function kt(t) {
    var e = this.__data__,
      r = b(e, t)
    if (r < 0) return !1
    var n = e.length - 1
    return r == n ? e.pop() : Qt.call(e, r, 1), --this.size, !0
  }
  function te(t) {
    var e = this.__data__,
      r = b(e, t)
    return r < 0 ? void 0 : e[r][1]
  }
  function ee(t) {
    return b(this.__data__, t) > -1
  }
  function re(t, e) {
    var r = this.__data__,
      n = b(r, t)
    return n < 0 ? (++this.size, r.push([t, e])) : (r[n][1] = e), this
  }
  function y(t) {
    var e = -1,
      r = t == null ? 0 : t.length
    for (this.clear(); ++e < r; ) {
      var n = t[e]
      this.set(n[0], n[1])
    }
  }
  ;(y.prototype.clear = Zt),
    (y.prototype.delete = kt),
    (y.prototype.get = te),
    (y.prototype.has = ee),
    (y.prototype.set = re)
  var ne = K(P, 'Map'),
    ae = ne
  function oe() {
    ;(this.size = 0), (this.__data__ = { hash: new p(), map: new (ae || y)(), string: new p() })
  }
  function ie(t) {
    var e = typeof t
    return e == 'string' || e == 'number' || e == 'symbol' || e == 'boolean' ? t !== '__proto__' : t === null
  }
  function m(t, e) {
    var r = t.__data__
    return ie(e) ? r[typeof e == 'string' ? 'string' : 'hash'] : r.map
  }
  function se(t) {
    var e = m(this, t).delete(t)
    return (this.size -= e ? 1 : 0), e
  }
  function ce(t) {
    return m(this, t).get(t)
  }
  function ue(t) {
    return m(this, t).has(t)
  }
  function fe(t, e) {
    var r = m(this, t),
      n = r.size
    return r.set(t, e), (this.size += r.size == n ? 0 : 1), this
  }
  function d(t) {
    var e = -1,
      r = t == null ? 0 : t.length
    for (this.clear(); ++e < r; ) {
      var n = t[e]
      this.set(n[0], n[1])
    }
  }
  ;(d.prototype.clear = oe),
    (d.prototype.delete = se),
    (d.prototype.get = ce),
    (d.prototype.has = ue),
    (d.prototype.set = fe)
  var le = 'Expected a function'
  function j(t, e) {
    if (typeof t != 'function' || (e != null && typeof e != 'function')) throw new TypeError(le)
    var r = function () {
      var n = arguments,
        f = e ? e.apply(this, n) : n[0],
        o = r.cache
      if (o.has(f)) return o.get(f)
      var i = t.apply(this, n)
      return (r.cache = o.set(f, i) || o), i
    }
    return (r.cache = new (j.Cache || d)()), r
  }
  j.Cache = d
  var he = 500
  function pe(t) {
    var e = j(t, function (n) {
        return r.size === he && r.clear(), n
      }),
      r = e.cache
    return e
  }
  var de = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
    ge = /\\(\\)?/g,
    ye = pe(function (t) {
      var e = []
      return (
        t.charCodeAt(0) === 46 && e.push(''),
        t.replace(de, function (r, n, f, o) {
          e.push(f ? o.replace(ge, '$1') : n || r)
        }),
        e
      )
    }),
    _e = ye
  function ve(t) {
    return t == null ? '' : J(t)
  }
  function be(t, e) {
    return T(t) ? t : Ft(t, e) ? [t] : _e(ve(t))
  }
  var me = 1 / 0
  function Se(t) {
    if (typeof t == 'string' || w(t)) return t
    var e = t + ''
    return e == '0' && 1 / t == -me ? '-0' : e
  }
  function Oe(t, e) {
    e = be(e, t)
    for (var r = 0, n = e.length; t != null && r < n; ) t = t[Se(e[r++])]
    return r && r == n ? t : void 0
  }
  function E(t, e, r) {
    var n = t == null ? void 0 : Oe(t, e)
    return n === void 0 ? r : n
  }
  function U() {
    let t
    function e(o, i) {
      const l = o.find((s) => (s.profile ? E(window, s.profile).materials.some((u) => u.name === i) : !1))
      if (!l) throw new Error(`Component ${i} cannot found`)
      const a = E(self, `${l.profile}.library`)
      return E(self, `${a}.${i}`)
    }
    async function r(o, i) {
      const l = []
      function a(s) {
        return new Promise((c, u) => {
          s.addEventListener('load', () => {
            c(void 0)
          }),
            s.addEventListener('error', () => {
              u()
            })
        })
      }
      for (const s of o)
        if (s.resources)
          for (const c of s.resources) {
            let u
            c.endsWith('.css')
              ? ((u = i.createElement('link')), (u.rel = c), i.head.append(u), l.push(a(u)))
              : ((u = i.createElement('script')), (u.src = c), i.body.append(u), await a(u))
          }
      await Promise.all(l)
    }
    function n(o) {
      return (t = JSON.parse(JSON.stringify(o))), t
    }
    function f() {
      return JSON.parse(JSON.stringify(t))
    }
    return { findComponent: e, loadResources: r, importAssets: n, exportAssets: f }
  }
  var $ = U()
  function X() {
    const t = []
    function e(o, i) {
      t.push({ event: o, listener: i, once: !1 })
    }
    function r(o, i) {
      t.push({ event: o, listener: i, once: !0 })
    }
    function n(o, i) {
      const l = t.findIndex((a) => a.event === o && a.listener === i)
      l !== -1 && t.splice(l, 1)
    }
    function f(o, ...i) {
      const l = []
      t.forEach((a) => {
        a.event === o && (a.listener(...i), a.once && l.push(a))
      }),
        l.forEach((a) => {
          n(a.event, a.listener)
        })
    }
    return { on: e, once: r, off: n, emit: f }
  }
  var I = X(),
    V = ((t) => ((t.SCHEMA_CHANGE = 'schema-change'), (t.ASSETS_CHANGE = 'assets-change'), t))(V || {})
  const Pe = O.importSchema,
    we = $.importAssets
  ;(O.importSchema = function (t) {
    const e = Pe.call(this, t)
    return I.emit('schema-change', e), e
  }),
    ($.importAssets = function (t) {
      const e = we.call(this, t)
      return I.emit('assets-change', e), e
    })
  const W = { schemaManager: O, assetsManager: $, eventsManager: I }
  return (
    (h.BuiltInEvents = V),
    (h.BuiltInSchemaNodeBindingTypes = z),
    (h.BuiltInSchemaNodeNames = N),
    (h.createAssetsManager = U),
    (h.createEventManager = X),
    (h.createSchemaManager = x),
    (h.default = W),
    (h.lowCode = W),
    Object.defineProperties(h, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: 'Module' } }),
    h
  )
})({})
