/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const _t = globalThis, Mt = _t.ShadowRoot && (_t.ShadyCSS === void 0 || _t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ot = Symbol(), Ft = /* @__PURE__ */ new WeakMap();
let ue = class {
  constructor(t, i, r) {
    if (this._$cssResult$ = !0, r !== Ot) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (Mt && t === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (t = Ft.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && Ft.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Se = (e) => new ue(typeof e == "string" ? e : e + "", void 0, Ot), Z = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((r, n, o) => r + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[o + 1], e[0]);
  return new ue(i, e, Ot);
}, Ae = (e, t) => {
  if (Mt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const r = document.createElement("style"), n = _t.litNonce;
    n !== void 0 && r.setAttribute("nonce", n), r.textContent = i.cssText, e.appendChild(r);
  }
}, jt = Mt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const r of t.cssRules) i += r.cssText;
  return Se(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ce, defineProperty: Ee, getOwnPropertyDescriptor: Pe, getOwnPropertyNames: De, getOwnPropertySymbols: Te, getPrototypeOf: Ne } = Object, U = globalThis, qt = U.trustedTypes, Me = qt ? qt.emptyScript : "", kt = U.reactiveElementPolyfillSupport, ct = (e, t) => e, $t = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Me : null;
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
} }, Rt = (e, t) => !Ce(e, t), Wt = { attribute: !0, type: String, converter: $t, reflect: !1, useDefault: !1, hasChanged: Rt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), U.litPropertyMetadata ?? (U.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let rt = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = Wt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const r = Symbol(), n = this.getPropertyDescriptor(t, r, i);
      n !== void 0 && Ee(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, i, r) {
    const { get: n, set: o } = Pe(this.prototype, t) ?? { get() {
      return this[i];
    }, set(s) {
      this[i] = s;
    } };
    return { get: n, set(s) {
      const a = n == null ? void 0 : n.call(this);
      o == null || o.call(this, s), this.requestUpdate(t, a, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Wt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ct("elementProperties"))) return;
    const t = Ne(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ct("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ct("properties"))) {
      const i = this.properties, r = [...De(i), ...Te(i)];
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
      for (const n of r) i.unshift(jt(n));
    } else t !== void 0 && i.push(jt(t));
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
    return Ae(t, this.constructor.elementStyles), t;
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
    var o;
    const r = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, r);
    if (n !== void 0 && r.reflect === !0) {
      const s = (((o = r.converter) == null ? void 0 : o.toAttribute) !== void 0 ? r.converter : $t).toAttribute(i, r.type);
      this._$Em = t, s == null ? this.removeAttribute(n) : this.setAttribute(n, s), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var o, s;
    const r = this.constructor, n = r._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const a = r.getPropertyOptions(n), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : $t;
      this._$Em = n;
      const c = l.fromAttribute(i, a.type);
      this[n] = c ?? ((s = this._$Ej) == null ? void 0 : s.get(n)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, i, r, n = !1, o) {
    var s;
    if (t !== void 0) {
      const a = this.constructor;
      if (n === !1 && (o = this[t]), r ?? (r = a.getPropertyOptions(t)), !((r.hasChanged ?? Rt)(o, i) || r.useDefault && r.reflect && o === ((s = this._$Ej) == null ? void 0 : s.get(t)) && !this.hasAttribute(a._$Eu(t, r)))) return;
      this.C(t, i, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: r, reflect: n, wrapped: o }, s) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, s ?? i ?? this[t]), o !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (i = void 0), this._$AL.set(t, i)), n === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [o, s] of this._$Ep) this[o] = s;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [o, s] of n) {
        const { wrapped: a } = s, l = this[o];
        a !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, s, l);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (r = this._$EO) == null || r.forEach((n) => {
        var o;
        return (o = n.hostUpdate) == null ? void 0 : o.call(n);
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
rt.elementStyles = [], rt.shadowRootOptions = { mode: "open" }, rt[ct("elementProperties")] = /* @__PURE__ */ new Map(), rt[ct("finalized")] = /* @__PURE__ */ new Map(), kt == null || kt({ ReactiveElement: rt }), (U.reactiveElementVersions ?? (U.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt = globalThis, Yt = (e) => e, wt = dt.trustedTypes, Gt = wt ? wt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, pe = "$lit$", H = `lit$${Math.random().toFixed(9).slice(2)}$`, he = "?" + H, Oe = `<${he}>`, K = document, ut = () => K.createComment(""), pt = (e) => e === null || typeof e != "object" && typeof e != "function", Lt = Array.isArray, Re = (e) => Lt(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", St = `[ 	
\f\r]`, lt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Kt = /-->/g, Xt = />/g, W = RegExp(`>|${St}(?:([^\\s"'>=/]+)(${St}*=${St}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Zt = /'/g, Jt = /"/g, be = /^(?:script|style|textarea|title)$/i, me = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), d = me(1), yt = me(2), ot = Symbol.for("lit-noChange"), S = Symbol.for("lit-nothing"), Qt = /* @__PURE__ */ new WeakMap(), Y = K.createTreeWalker(K, 129);
function ge(e, t) {
  if (!Lt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Gt !== void 0 ? Gt.createHTML(t) : t;
}
const Le = (e, t) => {
  const i = e.length - 1, r = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = lt;
  for (let a = 0; a < i; a++) {
    const l = e[a];
    let c, b, p = -1, m = 0;
    for (; m < l.length && (s.lastIndex = m, b = s.exec(l), b !== null); ) m = s.lastIndex, s === lt ? b[1] === "!--" ? s = Kt : b[1] !== void 0 ? s = Xt : b[2] !== void 0 ? (be.test(b[2]) && (n = RegExp("</" + b[2], "g")), s = W) : b[3] !== void 0 && (s = W) : s === W ? b[0] === ">" ? (s = n ?? lt, p = -1) : b[1] === void 0 ? p = -2 : (p = s.lastIndex - b[2].length, c = b[1], s = b[3] === void 0 ? W : b[3] === '"' ? Jt : Zt) : s === Jt || s === Zt ? s = W : s === Kt || s === Xt ? s = lt : (s = W, n = void 0);
    const f = s === W && e[a + 1].startsWith("/>") ? " " : "";
    o += s === lt ? l + Oe : p >= 0 ? (r.push(c), l.slice(0, p) + pe + l.slice(p) + H + f) : l + H + (p === -2 ? a : f);
  }
  return [ge(e, o + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class ht {
  constructor({ strings: t, _$litType$: i }, r) {
    let n;
    this.parts = [];
    let o = 0, s = 0;
    const a = t.length - 1, l = this.parts, [c, b] = Le(t, i);
    if (this.el = ht.createElement(c, r), Y.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = Y.nextNode()) !== null && l.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(pe)) {
          const m = b[s++], f = n.getAttribute(p).split(H), g = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: o, name: g[2], strings: f, ctor: g[1] === "." ? Ie : g[1] === "?" ? Ue : g[1] === "@" ? ze : xt }), n.removeAttribute(p);
        } else p.startsWith(H) && (l.push({ type: 6, index: o }), n.removeAttribute(p));
        if (be.test(n.tagName)) {
          const p = n.textContent.split(H), m = p.length - 1;
          if (m > 0) {
            n.textContent = wt ? wt.emptyScript : "";
            for (let f = 0; f < m; f++) n.append(p[f], ut()), Y.nextNode(), l.push({ type: 2, index: ++o });
            n.append(p[m], ut());
          }
        }
      } else if (n.nodeType === 8) if (n.data === he) l.push({ type: 2, index: o });
      else {
        let p = -1;
        for (; (p = n.data.indexOf(H, p + 1)) !== -1; ) l.push({ type: 7, index: o }), p += H.length - 1;
      }
      o++;
    }
  }
  static createElement(t, i) {
    const r = K.createElement("template");
    return r.innerHTML = t, r;
  }
}
function st(e, t, i = e, r) {
  var s, a;
  if (t === ot) return t;
  let n = r !== void 0 ? (s = i._$Co) == null ? void 0 : s[r] : i._$Cl;
  const o = pt(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== o && ((a = n == null ? void 0 : n._$AO) == null || a.call(n, !1), o === void 0 ? n = void 0 : (n = new o(e), n._$AT(e, i, r)), r !== void 0 ? (i._$Co ?? (i._$Co = []))[r] = n : i._$Cl = n), n !== void 0 && (t = st(e, n._$AS(e, t.values), n, r)), t;
}
class He {
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
    const { el: { content: i }, parts: r } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? K).importNode(i, !0);
    Y.currentNode = n;
    let o = Y.nextNode(), s = 0, a = 0, l = r[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let c;
        l.type === 2 ? c = new gt(o, o.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (c = new Be(o, this, t)), this._$AV.push(c), l = r[++a];
      }
      s !== (l == null ? void 0 : l.index) && (o = Y.nextNode(), s++);
    }
    return Y.currentNode = K, n;
  }
  p(t) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, i), i += r.strings.length - 2) : r._$AI(t[i])), i++;
  }
}
class gt {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, r, n) {
    this.type = 2, this._$AH = S, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = r, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
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
    t = st(this, t, i), pt(t) ? t === S || t == null || t === "" ? (this._$AH !== S && this._$AR(), this._$AH = S) : t !== this._$AH && t !== ot && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Re(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== S && pt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(K.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: i, _$litType$: r } = t, n = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = ht.createElement(ge(r.h, r.h[0]), this.options)), r);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === n) this._$AH.p(i);
    else {
      const s = new He(n, this), a = s.u(this.options);
      s.p(i), this.T(a), this._$AH = s;
    }
  }
  _$AC(t) {
    let i = Qt.get(t.strings);
    return i === void 0 && Qt.set(t.strings, i = new ht(t)), i;
  }
  k(t) {
    Lt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, n = 0;
    for (const o of t) n === i.length ? i.push(r = new gt(this.O(ut()), this.O(ut()), this, this.options)) : r = i[n], r._$AI(o), n++;
    n < i.length && (this._$AR(r && r._$AB.nextSibling, n), i.length = n);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, i); t !== this._$AB; ) {
      const n = Yt(t).nextSibling;
      Yt(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class xt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, r, n, o) {
    this.type = 1, this._$AH = S, this._$AN = void 0, this.element = t, this.name = i, this._$AM = n, this.options = o, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = S;
  }
  _$AI(t, i = this, r, n) {
    const o = this.strings;
    let s = !1;
    if (o === void 0) t = st(this, t, i, 0), s = !pt(t) || t !== this._$AH && t !== ot, s && (this._$AH = t);
    else {
      const a = t;
      let l, c;
      for (t = o[0], l = 0; l < o.length - 1; l++) c = st(this, a[r + l], i, l), c === ot && (c = this._$AH[l]), s || (s = !pt(c) || c !== this._$AH[l]), c === S ? t = S : t !== S && (t += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    s && !n && this.j(t);
  }
  j(t) {
    t === S ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ie extends xt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === S ? void 0 : t;
  }
}
class Ue extends xt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== S);
  }
}
class ze extends xt {
  constructor(t, i, r, n, o) {
    super(t, i, r, n, o), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = st(this, t, i, 0) ?? S) === ot) return;
    const r = this._$AH, n = t === S && r !== S || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, o = t !== S && (r === S || n);
    n && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Be {
  constructor(t, i, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    st(this, t);
  }
}
const At = dt.litHtmlPolyfillSupport;
At == null || At(ht, gt), (dt.litHtmlVersions ?? (dt.litHtmlVersions = [])).push("3.3.3");
const Ve = (e, t, i) => {
  const r = (i == null ? void 0 : i.renderBefore) ?? t;
  let n = r._$litPart$;
  if (n === void 0) {
    const o = (i == null ? void 0 : i.renderBefore) ?? null;
    r._$litPart$ = n = new gt(t.insertBefore(ut(), o), o, void 0, i ?? {});
  }
  return n._$AI(e), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis;
class P extends rt {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ve(i, this.renderRoot, this.renderOptions);
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
    return ot;
  }
}
var de;
P._$litElement$ = !0, P.finalized = !0, (de = G.litElementHydrateSupport) == null || de.call(G, { LitElement: P });
const Ct = G.litElementPolyfillSupport;
Ct == null || Ct({ LitElement: P });
(G.litElementVersions ?? (G.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = { attribute: !0, type: String, converter: $t, reflect: !1, hasChanged: Rt }, je = (e = Fe, t, i) => {
  const { kind: r, metadata: n } = i;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(i.name, e), r === "accessor") {
    const { name: s } = i;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(s, l, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(s, void 0, e, a), a;
    } };
  }
  if (r === "setter") {
    const { name: s } = i;
    return function(a) {
      const l = this[s];
      t.call(this, a), this.requestUpdate(s, l, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function E(e) {
  return (t, i) => typeof i == "object" ? je(e, t, i) : ((r, n, o) => {
    const s = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, r), s ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function x(e) {
  return E({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const qe = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function fe(e, t) {
  return (i, r, n) => {
    const o = (s) => {
      var a;
      return ((a = s.renderRoot) == null ? void 0 : a.querySelector(e)) ?? null;
    };
    return qe(i, r, { get() {
      return o(this);
    } });
  };
}
function A(e, t, i = "sensor") {
  return `${i}.babytracker_${e}_${t}`;
}
function Ht(e) {
  return typeof e != "string" || e.length === 0 ? "" : e.charAt(0).toUpperCase() + e.slice(1);
}
async function We(e, t, i, r) {
  return e.callService(t, i, r);
}
function Ye(e, t, i) {
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
function _e(e, t) {
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
function Ge(e, t, i, r, n) {
  const o = {};
  return (async () => {
    try {
      const s = await e.connection.subscribeMessage(
        n,
        {
          type: "babytracker/list_entries_in_range",
          baby: t,
          start: i,
          end: r,
          subscribe: !0
        }
      );
      o.current = s;
    } catch (s) {
      console.warn(
        "babytracker: subscribeEntriesInRange failed",
        s
      );
    }
  })(), () => {
    var s;
    return (s = o.current) == null ? void 0 : s.call(o);
  };
}
function Ke(e, t, i) {
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
function Xe(e, t, i) {
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
const Ze = [
  "feeding",
  "sleep",
  "tummy_time",
  "diaper",
  "growth",
  "medication",
  "vaccine",
  "walk",
  "other"
], Je = ["bottle", "breast_left", "breast_right", "solids"];
function Qe(e, t, i, r) {
  const n = (e == null ? void 0 : e.enabled_activities) ?? Ze, o = (e == null ? void 0 : e.enabled_feeding_methods) ?? Je, s = (c) => c.charAt(0).toUpperCase() + c.slice(1), a = Ht((e == null ? void 0 : e.name) ?? t), l = [];
  if (n.includes("diaper") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log diaper for ${a}"
                    @click=${() => r("diaper")}
                >
                    Diaper
                </button>
            `
  ), n.includes("feeding"))
    for (const c of o)
      c === "bottle" ? l.push(
        d`
                        <button
                            class="quick"
                            aria-label="Log bottle feeding for ${a}"
                            @click=${() => r("bottle")}
                        >
                            Bottle
                        </button>
                    `
      ) : c === "solids" ? l.push(
        d`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${a}"
                            @click=${() => r("solids")}
                        >
                            Solids
                        </button>
                    `
      ) : (c === "breast_left" || c === "breast_right") && l.push(
        d`
                        <button
                            class="quick"
                            aria-label="Log ${c} feeding for ${a}"
                            @click=${() => r({ activity: "feeding", method: c })}
                        >
                            ${s(c.replace("_", " "))}
                        </button>
                    `
      );
  return n.includes("sleep") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log sleep for ${a}"
                    @click=${() => r({ activity: "sleep" })}
                >
                    Sleep
                </button>
            `
  ), n.includes("tummy_time") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log tummy time for ${a}"
                    @click=${() => r({ activity: "tummy_time" })}
                >
                    Tummy time
                </button>
            `
  ), n.includes("walk") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log walk for ${a}"
                    @click=${() => r({ activity: "walk" })}
                >
                    Walk
                </button>
            `
  ), n.includes("other") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log other activity for ${a}"
                    @click=${() => r("other")}
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
function ti(e, t, i) {
  var l, c, b, p, m, f;
  const r = ((l = e.states[A(t, "sleeping", "binary_sensor")]) == null ? void 0 : l.state) === "on", n = ((c = e.states[A(t, "feeding", "binary_sensor")]) == null ? void 0 : c.state) === "on", o = ((b = e.states[A(t, "tummy_time", "binary_sensor")]) == null ? void 0 : b.state) === "on", s = ((p = e.states[A(t, "walking", "binary_sensor")]) == null ? void 0 : p.state) === "on";
  if (!r && !n && !o && !s) return "";
  const a = [];
  if (r) {
    const g = (m = e.states[A(t, "last_sleep_start")]) == null ? void 0 : m.state;
    a.push(
      d`
                <div class="chip warning" role="status">
                    Sleeping ${g ? d`· started ${te(g)}` : ""}
                    <button
                        aria-label="End sleep"
                        @click=${(y) => i("end_sleep", { baby: t }, y.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  if (n && a.push(
    d`
                <div class="chip warning" role="status">
                    Feeding
                    <button
                        aria-label="End feeding"
                        @click=${(g) => i("end_feeding", { baby: t }, g.currentTarget)}
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
                        @click=${(g) => i("end_tummy_time", { baby: t }, g.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), s) {
    const g = (f = e.states[A(t, "last_walk_start")]) == null ? void 0 : f.state;
    a.push(
      d`
                <div class="chip warning" role="status">
                    Walking ${g ? d`· started ${te(g)}` : ""}
                    <button
                        aria-label="End walk"
                        @click=${(y) => i("end_walk", { baby: t }, y.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  return d`<div class="section">${a}</div>`;
}
function te(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const ye = 29.5735, ve = 24 * 60 * 60 * 1e3;
function nt(e) {
  if (!e) return 0;
  const t = Date.parse(e);
  return Number.isNaN(t) ? 0 : t;
}
function ei(e, t = ve, i = Date.now()) {
  const r = i - t;
  return e.filter((n) => nt(n.timestamp) >= r).slice().sort((n, o) => nt(o.timestamp) - nt(n.timestamp));
}
function ii(e, t = Date.now(), i = ve) {
  var c, b, p;
  const r = t - i;
  let n = 0, o = 0, s = 0, a = 0, l = 0;
  for (const m of e) {
    const f = nt(m.timestamp);
    if (m.type === "sleep") {
      const g = f, y = m.ended_at != null && m.ended_at !== "" ? nt(m.ended_at) : t;
      if (g > 0 && y > g && y > r) {
        const h = Math.max(g, r), u = Math.min(y, t);
        u > h && (l += (u - h) / 6e4);
      }
      continue;
    }
    if (!(f < r)) {
      if (m.type === "feeding") {
        n += 1;
        const g = Number(((c = m.data) == null ? void 0 : c.amount) ?? 0), y = String(((b = m.data) == null ? void 0 : b.unit) ?? "");
        g > 0 && (a += y === "oz" ? g * ye : g);
      } else if (m.type === "diaper") {
        const g = String(((p = m.data) == null ? void 0 : p.kind) ?? "");
        g === "wet" ? o += 1 : g === "dirty" ? s += 1 : g === "both" && (o += 1, s += 1);
      }
    }
  }
  return { feedings: n, wetDiapers: o, dirtyDiapers: s, totalVolumeMl: a, sleepMinutes: l };
}
function ri(e) {
  if (!Number.isFinite(e) || e <= 0) return "0m";
  if (e < 60) return `${Math.round(e)}m`;
  const t = Math.floor(e / 60), i = Math.round(e % 60);
  return i === 0 ? `${t}h` : `${t}h ${i}m`;
}
function ni(e) {
  if (!Number.isFinite(e) || e <= 0) return "0 oz";
  const t = e / ye;
  return t >= 1 ? `${t.toFixed(1)} oz` : `${Math.round(e)} ml`;
}
function ee(e) {
  const t = nt(e);
  return t === 0 ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
var oi = Object.defineProperty, si = Object.getOwnPropertyDescriptor, Q = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? si(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && oi(t, i, n), n;
};
let O = class extends P {
  constructor() {
    super(...arguments), this.photoPath = "", this.size = 128, this._url = "", this._failed = !1, this._open = !1, this._lastResolved = "", this._resolveToken = 0, this._onKeydown = (e) => {
      e.key === "Escape" && (e.preventDefault(), this._close_lightbox());
    }, this._open_lightbox = (e) => {
      e.preventDefault(), e.stopPropagation(), !(!this._url || this._open) && (this._open = !0, this._attachKeyHandler());
    }, this._close_lightbox = (e) => {
      e && (e.preventDefault(), e.stopPropagation()), this._open && (this._open = !1, this._detachKeyHandler());
    }, this._onImgError = () => {
      console.warn(
        "babytracker: thumbnail img failed to load",
        this.photoPath,
        this._url
      ), this._failed = !0;
    };
  }
  updated(e) {
    (e.has("hass") || e.has("photoPath")) && this._maybeResolve();
  }
  disconnectedCallback() {
    this._detachKeyHandler(), super.disconnectedCallback();
  }
  async _maybeResolve() {
    var t;
    if (!((t = this.hass) != null && t.connection) || !this.photoPath || this._lastResolved === this.photoPath && this._url) return;
    this._lastResolved = this.photoPath;
    const e = ++this._resolveToken;
    try {
      const i = await this.hass.callWS({
        type: "media_source/resolve_media",
        media_content_id: this.photoPath
      });
      if (e !== this._resolveToken) return;
      const r = i == null ? void 0 : i.url;
      typeof r == "string" && r.length > 0 ? (this._url = r, this._failed = !1) : (console.warn(
        "babytracker: resolve photo returned no url",
        this.photoPath,
        i
      ), this._failed = !0);
    } catch (i) {
      if (e !== this._resolveToken) return;
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
    const e = `${this.size}px`;
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
                    style="width:${e};height:${e}"
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
                              @click=${(t) => t.stopPropagation()}
                          />
                      </div>
                  ` : ""}
        `;
  }
};
O.styles = Z`
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
            /* Width/height come from an inline style attribute so each
             * instance can pick its own size without a CSS variable. */
            object-fit: cover;
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
Q([
  E({ attribute: !1 })
], O.prototype, "hass", 2);
Q([
  E()
], O.prototype, "photoPath", 2);
Q([
  E({ type: Number })
], O.prototype, "size", 2);
Q([
  x()
], O.prototype, "_url", 2);
Q([
  x()
], O.prototype, "_failed", 2);
Q([
  x()
], O.prototype, "_open", 2);
O = Q([
  J("bt-entry-thumbnail")
], O);
const ai = /* @__PURE__ */ new Set(["sleep", "feeding", "tummy_time", "walk"]);
function $e(e, t, i, r, n) {
  return d`
        <li
            class="clickable"
            role="button"
            tabindex="0"
            aria-label="Edit entry"
            @click=${() => i(t)}
            @keydown=${(o) => {
    (o.key === "Enter" || o.key === " ") && (o.preventDefault(), i(t));
  }}
        >
            <div class="entry-row">
                <span aria-label="Entry type">${ci(t)}</span>
                ${li(t)}
                ${t.photo_path ? d`<bt-entry-thumbnail
                          .hass=${e}
                          .photoPath=${t.photo_path}
                      ></bt-entry-thumbnail>` : ""}
                ${t.staff ? d`<span
                          class="muted"
                          aria-label="Logged by Procare staff"
                          >via ${t.staff}</span
                      >` : ""}
            </div>
            ${t.notes ? d`<div
                      class="entry-notes muted ${r.has(t.id) ? "expanded" : ""}"
                      role="button"
                      tabindex="0"
                      aria-label="Toggle notes"
                      aria-expanded=${r.has(t.id) ? "true" : "false"}
                      title=${t.notes}
                      @click=${(o) => {
    o.stopPropagation(), n(t.id);
  }}
                      @keydown=${(o) => {
    (o.key === "Enter" || o.key === " ") && (o.preventDefault(), o.stopPropagation(), n(t.id));
  }}
                  >${t.notes}</div>` : ""}
        </li>
    `;
}
function li(e) {
  const t = ee(e.timestamp);
  return ai.has(String(e.type ?? "")) && e.ended_at && e.ended_at !== e.timestamp ? d`<span class="muted"
            >${t} – ${ee(e.ended_at)}</span
        >` : d`<span class="muted">${t}</span>`;
}
function ci(e) {
  const t = String(e.type ?? ""), i = (e == null ? void 0 : e.data) ?? {}, r = i.name ?? i.method ?? i.kind;
  return r ? t === "feeding" && i.amount != null && i.amount !== "" && i.unit ? `${t} (${r}, ${i.amount} ${i.unit})` : `${t} (${r})` : t;
}
function di(e, t, i, r, n = /* @__PURE__ */ new Set(), o = () => {
}) {
  var c;
  const s = e.states[A(t, "recent_entries")], a = ((c = s == null ? void 0 : s.attributes) == null ? void 0 : c.entries) ?? [], l = ei(a).slice(0, Math.min(r, 120));
  return d`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${l.length === 0 ? d`<p>Nothing logged yet.</p>` : d`
                      <ul class="entries">
                          ${l.map(
    (b) => $e(
      e,
      b,
      i,
      n,
      o
    )
  )}
                      </ul>
                  `}
        </div>
    `;
}
function Et(e) {
  if (e == null) return "—";
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? String(Math.round(t * 100) / 100) : String(e);
}
function Pt(e) {
  if (e == null || e === "—") return "—";
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? `p${Math.round(t)}` : String(e);
}
function ui(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function we(e, t, i, r, n, o, s) {
  var v, w, C, D, T, N;
  const a = (o == null ? void 0 : o.data) ?? {}, l = (r == null ? void 0 : r.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", c = (r == null ? void 0 : r.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", b = a.weight_unit ?? l, p = a.length_unit ?? c, m = a.weight ?? ((v = e.states[A(t, "weight")]) == null ? void 0 : v.state), f = a.height ?? ((w = e.states[A(t, "height")]) == null ? void 0 : w.state), g = a.head_circumference ?? ((C = e.states[A(t, "head_circumference")]) == null ? void 0 : C.state), y = a.weight_percentile ?? ((D = e.states[A(t, "weight_percentile")]) == null ? void 0 : D.state), h = a.height_percentile ?? ((T = e.states[A(t, "height_percentile")]) == null ? void 0 : T.state), u = a.head_percentile ?? ((N = e.states[A(t, "head_circumference_percentile")]) == null ? void 0 : N.state), _ = ui(o == null ? void 0 : o.timestamp), $ = !!(o && s), k = $ ? () => s(o) : void 0;
  return d`
        <div class="section" role="region" aria-label="Growth">
            <div
                style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"
            >
                <h2 style="margin:0;">Growth</h2>
                <span style="flex:1;"></span>
                ${n ? d`<button
                          type="button"
                          class="primary"
                          aria-label="Log a growth measurement"
                          @click=${n}
                      >
                          Log measurement
                      </button>` : ""}
            </div>
            <div
                class=${$ ? "growth-summary clickable" : "growth-summary"}
                role=${$ ? "button" : "group"}
                tabindex=${$ ? "0" : "-1"}
                aria-label=${$ ? "Edit latest growth measurement" : "Latest growth measurement"}
                @click=${k}
                @keydown=${$ ? (it) => {
    (it.key === "Enter" || it.key === " ") && (it.preventDefault(), k == null || k());
  } : void 0}
            >
                ${_ ? d`<div class="growth-date muted">
                          Measured ${_}
                      </div>` : ""}
                <div class="growth-grid">
                    <div>
                        <div class="label">Weight</div>
                        <div>${Et(m)} ${b} · ${Pt(y)}</div>
                    </div>
                    <div>
                        <div class="label">Height</div>
                        <div>${Et(f)} ${p} · ${Pt(h)}</div>
                    </div>
                    <div>
                        <div class="label">Head</div>
                        <div>${Et(g)} ${p} · ${Pt(u)}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
function xe(e, t) {
  return d`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var l;
    const r = /* @__PURE__ */ new Date(), n = new Date(r.getTime() - 90 * 864e5), o = (c) => c.toISOString().slice(0, 10), s = await e.callService(
      "babytracker",
      "export_report",
      { baby: t, format: "html", start: o(n), end: o(r) },
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
function pi(e, t, i) {
  var r;
  return (r = e == null ? void 0 : e.importer) != null && r.source_entity_id ? d`
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
function hi(e, t, i) {
  var s, a;
  const r = (s = e.states) == null ? void 0 : s[A(t, "recent_entries")], n = ((a = r == null ? void 0 : r.attributes) == null ? void 0 : a.entries) ?? [], o = ii(n);
  return d`
        <div class="chips" role="list" aria-label="Last 24 hours summary">
            <div class="chip" role="listitem">${o.feedings} feedings</div>
            <div class="chip" role="listitem">
                ${ni(o.totalVolumeMl)} consumed
            </div>
            <div class="chip" role="listitem">${o.wetDiapers} wet</div>
            <div class="chip" role="listitem">${o.dirtyDiapers} dirty</div>
            <div class="chip" role="listitem">
                ${ri(o.sleepMinutes)} sleep
            </div>
        </div>
    `;
}
function ie() {
  const e = window;
  return !!(e.SpeechRecognition || e.webkitSpeechRecognition);
}
function bi(e) {
  var t;
  return !!(e != null && e.connection && typeof navigator < "u" && ((t = navigator.mediaDevices) != null && t.getUserMedia) && window.AudioWorkletNode);
}
async function mi() {
  const e = window, t = e.SpeechRecognition || e.webkitSpeechRecognition;
  if (!t) throw new Error("SpeechRecognition not supported");
  const i = new t();
  i.continuous = !1, i.interimResults = !1, i.lang = navigator.language || "en-US";
  let r = () => {
  }, n = () => {
  };
  const o = new Promise((a, l) => {
    r = a, n = l;
  });
  let s = !1;
  return i.onresult = (a) => {
    if (s) return;
    s = !0;
    const l = Array.from(a.results).map((c) => {
      var b;
      return ((b = c[0]) == null ? void 0 : b.transcript) ?? "";
    }).join(" ").trim();
    r({ text: l });
  }, i.onerror = (a) => {
    s || (s = !0, n(new Error((a == null ? void 0 : a.error) ?? "speech-recognition error")));
  }, i.onend = () => {
    s || (s = !0, r({ text: "" }));
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
const gi = `
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
async function fi(e) {
  const t = await navigator.mediaDevices.getUserMedia({ audio: !0 }), i = window.AudioContext || window.webkitAudioContext, r = new i({ sampleRate: 16e3 }), n = URL.createObjectURL(
    new Blob([gi], { type: "text/javascript" })
  );
  try {
    await r.audioWorklet.addModule(n);
  } finally {
    URL.revokeObjectURL(n);
  }
  const o = r.createMediaStreamSource(t), s = new AudioWorkletNode(r, "bt-pcm-worklet");
  o.connect(s);
  let a, l, c = () => {
  }, b = () => {
  };
  const p = new Promise((h, u) => {
    c = h, b = u;
  });
  let m = !1;
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
      t.getTracks().forEach((h) => h.stop());
    } catch {
    }
    try {
      r.close();
    } catch {
    }
    try {
      l == null || l();
    } catch {
    }
  }, g = (h) => {
    m || (m = !0, f(), c({ text: h }));
  }, y = (h) => {
    m || (m = !0, f(), b(h));
  };
  try {
    l = await e.connection.subscribeMessage(
      (h) => {
        var _, $, k, v, w;
        const u = h == null ? void 0 : h.type;
        if (u === "run-start")
          a = ($ = (_ = h == null ? void 0 : h.data) == null ? void 0 : _.runner_data) == null ? void 0 : $.stt_binary_handler_id, s.port.onmessage = (C) => {
            var N;
            if (a == null || m) return;
            const D = new Uint8Array(C.data), T = new Uint8Array(D.length + 1);
            T[0] = a, T.set(D, 1);
            try {
              (N = e.connection.socket) == null || N.send(T);
            } catch {
            }
          };
        else if (u === "stt-end") {
          const C = ((v = (k = h == null ? void 0 : h.data) == null ? void 0 : k.stt_output) == null ? void 0 : v.text) ?? "";
          g(C);
        } else u === "error" && y(
          new Error(
            ((w = h == null ? void 0 : h.data) == null ? void 0 : w.message) ?? "assist_pipeline error"
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
  } catch (h) {
    throw f(), h;
  }
  return {
    stop: async () => {
      var h;
      if (a == null && !m)
        return g(""), p;
      if (a != null && !m)
        try {
          (h = e.connection.socket) == null || h.send(new Uint8Array([a]));
        } catch {
        }
      try {
        s.port.onmessage = null;
      } catch {
      }
      try {
        t.getTracks().forEach((u) => u.stop());
      } catch {
      }
      return p;
    },
    abort: () => {
      m || (m = !0, f(), c({ text: "" }));
    }
  };
}
var _i = Object.defineProperty, yi = Object.getOwnPropertyDescriptor, It = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? yi(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && _i(t, i, n), n;
};
let bt = class extends P {
  constructor() {
    super(...arguments), this._state = "idle", this._onClick = async (e) => {
      e.preventDefault(), e.stopPropagation(), this._state === "idle" ? await this._start() : this._state === "listening" && await this._stop();
    };
  }
  get _supported() {
    return ie() || bi(this.hass);
  }
  _findNotesInput() {
    const e = this.closest("form");
    return (e == null ? void 0 : e.querySelector('input[name="notes"]')) ?? null;
  }
  _appendTranscript(e) {
    const t = e.trim();
    if (!t) return;
    const i = this._findNotesInput();
    if (!i) return;
    const r = i.value.trim();
    i.value = r ? `${r} ${t}` : t, i.dispatchEvent(new Event("input", { bubbles: !0 }));
  }
  async _start() {
    this._state = "listening";
    try {
      this._controller = ie() ? await mi() : await fi(this.hass);
    } catch (e) {
      console.warn("babytracker: mic start failed", e), this._controller = void 0, this._state = "idle";
    }
  }
  async _stop() {
    const e = this._controller;
    if (this._controller = void 0, !e) {
      this._state = "idle";
      return;
    }
    this._state = "transcribing";
    try {
      const { text: t } = await e.stop();
      this._appendTranscript(t);
    } catch (t) {
      console.warn("babytracker: mic stop failed", t);
    }
    this._state = "idle";
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._controller) == null || e.abort(), this._controller = void 0;
  }
  render() {
    if (!this._supported) return d``;
    const e = {
      idle: "Voice input",
      listening: "Stop recording",
      transcribing: "Transcribing"
    }, t = {
      idle: "🎤",
      listening: "■",
      transcribing: "…"
    };
    return d`
            <button
                type="button"
                class="mic ${this._state}"
                aria-label=${e[this._state]}
                title=${e[this._state]}
                ?disabled=${this._state === "transcribing"}
                @click=${this._onClick}
            >
                ${t[this._state]}
            </button>
        `;
  }
};
bt.styles = Z`
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
It([
  E({ attribute: !1 })
], bt.prototype, "hass", 2);
It([
  x()
], bt.prototype, "_state", 2);
bt = It([
  J("bt-mic-button")
], bt);
const vi = 5 * 1024 * 1024, $i = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif"
]);
class I extends Error {
  constructor(t, i) {
    super(i), this.code = t;
  }
}
function wi(e) {
  return new Promise((t, i) => {
    const r = new FileReader();
    r.onload = () => {
      const n = r.result;
      if (typeof n != "string") {
        i(new I("read_failed", "FileReader returned non-string"));
        return;
      }
      const o = n.indexOf(",");
      t(o >= 0 ? n.slice(o + 1) : n);
    }, r.onerror = () => i(new I("read_failed", "FileReader failed")), r.readAsDataURL(e);
  });
}
async function xi(e, t) {
  if (t.size > vi)
    throw new I(
      "too_large",
      `Photo is ${Math.round(t.size / (1024 * 1024))} MB; max is 5 MB`
    );
  const i = (t.type || "").toLowerCase();
  if (!$i.has(i))
    throw new I(
      "unsupported_mime",
      `Unsupported photo type: ${t.type || "unknown"}`
    );
  const r = await wi(t);
  try {
    const n = await e.connection.sendMessagePromise({
      type: "babytracker/upload_photo",
      data: r,
      mime: i
    }), o = n == null ? void 0 : n.photo_path;
    if (typeof o != "string" || !o)
      throw new I("bad_response", "upload returned no photo_path");
    return { photo_path: o };
  } catch (n) {
    if (n instanceof I) throw n;
    const o = (n == null ? void 0 : n.code) ?? "upload_failed", s = (n == null ? void 0 : n.message) ?? "upload failed";
    throw new I(o, s);
  }
}
var ki = Object.defineProperty, Si = Object.getOwnPropertyDescriptor, at = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? Si(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && ki(t, i, n), n;
};
let z = class extends P {
  constructor() {
    super(...arguments), this.value = "", this._busy = !1, this._error = "", this._onClickAdd = (e) => {
      var t;
      e.preventDefault(), e.stopPropagation(), this._error = "", (t = this._fileInput) == null || t.click();
    }, this._onClickRemove = (e) => {
      e.preventDefault(), e.stopPropagation(), this._setValue("");
    };
  }
  get _supported() {
    var e;
    return !!((e = this.hass) != null && e.connection);
  }
  _setValue(e) {
    this.value = e, this.dispatchEvent(
      new CustomEvent("photo-changed", {
        detail: { value: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  async _onPick(e) {
    var r;
    const t = e.currentTarget, i = (r = t.files) == null ? void 0 : r[0];
    if (t.value = "", !!i) {
      this._busy = !0, this._error = "";
      try {
        const { photo_path: n } = await xi(this.hass, i);
        this._setValue(n);
      } catch (n) {
        const o = n instanceof I ? n.message : "Photo upload failed";
        this._error = o, console.warn("babytracker: photo upload failed", n);
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
z.styles = Z`
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
at([
  E({ attribute: !1 })
], z.prototype, "hass", 2);
at([
  E()
], z.prototype, "value", 2);
at([
  x()
], z.prototype, "_busy", 2);
at([
  x()
], z.prototype, "_error", 2);
at([
  fe("input[type=file]")
], z.prototype, "_fileInput", 2);
z = at([
  J("bt-photo-button")
], z);
function V(e, t = {}) {
  return d`
        <div
            style="display:flex;gap:6px;align-items:center;"
        >
            <input
                id="notes"
                name="notes"
                type="text"
                placeholder=${t.placeholder ?? "optional"}
                .value=${t.value ?? ""}
                ?autofocus=${t.autofocus ?? !1}
                style="flex:1;min-width:0;"
            />
            <bt-mic-button .hass=${e}></bt-mic-button>
        </div>
    `;
}
function F(e, t) {
  return d`
        <label>Photo</label>
        <bt-photo-button
            .hass=${e}
            .value=${t ?? ""}
        ></bt-photo-button>
    `;
}
function j(e) {
  const t = e.querySelector("bt-photo-button"), i = t == null ? void 0 : t.value;
  return typeof i == "string" && i.length > 0 ? i : void 0;
}
function ft() {
  const e = /* @__PURE__ */ new Date(), t = (i) => String(i).padStart(2, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}`;
}
function B(e) {
  if (!e) return;
  const t = Date.parse(e);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
function Dt(e) {
  if (!e) return "";
  const t = Date.parse(e);
  if (Number.isNaN(t)) return "";
  const i = new Date(t), r = (n) => String(n).padStart(2, "0");
  return `${i.getFullYear()}-${r(i.getMonth() + 1)}-${r(i.getDate())}T${r(i.getHours())}:${r(i.getMinutes())}`;
}
function ke() {
  const e = /* @__PURE__ */ new Date(), t = (i) => String(i).padStart(2, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function Ai(e) {
  if (!e) return "";
  const t = Date.parse(e);
  if (Number.isNaN(t)) return "";
  const i = new Date(t), r = (n) => String(n).padStart(2, "0");
  return `${i.getFullYear()}-${r(i.getMonth() + 1)}-${r(i.getDate())}`;
}
function Ut(e) {
  if (!e) return;
  const t = Date.parse(`${e}T12:00`);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
const Ci = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk"
]);
function zt(e, t, i, r, n, o, s) {
  let a = S;
  if (t !== null)
    switch (t.kind) {
      case "diaper":
        a = Pi(e, t.baby, r, o);
        break;
      case "bottle":
        a = Di(
          e,
          t.baby,
          i,
          t.lastAmount,
          t.lastUnit,
          r,
          o
        );
        break;
      case "solids":
        a = Ti(e, t.baby, r, o);
        break;
      case "other":
        a = Ni(e, t.baby, r, o);
        break;
      case "session":
        a = Li(
          e,
          t.baby,
          t.activity,
          t.method,
          r,
          o
        );
        break;
      case "end_sleep_first":
        a = Ei(
          t.baby,
          t.babyName,
          t.label,
          t.then,
          n,
          o
        );
        break;
      case "confirm_delete_imported":
        a = Mi(
          t.entryId,
          t.entryType,
          t.source,
          t.staff ?? null,
          r,
          o
        );
        break;
      case "edit_entry":
        a = Oi(
          e,
          t.entry,
          r,
          o,
          s
        );
        break;
      case "log_growth":
        a = Hi(e, t.baby, i, r, o);
        break;
      case "log_vaccine":
        a = zi(
          e,
          t.baby,
          t.defaultName ?? "",
          t.defaultDose,
          t.scheduleNames ?? [],
          r,
          o
        );
        break;
    }
  return d`
        <dialog @cancel=${o} @close=${o}>${a}</dialog>
    `;
}
function Ei(e, t, i, r, n, o) {
  const s = async () => {
    o(), await r();
  }, a = async () => {
    try {
      await n("end_sleep", { baby: e });
    } catch (c) {
      console.warn("babytracker: end_sleep failed", c);
    }
    o(), await r();
  }, l = Ht(t ?? e);
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
function Pi(e, t, i, r) {
  return d`
        <form @submit=${(o) => {
    o.preventDefault();
    const s = o.currentTarget, a = new FormData(s, o.submitter ?? void 0);
    i("log_diaper", {
      baby: t,
      kind: String(a.get("kind") ?? "wet"),
      timestamp: B(String(a.get("when") ?? "")),
      notes: String(a.get("notes") ?? "") || void 0,
      photo_path: j(s)
    });
  }}>
            <h2>Log diaper</h2>
            <label for="when">When</label>
            <input
                id="when"
                name="when"
                type="datetime-local"
                .value=${ft()}
            />
            <label for="notes">Notes</label>
            ${V(e)}
            ${F(e)}
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
                <button type="button" @click=${r}>Cancel</button>
            </div>
        </form>
    `;
}
function Di(e, t, i, r, n, o, s) {
  const a = (i == null ? void 0 : i.volume_unit) ?? n ?? "oz", l = typeof r == "number" && Number.isFinite(r) ? String(r) : "";
  return d`
        <form @submit=${(b) => {
    b.preventDefault();
    const p = b.currentTarget, m = new FormData(p), f = String(m.get("amount") ?? ""), g = f === "" ? void 0 : Number(f), y = B(String(m.get("at") ?? "")), h = String(m.get("unit") ?? a), u = String(m.get("notes") ?? "") || void 0;
    o("log_feeding", {
      baby: t,
      method: "bottle",
      amount: g,
      unit: h,
      started_at: y,
      ended_at: y,
      notes: u,
      photo_path: j(p)
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
            <input
                id="at"
                name="at"
                type="datetime-local"
                .value=${ft()}
                required
            />
            <label for="notes">Notes</label>
            ${V(e)}
            ${F(e)}
            <div class="actions">
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Ti(e, t, i, r) {
  return d`
        <form @submit=${(o) => {
    o.preventDefault();
    const s = o.currentTarget, a = new FormData(s), l = B(String(a.get("when") ?? ""));
    i("log_feeding", {
      baby: t,
      method: "solids",
      started_at: l,
      ended_at: l,
      notes: String(a.get("notes") ?? "") || void 0,
      photo_path: j(s)
    });
  }}>
            <h2>Log solids</h2>
            <label for="notes"
                >What was fed <span class="muted">(optional)</span></label
            >
            ${V(e, {
    placeholder: "e.g. banana, oatmeal",
    autofocus: !0
  })}
            <label for="when">When</label>
            <input
                id="when"
                name="when"
                type="datetime-local"
                .value=${ft()}
            />
            ${F(e)}
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Ni(e, t, i, r) {
  return d`
        <form @submit=${(o) => {
    o.preventDefault();
    const s = o.currentTarget, a = new FormData(s);
    i("log_other", {
      baby: t,
      name: String(a.get("name") ?? ""),
      timestamp: B(String(a.get("when") ?? "")),
      notes: String(a.get("notes") ?? "") || void 0,
      photo_path: j(s)
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
                .value=${ft()}
            />
            <label for="notes">Notes</label>
            ${V(e)}
            ${F(e)}
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Mi(e, t, i, r, n, o) {
  const s = (l) => {
    l.preventDefault(), n("delete_entry", { entry_id: e });
  }, a = r ? `${i} (${r})` : i;
  return d`
        <form @submit=${(l) => l.preventDefault()}>
            <h2>Delete this entry?</h2>
            <p>
                This <strong>${t}</strong> was logged by
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
function Oi(e, t, i, r, n) {
  const o = String((t == null ? void 0 : t.type) ?? ""), s = (t == null ? void 0 : t.data) ?? {}, a = o === "feeding" && (s.method === "bottle" || s.method === "solids"), l = o === "vaccine" || o === "growth", c = Ci.has(o) && !a, b = (f) => {
    f.preventDefault();
    const g = f.currentTarget, y = new FormData(g), h = {}, u = l ? Ut(String(y.get("started") ?? "")) : B(String(y.get("started") ?? ""));
    if (u && (h.timestamp = u), c) {
      const v = B(String(y.get("ended") ?? ""));
      h.ended_at = v ?? null;
    } else a && u && (h.ended_at = u);
    const _ = String(y.get("notes") ?? "");
    h.notes = _ || null;
    const $ = {};
    if (o === "diaper")
      $.kind = String(y.get("kind") ?? s.kind ?? "wet");
    else if (o === "feeding" && s.method === "bottle") {
      const v = String(y.get("amount") ?? ""), w = v === "" ? null : Number(v);
      $.amount = w, $.unit = String(y.get("unit") ?? s.unit ?? "oz");
    } else if (o === "other" || o === "medication") {
      const v = String(y.get("name") ?? "");
      v && ($.name = v);
    } else if (o === "growth") {
      const v = (T) => {
        const N = y.get(T);
        if (N === null) return;
        const it = String(N).trim();
        if (it === "") return null;
        const Vt = Number(it);
        return Number.isFinite(Vt) ? Vt : void 0;
      }, w = v("weight"), C = v("height"), D = v("head");
      w !== void 0 && ($.weight = w), C !== void 0 && ($.height = C), D !== void 0 && ($.head_circumference = D), $.weight_unit = String(
        y.get("weight_unit") ?? s.weight_unit ?? "kg"
      ), $.length_unit = String(
        y.get("length_unit") ?? s.length_unit ?? "cm"
      );
    }
    Object.keys($).length && (h.data = $);
    const k = j(g);
    h.photo_path = k ?? null, i("edit_entry", { entry_id: t.id, fields: h });
  }, p = () => {
    if (!n) {
      r();
      return;
    }
    !!t.source && t.source !== "user" || r(), n({
      id: t.id,
      type: t.type,
      source: t.source,
      staff: t.staff
    });
  }, m = Ri(t);
  return d`
        <form @submit=${b}>
            <h2>${m}</h2>
            ${c ? d`
                      <label for="started">Started</label>
                      <input
                          id="started"
                          name="started"
                          type="datetime-local"
                          .value=${Dt(t.timestamp)}
                          required
                      />
                      <label for="ended"
                          >Ended <span class="muted">(blank = ongoing)</span></label
                      >
                      <input
                          id="ended"
                          name="ended"
                          type="datetime-local"
                          .value=${Dt(t.ended_at)}
                      />
                  ` : l ? d`
                      <label for="started">Date</label>
                      <input
                          id="started"
                          name="started"
                          type="date"
                          .value=${Ai(t.timestamp)}
                          required
                      />
                  ` : d`
                      <label for="started">Time</label>
                      <input
                          id="started"
                          name="started"
                          type="datetime-local"
                          .value=${Dt(t.timestamp)}
                          required
                      />
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
            ${o === "feeding" && s.method === "bottle" ? d`
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
            ${o === "other" || o === "medication" ? d`
                      <label for="name">Name</label>
                      <input
                          id="name"
                          name="name"
                          type="text"
                          .value=${String(s.name ?? "")}
                      />
                  ` : ""}
            ${o === "growth" ? d`
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
            ${V(e, {
    value: String(t.notes ?? "")
  })}
            ${F(e, t.photo_path ?? "")}
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button
                    type="button"
                    class="danger"
                    aria-label="Delete entry"
                    @click=${p}
                >
                    Delete
                </button>
                <button type="submit" class="primary">Save</button>
            </div>
        </form>
    `;
}
function Ri(e) {
  const t = String((e == null ? void 0 : e.type) ?? "entry"), i = (e == null ? void 0 : e.data) ?? {}, r = i.name ?? i.method ?? i.kind;
  return r ? `Edit ${t} (${r})` : `Edit ${t}`;
}
function Li(e, t, i, r, n, o) {
  const s = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: r ? `Log ${r.replace("_", " ")} feeding` : "Log feeding"
  };
  return d`
        <form @submit=${(l) => {
    l.preventDefault();
    const c = l.currentTarget, b = new FormData(c), p = B(String(b.get("started") ?? "")), m = B(String(b.get("ended") ?? "")), f = String(b.get("notes") ?? "") || void 0, g = j(c);
    if (!m) {
      const u = {
        baby: t,
        started_at: p,
        photo_path: g
      };
      let _;
      switch (i) {
        case "sleep":
          _ = "start_sleep";
          break;
        case "tummy_time":
          _ = "start_tummy_time";
          break;
        case "walk":
          _ = "start_walk";
          break;
        case "feeding":
          _ = "start_feeding", u.method = r;
          break;
      }
      n(_, u);
      return;
    }
    const y = {
      baby: t,
      started_at: p,
      ended_at: m,
      notes: f,
      photo_path: g
    };
    let h;
    switch (i) {
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
        h = "log_feeding", y.method = r;
        break;
    }
    n(h, y);
  }}>
            <h2>${s[i]}</h2>
            <label for="started">Started</label>
            <input
                id="started"
                name="started"
                type="datetime-local"
                .value=${ft()}
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
            ${V(e)}
            ${F(e)}
            <div class="actions">
                <button type="button" @click=${o}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Hi(e, t, i, r, n) {
  const o = (i == null ? void 0 : i.weight_unit) ?? "kg", s = (i == null ? void 0 : i.length_unit) ?? "cm";
  return d`
        <form @submit=${(l) => {
    l.preventDefault();
    const c = l.currentTarget, b = new FormData(c), p = (m) => {
      const f = String(b.get(m) ?? "").trim();
      if (!f) return;
      const g = Number(f);
      return Number.isFinite(g) ? g : void 0;
    };
    r("log_growth", {
      baby: t,
      weight: p("weight"),
      height: p("height"),
      head_circumference: p("head"),
      weight_unit: String(b.get("weight_unit") ?? o),
      length_unit: String(b.get("length_unit") ?? s),
      timestamp: Ut(String(b.get("when") ?? "")),
      notes: String(b.get("notes") ?? "") || void 0,
      photo_path: j(c)
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
                        <option value="kg" ?selected=${o === "kg"}>
                            kg
                        </option>
                        <option value="lb" ?selected=${o === "lb"}>
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
            <label for="when">Date</label>
            <input
                id="when"
                name="when"
                type="date"
                .value=${ke()}
            />
            <label for="notes">Notes</label>
            ${V(e)}
            ${F(e)}
            <div class="actions">
                <button type="button" @click=${n}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
const Ii = [
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
], Ui = {
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
function re(e) {
  return Ui[e] ?? e;
}
function zi(e, t, i, r, n, o, s) {
  const a = [
    "left_thigh",
    "right_thigh",
    "left_arm",
    "right_arm",
    "oral",
    "nasal"
  ], l = (h) => {
    h.preventDefault();
    const u = h.currentTarget, _ = new FormData(u), $ = String(_.get("vaccine_select") ?? "").trim(), k = String(_.get("vaccine_custom") ?? "").trim(), v = $ === "__other__" ? k : $;
    if (!v) return;
    const w = String(_.get("dose_number") ?? "").trim(), C = w === "" ? void 0 : Number(w), D = String(_.get("site") ?? "").trim() || void 0, T = String(_.get("lot_number") ?? "").trim() || void 0, N = String(_.get("provider") ?? "").trim() || void 0;
    o("log_vaccine", {
      baby: t,
      name: v,
      dose_number: C,
      site: D,
      lot_number: T,
      provider: N,
      timestamp: Ut(String(_.get("when") ?? "")),
      notes: String(_.get("notes") ?? "") || void 0,
      photo_path: j(u)
    });
  }, c = Array.from(
    new Set(
      [...Ii, ...n].filter((h) => !!h && h !== "none").map(re)
    )
  ).sort((h, u) => h.localeCompare(u)), b = i && i !== "none" ? re(i) : "", p = !!b && c.includes(b), m = !!b && !p, f = p ? b : m ? "__other__" : "", g = m ? b : "";
  return d`
        <form @submit=${l}>
            <h2>Log vaccine</h2>
            <label for="vaccine_select">Vaccine</label>
            <select
                id="vaccine_select"
                name="vaccine_select"
                required
                autofocus
                @change=${(h) => {
    var $;
    const u = h.currentTarget, _ = ($ = u.closest("form")) == null ? void 0 : $.querySelector("#vaccine_custom");
    _ && (u.value === "__other__" ? (_.hidden = !1, _.required = !0, _.focus()) : (_.hidden = !0, _.required = !1, _.value = ""));
  }}
            >
                <option value="" disabled ?selected=${f === ""}>
                    (pick one)
                </option>
                ${c.map(
    (h) => d`<option
                        value=${h}
                        ?selected=${f === h}
                    >
                        ${h}
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
                .value=${g}
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
                .value=${r != null ? String(r) : ""}
            />
            <label for="site">Site</label>
            <select id="site" name="site">
                <option value="">(unspecified)</option>
                ${a.map(
    (h) => d`<option value=${h}>${h.replace("_", " ")}</option>`
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
                .value=${ke()}
            />
            <label for="notes">Notes</label>
            ${V(e)}
            ${F(e)}
            <div class="actions">
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
const Tt = 24 * 60 * 60 * 1e3, ne = 29.5735, oe = [
  { key: "bottle", label: "Bottle", color: "var(--primary-color, #4a90e2)" },
  { key: "breast", label: "Breast", color: "var(--success-color, #43a047)" },
  { key: "solids", label: "Solids", color: "var(--warning-color, #f5a623)" }
], se = [
  { key: "wet", label: "Wet", color: "var(--info-color, #4fc3f7)" },
  { key: "dirty", label: "Dirty", color: "var(--accent-color, #f57c00)" },
  { key: "both", label: "Both", color: "var(--error-color, #d32f2f)" }
];
function Bi(e) {
  return {
    label: e,
    sleepMinutes: 0,
    bottleMl: 0,
    feedingByCategory: { bottle: 0, breast: 0, solids: 0 },
    diaperByCategory: { wet: 0, dirty: 0, both: 0 }
  };
}
function Vi(e) {
  return e === "bottle" ? "bottle" : e === "breast_left" || e === "breast_right" ? "breast" : e === "solids" ? "solids" : null;
}
function Fi(e) {
  return e === "wet" || e === "dirty" || e === "both" ? e : null;
}
function ji(e) {
  return {
    feedings: e.feedingByCategory.bottle + e.feedingByCategory.breast + e.feedingByCategory.solids,
    diapers: e.diaperByCategory.wet + e.diaperByCategory.dirty + e.diaperByCategory.both
  };
}
function qi(e, t, i = 7) {
  var p, m, f, g, y, h;
  const r = (p = e == null ? void 0 : e.states) == null ? void 0 : p[A(t, "recent_entries")], n = ((m = r == null ? void 0 : r.attributes) == null ? void 0 : m.entries) ?? [], o = Date.now(), s = new Date(o);
  s.setHours(0, 0, 0, 0);
  const a = [], l = (u) => u.toLocaleDateString([], { weekday: "short" });
  for (let u = i - 1; u >= 0; u--) {
    const _ = new Date(s.getTime() - u * Tt);
    a.push(Bi(l(_)));
  }
  const c = s.getTime() - (i - 1) * Tt;
  for (const u of n) {
    const _ = Date.parse(u == null ? void 0 : u.timestamp);
    if (!Number.isFinite(_)) continue;
    const $ = Math.floor((_ - c) / Tt);
    if ($ < 0 || $ >= i) continue;
    const k = a[$];
    if (u.type === "feeding") {
      const v = Vi(String(((f = u == null ? void 0 : u.data) == null ? void 0 : f.method) ?? ""));
      v && (k.feedingByCategory[v] += 1);
      const w = Number(((g = u == null ? void 0 : u.data) == null ? void 0 : g.amount) ?? 0), C = String(((y = u == null ? void 0 : u.data) == null ? void 0 : y.unit) ?? "");
      w > 0 && C === "oz" ? k.bottleMl += w * ne : w > 0 && C === "ml" && (k.bottleMl += w);
    } else if (u.type === "diaper") {
      const v = Fi(String(((h = u == null ? void 0 : u.data) == null ? void 0 : h.kind) ?? ""));
      v && (k.diaperByCategory[v] += 1);
    } else if (u.type === "sleep") {
      const v = u != null && u.ended_at && u.ended_at !== "" ? Date.parse(u.ended_at) : o;
      Number.isFinite(v) && v > _ && (k.sleepMinutes += (v - _) / 6e4);
    }
  }
  const b = a.map(ji);
  return a.every(
    (u, _) => u.sleepMinutes === 0 && b[_].feedings === 0 && b[_].diapers === 0
  ) ? "" : d`
        <div class="section" role="region" aria-label="Trends">
            <h2>Trends · last ${i} days</h2>
            ${ae(
    a.map((u) => ({ label: u.label, value: u.sleepMinutes })),
    "Sleep (min/day)",
    (u) => `${Math.round(u)}`
  )}
            ${le(
    a.map((u) => ({
      label: u.label,
      parts: oe.map((_) => ({
        ..._,
        value: u.feedingByCategory[_.key]
      }))
    })),
    "Feedings/day",
    oe,
    (u) => `${u}`
  )}
            ${ae(
    a.map((u) => ({ label: u.label, value: u.bottleMl })),
    "Bottle (oz/day)",
    (u) => (u / ne).toFixed(1)
  )}
            ${le(
    a.map((u) => ({
      label: u.label,
      parts: se.map((_) => ({
        ..._,
        value: u.diaperByCategory[_.key]
      }))
    })),
    "Diapers/day",
    se,
    (u) => `${u}`
  )}
        </div>
    `;
}
function ae(e, t, i) {
  const a = Math.max(1, ...e.map((c) => c.value)), l = (320 - 14 * 2) / e.length;
  return d`
        <div class="trend">
            <div class="label">${t}</div>
            <svg
                viewBox="0 0 ${320} ${90}"
                role="img"
                aria-label=${t}
                style="width:100%;height:${90}px;"
            >
                ${e.map((c, b) => {
    const p = 14 + b * l, m = l * 0.7, f = p + (l - m) / 2, g = Math.max(
      c.value > 0 ? 2 : 0,
      c.value / a * (90 - 24 * 2)
    ), y = 66 - g;
    return yt`
                        <rect
                            x=${f}
                            y=${y}
                            width=${m}
                            height=${g}
                            fill="var(--primary-color)"
                            rx="2"
                        ></rect>
                        <text
                            x=${f + m / 2}
                            y=${y - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${c.value > 0 ? i(c.value) : ""}
                        </text>
                        <text
                            x=${f + m / 2}
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
function le(e, t, i, r) {
  const l = e.map((p) => p.parts.reduce((m, f) => m + f.value, 0)), c = Math.max(1, ...l), b = (320 - 14 * 2) / e.length;
  return d`
        <div class="trend">
            <div class="label-row">
                <div class="label">${t}</div>
                <div class="legend">
                    ${i.map(
    (p) => d`
                            <span class="legend-item">
                                <span
                                    class="swatch"
                                    style=${`background:${p.color}`}
                                ></span>
                                ${p.label}
                            </span>
                        `
  )}
                </div>
            </div>
            <svg
                viewBox="0 0 ${320} ${90}"
                role="img"
                aria-label=${t}
                style="width:100%;height:${90}px;"
            >
                ${e.map((p, m) => {
    const f = 14 + m * b, g = b * 0.7, y = f + (b - g) / 2, h = l[m], u = Math.max(
      h > 0 ? 2 : 0,
      h / c * (90 - 24 * 2)
    ), _ = 66;
    let $ = _;
    const k = p.parts.map((v) => {
      if (v.value <= 0) return yt``;
      const w = v.value / h * u;
      return $ -= w, yt`
                            <rect
                                x=${y}
                                y=${$}
                                width=${g}
                                height=${w}
                                fill=${v.color}
                            >
                                <title>${v.label}: ${v.value}</title>
                            </rect>
                        `;
    });
    return yt`
                        ${k}
                        <text
                            x=${y + g / 2}
                            y=${_ - u - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${h > 0 ? r(h) : ""}
                        </text>
                        <text
                            x=${y + g / 2}
                            y=${84}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${p.label}
                        </text>
                    `;
  })}
            </svg>
        </div>
    `;
}
function Wi(e) {
  if (!e) return "—";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "—" : new Date(t).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function Nt(e) {
  var r, n;
  const t = String(((r = e == null ? void 0 : e.data) == null ? void 0 : r.name) ?? "vaccine"), i = (n = e == null ? void 0 : e.data) == null ? void 0 : n.dose_number;
  return i != null ? `${t} dose ${i}` : t;
}
function Yi(e, t) {
  return !e || e.length === 0 ? "" : d`
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
      return d`<li
                        class=${t ? "clickable" : ""}
                        role=${t ? "button" : "listitem"}
                        tabindex=${t ? "0" : "-1"}
                        aria-label=${t ? `Edit ${Nt(i)}` : Nt(i)}
                        @click=${t ? () => t(i) : void 0}
                        @keydown=${t ? (n) => {
        (n.key === "Enter" || n.key === " ") && (n.preventDefault(), t(i));
      } : void 0}
                    >
                        <span class="vh-date muted"
                            >${Wi(i.timestamp)}</span
                        >
                        <span class="vh-name">${Nt(i)}</span>
                        ${(r = i == null ? void 0 : i.data) != null && r.site ? d`<span class="muted">${String(
        i.data.site
      ).replace("_", " ")}</span>` : ""}
                    </li>`;
    }
  )}
            </ul>
        </div>
    `;
}
function Gi(e, t, i) {
  var o, s;
  const r = e.states[A(t, "vaccines_due")];
  if (!r || r.state === "unknown") return "";
  const n = ((o = e.states[A(t, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : o.state) === "on";
  return d`
        <div
            class="section chip ${n ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${r.state}</strong>
            ${(s = r.attributes) != null && s.due_on ? d`<span>(${r.attributes.due_on})</span>` : ""}
            ${n ? d`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
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
var Ki = Object.defineProperty, Xi = Object.getOwnPropertyDescriptor, tt = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? Xi(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && Ki(t, i, n), n;
};
const Zi = ["vaccines", "growth", "trends", "export"];
let R = class extends P {
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
      var s, a, l, c, b;
      if (!((s = this._config) != null && s.baby)) return;
      const e = (l = (a = this.hass) == null ? void 0 : a.states) == null ? void 0 : l[A(this._config.baby, "vaccines_due")], t = e != null && e.state && e.state !== "none" && e.state !== "unknown" ? String(e.state) : "", i = (c = e == null ? void 0 : e.attributes) == null ? void 0 : c.dose_number, r = typeof i == "number" ? i : void 0, o = (Array.isArray((b = e == null ? void 0 : e.attributes) == null ? void 0 : b.upcoming) ? e.attributes.upcoming : []).map((p) => p && typeof p.name == "string" ? p.name : null).filter((p) => !!p);
      this._modal = {
        kind: "log_vaccine",
        baby: this._config.baby,
        defaultName: t,
        defaultDose: r,
        scheduleNames: o
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
    !this.hass || !this._config || (this._unsubOptions || (this._unsubOptions = _e(
      this.hass,
      (i) => {
        this._options = i;
      }
    )), !this._unsubVaccines && this._sections.includes("vaccines") && ((e = this._config) != null && e.baby) && (this._unsubVaccines = Ke(
      this.hass,
      this._config.baby,
      (i) => {
        this._vaccines = Array.isArray(i) ? i : [];
      }
    )), !this._unsubGrowth && this._sections.includes("growth") && ((t = this._config) != null && t.baby) && (this._unsubGrowth = Xe(
      this.hass,
      this._config.baby,
      (i) => {
        this._growth = Array.isArray(i) ? i : [];
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? Zi;
  }
  render() {
    if (!this.hass || !this._config) return d``;
    const e = this._sections;
    return d`
            <ha-card>
                ${e.includes("vaccines") ? d`
                          ${Gi(
      this.hass,
      this._config.baby,
      this._requestLogVaccine
    )}
                          ${Yi(
      this._vaccines,
      this._requestEditEntry
    )}
                      ` : ""}
                ${e.includes("growth") ? we(
      this.hass,
      this._config.baby,
      this._options,
      this._config.units,
      this._requestLogGrowth,
      this._growth[0],
      this._requestEditEntry
    ) : ""}
                ${e.includes("trends") ? qi(
      this.hass,
      this._config.baby,
      this._config.trend_days ?? 7
    ) : ""}
                ${e.includes("export") ? xe(this.hass, this._config.baby) : ""}
            </ha-card>
            ${zt(
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
R.styles = Z`
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
tt([
  E({ attribute: !1 })
], R.prototype, "hass", 2);
tt([
  x()
], R.prototype, "_config", 2);
tt([
  x()
], R.prototype, "_options", 2);
tt([
  x()
], R.prototype, "_modal", 2);
tt([
  x()
], R.prototype, "_vaccines", 2);
tt([
  x()
], R.prototype, "_growth", 2);
R = tt([
  J("babytracker-summary-card")
], R);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-summary-card",
  name: "babytracker — summary",
  description: "Vaccines, growth, 7-day trend charts, and pediatrician export for one baby."
});
var Ji = Object.defineProperty, Qi = Object.getOwnPropertyDescriptor, et = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? Qi(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && Ji(t, i, n), n;
};
function ce(e) {
  return String(e).padStart(2, "0");
}
function vt(e) {
  return `${e.getFullYear()}-${ce(e.getMonth() + 1)}-${ce(e.getDate())}`;
}
function mt(e) {
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
  if (!t) return null;
  const i = Number(t[1]), r = Number(t[2]) - 1, n = Number(t[3]), o = new Date(i, r, n, 0, 0, 0, 0);
  return Number.isNaN(o.getTime()) ? null : o;
}
function tr(e) {
  const t = mt(e) ?? /* @__PURE__ */ new Date(), i = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0), r = new Date(
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
function er(e, t) {
  const i = mt(e) ?? /* @__PURE__ */ new Date();
  return i.setDate(i.getDate() + t), vt(i);
}
function ir(e) {
  const t = mt(e);
  return t ? t.toLocaleDateString([], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : e;
}
let L = class extends P {
  constructor() {
    super(...arguments), this._date = vt(/* @__PURE__ */ new Date()), this._entries = [], this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._today = () => {
      this._date = vt(/* @__PURE__ */ new Date());
    }, this._onDateChange = (e) => {
      const t = e.currentTarget.value;
      t && mt(t) && (this._date = t);
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
    this._config = { ...e }, e.initial_date && mt(e.initial_date) && (this._date = e.initial_date);
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
    const { startIso: e, endIso: t } = tr(this._date);
    this._unsubEntries = Ge(
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
    this._date = er(this._date, e);
  }
  render() {
    if (!this.hass || !this._config) return d``;
    const e = this._date === vt(/* @__PURE__ */ new Date());
    return d`
            <ha-card>
                <h2>History — ${ir(this._date)}</h2>
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
                ${this._entries.length === 0 ? d`<p class="empty">Nothing logged on this day.</p>` : d`
                          <ul class="entries">
                              ${this._entries.map(
      (t) => $e(
        this.hass,
        t,
        this._requestEdit,
        this._expandedNotes,
        this._toggleNotes
      )
    )}
                          </ul>
                      `}
            </ha-card>
            ${zt(
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
L.styles = Z`
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
et([
  E({ attribute: !1 })
], L.prototype, "hass", 2);
et([
  x()
], L.prototype, "_config", 2);
et([
  x()
], L.prototype, "_date", 2);
et([
  x()
], L.prototype, "_entries", 2);
et([
  x()
], L.prototype, "_modal", 2);
et([
  x()
], L.prototype, "_expandedNotes", 2);
L = et([
  J("babytracker-history-card")
], L);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-history-card",
  name: "babytracker — history",
  description: "Paginate through one baby's entries by calendar day with edit + delete."
});
var rr = Object.defineProperty, nr = Object.getOwnPropertyDescriptor, q = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? nr(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && rr(t, i, n), n;
};
const or = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "recent",
  "importer_sync"
];
let M = class extends P {
  constructor() {
    super(...arguments), this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._handleService = async (e, t, i) => {
      const r = i instanceof HTMLElement && i.classList.contains("quick") ? i : null;
      try {
        const n = await We(this.hass, "babytracker", e, t);
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
            const o = this._lastBottle();
            this._modal = {
              kind: "bottle",
              baby: t,
              lastAmount: o == null ? void 0 : o.amount,
              lastUnit: o == null ? void 0 : o.unit
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
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = Ye(
      this.hass,
      this._config.baby,
      (e) => {
        this._babyConfig = e;
      }
    )), this._unsubOptions || (this._unsubOptions = _e(
      this.hass,
      (e) => {
        this._options = e;
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? or;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(e, t = "sensor") {
    return A(this._baby(), e, t);
  }
  _renderStatus() {
    var s, a, l, c, b, p, m, f, g, y;
    const e = this.hass, t = (a = (s = e.states) == null ? void 0 : s[this._entityId("last_feeding")]) == null ? void 0 : a.state, i = (c = (l = e.states) == null ? void 0 : l[this._entityId("last_diaper")]) == null ? void 0 : c.state, r = ((p = (b = e.states) == null ? void 0 : b[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : p.state) === "on", n = ((f = (m = e.states) == null ? void 0 : m[this._entityId("walking", "binary_sensor")]) == null ? void 0 : f.state) === "on", o = ((y = (g = e.states) == null ? void 0 : g[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : y.state) === "on";
    return d`
            <div class="chips" role="list" aria-label="Status chips">
                <div class="chip" role="listitem">
                    Last feeding: ${this._timeSince(t)}
                </div>
                <div class="chip" role="listitem">
                    Last diaper: ${this._timeSince(i)}
                </div>
                ${r ? d`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
                ${n ? d`<div class="chip warning" role="listitem">On a walk</div>` : ""}
                ${o ? d`<div class="chip warning" role="listitem">At daycare</div>` : ""}
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
    var i, r, n, o, s, a, l;
    const e = (r = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : r[this._entityId("recent_entries")], t = ((n = e == null ? void 0 : e.attributes) == null ? void 0 : n.entries) ?? [];
    for (const c of t)
      if ((c == null ? void 0 : c.type) === "feeding" && ((o = c == null ? void 0 : c.data) == null ? void 0 : o.method) === "bottle" && typeof ((s = c == null ? void 0 : c.data) == null ? void 0 : s.amount) == "number" && (((a = c == null ? void 0 : c.data) == null ? void 0 : a.unit) === "ml" || ((l = c == null ? void 0 : c.data) == null ? void 0 : l.unit) === "oz"))
        return { amount: c.data.amount, unit: c.data.unit };
  }
  _interceptIfSleeping(e, t) {
    var i;
    if (!this._isSleeping()) return t();
    this._modal = {
      kind: "end_sleep_first",
      baby: this._baby(),
      babyName: (i = this._babyConfig) == null ? void 0 : i.name,
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
                <h2>${Ht(((t = this._babyConfig) == null ? void 0 : t.name) ?? this._baby())}</h2>
                ${e.includes("status") ? this._renderStatus() : ""}
                ${e.includes("today") ? hi(this.hass, this._baby(), this._babyConfig) : ""}
                ${e.includes("active_session") ? ti(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("quick_log") ? Qe(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${e.includes("growth") ? we(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${e.includes("recent") ? di(
      this.hass,
      this._baby(),
      this._requestEdit,
      this._config.recent_limit ?? 50,
      this._expandedNotes,
      this._toggleNotes
    ) : ""}
                ${e.includes("importer_sync") ? pi(
      this._babyConfig,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("export") ? xe(this.hass, this._baby()) : ""}
            </ha-card>
            ${zt(
      this.hass,
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
M.styles = Z`
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
q([
  E({ attribute: !1 })
], M.prototype, "hass", 2);
q([
  x()
], M.prototype, "_config", 2);
q([
  x()
], M.prototype, "_babyConfig", 2);
q([
  x()
], M.prototype, "_options", 2);
q([
  x()
], M.prototype, "_modal", 2);
q([
  x()
], M.prototype, "_expandedNotes", 2);
q([
  fe("dialog")
], M.prototype, "_dialog", 2);
M = q([
  J("babytracker-card")
], M);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => lr);
var sr = Object.defineProperty, ar = Object.getOwnPropertyDescriptor, Bt = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? ar(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && sr(t, i, n), n;
};
let X = class extends P {
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
                max="120"
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
X.styles = Z`
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
Bt([
  E({ attribute: !1 })
], X.prototype, "hass", 2);
Bt([
  E({ attribute: !1 })
], X.prototype, "_config", 2);
X = Bt([
  J("babytracker-card-editor")
], X);
X.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const lr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return X;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  M as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
