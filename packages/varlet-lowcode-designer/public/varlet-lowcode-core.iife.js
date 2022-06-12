var VarletLowcodeCore = (function (h) {
  'use strict'
  const M = (t) => Object.prototype.toString.call(t) === '[object Object]',
    Z = (t) => Array.isArray(t),
    N = (t) => {
      Object.keys(t).forEach((e) => {
        e.startsWith('_') && Reflect.deleteProperty(t, e)
      })
    },
    q = (t, e) => {
      if (t.length) {
        const r = t.indexOf(e)
        if (r > -1) return t.splice(r, 1)
      }
    }
  var z = ((t) => ((t.PAGE = 'Page'), (t.TEXT = 'Text'), t))(z || {}),
    x = ((t) => ((t.OBJECT_BINDING = 'Object'), (t.EXPRESSION_BINDING = 'Expression'), t))(x || {})
  function G() {
    let t
    function e(a) {
      return JSON.parse(JSON.stringify(a))
    }
    function r(a, s, u) {
      if (!s(a, u != null ? u : null) && M(a.slots)) {
        for (const y of Object.values(a.slots))
          if (Z(y.children) && y.children.length > 0) for (const A of y.children) r(A, s, y.children)
      }
    }
    function n(a, s) {
      let u = null
      return (
        r(a, (f) => {
          if (f.id === s) return (u = f), !0
        }),
        u
      )
    }
    function c(a, s) {
      if (a.id === s) throw new Error('Cannot delete itself')
      return (
        r(a, (u, f) => {
          if (u.id === s) return q(f, u), !0
        }),
        a
      )
    }
    function o(a) {
      return (
        r(a, (s) => {
          if ((N(s), M(s.slots))) for (const u of Object.values(s.slots)) N(u)
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
      removeSchemaNodeById: c,
      importSchema: i,
      exportSchema: l,
    }
  }
  var O = G(),
    Q = typeof global == 'object' && global && global.Object === Object && global,
    k = Q,
    tt = typeof self == 'object' && self && self.Object === Object && self,
    et = k || tt || Function('return this')(),
    P = et,
    rt = P.Symbol,
    g = rt,
    F = Object.prototype,
    nt = F.hasOwnProperty,
    at = F.toString,
    v = g ? g.toStringTag : void 0
  function ot(t) {
    var e = nt.call(t, v),
      r = t[v]
    try {
      t[v] = void 0
      var n = !0
    } catch {}
    var c = at.call(t)
    return n && (e ? (t[v] = r) : delete t[v]), c
  }
  var it = Object.prototype,
    st = it.toString
  function ct(t) {
    return st.call(t)
  }
  var ut = '[object Null]',
    ft = '[object Undefined]',
    H = g ? g.toStringTag : void 0
  function D(t) {
    return t == null ? (t === void 0 ? ft : ut) : H && H in Object(t) ? ot(t) : ct(t)
  }
  function lt(t) {
    return t != null && typeof t == 'object'
  }
  var ht = '[object Symbol]'
  function E(t) {
    return typeof t == 'symbol' || (lt(t) && D(t) == ht)
  }
  function pt(t, e) {
    for (var r = -1, n = t == null ? 0 : t.length, c = Array(n); ++r < n; ) c[r] = e(t[r], r, t)
    return c
  }
  var dt = Array.isArray,
    C = dt,
    gt = 1 / 0,
    R = g ? g.prototype : void 0,
    J = R ? R.toString : void 0
  function L(t) {
    if (typeof t == 'string') return t
    if (C(t)) return pt(t, L) + ''
    if (E(t)) return J ? J.call(t) : ''
    var e = t + ''
    return e == '0' && 1 / t == -gt ? '-0' : e
  }
  function B(t) {
    var e = typeof t
    return t != null && (e == 'object' || e == 'function')
  }
  var _t = '[object AsyncFunction]',
    yt = '[object Function]',
    vt = '[object GeneratorFunction]',
    bt = '[object Proxy]'
  function mt(t) {
    if (!B(t)) return !1
    var e = D(t)
    return e == yt || e == vt || e == _t || e == bt
  }
  var St = P['__core-js_shared__'],
    j = St,
    K = (function () {
      var t = /[^.]+$/.exec((j && j.keys && j.keys.IE_PROTO) || '')
      return t ? 'Symbol(src)_1.' + t : ''
    })()
  function Ot(t) {
    return !!K && K in t
  }
  var Pt = Function.prototype,
    Et = Pt.toString
  function Ct(t) {
    if (t != null) {
      try {
        return Et.call(t)
      } catch {}
      try {
        return t + ''
      } catch {}
    }
    return ''
  }
  var jt = /[\\^$.*+?()[\]{}|]/g,
    wt = /^\[object .+?Constructor\]$/,
    Tt = Function.prototype,
    $t = Object.prototype,
    It = Tt.toString,
    At = $t.hasOwnProperty,
    Mt = RegExp(
      '^' +
        It.call(At)
          .replace(jt, '\\$&')
          .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
        '$'
    )
  function Nt(t) {
    if (!B(t) || Ot(t)) return !1
    var e = mt(t) ? Mt : wt
    return e.test(Ct(t))
  }
  function zt(t, e) {
    return t == null ? void 0 : t[e]
  }
  function U(t, e) {
    var r = zt(t, e)
    return Nt(r) ? r : void 0
  }
  function xt(t, e) {
    return t === e || (t !== t && e !== e)
  }
  var Gt = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    Ft = /^\w*$/
  function Ht(t, e) {
    if (C(t)) return !1
    var r = typeof t
    return r == 'number' || r == 'symbol' || r == 'boolean' || t == null || E(t)
      ? !0
      : Ft.test(t) || !Gt.test(t) || (e != null && t in Object(e))
  }
  var Dt = U(Object, 'create'),
    b = Dt
  function Rt() {
    ;(this.__data__ = b ? b(null) : {}), (this.size = 0)
  }
  function Jt(t) {
    var e = this.has(t) && delete this.__data__[t]
    return (this.size -= e ? 1 : 0), e
  }
  var Lt = '__lodash_hash_undefined__',
    Bt = Object.prototype,
    Kt = Bt.hasOwnProperty
  function Ut(t) {
    var e = this.__data__
    if (b) {
      var r = e[t]
      return r === Lt ? void 0 : r
    }
    return Kt.call(e, t) ? e[t] : void 0
  }
  var Xt = Object.prototype,
    Vt = Xt.hasOwnProperty
  function Wt(t) {
    var e = this.__data__
    return b ? e[t] !== void 0 : Vt.call(e, t)
  }
  var Yt = '__lodash_hash_undefined__'
  function Zt(t, e) {
    var r = this.__data__
    return (this.size += this.has(t) ? 0 : 1), (r[t] = b && e === void 0 ? Yt : e), this
  }
  function p(t) {
    var e = -1,
      r = t == null ? 0 : t.length
    for (this.clear(); ++e < r; ) {
      var n = t[e]
      this.set(n[0], n[1])
    }
  }
  ;(p.prototype.clear = Rt),
    (p.prototype.delete = Jt),
    (p.prototype.get = Ut),
    (p.prototype.has = Wt),
    (p.prototype.set = Zt)
  function qt() {
    ;(this.__data__ = []), (this.size = 0)
  }
  function m(t, e) {
    for (var r = t.length; r--; ) if (xt(t[r][0], e)) return r
    return -1
  }
  var Qt = Array.prototype,
    kt = Qt.splice
  function te(t) {
    var e = this.__data__,
      r = m(e, t)
    if (r < 0) return !1
    var n = e.length - 1
    return r == n ? e.pop() : kt.call(e, r, 1), --this.size, !0
  }
  function ee(t) {
    var e = this.__data__,
      r = m(e, t)
    return r < 0 ? void 0 : e[r][1]
  }
  function re(t) {
    return m(this.__data__, t) > -1
  }
  function ne(t, e) {
    var r = this.__data__,
      n = m(r, t)
    return n < 0 ? (++this.size, r.push([t, e])) : (r[n][1] = e), this
  }
  function _(t) {
    var e = -1,
      r = t == null ? 0 : t.length
    for (this.clear(); ++e < r; ) {
      var n = t[e]
      this.set(n[0], n[1])
    }
  }
  ;(_.prototype.clear = qt),
    (_.prototype.delete = te),
    (_.prototype.get = ee),
    (_.prototype.has = re),
    (_.prototype.set = ne)
  var ae = U(P, 'Map'),
    oe = ae
  function ie() {
    ;(this.size = 0), (this.__data__ = { hash: new p(), map: new (oe || _)(), string: new p() })
  }
  function se(t) {
    var e = typeof t
    return e == 'string' || e == 'number' || e == 'symbol' || e == 'boolean' ? t !== '__proto__' : t === null
  }
  function S(t, e) {
    var r = t.__data__
    return se(e) ? r[typeof e == 'string' ? 'string' : 'hash'] : r.map
  }
  function ce(t) {
    var e = S(this, t).delete(t)
    return (this.size -= e ? 1 : 0), e
  }
  function ue(t) {
    return S(this, t).get(t)
  }
  function fe(t) {
    return S(this, t).has(t)
  }
  function le(t, e) {
    var r = S(this, t),
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
  ;(d.prototype.clear = ie),
    (d.prototype.delete = ce),
    (d.prototype.get = ue),
    (d.prototype.has = fe),
    (d.prototype.set = le)
  var he = 'Expected a function'
  function w(t, e) {
    if (typeof t != 'function' || (e != null && typeof e != 'function')) throw new TypeError(he)
    var r = function () {
      var n = arguments,
        c = e ? e.apply(this, n) : n[0],
        o = r.cache
      if (o.has(c)) return o.get(c)
      var i = t.apply(this, n)
      return (r.cache = o.set(c, i) || o), i
    }
    return (r.cache = new (w.Cache || d)()), r
  }
  w.Cache = d
  var pe = 500
  function de(t) {
    var e = w(t, function (n) {
        return r.size === pe && r.clear(), n
      }),
      r = e.cache
    return e
  }
  var ge = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
    _e = /\\(\\)?/g,
    ye = de(function (t) {
      var e = []
      return (
        t.charCodeAt(0) === 46 && e.push(''),
        t.replace(ge, function (r, n, c, o) {
          e.push(c ? o.replace(_e, '$1') : n || r)
        }),
        e
      )
    }),
    ve = ye
  function be(t) {
    return t == null ? '' : L(t)
  }
  function me(t, e) {
    return C(t) ? t : Ht(t, e) ? [t] : ve(be(t))
  }
  var Se = 1 / 0
  function Oe(t) {
    if (typeof t == 'string' || E(t)) return t
    var e = t + ''
    return e == '0' && 1 / t == -Se ? '-0' : e
  }
  function Pe(t, e) {
    e = me(e, t)
    for (var r = 0, n = e.length; t != null && r < n; ) t = t[Oe(e[r++])]
    return r && r == n ? t : void 0
  }
  function T(t, e, r) {
    var n = t == null ? void 0 : Pe(t, e)
    return n === void 0 ? r : n
  }
  function X() {
    let t
    function e(o, i) {
      const l = o.find((s) => (s.profile ? T(window, s.profile).materials.some((f) => f.name === i) : !1))
      if (!l) throw new Error(`Component ${i} cannot found`)
      const a = T(self, `${l.profile}.library`)
      return T(self, `${a}.${i}`)
    }
    function r(o, i) {
      const l = []
      return (
        o.forEach((a) => {
          var s
          ;(s = a.resources) == null ||
            s.forEach((u) => {
              let f
              u.endsWith('.css')
                ? ((f = i.createElement('link')), (f.rel = u), i.head.append(f))
                : ((f = i.createElement('script')), (f.src = u), i.body.append(f)),
                l.push(
                  new Promise((y, A) => {
                    f.addEventListener('load', () => {
                      y()
                    }),
                      f.addEventListener('error', () => {
                        A()
                      })
                  })
                )
            })
        }),
        Promise.all(l)
      )
    }
    function n(o) {
      return (t = JSON.parse(JSON.stringify(o))), t
    }
    function c() {
      return JSON.parse(JSON.stringify(t))
    }
    return { findComponent: e, loadResources: r, importAssets: n, exportAssets: c }
  }
  var $ = X()
  function V() {
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
    function c(o, ...i) {
      const l = []
      t.forEach((a) => {
        a.event === o && (a.listener(...i), a.once && l.push(a))
      }),
        l.forEach((a) => {
          n(a.event, a.listener)
        })
    }
    return { on: e, once: r, off: n, emit: c }
  }
  var I = V(),
    W = ((t) => ((t.SCHEMA_CHANGE = 'schema-change'), (t.ASSETS_CHANGE = 'assets-change'), t))(W || {})
  const Ee = O.importSchema,
    Ce = $.importAssets
  ;(O.importSchema = function (t) {
    const e = Ee.call(this, t)
    return I.emit('schema-change', e), e
  }),
    ($.importAssets = function (t) {
      const e = Ce.call(this, t)
      return I.emit('assets-change', e), e
    })
  const Y = { schemaManager: O, assetsManager: $, eventsManager: I }
  return (
    (h.BuiltInEvents = W),
    (h.BuiltInSchemaNodeBindingTypes = x),
    (h.BuiltInSchemaNodeNames = z),
    (h.createAssetsManager = X),
    (h.createEventManager = V),
    (h.createSchemaManager = G),
    (h.default = Y),
    (h.lowCode = Y),
    Object.defineProperties(h, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: 'Module' } }),
    h
  )
})({})
