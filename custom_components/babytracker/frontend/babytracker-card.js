/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis, ot = X.ShadowRoot && (X.ShadyCSS === void 0 || X.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, at = Symbol(), mt = /* @__PURE__ */ new WeakMap();
let Tt = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== at) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (ot && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = mt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && mt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const It = (e) => new Tt(typeof e == "string" ? e : e + "", void 0, at), lt = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, n, r) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[r + 1], e[0]);
  return new Tt(i, e, at);
}, Rt = (e, t) => {
  if (ot) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), n = X.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = i.cssText, e.appendChild(s);
  }
}, ft = ot ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return It(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ft, defineProperty: qt, getOwnPropertyDescriptor: Bt, getOwnPropertyNames: jt, getOwnPropertySymbols: Wt, getPrototypeOf: Vt } = Object, x = globalThis, bt = x.trustedTypes, Yt = bt ? bt.emptyScript : "", tt = x.reactiveElementPolyfillSupport, R = (e, t) => e, G = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Yt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, ct = (e, t) => !Ft(e, t), gt = { attribute: !0, type: String, converter: G, reflect: !1, useDefault: !1, hasChanged: ct };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), x.litPropertyMetadata ?? (x.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let N = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = gt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, i);
      n !== void 0 && qt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    const { get: n, set: r } = Bt(this.prototype, t) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: n, set(o) {
      const a = n == null ? void 0 : n.call(this);
      r == null || r.call(this, o), this.requestUpdate(t, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? gt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(R("elementProperties"))) return;
    const t = Vt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(R("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(R("properties"))) {
      const i = this.properties, s = [...jt(i), ...Wt(i)];
      for (const n of s) this.createProperty(n, i[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [s, n] of i) this.elementProperties.set(s, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const n = this._$Eu(i, s);
      n !== void 0 && this._$Eh.set(n, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const n of s) i.unshift(ft(n));
    } else t !== void 0 && i.push(ft(t));
    return i;
  }
  static _$Eu(t, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((i) => this.enableUpdating = i), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((i) => i(this));
  }
  addController(t) {
    var i;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((i = t.hostConnected) == null || i.call(t));
  }
  removeController(t) {
    var i;
    (i = this._$EO) == null || i.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Rt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((i) => {
      var s;
      return (s = i.hostConnected) == null ? void 0 : s.call(i);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var s;
      return (s = i.hostDisconnected) == null ? void 0 : s.call(i);
    });
  }
  attributeChangedCallback(t, i, s) {
    this._$AK(t, s);
  }
  _$ET(t, i) {
    var r;
    const s = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, s);
    if (n !== void 0 && s.reflect === !0) {
      const o = (((r = s.converter) == null ? void 0 : r.toAttribute) !== void 0 ? s.converter : G).toAttribute(i, s.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var r, o;
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const a = s.getPropertyOptions(n), c = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((r = a.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? a.converter : G;
      this._$Em = n;
      const d = c.fromAttribute(i, a.type);
      this[n] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(n)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, n = !1, r) {
    var o;
    if (t !== void 0) {
      const a = this.constructor;
      if (n === !1 && (r = this[t]), s ?? (s = a.getPropertyOptions(t)), !((s.hasChanged ?? ct)(r, i) || s.useDefault && s.reflect && r === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(a._$Eu(t, s)))) return;
      this.C(t, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: s, reflect: n, wrapped: r }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? i ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (i = void 0), this._$AL.set(t, i)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [r, o] of n) {
        const { wrapped: a } = o, c = this[r];
        a !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, o, c);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (s = this._$EO) == null || s.forEach((n) => {
        var r;
        return (r = n.hostUpdate) == null ? void 0 : r.call(n);
      }), this.update(i)) : this._$EM();
    } catch (n) {
      throw t = !1, this._$EM(), n;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var i;
    (i = this._$EO) == null || i.forEach((s) => {
      var n;
      return (n = s.hostUpdated) == null ? void 0 : n.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, N[R("elementProperties")] = /* @__PURE__ */ new Map(), N[R("finalized")] = /* @__PURE__ */ new Map(), tt == null || tt({ ReactiveElement: N }), (x.reactiveElementVersions ?? (x.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = globalThis, _t = (e) => e, K = F.trustedTypes, $t = K ? K.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Dt = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, Ot = "?" + k, Zt = `<${Ot}>`, O = document, q = () => O.createComment(""), B = (e) => e === null || typeof e != "object" && typeof e != "function", dt = Array.isArray, Xt = (e) => dt(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", et = `[ 	
\f\r]`, I = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, yt = /-->/g, vt = />/g, E = RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), wt = /'/g, kt = /"/g, Mt = /^(?:script|style|textarea|title)$/i, Gt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), p = Gt(1), U = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), xt = /* @__PURE__ */ new WeakMap(), C = O.createTreeWalker(O, 129);
function Pt(e, t) {
  if (!dt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return $t !== void 0 ? $t.createHTML(t) : t;
}
const Kt = (e, t) => {
  const i = e.length - 1, s = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = I;
  for (let a = 0; a < i; a++) {
    const c = e[a];
    let d, h, u = -1, m = 0;
    for (; m < c.length && (o.lastIndex = m, h = o.exec(c), h !== null); ) m = o.lastIndex, o === I ? h[1] === "!--" ? o = yt : h[1] !== void 0 ? o = vt : h[2] !== void 0 ? (Mt.test(h[2]) && (n = RegExp("</" + h[2], "g")), o = E) : h[3] !== void 0 && (o = E) : o === E ? h[0] === ">" ? (o = n ?? I, u = -1) : h[1] === void 0 ? u = -2 : (u = o.lastIndex - h[2].length, d = h[1], o = h[3] === void 0 ? E : h[3] === '"' ? kt : wt) : o === kt || o === wt ? o = E : o === yt || o === vt ? o = I : (o = E, n = void 0);
    const f = o === E && e[a + 1].startsWith("/>") ? " " : "";
    r += o === I ? c + Zt : u >= 0 ? (s.push(d), c.slice(0, u) + Dt + c.slice(u) + k + f) : c + k + (u === -2 ? a : f);
  }
  return [Pt(e, r + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class j {
  constructor({ strings: t, _$litType$: i }, s) {
    let n;
    this.parts = [];
    let r = 0, o = 0;
    const a = t.length - 1, c = this.parts, [d, h] = Kt(t, i);
    if (this.el = j.createElement(d, s), C.currentNode = this.el.content, i === 2 || i === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (n = C.nextNode()) !== null && c.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const u of n.getAttributeNames()) if (u.endsWith(Dt)) {
          const m = h[o++], f = n.getAttribute(u).split(k), l = /([.?@])?(.*)/.exec(m);
          c.push({ type: 1, index: r, name: l[2], strings: f, ctor: l[1] === "." ? Qt : l[1] === "?" ? te : l[1] === "@" ? ee : J }), n.removeAttribute(u);
        } else u.startsWith(k) && (c.push({ type: 6, index: r }), n.removeAttribute(u));
        if (Mt.test(n.tagName)) {
          const u = n.textContent.split(k), m = u.length - 1;
          if (m > 0) {
            n.textContent = K ? K.emptyScript : "";
            for (let f = 0; f < m; f++) n.append(u[f], q()), C.nextNode(), c.push({ type: 2, index: ++r });
            n.append(u[m], q());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Ot) c.push({ type: 2, index: r });
      else {
        let u = -1;
        for (; (u = n.data.indexOf(k, u + 1)) !== -1; ) c.push({ type: 7, index: r }), u += k.length - 1;
      }
      r++;
    }
  }
  static createElement(t, i) {
    const s = O.createElement("template");
    return s.innerHTML = t, s;
  }
}
function z(e, t, i = e, s) {
  var o, a;
  if (t === U) return t;
  let n = s !== void 0 ? (o = i._$Co) == null ? void 0 : o[s] : i._$Cl;
  const r = B(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== r && ((a = n == null ? void 0 : n._$AO) == null || a.call(n, !1), r === void 0 ? n = void 0 : (n = new r(e), n._$AT(e, i, s)), s !== void 0 ? (i._$Co ?? (i._$Co = []))[s] = n : i._$Cl = n), n !== void 0 && (t = z(e, n._$AS(e, t.values), n, s)), t;
}
class Jt {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: s } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? O).importNode(i, !0);
    C.currentNode = n;
    let r = C.nextNode(), o = 0, a = 0, c = s[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let d;
        c.type === 2 ? d = new W(r, r.nextSibling, this, t) : c.type === 1 ? d = new c.ctor(r, c.name, c.strings, this, t) : c.type === 6 && (d = new ie(r, this, t)), this._$AV.push(d), c = s[++a];
      }
      o !== (c == null ? void 0 : c.index) && (r = C.nextNode(), o++);
    }
    return C.currentNode = O, n;
  }
  p(t) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class W {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, s, n) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = z(this, t, i), B(t) ? t === _ || t == null || t === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : t !== this._$AH && t !== U && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Xt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== _ && B(this._$AH) ? this._$AA.nextSibling.data = t : this.T(O.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: i, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = j.createElement(Pt(s.h, s.h[0]), this.options)), s);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === n) this._$AH.p(i);
    else {
      const o = new Jt(n, this), a = o.u(this.options);
      o.p(i), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = xt.get(t.strings);
    return i === void 0 && xt.set(t.strings, i = new j(t)), i;
  }
  k(t) {
    dt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, n = 0;
    for (const r of t) n === i.length ? i.push(s = new W(this.O(q()), this.O(q()), this, this.options)) : s = i[n], s._$AI(r), n++;
    n < i.length && (this._$AR(s && s._$AB.nextSibling, n), i.length = n);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, i); t !== this._$AB; ) {
      const n = _t(t).nextSibling;
      _t(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class J {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, n, r) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = t, this.name = i, this._$AM = n, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = _;
  }
  _$AI(t, i = this, s, n) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = z(this, t, i, 0), o = !B(t) || t !== this._$AH && t !== U, o && (this._$AH = t);
    else {
      const a = t;
      let c, d;
      for (t = r[0], c = 0; c < r.length - 1; c++) d = z(this, a[s + c], i, c), d === U && (d = this._$AH[c]), o || (o = !B(d) || d !== this._$AH[c]), d === _ ? t = _ : t !== _ && (t += (d ?? "") + r[c + 1]), this._$AH[c] = d;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Qt extends J {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === _ ? void 0 : t;
  }
}
class te extends J {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== _);
  }
}
class ee extends J {
  constructor(t, i, s, n, r) {
    super(t, i, s, n, r), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = z(this, t, i, 0) ?? _) === U) return;
    const s = this._$AH, n = t === _ && s !== _ || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== _ && (s === _ || n);
    n && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ie {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    z(this, t);
  }
}
const it = F.litHtmlPolyfillSupport;
it == null || it(j, W), (F.litHtmlVersions ?? (F.litHtmlVersions = [])).push("3.3.3");
const se = (e, t, i) => {
  const s = (i == null ? void 0 : i.renderBefore) ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const r = (i == null ? void 0 : i.renderBefore) ?? null;
    s._$litPart$ = n = new W(t.insertBefore(q(), r), r, void 0, i ?? {});
  }
  return n._$AI(e), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis;
class D extends N {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var i;
    const t = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = t.firstChild), t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = se(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return U;
  }
}
var Ct;
D._$litElement$ = !0, D.finalized = !0, (Ct = T.litElementHydrateSupport) == null || Ct.call(T, { LitElement: D });
const st = T.litElementPolyfillSupport;
st == null || st({ LitElement: D });
(T.litElementVersions ?? (T.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ut = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ne = { attribute: !0, type: String, converter: G, reflect: !1, hasChanged: ct }, re = (e = ne, t, i) => {
  const { kind: s, metadata: n } = i;
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), r.set(i.name, e), s === "accessor") {
    const { name: o } = i;
    return { set(a) {
      const c = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(o, c, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, e, a), a;
    } };
  }
  if (s === "setter") {
    const { name: o } = i;
    return function(a) {
      const c = this[o];
      t.call(this, a), this.requestUpdate(o, c, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function V(e) {
  return (t, i) => typeof i == "object" ? re(e, t, i) : ((s, n, r) => {
    const o = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, s), o ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function P(e) {
  return V({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ae(e, t) {
  return (i, s, n) => {
    const r = (o) => {
      var a;
      return ((a = o.renderRoot) == null ? void 0 : a.querySelector(e)) ?? null;
    };
    return oe(i, s, { get() {
      return r(this);
    } });
  };
}
const le = [
  "feeding",
  "sleep",
  "tummy_time",
  "diaper",
  "growth",
  "medication",
  "vaccine",
  "walk",
  "other"
], ce = ["bottle", "breast_left", "breast_right", "solids"];
function de(e, t, i, s) {
  const n = (e == null ? void 0 : e.enabled_activities) ?? le, r = (e == null ? void 0 : e.enabled_feeding_methods) ?? ce, o = (c) => c.charAt(0).toUpperCase() + c.slice(1), a = [];
  if (n.includes("diaper") && a.push(
    p`
                <button
                    class="quick"
                    aria-label="Log diaper for ${t}"
                    @click=${() => s("diaper")}
                >
                    Diaper
                </button>
            `
  ), n.includes("feeding"))
    for (const c of r)
      c === "bottle" ? a.push(
        p`
                        <button
                            class="quick"
                            aria-label="Log bottle feeding for ${t}"
                            @click=${() => s("bottle")}
                        >
                            Bottle
                        </button>
                    `
      ) : c === "solids" ? a.push(
        p`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${t}"
                            @click=${() => s("solids")}
                        >
                            Solids
                        </button>
                    `
      ) : (c === "breast_left" || c === "breast_right") && a.push(
        p`
                        <button
                            class="quick"
                            aria-label="Log ${c} feeding for ${t}"
                            @click=${() => s({ activity: "feeding", method: c })}
                        >
                            ${o(c.replace("_", " "))}
                        </button>
                    `
      );
  return n.includes("sleep") && a.push(
    p`
                <button
                    class="quick"
                    aria-label="Log sleep for ${t}"
                    @click=${() => s({ activity: "sleep" })}
                >
                    Sleep
                </button>
            `
  ), n.includes("tummy_time") && a.push(
    p`
                <button
                    class="quick"
                    aria-label="Log tummy time for ${t}"
                    @click=${() => s({ activity: "tummy_time" })}
                >
                    Tummy time
                </button>
            `
  ), n.includes("walk") && a.push(
    p`
                <button
                    class="quick"
                    aria-label="Log walk for ${t}"
                    @click=${() => s({ activity: "walk" })}
                >
                    Walk
                </button>
            `
  ), n.includes("other") && a.push(
    p`
                <button
                    class="quick"
                    aria-label="Log other activity for ${t}"
                    @click=${() => s("other")}
                >
                    Other
                </button>
            `
  ), p`
        <div class="section grid" role="group" aria-label="Quick log">
            ${a}
        </div>
    `;
}
function $(e, t, i = "sensor") {
  return `${i}.babytracker_${e}_${t}`;
}
async function ue(e, t, i, s) {
  return e.callService(t, i, s);
}
function pe(e, t, i) {
  const s = {};
  return (async () => {
    try {
      const n = await e.connection.subscribeMessage(
        i,
        { type: "babytracker/get_baby_config", baby: t, subscribe: !0 }
      );
      s.current = n;
    } catch (n) {
      console.warn("babytracker: subscribeBabyConfig failed", n);
    }
  })(), () => {
    var n;
    return (n = s.current) == null ? void 0 : n.call(s);
  };
}
function Nt(e, t) {
  const i = {};
  return (async () => {
    try {
      const s = await e.connection.subscribeMessage(
        t,
        { type: "babytracker/get_integration_options", subscribe: !0 }
      );
      i.current = s;
    } catch (s) {
      console.warn(
        "babytracker: subscribeIntegrationOptions failed",
        s
      );
    }
  })(), () => {
    var s;
    return (s = i.current) == null ? void 0 : s.call(i);
  };
}
function he(e, t, i) {
  var c, d, h, u, m, f;
  const s = ((c = e.states[$(t, "sleeping", "binary_sensor")]) == null ? void 0 : c.state) === "on", n = ((d = e.states[$(t, "feeding", "binary_sensor")]) == null ? void 0 : d.state) === "on", r = ((h = e.states[$(t, "tummy_time", "binary_sensor")]) == null ? void 0 : h.state) === "on", o = ((u = e.states[$(t, "walking", "binary_sensor")]) == null ? void 0 : u.state) === "on";
  if (!s && !n && !r && !o) return "";
  const a = [];
  if (s) {
    const l = (m = e.states[$(t, "last_sleep_start")]) == null ? void 0 : m.state;
    a.push(
      p`
                <div class="chip warning" role="status">
                    Sleeping ${l ? p`· started ${St(l)}` : ""}
                    <button
                        aria-label="End sleep"
                        @click=${(b) => i("end_sleep", { baby: t }, b.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  if (n && a.push(
    p`
                <div class="chip warning" role="status">
                    Feeding
                    <button
                        aria-label="End feeding"
                        @click=${(l) => i("end_feeding", { baby: t }, l.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), r && a.push(
    p`
                <div class="chip warning" role="status">
                    Tummy time
                    <button
                        aria-label="End tummy time"
                        @click=${(l) => i("end_tummy_time", { baby: t }, l.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), o) {
    const l = (f = e.states[$(t, "last_walk_start")]) == null ? void 0 : f.state;
    a.push(
      p`
                <div class="chip warning" role="status">
                    Walking ${l ? p`· started ${St(l)}` : ""}
                    <button
                        aria-label="End walk"
                        @click=${(b) => i("end_walk", { baby: t }, b.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  return p`<div class="section">${a}</div>`;
}
function St(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const Lt = 29.5735, Ut = 24 * 60 * 60 * 1e3;
function L(e) {
  if (!e) return 0;
  const t = Date.parse(e);
  return Number.isNaN(t) ? 0 : t;
}
function me(e, t = Ut, i = Date.now()) {
  const s = i - t;
  return e.filter((n) => L(n.timestamp) >= s).slice().sort((n, r) => L(r.timestamp) - L(n.timestamp));
}
function fe(e, t = Date.now(), i = Ut) {
  var d, h, u;
  const s = t - i;
  let n = 0, r = 0, o = 0, a = 0, c = 0;
  for (const m of e) {
    const f = L(m.timestamp);
    if (m.type === "sleep") {
      const l = f, b = m.ended_at != null && m.ended_at !== "" ? L(m.ended_at) : t;
      if (l > 0 && b > l && b > s) {
        const g = Math.max(l, s), y = Math.min(b, t);
        y > g && (c += (y - g) / 6e4);
      }
      continue;
    }
    if (!(f < s)) {
      if (m.type === "feeding") {
        n += 1;
        const l = Number(((d = m.data) == null ? void 0 : d.amount) ?? 0), b = String(((h = m.data) == null ? void 0 : h.unit) ?? "");
        l > 0 && (a += b === "oz" ? l * Lt : l);
      } else if (m.type === "diaper") {
        const l = String(((u = m.data) == null ? void 0 : u.kind) ?? "");
        l === "wet" ? r += 1 : l === "dirty" ? o += 1 : l === "both" && (r += 1, o += 1);
      }
    }
  }
  return { feedings: n, wetDiapers: r, dirtyDiapers: o, totalVolumeMl: a, sleepMinutes: c };
}
function be(e) {
  if (!Number.isFinite(e) || e <= 0) return "0m";
  if (e < 60) return `${Math.round(e)}m`;
  const t = Math.floor(e / 60), i = Math.round(e % 60);
  return i === 0 ? `${t}h` : `${t}h ${i}m`;
}
function ge(e) {
  if (!Number.isFinite(e) || e <= 0) return "0 oz";
  const t = e / Lt;
  return t >= 1 ? `${t.toFixed(1)} oz` : `${Math.round(e)} ml`;
}
function At(e) {
  const t = L(e);
  return t === 0 ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const _e = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk"
]);
function $e(e) {
  const t = At(e.timestamp);
  return _e.has(String(e.type ?? "")) && e.ended_at && e.ended_at !== e.timestamp ? p`<span class="muted"
            >${t} – ${At(e.ended_at)}</span
        >` : p`<span class="muted">${t}</span>`;
}
function ye(e, t, i, s, n = /* @__PURE__ */ new Set(), r = () => {
}) {
  var d;
  const o = e.states[$(t, "recent_entries")], a = ((d = o == null ? void 0 : o.attributes) == null ? void 0 : d.entries) ?? [], c = me(a).slice(0, Math.min(s, 50));
  return p`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${c.length === 0 ? p`<p>Nothing logged yet.</p>` : p`
                      <ul class="entries">
                          ${c.map(
    (h) => p`
                                  <li
                                      class="clickable"
                                      role="button"
                                      tabindex="0"
                                      aria-label="Edit entry"
                                      @click=${() => i(h)}
                                      @keydown=${(u) => {
      (u.key === "Enter" || u.key === " ") && (u.preventDefault(), i(h));
    }}
                                  >
                                      <div class="entry-row">
                                          <span aria-label="Entry type"
                                              >${ve(h)}</span
                                          >
                                          ${$e(h)}
                                          ${h.photo_path ? p`<span aria-label="Has photo"
                                                    >📷</span
                                                >` : ""}
                                          ${h.staff ? p`<span
                                                    class="muted"
                                                    aria-label="Logged by Procare staff"
                                                    >via ${h.staff}</span
                                                >` : ""}
                                      </div>
                                      ${h.notes ? p`<div
                                                class="entry-notes muted ${n.has(
      h.id
    ) ? "expanded" : ""}"
                                                role="button"
                                                tabindex="0"
                                                aria-label="Toggle notes"
                                                aria-expanded=${n.has(
      h.id
    ) ? "true" : "false"}
                                                title=${h.notes}
                                                @click=${(u) => {
      u.stopPropagation(), r(h.id);
    }}
                                                @keydown=${(u) => {
      (u.key === "Enter" || u.key === " ") && (u.preventDefault(), u.stopPropagation(), r(h.id));
    }}
                                            >
                                                ${h.notes}
                                            </div>` : ""}
                                  </li>
                              `
  )}
                      </ul>
                  `}
        </div>
    `;
}
function ve(e) {
  const t = String(e.type ?? ""), i = (e == null ? void 0 : e.data) ?? {}, s = i.name ?? i.method ?? i.kind;
  return s ? t === "feeding" && i.amount != null && i.amount !== "" && i.unit ? `${t} (${s}, ${i.amount} ${i.unit})` : `${t} (${s})` : t;
}
function zt(e, t, i, s) {
  var u, m, f, l, b;
  const n = (s == null ? void 0 : s.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", r = (s == null ? void 0 : s.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", o = ((u = e.states[$(t, "weight")]) == null ? void 0 : u.state) ?? "—", a = ((m = e.states[$(t, "height")]) == null ? void 0 : m.state) ?? "—", c = ((f = e.states[$(t, "head_circumference")]) == null ? void 0 : f.state) ?? "—", d = ((l = e.states[$(t, "weight_percentile")]) == null ? void 0 : l.state) ?? "—", h = ((b = e.states[$(t, "height_percentile")]) == null ? void 0 : b.state) ?? "—";
  return p`
        <div class="section" role="region" aria-label="Growth">
            <h2>Growth</h2>
            <div class="growth-grid">
                <div>
                    <div class="label">Weight</div>
                    <div>${o} ${n} · ${d}p</div>
                </div>
                <div>
                    <div class="label">Height</div>
                    <div>${a} ${r} · ${h}p</div>
                </div>
                <div>
                    <div class="label">Head</div>
                    <div>${c} ${r}</div>
                </div>
            </div>
            ${we()}
        </div>
    `;
}
function we(e, t) {
  return p`
        <svg viewBox="0 0 300 120" role="img" aria-label="Growth chart placeholder">
            ${[3, 15, 50, 85, 97].map(
    (s, n) => p`
                    <line
                        x1="0"
                        x2="300"
                        y1="${20 + n * 20}"
                        y2="${20 + n * 20}"
                        stroke="var(--divider-color)"
                        stroke-dasharray="4 4"
                    />
                    <text
                        x="290"
                        y="${20 + n * 20 - 4}"
                        font-size="9"
                        fill="var(--secondary-text-color)"
                        text-anchor="end"
                    >
                        p${s}
                    </text>
                `
  )}
        </svg>
    `;
}
function Ht(e, t) {
  return p`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var c;
    const s = /* @__PURE__ */ new Date(), n = new Date(s.getTime() - 90 * 864e5), r = (d) => d.toISOString().slice(0, 10), o = await e.callService(
      "babytracker",
      "export_report",
      { baby: t, format: "html", start: r(n), end: r(s) },
      void 0,
      !1,
      !0
      // return_response
    ), a = (c = o == null ? void 0 : o.response) == null ? void 0 : c.url;
    a && window.open(a, "_blank", "noopener");
  }}
            >
                Export for pediatrician
            </button>
        </div>
    `;
}
function ke(e, t, i) {
  var s;
  return (s = e == null ? void 0 : e.importer) != null && s.source_entity_id ? p`
        <div class="section">
            <button
                aria-label="Resync importers"
                title="Re-read the source sensor's current activities. Already-imported activities are skipped."
                @click=${(n) => i("resync_importers", { baby: t }, n.currentTarget)}
            >
                Sync importers
            </button>
        </div>
    ` : "";
}
function xe(e, t, i) {
  var o, a;
  const s = (o = e.states) == null ? void 0 : o[$(t, "recent_entries")], n = ((a = s == null ? void 0 : s.attributes) == null ? void 0 : a.entries) ?? [], r = fe(n);
  return p`
        <div class="chips" role="list" aria-label="Last 24 hours summary">
            <div class="chip" role="listitem">${r.feedings} feedings</div>
            <div class="chip" role="listitem">
                ${ge(r.totalVolumeMl)} consumed
            </div>
            <div class="chip" role="listitem">${r.wetDiapers} wet</div>
            <div class="chip" role="listitem">${r.dirtyDiapers} dirty</div>
            <div class="chip" role="listitem">
                ${be(r.sleepMinutes)} sleep
            </div>
        </div>
    `;
}
function Y() {
  const e = /* @__PURE__ */ new Date(), t = (i) => String(i).padStart(2, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}`;
}
function S(e) {
  if (!e) return;
  const t = Date.parse(e);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
function nt(e) {
  if (!e) return "";
  const t = Date.parse(e);
  if (Number.isNaN(t)) return "";
  const i = new Date(t), s = (n) => String(n).padStart(2, "0");
  return `${i.getFullYear()}-${s(i.getMonth() + 1)}-${s(i.getDate())}T${s(i.getHours())}:${s(i.getMinutes())}`;
}
const Se = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk"
]);
function Ae(e, t, i, s, n, r) {
  let o = _;
  if (e !== null)
    switch (e.kind) {
      case "diaper":
        o = Ce(e.baby, i, n);
        break;
      case "bottle":
        o = Te(
          e.baby,
          t,
          e.lastAmount,
          e.lastUnit,
          i,
          n
        );
        break;
      case "solids":
        o = De(e.baby, i, n);
        break;
      case "other":
        o = Oe(e.baby, i, n);
        break;
      case "session":
        o = Le(
          e.baby,
          e.activity,
          e.method,
          i,
          n
        );
        break;
      case "end_sleep_first":
        o = Ee(
          e.baby,
          e.label,
          e.then,
          s,
          n
        );
        break;
      case "confirm_delete_imported":
        o = Me(
          e.entryId,
          e.entryType,
          e.source,
          e.staff ?? null,
          i,
          n
        );
        break;
      case "edit_entry":
        o = Pe(
          e.entry,
          i,
          n,
          r
        );
        break;
    }
  return p`
        <dialog @cancel=${n} @close=${n}>${o}</dialog>
    `;
}
function Ee(e, t, i, s, n) {
  return p`
        <form @submit=${(a) => a.preventDefault()}>
            <h2>End sleep first?</h2>
            <p>${e} is asleep. End the sleep session before ${t}?</p>
            <div class="actions">
                <button type="button" @click=${n}>Cancel</button>
                <button type="button" @click=${async () => {
    n(), await i();
  }}>Skip, just log</button>
                <button
                    type="button"
                    class="primary"
                    autofocus
                    @click=${async () => {
    try {
      await s("end_sleep", { baby: e });
    } catch (a) {
      console.warn("babytracker: end_sleep failed", a);
    }
    n(), await i();
  }}
                >
                    End sleep &amp; continue
                </button>
            </div>
        </form>
    `;
}
function Ce(e, t, i) {
  return p`
        <form @submit=${(n) => {
    n.preventDefault();
    const r = n.currentTarget, o = new FormData(r, n.submitter ?? void 0);
    t("log_diaper", {
      baby: e,
      kind: String(o.get("kind") ?? "wet"),
      timestamp: S(String(o.get("when") ?? "")),
      notes: String(o.get("notes") ?? "") || void 0
    });
  }}>
            <h2>Log diaper</h2>
            <label for="when">When</label>
            <input
                id="when"
                name="when"
                type="datetime-local"
                .value=${Y()}
            />
            <label for="notes">Notes</label>
            <input
                id="notes"
                name="notes"
                type="text"
                placeholder="optional"
            />
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
                <button type="button" @click=${i}>Cancel</button>
            </div>
        </form>
    `;
}
function Te(e, t, i, s, n, r) {
  const o = (t == null ? void 0 : t.volume_unit) ?? s ?? "oz", a = typeof i == "number" && Number.isFinite(i) ? String(i) : "";
  return p`
        <form @submit=${(d) => {
    d.preventDefault();
    const h = d.currentTarget, u = new FormData(h), m = String(u.get("amount") ?? ""), f = m === "" ? void 0 : Number(m), l = S(String(u.get("at") ?? "")), b = String(u.get("unit") ?? o), g = String(u.get("notes") ?? "") || void 0;
    n("log_feeding", {
      baby: e,
      method: "bottle",
      amount: f,
      unit: b,
      started_at: l,
      ended_at: l,
      notes: g
    });
  }}>
            <h2>Log bottle</h2>
            <label for="amount">Amount</label>
            <input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.5"
                inputmode="decimal"
                .value=${a}
                autofocus
            />
            <label for="unit">Unit</label>
            <select id="unit" name="unit">
                <option value="oz" ?selected=${o === "oz"}>oz</option>
                <option value="ml" ?selected=${o === "ml"}>ml</option>
            </select>
            <label for="at">Time</label>
            <input
                id="at"
                name="at"
                type="datetime-local"
                .value=${Y()}
                required
            />
            <label for="notes">Notes</label>
            <input id="notes" name="notes" type="text" placeholder="optional" />
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function De(e, t, i) {
  return p`
        <form @submit=${(n) => {
    n.preventDefault();
    const r = n.currentTarget, o = new FormData(r);
    t("log_feeding", {
      baby: e,
      method: "solids",
      started_at: S(String(o.get("when") ?? "")),
      notes: String(o.get("notes") ?? "") || void 0
    });
  }}>
            <h2>Log solids</h2>
            <label for="notes">What was fed</label>
            <input
                id="notes"
                name="notes"
                type="text"
                placeholder="e.g. banana, oatmeal"
                autofocus
                required
            />
            <label for="when">When</label>
            <input
                id="when"
                name="when"
                type="datetime-local"
                .value=${Y()}
            />
            <div class="actions">
                <button type="button" @click=${i}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Oe(e, t, i) {
  return p`
        <form @submit=${(n) => {
    n.preventDefault();
    const r = n.currentTarget, o = new FormData(r);
    t("log_other", {
      baby: e,
      name: String(o.get("name") ?? ""),
      timestamp: S(String(o.get("when") ?? "")),
      notes: String(o.get("notes") ?? "") || void 0
    });
  }}>
            <h2>Log activity</h2>
            <label for="name">What happened</label>
            <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. bath, doctor visit, first smile"
                autofocus
                required
            />
            <label for="when">When</label>
            <input
                id="when"
                name="when"
                type="datetime-local"
                .value=${Y()}
            />
            <label for="notes">Notes</label>
            <input id="notes" name="notes" type="text" placeholder="optional" />
            <div class="actions">
                <button type="button" @click=${i}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Me(e, t, i, s, n, r) {
  const o = (c) => {
    c.preventDefault(), n("delete_entry", { entry_id: e });
  }, a = s ? `${i} (${s})` : i;
  return p`
        <form @submit=${(c) => c.preventDefault()}>
            <h2>Delete this entry?</h2>
            <p>
                This <strong>${t}</strong> was logged by
                <strong>${a}</strong>, not from this card. Deleting it
                here only removes it from babytracker — the upstream record is
                not affected.
            </p>
            <div class="actions">
                <button type="button" @click=${r} autofocus>Cancel</button>
                <button type="button" class="primary" @click=${o}>
                    Delete anyway
                </button>
            </div>
        </form>
    `;
}
function Pe(e, t, i, s) {
  const n = String((e == null ? void 0 : e.type) ?? ""), r = (e == null ? void 0 : e.data) ?? {}, o = Se.has(n) && // Bottle feedings are point-in-time (started_at == ended_at); render
  // them as a single Time field, same as the log form.
  !(n === "feeding" && r.method === "bottle"), a = (h) => {
    h.preventDefault();
    const u = h.currentTarget, m = new FormData(u), f = {}, l = S(String(m.get("started") ?? ""));
    if (l && (f.timestamp = l), o) {
      const y = S(String(m.get("ended") ?? ""));
      f.ended_at = y ?? null;
    } else n === "feeding" && r.method === "bottle" && l && (f.ended_at = l);
    const b = String(m.get("notes") ?? "");
    f.notes = b || null;
    const g = {};
    if (n === "diaper")
      g.kind = String(m.get("kind") ?? r.kind ?? "wet");
    else if (n === "feeding" && r.method === "bottle") {
      const y = String(m.get("amount") ?? ""), v = y === "" ? null : Number(y);
      g.amount = v, g.unit = String(m.get("unit") ?? r.unit ?? "oz");
    } else if (n === "other" || n === "medication") {
      const y = String(m.get("name") ?? "");
      y && (g.name = y);
    }
    Object.keys(g).length && (f.data = g), t("edit_entry", { entry_id: e.id, fields: f });
  }, c = () => {
    if (!s) {
      i();
      return;
    }
    !!e.source && e.source !== "user" || i(), s({
      id: e.id,
      type: e.type,
      source: e.source,
      staff: e.staff
    });
  }, d = Ne(e);
  return p`
        <form @submit=${a}>
            <h2>${d}</h2>
            ${o ? p`
                      <label for="started">Started</label>
                      <input
                          id="started"
                          name="started"
                          type="datetime-local"
                          .value=${nt(e.timestamp)}
                          required
                      />
                      <label for="ended"
                          >Ended <span class="muted">(blank = ongoing)</span></label
                      >
                      <input
                          id="ended"
                          name="ended"
                          type="datetime-local"
                          .value=${nt(e.ended_at)}
                      />
                  ` : p`
                      <label for="started">Time</label>
                      <input
                          id="started"
                          name="started"
                          type="datetime-local"
                          .value=${nt(e.timestamp)}
                          required
                      />
                  `}
            ${n === "diaper" ? p`
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
            ${n === "feeding" && r.method === "bottle" ? p`
                      <label for="amount">Amount</label>
                      <input
                          id="amount"
                          name="amount"
                          type="number"
                          min="0"
                          step="0.5"
                          inputmode="decimal"
                          .value=${r.amount != null ? String(r.amount) : ""}
                      />
                      <label for="unit">Unit</label>
                      <select id="unit" name="unit">
                          <option value="oz" ?selected=${r.unit === "oz"}>
                              oz
                          </option>
                          <option value="ml" ?selected=${r.unit === "ml"}>
                              ml
                          </option>
                      </select>
                  ` : ""}
            ${n === "other" || n === "medication" ? p`
                      <label for="name">Name</label>
                      <input
                          id="name"
                          name="name"
                          type="text"
                          .value=${String(r.name ?? "")}
                      />
                  ` : ""}
            <label for="notes">Notes</label>
            <input
                id="notes"
                name="notes"
                type="text"
                .value=${String(e.notes ?? "")}
                placeholder="optional"
            />
            <div class="actions">
                <button type="button" @click=${i}>Cancel</button>
                <button
                    type="button"
                    class="danger"
                    aria-label="Delete entry"
                    @click=${c}
                >
                    Delete
                </button>
                <button type="submit" class="primary">Save</button>
            </div>
        </form>
    `;
}
function Ne(e) {
  const t = String((e == null ? void 0 : e.type) ?? "entry"), i = (e == null ? void 0 : e.data) ?? {}, s = i.name ?? i.method ?? i.kind;
  return s ? `Edit ${t} (${s})` : `Edit ${t}`;
}
function Le(e, t, i, s, n) {
  const r = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: i ? `Log ${i.replace("_", " ")} feeding` : "Log feeding"
  };
  return p`
        <form @submit=${(a) => {
    a.preventDefault();
    const c = a.currentTarget, d = new FormData(c), h = S(String(d.get("started") ?? "")), u = S(String(d.get("ended") ?? "")), m = String(d.get("notes") ?? "") || void 0;
    if (!u) {
      const b = {
        baby: e,
        started_at: h
      };
      let g;
      switch (t) {
        case "sleep":
          g = "start_sleep";
          break;
        case "tummy_time":
          g = "start_tummy_time";
          break;
        case "walk":
          g = "start_walk";
          break;
        case "feeding":
          g = "start_feeding", b.method = i;
          break;
      }
      s(g, b);
      return;
    }
    const f = {
      baby: e,
      started_at: h,
      ended_at: u,
      notes: m
    };
    let l;
    switch (t) {
      case "sleep":
        l = "log_sleep";
        break;
      case "tummy_time":
        l = "log_tummy_time";
        break;
      case "walk":
        l = "log_walk";
        break;
      case "feeding":
        l = "log_feeding", f.method = i;
        break;
    }
    s(l, f);
  }}>
            <h2>${r[t]}</h2>
            <label for="started">Started</label>
            <input
                id="started"
                name="started"
                type="datetime-local"
                .value=${Y()}
                required
            />
            <label for="ended">Ended <span class="muted">(optional)</span></label>
            <input
                id="ended"
                name="ended"
                type="datetime-local"
                placeholder="leave blank for an open session"
            />
            <label for="notes">Notes</label>
            <input id="notes" name="notes" type="text" placeholder="optional" />
            <div class="actions">
                <button type="button" @click=${n}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
const rt = 24 * 60 * 60 * 1e3, Et = 29.5735;
function Ue(e, t, i = 7) {
  var h, u, m, f;
  const s = (h = e == null ? void 0 : e.states) == null ? void 0 : h[$(t, "recent_entries")], n = ((u = s == null ? void 0 : s.attributes) == null ? void 0 : u.entries) ?? [], r = Date.now(), o = new Date(r);
  o.setHours(0, 0, 0, 0);
  const a = [], c = (l) => l.toLocaleDateString([], { weekday: "short" });
  for (let l = i - 1; l >= 0; l--) {
    const b = new Date(o.getTime() - l * rt);
    a.push({
      label: c(b),
      sleepMinutes: 0,
      feedings: 0,
      bottleMl: 0,
      diapers: 0
    });
  }
  const d = o.getTime() - (i - 1) * rt;
  for (const l of n) {
    const b = Date.parse(l == null ? void 0 : l.timestamp);
    if (!Number.isFinite(b)) continue;
    const g = Math.floor((b - d) / rt);
    if (g < 0 || g >= i) continue;
    const y = a[g];
    if (l.type === "feeding") {
      y.feedings += 1;
      const v = Number(((m = l == null ? void 0 : l.data) == null ? void 0 : m.amount) ?? 0), ht = String(((f = l == null ? void 0 : l.data) == null ? void 0 : f.unit) ?? "");
      v > 0 && ht === "oz" ? y.bottleMl += v * Et : v > 0 && ht === "ml" && (y.bottleMl += v);
    } else if (l.type === "diaper")
      y.diapers += 1;
    else if (l.type === "sleep") {
      const v = l != null && l.ended_at && l.ended_at !== "" ? Date.parse(l.ended_at) : r;
      Number.isFinite(v) && v > b && (y.sleepMinutes += (v - b) / 6e4);
    }
  }
  return a.every((l) => l.sleepMinutes === 0 && l.feedings === 0 && l.diapers === 0) ? "" : p`
        <div class="section" role="region" aria-label="Trends">
            <h2>Trends · last ${i} days</h2>
            ${Z(
    a.map((l) => ({ label: l.label, value: l.sleepMinutes })),
    "Sleep (min/day)",
    (l) => `${Math.round(l)}`
  )}
            ${Z(
    a.map((l) => ({ label: l.label, value: l.feedings })),
    "Feedings/day",
    (l) => `${l}`
  )}
            ${Z(
    a.map((l) => ({ label: l.label, value: l.bottleMl })),
    "Bottle (oz/day)",
    (l) => (l / Et).toFixed(1)
  )}
            ${Z(
    a.map((l) => ({ label: l.label, value: l.diapers })),
    "Diapers/day",
    (l) => `${l}`
  )}
        </div>
    `;
}
function Z(e, t, i) {
  const a = Math.max(1, ...e.map((d) => d.value)), c = (320 - 14 * 2) / e.length;
  return p`
        <div class="trend">
            <div class="label">${t}</div>
            <svg
                viewBox="0 0 ${320} ${90}"
                role="img"
                aria-label=${t}
                style="width:100%;height:${90}px;"
            >
                ${e.map((d, h) => {
    const u = 14 + h * c, m = c * 0.7, f = u + (c - m) / 2, l = Math.max(
      d.value > 0 ? 2 : 0,
      d.value / a * (90 - 24 * 2)
    ), b = 66 - l;
    return p`
                        <rect
                            x=${f}
                            y=${b}
                            width=${m}
                            height=${l}
                            fill="var(--primary-color)"
                            rx="2"
                        ></rect>
                        <text
                            x=${f + m / 2}
                            y=${b - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${d.value > 0 ? i(d.value) : ""}
                        </text>
                        <text
                            x=${f + m / 2}
                            y=${84}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${d.label}
                        </text>
                    `;
  })}
            </svg>
        </div>
    `;
}
function ze(e, t) {
  var n, r;
  const i = e.states[$(t, "vaccines_due")];
  if (!i || i.state === "unknown") return "";
  const s = ((n = e.states[$(t, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : n.state) === "on";
  return p`
        <div
            class="section chip ${s ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${i.state}</strong>
            ${(r = i.attributes) != null && r.due_on ? p`<span>(${i.attributes.due_on})</span>` : ""}
            ${s ? p`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
        </div>
    `;
}
var He = Object.defineProperty, Ie = Object.getOwnPropertyDescriptor, Q = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? Ie(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (n = (s ? o(t, i, n) : o(n)) || n);
  return s && n && He(t, i, n), n;
};
const Re = ["vaccines", "growth", "trends", "export"];
let H = class extends D {
  setConfig(e) {
    if (!(e != null && e.baby))
      throw new Error("babytracker-summary-card: 'baby' is required");
    this._config = { ...e };
  }
  getCardSize() {
    return 4;
  }
  connectedCallback() {
    super.connectedCallback(), this._maybeSubscribe();
  }
  disconnectedCallback() {
    var e;
    (e = this._unsubOptions) == null || e.call(this), this._unsubOptions = void 0, super.disconnectedCallback();
  }
  updated(e) {
    (e.has("hass") || e.has("_config")) && this._maybeSubscribe();
  }
  _maybeSubscribe() {
    !this.hass || !this._config || this._unsubOptions || (this._unsubOptions = Nt(
      this.hass,
      (e) => {
        this._options = e;
      }
    ));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? Re;
  }
  render() {
    if (!this.hass || !this._config) return p``;
    const e = this._sections;
    return p`
            <ha-card>
                ${e.includes("vaccines") ? ze(this.hass, this._config.baby) : ""}
                ${e.includes("growth") ? zt(
      this.hass,
      this._config.baby,
      this._options,
      this._config.units
    ) : ""}
                ${e.includes("trends") ? Ue(
      this.hass,
      this._config.baby,
      this._config.trend_days ?? 7
    ) : ""}
                ${e.includes("export") ? Ht(this.hass, this._config.baby) : ""}
            </ha-card>
        `;
  }
  static getStubConfig() {
    return { type: "custom:babytracker-summary-card", baby: "ava" };
  }
};
H.styles = lt`
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
    `;
Q([
  V({ attribute: !1 })
], H.prototype, "hass", 2);
Q([
  P()
], H.prototype, "_config", 2);
Q([
  P()
], H.prototype, "_options", 2);
H = Q([
  ut("babytracker-summary-card")
], H);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-summary-card",
  name: "babytracker — summary",
  description: "Vaccines, growth, 7-day trend charts, and pediatrician export for one baby."
});
var Fe = Object.defineProperty, qe = Object.getOwnPropertyDescriptor, A = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? qe(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (n = (s ? o(t, i, n) : o(n)) || n);
  return s && n && Fe(t, i, n), n;
};
const Be = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "recent",
  "importer_sync"
];
let w = class extends D {
  constructor() {
    super(...arguments), this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._handleService = async (e, t, i) => {
      const s = i instanceof HTMLElement && i.classList.contains("quick") ? i : null;
      try {
        const n = await ue(this.hass, "babytracker", e, t);
        return s && (s.classList.add("logged"), setTimeout(() => s.classList.remove("logged"), 700)), this.requestUpdate(), n;
      } catch (n) {
        throw console.warn("babytracker: service call failed", e, n), n;
      }
    }, this._requestModal = (e) => {
      const t = this._baby();
      if (typeof e == "string") {
        const n = {
          diaper: "logging a diaper",
          bottle: "logging a bottle",
          solids: "logging solids",
          other: "logging this"
        };
        this._interceptIfSleeping(n[e], () => {
          if (e === "bottle") {
            const r = this._lastBottle();
            this._modal = {
              kind: "bottle",
              baby: t,
              lastAmount: r == null ? void 0 : r.amount,
              lastUnit: r == null ? void 0 : r.unit
            };
          } else
            this._modal = { kind: e, baby: t };
        });
        return;
      }
      const i = {
        sleep: "logging another sleep session",
        tummy_time: "starting tummy time",
        walk: "starting a walk",
        feeding: "starting a feeding session"
      }, s = () => {
        this._modal = {
          kind: "session",
          baby: t,
          activity: e.activity,
          method: e.method
        };
      };
      if (e.activity === "sleep") {
        s();
        return;
      }
      this._interceptIfSleeping(i[e.activity], s);
    }, this._requestDelete = (e) => {
      if (!e.source || e.source === "user") {
        this._handleService("delete_entry", { entry_id: e.id });
        return;
      }
      this._modal = {
        kind: "confirm_delete_imported",
        entryId: e.id,
        entryType: e.type ?? "entry",
        source: e.source,
        staff: e.staff ?? null
      };
    }, this._requestEdit = (e) => {
      this._modal = { kind: "edit_entry", entry: e };
    }, this._toggleNotes = (e) => {
      const t = new Set(this._expandedNotes);
      t.has(e) ? t.delete(e) : t.add(e), this._expandedNotes = t;
    }, this._closeModal = () => {
      this._modal = null;
    }, this._submitModal = async (e, t) => {
      await this._handleService(e, t), this._closeModal();
    };
  }
  setConfig(e) {
    if (!(e != null && e.baby)) throw new Error("babytracker-card: 'baby' is required");
    this._config = { ...e };
  }
  getCardSize() {
    return 6;
  }
  connectedCallback() {
    super.connectedCallback(), this._maybeSubscribe();
  }
  disconnectedCallback() {
    var e, t;
    (e = this._unsubBaby) == null || e.call(this), (t = this._unsubOptions) == null || t.call(this), this._unsubBaby = void 0, this._unsubOptions = void 0, super.disconnectedCallback();
  }
  updated(e) {
    var t;
    (e.has("hass") || e.has("_config")) && this._maybeSubscribe(), e.has("_modal") && (this._modal && this._dialog && !this._dialog.open ? this._dialog.showModal() : !this._modal && ((t = this._dialog) != null && t.open) && this._dialog.close());
  }
  _maybeSubscribe() {
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = pe(
      this.hass,
      this._config.baby,
      (e) => {
        this._babyConfig = e;
      }
    )), this._unsubOptions || (this._unsubOptions = Nt(
      this.hass,
      (e) => {
        this._options = e;
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? Be;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(e, t = "sensor") {
    return $(this._baby(), e, t);
  }
  _renderStatus() {
    var o, a, c, d, h, u, m, f, l, b;
    const e = this.hass, t = (a = (o = e.states) == null ? void 0 : o[this._entityId("last_feeding")]) == null ? void 0 : a.state, i = (d = (c = e.states) == null ? void 0 : c[this._entityId("last_diaper")]) == null ? void 0 : d.state, s = ((u = (h = e.states) == null ? void 0 : h[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : u.state) === "on", n = ((f = (m = e.states) == null ? void 0 : m[this._entityId("walking", "binary_sensor")]) == null ? void 0 : f.state) === "on", r = ((b = (l = e.states) == null ? void 0 : l[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : b.state) === "on";
    return p`
            <div class="chips" role="list" aria-label="Status chips">
                <div class="chip" role="listitem">
                    Last feeding: ${this._timeSince(t)}
                </div>
                <div class="chip" role="listitem">
                    Last diaper: ${this._timeSince(i)}
                </div>
                ${s ? p`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
                ${n ? p`<div class="chip warning" role="listitem">On a walk</div>` : ""}
                ${r ? p`<div class="chip warning" role="listitem">At daycare</div>` : ""}
            </div>
        `;
  }
  _timeSince(e) {
    if (!e || e === "unknown" || e === "unavailable") return "—";
    const t = Date.parse(e);
    if (Number.isNaN(t)) return "—";
    const i = Math.floor((Date.now() - t) / 6e4);
    if (i < 1) return "now";
    if (i < 60) return `${i}m`;
    const s = Math.floor(i / 60);
    return s < 24 ? `${s}h ${i % 60}m` : `${Math.floor(s / 24)}d`;
  }
  _isSleeping() {
    var e, t, i;
    return ((i = (t = (e = this.hass) == null ? void 0 : e.states) == null ? void 0 : t[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : i.state) === "on";
  }
  _lastBottle() {
    var i, s, n, r, o, a, c;
    const e = (s = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : s[this._entityId("recent_entries")], t = ((n = e == null ? void 0 : e.attributes) == null ? void 0 : n.entries) ?? [];
    for (const d of t)
      if ((d == null ? void 0 : d.type) === "feeding" && ((r = d == null ? void 0 : d.data) == null ? void 0 : r.method) === "bottle" && typeof ((o = d == null ? void 0 : d.data) == null ? void 0 : o.amount) == "number" && (((a = d == null ? void 0 : d.data) == null ? void 0 : a.unit) === "ml" || ((c = d == null ? void 0 : d.data) == null ? void 0 : c.unit) === "oz"))
        return { amount: d.data.amount, unit: d.data.unit };
  }
  _interceptIfSleeping(e, t) {
    if (!this._isSleeping()) return t();
    this._modal = {
      kind: "end_sleep_first",
      baby: this._baby(),
      label: e,
      then: t
    };
  }
  render() {
    var t;
    if (!this.hass || !this._config) return p``;
    const e = this._sections;
    return p`
            <ha-card>
                <h2>${((t = this._babyConfig) == null ? void 0 : t.name) ?? this._baby()}</h2>
                ${e.includes("status") ? this._renderStatus() : ""}
                ${e.includes("today") ? xe(this.hass, this._baby(), this._babyConfig) : ""}
                ${e.includes("active_session") ? he(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("quick_log") ? de(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${e.includes("growth") ? zt(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${e.includes("recent") ? ye(
      this.hass,
      this._baby(),
      this._requestEdit,
      this._config.recent_limit ?? 50,
      this._expandedNotes,
      this._toggleNotes
    ) : ""}
                ${e.includes("importer_sync") ? ke(
      this._babyConfig,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("export") ? Ht(this.hass, this._baby()) : ""}
            </ha-card>
            ${Ae(
      this._modal,
      this._options,
      this._submitModal,
      (i, s) => this._handleService(i, s),
      this._closeModal,
      this._requestDelete
    )}
        `;
  }
};
w.styles = lt`
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
            align-items: center;
            gap: 8px;
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
    `;
A([
  V({ attribute: !1 })
], w.prototype, "hass", 2);
A([
  P()
], w.prototype, "_config", 2);
A([
  P()
], w.prototype, "_babyConfig", 2);
A([
  P()
], w.prototype, "_options", 2);
A([
  P()
], w.prototype, "_modal", 2);
A([
  P()
], w.prototype, "_expandedNotes", 2);
A([
  ae("dialog")
], w.prototype, "_dialog", 2);
w = A([
  ut("babytracker-card")
], w);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => Ve);
var je = Object.defineProperty, We = Object.getOwnPropertyDescriptor, pt = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? We(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (n = (s ? o(t, i, n) : o(n)) || n);
  return s && n && je(t, i, n), n;
};
let M = class extends D {
  setConfig(e) {
    this._config = { ...e };
  }
  _valueChanged(e, t) {
    const i = { ...this._config, [e]: t };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: i },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    return p`
            <label for="baby">Baby slug</label>
            <input
                id="baby"
                aria-label="Baby slug"
                .value=${this._config.baby ?? ""}
                @change=${(e) => this._valueChanged(
      "baby",
      e.target.value
    )}
            />
            <label for="recent_limit">Recent entries to show</label>
            <input
                id="recent_limit"
                type="number"
                min="1"
                max="50"
                aria-label="Recent entries to show"
                .value=${String(this._config.recent_limit ?? 10)}
                @change=${(e) => this._valueChanged(
      "recent_limit",
      Number(e.target.value)
    )}
            />
        `;
  }
};
M.styles = lt`
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
pt([
  V({ attribute: !1 })
], M.prototype, "hass", 2);
pt([
  V({ attribute: !1 })
], M.prototype, "_config", 2);
M = pt([
  ut("babytracker-card-editor")
], M);
M.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const Ve = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return M;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  w as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
