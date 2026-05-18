/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, F = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, G = Symbol(), Y = /* @__PURE__ */ new WeakMap();
let dt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== G) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (F && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Y.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Y.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const bt = (i) => new dt(typeof i == "string" ? i : i + "", void 0, G), pt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[o + 1], i[0]);
  return new dt(e, i, G);
}, mt = (i, t) => {
  if (F) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = D.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, tt = F ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return bt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: vt, defineProperty: yt, getOwnPropertyDescriptor: At, getOwnPropertyNames: wt, getOwnPropertySymbols: Et, getPrototypeOf: St } = Object, g = globalThis, et = g.trustedTypes, xt = et ? et.emptyScript : "", L = g.reactiveElementPolyfillSupport, O = (i, t) => i, z = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? xt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, Z = (i, t) => !vt(i, t), st = { attribute: !0, type: String, converter: z, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), g.litPropertyMetadata ?? (g.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let S = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = st) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && yt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: o } = At(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: r, set(n) {
      const a = r == null ? void 0 : r.call(this);
      o == null || o.call(this, n), this.requestUpdate(t, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? st;
  }
  static _$Ei() {
    if (this.hasOwnProperty(O("elementProperties"))) return;
    const t = St(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(O("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(O("properties"))) {
      const e = this.properties, s = [...wt(e), ...Et(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(tt(r));
    } else t !== void 0 && e.push(tt(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return mt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostConnected) == null ? void 0 : s.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var s;
      return (s = e.hostDisconnected) == null ? void 0 : s.call(e);
    });
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    var o;
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const n = (((o = s.converter) == null ? void 0 : o.toAttribute) !== void 0 ? s.converter : z).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, n;
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const a = s.getPropertyOptions(r), c = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : z;
      this._$Em = r;
      const h = c.fromAttribute(e, a.type);
      this[r] = h ?? ((n = this._$Ej) == null ? void 0 : n.get(r)) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, o) {
    var n;
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (o = this[t]), s ?? (s = a.getPropertyOptions(t)), !((s.hasChanged ?? Z)(o, e) || s.useDefault && s.reflect && o === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(a._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: o }, n) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
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
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, n] of r) {
        const { wrapped: a } = n, c = this[o];
        a !== !0 || this._$AL.has(o) || c === void 0 || this.C(o, void 0, n, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (s = this._$EO) == null || s.forEach((r) => {
        var o;
        return (o = r.hostUpdate) == null ? void 0 : o.call(r);
      }), this.update(e)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((s) => {
      var r;
      return (r = s.hostUpdated) == null ? void 0 : r.call(s);
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[O("elementProperties")] = /* @__PURE__ */ new Map(), S[O("finalized")] = /* @__PURE__ */ new Map(), L == null || L({ ReactiveElement: S }), (g.reactiveElementVersions ?? (g.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis, it = (i) => i, j = T.trustedTypes, rt = j ? j.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, ut = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, _t = "?" + f, Ct = `<${_t}>`, A = document, U = () => A.createComment(""), M = (i) => i === null || typeof i != "object" && typeof i != "function", J = Array.isArray, kt = (i) => J(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == "function", q = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, nt = /-->/g, ot = />/g, m = RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), at = /'/g, ct = /"/g, $t = /^(?:script|style|textarea|title)$/i, Pt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), d = Pt(1), C = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), lt = /* @__PURE__ */ new WeakMap(), v = A.createTreeWalker(A, 129);
function ft(i, t) {
  if (!J(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return rt !== void 0 ? rt.createHTML(t) : t;
}
const Ot = (i, t) => {
  const e = i.length - 1, s = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = P;
  for (let a = 0; a < e; a++) {
    const c = i[a];
    let h, p, l = -1, _ = 0;
    for (; _ < c.length && (n.lastIndex = _, p = n.exec(c), p !== null); ) _ = n.lastIndex, n === P ? p[1] === "!--" ? n = nt : p[1] !== void 0 ? n = ot : p[2] !== void 0 ? ($t.test(p[2]) && (r = RegExp("</" + p[2], "g")), n = m) : p[3] !== void 0 && (n = m) : n === m ? p[0] === ">" ? (n = r ?? P, l = -1) : p[1] === void 0 ? l = -2 : (l = n.lastIndex - p[2].length, h = p[1], n = p[3] === void 0 ? m : p[3] === '"' ? ct : at) : n === ct || n === at ? n = m : n === nt || n === ot ? n = P : (n = m, r = void 0);
    const $ = n === m && i[a + 1].startsWith("/>") ? " " : "";
    o += n === P ? c + Ct : l >= 0 ? (s.push(h), c.slice(0, l) + ut + c.slice(l) + f + $) : c + f + (l === -2 ? a : $);
  }
  return [ft(i, o + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class H {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const a = t.length - 1, c = this.parts, [h, p] = Ot(t, e);
    if (this.el = H.createElement(h, s), v.currentNode = this.el.content, e === 2 || e === 3) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (r = v.nextNode()) !== null && c.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const l of r.getAttributeNames()) if (l.endsWith(ut)) {
          const _ = p[n++], $ = r.getAttribute(l).split(f), b = /([.?@])?(.*)/.exec(_);
          c.push({ type: 1, index: o, name: b[2], strings: $, ctor: b[1] === "." ? Ut : b[1] === "?" ? Mt : b[1] === "@" ? Ht : B }), r.removeAttribute(l);
        } else l.startsWith(f) && (c.push({ type: 6, index: o }), r.removeAttribute(l));
        if ($t.test(r.tagName)) {
          const l = r.textContent.split(f), _ = l.length - 1;
          if (_ > 0) {
            r.textContent = j ? j.emptyScript : "";
            for (let $ = 0; $ < _; $++) r.append(l[$], U()), v.nextNode(), c.push({ type: 2, index: ++o });
            r.append(l[_], U());
          }
        }
      } else if (r.nodeType === 8) if (r.data === _t) c.push({ type: 2, index: o });
      else {
        let l = -1;
        for (; (l = r.data.indexOf(f, l + 1)) !== -1; ) c.push({ type: 7, index: o }), l += f.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = A.createElement("template");
    return s.innerHTML = t, s;
  }
}
function k(i, t, e = i, s) {
  var n, a;
  if (t === C) return t;
  let r = s !== void 0 ? (n = e._$Co) == null ? void 0 : n[s] : e._$Cl;
  const o = M(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== o && ((a = r == null ? void 0 : r._$AO) == null || a.call(r, !1), o === void 0 ? r = void 0 : (r = new o(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ?? (e._$Co = []))[s] = r : e._$Cl = r), r !== void 0 && (t = k(i, r._$AS(i, t.values), r, s)), t;
}
class Tt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? A).importNode(e, !0);
    v.currentNode = r;
    let o = v.nextNode(), n = 0, a = 0, c = s[0];
    for (; c !== void 0; ) {
      if (n === c.index) {
        let h;
        c.type === 2 ? h = new N(o, o.nextSibling, this, t) : c.type === 1 ? h = new c.ctor(o, c.name, c.strings, this, t) : c.type === 6 && (h = new Nt(o, this, t)), this._$AV.push(h), c = s[++a];
      }
      n !== (c == null ? void 0 : c.index) && (o = v.nextNode(), n++);
    }
    return v.currentNode = A, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class N {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = k(this, t, e), M(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== C && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : kt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && M(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = H.createElement(ft(s.h, s.h[0]), this.options)), s);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === r) this._$AH.p(e);
    else {
      const n = new Tt(r, this), a = n.u(this.options);
      n.p(e), this.T(a), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = lt.get(t.strings);
    return e === void 0 && lt.set(t.strings, e = new H(t)), e;
  }
  k(t) {
    J(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const o of t) r === e.length ? e.push(s = new N(this.O(U()), this.O(U()), this, this.options)) : s = e[r], s._$AI(o), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = it(t).nextSibling;
      it(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, o) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(t, e = this, s, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = k(this, t, e, 0), n = !M(t) || t !== this._$AH && t !== C, n && (this._$AH = t);
    else {
      const a = t;
      let c, h;
      for (t = o[0], c = 0; c < o.length - 1; c++) h = k(this, a[s + c], e, c), h === C && (h = this._$AH[c]), n || (n = !M(h) || h !== this._$AH[c]), h === u ? t = u : t !== u && (t += (h ?? "") + o[c + 1]), this._$AH[c] = h;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ut extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class Mt extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class Ht extends B {
  constructor(t, e, s, r, o) {
    super(t, e, s, r, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = k(this, t, e, 0) ?? u) === C) return;
    const s = this._$AH, r = t === u && s !== u || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== u && (s === u || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Nt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    k(this, t);
  }
}
const V = T.litHtmlPolyfillSupport;
V == null || V(H, N), (T.litHtmlVersions ?? (T.litHtmlVersions = [])).push("3.3.3");
const Rt = (i, t, e) => {
  const s = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    s._$litPart$ = r = new N(t.insertBefore(U(), o), o, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const y = globalThis;
class x extends S {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Rt(e, this.renderRoot, this.renderOptions);
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
    return C;
  }
}
var ht;
x._$litElement$ = !0, x.finalized = !0, (ht = y.litElementHydrateSupport) == null || ht.call(y, { LitElement: x });
const W = y.litElementPolyfillSupport;
W == null || W({ LitElement: x });
(y.litElementVersions ?? (y.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const gt = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dt = { attribute: !0, type: String, converter: z, reflect: !1, hasChanged: Z }, zt = (i = Dt, t, e) => {
  const { kind: s, metadata: r } = e;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), o.set(e.name, i), s === "accessor") {
    const { name: n } = e;
    return { set(a) {
      const c = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(n, c, i, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(n, void 0, i, a), a;
    } };
  }
  if (s === "setter") {
    const { name: n } = e;
    return function(a) {
      const c = this[n];
      t.call(this, a), this.requestUpdate(n, c, i, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function I(i) {
  return (t, e) => typeof e == "object" ? zt(i, t, e) : ((s, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, s), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function K(i) {
  return I({ ...i, state: !0, attribute: !1 });
}
function jt(i, t, e) {
  const s = (i == null ? void 0 : i.enabled_activities) ?? [
    "feeding",
    "sleep",
    "tummy_time",
    "diaper",
    "growth",
    "medication",
    "vaccine"
  ], r = (i == null ? void 0 : i.enabled_feeding_methods) ?? [
    "bottle",
    "breast_left",
    "breast_right",
    "solids"
  ], o = (a) => a.charAt(0).toUpperCase() + a.slice(1), n = [];
  if (s.includes("diaper"))
    for (const a of ["wet", "dirty", "both"])
      n.push(
        d`
                    <button
                        class="quick"
                        aria-label="Log ${a} diaper for ${t}"
                        @click=${() => e("log_diaper", { baby: t, kind: a })}
                    >
                        ${o(a)} diaper
                    </button>
                `
      );
  if (s.includes("feeding"))
    for (const a of r)
      n.push(
        d`
                    <button
                        class="quick"
                        aria-label="Start ${a} feeding for ${t}"
                        @click=${() => e("start_feeding", { baby: t, method: a })}
                    >
                        ${o(a.replace("_", " "))}
                    </button>
                `
      );
  return s.includes("sleep") && n.push(
    d`
                <button
                    class="quick"
                    aria-label="Start sleep for ${t}"
                    @click=${() => e("start_sleep", { baby: t })}
                >
                    Start sleep
                </button>
            `
  ), s.includes("tummy_time") && n.push(
    d`
                <button
                    class="quick"
                    aria-label="Start tummy time for ${t}"
                    @click=${() => e("start_tummy_time", { baby: t })}
                >
                    Tummy time
                </button>
            `
  ), d`
        <div class="section grid" role="group" aria-label="Quick log">
            ${n}
        </div>
    `;
}
function Bt(i, t, e) {
  var a, c, h, p;
  const s = ((a = i.states[`binary_sensor.${t}_sleeping`]) == null ? void 0 : a.state) === "on", r = ((c = i.states[`binary_sensor.${t}_feeding`]) == null ? void 0 : c.state) === "on", o = ((h = i.states[`binary_sensor.${t}_tummy_time`]) == null ? void 0 : h.state) === "on";
  if (!s && !r && !o) return "";
  const n = [];
  if (s) {
    const l = (p = i.states[`sensor.${t}_last_sleep_start`]) == null ? void 0 : p.state;
    n.push(
      d`
                <div class="chip warning" role="status">
                    Sleeping · started ${l}
                    <button
                        aria-label="End sleep"
                        @click=${() => e("end_sleep", { baby: t })}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  return r && n.push(
    d`
                <div class="chip warning" role="status">
                    Feeding
                    <button
                        aria-label="End feeding"
                        @click=${() => e("end_feeding", { baby: t })}
                    >
                        End
                    </button>
                </div>
            `
  ), o && n.push(
    d`
                <div class="chip warning" role="status">
                    Tummy time
                    <button
                        aria-label="End tummy time"
                        @click=${() => e("end_tummy_time", { baby: t })}
                    >
                        End
                    </button>
                </div>
            `
  ), d`<div class="section">${n}</div>`;
}
function It(i, t, e, s) {
  var n;
  const r = i.states[`sensor.${t}_recent_entries`], o = (((n = r == null ? void 0 : r.attributes) == null ? void 0 : n.entries) ?? []).slice(0, Math.min(s, 50));
  return d`
        <div class="section" role="region" aria-label="Recent entries">
            <h2>Recent</h2>
            ${o.length === 0 ? d`<p>No entries yet.</p>` : d`
                      <ul class="entries">
                          ${o.map(
    (a) => d`
                                  <li>
                                      <span aria-label="Entry type">${a.type}</span>
                                      <span class="muted">${a.timestamp}</span>
                                      ${a.photo_path ? d`<span aria-label="Has photo">📷</span>` : ""}
                                      ${a.staff ? d`<span
                                                class="muted"
                                                aria-label="Logged by Procare staff"
                                                >via ${a.staff}</span
                                            >` : ""}
                                      <span class="spacer"></span>
                                      <button
                                          aria-label="Delete entry"
                                          @click=${() => e("delete_entry", { entry_id: a.id })}
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
function Lt(i, t) {
  var r, o;
  const e = i.states[`sensor.${t}_vaccines_due`];
  if (!e || e.state === "unknown") return "";
  const s = ((r = i.states[`binary_sensor.${t}_vaccines_overdue`]) == null ? void 0 : r.state) === "on";
  return d`
        <div
            class="section chip ${s ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${e.state}</strong>
            ${(o = e.attributes) != null && o.due_on ? d`<span>(${e.attributes.due_on})</span>` : ""}
            ${s ? d`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
        </div>
    `;
}
function qt(i, t, e, s) {
  var l, _, $, b, X;
  const r = (s == null ? void 0 : s.weight) ?? (e == null ? void 0 : e.weight_unit) ?? "kg", o = (s == null ? void 0 : s.length) ?? (e == null ? void 0 : e.length_unit) ?? "cm", n = ((l = i.states[`sensor.${t}_weight`]) == null ? void 0 : l.state) ?? "—", a = ((_ = i.states[`sensor.${t}_height`]) == null ? void 0 : _.state) ?? "—", c = (($ = i.states[`sensor.${t}_head_circumference`]) == null ? void 0 : $.state) ?? "—", h = ((b = i.states[`sensor.${t}_weight_percentile`]) == null ? void 0 : b.state) ?? "—", p = ((X = i.states[`sensor.${t}_height_percentile`]) == null ? void 0 : X.state) ?? "—";
  return d`
        <div class="section" role="region" aria-label="Growth">
            <h2>Growth</h2>
            <div class="growth-grid">
                <div>
                    <div class="label">Weight</div>
                    <div>${n} ${r} · ${h}p</div>
                </div>
                <div>
                    <div class="label">Height</div>
                    <div>${a} ${o} · ${p}p</div>
                </div>
                <div>
                    <div class="label">Head</div>
                    <div>${c} ${o}</div>
                </div>
            </div>
            ${Vt()}
        </div>
    `;
}
function Vt(i, t) {
  return d`
        <svg viewBox="0 0 300 120" role="img" aria-label="Growth chart placeholder">
            ${[3, 15, 50, 85, 97].map(
    (s, r) => d`
                    <line
                        x1="0"
                        x2="300"
                        y1="${20 + r * 20}"
                        y2="${20 + r * 20}"
                        stroke="var(--divider-color)"
                        stroke-dasharray="4 4"
                    />
                    <text
                        x="290"
                        y="${20 + r * 20 - 4}"
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
function Wt(i, t) {
  return d`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var c;
    const s = /* @__PURE__ */ new Date(), r = new Date(s.getTime() - 90 * 864e5), o = (h) => h.toISOString().slice(0, 10), n = await i.callService(
      "babytracker",
      "export_report",
      { baby: t, format: "html", start: o(r), end: o(s) },
      void 0,
      !1,
      !0
      // return_response
    ), a = (c = n == null ? void 0 : n.response) == null ? void 0 : c.url;
    a && window.open(a, "_blank", "noopener");
  }}
            >
                Export for pediatrician
            </button>
        </div>
    `;
}
async function Ft(i, t, e, s) {
  return i.callService(t, e, s);
}
function Gt(i, t, e) {
  const s = {};
  return (async () => {
    try {
      const r = await i.connection.subscribeMessage(
        e,
        { type: "babytracker/get_baby_config", baby: t, subscribe: !0 }
      );
      s.current = r;
    } catch (r) {
      console.warn("babytracker: subscribeBabyConfig failed", r);
    }
  })(), () => {
    var r;
    return (r = s.current) == null ? void 0 : r.call(s);
  };
}
function Zt(i, t) {
  const e = {};
  return (async () => {
    try {
      const s = await i.connection.subscribeMessage(
        t,
        { type: "babytracker/get_integration_options", subscribe: !0 }
      );
      e.current = s;
    } catch (s) {
      console.warn(
        "babytracker: subscribeIntegrationOptions failed",
        s
      );
    }
  })(), () => {
    var s;
    return (s = e.current) == null ? void 0 : s.call(e);
  };
}
var Jt = Object.defineProperty, Kt = Object.getOwnPropertyDescriptor, R = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? Kt(t, e) : t, o = i.length - 1, n; o >= 0; o--)
    (n = i[o]) && (r = (s ? n(t, e, r) : n(r)) || r);
  return s && r && Jt(t, e, r), r;
};
const Qt = [
  "status",
  "quick_log",
  "active_session",
  "vaccines",
  "growth",
  "recent",
  "export"
];
let w = class extends x {
  constructor() {
    super(...arguments), this._handleService = (i, t) => Ft(this.hass, "babytracker", i, t);
  }
  setConfig(i) {
    if (!(i != null && i.baby)) throw new Error("babytracker-card: 'baby' is required");
    this._config = { ...i };
  }
  getCardSize() {
    return 6;
  }
  connectedCallback() {
    super.connectedCallback(), this._maybeSubscribe();
  }
  disconnectedCallback() {
    var i, t;
    (i = this._unsubBaby) == null || i.call(this), (t = this._unsubOptions) == null || t.call(this), this._unsubBaby = void 0, this._unsubOptions = void 0, super.disconnectedCallback();
  }
  updated(i) {
    (i.has("hass") || i.has("_config")) && this._maybeSubscribe();
  }
  _maybeSubscribe() {
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = Gt(
      this.hass,
      this._config.baby,
      (i) => {
        this._babyConfig = i;
      }
    )), this._unsubOptions || (this._unsubOptions = Zt(
      this.hass,
      (i) => {
        this._options = i;
      }
    )));
  }
  get _sections() {
    var i;
    return ((i = this._config) == null ? void 0 : i.sections) ?? Qt;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(i, t = "sensor") {
    return `${t}.${this._baby()}_${i}`;
  }
  _renderStatus() {
    var o, n, a, c, h, p, l, _;
    const i = this.hass, t = (n = (o = i.states) == null ? void 0 : o[this._entityId("last_feeding")]) == null ? void 0 : n.state, e = (c = (a = i.states) == null ? void 0 : a[this._entityId("last_diaper")]) == null ? void 0 : c.state, s = ((p = (h = i.states) == null ? void 0 : h[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : p.state) === "on", r = ((_ = (l = i.states) == null ? void 0 : l[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : _.state) === "on";
    return d`
            <div class="chips" role="list" aria-label="Status chips">
                <div class="chip" role="listitem">
                    Last feeding: ${this._timeSince(t)}
                </div>
                <div class="chip" role="listitem">
                    Last diaper: ${this._timeSince(e)}
                </div>
                ${s ? d`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
                ${r ? d`<div class="chip warning" role="listitem">At daycare</div>` : ""}
            </div>
        `;
  }
  _timeSince(i) {
    if (!i || i === "unknown" || i === "unavailable") return "—";
    const t = Date.parse(i);
    if (Number.isNaN(t)) return "—";
    const e = Math.floor((Date.now() - t) / 6e4);
    if (e < 1) return "now";
    if (e < 60) return `${e}m`;
    const s = Math.floor(e / 60);
    return s < 24 ? `${s}h ${e % 60}m` : `${Math.floor(s / 24)}d`;
  }
  render() {
    var t;
    if (!this.hass || !this._config) return d``;
    const i = this._sections;
    return d`
            <ha-card>
                <h2>${((t = this._babyConfig) == null ? void 0 : t.name) ?? this._baby()}</h2>
                ${i.includes("status") ? this._renderStatus() : ""}
                ${i.includes("active_session") ? Bt(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${i.includes("quick_log") ? jt(
      this._babyConfig,
      this._baby(),
      this._handleService
    ) : ""}
                ${i.includes("vaccines") ? Lt(this.hass, this._baby()) : ""}
                ${i.includes("growth") ? qt(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${i.includes("recent") ? It(
      this.hass,
      this._baby(),
      this._handleService,
      this._config.recent_limit ?? 10
    ) : ""}
                ${i.includes("export") ? Wt(this.hass, this._baby()) : ""}
            </ha-card>
        `;
  }
};
w.styles = pt`
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
    `;
R([
  I({ attribute: !1 })
], w.prototype, "hass", 2);
R([
  K()
], w.prototype, "_config", 2);
R([
  K()
], w.prototype, "_babyConfig", 2);
R([
  K()
], w.prototype, "_options", 2);
w = R([
  gt("babytracker-card")
], w);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, and vaccines."
});
Promise.resolve().then(() => te);
var Xt = Object.defineProperty, Yt = Object.getOwnPropertyDescriptor, Q = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? Yt(t, e) : t, o = i.length - 1, n; o >= 0; o--)
    (n = i[o]) && (r = (s ? n(t, e, r) : n(r)) || r);
  return s && r && Xt(t, e, r), r;
};
let E = class extends x {
  setConfig(i) {
    this._config = { ...i };
  }
  _valueChanged(i, t) {
    const e = { ...this._config, [i]: t };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: e },
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
                @change=${(i) => this._valueChanged(
      "baby",
      i.target.value
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
                @change=${(i) => this._valueChanged(
      "recent_limit",
      Number(i.target.value)
    )}
            />
        `;
  }
};
E.styles = pt`
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
Q([
  I({ attribute: !1 })
], E.prototype, "hass", 2);
Q([
  I({ attribute: !1 })
], E.prototype, "_config", 2);
E = Q([
  gt("babytracker-card-editor")
], E);
E.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const te = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return E;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  w as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
