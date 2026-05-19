/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = globalThis, pt = J.ShadowRoot && (J.ShadyCSS === void 0 || J.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ht = Symbol(), _t = /* @__PURE__ */ new WeakMap();
let Pt = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== ht) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (pt && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = _t.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && _t.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Vt = (e) => new Pt(typeof e == "string" ? e : e + "", void 0, ht), it = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new Pt(i, e, ht);
}, Yt = (e, t) => {
  if (pt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), r = J.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, e.appendChild(s);
  }
}, yt = pt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return Vt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Zt, defineProperty: Xt, getOwnPropertyDescriptor: Gt, getOwnPropertyNames: Kt, getOwnPropertySymbols: Jt, getPrototypeOf: Qt } = Object, A = globalThis, vt = A.trustedTypes, te = vt ? vt.emptyScript : "", ot = A.reactiveElementPolyfillSupport, j = (e, t) => e, tt = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? te : null;
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
} }, bt = (e, t) => !Zt(e, t), $t = { attribute: !0, type: String, converter: tt, reflect: !1, useDefault: !1, hasChanged: bt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), A.litPropertyMetadata ?? (A.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let U = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = $t) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, i);
      r !== void 0 && Xt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    const { get: r, set: n } = Gt(this.prototype, t) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: r, set(o) {
      const a = r == null ? void 0 : r.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? $t;
  }
  static _$Ei() {
    if (this.hasOwnProperty(j("elementProperties"))) return;
    const t = Qt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(j("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(j("properties"))) {
      const i = this.properties, s = [...Kt(i), ...Jt(i)];
      for (const r of s) this.createProperty(r, i[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [s, r] of i) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const r = this._$Eu(i, s);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) i.unshift(yt(r));
    } else t !== void 0 && i.push(yt(t));
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
    return Yt(t, this.constructor.elementStyles), t;
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
    var n;
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : tt).toAttribute(i, s.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var n, o;
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const a = s.getPropertyOptions(r), c = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((n = a.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? a.converter : tt;
      this._$Em = r;
      const d = c.fromAttribute(i, a.type);
      this[r] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, r = !1, n) {
    var o;
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (n = this[t]), s ?? (s = a.getPropertyOptions(t)), !((s.hasChanged ?? bt)(n, i) || s.useDefault && s.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(a._$Eu(t, s)))) return;
      this.C(t, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: s, reflect: r, wrapped: n }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? i ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, o] of r) {
        const { wrapped: a } = o, c = this[n];
        a !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, o, c);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (s = this._$EO) == null || s.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(i)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var i;
    (i = this._$EO) == null || i.forEach((s) => {
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
U.elementStyles = [], U.shadowRootOptions = { mode: "open" }, U[j("elementProperties")] = /* @__PURE__ */ new Map(), U[j("finalized")] = /* @__PURE__ */ new Map(), ot == null || ot({ ReactiveElement: U }), (A.reactiveElementVersions ?? (A.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = globalThis, wt = (e) => e, et = B.trustedTypes, xt = et ? et.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Lt = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, Ut = "?" + S, ee = `<${Ut}>`, O = document, W = () => O.createComment(""), V = (e) => e === null || typeof e != "object" && typeof e != "function", mt = Array.isArray, ie = (e) => mt(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", at = `[ 	
\f\r]`, F = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, kt = /-->/g, St = />/g, T = RegExp(`>|${at}(?:([^\\s"'>=/]+)(${at}*=${at}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), At = /'/g, Et = /"/g, zt = /^(?:script|style|textarea|title)$/i, se = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), u = se(1), I = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), Ct = /* @__PURE__ */ new WeakMap(), N = O.createTreeWalker(O, 129);
function It(e, t) {
  if (!mt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return xt !== void 0 ? xt.createHTML(t) : t;
}
const re = (e, t) => {
  const i = e.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = F;
  for (let a = 0; a < i; a++) {
    const c = e[a];
    let d, b, p = -1, h = 0;
    for (; h < c.length && (o.lastIndex = h, b = o.exec(c), b !== null); ) h = o.lastIndex, o === F ? b[1] === "!--" ? o = kt : b[1] !== void 0 ? o = St : b[2] !== void 0 ? (zt.test(b[2]) && (r = RegExp("</" + b[2], "g")), o = T) : b[3] !== void 0 && (o = T) : o === T ? b[0] === ">" ? (o = r ?? F, p = -1) : b[1] === void 0 ? p = -2 : (p = o.lastIndex - b[2].length, d = b[1], o = b[3] === void 0 ? T : b[3] === '"' ? Et : At) : o === Et || o === At ? o = T : o === kt || o === St ? o = F : (o = T, r = void 0);
    const m = o === T && e[a + 1].startsWith("/>") ? " " : "";
    n += o === F ? c + ee : p >= 0 ? (s.push(d), c.slice(0, p) + Lt + c.slice(p) + S + m) : c + S + (p === -2 ? a : m);
  }
  return [It(e, n + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class Y {
  constructor({ strings: t, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const a = t.length - 1, c = this.parts, [d, b] = re(t, i);
    if (this.el = Y.createElement(d, s), N.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = N.nextNode()) !== null && c.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(Lt)) {
          const h = b[o++], m = r.getAttribute(p).split(S), l = /([.?@])?(.*)/.exec(h);
          c.push({ type: 1, index: n, name: l[2], strings: m, ctor: l[1] === "." ? oe : l[1] === "?" ? ae : l[1] === "@" ? le : st }), r.removeAttribute(p);
        } else p.startsWith(S) && (c.push({ type: 6, index: n }), r.removeAttribute(p));
        if (zt.test(r.tagName)) {
          const p = r.textContent.split(S), h = p.length - 1;
          if (h > 0) {
            r.textContent = et ? et.emptyScript : "";
            for (let m = 0; m < h; m++) r.append(p[m], W()), N.nextNode(), c.push({ type: 2, index: ++n });
            r.append(p[h], W());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Ut) c.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(S, p + 1)) !== -1; ) c.push({ type: 7, index: n }), p += S.length - 1;
      }
      n++;
    }
  }
  static createElement(t, i) {
    const s = O.createElement("template");
    return s.innerHTML = t, s;
  }
}
function H(e, t, i = e, s) {
  var o, a;
  if (t === I) return t;
  let r = s !== void 0 ? (o = i._$Co) == null ? void 0 : o[s] : i._$Cl;
  const n = V(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((a = r == null ? void 0 : r._$AO) == null || a.call(r, !1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, i, s)), s !== void 0 ? (i._$Co ?? (i._$Co = []))[s] = r : i._$Cl = r), r !== void 0 && (t = H(e, r._$AS(e, t.values), r, s)), t;
}
class ne {
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
    const { el: { content: i }, parts: s } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? O).importNode(i, !0);
    N.currentNode = r;
    let n = N.nextNode(), o = 0, a = 0, c = s[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let d;
        c.type === 2 ? d = new X(n, n.nextSibling, this, t) : c.type === 1 ? d = new c.ctor(n, c.name, c.strings, this, t) : c.type === 6 && (d = new ce(n, this, t)), this._$AV.push(d), c = s[++a];
      }
      o !== (c == null ? void 0 : c.index) && (n = N.nextNode(), o++);
    }
    return N.currentNode = O, r;
  }
  p(t) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class X {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, s, r) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    t = H(this, t, i), V(t) ? t === _ || t == null || t === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : t !== this._$AH && t !== I && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ie(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== _ && V(this._$AH) ? this._$AA.nextSibling.data = t : this.T(O.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: i, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = Y.createElement(It(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(i);
    else {
      const o = new ne(r, this), a = o.u(this.options);
      o.p(i), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = Ct.get(t.strings);
    return i === void 0 && Ct.set(t.strings, i = new Y(t)), i;
  }
  k(t) {
    mt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const n of t) r === i.length ? i.push(s = new X(this.O(W()), this.O(W()), this, this.options)) : s = i[r], s._$AI(n), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, i); t !== this._$AB; ) {
      const r = wt(t).nextSibling;
      wt(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class st {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, r, n) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = _;
  }
  _$AI(t, i = this, s, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = H(this, t, i, 0), o = !V(t) || t !== this._$AH && t !== I, o && (this._$AH = t);
    else {
      const a = t;
      let c, d;
      for (t = n[0], c = 0; c < n.length - 1; c++) d = H(this, a[s + c], i, c), d === I && (d = this._$AH[c]), o || (o = !V(d) || d !== this._$AH[c]), d === _ ? t = _ : t !== _ && (t += (d ?? "") + n[c + 1]), this._$AH[c] = d;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class oe extends st {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === _ ? void 0 : t;
  }
}
class ae extends st {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== _);
  }
}
class le extends st {
  constructor(t, i, s, r, n) {
    super(t, i, s, r, n), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = H(this, t, i, 0) ?? _) === I) return;
    const s = this._$AH, r = t === _ && s !== _ || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== _ && (s === _ || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ce {
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
const lt = B.litHtmlPolyfillSupport;
lt == null || lt(Y, X), (B.litHtmlVersions ?? (B.litHtmlVersions = [])).push("3.3.3");
const de = (e, t, i) => {
  const s = (i == null ? void 0 : i.renderBefore) ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = (i == null ? void 0 : i.renderBefore) ?? null;
    s._$litPart$ = r = new X(t.insertBefore(W(), n), n, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis;
class E extends U {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = de(i, this.renderRoot, this.renderOptions);
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
    return I;
  }
}
var Ot;
E._$litElement$ = !0, E.finalized = !0, (Ot = M.litElementHydrateSupport) == null || Ot.call(M, { LitElement: E });
const ct = M.litElementPolyfillSupport;
ct == null || ct({ LitElement: E });
(M.litElementVersions ?? (M.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue = { attribute: !0, type: String, converter: tt, reflect: !1, hasChanged: bt }, pe = (e = ue, t, i) => {
  const { kind: s, metadata: r } = i;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(i.name, e), s === "accessor") {
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
function q(e) {
  return (t, i) => typeof i == "object" ? pe(e, t, i) : ((s, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function $(e) {
  return q({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const he = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function be(e, t) {
  return (i, s, r) => {
    const n = (o) => {
      var a;
      return ((a = o.renderRoot) == null ? void 0 : a.querySelector(e)) ?? null;
    };
    return he(i, s, { get() {
      return n(this);
    } });
  };
}
const me = [
  "feeding",
  "sleep",
  "tummy_time",
  "diaper",
  "growth",
  "medication",
  "vaccine",
  "walk",
  "other"
], fe = ["bottle", "breast_left", "breast_right", "solids"];
function ge(e, t, i, s) {
  const r = (e == null ? void 0 : e.enabled_activities) ?? me, n = (e == null ? void 0 : e.enabled_feeding_methods) ?? fe, o = (c) => c.charAt(0).toUpperCase() + c.slice(1), a = [];
  if (r.includes("diaper") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log diaper for ${t}"
                    @click=${() => s("diaper")}
                >
                    Diaper
                </button>
            `
  ), r.includes("feeding"))
    for (const c of n)
      c === "bottle" ? a.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log bottle feeding for ${t}"
                            @click=${() => s("bottle")}
                        >
                            Bottle
                        </button>
                    `
      ) : c === "solids" ? a.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${t}"
                            @click=${() => s("solids")}
                        >
                            Solids
                        </button>
                    `
      ) : (c === "breast_left" || c === "breast_right") && a.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log ${c} feeding for ${t}"
                            @click=${() => s({ activity: "feeding", method: c })}
                        >
                            ${o(c.replace("_", " "))}
                        </button>
                    `
      );
  return r.includes("sleep") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log sleep for ${t}"
                    @click=${() => s({ activity: "sleep" })}
                >
                    Sleep
                </button>
            `
  ), r.includes("tummy_time") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log tummy time for ${t}"
                    @click=${() => s({ activity: "tummy_time" })}
                >
                    Tummy time
                </button>
            `
  ), r.includes("walk") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log walk for ${t}"
                    @click=${() => s({ activity: "walk" })}
                >
                    Walk
                </button>
            `
  ), r.includes("other") && a.push(
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
function y(e, t, i = "sensor") {
  return `${i}.babytracker_${e}_${t}`;
}
async function _e(e, t, i, s) {
  return e.callService(t, i, s);
}
function ye(e, t, i) {
  const s = {};
  return (async () => {
    try {
      const r = await e.connection.subscribeMessage(
        i,
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
function Ht(e, t) {
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
function ve(e, t, i, s, r) {
  const n = {};
  return (async () => {
    try {
      const o = await e.connection.subscribeMessage(
        r,
        {
          type: "babytracker/list_entries_in_range",
          baby: t,
          start: i,
          end: s,
          subscribe: !0
        }
      );
      n.current = o;
    } catch (o) {
      console.warn(
        "babytracker: subscribeEntriesInRange failed",
        o
      );
    }
  })(), () => {
    var o;
    return (o = n.current) == null ? void 0 : o.call(n);
  };
}
function $e(e, t, i) {
  var c, d, b, p, h, m;
  const s = ((c = e.states[y(t, "sleeping", "binary_sensor")]) == null ? void 0 : c.state) === "on", r = ((d = e.states[y(t, "feeding", "binary_sensor")]) == null ? void 0 : d.state) === "on", n = ((b = e.states[y(t, "tummy_time", "binary_sensor")]) == null ? void 0 : b.state) === "on", o = ((p = e.states[y(t, "walking", "binary_sensor")]) == null ? void 0 : p.state) === "on";
  if (!s && !r && !n && !o) return "";
  const a = [];
  if (s) {
    const l = (h = e.states[y(t, "last_sleep_start")]) == null ? void 0 : h.state;
    a.push(
      u`
                <div class="chip warning" role="status">
                    Sleeping ${l ? u`· started ${Dt(l)}` : ""}
                    <button
                        aria-label="End sleep"
                        @click=${(f) => i("end_sleep", { baby: t }, f.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  if (r && a.push(
    u`
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
  ), n && a.push(
    u`
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
    const l = (m = e.states[y(t, "last_walk_start")]) == null ? void 0 : m.state;
    a.push(
      u`
                <div class="chip warning" role="status">
                    Walking ${l ? u`· started ${Dt(l)}` : ""}
                    <button
                        aria-label="End walk"
                        @click=${(f) => i("end_walk", { baby: t }, f.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  return u`<div class="section">${a}</div>`;
}
function Dt(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const Rt = 29.5735, qt = 24 * 60 * 60 * 1e3;
function z(e) {
  if (!e) return 0;
  const t = Date.parse(e);
  return Number.isNaN(t) ? 0 : t;
}
function we(e, t = qt, i = Date.now()) {
  const s = i - t;
  return e.filter((r) => z(r.timestamp) >= s).slice().sort((r, n) => z(n.timestamp) - z(r.timestamp));
}
function xe(e, t = Date.now(), i = qt) {
  var d, b, p;
  const s = t - i;
  let r = 0, n = 0, o = 0, a = 0, c = 0;
  for (const h of e) {
    const m = z(h.timestamp);
    if (h.type === "sleep") {
      const l = m, f = h.ended_at != null && h.ended_at !== "" ? z(h.ended_at) : t;
      if (l > 0 && f > l && f > s) {
        const g = Math.max(l, s), v = Math.min(f, t);
        v > g && (c += (v - g) / 6e4);
      }
      continue;
    }
    if (!(m < s)) {
      if (h.type === "feeding") {
        r += 1;
        const l = Number(((d = h.data) == null ? void 0 : d.amount) ?? 0), f = String(((b = h.data) == null ? void 0 : b.unit) ?? "");
        l > 0 && (a += f === "oz" ? l * Rt : l);
      } else if (h.type === "diaper") {
        const l = String(((p = h.data) == null ? void 0 : p.kind) ?? "");
        l === "wet" ? n += 1 : l === "dirty" ? o += 1 : l === "both" && (n += 1, o += 1);
      }
    }
  }
  return { feedings: r, wetDiapers: n, dirtyDiapers: o, totalVolumeMl: a, sleepMinutes: c };
}
function ke(e) {
  if (!Number.isFinite(e) || e <= 0) return "0m";
  if (e < 60) return `${Math.round(e)}m`;
  const t = Math.floor(e / 60), i = Math.round(e % 60);
  return i === 0 ? `${t}h` : `${t}h ${i}m`;
}
function Se(e) {
  if (!Number.isFinite(e) || e <= 0) return "0 oz";
  const t = e / Rt;
  return t >= 1 ? `${t.toFixed(1)} oz` : `${Math.round(e)} ml`;
}
function Tt(e) {
  const t = z(e);
  return t === 0 ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const Ae = /* @__PURE__ */ new Set(["sleep", "feeding", "tummy_time", "walk"]);
function Ft(e, t, i, s) {
  return u`
        <li
            class="clickable"
            role="button"
            tabindex="0"
            aria-label="Edit entry"
            @click=${() => t(e)}
            @keydown=${(r) => {
    (r.key === "Enter" || r.key === " ") && (r.preventDefault(), t(e));
  }}
        >
            <div class="entry-row">
                <span aria-label="Entry type">${Ce(e)}</span>
                ${Ee(e)}
                ${e.photo_path ? u`<span aria-label="Has photo">📷</span>` : ""}
                ${e.staff ? u`<span
                          class="muted"
                          aria-label="Logged by Procare staff"
                          >via ${e.staff}</span
                      >` : ""}
            </div>
            ${e.notes ? u`<div
                      class="entry-notes muted ${i.has(e.id) ? "expanded" : ""}"
                      role="button"
                      tabindex="0"
                      aria-label="Toggle notes"
                      aria-expanded=${i.has(e.id) ? "true" : "false"}
                      title=${e.notes}
                      @click=${(r) => {
    r.stopPropagation(), s(e.id);
  }}
                      @keydown=${(r) => {
    (r.key === "Enter" || r.key === " ") && (r.preventDefault(), r.stopPropagation(), s(e.id));
  }}
                  >
                      ${e.notes}
                  </div>` : ""}
        </li>
    `;
}
function Ee(e) {
  const t = Tt(e.timestamp);
  return Ae.has(String(e.type ?? "")) && e.ended_at && e.ended_at !== e.timestamp ? u`<span class="muted"
            >${t} – ${Tt(e.ended_at)}</span
        >` : u`<span class="muted">${t}</span>`;
}
function Ce(e) {
  const t = String(e.type ?? ""), i = (e == null ? void 0 : e.data) ?? {}, s = i.name ?? i.method ?? i.kind;
  return s ? t === "feeding" && i.amount != null && i.amount !== "" && i.unit ? `${t} (${s}, ${i.amount} ${i.unit})` : `${t} (${s})` : t;
}
function De(e, t, i, s, r = /* @__PURE__ */ new Set(), n = () => {
}) {
  var d;
  const o = e.states[y(t, "recent_entries")], a = ((d = o == null ? void 0 : o.attributes) == null ? void 0 : d.entries) ?? [], c = we(a).slice(0, Math.min(s, 50));
  return u`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${c.length === 0 ? u`<p>Nothing logged yet.</p>` : u`
                      <ul class="entries">
                          ${c.map(
    (b) => Ft(
      b,
      i,
      r,
      n
    )
  )}
                      </ul>
                  `}
        </div>
    `;
}
function jt(e, t, i, s) {
  var p, h, m, l, f;
  const r = (s == null ? void 0 : s.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", n = (s == null ? void 0 : s.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", o = ((p = e.states[y(t, "weight")]) == null ? void 0 : p.state) ?? "—", a = ((h = e.states[y(t, "height")]) == null ? void 0 : h.state) ?? "—", c = ((m = e.states[y(t, "head_circumference")]) == null ? void 0 : m.state) ?? "—", d = ((l = e.states[y(t, "weight_percentile")]) == null ? void 0 : l.state) ?? "—", b = ((f = e.states[y(t, "height_percentile")]) == null ? void 0 : f.state) ?? "—";
  return u`
        <div class="section" role="region" aria-label="Growth">
            <h2>Growth</h2>
            <div class="growth-grid">
                <div>
                    <div class="label">Weight</div>
                    <div>${o} ${r} · ${d}p</div>
                </div>
                <div>
                    <div class="label">Height</div>
                    <div>${a} ${n} · ${b}p</div>
                </div>
                <div>
                    <div class="label">Head</div>
                    <div>${c} ${n}</div>
                </div>
            </div>
            ${Te()}
        </div>
    `;
}
function Te(e, t) {
  return u`
        <svg viewBox="0 0 300 120" role="img" aria-label="Growth chart placeholder">
            ${[3, 15, 50, 85, 97].map(
    (s, r) => u`
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
function Bt(e, t) {
  return u`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var c;
    const s = /* @__PURE__ */ new Date(), r = new Date(s.getTime() - 90 * 864e5), n = (d) => d.toISOString().slice(0, 10), o = await e.callService(
      "babytracker",
      "export_report",
      { baby: t, format: "html", start: n(r), end: n(s) },
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
function Ne(e, t, i) {
  var s;
  return (s = e == null ? void 0 : e.importer) != null && s.source_entity_id ? u`
        <div class="section">
            <button
                aria-label="Resync importers"
                title="Re-read the source sensor's current activities. Already-imported activities are skipped."
                @click=${(r) => i("resync_importers", { baby: t }, r.currentTarget)}
            >
                Sync importers
            </button>
        </div>
    ` : "";
}
function Me(e, t, i) {
  var o, a;
  const s = (o = e.states) == null ? void 0 : o[y(t, "recent_entries")], r = ((a = s == null ? void 0 : s.attributes) == null ? void 0 : a.entries) ?? [], n = xe(r);
  return u`
        <div class="chips" role="list" aria-label="Last 24 hours summary">
            <div class="chip" role="listitem">${n.feedings} feedings</div>
            <div class="chip" role="listitem">
                ${Se(n.totalVolumeMl)} consumed
            </div>
            <div class="chip" role="listitem">${n.wetDiapers} wet</div>
            <div class="chip" role="listitem">${n.dirtyDiapers} dirty</div>
            <div class="chip" role="listitem">
                ${ke(n.sleepMinutes)} sleep
            </div>
        </div>
    `;
}
function G() {
  const e = /* @__PURE__ */ new Date(), t = (i) => String(i).padStart(2, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}`;
}
function C(e) {
  if (!e) return;
  const t = Date.parse(e);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
function dt(e) {
  if (!e) return "";
  const t = Date.parse(e);
  if (Number.isNaN(t)) return "";
  const i = new Date(t), s = (r) => String(r).padStart(2, "0");
  return `${i.getFullYear()}-${s(i.getMonth() + 1)}-${s(i.getDate())}T${s(i.getHours())}:${s(i.getMinutes())}`;
}
const Oe = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk"
]);
function Wt(e, t, i, s, r, n) {
  let o = _;
  if (e !== null)
    switch (e.kind) {
      case "diaper":
        o = Le(e.baby, i, r);
        break;
      case "bottle":
        o = Ue(
          e.baby,
          t,
          e.lastAmount,
          e.lastUnit,
          i,
          r
        );
        break;
      case "solids":
        o = ze(e.baby, i, r);
        break;
      case "other":
        o = Ie(e.baby, i, r);
        break;
      case "session":
        o = Fe(
          e.baby,
          e.activity,
          e.method,
          i,
          r
        );
        break;
      case "end_sleep_first":
        o = Pe(
          e.baby,
          e.label,
          e.then,
          s,
          r
        );
        break;
      case "confirm_delete_imported":
        o = He(
          e.entryId,
          e.entryType,
          e.source,
          e.staff ?? null,
          i,
          r
        );
        break;
      case "edit_entry":
        o = Re(
          e.entry,
          i,
          r,
          n
        );
        break;
    }
  return u`
        <dialog @cancel=${r} @close=${r}>${o}</dialog>
    `;
}
function Pe(e, t, i, s, r) {
  return u`
        <form @submit=${(a) => a.preventDefault()}>
            <h2>End sleep first?</h2>
            <p>${e} is asleep. End the sleep session before ${t}?</p>
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button type="button" @click=${async () => {
    r(), await i();
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
    r(), await i();
  }}
                >
                    End sleep &amp; continue
                </button>
            </div>
        </form>
    `;
}
function Le(e, t, i) {
  return u`
        <form @submit=${(r) => {
    r.preventDefault();
    const n = r.currentTarget, o = new FormData(n, r.submitter ?? void 0);
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
                .value=${G()}
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
function Ue(e, t, i, s, r, n) {
  const o = (t == null ? void 0 : t.volume_unit) ?? s ?? "oz", a = typeof i == "number" && Number.isFinite(i) ? String(i) : "";
  return u`
        <form @submit=${(d) => {
    d.preventDefault();
    const b = d.currentTarget, p = new FormData(b), h = String(p.get("amount") ?? ""), m = h === "" ? void 0 : Number(h), l = C(String(p.get("at") ?? "")), f = String(p.get("unit") ?? o), g = String(p.get("notes") ?? "") || void 0;
    r("log_feeding", {
      baby: e,
      method: "bottle",
      amount: m,
      unit: f,
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
                .value=${G()}
                required
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
function ze(e, t, i) {
  return u`
        <form @submit=${(r) => {
    r.preventDefault();
    const n = r.currentTarget, o = new FormData(n);
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
                .value=${G()}
            />
            <div class="actions">
                <button type="button" @click=${i}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Ie(e, t, i) {
  return u`
        <form @submit=${(r) => {
    r.preventDefault();
    const n = r.currentTarget, o = new FormData(n);
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
                .value=${G()}
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
function He(e, t, i, s, r, n) {
  const o = (c) => {
    c.preventDefault(), r("delete_entry", { entry_id: e });
  }, a = s ? `${i} (${s})` : i;
  return u`
        <form @submit=${(c) => c.preventDefault()}>
            <h2>Delete this entry?</h2>
            <p>
                This <strong>${t}</strong> was logged by
                <strong>${a}</strong>, not from this card. Deleting it
                here only removes it from babytracker — the upstream record is
                not affected.
            </p>
            <div class="actions">
                <button type="button" @click=${n} autofocus>Cancel</button>
                <button type="button" class="primary" @click=${o}>
                    Delete anyway
                </button>
            </div>
        </form>
    `;
}
function Re(e, t, i, s) {
  const r = String((e == null ? void 0 : e.type) ?? ""), n = (e == null ? void 0 : e.data) ?? {}, o = Oe.has(r) && // Bottle feedings are point-in-time (started_at == ended_at); render
  // them as a single Time field, same as the log form.
  !(r === "feeding" && n.method === "bottle"), a = (b) => {
    b.preventDefault();
    const p = b.currentTarget, h = new FormData(p), m = {}, l = C(String(h.get("started") ?? ""));
    if (l && (m.timestamp = l), o) {
      const v = C(String(h.get("ended") ?? ""));
      m.ended_at = v ?? null;
    } else r === "feeding" && n.method === "bottle" && l && (m.ended_at = l);
    const f = String(h.get("notes") ?? "");
    m.notes = f || null;
    const g = {};
    if (r === "diaper")
      g.kind = String(h.get("kind") ?? n.kind ?? "wet");
    else if (r === "feeding" && n.method === "bottle") {
      const v = String(h.get("amount") ?? ""), w = v === "" ? null : Number(v);
      g.amount = w, g.unit = String(h.get("unit") ?? n.unit ?? "oz");
    } else if (r === "other" || r === "medication") {
      const v = String(h.get("name") ?? "");
      v && (g.name = v);
    }
    Object.keys(g).length && (m.data = g), t("edit_entry", { entry_id: e.id, fields: m });
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
  }, d = qe(e);
  return u`
        <form @submit=${a}>
            <h2>${d}</h2>
            ${o ? u`
                      <label for="started">Started</label>
                      <input
                          id="started"
                          name="started"
                          type="datetime-local"
                          .value=${dt(e.timestamp)}
                          required
                      />
                      <label for="ended"
                          >Ended <span class="muted">(blank = ongoing)</span></label
                      >
                      <input
                          id="ended"
                          name="ended"
                          type="datetime-local"
                          .value=${dt(e.ended_at)}
                      />
                  ` : u`
                      <label for="started">Time</label>
                      <input
                          id="started"
                          name="started"
                          type="datetime-local"
                          .value=${dt(e.timestamp)}
                          required
                      />
                  `}
            ${r === "diaper" ? u`
                      <label for="kind">Kind</label>
                      <select id="kind" name="kind">
                          <option value="wet" ?selected=${n.kind === "wet"}>
                              Wet
                          </option>
                          <option
                              value="dirty"
                              ?selected=${n.kind === "dirty"}
                          >
                              Dirty
                          </option>
                          <option value="both" ?selected=${n.kind === "both"}>
                              Both
                          </option>
                      </select>
                  ` : ""}
            ${r === "feeding" && n.method === "bottle" ? u`
                      <label for="amount">Amount</label>
                      <input
                          id="amount"
                          name="amount"
                          type="number"
                          min="0"
                          step="0.5"
                          inputmode="decimal"
                          .value=${n.amount != null ? String(n.amount) : ""}
                      />
                      <label for="unit">Unit</label>
                      <select id="unit" name="unit">
                          <option value="oz" ?selected=${n.unit === "oz"}>
                              oz
                          </option>
                          <option value="ml" ?selected=${n.unit === "ml"}>
                              ml
                          </option>
                      </select>
                  ` : ""}
            ${r === "other" || r === "medication" ? u`
                      <label for="name">Name</label>
                      <input
                          id="name"
                          name="name"
                          type="text"
                          .value=${String(n.name ?? "")}
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
function qe(e) {
  const t = String((e == null ? void 0 : e.type) ?? "entry"), i = (e == null ? void 0 : e.data) ?? {}, s = i.name ?? i.method ?? i.kind;
  return s ? `Edit ${t} (${s})` : `Edit ${t}`;
}
function Fe(e, t, i, s, r) {
  const n = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: i ? `Log ${i.replace("_", " ")} feeding` : "Log feeding"
  };
  return u`
        <form @submit=${(a) => {
    a.preventDefault();
    const c = a.currentTarget, d = new FormData(c), b = C(String(d.get("started") ?? "")), p = C(String(d.get("ended") ?? "")), h = String(d.get("notes") ?? "") || void 0;
    if (!p) {
      const f = {
        baby: e,
        started_at: b
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
          g = "start_feeding", f.method = i;
          break;
      }
      s(g, f);
      return;
    }
    const m = {
      baby: e,
      started_at: b,
      ended_at: p,
      notes: h
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
        l = "log_feeding", m.method = i;
        break;
    }
    s(l, m);
  }}>
            <h2>${n[t]}</h2>
            <label for="started">Started</label>
            <input
                id="started"
                name="started"
                type="datetime-local"
                .value=${G()}
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
const ut = 24 * 60 * 60 * 1e3, Nt = 29.5735;
function je(e, t, i = 7) {
  var b, p, h, m;
  const s = (b = e == null ? void 0 : e.states) == null ? void 0 : b[y(t, "recent_entries")], r = ((p = s == null ? void 0 : s.attributes) == null ? void 0 : p.entries) ?? [], n = Date.now(), o = new Date(n);
  o.setHours(0, 0, 0, 0);
  const a = [], c = (l) => l.toLocaleDateString([], { weekday: "short" });
  for (let l = i - 1; l >= 0; l--) {
    const f = new Date(o.getTime() - l * ut);
    a.push({
      label: c(f),
      sleepMinutes: 0,
      feedings: 0,
      bottleMl: 0,
      diapers: 0
    });
  }
  const d = o.getTime() - (i - 1) * ut;
  for (const l of r) {
    const f = Date.parse(l == null ? void 0 : l.timestamp);
    if (!Number.isFinite(f)) continue;
    const g = Math.floor((f - d) / ut);
    if (g < 0 || g >= i) continue;
    const v = a[g];
    if (l.type === "feeding") {
      v.feedings += 1;
      const w = Number(((h = l == null ? void 0 : l.data) == null ? void 0 : h.amount) ?? 0), gt = String(((m = l == null ? void 0 : l.data) == null ? void 0 : m.unit) ?? "");
      w > 0 && gt === "oz" ? v.bottleMl += w * Nt : w > 0 && gt === "ml" && (v.bottleMl += w);
    } else if (l.type === "diaper")
      v.diapers += 1;
    else if (l.type === "sleep") {
      const w = l != null && l.ended_at && l.ended_at !== "" ? Date.parse(l.ended_at) : n;
      Number.isFinite(w) && w > f && (v.sleepMinutes += (w - f) / 6e4);
    }
  }
  return a.every((l) => l.sleepMinutes === 0 && l.feedings === 0 && l.diapers === 0) ? "" : u`
        <div class="section" role="region" aria-label="Trends">
            <h2>Trends · last ${i} days</h2>
            ${K(
    a.map((l) => ({ label: l.label, value: l.sleepMinutes })),
    "Sleep (min/day)",
    (l) => `${Math.round(l)}`
  )}
            ${K(
    a.map((l) => ({ label: l.label, value: l.feedings })),
    "Feedings/day",
    (l) => `${l}`
  )}
            ${K(
    a.map((l) => ({ label: l.label, value: l.bottleMl })),
    "Bottle (oz/day)",
    (l) => (l / Nt).toFixed(1)
  )}
            ${K(
    a.map((l) => ({ label: l.label, value: l.diapers })),
    "Diapers/day",
    (l) => `${l}`
  )}
        </div>
    `;
}
function K(e, t, i) {
  const a = Math.max(1, ...e.map((d) => d.value)), c = (320 - 14 * 2) / e.length;
  return u`
        <div class="trend">
            <div class="label">${t}</div>
            <svg
                viewBox="0 0 ${320} ${90}"
                role="img"
                aria-label=${t}
                style="width:100%;height:${90}px;"
            >
                ${e.map((d, b) => {
    const p = 14 + b * c, h = c * 0.7, m = p + (c - h) / 2, l = Math.max(
      d.value > 0 ? 2 : 0,
      d.value / a * (90 - 24 * 2)
    ), f = 66 - l;
    return u`
                        <rect
                            x=${m}
                            y=${f}
                            width=${h}
                            height=${l}
                            fill="var(--primary-color)"
                            rx="2"
                        ></rect>
                        <text
                            x=${m + h / 2}
                            y=${f - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${d.value > 0 ? i(d.value) : ""}
                        </text>
                        <text
                            x=${m + h / 2}
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
function Be(e, t) {
  var r, n;
  const i = e.states[y(t, "vaccines_due")];
  if (!i || i.state === "unknown") return "";
  const s = ((r = e.states[y(t, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : r.state) === "on";
  return u`
        <div
            class="section chip ${s ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${i.state}</strong>
            ${(n = i.attributes) != null && n.due_on ? u`<span>(${i.attributes.due_on})</span>` : ""}
            ${s ? u`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
        </div>
    `;
}
var We = Object.defineProperty, Ve = Object.getOwnPropertyDescriptor, nt = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ve(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && We(t, i, r), r;
};
const Ye = ["vaccines", "growth", "trends", "export"];
let R = class extends E {
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
    !this.hass || !this._config || this._unsubOptions || (this._unsubOptions = Ht(
      this.hass,
      (e) => {
        this._options = e;
      }
    ));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? Ye;
  }
  render() {
    if (!this.hass || !this._config) return u``;
    const e = this._sections;
    return u`
            <ha-card>
                ${e.includes("vaccines") ? Be(this.hass, this._config.baby) : ""}
                ${e.includes("growth") ? jt(
      this.hass,
      this._config.baby,
      this._options,
      this._config.units
    ) : ""}
                ${e.includes("trends") ? je(
      this.hass,
      this._config.baby,
      this._config.trend_days ?? 7
    ) : ""}
                ${e.includes("export") ? Bt(this.hass, this._config.baby) : ""}
            </ha-card>
        `;
  }
  static getStubConfig() {
    return { type: "custom:babytracker-summary-card", baby: "ava" };
  }
};
R.styles = it`
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
nt([
  q({ attribute: !1 })
], R.prototype, "hass", 2);
nt([
  $()
], R.prototype, "_config", 2);
nt([
  $()
], R.prototype, "_options", 2);
R = nt([
  rt("babytracker-summary-card")
], R);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-summary-card",
  name: "babytracker — summary",
  description: "Vaccines, growth, 7-day trend charts, and pediatrician export for one baby."
});
var Ze = Object.defineProperty, Xe = Object.getOwnPropertyDescriptor, L = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Xe(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && Ze(t, i, r), r;
};
function Mt(e) {
  return String(e).padStart(2, "0");
}
function Q(e) {
  return `${e.getFullYear()}-${Mt(e.getMonth() + 1)}-${Mt(e.getDate())}`;
}
function Z(e) {
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
  if (!t) return null;
  const i = Number(t[1]), s = Number(t[2]) - 1, r = Number(t[3]), n = new Date(i, s, r, 0, 0, 0, 0);
  return Number.isNaN(n.getTime()) ? null : n;
}
function Ge(e) {
  const t = Z(e) ?? /* @__PURE__ */ new Date(), i = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0), s = new Date(
    t.getFullYear(),
    t.getMonth(),
    t.getDate(),
    23,
    59,
    59,
    999
  );
  return { startIso: i.toISOString(), endIso: s.toISOString() };
}
function Ke(e, t) {
  const i = Z(e) ?? /* @__PURE__ */ new Date();
  return i.setDate(i.getDate() + t), Q(i);
}
function Je(e) {
  const t = Z(e);
  return t ? t.toLocaleDateString([], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : e;
}
let k = class extends E {
  constructor() {
    super(...arguments), this._date = Q(/* @__PURE__ */ new Date()), this._entries = [], this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._today = () => {
      this._date = Q(/* @__PURE__ */ new Date());
    }, this._onDateChange = (e) => {
      const t = e.currentTarget.value;
      t && Z(t) && (this._date = t);
    }, this._requestEdit = (e) => {
      this._modal = { kind: "edit_entry", entry: e };
    }, this._requestDelete = (e) => {
      if (!e.source || e.source === "user") {
        this.hass.callService("babytracker", "delete_entry", {
          entry_id: e.id
        }), this._modal = null;
        return;
      }
      this._modal = {
        kind: "confirm_delete_imported",
        entryId: e.id,
        entryType: e.type ?? "entry",
        source: e.source,
        staff: e.staff ?? null
      };
    }, this._toggleNotes = (e) => {
      const t = new Set(this._expandedNotes);
      t.has(e) ? t.delete(e) : t.add(e), this._expandedNotes = t;
    }, this._closeModal = () => {
      this._modal = null;
    }, this._submitModal = async (e, t) => {
      await this.hass.callService("babytracker", e, t), this._modal = null;
    }, this._callService = async (e, t) => this.hass.callService("babytracker", e, t);
  }
  setConfig(e) {
    if (!(e != null && e.baby))
      throw new Error("babytracker-history-card: 'baby' is required");
    this._config = { ...e }, e.initial_date && Z(e.initial_date) && (this._date = e.initial_date);
  }
  getCardSize() {
    return 6;
  }
  connectedCallback() {
    super.connectedCallback(), this._resubscribe();
  }
  disconnectedCallback() {
    var e;
    (e = this._unsubEntries) == null || e.call(this), this._unsubEntries = void 0, super.disconnectedCallback();
  }
  updated(e) {
    if ((e.has("hass") || e.has("_config") || e.has("_date")) && this._resubscribe(), e.has("_modal")) {
      const t = this.renderRoot.querySelector(
        "dialog"
      );
      t && (this._modal && !t.open && t.showModal(), !this._modal && t.open && t.close());
    }
  }
  _resubscribe() {
    var i, s;
    if (!this.hass || !((i = this._config) != null && i.baby)) return;
    (s = this._unsubEntries) == null || s.call(this);
    const { startIso: e, endIso: t } = Ge(this._date);
    this._unsubEntries = ve(
      this.hass,
      this._config.baby,
      e,
      t,
      (r) => {
        this._entries = Array.isArray(r) ? r : [];
      }
    );
  }
  _go(e) {
    this._date = Ke(this._date, e);
  }
  render() {
    if (!this.hass || !this._config) return u``;
    const e = this._date === Q(/* @__PURE__ */ new Date());
    return u`
            <ha-card>
                <h2>History — ${Je(this._date)}</h2>
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
                        ?disabled=${e}
                        @click=${this._today}
                    >
                        Today
                    </button>
                </div>
                ${this._entries.length === 0 ? u`<p class="empty">Nothing logged on this day.</p>` : u`
                          <ul class="entries">
                              ${this._entries.map(
      (t) => Ft(
        t,
        this._requestEdit,
        this._expandedNotes,
        this._toggleNotes
      )
    )}
                          </ul>
                      `}
            </ha-card>
            ${Wt(
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
k.styles = it`
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
        .muted {
            color: var(--secondary-text-color);
            font-size: 0.85rem;
        }
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
    `;
L([
  q({ attribute: !1 })
], k.prototype, "hass", 2);
L([
  $()
], k.prototype, "_config", 2);
L([
  $()
], k.prototype, "_date", 2);
L([
  $()
], k.prototype, "_entries", 2);
L([
  $()
], k.prototype, "_modal", 2);
L([
  $()
], k.prototype, "_expandedNotes", 2);
k = L([
  rt("babytracker-history-card")
], k);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-history-card",
  name: "babytracker — history",
  description: "Paginate through one baby's entries by calendar day with edit + delete."
});
var Qe = Object.defineProperty, ti = Object.getOwnPropertyDescriptor, D = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ti(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && Qe(t, i, r), r;
};
const ei = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "recent",
  "importer_sync"
];
let x = class extends E {
  constructor() {
    super(...arguments), this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._handleService = async (e, t, i) => {
      const s = i instanceof HTMLElement && i.classList.contains("quick") ? i : null;
      try {
        const r = await _e(this.hass, "babytracker", e, t);
        return s && (s.classList.add("logged"), setTimeout(() => s.classList.remove("logged"), 700)), this.requestUpdate(), r;
      } catch (r) {
        throw console.warn("babytracker: service call failed", e, r), r;
      }
    }, this._requestModal = (e) => {
      const t = this._baby();
      if (typeof e == "string") {
        const r = {
          diaper: "logging a diaper",
          bottle: "logging a bottle",
          solids: "logging solids",
          other: "logging this"
        };
        this._interceptIfSleeping(r[e], () => {
          if (e === "bottle") {
            const n = this._lastBottle();
            this._modal = {
              kind: "bottle",
              baby: t,
              lastAmount: n == null ? void 0 : n.amount,
              lastUnit: n == null ? void 0 : n.unit
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
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = ye(
      this.hass,
      this._config.baby,
      (e) => {
        this._babyConfig = e;
      }
    )), this._unsubOptions || (this._unsubOptions = Ht(
      this.hass,
      (e) => {
        this._options = e;
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? ei;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(e, t = "sensor") {
    return y(this._baby(), e, t);
  }
  _renderStatus() {
    var o, a, c, d, b, p, h, m, l, f;
    const e = this.hass, t = (a = (o = e.states) == null ? void 0 : o[this._entityId("last_feeding")]) == null ? void 0 : a.state, i = (d = (c = e.states) == null ? void 0 : c[this._entityId("last_diaper")]) == null ? void 0 : d.state, s = ((p = (b = e.states) == null ? void 0 : b[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : p.state) === "on", r = ((m = (h = e.states) == null ? void 0 : h[this._entityId("walking", "binary_sensor")]) == null ? void 0 : m.state) === "on", n = ((f = (l = e.states) == null ? void 0 : l[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : f.state) === "on";
    return u`
            <div class="chips" role="list" aria-label="Status chips">
                <div class="chip" role="listitem">
                    Last feeding: ${this._timeSince(t)}
                </div>
                <div class="chip" role="listitem">
                    Last diaper: ${this._timeSince(i)}
                </div>
                ${s ? u`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
                ${r ? u`<div class="chip warning" role="listitem">On a walk</div>` : ""}
                ${n ? u`<div class="chip warning" role="listitem">At daycare</div>` : ""}
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
    var i, s, r, n, o, a, c;
    const e = (s = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : s[this._entityId("recent_entries")], t = ((r = e == null ? void 0 : e.attributes) == null ? void 0 : r.entries) ?? [];
    for (const d of t)
      if ((d == null ? void 0 : d.type) === "feeding" && ((n = d == null ? void 0 : d.data) == null ? void 0 : n.method) === "bottle" && typeof ((o = d == null ? void 0 : d.data) == null ? void 0 : o.amount) == "number" && (((a = d == null ? void 0 : d.data) == null ? void 0 : a.unit) === "ml" || ((c = d == null ? void 0 : d.data) == null ? void 0 : c.unit) === "oz"))
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
                ${e.includes("today") ? Me(this.hass, this._baby(), this._babyConfig) : ""}
                ${e.includes("active_session") ? $e(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("quick_log") ? ge(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${e.includes("growth") ? jt(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${e.includes("recent") ? De(
      this.hass,
      this._baby(),
      this._requestEdit,
      this._config.recent_limit ?? 50,
      this._expandedNotes,
      this._toggleNotes
    ) : ""}
                ${e.includes("importer_sync") ? Ne(
      this._babyConfig,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("export") ? Bt(this.hass, this._baby()) : ""}
            </ha-card>
            ${Wt(
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
x.styles = it`
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
D([
  q({ attribute: !1 })
], x.prototype, "hass", 2);
D([
  $()
], x.prototype, "_config", 2);
D([
  $()
], x.prototype, "_babyConfig", 2);
D([
  $()
], x.prototype, "_options", 2);
D([
  $()
], x.prototype, "_modal", 2);
D([
  $()
], x.prototype, "_expandedNotes", 2);
D([
  be("dialog")
], x.prototype, "_dialog", 2);
x = D([
  rt("babytracker-card")
], x);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => ri);
var ii = Object.defineProperty, si = Object.getOwnPropertyDescriptor, ft = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? si(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && ii(t, i, r), r;
};
let P = class extends E {
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
P.styles = it`
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
ft([
  q({ attribute: !1 })
], P.prototype, "hass", 2);
ft([
  q({ attribute: !1 })
], P.prototype, "_config", 2);
P = ft([
  rt("babytracker-card-editor")
], P);
P.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const ri = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return P;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  x as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
