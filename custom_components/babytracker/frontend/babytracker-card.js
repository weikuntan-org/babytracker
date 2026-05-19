/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot = globalThis, $t = ot.ShadowRoot && (ot.ShadyCSS === void 0 || ot.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, wt = Symbol(), Et = /* @__PURE__ */ new WeakMap();
let jt = class {
  constructor(t, i, r) {
    if (this._$cssResult$ = !0, r !== wt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if ($t && t === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (t = Et.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && Et.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ie = (e) => new jt(typeof e == "string" ? e : e + "", void 0, wt), dt = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((r, n, s) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[s + 1], e[0]);
  return new jt(i, e, wt);
}, ne = (e, t) => {
  if ($t) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const r = document.createElement("style"), n = ot.litNonce;
    n !== void 0 && r.setAttribute("nonce", n), r.textContent = i.cssText, e.appendChild(r);
  }
}, Ct = $t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const r of t.cssRules) i += r.cssText;
  return ie(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: re, defineProperty: se, getOwnPropertyDescriptor: oe, getOwnPropertyNames: ae, getOwnPropertySymbols: le, getPrototypeOf: ce } = Object, P = globalThis, Dt = P.trustedTypes, de = Dt ? Dt.emptyScript : "", ht = P.reactiveElementPolyfillSupport, Z = (e, t) => e, lt = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? de : null;
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
} }, xt = (e, t) => !re(e, t), Nt = { attribute: !0, type: String, converter: lt, reflect: !1, useDefault: !1, hasChanged: xt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), P.litPropertyMetadata ?? (P.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let F = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Nt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const r = Symbol(), n = this.getPropertyDescriptor(t, r, i);
      n !== void 0 && se(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, i, r) {
    const { get: n, set: s } = oe(this.prototype, t) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: n, set(o) {
      const a = n == null ? void 0 : n.call(this);
      s == null || s.call(this, o), this.requestUpdate(t, a, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Nt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Z("elementProperties"))) return;
    const t = ce(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Z("properties"))) {
      const i = this.properties, r = [...ae(i), ...le(i)];
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
      for (const n of r) i.unshift(Ct(n));
    } else t !== void 0 && i.push(Ct(t));
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
    return ne(t, this.constructor.elementStyles), t;
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
      const o = (((s = r.converter) == null ? void 0 : s.toAttribute) !== void 0 ? r.converter : lt).toAttribute(i, r.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var s, o;
    const r = this.constructor, n = r._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const a = r.getPropertyOptions(n), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((s = a.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? a.converter : lt;
      this._$Em = n;
      const d = l.fromAttribute(i, a.type);
      this[n] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(n)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, i, r, n = !1, s) {
    var o;
    if (t !== void 0) {
      const a = this.constructor;
      if (n === !1 && (s = this[t]), r ?? (r = a.getPropertyOptions(t)), !((r.hasChanged ?? xt)(s, i) || r.useDefault && r.reflect && s === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(a._$Eu(t, r)))) return;
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
        const { wrapped: a } = o, l = this[s];
        a !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, o, l);
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
F.elementStyles = [], F.shadowRootOptions = { mode: "open" }, F[Z("elementProperties")] = /* @__PURE__ */ new Map(), F[Z("finalized")] = /* @__PURE__ */ new Map(), ht == null || ht({ ReactiveElement: F }), (P.reactiveElementVersions ?? (P.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis, Pt = (e) => e, ct = K.trustedTypes, Tt = ct ? ct.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Wt = "$lit$", N = `lit$${Math.random().toFixed(9).slice(2)}$`, Yt = "?" + N, ue = `<${Yt}>`, R = document, X = () => R.createComment(""), J = (e) => e === null || typeof e != "object" && typeof e != "function", kt = Array.isArray, pe = (e) => kt(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", mt = `[ 	
\f\r]`, G = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Mt = /-->/g, Ot = />/g, L = RegExp(`>|${mt}(?:([^\\s"'>=/]+)(${mt}*=${mt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Lt = /'/g, Ht = /"/g, Gt = /^(?:script|style|textarea|title)$/i, he = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), u = he(1), B = Symbol.for("lit-noChange"), y = Symbol.for("lit-nothing"), It = /* @__PURE__ */ new WeakMap(), H = R.createTreeWalker(R, 129);
function Zt(e, t) {
  if (!kt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Tt !== void 0 ? Tt.createHTML(t) : t;
}
const me = (e, t) => {
  const i = e.length - 1, r = [];
  let n, s = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = G;
  for (let a = 0; a < i; a++) {
    const l = e[a];
    let d, b, p = -1, m = 0;
    for (; m < l.length && (o.lastIndex = m, b = o.exec(l), b !== null); ) m = o.lastIndex, o === G ? b[1] === "!--" ? o = Mt : b[1] !== void 0 ? o = Ot : b[2] !== void 0 ? (Gt.test(b[2]) && (n = RegExp("</" + b[2], "g")), o = L) : b[3] !== void 0 && (o = L) : o === L ? b[0] === ">" ? (o = n ?? G, p = -1) : b[1] === void 0 ? p = -2 : (p = o.lastIndex - b[2].length, d = b[1], o = b[3] === void 0 ? L : b[3] === '"' ? Ht : Lt) : o === Ht || o === Lt ? o = L : o === Mt || o === Ot ? o = G : (o = L, n = void 0);
    const g = o === L && e[a + 1].startsWith("/>") ? " " : "";
    s += o === G ? l + ue : p >= 0 ? (r.push(d), l.slice(0, p) + Wt + l.slice(p) + N + g) : l + N + (p === -2 ? a : g);
  }
  return [Zt(e, s + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class Q {
  constructor({ strings: t, _$litType$: i }, r) {
    let n;
    this.parts = [];
    let s = 0, o = 0;
    const a = t.length - 1, l = this.parts, [d, b] = me(t, i);
    if (this.el = Q.createElement(d, r), H.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = H.nextNode()) !== null && l.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(Wt)) {
          const m = b[o++], g = n.getAttribute(p).split(N), c = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: s, name: c[2], strings: g, ctor: c[1] === "." ? ge : c[1] === "?" ? fe : c[1] === "@" ? _e : ut }), n.removeAttribute(p);
        } else p.startsWith(N) && (l.push({ type: 6, index: s }), n.removeAttribute(p));
        if (Gt.test(n.tagName)) {
          const p = n.textContent.split(N), m = p.length - 1;
          if (m > 0) {
            n.textContent = ct ? ct.emptyScript : "";
            for (let g = 0; g < m; g++) n.append(p[g], X()), H.nextNode(), l.push({ type: 2, index: ++s });
            n.append(p[m], X());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Yt) l.push({ type: 2, index: s });
      else {
        let p = -1;
        for (; (p = n.data.indexOf(N, p + 1)) !== -1; ) l.push({ type: 7, index: s }), p += N.length - 1;
      }
      s++;
    }
  }
  static createElement(t, i) {
    const r = R.createElement("template");
    return r.innerHTML = t, r;
  }
}
function j(e, t, i = e, r) {
  var o, a;
  if (t === B) return t;
  let n = r !== void 0 ? (o = i._$Co) == null ? void 0 : o[r] : i._$Cl;
  const s = J(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== s && ((a = n == null ? void 0 : n._$AO) == null || a.call(n, !1), s === void 0 ? n = void 0 : (n = new s(e), n._$AT(e, i, r)), r !== void 0 ? (i._$Co ?? (i._$Co = []))[r] = n : i._$Cl = n), n !== void 0 && (t = j(e, n._$AS(e, t.values), n, r)), t;
}
class be {
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
    const { el: { content: i }, parts: r } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? R).importNode(i, !0);
    H.currentNode = n;
    let s = H.nextNode(), o = 0, a = 0, l = r[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let d;
        l.type === 2 ? d = new et(s, s.nextSibling, this, t) : l.type === 1 ? d = new l.ctor(s, l.name, l.strings, this, t) : l.type === 6 && (d = new ve(s, this, t)), this._$AV.push(d), l = r[++a];
      }
      o !== (l == null ? void 0 : l.index) && (s = H.nextNode(), o++);
    }
    return H.currentNode = R, n;
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
    t = j(this, t, i), J(t) ? t === y || t == null || t === "" ? (this._$AH !== y && this._$AR(), this._$AH = y) : t !== this._$AH && t !== B && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : pe(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== y && J(this._$AH) ? this._$AA.nextSibling.data = t : this.T(R.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var s;
    const { values: i, _$litType$: r } = t, n = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = Q.createElement(Zt(r.h, r.h[0]), this.options)), r);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === n) this._$AH.p(i);
    else {
      const o = new be(n, this), a = o.u(this.options);
      o.p(i), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = It.get(t.strings);
    return i === void 0 && It.set(t.strings, i = new Q(t)), i;
  }
  k(t) {
    kt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, n = 0;
    for (const s of t) n === i.length ? i.push(r = new et(this.O(X()), this.O(X()), this, this.options)) : r = i[n], r._$AI(s), n++;
    n < i.length && (this._$AR(r && r._$AB.nextSibling, n), i.length = n);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, i); t !== this._$AB; ) {
      const n = Pt(t).nextSibling;
      Pt(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class ut {
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
    if (s === void 0) t = j(this, t, i, 0), o = !J(t) || t !== this._$AH && t !== B, o && (this._$AH = t);
    else {
      const a = t;
      let l, d;
      for (t = s[0], l = 0; l < s.length - 1; l++) d = j(this, a[r + l], i, l), d === B && (d = this._$AH[l]), o || (o = !J(d) || d !== this._$AH[l]), d === y ? t = y : t !== y && (t += (d ?? "") + s[l + 1]), this._$AH[l] = d;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ge extends ut {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === y ? void 0 : t;
  }
}
class fe extends ut {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== y);
  }
}
class _e extends ut {
  constructor(t, i, r, n, s) {
    super(t, i, r, n, s), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = j(this, t, i, 0) ?? y) === B) return;
    const r = this._$AH, n = t === y && r !== y || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, s = t !== y && (r === y || n);
    n && this.element.removeEventListener(this.name, this, r), s && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ve {
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
const bt = K.litHtmlPolyfillSupport;
bt == null || bt(Q, et), (K.litHtmlVersions ?? (K.litHtmlVersions = [])).push("3.3.3");
const ye = (e, t, i) => {
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
const I = globalThis;
class T extends F {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ye(i, this.renderRoot, this.renderOptions);
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
    return B;
  }
}
var Bt;
T._$litElement$ = !0, T.finalized = !0, (Bt = I.litElementHydrateSupport) == null || Bt.call(I, { LitElement: T });
const gt = I.litElementPolyfillSupport;
gt == null || gt({ LitElement: T });
(I.litElementVersions ?? (I.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pt = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const $e = { attribute: !0, type: String, converter: lt, reflect: !1, hasChanged: xt }, we = (e = $e, t, i) => {
  const { kind: r, metadata: n } = i;
  let s = globalThis.litPropertyMetadata.get(n);
  if (s === void 0 && globalThis.litPropertyMetadata.set(n, s = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), s.set(i.name, e), r === "accessor") {
    const { name: o } = i;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(o, l, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, e, a), a;
    } };
  }
  if (r === "setter") {
    const { name: o } = i;
    return function(a) {
      const l = this[o];
      t.call(this, a), this.requestUpdate(o, l, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function W(e) {
  return (t, i) => typeof i == "object" ? we(e, t, i) : ((r, n, s) => {
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
const xe = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ke(e, t) {
  return (i, r, n) => {
    const s = (o) => {
      var a;
      return ((a = o.renderRoot) == null ? void 0 : a.querySelector(e)) ?? null;
    };
    return xe(i, r, { get() {
      return s(this);
    } });
  };
}
const Se = [
  "feeding",
  "sleep",
  "tummy_time",
  "diaper",
  "growth",
  "medication",
  "vaccine",
  "walk",
  "other"
], Ae = ["bottle", "breast_left", "breast_right", "solids"];
function Ee(e, t, i, r) {
  const n = (e == null ? void 0 : e.enabled_activities) ?? Se, s = (e == null ? void 0 : e.enabled_feeding_methods) ?? Ae, o = (l) => l.charAt(0).toUpperCase() + l.slice(1), a = [];
  if (n.includes("diaper") && a.push(
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
    for (const l of s)
      l === "bottle" ? a.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log bottle feeding for ${t}"
                            @click=${() => r("bottle")}
                        >
                            Bottle
                        </button>
                    `
      ) : l === "solids" ? a.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${t}"
                            @click=${() => r("solids")}
                        >
                            Solids
                        </button>
                    `
      ) : (l === "breast_left" || l === "breast_right") && a.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log ${l} feeding for ${t}"
                            @click=${() => r({ activity: "feeding", method: l })}
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
                    @click=${() => r({ activity: "sleep" })}
                >
                    Sleep
                </button>
            `
  ), n.includes("tummy_time") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log tummy time for ${t}"
                    @click=${() => r({ activity: "tummy_time" })}
                >
                    Tummy time
                </button>
            `
  ), n.includes("walk") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log walk for ${t}"
                    @click=${() => r({ activity: "walk" })}
                >
                    Walk
                </button>
            `
  ), n.includes("other") && a.push(
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
            ${a}
        </div>
    `;
}
function $(e, t, i = "sensor") {
  return `${i}.babytracker_${e}_${t}`;
}
async function Ce(e, t, i, r) {
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
function Kt(e, t) {
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
function Ne(e, t, i, r, n) {
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
function Pe(e, t, i) {
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
  var l, d, b, p, m, g;
  const r = ((l = e.states[$(t, "sleeping", "binary_sensor")]) == null ? void 0 : l.state) === "on", n = ((d = e.states[$(t, "feeding", "binary_sensor")]) == null ? void 0 : d.state) === "on", s = ((b = e.states[$(t, "tummy_time", "binary_sensor")]) == null ? void 0 : b.state) === "on", o = ((p = e.states[$(t, "walking", "binary_sensor")]) == null ? void 0 : p.state) === "on";
  if (!r && !n && !s && !o) return "";
  const a = [];
  if (r) {
    const c = (m = e.states[$(t, "last_sleep_start")]) == null ? void 0 : m.state;
    a.push(
      u`
                <div class="chip warning" role="status">
                    Sleeping ${c ? u`· started ${Rt(c)}` : ""}
                    <button
                        aria-label="End sleep"
                        @click=${(h) => i("end_sleep", { baby: t }, h.currentTarget)}
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
  ), s && a.push(
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
    const c = (g = e.states[$(t, "last_walk_start")]) == null ? void 0 : g.state;
    a.push(
      u`
                <div class="chip warning" role="status">
                    Walking ${c ? u`· started ${Rt(c)}` : ""}
                    <button
                        aria-label="End walk"
                        @click=${(h) => i("end_walk", { baby: t }, h.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  return u`<div class="section">${a}</div>`;
}
function Rt(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const Xt = 29.5735, Jt = 24 * 60 * 60 * 1e3;
function q(e) {
  if (!e) return 0;
  const t = Date.parse(e);
  return Number.isNaN(t) ? 0 : t;
}
function Oe(e, t = Jt, i = Date.now()) {
  const r = i - t;
  return e.filter((n) => q(n.timestamp) >= r).slice().sort((n, s) => q(s.timestamp) - q(n.timestamp));
}
function Le(e, t = Date.now(), i = Jt) {
  var d, b, p;
  const r = t - i;
  let n = 0, s = 0, o = 0, a = 0, l = 0;
  for (const m of e) {
    const g = q(m.timestamp);
    if (m.type === "sleep") {
      const c = g, h = m.ended_at != null && m.ended_at !== "" ? q(m.ended_at) : t;
      if (c > 0 && h > c && h > r) {
        const v = Math.max(c, r), f = Math.min(h, t);
        f > v && (l += (f - v) / 6e4);
      }
      continue;
    }
    if (!(g < r)) {
      if (m.type === "feeding") {
        n += 1;
        const c = Number(((d = m.data) == null ? void 0 : d.amount) ?? 0), h = String(((b = m.data) == null ? void 0 : b.unit) ?? "");
        c > 0 && (a += h === "oz" ? c * Xt : c);
      } else if (m.type === "diaper") {
        const c = String(((p = m.data) == null ? void 0 : p.kind) ?? "");
        c === "wet" ? s += 1 : c === "dirty" ? o += 1 : c === "both" && (s += 1, o += 1);
      }
    }
  }
  return { feedings: n, wetDiapers: s, dirtyDiapers: o, totalVolumeMl: a, sleepMinutes: l };
}
function He(e) {
  if (!Number.isFinite(e) || e <= 0) return "0m";
  if (e < 60) return `${Math.round(e)}m`;
  const t = Math.floor(e / 60), i = Math.round(e % 60);
  return i === 0 ? `${t}h` : `${t}h ${i}m`;
}
function Ie(e) {
  if (!Number.isFinite(e) || e <= 0) return "0 oz";
  const t = e / Xt;
  return t >= 1 ? `${t.toFixed(1)} oz` : `${Math.round(e)} ml`;
}
function Vt(e) {
  const t = q(e);
  return t === 0 ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const Re = /* @__PURE__ */ new Set(["sleep", "feeding", "tummy_time", "walk"]);
function Qt(e, t, i, r) {
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
                <span aria-label="Entry type">${Ue(e)}</span>
                ${Ve(e)}
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
function Ve(e) {
  const t = Vt(e.timestamp);
  return Re.has(String(e.type ?? "")) && e.ended_at && e.ended_at !== e.timestamp ? u`<span class="muted"
            >${t} – ${Vt(e.ended_at)}</span
        >` : u`<span class="muted">${t}</span>`;
}
function Ue(e) {
  const t = String(e.type ?? ""), i = (e == null ? void 0 : e.data) ?? {}, r = i.name ?? i.method ?? i.kind;
  return r ? t === "feeding" && i.amount != null && i.amount !== "" && i.unit ? `${t} (${r}, ${i.amount} ${i.unit})` : `${t} (${r})` : t;
}
function ze(e, t, i, r, n = /* @__PURE__ */ new Set(), s = () => {
}) {
  var d;
  const o = e.states[$(t, "recent_entries")], a = ((d = o == null ? void 0 : o.attributes) == null ? void 0 : d.entries) ?? [], l = Oe(a).slice(0, Math.min(r, 50));
  return u`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${l.length === 0 ? u`<p>Nothing logged yet.</p>` : u`
                      <ul class="entries">
                          ${l.map(
    (b) => Qt(
      b,
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
function ft(e) {
  if (e == null) return "—";
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? String(Math.round(t * 100) / 100) : String(e);
}
function Ut(e) {
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
function te(e, t, i, r, n, s, o) {
  var f, _, x, C, D;
  const a = (r == null ? void 0 : r.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", l = (r == null ? void 0 : r.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", d = (f = e.states[$(t, "weight")]) == null ? void 0 : f.state, b = (_ = e.states[$(t, "height")]) == null ? void 0 : _.state, p = (x = e.states[$(t, "head_circumference")]) == null ? void 0 : x.state, m = (C = e.states[$(t, "weight_percentile")]) == null ? void 0 : C.state, g = (D = e.states[$(t, "height_percentile")]) == null ? void 0 : D.state, c = Fe(s == null ? void 0 : s.timestamp), h = !!(s && o), v = h ? () => o(s) : void 0;
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
                class=${h ? "growth-summary clickable" : "growth-summary"}
                role=${h ? "button" : "group"}
                tabindex=${h ? "0" : "-1"}
                aria-label=${h ? "Edit latest growth measurement" : "Latest growth measurement"}
                @click=${v}
                @keydown=${h ? (O) => {
    (O.key === "Enter" || O.key === " ") && (O.preventDefault(), v == null || v());
  } : void 0}
            >
                ${c ? u`<div class="growth-date muted">
                          Measured ${c}
                      </div>` : ""}
                <div class="growth-grid">
                    <div>
                        <div class="label">Weight</div>
                        <div>${ft(d)} ${a} · ${Ut(m)}</div>
                    </div>
                    <div>
                        <div class="label">Height</div>
                        <div>${ft(b)} ${l} · ${Ut(g)}</div>
                    </div>
                    <div>
                        <div class="label">Head</div>
                        <div>${ft(p)} ${l}</div>
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
function ee(e, t) {
  return u`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var l;
    const r = /* @__PURE__ */ new Date(), n = new Date(r.getTime() - 90 * 864e5), s = (d) => d.toISOString().slice(0, 10), o = await e.callService(
      "babytracker",
      "export_report",
      { baby: t, format: "html", start: s(n), end: s(r) },
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
function je(e, t, i) {
  var o, a;
  const r = (o = e.states) == null ? void 0 : o[$(t, "recent_entries")], n = ((a = r == null ? void 0 : r.attributes) == null ? void 0 : a.entries) ?? [], s = Le(n);
  return u`
        <div class="chips" role="list" aria-label="Last 24 hours summary">
            <div class="chip" role="listitem">${s.feedings} feedings</div>
            <div class="chip" role="listitem">
                ${Ie(s.totalVolumeMl)} consumed
            </div>
            <div class="chip" role="listitem">${s.wetDiapers} wet</div>
            <div class="chip" role="listitem">${s.dirtyDiapers} dirty</div>
            <div class="chip" role="listitem">
                ${He(s.sleepMinutes)} sleep
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
function _t(e) {
  if (!e) return "";
  const t = Date.parse(e);
  if (Number.isNaN(t)) return "";
  const i = new Date(t), r = (n) => String(n).padStart(2, "0");
  return `${i.getFullYear()}-${r(i.getMonth() + 1)}-${r(i.getDate())}T${r(i.getHours())}:${r(i.getMinutes())}`;
}
function We() {
  const e = /* @__PURE__ */ new Date(), t = (i) => String(i).padStart(2, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function Ye(e) {
  if (!e) return;
  const t = Date.parse(`${e}T12:00`);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
const Ge = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk"
]);
function St(e, t, i, r, n, s) {
  let o = y;
  if (e !== null)
    switch (e.kind) {
      case "diaper":
        o = Ke(e.baby, i, n);
        break;
      case "bottle":
        o = Xe(
          e.baby,
          t,
          e.lastAmount,
          e.lastUnit,
          i,
          n
        );
        break;
      case "solids":
        o = Je(e.baby, i, n);
        break;
      case "other":
        o = Qe(e.baby, i, n);
        break;
      case "session":
        o = ni(
          e.baby,
          e.activity,
          e.method,
          i,
          n
        );
        break;
      case "end_sleep_first":
        o = Ze(
          e.baby,
          e.label,
          e.then,
          r,
          n
        );
        break;
      case "confirm_delete_imported":
        o = ti(
          e.entryId,
          e.entryType,
          e.source,
          e.staff ?? null,
          i,
          n
        );
        break;
      case "edit_entry":
        o = ei(
          e.entry,
          i,
          n,
          s
        );
        break;
      case "log_growth":
        o = ri(e.baby, t, i, n);
        break;
      case "log_vaccine":
        o = ai(
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
function Ze(e, t, i, r, n) {
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
      await r("end_sleep", { baby: e });
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
function Ke(e, t, i) {
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
function Xe(e, t, i, r, n, s) {
  const o = (t == null ? void 0 : t.volume_unit) ?? r ?? "oz", a = typeof i == "number" && Number.isFinite(i) ? String(i) : "";
  return u`
        <form @submit=${(d) => {
    d.preventDefault();
    const b = d.currentTarget, p = new FormData(b), m = String(p.get("amount") ?? ""), g = m === "" ? void 0 : Number(m), c = S(String(p.get("at") ?? "")), h = String(p.get("unit") ?? o), v = String(p.get("notes") ?? "") || void 0;
    n("log_feeding", {
      baby: e,
      method: "bottle",
      amount: g,
      unit: h,
      started_at: c,
      ended_at: c,
      notes: v
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
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Je(e, t, i) {
  return u`
        <form @submit=${(n) => {
    n.preventDefault();
    const s = n.currentTarget, o = new FormData(s), a = S(String(o.get("when") ?? ""));
    t("log_feeding", {
      baby: e,
      method: "solids",
      started_at: a,
      ended_at: a,
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
function Qe(e, t, i) {
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
function ti(e, t, i, r, n, s) {
  const o = (l) => {
    l.preventDefault(), n("delete_entry", { entry_id: e });
  }, a = r ? `${i} (${r})` : i;
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
                <button type="button" @click=${s} autofocus>Cancel</button>
                <button type="button" class="primary" @click=${o}>
                    Delete anyway
                </button>
            </div>
        </form>
    `;
}
function ei(e, t, i, r) {
  const n = String((e == null ? void 0 : e.type) ?? ""), s = (e == null ? void 0 : e.data) ?? {}, o = n === "feeding" && (s.method === "bottle" || s.method === "solids"), a = Ge.has(n) && !o, l = (p) => {
    p.preventDefault();
    const m = p.currentTarget, g = new FormData(m), c = {}, h = S(String(g.get("started") ?? ""));
    if (h && (c.timestamp = h), a) {
      const _ = S(String(g.get("ended") ?? ""));
      c.ended_at = _ ?? null;
    } else o && h && (c.ended_at = h);
    const v = String(g.get("notes") ?? "");
    c.notes = v || null;
    const f = {};
    if (n === "diaper")
      f.kind = String(g.get("kind") ?? s.kind ?? "wet");
    else if (n === "feeding" && s.method === "bottle") {
      const _ = String(g.get("amount") ?? ""), x = _ === "" ? null : Number(_);
      f.amount = x, f.unit = String(g.get("unit") ?? s.unit ?? "oz");
    } else if (n === "other" || n === "medication") {
      const _ = String(g.get("name") ?? "");
      _ && (f.name = _);
    } else if (n === "growth") {
      const _ = (O) => {
        const it = g.get(O);
        if (it === null) return;
        const nt = String(it).trim();
        if (nt === "") return null;
        const rt = Number(nt);
        return Number.isFinite(rt) ? rt : void 0;
      }, x = _("weight"), C = _("height"), D = _("head");
      x !== void 0 && (f.weight = x), C !== void 0 && (f.height = C), D !== void 0 && (f.head_circumference = D), f.weight_unit = String(
        g.get("weight_unit") ?? s.weight_unit ?? "kg"
      ), f.length_unit = String(
        g.get("length_unit") ?? s.length_unit ?? "cm"
      );
    }
    Object.keys(f).length && (c.data = f), t("edit_entry", { entry_id: e.id, fields: c });
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
  }, b = ii(e);
  return u`
        <form @submit=${l}>
            <h2>${b}</h2>
            ${a ? u`
                      <label for="started">Started</label>
                      <input
                          id="started"
                          name="started"
                          type="datetime-local"
                          .value=${_t(e.timestamp)}
                          required
                      />
                      <label for="ended"
                          >Ended <span class="muted">(blank = ongoing)</span></label
                      >
                      <input
                          id="ended"
                          name="ended"
                          type="datetime-local"
                          .value=${_t(e.ended_at)}
                      />
                  ` : u`
                      <label for="started">Time</label>
                      <input
                          id="started"
                          name="started"
                          type="datetime-local"
                          .value=${_t(e.timestamp)}
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
function ii(e) {
  const t = String((e == null ? void 0 : e.type) ?? "entry"), i = (e == null ? void 0 : e.data) ?? {}, r = i.name ?? i.method ?? i.kind;
  return r ? `Edit ${t} (${r})` : `Edit ${t}`;
}
function ni(e, t, i, r, n) {
  const s = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: i ? `Log ${i.replace("_", " ")} feeding` : "Log feeding"
  };
  return u`
        <form @submit=${(a) => {
    a.preventDefault();
    const l = a.currentTarget, d = new FormData(l), b = S(String(d.get("started") ?? "")), p = S(String(d.get("ended") ?? "")), m = String(d.get("notes") ?? "") || void 0;
    if (!p) {
      const h = {
        baby: e,
        started_at: b
      };
      let v;
      switch (t) {
        case "sleep":
          v = "start_sleep";
          break;
        case "tummy_time":
          v = "start_tummy_time";
          break;
        case "walk":
          v = "start_walk";
          break;
        case "feeding":
          v = "start_feeding", h.method = i;
          break;
      }
      r(v, h);
      return;
    }
    const g = {
      baby: e,
      started_at: b,
      ended_at: p,
      notes: m
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
        c = "log_feeding", g.method = i;
        break;
    }
    r(c, g);
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
function ri(e, t, i, r) {
  const n = (t == null ? void 0 : t.weight_unit) ?? "kg", s = (t == null ? void 0 : t.length_unit) ?? "cm";
  return u`
        <form @submit=${(a) => {
    a.preventDefault();
    const l = a.currentTarget, d = new FormData(l), b = (p) => {
      const m = String(d.get(p) ?? "").trim();
      if (!m) return;
      const g = Number(m);
      return Number.isFinite(g) ? g : void 0;
    };
    i("log_growth", {
      baby: e,
      weight: b("weight"),
      height: b("height"),
      head_circumference: b("head"),
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
const si = [
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
], oi = {
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
function zt(e) {
  return oi[e] ?? e;
}
function ai(e, t, i, r, n, s) {
  const o = [
    "left_thigh",
    "right_thigh",
    "left_arm",
    "right_arm",
    "oral",
    "nasal"
  ], a = (h) => {
    h.preventDefault();
    const v = h.currentTarget, f = new FormData(v), _ = String(f.get("vaccine_select") ?? "").trim(), x = String(f.get("vaccine_custom") ?? "").trim(), C = _ === "__other__" ? x : _;
    if (!C) return;
    const D = String(f.get("dose_number") ?? "").trim(), O = D === "" ? void 0 : Number(D), it = String(f.get("site") ?? "").trim() || void 0, nt = String(f.get("lot_number") ?? "").trim() || void 0, rt = String(f.get("provider") ?? "").trim() || void 0;
    n("log_vaccine", {
      baby: e,
      name: C,
      dose_number: O,
      site: it,
      lot_number: nt,
      provider: rt,
      timestamp: Ye(String(f.get("when") ?? "")),
      notes: String(f.get("notes") ?? "") || void 0
    });
  }, l = Array.from(
    new Set(
      [...si, ...r].filter((h) => !!h && h !== "none").map(zt)
    )
  ).sort((h, v) => h.localeCompare(v)), d = t && t !== "none" ? zt(t) : "", b = !!d && l.includes(d), p = !!d && !b, m = b ? d : p ? "__other__" : "", g = p ? d : "";
  return u`
        <form @submit=${a}>
            <h2>Log vaccine</h2>
            <label for="vaccine_select">Vaccine</label>
            <select
                id="vaccine_select"
                name="vaccine_select"
                required
                autofocus
                @change=${(h) => {
    var _;
    const v = h.currentTarget, f = (_ = v.closest("form")) == null ? void 0 : _.querySelector("#vaccine_custom");
    f && (v.value === "__other__" ? (f.hidden = !1, f.required = !0, f.focus()) : (f.hidden = !0, f.required = !1, f.value = ""));
  }}
            >
                <option value="" disabled ?selected=${m === ""}>
                    (pick one)
                </option>
                ${l.map(
    (h) => u`<option
                        value=${h}
                        ?selected=${m === h}
                    >
                        ${h}
                    </option>`
  )}
                <option
                    value="__other__"
                    ?selected=${m === "__other__"}
                >
                    Other…
                </option>
            </select>
            <input
                id="vaccine_custom"
                name="vaccine_custom"
                type="text"
                placeholder="Vaccine name"
                .value=${g}
                ?hidden=${m !== "__other__"}
                ?required=${m === "__other__"}
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
    (h) => u`<option value=${h}>${h.replace("_", " ")}</option>`
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
                .value=${We()}
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
const vt = 24 * 60 * 60 * 1e3, Ft = 29.5735;
function li(e, t, i = 7) {
  var b, p, m, g;
  const r = (b = e == null ? void 0 : e.states) == null ? void 0 : b[$(t, "recent_entries")], n = ((p = r == null ? void 0 : r.attributes) == null ? void 0 : p.entries) ?? [], s = Date.now(), o = new Date(s);
  o.setHours(0, 0, 0, 0);
  const a = [], l = (c) => c.toLocaleDateString([], { weekday: "short" });
  for (let c = i - 1; c >= 0; c--) {
    const h = new Date(o.getTime() - c * vt);
    a.push({
      label: l(h),
      sleepMinutes: 0,
      feedings: 0,
      bottleMl: 0,
      diapers: 0
    });
  }
  const d = o.getTime() - (i - 1) * vt;
  for (const c of n) {
    const h = Date.parse(c == null ? void 0 : c.timestamp);
    if (!Number.isFinite(h)) continue;
    const v = Math.floor((h - d) / vt);
    if (v < 0 || v >= i) continue;
    const f = a[v];
    if (c.type === "feeding") {
      f.feedings += 1;
      const _ = Number(((m = c == null ? void 0 : c.data) == null ? void 0 : m.amount) ?? 0), x = String(((g = c == null ? void 0 : c.data) == null ? void 0 : g.unit) ?? "");
      _ > 0 && x === "oz" ? f.bottleMl += _ * Ft : _ > 0 && x === "ml" && (f.bottleMl += _);
    } else if (c.type === "diaper")
      f.diapers += 1;
    else if (c.type === "sleep") {
      const _ = c != null && c.ended_at && c.ended_at !== "" ? Date.parse(c.ended_at) : s;
      Number.isFinite(_) && _ > h && (f.sleepMinutes += (_ - h) / 6e4);
    }
  }
  return a.every((c) => c.sleepMinutes === 0 && c.feedings === 0 && c.diapers === 0) ? "" : u`
        <div class="section" role="region" aria-label="Trends">
            <h2>Trends · last ${i} days</h2>
            ${st(
    a.map((c) => ({ label: c.label, value: c.sleepMinutes })),
    "Sleep (min/day)",
    (c) => `${Math.round(c)}`
  )}
            ${st(
    a.map((c) => ({ label: c.label, value: c.feedings })),
    "Feedings/day",
    (c) => `${c}`
  )}
            ${st(
    a.map((c) => ({ label: c.label, value: c.bottleMl })),
    "Bottle (oz/day)",
    (c) => (c / Ft).toFixed(1)
  )}
            ${st(
    a.map((c) => ({ label: c.label, value: c.diapers })),
    "Diapers/day",
    (c) => `${c}`
  )}
        </div>
    `;
}
function st(e, t, i) {
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
                ${e.map((d, b) => {
    const p = 14 + b * l, m = l * 0.7, g = p + (l - m) / 2, c = Math.max(
      d.value > 0 ? 2 : 0,
      d.value / a * (90 - 24 * 2)
    ), h = 66 - c;
    return u`
                        <rect
                            x=${g}
                            y=${h}
                            width=${m}
                            height=${c}
                            fill="var(--primary-color)"
                            rx="2"
                        ></rect>
                        <text
                            x=${g + m / 2}
                            y=${h - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${d.value > 0 ? i(d.value) : ""}
                        </text>
                        <text
                            x=${g + m / 2}
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
function ci(e) {
  if (!e) return "—";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "—" : new Date(t).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function yt(e) {
  var r, n;
  const t = String(((r = e == null ? void 0 : e.data) == null ? void 0 : r.name) ?? "vaccine"), i = (n = e == null ? void 0 : e.data) == null ? void 0 : n.dose_number;
  return i != null ? `${t} dose ${i}` : t;
}
function di(e, t) {
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
                        aria-label=${t ? `Edit ${yt(i)}` : yt(i)}
                        @click=${t ? () => t(i) : void 0}
                        @keydown=${t ? (n) => {
        (n.key === "Enter" || n.key === " ") && (n.preventDefault(), t(i));
      } : void 0}
                    >
                        <span class="vh-date muted"
                            >${ci(i.timestamp)}</span
                        >
                        <span class="vh-name">${yt(i)}</span>
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
function ui(e, t, i) {
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
var pi = Object.defineProperty, hi = Object.getOwnPropertyDescriptor, U = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? hi(t, i) : t, s = e.length - 1, o; s >= 0; s--)
    (o = e[s]) && (n = (r ? o(t, i, n) : o(n)) || n);
  return r && n && pi(t, i, n), n;
};
const mi = ["vaccines", "growth", "trends", "export"];
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
      var o, a, l, d, b;
      if (!((o = this._config) != null && o.baby)) return;
      const e = (l = (a = this.hass) == null ? void 0 : a.states) == null ? void 0 : l[$(this._config.baby, "vaccines_due")], t = e != null && e.state && e.state !== "none" && e.state !== "unknown" ? String(e.state) : "", i = (d = e == null ? void 0 : e.attributes) == null ? void 0 : d.dose_number, r = typeof i == "number" ? i : void 0, s = (Array.isArray((b = e == null ? void 0 : e.attributes) == null ? void 0 : b.upcoming) ? e.attributes.upcoming : []).map((p) => p && typeof p.name == "string" ? p.name : null).filter((p) => !!p);
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
    !this.hass || !this._config || (this._unsubOptions || (this._unsubOptions = Kt(
      this.hass,
      (i) => {
        this._options = i;
      }
    )), !this._unsubVaccines && this._sections.includes("vaccines") && ((e = this._config) != null && e.baby) && (this._unsubVaccines = Pe(
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
    return ((e = this._config) == null ? void 0 : e.sections) ?? mi;
  }
  render() {
    if (!this.hass || !this._config) return u``;
    const e = this._sections;
    return u`
            <ha-card>
                ${e.includes("vaccines") ? u`
                          ${ui(
      this.hass,
      this._config.baby,
      this._requestLogVaccine
    )}
                          ${di(
      this._vaccines,
      this._requestEditEntry
    )}
                      ` : ""}
                ${e.includes("growth") ? te(
      this.hass,
      this._config.baby,
      this._options,
      this._config.units,
      this._requestLogGrowth,
      this._growth[0],
      this._requestEditEntry
    ) : ""}
                ${e.includes("trends") ? li(
      this.hass,
      this._config.baby,
      this._config.trend_days ?? 7
    ) : ""}
                ${e.includes("export") ? ee(this.hass, this._config.baby) : ""}
            </ha-card>
            ${St(
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
A.styles = dt`
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
U([
  W({ attribute: !1 })
], A.prototype, "hass", 2);
U([
  w()
], A.prototype, "_config", 2);
U([
  w()
], A.prototype, "_options", 2);
U([
  w()
], A.prototype, "_modal", 2);
U([
  w()
], A.prototype, "_vaccines", 2);
U([
  w()
], A.prototype, "_growth", 2);
A = U([
  pt("babytracker-summary-card")
], A);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-summary-card",
  name: "babytracker — summary",
  description: "Vaccines, growth, 7-day trend charts, and pediatrician export for one baby."
});
var bi = Object.defineProperty, gi = Object.getOwnPropertyDescriptor, z = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? gi(t, i) : t, s = e.length - 1, o; s >= 0; s--)
    (o = e[s]) && (n = (r ? o(t, i, n) : o(n)) || n);
  return r && n && bi(t, i, n), n;
};
function qt(e) {
  return String(e).padStart(2, "0");
}
function at(e) {
  return `${e.getFullYear()}-${qt(e.getMonth() + 1)}-${qt(e.getDate())}`;
}
function tt(e) {
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
  if (!t) return null;
  const i = Number(t[1]), r = Number(t[2]) - 1, n = Number(t[3]), s = new Date(i, r, n, 0, 0, 0, 0);
  return Number.isNaN(s.getTime()) ? null : s;
}
function fi(e) {
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
function _i(e, t) {
  const i = tt(e) ?? /* @__PURE__ */ new Date();
  return i.setDate(i.getDate() + t), at(i);
}
function vi(e) {
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
    super(...arguments), this._date = at(/* @__PURE__ */ new Date()), this._entries = [], this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._today = () => {
      this._date = at(/* @__PURE__ */ new Date());
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
    const { startIso: e, endIso: t } = fi(this._date);
    this._unsubEntries = Ne(
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
    this._date = _i(this._date, e);
  }
  render() {
    if (!this.hass || !this._config) return u``;
    const e = this._date === at(/* @__PURE__ */ new Date());
    return u`
            <ha-card>
                <h2>History — ${vi(this._date)}</h2>
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
      (t) => Qt(
        t,
        this._requestEdit,
        this._expandedNotes,
        this._toggleNotes
      )
    )}
                          </ul>
                      `}
            </ha-card>
            ${St(
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
E.styles = dt`
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
z([
  W({ attribute: !1 })
], E.prototype, "hass", 2);
z([
  w()
], E.prototype, "_config", 2);
z([
  w()
], E.prototype, "_date", 2);
z([
  w()
], E.prototype, "_entries", 2);
z([
  w()
], E.prototype, "_modal", 2);
z([
  w()
], E.prototype, "_expandedNotes", 2);
E = z([
  pt("babytracker-history-card")
], E);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-history-card",
  name: "babytracker — history",
  description: "Paginate through one baby's entries by calendar day with edit + delete."
});
var yi = Object.defineProperty, $i = Object.getOwnPropertyDescriptor, M = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? $i(t, i) : t, s = e.length - 1, o; s >= 0; s--)
    (o = e[s]) && (n = (r ? o(t, i, n) : o(n)) || n);
  return r && n && yi(t, i, n), n;
};
const wi = [
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
        const n = await Ce(this.hass, "babytracker", e, t);
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
    )), this._unsubOptions || (this._unsubOptions = Kt(
      this.hass,
      (e) => {
        this._options = e;
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? wi;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(e, t = "sensor") {
    return $(this._baby(), e, t);
  }
  _renderStatus() {
    var o, a, l, d, b, p, m, g, c, h;
    const e = this.hass, t = (a = (o = e.states) == null ? void 0 : o[this._entityId("last_feeding")]) == null ? void 0 : a.state, i = (d = (l = e.states) == null ? void 0 : l[this._entityId("last_diaper")]) == null ? void 0 : d.state, r = ((p = (b = e.states) == null ? void 0 : b[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : p.state) === "on", n = ((g = (m = e.states) == null ? void 0 : m[this._entityId("walking", "binary_sensor")]) == null ? void 0 : g.state) === "on", s = ((h = (c = e.states) == null ? void 0 : c[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : h.state) === "on";
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
    var i, r, n, s, o, a, l;
    const e = (r = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : r[this._entityId("recent_entries")], t = ((n = e == null ? void 0 : e.attributes) == null ? void 0 : n.entries) ?? [];
    for (const d of t)
      if ((d == null ? void 0 : d.type) === "feeding" && ((s = d == null ? void 0 : d.data) == null ? void 0 : s.method) === "bottle" && typeof ((o = d == null ? void 0 : d.data) == null ? void 0 : o.amount) == "number" && (((a = d == null ? void 0 : d.data) == null ? void 0 : a.unit) === "ml" || ((l = d == null ? void 0 : d.data) == null ? void 0 : l.unit) === "oz"))
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
                ${e.includes("today") ? je(this.hass, this._baby(), this._babyConfig) : ""}
                ${e.includes("active_session") ? Me(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("quick_log") ? Ee(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${e.includes("growth") ? te(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${e.includes("recent") ? ze(
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
                ${e.includes("export") ? ee(this.hass, this._baby()) : ""}
            </ha-card>
            ${St(
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
k.styles = dt`
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
  ke("dialog")
], k.prototype, "_dialog", 2);
k = M([
  pt("babytracker-card")
], k);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => Si);
var xi = Object.defineProperty, ki = Object.getOwnPropertyDescriptor, At = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? ki(t, i) : t, s = e.length - 1, o; s >= 0; s--)
    (o = e[s]) && (n = (r ? o(t, i, n) : o(n)) || n);
  return r && n && xi(t, i, n), n;
};
let V = class extends T {
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
V.styles = dt`
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
At([
  W({ attribute: !1 })
], V.prototype, "hass", 2);
At([
  W({ attribute: !1 })
], V.prototype, "_config", 2);
V = At([
  pt("babytracker-card-editor")
], V);
V.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const Si = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return V;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  k as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
