var VarletLowcodeCore = (function (h) {
  'use strict'
  const R = (t) => Object.prototype.toString.call(t) === '[object Object]',
    Q = (t) => Array.isArray(t),
    G = (t) => {
      Object.keys(t).forEach((e) => {
        e.startsWith('_') && Reflect.deleteProperty(t, e)
      })
    },
    tt = (t, e) => {
      if (t.length) {
        const n = t.indexOf(e)
        if (n > -1) return t.splice(n, 1)
      }
    }
  var w,
    et = new Uint8Array(16)
  function nt() {
    if (
      !w &&
      ((w =
        (typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
        (typeof msCrypto != 'undefined' &&
          typeof msCrypto.getRandomValues == 'function' &&
          msCrypto.getRandomValues.bind(msCrypto))),
      !w)
    )
      throw new Error(
        'crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported'
      )
    return w(et)
  }
  var rt =
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i
  function ot(t) {
    return typeof t == 'string' && rt.test(t)
  }
  for (var p = [], T = 0; T < 256; ++T) p.push((T + 256).toString(16).substr(1))
  function at(t) {
    var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0,
      n = (
        p[t[e + 0]] +
        p[t[e + 1]] +
        p[t[e + 2]] +
        p[t[e + 3]] +
        '-' +
        p[t[e + 4]] +
        p[t[e + 5]] +
        '-' +
        p[t[e + 6]] +
        p[t[e + 7]] +
        '-' +
        p[t[e + 8]] +
        p[t[e + 9]] +
        '-' +
        p[t[e + 10]] +
        p[t[e + 11]] +
        p[t[e + 12]] +
        p[t[e + 13]] +
        p[t[e + 14]] +
        p[t[e + 15]]
      ).toLowerCase()
    if (!ot(n)) throw TypeError('Stringified UUID is invalid')
    return n
  }
  function it(t, e, n) {
    t = t || {}
    var r = t.random || (t.rng || nt)()
    if (((r[6] = (r[6] & 15) | 64), (r[8] = (r[8] & 63) | 128), e)) {
      n = n || 0
      for (var c = 0; c < 16; ++c) e[n + c] = r[c]
      return e
    }
    return at(r)
  }
  var H = ((t) => ((t.PAGE = 'Page'), (t.TEXT = 'Text'), t))(H || {}),
    D = ((t) => ((t.OBJECT_BINDING = 'Object'), (t.EXPRESSION_BINDING = 'Expression'), t))(D || {})
  function F() {
    let t = { id: it(), name: 'Page' }
    function e(o) {
      return JSON.parse(JSON.stringify(o))
    }
    function n(o, l, s) {
      if (!l(o, s != null ? s : null) && R(o.slots)) {
        for (const C of Object.values(o.slots))
          if (Q(C.children) && C.children.length > 0) for (const Ge of C.children) n(Ge, l, C.children)
      }
    }
    function r(o, l) {
      let s = null
      return (
        n(o, (S) => {
          if (S.id === l) return (s = S), !0
        }),
        s
      )
    }
    function c(o, l) {
      if (o.id === l) throw new Error('Cannot delete itself')
      return (
        n(o, (s, S) => {
          if (s.id === l) return tt(S, s), !0
        }),
        o
      )
    }
    function f(o) {
      return (
        n(o, (l) => {
          if ((G(l), R(l.slots))) for (const s of Object.values(l.slots)) G(s)
        }),
        o
      )
    }
    function u(o) {
      return { type: 'Expression', value: o }
    }
    function a(o) {
      return { type: 'Object', value: o }
    }
    function i(o) {
      return (t = f(e(o))), t
    }
    function d() {
      return e(t)
    }
    return {
      createExpressionBinding: u,
      createObjectBinding: a,
      cloneSchemaNode: e,
      visitSchemaNode: n,
      findSchemaNodeById: r,
      removeSchemaNodeById: c,
      importSchema: i,
      exportSchema: d,
    }
  }
  var j = F(),
    st = typeof global == 'object' && global && global.Object === Object && global,
    ct = st,
    ut = typeof self == 'object' && self && self.Object === Object && self,
    ft = ct || ut || Function('return this')(),
    $ = ft,
    lt = $.Symbol,
    v = lt,
    J = Object.prototype,
    pt = J.hasOwnProperty,
    ht = J.toString,
    _ = v ? v.toStringTag : void 0
  function dt(t) {
    var e = pt.call(t, _),
      n = t[_]
    try {
      t[_] = void 0
      var r = !0
    } catch {}
    var c = ht.call(t)
    return r && (e ? (t[_] = n) : delete t[_]), c
  }
  var gt = Object.prototype,
    yt = gt.toString
  function vt(t) {
    return yt.call(t)
  }
  var mt = '[object Null]',
    _t = '[object Undefined]',
    L = v ? v.toStringTag : void 0
  function V(t) {
    return t == null ? (t === void 0 ? _t : mt) : L && L in Object(t) ? dt(t) : vt(t)
  }
  function bt(t) {
    return t != null && typeof t == 'object'
  }
  var St = '[object Symbol]'
  function I(t) {
    return typeof t == 'symbol' || (bt(t) && V(t) == St)
  }
  function wt(t, e) {
    for (var n = -1, r = t == null ? 0 : t.length, c = Array(r); ++n < r; ) c[n] = e(t[n], n, t)
    return c
  }
  var Ot = Array.isArray,
    M = Ot,
    Pt = 1 / 0,
    B = v ? v.prototype : void 0,
    U = B ? B.toString : void 0
  function X(t) {
    if (typeof t == 'string') return t
    if (M(t)) return wt(t, X) + ''
    if (I(t)) return U ? U.call(t) : ''
    var e = t + ''
    return e == '0' && 1 / t == -Pt ? '-0' : e
  }
  function K(t) {
    var e = typeof t
    return t != null && (e == 'object' || e == 'function')
  }
  var Et = '[object AsyncFunction]',
    Ct = '[object Function]',
    Tt = '[object GeneratorFunction]',
    jt = '[object Proxy]'
  function $t(t) {
    if (!K(t)) return !1
    var e = V(t)
    return e == Ct || e == Tt || e == Et || e == jt
  }
  var It = $['__core-js_shared__'],
    A = It,
    W = (function () {
      var t = /[^.]+$/.exec((A && A.keys && A.keys.IE_PROTO) || '')
      return t ? 'Symbol(src)_1.' + t : ''
    })()
  function Mt(t) {
    return !!W && W in t
  }
  var At = Function.prototype,
    xt = At.toString
  function Nt(t) {
    if (t != null) {
      try {
        return xt.call(t)
      } catch {}
      try {
        return t + ''
      } catch {}
    }
    return ''
  }
  var zt = /[\\^$.*+?()[\]{}|]/g,
    Rt = /^\[object .+?Constructor\]$/,
    Gt = Function.prototype,
    Ht = Object.prototype,
    Dt = Gt.toString,
    Ft = Ht.hasOwnProperty,
    Jt = RegExp(
      '^' +
        Dt.call(Ft)
          .replace(zt, '\\$&')
          .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
        '$'
    )
  function Lt(t) {
    if (!K(t) || Mt(t)) return !1
    var e = $t(t) ? Jt : Rt
    return e.test(Nt(t))
  }
  function Vt(t, e) {
    return t == null ? void 0 : t[e]
  }
  function Y(t, e) {
    var n = Vt(t, e)
    return Lt(n) ? n : void 0
  }
  function Bt(t, e) {
    return t === e || (t !== t && e !== e)
  }
  var Ut = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    Xt = /^\w*$/
  function Kt(t, e) {
    if (M(t)) return !1
    var n = typeof t
    return n == 'number' || n == 'symbol' || n == 'boolean' || t == null || I(t)
      ? !0
      : Xt.test(t) || !Ut.test(t) || (e != null && t in Object(e))
  }
  var Wt = Y(Object, 'create'),
    b = Wt
  function Yt() {
    ;(this.__data__ = b ? b(null) : {}), (this.size = 0)
  }
  function Zt(t) {
    var e = this.has(t) && delete this.__data__[t]
    return (this.size -= e ? 1 : 0), e
  }
  var kt = '__lodash_hash_undefined__',
    qt = Object.prototype,
    Qt = qt.hasOwnProperty
  function te(t) {
    var e = this.__data__
    if (b) {
      var n = e[t]
      return n === kt ? void 0 : n
    }
    return Qt.call(e, t) ? e[t] : void 0
  }
  var ee = Object.prototype,
    ne = ee.hasOwnProperty
  function re(t) {
    var e = this.__data__
    return b ? e[t] !== void 0 : ne.call(e, t)
  }
  var oe = '__lodash_hash_undefined__'
  function ae(t, e) {
    var n = this.__data__
    return (this.size += this.has(t) ? 0 : 1), (n[t] = b && e === void 0 ? oe : e), this
  }
  function g(t) {
    var e = -1,
      n = t == null ? 0 : t.length
    for (this.clear(); ++e < n; ) {
      var r = t[e]
      this.set(r[0], r[1])
    }
  }
  ;(g.prototype.clear = Yt),
    (g.prototype.delete = Zt),
    (g.prototype.get = te),
    (g.prototype.has = re),
    (g.prototype.set = ae)
  function ie() {
    ;(this.__data__ = []), (this.size = 0)
  }
  function O(t, e) {
    for (var n = t.length; n--; ) if (Bt(t[n][0], e)) return n
    return -1
  }
  var se = Array.prototype,
    ce = se.splice
  function ue(t) {
    var e = this.__data__,
      n = O(e, t)
    if (n < 0) return !1
    var r = e.length - 1
    return n == r ? e.pop() : ce.call(e, n, 1), --this.size, !0
  }
  function fe(t) {
    var e = this.__data__,
      n = O(e, t)
    return n < 0 ? void 0 : e[n][1]
  }
  function le(t) {
    return O(this.__data__, t) > -1
  }
  function pe(t, e) {
    var n = this.__data__,
      r = O(n, t)
    return r < 0 ? (++this.size, n.push([t, e])) : (n[r][1] = e), this
  }
  function m(t) {
    var e = -1,
      n = t == null ? 0 : t.length
    for (this.clear(); ++e < n; ) {
      var r = t[e]
      this.set(r[0], r[1])
    }
  }
  ;(m.prototype.clear = ie),
    (m.prototype.delete = ue),
    (m.prototype.get = fe),
    (m.prototype.has = le),
    (m.prototype.set = pe)
  var he = Y($, 'Map'),
    de = he
  function ge() {
    ;(this.size = 0), (this.__data__ = { hash: new g(), map: new (de || m)(), string: new g() })
  }
  function ye(t) {
    var e = typeof t
    return e == 'string' || e == 'number' || e == 'symbol' || e == 'boolean' ? t !== '__proto__' : t === null
  }
  function P(t, e) {
    var n = t.__data__
    return ye(e) ? n[typeof e == 'string' ? 'string' : 'hash'] : n.map
  }
  function ve(t) {
    var e = P(this, t).delete(t)
    return (this.size -= e ? 1 : 0), e
  }
  function me(t) {
    return P(this, t).get(t)
  }
  function _e(t) {
    return P(this, t).has(t)
  }
  function be(t, e) {
    var n = P(this, t),
      r = n.size
    return n.set(t, e), (this.size += n.size == r ? 0 : 1), this
  }
  function y(t) {
    var e = -1,
      n = t == null ? 0 : t.length
    for (this.clear(); ++e < n; ) {
      var r = t[e]
      this.set(r[0], r[1])
    }
  }
  ;(y.prototype.clear = ge),
    (y.prototype.delete = ve),
    (y.prototype.get = me),
    (y.prototype.has = _e),
    (y.prototype.set = be)
  var Se = 'Expected a function'
  function x(t, e) {
    if (typeof t != 'function' || (e != null && typeof e != 'function')) throw new TypeError(Se)
    var n = function () {
      var r = arguments,
        c = e ? e.apply(this, r) : r[0],
        f = n.cache
      if (f.has(c)) return f.get(c)
      var u = t.apply(this, r)
      return (n.cache = f.set(c, u) || f), u
    }
    return (n.cache = new (x.Cache || y)()), n
  }
  x.Cache = y
  var we = 500
  function Oe(t) {
    var e = x(t, function (r) {
        return n.size === we && n.clear(), r
      }),
      n = e.cache
    return e
  }
  var Pe = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
    Ee = /\\(\\)?/g,
    Ce = Oe(function (t) {
      var e = []
      return (
        t.charCodeAt(0) === 46 && e.push(''),
        t.replace(Pe, function (n, r, c, f) {
          e.push(c ? f.replace(Ee, '$1') : r || n)
        }),
        e
      )
    }),
    Te = Ce
  function je(t) {
    return t == null ? '' : X(t)
  }
  function $e(t, e) {
    return M(t) ? t : Kt(t, e) ? [t] : Te(je(t))
  }
  var Ie = 1 / 0
  function Me(t) {
    if (typeof t == 'string' || I(t)) return t
    var e = t + ''
    return e == '0' && 1 / t == -Ie ? '-0' : e
  }
  function Ae(t, e) {
    e = $e(e, t)
    for (var n = 0, r = e.length; t != null && n < r; ) t = t[Me(e[n++])]
    return n && n == r ? t : void 0
  }
  function E(t, e, n) {
    var r = t == null ? void 0 : Ae(t, e)
    return r === void 0 ? n : r
  }
  function Z() {
    let t = []
    function e(u, a) {
      const i = u.find((o) => (o.profile ? E(window, o.profile).materials.some((s) => s.name === a) : !1))
      if (!i) throw new Error(`Component ${a} cannot found`)
      const d = E(window, `${i.profile}.library`)
      return E(window, `${d}.${a}`)
    }
    function n(u, a) {
      for (const i of u) {
        if (!i.profile) continue
        const d = E(window, i.profile)
        for (const o of d.materials) if (o.name === a) return o
      }
      throw new Error(`Material ${a} cannot found`)
    }
    async function r(u, a) {
      const i = []
      function d(o) {
        return new Promise((l, s) => {
          o.addEventListener('load', () => {
            l(void 0)
          }),
            o.addEventListener('error', () => {
              s()
            })
        })
      }
      for (const o of u)
        if (o.resources)
          for (const l of o.resources) {
            let s
            l.endsWith('.css')
              ? ((s = a.createElement('link')), (s.rel = l), a.head.append(s), i.push(d(s)))
              : ((s = a.createElement('script')), (s.src = l), a.body.append(s), await d(s))
          }
      await Promise.all(i)
    }
    function c(u) {
      return (t = JSON.parse(JSON.stringify(u))), t
    }
    function f() {
      return JSON.parse(JSON.stringify(t))
    }
    return { findComponent: e, findMaterial: n, loadResources: r, importAssets: c, exportAssets: f }
  }
  var N = Z()
  function k() {
    const t = []
    function e(f, u) {
      t.push({ event: f, listener: u, once: !1 })
    }
    function n(f, u) {
      t.push({ event: f, listener: u, once: !0 })
    }
    function r(f, u) {
      const a = t.findIndex((i) => i.event === f && i.listener === u)
      a !== -1 && t.splice(a, 1)
    }
    function c(f, ...u) {
      const a = []
      t.forEach((i) => {
        i.event === f && (i.listener(...u), i.once && a.push(i))
      }),
        a.forEach((i) => {
          r(i.event, i.listener)
        })
    }
    return { on: e, once: n, off: r, emit: c }
  }
  var z = k()
  function xe() {
    const t = [],
      e = [],
      n = { useSkeletonPlugin: r, useSelectorPlugin: c, exportSkeletonPlugins: f, exportSelectorPlugins: u }
    function r(a) {
      return t.some((i) => i.name === a.name)
        ? (console.warn('Skeleton plugins registered with the same name will be automatically ignored'), n)
        : (t.push(a), n)
    }
    function c(a) {
      return e.some((i) => i.name === a.name)
        ? (console.warn('Selector plugins registered with the same name will be automatically ignored'), n)
        : (e.push(a), n)
    }
    function f() {
      return t
    }
    function u() {
      return e
    }
    return n
  }
  var Ne = xe(),
    q = ((t) => ((t.SCHEMA_CHANGE = 'schema-change'), (t.ASSETS_CHANGE = 'assets-change'), t))(q || {})
  const ze = j.importSchema,
    Re = N.importAssets
  return (
    (j.importSchema = function (t) {
      const e = ze.call(this, t)
      return z.emit('schema-change', e), e
    }),
    (N.importAssets = function (t) {
      const e = Re.call(this, t)
      return z.emit('assets-change', e), e
    }),
    (h.BuiltInEvents = q),
    (h.BuiltInSchemaNodeBindingTypes = D),
    (h.BuiltInSchemaNodeNames = H),
    (h.assetsManager = N),
    (h.createAssetsManager = Z),
    (h.createEventManager = k),
    (h.createSchemaManager = F),
    (h.eventsManager = z),
    (h.pluginsManager = Ne),
    (h.schemaManager = j),
    Object.defineProperties(h, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: 'Module' } }),
    h
  )
})({})
