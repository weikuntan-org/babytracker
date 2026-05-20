/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const kt = globalThis, Bt = kt.ShadowRoot && (kt.ShadyCSS === void 0 || kt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Vt = Symbol(), Qt = /* @__PURE__ */ new WeakMap();
let xe = class {
  constructor(t, i, r) {
    if (this._$cssResult$ = !0, r !== Vt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (Bt && t === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (t = Qt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && Qt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ue = (e) => new xe(typeof e == "string" ? e : e + "", void 0, Vt), U = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((r, n, o) => r + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[o + 1], e[0]);
  return new xe(i, e, Vt);
}, Be = (e, t) => {
  if (Bt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const r = document.createElement("style"), n = kt.litNonce;
    n !== void 0 && r.setAttribute("nonce", n), r.textContent = i.cssText, e.appendChild(r);
  }
}, Jt = Bt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const r of t.cssRules) i += r.cssText;
  return Ue(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ve, defineProperty: qe, getOwnPropertyDescriptor: Fe, getOwnPropertyNames: je, getOwnPropertySymbols: We, getPrototypeOf: Ke } = Object, F = globalThis, te = F.trustedTypes, Ye = te ? te.emptyScript : "", Dt = F.reactiveElementPolyfillSupport, gt = (e, t) => e, Ct = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Ye : null;
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
} }, qt = (e, t) => !Ve(e, t), ee = { attribute: !0, type: String, converter: Ct, reflect: !1, useDefault: !1, hasChanged: qt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), F.litPropertyMetadata ?? (F.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let at = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = ee) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const r = Symbol(), n = this.getPropertyDescriptor(t, r, i);
      n !== void 0 && qe(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, i, r) {
    const { get: n, set: o } = Fe(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? ee;
  }
  static _$Ei() {
    if (this.hasOwnProperty(gt("elementProperties"))) return;
    const t = Ke(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(gt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(gt("properties"))) {
      const i = this.properties, r = [...je(i), ...We(i)];
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
      for (const n of r) i.unshift(Jt(n));
    } else t !== void 0 && i.push(Jt(t));
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
    return Be(t, this.constructor.elementStyles), t;
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
      const s = (((o = r.converter) == null ? void 0 : o.toAttribute) !== void 0 ? r.converter : Ct).toAttribute(i, r.type);
      this._$Em = t, s == null ? this.removeAttribute(n) : this.setAttribute(n, s), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var o, s;
    const r = this.constructor, n = r._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const a = r.getPropertyOptions(n), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : Ct;
      this._$Em = n;
      const c = l.fromAttribute(i, a.type);
      this[n] = c ?? ((s = this._$Ej) == null ? void 0 : s.get(n)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, i, r, n = !1, o) {
    var s;
    if (t !== void 0) {
      const a = this.constructor;
      if (n === !1 && (o = this[t]), r ?? (r = a.getPropertyOptions(t)), !((r.hasChanged ?? qt)(o, i) || r.useDefault && r.reflect && o === ((s = this._$Ej) == null ? void 0 : s.get(t)) && !this.hasAttribute(a._$Eu(t, r)))) return;
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
at.elementStyles = [], at.shadowRootOptions = { mode: "open" }, at[gt("elementProperties")] = /* @__PURE__ */ new Map(), at[gt("finalized")] = /* @__PURE__ */ new Map(), Dt == null || Dt({ ReactiveElement: at }), (F.reactiveElementVersions ?? (F.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = globalThis, ie = (e) => e, At = mt.trustedTypes, re = At ? At.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ke = "$lit$", V = `lit$${Math.random().toFixed(9).slice(2)}$`, Se = "?" + V, Ge = `<${Se}>`, et = document, ft = () => et.createComment(""), _t = (e) => e === null || typeof e != "object" && typeof e != "function", Ft = Array.isArray, Xe = (e) => Ft(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", Tt = `[ 	
\f\r]`, bt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ne = /-->/g, oe = />/g, Q = RegExp(`>|${Tt}(?:([^\\s"'>=/]+)(${Tt}*=${Tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), se = /'/g, ae = /"/g, Ce = /^(?:script|style|textarea|title)$/i, Ae = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), d = Ae(1), R = Ae(2), ct = Symbol.for("lit-noChange"), C = Symbol.for("lit-nothing"), le = /* @__PURE__ */ new WeakMap(), J = et.createTreeWalker(et, 129);
function Ee(e, t) {
  if (!Ft(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return re !== void 0 ? re.createHTML(t) : t;
}
const Ze = (e, t) => {
  const i = e.length - 1, r = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = bt;
  for (let a = 0; a < i; a++) {
    const l = e[a];
    let c, b, h = -1, g = 0;
    for (; g < l.length && (s.lastIndex = g, b = s.exec(l), b !== null); ) g = s.lastIndex, s === bt ? b[1] === "!--" ? s = ne : b[1] !== void 0 ? s = oe : b[2] !== void 0 ? (Ce.test(b[2]) && (n = RegExp("</" + b[2], "g")), s = Q) : b[3] !== void 0 && (s = Q) : s === Q ? b[0] === ">" ? (s = n ?? bt, h = -1) : b[1] === void 0 ? h = -2 : (h = s.lastIndex - b[2].length, c = b[1], s = b[3] === void 0 ? Q : b[3] === '"' ? ae : se) : s === ae || s === se ? s = Q : s === ne || s === oe ? s = bt : (s = Q, n = void 0);
    const f = s === Q && e[a + 1].startsWith("/>") ? " " : "";
    o += s === bt ? l + Ge : h >= 0 ? (r.push(c), l.slice(0, h) + ke + l.slice(h) + V + f) : l + V + (h === -2 ? a : f);
  }
  return [Ee(e, o + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class yt {
  constructor({ strings: t, _$litType$: i }, r) {
    let n;
    this.parts = [];
    let o = 0, s = 0;
    const a = t.length - 1, l = this.parts, [c, b] = Ze(t, i);
    if (this.el = yt.createElement(c, r), J.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (n = J.nextNode()) !== null && l.length < a; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const h of n.getAttributeNames()) if (h.endsWith(ke)) {
          const g = b[s++], f = n.getAttribute(h).split(V), m = /([.?@])?(.*)/.exec(g);
          l.push({ type: 1, index: o, name: m[2], strings: f, ctor: m[1] === "." ? Je : m[1] === "?" ? ti : m[1] === "@" ? ei : Et }), n.removeAttribute(h);
        } else h.startsWith(V) && (l.push({ type: 6, index: o }), n.removeAttribute(h));
        if (Ce.test(n.tagName)) {
          const h = n.textContent.split(V), g = h.length - 1;
          if (g > 0) {
            n.textContent = At ? At.emptyScript : "";
            for (let f = 0; f < g; f++) n.append(h[f], ft()), J.nextNode(), l.push({ type: 2, index: ++o });
            n.append(h[g], ft());
          }
        }
      } else if (n.nodeType === 8) if (n.data === Se) l.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = n.data.indexOf(V, h + 1)) !== -1; ) l.push({ type: 7, index: o }), h += V.length - 1;
      }
      o++;
    }
  }
  static createElement(t, i) {
    const r = et.createElement("template");
    return r.innerHTML = t, r;
  }
}
function dt(e, t, i = e, r) {
  var s, a;
  if (t === ct) return t;
  let n = r !== void 0 ? (s = i._$Co) == null ? void 0 : s[r] : i._$Cl;
  const o = _t(t) ? void 0 : t._$litDirective$;
  return (n == null ? void 0 : n.constructor) !== o && ((a = n == null ? void 0 : n._$AO) == null || a.call(n, !1), o === void 0 ? n = void 0 : (n = new o(e), n._$AT(e, i, r)), r !== void 0 ? (i._$Co ?? (i._$Co = []))[r] = n : i._$Cl = n), n !== void 0 && (t = dt(e, n._$AS(e, t.values), n, r)), t;
}
class Qe {
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
    const { el: { content: i }, parts: r } = this._$AD, n = ((t == null ? void 0 : t.creationScope) ?? et).importNode(i, !0);
    J.currentNode = n;
    let o = J.nextNode(), s = 0, a = 0, l = r[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let c;
        l.type === 2 ? c = new wt(o, o.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (c = new ii(o, this, t)), this._$AV.push(c), l = r[++a];
      }
      s !== (l == null ? void 0 : l.index) && (o = J.nextNode(), s++);
    }
    return J.currentNode = et, n;
  }
  p(t) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, i), i += r.strings.length - 2) : r._$AI(t[i])), i++;
  }
}
class wt {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, r, n) {
    this.type = 2, this._$AH = C, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = r, this.options = n, this._$Cv = (n == null ? void 0 : n.isConnected) ?? !0;
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
    t = dt(this, t, i), _t(t) ? t === C || t == null || t === "" ? (this._$AH !== C && this._$AR(), this._$AH = C) : t !== this._$AH && t !== ct && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Xe(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== C && _t(this._$AH) ? this._$AA.nextSibling.data = t : this.T(et.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: i, _$litType$: r } = t, n = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = yt.createElement(Ee(r.h, r.h[0]), this.options)), r);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === n) this._$AH.p(i);
    else {
      const s = new Qe(n, this), a = s.u(this.options);
      s.p(i), this.T(a), this._$AH = s;
    }
  }
  _$AC(t) {
    let i = le.get(t.strings);
    return i === void 0 && le.set(t.strings, i = new yt(t)), i;
  }
  k(t) {
    Ft(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, n = 0;
    for (const o of t) n === i.length ? i.push(r = new wt(this.O(ft()), this.O(ft()), this, this.options)) : r = i[n], r._$AI(o), n++;
    n < i.length && (this._$AR(r && r._$AB.nextSibling, n), i.length = n);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, i); t !== this._$AB; ) {
      const n = ie(t).nextSibling;
      ie(t).remove(), t = n;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class Et {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, r, n, o) {
    this.type = 1, this._$AH = C, this._$AN = void 0, this.element = t, this.name = i, this._$AM = n, this.options = o, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = C;
  }
  _$AI(t, i = this, r, n) {
    const o = this.strings;
    let s = !1;
    if (o === void 0) t = dt(this, t, i, 0), s = !_t(t) || t !== this._$AH && t !== ct, s && (this._$AH = t);
    else {
      const a = t;
      let l, c;
      for (t = o[0], l = 0; l < o.length - 1; l++) c = dt(this, a[r + l], i, l), c === ct && (c = this._$AH[l]), s || (s = !_t(c) || c !== this._$AH[l]), c === C ? t = C : t !== C && (t += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    s && !n && this.j(t);
  }
  j(t) {
    t === C ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Je extends Et {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === C ? void 0 : t;
  }
}
class ti extends Et {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== C);
  }
}
class ei extends Et {
  constructor(t, i, r, n, o) {
    super(t, i, r, n, o), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = dt(this, t, i, 0) ?? C) === ct) return;
    const r = this._$AH, n = t === C && r !== C || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, o = t !== C && (r === C || n);
    n && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ii {
  constructor(t, i, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    dt(this, t);
  }
}
const Nt = mt.litHtmlPolyfillSupport;
Nt == null || Nt(yt, wt), (mt.litHtmlVersions ?? (mt.litHtmlVersions = [])).push("3.3.3");
const ri = (e, t, i) => {
  const r = (i == null ? void 0 : i.renderBefore) ?? t;
  let n = r._$litPart$;
  if (n === void 0) {
    const o = (i == null ? void 0 : i.renderBefore) ?? null;
    r._$litPart$ = n = new wt(t.insertBefore(ft(), o), o, void 0, i ?? {});
  }
  return n._$AI(e), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const tt = globalThis;
class M extends at {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ri(i, this.renderRoot, this.renderOptions);
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
    return ct;
  }
}
var we;
M._$litElement$ = !0, M.finalized = !0, (we = tt.litElementHydrateSupport) == null || we.call(tt, { LitElement: M });
const Mt = tt.litElementPolyfillSupport;
Mt == null || Mt({ LitElement: M });
(tt.litElementVersions ?? (tt.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ni = { attribute: !0, type: String, converter: Ct, reflect: !1, hasChanged: qt }, oi = (e = ni, t, i) => {
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
function T(e) {
  return (t, i) => typeof i == "object" ? oi(e, t, i) : ((r, n, o) => {
    const s = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, r), s ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function k(e) {
  return T({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const si = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Pe(e, t) {
  return (i, r, n) => {
    const o = (s) => {
      var a;
      return ((a = s.renderRoot) == null ? void 0 : a.querySelector(e)) ?? null;
    };
    return si(i, r, { get() {
      return o(this);
    } });
  };
}
function A(e, t, i = "sensor") {
  return `${i}.babytracker_${e}_${t}`;
}
function jt(e) {
  return typeof e != "string" || e.length === 0 ? "" : e.charAt(0).toUpperCase() + e.slice(1);
}
async function ai(e, t, i, r) {
  return e.callService(t, i, r);
}
function xt(e, t, i, r) {
  const n = { cancelled: !1 }, o = async (s) => {
    if (!n.cancelled)
      try {
        const a = await e.connection.subscribeMessage(
          i,
          t
        );
        if (n.cancelled) {
          try {
            a();
          } catch {
          }
          return;
        }
        n.unsub = a;
      } catch (a) {
        if (console.warn(`babytracker: ${r} failed (attempt ${s + 1})`, a), n.cancelled) return;
        const l = Math.min(3e4, 1e3 * 2 ** s);
        n.timer = setTimeout(() => {
          n.timer = void 0, o(s + 1);
        }, l);
      }
  };
  return o(0), () => {
    var s;
    n.cancelled = !0, n.timer != null && (clearTimeout(n.timer), n.timer = void 0), (s = n.unsub) == null || s.call(n);
  };
}
function li(e, t, i) {
  return xt(
    e,
    { type: "babytracker/get_baby_config", baby: t, subscribe: !0 },
    i,
    "subscribeBabyConfig"
  );
}
function De(e, t) {
  return xt(
    e,
    { type: "babytracker/get_integration_options", subscribe: !0 },
    t,
    "subscribeIntegrationOptions"
  );
}
function ci(e, t, i, r, n) {
  return xt(
    e,
    {
      type: "babytracker/list_entries_in_range",
      baby: t,
      start: i,
      end: r,
      subscribe: !0
    },
    n,
    "subscribeEntriesInRange"
  );
}
function di(e, t, i) {
  return xt(
    e,
    { type: "babytracker/list_vaccines", baby: t, subscribe: !0 },
    i,
    "subscribeVaccines"
  );
}
function ui(e, t, i) {
  return xt(
    e,
    { type: "babytracker/list_growth", baby: t, subscribe: !0 },
    i,
    "subscribeGrowth"
  );
}
function pi(e, t, i, r) {
  if (!e)
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
  const n = e.enabled_activities ?? [], o = e.enabled_feeding_methods ?? [], s = (c) => c.charAt(0).toUpperCase() + c.slice(1), a = jt(e.name ?? t), l = [];
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
function hi(e, t, i) {
  var l, c, b, h, g, f;
  const r = ((l = e.states[A(t, "sleeping", "binary_sensor")]) == null ? void 0 : l.state) === "on", n = ((c = e.states[A(t, "feeding", "binary_sensor")]) == null ? void 0 : c.state) === "on", o = ((b = e.states[A(t, "tummy_time", "binary_sensor")]) == null ? void 0 : b.state) === "on", s = ((h = e.states[A(t, "walking", "binary_sensor")]) == null ? void 0 : h.state) === "on";
  if (!r && !n && !o && !s) return "";
  const a = [];
  if (r) {
    const m = (g = e.states[A(t, "last_sleep_start")]) == null ? void 0 : g.state;
    a.push(
      d`
                <div class="chip warning" role="status">
                    Sleeping ${m ? d`· started ${ce(m)}` : ""}
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
                        @click=${(m) => i("end_feeding", { baby: t }, m.currentTarget)}
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
                        @click=${(m) => i("end_tummy_time", { baby: t }, m.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), s) {
    const m = (f = e.states[A(t, "last_walk_start")]) == null ? void 0 : f.state;
    a.push(
      d`
                <div class="chip warning" role="status">
                    Walking ${m ? d`· started ${ce(m)}` : ""}
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
function ce(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const Te = 29.5735, Ne = 24 * 60 * 60 * 1e3;
function lt(e) {
  if (!e) return 0;
  const t = Date.parse(e);
  return Number.isNaN(t) ? 0 : t;
}
function bi(e, t = Ne, i = Date.now()) {
  const r = i - t;
  return e.filter((n) => lt(n.timestamp) >= r).slice().sort((n, o) => lt(o.timestamp) - lt(n.timestamp));
}
function gi(e, t = Date.now(), i = Ne) {
  var c, b, h;
  const r = t - i;
  let n = 0, o = 0, s = 0, a = 0, l = 0;
  for (const g of e) {
    const f = lt(g.timestamp);
    if (g.type === "sleep") {
      const m = f, y = g.ended_at != null && g.ended_at !== "" ? lt(g.ended_at) : t;
      if (m > 0 && y > m && y > r) {
        const p = Math.max(m, r), $ = Math.min(y, t);
        $ > p && (l += ($ - p) / 6e4);
      }
      continue;
    }
    if (!(f < r)) {
      if (g.type === "feeding") {
        n += 1;
        const m = Number(((c = g.data) == null ? void 0 : c.amount) ?? 0), y = String(((b = g.data) == null ? void 0 : b.unit) ?? "");
        m > 0 && (a += y === "oz" ? m * Te : m);
      } else if (g.type === "diaper") {
        const m = String(((h = g.data) == null ? void 0 : h.kind) ?? "");
        m === "wet" ? o += 1 : m === "dirty" ? s += 1 : m === "both" && (o += 1, s += 1);
      }
    }
  }
  return { feedings: n, wetDiapers: o, dirtyDiapers: s, totalVolumeMl: a, sleepMinutes: l };
}
function mi(e, t = Date.now()) {
  let i = null;
  for (const r of e) {
    if ((r == null ? void 0 : r.type) !== "sleep" || !(r != null && r.ended_at)) continue;
    const n = Date.parse(r.ended_at);
    Number.isFinite(n) && (i === null || n > i) && (i = n);
  }
  return i === null ? null : Math.max(0, (t - i) / 6e4);
}
function Me(e) {
  if (!Number.isFinite(e) || e <= 0) return "0m";
  if (e < 60) return `${Math.round(e)}m`;
  const t = Math.floor(e / 60), i = Math.round(e % 60);
  return i === 0 ? `${t}h` : `${t}h ${i}m`;
}
function fi(e) {
  if (!Number.isFinite(e) || e <= 0) return "0 oz";
  const t = e / Te;
  return t >= 1 ? `${t.toFixed(1)} oz` : `${Math.round(e)} ml`;
}
function _i(e) {
  const t = String((e == null ? void 0 : e.type) ?? ""), i = (e == null ? void 0 : e.data) ?? {};
  if (t === "other") {
    const s = String(i.name ?? "").trim();
    return de(s || Ot(t));
  }
  const r = i.method ?? i.kind, n = r != null && r !== "" ? Ot(String(r)) : null, o = de(Ot(t));
  return n ? t === "feeding" && i.amount != null && i.amount !== "" && i.unit ? `${o} (${n}, ${i.amount} ${i.unit})` : `${o} (${n})` : o;
}
function Ot(e) {
  return e.replace(/_/g, " ");
}
function de(e) {
  return e && e.charAt(0).toUpperCase() + e.slice(1);
}
function ue(e) {
  const t = lt(e);
  return t === 0 ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
var yi = Object.defineProperty, vi = Object.getOwnPropertyDescriptor, rt = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? vi(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && yi(t, i, n), n;
};
let H = class extends M {
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
H.styles = U`
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
rt([
  T({ attribute: !1 })
], H.prototype, "hass", 2);
rt([
  T()
], H.prototype, "photoPath", 2);
rt([
  T({ type: Number })
], H.prototype, "size", 2);
rt([
  k()
], H.prototype, "_url", 2);
rt([
  k()
], H.prototype, "_failed", 2);
rt([
  k()
], H.prototype, "_open", 2);
H = rt([
  K("bt-entry-thumbnail")
], H);
const $i = /* @__PURE__ */ new Set(["sleep", "feeding", "tummy_time", "walk"]);
function Oe(e, t, i, r, n) {
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
                <span aria-label="Entry type">${_i(t)}</span>
                ${wi(t)}
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
            ${t.photo_path ? d`<div class="entry-photo">
                      <bt-entry-thumbnail
                          .hass=${e}
                          .photoPath=${t.photo_path}
                      ></bt-entry-thumbnail>
                  </div>` : ""}
        </li>
    `;
}
function wi(e) {
  const t = ue(e.timestamp);
  return $i.has(String(e.type ?? "")) && e.ended_at && e.ended_at !== e.timestamp ? d`<span class="muted"
            >${t} – ${ue(e.ended_at)}</span
        >` : d`<span class="muted">${t}</span>`;
}
function xi(e, t, i, r, n = /* @__PURE__ */ new Set(), o = () => {
}) {
  var c;
  const s = e.states[A(t, "recent_entries")], a = ((c = s == null ? void 0 : s.attributes) == null ? void 0 : c.entries) ?? [], l = bi(a).slice(0, Math.min(r, 120));
  return d`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${l.length === 0 ? d`<p>Nothing logged yet.</p>` : d`
                      <ul class="entries">
                          ${l.map(
    (b) => Oe(
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
var ki = Object.defineProperty, Si = Object.getOwnPropertyDescriptor, Pt = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? Si(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && ki(t, i, n), n;
};
let ut = class extends M {
  constructor() {
    super(...arguments), this.label = "", this.renderChart = null, this._open = !1, this._onKeydown = (e) => {
      e.key === "Escape" && (e.preventDefault(), this._close());
    }, this._openLb = (e) => {
      e.preventDefault(), e.stopPropagation(), !(this._open || !this.renderChart) && (this._open = !0, this._attachKeyHandler());
    }, this._close = (e) => {
      e && (e.preventDefault(), e.stopPropagation()), this._open && (this._open = !1, this._detachKeyHandler());
    }, this._onKeydownActivate = (e) => {
      (e.key === "Enter" || e.key === " ") && this._openLb(e);
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
    var t, i;
    const e = (t = this.renderChart) == null ? void 0 : t.call(this);
    return d`
            <div
                class="surface"
                role="button"
                tabindex="0"
                aria-label=${`Expand ${this.label}`}
                @click=${this._openLb}
                @keydown=${this._onKeydownActivate}
            >
                ${e}
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
                              @click=${(r) => r.stopPropagation()}
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
ut.styles = U`
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
Pt([
  T()
], ut.prototype, "label", 2);
Pt([
  T({ attribute: !1 })
], ut.prototype, "renderChart", 2);
Pt([
  k()
], ut.prototype, "_open", 2);
ut = Pt([
  K("bt-chart-lightbox")
], ut);
const pe = [
  { key: "weight", label: "Weight", color: "var(--primary-color, #2563eb)" },
  { key: "height", label: "Height", color: "var(--success-color, #16a34a)" },
  { key: "head", label: "Head", color: "var(--warning-color, #ea580c)" }
];
function Ci(e, t) {
  const i = (e == null ? void 0 : e.data) ?? {}, r = t === "weight" ? i.weight_percentile : t === "height" ? i.height_percentile : i.head_percentile;
  if (r == null) return null;
  const n = Number(r);
  return Number.isFinite(n) ? n : null;
}
function Rt(e) {
  if (e == null) return "—";
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? String(Math.round(t * 100) / 100) : String(e);
}
function Lt(e) {
  if (e == null || e === "—") return "—";
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? `p${Math.round(t)}` : String(e);
}
function Ai(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function Re(e, t, i, r, n, o, s, a) {
  var v, E, P, S, D, B;
  const l = (o == null ? void 0 : o.data) ?? {}, c = (r == null ? void 0 : r.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", b = (r == null ? void 0 : r.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", h = l.weight_unit ?? c, g = l.length_unit ?? b, f = l.weight ?? ((v = e.states[A(t, "weight")]) == null ? void 0 : v.state), m = l.height ?? ((E = e.states[A(t, "height")]) == null ? void 0 : E.state), y = l.head_circumference ?? ((P = e.states[A(t, "head_circumference")]) == null ? void 0 : P.state), p = l.weight_percentile ?? ((S = e.states[A(t, "weight_percentile")]) == null ? void 0 : S.state), $ = l.height_percentile ?? ((D = e.states[A(t, "height_percentile")]) == null ? void 0 : D.state), w = l.head_percentile ?? ((B = e.states[A(t, "head_circumference_percentile")]) == null ? void 0 : B.state), x = Ai(o == null ? void 0 : o.timestamp), _ = !!(o && s), u = _ ? () => s(o) : void 0;
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
                class=${_ ? "growth-summary clickable" : "growth-summary"}
                role=${_ ? "button" : "group"}
                tabindex=${_ ? "0" : "-1"}
                aria-label=${_ ? "Edit latest growth measurement" : "Latest growth measurement"}
                @click=${u}
                @keydown=${_ ? (st) => {
    (st.key === "Enter" || st.key === " ") && (st.preventDefault(), u == null || u());
  } : void 0}
            >
                ${x ? d`<div class="growth-date muted">
                          Measured ${x}
                      </div>` : ""}
                <div class="growth-grid">
                    <div>
                        <div class="label">Weight</div>
                        <div>${Rt(f)} ${h} · ${Lt(p)}</div>
                    </div>
                    <div>
                        <div class="label">Height</div>
                        <div>${Rt(m)} ${g} · ${Lt($)}</div>
                    </div>
                    <div>
                        <div class="label">Head</div>
                        <div>${Rt(y)} ${g} · ${Lt(w)}</div>
                    </div>
                </div>
            </div>
            ${Ei(a)}
        </div>
    `;
}
function Ei(e) {
  return he(e) === "" ? "" : d`
        <bt-chart-lightbox
            label="Percentile over time"
            .renderChart=${() => he(e)}
        ></bt-chart-lightbox>
    `;
}
function he(e) {
  if (!Array.isArray(e) || e.length < 2) return "";
  const t = [...e].filter((_) => Number.isFinite(Date.parse(_ == null ? void 0 : _.timestamp))).sort((_, u) => Date.parse(_.timestamp) - Date.parse(u.timestamp));
  if (t.length < 2) return "";
  const i = Date.parse(t[0].timestamp), r = Date.parse(t[t.length - 1].timestamp), n = Math.max(1, r - i), o = 320, s = 140, a = 22, l = 8, c = 8, b = 20, h = o - a - l, g = s - c - b, f = (_) => a + (_ - i) / n * h, m = (_) => c + (1 - _ / 100) * g, y = pe.map((_) => ({
    ..._,
    points: t.map((u) => {
      const v = Ci(u, _.key);
      return v === null ? null : { ts: Date.parse(u.timestamp), p: v };
    }).filter((u) => u !== null)
  }));
  if (y.reduce(
    (_, u) => _ + u.points.length,
    0
  ) < 2) return "";
  const $ = Ht(t[0].timestamp), w = Ht(t[t.length - 1].timestamp), x = [10, 50, 90];
  return d`
        <div class="growth-trend">
            <div class="label-row">
                <div class="label">Percentile over time</div>
                <div class="legend">
                    ${pe.map(
    (_) => d`
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
                viewBox="0 0 ${o} ${s}"
                role="img"
                aria-label="Percentile over time"
                style="width:100%;height:${s}px;"
            >
                ${x.map(
    (_) => R`
                        <line
                            x1=${a}
                            x2=${o - l}
                            y1=${m(_)}
                            y2=${m(_)}
                            stroke="var(--divider-color, #888)"
                            stroke-dasharray=${_ === 50 ? "" : "2 2"}
                            stroke-width="1"
                        ></line>
                        <text
                            x=${a - 4}
                            y=${m(_) + 3}
                            font-size="8"
                            text-anchor="end"
                            fill="var(--secondary-text-color)"
                        >
                            p${_}
                        </text>
                    `
  )}
                ${y.map((_) => {
    if (_.points.length === 0) return R``;
    const u = _.points.map(
      (v, E) => `${E === 0 ? "M" : "L"}${f(v.ts).toFixed(1)},${m(v.p).toFixed(1)}`
    ).join(" ");
    return R`
                        ${_.points.length > 1 ? R`<path
                                d=${u}
                                fill="none"
                                stroke=${_.color}
                                stroke-width="1.6"
                                stroke-linejoin="round"
                                stroke-linecap="round"
                              ></path>` : ""}
                        ${_.points.map(
      (v) => R`
                                <circle
                                    cx=${f(v.ts)}
                                    cy=${m(v.p)}
                                    r="2.5"
                                    fill=${_.color}
                                >
                                    <title>${_.label} ${Ht(new Date(v.ts).toISOString())}: p${Math.round(v.p)}</title>
                                </circle>
                            `
    )}
                    `;
  })}
                <text
                    x=${a}
                    y=${s - 4}
                    font-size="9"
                    fill="var(--secondary-text-color)"
                >
                    ${$}
                </text>
                <text
                    x=${o - l}
                    y=${s - 4}
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
function Ht(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleDateString([], {
    month: "short",
    day: "numeric"
  });
}
function Le(e, t) {
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
function Pi(e, t, i) {
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
function Di(e, t, i) {
  var s, a;
  const r = (s = e.states) == null ? void 0 : s[A(t, "recent_entries")], n = ((a = r == null ? void 0 : r.attributes) == null ? void 0 : a.entries) ?? [], o = gi(n);
  return d`
        <div class="chip" role="listitem">
            ${fi(o.totalVolumeMl)} consumed
        </div>
        <div class="chip" role="listitem">
            ${o.wetDiapers} wet and ${o.dirtyDiapers} dirty
        </div>
        <div class="chip" role="listitem">
            ${Me(o.sleepMinutes)} sleep
        </div>
    `;
}
function be() {
  const e = window;
  return !!(e.SpeechRecognition || e.webkitSpeechRecognition);
}
function Ti(e) {
  var t;
  return !!(e != null && e.connection && typeof navigator < "u" && ((t = navigator.mediaDevices) != null && t.getUserMedia) && window.AudioWorkletNode);
}
async function Ni() {
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
const Mi = `
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
async function Oi(e) {
  const t = await navigator.mediaDevices.getUserMedia({ audio: !0 }), i = window.AudioContext || window.webkitAudioContext, r = new i({ sampleRate: 16e3 }), n = URL.createObjectURL(
    new Blob([Mi], { type: "text/javascript" })
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
  const h = new Promise((p, $) => {
    c = p, b = $;
  });
  let g = !1;
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
      t.getTracks().forEach((p) => p.stop());
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
  }, m = (p) => {
    g || (g = !0, f(), c({ text: p }));
  }, y = (p) => {
    g || (g = !0, f(), b(p));
  };
  try {
    l = await e.connection.subscribeMessage(
      (p) => {
        var w, x, _, u, v;
        const $ = p == null ? void 0 : p.type;
        if ($ === "run-start")
          a = (x = (w = p == null ? void 0 : p.data) == null ? void 0 : w.runner_data) == null ? void 0 : x.stt_binary_handler_id, s.port.onmessage = (E) => {
            var D;
            if (a == null || g) return;
            const P = new Uint8Array(E.data), S = new Uint8Array(P.length + 1);
            S[0] = a, S.set(P, 1);
            try {
              (D = e.connection.socket) == null || D.send(S);
            } catch {
            }
          };
        else if ($ === "stt-end") {
          const E = ((u = (_ = p == null ? void 0 : p.data) == null ? void 0 : _.stt_output) == null ? void 0 : u.text) ?? "";
          m(E);
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
    throw f(), p;
  }
  return {
    stop: async () => {
      var p;
      if (a == null && !g)
        return m(""), h;
      if (a != null && !g)
        try {
          (p = e.connection.socket) == null || p.send(new Uint8Array([a]));
        } catch {
        }
      try {
        s.port.onmessage = null;
      } catch {
      }
      try {
        t.getTracks().forEach(($) => $.stop());
      } catch {
      }
      return h;
    },
    abort: () => {
      g || (g = !0, f(), c({ text: "" }));
    }
  };
}
var Ri = Object.defineProperty, Li = Object.getOwnPropertyDescriptor, Wt = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? Li(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && Ri(t, i, n), n;
};
let vt = class extends M {
  constructor() {
    super(...arguments), this._state = "idle", this._onClick = async (e) => {
      e.preventDefault(), e.stopPropagation(), this._state === "idle" ? await this._start() : this._state === "listening" && await this._stop();
    };
  }
  get _supported() {
    return be() || Ti(this.hass);
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
      this._controller = be() ? await Ni() : await Oi(this.hass);
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
vt.styles = U`
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
Wt([
  T({ attribute: !1 })
], vt.prototype, "hass", 2);
Wt([
  k()
], vt.prototype, "_state", 2);
vt = Wt([
  K("bt-mic-button")
], vt);
const Hi = 5 * 1024 * 1024, Ii = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif"
]);
class q extends Error {
  constructor(t, i) {
    super(i), this.code = t;
  }
}
function zi(e) {
  return new Promise((t, i) => {
    const r = new FileReader();
    r.onload = () => {
      const n = r.result;
      if (typeof n != "string") {
        i(new q("read_failed", "FileReader returned non-string"));
        return;
      }
      const o = n.indexOf(",");
      t(o >= 0 ? n.slice(o + 1) : n);
    }, r.onerror = () => i(new q("read_failed", "FileReader failed")), r.readAsDataURL(e);
  });
}
async function Ui(e, t) {
  if (t.size > Hi)
    throw new q(
      "too_large",
      `Photo is ${Math.round(t.size / (1024 * 1024))} MB; max is 5 MB`
    );
  const i = (t.type || "").toLowerCase();
  if (!Ii.has(i))
    throw new q(
      "unsupported_mime",
      `Unsupported photo type: ${t.type || "unknown"}`
    );
  const r = await zi(t);
  try {
    const n = await e.connection.sendMessagePromise({
      type: "babytracker/upload_photo",
      data: r,
      mime: i
    }), o = n == null ? void 0 : n.photo_path;
    if (typeof o != "string" || !o)
      throw new q("bad_response", "upload returned no photo_path");
    return { photo_path: o };
  } catch (n) {
    if (n instanceof q) throw n;
    const o = (n == null ? void 0 : n.code) ?? "upload_failed", s = (n == null ? void 0 : n.message) ?? "upload failed";
    throw new q(o, s);
  }
}
var Bi = Object.defineProperty, Vi = Object.getOwnPropertyDescriptor, pt = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? Vi(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && Bi(t, i, n), n;
};
let j = class extends M {
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
        const { photo_path: n } = await Ui(this.hass, i);
        this._setValue(n);
      } catch (n) {
        const o = n instanceof q ? n.message : "Photo upload failed";
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
j.styles = U`
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
pt([
  T({ attribute: !1 })
], j.prototype, "hass", 2);
pt([
  T()
], j.prototype, "value", 2);
pt([
  k()
], j.prototype, "_busy", 2);
pt([
  k()
], j.prototype, "_error", 2);
pt([
  Pe("input[type=file]")
], j.prototype, "_fileInput", 2);
j = pt([
  K("bt-photo-button")
], j);
const qi = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk"
]);
function Y(e, t = {}) {
  return d`
        <div style="display:flex;gap:6px;align-items:center;">
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
function G(e, t) {
  return d`
        <label>Photo</label>
        <bt-photo-button
            .hass=${e}
            .value=${t ?? ""}
        ></bt-photo-button>
    `;
}
function X(e) {
  const t = e.querySelector("bt-photo-button"), i = t == null ? void 0 : t.value;
  return typeof i == "string" && i.length > 0 ? i : void 0;
}
const N = (e) => String(e).padStart(2, "0");
function ht() {
  const e = /* @__PURE__ */ new Date();
  return `${e.getFullYear()}-${N(e.getMonth() + 1)}-${N(e.getDate())}T${N(e.getHours())}:${N(e.getMinutes())}`;
}
function W(e) {
  if (!e) return;
  const t = Date.parse(e);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
function It(e) {
  if (!e) return "";
  const t = Date.parse(e);
  if (Number.isNaN(t)) return "";
  const i = new Date(t);
  return `${i.getFullYear()}-${N(i.getMonth() + 1)}-${N(i.getDate())}T${N(i.getHours())}:${N(i.getMinutes())}`;
}
function Kt() {
  const e = /* @__PURE__ */ new Date();
  return `${e.getFullYear()}-${N(e.getMonth() + 1)}-${N(e.getDate())}`;
}
function Fi(e) {
  if (!e) return "";
  const t = Date.parse(e);
  if (Number.isNaN(t)) return "";
  const i = new Date(t);
  return `${i.getFullYear()}-${N(i.getMonth() + 1)}-${N(i.getDate())}`;
}
function Yt(e) {
  if (!e) return;
  const t = Date.parse(`${e}T12:00`);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
function L(e) {
  const t = (i) => {
    var o;
    const n = (o = i.currentTarget.parentElement) == null ? void 0 : o.querySelector(
      "input"
    );
    n && (n.value = ht(), n.dispatchEvent(new Event("input", { bubbles: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0 })));
  };
  return d`
        <div class="dt-row">
            <input
                id=${e.id}
                name=${e.id}
                type="datetime-local"
                .value=${e.value ?? ""}
                placeholder=${e.placeholder ?? ""}
                ?required=${e.required ?? !1}
            />
            <button
                type="button"
                class="now-btn"
                aria-label="Set to now"
                title="Set to current time"
                @click=${t}
            >
                Now
            </button>
        </div>
    `;
}
function Gt(e) {
  const t = (i) => {
    var o;
    const n = (o = i.currentTarget.parentElement) == null ? void 0 : o.querySelector(
      "input"
    );
    n && (n.value = Kt(), n.dispatchEvent(new Event("input", { bubbles: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0 })));
  };
  return d`
        <div class="dt-row">
            <input
                id=${e.id}
                name=${e.id}
                type="date"
                .value=${e.value ?? ""}
                ?required=${e.required ?? !1}
            />
            <button
                type="button"
                class="now-btn"
                aria-label="Set to today"
                title="Set to today's date"
                @click=${t}
            >
                Today
            </button>
        </div>
    `;
}
function ji(e, t, i, r, n, o, s) {
  const a = (i == null ? void 0 : i.volume_unit) ?? n ?? "oz", l = typeof r == "number" && Number.isFinite(r) ? String(r) : "";
  return d`
        <form @submit=${(b) => {
    b.preventDefault();
    const h = b.currentTarget, g = new FormData(h), f = String(g.get("amount") ?? ""), m = f === "" ? void 0 : Number(f), y = W(String(g.get("at") ?? "")), p = String(g.get("unit") ?? a), $ = String(g.get("notes") ?? "") || void 0;
    o("log_feeding", {
      baby: t,
      method: "bottle",
      amount: m,
      unit: p,
      started_at: y,
      ended_at: y,
      notes: $,
      photo_path: X(h)
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
    value: ht(),
    required: !0
  })}
            <label for="notes">Notes</label>
            ${Y(e)}
            ${G(e)}
            <div class="actions">
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Wi(e, t, i, r, n, o) {
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
function Ki(e, t, i, r) {
  return d`
        <form @submit=${(o) => {
    o.preventDefault();
    const s = o.currentTarget, a = new FormData(s, o.submitter ?? void 0);
    i("log_diaper", {
      baby: t,
      kind: String(a.get("kind") ?? "wet"),
      timestamp: W(String(a.get("when") ?? "")),
      notes: String(a.get("notes") ?? "") || void 0,
      photo_path: X(s)
    });
  }}>
            <h2>Log diaper</h2>
            <label for="when">When</label>
            ${L({ id: "when", value: ht() })}
            <label for="notes">Notes</label>
            ${Y(e)}
            ${G(e)}
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
function Yi(e, t, i, r, n) {
  const o = String((t == null ? void 0 : t.type) ?? ""), s = (t == null ? void 0 : t.data) ?? {}, a = o === "feeding" && (s.method === "bottle" || s.method === "solids"), l = o === "vaccine" || o === "growth", c = qi.has(o) && !a, b = (f) => {
    f.preventDefault();
    const m = f.currentTarget, y = new FormData(m), p = {}, $ = l ? Yt(String(y.get("started") ?? "")) : W(String(y.get("started") ?? ""));
    if ($ && (p.timestamp = $), c) {
      const u = W(String(y.get("ended") ?? ""));
      p.ended_at = u ?? null;
    } else a && $ && (p.ended_at = $);
    const w = String(y.get("notes") ?? "");
    p.notes = w || null;
    const x = {};
    if (o === "diaper")
      x.kind = String(y.get("kind") ?? s.kind ?? "wet");
    else if (o === "feeding" && s.method === "bottle") {
      const u = String(y.get("amount") ?? ""), v = u === "" ? null : Number(u);
      x.amount = v, x.unit = String(y.get("unit") ?? s.unit ?? "oz");
    } else if (o === "other" || o === "medication") {
      const u = String(y.get("name") ?? "");
      u && (x.name = u);
    } else if (o === "growth") {
      const u = (S) => {
        const D = y.get(S);
        if (D === null) return;
        const B = String(D).trim();
        if (B === "") return null;
        const st = Number(B);
        return Number.isFinite(st) ? st : void 0;
      }, v = u("weight"), E = u("height"), P = u("head");
      v !== void 0 && (x.weight = v), E !== void 0 && (x.height = E), P !== void 0 && (x.head_circumference = P), x.weight_unit = String(
        y.get("weight_unit") ?? s.weight_unit ?? "kg"
      ), x.length_unit = String(
        y.get("length_unit") ?? s.length_unit ?? "cm"
      );
    }
    Object.keys(x).length && (p.data = x);
    const _ = X(m);
    p.photo_path = _ ?? null, i("edit_entry", { entry_id: t.id, fields: p });
  }, h = () => {
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
  }, g = Gi(t);
  return d`
        <form @submit=${b}>
            <h2>${g}</h2>
            ${c ? d`
                      <label for="started">Started</label>
                      ${L({
    id: "started",
    value: It(t.timestamp),
    required: !0
  })}
                      <label for="ended"
                          >Ended <span class="muted">(blank = ongoing)</span></label
                      >
                      ${L({
    id: "ended",
    value: It(t.ended_at)
  })}
                  ` : l ? d`
                      <label for="started">Date</label>
                      ${Gt({
    id: "started",
    value: Fi(t.timestamp),
    required: !0
  })}
                  ` : d`
                      <label for="started">Time</label>
                      ${L({
    id: "started",
    value: It(t.timestamp),
    required: !0
  })}
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
            ${Y(e, {
    value: String(t.notes ?? "")
  })}
            ${G(e, t.photo_path ?? "")}
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
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
function Gi(e) {
  const t = String((e == null ? void 0 : e.type) ?? "entry"), i = (e == null ? void 0 : e.data) ?? {}, r = i.name ?? i.method ?? i.kind;
  return r ? `Edit ${t} (${r})` : `Edit ${t}`;
}
function Xi(e, t, i, r, n, o) {
  const s = async () => {
    o(), await r();
  }, a = async () => {
    try {
      await n("end_sleep", { baby: e });
    } catch (c) {
      console.warn("babytracker: end_sleep failed", c);
    }
    o(), await r();
  }, l = jt(t ?? e);
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
function Zi(e, t, i, r, n) {
  const o = (i == null ? void 0 : i.weight_unit) ?? "kg", s = (i == null ? void 0 : i.length_unit) ?? "cm";
  return d`
        <form @submit=${(l) => {
    l.preventDefault();
    const c = l.currentTarget, b = new FormData(c), h = (g) => {
      const f = String(b.get(g) ?? "").trim();
      if (!f) return;
      const m = Number(f);
      return Number.isFinite(m) ? m : void 0;
    };
    r("log_growth", {
      baby: t,
      weight: h("weight"),
      height: h("height"),
      head_circumference: h("head"),
      weight_unit: String(b.get("weight_unit") ?? o),
      length_unit: String(b.get("length_unit") ?? s),
      timestamp: Yt(String(b.get("when") ?? "")),
      notes: String(b.get("notes") ?? "") || void 0,
      photo_path: X(c)
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
            ${Gt({ id: "when", value: Kt() })}
            <label for="notes">Notes</label>
            ${Y(e)}
            ${G(e)}
            <div class="actions">
                <button type="button" @click=${n}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
const Qi = [
  "Bath",
  "Butt wash",
  "Medication",
  "Vitamin",
  "Burp",
  "Spit up",
  "Throw up"
];
function Ji(e, t, i, r) {
  const n = (s) => {
    s.preventDefault();
    const a = s.currentTarget, l = new FormData(a);
    i("log_other", {
      baby: t,
      name: String(l.get("name") ?? ""),
      timestamp: W(String(l.get("when") ?? "")),
      notes: String(l.get("notes") ?? "") || void 0,
      photo_path: X(a)
    });
  }, o = (s) => i("log_other", { baby: t, name: s });
  return d`
        <form @submit=${n}>
            <h2>Log activity</h2>
            <div class="quick-other" role="group" aria-label="Quick activities">
                ${Qi.map(
    (s) => d`
                        <button
                            type="button"
                            class="quick"
                            @click=${() => o(s)}
                        >
                            ${s}
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
            <label for="when">When</label>
            ${L({ id: "when", value: ht() })}
            <label for="notes">Notes</label>
            ${Y(e)}
            ${G(e)}
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function tr(e, t, i, r, n, o) {
  const s = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: r ? `Log ${r.replace("_", " ")} feeding` : "Log feeding"
  };
  return d`
        <form @submit=${(l) => {
    l.preventDefault();
    const c = l.currentTarget, b = new FormData(c), h = W(String(b.get("started") ?? "")), g = W(String(b.get("ended") ?? "")), f = String(b.get("notes") ?? "") || void 0, m = X(c);
    if (!g) {
      const $ = {
        baby: t,
        started_at: h,
        photo_path: m
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
          w = "start_feeding", $.method = r;
          break;
      }
      n(w, $);
      return;
    }
    const y = {
      baby: t,
      started_at: h,
      ended_at: g,
      notes: f,
      photo_path: m
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
        p = "log_feeding", y.method = r;
        break;
    }
    n(p, y);
  }}>
            <h2>${s[i]}</h2>
            <label for="started">Started</label>
            ${L({
    id: "started",
    value: ht(),
    required: !0
  })}
            <label for="ended">Ended <span class="muted">(optional)</span></label>
            ${L({
    id: "ended",
    placeholder: "leave blank for an open session"
  })}
            <label for="notes">Notes</label>
            ${Y(e)}
            ${G(e)}
            <div class="actions">
                <button type="button" @click=${o}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function er(e, t, i, r) {
  return d`
        <form @submit=${(o) => {
    o.preventDefault();
    const s = o.currentTarget, a = new FormData(s), l = W(String(a.get("when") ?? ""));
    i("log_feeding", {
      baby: t,
      method: "solids",
      started_at: l,
      ended_at: l,
      notes: String(a.get("notes") ?? "") || void 0,
      photo_path: X(s)
    });
  }}>
            <h2>Log solids</h2>
            <label for="notes"
                >What was fed <span class="muted">(optional)</span></label
            >
            ${Y(e, {
    placeholder: "e.g. banana, oatmeal",
    autofocus: !0
  })}
            <label for="when">When</label>
            ${L({ id: "when", value: ht() })}
            ${G(e)}
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
const ir = [
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
], rr = {
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
function ge(e) {
  return rr[e] ?? e;
}
function nr(e, t, i, r, n, o, s) {
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
    const v = String(w.get("dose_number") ?? "").trim(), E = v === "" ? void 0 : Number(v), P = String(w.get("site") ?? "").trim() || void 0, S = String(w.get("lot_number") ?? "").trim() || void 0, D = String(w.get("provider") ?? "").trim() || void 0;
    o("log_vaccine", {
      baby: t,
      name: u,
      dose_number: E,
      site: P,
      lot_number: S,
      provider: D,
      timestamp: Yt(String(w.get("when") ?? "")),
      notes: String(w.get("notes") ?? "") || void 0,
      photo_path: X($)
    });
  }, c = Array.from(
    new Set(
      [...ir, ...n].filter((p) => !!p && p !== "none").map(ge)
    )
  ).sort((p, $) => p.localeCompare($)), b = i && i !== "none" ? ge(i) : "", h = !!b && c.includes(b), g = !!b && !h, f = h ? b : g ? "__other__" : "", m = g ? b : "";
  return d`
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
                <option value="" disabled ?selected=${f === ""}>
                    (pick one)
                </option>
                ${c.map(
    (p) => d`<option
                        value=${p}
                        ?selected=${f === p}
                    >
                        ${p}
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
                .value=${r != null ? String(r) : ""}
            />
            <label for="site">Site</label>
            <select id="site" name="site">
                <option value="">(unspecified)</option>
                ${a.map(
    (p) => d`<option value=${p}>${p.replace("_", " ")}</option>`
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
            ${Gt({ id: "when", value: Kt() })}
            <label for="notes">Notes</label>
            ${Y(e)}
            ${G(e)}
            <div class="actions">
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Xt(e, t, i, r, n, o, s) {
  let a = C;
  if (t !== null)
    switch (t.kind) {
      case "diaper":
        a = Ki(e, t.baby, r, o);
        break;
      case "bottle":
        a = ji(
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
        a = er(e, t.baby, r, o);
        break;
      case "other":
        a = Ji(e, t.baby, r, o);
        break;
      case "session":
        a = tr(
          e,
          t.baby,
          t.activity,
          t.method,
          r,
          o
        );
        break;
      case "end_sleep_first":
        a = Xi(
          t.baby,
          t.babyName,
          t.label,
          t.then,
          n,
          o
        );
        break;
      case "confirm_delete_imported":
        a = Wi(
          t.entryId,
          t.entryType,
          t.source,
          t.staff ?? null,
          r,
          o
        );
        break;
      case "edit_entry":
        a = Yi(
          e,
          t.entry,
          r,
          o,
          s
        );
        break;
      case "log_growth":
        a = Zi(e, t.baby, i, r, o);
        break;
      case "log_vaccine":
        a = nr(
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
function He(e, t) {
  return !e.source || e.source === "user" ? (t(e.id), null) : {
    kind: "confirm_delete_imported",
    entryId: e.id,
    entryType: e.type ?? "entry",
    source: e.source,
    staff: e.staff ?? null
  };
}
function Ie(e, t) {
  const i = e.querySelector("dialog");
  i && (t && !i.open && i.showModal(), !t && i.open && i.close());
}
const ze = U`
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
`, zt = 24 * 60 * 60 * 1e3, me = 29.5735, fe = [
  { key: "bottle", label: "Bottle", color: "var(--primary-color, #4a90e2)" },
  { key: "breast", label: "Breast", color: "var(--success-color, #43a047)" },
  { key: "solids", label: "Solids", color: "var(--warning-color, #f5a623)" }
], _e = [
  { key: "wet", label: "Wet", color: "var(--info-color, #4fc3f7)" },
  { key: "dirty", label: "Dirty", color: "var(--accent-color, #f57c00)" },
  { key: "both", label: "Both", color: "var(--error-color, #d32f2f)" }
];
function or(e) {
  return {
    label: e,
    sleepMinutes: 0,
    bottleMl: 0,
    feedingByCategory: { bottle: 0, breast: 0, solids: 0 },
    diaperByCategory: { wet: 0, dirty: 0, both: 0 }
  };
}
function sr(e) {
  return e === "bottle" ? "bottle" : e === "breast_left" || e === "breast_right" ? "breast" : e === "solids" ? "solids" : null;
}
function ar(e) {
  return e === "wet" || e === "dirty" || e === "both" ? e : null;
}
function lr(e) {
  return {
    feedings: e.feedingByCategory.bottle + e.feedingByCategory.breast + e.feedingByCategory.solids,
    diapers: e.diaperByCategory.wet + e.diaperByCategory.dirty + e.diaperByCategory.both
  };
}
function cr(e, t, i = 7) {
  var y, p, $, w, x, _;
  const r = (y = e == null ? void 0 : e.states) == null ? void 0 : y[A(t, "recent_entries")], n = ((p = r == null ? void 0 : r.attributes) == null ? void 0 : p.entries) ?? [], o = Date.now(), s = new Date(o);
  s.setHours(0, 0, 0, 0);
  const a = [], l = (u) => u.toLocaleDateString([], { weekday: "short" });
  for (let u = i - 1; u >= 0; u--) {
    const v = new Date(s.getTime() - u * zt);
    a.push(or(l(v)));
  }
  const c = s.getTime() - (i - 1) * zt;
  for (const u of n) {
    const v = Date.parse(u == null ? void 0 : u.timestamp);
    if (!Number.isFinite(v)) continue;
    const E = Math.floor((v - c) / zt);
    if (E < 0 || E >= i) continue;
    const P = a[E];
    if (u.type === "feeding") {
      const S = sr(String((($ = u == null ? void 0 : u.data) == null ? void 0 : $.method) ?? ""));
      S && (P.feedingByCategory[S] += 1);
      const D = Number(((w = u == null ? void 0 : u.data) == null ? void 0 : w.amount) ?? 0), B = String(((x = u == null ? void 0 : u.data) == null ? void 0 : x.unit) ?? "");
      D > 0 && B === "oz" ? P.bottleMl += D * me : D > 0 && B === "ml" && (P.bottleMl += D);
    } else if (u.type === "diaper") {
      const S = ar(String(((_ = u == null ? void 0 : u.data) == null ? void 0 : _.kind) ?? ""));
      S && (P.diaperByCategory[S] += 1);
    } else if (u.type === "sleep") {
      const S = u != null && u.ended_at && u.ended_at !== "" ? Date.parse(u.ended_at) : o;
      Number.isFinite(S) && S > v && (P.sleepMinutes += (S - v) / 6e4);
    }
  }
  const b = a.map(lr);
  if (a.every(
    (u, v) => u.sleepMinutes === 0 && b[v].feedings === 0 && b[v].diapers === 0
  ))
    return "";
  const h = a.map((u) => ({
    label: u.label,
    value: u.sleepMinutes
  })), g = a.map((u) => ({
    label: u.label,
    parts: fe.map((v) => ({
      ...v,
      value: u.feedingByCategory[v.key]
    }))
  })), f = a.map((u) => ({
    label: u.label,
    value: u.bottleMl
  })), m = a.map((u) => ({
    label: u.label,
    parts: _e.map((v) => ({
      ...v,
      value: u.diaperByCategory[v.key]
    }))
  }));
  return d`
        <div class="section" role="region" aria-label="Trends">
            <h2>Trends · last ${i} days</h2>
            <bt-chart-lightbox
                label="Sleep (min/day)"
                .renderChart=${() => ye(
    h,
    "Sleep (min/day)",
    (u) => `${Math.round(u)}`
  )}
            ></bt-chart-lightbox>
            <bt-chart-lightbox
                label="Feedings/day"
                .renderChart=${() => ve(
    g,
    "Feedings/day",
    fe,
    (u) => `${u}`
  )}
            ></bt-chart-lightbox>
            <bt-chart-lightbox
                label="Bottle (oz/day)"
                .renderChart=${() => ye(
    f,
    "Bottle (oz/day)",
    (u) => (u / me).toFixed(1)
  )}
            ></bt-chart-lightbox>
            <bt-chart-lightbox
                label="Diapers/day"
                .renderChart=${() => ve(
    m,
    "Diapers/day",
    _e,
    (u) => `${u}`
  )}
            ></bt-chart-lightbox>
        </div>
    `;
}
function ye(e, t, i) {
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
    const h = 14 + b * l, g = l * 0.7, f = h + (l - g) / 2, m = Math.max(
      c.value > 0 ? 2 : 0,
      c.value / a * (90 - 24 * 2)
    ), y = 66 - m;
    return R`
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
function ve(e, t, i, r) {
  const l = e.map((h) => h.parts.reduce((g, f) => g + f.value, 0)), c = Math.max(1, ...l), b = (320 - 14 * 2) / e.length;
  return d`
        <div class="trend">
            <div class="label-row">
                <div class="label">${t}</div>
                <div class="legend">
                    ${i.map(
    (h) => d`
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
                aria-label=${t}
                style="width:100%;height:${90}px;"
            >
                ${e.map((h, g) => {
    const f = 14 + g * b, m = b * 0.7, y = f + (b - m) / 2, p = l[g], $ = Math.max(
      p > 0 ? 2 : 0,
      p / c * (90 - 24 * 2)
    ), w = 66;
    let x = w;
    const _ = h.parts.map((u) => {
      if (u.value <= 0) return R``;
      const v = u.value / p * $;
      return x -= v, R`
                            <rect
                                x=${y}
                                y=${x}
                                width=${m}
                                height=${v}
                                fill=${u.color}
                            >
                                <title>${u.label}: ${u.value}</title>
                            </rect>
                        `;
    });
    return R`
                        ${_}
                        <text
                            x=${y + m / 2}
                            y=${w - $ - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${p > 0 ? r(p) : ""}
                        </text>
                        <text
                            x=${y + m / 2}
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
function dr(e) {
  if (!e) return "—";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "—" : new Date(t).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function Ut(e) {
  var r, n;
  const t = String(((r = e == null ? void 0 : e.data) == null ? void 0 : r.name) ?? "vaccine"), i = (n = e == null ? void 0 : e.data) == null ? void 0 : n.dose_number;
  return i != null ? `${t} dose ${i}` : t;
}
function ur(e, t) {
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
                        aria-label=${t ? `Edit ${Ut(i)}` : Ut(i)}
                        @click=${t ? () => t(i) : void 0}
                        @keydown=${t ? (n) => {
        (n.key === "Enter" || n.key === " ") && (n.preventDefault(), t(i));
      } : void 0}
                    >
                        <span class="vh-date muted"
                            >${dr(i.timestamp)}</span
                        >
                        <span class="vh-name">${Ut(i)}</span>
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
function pr(e, t, i) {
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
var hr = Object.defineProperty, br = Object.getOwnPropertyDescriptor, nt = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? br(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && hr(t, i, n), n;
};
const gr = ["vaccines", "growth", "trends", "export"];
let I = class extends M {
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
      this._modal = He(
        e,
        (t) => this.hass.callService("babytracker", "delete_entry", { entry_id: t })
      );
    }, this._requestLogVaccine = () => {
      var s, a, l, c, b;
      if (!((s = this._config) != null && s.baby)) return;
      const e = (l = (a = this.hass) == null ? void 0 : a.states) == null ? void 0 : l[A(this._config.baby, "vaccines_due")], t = e != null && e.state && e.state !== "none" && e.state !== "unknown" ? String(e.state) : "", i = (c = e == null ? void 0 : e.attributes) == null ? void 0 : c.dose_number, r = typeof i == "number" ? i : void 0, o = (Array.isArray((b = e == null ? void 0 : e.attributes) == null ? void 0 : b.upcoming) ? e.attributes.upcoming : []).map((h) => h && typeof h.name == "string" ? h.name : null).filter((h) => !!h);
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
    (e.has("hass") || e.has("_config")) && this._maybeSubscribe(), e.has("_modal") && Ie(this.renderRoot, this._modal);
  }
  _maybeSubscribe() {
    var e, t;
    !this.hass || !this._config || (this._unsubOptions || (this._unsubOptions = De(
      this.hass,
      (i) => {
        this._options = i;
      }
    )), !this._unsubVaccines && this._sections.includes("vaccines") && ((e = this._config) != null && e.baby) && (this._unsubVaccines = di(
      this.hass,
      this._config.baby,
      (i) => {
        this._vaccines = Array.isArray(i) ? i : [];
      }
    )), !this._unsubGrowth && this._sections.includes("growth") && ((t = this._config) != null && t.baby) && (this._unsubGrowth = ui(
      this.hass,
      this._config.baby,
      (i) => {
        this._growth = Array.isArray(i) ? i : [];
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? gr;
  }
  render() {
    if (!this.hass || !this._config) return d``;
    const e = this._sections;
    return d`
            <ha-card>
                ${e.includes("vaccines") ? d`
                          ${pr(
      this.hass,
      this._config.baby,
      this._requestLogVaccine
    )}
                          ${ur(
      this._vaccines,
      this._requestEditEntry
    )}
                      ` : ""}
                ${e.includes("growth") ? Re(
      this.hass,
      this._config.baby,
      this._options,
      this._config.units,
      this._requestLogGrowth,
      this._growth[0],
      this._requestEditEntry,
      this._growth
    ) : ""}
                ${e.includes("trends") ? cr(
      this.hass,
      this._config.baby,
      this._config.trend_days ?? 7
    ) : ""}
                ${e.includes("export") ? Le(this.hass, this._config.baby) : ""}
            </ha-card>
            ${Xt(
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
I.styles = U`
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
        ${ze}
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
nt([
  T({ attribute: !1 })
], I.prototype, "hass", 2);
nt([
  k()
], I.prototype, "_config", 2);
nt([
  k()
], I.prototype, "_options", 2);
nt([
  k()
], I.prototype, "_modal", 2);
nt([
  k()
], I.prototype, "_vaccines", 2);
nt([
  k()
], I.prototype, "_growth", 2);
I = nt([
  K("babytracker-summary-card")
], I);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-summary-card",
  name: "babytracker — summary",
  description: "Vaccines, growth, 7-day trend charts, and pediatrician export for one baby."
});
var mr = Object.defineProperty, fr = Object.getOwnPropertyDescriptor, ot = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? fr(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && mr(t, i, n), n;
};
function $e(e) {
  return String(e).padStart(2, "0");
}
function St(e) {
  return `${e.getFullYear()}-${$e(e.getMonth() + 1)}-${$e(e.getDate())}`;
}
function $t(e) {
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
  if (!t) return null;
  const i = Number(t[1]), r = Number(t[2]) - 1, n = Number(t[3]), o = new Date(i, r, n, 0, 0, 0, 0);
  return Number.isNaN(o.getTime()) ? null : o;
}
function _r(e) {
  const t = $t(e) ?? /* @__PURE__ */ new Date(), i = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0), r = new Date(
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
function yr(e, t) {
  const i = $t(e) ?? /* @__PURE__ */ new Date();
  return i.setDate(i.getDate() + t), St(i);
}
function vr(e) {
  const t = $t(e);
  return t ? t.toLocaleDateString([], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : e;
}
let z = class extends M {
  constructor() {
    super(...arguments), this._date = St(/* @__PURE__ */ new Date()), this._entries = [], this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._today = () => {
      this._date = St(/* @__PURE__ */ new Date());
    }, this._onDateChange = (e) => {
      const t = e.currentTarget.value;
      t && $t(t) && (this._date = t);
    }, this._requestEdit = (e) => {
      this._modal = { kind: "edit_entry", entry: e };
    }, this._requestDelete = (e) => {
      this._modal = He(
        e,
        (t) => this.hass.callService("babytracker", "delete_entry", { entry_id: t })
      );
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
    this._config = { ...e }, e.initial_date && $t(e.initial_date) && (this._date = e.initial_date);
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
    (e.has("hass") || e.has("_config") || e.has("_date")) && this._resubscribe(), e.has("_modal") && Ie(this.renderRoot, this._modal);
  }
  _resubscribe() {
    var i, r;
    if (!this.hass || !((i = this._config) != null && i.baby)) return;
    (r = this._unsubEntries) == null || r.call(this);
    const { startIso: e, endIso: t } = _r(this._date);
    this._unsubEntries = ci(
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
    this._date = yr(this._date, e);
  }
  render() {
    if (!this.hass || !this._config) return d``;
    const e = this._date === St(/* @__PURE__ */ new Date());
    return d`
            <ha-card>
                <h2>History — ${vr(this._date)}</h2>
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
      (t) => Oe(
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
            ${Xt(
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
z.styles = U`
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
        ${ze}
    `;
ot([
  T({ attribute: !1 })
], z.prototype, "hass", 2);
ot([
  k()
], z.prototype, "_config", 2);
ot([
  k()
], z.prototype, "_date", 2);
ot([
  k()
], z.prototype, "_entries", 2);
ot([
  k()
], z.prototype, "_modal", 2);
ot([
  k()
], z.prototype, "_expandedNotes", 2);
z = ot([
  K("babytracker-history-card")
], z);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-history-card",
  name: "babytracker — history",
  description: "Paginate through one baby's entries by calendar day with edit + delete."
});
var $r = Object.defineProperty, wr = Object.getOwnPropertyDescriptor, Z = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? wr(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && $r(t, i, n), n;
};
const xr = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "recent",
  "importer_sync"
];
let O = class extends M {
  constructor() {
    super(...arguments), this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._handleService = async (e, t, i) => {
      const r = i instanceof HTMLElement && i.classList.contains("quick") ? i : null;
      try {
        const n = await ai(this.hass, "babytracker", e, t);
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
    super.connectedCallback(), this._maybeSubscribe(), this._clockTimer == null && (this._clockTimer = setInterval(() => this.requestUpdate(), 3e4));
  }
  disconnectedCallback() {
    var e, t;
    (e = this._unsubBaby) == null || e.call(this), (t = this._unsubOptions) == null || t.call(this), this._unsubBaby = void 0, this._unsubOptions = void 0, this._clockTimer != null && (clearInterval(this._clockTimer), this._clockTimer = void 0), super.disconnectedCallback();
  }
  updated(e) {
    var t;
    (e.has("hass") || e.has("_config")) && this._maybeSubscribe(), e.has("_modal") && (this._modal && this._dialog && !this._dialog.open ? this._dialog.showModal() : !this._modal && ((t = this._dialog) != null && t.open) && this._dialog.close());
  }
  _maybeSubscribe() {
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = li(
      this.hass,
      this._config.baby,
      (e) => {
        this._babyConfig = e;
      }
    )), this._unsubOptions || (this._unsubOptions = De(
      this.hass,
      (e) => {
        this._options = e;
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? xr;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(e, t = "sensor") {
    return A(this._baby(), e, t);
  }
  /** Status chip fragments (no wrapper). Caller wraps these together
   *  with the 24 h chips inside a single `.chips` flex row so the two
   *  groups flow continuously instead of breaking onto separate
   *  lines.
   */
  _renderStatusChips() {
    var l, c, b, h, g, f, m, y, p, $, w, x, _;
    const e = this.hass, t = (c = (l = e.states) == null ? void 0 : l[this._entityId("last_feeding")]) == null ? void 0 : c.state, i = (h = (b = e.states) == null ? void 0 : b[this._entityId("last_diaper")]) == null ? void 0 : h.state, r = ((f = (g = e.states) == null ? void 0 : g[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : f.state) === "on", n = ((y = (m = e.states) == null ? void 0 : m[this._entityId("walking", "binary_sensor")]) == null ? void 0 : y.state) === "on", o = (($ = (p = e.states) == null ? void 0 : p[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : $.state) === "on", s = ((_ = (x = (w = e.states) == null ? void 0 : w[this._entityId("recent_entries")]) == null ? void 0 : x.attributes) == null ? void 0 : _.entries) ?? [], a = r ? null : mi(s);
    return d`
            <div class="chip" role="listitem">
                Last feed: ${this._timeSince(t)}
            </div>
            <div class="chip" role="listitem">
                Last diaper: ${this._timeSince(i)}
            </div>
            ${a !== null ? d`<div class="chip" role="listitem">
                      Awake for: ${Me(a)}
                  </div>` : ""}
            ${r ? d`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
            ${n ? d`<div class="chip warning" role="listitem">On a walk</div>` : ""}
            ${o ? d`<div class="chip warning" role="listitem">At daycare</div>` : ""}
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
    var r;
    if (!this.hass || !this._config) return d``;
    const e = this._sections, t = e.includes("status"), i = e.includes("today");
    return d`
            <ha-card>
                <h2>${jt(((r = this._babyConfig) == null ? void 0 : r.name) ?? this._baby())}</h2>
                ${t || i ? d`<div
                          class="chips"
                          role="list"
                          aria-label="Status and last 24 hours"
                      >
                          ${t ? this._renderStatusChips() : ""}
                          ${i ? Di(
      this.hass,
      this._baby(),
      this._babyConfig
    ) : ""}
                      </div>` : ""}
                ${e.includes("active_session") ? hi(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("quick_log") ? pi(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${e.includes("growth") ? Re(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${e.includes("recent") ? xi(
      this.hass,
      this._baby(),
      this._requestEdit,
      this._config.recent_limit ?? 50,
      this._expandedNotes,
      this._toggleNotes
    ) : ""}
                ${e.includes("importer_sync") ? Pi(
      this._babyConfig,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("export") ? Le(this.hass, this._baby()) : ""}
            </ha-card>
            ${Xt(
      this.hass,
      this._modal,
      this._options,
      this._submitModal,
      (n, o) => this._handleService(n, o),
      this._closeModal,
      this._requestDelete
    )}
        `;
  }
};
O.styles = U`
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
Z([
  T({ attribute: !1 })
], O.prototype, "hass", 2);
Z([
  k()
], O.prototype, "_config", 2);
Z([
  k()
], O.prototype, "_babyConfig", 2);
Z([
  k()
], O.prototype, "_options", 2);
Z([
  k()
], O.prototype, "_modal", 2);
Z([
  k()
], O.prototype, "_expandedNotes", 2);
Z([
  Pe("dialog")
], O.prototype, "_dialog", 2);
O = Z([
  K("babytracker-card")
], O);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => Cr);
var kr = Object.defineProperty, Sr = Object.getOwnPropertyDescriptor, Zt = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? Sr(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (n = (r ? s(t, i, n) : s(n)) || n);
  return r && n && kr(t, i, n), n;
};
let it = class extends M {
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
it.styles = U`
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
Zt([
  T({ attribute: !1 })
], it.prototype, "hass", 2);
Zt([
  T({ attribute: !1 })
], it.prototype, "_config", 2);
it = Zt([
  K("babytracker-card-editor")
], it);
it.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const Cr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return it;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  O as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
