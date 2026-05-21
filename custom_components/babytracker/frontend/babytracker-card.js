/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ct = globalThis, Wt = Ct.ShadowRoot && (Ct.ShadyCSS === void 0 || Ct.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Kt = Symbol(), ne = /* @__PURE__ */ new WeakMap();
let De = class {
  constructor(e, i, n) {
    if (this._$cssResult$ = !0, n !== Kt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (Wt && e === void 0) {
      const n = i !== void 0 && i.length === 1;
      n && (e = ne.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && ne.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Fe = (t) => new De(typeof t == "string" ? t : t + "", void 0, Kt), F = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((n, r, s) => n + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[s + 1], t[0]);
  return new De(i, t, Kt);
}, qe = (t, e) => {
  if (Wt) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const n = document.createElement("style"), r = Ct.litNonce;
    r !== void 0 && n.setAttribute("nonce", r), n.textContent = i.cssText, t.appendChild(n);
  }
}, re = Wt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const n of e.cssRules) i += n.cssText;
  return Fe(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: je, defineProperty: We, getOwnPropertyDescriptor: Ke, getOwnPropertyNames: Ye, getOwnPropertySymbols: Ge, getPrototypeOf: Xe } = Object, K = globalThis, se = K.trustedTypes, Ze = se ? se.emptyScript : "", Nt = K.reactiveElementPolyfillSupport, mt = (t, e) => t, Dt = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Ze : null;
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
} }, Yt = (t, e) => !je(t, e), oe = { attribute: !0, type: String, converter: Dt, reflect: !1, useDefault: !1, hasChanged: Yt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), K.litPropertyMetadata ?? (K.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let ct = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = oe) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const n = Symbol(), r = this.getPropertyDescriptor(e, n, i);
      r !== void 0 && We(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, i, n) {
    const { get: r, set: s } = Ke(this.prototype, e) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: r, set(o) {
      const a = r == null ? void 0 : r.call(this);
      s == null || s.call(this, o), this.requestUpdate(e, a, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? oe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(mt("elementProperties"))) return;
    const e = Xe(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(mt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(mt("properties"))) {
      const i = this.properties, n = [...Ye(i), ...Ge(i)];
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
      for (const r of n) i.unshift(re(r));
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
    return qe(e, this.constructor.elementStyles), e;
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
    const n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
    if (r !== void 0 && n.reflect === !0) {
      const o = (((s = n.converter) == null ? void 0 : s.toAttribute) !== void 0 ? n.converter : Dt).toAttribute(i, n.type);
      this._$Em = e, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(e, i) {
    var s, o;
    const n = this.constructor, r = n._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const a = n.getPropertyOptions(r), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((s = a.converter) == null ? void 0 : s.fromAttribute) !== void 0 ? a.converter : Dt;
      this._$Em = r;
      const d = l.fromAttribute(i, a.type);
      this[r] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, i, n, r = !1, s) {
    var o;
    if (e !== void 0) {
      const a = this.constructor;
      if (r === !1 && (s = this[e]), n ?? (n = a.getPropertyOptions(e)), !((n.hasChanged ?? Yt)(s, i) || n.useDefault && n.reflect && s === ((o = this._$Ej) == null ? void 0 : o.get(e)) && !this.hasAttribute(a._$Eu(e, n)))) return;
      this.C(e, i, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: n, reflect: r, wrapped: s }, o) {
    n && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, o ?? i ?? this[e]), s !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (i = void 0), this._$AL.set(e, i)), r === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [s, o] of r) {
        const { wrapped: a } = o, l = this[s];
        a !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, o, l);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (n = this._$EO) == null || n.forEach((r) => {
        var s;
        return (s = r.hostUpdate) == null ? void 0 : s.call(r);
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
ct.elementStyles = [], ct.shadowRootOptions = { mode: "open" }, ct[mt("elementProperties")] = /* @__PURE__ */ new Map(), ct[mt("finalized")] = /* @__PURE__ */ new Map(), Nt == null || Nt({ ReactiveElement: ct }), (K.reactiveElementVersions ?? (K.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _t = globalThis, ae = (t) => t, Et = _t.trustedTypes, le = Et ? Et.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ee = "$lit$", j = `lit$${Math.random().toFixed(9).slice(2)}$`, Pe = "?" + j, Qe = `<${Pe}>`, nt = document, yt = () => nt.createComment(""), vt = (t) => t === null || typeof t != "object" && typeof t != "function", Gt = Array.isArray, Je = (t) => Gt(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Ot = `[ 	
\f\r]`, gt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ce = /-->/g, de = />/g, tt = RegExp(`>|${Ot}(?:([^\\s"'>=/]+)(${Ot}*=${Ot}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ue = /'/g, pe = /"/g, Me = /^(?:script|style|textarea|title)$/i, Te = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), c = Te(1), z = Te(2), dt = Symbol.for("lit-noChange"), C = Symbol.for("lit-nothing"), he = /* @__PURE__ */ new WeakMap(), et = nt.createTreeWalker(nt, 129);
function Ne(t, e) {
  if (!Gt(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return le !== void 0 ? le.createHTML(e) : e;
}
const ti = (t, e) => {
  const i = t.length - 1, n = [];
  let r, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = gt;
  for (let a = 0; a < i; a++) {
    const l = t[a];
    let d, b, h = -1, g = 0;
    for (; g < l.length && (o.lastIndex = g, b = o.exec(l), b !== null); ) g = o.lastIndex, o === gt ? b[1] === "!--" ? o = ce : b[1] !== void 0 ? o = de : b[2] !== void 0 ? (Me.test(b[2]) && (r = RegExp("</" + b[2], "g")), o = tt) : b[3] !== void 0 && (o = tt) : o === tt ? b[0] === ">" ? (o = r ?? gt, h = -1) : b[1] === void 0 ? h = -2 : (h = o.lastIndex - b[2].length, d = b[1], o = b[3] === void 0 ? tt : b[3] === '"' ? pe : ue) : o === pe || o === ue ? o = tt : o === ce || o === de ? o = gt : (o = tt, r = void 0);
    const m = o === tt && t[a + 1].startsWith("/>") ? " " : "";
    s += o === gt ? l + Qe : h >= 0 ? (n.push(d), l.slice(0, h) + Ee + l.slice(h) + j + m) : l + j + (h === -2 ? a : m);
  }
  return [Ne(t, s + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), n];
};
class $t {
  constructor({ strings: e, _$litType$: i }, n) {
    let r;
    this.parts = [];
    let s = 0, o = 0;
    const a = e.length - 1, l = this.parts, [d, b] = ti(e, i);
    if (this.el = $t.createElement(d, n), et.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = et.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(Ee)) {
          const g = b[o++], m = r.getAttribute(h).split(j), f = /([.?@])?(.*)/.exec(g);
          l.push({ type: 1, index: s, name: f[2], strings: m, ctor: f[1] === "." ? ii : f[1] === "?" ? ni : f[1] === "@" ? ri : Mt }), r.removeAttribute(h);
        } else h.startsWith(j) && (l.push({ type: 6, index: s }), r.removeAttribute(h));
        if (Me.test(r.tagName)) {
          const h = r.textContent.split(j), g = h.length - 1;
          if (g > 0) {
            r.textContent = Et ? Et.emptyScript : "";
            for (let m = 0; m < g; m++) r.append(h[m], yt()), et.nextNode(), l.push({ type: 2, index: ++s });
            r.append(h[g], yt());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Pe) l.push({ type: 2, index: s });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(j, h + 1)) !== -1; ) l.push({ type: 7, index: s }), h += j.length - 1;
      }
      s++;
    }
  }
  static createElement(e, i) {
    const n = nt.createElement("template");
    return n.innerHTML = e, n;
  }
}
function ut(t, e, i = t, n) {
  var o, a;
  if (e === dt) return e;
  let r = n !== void 0 ? (o = i._$Co) == null ? void 0 : o[n] : i._$Cl;
  const s = vt(e) ? void 0 : e._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== s && ((a = r == null ? void 0 : r._$AO) == null || a.call(r, !1), s === void 0 ? r = void 0 : (r = new s(t), r._$AT(t, i, n)), n !== void 0 ? (i._$Co ?? (i._$Co = []))[n] = r : i._$Cl = r), r !== void 0 && (e = ut(t, r._$AS(t, e.values), r, n)), e;
}
class ei {
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
    let s = et.nextNode(), o = 0, a = 0, l = n[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let d;
        l.type === 2 ? d = new kt(s, s.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(s, l.name, l.strings, this, e) : l.type === 6 && (d = new si(s, this, e)), this._$AV.push(d), l = n[++a];
      }
      o !== (l == null ? void 0 : l.index) && (s = et.nextNode(), o++);
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
    this.type = 2, this._$AH = C, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = n, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    e = ut(this, e, i), vt(e) ? e === C || e == null || e === "" ? (this._$AH !== C && this._$AR(), this._$AH = C) : e !== this._$AH && e !== dt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Je(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== C && vt(this._$AH) ? this._$AA.nextSibling.data = e : this.T(nt.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var s;
    const { values: i, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = $t.createElement(Ne(n.h, n.h[0]), this.options)), n);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === r) this._$AH.p(i);
    else {
      const o = new ei(r, this), a = o.u(this.options);
      o.p(i), this.T(a), this._$AH = o;
    }
  }
  _$AC(e) {
    let i = he.get(e.strings);
    return i === void 0 && he.set(e.strings, i = new $t(e)), i;
  }
  k(e) {
    Gt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let n, r = 0;
    for (const s of e) r === i.length ? i.push(n = new kt(this.O(yt()), this.O(yt()), this, this.options)) : n = i[r], n._$AI(s), r++;
    r < i.length && (this._$AR(n && n._$AB.nextSibling, r), i.length = r);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, i); e !== this._$AB; ) {
      const r = ae(e).nextSibling;
      ae(e).remove(), e = r;
    }
  }
  setConnected(e) {
    var i;
    this._$AM === void 0 && (this._$Cv = e, (i = this._$AP) == null || i.call(this, e));
  }
}
class Mt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, n, r, s) {
    this.type = 1, this._$AH = C, this._$AN = void 0, this.element = e, this.name = i, this._$AM = r, this.options = s, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = C;
  }
  _$AI(e, i = this, n, r) {
    const s = this.strings;
    let o = !1;
    if (s === void 0) e = ut(this, e, i, 0), o = !vt(e) || e !== this._$AH && e !== dt, o && (this._$AH = e);
    else {
      const a = e;
      let l, d;
      for (e = s[0], l = 0; l < s.length - 1; l++) d = ut(this, a[n + l], i, l), d === dt && (d = this._$AH[l]), o || (o = !vt(d) || d !== this._$AH[l]), d === C ? e = C : e !== C && (e += (d ?? "") + s[l + 1]), this._$AH[l] = d;
    }
    o && !r && this.j(e);
  }
  j(e) {
    e === C ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ii extends Mt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === C ? void 0 : e;
  }
}
class ni extends Mt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== C);
  }
}
class ri extends Mt {
  constructor(e, i, n, r, s) {
    super(e, i, n, r, s), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = ut(this, e, i, 0) ?? C) === dt) return;
    const n = this._$AH, r = e === C && n !== C || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, s = e !== C && (n === C || r);
    r && this.element.removeEventListener(this.name, this, n), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class si {
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
const Rt = _t.litHtmlPolyfillSupport;
Rt == null || Rt($t, kt), (_t.litHtmlVersions ?? (_t.litHtmlVersions = [])).push("3.3.3");
const oi = (t, e, i) => {
  const n = (i == null ? void 0 : i.renderBefore) ?? e;
  let r = n._$litPart$;
  if (r === void 0) {
    const s = (i == null ? void 0 : i.renderBefore) ?? null;
    n._$litPart$ = r = new kt(e.insertBefore(yt(), s), s, void 0, i ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const it = globalThis;
class O extends ct {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = oi(i, this.renderRoot, this.renderOptions);
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
var Ae;
O._$litElement$ = !0, O.finalized = !0, (Ae = it.litElementHydrateSupport) == null || Ae.call(it, { LitElement: O });
const Lt = it.litElementPolyfillSupport;
Lt == null || Lt({ LitElement: O });
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
const ai = { attribute: !0, type: String, converter: Dt, reflect: !1, hasChanged: Yt }, li = (t = ai, e, i) => {
  const { kind: n, metadata: r } = i;
  let s = globalThis.litPropertyMetadata.get(r);
  if (s === void 0 && globalThis.litPropertyMetadata.set(r, s = /* @__PURE__ */ new Map()), n === "setter" && ((t = Object.create(t)).wrapped = !0), s.set(i.name, t), n === "accessor") {
    const { name: o } = i;
    return { set(a) {
      const l = e.get.call(this);
      e.set.call(this, a), this.requestUpdate(o, l, t, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, t, a), a;
    } };
  }
  if (n === "setter") {
    const { name: o } = i;
    return function(a) {
      const l = this[o];
      e.call(this, a), this.requestUpdate(o, l, t, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function M(t) {
  return (e, i) => typeof i == "object" ? li(t, e, i) : ((n, r, s) => {
    const o = r.hasOwnProperty(s);
    return r.constructor.createProperty(s, n), o ? Object.getOwnPropertyDescriptor(r, s) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function k(t) {
  return M({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ci = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Oe(t, e) {
  return (i, n, r) => {
    const s = (o) => {
      var a;
      return ((a = o.renderRoot) == null ? void 0 : a.querySelector(t)) ?? null;
    };
    return ci(i, n, { get() {
      return s(this);
    } });
  };
}
function A(t, e, i = "sensor") {
  return `${i}.babytracker_${t}_${e}`;
}
function Xt(t) {
  return typeof t != "string" || t.length === 0 ? "" : t.charAt(0).toUpperCase() + t.slice(1);
}
async function di(t, e, i, n) {
  return t.callService(e, i, n);
}
function St(t, e, i, n) {
  const r = { cancelled: !1 }, s = async (o) => {
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
        if (console.warn(`babytracker: ${n} failed (attempt ${o + 1})`, a), r.cancelled) return;
        const l = Math.min(3e4, 1e3 * 2 ** o);
        r.timer = setTimeout(() => {
          r.timer = void 0, s(o + 1);
        }, l);
      }
  };
  return s(0), () => {
    var o;
    r.cancelled = !0, r.timer != null && (clearTimeout(r.timer), r.timer = void 0), (o = r.unsub) == null || o.call(r);
  };
}
function ui(t, e, i) {
  return St(
    t,
    { type: "babytracker/get_baby_config", baby: e, subscribe: !0 },
    i,
    "subscribeBabyConfig"
  );
}
function Re(t, e) {
  return St(
    t,
    { type: "babytracker/get_integration_options", subscribe: !0 },
    e,
    "subscribeIntegrationOptions"
  );
}
function pi(t, e, i, n, r) {
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
function hi(t, e, i) {
  return St(
    t,
    { type: "babytracker/list_vaccines", baby: e, subscribe: !0 },
    i,
    "subscribeVaccines"
  );
}
function bi(t, e, i) {
  return St(
    t,
    { type: "babytracker/list_growth", baby: e, subscribe: !0 },
    i,
    "subscribeGrowth"
  );
}
function gi(t, e, i, n) {
  if (!t)
    return c`
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
  const r = t.enabled_activities ?? [], s = t.enabled_feeding_methods ?? [], o = (d) => d.charAt(0).toUpperCase() + d.slice(1), a = Xt(t.name ?? e), l = [];
  if (r.includes("diaper") && l.push(
    c`
                <button
                    class="quick"
                    aria-label="Log diaper for ${a}"
                    @click=${() => n("diaper")}
                >
                    Diaper
                </button>
            `
  ), r.includes("feeding"))
    for (const d of s)
      d === "bottle" ? l.push(
        c`
                        <button
                            class="quick"
                            aria-label="Log bottle feeding for ${a}"
                            @click=${() => n("bottle")}
                        >
                            Bottle
                        </button>
                    `
      ) : d === "solids" ? l.push(
        c`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${a}"
                            @click=${() => n("solids")}
                        >
                            Solids
                        </button>
                    `
      ) : (d === "breast_left" || d === "breast_right") && l.push(
        c`
                        <button
                            class="quick"
                            aria-label="Log ${d} feeding for ${a}"
                            @click=${() => n({ activity: "feeding", method: d })}
                        >
                            ${o(d.replace("_", " "))}
                        </button>
                    `
      );
  return r.includes("sleep") && l.push(
    c`
                <button
                    class="quick"
                    aria-label="Log sleep for ${a}"
                    @click=${() => n({ activity: "sleep" })}
                >
                    Sleep
                </button>
            `
  ), r.includes("tummy_time") && l.push(
    c`
                <button
                    class="quick"
                    aria-label="Log tummy time for ${a}"
                    @click=${() => n({ activity: "tummy_time" })}
                >
                    Tummy time
                </button>
            `
  ), r.includes("walk") && l.push(
    c`
                <button
                    class="quick"
                    aria-label="Log walk for ${a}"
                    @click=${() => n({ activity: "walk" })}
                >
                    Walk
                </button>
            `
  ), r.includes("other") && l.push(
    c`
                <button
                    class="quick"
                    aria-label="Log other activity for ${a}"
                    @click=${() => n("other")}
                >
                    Other
                </button>
            `
  ), c`
        <div class="section grid" role="group" aria-label="Quick log">
            ${l}
        </div>
    `;
}
const Pt = 29.5735, Le = 24 * 60 * 60 * 1e3;
function I(t) {
  if (!t) return 0;
  const e = Date.parse(t);
  return Number.isNaN(e) ? 0 : e;
}
function fi(t, e = Le, i = Date.now()) {
  const n = i - e;
  return t.filter((r) => I(r.timestamp) >= n).slice().sort((r, s) => I(s.timestamp) - I(r.timestamp));
}
function mi(t, e = Date.now(), i = Le) {
  var d, b, h;
  const n = e - i;
  let r = 0, s = 0, o = 0, a = 0, l = 0;
  for (const g of t) {
    const m = I(g.timestamp);
    if (g.type === "sleep") {
      const f = m, y = g.ended_at != null && g.ended_at !== "" ? I(g.ended_at) : e;
      if (f > 0 && y > f && y > n) {
        const p = Math.max(f, n), $ = Math.min(y, e);
        $ > p && (l += ($ - p) / 6e4);
      }
      continue;
    }
    if (!(m < n)) {
      if (g.type === "feeding") {
        r += 1;
        const f = Number(((d = g.data) == null ? void 0 : d.amount) ?? 0), y = String(((b = g.data) == null ? void 0 : b.unit) ?? "");
        f > 0 && (a += y === "oz" ? f * Pt : f);
      } else if (g.type === "diaper") {
        const f = String(((h = g.data) == null ? void 0 : h.kind) ?? "");
        f === "wet" ? s += 1 : f === "dirty" ? o += 1 : f === "both" && (s += 1, o += 1);
      }
    }
  }
  return { feedings: r, wetDiapers: s, dirtyDiapers: o, totalVolumeMl: a, sleepMinutes: l };
}
function ft(t, e, i) {
  if (t <= 0) return 0;
  const n = e != null && e !== "" ? I(e) : i;
  return n <= t ? 0 : (n - t) / 6e4;
}
function qt(t, e, i = Date.now()) {
  return ft(I(t), e, i);
}
function _i(t, e = Date.now()) {
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
    const r = I(n.timestamp), s = n.data ?? {};
    switch (n.type) {
      case "diaper": {
        const o = String(s.kind ?? "");
        o === "wet" ? (i.diapers += 1, i.wet += 1) : o === "dirty" ? (i.diapers += 1, i.dirty += 1) : o === "both" && (i.diapers += 1, i.wet += 1, i.dirty += 1);
        break;
      }
      case "sleep": {
        const o = ft(r, n.ended_at, e);
        i.sleepMinutes += o, o > i.longestSleepMinutes && (i.longestSleepMinutes = o);
        break;
      }
      case "feeding": {
        const o = String(s.method ?? "");
        if (o === "bottle") {
          i.bottleFeeds += 1;
          const a = Number(s.amount ?? 0), l = String(s.unit ?? "");
          a > 0 && (i.bottleVolumeMl += l === "oz" ? a * Pt : a);
        } else if (o === "breast_left" || o === "breast_right") {
          const a = ft(r, n.ended_at, e);
          i.nursingMinutes += a, o === "breast_left" ? i.nursingLeftMinutes += a : i.nursingRightMinutes += a;
        } else o === "solids" && (i.solidsCount += 1);
        break;
      }
      case "pumping": {
        const o = Number(s.volume ?? 0), a = String(s.unit ?? "");
        o > 0 && (i.pumpingMl += a === "oz" ? o * Pt : o);
        break;
      }
      case "tummy_time": {
        i.tummyMinutes += ft(r, n.ended_at, e);
        break;
      }
      case "walk": {
        i.walkCount += 1, i.walkMinutes += ft(r, n.ended_at, e);
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
function yi(t, e = Date.now()) {
  let i = null;
  for (const n of t) {
    if ((n == null ? void 0 : n.type) !== "sleep" || !(n != null && n.ended_at)) continue;
    const r = Date.parse(n.ended_at);
    Number.isFinite(r) && (i === null || r > i) && (i = r);
  }
  return i === null ? null : Math.max(0, (e - i) / 6e4);
}
function T(t) {
  if (!Number.isFinite(t) || t <= 0) return "0m";
  if (t < 60) return `${Math.round(t)}m`;
  const e = Math.floor(t / 60), i = Math.round(t % 60);
  return i === 0 ? `${e}h` : `${e}h ${i}m`;
}
function jt(t) {
  if (!Number.isFinite(t) || t <= 0) return "0 oz";
  const e = t / Pt;
  return e >= 1 ? `${e.toFixed(1)} oz` : `${Math.round(t)} ml`;
}
function vi(t) {
  const e = String((t == null ? void 0 : t.type) ?? ""), i = (t == null ? void 0 : t.data) ?? {};
  if (e === "other") {
    const o = String(i.name ?? "").trim();
    return be(o || Ht(e));
  }
  const n = i.method ?? i.kind, r = n != null && n !== "" ? Ht(String(n)) : null, s = be(Ht(e));
  return r ? e === "feeding" && i.amount != null && i.amount !== "" && i.unit ? `${s} (${r}, ${i.amount} ${i.unit})` : `${s} (${r})` : s;
}
function Ht(t) {
  return t.replace(/_/g, " ");
}
function be(t) {
  return t && t.charAt(0).toUpperCase() + t.slice(1);
}
function ge(t) {
  const e = I(t);
  return e === 0 ? "" : new Date(e).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function $i(t, e, i) {
  var l, d, b, h, g, m;
  const n = ((l = t.states[A(e, "sleeping", "binary_sensor")]) == null ? void 0 : l.state) === "on", r = ((d = t.states[A(e, "feeding", "binary_sensor")]) == null ? void 0 : d.state) === "on", s = ((b = t.states[A(e, "tummy_time", "binary_sensor")]) == null ? void 0 : b.state) === "on", o = ((h = t.states[A(e, "walking", "binary_sensor")]) == null ? void 0 : h.state) === "on";
  if (!n && !r && !s && !o) return "";
  const a = [];
  if (n) {
    const f = (g = t.states[A(e, "last_sleep_start")]) == null ? void 0 : g.state, y = f ? qt(f, null) : 0;
    a.push(
      c`
                <div class="chip warning" role="status">
                    Sleeping${f ? c` · started ${fe(f)} ·
                          ${T(y)}` : ""}
                    <button
                        aria-label="End sleep"
                        @click=${(p) => i("end_sleep", { baby: e }, p.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  if (r && a.push(
    c`
                <div class="chip warning" role="status">
                    Feeding
                    <button
                        aria-label="End feeding"
                        @click=${(f) => i("end_feeding", { baby: e }, f.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), s && a.push(
    c`
                <div class="chip warning" role="status">
                    Tummy time
                    <button
                        aria-label="End tummy time"
                        @click=${(f) => i("end_tummy_time", { baby: e }, f.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), o) {
    const f = (m = t.states[A(e, "last_walk_start")]) == null ? void 0 : m.state;
    a.push(
      c`
                <div class="chip warning" role="status">
                    Walking ${f ? c`· started ${fe(f)}` : ""}
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
  return c`<div class="section">${a}</div>`;
}
function fe(t) {
  if (!t) return "";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "" : new Date(e).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
var wi = Object.defineProperty, xi = Object.getOwnPropertyDescriptor, st = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? xi(e, i) : e, s = t.length - 1, o; s >= 0; s--)
    (o = t[s]) && (r = (n ? o(e, i, r) : o(r)) || r);
  return n && r && wi(e, i, r), r;
};
let U = class extends O {
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
    if (!this.photoPath) return c``;
    if (this._failed || !this._url)
      return c`<span aria-label="Has photo">📷</span>`;
    const t = `${this.size}px`;
    return c`
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
            ${this._open ? c`
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
st([
  M({ attribute: !1 })
], U.prototype, "hass", 2);
st([
  M()
], U.prototype, "photoPath", 2);
st([
  M({ type: Number })
], U.prototype, "size", 2);
st([
  k()
], U.prototype, "_url", 2);
st([
  k()
], U.prototype, "_failed", 2);
st([
  k()
], U.prototype, "_open", 2);
U = st([
  G("bt-entry-thumbnail")
], U);
const ki = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk",
  "other"
]);
function He(t, e, i, n, r) {
  return c`
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
                <span aria-label="Entry type">${vi(e)}</span>
                ${Si(e)}
                ${e.staff ? c`<span
                          class="muted"
                          aria-label="Logged by Procare staff"
                          >via ${e.staff}</span
                      >` : ""}
            </div>
            ${e.notes ? c`<div
                      class="entry-notes muted ${n.has(e.id) ? "expanded" : ""}"
                      role="button"
                      tabindex="0"
                      aria-label="Toggle notes"
                      aria-expanded=${n.has(e.id) ? "true" : "false"}
                      title=${e.notes}
                      @click=${(s) => {
    s.stopPropagation(), r(e.id);
  }}
                      @keydown=${(s) => {
    (s.key === "Enter" || s.key === " ") && (s.preventDefault(), s.stopPropagation(), r(e.id));
  }}
                  >${e.notes}</div>` : ""}
            ${e.photo_path ? c`<div class="entry-photo">
                      <bt-entry-thumbnail
                          .hass=${t}
                          .photoPath=${e.photo_path}
                      ></bt-entry-thumbnail>
                  </div>` : ""}
        </li>
    `;
}
function Si(t) {
  const e = ge(t.timestamp), i = t.type === "sleep", n = ki.has(String(t.type ?? ""));
  if (i && (!t.ended_at || t.ended_at === t.timestamp)) {
    const r = qt(t.timestamp, t.ended_at);
    return c`<span class="muted"
            >${e} (${T(r)}, ongoing)</span
        >`;
  }
  if (n && t.ended_at && t.ended_at !== t.timestamp) {
    const r = ge(t.ended_at);
    if (i) {
      const s = qt(
        t.timestamp,
        t.ended_at
      );
      return c`<span class="muted"
                >${e} – ${r} (${T(s)})</span
            >`;
    }
    return c`<span class="muted">${e} – ${r}</span>`;
  }
  return c`<span class="muted">${e}</span>`;
}
function Ci(t, e, i, n, r = /* @__PURE__ */ new Set(), s = () => {
}) {
  var d;
  const o = t.states[A(e, "recent_entries")], a = ((d = o == null ? void 0 : o.attributes) == null ? void 0 : d.entries) ?? [], l = fi(a).slice(0, Math.min(n, 120));
  return c`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${l.length === 0 ? c`<p>Nothing logged yet.</p>` : c`
                      <ul class="entries">
                          ${l.map(
    (b) => He(
      t,
      b,
      i,
      r,
      s
    )
  )}
                      </ul>
                  `}
        </div>
    `;
}
var Ai = Object.defineProperty, Di = Object.getOwnPropertyDescriptor, Tt = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? Di(e, i) : e, s = t.length - 1, o; s >= 0; s--)
    (o = t[s]) && (r = (n ? o(e, i, r) : o(r)) || r);
  return n && r && Ai(e, i, r), r;
};
let pt = class extends O {
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
    return c`
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
            ${this._open ? c`
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
Tt([
  M()
], pt.prototype, "label", 2);
Tt([
  M({ attribute: !1 })
], pt.prototype, "renderChart", 2);
Tt([
  k()
], pt.prototype, "_open", 2);
pt = Tt([
  G("bt-chart-lightbox")
], pt);
const me = [
  { key: "weight", label: "Weight", color: "var(--primary-color, #2563eb)" },
  { key: "height", label: "Height", color: "var(--success-color, #16a34a)" },
  { key: "head", label: "Head", color: "var(--warning-color, #ea580c)" }
];
function Ei(t, e) {
  const i = (t == null ? void 0 : t.data) ?? {}, n = e === "weight" ? i.weight_percentile : e === "height" ? i.height_percentile : i.head_percentile;
  if (n == null) return null;
  const r = Number(n);
  return Number.isFinite(r) ? r : null;
}
function zt(t) {
  if (t == null) return "—";
  const e = typeof t == "number" ? t : Number(t);
  return Number.isFinite(e) ? String(Math.round(e * 100) / 100) : String(t);
}
function It(t) {
  if (t == null || t === "—") return "—";
  const e = typeof t == "number" ? t : Number(t);
  return Number.isFinite(e) ? `p${Math.round(e)}` : String(t);
}
function Pi(t) {
  if (!t) return "";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "" : new Date(e).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function ze(t, e, i, n, r, s, o, a) {
  var v, D, E, S, P, q;
  const l = (s == null ? void 0 : s.data) ?? {}, d = (n == null ? void 0 : n.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", b = (n == null ? void 0 : n.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", h = l.weight_unit ?? d, g = l.length_unit ?? b, m = l.weight ?? ((v = t.states[A(e, "weight")]) == null ? void 0 : v.state), f = l.height ?? ((D = t.states[A(e, "height")]) == null ? void 0 : D.state), y = l.head_circumference ?? ((E = t.states[A(e, "head_circumference")]) == null ? void 0 : E.state), p = l.weight_percentile ?? ((S = t.states[A(e, "weight_percentile")]) == null ? void 0 : S.state), $ = l.height_percentile ?? ((P = t.states[A(e, "height_percentile")]) == null ? void 0 : P.state), w = l.head_percentile ?? ((q = t.states[A(e, "head_circumference_percentile")]) == null ? void 0 : q.state), x = Pi(s == null ? void 0 : s.timestamp), _ = !!(s && o), u = _ ? () => o(s) : void 0;
  return c`
        <div class="section" role="region" aria-label="Growth">
            <div
                style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"
            >
                <h2 style="margin:0;">Growth</h2>
                <span style="flex:1;"></span>
                ${r ? c`<button
                          type="button"
                          class="primary"
                          aria-label="Log a growth measurement"
                          @click=${r}
                      >
                          Log measurement
                      </button>` : ""}
            </div>
            <div
                class=${_ ? "growth-summary clickable" : "growth-summary"}
                role=${_ ? "button" : "group"}
                tabindex=${_ ? "0" : "-1"}
                aria-label=${_ ? "Edit latest growth measurement" : "Latest growth measurement"}
                @click=${u}
                @keydown=${_ ? (lt) => {
    (lt.key === "Enter" || lt.key === " ") && (lt.preventDefault(), u == null || u());
  } : void 0}
            >
                ${x ? c`<div class="growth-date muted">
                          Measured ${x}
                      </div>` : ""}
                <div class="growth-grid">
                    <div>
                        <div class="label">Weight</div>
                        <div>${zt(m)} ${h} · ${It(p)}</div>
                    </div>
                    <div>
                        <div class="label">Height</div>
                        <div>${zt(f)} ${g} · ${It($)}</div>
                    </div>
                    <div>
                        <div class="label">Head</div>
                        <div>${zt(y)} ${g} · ${It(w)}</div>
                    </div>
                </div>
            </div>
            ${Mi(a)}
        </div>
    `;
}
function Mi(t) {
  return _e(t) === "" ? "" : c`
        <bt-chart-lightbox
            label="Percentile over time"
            .renderChart=${() => _e(t)}
        ></bt-chart-lightbox>
    `;
}
function _e(t) {
  if (!Array.isArray(t) || t.length < 2) return "";
  const e = [...t].filter((_) => Number.isFinite(Date.parse(_ == null ? void 0 : _.timestamp))).sort((_, u) => Date.parse(_.timestamp) - Date.parse(u.timestamp));
  if (e.length < 2) return "";
  const i = Date.parse(e[0].timestamp), n = Date.parse(e[e.length - 1].timestamp), r = Math.max(1, n - i), s = 320, o = 140, a = 22, l = 8, d = 8, b = 20, h = s - a - l, g = o - d - b, m = (_) => a + (_ - i) / r * h, f = (_) => d + (1 - _ / 100) * g, y = me.map((_) => ({
    ..._,
    points: e.map((u) => {
      const v = Ei(u, _.key);
      return v === null ? null : { ts: Date.parse(u.timestamp), p: v };
    }).filter((u) => u !== null)
  }));
  if (y.reduce(
    (_, u) => _ + u.points.length,
    0
  ) < 2) return "";
  const $ = Ut(e[0].timestamp), w = Ut(e[e.length - 1].timestamp), x = [10, 50, 90];
  return c`
        <div class="growth-trend">
            <div class="label-row">
                <div class="label">Percentile over time</div>
                <div class="legend">
                    ${me.map(
    (_) => c`
                            <span class="legend-item">
                                <span
                                    class="swatch"
                                    style=${`background:${_.color}`}
                                ></span>
                                ${_.label}
                            </span>
                        `
  )}
                </div>
            </div>
            <svg
                viewBox="0 0 ${s} ${o}"
                role="img"
                aria-label="Percentile over time"
                style="width:100%;height:${o}px;"
            >
                ${x.map(
    (_) => z`
                        <line
                            x1=${a}
                            x2=${s - l}
                            y1=${f(_)}
                            y2=${f(_)}
                            stroke="var(--divider-color, #888)"
                            stroke-dasharray=${_ === 50 ? "" : "2 2"}
                            stroke-width="1"
                        ></line>
                        <text
                            x=${a - 4}
                            y=${f(_) + 3}
                            font-size="8"
                            text-anchor="end"
                            fill="var(--secondary-text-color)"
                        >
                            p${_}
                        </text>
                    `
  )}
                ${y.map((_) => {
    if (_.points.length === 0) return z``;
    const u = _.points.map(
      (v, D) => `${D === 0 ? "M" : "L"}${m(v.ts).toFixed(1)},${f(v.p).toFixed(1)}`
    ).join(" ");
    return z`
                        ${_.points.length > 1 ? z`<path
                                d=${u}
                                fill="none"
                                stroke=${_.color}
                                stroke-width="1.6"
                                stroke-linejoin="round"
                                stroke-linecap="round"
                              ></path>` : ""}
                        ${_.points.map(
      (v) => z`
                                <circle
                                    cx=${m(v.ts)}
                                    cy=${f(v.p)}
                                    r="2.5"
                                    fill=${_.color}
                                >
                                    <title>${_.label} ${Ut(new Date(v.ts).toISOString())}: p${Math.round(v.p)}</title>
                                </circle>
                            `
    )}
                    `;
  })}
                <text
                    x=${a}
                    y=${o - 4}
                    font-size="9"
                    fill="var(--secondary-text-color)"
                >
                    ${$}
                </text>
                <text
                    x=${s - l}
                    y=${o - 4}
                    font-size="9"
                    text-anchor="end"
                    fill="var(--secondary-text-color)"
                >
                    ${w}
                </text>
            </svg>
        </div>
    `;
}
function Ut(t) {
  if (!t) return "";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "" : new Date(e).toLocaleDateString([], {
    month: "short",
    day: "numeric"
  });
}
function Ie(t, e) {
  return c`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var l;
    const n = /* @__PURE__ */ new Date(), r = new Date(n.getTime() - 90 * 864e5), s = (d) => d.toISOString().slice(0, 10), o = await t.callService(
      "babytracker",
      "export_report",
      { baby: e, format: "html", start: s(r), end: s(n) },
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
function Ti(t, e, i) {
  var n;
  return (n = t == null ? void 0 : t.importer) != null && n.source_entity_id ? c`
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
function Ni(t, e, i) {
  var o, a;
  const n = (o = t.states) == null ? void 0 : o[A(e, "recent_entries")], r = ((a = n == null ? void 0 : n.attributes) == null ? void 0 : a.entries) ?? [], s = mi(r);
  return c`
        <div class="chip" role="listitem">
            ${jt(s.totalVolumeMl)} consumed
        </div>
        <div class="chip" role="listitem">
            ${s.wetDiapers} wet and ${s.dirtyDiapers} dirty
        </div>
        <div class="chip" role="listitem">
            ${T(s.sleepMinutes)} sleep
        </div>
    `;
}
function ye() {
  const t = window;
  return !!(t.SpeechRecognition || t.webkitSpeechRecognition);
}
function Oi(t) {
  var e;
  return !!(t != null && t.connection && typeof navigator < "u" && ((e = navigator.mediaDevices) != null && e.getUserMedia) && window.AudioWorkletNode);
}
async function Ri() {
  const t = window, e = t.SpeechRecognition || t.webkitSpeechRecognition;
  if (!e) throw new Error("SpeechRecognition not supported");
  const i = new e();
  i.continuous = !1, i.interimResults = !1, i.lang = navigator.language || "en-US";
  let n = () => {
  }, r = () => {
  };
  const s = new Promise((a, l) => {
    n = a, r = l;
  });
  let o = !1;
  return i.onresult = (a) => {
    if (o) return;
    o = !0;
    const l = Array.from(a.results).map((d) => {
      var b;
      return ((b = d[0]) == null ? void 0 : b.transcript) ?? "";
    }).join(" ").trim();
    n({ text: l });
  }, i.onerror = (a) => {
    o || (o = !0, r(new Error((a == null ? void 0 : a.error) ?? "speech-recognition error")));
  }, i.onend = () => {
    o || (o = !0, n({ text: "" }));
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
const Li = `
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
async function Hi(t) {
  const e = await navigator.mediaDevices.getUserMedia({ audio: !0 }), i = window.AudioContext || window.webkitAudioContext, n = new i({ sampleRate: 16e3 }), r = URL.createObjectURL(
    new Blob([Li], { type: "text/javascript" })
  );
  try {
    await n.audioWorklet.addModule(r);
  } finally {
    URL.revokeObjectURL(r);
  }
  const s = n.createMediaStreamSource(e), o = new AudioWorkletNode(n, "bt-pcm-worklet");
  s.connect(o);
  let a, l, d = () => {
  }, b = () => {
  };
  const h = new Promise((p, $) => {
    d = p, b = $;
  });
  let g = !1;
  const m = () => {
    try {
      o.port.onmessage = null;
    } catch {
    }
    try {
      o.disconnect();
    } catch {
    }
    try {
      s.disconnect();
    } catch {
    }
    try {
      e.getTracks().forEach((p) => p.stop());
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
  }, f = (p) => {
    g || (g = !0, m(), d({ text: p }));
  }, y = (p) => {
    g || (g = !0, m(), b(p));
  };
  try {
    l = await t.connection.subscribeMessage(
      (p) => {
        var w, x, _, u, v;
        const $ = p == null ? void 0 : p.type;
        if ($ === "run-start")
          a = (x = (w = p == null ? void 0 : p.data) == null ? void 0 : w.runner_data) == null ? void 0 : x.stt_binary_handler_id, o.port.onmessage = (D) => {
            var P;
            if (a == null || g) return;
            const E = new Uint8Array(D.data), S = new Uint8Array(E.length + 1);
            S[0] = a, S.set(E, 1);
            try {
              (P = t.connection.socket) == null || P.send(S);
            } catch {
            }
          };
        else if ($ === "stt-end") {
          const D = ((u = (_ = p == null ? void 0 : p.data) == null ? void 0 : _.stt_output) == null ? void 0 : u.text) ?? "";
          f(D);
        } else $ === "error" && y(
          new Error(
            ((v = p == null ? void 0 : p.data) == null ? void 0 : v.message) ?? "assist_pipeline error"
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
  } catch (p) {
    throw m(), p;
  }
  return {
    stop: async () => {
      var p;
      if (a == null && !g)
        return f(""), h;
      if (a != null && !g)
        try {
          (p = t.connection.socket) == null || p.send(new Uint8Array([a]));
        } catch {
        }
      try {
        o.port.onmessage = null;
      } catch {
      }
      try {
        e.getTracks().forEach(($) => $.stop());
      } catch {
      }
      return h;
    },
    abort: () => {
      g || (g = !0, m(), d({ text: "" }));
    }
  };
}
var zi = Object.defineProperty, Ii = Object.getOwnPropertyDescriptor, Zt = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? Ii(e, i) : e, s = t.length - 1, o; s >= 0; s--)
    (o = t[s]) && (r = (n ? o(e, i, r) : o(r)) || r);
  return n && r && zi(e, i, r), r;
};
let wt = class extends O {
  constructor() {
    super(...arguments), this._state = "idle", this._onClick = async (t) => {
      t.preventDefault(), t.stopPropagation(), this._state === "idle" ? await this._start() : this._state === "listening" && await this._stop();
    };
  }
  get _supported() {
    return ye() || Oi(this.hass);
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
      this._controller = ye() ? await Ri() : await Hi(this.hass);
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
    if (!this._supported) return c``;
    const t = {
      idle: "Voice input",
      listening: "Stop recording",
      transcribing: "Transcribing"
    }, e = {
      idle: "🎤",
      listening: "■",
      transcribing: "…"
    };
    return c`
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
Zt([
  M({ attribute: !1 })
], wt.prototype, "hass", 2);
Zt([
  k()
], wt.prototype, "_state", 2);
wt = Zt([
  G("bt-mic-button")
], wt);
const Ui = 5 * 1024 * 1024, Bi = /* @__PURE__ */ new Set([
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
function Vi(t) {
  return new Promise((e, i) => {
    const n = new FileReader();
    n.onload = () => {
      const r = n.result;
      if (typeof r != "string") {
        i(new W("read_failed", "FileReader returned non-string"));
        return;
      }
      const s = r.indexOf(",");
      e(s >= 0 ? r.slice(s + 1) : r);
    }, n.onerror = () => i(new W("read_failed", "FileReader failed")), n.readAsDataURL(t);
  });
}
async function Fi(t, e) {
  if (e.size > Ui)
    throw new W(
      "too_large",
      `Photo is ${Math.round(e.size / (1024 * 1024))} MB; max is 5 MB`
    );
  const i = (e.type || "").toLowerCase();
  if (!Bi.has(i))
    throw new W(
      "unsupported_mime",
      `Unsupported photo type: ${e.type || "unknown"}`
    );
  const n = await Vi(e);
  try {
    const r = await t.connection.sendMessagePromise({
      type: "babytracker/upload_photo",
      data: n,
      mime: i
    }), s = r == null ? void 0 : r.photo_path;
    if (typeof s != "string" || !s)
      throw new W("bad_response", "upload returned no photo_path");
    return { photo_path: s };
  } catch (r) {
    if (r instanceof W) throw r;
    const s = (r == null ? void 0 : r.code) ?? "upload_failed", o = (r == null ? void 0 : r.message) ?? "upload failed";
    throw new W(s, o);
  }
}
var qi = Object.defineProperty, ji = Object.getOwnPropertyDescriptor, ht = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? ji(e, i) : e, s = t.length - 1, o; s >= 0; s--)
    (o = t[s]) && (r = (n ? o(e, i, r) : o(r)) || r);
  return n && r && qi(e, i, r), r;
};
let Y = class extends O {
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
        const { photo_path: r } = await Fi(this.hass, i);
        this._setValue(r);
      } catch (r) {
        const s = r instanceof W ? r.message : "Photo upload failed";
        this._error = s, console.warn("babytracker: photo upload failed", r);
      } finally {
        this._busy = !1;
      }
    }
  }
  render() {
    return this._supported ? c`
            <div class="row">
                ${this.value ? c`
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
                      ` : c`
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
            ${this._error ? c`<div class="error" role="alert">${this._error}</div>` : ""}
        ` : c``;
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
  k()
], Y.prototype, "_busy", 2);
ht([
  k()
], Y.prototype, "_error", 2);
ht([
  Oe("input[type=file]")
], Y.prototype, "_fileInput", 2);
Y = ht([
  G("bt-photo-button")
], Y);
const Wi = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk",
  "other"
]);
function X(t, e = {}) {
  return c`
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
  return c`
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
const N = (t) => String(t).padStart(2, "0");
function bt() {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${N(t.getMonth() + 1)}-${N(t.getDate())}T${N(t.getHours())}:${N(t.getMinutes())}`;
}
function R(t) {
  if (!t) return;
  const e = Date.parse(t);
  if (!Number.isNaN(e))
    return new Date(e).toISOString();
}
function Bt(t) {
  if (!t) return "";
  const e = Date.parse(t);
  if (Number.isNaN(e)) return "";
  const i = new Date(e);
  return `${i.getFullYear()}-${N(i.getMonth() + 1)}-${N(i.getDate())}T${N(i.getHours())}:${N(i.getMinutes())}`;
}
function Qt() {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${N(t.getMonth() + 1)}-${N(t.getDate())}`;
}
function Ki(t) {
  if (!t) return "";
  const e = Date.parse(t);
  if (Number.isNaN(e)) return "";
  const i = new Date(e);
  return `${i.getFullYear()}-${N(i.getMonth() + 1)}-${N(i.getDate())}`;
}
function Jt(t) {
  if (!t) return;
  const e = Date.parse(`${t}T12:00`);
  if (!Number.isNaN(e))
    return new Date(e).toISOString();
}
function L(t) {
  const e = (i) => {
    var s;
    const r = (s = i.currentTarget.parentElement) == null ? void 0 : s.querySelector(
      "input"
    );
    r && (r.value = bt(), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })));
  };
  return c`
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
function te(t) {
  const e = (i) => {
    var s;
    const r = (s = i.currentTarget.parentElement) == null ? void 0 : s.querySelector(
      "input"
    );
    r && (r.value = Qt(), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })));
  };
  return c`
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
function Yi(t, e, i, n, r, s, o) {
  const a = (i == null ? void 0 : i.volume_unit) ?? r ?? "oz", l = typeof n == "number" && Number.isFinite(n) ? String(n) : "";
  return c`
        <form @submit=${(b) => {
    b.preventDefault();
    const h = b.currentTarget, g = new FormData(h), m = String(g.get("amount") ?? ""), f = m === "" ? void 0 : Number(m), y = R(String(g.get("at") ?? "")), p = String(g.get("unit") ?? a), $ = String(g.get("notes") ?? "") || void 0;
    s("log_feeding", {
      baby: e,
      method: "bottle",
      amount: f,
      unit: p,
      started_at: y,
      ended_at: y,
      notes: $,
      photo_path: Q(h)
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
                <option value="oz" ?selected=${a === "oz"}>oz</option>
                <option value="ml" ?selected=${a === "ml"}>ml</option>
            </select>
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
                <button type="button" @click=${o}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Gi(t, e, i, n, r, s) {
  const o = (l) => {
    l.preventDefault(), r("delete_entry", { entry_id: t });
  }, a = n ? `${i} (${n})` : i;
  return c`
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
                <button type="button" class="primary" @click=${o}>
                    Delete anyway
                </button>
            </div>
        </form>
    `;
}
function Xi(t, e, i, n) {
  return c`
        <form @submit=${(s) => {
    s.preventDefault();
    const o = s.currentTarget, a = new FormData(o, s.submitter ?? void 0);
    i("log_diaper", {
      baby: e,
      kind: String(a.get("kind") ?? "wet"),
      timestamp: R(String(a.get("when") ?? "")),
      notes: String(a.get("notes") ?? "") || void 0,
      photo_path: Q(o)
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
function Zi(t, e, i, n, r) {
  const s = String((e == null ? void 0 : e.type) ?? ""), o = (e == null ? void 0 : e.data) ?? {}, a = s === "feeding" && (o.method === "bottle" || o.method === "solids"), l = s === "vaccine" || s === "growth", d = Wi.has(s) && !a, b = (m) => {
    m.preventDefault();
    const f = m.currentTarget, y = new FormData(f), p = {}, $ = l ? Jt(String(y.get("started") ?? "")) : R(String(y.get("started") ?? ""));
    if ($ && (p.timestamp = $), d) {
      const u = R(String(y.get("ended") ?? ""));
      p.ended_at = u ?? null;
    } else a && $ && (p.ended_at = $);
    const w = String(y.get("notes") ?? "");
    p.notes = w || null;
    const x = {};
    if (s === "diaper")
      x.kind = String(y.get("kind") ?? o.kind ?? "wet");
    else if (s === "feeding" && o.method === "bottle") {
      const u = String(y.get("amount") ?? ""), v = u === "" ? null : Number(u);
      x.amount = v, x.unit = String(y.get("unit") ?? o.unit ?? "oz");
    } else if (s === "other" || s === "medication") {
      const u = String(y.get("name") ?? "");
      u && (x.name = u);
    } else if (s === "growth") {
      const u = (S) => {
        const P = y.get(S);
        if (P === null) return;
        const q = String(P).trim();
        if (q === "") return null;
        const lt = Number(q);
        return Number.isFinite(lt) ? lt : void 0;
      }, v = u("weight"), D = u("height"), E = u("head");
      v !== void 0 && (x.weight = v), D !== void 0 && (x.height = D), E !== void 0 && (x.head_circumference = E), x.weight_unit = String(
        y.get("weight_unit") ?? o.weight_unit ?? "kg"
      ), x.length_unit = String(
        y.get("length_unit") ?? o.length_unit ?? "cm"
      );
    }
    Object.keys(x).length && (p.data = x);
    const _ = Q(f);
    p.photo_path = _ ?? null, i("edit_entry", { entry_id: e.id, fields: p });
  }, h = () => {
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
  }, g = Qi(e);
  return c`
        <form @submit=${b}>
            <h2>${g}</h2>
            ${d ? c`
                      <label for="started">Started</label>
                      ${L({
    id: "started",
    value: Bt(e.timestamp),
    required: !0
  })}
                      <label for="ended"
                          >Ended <span class="muted">(blank = ongoing)</span></label
                      >
                      ${L({
    id: "ended",
    value: Bt(e.ended_at)
  })}
                  ` : l ? c`
                      <label for="started">Date</label>
                      ${te({
    id: "started",
    value: Ki(e.timestamp),
    required: !0
  })}
                  ` : c`
                      <label for="started">Time</label>
                      ${L({
    id: "started",
    value: Bt(e.timestamp),
    required: !0
  })}
                  `}
            ${s === "diaper" ? c`
                      <label for="kind">Kind</label>
                      <select id="kind" name="kind">
                          <option value="wet" ?selected=${o.kind === "wet"}>
                              Wet
                          </option>
                          <option
                              value="dirty"
                              ?selected=${o.kind === "dirty"}
                          >
                              Dirty
                          </option>
                          <option value="both" ?selected=${o.kind === "both"}>
                              Both
                          </option>
                      </select>
                  ` : ""}
            ${s === "feeding" && o.method === "bottle" ? c`
                      <label for="amount">Amount</label>
                      <input
                          id="amount"
                          name="amount"
                          type="number"
                          min="0"
                          step="0.5"
                          inputmode="decimal"
                          .value=${o.amount != null ? String(o.amount) : ""}
                      />
                      <label for="unit">Unit</label>
                      <select id="unit" name="unit">
                          <option value="oz" ?selected=${o.unit === "oz"}>
                              oz
                          </option>
                          <option value="ml" ?selected=${o.unit === "ml"}>
                              ml
                          </option>
                      </select>
                  ` : ""}
            ${s === "other" || s === "medication" ? c`
                      <label for="name">Name</label>
                      <input
                          id="name"
                          name="name"
                          type="text"
                          .value=${String(o.name ?? "")}
                      />
                  ` : ""}
            ${s === "growth" ? c`
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
                                  .value=${o.weight != null ? String(o.weight) : ""}
                              />
                          </div>
                          <div>
                              <label for="weight_unit">Unit</label>
                              <select id="weight_unit" name="weight_unit">
                                  <option
                                      value="kg"
                                      ?selected=${(o.weight_unit ?? "kg") === "kg"}
                                  >
                                      kg
                                  </option>
                                  <option
                                      value="lb"
                                      ?selected=${o.weight_unit === "lb"}
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
                                  .value=${o.height != null ? String(o.height) : ""}
                              />
                          </div>
                          <div>
                              <label for="length_unit">Unit</label>
                              <select id="length_unit" name="length_unit">
                                  <option
                                      value="cm"
                                      ?selected=${(o.length_unit ?? "cm") === "cm"}
                                  >
                                      cm
                                  </option>
                                  <option
                                      value="in"
                                      ?selected=${o.length_unit === "in"}
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
                                  .value=${o.head_circumference != null ? String(o.head_circumference) : ""}
                              />
                              <span class="muted"
                                  >(uses the length unit above)</span
                              >
                          </div>
                      </div>
                  ` : ""}
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
                    @click=${h}
                >
                    Delete
                </button>
                <button type="submit" class="primary">Save</button>
            </div>
        </form>
    `;
}
function Qi(t) {
  const e = String((t == null ? void 0 : t.type) ?? "entry"), i = (t == null ? void 0 : t.data) ?? {}, n = i.name ?? i.method ?? i.kind;
  return n ? `Edit ${e} (${n})` : `Edit ${e}`;
}
function Ji(t, e, i, n, r, s) {
  const o = async () => {
    s(), await n();
  }, a = async () => {
    try {
      await r("end_sleep", { baby: t });
    } catch (d) {
      console.warn("babytracker: end_sleep failed", d);
    }
    s(), await n();
  }, l = Xt(e ?? t);
  return c`
        <form @submit=${(d) => d.preventDefault()}>
            <h2>End sleep first?</h2>
            <p>${l} is asleep. End the sleep session before ${i}?</p>
            <div class="actions">
                <button type="button" @click=${s}>Cancel</button>
                <button type="button" @click=${o}>Skip, just log</button>
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
function tn(t, e, i, n, r) {
  const s = (i == null ? void 0 : i.weight_unit) ?? "kg", o = (i == null ? void 0 : i.length_unit) ?? "cm";
  return c`
        <form @submit=${(l) => {
    l.preventDefault();
    const d = l.currentTarget, b = new FormData(d), h = (g) => {
      const m = String(b.get(g) ?? "").trim();
      if (!m) return;
      const f = Number(m);
      return Number.isFinite(f) ? f : void 0;
    };
    n("log_growth", {
      baby: e,
      weight: h("weight"),
      height: h("height"),
      head_circumference: h("head"),
      weight_unit: String(b.get("weight_unit") ?? s),
      length_unit: String(b.get("length_unit") ?? o),
      timestamp: Jt(String(b.get("when") ?? "")),
      notes: String(b.get("notes") ?? "") || void 0,
      photo_path: Q(d)
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
                        <option value="kg" ?selected=${s === "kg"}>
                            kg
                        </option>
                        <option value="lb" ?selected=${s === "lb"}>
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
                        <option value="cm" ?selected=${o === "cm"}>
                            cm
                        </option>
                        <option value="in" ?selected=${o === "in"}>
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
            <label for="when">Date</label>
            ${te({ id: "when", value: Qt() })}
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
const en = [
  "Bath",
  "Butt wash",
  "Diaper free time",
  "Medication",
  "Vitamin",
  "Burp",
  "Spit up",
  "Throw up"
];
function nn(t, e, i, n) {
  const r = (o) => {
    o.preventDefault();
    const a = o.currentTarget, l = new FormData(a);
    i("log_other", {
      baby: e,
      name: String(l.get("name") ?? ""),
      timestamp: R(String(l.get("started") ?? "")),
      ended_at: R(String(l.get("ended") ?? "")) || void 0,
      notes: String(l.get("notes") ?? "") || void 0,
      photo_path: Q(a)
    });
  }, s = (o, a) => {
    const l = o.currentTarget.form, d = { baby: e, name: a };
    if (l) {
      const b = new FormData(l), h = R(String(b.get("started") ?? "")), g = R(String(b.get("ended") ?? ""));
      h && (d.timestamp = h), g && (d.ended_at = g);
    }
    i("log_other", d);
  };
  return c`
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
                ${en.map(
    (o) => c`
                        <button
                            type="button"
                            class="quick"
                            @click=${(a) => s(a, o)}
                        >
                            ${o}
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
function rn(t, e, i, n, r, s) {
  const o = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: n ? `Log ${n.replace("_", " ")} feeding` : "Log feeding"
  };
  return c`
        <form @submit=${(l) => {
    l.preventDefault();
    const d = l.currentTarget, b = new FormData(d), h = R(String(b.get("started") ?? "")), g = R(String(b.get("ended") ?? "")), m = String(b.get("notes") ?? "") || void 0, f = Q(d);
    if (!g) {
      const $ = {
        baby: e,
        started_at: h,
        photo_path: f
      };
      let w;
      switch (i) {
        case "sleep":
          w = "start_sleep";
          break;
        case "tummy_time":
          w = "start_tummy_time";
          break;
        case "walk":
          w = "start_walk";
          break;
        case "feeding":
          w = "start_feeding", $.method = n;
          break;
      }
      r(w, $);
      return;
    }
    const y = {
      baby: e,
      started_at: h,
      ended_at: g,
      notes: m,
      photo_path: f
    };
    let p;
    switch (i) {
      case "sleep":
        p = "log_sleep";
        break;
      case "tummy_time":
        p = "log_tummy_time";
        break;
      case "walk":
        p = "log_walk";
        break;
      case "feeding":
        p = "log_feeding", y.method = n;
        break;
    }
    r(p, y);
  }}>
            <h2>${o[i]}</h2>
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
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function sn(t, e, i, n) {
  return c`
        <form @submit=${(s) => {
    s.preventDefault();
    const o = s.currentTarget, a = new FormData(o), l = R(String(a.get("when") ?? ""));
    i("log_feeding", {
      baby: e,
      method: "solids",
      started_at: l,
      ended_at: l,
      notes: String(a.get("notes") ?? "") || void 0,
      photo_path: Q(o)
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
const on = [
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
], an = {
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
function ve(t) {
  return an[t] ?? t;
}
function ln(t, e, i, n, r, s, o) {
  const a = [
    "left_thigh",
    "right_thigh",
    "left_arm",
    "right_arm",
    "oral",
    "nasal"
  ], l = (p) => {
    p.preventDefault();
    const $ = p.currentTarget, w = new FormData($), x = String(w.get("vaccine_select") ?? "").trim(), _ = String(w.get("vaccine_custom") ?? "").trim(), u = x === "__other__" ? _ : x;
    if (!u) return;
    const v = String(w.get("dose_number") ?? "").trim(), D = v === "" ? void 0 : Number(v), E = String(w.get("site") ?? "").trim() || void 0, S = String(w.get("lot_number") ?? "").trim() || void 0, P = String(w.get("provider") ?? "").trim() || void 0;
    s("log_vaccine", {
      baby: e,
      name: u,
      dose_number: D,
      site: E,
      lot_number: S,
      provider: P,
      timestamp: Jt(String(w.get("when") ?? "")),
      notes: String(w.get("notes") ?? "") || void 0,
      photo_path: Q($)
    });
  }, d = Array.from(
    new Set(
      [...on, ...r].filter((p) => !!p && p !== "none").map(ve)
    )
  ).sort((p, $) => p.localeCompare($)), b = i && i !== "none" ? ve(i) : "", h = !!b && d.includes(b), g = !!b && !h, m = h ? b : g ? "__other__" : "", f = g ? b : "";
  return c`
        <form @submit=${l}>
            <h2>Log vaccine</h2>
            <label for="vaccine_select">Vaccine</label>
            <select
                id="vaccine_select"
                name="vaccine_select"
                required
                autofocus
                @change=${(p) => {
    var x;
    const $ = p.currentTarget, w = (x = $.closest("form")) == null ? void 0 : x.querySelector("#vaccine_custom");
    w && ($.value === "__other__" ? (w.hidden = !1, w.required = !0, w.focus()) : (w.hidden = !0, w.required = !1, w.value = ""));
  }}
            >
                <option value="" disabled ?selected=${m === ""}>
                    (pick one)
                </option>
                ${d.map(
    (p) => c`<option
                        value=${p}
                        ?selected=${m === p}
                    >
                        ${p}
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
                .value=${f}
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
                .value=${n != null ? String(n) : ""}
            />
            <label for="site">Site</label>
            <select id="site" name="site">
                <option value="">(unspecified)</option>
                ${a.map(
    (p) => c`<option value=${p}>${p.replace("_", " ")}</option>`
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
            ${te({ id: "when", value: Qt() })}
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
function ee(t, e, i, n, r, s, o) {
  let a = C;
  if (e !== null)
    switch (e.kind) {
      case "diaper":
        a = Xi(t, e.baby, n, s);
        break;
      case "bottle":
        a = Yi(
          t,
          e.baby,
          i,
          e.lastAmount,
          e.lastUnit,
          n,
          s
        );
        break;
      case "solids":
        a = sn(t, e.baby, n, s);
        break;
      case "other":
        a = nn(t, e.baby, n, s);
        break;
      case "session":
        a = rn(
          t,
          e.baby,
          e.activity,
          e.method,
          n,
          s
        );
        break;
      case "end_sleep_first":
        a = Ji(
          e.baby,
          e.babyName,
          e.label,
          e.then,
          r,
          s
        );
        break;
      case "confirm_delete_imported":
        a = Gi(
          e.entryId,
          e.entryType,
          e.source,
          e.staff ?? null,
          n,
          s
        );
        break;
      case "edit_entry":
        a = Zi(
          t,
          e.entry,
          n,
          s,
          o
        );
        break;
      case "log_growth":
        a = tn(t, e.baby, i, n, s);
        break;
      case "log_vaccine":
        a = ln(
          t,
          e.baby,
          e.defaultName ?? "",
          e.defaultDose,
          e.scheduleNames ?? [],
          n,
          s
        );
        break;
    }
  return c`
        <dialog @cancel=${s} @close=${s}>${a}</dialog>
    `;
}
function Ue(t, e) {
  return !t.source || t.source === "user" ? (e(t.id), null) : {
    kind: "confirm_delete_imported",
    entryId: t.id,
    entryType: t.type ?? "entry",
    source: t.source,
    staff: t.staff ?? null
  };
}
function Be(t, e) {
  const i = t.querySelector("dialog");
  i && (e && !i.open && i.showModal(), !e && i.open && i.close());
}
const Ve = F`
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
`, Vt = 24 * 60 * 60 * 1e3, $e = 29.5735, we = [
  { key: "bottle", label: "Bottle", color: "var(--primary-color, #4a90e2)" },
  { key: "breast", label: "Breast", color: "var(--success-color, #43a047)" },
  { key: "solids", label: "Solids", color: "var(--warning-color, #f5a623)" }
], xe = [
  { key: "wet", label: "Wet", color: "var(--info-color, #4fc3f7)" },
  { key: "dirty", label: "Dirty", color: "var(--accent-color, #f57c00)" },
  { key: "both", label: "Both", color: "var(--error-color, #d32f2f)" }
];
function cn(t) {
  return {
    label: t,
    sleepMinutes: 0,
    bottleMl: 0,
    feedingByCategory: { bottle: 0, breast: 0, solids: 0 },
    diaperByCategory: { wet: 0, dirty: 0, both: 0 }
  };
}
function dn(t) {
  return t === "bottle" ? "bottle" : t === "breast_left" || t === "breast_right" ? "breast" : t === "solids" ? "solids" : null;
}
function un(t) {
  return t === "wet" || t === "dirty" || t === "both" ? t : null;
}
function pn(t) {
  return {
    feedings: t.feedingByCategory.bottle + t.feedingByCategory.breast + t.feedingByCategory.solids,
    diapers: t.diaperByCategory.wet + t.diaperByCategory.dirty + t.diaperByCategory.both
  };
}
function hn(t, e, i = 7) {
  var y, p, $, w, x, _;
  const n = (y = t == null ? void 0 : t.states) == null ? void 0 : y[A(e, "recent_entries")], r = ((p = n == null ? void 0 : n.attributes) == null ? void 0 : p.entries) ?? [], s = Date.now(), o = new Date(s);
  o.setHours(0, 0, 0, 0);
  const a = [], l = (u) => u.toLocaleDateString([], { weekday: "short" });
  for (let u = i - 1; u >= 0; u--) {
    const v = new Date(o.getTime() - u * Vt);
    a.push(cn(l(v)));
  }
  const d = o.getTime() - (i - 1) * Vt;
  for (const u of r) {
    const v = Date.parse(u == null ? void 0 : u.timestamp);
    if (!Number.isFinite(v)) continue;
    const D = Math.floor((v - d) / Vt);
    if (D < 0 || D >= i) continue;
    const E = a[D];
    if (u.type === "feeding") {
      const S = dn(String((($ = u == null ? void 0 : u.data) == null ? void 0 : $.method) ?? ""));
      S && (E.feedingByCategory[S] += 1);
      const P = Number(((w = u == null ? void 0 : u.data) == null ? void 0 : w.amount) ?? 0), q = String(((x = u == null ? void 0 : u.data) == null ? void 0 : x.unit) ?? "");
      P > 0 && q === "oz" ? E.bottleMl += P * $e : P > 0 && q === "ml" && (E.bottleMl += P);
    } else if (u.type === "diaper") {
      const S = un(String(((_ = u == null ? void 0 : u.data) == null ? void 0 : _.kind) ?? ""));
      S && (E.diaperByCategory[S] += 1);
    } else if (u.type === "sleep") {
      const S = u != null && u.ended_at && u.ended_at !== "" ? Date.parse(u.ended_at) : s;
      Number.isFinite(S) && S > v && (E.sleepMinutes += (S - v) / 6e4);
    }
  }
  const b = a.map(pn);
  if (a.every(
    (u, v) => u.sleepMinutes === 0 && b[v].feedings === 0 && b[v].diapers === 0
  ))
    return "";
  const h = a.map((u) => ({
    label: u.label,
    value: u.sleepMinutes
  })), g = a.map((u) => ({
    label: u.label,
    parts: we.map((v) => ({
      ...v,
      value: u.feedingByCategory[v.key]
    }))
  })), m = a.map((u) => ({
    label: u.label,
    value: u.bottleMl
  })), f = a.map((u) => ({
    label: u.label,
    parts: xe.map((v) => ({
      ...v,
      value: u.diaperByCategory[v.key]
    }))
  }));
  return c`
        <div class="section" role="region" aria-label="Trends">
            <h2>Trends · last ${i} days</h2>
            <bt-chart-lightbox
                label="Sleep (min/day)"
                .renderChart=${() => ke(
    h,
    "Sleep (min/day)",
    (u) => `${Math.round(u)}`
  )}
            ></bt-chart-lightbox>
            <bt-chart-lightbox
                label="Feedings/day"
                .renderChart=${() => Se(
    g,
    "Feedings/day",
    we,
    (u) => `${u}`
  )}
            ></bt-chart-lightbox>
            <bt-chart-lightbox
                label="Bottle (oz/day)"
                .renderChart=${() => ke(
    m,
    "Bottle (oz/day)",
    (u) => (u / $e).toFixed(1)
  )}
            ></bt-chart-lightbox>
            <bt-chart-lightbox
                label="Diapers/day"
                .renderChart=${() => Se(
    f,
    "Diapers/day",
    xe,
    (u) => `${u}`
  )}
            ></bt-chart-lightbox>
        </div>
    `;
}
function ke(t, e, i) {
  const a = Math.max(1, ...t.map((d) => d.value)), l = (320 - 14 * 2) / t.length;
  return c`
        <div class="trend">
            <div class="label">${e}</div>
            <svg
                viewBox="0 0 ${320} ${90}"
                role="img"
                aria-label=${e}
                style="width:100%;height:${90}px;"
            >
                ${t.map((d, b) => {
    const h = 14 + b * l, g = l * 0.7, m = h + (l - g) / 2, f = Math.max(
      d.value > 0 ? 2 : 0,
      d.value / a * (90 - 24 * 2)
    ), y = 66 - f;
    return z`
                        <rect
                            x=${m}
                            y=${y}
                            width=${g}
                            height=${f}
                            fill="var(--primary-color)"
                            rx="2"
                        ></rect>
                        <text
                            x=${m + g / 2}
                            y=${y - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${d.value > 0 ? i(d.value) : ""}
                        </text>
                        <text
                            x=${m + g / 2}
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
function Se(t, e, i, n) {
  const l = t.map((h) => h.parts.reduce((g, m) => g + m.value, 0)), d = Math.max(1, ...l), b = (320 - 14 * 2) / t.length;
  return c`
        <div class="trend">
            <div class="label-row">
                <div class="label">${e}</div>
                <div class="legend">
                    ${i.map(
    (h) => c`
                            <span class="legend-item">
                                <span
                                    class="swatch"
                                    style=${`background:${h.color}`}
                                ></span>
                                ${h.label}
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
                ${t.map((h, g) => {
    const m = 14 + g * b, f = b * 0.7, y = m + (b - f) / 2, p = l[g], $ = Math.max(
      p > 0 ? 2 : 0,
      p / d * (90 - 24 * 2)
    ), w = 66;
    let x = w;
    const _ = h.parts.map((u) => {
      if (u.value <= 0) return z``;
      const v = u.value / p * $;
      return x -= v, z`
                            <rect
                                x=${y}
                                y=${x}
                                width=${f}
                                height=${v}
                                fill=${u.color}
                            >
                                <title>${u.label}: ${u.value}</title>
                            </rect>
                        `;
    });
    return z`
                        ${_}
                        <text
                            x=${y + f / 2}
                            y=${w - $ - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${p > 0 ? n(p) : ""}
                        </text>
                        <text
                            x=${y + f / 2}
                            y=${84}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${h.label}
                        </text>
                    `;
  })}
            </svg>
        </div>
    `;
}
function bn(t) {
  if (!t) return "—";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "—" : new Date(e).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function Ft(t) {
  var n, r;
  const e = String(((n = t == null ? void 0 : t.data) == null ? void 0 : n.name) ?? "vaccine"), i = (r = t == null ? void 0 : t.data) == null ? void 0 : r.dose_number;
  return i != null ? `${e} dose ${i}` : e;
}
function gn(t, e) {
  return !t || t.length === 0 ? "" : c`
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
      return c`<li
                        class=${e ? "clickable" : ""}
                        role=${e ? "button" : "listitem"}
                        tabindex=${e ? "0" : "-1"}
                        aria-label=${e ? `Edit ${Ft(i)}` : Ft(i)}
                        @click=${e ? () => e(i) : void 0}
                        @keydown=${e ? (r) => {
        (r.key === "Enter" || r.key === " ") && (r.preventDefault(), e(i));
      } : void 0}
                    >
                        <span class="vh-date muted"
                            >${bn(i.timestamp)}</span
                        >
                        <span class="vh-name">${Ft(i)}</span>
                        ${(n = i == null ? void 0 : i.data) != null && n.site ? c`<span class="muted">${String(
        i.data.site
      ).replace("_", " ")}</span>` : ""}
                    </li>`;
    }
  )}
            </ul>
        </div>
    `;
}
function fn(t, e, i) {
  var s, o;
  const n = t.states[A(e, "vaccines_due")];
  if (!n || n.state === "unknown") return "";
  const r = ((s = t.states[A(e, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : s.state) === "on";
  return c`
        <div
            class="section chip ${r ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${n.state}</strong>
            ${(o = n.attributes) != null && o.due_on ? c`<span>(${n.attributes.due_on})</span>` : ""}
            ${r ? c`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
            ${i ? c`<span class="spacer"></span>
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
var mn = Object.defineProperty, _n = Object.getOwnPropertyDescriptor, ot = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? _n(e, i) : e, s = t.length - 1, o; s >= 0; s--)
    (o = t[s]) && (r = (n ? o(e, i, r) : o(r)) || r);
  return n && r && mn(e, i, r), r;
};
const yn = ["vaccines", "growth", "trends", "export"];
let B = class extends O {
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
      this._modal = Ue(
        t,
        (e) => this.hass.callService("babytracker", "delete_entry", { entry_id: e })
      );
    }, this._requestLogVaccine = () => {
      var o, a, l, d, b;
      if (!((o = this._config) != null && o.baby)) return;
      const t = (l = (a = this.hass) == null ? void 0 : a.states) == null ? void 0 : l[A(this._config.baby, "vaccines_due")], e = t != null && t.state && t.state !== "none" && t.state !== "unknown" ? String(t.state) : "", i = (d = t == null ? void 0 : t.attributes) == null ? void 0 : d.dose_number, n = typeof i == "number" ? i : void 0, s = (Array.isArray((b = t == null ? void 0 : t.attributes) == null ? void 0 : b.upcoming) ? t.attributes.upcoming : []).map((h) => h && typeof h.name == "string" ? h.name : null).filter((h) => !!h);
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
    (t.has("hass") || t.has("_config")) && this._maybeSubscribe(), t.has("_modal") && Be(this.renderRoot, this._modal);
  }
  _maybeSubscribe() {
    var t, e;
    !this.hass || !this._config || (this._unsubOptions || (this._unsubOptions = Re(
      this.hass,
      (i) => {
        this._options = i;
      }
    )), !this._unsubVaccines && this._sections.includes("vaccines") && ((t = this._config) != null && t.baby) && (this._unsubVaccines = hi(
      this.hass,
      this._config.baby,
      (i) => {
        this._vaccines = Array.isArray(i) ? i : [];
      }
    )), !this._unsubGrowth && this._sections.includes("growth") && ((e = this._config) != null && e.baby) && (this._unsubGrowth = bi(
      this.hass,
      this._config.baby,
      (i) => {
        this._growth = Array.isArray(i) ? i : [];
      }
    )));
  }
  get _sections() {
    var t;
    return ((t = this._config) == null ? void 0 : t.sections) ?? yn;
  }
  render() {
    if (!this.hass || !this._config) return c``;
    const t = this._sections;
    return c`
            <ha-card>
                ${t.includes("vaccines") ? c`
                          ${fn(
      this.hass,
      this._config.baby,
      this._requestLogVaccine
    )}
                          ${gn(
      this._vaccines,
      this._requestEditEntry
    )}
                      ` : ""}
                ${t.includes("growth") ? ze(
      this.hass,
      this._config.baby,
      this._options,
      this._config.units,
      this._requestLogGrowth,
      this._growth[0],
      this._requestEditEntry,
      this._growth
    ) : ""}
                ${t.includes("trends") ? hn(
      this.hass,
      this._config.baby,
      this._config.trend_days ?? 7
    ) : ""}
                ${t.includes("export") ? Ie(this.hass, this._config.baby) : ""}
            </ha-card>
            ${ee(
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
        ${Ve}
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
ot([
  M({ attribute: !1 })
], B.prototype, "hass", 2);
ot([
  k()
], B.prototype, "_config", 2);
ot([
  k()
], B.prototype, "_options", 2);
ot([
  k()
], B.prototype, "_modal", 2);
ot([
  k()
], B.prototype, "_vaccines", 2);
ot([
  k()
], B.prototype, "_growth", 2);
B = ot([
  G("babytracker-summary-card")
], B);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-summary-card",
  name: "babytracker — summary",
  description: "Vaccines, growth, 7-day trend charts, and pediatrician export for one baby."
});
var vn = Object.defineProperty, $n = Object.getOwnPropertyDescriptor, at = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? $n(e, i) : e, s = t.length - 1, o; s >= 0; s--)
    (o = t[s]) && (r = (n ? o(e, i, r) : o(r)) || r);
  return n && r && vn(e, i, r), r;
};
function Ce(t) {
  return String(t).padStart(2, "0");
}
function At(t) {
  return `${t.getFullYear()}-${Ce(t.getMonth() + 1)}-${Ce(t.getDate())}`;
}
function xt(t) {
  const e = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (!e) return null;
  const i = Number(e[1]), n = Number(e[2]) - 1, r = Number(e[3]), s = new Date(i, n, r, 0, 0, 0, 0);
  return Number.isNaN(s.getTime()) ? null : s;
}
function wn(t) {
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
function xn(t, e) {
  const i = xt(t) ?? /* @__PURE__ */ new Date();
  return i.setDate(i.getDate() + e), At(i);
}
function kn(t) {
  const e = xt(t);
  return e ? e.toLocaleDateString([], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : t;
}
let V = class extends O {
  constructor() {
    super(...arguments), this._date = At(/* @__PURE__ */ new Date()), this._entries = [], this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._today = () => {
      this._date = At(/* @__PURE__ */ new Date());
    }, this._onDateChange = (t) => {
      const e = t.currentTarget.value;
      e && xt(e) && (this._date = e);
    }, this._requestEdit = (t) => {
      this._modal = { kind: "edit_entry", entry: t };
    }, this._requestDelete = (t) => {
      this._modal = Ue(
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
    (t.has("hass") || t.has("_config") || t.has("_date")) && this._resubscribe(), t.has("_modal") && Be(this.renderRoot, this._modal);
  }
  _resubscribe() {
    var i, n;
    if (!this.hass || !((i = this._config) != null && i.baby)) return;
    (n = this._unsubEntries) == null || n.call(this);
    const { startIso: t, endIso: e } = wn(this._date);
    this._unsubEntries = pi(
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
    this._date = xn(this._date, t);
  }
  _renderChips(t) {
    const e = [], i = [];
    if (t.wet && i.push(`${t.wet} wet`), t.dirty && i.push(`${t.dirty} dirty`), e.push(c`
            <span class="chip"
                ><span class="chip-label">Diapers</span> ${t.diapers}${i.length > 0 ? c` <span class="chip-detail"
                              >(${i.join(" · ")})</span
                          >` : ""}</span
            >
        `), e.push(c`
            <span class="chip"
                ><span class="chip-label">Sleep</span>
                ${T(t.sleepMinutes)}</span
            >
        `), e.push(c`
            <span class="chip"
                ><span class="chip-label">Longest sleep</span>
                ${T(t.longestSleepMinutes)}</span
            >
        `), t.bottleFeeds > 0 && e.push(c`
                <span class="chip"
                    ><span class="chip-label">Feeds</span>
                    ${t.bottleFeeds}
                    <span class="chip-detail"
                        >· ${jt(t.bottleVolumeMl)}</span
                    ></span
                >
            `), t.nursingMinutes > 0) {
      const n = [];
      t.nursingLeftMinutes > 0 && n.push(`L ${T(t.nursingLeftMinutes)}`), t.nursingRightMinutes > 0 && n.push(`R ${T(t.nursingRightMinutes)}`), e.push(c`
                <span class="chip"
                    ><span class="chip-label">Nursing</span>
                    ${T(t.nursingMinutes)}
                    <span class="chip-detail">(${n.join(" · ")})</span></span
                >
            `);
    }
    return t.pumpingMl > 0 && e.push(c`
                <span class="chip"
                    ><span class="chip-label">Pumping</span>
                    ${jt(t.pumpingMl)}</span
                >
            `), t.solidsCount > 0 && e.push(c`
                <span class="chip"
                    ><span class="chip-label">Solids</span>
                    ${t.solidsCount}</span
                >
            `), t.tummyMinutes > 0 && e.push(c`
                <span class="chip"
                    ><span class="chip-label">Tummy time</span>
                    ${T(t.tummyMinutes)}</span
                >
            `), t.walkCount > 0 && e.push(c`
                <span class="chip"
                    ><span class="chip-label">Walks</span> ${t.walkCount}
                    <span class="chip-detail"
                        >· ${T(t.walkMinutes)}</span
                    ></span
                >
            `), t.medCount > 0 && e.push(c`
                <span class="chip"
                    ><span class="chip-label">Meds</span>
                    ${t.medCount}</span
                >
            `), t.vaccineCount > 0 && e.push(c`
                <span class="chip"
                    ><span class="chip-label">Vaccines</span>
                    ${t.vaccineCount}</span
                >
            `), c`<div class="chips" aria-label="Day summary">
            ${e}
        </div>`;
  }
  render() {
    if (!this.hass || !this._config) return c``;
    const t = this._date === At(/* @__PURE__ */ new Date()), e = _i(this._entries);
    return c`
            <ha-card>
                <h2>History — ${kn(this._date)}</h2>
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
                ${this._entries.length === 0 ? c`<p class="empty">Nothing logged on this day.</p>` : c`
                          ${this._renderChips(e)}
                          <ul class="entries">
                              ${this._entries.map(
      (i) => He(
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
            ${ee(
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
        ${Ve}
    `;
at([
  M({ attribute: !1 })
], V.prototype, "hass", 2);
at([
  k()
], V.prototype, "_config", 2);
at([
  k()
], V.prototype, "_date", 2);
at([
  k()
], V.prototype, "_entries", 2);
at([
  k()
], V.prototype, "_modal", 2);
at([
  k()
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
var Sn = Object.defineProperty, Cn = Object.getOwnPropertyDescriptor, J = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? Cn(e, i) : e, s = t.length - 1, o; s >= 0; s--)
    (o = t[s]) && (r = (n ? o(e, i, r) : o(r)) || r);
  return n && r && Sn(e, i, r), r;
};
const An = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "recent",
  "importer_sync"
];
let H = class extends O {
  constructor() {
    super(...arguments), this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._handleService = async (t, e, i) => {
      const n = i instanceof HTMLElement && i.classList.contains("quick") ? i : null;
      try {
        const r = await di(this.hass, "babytracker", t, e);
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
            const s = this._lastBottle();
            this._modal = {
              kind: "bottle",
              baby: e,
              lastAmount: s == null ? void 0 : s.amount,
              lastUnit: s == null ? void 0 : s.unit
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
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = ui(
      this.hass,
      this._config.baby,
      (t) => {
        this._babyConfig = t;
      }
    )), this._unsubOptions || (this._unsubOptions = Re(
      this.hass,
      (t) => {
        this._options = t;
      }
    )));
  }
  get _sections() {
    var t;
    return ((t = this._config) == null ? void 0 : t.sections) ?? An;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(t, e = "sensor") {
    return A(this._baby(), t, e);
  }
  /** Status chip fragments (no wrapper). Caller wraps these together
   *  with the 24 h chips inside a single `.chips` flex row so the two
   *  groups flow continuously instead of breaking onto separate
   *  lines.
   */
  _renderStatusChips() {
    var l, d, b, h, g, m, f, y, p, $, w, x, _;
    const t = this.hass, e = (d = (l = t.states) == null ? void 0 : l[this._entityId("last_feeding")]) == null ? void 0 : d.state, i = (h = (b = t.states) == null ? void 0 : b[this._entityId("last_diaper")]) == null ? void 0 : h.state, n = ((m = (g = t.states) == null ? void 0 : g[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : m.state) === "on", r = ((y = (f = t.states) == null ? void 0 : f[this._entityId("walking", "binary_sensor")]) == null ? void 0 : y.state) === "on", s = (($ = (p = t.states) == null ? void 0 : p[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : $.state) === "on", o = ((_ = (x = (w = t.states) == null ? void 0 : w[this._entityId("recent_entries")]) == null ? void 0 : x.attributes) == null ? void 0 : _.entries) ?? [], a = n ? null : yi(o);
    return c`
            <div class="chip" role="listitem">
                Last feed: ${this._timeSince(e)}
            </div>
            <div class="chip" role="listitem">
                Last diaper: ${this._timeSince(i)}
            </div>
            ${a !== null ? c`<div class="chip" role="listitem">
                      Awake for: ${T(a)}
                  </div>` : ""}
            ${n ? c`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
            ${r ? c`<div class="chip warning" role="listitem">On a walk</div>` : ""}
            ${s ? c`<div class="chip warning" role="listitem">At daycare</div>` : ""}
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
    var i, n, r, s, o, a, l;
    const t = (n = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : n[this._entityId("recent_entries")], e = ((r = t == null ? void 0 : t.attributes) == null ? void 0 : r.entries) ?? [];
    for (const d of e)
      if ((d == null ? void 0 : d.type) === "feeding" && ((s = d == null ? void 0 : d.data) == null ? void 0 : s.method) === "bottle" && typeof ((o = d == null ? void 0 : d.data) == null ? void 0 : o.amount) == "number" && (((a = d == null ? void 0 : d.data) == null ? void 0 : a.unit) === "ml" || ((l = d == null ? void 0 : d.data) == null ? void 0 : l.unit) === "oz"))
        return { amount: d.data.amount, unit: d.data.unit };
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
    if (!this.hass || !this._config) return c``;
    const t = this._sections, e = t.includes("status"), i = t.includes("today");
    return c`
            <ha-card>
                <h2>${Xt(((n = this._babyConfig) == null ? void 0 : n.name) ?? this._baby())}</h2>
                ${e || i ? c`<div
                          class="chips"
                          role="list"
                          aria-label="Status and last 24 hours"
                      >
                          ${e ? this._renderStatusChips() : ""}
                          ${i ? Ni(
      this.hass,
      this._baby(),
      this._babyConfig
    ) : ""}
                      </div>` : ""}
                ${t.includes("active_session") ? $i(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${t.includes("quick_log") ? gi(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${t.includes("growth") ? ze(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${t.includes("recent") ? Ci(
      this.hass,
      this._baby(),
      this._requestEdit,
      this._config.recent_limit ?? 50,
      this._expandedNotes,
      this._toggleNotes
    ) : ""}
                ${t.includes("importer_sync") ? Ti(
      this._babyConfig,
      this._baby(),
      this._handleService
    ) : ""}
                ${t.includes("export") ? Ie(this.hass, this._baby()) : ""}
            </ha-card>
            ${ee(
      this.hass,
      this._modal,
      this._options,
      this._submitModal,
      (r, s) => this._handleService(r, s),
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
  k()
], H.prototype, "_config", 2);
J([
  k()
], H.prototype, "_babyConfig", 2);
J([
  k()
], H.prototype, "_options", 2);
J([
  k()
], H.prototype, "_modal", 2);
J([
  k()
], H.prototype, "_expandedNotes", 2);
J([
  Oe("dialog")
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
Promise.resolve().then(() => Pn);
var Dn = Object.defineProperty, En = Object.getOwnPropertyDescriptor, ie = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? En(e, i) : e, s = t.length - 1, o; s >= 0; s--)
    (o = t[s]) && (r = (n ? o(e, i, r) : o(r)) || r);
  return n && r && Dn(e, i, r), r;
};
let rt = class extends O {
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
    return c`
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
ie([
  M({ attribute: !1 })
], rt.prototype, "hass", 2);
ie([
  M({ attribute: !1 })
], rt.prototype, "_config", 2);
rt = ie([
  G("babytracker-card-editor")
], rt);
rt.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const Pn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return rt;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  H as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
