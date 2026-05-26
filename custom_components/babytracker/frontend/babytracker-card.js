/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const At = globalThis, Kt = At.ShadowRoot && (At.ShadyCSS === void 0 || At.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Yt = Symbol(), re = /* @__PURE__ */ new WeakMap();
let Me = class {
  constructor(e, i, n) {
    if (this._$cssResult$ = !0, n !== Yt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (Kt && e === void 0) {
      const n = i !== void 0 && i.length === 1;
      n && (e = re.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && re.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ye = (t) => new Me(typeof t == "string" ? t : t + "", void 0, Yt), F = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((n, r, o) => n + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[o + 1], t[0]);
  return new Me(i, t, Yt);
}, Ge = (t, e) => {
  if (Kt) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const n = document.createElement("style"), r = At.litNonce;
    r !== void 0 && n.setAttribute("nonce", r), n.textContent = i.cssText, t.appendChild(n);
  }
}, oe = Kt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const n of e.cssRules) i += n.cssText;
  return Ye(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Xe, defineProperty: Ze, getOwnPropertyDescriptor: Qe, getOwnPropertyNames: Je, getOwnPropertySymbols: ti, getPrototypeOf: ei } = Object, K = globalThis, se = K.trustedTypes, ii = se ? se.emptyScript : "", Ot = K.reactiveElementPolyfillSupport, ft = (t, e) => t, Et = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? ii : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, Gt = (t, e) => !Xe(t, e), ae = { attribute: !0, type: String, converter: Et, reflect: !1, useDefault: !1, hasChanged: Gt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), K.litPropertyMetadata ?? (K.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let ct = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = ae) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const n = Symbol(), r = this.getPropertyDescriptor(e, n, i);
      r !== void 0 && Ze(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, i, n) {
    const { get: r, set: o } = Qe(this.prototype, e) ?? { get() {
      return this[i];
    }, set(s) {
      this[i] = s;
    } };
    return { get: r, set(s) {
      const a = r == null ? void 0 : r.call(this);
      o == null || o.call(this, s), this.requestUpdate(e, a, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ae;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ft("elementProperties"))) return;
    const e = ei(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ft("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ft("properties"))) {
      const i = this.properties, n = [...Je(i), ...ti(i)];
      for (const r of n) this.createProperty(r, i[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [n, r] of i) this.elementProperties.set(n, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, n] of this.elementProperties) {
      const r = this._$Eu(i, n);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const r of n) i.unshift(oe(r));
    } else e !== void 0 && i.push(oe(e));
    return i;
  }
  static _$Eu(e, i) {
    const n = i.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((i) => this.enableUpdating = i), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((i) => i(this));
  }
  addController(e) {
    var i;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((i = e.hostConnected) == null || i.call(e));
  }
  removeController(e) {
    var i;
    (i = this._$EO) == null || i.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const n of i.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ge(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((i) => {
      var n;
      return (n = i.hostConnected) == null ? void 0 : n.call(i);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var n;
      return (n = i.hostDisconnected) == null ? void 0 : n.call(i);
    });
  }
  attributeChangedCallback(e, i, n) {
    this._$AK(e, n);
  }
  _$ET(e, i) {
    var o;
    const n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
    if (r !== void 0 && n.reflect === !0) {
      const s = (((o = n.converter) == null ? void 0 : o.toAttribute) !== void 0 ? n.converter : Et).toAttribute(i, n.type);
      this._$Em = e, s == null ? this.removeAttribute(r) : this.setAttribute(r, s), this._$Em = null;
    }
  }
  _$AK(e, i) {
    var o, s;
    const n = this.constructor, r = n._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const a = n.getPropertyOptions(r), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : Et;
      this._$Em = r;
      const c = l.fromAttribute(i, a.type);
      this[r] = c ?? ((s = this._$Ej) == null ? void 0 : s.get(r)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, i, n, r = !1, o) {
    var s;
    if (e !== void 0) {
      const a = this.constructor;
      if (r === !1 && (o = this[e]), n ?? (n = a.getPropertyOptions(e)), !((n.hasChanged ?? Gt)(o, i) || n.useDefault && n.reflect && o === ((s = this._$Ej) == null ? void 0 : s.get(e)) && !this.hasAttribute(a._$Eu(e, n)))) return;
      this.C(e, i, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: n, reflect: r, wrapped: o }, s) {
    n && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, s ?? i ?? this[e]), o !== !0 || s !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (i = void 0), this._$AL.set(e, i)), r === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var n;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [o, s] of this._$Ep) this[o] = s;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, s] of r) {
        const { wrapped: a } = s, l = this[o];
        a !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, s, l);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (n = this._$EO) == null || n.forEach((r) => {
        var o;
        return (o = r.hostUpdate) == null ? void 0 : o.call(r);
      }), this.update(i)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var i;
    (i = this._$EO) == null || i.forEach((n) => {
      var r;
      return (r = n.hostUpdated) == null ? void 0 : r.call(n);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
ct.elementStyles = [], ct.shadowRootOptions = { mode: "open" }, ct[ft("elementProperties")] = /* @__PURE__ */ new Map(), ct[ft("finalized")] = /* @__PURE__ */ new Map(), Ot == null || Ot({ ReactiveElement: ct }), (K.reactiveElementVersions ?? (K.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _t = globalThis, le = (t) => t, Pt = _t.trustedTypes, ce = Pt ? Pt.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Te = "$lit$", j = `lit$${Math.random().toFixed(9).slice(2)}$`, Ne = "?" + j, ni = `<${Ne}>`, nt = document, yt = () => nt.createComment(""), vt = (t) => t === null || typeof t != "object" && typeof t != "function", Xt = Array.isArray, ri = (t) => Xt(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Rt = `[ 	
\f\r]`, gt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, de = /-->/g, ue = />/g, tt = RegExp(`>|${Rt}(?:([^\\s"'>=/]+)(${Rt}*=${Rt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, he = /"/g, Oe = /^(?:script|style|textarea|title)$/i, Re = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), d = Re(1), z = Re(2), dt = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), be = /* @__PURE__ */ new WeakMap(), et = nt.createTreeWalker(nt, 129);
function Le(t, e) {
  if (!Xt(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ce !== void 0 ? ce.createHTML(e) : e;
}
const oi = (t, e) => {
  const i = t.length - 1, n = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", s = gt;
  for (let a = 0; a < i; a++) {
    const l = t[a];
    let c, h, u = -1, g = 0;
    for (; g < l.length && (s.lastIndex = g, h = s.exec(l), h !== null); ) g = s.lastIndex, s === gt ? h[1] === "!--" ? s = de : h[1] !== void 0 ? s = ue : h[2] !== void 0 ? (Oe.test(h[2]) && (r = RegExp("</" + h[2], "g")), s = tt) : h[3] !== void 0 && (s = tt) : s === tt ? h[0] === ">" ? (s = r ?? gt, u = -1) : h[1] === void 0 ? u = -2 : (u = s.lastIndex - h[2].length, c = h[1], s = h[3] === void 0 ? tt : h[3] === '"' ? he : pe) : s === he || s === pe ? s = tt : s === de || s === ue ? s = gt : (s = tt, r = void 0);
    const f = s === tt && t[a + 1].startsWith("/>") ? " " : "";
    o += s === gt ? l + ni : u >= 0 ? (n.push(c), l.slice(0, u) + Te + l.slice(u) + j + f) : l + j + (u === -2 ? a : f);
  }
  return [Le(t, o + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), n];
};
class $t {
  constructor({ strings: e, _$litType$: i }, n) {
    let r;
    this.parts = [];
    let o = 0, s = 0;
    const a = e.length - 1, l = this.parts, [c, h] = oi(e, i);
    if (this.el = $t.createElement(c, n), et.currentNode = this.el.content, i === 2 || i === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (r = et.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const u of r.getAttributeNames()) if (u.endsWith(Te)) {
          const g = h[s++], f = r.getAttribute(u).split(j), m = /([.?@])?(.*)/.exec(g);
          l.push({ type: 1, index: o, name: m[2], strings: f, ctor: m[1] === "." ? ai : m[1] === "?" ? li : m[1] === "@" ? ci : Tt }), r.removeAttribute(u);
        } else u.startsWith(j) && (l.push({ type: 6, index: o }), r.removeAttribute(u));
        if (Oe.test(r.tagName)) {
          const u = r.textContent.split(j), g = u.length - 1;
          if (g > 0) {
            r.textContent = Pt ? Pt.emptyScript : "";
            for (let f = 0; f < g; f++) r.append(u[f], yt()), et.nextNode(), l.push({ type: 2, index: ++o });
            r.append(u[g], yt());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Ne) l.push({ type: 2, index: o });
      else {
        let u = -1;
        for (; (u = r.data.indexOf(j, u + 1)) !== -1; ) l.push({ type: 7, index: o }), u += j.length - 1;
      }
      o++;
    }
  }
  static createElement(e, i) {
    const n = nt.createElement("template");
    return n.innerHTML = e, n;
  }
}
function ut(t, e, i = t, n) {
  var s, a;
  if (e === dt) return e;
  let r = n !== void 0 ? (s = i._$Co) == null ? void 0 : s[n] : i._$Cl;
  const o = vt(e) ? void 0 : e._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== o && ((a = r == null ? void 0 : r._$AO) == null || a.call(r, !1), o === void 0 ? r = void 0 : (r = new o(t), r._$AT(t, i, n)), n !== void 0 ? (i._$Co ?? (i._$Co = []))[n] = r : i._$Cl = r), r !== void 0 && (e = ut(t, r._$AS(t, e.values), r, n)), e;
}
class si {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: n } = this._$AD, r = ((e == null ? void 0 : e.creationScope) ?? nt).importNode(i, !0);
    et.currentNode = r;
    let o = et.nextNode(), s = 0, a = 0, l = n[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let c;
        l.type === 2 ? c = new kt(o, o.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, e) : l.type === 6 && (c = new di(o, this, e)), this._$AV.push(c), l = n[++a];
      }
      s !== (l == null ? void 0 : l.index) && (o = et.nextNode(), s++);
    }
    return et.currentNode = nt, r;
  }
  p(e) {
    let i = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, i), i += n.strings.length - 2) : n._$AI(e[i])), i++;
  }
}
class kt {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, i, n, r) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = n, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = ut(this, e, i), vt(e) ? e === A || e == null || e === "" ? (this._$AH !== A && this._$AR(), this._$AH = A) : e !== this._$AH && e !== dt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ri(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== A && vt(this._$AH) ? this._$AA.nextSibling.data = e : this.T(nt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var o;
    const { values: i, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = $t.createElement(Le(n.h, n.h[0]), this.options)), n);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === r) this._$AH.p(i);
    else {
      const s = new si(r, this), a = s.u(this.options);
      s.p(i), this.T(a), this._$AH = s;
    }
  }
  _$AC(e) {
    let i = be.get(e.strings);
    return i === void 0 && be.set(e.strings, i = new $t(e)), i;
  }
  k(e) {
    Xt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let n, r = 0;
    for (const o of e) r === i.length ? i.push(n = new kt(this.O(yt()), this.O(yt()), this, this.options)) : n = i[r], n._$AI(o), r++;
    r < i.length && (this._$AR(n && n._$AB.nextSibling, r), i.length = r);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, i); e !== this._$AB; ) {
      const r = le(e).nextSibling;
      le(e).remove(), e = r;
    }
  }
  setConnected(e) {
    var i;
    this._$AM === void 0 && (this._$Cv = e, (i = this._$AP) == null || i.call(this, e));
  }
}
class Tt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, n, r, o) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = e, this.name = i, this._$AM = r, this.options = o, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = A;
  }
  _$AI(e, i = this, n, r) {
    const o = this.strings;
    let s = !1;
    if (o === void 0) e = ut(this, e, i, 0), s = !vt(e) || e !== this._$AH && e !== dt, s && (this._$AH = e);
    else {
      const a = e;
      let l, c;
      for (e = o[0], l = 0; l < o.length - 1; l++) c = ut(this, a[n + l], i, l), c === dt && (c = this._$AH[l]), s || (s = !vt(c) || c !== this._$AH[l]), c === A ? e = A : e !== A && (e += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    s && !r && this.j(e);
  }
  j(e) {
    e === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ai extends Tt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === A ? void 0 : e;
  }
}
class li extends Tt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== A);
  }
}
class ci extends Tt {
  constructor(e, i, n, r, o) {
    super(e, i, n, r, o), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = ut(this, e, i, 0) ?? A) === dt) return;
    const n = this._$AH, r = e === A && n !== A || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, o = e !== A && (n === A || r);
    r && this.element.removeEventListener(this.name, this, n), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class di {
  constructor(e, i, n) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ut(this, e);
  }
}
const Lt = _t.litHtmlPolyfillSupport;
Lt == null || Lt($t, kt), (_t.litHtmlVersions ?? (_t.litHtmlVersions = [])).push("3.3.3");
const ui = (t, e, i) => {
  const n = (i == null ? void 0 : i.renderBefore) ?? e;
  let r = n._$litPart$;
  if (r === void 0) {
    const o = (i == null ? void 0 : i.renderBefore) ?? null;
    n._$litPart$ = r = new kt(e.insertBefore(yt(), o), o, void 0, i ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const it = globalThis;
class N extends ct {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var i;
    const e = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = e.firstChild), e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ui(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return dt;
  }
}
var Pe;
N._$litElement$ = !0, N.finalized = !0, (Pe = it.litElementHydrateSupport) == null || Pe.call(it, { LitElement: N });
const Ht = it.litElementPolyfillSupport;
Ht == null || Ht({ LitElement: N });
(it.litElementVersions ?? (it.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pi = { attribute: !0, type: String, converter: Et, reflect: !1, hasChanged: Gt }, hi = (t = pi, e, i) => {
  const { kind: n, metadata: r } = i;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), n === "setter" && ((t = Object.create(t)).wrapped = !0), o.set(i.name, t), n === "accessor") {
    const { name: s } = i;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(s, l, t, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(s, void 0, t, a), a;
    } };
  }
  if (n === "setter") {
    const { name: s } = i;
    return function(a) {
      const l = this[s];
      e.call(this, a), this.requestUpdate(s, l, t, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function M(t) {
  return (e, i) => typeof i == "object" ? hi(t, e, i) : ((n, r, o) => {
    const s = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, n), s ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function S(t) {
  return M({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const bi = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function He(t, e) {
  return (i, n, r) => {
    const o = (s) => {
      var a;
      return ((a = s.renderRoot) == null ? void 0 : a.querySelector(t)) ?? null;
    };
    return bi(i, n, { get() {
      return o(this);
    } });
  };
}
function D(t, e, i = "sensor") {
  return `${i}.babytracker_${t}_${e}`;
}
function Zt(t) {
  return typeof t != "string" || t.length === 0 ? "" : t.charAt(0).toUpperCase() + t.slice(1);
}
async function gi(t, e, i, n) {
  return t.callService(e, i, n);
}
function St(t, e, i, n) {
  const r = { cancelled: !1 }, o = async (s) => {
    if (!r.cancelled)
      try {
        const a = await t.connection.subscribeMessage(
          i,
          e
        );
        if (r.cancelled) {
          try {
            a();
          } catch {
          }
          return;
        }
        r.unsub = a;
      } catch (a) {
        if (console.warn(`babytracker: ${n} failed (attempt ${s + 1})`, a), r.cancelled) return;
        const l = Math.min(3e4, 1e3 * 2 ** s);
        r.timer = setTimeout(() => {
          r.timer = void 0, o(s + 1);
        }, l);
      }
  };
  return o(0), () => {
    var s;
    r.cancelled = !0, r.timer != null && (clearTimeout(r.timer), r.timer = void 0), (s = r.unsub) == null || s.call(r);
  };
}
function mi(t, e, i) {
  return St(
    t,
    { type: "babytracker/get_baby_config", baby: e, subscribe: !0 },
    i,
    "subscribeBabyConfig"
  );
}
function ze(t, e) {
  return St(
    t,
    { type: "babytracker/get_integration_options", subscribe: !0 },
    e,
    "subscribeIntegrationOptions"
  );
}
function fi(t, e, i, n, r) {
  return St(
    t,
    {
      type: "babytracker/list_entries_in_range",
      baby: e,
      start: i,
      end: n,
      subscribe: !0
    },
    r,
    "subscribeEntriesInRange"
  );
}
function _i(t, e, i) {
  return St(
    t,
    { type: "babytracker/list_vaccines", baby: e, subscribe: !0 },
    i,
    "subscribeVaccines"
  );
}
function yi(t, e, i) {
  return St(
    t,
    { type: "babytracker/list_growth", baby: e, subscribe: !0 },
    i,
    "subscribeGrowth"
  );
}
function vi(t, e, i, n) {
  if (!t)
    return d`
            <div
                class="section quick-log-loading"
                role="status"
                aria-live="polite"
                aria-label="Loading activities"
            >
                <span class="spinner" aria-hidden="true"></span>
                <span class="muted">Loading activities…</span>
            </div>
        `;
  const r = t.enabled_activities ?? [], o = t.enabled_feeding_methods ?? [], s = (c) => c.charAt(0).toUpperCase() + c.slice(1), a = Zt(t.name ?? e), l = [];
  if (r.includes("diaper") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log diaper for ${a}"
                    @click=${() => n("diaper")}
                >
                    Diaper
                </button>
            `
  ), r.includes("feeding"))
    for (const c of o)
      c === "bottle" ? l.push(
        d`
                        <button
                            class="quick"
                            aria-label="Log bottle feeding for ${a}"
                            @click=${() => n("bottle")}
                        >
                            Bottle
                        </button>
                    `
      ) : c === "solids" ? l.push(
        d`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${a}"
                            @click=${() => n("solids")}
                        >
                            Solids
                        </button>
                    `
      ) : (c === "breast_left" || c === "breast_right") && l.push(
        d`
                        <button
                            class="quick"
                            aria-label="Log ${c} feeding for ${a}"
                            @click=${() => n({ activity: "feeding", method: c })}
                        >
                            ${s(c.replace("_", " "))}
                        </button>
                    `
      );
  return r.includes("sleep") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log sleep for ${a}"
                    @click=${() => n({ activity: "sleep" })}
                >
                    Sleep
                </button>
            `
  ), r.includes("tummy_time") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log tummy time for ${a}"
                    @click=${() => n({ activity: "tummy_time" })}
                >
                    Tummy time
                </button>
            `
  ), r.includes("walk") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log walk for ${a}"
                    @click=${() => n({ activity: "walk" })}
                >
                    Walk
                </button>
            `
  ), r.includes("other") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log other activity for ${a}"
                    @click=${() => n("other")}
                >
                    Other
                </button>
            `
  ), d`
        <div class="section grid" role="group" aria-label="Quick log">
            ${l}
        </div>
    `;
}
const Mt = 29.5735, Ie = 24 * 60 * 60 * 1e3;
function I(t) {
  if (!t) return 0;
  const e = Date.parse(t);
  return Number.isNaN(e) ? 0 : e;
}
function $i(t, e = Ie, i = Date.now()) {
  const n = i - e;
  return t.filter((r) => I(r.timestamp) >= n).slice().sort((r, o) => I(o.timestamp) - I(r.timestamp));
}
function wi(t, e = Date.now(), i = Ie) {
  var c, h, u;
  const n = e - i;
  let r = 0, o = 0, s = 0, a = 0, l = 0;
  for (const g of t) {
    const f = I(g.timestamp);
    if (g.type === "sleep") {
      const m = f, v = g.ended_at != null && g.ended_at !== "" ? I(g.ended_at) : e;
      if (m > 0 && v > m && v > n) {
        const b = Math.max(m, n), w = Math.min(v, e);
        w > b && (l += (w - b) / 6e4);
      }
      continue;
    }
    if (!(f < n)) {
      if (g.type === "feeding") {
        r += 1;
        const m = Number(((c = g.data) == null ? void 0 : c.amount) ?? 0), v = String(((h = g.data) == null ? void 0 : h.unit) ?? "");
        m > 0 && (a += v === "oz" ? m * Mt : m);
      } else if (g.type === "diaper") {
        const m = String(((u = g.data) == null ? void 0 : u.kind) ?? "");
        m === "wet" ? o += 1 : m === "dirty" ? s += 1 : m === "both" && (o += 1, s += 1);
      }
    }
  }
  return { feedings: r, wetDiapers: o, dirtyDiapers: s, totalVolumeMl: a, sleepMinutes: l };
}
function mt(t, e, i) {
  if (t <= 0) return 0;
  const n = e != null && e !== "" ? I(e) : i;
  return n <= t ? 0 : (n - t) / 6e4;
}
function jt(t, e, i = Date.now()) {
  return mt(I(t), e, i);
}
function xi(t, e = Date.now()) {
  const i = {
    diapers: 0,
    wet: 0,
    dirty: 0,
    sleepMinutes: 0,
    longestSleepMinutes: 0,
    bottleFeeds: 0,
    bottleVolumeMl: 0,
    nursingMinutes: 0,
    nursingLeftMinutes: 0,
    nursingRightMinutes: 0,
    pumpingMl: 0,
    solidsCount: 0,
    tummyMinutes: 0,
    walkCount: 0,
    walkMinutes: 0,
    medCount: 0,
    vaccineCount: 0
  };
  for (const n of t) {
    const r = I(n.timestamp), o = n.data ?? {};
    switch (n.type) {
      case "diaper": {
        const s = String(o.kind ?? "");
        s === "wet" ? (i.diapers += 1, i.wet += 1) : s === "dirty" ? (i.diapers += 1, i.dirty += 1) : s === "both" && (i.diapers += 1, i.wet += 1, i.dirty += 1);
        break;
      }
      case "sleep": {
        const s = mt(r, n.ended_at, e);
        i.sleepMinutes += s, s > i.longestSleepMinutes && (i.longestSleepMinutes = s);
        break;
      }
      case "feeding": {
        const s = String(o.method ?? "");
        if (s === "bottle") {
          i.bottleFeeds += 1;
          const a = Number(o.amount ?? 0), l = String(o.unit ?? "");
          a > 0 && (i.bottleVolumeMl += l === "oz" ? a * Mt : a);
        } else if (s === "breast_left" || s === "breast_right") {
          const a = mt(r, n.ended_at, e);
          i.nursingMinutes += a, s === "breast_left" ? i.nursingLeftMinutes += a : i.nursingRightMinutes += a;
        } else s === "solids" && (i.solidsCount += 1);
        break;
      }
      case "pumping": {
        const s = Number(o.volume ?? 0), a = String(o.unit ?? "");
        s > 0 && (i.pumpingMl += a === "oz" ? s * Mt : s);
        break;
      }
      case "tummy_time": {
        i.tummyMinutes += mt(r, n.ended_at, e);
        break;
      }
      case "walk": {
        i.walkCount += 1, i.walkMinutes += mt(r, n.ended_at, e);
        break;
      }
      case "medication": {
        i.medCount += 1;
        break;
      }
      case "vaccine": {
        i.vaccineCount += 1;
        break;
      }
    }
  }
  return i;
}
function ki(t, e = Date.now()) {
  let i = null;
  for (const n of t) {
    if ((n == null ? void 0 : n.type) !== "sleep" || !(n != null && n.ended_at)) continue;
    const r = Date.parse(n.ended_at);
    Number.isFinite(r) && (i === null || r > i) && (i = r);
  }
  return i === null ? null : Math.max(0, (e - i) / 6e4);
}
function O(t) {
  if (!Number.isFinite(t) || t <= 0) return "0m";
  if (t < 60) return `${Math.round(t)}m`;
  const e = Math.floor(t / 60), i = Math.round(t % 60);
  return i === 0 ? `${e}h` : `${e}h ${i}m`;
}
function Wt(t) {
  if (!Number.isFinite(t) || t <= 0) return "0 oz";
  const e = t / Mt;
  return e >= 1 ? `${e.toFixed(1)} oz` : `${Math.round(t)} ml`;
}
function Si(t) {
  const e = String((t == null ? void 0 : t.type) ?? ""), i = (t == null ? void 0 : t.data) ?? {};
  if (e === "other") {
    const s = String(i.name ?? "").trim();
    return ge(s || zt(e));
  }
  const n = i.method ?? i.kind, r = n != null && n !== "" ? zt(String(n)) : null, o = ge(zt(e));
  return r ? e === "feeding" && i.amount != null && i.amount !== "" && i.unit ? `${o} (${r}, ${i.amount} ${i.unit})` : `${o} (${r})` : o;
}
function zt(t) {
  return t.replace(/_/g, " ");
}
function ge(t) {
  return t && t.charAt(0).toUpperCase() + t.slice(1);
}
function me(t) {
  const e = I(t);
  return e === 0 ? "" : new Date(e).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function Ci(t, e, i) {
  var l, c, h, u, g, f;
  const n = ((l = t.states[D(e, "sleeping", "binary_sensor")]) == null ? void 0 : l.state) === "on", r = ((c = t.states[D(e, "feeding", "binary_sensor")]) == null ? void 0 : c.state) === "on", o = ((h = t.states[D(e, "tummy_time", "binary_sensor")]) == null ? void 0 : h.state) === "on", s = ((u = t.states[D(e, "walking", "binary_sensor")]) == null ? void 0 : u.state) === "on";
  if (!n && !r && !o && !s) return "";
  const a = [];
  if (n) {
    const m = (g = t.states[D(e, "last_sleep_start")]) == null ? void 0 : g.state, v = m ? jt(m, null) : 0;
    a.push(
      d`
                <div class="chip warning" role="status">
                    Sleeping${m ? d` · started ${fe(m)} ·
                          ${O(v)}` : ""}
                    <button
                        aria-label="End sleep"
                        @click=${(b) => i("end_sleep", { baby: e }, b.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  if (r && a.push(
    d`
                <div class="chip warning" role="status">
                    Feeding
                    <button
                        aria-label="End feeding"
                        @click=${(m) => i("end_feeding", { baby: e }, m.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), o && a.push(
    d`
                <div class="chip warning" role="status">
                    Tummy time
                    <button
                        aria-label="End tummy time"
                        @click=${(m) => i("end_tummy_time", { baby: e }, m.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), s) {
    const m = (f = t.states[D(e, "last_walk_start")]) == null ? void 0 : f.state;
    a.push(
      d`
                <div class="chip warning" role="status">
                    Walking ${m ? d`· started ${fe(m)}` : ""}
                    <button
                        aria-label="End walk"
                        @click=${(v) => i("end_walk", { baby: e }, v.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  return d`<div class="section">${a}</div>`;
}
function fe(t) {
  if (!t) return "";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "" : new Date(e).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
var Ai = Object.defineProperty, Di = Object.getOwnPropertyDescriptor, ot = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? Di(e, i) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (r = (n ? s(e, i, r) : s(r)) || r);
  return n && r && Ai(e, i, r), r;
};
let U = class extends N {
  constructor() {
    super(...arguments), this.photoPath = "", this.size = 128, this._url = "", this._failed = !1, this._open = !1, this._lastResolved = "", this._resolveToken = 0, this._onKeydown = (t) => {
      t.key === "Escape" && (t.preventDefault(), this._close_lightbox());
    }, this._open_lightbox = (t) => {
      t.preventDefault(), t.stopPropagation(), !(!this._url || this._open) && (this._open = !0, this._attachKeyHandler());
    }, this._close_lightbox = (t) => {
      t && (t.preventDefault(), t.stopPropagation()), this._open && (this._open = !1, this._detachKeyHandler());
    }, this._onImgError = () => {
      console.warn(
        "babytracker: thumbnail img failed to load",
        this.photoPath,
        this._url
      ), this._failed = !0;
    };
  }
  updated(t) {
    (t.has("hass") || t.has("photoPath")) && this._maybeResolve();
  }
  disconnectedCallback() {
    this._detachKeyHandler(), super.disconnectedCallback();
  }
  async _maybeResolve() {
    var e;
    if (!((e = this.hass) != null && e.connection) || !this.photoPath || this._lastResolved === this.photoPath && this._url) return;
    this._lastResolved = this.photoPath;
    const t = ++this._resolveToken;
    try {
      const i = await this.hass.callWS({
        type: "media_source/resolve_media",
        media_content_id: this.photoPath
      });
      if (t !== this._resolveToken) return;
      const n = i == null ? void 0 : i.url;
      typeof n == "string" && n.length > 0 ? (this._url = n, this._failed = !1) : (console.warn(
        "babytracker: resolve photo returned no url",
        this.photoPath,
        i
      ), this._failed = !0);
    } catch (i) {
      if (t !== this._resolveToken) return;
      console.warn(
        "babytracker: resolve photo failed",
        this.photoPath,
        i
      ), this._failed = !0;
    }
  }
  _attachKeyHandler() {
    window.addEventListener("keydown", this._onKeydown);
  }
  _detachKeyHandler() {
    window.removeEventListener("keydown", this._onKeydown);
  }
  render() {
    if (!this.photoPath) return d``;
    if (this._failed || !this._url)
      return d`<span aria-label="Has photo">📷</span>`;
    const t = `${this.size}px`;
    return d`
            <button
                class="thumb-btn"
                type="button"
                aria-label="View photo"
                title="View photo"
                @click=${this._open_lightbox}
            >
                <img
                    class="thumb"
                    src=${this._url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style="max-width:${t};max-height:${t}"
                    @error=${this._onImgError}
                />
            </button>
            ${this._open ? d`
                      <div
                          class="lightbox"
                          role="dialog"
                          aria-modal="true"
                          aria-label="Entry photo"
                          @click=${this._close_lightbox}
                      >
                          <button
                              type="button"
                              class="close"
                              aria-label="Close photo viewer"
                              @click=${this._close_lightbox}
                          >
                              ✕
                          </button>
                          <img
                              class="full"
                              src=${this._url}
                              alt="Entry photo"
                              @click=${(e) => e.stopPropagation()}
                          />
                      </div>
                  ` : ""}
        `;
  }
};
U.styles = F`
        :host {
            display: inline-flex;
            align-items: center;
        }
        .thumb-btn {
            padding: 0;
            border: 0;
            background: none;
            cursor: zoom-in;
            line-height: 0;
        }
        .thumb {
            /* max-width/max-height come from an inline style attribute
             * so each instance can pick its own bounding box without a
             * CSS variable. Aspect ratio is preserved by leaving both
             * width and height intrinsic. */
            display: block;
            border-radius: 4px;
            border: 1px solid var(--divider-color);
            vertical-align: middle;
        }
        .lightbox {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.88);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: zoom-out;
        }
        .full {
            max-width: 92vw;
            max-height: 90vh;
            cursor: default;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.55);
        }
        .close {
            position: fixed;
            top: 16px;
            right: 16px;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            font-size: 1.1rem;
            cursor: pointer;
        }
    `;
ot([
  M({ attribute: !1 })
], U.prototype, "hass", 2);
ot([
  M()
], U.prototype, "photoPath", 2);
ot([
  M({ type: Number })
], U.prototype, "size", 2);
ot([
  S()
], U.prototype, "_url", 2);
ot([
  S()
], U.prototype, "_failed", 2);
ot([
  S()
], U.prototype, "_open", 2);
U = ot([
  G("bt-entry-thumbnail")
], U);
const Ei = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk",
  "other"
]);
function Ue(t, e, i, n, r) {
  return d`
        <li
            class="clickable"
            role="button"
            tabindex="0"
            aria-label="Edit entry"
            @click=${() => i(e)}
            @keydown=${(o) => {
    (o.key === "Enter" || o.key === " ") && (o.preventDefault(), i(e));
  }}
        >
            <div class="entry-row">
                <span aria-label="Entry type">${Si(e)}</span>
                ${Pi(e)}
                ${e.staff ? d`<span
                          class="muted"
                          aria-label="Logged by Procare staff"
                          >via ${e.staff}</span
                      >` : ""}
            </div>
            ${e.notes ? d`<div
                      class="entry-notes muted ${n.has(e.id) ? "expanded" : ""}"
                      role="button"
                      tabindex="0"
                      aria-label="Toggle notes"
                      aria-expanded=${n.has(e.id) ? "true" : "false"}
                      title=${e.notes}
                      @click=${(o) => {
    o.stopPropagation(), r(e.id);
  }}
                      @keydown=${(o) => {
    (o.key === "Enter" || o.key === " ") && (o.preventDefault(), o.stopPropagation(), r(e.id));
  }}
                  >${e.notes}</div>` : ""}
            ${e.photo_path ? d`<div class="entry-photo">
                      <bt-entry-thumbnail
                          .hass=${t}
                          .photoPath=${e.photo_path}
                      ></bt-entry-thumbnail>
                  </div>` : ""}
        </li>
    `;
}
function Pi(t) {
  const e = me(t.timestamp), i = t.type === "sleep", n = Ei.has(String(t.type ?? ""));
  if (i && (!t.ended_at || t.ended_at === t.timestamp)) {
    const r = jt(t.timestamp, t.ended_at);
    return d`<span class="muted"
            >${e} (${O(r)}, ongoing)</span
        >`;
  }
  if (n && t.ended_at && t.ended_at !== t.timestamp) {
    const r = me(t.ended_at);
    if (i) {
      const o = jt(
        t.timestamp,
        t.ended_at
      );
      return d`<span class="muted"
                >${e} – ${r} (${O(o)})</span
            >`;
    }
    return d`<span class="muted">${e} – ${r}</span>`;
  }
  return d`<span class="muted">${e}</span>`;
}
function Mi(t, e, i, n, r = /* @__PURE__ */ new Set(), o = () => {
}) {
  var c;
  const s = t.states[D(e, "recent_entries")], a = ((c = s == null ? void 0 : s.attributes) == null ? void 0 : c.entries) ?? [], l = $i(a).slice(0, Math.min(n, 120));
  return d`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${l.length === 0 ? d`<p>Nothing logged yet.</p>` : d`
                      <ul class="entries">
                          ${l.map(
    (h) => Ue(
      t,
      h,
      i,
      r,
      o
    )
  )}
                      </ul>
                  `}
        </div>
    `;
}
var Ti = Object.defineProperty, Ni = Object.getOwnPropertyDescriptor, Nt = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? Ni(e, i) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (r = (n ? s(e, i, r) : s(r)) || r);
  return n && r && Ti(e, i, r), r;
};
let pt = class extends N {
  constructor() {
    super(...arguments), this.label = "", this.renderChart = null, this._open = !1, this._onKeydown = (t) => {
      t.key === "Escape" && (t.preventDefault(), this._close());
    }, this._openLb = (t) => {
      t.preventDefault(), t.stopPropagation(), !(this._open || !this.renderChart) && (this._open = !0, this._attachKeyHandler());
    }, this._close = (t) => {
      t && (t.preventDefault(), t.stopPropagation()), this._open && (this._open = !1, this._detachKeyHandler());
    }, this._onKeydownActivate = (t) => {
      (t.key === "Enter" || t.key === " ") && this._openLb(t);
    };
  }
  disconnectedCallback() {
    this._detachKeyHandler(), super.disconnectedCallback();
  }
  _attachKeyHandler() {
    window.addEventListener("keydown", this._onKeydown);
  }
  _detachKeyHandler() {
    window.removeEventListener("keydown", this._onKeydown);
  }
  render() {
    var e, i;
    const t = (e = this.renderChart) == null ? void 0 : e.call(this);
    return d`
            <div
                class="surface"
                role="button"
                tabindex="0"
                aria-label=${`Expand ${this.label}`}
                @click=${this._openLb}
                @keydown=${this._onKeydownActivate}
            >
                ${t}
                <span class="hint" aria-hidden="true">⛶</span>
            </div>
            ${this._open ? d`
                      <div
                          class="lightbox"
                          role="dialog"
                          aria-modal="true"
                          aria-label=${this.label}
                          @click=${this._close}
                      >
                          <div
                              class="lightbox-card"
                              @click=${(n) => n.stopPropagation()}
                          >
                              <div class="lightbox-head">
                                  <div class="lightbox-title">
                                      ${this.label}
                                  </div>
                                  <button
                                      type="button"
                                      class="close"
                                      aria-label="Close"
                                      @click=${this._close}
                                  >
                                      ✕
                                  </button>
                              </div>
                              <div class="lightbox-body">
                                  ${(i = this.renderChart) == null ? void 0 : i.call(this)}
                              </div>
                          </div>
                      </div>
                  ` : ""}
        `;
  }
};
pt.styles = F`
        :host {
            display: block;
        }
        .surface {
            position: relative;
            cursor: zoom-in;
            border-radius: 4px;
        }
        .surface:hover .hint,
        .surface:focus-visible .hint {
            opacity: 1;
        }
        .surface:focus-visible {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        .hint {
            position: absolute;
            top: 2px;
            right: 4px;
            font-size: 0.85rem;
            color: var(--secondary-text-color);
            opacity: 0;
            transition: opacity 120ms ease-in-out;
            pointer-events: none;
        }
        .lightbox {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.88);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: zoom-out;
            padding: 16px;
        }
        .lightbox-card {
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color);
            padding: 16px;
            border-radius: 12px;
            max-width: 96vw;
            max-height: 92vh;
            overflow: auto;
            cursor: default;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: min(900px, 96vw);
        }
        .lightbox-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        .lightbox-title {
            font-weight: 600;
            font-size: 1rem;
        }
        .close {
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color);
            border-radius: 50%;
            width: 32px;
            height: 32px;
            font-size: 0.95rem;
            cursor: pointer;
        }
        .lightbox-body {
            /* Charts already render at width:100% inside their wrappers;
             * giving the body a generous min-height lets a 90 px chart
             * grow proportionally so it's not lost in the dialog. */
            min-height: min(60vh, 480px);
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .lightbox-body :is(svg) {
            height: auto;
            max-height: 70vh;
        }
    `;
Nt([
  M()
], pt.prototype, "label", 2);
Nt([
  M({ attribute: !1 })
], pt.prototype, "renderChart", 2);
Nt([
  S()
], pt.prototype, "_open", 2);
pt = Nt([
  G("bt-chart-lightbox")
], pt);
const _e = [
  { key: "weight", label: "Weight", color: "var(--primary-color, #2563eb)" },
  { key: "height", label: "Height", color: "var(--success-color, #16a34a)" },
  { key: "head", label: "Head", color: "var(--warning-color, #ea580c)" }
];
function Oi(t, e) {
  const i = (t == null ? void 0 : t.data) ?? {}, n = e === "weight" ? i.weight_percentile : e === "height" ? i.height_percentile : i.head_percentile;
  if (n == null) return null;
  const r = Number(n);
  return Number.isFinite(r) ? r : null;
}
function It(t) {
  if (t == null) return "—";
  const e = typeof t == "number" ? t : Number(t);
  return Number.isFinite(e) ? String(Math.round(e * 100) / 100) : String(t);
}
function Ut(t) {
  if (t == null || t === "—") return "—";
  const e = typeof t == "number" ? t : Number(t);
  return Number.isFinite(e) ? `p${Math.round(e)}` : String(t);
}
function Ri(t) {
  if (!t) return "";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "" : new Date(e).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function Be(t, e, i, n, r, o, s, a) {
  var _, k, E, C, P, q;
  const l = (o == null ? void 0 : o.data) ?? {}, c = (n == null ? void 0 : n.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", h = (n == null ? void 0 : n.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", u = l.weight_unit ?? c, g = l.length_unit ?? h, f = l.weight ?? ((_ = t.states[D(e, "weight")]) == null ? void 0 : _.state), m = l.height ?? ((k = t.states[D(e, "height")]) == null ? void 0 : k.state), v = l.head_circumference ?? ((E = t.states[D(e, "head_circumference")]) == null ? void 0 : E.state), b = l.weight_percentile ?? ((C = t.states[D(e, "weight_percentile")]) == null ? void 0 : C.state), w = l.height_percentile ?? ((P = t.states[D(e, "height_percentile")]) == null ? void 0 : P.state), $ = l.head_percentile ?? ((q = t.states[D(e, "head_circumference_percentile")]) == null ? void 0 : q.state), x = Ri(o == null ? void 0 : o.timestamp), y = !!(o && s), p = y ? () => s(o) : void 0;
  return d`
        <div class="section" role="region" aria-label="Growth">
            <div
                style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"
            >
                <h2 style="margin:0;">Growth</h2>
                <span style="flex:1;"></span>
                ${r ? d`<button
                          type="button"
                          class="primary"
                          aria-label="Log a growth measurement"
                          @click=${r}
                      >
                          Log measurement
                      </button>` : ""}
            </div>
            <div
                class=${y ? "growth-summary clickable" : "growth-summary"}
                role=${y ? "button" : "group"}
                tabindex=${y ? "0" : "-1"}
                aria-label=${y ? "Edit latest growth measurement" : "Latest growth measurement"}
                @click=${p}
                @keydown=${y ? (lt) => {
    (lt.key === "Enter" || lt.key === " ") && (lt.preventDefault(), p == null || p());
  } : void 0}
            >
                ${x ? d`<div class="growth-date muted">
                          Measured ${x}
                      </div>` : ""}
                <div class="growth-grid">
                    <div>
                        <div class="label">Weight</div>
                        <div>${It(f)} ${u} · ${Ut(b)}</div>
                    </div>
                    <div>
                        <div class="label">Height</div>
                        <div>${It(m)} ${g} · ${Ut(w)}</div>
                    </div>
                    <div>
                        <div class="label">Head</div>
                        <div>${It(v)} ${g} · ${Ut($)}</div>
                    </div>
                </div>
            </div>
            ${Li(a)}
        </div>
    `;
}
function Li(t) {
  return ye(t) === "" ? "" : d`
        <bt-chart-lightbox
            label="Percentile over time"
            .renderChart=${() => ye(t)}
        ></bt-chart-lightbox>
    `;
}
function ye(t) {
  if (!Array.isArray(t) || t.length < 2) return "";
  const e = [...t].filter((y) => Number.isFinite(Date.parse(y == null ? void 0 : y.timestamp))).sort((y, p) => Date.parse(y.timestamp) - Date.parse(p.timestamp));
  if (e.length < 2) return "";
  const i = Date.parse(e[0].timestamp), n = Date.parse(e[e.length - 1].timestamp), r = Math.max(1, n - i), o = 320, s = 140, a = 22, l = 8, c = 8, h = 20, u = o - a - l, g = s - c - h, f = (y) => a + (y - i) / r * u, m = (y) => c + (1 - y / 100) * g, v = _e.map((y) => ({
    ...y,
    points: e.map((p) => {
      const _ = Oi(p, y.key);
      return _ === null ? null : { ts: Date.parse(p.timestamp), p: _ };
    }).filter((p) => p !== null)
  }));
  if (v.reduce(
    (y, p) => y + p.points.length,
    0
  ) < 2) return "";
  const w = Bt(e[0].timestamp), $ = Bt(e[e.length - 1].timestamp), x = [10, 50, 90];
  return d`
        <div class="growth-trend">
            <div class="label-row">
                <div class="label">Percentile over time</div>
                <div class="legend">
                    ${_e.map(
    (y) => d`
                            <span class="legend-item">
                                <span
                                    class="swatch"
                                    style=${`background:${y.color}`}
                                ></span>
                                ${y.label}
                            </span>
                        `
  )}
                </div>
            </div>
            <svg
                viewBox="0 0 ${o} ${s}"
                role="img"
                aria-label="Percentile over time"
                style="width:100%;height:${s}px;"
            >
                ${x.map(
    (y) => z`
                        <line
                            x1=${a}
                            x2=${o - l}
                            y1=${m(y)}
                            y2=${m(y)}
                            stroke="var(--divider-color, #888)"
                            stroke-dasharray=${y === 50 ? "" : "2 2"}
                            stroke-width="1"
                        ></line>
                        <text
                            x=${a - 4}
                            y=${m(y) + 3}
                            font-size="8"
                            text-anchor="end"
                            fill="var(--secondary-text-color)"
                        >
                            p${y}
                        </text>
                    `
  )}
                ${v.map((y) => {
    if (y.points.length === 0) return z``;
    const p = y.points.map(
      (_, k) => `${k === 0 ? "M" : "L"}${f(_.ts).toFixed(1)},${m(_.p).toFixed(1)}`
    ).join(" ");
    return z`
                        ${y.points.length > 1 ? z`<path
                                d=${p}
                                fill="none"
                                stroke=${y.color}
                                stroke-width="1.6"
                                stroke-linejoin="round"
                                stroke-linecap="round"
                              ></path>` : ""}
                        ${y.points.map(
      (_) => z`
                                <circle
                                    cx=${f(_.ts)}
                                    cy=${m(_.p)}
                                    r="2.5"
                                    fill=${y.color}
                                >
                                    <title>${y.label} ${Bt(new Date(_.ts).toISOString())}: p${Math.round(_.p)}</title>
                                </circle>
                            `
    )}
                    `;
  })}
                <text
                    x=${a}
                    y=${s - 4}
                    font-size="9"
                    fill="var(--secondary-text-color)"
                >
                    ${w}
                </text>
                <text
                    x=${o - l}
                    y=${s - 4}
                    font-size="9"
                    text-anchor="end"
                    fill="var(--secondary-text-color)"
                >
                    ${$}
                </text>
            </svg>
        </div>
    `;
}
function Bt(t) {
  if (!t) return "";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "" : new Date(e).toLocaleDateString([], {
    month: "short",
    day: "numeric"
  });
}
function Ve(t, e) {
  return d`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var l;
    const n = /* @__PURE__ */ new Date(), r = new Date(n.getTime() - 90 * 864e5), o = (c) => c.toISOString().slice(0, 10), s = await t.callService(
      "babytracker",
      "export_report",
      { baby: e, format: "html", start: o(r), end: o(n) },
      void 0,
      !1,
      !0
      // return_response
    ), a = (l = s == null ? void 0 : s.response) == null ? void 0 : l.url;
    a && window.open(a, "_blank", "noopener");
  }}
            >
                Export for pediatrician
            </button>
        </div>
    `;
}
function Hi(t, e, i) {
  var n;
  return (n = t == null ? void 0 : t.importer) != null && n.source_entity_id ? d`
        <div class="section">
            <button
                aria-label="Resync importers"
                title="Re-read the source sensor's current activities. Already-imported activities are skipped."
                @click=${(r) => i("resync_importers", { baby: e }, r.currentTarget)}
            >
                Sync importers
            </button>
        </div>
    ` : "";
}
function zi(t, e, i) {
  var s, a;
  const n = (s = t.states) == null ? void 0 : s[D(e, "recent_entries")], r = ((a = n == null ? void 0 : n.attributes) == null ? void 0 : a.entries) ?? [], o = wi(r);
  return d`
        <div class="chip" role="listitem">
            ${Wt(o.totalVolumeMl)} consumed
        </div>
        <div class="chip" role="listitem">
            ${o.wetDiapers} wet and ${o.dirtyDiapers} dirty
        </div>
    `;
}
function ve() {
  const t = window;
  return !!(t.SpeechRecognition || t.webkitSpeechRecognition);
}
function Ii(t) {
  var e;
  return !!(t != null && t.connection && typeof navigator < "u" && ((e = navigator.mediaDevices) != null && e.getUserMedia) && window.AudioWorkletNode);
}
async function Ui() {
  const t = window, e = t.SpeechRecognition || t.webkitSpeechRecognition;
  if (!e) throw new Error("SpeechRecognition not supported");
  const i = new e();
  i.continuous = !1, i.interimResults = !1, i.lang = navigator.language || "en-US";
  let n = () => {
  }, r = () => {
  };
  const o = new Promise((a, l) => {
    n = a, r = l;
  });
  let s = !1;
  return i.onresult = (a) => {
    if (s) return;
    s = !0;
    const l = Array.from(a.results).map((c) => {
      var h;
      return ((h = c[0]) == null ? void 0 : h.transcript) ?? "";
    }).join(" ").trim();
    n({ text: l });
  }, i.onerror = (a) => {
    s || (s = !0, r(new Error((a == null ? void 0 : a.error) ?? "speech-recognition error")));
  }, i.onend = () => {
    s || (s = !0, n({ text: "" }));
  }, i.start(), {
    stop: async () => {
      try {
        i.stop();
      } catch {
      }
      return o;
    },
    abort: () => {
      try {
        i.abort();
      } catch {
      }
    }
  };
}
const Bi = `
class PcmWorklet extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input[0] && input[0].length) {
      const samples = input[0];
      const pcm = new Int16Array(samples.length);
      for (let i = 0; i < samples.length; i++) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      this.port.postMessage(pcm.buffer, [pcm.buffer]);
    }
    return true;
  }
}
registerProcessor("bt-pcm-worklet", PcmWorklet);
`;
async function Vi(t) {
  const e = await navigator.mediaDevices.getUserMedia({ audio: !0 }), i = window.AudioContext || window.webkitAudioContext, n = new i({ sampleRate: 16e3 }), r = URL.createObjectURL(
    new Blob([Bi], { type: "text/javascript" })
  );
  try {
    await n.audioWorklet.addModule(r);
  } finally {
    URL.revokeObjectURL(r);
  }
  const o = n.createMediaStreamSource(e), s = new AudioWorkletNode(n, "bt-pcm-worklet");
  o.connect(s);
  let a, l, c = () => {
  }, h = () => {
  };
  const u = new Promise((b, w) => {
    c = b, h = w;
  });
  let g = !1;
  const f = () => {
    try {
      s.port.onmessage = null;
    } catch {
    }
    try {
      s.disconnect();
    } catch {
    }
    try {
      o.disconnect();
    } catch {
    }
    try {
      e.getTracks().forEach((b) => b.stop());
    } catch {
    }
    try {
      n.close();
    } catch {
    }
    try {
      l == null || l();
    } catch {
    }
  }, m = (b) => {
    g || (g = !0, f(), c({ text: b }));
  }, v = (b) => {
    g || (g = !0, f(), h(b));
  };
  try {
    l = await t.connection.subscribeMessage(
      (b) => {
        var $, x, y, p, _;
        const w = b == null ? void 0 : b.type;
        if (w === "run-start")
          a = (x = ($ = b == null ? void 0 : b.data) == null ? void 0 : $.runner_data) == null ? void 0 : x.stt_binary_handler_id, s.port.onmessage = (k) => {
            var P;
            if (a == null || g) return;
            const E = new Uint8Array(k.data), C = new Uint8Array(E.length + 1);
            C[0] = a, C.set(E, 1);
            try {
              (P = t.connection.socket) == null || P.send(C);
            } catch {
            }
          };
        else if (w === "stt-end") {
          const k = ((p = (y = b == null ? void 0 : b.data) == null ? void 0 : y.stt_output) == null ? void 0 : p.text) ?? "";
          m(k);
        } else w === "error" && v(
          new Error(
            ((_ = b == null ? void 0 : b.data) == null ? void 0 : _.message) ?? "assist_pipeline error"
          )
        );
      },
      {
        type: "assist_pipeline/run",
        start_stage: "stt",
        end_stage: "stt",
        input: { sample_rate: 16e3 }
      }
    );
  } catch (b) {
    throw f(), b;
  }
  return {
    stop: async () => {
      var b;
      if (a == null && !g)
        return m(""), u;
      if (a != null && !g)
        try {
          (b = t.connection.socket) == null || b.send(new Uint8Array([a]));
        } catch {
        }
      try {
        s.port.onmessage = null;
      } catch {
      }
      try {
        e.getTracks().forEach((w) => w.stop());
      } catch {
      }
      return u;
    },
    abort: () => {
      g || (g = !0, f(), c({ text: "" }));
    }
  };
}
var Fi = Object.defineProperty, qi = Object.getOwnPropertyDescriptor, Qt = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? qi(e, i) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (r = (n ? s(e, i, r) : s(r)) || r);
  return n && r && Fi(e, i, r), r;
};
let wt = class extends N {
  constructor() {
    super(...arguments), this._state = "idle", this._onClick = async (t) => {
      t.preventDefault(), t.stopPropagation(), this._state === "idle" ? await this._start() : this._state === "listening" && await this._stop();
    };
  }
  get _supported() {
    return ve() || Ii(this.hass);
  }
  _findNotesInput() {
    const t = this.closest("form");
    return (t == null ? void 0 : t.querySelector('input[name="notes"]')) ?? null;
  }
  _appendTranscript(t) {
    const e = t.trim();
    if (!e) return;
    const i = this._findNotesInput();
    if (!i) return;
    const n = i.value.trim();
    i.value = n ? `${n} ${e}` : e, i.dispatchEvent(new Event("input", { bubbles: !0 }));
  }
  async _start() {
    this._state = "listening";
    try {
      this._controller = ve() ? await Ui() : await Vi(this.hass);
    } catch (t) {
      console.warn("babytracker: mic start failed", t), this._controller = void 0, this._state = "idle";
    }
  }
  async _stop() {
    const t = this._controller;
    if (this._controller = void 0, !t) {
      this._state = "idle";
      return;
    }
    this._state = "transcribing";
    try {
      const { text: e } = await t.stop();
      this._appendTranscript(e);
    } catch (e) {
      console.warn("babytracker: mic stop failed", e);
    }
    this._state = "idle";
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._controller) == null || t.abort(), this._controller = void 0;
  }
  render() {
    if (!this._supported) return d``;
    const t = {
      idle: "Voice input",
      listening: "Stop recording",
      transcribing: "Transcribing"
    }, e = {
      idle: "🎤",
      listening: "■",
      transcribing: "…"
    };
    return d`
            <button
                type="button"
                class="mic ${this._state}"
                aria-label=${t[this._state]}
                title=${t[this._state]}
                ?disabled=${this._state === "transcribing"}
                @click=${this._onClick}
            >
                ${e[this._state]}
            </button>
        `;
  }
};
wt.styles = F`
        :host {
            display: inline-flex;
        }
        .mic {
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color);
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 1rem;
            cursor: pointer;
            min-width: 36px;
        }
        .mic.listening {
            background: var(--error-color, #d33);
            color: var(--text-primary-color, #fff);
            border-color: transparent;
            animation: bt-mic-pulse 1s ease-in-out infinite;
        }
        .mic.transcribing {
            opacity: 0.7;
            cursor: progress;
        }
        @keyframes bt-mic-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.55; }
        }
    `;
Qt([
  M({ attribute: !1 })
], wt.prototype, "hass", 2);
Qt([
  S()
], wt.prototype, "_state", 2);
wt = Qt([
  G("bt-mic-button")
], wt);
const ji = 5 * 1024 * 1024, Wi = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif"
]);
class W extends Error {
  constructor(e, i) {
    super(i), this.code = e;
  }
}
function Ki(t) {
  return new Promise((e, i) => {
    const n = new FileReader();
    n.onload = () => {
      const r = n.result;
      if (typeof r != "string") {
        i(new W("read_failed", "FileReader returned non-string"));
        return;
      }
      const o = r.indexOf(",");
      e(o >= 0 ? r.slice(o + 1) : r);
    }, n.onerror = () => i(new W("read_failed", "FileReader failed")), n.readAsDataURL(t);
  });
}
async function Yi(t, e) {
  if (e.size > ji)
    throw new W(
      "too_large",
      `Photo is ${Math.round(e.size / (1024 * 1024))} MB; max is 5 MB`
    );
  const i = (e.type || "").toLowerCase();
  if (!Wi.has(i))
    throw new W(
      "unsupported_mime",
      `Unsupported photo type: ${e.type || "unknown"}`
    );
  const n = await Ki(e);
  try {
    const r = await t.connection.sendMessagePromise({
      type: "babytracker/upload_photo",
      data: n,
      mime: i
    }), o = r == null ? void 0 : r.photo_path;
    if (typeof o != "string" || !o)
      throw new W("bad_response", "upload returned no photo_path");
    return { photo_path: o };
  } catch (r) {
    if (r instanceof W) throw r;
    const o = (r == null ? void 0 : r.code) ?? "upload_failed", s = (r == null ? void 0 : r.message) ?? "upload failed";
    throw new W(o, s);
  }
}
var Gi = Object.defineProperty, Xi = Object.getOwnPropertyDescriptor, ht = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? Xi(e, i) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (r = (n ? s(e, i, r) : s(r)) || r);
  return n && r && Gi(e, i, r), r;
};
let Y = class extends N {
  constructor() {
    super(...arguments), this.value = "", this._busy = !1, this._error = "", this._onClickAdd = (t) => {
      var e;
      t.preventDefault(), t.stopPropagation(), this._error = "", (e = this._fileInput) == null || e.click();
    }, this._onClickRemove = (t) => {
      t.preventDefault(), t.stopPropagation(), this._setValue("");
    };
  }
  get _supported() {
    var t;
    return !!((t = this.hass) != null && t.connection);
  }
  _setValue(t) {
    this.value = t, this.dispatchEvent(
      new CustomEvent("photo-changed", {
        detail: { value: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  async _onPick(t) {
    var n;
    const e = t.currentTarget, i = (n = e.files) == null ? void 0 : n[0];
    if (e.value = "", !!i) {
      this._busy = !0, this._error = "";
      try {
        const { photo_path: r } = await Yi(this.hass, i);
        this._setValue(r);
      } catch (r) {
        const o = r instanceof W ? r.message : "Photo upload failed";
        this._error = o, console.warn("babytracker: photo upload failed", r);
      } finally {
        this._busy = !1;
      }
    }
  }
  render() {
    return this._supported ? d`
            <div class="row">
                ${this.value ? d`
                          <bt-entry-thumbnail
                              .hass=${this.hass}
                              .photoPath=${this.value}
                          ></bt-entry-thumbnail>
                          <button
                              type="button"
                              class="remove"
                              aria-label="Remove photo"
                              title="Remove photo"
                              @click=${this._onClickRemove}
                          >
                              ✕
                          </button>
                      ` : d`
                          <button
                              type="button"
                              class="add"
                              aria-label="Add photo"
                              title="Add photo"
                              ?disabled=${this._busy}
                              @click=${this._onClickAdd}
                          >
                              ${this._busy ? "…" : "📷"}
                          </button>
                      `}
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    @change=${this._onPick}
                    hidden
                />
            </div>
            ${this._error ? d`<div class="error" role="alert">${this._error}</div>` : ""}
        ` : d``;
  }
};
Y.styles = F`
        :host {
            display: inline-block;
        }
        .row {
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        button {
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color);
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 1rem;
            cursor: pointer;
            min-width: 36px;
        }
        button.remove {
            padding: 2px 8px;
            min-width: 0;
        }
        button[disabled] {
            opacity: 0.7;
            cursor: progress;
        }
        .error {
            color: var(--error-color, #d33);
            font-size: 0.8rem;
            margin-top: 4px;
        }
    `;
ht([
  M({ attribute: !1 })
], Y.prototype, "hass", 2);
ht([
  M()
], Y.prototype, "value", 2);
ht([
  S()
], Y.prototype, "_busy", 2);
ht([
  S()
], Y.prototype, "_error", 2);
ht([
  He("input[type=file]")
], Y.prototype, "_fileInput", 2);
Y = ht([
  G("bt-photo-button")
], Y);
const Zi = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk",
  "other"
]);
function X(t, e = {}) {
  return d`
        <div style="display:flex;gap:6px;align-items:center;">
            <input
                id="notes"
                name="notes"
                type="text"
                placeholder=${e.placeholder ?? "optional"}
                .value=${e.value ?? ""}
                ?autofocus=${e.autofocus ?? !1}
                style="flex:1;min-width:0;"
            />
            <bt-mic-button .hass=${t}></bt-mic-button>
        </div>
    `;
}
function Z(t, e) {
  return d`
        <label>Photo</label>
        <bt-photo-button
            .hass=${t}
            .value=${e ?? ""}
        ></bt-photo-button>
    `;
}
function Q(t) {
  const e = t.querySelector("bt-photo-button"), i = e == null ? void 0 : e.value;
  return typeof i == "string" && i.length > 0 ? i : void 0;
}
const T = (t) => String(t).padStart(2, "0");
function bt() {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${T(t.getMonth() + 1)}-${T(t.getDate())}T${T(t.getHours())}:${T(t.getMinutes())}`;
}
function R(t) {
  if (!t) return;
  const e = Date.parse(t);
  if (!Number.isNaN(e))
    return new Date(e).toISOString();
}
function Vt(t) {
  if (!t) return "";
  const e = Date.parse(t);
  if (Number.isNaN(e)) return "";
  const i = new Date(e);
  return `${i.getFullYear()}-${T(i.getMonth() + 1)}-${T(i.getDate())}T${T(i.getHours())}:${T(i.getMinutes())}`;
}
function Jt() {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${T(t.getMonth() + 1)}-${T(t.getDate())}`;
}
function Qi(t) {
  if (!t) return "";
  const e = Date.parse(t);
  if (Number.isNaN(e)) return "";
  const i = new Date(e);
  return `${i.getFullYear()}-${T(i.getMonth() + 1)}-${T(i.getDate())}`;
}
function te(t) {
  if (!t) return;
  const e = Date.parse(`${t}T12:00`);
  if (!Number.isNaN(e))
    return new Date(e).toISOString();
}
function L(t) {
  const e = (i) => {
    var o;
    const r = (o = i.currentTarget.parentElement) == null ? void 0 : o.querySelector(
      "input"
    );
    r && (r.value = bt(), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })));
  };
  return d`
        <div class="dt-row">
            <input
                id=${t.id}
                name=${t.id}
                type="datetime-local"
                .value=${t.value ?? ""}
                placeholder=${t.placeholder ?? ""}
                ?required=${t.required ?? !1}
            />
            <button
                type="button"
                class="now-btn"
                aria-label="Set to now"
                title="Set to current time"
                @click=${e}
            >
                Now
            </button>
        </div>
    `;
}
const Ct = 8, $e = 0.5, we = 4;
function Fe(t) {
  const e = t.initialUnit === "ml" ? "ml" : "oz", n = typeof t.initialAmount == "number" && Number.isFinite(t.initialAmount) ? t.initialAmount : void 0, r = n != null ? String(n) : "", o = Math.max(
    0,
    Math.min(Ct, n ?? we)
  ), s = (l) => {
    var u;
    const c = l.currentTarget;
    if (c.type !== "range") return;
    const h = (u = c.form) == null ? void 0 : u.querySelector(
      "#amount-readout"
    );
    h && (h.textContent = `${c.value} oz`);
  }, a = (l) => {
    const c = l.currentTarget, h = c.form;
    if (!h) return;
    const u = h.querySelector(
      'input[name="amount"]'
    ), g = h.querySelector("#amount-readout");
    if (u)
      if (c.value === "oz") {
        u.type = "range", u.min = "0", u.max = String(Ct), u.step = String($e), u.removeAttribute("inputmode");
        const f = Number(u.value), m = Number.isFinite(f) ? Math.max(0, Math.min(Ct, f)) : we;
        u.value = String(m), g && (g.style.display = "", g.textContent = `${u.value} oz`);
      } else
        u.type = "number", u.min = "0", u.step = "1", u.removeAttribute("max"), u.inputMode = "decimal", g && (g.style.display = "none");
  };
  return d`
        <label for="amount">Amount</label>
        <div style="display:flex;gap:8px;align-items:center;">
            ${e === "oz" ? d`
                      <input
                          id="amount"
                          name="amount"
                          type="range"
                          min="0"
                          max=${Ct}
                          step=${$e}
                          .value=${String(o)}
                          @input=${s}
                          style="flex:1;min-width:0;"
                          ?autofocus=${t.autofocus ?? !1}
                      />
                      <span
                          id="amount-readout"
                          class="muted"
                          style="min-width:4ch;text-align:right;"
                          >${o} oz</span
                      >
                  ` : d`
                      <input
                          id="amount"
                          name="amount"
                          type="number"
                          min="0"
                          step="1"
                          inputmode="decimal"
                          .value=${r}
                          style="flex:1;min-width:0;"
                          ?autofocus=${t.autofocus ?? !1}
                      />
                      <span
                          id="amount-readout"
                          class="muted"
                          style="display:none;"
                      ></span>
                  `}
        </div>
        <label for="unit">Unit</label>
        <select id="unit" name="unit" @change=${a}>
            <option value="oz" ?selected=${e === "oz"}>oz</option>
            <option value="ml" ?selected=${e === "ml"}>ml</option>
        </select>
    `;
}
function qe(t) {
  const e = t.initialWeightUnit === "lb" ? "lb" : "kg", i = t.initialLengthUnit === "in" ? "in" : "cm", n = (r) => typeof r == "number" && Number.isFinite(r) ? String(r) : "";
  return d`
        <div
            style="display:grid;grid-template-columns:2fr 1fr;gap:8px;align-items:end;"
        >
            <div>
                <label for="weight">Weight</label>
                <input
                    id="weight"
                    name="weight"
                    type="number"
                    min="0"
                    step="0.01"
                    inputmode="decimal"
                    .value=${n(t.initialWeight)}
                    ?autofocus=${t.autofocusWeight ?? !1}
                />
            </div>
            <div>
                <label for="weight_unit">Unit</label>
                <select id="weight_unit" name="weight_unit">
                    <option value="kg" ?selected=${e === "kg"}>
                        kg
                    </option>
                    <option value="lb" ?selected=${e === "lb"}>
                        lb
                    </option>
                </select>
            </div>
            <div>
                <label for="height">Height</label>
                <input
                    id="height"
                    name="height"
                    type="number"
                    min="0"
                    step="0.1"
                    inputmode="decimal"
                    .value=${n(t.initialHeight)}
                />
            </div>
            <div>
                <label for="length_unit">Unit</label>
                <select id="length_unit" name="length_unit">
                    <option value="cm" ?selected=${i === "cm"}>
                        cm
                    </option>
                    <option value="in" ?selected=${i === "in"}>
                        in
                    </option>
                </select>
            </div>
            <div style="grid-column: span 2;">
                <label for="head">Head circumference</label>
                <input
                    id="head"
                    name="head"
                    type="number"
                    min="0"
                    step="0.1"
                    inputmode="decimal"
                    .value=${n(t.initialHead)}
                />
                <span class="muted">(uses the length unit above)</span>
            </div>
        </div>
    `;
}
function ee(t) {
  const e = (i) => {
    var o;
    const r = (o = i.currentTarget.parentElement) == null ? void 0 : o.querySelector(
      "input"
    );
    r && (r.value = Jt(), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })));
  };
  return d`
        <div class="dt-row">
            <input
                id=${t.id}
                name=${t.id}
                type="date"
                .value=${t.value ?? ""}
                ?required=${t.required ?? !1}
            />
            <button
                type="button"
                class="now-btn"
                aria-label="Set to today"
                title="Set to today's date"
                @click=${e}
            >
                Today
            </button>
        </div>
    `;
}
function Ji(t, e, i, n, r, o, s) {
  const a = (i == null ? void 0 : i.volume_unit) ?? r ?? "oz";
  return d`
        <form @submit=${(c) => {
    c.preventDefault();
    const h = c.currentTarget, u = new FormData(h), g = String(u.get("amount") ?? ""), f = g === "" ? void 0 : Number(g), m = R(String(u.get("at") ?? "")), v = String(u.get("unit") ?? a), b = String(u.get("notes") ?? "") || void 0;
    o("log_feeding", {
      baby: e,
      method: "bottle",
      amount: f,
      unit: v,
      started_at: m,
      ended_at: m,
      notes: b,
      photo_path: Q(h)
    });
  }}>
            <h2>Log bottle</h2>
            ${Fe({
    initialAmount: n,
    initialUnit: a,
    autofocus: !0
  })}
            <label for="at">Time</label>
            ${L({
    id: "at",
    value: bt(),
    required: !0
  })}
            <label for="notes">Notes</label>
            ${X(t)}
            ${Z(t)}
            <div class="actions">
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function tn(t, e, i, n, r, o) {
  const s = (l) => {
    l.preventDefault(), r("delete_entry", { entry_id: t });
  }, a = n ? `${i} (${n})` : i;
  return d`
        <form @submit=${(l) => l.preventDefault()}>
            <h2>Delete this entry?</h2>
            <p>
                This <strong>${e}</strong> was logged by
                <strong>${a}</strong>, not from this card. Deleting it
                here only removes it from babytracker — the upstream record is
                not affected.
            </p>
            <div class="actions">
                <button type="button" @click=${o} autofocus>Cancel</button>
                <button type="button" class="primary" @click=${s}>
                    Delete anyway
                </button>
            </div>
        </form>
    `;
}
function en(t, e, i, n) {
  return d`
        <form @submit=${(o) => {
    o.preventDefault();
    const s = o.currentTarget, a = new FormData(s, o.submitter ?? void 0);
    i("log_diaper", {
      baby: e,
      kind: String(a.get("kind") ?? "wet"),
      timestamp: R(String(a.get("when") ?? "")),
      notes: String(a.get("notes") ?? "") || void 0,
      photo_path: Q(s)
    });
  }}>
            <h2>Log diaper</h2>
            <label for="when">When</label>
            ${L({ id: "when", value: bt() })}
            <label for="notes">Notes</label>
            ${X(t)}
            ${Z(t)}
            <div
                style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px;"
            >
                <button
                    type="submit"
                    name="kind"
                    value="wet"
                    class="quick"
                    aria-label="Log wet diaper"
                >
                    Wet
                </button>
                <button
                    type="submit"
                    name="kind"
                    value="dirty"
                    class="quick"
                    aria-label="Log dirty diaper"
                >
                    Dirty
                </button>
                <button
                    type="submit"
                    name="kind"
                    value="both"
                    class="quick"
                    aria-label="Log both diaper"
                >
                    Both
                </button>
            </div>
            <div class="actions">
                <button type="button" @click=${n}>Cancel</button>
            </div>
        </form>
    `;
}
function nn(t, e, i, n, r) {
  const o = String((e == null ? void 0 : e.type) ?? ""), s = (e == null ? void 0 : e.data) ?? {}, a = o === "feeding" && (s.method === "bottle" || s.method === "solids"), l = o === "vaccine" || o === "growth", c = Zi.has(o) && !a, h = (f) => {
    f.preventDefault();
    const m = f.currentTarget, v = new FormData(m), b = {}, w = l ? te(String(v.get("started") ?? "")) : R(String(v.get("started") ?? ""));
    if (w && (b.timestamp = w), c) {
      const p = R(String(v.get("ended") ?? ""));
      b.ended_at = p ?? null;
    } else a && w && (b.ended_at = w);
    const $ = String(v.get("notes") ?? "");
    b.notes = $ || null;
    const x = {};
    if (o === "diaper")
      x.kind = String(v.get("kind") ?? s.kind ?? "wet");
    else if (o === "feeding" && s.method === "bottle") {
      const p = String(v.get("amount") ?? ""), _ = p === "" ? null : Number(p);
      x.amount = _, x.unit = String(v.get("unit") ?? s.unit ?? "oz");
    } else if (o === "other" || o === "medication") {
      const p = String(v.get("name") ?? "");
      p && (x.name = p);
    } else if (o === "growth") {
      const p = (C) => {
        const P = v.get(C);
        if (P === null) return;
        const q = String(P).trim();
        if (q === "") return null;
        const lt = Number(q);
        return Number.isFinite(lt) ? lt : void 0;
      }, _ = p("weight"), k = p("height"), E = p("head");
      _ !== void 0 && (x.weight = _), k !== void 0 && (x.height = k), E !== void 0 && (x.head_circumference = E), x.weight_unit = String(
        v.get("weight_unit") ?? s.weight_unit ?? "kg"
      ), x.length_unit = String(
        v.get("length_unit") ?? s.length_unit ?? "cm"
      );
    }
    Object.keys(x).length && (b.data = x);
    const y = Q(m);
    b.photo_path = y ?? null, i("edit_entry", { entry_id: e.id, fields: b });
  }, u = () => {
    if (!r) {
      n();
      return;
    }
    !!e.source && e.source !== "user" || n(), r({
      id: e.id,
      type: e.type,
      source: e.source,
      staff: e.staff
    });
  }, g = rn(e);
  return d`
        <form @submit=${h}>
            <h2>${g}</h2>
            ${c ? d`
                      <label for="started">Started</label>
                      ${L({
    id: "started",
    value: Vt(e.timestamp),
    required: !0
  })}
                      <label for="ended"
                          >Ended <span class="muted">(blank = ongoing)</span></label
                      >
                      ${L({
    id: "ended",
    value: Vt(e.ended_at)
  })}
                  ` : l ? d`
                      <label for="started">Date</label>
                      ${ee({
    id: "started",
    value: Qi(e.timestamp),
    required: !0
  })}
                  ` : d`
                      <label for="started">Time</label>
                      ${L({
    id: "started",
    value: Vt(e.timestamp),
    required: !0
  })}
                  `}
            ${o === "diaper" ? d`
                      <label for="kind">Kind</label>
                      <select id="kind" name="kind">
                          <option value="wet" ?selected=${s.kind === "wet"}>
                              Wet
                          </option>
                          <option
                              value="dirty"
                              ?selected=${s.kind === "dirty"}
                          >
                              Dirty
                          </option>
                          <option value="both" ?selected=${s.kind === "both"}>
                              Both
                          </option>
                      </select>
                  ` : ""}
            ${o === "feeding" && s.method === "bottle" ? Fe({
    initialAmount: typeof s.amount == "number" ? s.amount : void 0,
    initialUnit: s.unit ?? "oz"
  }) : ""}
            ${o === "other" || o === "medication" ? d`
                      <label for="name">Name</label>
                      <input
                          id="name"
                          name="name"
                          type="text"
                          .value=${String(s.name ?? "")}
                      />
                  ` : ""}
            ${o === "growth" ? qe({
    initialWeight: typeof s.weight == "number" ? s.weight : void 0,
    initialHeight: typeof s.height == "number" ? s.height : void 0,
    initialHead: typeof s.head_circumference == "number" ? s.head_circumference : void 0,
    initialWeightUnit: s.weight_unit ?? "kg",
    initialLengthUnit: s.length_unit ?? "cm"
  }) : ""}
            <label for="notes">Notes</label>
            ${X(t, {
    value: String(e.notes ?? "")
  })}
            ${Z(t, e.photo_path ?? "")}
            <div class="actions">
                <button type="button" @click=${n}>Cancel</button>
                <button
                    type="button"
                    class="danger"
                    aria-label="Delete entry"
                    @click=${u}
                >
                    Delete
                </button>
                <button type="submit" class="primary">Save</button>
            </div>
        </form>
    `;
}
function rn(t) {
  const e = String((t == null ? void 0 : t.type) ?? "entry"), i = (t == null ? void 0 : t.data) ?? {}, n = i.name ?? i.method ?? i.kind;
  return n ? `Edit ${e} (${n})` : `Edit ${e}`;
}
function on(t, e, i, n, r, o) {
  const s = async () => {
    o(), await n();
  }, a = async () => {
    try {
      await r("end_sleep", { baby: t });
    } catch (c) {
      console.warn("babytracker: end_sleep failed", c);
    }
    o(), await n();
  }, l = Zt(e ?? t);
  return d`
        <form @submit=${(c) => c.preventDefault()}>
            <h2>End sleep first?</h2>
            <p>${l} is asleep. End the sleep session before ${i}?</p>
            <div class="actions">
                <button type="button" @click=${o}>Cancel</button>
                <button type="button" @click=${s}>Skip, just log</button>
                <button
                    type="button"
                    class="primary"
                    autofocus
                    @click=${a}
                >
                    End sleep &amp; continue
                </button>
            </div>
        </form>
    `;
}
function sn(t, e, i, n, r) {
  const o = (i == null ? void 0 : i.weight_unit) ?? "kg", s = (i == null ? void 0 : i.length_unit) ?? "cm";
  return d`
        <form @submit=${(l) => {
    l.preventDefault();
    const c = l.currentTarget, h = new FormData(c), u = (g) => {
      const f = String(h.get(g) ?? "").trim();
      if (!f) return;
      const m = Number(f);
      return Number.isFinite(m) ? m : void 0;
    };
    n("log_growth", {
      baby: e,
      weight: u("weight"),
      height: u("height"),
      head_circumference: u("head"),
      weight_unit: String(h.get("weight_unit") ?? o),
      length_unit: String(h.get("length_unit") ?? s),
      timestamp: te(String(h.get("when") ?? "")),
      notes: String(h.get("notes") ?? "") || void 0,
      photo_path: Q(c)
    });
  }}>
            <h2>Log growth measurement</h2>
            ${qe({
    initialWeightUnit: o,
    initialLengthUnit: s,
    autofocusWeight: !0
  })}
            <label for="when">Date</label>
            ${ee({ id: "when", value: Jt() })}
            <label for="notes">Notes</label>
            ${X(t)}
            ${Z(t)}
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
const an = [
  "Bath",
  "Butt wash",
  "Diaper free time",
  "Medication",
  "Vitamin",
  "Burp",
  "Spit up",
  "Throw up"
];
function ln(t, e, i, n) {
  const r = (s) => {
    s.preventDefault();
    const a = s.currentTarget, l = new FormData(a);
    i("log_other", {
      baby: e,
      name: String(l.get("name") ?? ""),
      timestamp: R(String(l.get("started") ?? "")),
      ended_at: R(String(l.get("ended") ?? "")) || void 0,
      notes: String(l.get("notes") ?? "") || void 0,
      photo_path: Q(a)
    });
  }, o = (s, a) => {
    const l = s.currentTarget.form, c = { baby: e, name: a };
    if (l) {
      const h = new FormData(l), u = R(String(h.get("started") ?? "")), g = R(String(h.get("ended") ?? ""));
      u && (c.timestamp = u), g && (c.ended_at = g);
    }
    i("log_other", c);
  };
  return d`
        <form @submit=${r}>
            <h2>Log activity</h2>
            <label for="started">Started</label>
            ${L({ id: "started", value: bt() })}
            <label for="ended"
                >Ended <span class="muted">(optional)</span></label
            >
            ${L({
    id: "ended",
    placeholder: "leave blank for a point-in-time event"
  })}
            <div class="quick-other" role="group" aria-label="Quick activities">
                ${an.map(
    (s) => d`
                        <button
                            type="button"
                            class="quick"
                            @click=${(a) => o(a, s)}
                        >
                            ${s}
                        </button>
                    `
  )}
            </div>
            <label for="name">Or type your own</label>
            <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. doctor visit, first smile"
                autofocus
                required
            />
            <label for="notes">Notes</label>
            ${X(t)}
            ${Z(t)}
            <div class="actions">
                <button type="button" @click=${n}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function cn(t, e, i, n, r, o) {
  const s = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: n ? `Log ${n.replace("_", " ")} feeding` : "Log feeding"
  };
  return d`
        <form @submit=${(l) => {
    l.preventDefault();
    const c = l.currentTarget, h = new FormData(c), u = R(String(h.get("started") ?? "")), g = R(String(h.get("ended") ?? "")), f = String(h.get("notes") ?? "") || void 0, m = Q(c);
    if (!g) {
      const w = {
        baby: e,
        started_at: u,
        photo_path: m
      };
      let $;
      switch (i) {
        case "sleep":
          $ = "start_sleep";
          break;
        case "tummy_time":
          $ = "start_tummy_time";
          break;
        case "walk":
          $ = "start_walk";
          break;
        case "feeding":
          $ = "start_feeding", w.method = n;
          break;
      }
      r($, w);
      return;
    }
    const v = {
      baby: e,
      started_at: u,
      ended_at: g,
      notes: f,
      photo_path: m
    };
    let b;
    switch (i) {
      case "sleep":
        b = "log_sleep";
        break;
      case "tummy_time":
        b = "log_tummy_time";
        break;
      case "walk":
        b = "log_walk";
        break;
      case "feeding":
        b = "log_feeding", v.method = n;
        break;
    }
    r(b, v);
  }}>
            <h2>${s[i]}</h2>
            <label for="started">Started</label>
            ${L({
    id: "started",
    value: bt(),
    required: !0
  })}
            <label for="ended">Ended <span class="muted">(optional)</span></label>
            ${L({
    id: "ended",
    placeholder: "leave blank for an open session"
  })}
            <label for="notes">Notes</label>
            ${X(t)}
            ${Z(t)}
            <div class="actions">
                <button type="button" @click=${o}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function dn(t, e, i, n) {
  return d`
        <form @submit=${(o) => {
    o.preventDefault();
    const s = o.currentTarget, a = new FormData(s), l = R(String(a.get("when") ?? ""));
    i("log_feeding", {
      baby: e,
      method: "solids",
      started_at: l,
      ended_at: l,
      notes: String(a.get("notes") ?? "") || void 0,
      photo_path: Q(s)
    });
  }}>
            <h2>Log solids</h2>
            <label for="notes"
                >What was fed <span class="muted">(optional)</span></label
            >
            ${X(t, {
    placeholder: "e.g. banana, oatmeal",
    autofocus: !0
  })}
            <label for="when">When</label>
            ${L({ id: "when", value: bt() })}
            ${Z(t)}
            <div class="actions">
                <button type="button" @click=${n}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
const un = [
  "COVID-19",
  "DTaP",
  "Hepatitis A (HepA)",
  "Hepatitis B (HepB)",
  "Hib",
  "HPV",
  "Influenza",
  "MenACWY",
  "MenB",
  "MMR",
  "Pneumococcal (PCV13)",
  "Pneumococcal (PCV15)",
  "Pneumococcal (PCV20)",
  "Polio (IPV)",
  "Rotavirus (RV)",
  "RSV",
  "Tdap",
  "Varicella (VAR)"
], pn = {
  HepA: "Hepatitis A (HepA)",
  "Hepatitis A": "Hepatitis A (HepA)",
  HepB: "Hepatitis B (HepB)",
  "Hepatitis B": "Hepatitis B (HepB)",
  IPV: "Polio (IPV)",
  Polio: "Polio (IPV)",
  RV: "Rotavirus (RV)",
  RV1: "Rotavirus (RV)",
  RV5: "Rotavirus (RV)",
  Rotavirus: "Rotavirus (RV)",
  "Rotavirus (RV1)": "Rotavirus (RV)",
  "Rotavirus (RV5)": "Rotavirus (RV)",
  VAR: "Varicella (VAR)",
  Varicella: "Varicella (VAR)",
  PCV13: "Pneumococcal (PCV13)",
  PCV15: "Pneumococcal (PCV15)",
  PCV20: "Pneumococcal (PCV20)"
};
function xe(t) {
  return pn[t] ?? t;
}
function hn(t, e, i, n, r, o, s) {
  const a = [
    "left_thigh",
    "right_thigh",
    "left_arm",
    "right_arm",
    "oral",
    "nasal"
  ], l = (b) => {
    b.preventDefault();
    const w = b.currentTarget, $ = new FormData(w), x = String($.get("vaccine_select") ?? "").trim(), y = String($.get("vaccine_custom") ?? "").trim(), p = x === "__other__" ? y : x;
    if (!p) return;
    const _ = String($.get("dose_number") ?? "").trim(), k = _ === "" ? void 0 : Number(_), E = String($.get("site") ?? "").trim() || void 0, C = String($.get("lot_number") ?? "").trim() || void 0, P = String($.get("provider") ?? "").trim() || void 0;
    o("log_vaccine", {
      baby: e,
      name: p,
      dose_number: k,
      site: E,
      lot_number: C,
      provider: P,
      timestamp: te(String($.get("when") ?? "")),
      notes: String($.get("notes") ?? "") || void 0,
      photo_path: Q(w)
    });
  }, c = Array.from(
    new Set(
      [...un, ...r].filter((b) => !!b && b !== "none").map(xe)
    )
  ).sort((b, w) => b.localeCompare(w)), h = i && i !== "none" ? xe(i) : "", u = !!h && c.includes(h), g = !!h && !u, f = u ? h : g ? "__other__" : "", m = g ? h : "";
  return d`
        <form @submit=${l}>
            <h2>Log vaccine</h2>
            <label for="vaccine_select">Vaccine</label>
            <select
                id="vaccine_select"
                name="vaccine_select"
                required
                autofocus
                @change=${(b) => {
    var x;
    const w = b.currentTarget, $ = (x = w.closest("form")) == null ? void 0 : x.querySelector("#vaccine_custom");
    $ && (w.value === "__other__" ? ($.hidden = !1, $.required = !0, $.focus()) : ($.hidden = !0, $.required = !1, $.value = ""));
  }}
            >
                <option value="" disabled ?selected=${f === ""}>
                    (pick one)
                </option>
                ${c.map(
    (b) => d`<option
                        value=${b}
                        ?selected=${f === b}
                    >
                        ${b}
                    </option>`
  )}
                <option
                    value="__other__"
                    ?selected=${f === "__other__"}
                >
                    Other…
                </option>
            </select>
            <input
                id="vaccine_custom"
                name="vaccine_custom"
                type="text"
                placeholder="Vaccine name"
                .value=${m}
                ?hidden=${f !== "__other__"}
                ?required=${f === "__other__"}
            />
            <label for="dose_number"
                >Dose number <span class="muted">(auto if blank)</span></label
            >
            <input
                id="dose_number"
                name="dose_number"
                type="number"
                min="1"
                max="20"
                step="1"
                inputmode="numeric"
                .value=${n != null ? String(n) : ""}
            />
            <label for="site">Site</label>
            <select id="site" name="site">
                <option value="">(unspecified)</option>
                ${a.map(
    (b) => d`<option value=${b}>${b.replace("_", " ")}</option>`
  )}
            </select>
            <label for="lot_number">Lot number</label>
            <input
                id="lot_number"
                name="lot_number"
                type="text"
                placeholder="optional"
            />
            <label for="provider">Provider</label>
            <input
                id="provider"
                name="provider"
                type="text"
                placeholder="optional"
            />
            <label for="when">Date</label>
            ${ee({ id: "when", value: Jt() })}
            <label for="notes">Notes</label>
            ${X(t)}
            ${Z(t)}
            <div class="actions">
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function ie(t, e, i, n, r, o, s) {
  let a = A;
  if (e !== null)
    switch (e.kind) {
      case "diaper":
        a = en(t, e.baby, n, o);
        break;
      case "bottle":
        a = Ji(
          t,
          e.baby,
          i,
          e.lastAmount,
          e.lastUnit,
          n,
          o
        );
        break;
      case "solids":
        a = dn(t, e.baby, n, o);
        break;
      case "other":
        a = ln(t, e.baby, n, o);
        break;
      case "session":
        a = cn(
          t,
          e.baby,
          e.activity,
          e.method,
          n,
          o
        );
        break;
      case "end_sleep_first":
        a = on(
          e.baby,
          e.babyName,
          e.label,
          e.then,
          r,
          o
        );
        break;
      case "confirm_delete_imported":
        a = tn(
          e.entryId,
          e.entryType,
          e.source,
          e.staff ?? null,
          n,
          o
        );
        break;
      case "edit_entry":
        a = nn(
          t,
          e.entry,
          n,
          o,
          s
        );
        break;
      case "log_growth":
        a = sn(t, e.baby, i, n, o);
        break;
      case "log_vaccine":
        a = hn(
          t,
          e.baby,
          e.defaultName ?? "",
          e.defaultDose,
          e.scheduleNames ?? [],
          n,
          o
        );
        break;
    }
  return d`
        <dialog @cancel=${o} @close=${o}>${a}</dialog>
    `;
}
function je(t, e) {
  return !t.source || t.source === "user" ? (e(t.id), null) : {
    kind: "confirm_delete_imported",
    entryId: t.id,
    entryType: t.type ?? "entry",
    source: t.source,
    staff: t.staff ?? null
  };
}
function We(t, e) {
  const i = t.querySelector("dialog");
  i && (e && !i.open && i.showModal(), !e && i.open && i.close());
}
const Ke = F`
    dialog {
        border: none;
        border-radius: 12px;
        padding: 16px;
        min-width: min(360px, 92vw);
        background: var(--card-background-color);
        color: var(--primary-text-color);
    }
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.5);
    }
    dialog form {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    dialog .actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        margin-top: 8px;
    }
    dialog input,
    dialog select {
        padding: 8px;
        border-radius: 6px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font: inherit;
    }
    dialog .dt-row {
        display: flex;
        gap: 6px;
        align-items: stretch;
    }
    dialog .dt-row input {
        flex: 1;
        min-width: 0;
    }
    dialog .dt-row .now-btn {
        padding: 4px 10px;
        font-size: 0.85rem;
        white-space: nowrap;
    }
`, Ft = 24 * 60 * 60 * 1e3, ke = 29.5735, Se = [
  { key: "bottle", label: "Bottle", color: "var(--primary-color, #4a90e2)" },
  { key: "breast", label: "Breast", color: "var(--success-color, #43a047)" },
  { key: "solids", label: "Solids", color: "var(--warning-color, #f5a623)" }
], Ce = [
  { key: "wet", label: "Wet", color: "var(--info-color, #4fc3f7)" },
  { key: "dirty", label: "Dirty", color: "var(--accent-color, #f57c00)" },
  { key: "both", label: "Both", color: "var(--error-color, #d32f2f)" }
];
function bn(t) {
  return {
    label: t,
    sleepMinutes: 0,
    bottleMl: 0,
    feedingByCategory: { bottle: 0, breast: 0, solids: 0 },
    diaperByCategory: { wet: 0, dirty: 0, both: 0 }
  };
}
function gn(t) {
  return t === "bottle" ? "bottle" : t === "breast_left" || t === "breast_right" ? "breast" : t === "solids" ? "solids" : null;
}
function mn(t) {
  return t === "wet" || t === "dirty" || t === "both" ? t : null;
}
function fn(t) {
  return {
    feedings: t.feedingByCategory.bottle + t.feedingByCategory.breast + t.feedingByCategory.solids,
    diapers: t.diaperByCategory.wet + t.diaperByCategory.dirty + t.diaperByCategory.both
  };
}
function _n(t, e, i = 7) {
  var v, b, w, $, x, y;
  const n = (v = t == null ? void 0 : t.states) == null ? void 0 : v[D(e, "recent_entries")], r = ((b = n == null ? void 0 : n.attributes) == null ? void 0 : b.entries) ?? [], o = Date.now(), s = new Date(o);
  s.setHours(0, 0, 0, 0);
  const a = [], l = (p) => p.toLocaleDateString([], { weekday: "short" });
  for (let p = i - 1; p >= 0; p--) {
    const _ = new Date(s.getTime() - p * Ft);
    a.push(bn(l(_)));
  }
  const c = s.getTime() - (i - 1) * Ft;
  for (const p of r) {
    const _ = Date.parse(p == null ? void 0 : p.timestamp);
    if (!Number.isFinite(_)) continue;
    const k = Math.floor((_ - c) / Ft);
    if (k < 0 || k >= i) continue;
    const E = a[k];
    if (p.type === "feeding") {
      const C = gn(String(((w = p == null ? void 0 : p.data) == null ? void 0 : w.method) ?? ""));
      C && (E.feedingByCategory[C] += 1);
      const P = Number((($ = p == null ? void 0 : p.data) == null ? void 0 : $.amount) ?? 0), q = String(((x = p == null ? void 0 : p.data) == null ? void 0 : x.unit) ?? "");
      P > 0 && q === "oz" ? E.bottleMl += P * ke : P > 0 && q === "ml" && (E.bottleMl += P);
    } else if (p.type === "diaper") {
      const C = mn(String(((y = p == null ? void 0 : p.data) == null ? void 0 : y.kind) ?? ""));
      C && (E.diaperByCategory[C] += 1);
    } else if (p.type === "sleep") {
      const C = p != null && p.ended_at && p.ended_at !== "" ? Date.parse(p.ended_at) : o;
      Number.isFinite(C) && C > _ && (E.sleepMinutes += (C - _) / 6e4);
    }
  }
  const h = a.map(fn);
  if (a.every(
    (p, _) => p.sleepMinutes === 0 && h[_].feedings === 0 && h[_].diapers === 0
  ))
    return "";
  const u = a.map((p) => ({
    label: p.label,
    value: p.sleepMinutes
  })), g = a.map((p) => ({
    label: p.label,
    parts: Se.map((_) => ({
      ..._,
      value: p.feedingByCategory[_.key]
    }))
  })), f = a.map((p) => ({
    label: p.label,
    value: p.bottleMl
  })), m = a.map((p) => ({
    label: p.label,
    parts: Ce.map((_) => ({
      ..._,
      value: p.diaperByCategory[_.key]
    }))
  }));
  return d`
        <div class="section" role="region" aria-label="Trends">
            <h2>Trends · last ${i} days</h2>
            <bt-chart-lightbox
                label="Sleep (min/day)"
                .renderChart=${() => Ae(
    u,
    "Sleep (min/day)",
    (p) => `${Math.round(p)}`
  )}
            ></bt-chart-lightbox>
            <bt-chart-lightbox
                label="Feedings/day"
                .renderChart=${() => De(
    g,
    "Feedings/day",
    Se,
    (p) => `${p}`
  )}
            ></bt-chart-lightbox>
            <bt-chart-lightbox
                label="Bottle (oz/day)"
                .renderChart=${() => Ae(
    f,
    "Bottle (oz/day)",
    (p) => (p / ke).toFixed(1)
  )}
            ></bt-chart-lightbox>
            <bt-chart-lightbox
                label="Diapers/day"
                .renderChart=${() => De(
    m,
    "Diapers/day",
    Ce,
    (p) => `${p}`
  )}
            ></bt-chart-lightbox>
        </div>
    `;
}
function Ae(t, e, i) {
  const a = Math.max(1, ...t.map((c) => c.value)), l = (320 - 14 * 2) / t.length;
  return d`
        <div class="trend">
            <div class="label">${e}</div>
            <svg
                viewBox="0 0 ${320} ${90}"
                role="img"
                aria-label=${e}
                style="width:100%;height:${90}px;"
            >
                ${t.map((c, h) => {
    const u = 14 + h * l, g = l * 0.7, f = u + (l - g) / 2, m = Math.max(
      c.value > 0 ? 2 : 0,
      c.value / a * (90 - 24 * 2)
    ), v = 66 - m;
    return z`
                        <rect
                            x=${f}
                            y=${v}
                            width=${g}
                            height=${m}
                            fill="var(--primary-color)"
                            rx="2"
                        ></rect>
                        <text
                            x=${f + g / 2}
                            y=${v - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${c.value > 0 ? i(c.value) : ""}
                        </text>
                        <text
                            x=${f + g / 2}
                            y=${84}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${c.label}
                        </text>
                    `;
  })}
            </svg>
        </div>
    `;
}
function De(t, e, i, n) {
  const l = t.map((u) => u.parts.reduce((g, f) => g + f.value, 0)), c = Math.max(1, ...l), h = (320 - 14 * 2) / t.length;
  return d`
        <div class="trend">
            <div class="label-row">
                <div class="label">${e}</div>
                <div class="legend">
                    ${i.map(
    (u) => d`
                            <span class="legend-item">
                                <span
                                    class="swatch"
                                    style=${`background:${u.color}`}
                                ></span>
                                ${u.label}
                            </span>
                        `
  )}
                </div>
            </div>
            <svg
                viewBox="0 0 ${320} ${90}"
                role="img"
                aria-label=${e}
                style="width:100%;height:${90}px;"
            >
                ${t.map((u, g) => {
    const f = 14 + g * h, m = h * 0.7, v = f + (h - m) / 2, b = l[g], w = Math.max(
      b > 0 ? 2 : 0,
      b / c * (90 - 24 * 2)
    ), $ = 66;
    let x = $;
    const y = u.parts.map((p) => {
      if (p.value <= 0) return z``;
      const _ = p.value / b * w;
      return x -= _, z`
                            <rect
                                x=${v}
                                y=${x}
                                width=${m}
                                height=${_}
                                fill=${p.color}
                            >
                                <title>${p.label}: ${p.value}</title>
                            </rect>
                        `;
    });
    return z`
                        ${y}
                        <text
                            x=${v + m / 2}
                            y=${$ - w - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${b > 0 ? n(b) : ""}
                        </text>
                        <text
                            x=${v + m / 2}
                            y=${84}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${u.label}
                        </text>
                    `;
  })}
            </svg>
        </div>
    `;
}
function yn(t) {
  if (!t) return "—";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "—" : new Date(e).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function qt(t) {
  var n, r;
  const e = String(((n = t == null ? void 0 : t.data) == null ? void 0 : n.name) ?? "vaccine"), i = (r = t == null ? void 0 : t.data) == null ? void 0 : r.dose_number;
  return i != null ? `${e} dose ${i}` : e;
}
function vn(t, e) {
  return !t || t.length === 0 ? "" : d`
        <div
            class="section vaccine-history"
            role="region"
            aria-label="Vaccine history"
        >
            <h3>Vaccine history</h3>
            <ul class="vh-list">
                ${t.map(
    (i) => {
      var n;
      return d`<li
                        class=${e ? "clickable" : ""}
                        role=${e ? "button" : "listitem"}
                        tabindex=${e ? "0" : "-1"}
                        aria-label=${e ? `Edit ${qt(i)}` : qt(i)}
                        @click=${e ? () => e(i) : void 0}
                        @keydown=${e ? (r) => {
        (r.key === "Enter" || r.key === " ") && (r.preventDefault(), e(i));
      } : void 0}
                    >
                        <span class="vh-date muted"
                            >${yn(i.timestamp)}</span
                        >
                        <span class="vh-name">${qt(i)}</span>
                        ${(n = i == null ? void 0 : i.data) != null && n.site ? d`<span class="muted">${String(
        i.data.site
      ).replace("_", " ")}</span>` : ""}
                    </li>`;
    }
  )}
            </ul>
        </div>
    `;
}
function $n(t, e, i) {
  var o, s;
  const n = t.states[D(e, "vaccines_due")];
  if (!n || n.state === "unknown") return "";
  const r = ((o = t.states[D(e, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : o.state) === "on";
  return d`
        <div
            class="section chip ${r ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${n.state}</strong>
            ${(s = n.attributes) != null && s.due_on ? d`<span>(${n.attributes.due_on})</span>` : ""}
            ${r ? d`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
            ${i ? d`<span class="spacer"></span>
                      <button
                          type="button"
                          class="primary"
                          aria-label="Log a vaccine"
                          @click=${i}
                      >
                          Log vaccine
                      </button>` : ""}
        </div>
    `;
}
var wn = Object.defineProperty, xn = Object.getOwnPropertyDescriptor, st = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? xn(e, i) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (r = (n ? s(e, i, r) : s(r)) || r);
  return n && r && wn(e, i, r), r;
};
const kn = ["vaccines", "growth", "trends", "export"];
let B = class extends N {
  constructor() {
    super(...arguments), this._modal = null, this._vaccines = [], this._growth = [], this._closeModal = () => {
      this._modal = null;
    }, this._submitModal = async (t, e) => {
      await this.hass.callService("babytracker", t, e), this._modal = null;
    }, this._callService = async (t, e) => this.hass.callService("babytracker", t, e), this._requestLogGrowth = () => {
      var t;
      (t = this._config) != null && t.baby && (this._modal = { kind: "log_growth", baby: this._config.baby });
    }, this._requestEditEntry = (t) => {
      this._modal = { kind: "edit_entry", entry: t };
    }, this._requestDelete = (t) => {
      this._modal = je(
        t,
        (e) => this.hass.callService("babytracker", "delete_entry", { entry_id: e })
      );
    }, this._requestLogVaccine = () => {
      var s, a, l, c, h;
      if (!((s = this._config) != null && s.baby)) return;
      const t = (l = (a = this.hass) == null ? void 0 : a.states) == null ? void 0 : l[D(this._config.baby, "vaccines_due")], e = t != null && t.state && t.state !== "none" && t.state !== "unknown" ? String(t.state) : "", i = (c = t == null ? void 0 : t.attributes) == null ? void 0 : c.dose_number, n = typeof i == "number" ? i : void 0, o = (Array.isArray((h = t == null ? void 0 : t.attributes) == null ? void 0 : h.upcoming) ? t.attributes.upcoming : []).map((u) => u && typeof u.name == "string" ? u.name : null).filter((u) => !!u);
      this._modal = {
        kind: "log_vaccine",
        baby: this._config.baby,
        defaultName: e,
        defaultDose: n,
        scheduleNames: o
      };
    };
  }
  setConfig(t) {
    if (!(t != null && t.baby))
      throw new Error("babytracker-summary-card: 'baby' is required");
    this._config = { ...t };
  }
  getCardSize() {
    return 4;
  }
  connectedCallback() {
    super.connectedCallback(), this._maybeSubscribe();
  }
  disconnectedCallback() {
    var t, e, i;
    (t = this._unsubOptions) == null || t.call(this), this._unsubOptions = void 0, (e = this._unsubVaccines) == null || e.call(this), this._unsubVaccines = void 0, (i = this._unsubGrowth) == null || i.call(this), this._unsubGrowth = void 0, super.disconnectedCallback();
  }
  updated(t) {
    (t.has("hass") || t.has("_config")) && this._maybeSubscribe(), t.has("_modal") && We(this.renderRoot, this._modal);
  }
  _maybeSubscribe() {
    var t, e;
    !this.hass || !this._config || (this._unsubOptions || (this._unsubOptions = ze(
      this.hass,
      (i) => {
        this._options = i;
      }
    )), !this._unsubVaccines && this._sections.includes("vaccines") && ((t = this._config) != null && t.baby) && (this._unsubVaccines = _i(
      this.hass,
      this._config.baby,
      (i) => {
        this._vaccines = Array.isArray(i) ? i : [];
      }
    )), !this._unsubGrowth && this._sections.includes("growth") && ((e = this._config) != null && e.baby) && (this._unsubGrowth = yi(
      this.hass,
      this._config.baby,
      (i) => {
        this._growth = Array.isArray(i) ? i : [];
      }
    )));
  }
  get _sections() {
    var t;
    return ((t = this._config) == null ? void 0 : t.sections) ?? kn;
  }
  render() {
    if (!this.hass || !this._config) return d``;
    const t = this._sections;
    return d`
            <ha-card>
                ${t.includes("vaccines") ? d`
                          ${$n(
      this.hass,
      this._config.baby,
      this._requestLogVaccine
    )}
                          ${vn(
      this._vaccines,
      this._requestEditEntry
    )}
                      ` : ""}
                ${t.includes("growth") ? Be(
      this.hass,
      this._config.baby,
      this._options,
      this._config.units,
      this._requestLogGrowth,
      this._growth[0],
      this._requestEditEntry,
      this._growth
    ) : ""}
                ${t.includes("trends") ? _n(
      this.hass,
      this._config.baby,
      this._config.trend_days ?? 7
    ) : ""}
                ${t.includes("export") ? Ve(this.hass, this._config.baby) : ""}
            </ha-card>
            ${ie(
      this.hass,
      this._modal,
      this._options,
      this._submitModal,
      this._callService,
      this._closeModal,
      this._requestDelete
    )}
        `;
  }
  static getStubConfig() {
    return { type: "custom:babytracker-summary-card", baby: "ava" };
  }
};
B.styles = F`
        :host {
            display: block;
            font-family: var(--primary-font-family, system-ui);
        }
        ha-card {
            padding: 16px;
        }
        h2 {
            font-size: 1.15rem;
            margin: 0 0 8px;
            color: var(--primary-text-color);
        }
        .section {
            margin-top: 12px;
        }
        .chip {
            padding: 6px 10px;
            border-radius: 16px;
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            font-size: 0.85rem;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .chip.warning {
            background: var(--warning-color);
            color: var(--text-primary-color, #fff);
        }
        .growth-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        }
        .growth-summary {
            padding: 6px 8px;
            margin: 0 -8px;
            border-radius: 6px;
        }
        .growth-summary.clickable {
            cursor: pointer;
        }
        .growth-summary.clickable:hover,
        .growth-summary.clickable:focus-visible {
            background: var(--secondary-background-color);
            outline: none;
        }
        .growth-date {
            margin-bottom: 4px;
        }
        .growth-trend {
            margin-top: 12px;
        }
        .growth-trend .label-row {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 4px 12px;
            justify-content: space-between;
        }
        .growth-trend .legend {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            font-size: 0.75rem;
            color: var(--secondary-text-color);
        }
        .growth-trend .legend-item {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .growth-trend .swatch {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 2px;
        }
        .label {
            font-size: 0.85rem;
            color: var(--secondary-text-color);
        }
        button {
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color);
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        button.primary {
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
            border-color: transparent;
            padding: 8px 14px;
        }
        svg {
            width: 100%;
            height: 120px;
            margin-top: 8px;
        }
        .trend + .trend {
            margin-top: 8px;
        }
        .trend .label-row {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 4px 12px;
            justify-content: space-between;
        }
        .trend .legend {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            font-size: 0.75rem;
            color: var(--secondary-text-color);
        }
        .trend .legend-item {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .trend .swatch {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 2px;
        }
        .muted {
            color: var(--secondary-text-color);
            font-size: 0.85rem;
        }
        ${Ke}
        .chip .spacer {
            flex: 1;
        }
        dialog input[hidden] {
            display: none;
        }
        .vaccine-history h3 {
            margin: 0 0 6px;
            font-size: 1rem;
            color: var(--primary-text-color);
        }
        ul.vh-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        ul.vh-list li {
            display: flex;
            align-items: baseline;
            flex-wrap: wrap;
            column-gap: 8px;
            row-gap: 2px;
            padding: 4px 0;
            border-bottom: 1px solid var(--divider-color);
        }
        ul.vh-list li.clickable {
            cursor: pointer;
            border-radius: 4px;
            margin: 0 -4px;
            padding: 4px 4px;
        }
        ul.vh-list li.clickable:hover,
        ul.vh-list li.clickable:focus-visible {
            background: var(--secondary-background-color);
            outline: none;
        }
        ul.vh-list li:last-child {
            border-bottom: none;
        }
        .vh-date {
            min-width: 96px;
        }
        .vh-name {
            font-weight: 500;
        }
    `;
st([
  M({ attribute: !1 })
], B.prototype, "hass", 2);
st([
  S()
], B.prototype, "_config", 2);
st([
  S()
], B.prototype, "_options", 2);
st([
  S()
], B.prototype, "_modal", 2);
st([
  S()
], B.prototype, "_vaccines", 2);
st([
  S()
], B.prototype, "_growth", 2);
B = st([
  G("babytracker-summary-card")
], B);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-summary-card",
  name: "babytracker — summary",
  description: "Vaccines, growth, 7-day trend charts, and pediatrician export for one baby."
});
var Sn = Object.defineProperty, Cn = Object.getOwnPropertyDescriptor, at = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? Cn(e, i) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (r = (n ? s(e, i, r) : s(r)) || r);
  return n && r && Sn(e, i, r), r;
};
function Ee(t) {
  return String(t).padStart(2, "0");
}
function Dt(t) {
  return `${t.getFullYear()}-${Ee(t.getMonth() + 1)}-${Ee(t.getDate())}`;
}
function xt(t) {
  const e = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (!e) return null;
  const i = Number(e[1]), n = Number(e[2]) - 1, r = Number(e[3]), o = new Date(i, n, r, 0, 0, 0, 0);
  return Number.isNaN(o.getTime()) ? null : o;
}
function An(t) {
  const e = xt(t) ?? /* @__PURE__ */ new Date(), i = new Date(e.getFullYear(), e.getMonth(), e.getDate(), 0, 0, 0, 0), n = new Date(
    e.getFullYear(),
    e.getMonth(),
    e.getDate(),
    23,
    59,
    59,
    999
  );
  return { startIso: i.toISOString(), endIso: n.toISOString() };
}
function Dn(t, e) {
  const i = xt(t) ?? /* @__PURE__ */ new Date();
  return i.setDate(i.getDate() + e), Dt(i);
}
function En(t) {
  const e = xt(t);
  return e ? e.toLocaleDateString([], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : t;
}
let V = class extends N {
  constructor() {
    super(...arguments), this._date = Dt(/* @__PURE__ */ new Date()), this._entries = [], this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._today = () => {
      this._date = Dt(/* @__PURE__ */ new Date());
    }, this._onDateChange = (t) => {
      const e = t.currentTarget.value;
      e && xt(e) && (this._date = e);
    }, this._requestEdit = (t) => {
      this._modal = { kind: "edit_entry", entry: t };
    }, this._requestDelete = (t) => {
      this._modal = je(
        t,
        (e) => this.hass.callService("babytracker", "delete_entry", { entry_id: e })
      );
    }, this._toggleNotes = (t) => {
      const e = new Set(this._expandedNotes);
      e.has(t) ? e.delete(t) : e.add(t), this._expandedNotes = e;
    }, this._closeModal = () => {
      this._modal = null;
    }, this._submitModal = async (t, e) => {
      await this.hass.callService("babytracker", t, e), this._modal = null;
    }, this._callService = async (t, e) => this.hass.callService("babytracker", t, e);
  }
  setConfig(t) {
    if (!(t != null && t.baby))
      throw new Error("babytracker-history-card: 'baby' is required");
    this._config = { ...t }, t.initial_date && xt(t.initial_date) && (this._date = t.initial_date);
  }
  getCardSize() {
    return 6;
  }
  connectedCallback() {
    super.connectedCallback(), this._resubscribe();
  }
  disconnectedCallback() {
    var t;
    (t = this._unsubEntries) == null || t.call(this), this._unsubEntries = void 0, super.disconnectedCallback();
  }
  updated(t) {
    (t.has("hass") || t.has("_config") || t.has("_date")) && this._resubscribe(), t.has("_modal") && We(this.renderRoot, this._modal);
  }
  _resubscribe() {
    var i, n;
    if (!this.hass || !((i = this._config) != null && i.baby)) return;
    (n = this._unsubEntries) == null || n.call(this);
    const { startIso: t, endIso: e } = An(this._date);
    this._unsubEntries = fi(
      this.hass,
      this._config.baby,
      t,
      e,
      (r) => {
        this._entries = Array.isArray(r) ? r : [];
      }
    );
  }
  _go(t) {
    this._date = Dn(this._date, t);
  }
  _renderChips(t) {
    const e = [], i = [];
    if (t.wet && i.push(`${t.wet} wet`), t.dirty && i.push(`${t.dirty} dirty`), e.push(d`
            <span class="chip"
                ><span class="chip-label">Diapers</span> ${t.diapers}${i.length > 0 ? d` <span class="chip-detail"
                              >(${i.join(" · ")})</span
                          >` : ""}</span
            >
        `), e.push(d`
            <span class="chip"
                ><span class="chip-label">Sleep</span>
                ${O(t.sleepMinutes)}</span
            >
        `), e.push(d`
            <span class="chip"
                ><span class="chip-label">Longest sleep</span>
                ${O(t.longestSleepMinutes)}</span
            >
        `), t.bottleFeeds > 0 && e.push(d`
                <span class="chip"
                    ><span class="chip-label">Feeds</span>
                    ${t.bottleFeeds}
                    <span class="chip-detail"
                        >· ${Wt(t.bottleVolumeMl)}</span
                    ></span
                >
            `), t.nursingMinutes > 0) {
      const n = [];
      t.nursingLeftMinutes > 0 && n.push(`L ${O(t.nursingLeftMinutes)}`), t.nursingRightMinutes > 0 && n.push(`R ${O(t.nursingRightMinutes)}`), e.push(d`
                <span class="chip"
                    ><span class="chip-label">Nursing</span>
                    ${O(t.nursingMinutes)}
                    <span class="chip-detail">(${n.join(" · ")})</span></span
                >
            `);
    }
    return t.pumpingMl > 0 && e.push(d`
                <span class="chip"
                    ><span class="chip-label">Pumping</span>
                    ${Wt(t.pumpingMl)}</span
                >
            `), t.solidsCount > 0 && e.push(d`
                <span class="chip"
                    ><span class="chip-label">Solids</span>
                    ${t.solidsCount}</span
                >
            `), t.tummyMinutes > 0 && e.push(d`
                <span class="chip"
                    ><span class="chip-label">Tummy time</span>
                    ${O(t.tummyMinutes)}</span
                >
            `), t.walkCount > 0 && e.push(d`
                <span class="chip"
                    ><span class="chip-label">Walks</span> ${t.walkCount}
                    <span class="chip-detail"
                        >· ${O(t.walkMinutes)}</span
                    ></span
                >
            `), t.medCount > 0 && e.push(d`
                <span class="chip"
                    ><span class="chip-label">Meds</span>
                    ${t.medCount}</span
                >
            `), t.vaccineCount > 0 && e.push(d`
                <span class="chip"
                    ><span class="chip-label">Vaccines</span>
                    ${t.vaccineCount}</span
                >
            `), d`<div class="chips" aria-label="Day summary">
            ${e}
        </div>`;
  }
  render() {
    if (!this.hass || !this._config) return d``;
    const t = this._date === Dt(/* @__PURE__ */ new Date()), e = xi(this._entries);
    return d`
            <ha-card>
                <h2>History — ${En(this._date)}</h2>
                <div class="nav">
                    <button
                        type="button"
                        aria-label="Previous day"
                        @click=${() => this._go(-1)}
                    >
                        ‹
                    </button>
                    <input
                        type="date"
                        aria-label="Pick a date"
                        .value=${this._date}
                        @change=${this._onDateChange}
                    />
                    <button
                        type="button"
                        aria-label="Next day"
                        @click=${() => this._go(1)}
                    >
                        ›
                    </button>
                    <span class="spacer"></span>
                    <button
                        type="button"
                        ?disabled=${t}
                        @click=${this._today}
                    >
                        Today
                    </button>
                </div>
                ${this._entries.length === 0 ? d`<p class="empty">Nothing logged on this day.</p>` : d`
                          ${this._renderChips(e)}
                          <ul class="entries">
                              ${this._entries.map(
      (i) => Ue(
        this.hass,
        i,
        this._requestEdit,
        this._expandedNotes,
        this._toggleNotes
      )
    )}
                          </ul>
                      `}
            </ha-card>
            ${ie(
      this.hass,
      this._modal,
      void 0,
      this._submitModal,
      this._callService,
      this._closeModal,
      this._requestDelete
    )}
        `;
  }
  static getStubConfig() {
    return { type: "custom:babytracker-history-card", baby: "ava" };
  }
};
V.styles = F`
        :host {
            display: block;
            font-family: var(--primary-font-family, system-ui);
        }
        ha-card {
            padding: 16px;
        }
        h2 {
            font-size: 1.15rem;
            margin: 0 0 8px;
            color: var(--primary-text-color);
        }
        .nav {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 12px;
        }
        .nav .spacer {
            flex: 1;
        }
        .nav input[type="date"] {
            padding: 6px 8px;
            border-radius: 6px;
            border: 1px solid var(--divider-color);
            background: var(--card-background-color, var(--secondary-background-color));
            color: var(--primary-text-color);
            font: inherit;
        }
        button {
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color);
            padding: 6px 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        button.primary {
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
            border-color: transparent;
        }
        button.danger {
            background: var(--error-color, #c62828);
            color: var(--text-primary-color, #fff);
            border-color: transparent;
            padding: 8px 14px;
        }
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .empty {
            color: var(--secondary-text-color);
            font-size: 0.95rem;
            padding: 12px 0;
        }
        .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin: 0 0 12px;
        }
        .chip {
            display: inline-flex;
            align-items: baseline;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 999px;
            background: var(--secondary-background-color);
            border: 1px solid var(--divider-color);
            font-size: 0.85rem;
            line-height: 1.2;
            color: var(--primary-text-color);
        }
        .chip .chip-label {
            color: var(--secondary-text-color);
        }
        .chip .chip-detail {
            color: var(--secondary-text-color);
            font-size: 0.78rem;
        }
        ul.entries {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        ul.entries li {
            display: flex;
            flex-direction: column;
            gap: 2px;
            padding: 6px 0;
            border-bottom: 1px solid var(--divider-color);
        }
        ul.entries li .entry-row {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            column-gap: 8px;
            row-gap: 2px;
        }
        ul.entries li .entry-notes {
            font-size: 0.85rem;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            border-radius: 4px;
        }
        ul.entries li .entry-notes:focus-visible {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        ul.entries li .entry-notes.expanded {
            white-space: pre-wrap;
            overflow: visible;
            text-overflow: clip;
        }
        ul.entries li .entry-photo {
            margin-top: 4px;
            line-height: 0;
        }
        ul.entries li.clickable {
            cursor: pointer;
            border-radius: 4px;
            margin: 0 -4px;
            padding: 6px 4px;
        }
        ul.entries li.clickable:hover,
        ul.entries li.clickable:focus-visible {
            background: var(--secondary-background-color);
            outline: none;
        }
        .muted {
            color: var(--secondary-text-color);
            font-size: 0.85rem;
        }
        ${Ke}
    `;
at([
  M({ attribute: !1 })
], V.prototype, "hass", 2);
at([
  S()
], V.prototype, "_config", 2);
at([
  S()
], V.prototype, "_date", 2);
at([
  S()
], V.prototype, "_entries", 2);
at([
  S()
], V.prototype, "_modal", 2);
at([
  S()
], V.prototype, "_expandedNotes", 2);
V = at([
  G("babytracker-history-card")
], V);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-history-card",
  name: "babytracker — history",
  description: "Paginate through one baby's entries by calendar day with edit + delete."
});
var Pn = Object.defineProperty, Mn = Object.getOwnPropertyDescriptor, J = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? Mn(e, i) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (r = (n ? s(e, i, r) : s(r)) || r);
  return n && r && Pn(e, i, r), r;
};
const Tn = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "recent",
  "importer_sync"
];
let H = class extends N {
  constructor() {
    super(...arguments), this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._handleService = async (t, e, i) => {
      const n = i instanceof HTMLElement && i.classList.contains("quick") ? i : null;
      try {
        const r = await gi(this.hass, "babytracker", t, e);
        return n && (n.classList.add("logged"), setTimeout(() => n.classList.remove("logged"), 700)), this.requestUpdate(), r;
      } catch (r) {
        throw console.warn("babytracker: service call failed", t, r), r;
      }
    }, this._requestModal = (t) => {
      const e = this._baby();
      if (typeof t == "string") {
        const r = {
          diaper: "logging a diaper",
          bottle: "logging a bottle",
          solids: "logging solids",
          other: "logging this"
        };
        this._interceptIfSleeping(r[t], () => {
          if (t === "bottle") {
            const o = this._lastBottle();
            this._modal = {
              kind: "bottle",
              baby: e,
              lastAmount: o == null ? void 0 : o.amount,
              lastUnit: o == null ? void 0 : o.unit
            };
          } else
            this._modal = { kind: t, baby: e };
        });
        return;
      }
      const i = {
        sleep: "logging another sleep session",
        tummy_time: "starting tummy time",
        walk: "starting a walk",
        feeding: "starting a feeding session"
      }, n = () => {
        this._modal = {
          kind: "session",
          baby: e,
          activity: t.activity,
          method: t.method
        };
      };
      if (t.activity === "sleep") {
        n();
        return;
      }
      this._interceptIfSleeping(i[t.activity], n);
    }, this._requestDelete = (t) => {
      if (!t.source || t.source === "user") {
        this._handleService("delete_entry", { entry_id: t.id });
        return;
      }
      this._modal = {
        kind: "confirm_delete_imported",
        entryId: t.id,
        entryType: t.type ?? "entry",
        source: t.source,
        staff: t.staff ?? null
      };
    }, this._requestEdit = (t) => {
      this._modal = { kind: "edit_entry", entry: t };
    }, this._toggleNotes = (t) => {
      const e = new Set(this._expandedNotes);
      e.has(t) ? e.delete(t) : e.add(t), this._expandedNotes = e;
    }, this._closeModal = () => {
      this._modal = null;
    }, this._submitModal = async (t, e) => {
      await this._handleService(t, e), this._closeModal();
    };
  }
  setConfig(t) {
    if (!(t != null && t.baby)) throw new Error("babytracker-card: 'baby' is required");
    this._config = { ...t };
  }
  getCardSize() {
    return 6;
  }
  connectedCallback() {
    super.connectedCallback(), this._maybeSubscribe(), this._clockTimer == null && (this._clockTimer = setInterval(() => this.requestUpdate(), 3e4));
  }
  disconnectedCallback() {
    var t, e;
    (t = this._unsubBaby) == null || t.call(this), (e = this._unsubOptions) == null || e.call(this), this._unsubBaby = void 0, this._unsubOptions = void 0, this._clockTimer != null && (clearInterval(this._clockTimer), this._clockTimer = void 0), super.disconnectedCallback();
  }
  updated(t) {
    var e;
    (t.has("hass") || t.has("_config")) && this._maybeSubscribe(), t.has("_modal") && (this._modal && this._dialog && !this._dialog.open ? this._dialog.showModal() : !this._modal && ((e = this._dialog) != null && e.open) && this._dialog.close());
  }
  _maybeSubscribe() {
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = mi(
      this.hass,
      this._config.baby,
      (t) => {
        this._babyConfig = t;
      }
    )), this._unsubOptions || (this._unsubOptions = ze(
      this.hass,
      (t) => {
        this._options = t;
      }
    )));
  }
  get _sections() {
    var t;
    return ((t = this._config) == null ? void 0 : t.sections) ?? Tn;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(t, e = "sensor") {
    return D(this._baby(), t, e);
  }
  /** Status chip fragments (no wrapper). Caller wraps these together
   *  with the 24 h chips inside a single `.chips` flex row so the two
   *  groups flow continuously instead of breaking onto separate
   *  lines.
   */
  _renderStatusChips() {
    var c, h, u, g, f, m, v, b, w, $, x, y, p;
    const t = this.hass, e = (h = (c = t.states) == null ? void 0 : c[this._entityId("last_diaper")]) == null ? void 0 : h.state, i = ((g = (u = t.states) == null ? void 0 : u[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : g.state) === "on", n = ((m = (f = t.states) == null ? void 0 : f[this._entityId("walking", "binary_sensor")]) == null ? void 0 : m.state) === "on", r = ((b = (v = t.states) == null ? void 0 : v[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : b.state) === "on", o = ((x = ($ = (w = t.states) == null ? void 0 : w[this._entityId("recent_entries")]) == null ? void 0 : $.attributes) == null ? void 0 : x.entries) ?? [], s = i ? null : ki(o), a = (y = o.find(
      (_) => {
        var k;
        return (_ == null ? void 0 : _.type) === "feeding" && ((k = _ == null ? void 0 : _.data) == null ? void 0 : k.method) === "bottle";
      }
    )) == null ? void 0 : y.timestamp, l = (p = o.find(
      (_) => {
        var k;
        return (_ == null ? void 0 : _.type) === "feeding" && ((k = _ == null ? void 0 : _.data) == null ? void 0 : k.method) === "solids";
      }
    )) == null ? void 0 : p.timestamp;
    return d`
            <div class="chip" role="listitem">
                Last bottle: ${this._timeSince(a)}
            </div>
            <div class="chip" role="listitem">
                Last solids: ${this._timeSince(l)}
            </div>
            <div class="chip" role="listitem">
                Last diaper: ${this._timeSince(e)}
            </div>
            ${s !== null ? d`<div class="chip" role="listitem">
                      Awake for: ${O(s)}
                  </div>` : ""}
            ${i ? d`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
            ${n ? d`<div class="chip warning" role="listitem">On a walk</div>` : ""}
            ${r ? d`<div class="chip warning" role="listitem">At daycare</div>` : ""}
        `;
  }
  _timeSince(t) {
    if (!t || t === "unknown" || t === "unavailable") return "—";
    const e = Date.parse(t);
    if (Number.isNaN(e)) return "—";
    const i = Math.floor((Date.now() - e) / 6e4);
    if (i < 1) return "now";
    if (i < 60) return `${i}m`;
    const n = Math.floor(i / 60);
    return n < 24 ? `${n}h ${i % 60}m` : `${Math.floor(n / 24)}d`;
  }
  _isSleeping() {
    var t, e, i;
    return ((i = (e = (t = this.hass) == null ? void 0 : t.states) == null ? void 0 : e[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : i.state) === "on";
  }
  _lastBottle() {
    var i, n, r, o, s, a, l;
    const t = (n = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : n[this._entityId("recent_entries")], e = ((r = t == null ? void 0 : t.attributes) == null ? void 0 : r.entries) ?? [];
    for (const c of e)
      if ((c == null ? void 0 : c.type) === "feeding" && ((o = c == null ? void 0 : c.data) == null ? void 0 : o.method) === "bottle" && typeof ((s = c == null ? void 0 : c.data) == null ? void 0 : s.amount) == "number" && (((a = c == null ? void 0 : c.data) == null ? void 0 : a.unit) === "ml" || ((l = c == null ? void 0 : c.data) == null ? void 0 : l.unit) === "oz"))
        return { amount: c.data.amount, unit: c.data.unit };
  }
  _interceptIfSleeping(t, e) {
    var i;
    if (!this._isSleeping()) return e();
    this._modal = {
      kind: "end_sleep_first",
      baby: this._baby(),
      babyName: (i = this._babyConfig) == null ? void 0 : i.name,
      label: t,
      then: e
    };
  }
  render() {
    var n;
    if (!this.hass || !this._config) return d``;
    const t = this._sections, e = t.includes("status"), i = t.includes("today");
    return d`
            <ha-card>
                <h2>${Zt(((n = this._babyConfig) == null ? void 0 : n.name) ?? this._baby())}</h2>
                ${e || i ? d`<div
                          class="chips"
                          role="list"
                          aria-label="Status and last 24 hours"
                      >
                          ${e ? this._renderStatusChips() : ""}
                          ${i ? zi(
      this.hass,
      this._baby(),
      this._babyConfig
    ) : ""}
                      </div>` : ""}
                ${t.includes("active_session") ? Ci(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${t.includes("quick_log") ? vi(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${t.includes("growth") ? Be(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${t.includes("recent") ? Mi(
      this.hass,
      this._baby(),
      this._requestEdit,
      this._config.recent_limit ?? 50,
      this._expandedNotes,
      this._toggleNotes
    ) : ""}
                ${t.includes("importer_sync") ? Hi(
      this._babyConfig,
      this._baby(),
      this._handleService
    ) : ""}
                ${t.includes("export") ? Ve(this.hass, this._baby()) : ""}
            </ha-card>
            ${ie(
      this.hass,
      this._modal,
      this._options,
      this._submitModal,
      (r, o) => this._handleService(r, o),
      this._closeModal,
      this._requestDelete
    )}
        `;
  }
};
H.styles = F`
        :host {
            display: block;
            font-family: var(--primary-font-family, system-ui);
        }
        ha-card {
            padding: 16px;
        }
        h2 {
            font-size: 1.15rem;
            margin: 0 0 8px;
            color: var(--primary-text-color);
        }
        .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 12px;
        }
        .chip {
            padding: 6px 10px;
            border-radius: 16px;
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            font-size: 0.85rem;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .chip.warning {
            background: var(--warning-color);
            color: var(--text-primary-color, #fff);
        }
        .section {
            margin-top: 12px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        }
        .quick-log-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px 0;
        }
        .spinner {
            width: 18px;
            height: 18px;
            border: 2px solid var(--divider-color, #888);
            border-top-color: var(--primary-color);
            border-radius: 50%;
            animation: bt-spin 0.8s linear infinite;
        }
        @keyframes bt-spin {
            to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
            .spinner { animation: none; }
        }
        .growth-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
        }
        .label {
            font-size: 0.85rem;
            color: var(--secondary-text-color);
        }
        button {
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color);
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
        }
        button.primary {
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
            border-color: transparent;
            padding: 8px 14px;
        }
        button.quick {
            padding: 14px 12px;
            font-weight: 600;
        }
        @keyframes bt-flash {
            0%   { background: var(--success-color, #43a047); color: #fff; }
            70%  { background: var(--success-color, #43a047); color: #fff; }
            100% { background: var(--secondary-background-color); color: var(--primary-text-color); }
        }
        button.quick.logged {
            animation: bt-flash 700ms ease-out;
        }
        svg {
            width: 100%;
            height: 120px;
            margin-top: 8px;
        }
        ul.entries {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        ul.entries li {
            display: flex;
            flex-direction: column;
            gap: 2px;
            padding: 6px 0;
            border-bottom: 1px solid var(--divider-color);
        }
        ul.entries li .entry-row {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            column-gap: 8px;
            row-gap: 2px;
        }
        ul.entries li .entry-notes {
            font-size: 0.85rem;
            padding-left: 0;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            border-radius: 4px;
        }
        ul.entries li .entry-notes:focus-visible {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        ul.entries li .entry-notes.expanded {
            white-space: pre-wrap;
            overflow: visible;
            text-overflow: clip;
        }
        ul.entries li .entry-photo {
            margin-top: 4px;
            line-height: 0;
        }
        ul.entries li.clickable {
            cursor: pointer;
            border-radius: 4px;
            margin: 0 -4px;
            padding: 6px 4px;
        }
        ul.entries li.clickable:hover,
        ul.entries li.clickable:focus-visible {
            background: var(--secondary-background-color);
            outline: none;
        }
        button.danger {
            background: var(--error-color, #c62828);
            color: var(--text-primary-color, #fff);
            border-color: transparent;
            padding: 8px 14px;
        }
        button.icon {
            background: transparent;
            border: none;
            padding: 0;
            width: 24px;
            height: 24px;
            line-height: 1;
            font-size: 1.1rem;
            color: var(--secondary-text-color);
            border-radius: 4px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        button.icon:hover {
            color: var(--primary-text-color);
            background: var(--secondary-background-color);
        }
        .muted {
            color: var(--secondary-text-color);
            font-size: 0.85rem;
        }
        .spacer {
            flex: 1;
        }
        dialog {
            border: none;
            border-radius: 12px;
            padding: 16px;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color);
            max-width: 360px;
            width: 90vw;
        }
        dialog::backdrop {
            background: rgba(0, 0, 0, 0.4);
        }
        dialog form {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        dialog label {
            font-size: 0.9rem;
            color: var(--primary-text-color);
        }
        dialog input,
        dialog select,
        dialog textarea {
            padding: 8px;
            border-radius: 8px;
            border: 1px solid var(--divider-color);
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            font: inherit;
        }
        dialog .actions {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            margin-top: 8px;
        }
        dialog .dt-row {
            display: flex;
            gap: 6px;
            align-items: stretch;
        }
        dialog .dt-row input {
            flex: 1;
            min-width: 0;
        }
        dialog .dt-row .now-btn {
            padding: 4px 10px;
            font-size: 0.85rem;
            white-space: nowrap;
        }
        dialog .quick-other {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        dialog .quick-other button.quick {
            padding: 8px 12px;
            font-weight: 500;
            flex: 0 0 auto;
        }
    `;
J([
  M({ attribute: !1 })
], H.prototype, "hass", 2);
J([
  S()
], H.prototype, "_config", 2);
J([
  S()
], H.prototype, "_babyConfig", 2);
J([
  S()
], H.prototype, "_options", 2);
J([
  S()
], H.prototype, "_modal", 2);
J([
  S()
], H.prototype, "_expandedNotes", 2);
J([
  He("dialog")
], H.prototype, "_dialog", 2);
H = J([
  G("babytracker-card")
], H);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => Rn);
var Nn = Object.defineProperty, On = Object.getOwnPropertyDescriptor, ne = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? On(e, i) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (r = (n ? s(e, i, r) : s(r)) || r);
  return n && r && Nn(e, i, r), r;
};
let rt = class extends N {
  setConfig(t) {
    this._config = { ...t };
  }
  _valueChanged(t, e) {
    const i = { ...this._config, [t]: e };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: i },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    return d`
            <label for="baby">Baby slug</label>
            <input
                id="baby"
                aria-label="Baby slug"
                .value=${this._config.baby ?? ""}
                @change=${(t) => this._valueChanged(
      "baby",
      t.target.value
    )}
            />
            <label for="recent_limit">Recent entries to show</label>
            <input
                id="recent_limit"
                type="number"
                min="1"
                max="120"
                aria-label="Recent entries to show"
                .value=${String(this._config.recent_limit ?? 10)}
                @change=${(t) => this._valueChanged(
      "recent_limit",
      Number(t.target.value)
    )}
            />
        `;
  }
};
rt.styles = F`
        :host {
            display: block;
            padding: 12px;
        }
        label {
            display: block;
            font-size: 0.9rem;
            margin: 8px 0 4px;
            color: var(--primary-text-color);
        }
        input,
        select {
            width: 100%;
            padding: 6px 8px;
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color);
            border-radius: 6px;
        }
    `;
ne([
  M({ attribute: !1 })
], rt.prototype, "hass", 2);
ne([
  M({ attribute: !1 })
], rt.prototype, "_config", 2);
rt = ne([
  G("babytracker-card-editor")
], rt);
rt.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const Rn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return rt;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  H as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
