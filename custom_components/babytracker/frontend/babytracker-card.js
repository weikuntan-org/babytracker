/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis, it = Z.ShadowRoot && (Z.ShadyCSS === void 0 || Z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, st = Symbol(), ct = /* @__PURE__ */ new WeakMap();
let wt = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== st) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (it && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = ct.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && ct.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Dt = (e) => new wt(typeof e == "string" ? e : e + "", void 0, st), nt = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, n, r) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[r + 1], e[0]);
  return new wt(i, e, st);
}, Pt = (e, t) => {
  if (it) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), n = Z.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = i.cssText, e.appendChild(s);
  }
}, dt = it ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return Dt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Mt, defineProperty: Lt, getOwnPropertyDescriptor: Nt, getOwnPropertyNames: Ut, getOwnPropertySymbols: Ht, getPrototypeOf: It } = Object, w = globalThis, ut = w.trustedTypes, zt = ut ? ut.emptyScript : "", Q = w.reactiveElementPolyfillSupport, I = (e, t) => e, G = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? zt : null;
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
} }, rt = (e, t) => !Mt(e, t), ht = { attribute: !0, type: String, converter: G, reflect: !1, useDefault: !1, hasChanged: rt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), w.litPropertyMetadata ?? (w.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let P = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = ht) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, i);
      n !== void 0 && Lt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    const { get: n, set: r } = Nt(this.prototype, t) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: n, set(o) {
      const l = n == null ? void 0 : n.call(this);
      r == null || r.call(this, o), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ht;
  }
  static _$Ei() {
    if (this.hasOwnProperty(I("elementProperties"))) return;
    const t = It(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(I("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(I("properties"))) {
      const i = this.properties, s = [...Ut(i), ...Ht(i)];
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
      for (const n of s) i.unshift(dt(n));
    } else t !== void 0 && i.push(dt(t));
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
    return Pt(t, this.constructor.elementStyles), t;
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
      const l = s.getPropertyOptions(n), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((r = l.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? l.converter : G;
      this._$Em = n;
      const c = a.fromAttribute(i, l.type);
      this[n] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(n)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, n = !1, r) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (n === !1 && (r = this[t]), s ?? (s = l.getPropertyOptions(t)), !((s.hasChanged ?? rt)(r, i) || s.useDefault && s.reflect && r === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, s)))) return;
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
        const { wrapped: l } = o, a = this[r];
        l !== !0 || this._$AL.has(r) || a === void 0 || this.C(r, void 0, o, a);
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
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[I("elementProperties")] = /* @__PURE__ */ new Map(), P[I("finalized")] = /* @__PURE__ */ new Map(), Q == null || Q({ ReactiveElement: P }), (w.reactiveElementVersions ?? (w.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, pt = (e) => e, J = z.trustedTypes, ft = J ? J.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, kt = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, St = "?" + v, Rt = `<${St}>`, E = document, R = () => E.createComment(""), q = (e) => e === null || typeof e != "object" && typeof e != "function", ot = Array.isArray, qt = (e) => ot(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", X = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, bt = /-->/g, mt = />/g, k = RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), gt = /'/g, _t = /"/g, xt = /^(?:script|style|textarea|title)$/i, jt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), d = jt(1), L = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), yt = /* @__PURE__ */ new WeakMap(), S = E.createTreeWalker(E, 129);
function At(e, t) {
  if (!ot(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ft !== void 0 ? ft.createHTML(t) : t;
}
const Bt = (e, t) => {
  const i = e.length - 1, s = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = H;
  for (let l = 0; l < i; l++) {
    const a = e[l];
    let c, f, u = -1, p = 0;
    for (; p < a.length && (o.lastIndex = p, f = o.exec(a), f !== null); ) p = o.lastIndex, o === H ? f[1] === "!--" ? o = bt : f[1] !== void 0 ? o = mt : f[2] !== void 0 ? (xt.test(f[2]) && (n = RegExp("</" + f[2], "g")), o = k) : f[3] !== void 0 && (o = k) : o === k ? f[0] === ">" ? (o = n ?? H, u = -1) : f[1] === void 0 ? u = -2 : (u = o.lastIndex - f[2].length, c = f[1], o = f[3] === void 0 ? k : f[3] === '"' ? _t : gt) : o === _t || o === gt ? o = k : o === bt || o === mt ? o = H : (o = k, n = void 0);
    const b = o === k && e[l + 1].startsWith("/>") ? " " : "";
    r += o === H ? a + Rt : u >= 0 ? (s.push(c), a.slice(0, u) + kt + a.slice(u) + v + b) : a + v + (u === -2 ? l : b);
  }
  return [At(e, r + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class j {
  constructor({ strings: t, _$litType$: i }, s) {
    let n;
    this.parts = [];
    let r = 0, o = 0;
    const l = t.length - 1, a = this.parts, [c, f] = Bt(t, i);
    if (this.el = j.createElement(c, s), S.currentNode = this.el.content, i === 2 || i === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (n = S.nextNode()) !== null && a.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const u of n.getAttributeNames()) if (u.endsWith(kt)) {
          const p = f[o++], b = n.getAttribute(u).split(v), h = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: r, name: h[2], strings: b, ctor: h[1] === "." ? Wt : h[1] === "?" ? Vt : h[1] === "@" ? Zt : K }), n.removeAttribute(u);
        } else u.startsWith(v) && (a.push({ type: 6, index: r }), n.removeAttribute(u));
        if (xt.test(n.tagName)) {
          const u = n.textContent.split(v), p = u.length - 1;
          if (p > 0) {
            n.textContent = J ? J.emptyScript : "";
            for (let b = 0; b < p; b++) n.append(u[b], R()), S.nextNode(), a.push({ type: 2, index: ++r });
            n.append(u[p], R());
          }
        }
      } else if (n.nodeType === 8) if (n.data === St) a.push({ type: 2, index: r });
      else {
        let u = -1;
        for (; (u = n.data.indexOf(v, u + 1)) !== -1; ) a.push({ type: 7, index: r }), u += v.length - 1;
      }
      r++;
    }
  }
  static createElement(t, i) {
    const s = E.createElement("template");
    return s.innerHTML = t, s;
  }
}
function N(e, t, i = e, s) {
  var o, l;
  if (t === L) return t;
  let n = s !== void 0 ? (o = i._$Co) == null ? void 0 : o[s] : i._$Cl;
  const r = q(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== r && ((l = n == null ? void 0 : n._$AO) == null || l.call(n, !1), r === void 0 ? n = void 0 : (n = new r(e), n._$AT(e, i, s)), s !== void 0 ? (i._$Co ?? (i._$Co = []))[s] = n : i._$Cl = n), n !== void 0 && (t = N(e, n._$AS(e, t.values), n, s)), t;
}
class Ft {
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
    const { el: { content: i }, parts: s } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? E).importNode(i, !0);
    S.currentNode = n;
    let r = S.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new B(r, r.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (c = new Gt(r, this, t)), this._$AV.push(c), a = s[++l];
      }
      o !== (a == null ? void 0 : a.index) && (r = S.nextNode(), o++);
    }
    return S.currentNode = E, n;
  }
  p(t) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class B {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, s, n) {
    this.type = 2, this._$AH = g, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
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
    t = N(this, t, i), q(t) ? t === g || t == null || t === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : t !== this._$AH && t !== L && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : qt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== g && q(this._$AH) ? this._$AA.nextSibling.data = t : this.T(E.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: i, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = j.createElement(At(s.h, s.h[0]), this.options)), s);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === n) this._$AH.p(i);
    else {
      const o = new Ft(n, this), l = o.u(this.options);
      o.p(i), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = yt.get(t.strings);
    return i === void 0 && yt.set(t.strings, i = new j(t)), i;
  }
  k(t) {
    ot(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, n = 0;
    for (const r of t) n === i.length ? i.push(s = new B(this.O(R()), this.O(R()), this, this.options)) : s = i[n], s._$AI(r), n++;
    n < i.length && (this._$AR(s && s._$AB.nextSibling, n), i.length = n);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, i); t !== this._$AB; ) {
      const n = pt(t).nextSibling;
      pt(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class K {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, n, r) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = t, this.name = i, this._$AM = n, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = g;
  }
  _$AI(t, i = this, s, n) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = N(this, t, i, 0), o = !q(t) || t !== this._$AH && t !== L, o && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = r[0], a = 0; a < r.length - 1; a++) c = N(this, l[s + a], i, a), c === L && (c = this._$AH[a]), o || (o = !q(c) || c !== this._$AH[a]), c === g ? t = g : t !== g && (t += (c ?? "") + r[a + 1]), this._$AH[a] = c;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Wt extends K {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === g ? void 0 : t;
  }
}
class Vt extends K {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== g);
  }
}
class Zt extends K {
  constructor(t, i, s, n, r) {
    super(t, i, s, n, r), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = N(this, t, i, 0) ?? g) === L) return;
    const s = this._$AH, n = t === g && s !== g || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== g && (s === g || n);
    n && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Gt {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    N(this, t);
  }
}
const tt = z.litHtmlPolyfillSupport;
tt == null || tt(j, B), (z.litHtmlVersions ?? (z.litHtmlVersions = [])).push("3.3.3");
const Jt = (e, t, i) => {
  const s = (i == null ? void 0 : i.renderBefore) ?? t;
  let n = s._$litPart$;
  if (n === void 0) {
    const r = (i == null ? void 0 : i.renderBefore) ?? null;
    s._$litPart$ = n = new B(t.insertBefore(R(), r), r, void 0, i ?? {});
  }
  return n._$AI(e), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis;
class A extends P {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Jt(i, this.renderRoot, this.renderOptions);
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
    return L;
  }
}
var vt;
A._$litElement$ = !0, A.finalized = !0, (vt = x.litElementHydrateSupport) == null || vt.call(x, { LitElement: A });
const et = x.litElementPolyfillSupport;
et == null || et({ LitElement: A });
(x.litElementVersions ?? (x.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const at = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Kt = { attribute: !0, type: String, converter: G, reflect: !1, hasChanged: rt }, Yt = (e = Kt, t, i) => {
  const { kind: s, metadata: n } = i;
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), r.set(i.name, e), s === "accessor") {
    const { name: o } = i;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, e, l), l;
    } };
  }
  if (s === "setter") {
    const { name: o } = i;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function F(e) {
  return (t, i) => typeof i == "object" ? Yt(e, t, i) : ((s, n, r) => {
    const o = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, s), o ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function U(e) {
  return F({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Xt(e, t) {
  return (i, s, n) => {
    const r = (o) => {
      var l;
      return ((l = o.renderRoot) == null ? void 0 : l.querySelector(e)) ?? null;
    };
    return Qt(i, s, { get() {
      return r(this);
    } });
  };
}
const te = [
  "feeding",
  "sleep",
  "tummy_time",
  "diaper",
  "growth",
  "medication",
  "vaccine",
  "walk",
  "other"
], ee = ["bottle", "breast_left", "breast_right", "solids"];
function ie(e, t, i, s) {
  const n = (e == null ? void 0 : e.enabled_activities) ?? te, r = (e == null ? void 0 : e.enabled_feeding_methods) ?? ee, o = (a) => a.charAt(0).toUpperCase() + a.slice(1), l = [];
  if (n.includes("diaper") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log diaper for ${t}"
                    @click=${() => s("diaper")}
                >
                    Diaper
                </button>
            `
  ), n.includes("feeding"))
    for (const a of r)
      a === "bottle" ? l.push(
        d`
                        <button
                            class="quick"
                            aria-label="Log bottle feeding for ${t}"
                            @click=${() => s("bottle")}
                        >
                            Bottle
                        </button>
                    `
      ) : a === "solids" ? l.push(
        d`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${t}"
                            @click=${() => s("solids")}
                        >
                            Solids
                        </button>
                    `
      ) : (a === "breast_left" || a === "breast_right") && l.push(
        d`
                        <button
                            class="quick"
                            aria-label="Log ${a} feeding for ${t}"
                            @click=${() => s({ activity: "feeding", method: a })}
                        >
                            ${o(a.replace("_", " "))}
                        </button>
                    `
      );
  return n.includes("sleep") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log sleep for ${t}"
                    @click=${() => s({ activity: "sleep" })}
                >
                    Sleep
                </button>
            `
  ), n.includes("tummy_time") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log tummy time for ${t}"
                    @click=${() => s({ activity: "tummy_time" })}
                >
                    Tummy time
                </button>
            `
  ), n.includes("walk") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log walk for ${t}"
                    @click=${() => s({ activity: "walk" })}
                >
                    Walk
                </button>
            `
  ), n.includes("other") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log other activity for ${t}"
                    @click=${() => s("other")}
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
function _(e, t, i = "sensor") {
  return `${i}.babytracker_${e}_${t}`;
}
async function se(e, t, i, s) {
  return e.callService(t, i, s);
}
function ne(e, t, i) {
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
function Et(e, t) {
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
function re(e, t, i) {
  var a, c, f, u, p, b;
  const s = ((a = e.states[_(t, "sleeping", "binary_sensor")]) == null ? void 0 : a.state) === "on", n = ((c = e.states[_(t, "feeding", "binary_sensor")]) == null ? void 0 : c.state) === "on", r = ((f = e.states[_(t, "tummy_time", "binary_sensor")]) == null ? void 0 : f.state) === "on", o = ((u = e.states[_(t, "walking", "binary_sensor")]) == null ? void 0 : u.state) === "on";
  if (!s && !n && !r && !o) return "";
  const l = [];
  if (s) {
    const h = (p = e.states[_(t, "last_sleep_start")]) == null ? void 0 : p.state;
    l.push(
      d`
                <div class="chip warning" role="status">
                    Sleeping ${h ? d`· started ${$t(h)}` : ""}
                    <button
                        aria-label="End sleep"
                        @click=${(m) => i("end_sleep", { baby: t }, m.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  if (n && l.push(
    d`
                <div class="chip warning" role="status">
                    Feeding
                    <button
                        aria-label="End feeding"
                        @click=${(h) => i("end_feeding", { baby: t }, h.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), r && l.push(
    d`
                <div class="chip warning" role="status">
                    Tummy time
                    <button
                        aria-label="End tummy time"
                        @click=${(h) => i("end_tummy_time", { baby: t }, h.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), o) {
    const h = (b = e.states[_(t, "last_walk_start")]) == null ? void 0 : b.state;
    l.push(
      d`
                <div class="chip warning" role="status">
                    Walking ${h ? d`· started ${$t(h)}` : ""}
                    <button
                        aria-label="End walk"
                        @click=${(m) => i("end_walk", { baby: t }, m.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  return d`<div class="section">${l}</div>`;
}
function $t(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const Ct = 29.5735, Tt = 24 * 60 * 60 * 1e3;
function M(e) {
  if (!e) return 0;
  const t = Date.parse(e);
  return Number.isNaN(t) ? 0 : t;
}
function oe(e, t = Tt, i = Date.now()) {
  const s = i - t;
  return e.filter((n) => M(n.timestamp) >= s).slice().sort((n, r) => M(r.timestamp) - M(n.timestamp));
}
function ae(e, t = Date.now(), i = Tt) {
  var c, f, u;
  const s = t - i;
  let n = 0, r = 0, o = 0, l = 0, a = 0;
  for (const p of e) {
    const b = M(p.timestamp);
    if (p.type === "sleep") {
      const h = b, m = p.ended_at != null && p.ended_at !== "" ? M(p.ended_at) : t;
      if (h > 0 && m > h && m > s) {
        const y = Math.max(h, s), V = Math.min(m, t);
        V > y && (a += (V - y) / 6e4);
      }
      continue;
    }
    if (!(b < s)) {
      if (p.type === "feeding") {
        n += 1;
        const h = Number(((c = p.data) == null ? void 0 : c.amount) ?? 0), m = String(((f = p.data) == null ? void 0 : f.unit) ?? "");
        h > 0 && (l += m === "oz" ? h * Ct : h);
      } else if (p.type === "diaper") {
        const h = String(((u = p.data) == null ? void 0 : u.kind) ?? "");
        h === "wet" ? r += 1 : h === "dirty" ? o += 1 : h === "both" && (r += 1, o += 1);
      }
    }
  }
  return { feedings: n, wetDiapers: r, dirtyDiapers: o, totalVolumeMl: l, sleepMinutes: a };
}
function le(e) {
  if (!Number.isFinite(e) || e <= 0) return "0m";
  if (e < 60) return `${Math.round(e)}m`;
  const t = Math.floor(e / 60), i = Math.round(e % 60);
  return i === 0 ? `${t}h` : `${t}h ${i}m`;
}
function ce(e) {
  if (!Number.isFinite(e) || e <= 0) return "0 oz";
  const t = e / Ct;
  return t >= 1 ? `${t.toFixed(1)} oz` : `${Math.round(e)} ml`;
}
function de(e) {
  const t = M(e);
  return t === 0 ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function ue(e, t, i, s) {
  var l;
  const n = e.states[_(t, "recent_entries")], r = ((l = n == null ? void 0 : n.attributes) == null ? void 0 : l.entries) ?? [], o = oe(r).slice(0, Math.min(s, 50));
  return d`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${o.length === 0 ? d`<p>Nothing logged yet.</p>` : d`
                      <ul class="entries">
                          ${o.map(
    (a) => d`
                                  <li>
                                      <span aria-label="Entry type"
                                          >${he(a)}</span
                                      >
                                      <span class="muted"
                                          >${de(a.timestamp)}</span
                                      >
                                      ${a.photo_path ? d`<span aria-label="Has photo"
                                                >📷</span
                                            >` : ""}
                                      ${a.staff ? d`<span
                                                class="muted"
                                                aria-label="Logged by Procare staff"
                                                >via ${a.staff}</span
                                            >` : ""}
                                      <span class="spacer"></span>
                                      <button
                                          aria-label="Delete entry"
                                          @click=${() => i({
      id: a.id,
      type: a.type,
      source: a.source,
      staff: a.staff
    })}
                                      >
                                          Delete
                                      </button>
                                  </li>
                              `
  )}
                      </ul>
                  `}
        </div>
    `;
}
function he(e) {
  const t = String(e.type ?? ""), i = (e == null ? void 0 : e.data) ?? {}, s = i.name ?? i.method ?? i.kind;
  return s ? t === "feeding" && i.amount != null && i.amount !== "" && i.unit ? `${t} (${s}, ${i.amount} ${i.unit})` : `${t} (${s})` : t;
}
function Ot(e, t, i, s) {
  var u, p, b, h, m;
  const n = (s == null ? void 0 : s.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", r = (s == null ? void 0 : s.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", o = ((u = e.states[_(t, "weight")]) == null ? void 0 : u.state) ?? "—", l = ((p = e.states[_(t, "height")]) == null ? void 0 : p.state) ?? "—", a = ((b = e.states[_(t, "head_circumference")]) == null ? void 0 : b.state) ?? "—", c = ((h = e.states[_(t, "weight_percentile")]) == null ? void 0 : h.state) ?? "—", f = ((m = e.states[_(t, "height_percentile")]) == null ? void 0 : m.state) ?? "—";
  return d`
        <div class="section" role="region" aria-label="Growth">
            <h2>Growth</h2>
            <div class="growth-grid">
                <div>
                    <div class="label">Weight</div>
                    <div>${o} ${n} · ${c}p</div>
                </div>
                <div>
                    <div class="label">Height</div>
                    <div>${l} ${r} · ${f}p</div>
                </div>
                <div>
                    <div class="label">Head</div>
                    <div>${a} ${r}</div>
                </div>
            </div>
            ${pe()}
        </div>
    `;
}
function pe(e, t) {
  return d`
        <svg viewBox="0 0 300 120" role="img" aria-label="Growth chart placeholder">
            ${[3, 15, 50, 85, 97].map(
    (s, n) => d`
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
function fe(e, t) {
  return d`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var a;
    const s = /* @__PURE__ */ new Date(), n = new Date(s.getTime() - 90 * 864e5), r = (c) => c.toISOString().slice(0, 10), o = await e.callService(
      "babytracker",
      "export_report",
      { baby: t, format: "html", start: r(n), end: r(s) },
      void 0,
      !1,
      !0
      // return_response
    ), l = (a = o == null ? void 0 : o.response) == null ? void 0 : a.url;
    l && window.open(l, "_blank", "noopener");
  }}
            >
                Export for pediatrician
            </button>
        </div>
    `;
}
function be(e, t, i) {
  var s;
  return (s = e == null ? void 0 : e.importer) != null && s.source_entity_id ? d`
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
function me(e, t, i) {
  var o, l;
  const s = (o = e.states) == null ? void 0 : o[_(t, "recent_entries")], n = ((l = s == null ? void 0 : s.attributes) == null ? void 0 : l.entries) ?? [], r = ae(n);
  return d`
        <div class="chips" role="list" aria-label="Last 24 hours summary">
            <div class="chip" role="listitem">${r.feedings} feedings</div>
            <div class="chip" role="listitem">
                ${ce(r.totalVolumeMl)} consumed
            </div>
            <div class="chip" role="listitem">${r.wetDiapers} wet</div>
            <div class="chip" role="listitem">${r.dirtyDiapers} dirty</div>
            <div class="chip" role="listitem">
                ${le(r.sleepMinutes)} sleep
            </div>
        </div>
    `;
}
function W() {
  const e = /* @__PURE__ */ new Date(), t = (i) => String(i).padStart(2, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}`;
}
function C(e) {
  if (!e) return;
  const t = Date.parse(e);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
function ge(e, t, i, s, n) {
  let r = g;
  if (e !== null)
    switch (e.kind) {
      case "diaper":
        r = ye(e.baby, i, n);
        break;
      case "bottle":
        r = $e(
          e.baby,
          t,
          e.lastAmount,
          e.lastUnit,
          i,
          n
        );
        break;
      case "solids":
        r = ve(e.baby, i, n);
        break;
      case "other":
        r = we(e.baby, i, n);
        break;
      case "session":
        r = Se(
          e.baby,
          e.activity,
          e.method,
          i,
          n
        );
        break;
      case "end_sleep_first":
        r = _e(
          e.baby,
          e.label,
          e.then,
          s,
          n
        );
        break;
      case "confirm_delete_imported":
        r = ke(
          e.entryId,
          e.entryType,
          e.source,
          e.staff ?? null,
          i,
          n
        );
        break;
    }
  return d`
        <dialog @cancel=${n} @close=${n}>${r}</dialog>
    `;
}
function _e(e, t, i, s, n) {
  return d`
        <form @submit=${(l) => l.preventDefault()}>
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
    } catch (l) {
      console.warn("babytracker: end_sleep failed", l);
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
function ye(e, t, i) {
  return d`
        <form @submit=${(n) => {
    n.preventDefault();
    const r = n.currentTarget, o = new FormData(r, n.submitter ?? void 0);
    t("log_diaper", {
      baby: e,
      kind: String(o.get("kind") ?? "wet"),
      timestamp: C(String(o.get("when") ?? "")),
      notes: String(o.get("notes") ?? "") || void 0
    });
  }}>
            <h2>Log diaper</h2>
            <label for="when">When</label>
            <input
                id="when"
                name="when"
                type="datetime-local"
                .value=${W()}
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
function $e(e, t, i, s, n, r) {
  const o = (t == null ? void 0 : t.volume_unit) ?? s ?? "oz", l = typeof i == "number" && Number.isFinite(i) ? String(i) : "";
  return d`
        <form @submit=${(c) => {
    c.preventDefault();
    const f = c.currentTarget, u = new FormData(f), p = String(u.get("amount") ?? ""), b = p === "" ? void 0 : Number(p), h = C(String(u.get("started") ?? "")), m = C(String(u.get("ended") ?? "")), y = String(u.get("unit") ?? o), V = String(u.get("notes") ?? "") || void 0;
    if (!m) {
      n("start_feeding", {
        baby: e,
        method: "bottle",
        started_at: h
      });
      return;
    }
    n("log_feeding", {
      baby: e,
      method: "bottle",
      amount: b,
      unit: y,
      started_at: h,
      ended_at: m,
      notes: V
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
                .value=${l}
                autofocus
            />
            <label for="unit">Unit</label>
            <select id="unit" name="unit">
                <option value="oz" ?selected=${o === "oz"}>oz</option>
                <option value="ml" ?selected=${o === "ml"}>ml</option>
            </select>
            <label for="started">Started</label>
            <input
                id="started"
                name="started"
                type="datetime-local"
                .value=${W()}
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
                <button type="button" @click=${r}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function ve(e, t, i) {
  return d`
        <form @submit=${(n) => {
    n.preventDefault();
    const r = n.currentTarget, o = new FormData(r);
    t("log_feeding", {
      baby: e,
      method: "solids",
      started_at: C(String(o.get("when") ?? "")),
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
                .value=${W()}
            />
            <div class="actions">
                <button type="button" @click=${i}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function we(e, t, i) {
  return d`
        <form @submit=${(n) => {
    n.preventDefault();
    const r = n.currentTarget, o = new FormData(r);
    t("log_other", {
      baby: e,
      name: String(o.get("name") ?? ""),
      timestamp: C(String(o.get("when") ?? "")),
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
                .value=${W()}
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
function ke(e, t, i, s, n, r) {
  const o = (a) => {
    a.preventDefault(), n("delete_entry", { entry_id: e });
  }, l = s ? `${i} (${s})` : i;
  return d`
        <form @submit=${(a) => a.preventDefault()}>
            <h2>Delete this entry?</h2>
            <p>
                This <strong>${t}</strong> was logged by
                <strong>${l}</strong>, not from this card. Deleting it
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
function Se(e, t, i, s, n) {
  const r = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: i ? `Log ${i.replace("_", " ")} feeding` : "Log feeding"
  };
  return d`
        <form @submit=${(l) => {
    l.preventDefault();
    const a = l.currentTarget, c = new FormData(a), f = C(String(c.get("started") ?? "")), u = C(String(c.get("ended") ?? "")), p = String(c.get("notes") ?? "") || void 0;
    if (!u) {
      const m = {
        baby: e,
        started_at: f
      };
      let y;
      switch (t) {
        case "sleep":
          y = "start_sleep";
          break;
        case "tummy_time":
          y = "start_tummy_time";
          break;
        case "walk":
          y = "start_walk";
          break;
        case "feeding":
          y = "start_feeding", m.method = i;
          break;
      }
      s(y, m);
      return;
    }
    const b = {
      baby: e,
      started_at: f,
      ended_at: u,
      notes: p
    };
    let h;
    switch (t) {
      case "sleep":
        h = "log_sleep";
        break;
      case "tummy_time":
        h = "log_tummy_time";
        break;
      case "walk":
        h = "log_walk";
        break;
      case "feeding":
        h = "log_feeding", b.method = i;
        break;
    }
    s(h, b);
  }}>
            <h2>${r[t]}</h2>
            <label for="started">Started</label>
            <input
                id="started"
                name="started"
                type="datetime-local"
                .value=${W()}
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
function xe(e, t) {
  var n, r;
  const i = e.states[_(t, "vaccines_due")];
  if (!i || i.state === "unknown") return "";
  const s = ((n = e.states[_(t, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : n.state) === "on";
  return d`
        <div
            class="section chip ${s ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${i.state}</strong>
            ${(r = i.attributes) != null && r.due_on ? d`<span>(${i.attributes.due_on})</span>` : ""}
            ${s ? d`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
        </div>
    `;
}
var Ae = Object.defineProperty, Ee = Object.getOwnPropertyDescriptor, Y = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? Ee(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (n = (s ? o(t, i, n) : o(n)) || n);
  return s && n && Ae(t, i, n), n;
};
const Ce = ["vaccines", "growth"];
let T = class extends A {
  setConfig(e) {
    if (!(e != null && e.baby))
      throw new Error("babytracker-medical-card: 'baby' is required");
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
    !this.hass || !this._config || this._unsubOptions || (this._unsubOptions = Et(
      this.hass,
      (e) => {
        this._options = e;
      }
    ));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? Ce;
  }
  render() {
    if (!this.hass || !this._config) return d``;
    const e = this._sections;
    return d`
            <ha-card>
                ${e.includes("vaccines") ? xe(this.hass, this._config.baby) : ""}
                ${e.includes("growth") ? Ot(
      this.hass,
      this._config.baby,
      this._options,
      this._config.units
    ) : ""}
            </ha-card>
        `;
  }
  static getStubConfig() {
    return { type: "custom:babytracker-medical-card", baby: "ava" };
  }
};
T.styles = nt`
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
        svg {
            width: 100%;
            height: 120px;
            margin-top: 8px;
        }
    `;
Y([
  F({ attribute: !1 })
], T.prototype, "hass", 2);
Y([
  U()
], T.prototype, "_config", 2);
Y([
  U()
], T.prototype, "_options", 2);
T = Y([
  at("babytracker-medical-card")
], T);
customElements.get("babytracker-growth-card") || customElements.define(
  "babytracker-growth-card",
  class extends T {
  }
);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-medical-card",
  name: "babytracker — medical",
  description: "Vaccines due and growth values/percentiles for one baby."
});
var Te = Object.defineProperty, Oe = Object.getOwnPropertyDescriptor, D = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? Oe(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (n = (s ? o(t, i, n) : o(n)) || n);
  return s && n && Te(t, i, n), n;
};
const De = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "recent",
  "importer_sync",
  "export"
];
let $ = class extends A {
  constructor() {
    super(...arguments), this._modal = null, this._handleService = async (e, t, i) => {
      const s = i instanceof HTMLElement && i.classList.contains("quick") ? i : null;
      try {
        const n = await se(this.hass, "babytracker", e, t);
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
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = ne(
      this.hass,
      this._config.baby,
      (e) => {
        this._babyConfig = e;
      }
    )), this._unsubOptions || (this._unsubOptions = Et(
      this.hass,
      (e) => {
        this._options = e;
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? De;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(e, t = "sensor") {
    return _(this._baby(), e, t);
  }
  _renderStatus() {
    var o, l, a, c, f, u, p, b, h, m;
    const e = this.hass, t = (l = (o = e.states) == null ? void 0 : o[this._entityId("last_feeding")]) == null ? void 0 : l.state, i = (c = (a = e.states) == null ? void 0 : a[this._entityId("last_diaper")]) == null ? void 0 : c.state, s = ((u = (f = e.states) == null ? void 0 : f[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : u.state) === "on", n = ((b = (p = e.states) == null ? void 0 : p[this._entityId("walking", "binary_sensor")]) == null ? void 0 : b.state) === "on", r = ((m = (h = e.states) == null ? void 0 : h[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : m.state) === "on";
    return d`
            <div class="chips" role="list" aria-label="Status chips">
                <div class="chip" role="listitem">
                    Last feeding: ${this._timeSince(t)}
                </div>
                <div class="chip" role="listitem">
                    Last diaper: ${this._timeSince(i)}
                </div>
                ${s ? d`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
                ${n ? d`<div class="chip warning" role="listitem">On a walk</div>` : ""}
                ${r ? d`<div class="chip warning" role="listitem">At daycare</div>` : ""}
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
    var i, s, n, r, o, l, a;
    const e = (s = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : s[this._entityId("recent_entries")], t = ((n = e == null ? void 0 : e.attributes) == null ? void 0 : n.entries) ?? [];
    for (const c of t)
      if ((c == null ? void 0 : c.type) === "feeding" && ((r = c == null ? void 0 : c.data) == null ? void 0 : r.method) === "bottle" && typeof ((o = c == null ? void 0 : c.data) == null ? void 0 : o.amount) == "number" && (((l = c == null ? void 0 : c.data) == null ? void 0 : l.unit) === "ml" || ((a = c == null ? void 0 : c.data) == null ? void 0 : a.unit) === "oz"))
        return { amount: c.data.amount, unit: c.data.unit };
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
    if (!this.hass || !this._config) return d``;
    const e = this._sections;
    return d`
            <ha-card>
                <h2>${((t = this._babyConfig) == null ? void 0 : t.name) ?? this._baby()}</h2>
                ${e.includes("status") ? this._renderStatus() : ""}
                ${e.includes("today") ? me(this.hass, this._baby(), this._babyConfig) : ""}
                ${e.includes("active_session") ? re(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("quick_log") ? ie(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${e.includes("growth") ? Ot(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${e.includes("recent") ? ue(
      this.hass,
      this._baby(),
      this._requestDelete,
      this._config.recent_limit ?? 50
    ) : ""}
                ${e.includes("importer_sync") ? be(
      this._babyConfig,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("export") ? fe(this.hass, this._baby()) : ""}
            </ha-card>
            ${ge(
      this._modal,
      this._options,
      this._submitModal,
      (i, s) => this._handleService(i, s),
      this._closeModal
    )}
        `;
  }
};
$.styles = nt`
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
            align-items: center;
            gap: 8px;
            padding: 6px 0;
            border-bottom: 1px solid var(--divider-color);
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
D([
  F({ attribute: !1 })
], $.prototype, "hass", 2);
D([
  U()
], $.prototype, "_config", 2);
D([
  U()
], $.prototype, "_babyConfig", 2);
D([
  U()
], $.prototype, "_options", 2);
D([
  U()
], $.prototype, "_modal", 2);
D([
  Xt("dialog")
], $.prototype, "_dialog", 2);
$ = D([
  at("babytracker-card")
], $);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => Le);
var Pe = Object.defineProperty, Me = Object.getOwnPropertyDescriptor, lt = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? Me(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (n = (s ? o(t, i, n) : o(n)) || n);
  return s && n && Pe(t, i, n), n;
};
let O = class extends A {
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
    return d`
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
O.styles = nt`
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
lt([
  F({ attribute: !1 })
], O.prototype, "hass", 2);
lt([
  F({ attribute: !1 })
], O.prototype, "_config", 2);
O = lt([
  at("babytracker-card-editor")
], O);
O.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const Le = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return O;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  $ as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
