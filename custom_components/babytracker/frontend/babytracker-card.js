/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Pt = globalThis, Yt = Pt.ShadowRoot && (Pt.ShadyCSS === void 0 || Pt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Gt = Symbol(), oe = /* @__PURE__ */ new WeakMap();
let Me = class {
  constructor(e, i, n) {
    if (this._$cssResult$ = !0, n !== Gt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (Yt && e === void 0) {
      const n = i !== void 0 && i.length === 1;
      n && (e = oe.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && oe.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ge = (t) => new Me(typeof t == "string" ? t : t + "", void 0, Gt), q = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((n, o, s) => n + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + t[s + 1], t[0]);
  return new Me(i, t, Gt);
}, Xe = (t, e) => {
  if (Yt) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const n = document.createElement("style"), o = Pt.litNonce;
    o !== void 0 && n.setAttribute("nonce", o), n.textContent = i.cssText, t.appendChild(n);
  }
}, re = Yt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const n of e.cssRules) i += n.cssText;
  return Ge(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ze, defineProperty: Qe, getOwnPropertyDescriptor: Je, getOwnPropertyNames: ti, getOwnPropertySymbols: ei, getPrototypeOf: ii } = Object, G = globalThis, se = G.trustedTypes, ni = se ? se.emptyScript : "", Ot = G.reactiveElementPolyfillSupport, _t = (t, e) => t, Et = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? ni : null;
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
} }, Xt = (t, e) => !Ze(t, e), ae = { attribute: !0, type: String, converter: Et, reflect: !1, useDefault: !1, hasChanged: Xt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), G.litPropertyMetadata ?? (G.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let dt = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = ae) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const n = Symbol(), o = this.getPropertyDescriptor(e, n, i);
      o !== void 0 && Qe(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, i, n) {
    const { get: o, set: s } = Je(this.prototype, e) ?? { get() {
      return this[i];
    }, set(r) {
      this[i] = r;
    } };
    return { get: o, set(r) {
      const a = o == null ? void 0 : o.call(this);
      s == null || s.call(this, r), this.requestUpdate(e, a, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ae;
  }
  static _$Ei() {
    if (this.hasOwnProperty(_t("elementProperties"))) return;
    const e = ii(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(_t("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(_t("properties"))) {
      const i = this.properties, n = [...ti(i), ...ei(i)];
      for (const o of n) this.createProperty(o, i[o]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [n, o] of i) this.elementProperties.set(n, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, n] of this.elementProperties) {
      const o = this._$Eu(i, n);
      o !== void 0 && this._$Eh.set(o, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const o of n) i.unshift(re(o));
    } else e !== void 0 && i.push(re(e));
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
    return Xe(e, this.constructor.elementStyles), e;
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
    var s;
    const n = this.constructor.elementProperties.get(e), o = this.constructor._$Eu(e, n);
    if (o !== void 0 && n.reflect === !0) {
      const r = (((s = n.converter) == null ? void 0 : s.toAttribute) !== void 0 ? n.converter : Et).toAttribute(i, n.type);
      this._$Em = e, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(e, i) {
    var s, r;
    const n = this.constructor, o = n._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const a = n.getPropertyOptions(o), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((s = a.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? a.converter : Et;
      this._$Em = o;
      const c = l.fromAttribute(i, a.type);
      this[o] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(o)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, i, n, o = !1, s) {
    var r;
    if (e !== void 0) {
      const a = this.constructor;
      if (o === !1 && (s = this[e]), n ?? (n = a.getPropertyOptions(e)), !((n.hasChanged ?? Xt)(s, i) || n.useDefault && n.reflect && s === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(a._$Eu(e, n)))) return;
      this.C(e, i, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: n, reflect: o, wrapped: s }, r) {
    n && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? i ?? this[e]), s !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (i = void 0), this._$AL.set(e, i)), o === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [s, r] of this._$Ep) this[s] = r;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [s, r] of o) {
        const { wrapped: a } = r, l = this[s];
        a !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, r, l);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (n = this._$EO) == null || n.forEach((o) => {
        var s;
        return (s = o.hostUpdate) == null ? void 0 : s.call(o);
      }), this.update(i)) : this._$EM();
    } catch (o) {
      throw e = !1, this._$EM(), o;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var i;
    (i = this._$EO) == null || i.forEach((n) => {
      var o;
      return (o = n.hostUpdated) == null ? void 0 : o.call(n);
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
dt.elementStyles = [], dt.shadowRootOptions = { mode: "open" }, dt[_t("elementProperties")] = /* @__PURE__ */ new Map(), dt[_t("finalized")] = /* @__PURE__ */ new Map(), Ot == null || Ot({ ReactiveElement: dt }), (G.reactiveElementVersions ?? (G.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const vt = globalThis, le = (t) => t, Mt = vt.trustedTypes, ce = Mt ? Mt.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Te = "$lit$", K = `lit$${Math.random().toFixed(9).slice(2)}$`, Ne = "?" + K, oi = `<${Ne}>`, rt = document, yt = () => rt.createComment(""), $t = (t) => t === null || typeof t != "object" && typeof t != "function", Zt = Array.isArray, ri = (t) => Zt(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Lt = `[ 	
\f\r]`, mt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, de = /-->/g, ue = />/g, it = RegExp(`>|${Lt}(?:([^\\s"'>=/]+)(${Lt}*=${Lt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, he = /"/g, Re = /^(?:script|style|textarea|title)$/i, Oe = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), d = Oe(1), I = Oe(2), ut = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), be = /* @__PURE__ */ new WeakMap(), nt = rt.createTreeWalker(rt, 129);
function Le(t, e) {
  if (!Zt(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ce !== void 0 ? ce.createHTML(e) : e;
}
const si = (t, e) => {
  const i = t.length - 1, n = [];
  let o, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = mt;
  for (let a = 0; a < i; a++) {
    const l = t[a];
    let c, h, u = -1, g = 0;
    for (; g < l.length && (r.lastIndex = g, h = r.exec(l), h !== null); ) g = r.lastIndex, r === mt ? h[1] === "!--" ? r = de : h[1] !== void 0 ? r = ue : h[2] !== void 0 ? (Re.test(h[2]) && (o = RegExp("</" + h[2], "g")), r = it) : h[3] !== void 0 && (r = it) : r === it ? h[0] === ">" ? (r = o ?? mt, u = -1) : h[1] === void 0 ? u = -2 : (u = r.lastIndex - h[2].length, c = h[1], r = h[3] === void 0 ? it : h[3] === '"' ? he : pe) : r === he || r === pe ? r = it : r === de || r === ue ? r = mt : (r = it, o = void 0);
    const f = r === it && t[a + 1].startsWith("/>") ? " " : "";
    s += r === mt ? l + oi : u >= 0 ? (n.push(c), l.slice(0, u) + Te + l.slice(u) + K + f) : l + K + (u === -2 ? a : f);
  }
  return [Le(t, s + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), n];
};
class wt {
  constructor({ strings: e, _$litType$: i }, n) {
    let o;
    this.parts = [];
    let s = 0, r = 0;
    const a = e.length - 1, l = this.parts, [c, h] = si(e, i);
    if (this.el = wt.createElement(c, n), nt.currentNode = this.el.content, i === 2 || i === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (o = nt.nextNode()) !== null && l.length < a; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const u of o.getAttributeNames()) if (u.endsWith(Te)) {
          const g = h[r++], f = o.getAttribute(u).split(K), m = /([.?@])?(.*)/.exec(g);
          l.push({ type: 1, index: s, name: m[2], strings: f, ctor: m[1] === "." ? li : m[1] === "?" ? ci : m[1] === "@" ? di : Nt }), o.removeAttribute(u);
        } else u.startsWith(K) && (l.push({ type: 6, index: s }), o.removeAttribute(u));
        if (Re.test(o.tagName)) {
          const u = o.textContent.split(K), g = u.length - 1;
          if (g > 0) {
            o.textContent = Mt ? Mt.emptyScript : "";
            for (let f = 0; f < g; f++) o.append(u[f], yt()), nt.nextNode(), l.push({ type: 2, index: ++s });
            o.append(u[g], yt());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Ne) l.push({ type: 2, index: s });
      else {
        let u = -1;
        for (; (u = o.data.indexOf(K, u + 1)) !== -1; ) l.push({ type: 7, index: s }), u += K.length - 1;
      }
      s++;
    }
  }
  static createElement(e, i) {
    const n = rt.createElement("template");
    return n.innerHTML = e, n;
  }
}
function pt(t, e, i = t, n) {
  var r, a;
  if (e === ut) return e;
  let o = n !== void 0 ? (r = i._$Co) == null ? void 0 : r[n] : i._$Cl;
  const s = $t(e) ? void 0 : e._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== s && ((a = o == null ? void 0 : o._$AO) == null || a.call(o, !1), s === void 0 ? o = void 0 : (o = new s(t), o._$AT(t, i, n)), n !== void 0 ? (i._$Co ?? (i._$Co = []))[n] = o : i._$Cl = o), o !== void 0 && (e = pt(t, o._$AS(t, e.values), o, n)), e;
}
class ai {
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
    const { el: { content: i }, parts: n } = this._$AD, o = ((e == null ? void 0 : e.creationScope) ?? rt).importNode(i, !0);
    nt.currentNode = o;
    let s = nt.nextNode(), r = 0, a = 0, l = n[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let c;
        l.type === 2 ? c = new St(s, s.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(s, l.name, l.strings, this, e) : l.type === 6 && (c = new ui(s, this, e)), this._$AV.push(c), l = n[++a];
      }
      r !== (l == null ? void 0 : l.index) && (s = nt.nextNode(), r++);
    }
    return nt.currentNode = rt, o;
  }
  p(e) {
    let i = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, i), i += n.strings.length - 2) : n._$AI(e[i])), i++;
  }
}
class St {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, i, n, o) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = n, this.options = o, this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0;
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
    e = pt(this, e, i), $t(e) ? e === A || e == null || e === "" ? (this._$AH !== A && this._$AR(), this._$AH = A) : e !== this._$AH && e !== ut && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ri(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== A && $t(this._$AH) ? this._$AA.nextSibling.data = e : this.T(rt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var s;
    const { values: i, _$litType$: n } = e, o = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = wt.createElement(Le(n.h, n.h[0]), this.options)), n);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === o) this._$AH.p(i);
    else {
      const r = new ai(o, this), a = r.u(this.options);
      r.p(i), this.T(a), this._$AH = r;
    }
  }
  _$AC(e) {
    let i = be.get(e.strings);
    return i === void 0 && be.set(e.strings, i = new wt(e)), i;
  }
  k(e) {
    Zt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let n, o = 0;
    for (const s of e) o === i.length ? i.push(n = new St(this.O(yt()), this.O(yt()), this, this.options)) : n = i[o], n._$AI(s), o++;
    o < i.length && (this._$AR(n && n._$AB.nextSibling, o), i.length = o);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, i); e !== this._$AB; ) {
      const o = le(e).nextSibling;
      le(e).remove(), e = o;
    }
  }
  setConnected(e) {
    var i;
    this._$AM === void 0 && (this._$Cv = e, (i = this._$AP) == null || i.call(this, e));
  }
}
class Nt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, n, o, s) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = e, this.name = i, this._$AM = o, this.options = s, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = A;
  }
  _$AI(e, i = this, n, o) {
    const s = this.strings;
    let r = !1;
    if (s === void 0) e = pt(this, e, i, 0), r = !$t(e) || e !== this._$AH && e !== ut, r && (this._$AH = e);
    else {
      const a = e;
      let l, c;
      for (e = s[0], l = 0; l < s.length - 1; l++) c = pt(this, a[n + l], i, l), c === ut && (c = this._$AH[l]), r || (r = !$t(c) || c !== this._$AH[l]), c === A ? e = A : e !== A && (e += (c ?? "") + s[l + 1]), this._$AH[l] = c;
    }
    r && !o && this.j(e);
  }
  j(e) {
    e === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class li extends Nt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === A ? void 0 : e;
  }
}
class ci extends Nt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== A);
  }
}
class di extends Nt {
  constructor(e, i, n, o, s) {
    super(e, i, n, o, s), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = pt(this, e, i, 0) ?? A) === ut) return;
    const n = this._$AH, o = e === A && n !== A || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, s = e !== A && (n === A || o);
    o && this.element.removeEventListener(this.name, this, n), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ui {
  constructor(e, i, n) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    pt(this, e);
  }
}
const Ut = vt.litHtmlPolyfillSupport;
Ut == null || Ut(wt, St), (vt.litHtmlVersions ?? (vt.litHtmlVersions = [])).push("3.3.3");
const pi = (t, e, i) => {
  const n = (i == null ? void 0 : i.renderBefore) ?? e;
  let o = n._$litPart$;
  if (o === void 0) {
    const s = (i == null ? void 0 : i.renderBefore) ?? null;
    n._$litPart$ = o = new St(e.insertBefore(yt(), s), s, void 0, i ?? {});
  }
  return o._$AI(t), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot = globalThis;
class N extends dt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = pi(i, this.renderRoot, this.renderOptions);
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
    return ut;
  }
}
var Ee;
N._$litElement$ = !0, N.finalized = !0, (Ee = ot.litElementHydrateSupport) == null || Ee.call(ot, { LitElement: N });
const zt = ot.litElementPolyfillSupport;
zt == null || zt({ LitElement: N });
(ot.litElementVersions ?? (ot.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const hi = { attribute: !0, type: String, converter: Et, reflect: !1, hasChanged: Xt }, bi = (t = hi, e, i) => {
  const { kind: n, metadata: o } = i;
  let s = globalThis.litPropertyMetadata.get(o);
  if (s === void 0 && globalThis.litPropertyMetadata.set(o, s = /* @__PURE__ */ new Map()), n === "setter" && ((t = Object.create(t)).wrapped = !0), s.set(i.name, t), n === "accessor") {
    const { name: r } = i;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(r, l, t, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(r, void 0, t, a), a;
    } };
  }
  if (n === "setter") {
    const { name: r } = i;
    return function(a) {
      const l = this[r];
      e.call(this, a), this.requestUpdate(r, l, t, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function M(t) {
  return (e, i) => typeof i == "object" ? bi(t, e, i) : ((n, o, s) => {
    const r = o.hasOwnProperty(s);
    return o.constructor.createProperty(s, n), r ? Object.getOwnPropertyDescriptor(o, s) : void 0;
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
const gi = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ue(t, e) {
  return (i, n, o) => {
    const s = (r) => {
      var a;
      return ((a = r.renderRoot) == null ? void 0 : a.querySelector(t)) ?? null;
    };
    return gi(i, n, { get() {
      return s(this);
    } });
  };
}
function P(t, e, i = "sensor") {
  return `${i}.babytracker_${t}_${e}`;
}
function ze(t) {
  return typeof t != "string" || t.length === 0 ? "" : t.charAt(0).toUpperCase() + t.slice(1);
}
async function mi(t, e, i, n) {
  return t.callService(e, i, n);
}
function Ct(t, e, i, n) {
  const o = { cancelled: !1 }, s = async (r) => {
    if (!o.cancelled)
      try {
        const a = await t.connection.subscribeMessage(
          i,
          e
        );
        if (o.cancelled) {
          try {
            a();
          } catch {
          }
          return;
        }
        o.unsub = a;
      } catch (a) {
        if (console.warn(`babytracker: ${n} failed (attempt ${r + 1})`, a), o.cancelled) return;
        const l = Math.min(3e4, 1e3 * 2 ** r);
        o.timer = setTimeout(() => {
          o.timer = void 0, s(r + 1);
        }, l);
      }
  };
  return s(0), () => {
    var r;
    o.cancelled = !0, o.timer != null && (clearTimeout(o.timer), o.timer = void 0), (r = o.unsub) == null || r.call(o);
  };
}
function fi(t, e, i) {
  return Ct(
    t,
    { type: "babytracker/get_baby_config", baby: e, subscribe: !0 },
    i,
    "subscribeBabyConfig"
  );
}
function He(t, e) {
  return Ct(
    t,
    { type: "babytracker/get_integration_options", subscribe: !0 },
    e,
    "subscribeIntegrationOptions"
  );
}
function _i(t, e, i, n, o) {
  return Ct(
    t,
    {
      type: "babytracker/list_entries_in_range",
      baby: e,
      start: i,
      end: n,
      subscribe: !0
    },
    o,
    "subscribeEntriesInRange"
  );
}
function vi(t, e, i) {
  return Ct(
    t,
    { type: "babytracker/list_vaccines", baby: e, subscribe: !0 },
    i,
    "subscribeVaccines"
  );
}
function yi(t, e, i) {
  return Ct(
    t,
    { type: "babytracker/list_growth", baby: e, subscribe: !0 },
    i,
    "subscribeGrowth"
  );
}
function $i(t, e, i, n) {
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
  const o = t.enabled_activities ?? [], s = t.enabled_feeding_methods ?? [], r = (c) => c.charAt(0).toUpperCase() + c.slice(1), a = ze(t.name ?? e), l = [];
  if (o.includes("diaper") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log diaper for ${a}"
                    @click=${() => n("diaper")}
                >
                    Diaper
                </button>
            `
  ), o.includes("feeding"))
    for (const c of s)
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
                            ${r(c.replace("_", " "))}
                        </button>
                    `
      );
  return o.includes("sleep") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log sleep for ${a}"
                    @click=${() => n({ activity: "sleep" })}
                >
                    Sleep
                </button>
            `
  ), o.includes("tummy_time") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log tummy time for ${a}"
                    @click=${() => n({ activity: "tummy_time" })}
                >
                    Tummy time
                </button>
            `
  ), o.includes("walk") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log walk for ${a}"
                    @click=${() => n({ activity: "walk" })}
                >
                    Walk
                </button>
            `
  ), o.includes("other") && l.push(
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
const Tt = 29.5735, Ie = 24 * 60 * 60 * 1e3;
function B(t) {
  if (!t) return 0;
  const e = Date.parse(t);
  return Number.isNaN(e) ? 0 : e;
}
function wi(t, e = Ie, i = Date.now()) {
  const n = i - e;
  return t.filter((o) => B(o.timestamp) >= n).slice().sort((o, s) => B(s.timestamp) - B(o.timestamp));
}
function xi(t, e = Date.now(), i = Ie) {
  var c, h, u;
  const n = e - i;
  let o = 0, s = 0, r = 0, a = 0, l = 0;
  for (const g of t) {
    const f = B(g.timestamp);
    if (g.type === "sleep") {
      const m = f, y = g.ended_at != null && g.ended_at !== "" ? B(g.ended_at) : e;
      if (m > 0 && y > m && y > n) {
        const b = Math.max(m, n), w = Math.min(y, e);
        w > b && (l += (w - b) / 6e4);
      }
      continue;
    }
    if (!(f < n)) {
      if (g.type === "feeding") {
        o += 1;
        const m = Number(((c = g.data) == null ? void 0 : c.amount) ?? 0), y = String(((h = g.data) == null ? void 0 : h.unit) ?? "");
        m > 0 && (a += y === "oz" ? m * Tt : m);
      } else if (g.type === "diaper") {
        const m = String(((u = g.data) == null ? void 0 : u.kind) ?? "");
        m === "wet" ? s += 1 : m === "dirty" ? r += 1 : m === "both" && (s += 1, r += 1);
      }
    }
  }
  return { feedings: o, wetDiapers: s, dirtyDiapers: r, totalVolumeMl: a, sleepMinutes: l };
}
function ft(t, e, i) {
  if (t <= 0) return 0;
  const n = e != null && e !== "" ? B(e) : i;
  return n <= t ? 0 : (n - t) / 6e4;
}
function Wt(t, e, i = Date.now()) {
  return ft(B(t), e, i);
}
function ki(t, e = Date.now()) {
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
    const o = B(n.timestamp), s = n.data ?? {};
    switch (n.type) {
      case "diaper": {
        const r = String(s.kind ?? "");
        r === "wet" ? (i.diapers += 1, i.wet += 1) : r === "dirty" ? (i.diapers += 1, i.dirty += 1) : r === "both" && (i.diapers += 1, i.wet += 1, i.dirty += 1);
        break;
      }
      case "sleep": {
        const r = ft(o, n.ended_at, e);
        i.sleepMinutes += r, r > i.longestSleepMinutes && (i.longestSleepMinutes = r);
        break;
      }
      case "feeding": {
        const r = String(s.method ?? "");
        if (r === "bottle") {
          i.bottleFeeds += 1;
          const a = Number(s.amount ?? 0), l = String(s.unit ?? "");
          a > 0 && (i.bottleVolumeMl += l === "oz" ? a * Tt : a);
        } else if (r === "breast_left" || r === "breast_right") {
          const a = ft(o, n.ended_at, e);
          i.nursingMinutes += a, r === "breast_left" ? i.nursingLeftMinutes += a : i.nursingRightMinutes += a;
        } else r === "solids" && (i.solidsCount += 1);
        break;
      }
      case "pumping": {
        const r = Number(s.volume ?? 0), a = String(s.unit ?? "");
        r > 0 && (i.pumpingMl += a === "oz" ? r * Tt : r);
        break;
      }
      case "tummy_time": {
        i.tummyMinutes += ft(o, n.ended_at, e);
        break;
      }
      case "walk": {
        i.walkCount += 1, i.walkMinutes += ft(o, n.ended_at, e);
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
function Si(t, e = Date.now()) {
  let i = null;
  for (const n of t) {
    if ((n == null ? void 0 : n.type) !== "sleep" || !(n != null && n.ended_at)) continue;
    const o = Date.parse(n.ended_at);
    Number.isFinite(o) && (i === null || o > i) && (i = o);
  }
  return i === null ? null : Math.max(0, (e - i) / 6e4);
}
function O(t) {
  if (!Number.isFinite(t) || t <= 0) return "0m";
  if (t < 60) return `${Math.round(t)}m`;
  const e = Math.floor(t / 60), i = Math.round(t % 60);
  return i === 0 ? `${e}h` : `${e}h ${i}m`;
}
function Kt(t) {
  if (!Number.isFinite(t) || t <= 0) return "0 oz";
  const e = t / Tt;
  return e >= 1 ? `${e.toFixed(1)} oz` : `${Math.round(t)} ml`;
}
function Ci(t) {
  const e = String((t == null ? void 0 : t.type) ?? ""), i = (t == null ? void 0 : t.data) ?? {};
  if (e === "other") {
    const r = String(i.name ?? "").trim();
    return ge(r || Ht(e));
  }
  const n = i.method ?? i.kind, o = n != null && n !== "" ? Ht(String(n)) : null, s = ge(Ht(e));
  return o ? e === "feeding" && i.amount != null && i.amount !== "" && i.unit ? `${s} (${o}, ${i.amount} ${i.unit})` : `${s} (${o})` : s;
}
function Ht(t) {
  return t.replace(/_/g, " ");
}
function ge(t) {
  return t && t.charAt(0).toUpperCase() + t.slice(1);
}
function me(t) {
  const e = B(t);
  return e === 0 ? "" : new Date(e).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function Ai(t, e, i) {
  var l, c, h, u, g, f;
  const n = ((l = t.states[P(e, "sleeping", "binary_sensor")]) == null ? void 0 : l.state) === "on", o = ((c = t.states[P(e, "feeding", "binary_sensor")]) == null ? void 0 : c.state) === "on", s = ((h = t.states[P(e, "tummy_time", "binary_sensor")]) == null ? void 0 : h.state) === "on", r = ((u = t.states[P(e, "walking", "binary_sensor")]) == null ? void 0 : u.state) === "on";
  if (!n && !o && !s && !r) return "";
  const a = [];
  if (n) {
    const m = (g = t.states[P(e, "last_sleep_start")]) == null ? void 0 : g.state, y = m ? Wt(m, null) : 0;
    a.push(
      d`
                <div class="chip warning" role="status">
                    Sleeping${m ? d` · started ${fe(m)} ·
                          ${O(y)}` : ""}
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
  if (o && a.push(
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
  ), s && a.push(
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
  ), r) {
    const m = (f = t.states[P(e, "last_walk_start")]) == null ? void 0 : f.state;
    a.push(
      d`
                <div class="chip warning" role="status">
                    Walking ${m ? d`· started ${fe(m)}` : ""}
                    <button
                        aria-label="End walk"
                        @click=${(y) => i("end_walk", { baby: e }, y.currentTarget)}
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
var Pi = Object.defineProperty, Di = Object.getOwnPropertyDescriptor, j = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Di(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && Pi(e, i, o), o;
};
let U = class extends N {
  constructor() {
    super(...arguments), this.photoPath = "", this.videoPath = "", this.size = 128, this._url = "", this._videoUrl = "", this._failed = !1, this._open = !1, this._lastResolved = "", this._lastVideoResolved = "", this._resolveToken = 0, this._videoResolveToken = 0, this._onKeydown = (t) => {
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
    (t.has("hass") || t.has("photoPath")) && this._maybeResolve(), (t.has("hass") || t.has("videoPath")) && this._maybeResolveVideo();
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
  async _maybeResolveVideo() {
    var e;
    if (!((e = this.hass) != null && e.connection) || !this.videoPath) {
      this._videoUrl = "";
      return;
    }
    if (this._lastVideoResolved === this.videoPath && this._videoUrl)
      return;
    this._lastVideoResolved = this.videoPath;
    const t = ++this._videoResolveToken;
    try {
      const i = await this.hass.callWS({
        type: "media_source/resolve_media",
        media_content_id: this.videoPath
      });
      if (t !== this._videoResolveToken) return;
      const n = i == null ? void 0 : i.url;
      typeof n == "string" && n.length > 0 ? this._videoUrl = n : console.warn(
        "babytracker: resolve video returned no url",
        this.videoPath,
        i
      );
    } catch (i) {
      if (t !== this._videoResolveToken) return;
      console.warn(
        "babytracker: resolve video failed",
        this.videoPath,
        i
      );
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
    const t = !!this.videoPath;
    if (this._failed || !this._url)
      return d`<span aria-label=${t ? "Has video" : "Has photo"}
                >${t ? "🎬" : "📷"}</span
            >`;
    const e = `${this.size}px`, i = t ? "Play video" : "View photo";
    return d`
            <button
                class="thumb-btn"
                type="button"
                aria-label=${i}
                title=${i}
                @click=${this._open_lightbox}
            >
                <img
                    class="thumb"
                    src=${this._url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style="max-width:${e};max-height:${e}"
                    @error=${this._onImgError}
                />
                ${t ? d`<span class="play-overlay" aria-hidden="true">▶</span>` : ""}
            </button>
            ${this._open ? d`
                      <div
                          class="lightbox"
                          role="dialog"
                          aria-modal="true"
                          aria-label=${t ? "Entry video" : "Entry photo"}
                          @click=${this._close_lightbox}
                      >
                          <button
                              type="button"
                              class="close"
                              aria-label=${t ? "Close video viewer" : "Close photo viewer"}
                              @click=${this._close_lightbox}
                          >
                              ✕
                          </button>
                          ${t && this._videoUrl ? d`
                                    <video
                                        class="full"
                                        src=${this._videoUrl}
                                        poster=${this._url}
                                        controls
                                        autoplay
                                        playsinline
                                        @click=${(n) => n.stopPropagation()}
                                    ></video>
                                ` : d`
                                    <img
                                        class="full"
                                        src=${this._url}
                                        alt=${t ? "Entry video poster" : "Entry photo"}
                                        @click=${(n) => n.stopPropagation()}
                                    />
                                `}
                      </div>
                  ` : ""}
        `;
  }
};
U.styles = q`
        :host {
            display: inline-flex;
            align-items: center;
        }
        .thumb-btn {
            position: relative;
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
        .play-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            color: #fff;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
            background: linear-gradient(
                rgba(0, 0, 0, 0.08),
                rgba(0, 0, 0, 0.32)
            );
            border-radius: 4px;
            pointer-events: none;
        }
        video.full {
            background: #000;
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
j([
  M({ attribute: !1 })
], U.prototype, "hass", 2);
j([
  M()
], U.prototype, "photoPath", 2);
j([
  M()
], U.prototype, "videoPath", 2);
j([
  M({ type: Number })
], U.prototype, "size", 2);
j([
  S()
], U.prototype, "_url", 2);
j([
  S()
], U.prototype, "_videoUrl", 2);
j([
  S()
], U.prototype, "_failed", 2);
j([
  S()
], U.prototype, "_open", 2);
U = j([
  Z("bt-entry-thumbnail")
], U);
const Ei = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk",
  "other"
]);
function Be(t, e, i, n, o) {
  return d`
        <li
            class="clickable"
            role="button"
            tabindex="0"
            aria-label="Edit entry"
            @click=${() => i(e)}
            @keydown=${(s) => {
    (s.key === "Enter" || s.key === " ") && (s.preventDefault(), i(e));
  }}
        >
            <div class="entry-row">
                <span aria-label="Entry type">${Ci(e)}</span>
                ${Mi(e)}
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
                      @click=${(s) => {
    s.stopPropagation(), o(e.id);
  }}
                      @keydown=${(s) => {
    (s.key === "Enter" || s.key === " ") && (s.preventDefault(), s.stopPropagation(), o(e.id));
  }}
                  >${e.notes}</div>` : ""}
            ${e.photo_path ? d`<div class="entry-photo">
                      <bt-entry-thumbnail
                          .hass=${t}
                          .photoPath=${e.photo_path}
                          .videoPath=${e.video_path ?? ""}
                      ></bt-entry-thumbnail>
                  </div>` : ""}
        </li>
    `;
}
function Mi(t) {
  const e = me(t.timestamp), i = t.type === "sleep", n = Ei.has(String(t.type ?? ""));
  if (i && (!t.ended_at || t.ended_at === t.timestamp)) {
    const o = Wt(t.timestamp, t.ended_at);
    return d`<span class="muted"
            >${e} (${O(o)}, ongoing)</span
        >`;
  }
  if (n && t.ended_at && t.ended_at !== t.timestamp) {
    const o = me(t.ended_at);
    if (i) {
      const s = Wt(
        t.timestamp,
        t.ended_at
      );
      return d`<span class="muted"
                >${e} – ${o} (${O(s)})</span
            >`;
    }
    return d`<span class="muted">${e} – ${o}</span>`;
  }
  return d`<span class="muted">${e}</span>`;
}
function Ti(t, e, i, n, o = /* @__PURE__ */ new Set(), s = () => {
}) {
  var c;
  const r = t.states[P(e, "recent_entries")], a = ((c = r == null ? void 0 : r.attributes) == null ? void 0 : c.entries) ?? [], l = wi(a).slice(0, Math.min(n, 120));
  return d`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${l.length === 0 ? d`<p>Nothing logged yet.</p>` : d`
                      <ul class="entries">
                          ${l.map(
    (h) => Be(
      t,
      h,
      i,
      o,
      s
    )
  )}
                      </ul>
                  `}
        </div>
    `;
}
var Ni = Object.defineProperty, Ri = Object.getOwnPropertyDescriptor, Rt = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Ri(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && Ni(e, i, o), o;
};
let ht = class extends N {
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
ht.styles = q`
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
Rt([
  M()
], ht.prototype, "label", 2);
Rt([
  M({ attribute: !1 })
], ht.prototype, "renderChart", 2);
Rt([
  S()
], ht.prototype, "_open", 2);
ht = Rt([
  Z("bt-chart-lightbox")
], ht);
const _e = [
  { key: "weight", label: "Weight", color: "var(--primary-color, #2563eb)" },
  { key: "height", label: "Height", color: "var(--success-color, #16a34a)" },
  { key: "head", label: "Head", color: "var(--warning-color, #ea580c)" }
];
function Oi(t, e) {
  const i = (t == null ? void 0 : t.data) ?? {}, n = e === "weight" ? i.weight_percentile : e === "height" ? i.height_percentile : i.head_percentile;
  if (n == null) return null;
  const o = Number(n);
  return Number.isFinite(o) ? o : null;
}
function It(t) {
  if (t == null) return "—";
  const e = typeof t == "number" ? t : Number(t);
  return Number.isFinite(e) ? String(Math.round(e * 100) / 100) : String(t);
}
function Bt(t) {
  if (t == null || t === "—") return "—";
  const e = typeof t == "number" ? t : Number(t);
  return Number.isFinite(e) ? `p${Math.round(e)}` : String(t);
}
function Li(t) {
  if (!t) return "";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "" : new Date(e).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function Ve(t, e, i, n, o, s, r, a) {
  var _, k, D, C, E, W;
  const l = (s == null ? void 0 : s.data) ?? {}, c = (n == null ? void 0 : n.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", h = (n == null ? void 0 : n.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", u = l.weight_unit ?? c, g = l.length_unit ?? h, f = l.weight ?? ((_ = t.states[P(e, "weight")]) == null ? void 0 : _.state), m = l.height ?? ((k = t.states[P(e, "height")]) == null ? void 0 : k.state), y = l.head_circumference ?? ((D = t.states[P(e, "head_circumference")]) == null ? void 0 : D.state), b = l.weight_percentile ?? ((C = t.states[P(e, "weight_percentile")]) == null ? void 0 : C.state), w = l.height_percentile ?? ((E = t.states[P(e, "height_percentile")]) == null ? void 0 : E.state), $ = l.head_percentile ?? ((W = t.states[P(e, "head_circumference_percentile")]) == null ? void 0 : W.state), x = Li(s == null ? void 0 : s.timestamp), v = !!(s && r), p = v ? () => r(s) : void 0;
  return d`
        <div class="section" role="region" aria-label="Growth">
            <div
                style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"
            >
                <h2 style="margin:0;">Growth</h2>
                <span style="flex:1;"></span>
                ${o ? d`<button
                          type="button"
                          class="primary"
                          aria-label="Log a growth measurement"
                          @click=${o}
                      >
                          Log measurement
                      </button>` : ""}
            </div>
            <div
                class=${v ? "growth-summary clickable" : "growth-summary"}
                role=${v ? "button" : "group"}
                tabindex=${v ? "0" : "-1"}
                aria-label=${v ? "Edit latest growth measurement" : "Latest growth measurement"}
                @click=${p}
                @keydown=${v ? (ct) => {
    (ct.key === "Enter" || ct.key === " ") && (ct.preventDefault(), p == null || p());
  } : void 0}
            >
                ${x ? d`<div class="growth-date muted">
                          Measured ${x}
                      </div>` : ""}
                <div class="growth-grid">
                    <div>
                        <div class="label">Weight</div>
                        <div>${It(f)} ${u} · ${Bt(b)}</div>
                    </div>
                    <div>
                        <div class="label">Height</div>
                        <div>${It(m)} ${g} · ${Bt(w)}</div>
                    </div>
                    <div>
                        <div class="label">Head</div>
                        <div>${It(y)} ${g} · ${Bt($)}</div>
                    </div>
                </div>
            </div>
            ${Ui(a)}
        </div>
    `;
}
function Ui(t) {
  return ve(t) === "" ? "" : d`
        <bt-chart-lightbox
            label="Percentile over time"
            .renderChart=${() => ve(t)}
        ></bt-chart-lightbox>
    `;
}
function ve(t) {
  if (!Array.isArray(t) || t.length < 2) return "";
  const e = [...t].filter((v) => Number.isFinite(Date.parse(v == null ? void 0 : v.timestamp))).sort((v, p) => Date.parse(v.timestamp) - Date.parse(p.timestamp));
  if (e.length < 2) return "";
  const i = Date.parse(e[0].timestamp), n = Date.parse(e[e.length - 1].timestamp), o = Math.max(1, n - i), s = 320, r = 140, a = 22, l = 8, c = 8, h = 20, u = s - a - l, g = r - c - h, f = (v) => a + (v - i) / o * u, m = (v) => c + (1 - v / 100) * g, y = _e.map((v) => ({
    ...v,
    points: e.map((p) => {
      const _ = Oi(p, v.key);
      return _ === null ? null : { ts: Date.parse(p.timestamp), p: _ };
    }).filter((p) => p !== null)
  }));
  if (y.reduce(
    (v, p) => v + p.points.length,
    0
  ) < 2) return "";
  const w = Vt(e[0].timestamp), $ = Vt(e[e.length - 1].timestamp), x = [10, 50, 90];
  return d`
        <div class="growth-trend">
            <div class="label-row">
                <div class="label">Percentile over time</div>
                <div class="legend">
                    ${_e.map(
    (v) => d`
                            <span class="legend-item">
                                <span
                                    class="swatch"
                                    style=${`background:${v.color}`}
                                ></span>
                                ${v.label}
                            </span>
                        `
  )}
                </div>
            </div>
            <svg
                viewBox="0 0 ${s} ${r}"
                role="img"
                aria-label="Percentile over time"
                style="width:100%;height:${r}px;"
            >
                ${x.map(
    (v) => I`
                        <line
                            x1=${a}
                            x2=${s - l}
                            y1=${m(v)}
                            y2=${m(v)}
                            stroke="var(--divider-color, #888)"
                            stroke-dasharray=${v === 50 ? "" : "2 2"}
                            stroke-width="1"
                        ></line>
                        <text
                            x=${a - 4}
                            y=${m(v) + 3}
                            font-size="8"
                            text-anchor="end"
                            fill="var(--secondary-text-color)"
                        >
                            p${v}
                        </text>
                    `
  )}
                ${y.map((v) => {
    if (v.points.length === 0) return I``;
    const p = v.points.map(
      (_, k) => `${k === 0 ? "M" : "L"}${f(_.ts).toFixed(1)},${m(_.p).toFixed(1)}`
    ).join(" ");
    return I`
                        ${v.points.length > 1 ? I`<path
                                d=${p}
                                fill="none"
                                stroke=${v.color}
                                stroke-width="1.6"
                                stroke-linejoin="round"
                                stroke-linecap="round"
                              ></path>` : ""}
                        ${v.points.map(
      (_) => I`
                                <circle
                                    cx=${f(_.ts)}
                                    cy=${m(_.p)}
                                    r="2.5"
                                    fill=${v.color}
                                >
                                    <title>${v.label} ${Vt(new Date(_.ts).toISOString())}: p${Math.round(_.p)}</title>
                                </circle>
                            `
    )}
                    `;
  })}
                <text
                    x=${a}
                    y=${r - 4}
                    font-size="9"
                    fill="var(--secondary-text-color)"
                >
                    ${w}
                </text>
                <text
                    x=${s - l}
                    y=${r - 4}
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
function Vt(t) {
  if (!t) return "";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "" : new Date(e).toLocaleDateString([], {
    month: "short",
    day: "numeric"
  });
}
function Fe(t, e) {
  return d`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var l;
    const n = /* @__PURE__ */ new Date(), o = new Date(n.getTime() - 90 * 864e5), s = (c) => c.toISOString().slice(0, 10), r = await t.callService(
      "babytracker",
      "export_report",
      { baby: e, format: "html", start: s(o), end: s(n) },
      void 0,
      !1,
      !0
      // return_response
    ), a = (l = r == null ? void 0 : r.response) == null ? void 0 : l.url;
    a && window.open(a, "_blank", "noopener");
  }}
            >
                Export for pediatrician
            </button>
        </div>
    `;
}
function zi(t, e, i) {
  var n;
  return (n = t == null ? void 0 : t.importer) != null && n.source_entity_id ? d`
        <div class="section">
            <button
                aria-label="Resync importers"
                title="Re-read the source sensor's current activities. Already-imported activities are skipped."
                @click=${(o) => i("resync_importers", { baby: e }, o.currentTarget)}
            >
                Sync importers
            </button>
        </div>
    ` : "";
}
function Hi(t, e, i) {
  var r, a;
  const n = (r = t.states) == null ? void 0 : r[P(e, "recent_entries")], o = ((a = n == null ? void 0 : n.attributes) == null ? void 0 : a.entries) ?? [], s = xi(o);
  return d`
        <div class="chip" role="listitem">
            ${Kt(s.totalVolumeMl)} consumed
        </div>
        <div class="chip" role="listitem">
            ${s.wetDiapers} wet and ${s.dirtyDiapers} dirty
        </div>
    `;
}
function ye() {
  const t = window;
  return !!(t.SpeechRecognition || t.webkitSpeechRecognition);
}
function Ii(t) {
  var e;
  return !!(t != null && t.connection && typeof navigator < "u" && ((e = navigator.mediaDevices) != null && e.getUserMedia) && window.AudioWorkletNode);
}
async function Bi() {
  const t = window, e = t.SpeechRecognition || t.webkitSpeechRecognition;
  if (!e) throw new Error("SpeechRecognition not supported");
  const i = new e();
  i.continuous = !1, i.interimResults = !1, i.lang = navigator.language || "en-US";
  let n = () => {
  }, o = () => {
  };
  const s = new Promise((a, l) => {
    n = a, o = l;
  });
  let r = !1;
  return i.onresult = (a) => {
    if (r) return;
    r = !0;
    const l = Array.from(a.results).map((c) => {
      var h;
      return ((h = c[0]) == null ? void 0 : h.transcript) ?? "";
    }).join(" ").trim();
    n({ text: l });
  }, i.onerror = (a) => {
    r || (r = !0, o(new Error((a == null ? void 0 : a.error) ?? "speech-recognition error")));
  }, i.onend = () => {
    r || (r = !0, n({ text: "" }));
  }, i.start(), {
    stop: async () => {
      try {
        i.stop();
      } catch {
      }
      return s;
    },
    abort: () => {
      try {
        i.abort();
      } catch {
      }
    }
  };
}
const Vi = `
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
async function Fi(t) {
  const e = await navigator.mediaDevices.getUserMedia({ audio: !0 }), i = window.AudioContext || window.webkitAudioContext, n = new i({ sampleRate: 16e3 }), o = URL.createObjectURL(
    new Blob([Vi], { type: "text/javascript" })
  );
  try {
    await n.audioWorklet.addModule(o);
  } finally {
    URL.revokeObjectURL(o);
  }
  const s = n.createMediaStreamSource(e), r = new AudioWorkletNode(n, "bt-pcm-worklet");
  s.connect(r);
  let a, l, c = () => {
  }, h = () => {
  };
  const u = new Promise((b, w) => {
    c = b, h = w;
  });
  let g = !1;
  const f = () => {
    try {
      r.port.onmessage = null;
    } catch {
    }
    try {
      r.disconnect();
    } catch {
    }
    try {
      s.disconnect();
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
  }, y = (b) => {
    g || (g = !0, f(), h(b));
  };
  try {
    l = await t.connection.subscribeMessage(
      (b) => {
        var $, x, v, p, _;
        const w = b == null ? void 0 : b.type;
        if (w === "run-start")
          a = (x = ($ = b == null ? void 0 : b.data) == null ? void 0 : $.runner_data) == null ? void 0 : x.stt_binary_handler_id, r.port.onmessage = (k) => {
            var E;
            if (a == null || g) return;
            const D = new Uint8Array(k.data), C = new Uint8Array(D.length + 1);
            C[0] = a, C.set(D, 1);
            try {
              (E = t.connection.socket) == null || E.send(C);
            } catch {
            }
          };
        else if (w === "stt-end") {
          const k = ((p = (v = b == null ? void 0 : b.data) == null ? void 0 : v.stt_output) == null ? void 0 : p.text) ?? "";
          m(k);
        } else w === "error" && y(
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
        r.port.onmessage = null;
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
var qi = Object.defineProperty, ji = Object.getOwnPropertyDescriptor, Qt = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? ji(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && qi(e, i, o), o;
};
let xt = class extends N {
  constructor() {
    super(...arguments), this._state = "idle", this._onClick = async (t) => {
      t.preventDefault(), t.stopPropagation(), this._state === "idle" ? await this._start() : this._state === "listening" && await this._stop();
    };
  }
  get _supported() {
    return ye() || Ii(this.hass);
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
      this._controller = ye() ? await Bi() : await Fi(this.hass);
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
xt.styles = q`
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
], xt.prototype, "hass", 2);
Qt([
  S()
], xt.prototype, "_state", 2);
xt = Qt([
  Z("bt-mic-button")
], xt);
const Wi = 5 * 1024 * 1024, Ki = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif"
]);
class Y extends Error {
  constructor(e, i) {
    super(i), this.code = e;
  }
}
function Yi(t) {
  return new Promise((e, i) => {
    const n = new FileReader();
    n.onload = () => {
      const o = n.result;
      if (typeof o != "string") {
        i(new Y("read_failed", "FileReader returned non-string"));
        return;
      }
      const s = o.indexOf(",");
      e(s >= 0 ? o.slice(s + 1) : o);
    }, n.onerror = () => i(new Y("read_failed", "FileReader failed")), n.readAsDataURL(t);
  });
}
async function Gi(t, e) {
  if (e.size > Wi)
    throw new Y(
      "too_large",
      `Photo is ${Math.round(e.size / (1024 * 1024))} MB; max is 5 MB`
    );
  const i = (e.type || "").toLowerCase();
  if (!Ki.has(i))
    throw new Y(
      "unsupported_mime",
      `Unsupported photo type: ${e.type || "unknown"}`
    );
  const n = await Yi(e);
  try {
    const o = await t.connection.sendMessagePromise({
      type: "babytracker/upload_photo",
      data: n,
      mime: i
    }), s = o == null ? void 0 : o.photo_path;
    if (typeof s != "string" || !s)
      throw new Y("bad_response", "upload returned no photo_path");
    return { photo_path: s };
  } catch (o) {
    if (o instanceof Y) throw o;
    const s = (o == null ? void 0 : o.code) ?? "upload_failed", r = (o == null ? void 0 : o.message) ?? "upload failed";
    throw new Y(s, r);
  }
}
var Xi = Object.defineProperty, Zi = Object.getOwnPropertyDescriptor, bt = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Zi(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && Xi(e, i, o), o;
};
let X = class extends N {
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
        const { photo_path: o } = await Gi(this.hass, i);
        this._setValue(o);
      } catch (o) {
        const s = o instanceof Y ? o.message : "Photo upload failed";
        this._error = s, console.warn("babytracker: photo upload failed", o);
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
X.styles = q`
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
bt([
  M({ attribute: !1 })
], X.prototype, "hass", 2);
bt([
  M()
], X.prototype, "value", 2);
bt([
  S()
], X.prototype, "_busy", 2);
bt([
  S()
], X.prototype, "_error", 2);
bt([
  Ue("input[type=file]")
], X.prototype, "_fileInput", 2);
X = bt([
  Z("bt-photo-button")
], X);
const Qi = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk",
  "other"
]);
function Q(t, e = {}) {
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
function J(t, e) {
  return d`
        <label>Photo</label>
        <bt-photo-button
            .hass=${t}
            .value=${e ?? ""}
        ></bt-photo-button>
    `;
}
function tt(t) {
  const e = t.querySelector("bt-photo-button"), i = e == null ? void 0 : e.value;
  return typeof i == "string" && i.length > 0 ? i : void 0;
}
const T = (t) => String(t).padStart(2, "0");
function gt() {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${T(t.getMonth() + 1)}-${T(t.getDate())}T${T(t.getHours())}:${T(t.getMinutes())}`;
}
function L(t) {
  if (!t) return;
  const e = Date.parse(t);
  if (!Number.isNaN(e))
    return new Date(e).toISOString();
}
function Ft(t) {
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
function Ji(t) {
  if (!t) return "";
  const e = Date.parse(t);
  if (Number.isNaN(e)) return "";
  const i = new Date(e);
  return `${i.getFullYear()}-${T(i.getMonth() + 1)}-${T(i.getDate())}`;
}
function te(t) {
  if (!t) return;
  const e = Date.parse(`${t}T00:00`);
  if (!Number.isNaN(e))
    return new Date(e).toISOString();
}
function z(t) {
  const e = (i) => {
    var s;
    const o = (s = i.currentTarget.parentElement) == null ? void 0 : s.querySelector(
      "input"
    );
    o && (o.value = gt(), o.dispatchEvent(new Event("input", { bubbles: !0 })), o.dispatchEvent(new Event("change", { bubbles: !0 })));
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
const At = 8, $e = 0.5, we = 4;
function qe(t) {
  const e = t.initialUnit === "ml" ? "ml" : "oz", n = typeof t.initialAmount == "number" && Number.isFinite(t.initialAmount) ? t.initialAmount : void 0, o = n != null ? String(n) : "", s = Math.max(
    0,
    Math.min(At, n ?? we)
  ), r = (l) => {
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
        u.type = "range", u.min = "0", u.max = String(At), u.step = String($e), u.removeAttribute("inputmode");
        const f = Number(u.value), m = Number.isFinite(f) ? Math.max(0, Math.min(At, f)) : we;
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
                          max=${At}
                          step=${$e}
                          .value=${String(s)}
                          @input=${r}
                          style="flex:1;min-width:0;"
                          ?autofocus=${t.autofocus ?? !1}
                      />
                      <span
                          id="amount-readout"
                          class="muted"
                          style="min-width:4ch;text-align:right;"
                          >${s} oz</span
                      >
                  ` : d`
                      <input
                          id="amount"
                          name="amount"
                          type="number"
                          min="0"
                          step="1"
                          inputmode="decimal"
                          .value=${o}
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
function je(t) {
  const e = t.initialWeightUnit === "lb" ? "lb" : "kg", i = t.initialLengthUnit === "in" ? "in" : "cm", n = (o) => typeof o == "number" && Number.isFinite(o) ? String(o) : "";
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
    var s;
    const o = (s = i.currentTarget.parentElement) == null ? void 0 : s.querySelector(
      "input"
    );
    o && (o.value = Jt(), o.dispatchEvent(new Event("input", { bubbles: !0 })), o.dispatchEvent(new Event("change", { bubbles: !0 })));
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
function tn(t, e, i, n, o, s, r) {
  const a = (i == null ? void 0 : i.volume_unit) ?? o ?? "oz";
  return d`
        <form @submit=${(c) => {
    c.preventDefault();
    const h = c.currentTarget, u = new FormData(h), g = String(u.get("amount") ?? ""), f = g === "" ? void 0 : Number(g), m = L(String(u.get("at") ?? "")), y = String(u.get("unit") ?? a), b = String(u.get("notes") ?? "") || void 0;
    s("log_feeding", {
      baby: e,
      method: "bottle",
      amount: f,
      unit: y,
      started_at: m,
      ended_at: m,
      notes: b,
      photo_path: tt(h)
    });
  }}>
            <h2>Log bottle</h2>
            ${qe({
    initialAmount: n,
    initialUnit: a,
    autofocus: !0
  })}
            <label for="at">Time</label>
            ${z({
    id: "at",
    value: gt(),
    required: !0
  })}
            <label for="notes">Notes</label>
            ${Q(t)}
            ${J(t)}
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function en(t, e, i, n, o, s) {
  const r = (l) => {
    l.preventDefault(), o("delete_entry", { entry_id: t });
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
                <button type="button" @click=${s} autofocus>Cancel</button>
                <button type="button" class="primary" @click=${r}>
                    Delete anyway
                </button>
            </div>
        </form>
    `;
}
function nn(t, e, i, n) {
  return d`
        <form @submit=${(s) => {
    s.preventDefault();
    const r = s.currentTarget, a = new FormData(r, s.submitter ?? void 0);
    i("log_diaper", {
      baby: e,
      kind: String(a.get("kind") ?? "wet"),
      timestamp: L(String(a.get("when") ?? "")),
      notes: String(a.get("notes") ?? "") || void 0,
      photo_path: tt(r)
    });
  }}>
            <h2>Log diaper</h2>
            <label for="when">When</label>
            ${z({ id: "when", value: gt() })}
            <label for="notes">Notes</label>
            ${Q(t)}
            ${J(t)}
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
function on(t, e, i, n, o) {
  const s = String((e == null ? void 0 : e.type) ?? ""), r = (e == null ? void 0 : e.data) ?? {}, a = s === "feeding" && (r.method === "bottle" || r.method === "solids"), l = s === "vaccine" || s === "growth", c = Qi.has(s) && !a, h = (f) => {
    f.preventDefault();
    const m = f.currentTarget, y = new FormData(m), b = {}, w = l ? te(String(y.get("started") ?? "")) : L(String(y.get("started") ?? ""));
    if (w && (b.timestamp = w), c) {
      const p = L(String(y.get("ended") ?? ""));
      b.ended_at = p ?? null;
    } else a && w && (b.ended_at = w);
    const $ = String(y.get("notes") ?? "");
    b.notes = $ || null;
    const x = {};
    if (s === "diaper")
      x.kind = String(y.get("kind") ?? r.kind ?? "wet");
    else if (s === "feeding" && r.method === "bottle") {
      const p = String(y.get("amount") ?? ""), _ = p === "" ? null : Number(p);
      x.amount = _, x.unit = String(y.get("unit") ?? r.unit ?? "oz");
    } else if (s === "other" || s === "medication") {
      const p = String(y.get("name") ?? "");
      p && (x.name = p);
    } else if (s === "growth") {
      const p = (C) => {
        const E = y.get(C);
        if (E === null) return;
        const W = String(E).trim();
        if (W === "") return null;
        const ct = Number(W);
        return Number.isFinite(ct) ? ct : void 0;
      }, _ = p("weight"), k = p("height"), D = p("head");
      _ !== void 0 && (x.weight = _), k !== void 0 && (x.height = k), D !== void 0 && (x.head_circumference = D), x.weight_unit = String(
        y.get("weight_unit") ?? r.weight_unit ?? "kg"
      ), x.length_unit = String(
        y.get("length_unit") ?? r.length_unit ?? "cm"
      );
    }
    Object.keys(x).length && (b.data = x);
    const v = tt(m);
    b.photo_path = v ?? null, i("edit_entry", { entry_id: e.id, fields: b });
  }, u = () => {
    if (!o) {
      n();
      return;
    }
    !!e.source && e.source !== "user" || n(), o({
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
                      ${z({
    id: "started",
    value: Ft(e.timestamp),
    required: !0
  })}
                      <label for="ended"
                          >Ended <span class="muted">(blank = ongoing)</span></label
                      >
                      ${z({
    id: "ended",
    value: Ft(e.ended_at)
  })}
                  ` : l ? d`
                      <label for="started">Date</label>
                      ${ee({
    id: "started",
    value: Ji(e.timestamp),
    required: !0
  })}
                  ` : d`
                      <label for="started">Time</label>
                      ${z({
    id: "started",
    value: Ft(e.timestamp),
    required: !0
  })}
                  `}
            ${s === "diaper" ? d`
                      <label for="kind">Kind</label>
                      <select id="kind" name="kind">
                          <option value="wet" ?selected=${r.kind === "wet"}>
                              Wet
                          </option>
                          <option
                              value="dirty"
                              ?selected=${r.kind === "dirty"}
                          >
                              Dirty
                          </option>
                          <option value="both" ?selected=${r.kind === "both"}>
                              Both
                          </option>
                      </select>
                  ` : ""}
            ${s === "feeding" && r.method === "bottle" ? qe({
    initialAmount: typeof r.amount == "number" ? r.amount : void 0,
    initialUnit: r.unit ?? "oz"
  }) : ""}
            ${s === "other" || s === "medication" ? d`
                      <label for="name">Name</label>
                      <input
                          id="name"
                          name="name"
                          type="text"
                          .value=${String(r.name ?? "")}
                      />
                  ` : ""}
            ${s === "growth" ? je({
    initialWeight: typeof r.weight == "number" ? r.weight : void 0,
    initialHeight: typeof r.height == "number" ? r.height : void 0,
    initialHead: typeof r.head_circumference == "number" ? r.head_circumference : void 0,
    initialWeightUnit: r.weight_unit ?? "kg",
    initialLengthUnit: r.length_unit ?? "cm"
  }) : ""}
            <label for="notes">Notes</label>
            ${Q(t, {
    value: String(e.notes ?? "")
  })}
            ${J(t, e.photo_path ?? "")}
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
function sn(t, e, i, n, o) {
  const s = (i == null ? void 0 : i.weight_unit) ?? "kg", r = (i == null ? void 0 : i.length_unit) ?? "cm";
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
      weight_unit: String(h.get("weight_unit") ?? s),
      length_unit: String(h.get("length_unit") ?? r),
      timestamp: te(String(h.get("when") ?? "")),
      notes: String(h.get("notes") ?? "") || void 0,
      photo_path: tt(c)
    });
  }}>
            <h2>Log growth measurement</h2>
            ${je({
    initialWeightUnit: s,
    initialLengthUnit: r,
    autofocusWeight: !0
  })}
            <label for="when">Date</label>
            ${ee({ id: "when", value: Jt() })}
            <label for="notes">Notes</label>
            ${Q(t)}
            ${J(t)}
            <div class="actions">
                <button type="button" @click=${o}>Cancel</button>
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
  const o = (r) => {
    r.preventDefault();
    const a = r.currentTarget, l = new FormData(a);
    i("log_other", {
      baby: e,
      name: String(l.get("name") ?? ""),
      timestamp: L(String(l.get("started") ?? "")),
      ended_at: L(String(l.get("ended") ?? "")) || void 0,
      notes: String(l.get("notes") ?? "") || void 0,
      photo_path: tt(a)
    });
  }, s = (r, a) => {
    const l = r.currentTarget.form, c = { baby: e, name: a };
    if (l) {
      const h = new FormData(l), u = L(String(h.get("started") ?? "")), g = L(String(h.get("ended") ?? ""));
      u && (c.timestamp = u), g && (c.ended_at = g);
    }
    i("log_other", c);
  };
  return d`
        <form @submit=${o}>
            <h2>Log activity</h2>
            <label for="started">Started</label>
            ${z({ id: "started", value: gt() })}
            <label for="ended"
                >Ended <span class="muted">(optional)</span></label
            >
            ${z({
    id: "ended",
    placeholder: "leave blank for a point-in-time event"
  })}
            <div class="quick-other" role="group" aria-label="Quick activities">
                ${an.map(
    (r) => d`
                        <button
                            type="button"
                            class="quick"
                            @click=${(a) => s(a, r)}
                        >
                            ${r}
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
            ${Q(t)}
            ${J(t)}
            <div class="actions">
                <button type="button" @click=${n}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function cn(t, e, i, n, o, s) {
  const r = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: n ? `Log ${n.replace("_", " ")} feeding` : "Log feeding"
  };
  return d`
        <form @submit=${(l) => {
    l.preventDefault();
    const c = l.currentTarget, h = new FormData(c), u = L(String(h.get("started") ?? "")), g = L(String(h.get("ended") ?? "")), f = String(h.get("notes") ?? "") || void 0, m = tt(c);
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
      o($, w);
      return;
    }
    const y = {
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
        b = "log_feeding", y.method = n;
        break;
    }
    o(b, y);
  }}>
            <h2>${r[i]}</h2>
            <label for="started">Started</label>
            ${z({
    id: "started",
    value: gt(),
    required: !0
  })}
            <label for="ended">Ended <span class="muted">(optional)</span></label>
            ${z({
    id: "ended",
    placeholder: "leave blank for an open session"
  })}
            <label for="notes">Notes</label>
            ${Q(t)}
            ${J(t)}
            <div class="actions">
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function dn(t, e, i, n) {
  return d`
        <form @submit=${(s) => {
    s.preventDefault();
    const r = s.currentTarget, a = new FormData(r), l = L(String(a.get("when") ?? ""));
    i("log_feeding", {
      baby: e,
      method: "solids",
      started_at: l,
      ended_at: l,
      notes: String(a.get("notes") ?? "") || void 0,
      photo_path: tt(r)
    });
  }}>
            <h2>Log solids</h2>
            <label for="notes"
                >What was fed <span class="muted">(optional)</span></label
            >
            ${Q(t, {
    placeholder: "e.g. banana, oatmeal",
    autofocus: !0
  })}
            <label for="when">When</label>
            ${z({ id: "when", value: gt() })}
            ${J(t)}
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
function hn(t, e, i, n, o, s, r) {
  const a = [
    "left_thigh",
    "right_thigh",
    "left_arm",
    "right_arm",
    "oral",
    "nasal"
  ], l = (b) => {
    b.preventDefault();
    const w = b.currentTarget, $ = new FormData(w), x = String($.get("vaccine_select") ?? "").trim(), v = String($.get("vaccine_custom") ?? "").trim(), p = x === "__other__" ? v : x;
    if (!p) return;
    const _ = String($.get("dose_number") ?? "").trim(), k = _ === "" ? void 0 : Number(_), D = String($.get("site") ?? "").trim() || void 0, C = String($.get("lot_number") ?? "").trim() || void 0, E = String($.get("provider") ?? "").trim() || void 0;
    s("log_vaccine", {
      baby: e,
      name: p,
      dose_number: k,
      site: D,
      lot_number: C,
      provider: E,
      timestamp: te(String($.get("when") ?? "")),
      notes: String($.get("notes") ?? "") || void 0,
      photo_path: tt(w)
    });
  }, c = Array.from(
    new Set(
      [...un, ...o].filter((b) => !!b && b !== "none").map(xe)
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
            ${Q(t)}
            ${J(t)}
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function ie(t, e, i, n, o, s) {
  let r = A;
  if (e !== null)
    switch (e.kind) {
      case "diaper":
        r = nn(t, e.baby, n, o);
        break;
      case "bottle":
        r = tn(
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
        r = dn(t, e.baby, n, o);
        break;
      case "other":
        r = ln(t, e.baby, n, o);
        break;
      case "session":
        r = cn(
          t,
          e.baby,
          e.activity,
          e.method,
          n,
          o
        );
        break;
      case "confirm_delete_imported":
        r = en(
          e.entryId,
          e.entryType,
          e.source,
          e.staff ?? null,
          n,
          o
        );
        break;
      case "edit_entry":
        r = on(
          t,
          e.entry,
          n,
          o,
          s
        );
        break;
      case "log_growth":
        r = sn(t, e.baby, i, n, o);
        break;
      case "log_vaccine":
        r = hn(
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
        <dialog @cancel=${o} @close=${o}>${r}</dialog>
    `;
}
function We(t, e) {
  return !t.source || t.source === "user" ? (e(t.id), null) : {
    kind: "confirm_delete_imported",
    entryId: t.id,
    entryType: t.type ?? "entry",
    source: t.source,
    staff: t.staff ?? null
  };
}
function Ke(t, e) {
  const i = t.querySelector("dialog");
  i && (e && !i.open && i.showModal(), !e && i.open && i.close());
}
const Ye = q`
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
`, qt = 24 * 60 * 60 * 1e3, ke = 29.5735, Se = [
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
  var y, b, w, $, x, v;
  const n = (y = t == null ? void 0 : t.states) == null ? void 0 : y[P(e, "recent_entries")], o = ((b = n == null ? void 0 : n.attributes) == null ? void 0 : b.entries) ?? [], s = Date.now(), r = new Date(s);
  r.setHours(0, 0, 0, 0);
  const a = [], l = (p) => p.toLocaleDateString([], { weekday: "short" });
  for (let p = i - 1; p >= 0; p--) {
    const _ = new Date(r.getTime() - p * qt);
    a.push(bn(l(_)));
  }
  const c = r.getTime() - (i - 1) * qt;
  for (const p of o) {
    const _ = Date.parse(p == null ? void 0 : p.timestamp);
    if (!Number.isFinite(_)) continue;
    const k = Math.floor((_ - c) / qt);
    if (k < 0 || k >= i) continue;
    const D = a[k];
    if (p.type === "feeding") {
      const C = gn(String(((w = p == null ? void 0 : p.data) == null ? void 0 : w.method) ?? ""));
      C && (D.feedingByCategory[C] += 1);
      const E = Number((($ = p == null ? void 0 : p.data) == null ? void 0 : $.amount) ?? 0), W = String(((x = p == null ? void 0 : p.data) == null ? void 0 : x.unit) ?? "");
      E > 0 && W === "oz" ? D.bottleMl += E * ke : E > 0 && W === "ml" && (D.bottleMl += E);
    } else if (p.type === "diaper") {
      const C = mn(String(((v = p == null ? void 0 : p.data) == null ? void 0 : v.kind) ?? ""));
      C && (D.diaperByCategory[C] += 1);
    } else if (p.type === "sleep") {
      const C = p != null && p.ended_at && p.ended_at !== "" ? Date.parse(p.ended_at) : s;
      Number.isFinite(C) && C > _ && (D.sleepMinutes += (C - _) / 6e4);
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
                .renderChart=${() => Pe(
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
                .renderChart=${() => Pe(
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
    ), y = 66 - m;
    return I`
                        <rect
                            x=${f}
                            y=${y}
                            width=${g}
                            height=${m}
                            fill="var(--primary-color)"
                            rx="2"
                        ></rect>
                        <text
                            x=${f + g / 2}
                            y=${y - 4}
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
function Pe(t, e, i, n) {
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
    const f = 14 + g * h, m = h * 0.7, y = f + (h - m) / 2, b = l[g], w = Math.max(
      b > 0 ? 2 : 0,
      b / c * (90 - 24 * 2)
    ), $ = 66;
    let x = $;
    const v = u.parts.map((p) => {
      if (p.value <= 0) return I``;
      const _ = p.value / b * w;
      return x -= _, I`
                            <rect
                                x=${y}
                                y=${x}
                                width=${m}
                                height=${_}
                                fill=${p.color}
                            >
                                <title>${p.label}: ${p.value}</title>
                            </rect>
                        `;
    });
    return I`
                        ${v}
                        <text
                            x=${y + m / 2}
                            y=${$ - w - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${b > 0 ? n(b) : ""}
                        </text>
                        <text
                            x=${y + m / 2}
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
function vn(t) {
  if (!t) return "—";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "—" : new Date(e).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function jt(t) {
  var n, o;
  const e = String(((n = t == null ? void 0 : t.data) == null ? void 0 : n.name) ?? "vaccine"), i = (o = t == null ? void 0 : t.data) == null ? void 0 : o.dose_number;
  return i != null ? `${e} dose ${i}` : e;
}
function yn(t, e) {
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
                        aria-label=${e ? `Edit ${jt(i)}` : jt(i)}
                        @click=${e ? () => e(i) : void 0}
                        @keydown=${e ? (o) => {
        (o.key === "Enter" || o.key === " ") && (o.preventDefault(), e(i));
      } : void 0}
                    >
                        <span class="vh-date muted"
                            >${vn(i.timestamp)}</span
                        >
                        <span class="vh-name">${jt(i)}</span>
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
  var s, r;
  const n = t.states[P(e, "vaccines_due")];
  if (!n || n.state === "unknown") return "";
  const o = ((s = t.states[P(e, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : s.state) === "on";
  return d`
        <div
            class="section chip ${o ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${n.state}</strong>
            ${(r = n.attributes) != null && r.due_on ? d`<span>(${n.attributes.due_on})</span>` : ""}
            ${o ? d`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
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
var wn = Object.defineProperty, xn = Object.getOwnPropertyDescriptor, at = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? xn(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && wn(e, i, o), o;
};
const kn = ["vaccines", "growth", "trends", "export"];
let V = class extends N {
  constructor() {
    super(...arguments), this._modal = null, this._vaccines = [], this._growth = [], this._closeModal = () => {
      this._modal = null;
    }, this._submitModal = async (t, e) => {
      await this.hass.callService("babytracker", t, e), this._modal = null;
    }, this._requestLogGrowth = () => {
      var t;
      (t = this._config) != null && t.baby && (this._modal = { kind: "log_growth", baby: this._config.baby });
    }, this._requestEditEntry = (t) => {
      this._modal = { kind: "edit_entry", entry: t };
    }, this._requestDelete = (t) => {
      this._modal = We(
        t,
        (e) => this.hass.callService("babytracker", "delete_entry", { entry_id: e })
      );
    }, this._requestLogVaccine = () => {
      var r, a, l, c, h;
      if (!((r = this._config) != null && r.baby)) return;
      const t = (l = (a = this.hass) == null ? void 0 : a.states) == null ? void 0 : l[P(this._config.baby, "vaccines_due")], e = t != null && t.state && t.state !== "none" && t.state !== "unknown" ? String(t.state) : "", i = (c = t == null ? void 0 : t.attributes) == null ? void 0 : c.dose_number, n = typeof i == "number" ? i : void 0, s = (Array.isArray((h = t == null ? void 0 : t.attributes) == null ? void 0 : h.upcoming) ? t.attributes.upcoming : []).map((u) => u && typeof u.name == "string" ? u.name : null).filter((u) => !!u);
      this._modal = {
        kind: "log_vaccine",
        baby: this._config.baby,
        defaultName: e,
        defaultDose: n,
        scheduleNames: s
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
    (t.has("hass") || t.has("_config")) && this._maybeSubscribe(), t.has("_modal") && Ke(this.renderRoot, this._modal);
  }
  _maybeSubscribe() {
    var t, e;
    !this.hass || !this._config || (this._unsubOptions || (this._unsubOptions = He(
      this.hass,
      (i) => {
        this._options = i;
      }
    )), !this._unsubVaccines && this._sections.includes("vaccines") && ((t = this._config) != null && t.baby) && (this._unsubVaccines = vi(
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
                          ${yn(
      this._vaccines,
      this._requestEditEntry
    )}
                      ` : ""}
                ${t.includes("growth") ? Ve(
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
                ${t.includes("export") ? Fe(this.hass, this._config.baby) : ""}
            </ha-card>
            ${ie(
      this.hass,
      this._modal,
      this._options,
      this._submitModal,
      this._closeModal,
      this._requestDelete
    )}
        `;
  }
  static getStubConfig() {
    return { type: "custom:babytracker-summary-card", baby: "ava" };
  }
};
V.styles = q`
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
        ${Ye}
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
at([
  M({ attribute: !1 })
], V.prototype, "hass", 2);
at([
  S()
], V.prototype, "_config", 2);
at([
  S()
], V.prototype, "_options", 2);
at([
  S()
], V.prototype, "_modal", 2);
at([
  S()
], V.prototype, "_vaccines", 2);
at([
  S()
], V.prototype, "_growth", 2);
V = at([
  Z("babytracker-summary-card")
], V);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-summary-card",
  name: "babytracker — summary",
  description: "Vaccines, growth, 7-day trend charts, and pediatrician export for one baby."
});
var Sn = Object.defineProperty, Cn = Object.getOwnPropertyDescriptor, lt = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Cn(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && Sn(e, i, o), o;
};
function De(t) {
  return String(t).padStart(2, "0");
}
function R(t) {
  return d`
        <span class="chip" title=${t.label} aria-label=${t.label}>
            <ha-icon class="chip-icon" icon=${t.icon}></ha-icon>
            <span class="chip-value">${t.value}</span>
            ${t.detail ? d`<span class="chip-detail">${t.detail}</span>` : ""}
        </span>
    `;
}
function Dt(t) {
  return `${t.getFullYear()}-${De(t.getMonth() + 1)}-${De(t.getDate())}`;
}
function kt(t) {
  const e = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (!e) return null;
  const i = Number(e[1]), n = Number(e[2]) - 1, o = Number(e[3]), s = new Date(i, n, o, 0, 0, 0, 0);
  return Number.isNaN(s.getTime()) ? null : s;
}
function An(t) {
  const e = kt(t) ?? /* @__PURE__ */ new Date(), i = new Date(e.getFullYear(), e.getMonth(), e.getDate(), 0, 0, 0, 0), n = new Date(
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
function Pn(t, e) {
  const i = kt(t) ?? /* @__PURE__ */ new Date();
  return i.setDate(i.getDate() + e), Dt(i);
}
function Dn(t) {
  const e = kt(t);
  return e ? e.toLocaleDateString([], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : t;
}
let F = class extends N {
  constructor() {
    super(...arguments), this._date = Dt(/* @__PURE__ */ new Date()), this._entries = [], this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._today = () => {
      this._date = Dt(/* @__PURE__ */ new Date());
    }, this._onDateChange = (t) => {
      const e = t.currentTarget.value;
      e && kt(e) && (this._date = e);
    }, this._requestEdit = (t) => {
      this._modal = { kind: "edit_entry", entry: t };
    }, this._requestDelete = (t) => {
      this._modal = We(
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
    };
  }
  setConfig(t) {
    if (!(t != null && t.baby))
      throw new Error("babytracker-history-card: 'baby' is required");
    this._config = { ...t }, t.initial_date && kt(t.initial_date) && (this._date = t.initial_date);
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
    (t.has("hass") || t.has("_config") || t.has("_date")) && this._resubscribe(), t.has("_modal") && Ke(this.renderRoot, this._modal);
  }
  _resubscribe() {
    var i, n;
    if (!this.hass || !((i = this._config) != null && i.baby)) return;
    (n = this._unsubEntries) == null || n.call(this);
    const { startIso: t, endIso: e } = An(this._date);
    this._unsubEntries = _i(
      this.hass,
      this._config.baby,
      t,
      e,
      (o) => {
        this._entries = Array.isArray(o) ? o : [];
      }
    );
  }
  _go(t) {
    this._date = Pn(this._date, t);
  }
  _renderChips(t) {
    const e = [], i = [];
    if (t.wet && i.push(`${t.wet}W`), t.dirty && i.push(`${t.dirty}D`), e.push(
      R({
        icon: "mdi:human-baby-changing-table",
        label: "Diapers",
        value: String(t.diapers),
        detail: i.length > 0 ? `(${i.join(" · ")})` : void 0
      })
    ), e.push(
      R({
        icon: "mdi:bed",
        label: "Total sleep",
        value: O(t.sleepMinutes)
      })
    ), e.push(
      R({
        icon: "mdi:bed-clock",
        label: "Longest sleep",
        value: O(t.longestSleepMinutes)
      })
    ), t.bottleFeeds > 0 && e.push(
      R({
        icon: "mdi:baby-bottle-outline",
        label: "Bottle feeds",
        value: String(t.bottleFeeds),
        detail: `· ${Kt(t.bottleVolumeMl)}`
      })
    ), t.nursingMinutes > 0) {
      const n = [];
      t.nursingLeftMinutes > 0 && n.push(`L ${O(t.nursingLeftMinutes)}`), t.nursingRightMinutes > 0 && n.push(`R ${O(t.nursingRightMinutes)}`), e.push(
        R({
          icon: "mdi:mother-nurse",
          label: "Nursing",
          value: O(t.nursingMinutes),
          detail: `(${n.join(" · ")})`
        })
      );
    }
    return t.pumpingMl > 0 && e.push(
      R({
        icon: "mdi:water-pump",
        label: "Pumping",
        value: Kt(t.pumpingMl)
      })
    ), t.solidsCount > 0 && e.push(
      R({
        icon: "mdi:silverware-spoon",
        label: "Solids",
        value: String(t.solidsCount)
      })
    ), t.tummyMinutes > 0 && e.push(
      R({
        icon: "mdi:human-handsup",
        label: "Tummy time",
        value: O(t.tummyMinutes)
      })
    ), t.walkCount > 0 && e.push(
      R({
        icon: "mdi:walk",
        label: "Walks",
        value: String(t.walkCount),
        detail: `· ${O(t.walkMinutes)}`
      })
    ), t.medCount > 0 && e.push(
      R({
        icon: "mdi:pill",
        label: "Medications",
        value: String(t.medCount)
      })
    ), t.vaccineCount > 0 && e.push(
      R({
        icon: "mdi:needle",
        label: "Vaccines",
        value: String(t.vaccineCount)
      })
    ), d`<div class="chips" aria-label="Day summary">
            ${e}
        </div>`;
  }
  render() {
    if (!this.hass || !this._config) return d``;
    const t = this._date === Dt(/* @__PURE__ */ new Date()), e = ki(this._entries);
    return d`
            <ha-card>
                <h2>History — ${Dn(this._date)}</h2>
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
      (i) => Be(
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
      this._closeModal,
      this._requestDelete
    )}
        `;
  }
  static getStubConfig() {
    return { type: "custom:babytracker-history-card", baby: "ava" };
  }
};
F.styles = q`
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
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 999px;
            background: var(--secondary-background-color);
            border: 1px solid var(--divider-color);
            font-size: 0.85rem;
            line-height: 1.2;
            color: var(--primary-text-color);
        }
        .chip .chip-icon {
            color: var(--secondary-text-color);
            --mdc-icon-size: 16px;
            width: 16px;
            height: 16px;
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
        ${Ye}
    `;
lt([
  M({ attribute: !1 })
], F.prototype, "hass", 2);
lt([
  S()
], F.prototype, "_config", 2);
lt([
  S()
], F.prototype, "_date", 2);
lt([
  S()
], F.prototype, "_entries", 2);
lt([
  S()
], F.prototype, "_modal", 2);
lt([
  S()
], F.prototype, "_expandedNotes", 2);
F = lt([
  Z("babytracker-history-card")
], F);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-history-card",
  name: "babytracker — history",
  description: "Paginate through one baby's entries by calendar day with edit + delete."
});
var En = Object.defineProperty, Mn = Object.getOwnPropertyDescriptor, et = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Mn(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && En(e, i, o), o;
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
        const o = await mi(this.hass, "babytracker", t, e);
        return n && (n.classList.add("logged"), setTimeout(() => n.classList.remove("logged"), 700)), this.requestUpdate(), o;
      } catch (o) {
        throw console.warn("babytracker: service call failed", t, o), o;
      }
    }, this._requestModal = (t) => {
      const e = this._baby();
      if (typeof t == "string") {
        if (t === "bottle") {
          const i = this._lastBottle();
          this._modal = {
            kind: "bottle",
            baby: e,
            lastAmount: i == null ? void 0 : i.amount,
            lastUnit: i == null ? void 0 : i.unit
          };
        } else
          this._modal = { kind: t, baby: e };
        return;
      }
      this._modal = {
        kind: "session",
        baby: e,
        activity: t.activity,
        method: t.method
      };
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
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = fi(
      this.hass,
      this._config.baby,
      (t) => {
        this._babyConfig = t;
      }
    )), this._unsubOptions || (this._unsubOptions = He(
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
    return P(this._baby(), t, e);
  }
  /** Status chip fragments (no wrapper). Caller wraps these together
   *  with the 24 h chips inside a single `.chips` flex row so the two
   *  groups flow continuously instead of breaking onto separate
   *  lines.
   */
  _renderStatusChips() {
    var c, h, u, g, f, m, y, b, w, $, x, v, p;
    const t = this.hass, e = (h = (c = t.states) == null ? void 0 : c[this._entityId("last_diaper")]) == null ? void 0 : h.state, i = ((g = (u = t.states) == null ? void 0 : u[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : g.state) === "on", n = ((m = (f = t.states) == null ? void 0 : f[this._entityId("walking", "binary_sensor")]) == null ? void 0 : m.state) === "on", o = ((b = (y = t.states) == null ? void 0 : y[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : b.state) === "on", s = ((x = ($ = (w = t.states) == null ? void 0 : w[this._entityId("recent_entries")]) == null ? void 0 : $.attributes) == null ? void 0 : x.entries) ?? [], r = i ? null : Si(s), a = (v = s.find(
      (_) => {
        var k;
        return (_ == null ? void 0 : _.type) === "feeding" && ((k = _ == null ? void 0 : _.data) == null ? void 0 : k.method) === "bottle";
      }
    )) == null ? void 0 : v.timestamp, l = (p = s.find(
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
            ${r !== null ? d`<div class="chip" role="listitem">
                      Awake for: ${O(r)}
                  </div>` : ""}
            ${i ? d`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
            ${n ? d`<div class="chip warning" role="listitem">On a walk</div>` : ""}
            ${o ? d`<div class="chip warning" role="listitem">At daycare</div>` : ""}
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
  _lastBottle() {
    var i, n, o, s, r, a, l;
    const t = (n = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : n[this._entityId("recent_entries")], e = ((o = t == null ? void 0 : t.attributes) == null ? void 0 : o.entries) ?? [];
    for (const c of e)
      if ((c == null ? void 0 : c.type) === "feeding" && ((s = c == null ? void 0 : c.data) == null ? void 0 : s.method) === "bottle" && typeof ((r = c == null ? void 0 : c.data) == null ? void 0 : r.amount) == "number" && (((a = c == null ? void 0 : c.data) == null ? void 0 : a.unit) === "ml" || ((l = c == null ? void 0 : c.data) == null ? void 0 : l.unit) === "oz"))
        return { amount: c.data.amount, unit: c.data.unit };
  }
  render() {
    var n;
    if (!this.hass || !this._config) return d``;
    const t = this._sections, e = t.includes("status"), i = t.includes("today");
    return d`
            <ha-card>
                <h2>${ze(((n = this._babyConfig) == null ? void 0 : n.name) ?? this._baby())}</h2>
                ${e || i ? d`<div
                          class="chips"
                          role="list"
                          aria-label="Status and last 24 hours"
                      >
                          ${e ? this._renderStatusChips() : ""}
                          ${i ? Hi(
      this.hass,
      this._baby(),
      this._babyConfig
    ) : ""}
                      </div>` : ""}
                ${t.includes("active_session") ? Ai(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${t.includes("quick_log") ? $i(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${t.includes("growth") ? Ve(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${t.includes("recent") ? Ti(
      this.hass,
      this._baby(),
      this._requestEdit,
      this._config.recent_limit ?? 50,
      this._expandedNotes,
      this._toggleNotes
    ) : ""}
                ${t.includes("importer_sync") ? zi(
      this._babyConfig,
      this._baby(),
      this._handleService
    ) : ""}
                ${t.includes("export") ? Fe(this.hass, this._baby()) : ""}
            </ha-card>
            ${ie(
      this.hass,
      this._modal,
      this._options,
      this._submitModal,
      this._closeModal,
      this._requestDelete
    )}
        `;
  }
};
H.styles = q`
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
et([
  M({ attribute: !1 })
], H.prototype, "hass", 2);
et([
  S()
], H.prototype, "_config", 2);
et([
  S()
], H.prototype, "_babyConfig", 2);
et([
  S()
], H.prototype, "_options", 2);
et([
  S()
], H.prototype, "_modal", 2);
et([
  S()
], H.prototype, "_expandedNotes", 2);
et([
  Ue("dialog")
], H.prototype, "_dialog", 2);
H = et([
  Z("babytracker-card")
], H);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => On);
var Nn = Object.defineProperty, Rn = Object.getOwnPropertyDescriptor, ne = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Rn(e, i) : e, s = t.length - 1, r; s >= 0; s--)
    (r = t[s]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && Nn(e, i, o), o;
};
let st = class extends N {
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
st.styles = q`
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
], st.prototype, "hass", 2);
ne([
  M({ attribute: !1 })
], st.prototype, "_config", 2);
st = ne([
  Z("babytracker-card-editor")
], st);
st.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const On = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return st;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  H as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
