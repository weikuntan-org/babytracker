/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const st = globalThis, yt = st.ShadowRoot && (st.ShadyCSS === void 0 || st.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, $t = Symbol(), Et = /* @__PURE__ */ new WeakMap();
let Vt = class {
  constructor(t, i, r) {
    if (this._$cssResult$ = !0, r !== $t) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (yt && t === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (t = Et.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && Et.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ee = (e) => new Vt(typeof e == "string" ? e : e + "", void 0, $t), ct = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((r, n, s) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[s + 1], e[0]);
  return new Vt(i, e, $t);
}, ie = (e, t) => {
  if (yt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const r = document.createElement("style"), n = st.litNonce;
    n !== void 0 && r.setAttribute("nonce", n), r.textContent = i.cssText, e.appendChild(r);
  }
}, Dt = yt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const r of t.cssRules) i += r.cssText;
  return ee(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ne, defineProperty: re, getOwnPropertyDescriptor: se, getOwnPropertyNames: oe, getOwnPropertySymbols: ae, getPrototypeOf: le } = Object, N = globalThis, Ct = N.trustedTypes, ce = Ct ? Ct.emptyScript : "", pt = N.reactiveElementPolyfillSupport, Z = (e, t) => e, at = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? ce : null;
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
} }, wt = (e, t) => !ne(e, t), Nt = { attribute: !0, type: String, converter: at, reflect: !1, useDefault: !1, hasChanged: wt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), N.litPropertyMetadata ?? (N.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let q = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Nt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const r = Symbol(), n = this.getPropertyDescriptor(t, r, i);
      n !== void 0 && re(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, i, r) {
    const { get: n, set: s } = se(this.prototype, t) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: n, set(o) {
      const l = n == null ? void 0 : n.call(this);
      s == null || s.call(this, o), this.requestUpdate(t, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Nt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Z("elementProperties"))) return;
    const t = le(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Z("properties"))) {
      const i = this.properties, r = [...oe(i), ...ae(i)];
      for (const n of r) this.createProperty(n, i[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [r, n] of i) this.elementProperties.set(r, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, r] of this.elementProperties) {
      const n = this._$Eu(i, r);
      n !== void 0 && this._$Eh.set(n, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const n of r) i.unshift(Dt(n));
    } else t !== void 0 && i.push(Dt(t));
    return i;
  }
  static _$Eu(t, i) {
    const r = i.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const r of i.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ie(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((i) => {
      var r;
      return (r = i.hostConnected) == null ? void 0 : r.call(i);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var r;
      return (r = i.hostDisconnected) == null ? void 0 : r.call(i);
    });
  }
  attributeChangedCallback(t, i, r) {
    this._$AK(t, r);
  }
  _$ET(t, i) {
    var s;
    const r = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, r);
    if (n !== void 0 && r.reflect === !0) {
      const o = (((s = r.converter) == null ? void 0 : s.toAttribute) !== void 0 ? r.converter : at).toAttribute(i, r.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var s, o;
    const r = this.constructor, n = r._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const l = r.getPropertyOptions(n), c = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((s = l.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? l.converter : at;
      this._$Em = n;
      const d = c.fromAttribute(i, l.type);
      this[n] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(n)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, i, r, n = !1, s) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (n === !1 && (s = this[t]), r ?? (r = l.getPropertyOptions(t)), !((r.hasChanged ?? wt)(s, i) || r.useDefault && r.reflect && s === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, r)))) return;
      this.C(t, i, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: r, reflect: n, wrapped: s }, o) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? i ?? this[t]), s !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (i = void 0), this._$AL.set(t, i)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [s, o] of n) {
        const { wrapped: l } = o, c = this[s];
        l !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, o, c);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (r = this._$EO) == null || r.forEach((n) => {
        var s;
        return (s = n.hostUpdate) == null ? void 0 : s.call(n);
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
    (i = this._$EO) == null || i.forEach((r) => {
      var n;
      return (n = r.hostUpdated) == null ? void 0 : n.call(r);
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
q.elementStyles = [], q.shadowRootOptions = { mode: "open" }, q[Z("elementProperties")] = /* @__PURE__ */ new Map(), q[Z("finalized")] = /* @__PURE__ */ new Map(), pt == null || pt({ ReactiveElement: q }), (N.reactiveElementVersions ?? (N.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis, Tt = (e) => e, lt = K.trustedTypes, Mt = lt ? lt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, jt = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, Wt = "?" + C, de = `<${Wt}>`, H = document, X = () => H.createComment(""), J = (e) => e === null || typeof e != "object" && typeof e != "function", xt = Array.isArray, ue = (e) => xt(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", ht = `[ 	
\f\r]`, G = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Pt = /-->/g, Ot = />/g, L = RegExp(`>|${ht}(?:([^\\s"'>=/]+)(${ht}*=${ht}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Lt = /'/g, It = /"/g, Yt = /^(?:script|style|textarea|title)$/i, pe = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), u = pe(1), V = Symbol.for("lit-noChange"), y = Symbol.for("lit-nothing"), Ut = /* @__PURE__ */ new WeakMap(), I = H.createTreeWalker(H, 129);
function Gt(e, t) {
  if (!xt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Mt !== void 0 ? Mt.createHTML(t) : t;
}
const he = (e, t) => {
  const i = e.length - 1, r = [];
  let n, s = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = G;
  for (let l = 0; l < i; l++) {
    const c = e[l];
    let d, h, p = -1, m = 0;
    for (; m < c.length && (o.lastIndex = m, h = o.exec(c), h !== null); ) m = o.lastIndex, o === G ? h[1] === "!--" ? o = Pt : h[1] !== void 0 ? o = Ot : h[2] !== void 0 ? (Yt.test(h[2]) && (n = RegExp("</" + h[2], "g")), o = L) : h[3] !== void 0 && (o = L) : o === L ? h[0] === ">" ? (o = n ?? G, p = -1) : h[1] === void 0 ? p = -2 : (p = o.lastIndex - h[2].length, d = h[1], o = h[3] === void 0 ? L : h[3] === '"' ? It : Lt) : o === It || o === Lt ? o = L : o === Pt || o === Ot ? o = G : (o = L, n = void 0);
    const b = o === L && e[l + 1].startsWith("/>") ? " " : "";
    s += o === G ? c + de : p >= 0 ? (r.push(d), c.slice(0, p) + jt + c.slice(p) + C + b) : c + C + (p === -2 ? l : b);
  }
  return [Gt(e, s + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class Q {
  constructor({ strings: t, _$litType$: i }, r) {
    let n;
    this.parts = [];
    let s = 0, o = 0;
    const l = t.length - 1, c = this.parts, [d, h] = he(t, i);
    if (this.el = Q.createElement(d, r), I.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = I.nextNode()) !== null && c.length < l; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(jt)) {
          const m = h[o++], b = n.getAttribute(p).split(C), a = /([.?@])?(.*)/.exec(m);
          c.push({ type: 1, index: s, name: a[2], strings: b, ctor: a[1] === "." ? be : a[1] === "?" ? ge : a[1] === "@" ? fe : dt }), n.removeAttribute(p);
        } else p.startsWith(C) && (c.push({ type: 6, index: s }), n.removeAttribute(p));
        if (Yt.test(n.tagName)) {
          const p = n.textContent.split(C), m = p.length - 1;
          if (m > 0) {
            n.textContent = lt ? lt.emptyScript : "";
            for (let b = 0; b < m; b++) n.append(p[b], X()), I.nextNode(), c.push({ type: 2, index: ++s });
            n.append(p[m], X());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Wt) c.push({ type: 2, index: s });
      else {
        let p = -1;
        for (; (p = n.data.indexOf(C, p + 1)) !== -1; ) c.push({ type: 7, index: s }), p += C.length - 1;
      }
      s++;
    }
  }
  static createElement(t, i) {
    const r = H.createElement("template");
    return r.innerHTML = t, r;
  }
}
function j(e, t, i = e, r) {
  var o, l;
  if (t === V) return t;
  let n = r !== void 0 ? (o = i._$Co) == null ? void 0 : o[r] : i._$Cl;
  const s = J(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== s && ((l = n == null ? void 0 : n._$AO) == null || l.call(n, !1), s === void 0 ? n = void 0 : (n = new s(e), n._$AT(e, i, r)), r !== void 0 ? (i._$Co ?? (i._$Co = []))[r] = n : i._$Cl = n), n !== void 0 && (t = j(e, n._$AS(e, t.values), n, r)), t;
}
class me {
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
    const { el: { content: i }, parts: r } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? H).importNode(i, !0);
    I.currentNode = n;
    let s = I.nextNode(), o = 0, l = 0, c = r[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let d;
        c.type === 2 ? d = new et(s, s.nextSibling, this, t) : c.type === 1 ? d = new c.ctor(s, c.name, c.strings, this, t) : c.type === 6 && (d = new _e(s, this, t)), this._$AV.push(d), c = r[++l];
      }
      o !== (c == null ? void 0 : c.index) && (s = I.nextNode(), o++);
    }
    return I.currentNode = H, n;
  }
  p(t) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, i), i += r.strings.length - 2) : r._$AI(t[i])), i++;
  }
}
class et {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, r, n) {
    this.type = 2, this._$AH = y, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = r, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
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
    t = j(this, t, i), J(t) ? t === y || t == null || t === "" ? (this._$AH !== y && this._$AR(), this._$AH = y) : t !== this._$AH && t !== V && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ue(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== y && J(this._$AH) ? this._$AA.nextSibling.data = t : this.T(H.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var s;
    const { values: i, _$litType$: r } = t, n = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = Q.createElement(Gt(r.h, r.h[0]), this.options)), r);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === n) this._$AH.p(i);
    else {
      const o = new me(n, this), l = o.u(this.options);
      o.p(i), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = Ut.get(t.strings);
    return i === void 0 && Ut.set(t.strings, i = new Q(t)), i;
  }
  k(t) {
    xt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, n = 0;
    for (const s of t) n === i.length ? i.push(r = new et(this.O(X()), this.O(X()), this, this.options)) : r = i[n], r._$AI(s), n++;
    n < i.length && (this._$AR(r && r._$AB.nextSibling, n), i.length = n);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, i); t !== this._$AB; ) {
      const n = Tt(t).nextSibling;
      Tt(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class dt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, r, n, s) {
    this.type = 1, this._$AH = y, this._$AN = void 0, this.element = t, this.name = i, this._$AM = n, this.options = s, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = y;
  }
  _$AI(t, i = this, r, n) {
    const s = this.strings;
    let o = !1;
    if (s === void 0) t = j(this, t, i, 0), o = !J(t) || t !== this._$AH && t !== V, o && (this._$AH = t);
    else {
      const l = t;
      let c, d;
      for (t = s[0], c = 0; c < s.length - 1; c++) d = j(this, l[r + c], i, c), d === V && (d = this._$AH[c]), o || (o = !J(d) || d !== this._$AH[c]), d === y ? t = y : t !== y && (t += (d ?? "") + s[c + 1]), this._$AH[c] = d;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class be extends dt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === y ? void 0 : t;
  }
}
class ge extends dt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== y);
  }
}
class fe extends dt {
  constructor(t, i, r, n, s) {
    super(t, i, r, n, s), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = j(this, t, i, 0) ?? y) === V) return;
    const r = this._$AH, n = t === y && r !== y || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, s = t !== y && (r === y || n);
    n && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class _e {
  constructor(t, i, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    j(this, t);
  }
}
const mt = K.litHtmlPolyfillSupport;
mt == null || mt(Q, et), (K.litHtmlVersions ?? (K.litHtmlVersions = [])).push("3.3.3");
const ve = (e, t, i) => {
  const r = (i == null ? void 0 : i.renderBefore) ?? t;
  let n = r._$litPart$;
  if (n === void 0) {
    const s = (i == null ? void 0 : i.renderBefore) ?? null;
    r._$litPart$ = n = new et(t.insertBefore(X(), s), s, void 0, i ?? {});
  }
  return n._$AI(e), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis;
class T extends q {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ve(i, this.renderRoot, this.renderOptions);
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
    return V;
  }
}
var Bt;
T._$litElement$ = !0, T.finalized = !0, (Bt = U.litElementHydrateSupport) == null || Bt.call(U, { LitElement: T });
const bt = U.litElementPolyfillSupport;
bt == null || bt({ LitElement: T });
(U.litElementVersions ?? (U.litElementVersions = [])).push("4.2.2");
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
const ye = { attribute: !0, type: String, converter: at, reflect: !1, hasChanged: wt }, $e = (e = ye, t, i) => {
  const { kind: r, metadata: n } = i;
  let s = globalThis.litPropertyMetadata.get(n);
  if (s === void 0 && globalThis.litPropertyMetadata.set(n, s = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), s.set(i.name, e), r === "accessor") {
    const { name: o } = i;
    return { set(l) {
      const c = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, c, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, e, l), l;
    } };
  }
  if (r === "setter") {
    const { name: o } = i;
    return function(l) {
      const c = this[o];
      t.call(this, l), this.requestUpdate(o, c, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function W(e) {
  return (t, i) => typeof i == "object" ? $e(e, t, i) : ((r, n, s) => {
    const o = n.hasOwnProperty(s);
    return n.constructor.createProperty(s, r), o ? Object.getOwnPropertyDescriptor(n, s) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function w(e) {
  return W({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const we = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function xe(e, t) {
  return (i, r, n) => {
    const s = (o) => {
      var l;
      return ((l = o.renderRoot) == null ? void 0 : l.querySelector(e)) ?? null;
    };
    return we(i, r, { get() {
      return s(this);
    } });
  };
}
const ke = [
  "feeding",
  "sleep",
  "tummy_time",
  "diaper",
  "growth",
  "medication",
  "vaccine",
  "walk",
  "other"
], Se = ["bottle", "breast_left", "breast_right", "solids"];
function Ae(e, t, i, r) {
  const n = (e == null ? void 0 : e.enabled_activities) ?? ke, s = (e == null ? void 0 : e.enabled_feeding_methods) ?? Se, o = (c) => c.charAt(0).toUpperCase() + c.slice(1), l = [];
  if (n.includes("diaper") && l.push(
    u`
                <button
                    class="quick"
                    aria-label="Log diaper for ${t}"
                    @click=${() => r("diaper")}
                >
                    Diaper
                </button>
            `
  ), n.includes("feeding"))
    for (const c of s)
      c === "bottle" ? l.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log bottle feeding for ${t}"
                            @click=${() => r("bottle")}
                        >
                            Bottle
                        </button>
                    `
      ) : c === "solids" ? l.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${t}"
                            @click=${() => r("solids")}
                        >
                            Solids
                        </button>
                    `
      ) : (c === "breast_left" || c === "breast_right") && l.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log ${c} feeding for ${t}"
                            @click=${() => r({ activity: "feeding", method: c })}
                        >
                            ${o(c.replace("_", " "))}
                        </button>
                    `
      );
  return n.includes("sleep") && l.push(
    u`
                <button
                    class="quick"
                    aria-label="Log sleep for ${t}"
                    @click=${() => r({ activity: "sleep" })}
                >
                    Sleep
                </button>
            `
  ), n.includes("tummy_time") && l.push(
    u`
                <button
                    class="quick"
                    aria-label="Log tummy time for ${t}"
                    @click=${() => r({ activity: "tummy_time" })}
                >
                    Tummy time
                </button>
            `
  ), n.includes("walk") && l.push(
    u`
                <button
                    class="quick"
                    aria-label="Log walk for ${t}"
                    @click=${() => r({ activity: "walk" })}
                >
                    Walk
                </button>
            `
  ), n.includes("other") && l.push(
    u`
                <button
                    class="quick"
                    aria-label="Log other activity for ${t}"
                    @click=${() => r("other")}
                >
                    Other
                </button>
            `
  ), u`
        <div class="section grid" role="group" aria-label="Quick log">
            ${l}
        </div>
    `;
}
function $(e, t, i = "sensor") {
  return `${i}.babytracker_${e}_${t}`;
}
async function Ee(e, t, i, r) {
  return e.callService(t, i, r);
}
function De(e, t, i) {
  const r = {};
  return (async () => {
    try {
      const n = await e.connection.subscribeMessage(
        i,
        { type: "babytracker/get_baby_config", baby: t, subscribe: !0 }
      );
      r.current = n;
    } catch (n) {
      console.warn("babytracker: subscribeBabyConfig failed", n);
    }
  })(), () => {
    var n;
    return (n = r.current) == null ? void 0 : n.call(r);
  };
}
function Zt(e, t) {
  const i = {};
  return (async () => {
    try {
      const r = await e.connection.subscribeMessage(
        t,
        { type: "babytracker/get_integration_options", subscribe: !0 }
      );
      i.current = r;
    } catch (r) {
      console.warn(
        "babytracker: subscribeIntegrationOptions failed",
        r
      );
    }
  })(), () => {
    var r;
    return (r = i.current) == null ? void 0 : r.call(i);
  };
}
function Ce(e, t, i, r, n) {
  const s = {};
  return (async () => {
    try {
      const o = await e.connection.subscribeMessage(
        n,
        {
          type: "babytracker/list_entries_in_range",
          baby: t,
          start: i,
          end: r,
          subscribe: !0
        }
      );
      s.current = o;
    } catch (o) {
      console.warn(
        "babytracker: subscribeEntriesInRange failed",
        o
      );
    }
  })(), () => {
    var o;
    return (o = s.current) == null ? void 0 : o.call(s);
  };
}
function Ne(e, t, i) {
  const r = {};
  return (async () => {
    try {
      const n = await e.connection.subscribeMessage(
        i,
        { type: "babytracker/list_vaccines", baby: t, subscribe: !0 }
      );
      r.current = n;
    } catch (n) {
      console.warn("babytracker: subscribeVaccines failed", n);
    }
  })(), () => {
    var n;
    return (n = r.current) == null ? void 0 : n.call(r);
  };
}
function Te(e, t, i) {
  const r = {};
  return (async () => {
    try {
      const n = await e.connection.subscribeMessage(
        i,
        { type: "babytracker/list_growth", baby: t, subscribe: !0 }
      );
      r.current = n;
    } catch (n) {
      console.warn("babytracker: subscribeGrowth failed", n);
    }
  })(), () => {
    var n;
    return (n = r.current) == null ? void 0 : n.call(r);
  };
}
function Me(e, t, i) {
  var c, d, h, p, m, b;
  const r = ((c = e.states[$(t, "sleeping", "binary_sensor")]) == null ? void 0 : c.state) === "on", n = ((d = e.states[$(t, "feeding", "binary_sensor")]) == null ? void 0 : d.state) === "on", s = ((h = e.states[$(t, "tummy_time", "binary_sensor")]) == null ? void 0 : h.state) === "on", o = ((p = e.states[$(t, "walking", "binary_sensor")]) == null ? void 0 : p.state) === "on";
  if (!r && !n && !s && !o) return "";
  const l = [];
  if (r) {
    const a = (m = e.states[$(t, "last_sleep_start")]) == null ? void 0 : m.state;
    l.push(
      u`
                <div class="chip warning" role="status">
                    Sleeping ${a ? u`· started ${Ht(a)}` : ""}
                    <button
                        aria-label="End sleep"
                        @click=${(g) => i("end_sleep", { baby: t }, g.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  if (n && l.push(
    u`
                <div class="chip warning" role="status">
                    Feeding
                    <button
                        aria-label="End feeding"
                        @click=${(a) => i("end_feeding", { baby: t }, a.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), s && l.push(
    u`
                <div class="chip warning" role="status">
                    Tummy time
                    <button
                        aria-label="End tummy time"
                        @click=${(a) => i("end_tummy_time", { baby: t }, a.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), o) {
    const a = (b = e.states[$(t, "last_walk_start")]) == null ? void 0 : b.state;
    l.push(
      u`
                <div class="chip warning" role="status">
                    Walking ${a ? u`· started ${Ht(a)}` : ""}
                    <button
                        aria-label="End walk"
                        @click=${(g) => i("end_walk", { baby: t }, g.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  return u`<div class="section">${l}</div>`;
}
function Ht(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const Kt = 29.5735, Xt = 24 * 60 * 60 * 1e3;
function B(e) {
  if (!e) return 0;
  const t = Date.parse(e);
  return Number.isNaN(t) ? 0 : t;
}
function Pe(e, t = Xt, i = Date.now()) {
  const r = i - t;
  return e.filter((n) => B(n.timestamp) >= r).slice().sort((n, s) => B(s.timestamp) - B(n.timestamp));
}
function Oe(e, t = Date.now(), i = Xt) {
  var d, h, p;
  const r = t - i;
  let n = 0, s = 0, o = 0, l = 0, c = 0;
  for (const m of e) {
    const b = B(m.timestamp);
    if (m.type === "sleep") {
      const a = b, g = m.ended_at != null && m.ended_at !== "" ? B(m.ended_at) : t;
      if (a > 0 && g > a && g > r) {
        const f = Math.max(a, r), _ = Math.min(g, t);
        _ > f && (c += (_ - f) / 6e4);
      }
      continue;
    }
    if (!(b < r)) {
      if (m.type === "feeding") {
        n += 1;
        const a = Number(((d = m.data) == null ? void 0 : d.amount) ?? 0), g = String(((h = m.data) == null ? void 0 : h.unit) ?? "");
        a > 0 && (l += g === "oz" ? a * Kt : a);
      } else if (m.type === "diaper") {
        const a = String(((p = m.data) == null ? void 0 : p.kind) ?? "");
        a === "wet" ? s += 1 : a === "dirty" ? o += 1 : a === "both" && (s += 1, o += 1);
      }
    }
  }
  return { feedings: n, wetDiapers: s, dirtyDiapers: o, totalVolumeMl: l, sleepMinutes: c };
}
function Le(e) {
  if (!Number.isFinite(e) || e <= 0) return "0m";
  if (e < 60) return `${Math.round(e)}m`;
  const t = Math.floor(e / 60), i = Math.round(e % 60);
  return i === 0 ? `${t}h` : `${t}h ${i}m`;
}
function Ie(e) {
  if (!Number.isFinite(e) || e <= 0) return "0 oz";
  const t = e / Kt;
  return t >= 1 ? `${t.toFixed(1)} oz` : `${Math.round(e)} ml`;
}
function zt(e) {
  const t = B(e);
  return t === 0 ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const Ue = /* @__PURE__ */ new Set(["sleep", "feeding", "tummy_time", "walk"]);
function Jt(e, t, i, r) {
  return u`
        <li
            class="clickable"
            role="button"
            tabindex="0"
            aria-label="Edit entry"
            @click=${() => t(e)}
            @keydown=${(n) => {
    (n.key === "Enter" || n.key === " ") && (n.preventDefault(), t(e));
  }}
        >
            <div class="entry-row">
                <span aria-label="Entry type">${ze(e)}</span>
                ${He(e)}
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
                      @click=${(n) => {
    n.stopPropagation(), r(e.id);
  }}
                      @keydown=${(n) => {
    (n.key === "Enter" || n.key === " ") && (n.preventDefault(), n.stopPropagation(), r(e.id));
  }}
                  >${e.notes}</div>` : ""}
        </li>
    `;
}
function He(e) {
  const t = zt(e.timestamp);
  return Ue.has(String(e.type ?? "")) && e.ended_at && e.ended_at !== e.timestamp ? u`<span class="muted"
            >${t} – ${zt(e.ended_at)}</span
        >` : u`<span class="muted">${t}</span>`;
}
function ze(e) {
  const t = String(e.type ?? ""), i = (e == null ? void 0 : e.data) ?? {}, r = i.name ?? i.method ?? i.kind;
  return r ? t === "feeding" && i.amount != null && i.amount !== "" && i.unit ? `${t} (${r}, ${i.amount} ${i.unit})` : `${t} (${r})` : t;
}
function Re(e, t, i, r, n = /* @__PURE__ */ new Set(), s = () => {
}) {
  var d;
  const o = e.states[$(t, "recent_entries")], l = ((d = o == null ? void 0 : o.attributes) == null ? void 0 : d.entries) ?? [], c = Pe(l).slice(0, Math.min(r, 50));
  return u`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${c.length === 0 ? u`<p>Nothing logged yet.</p>` : u`
                      <ul class="entries">
                          ${c.map(
    (h) => Jt(
      h,
      i,
      n,
      s
    )
  )}
                      </ul>
                  `}
        </div>
    `;
}
function gt(e) {
  if (e == null) return "—";
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? String(Math.round(t * 100) / 100) : String(e);
}
function Rt(e) {
  if (e == null || e === "—") return "—";
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? `p${Math.round(t)}` : String(e);
}
function Fe(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function Qt(e, t, i, r, n, s, o) {
  var _, v, x, D, P;
  const l = (r == null ? void 0 : r.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", c = (r == null ? void 0 : r.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", d = (_ = e.states[$(t, "weight")]) == null ? void 0 : _.state, h = (v = e.states[$(t, "height")]) == null ? void 0 : v.state, p = (x = e.states[$(t, "head_circumference")]) == null ? void 0 : x.state, m = (D = e.states[$(t, "weight_percentile")]) == null ? void 0 : D.state, b = (P = e.states[$(t, "height_percentile")]) == null ? void 0 : P.state, a = Fe(s == null ? void 0 : s.timestamp), g = !!(s && o), f = g ? () => o(s) : void 0;
  return u`
        <div class="section" role="region" aria-label="Growth">
            <div
                style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"
            >
                <h2 style="margin:0;">Growth</h2>
                <span style="flex:1;"></span>
                ${n ? u`<button
                          type="button"
                          class="primary"
                          aria-label="Log a growth measurement"
                          @click=${n}
                      >
                          Log measurement
                      </button>` : ""}
            </div>
            <div
                class=${g ? "growth-summary clickable" : "growth-summary"}
                role=${g ? "button" : "group"}
                tabindex=${g ? "0" : "-1"}
                aria-label=${g ? "Edit latest growth measurement" : "Latest growth measurement"}
                @click=${f}
                @keydown=${g ? (O) => {
    (O.key === "Enter" || O.key === " ") && (O.preventDefault(), f == null || f());
  } : void 0}
            >
                ${a ? u`<div class="growth-date muted">
                          Measured ${a}
                      </div>` : ""}
                <div class="growth-grid">
                    <div>
                        <div class="label">Weight</div>
                        <div>${gt(d)} ${l} · ${Rt(m)}</div>
                    </div>
                    <div>
                        <div class="label">Height</div>
                        <div>${gt(h)} ${c} · ${Rt(b)}</div>
                    </div>
                    <div>
                        <div class="label">Head</div>
                        <div>${gt(p)} ${c}</div>
                    </div>
                </div>
            </div>
            ${qe()}
        </div>
    `;
}
function qe(e, t) {
  return u`
        <svg viewBox="0 0 300 120" role="img" aria-label="Growth chart placeholder">
            ${[3, 15, 50, 85, 97].map(
    (r, n) => u`
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
                        p${r}
                    </text>
                `
  )}
        </svg>
    `;
}
function te(e, t) {
  return u`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var c;
    const r = /* @__PURE__ */ new Date(), n = new Date(r.getTime() - 90 * 864e5), s = (d) => d.toISOString().slice(0, 10), o = await e.callService(
      "babytracker",
      "export_report",
      { baby: t, format: "html", start: s(n), end: s(r) },
      void 0,
      !1,
      !0
      // return_response
    ), l = (c = o == null ? void 0 : o.response) == null ? void 0 : c.url;
    l && window.open(l, "_blank", "noopener");
  }}
            >
                Export for pediatrician
            </button>
        </div>
    `;
}
function Be(e, t, i) {
  var r;
  return (r = e == null ? void 0 : e.importer) != null && r.source_entity_id ? u`
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
function Ve(e, t, i) {
  var o, l;
  const r = (o = e.states) == null ? void 0 : o[$(t, "recent_entries")], n = ((l = r == null ? void 0 : r.attributes) == null ? void 0 : l.entries) ?? [], s = Oe(n);
  return u`
        <div class="chips" role="list" aria-label="Last 24 hours summary">
            <div class="chip" role="listitem">${s.feedings} feedings</div>
            <div class="chip" role="listitem">
                ${Ie(s.totalVolumeMl)} consumed
            </div>
            <div class="chip" role="listitem">${s.wetDiapers} wet</div>
            <div class="chip" role="listitem">${s.dirtyDiapers} dirty</div>
            <div class="chip" role="listitem">
                ${Le(s.sleepMinutes)} sleep
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
function ft(e) {
  if (!e) return "";
  const t = Date.parse(e);
  if (Number.isNaN(t)) return "";
  const i = new Date(t), r = (n) => String(n).padStart(2, "0");
  return `${i.getFullYear()}-${r(i.getMonth() + 1)}-${r(i.getDate())}T${r(i.getHours())}:${r(i.getMinutes())}`;
}
function je() {
  const e = /* @__PURE__ */ new Date(), t = (i) => String(i).padStart(2, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function We(e) {
  if (!e) return;
  const t = Date.parse(`${e}T12:00`);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
const Ye = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk"
]);
function kt(e, t, i, r, n, s) {
  let o = y;
  if (e !== null)
    switch (e.kind) {
      case "diaper":
        o = Ze(e.baby, i, n);
        break;
      case "bottle":
        o = Ke(
          e.baby,
          t,
          e.lastAmount,
          e.lastUnit,
          i,
          n
        );
        break;
      case "solids":
        o = Xe(e.baby, i, n);
        break;
      case "other":
        o = Je(e.baby, i, n);
        break;
      case "session":
        o = ii(
          e.baby,
          e.activity,
          e.method,
          i,
          n
        );
        break;
      case "end_sleep_first":
        o = Ge(
          e.baby,
          e.label,
          e.then,
          r,
          n
        );
        break;
      case "confirm_delete_imported":
        o = Qe(
          e.entryId,
          e.entryType,
          e.source,
          e.staff ?? null,
          i,
          n
        );
        break;
      case "edit_entry":
        o = ti(
          e.entry,
          i,
          n,
          s
        );
        break;
      case "log_growth":
        o = ni(e.baby, t, i, n);
        break;
      case "log_vaccine":
        o = si(
          e.baby,
          e.defaultName ?? "",
          e.defaultDose,
          e.scheduleNames ?? [],
          i,
          n
        );
        break;
    }
  return u`
        <dialog @cancel=${n} @close=${n}>${o}</dialog>
    `;
}
function Ge(e, t, i, r, n) {
  return u`
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
      await r("end_sleep", { baby: e });
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
function Ze(e, t, i) {
  return u`
        <form @submit=${(n) => {
    n.preventDefault();
    const s = n.currentTarget, o = new FormData(s, n.submitter ?? void 0);
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
function Ke(e, t, i, r, n, s) {
  const o = (t == null ? void 0 : t.volume_unit) ?? r ?? "oz", l = typeof i == "number" && Number.isFinite(i) ? String(i) : "";
  return u`
        <form @submit=${(d) => {
    d.preventDefault();
    const h = d.currentTarget, p = new FormData(h), m = String(p.get("amount") ?? ""), b = m === "" ? void 0 : Number(m), a = S(String(p.get("at") ?? "")), g = String(p.get("unit") ?? o), f = String(p.get("notes") ?? "") || void 0;
    n("log_feeding", {
      baby: e,
      method: "bottle",
      amount: b,
      unit: g,
      started_at: a,
      ended_at: a,
      notes: f
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
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Xe(e, t, i) {
  return u`
        <form @submit=${(n) => {
    n.preventDefault();
    const s = n.currentTarget, o = new FormData(s), l = S(String(o.get("when") ?? ""));
    t("log_feeding", {
      baby: e,
      method: "solids",
      started_at: l,
      ended_at: l,
      notes: String(o.get("notes") ?? "") || void 0
    });
  }}>
            <h2>Log solids</h2>
            <label for="notes"
                >What was fed <span class="muted">(optional)</span></label
            >
            <input
                id="notes"
                name="notes"
                type="text"
                placeholder="e.g. banana, oatmeal"
                autofocus
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
function Je(e, t, i) {
  return u`
        <form @submit=${(n) => {
    n.preventDefault();
    const s = n.currentTarget, o = new FormData(s);
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
function Qe(e, t, i, r, n, s) {
  const o = (c) => {
    c.preventDefault(), n("delete_entry", { entry_id: e });
  }, l = r ? `${i} (${r})` : i;
  return u`
        <form @submit=${(c) => c.preventDefault()}>
            <h2>Delete this entry?</h2>
            <p>
                This <strong>${t}</strong> was logged by
                <strong>${l}</strong>, not from this card. Deleting it
                here only removes it from babytracker — the upstream record is
                not affected.
            </p>
            <div class="actions">
                <button type="button" @click=${s} autofocus>Cancel</button>
                <button type="button" class="primary" @click=${o}>
                    Delete anyway
                </button>
            </div>
        </form>
    `;
}
function ti(e, t, i, r) {
  const n = String((e == null ? void 0 : e.type) ?? ""), s = (e == null ? void 0 : e.data) ?? {}, o = n === "feeding" && (s.method === "bottle" || s.method === "solids"), l = Ye.has(n) && !o, c = (p) => {
    p.preventDefault();
    const m = p.currentTarget, b = new FormData(m), a = {}, g = S(String(b.get("started") ?? ""));
    if (g && (a.timestamp = g), l) {
      const v = S(String(b.get("ended") ?? ""));
      a.ended_at = v ?? null;
    } else o && g && (a.ended_at = g);
    const f = String(b.get("notes") ?? "");
    a.notes = f || null;
    const _ = {};
    if (n === "diaper")
      _.kind = String(b.get("kind") ?? s.kind ?? "wet");
    else if (n === "feeding" && s.method === "bottle") {
      const v = String(b.get("amount") ?? ""), x = v === "" ? null : Number(v);
      _.amount = x, _.unit = String(b.get("unit") ?? s.unit ?? "oz");
    } else if (n === "other" || n === "medication") {
      const v = String(b.get("name") ?? "");
      v && (_.name = v);
    } else if (n === "growth") {
      const v = (O) => {
        const it = b.get(O);
        if (it === null) return;
        const nt = String(it).trim();
        if (nt === "") return null;
        const At = Number(nt);
        return Number.isFinite(At) ? At : void 0;
      }, x = v("weight"), D = v("height"), P = v("head");
      x !== void 0 && (_.weight = x), D !== void 0 && (_.height = D), P !== void 0 && (_.head_circumference = P), _.weight_unit = String(
        b.get("weight_unit") ?? s.weight_unit ?? "kg"
      ), _.length_unit = String(
        b.get("length_unit") ?? s.length_unit ?? "cm"
      );
    }
    Object.keys(_).length && (a.data = _), t("edit_entry", { entry_id: e.id, fields: a });
  }, d = () => {
    if (!r) {
      i();
      return;
    }
    !!e.source && e.source !== "user" || i(), r({
      id: e.id,
      type: e.type,
      source: e.source,
      staff: e.staff
    });
  }, h = ei(e);
  return u`
        <form @submit=${c}>
            <h2>${h}</h2>
            ${l ? u`
                      <label for="started">Started</label>
                      <input
                          id="started"
                          name="started"
                          type="datetime-local"
                          .value=${ft(e.timestamp)}
                          required
                      />
                      <label for="ended"
                          >Ended <span class="muted">(blank = ongoing)</span></label
                      >
                      <input
                          id="ended"
                          name="ended"
                          type="datetime-local"
                          .value=${ft(e.ended_at)}
                      />
                  ` : u`
                      <label for="started">Time</label>
                      <input
                          id="started"
                          name="started"
                          type="datetime-local"
                          .value=${ft(e.timestamp)}
                          required
                      />
                  `}
            ${n === "diaper" ? u`
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
            ${n === "feeding" && s.method === "bottle" ? u`
                      <label for="amount">Amount</label>
                      <input
                          id="amount"
                          name="amount"
                          type="number"
                          min="0"
                          step="0.5"
                          inputmode="decimal"
                          .value=${s.amount != null ? String(s.amount) : ""}
                      />
                      <label for="unit">Unit</label>
                      <select id="unit" name="unit">
                          <option value="oz" ?selected=${s.unit === "oz"}>
                              oz
                          </option>
                          <option value="ml" ?selected=${s.unit === "ml"}>
                              ml
                          </option>
                      </select>
                  ` : ""}
            ${n === "other" || n === "medication" ? u`
                      <label for="name">Name</label>
                      <input
                          id="name"
                          name="name"
                          type="text"
                          .value=${String(s.name ?? "")}
                      />
                  ` : ""}
            ${n === "growth" ? u`
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
                                  .value=${s.weight != null ? String(s.weight) : ""}
                              />
                          </div>
                          <div>
                              <label for="weight_unit">Unit</label>
                              <select id="weight_unit" name="weight_unit">
                                  <option
                                      value="kg"
                                      ?selected=${(s.weight_unit ?? "kg") === "kg"}
                                  >
                                      kg
                                  </option>
                                  <option
                                      value="lb"
                                      ?selected=${s.weight_unit === "lb"}
                                  >
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
                                  .value=${s.height != null ? String(s.height) : ""}
                              />
                          </div>
                          <div>
                              <label for="length_unit">Unit</label>
                              <select id="length_unit" name="length_unit">
                                  <option
                                      value="cm"
                                      ?selected=${(s.length_unit ?? "cm") === "cm"}
                                  >
                                      cm
                                  </option>
                                  <option
                                      value="in"
                                      ?selected=${s.length_unit === "in"}
                                  >
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
                                  .value=${s.head_circumference != null ? String(s.head_circumference) : ""}
                              />
                              <span class="muted"
                                  >(uses the length unit above)</span
                              >
                          </div>
                      </div>
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
                    @click=${d}
                >
                    Delete
                </button>
                <button type="submit" class="primary">Save</button>
            </div>
        </form>
    `;
}
function ei(e) {
  const t = String((e == null ? void 0 : e.type) ?? "entry"), i = (e == null ? void 0 : e.data) ?? {}, r = i.name ?? i.method ?? i.kind;
  return r ? `Edit ${t} (${r})` : `Edit ${t}`;
}
function ii(e, t, i, r, n) {
  const s = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: i ? `Log ${i.replace("_", " ")} feeding` : "Log feeding"
  };
  return u`
        <form @submit=${(l) => {
    l.preventDefault();
    const c = l.currentTarget, d = new FormData(c), h = S(String(d.get("started") ?? "")), p = S(String(d.get("ended") ?? "")), m = String(d.get("notes") ?? "") || void 0;
    if (!p) {
      const g = {
        baby: e,
        started_at: h
      };
      let f;
      switch (t) {
        case "sleep":
          f = "start_sleep";
          break;
        case "tummy_time":
          f = "start_tummy_time";
          break;
        case "walk":
          f = "start_walk";
          break;
        case "feeding":
          f = "start_feeding", g.method = i;
          break;
      }
      r(f, g);
      return;
    }
    const b = {
      baby: e,
      started_at: h,
      ended_at: p,
      notes: m
    };
    let a;
    switch (t) {
      case "sleep":
        a = "log_sleep";
        break;
      case "tummy_time":
        a = "log_tummy_time";
        break;
      case "walk":
        a = "log_walk";
        break;
      case "feeding":
        a = "log_feeding", b.method = i;
        break;
    }
    r(a, b);
  }}>
            <h2>${s[t]}</h2>
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
function ni(e, t, i, r) {
  const n = (t == null ? void 0 : t.weight_unit) ?? "kg", s = (t == null ? void 0 : t.length_unit) ?? "cm";
  return u`
        <form @submit=${(l) => {
    l.preventDefault();
    const c = l.currentTarget, d = new FormData(c), h = (p) => {
      const m = String(d.get(p) ?? "").trim();
      if (!m) return;
      const b = Number(m);
      return Number.isFinite(b) ? b : void 0;
    };
    i("log_growth", {
      baby: e,
      weight: h("weight"),
      height: h("height"),
      head_circumference: h("head"),
      weight_unit: String(d.get("weight_unit") ?? n),
      length_unit: String(d.get("length_unit") ?? s),
      timestamp: S(String(d.get("when") ?? "")),
      notes: String(d.get("notes") ?? "") || void 0
    });
  }}>
            <h2>Log growth measurement</h2>
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
                        autofocus
                    />
                </div>
                <div>
                    <label for="weight_unit">Unit</label>
                    <select id="weight_unit" name="weight_unit">
                        <option value="kg" ?selected=${n === "kg"}>
                            kg
                        </option>
                        <option value="lb" ?selected=${n === "lb"}>
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
                    />
                </div>
                <div>
                    <label for="length_unit">Unit</label>
                    <select id="length_unit" name="length_unit">
                        <option value="cm" ?selected=${s === "cm"}>
                            cm
                        </option>
                        <option value="in" ?selected=${s === "in"}>
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
                    />
                    <span class="muted">(uses the length unit above)</span>
                </div>
            </div>
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
                <button type="button" @click=${r}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
const ri = [
  "COVID-19",
  "DTaP",
  "Tdap",
  "HepA",
  "HepB",
  "Hib",
  "HPV",
  "Influenza",
  "IPV",
  "MenACWY",
  "MenB",
  "MMR",
  "PCV13",
  "PCV15",
  "PCV20",
  "RSV",
  "Rotavirus",
  "VAR"
];
function si(e, t, i, r, n, s) {
  const o = [
    "left_thigh",
    "right_thigh",
    "left_arm",
    "right_arm",
    "oral",
    "nasal"
  ], l = (a) => {
    a.preventDefault();
    const g = a.currentTarget, f = new FormData(g), _ = String(f.get("vaccine_select") ?? "").trim(), v = String(f.get("vaccine_custom") ?? "").trim(), x = _ === "__other__" ? v : _;
    if (!x) return;
    const D = String(f.get("dose_number") ?? "").trim(), P = D === "" ? void 0 : Number(D), O = String(f.get("site") ?? "").trim() || void 0, it = String(f.get("lot_number") ?? "").trim() || void 0, nt = String(f.get("provider") ?? "").trim() || void 0;
    n("log_vaccine", {
      baby: e,
      name: x,
      dose_number: P,
      site: O,
      lot_number: it,
      provider: nt,
      timestamp: We(String(f.get("when") ?? "")),
      notes: String(f.get("notes") ?? "") || void 0
    });
  }, c = Array.from(
    new Set(
      [...ri, ...r].filter(
        (a) => !!a && a !== "none"
      )
    )
  ).sort((a, g) => a.localeCompare(g)), d = t && t !== "none" && c.includes(t), h = t && t !== "none" && !d, p = d ? t : h ? "__other__" : "", m = h ? t : "";
  return u`
        <form @submit=${l}>
            <h2>Log vaccine</h2>
            <label for="vaccine_select">Vaccine</label>
            <select
                id="vaccine_select"
                name="vaccine_select"
                required
                autofocus
                @change=${(a) => {
    var _;
    const g = a.currentTarget, f = (_ = g.closest("form")) == null ? void 0 : _.querySelector("#vaccine_custom");
    f && (g.value === "__other__" ? (f.hidden = !1, f.required = !0, f.focus()) : (f.hidden = !0, f.required = !1, f.value = ""));
  }}
            >
                <option value="" disabled ?selected=${p === ""}>
                    (pick one)
                </option>
                ${c.map(
    (a) => u`<option
                        value=${a}
                        ?selected=${p === a}
                    >
                        ${a}
                    </option>`
  )}
                <option
                    value="__other__"
                    ?selected=${p === "__other__"}
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
                ?hidden=${p !== "__other__"}
                ?required=${p === "__other__"}
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
                .value=${i != null ? String(i) : ""}
            />
            <label for="site">Site</label>
            <select id="site" name="site">
                <option value="">(unspecified)</option>
                ${o.map(
    (a) => u`<option value=${a}>${a.replace("_", " ")}</option>`
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
            <input
                id="when"
                name="when"
                type="date"
                .value=${je()}
            />
            <label for="notes">Notes</label>
            <input id="notes" name="notes" type="text" placeholder="optional" />
            <div class="actions">
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
const _t = 24 * 60 * 60 * 1e3, Ft = 29.5735;
function oi(e, t, i = 7) {
  var h, p, m, b;
  const r = (h = e == null ? void 0 : e.states) == null ? void 0 : h[$(t, "recent_entries")], n = ((p = r == null ? void 0 : r.attributes) == null ? void 0 : p.entries) ?? [], s = Date.now(), o = new Date(s);
  o.setHours(0, 0, 0, 0);
  const l = [], c = (a) => a.toLocaleDateString([], { weekday: "short" });
  for (let a = i - 1; a >= 0; a--) {
    const g = new Date(o.getTime() - a * _t);
    l.push({
      label: c(g),
      sleepMinutes: 0,
      feedings: 0,
      bottleMl: 0,
      diapers: 0
    });
  }
  const d = o.getTime() - (i - 1) * _t;
  for (const a of n) {
    const g = Date.parse(a == null ? void 0 : a.timestamp);
    if (!Number.isFinite(g)) continue;
    const f = Math.floor((g - d) / _t);
    if (f < 0 || f >= i) continue;
    const _ = l[f];
    if (a.type === "feeding") {
      _.feedings += 1;
      const v = Number(((m = a == null ? void 0 : a.data) == null ? void 0 : m.amount) ?? 0), x = String(((b = a == null ? void 0 : a.data) == null ? void 0 : b.unit) ?? "");
      v > 0 && x === "oz" ? _.bottleMl += v * Ft : v > 0 && x === "ml" && (_.bottleMl += v);
    } else if (a.type === "diaper")
      _.diapers += 1;
    else if (a.type === "sleep") {
      const v = a != null && a.ended_at && a.ended_at !== "" ? Date.parse(a.ended_at) : s;
      Number.isFinite(v) && v > g && (_.sleepMinutes += (v - g) / 6e4);
    }
  }
  return l.every((a) => a.sleepMinutes === 0 && a.feedings === 0 && a.diapers === 0) ? "" : u`
        <div class="section" role="region" aria-label="Trends">
            <h2>Trends · last ${i} days</h2>
            ${rt(
    l.map((a) => ({ label: a.label, value: a.sleepMinutes })),
    "Sleep (min/day)",
    (a) => `${Math.round(a)}`
  )}
            ${rt(
    l.map((a) => ({ label: a.label, value: a.feedings })),
    "Feedings/day",
    (a) => `${a}`
  )}
            ${rt(
    l.map((a) => ({ label: a.label, value: a.bottleMl })),
    "Bottle (oz/day)",
    (a) => (a / Ft).toFixed(1)
  )}
            ${rt(
    l.map((a) => ({ label: a.label, value: a.diapers })),
    "Diapers/day",
    (a) => `${a}`
  )}
        </div>
    `;
}
function rt(e, t, i) {
  const l = Math.max(1, ...e.map((d) => d.value)), c = (320 - 14 * 2) / e.length;
  return u`
        <div class="trend">
            <div class="label">${t}</div>
            <svg
                viewBox="0 0 ${320} ${90}"
                role="img"
                aria-label=${t}
                style="width:100%;height:${90}px;"
            >
                ${e.map((d, h) => {
    const p = 14 + h * c, m = c * 0.7, b = p + (c - m) / 2, a = Math.max(
      d.value > 0 ? 2 : 0,
      d.value / l * (90 - 24 * 2)
    ), g = 66 - a;
    return u`
                        <rect
                            x=${b}
                            y=${g}
                            width=${m}
                            height=${a}
                            fill="var(--primary-color)"
                            rx="2"
                        ></rect>
                        <text
                            x=${b + m / 2}
                            y=${g - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${d.value > 0 ? i(d.value) : ""}
                        </text>
                        <text
                            x=${b + m / 2}
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
function ai(e) {
  if (!e) return "—";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "—" : new Date(t).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function vt(e) {
  var r, n;
  const t = String(((r = e == null ? void 0 : e.data) == null ? void 0 : r.name) ?? "vaccine"), i = (n = e == null ? void 0 : e.data) == null ? void 0 : n.dose_number;
  return i != null ? `${t} dose ${i}` : t;
}
function li(e, t) {
  return !e || e.length === 0 ? "" : u`
        <div
            class="section vaccine-history"
            role="region"
            aria-label="Vaccine history"
        >
            <h3>Vaccine history</h3>
            <ul class="vh-list">
                ${e.map(
    (i) => {
      var r;
      return u`<li
                        class=${t ? "clickable" : ""}
                        role=${t ? "button" : "listitem"}
                        tabindex=${t ? "0" : "-1"}
                        aria-label=${t ? `Edit ${vt(i)}` : vt(i)}
                        @click=${t ? () => t(i) : void 0}
                        @keydown=${t ? (n) => {
        (n.key === "Enter" || n.key === " ") && (n.preventDefault(), t(i));
      } : void 0}
                    >
                        <span class="vh-date muted"
                            >${ai(i.timestamp)}</span
                        >
                        <span class="vh-name">${vt(i)}</span>
                        ${(r = i == null ? void 0 : i.data) != null && r.site ? u`<span class="muted">${String(
        i.data.site
      ).replace("_", " ")}</span>` : ""}
                    </li>`;
    }
  )}
            </ul>
        </div>
    `;
}
function ci(e, t, i) {
  var s, o;
  const r = e.states[$(t, "vaccines_due")];
  if (!r || r.state === "unknown") return "";
  const n = ((s = e.states[$(t, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : s.state) === "on";
  return u`
        <div
            class="section chip ${n ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${r.state}</strong>
            ${(o = r.attributes) != null && o.due_on ? u`<span>(${r.attributes.due_on})</span>` : ""}
            ${n ? u`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
            ${i ? u`<span class="spacer"></span>
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
var di = Object.defineProperty, ui = Object.getOwnPropertyDescriptor, R = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? ui(t, i) : t, s = e.length - 1, o; s >= 0; s--)
    (o = e[s]) && (n = (r ? o(t, i, n) : o(n)) || n);
  return r && n && di(t, i, n), n;
};
const pi = ["vaccines", "growth", "trends", "export"];
let A = class extends T {
  constructor() {
    super(...arguments), this._modal = null, this._vaccines = [], this._growth = [], this._closeModal = () => {
      this._modal = null;
    }, this._submitModal = async (e, t) => {
      await this.hass.callService("babytracker", e, t), this._modal = null;
    }, this._callService = async (e, t) => this.hass.callService("babytracker", e, t), this._requestLogGrowth = () => {
      var e;
      (e = this._config) != null && e.baby && (this._modal = { kind: "log_growth", baby: this._config.baby });
    }, this._requestEditEntry = (e) => {
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
    }, this._requestLogVaccine = () => {
      var o, l, c, d, h;
      if (!((o = this._config) != null && o.baby)) return;
      const e = (c = (l = this.hass) == null ? void 0 : l.states) == null ? void 0 : c[$(this._config.baby, "vaccines_due")], t = e != null && e.state && e.state !== "none" && e.state !== "unknown" ? String(e.state) : "", i = (d = e == null ? void 0 : e.attributes) == null ? void 0 : d.dose_number, r = typeof i == "number" ? i : void 0, s = (Array.isArray((h = e == null ? void 0 : e.attributes) == null ? void 0 : h.upcoming) ? e.attributes.upcoming : []).map((p) => p && typeof p.name == "string" ? p.name : null).filter((p) => !!p);
      this._modal = {
        kind: "log_vaccine",
        baby: this._config.baby,
        defaultName: t,
        defaultDose: r,
        scheduleNames: s
      };
    };
  }
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
    var e, t, i;
    (e = this._unsubOptions) == null || e.call(this), this._unsubOptions = void 0, (t = this._unsubVaccines) == null || t.call(this), this._unsubVaccines = void 0, (i = this._unsubGrowth) == null || i.call(this), this._unsubGrowth = void 0, super.disconnectedCallback();
  }
  updated(e) {
    if ((e.has("hass") || e.has("_config")) && this._maybeSubscribe(), e.has("_modal")) {
      const t = this.renderRoot.querySelector(
        "dialog"
      );
      t && (this._modal && !t.open && t.showModal(), !this._modal && t.open && t.close());
    }
  }
  _maybeSubscribe() {
    var e, t;
    !this.hass || !this._config || (this._unsubOptions || (this._unsubOptions = Zt(
      this.hass,
      (i) => {
        this._options = i;
      }
    )), !this._unsubVaccines && this._sections.includes("vaccines") && ((e = this._config) != null && e.baby) && (this._unsubVaccines = Ne(
      this.hass,
      this._config.baby,
      (i) => {
        this._vaccines = Array.isArray(i) ? i : [];
      }
    )), !this._unsubGrowth && this._sections.includes("growth") && ((t = this._config) != null && t.baby) && (this._unsubGrowth = Te(
      this.hass,
      this._config.baby,
      (i) => {
        this._growth = Array.isArray(i) ? i : [];
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? pi;
  }
  render() {
    if (!this.hass || !this._config) return u``;
    const e = this._sections;
    return u`
            <ha-card>
                ${e.includes("vaccines") ? u`
                          ${ci(
      this.hass,
      this._config.baby,
      this._requestLogVaccine
    )}
                          ${li(
      this._vaccines,
      this._requestEditEntry
    )}
                      ` : ""}
                ${e.includes("growth") ? Qt(
      this.hass,
      this._config.baby,
      this._options,
      this._config.units,
      this._requestLogGrowth,
      this._growth[0],
      this._requestEditEntry
    ) : ""}
                ${e.includes("trends") ? oi(
      this.hass,
      this._config.baby,
      this._config.trend_days ?? 7
    ) : ""}
                ${e.includes("export") ? te(this.hass, this._config.baby) : ""}
            </ha-card>
            ${kt(
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
A.styles = ct`
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
R([
  W({ attribute: !1 })
], A.prototype, "hass", 2);
R([
  w()
], A.prototype, "_config", 2);
R([
  w()
], A.prototype, "_options", 2);
R([
  w()
], A.prototype, "_modal", 2);
R([
  w()
], A.prototype, "_vaccines", 2);
R([
  w()
], A.prototype, "_growth", 2);
A = R([
  ut("babytracker-summary-card")
], A);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-summary-card",
  name: "babytracker — summary",
  description: "Vaccines, growth, 7-day trend charts, and pediatrician export for one baby."
});
var hi = Object.defineProperty, mi = Object.getOwnPropertyDescriptor, F = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? mi(t, i) : t, s = e.length - 1, o; s >= 0; s--)
    (o = e[s]) && (n = (r ? o(t, i, n) : o(n)) || n);
  return r && n && hi(t, i, n), n;
};
function qt(e) {
  return String(e).padStart(2, "0");
}
function ot(e) {
  return `${e.getFullYear()}-${qt(e.getMonth() + 1)}-${qt(e.getDate())}`;
}
function tt(e) {
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
  if (!t) return null;
  const i = Number(t[1]), r = Number(t[2]) - 1, n = Number(t[3]), s = new Date(i, r, n, 0, 0, 0, 0);
  return Number.isNaN(s.getTime()) ? null : s;
}
function bi(e) {
  const t = tt(e) ?? /* @__PURE__ */ new Date(), i = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0), r = new Date(
    t.getFullYear(),
    t.getMonth(),
    t.getDate(),
    23,
    59,
    59,
    999
  );
  return { startIso: i.toISOString(), endIso: r.toISOString() };
}
function gi(e, t) {
  const i = tt(e) ?? /* @__PURE__ */ new Date();
  return i.setDate(i.getDate() + t), ot(i);
}
function fi(e) {
  const t = tt(e);
  return t ? t.toLocaleDateString([], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : e;
}
let E = class extends T {
  constructor() {
    super(...arguments), this._date = ot(/* @__PURE__ */ new Date()), this._entries = [], this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._today = () => {
      this._date = ot(/* @__PURE__ */ new Date());
    }, this._onDateChange = (e) => {
      const t = e.currentTarget.value;
      t && tt(t) && (this._date = t);
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
    this._config = { ...e }, e.initial_date && tt(e.initial_date) && (this._date = e.initial_date);
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
    var i, r;
    if (!this.hass || !((i = this._config) != null && i.baby)) return;
    (r = this._unsubEntries) == null || r.call(this);
    const { startIso: e, endIso: t } = bi(this._date);
    this._unsubEntries = Ce(
      this.hass,
      this._config.baby,
      e,
      t,
      (n) => {
        this._entries = Array.isArray(n) ? n : [];
      }
    );
  }
  _go(e) {
    this._date = gi(this._date, e);
  }
  render() {
    if (!this.hass || !this._config) return u``;
    const e = this._date === ot(/* @__PURE__ */ new Date());
    return u`
            <ha-card>
                <h2>History — ${fi(this._date)}</h2>
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
      (t) => Jt(
        t,
        this._requestEdit,
        this._expandedNotes,
        this._toggleNotes
      )
    )}
                          </ul>
                      `}
            </ha-card>
            ${kt(
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
E.styles = ct`
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
F([
  W({ attribute: !1 })
], E.prototype, "hass", 2);
F([
  w()
], E.prototype, "_config", 2);
F([
  w()
], E.prototype, "_date", 2);
F([
  w()
], E.prototype, "_entries", 2);
F([
  w()
], E.prototype, "_modal", 2);
F([
  w()
], E.prototype, "_expandedNotes", 2);
E = F([
  ut("babytracker-history-card")
], E);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-history-card",
  name: "babytracker — history",
  description: "Paginate through one baby's entries by calendar day with edit + delete."
});
var _i = Object.defineProperty, vi = Object.getOwnPropertyDescriptor, M = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? vi(t, i) : t, s = e.length - 1, o; s >= 0; s--)
    (o = e[s]) && (n = (r ? o(t, i, n) : o(n)) || n);
  return r && n && _i(t, i, n), n;
};
const yi = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "recent",
  "importer_sync"
];
let k = class extends T {
  constructor() {
    super(...arguments), this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._handleService = async (e, t, i) => {
      const r = i instanceof HTMLElement && i.classList.contains("quick") ? i : null;
      try {
        const n = await Ee(this.hass, "babytracker", e, t);
        return r && (r.classList.add("logged"), setTimeout(() => r.classList.remove("logged"), 700)), this.requestUpdate(), n;
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
            const s = this._lastBottle();
            this._modal = {
              kind: "bottle",
              baby: t,
              lastAmount: s == null ? void 0 : s.amount,
              lastUnit: s == null ? void 0 : s.unit
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
      }, r = () => {
        this._modal = {
          kind: "session",
          baby: t,
          activity: e.activity,
          method: e.method
        };
      };
      if (e.activity === "sleep") {
        r();
        return;
      }
      this._interceptIfSleeping(i[e.activity], r);
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
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = De(
      this.hass,
      this._config.baby,
      (e) => {
        this._babyConfig = e;
      }
    )), this._unsubOptions || (this._unsubOptions = Zt(
      this.hass,
      (e) => {
        this._options = e;
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? yi;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(e, t = "sensor") {
    return $(this._baby(), e, t);
  }
  _renderStatus() {
    var o, l, c, d, h, p, m, b, a, g;
    const e = this.hass, t = (l = (o = e.states) == null ? void 0 : o[this._entityId("last_feeding")]) == null ? void 0 : l.state, i = (d = (c = e.states) == null ? void 0 : c[this._entityId("last_diaper")]) == null ? void 0 : d.state, r = ((p = (h = e.states) == null ? void 0 : h[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : p.state) === "on", n = ((b = (m = e.states) == null ? void 0 : m[this._entityId("walking", "binary_sensor")]) == null ? void 0 : b.state) === "on", s = ((g = (a = e.states) == null ? void 0 : a[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : g.state) === "on";
    return u`
            <div class="chips" role="list" aria-label="Status chips">
                <div class="chip" role="listitem">
                    Last feeding: ${this._timeSince(t)}
                </div>
                <div class="chip" role="listitem">
                    Last diaper: ${this._timeSince(i)}
                </div>
                ${r ? u`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
                ${n ? u`<div class="chip warning" role="listitem">On a walk</div>` : ""}
                ${s ? u`<div class="chip warning" role="listitem">At daycare</div>` : ""}
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
    const r = Math.floor(i / 60);
    return r < 24 ? `${r}h ${i % 60}m` : `${Math.floor(r / 24)}d`;
  }
  _isSleeping() {
    var e, t, i;
    return ((i = (t = (e = this.hass) == null ? void 0 : e.states) == null ? void 0 : t[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : i.state) === "on";
  }
  _lastBottle() {
    var i, r, n, s, o, l, c;
    const e = (r = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : r[this._entityId("recent_entries")], t = ((n = e == null ? void 0 : e.attributes) == null ? void 0 : n.entries) ?? [];
    for (const d of t)
      if ((d == null ? void 0 : d.type) === "feeding" && ((s = d == null ? void 0 : d.data) == null ? void 0 : s.method) === "bottle" && typeof ((o = d == null ? void 0 : d.data) == null ? void 0 : o.amount) == "number" && (((l = d == null ? void 0 : d.data) == null ? void 0 : l.unit) === "ml" || ((c = d == null ? void 0 : d.data) == null ? void 0 : c.unit) === "oz"))
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
                ${e.includes("today") ? Ve(this.hass, this._baby(), this._babyConfig) : ""}
                ${e.includes("active_session") ? Me(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("quick_log") ? Ae(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${e.includes("growth") ? Qt(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${e.includes("recent") ? Re(
      this.hass,
      this._baby(),
      this._requestEdit,
      this._config.recent_limit ?? 50,
      this._expandedNotes,
      this._toggleNotes
    ) : ""}
                ${e.includes("importer_sync") ? Be(
      this._babyConfig,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("export") ? te(this.hass, this._baby()) : ""}
            </ha-card>
            ${kt(
      this._modal,
      this._options,
      this._submitModal,
      (i, r) => this._handleService(i, r),
      this._closeModal,
      this._requestDelete
    )}
        `;
  }
};
k.styles = ct`
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
M([
  W({ attribute: !1 })
], k.prototype, "hass", 2);
M([
  w()
], k.prototype, "_config", 2);
M([
  w()
], k.prototype, "_babyConfig", 2);
M([
  w()
], k.prototype, "_options", 2);
M([
  w()
], k.prototype, "_modal", 2);
M([
  w()
], k.prototype, "_expandedNotes", 2);
M([
  xe("dialog")
], k.prototype, "_dialog", 2);
k = M([
  ut("babytracker-card")
], k);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => xi);
var $i = Object.defineProperty, wi = Object.getOwnPropertyDescriptor, St = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? wi(t, i) : t, s = e.length - 1, o; s >= 0; s--)
    (o = e[s]) && (n = (r ? o(t, i, n) : o(n)) || n);
  return r && n && $i(t, i, n), n;
};
let z = class extends T {
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
z.styles = ct`
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
St([
  W({ attribute: !1 })
], z.prototype, "hass", 2);
St([
  W({ attribute: !1 })
], z.prototype, "_config", 2);
z = St([
  ut("babytracker-card-editor")
], z);
z.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const xi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return z;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  k as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
