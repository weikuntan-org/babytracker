/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, rt = G.ShadowRoot && (G.ShadyCSS === void 0 || G.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ot = Symbol(), pt = /* @__PURE__ */ new WeakMap();
let Et = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== ot) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (rt && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = pt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && pt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ht = (e) => new Et(typeof e == "string" ? e : e + "", void 0, ot), at = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, n, r) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[r + 1], e[0]);
  return new Et(i, e, ot);
}, zt = (e, t) => {
  if (rt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), n = G.litNonce;
    n !== void 0 && s.setAttribute("nonce", n), s.textContent = i.cssText, e.appendChild(s);
  }
}, ft = rt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return Ht(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: It, defineProperty: Rt, getOwnPropertyDescriptor: Bt, getOwnPropertyNames: qt, getOwnPropertySymbols: Ft, getPrototypeOf: jt } = Object, x = globalThis, mt = x.trustedTypes, Wt = mt ? mt.emptyScript : "", tt = x.reactiveElementPolyfillSupport, R = (e, t) => e, Y = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Wt : null;
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
} }, lt = (e, t) => !It(e, t), bt = { attribute: !0, type: String, converter: Y, reflect: !1, useDefault: !1, hasChanged: lt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), x.litPropertyMetadata ?? (x.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let N = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = bt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = Symbol(), n = this.getPropertyDescriptor(t, s, i);
      n !== void 0 && Rt(this.prototype, t, n);
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
    return this.elementProperties.get(t) ?? bt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(R("elementProperties"))) return;
    const t = jt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(R("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(R("properties"))) {
      const i = this.properties, s = [...qt(i), ...Ft(i)];
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
    return zt(t, this.constructor.elementStyles), t;
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
      const o = (((r = s.converter) == null ? void 0 : r.toAttribute) !== void 0 ? s.converter : Y).toAttribute(i, s.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var r, o;
    const s = this.constructor, n = s._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const a = s.getPropertyOptions(n), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((r = a.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? a.converter : Y;
      this._$Em = n;
      const d = l.fromAttribute(i, a.type);
      this[n] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(n)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, n = !1, r) {
    var o;
    if (t !== void 0) {
      const a = this.constructor;
      if (n === !1 && (r = this[t]), s ?? (s = a.getPropertyOptions(t)), !((s.hasChanged ?? lt)(r, i) || s.useDefault && s.reflect && r === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(a._$Eu(t, s)))) return;
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
        const { wrapped: a } = o, l = this[r];
        a !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
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
const B = globalThis, gt = (e) => e, J = B.trustedTypes, _t = J ? J.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Ct = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, Tt = "?" + k, Vt = `<${Tt}>`, T = document, q = () => T.createComment(""), F = (e) => e === null || typeof e != "object" && typeof e != "function", ct = Array.isArray, Zt = (e) => ct(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", et = `[ 	
\f\r]`, I = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, yt = /-->/g, $t = />/g, S = RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), vt = /'/g, wt = /"/g, Dt = /^(?:script|style|textarea|title)$/i, Xt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), u = Xt(1), U = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), kt = /* @__PURE__ */ new WeakMap(), A = T.createTreeWalker(T, 129);
function Mt(e, t) {
  if (!ct(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return _t !== void 0 ? _t.createHTML(t) : t;
}
const Gt = (e, t) => {
  const i = e.length - 1, s = [];
  let n, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = I;
  for (let a = 0; a < i; a++) {
    const l = e[a];
    let d, f, h = -1, p = 0;
    for (; p < l.length && (o.lastIndex = p, f = o.exec(l), f !== null); ) p = o.lastIndex, o === I ? f[1] === "!--" ? o = yt : f[1] !== void 0 ? o = $t : f[2] !== void 0 ? (Dt.test(f[2]) && (n = RegExp("</" + f[2], "g")), o = S) : f[3] !== void 0 && (o = S) : o === S ? f[0] === ">" ? (o = n ?? I, h = -1) : f[1] === void 0 ? h = -2 : (h = o.lastIndex - f[2].length, d = f[1], o = f[3] === void 0 ? S : f[3] === '"' ? wt : vt) : o === wt || o === vt ? o = S : o === yt || o === $t ? o = I : (o = S, n = void 0);
    const m = o === S && e[a + 1].startsWith("/>") ? " " : "";
    r += o === I ? l + Vt : h >= 0 ? (s.push(d), l.slice(0, h) + Ct + l.slice(h) + k + m) : l + k + (h === -2 ? a : m);
  }
  return [Mt(e, r + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class j {
  constructor({ strings: t, _$litType$: i }, s) {
    let n;
    this.parts = [];
    let r = 0, o = 0;
    const a = t.length - 1, l = this.parts, [d, f] = Gt(t, i);
    if (this.el = j.createElement(d, s), A.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (n = A.nextNode()) !== null && l.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const h of n.getAttributeNames()) if (h.endsWith(Ct)) {
          const p = f[o++], m = n.getAttribute(h).split(k), c = /([.?@])?(.*)/.exec(p);
          l.push({ type: 1, index: r, name: c[2], strings: m, ctor: c[1] === "." ? Jt : c[1] === "?" ? Kt : c[1] === "@" ? Qt : K }), n.removeAttribute(h);
        } else h.startsWith(k) && (l.push({ type: 6, index: r }), n.removeAttribute(h));
        if (Dt.test(n.tagName)) {
          const h = n.textContent.split(k), p = h.length - 1;
          if (p > 0) {
            n.textContent = J ? J.emptyScript : "";
            for (let m = 0; m < p; m++) n.append(h[m], q()), A.nextNode(), l.push({ type: 2, index: ++r });
            n.append(h[p], q());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Tt) l.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = n.data.indexOf(k, h + 1)) !== -1; ) l.push({ type: 7, index: r }), h += k.length - 1;
      }
      r++;
    }
  }
  static createElement(t, i) {
    const s = T.createElement("template");
    return s.innerHTML = t, s;
  }
}
function H(e, t, i = e, s) {
  var o, a;
  if (t === U) return t;
  let n = s !== void 0 ? (o = i._$Co) == null ? void 0 : o[s] : i._$Cl;
  const r = F(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== r && ((a = n == null ? void 0 : n._$AO) == null || a.call(n, !1), r === void 0 ? n = void 0 : (n = new r(e), n._$AT(e, i, s)), s !== void 0 ? (i._$Co ?? (i._$Co = []))[s] = n : i._$Cl = n), n !== void 0 && (t = H(e, n._$AS(e, t.values), n, s)), t;
}
class Yt {
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
    const { el: { content: i }, parts: s } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? T).importNode(i, !0);
    A.currentNode = n;
    let r = A.nextNode(), o = 0, a = 0, l = s[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let d;
        l.type === 2 ? d = new W(r, r.nextSibling, this, t) : l.type === 1 ? d = new l.ctor(r, l.name, l.strings, this, t) : l.type === 6 && (d = new te(r, this, t)), this._$AV.push(d), l = s[++a];
      }
      o !== (l == null ? void 0 : l.index) && (r = A.nextNode(), o++);
    }
    return A.currentNode = T, n;
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
    t = H(this, t, i), F(t) ? t === g || t == null || t === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : t !== this._$AH && t !== U && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Zt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== g && F(this._$AH) ? this._$AA.nextSibling.data = t : this.T(T.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: i, _$litType$: s } = t, n = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = j.createElement(Mt(s.h, s.h[0]), this.options)), s);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === n) this._$AH.p(i);
    else {
      const o = new Yt(n, this), a = o.u(this.options);
      o.p(i), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = kt.get(t.strings);
    return i === void 0 && kt.set(t.strings, i = new j(t)), i;
  }
  k(t) {
    ct(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, n = 0;
    for (const r of t) n === i.length ? i.push(s = new W(this.O(q()), this.O(q()), this, this.options)) : s = i[n], s._$AI(r), n++;
    n < i.length && (this._$AR(s && s._$AB.nextSibling, n), i.length = n);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, i); t !== this._$AB; ) {
      const n = gt(t).nextSibling;
      gt(t).remove(), t = n;
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
    if (r === void 0) t = H(this, t, i, 0), o = !F(t) || t !== this._$AH && t !== U, o && (this._$AH = t);
    else {
      const a = t;
      let l, d;
      for (t = r[0], l = 0; l < r.length - 1; l++) d = H(this, a[s + l], i, l), d === U && (d = this._$AH[l]), o || (o = !F(d) || d !== this._$AH[l]), d === g ? t = g : t !== g && (t += (d ?? "") + r[l + 1]), this._$AH[l] = d;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Jt extends K {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === g ? void 0 : t;
  }
}
class Kt extends K {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== g);
  }
}
class Qt extends K {
  constructor(t, i, s, n, r) {
    super(t, i, s, n, r), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = H(this, t, i, 0) ?? g) === U) return;
    const s = this._$AH, n = t === g && s !== g || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== g && (s === g || n);
    n && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class te {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    H(this, t);
  }
}
const it = B.litHtmlPolyfillSupport;
it == null || it(j, W), (B.litHtmlVersions ?? (B.litHtmlVersions = [])).push("3.3.3");
const ee = (e, t, i) => {
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
const E = globalThis;
class C extends N {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ee(i, this.renderRoot, this.renderOptions);
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
var At;
C._$litElement$ = !0, C.finalized = !0, (At = E.litElementHydrateSupport) == null || At.call(E, { LitElement: C });
const st = E.litElementPolyfillSupport;
st == null || st({ LitElement: C });
(E.litElementVersions ?? (E.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ie = { attribute: !0, type: String, converter: Y, reflect: !1, hasChanged: lt }, se = (e = ie, t, i) => {
  const { kind: s, metadata: n } = i;
  let r = globalThis.litPropertyMetadata.get(n);
  if (r === void 0 && globalThis.litPropertyMetadata.set(n, r = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), r.set(i.name, e), s === "accessor") {
    const { name: o } = i;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(o, l, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, e, a), a;
    } };
  }
  if (s === "setter") {
    const { name: o } = i;
    return function(a) {
      const l = this[o];
      t.call(this, a), this.requestUpdate(o, l, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function V(e) {
  return (t, i) => typeof i == "object" ? se(e, t, i) : ((s, n, r) => {
    const o = n.hasOwnProperty(r);
    return n.constructor.createProperty(r, s), o ? Object.getOwnPropertyDescriptor(n, r) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function z(e) {
  return V({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ne = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function re(e, t) {
  return (i, s, n) => {
    const r = (o) => {
      var a;
      return ((a = o.renderRoot) == null ? void 0 : a.querySelector(e)) ?? null;
    };
    return ne(i, s, { get() {
      return r(this);
    } });
  };
}
const oe = [
  "feeding",
  "sleep",
  "tummy_time",
  "diaper",
  "growth",
  "medication",
  "vaccine",
  "walk",
  "other"
], ae = ["bottle", "breast_left", "breast_right", "solids"];
function le(e, t, i, s) {
  const n = (e == null ? void 0 : e.enabled_activities) ?? oe, r = (e == null ? void 0 : e.enabled_feeding_methods) ?? ae, o = (l) => l.charAt(0).toUpperCase() + l.slice(1), a = [];
  if (n.includes("diaper") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log diaper for ${t}"
                    @click=${() => s("diaper")}
                >
                    Diaper
                </button>
            `
  ), n.includes("feeding"))
    for (const l of r)
      l === "bottle" ? a.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log bottle feeding for ${t}"
                            @click=${() => s("bottle")}
                        >
                            Bottle
                        </button>
                    `
      ) : l === "solids" ? a.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${t}"
                            @click=${() => s("solids")}
                        >
                            Solids
                        </button>
                    `
      ) : (l === "breast_left" || l === "breast_right") && a.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log ${l} feeding for ${t}"
                            @click=${() => s({ activity: "feeding", method: l })}
                        >
                            ${o(l.replace("_", " "))}
                        </button>
                    `
      );
  return n.includes("sleep") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log sleep for ${t}"
                    @click=${() => s({ activity: "sleep" })}
                >
                    Sleep
                </button>
            `
  ), n.includes("tummy_time") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log tummy time for ${t}"
                    @click=${() => s({ activity: "tummy_time" })}
                >
                    Tummy time
                </button>
            `
  ), n.includes("walk") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log walk for ${t}"
                    @click=${() => s({ activity: "walk" })}
                >
                    Walk
                </button>
            `
  ), n.includes("other") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log other activity for ${t}"
                    @click=${() => s("other")}
                >
                    Other
                </button>
            `
  ), u`
        <div class="section grid" role="group" aria-label="Quick log">
            ${a}
        </div>
    `;
}
function _(e, t, i = "sensor") {
  return `${i}.babytracker_${e}_${t}`;
}
async function ce(e, t, i, s) {
  return e.callService(t, i, s);
}
function de(e, t, i) {
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
function Ot(e, t) {
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
function ue(e, t, i) {
  var l, d, f, h, p, m;
  const s = ((l = e.states[_(t, "sleeping", "binary_sensor")]) == null ? void 0 : l.state) === "on", n = ((d = e.states[_(t, "feeding", "binary_sensor")]) == null ? void 0 : d.state) === "on", r = ((f = e.states[_(t, "tummy_time", "binary_sensor")]) == null ? void 0 : f.state) === "on", o = ((h = e.states[_(t, "walking", "binary_sensor")]) == null ? void 0 : h.state) === "on";
  if (!s && !n && !r && !o) return "";
  const a = [];
  if (s) {
    const c = (p = e.states[_(t, "last_sleep_start")]) == null ? void 0 : p.state;
    a.push(
      u`
                <div class="chip warning" role="status">
                    Sleeping ${c ? u`· started ${xt(c)}` : ""}
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
    u`
                <div class="chip warning" role="status">
                    Feeding
                    <button
                        aria-label="End feeding"
                        @click=${(c) => i("end_feeding", { baby: t }, c.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), r && a.push(
    u`
                <div class="chip warning" role="status">
                    Tummy time
                    <button
                        aria-label="End tummy time"
                        @click=${(c) => i("end_tummy_time", { baby: t }, c.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), o) {
    const c = (m = e.states[_(t, "last_walk_start")]) == null ? void 0 : m.state;
    a.push(
      u`
                <div class="chip warning" role="status">
                    Walking ${c ? u`· started ${xt(c)}` : ""}
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
  return u`<div class="section">${a}</div>`;
}
function xt(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const Pt = 29.5735, Nt = 24 * 60 * 60 * 1e3;
function L(e) {
  if (!e) return 0;
  const t = Date.parse(e);
  return Number.isNaN(t) ? 0 : t;
}
function he(e, t = Nt, i = Date.now()) {
  const s = i - t;
  return e.filter((n) => L(n.timestamp) >= s).slice().sort((n, r) => L(r.timestamp) - L(n.timestamp));
}
function pe(e, t = Date.now(), i = Nt) {
  var d, f, h;
  const s = t - i;
  let n = 0, r = 0, o = 0, a = 0, l = 0;
  for (const p of e) {
    const m = L(p.timestamp);
    if (p.type === "sleep") {
      const c = m, b = p.ended_at != null && p.ended_at !== "" ? L(p.ended_at) : t;
      if (c > 0 && b > c && b > s) {
        const y = Math.max(c, s), $ = Math.min(b, t);
        $ > y && (l += ($ - y) / 6e4);
      }
      continue;
    }
    if (!(m < s)) {
      if (p.type === "feeding") {
        n += 1;
        const c = Number(((d = p.data) == null ? void 0 : d.amount) ?? 0), b = String(((f = p.data) == null ? void 0 : f.unit) ?? "");
        c > 0 && (a += b === "oz" ? c * Pt : c);
      } else if (p.type === "diaper") {
        const c = String(((h = p.data) == null ? void 0 : h.kind) ?? "");
        c === "wet" ? r += 1 : c === "dirty" ? o += 1 : c === "both" && (r += 1, o += 1);
      }
    }
  }
  return { feedings: n, wetDiapers: r, dirtyDiapers: o, totalVolumeMl: a, sleepMinutes: l };
}
function fe(e) {
  if (!Number.isFinite(e) || e <= 0) return "0m";
  if (e < 60) return `${Math.round(e)}m`;
  const t = Math.floor(e / 60), i = Math.round(e % 60);
  return i === 0 ? `${t}h` : `${t}h ${i}m`;
}
function me(e) {
  if (!Number.isFinite(e) || e <= 0) return "0 oz";
  const t = e / Pt;
  return t >= 1 ? `${t.toFixed(1)} oz` : `${Math.round(e)} ml`;
}
function be(e) {
  const t = L(e);
  return t === 0 ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function ge(e, t, i, s) {
  var a;
  const n = e.states[_(t, "recent_entries")], r = ((a = n == null ? void 0 : n.attributes) == null ? void 0 : a.entries) ?? [], o = he(r).slice(0, Math.min(s, 50));
  return u`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${o.length === 0 ? u`<p>Nothing logged yet.</p>` : u`
                      <ul class="entries">
                          ${o.map(
    (l) => u`
                                  <li>
                                      <span aria-label="Entry type"
                                          >${_e(l)}</span
                                      >
                                      <span class="muted"
                                          >${be(l.timestamp)}</span
                                      >
                                      ${l.photo_path ? u`<span aria-label="Has photo"
                                                >📷</span
                                            >` : ""}
                                      ${l.staff ? u`<span
                                                class="muted"
                                                aria-label="Logged by Procare staff"
                                                >via ${l.staff}</span
                                            >` : ""}
                                      <span class="spacer"></span>
                                      <button
                                          aria-label="Delete entry"
                                          @click=${() => i({
      id: l.id,
      type: l.type,
      source: l.source,
      staff: l.staff
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
function _e(e) {
  const t = String(e.type ?? ""), i = (e == null ? void 0 : e.data) ?? {}, s = i.name ?? i.method ?? i.kind;
  return s ? t === "feeding" && i.amount != null && i.amount !== "" && i.unit ? `${t} (${s}, ${i.amount} ${i.unit})` : `${t} (${s})` : t;
}
function Lt(e, t, i, s) {
  var h, p, m, c, b;
  const n = (s == null ? void 0 : s.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", r = (s == null ? void 0 : s.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", o = ((h = e.states[_(t, "weight")]) == null ? void 0 : h.state) ?? "—", a = ((p = e.states[_(t, "height")]) == null ? void 0 : p.state) ?? "—", l = ((m = e.states[_(t, "head_circumference")]) == null ? void 0 : m.state) ?? "—", d = ((c = e.states[_(t, "weight_percentile")]) == null ? void 0 : c.state) ?? "—", f = ((b = e.states[_(t, "height_percentile")]) == null ? void 0 : b.state) ?? "—";
  return u`
        <div class="section" role="region" aria-label="Growth">
            <h2>Growth</h2>
            <div class="growth-grid">
                <div>
                    <div class="label">Weight</div>
                    <div>${o} ${n} · ${d}p</div>
                </div>
                <div>
                    <div class="label">Height</div>
                    <div>${a} ${r} · ${f}p</div>
                </div>
                <div>
                    <div class="label">Head</div>
                    <div>${l} ${r}</div>
                </div>
            </div>
            ${ye()}
        </div>
    `;
}
function ye(e, t) {
  return u`
        <svg viewBox="0 0 300 120" role="img" aria-label="Growth chart placeholder">
            ${[3, 15, 50, 85, 97].map(
    (s, n) => u`
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
function Ut(e, t) {
  return u`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var l;
    const s = /* @__PURE__ */ new Date(), n = new Date(s.getTime() - 90 * 864e5), r = (d) => d.toISOString().slice(0, 10), o = await e.callService(
      "babytracker",
      "export_report",
      { baby: t, format: "html", start: r(n), end: r(s) },
      void 0,
      !1,
      !0
      // return_response
    ), a = (l = o == null ? void 0 : o.response) == null ? void 0 : l.url;
    a && window.open(a, "_blank", "noopener");
  }}
            >
                Export for pediatrician
            </button>
        </div>
    `;
}
function $e(e, t, i) {
  var s;
  return (s = e == null ? void 0 : e.importer) != null && s.source_entity_id ? u`
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
function ve(e, t, i) {
  var o, a;
  const s = (o = e.states) == null ? void 0 : o[_(t, "recent_entries")], n = ((a = s == null ? void 0 : s.attributes) == null ? void 0 : a.entries) ?? [], r = pe(n);
  return u`
        <div class="chips" role="list" aria-label="Last 24 hours summary">
            <div class="chip" role="listitem">${r.feedings} feedings</div>
            <div class="chip" role="listitem">
                ${me(r.totalVolumeMl)} consumed
            </div>
            <div class="chip" role="listitem">${r.wetDiapers} wet</div>
            <div class="chip" role="listitem">${r.dirtyDiapers} dirty</div>
            <div class="chip" role="listitem">
                ${fe(r.sleepMinutes)} sleep
            </div>
        </div>
    `;
}
function Z() {
  const e = /* @__PURE__ */ new Date(), t = (i) => String(i).padStart(2, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}`;
}
function D(e) {
  if (!e) return;
  const t = Date.parse(e);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
function we(e, t, i, s, n) {
  let r = g;
  if (e !== null)
    switch (e.kind) {
      case "diaper":
        r = xe(e.baby, i, n);
        break;
      case "bottle":
        r = Se(
          e.baby,
          t,
          e.lastAmount,
          e.lastUnit,
          i,
          n
        );
        break;
      case "solids":
        r = Ae(e.baby, i, n);
        break;
      case "other":
        r = Ee(e.baby, i, n);
        break;
      case "session":
        r = Te(
          e.baby,
          e.activity,
          e.method,
          i,
          n
        );
        break;
      case "end_sleep_first":
        r = ke(
          e.baby,
          e.label,
          e.then,
          s,
          n
        );
        break;
      case "confirm_delete_imported":
        r = Ce(
          e.entryId,
          e.entryType,
          e.source,
          e.staff ?? null,
          i,
          n
        );
        break;
    }
  return u`
        <dialog @cancel=${n} @close=${n}>${r}</dialog>
    `;
}
function ke(e, t, i, s, n) {
  return u`
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
function xe(e, t, i) {
  return u`
        <form @submit=${(n) => {
    n.preventDefault();
    const r = n.currentTarget, o = new FormData(r, n.submitter ?? void 0);
    t("log_diaper", {
      baby: e,
      kind: String(o.get("kind") ?? "wet"),
      timestamp: D(String(o.get("when") ?? "")),
      notes: String(o.get("notes") ?? "") || void 0
    });
  }}>
            <h2>Log diaper</h2>
            <label for="when">When</label>
            <input
                id="when"
                name="when"
                type="datetime-local"
                .value=${Z()}
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
function Se(e, t, i, s, n, r) {
  const o = (t == null ? void 0 : t.volume_unit) ?? s ?? "oz", a = typeof i == "number" && Number.isFinite(i) ? String(i) : "";
  return u`
        <form @submit=${(d) => {
    d.preventDefault();
    const f = d.currentTarget, h = new FormData(f), p = String(h.get("amount") ?? ""), m = p === "" ? void 0 : Number(p), c = D(String(h.get("started") ?? "")), b = D(String(h.get("ended") ?? "")), y = String(h.get("unit") ?? o), $ = String(h.get("notes") ?? "") || void 0;
    if (!b) {
      n("start_feeding", {
        baby: e,
        method: "bottle",
        started_at: c
      });
      return;
    }
    n("log_feeding", {
      baby: e,
      method: "bottle",
      amount: m,
      unit: y,
      started_at: c,
      ended_at: b,
      notes: $
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
            <label for="started">Started</label>
            <input
                id="started"
                name="started"
                type="datetime-local"
                .value=${Z()}
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
function Ae(e, t, i) {
  return u`
        <form @submit=${(n) => {
    n.preventDefault();
    const r = n.currentTarget, o = new FormData(r);
    t("log_feeding", {
      baby: e,
      method: "solids",
      started_at: D(String(o.get("when") ?? "")),
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
                .value=${Z()}
            />
            <div class="actions">
                <button type="button" @click=${i}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Ee(e, t, i) {
  return u`
        <form @submit=${(n) => {
    n.preventDefault();
    const r = n.currentTarget, o = new FormData(r);
    t("log_other", {
      baby: e,
      name: String(o.get("name") ?? ""),
      timestamp: D(String(o.get("when") ?? "")),
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
                .value=${Z()}
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
function Ce(e, t, i, s, n, r) {
  const o = (l) => {
    l.preventDefault(), n("delete_entry", { entry_id: e });
  }, a = s ? `${i} (${s})` : i;
  return u`
        <form @submit=${(l) => l.preventDefault()}>
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
function Te(e, t, i, s, n) {
  const r = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: i ? `Log ${i.replace("_", " ")} feeding` : "Log feeding"
  };
  return u`
        <form @submit=${(a) => {
    a.preventDefault();
    const l = a.currentTarget, d = new FormData(l), f = D(String(d.get("started") ?? "")), h = D(String(d.get("ended") ?? "")), p = String(d.get("notes") ?? "") || void 0;
    if (!h) {
      const b = {
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
          y = "start_feeding", b.method = i;
          break;
      }
      s(y, b);
      return;
    }
    const m = {
      baby: e,
      started_at: f,
      ended_at: h,
      notes: p
    };
    let c;
    switch (t) {
      case "sleep":
        c = "log_sleep";
        break;
      case "tummy_time":
        c = "log_tummy_time";
        break;
      case "walk":
        c = "log_walk";
        break;
      case "feeding":
        c = "log_feeding", m.method = i;
        break;
    }
    s(c, m);
  }}>
            <h2>${r[t]}</h2>
            <label for="started">Started</label>
            <input
                id="started"
                name="started"
                type="datetime-local"
                .value=${Z()}
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
const nt = 24 * 60 * 60 * 1e3, St = 29.5735;
function De(e, t, i = 7) {
  var f, h, p, m;
  const s = (f = e == null ? void 0 : e.states) == null ? void 0 : f[_(t, "recent_entries")], n = ((h = s == null ? void 0 : s.attributes) == null ? void 0 : h.entries) ?? [], r = Date.now(), o = new Date(r);
  o.setHours(0, 0, 0, 0);
  const a = [], l = (c) => c.toLocaleDateString([], { weekday: "short" });
  for (let c = i - 1; c >= 0; c--) {
    const b = new Date(o.getTime() - c * nt);
    a.push({
      label: l(b),
      sleepMinutes: 0,
      feedings: 0,
      bottleMl: 0,
      diapers: 0
    });
  }
  const d = o.getTime() - (i - 1) * nt;
  for (const c of n) {
    const b = Date.parse(c == null ? void 0 : c.timestamp);
    if (!Number.isFinite(b)) continue;
    const y = Math.floor((b - d) / nt);
    if (y < 0 || y >= i) continue;
    const $ = a[y];
    if (c.type === "feeding") {
      $.feedings += 1;
      const w = Number(((p = c == null ? void 0 : c.data) == null ? void 0 : p.amount) ?? 0), ht = String(((m = c == null ? void 0 : c.data) == null ? void 0 : m.unit) ?? "");
      w > 0 && ht === "oz" ? $.bottleMl += w * St : w > 0 && ht === "ml" && ($.bottleMl += w);
    } else if (c.type === "diaper")
      $.diapers += 1;
    else if (c.type === "sleep") {
      const w = c != null && c.ended_at && c.ended_at !== "" ? Date.parse(c.ended_at) : r;
      Number.isFinite(w) && w > b && ($.sleepMinutes += (w - b) / 6e4);
    }
  }
  return a.every((c) => c.sleepMinutes === 0 && c.feedings === 0 && c.diapers === 0) ? "" : u`
        <div class="section" role="region" aria-label="Trends">
            <h2>Trends · last ${i} days</h2>
            ${X(
    a.map((c) => ({ label: c.label, value: c.sleepMinutes })),
    "Sleep (min/day)",
    (c) => `${Math.round(c)}`
  )}
            ${X(
    a.map((c) => ({ label: c.label, value: c.feedings })),
    "Feedings/day",
    (c) => `${c}`
  )}
            ${X(
    a.map((c) => ({ label: c.label, value: c.bottleMl })),
    "Bottle (oz/day)",
    (c) => (c / St).toFixed(1)
  )}
            ${X(
    a.map((c) => ({ label: c.label, value: c.diapers })),
    "Diapers/day",
    (c) => `${c}`
  )}
        </div>
    `;
}
function X(e, t, i) {
  const a = Math.max(1, ...e.map((d) => d.value)), l = (320 - 14 * 2) / e.length;
  return u`
        <div class="trend">
            <div class="label">${t}</div>
            <svg
                viewBox="0 0 ${320} ${90}"
                role="img"
                aria-label=${t}
                style="width:100%;height:${90}px;"
            >
                ${e.map((d, f) => {
    const h = 14 + f * l, p = l * 0.7, m = h + (l - p) / 2, c = Math.max(
      d.value > 0 ? 2 : 0,
      d.value / a * (90 - 24 * 2)
    ), b = 66 - c;
    return u`
                        <rect
                            x=${m}
                            y=${b}
                            width=${p}
                            height=${c}
                            fill="var(--primary-color)"
                            rx="2"
                        ></rect>
                        <text
                            x=${m + p / 2}
                            y=${b - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${d.value > 0 ? i(d.value) : ""}
                        </text>
                        <text
                            x=${m + p / 2}
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
function Me(e, t) {
  var n, r;
  const i = e.states[_(t, "vaccines_due")];
  if (!i || i.state === "unknown") return "";
  const s = ((n = e.states[_(t, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : n.state) === "on";
  return u`
        <div
            class="section chip ${s ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${i.state}</strong>
            ${(r = i.attributes) != null && r.due_on ? u`<span>(${i.attributes.due_on})</span>` : ""}
            ${s ? u`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
        </div>
    `;
}
var Oe = Object.defineProperty, Pe = Object.getOwnPropertyDescriptor, Q = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? Pe(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (n = (s ? o(t, i, n) : o(n)) || n);
  return s && n && Oe(t, i, n), n;
};
const Ne = ["vaccines", "growth", "trends", "export"];
let M = class extends C {
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
    !this.hass || !this._config || this._unsubOptions || (this._unsubOptions = Ot(
      this.hass,
      (e) => {
        this._options = e;
      }
    ));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? Ne;
  }
  render() {
    if (!this.hass || !this._config) return u``;
    const e = this._sections;
    return u`
            <ha-card>
                ${e.includes("vaccines") ? Me(this.hass, this._config.baby) : ""}
                ${e.includes("growth") ? Lt(
      this.hass,
      this._config.baby,
      this._options,
      this._config.units
    ) : ""}
                ${e.includes("trends") ? De(
      this.hass,
      this._config.baby,
      this._config.trend_days ?? 7
    ) : ""}
                ${e.includes("export") ? Ut(this.hass, this._config.baby) : ""}
            </ha-card>
        `;
  }
  static getStubConfig() {
    return { type: "custom:babytracker-summary-card", baby: "ava" };
  }
};
M.styles = at`
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
], M.prototype, "hass", 2);
Q([
  z()
], M.prototype, "_config", 2);
Q([
  z()
], M.prototype, "_options", 2);
M = Q([
  dt("babytracker-summary-card")
], M);
for (const e of [
  "babytracker-medical-card",
  "babytracker-growth-card"
])
  customElements.get(e) || customElements.define(
    e,
    class extends M {
    }
  );
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-summary-card",
  name: "babytracker — summary",
  description: "Vaccines, growth, 7-day trend charts, and pediatrician export for one baby."
});
var Le = Object.defineProperty, Ue = Object.getOwnPropertyDescriptor, P = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? Ue(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (n = (s ? o(t, i, n) : o(n)) || n);
  return s && n && Le(t, i, n), n;
};
const He = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "recent",
  "importer_sync"
];
let v = class extends C {
  constructor() {
    super(...arguments), this._modal = null, this._handleService = async (e, t, i) => {
      const s = i instanceof HTMLElement && i.classList.contains("quick") ? i : null;
      try {
        const n = await ce(this.hass, "babytracker", e, t);
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
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = de(
      this.hass,
      this._config.baby,
      (e) => {
        this._babyConfig = e;
      }
    )), this._unsubOptions || (this._unsubOptions = Ot(
      this.hass,
      (e) => {
        this._options = e;
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? He;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(e, t = "sensor") {
    return _(this._baby(), e, t);
  }
  _renderStatus() {
    var o, a, l, d, f, h, p, m, c, b;
    const e = this.hass, t = (a = (o = e.states) == null ? void 0 : o[this._entityId("last_feeding")]) == null ? void 0 : a.state, i = (d = (l = e.states) == null ? void 0 : l[this._entityId("last_diaper")]) == null ? void 0 : d.state, s = ((h = (f = e.states) == null ? void 0 : f[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : h.state) === "on", n = ((m = (p = e.states) == null ? void 0 : p[this._entityId("walking", "binary_sensor")]) == null ? void 0 : m.state) === "on", r = ((b = (c = e.states) == null ? void 0 : c[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : b.state) === "on";
    return u`
            <div class="chips" role="list" aria-label="Status chips">
                <div class="chip" role="listitem">
                    Last feeding: ${this._timeSince(t)}
                </div>
                <div class="chip" role="listitem">
                    Last diaper: ${this._timeSince(i)}
                </div>
                ${s ? u`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
                ${n ? u`<div class="chip warning" role="listitem">On a walk</div>` : ""}
                ${r ? u`<div class="chip warning" role="listitem">At daycare</div>` : ""}
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
    var i, s, n, r, o, a, l;
    const e = (s = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : s[this._entityId("recent_entries")], t = ((n = e == null ? void 0 : e.attributes) == null ? void 0 : n.entries) ?? [];
    for (const d of t)
      if ((d == null ? void 0 : d.type) === "feeding" && ((r = d == null ? void 0 : d.data) == null ? void 0 : r.method) === "bottle" && typeof ((o = d == null ? void 0 : d.data) == null ? void 0 : o.amount) == "number" && (((a = d == null ? void 0 : d.data) == null ? void 0 : a.unit) === "ml" || ((l = d == null ? void 0 : d.data) == null ? void 0 : l.unit) === "oz"))
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
    if (!this.hass || !this._config) return u``;
    const e = this._sections;
    return u`
            <ha-card>
                <h2>${((t = this._babyConfig) == null ? void 0 : t.name) ?? this._baby()}</h2>
                ${e.includes("status") ? this._renderStatus() : ""}
                ${e.includes("today") ? ve(this.hass, this._baby(), this._babyConfig) : ""}
                ${e.includes("active_session") ? ue(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("quick_log") ? le(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${e.includes("growth") ? Lt(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${e.includes("recent") ? ge(
      this.hass,
      this._baby(),
      this._requestDelete,
      this._config.recent_limit ?? 50
    ) : ""}
                ${e.includes("importer_sync") ? $e(
      this._babyConfig,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("export") ? Ut(this.hass, this._baby()) : ""}
            </ha-card>
            ${we(
      this._modal,
      this._options,
      this._submitModal,
      (i, s) => this._handleService(i, s),
      this._closeModal
    )}
        `;
  }
};
v.styles = at`
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
P([
  V({ attribute: !1 })
], v.prototype, "hass", 2);
P([
  z()
], v.prototype, "_config", 2);
P([
  z()
], v.prototype, "_babyConfig", 2);
P([
  z()
], v.prototype, "_options", 2);
P([
  z()
], v.prototype, "_modal", 2);
P([
  re("dialog")
], v.prototype, "_dialog", 2);
v = P([
  dt("babytracker-card")
], v);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => Re);
var ze = Object.defineProperty, Ie = Object.getOwnPropertyDescriptor, ut = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? Ie(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (n = (s ? o(t, i, n) : o(n)) || n);
  return s && n && ze(t, i, n), n;
};
let O = class extends C {
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
    return u`
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
O.styles = at`
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
ut([
  V({ attribute: !1 })
], O.prototype, "hass", 2);
ut([
  V({ attribute: !1 })
], O.prototype, "_config", 2);
O = ut([
  dt("babytracker-card-editor")
], O);
O.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const Re = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return O;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  v as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
