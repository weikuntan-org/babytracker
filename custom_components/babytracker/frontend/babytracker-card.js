/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, et = V.ShadowRoot && (V.ShadyCSS === void 0 || V.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, st = Symbol(), ct = /* @__PURE__ */ new WeakMap();
let wt = class {
  constructor(t, s, i) {
    if (this._$cssResult$ = !0, i !== st) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (et && t === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (t = ct.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && ct.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Dt = (e) => new wt(typeof e == "string" ? e : e + "", void 0, st), it = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, r, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new wt(s, e, st);
}, Pt = (e, t) => {
  if (et) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), r = V.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = s.cssText, e.appendChild(i);
  }
}, dt = et ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return Dt(s);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Mt, defineProperty: Lt, getOwnPropertyDescriptor: Nt, getOwnPropertyNames: Ut, getOwnPropertySymbols: Ht, getPrototypeOf: It } = Object, w = globalThis, ut = w.trustedTypes, zt = ut ? ut.emptyScript : "", Y = w.reactiveElementPolyfillSupport, I = (e, t) => e, G = { toAttribute(e, t) {
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
  let s = e;
  switch (t) {
    case Boolean:
      s = e !== null;
      break;
    case Number:
      s = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(e);
      } catch {
        s = null;
      }
  }
  return s;
} }, rt = (e, t) => !Mt(e, t), ht = { attribute: !0, type: String, converter: G, reflect: !1, useDefault: !1, hasChanged: rt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), w.litPropertyMetadata ?? (w.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let D = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = ht) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, s);
      r !== void 0 && Lt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: r, set: n } = Nt(this.prototype, t) ?? { get() {
      return this[s];
    }, set(o) {
      this[s] = o;
    } };
    return { get: r, set(o) {
      const l = r == null ? void 0 : r.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, l, i);
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
      const s = this.properties, i = [...Ut(s), ...Ht(s)];
      for (const r of i) this.createProperty(r, s[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const s = litPropertyMetadata.get(t);
      if (s !== void 0) for (const [i, r] of s) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const r = this._$Eu(s, i);
      r !== void 0 && this._$Eh.set(r, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const s = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) s.unshift(dt(r));
    } else t !== void 0 && s.push(dt(t));
    return s;
  }
  static _$Eu(t, s) {
    const i = s.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((s) => this.enableUpdating = s), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((s) => s(this));
  }
  addController(t) {
    var s;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((s = t.hostConnected) == null || s.call(t));
  }
  removeController(t) {
    var s;
    (s = this._$EO) == null || s.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Pt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((s) => {
      var i;
      return (i = s.hostConnected) == null ? void 0 : i.call(s);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((s) => {
      var i;
      return (i = s.hostDisconnected) == null ? void 0 : i.call(s);
    });
  }
  attributeChangedCallback(t, s, i) {
    this._$AK(t, i);
  }
  _$ET(t, s) {
    var n;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : G).toAttribute(s, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, s) {
    var n, o;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const l = i.getPropertyOptions(r), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : G;
      this._$Em = r;
      const u = a.fromAttribute(s, l.type);
      this[r] = u ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? u, this._$Em = null;
    }
  }
  requestUpdate(t, s, i, r = !1, n) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (r === !1 && (n = this[t]), i ?? (i = l.getPropertyOptions(t)), !((i.hasChanged ?? rt)(n, s) || i.useDefault && i.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, i)))) return;
      this.C(t, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: i, reflect: r, wrapped: n }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? s ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, o] of r) {
        const { wrapped: l } = o, a = this[n];
        l !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, o, a);
      }
    }
    let t = !1;
    const s = this._$AL;
    try {
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), (i = this._$EO) == null || i.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(s)) : this._$EM();
    } catch (r) {
      throw t = !1, this._$EM(), r;
    }
    t && this._$AE(s);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var s;
    (s = this._$EO) == null || s.forEach((i) => {
      var r;
      return (r = i.hostUpdated) == null ? void 0 : r.call(i);
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((s) => this._$ET(s, this[s]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
D.elementStyles = [], D.shadowRootOptions = { mode: "open" }, D[I("elementProperties")] = /* @__PURE__ */ new Map(), D[I("finalized")] = /* @__PURE__ */ new Map(), Y == null || Y({ ReactiveElement: D }), (w.reactiveElementVersions ?? (w.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, pt = (e) => e, Z = z.trustedTypes, ft = Z ? Z.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, kt = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, St = "?" + v, Rt = `<${St}>`, E = document, R = () => E.createComment(""), q = (e) => e === null || typeof e != "object" && typeof e != "function", nt = Array.isArray, qt = (e) => nt(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", Q = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, bt = /-->/g, mt = />/g, k = RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), gt = /'/g, _t = /"/g, At = /^(?:script|style|textarea|title)$/i, jt = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), c = jt(1), M = Symbol.for("lit-noChange"), m = Symbol.for("lit-nothing"), yt = /* @__PURE__ */ new WeakMap(), S = E.createTreeWalker(E, 129);
function xt(e, t) {
  if (!nt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ft !== void 0 ? ft.createHTML(t) : t;
}
const Bt = (e, t) => {
  const s = e.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = H;
  for (let l = 0; l < s; l++) {
    const a = e[l];
    let u, f, d = -1, p = 0;
    for (; p < a.length && (o.lastIndex = p, f = o.exec(a), f !== null); ) p = o.lastIndex, o === H ? f[1] === "!--" ? o = bt : f[1] !== void 0 ? o = mt : f[2] !== void 0 ? (At.test(f[2]) && (r = RegExp("</" + f[2], "g")), o = k) : f[3] !== void 0 && (o = k) : o === k ? f[0] === ">" ? (o = r ?? H, d = -1) : f[1] === void 0 ? d = -2 : (d = o.lastIndex - f[2].length, u = f[1], o = f[3] === void 0 ? k : f[3] === '"' ? _t : gt) : o === _t || o === gt ? o = k : o === bt || o === mt ? o = H : (o = k, r = void 0);
    const b = o === k && e[l + 1].startsWith("/>") ? " " : "";
    n += o === H ? a + Rt : d >= 0 ? (i.push(u), a.slice(0, d) + kt + a.slice(d) + v + b) : a + v + (d === -2 ? l : b);
  }
  return [xt(e, n + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class j {
  constructor({ strings: t, _$litType$: s }, i) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [u, f] = Bt(t, s);
    if (this.el = j.createElement(u, i), S.currentNode = this.el.content, s === 2 || s === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = S.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(kt)) {
          const p = f[o++], b = r.getAttribute(d).split(v), h = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: n, name: h[2], strings: b, ctor: h[1] === "." ? Wt : h[1] === "?" ? Vt : h[1] === "@" ? Gt : J }), r.removeAttribute(d);
        } else d.startsWith(v) && (a.push({ type: 6, index: n }), r.removeAttribute(d));
        if (At.test(r.tagName)) {
          const d = r.textContent.split(v), p = d.length - 1;
          if (p > 0) {
            r.textContent = Z ? Z.emptyScript : "";
            for (let b = 0; b < p; b++) r.append(d[b], R()), S.nextNode(), a.push({ type: 2, index: ++n });
            r.append(d[p], R());
          }
        }
      } else if (r.nodeType === 8) if (r.data === St) a.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(v, d + 1)) !== -1; ) a.push({ type: 7, index: n }), d += v.length - 1;
      }
      n++;
    }
  }
  static createElement(t, s) {
    const i = E.createElement("template");
    return i.innerHTML = t, i;
  }
}
function L(e, t, s = e, i) {
  var o, l;
  if (t === M) return t;
  let r = i !== void 0 ? (o = s._$Co) == null ? void 0 : o[i] : s._$Cl;
  const n = q(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, s, i)), i !== void 0 ? (s._$Co ?? (s._$Co = []))[i] = r : s._$Cl = r), r !== void 0 && (t = L(e, r._$AS(e, t.values), r, i)), t;
}
class Ft {
  constructor(t, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: s }, parts: i } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? E).importNode(s, !0);
    S.currentNode = r;
    let n = S.nextNode(), o = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let u;
        a.type === 2 ? u = new B(n, n.nextSibling, this, t) : a.type === 1 ? u = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (u = new Zt(n, this, t)), this._$AV.push(u), a = i[++l];
      }
      o !== (a == null ? void 0 : a.index) && (n = S.nextNode(), o++);
    }
    return S.currentNode = E, r;
  }
  p(t) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, s), s += i.strings.length - 2) : i._$AI(t[s])), s++;
  }
}
class B {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, s, i, r) {
    this.type = 2, this._$AH = m, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = s.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, s = this) {
    t = L(this, t, s), q(t) ? t === m || t == null || t === "" ? (this._$AH !== m && this._$AR(), this._$AH = m) : t !== this._$AH && t !== M && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : qt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== m && q(this._$AH) ? this._$AA.nextSibling.data = t : this.T(E.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: s, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = j.createElement(xt(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(s);
    else {
      const o = new Ft(r, this), l = o.u(this.options);
      o.p(s), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let s = yt.get(t.strings);
    return s === void 0 && yt.set(t.strings, s = new j(t)), s;
  }
  k(t) {
    nt(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, r = 0;
    for (const n of t) r === s.length ? s.push(i = new B(this.O(R()), this.O(R()), this, this.options)) : i = s[r], i._$AI(n), r++;
    r < s.length && (this._$AR(i && i._$AB.nextSibling, r), s.length = r);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, s); t !== this._$AB; ) {
      const r = pt(t).nextSibling;
      pt(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var s;
    this._$AM === void 0 && (this._$Cv = t, (s = this._$AP) == null || s.call(this, t));
  }
}
class J {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, i, r, n) {
    this.type = 1, this._$AH = m, this._$AN = void 0, this.element = t, this.name = s, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = m;
  }
  _$AI(t, s = this, i, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = L(this, t, s, 0), o = !q(t) || t !== this._$AH && t !== M, o && (this._$AH = t);
    else {
      const l = t;
      let a, u;
      for (t = n[0], a = 0; a < n.length - 1; a++) u = L(this, l[i + a], s, a), u === M && (u = this._$AH[a]), o || (o = !q(u) || u !== this._$AH[a]), u === m ? t = m : t !== m && (t += (u ?? "") + n[a + 1]), this._$AH[a] = u;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === m ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Wt extends J {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === m ? void 0 : t;
  }
}
class Vt extends J {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== m);
  }
}
class Gt extends J {
  constructor(t, s, i, r, n) {
    super(t, s, i, r, n), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = L(this, t, s, 0) ?? m) === M) return;
    const i = this._$AH, r = t === m && i !== m || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== m && (i === m || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var s;
    typeof this._$AH == "function" ? this._$AH.call(((s = this.options) == null ? void 0 : s.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Zt {
  constructor(t, s, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    L(this, t);
  }
}
const X = z.litHtmlPolyfillSupport;
X == null || X(j, B), (z.litHtmlVersions ?? (z.litHtmlVersions = [])).push("3.3.3");
const Jt = (e, t, s) => {
  const i = (s == null ? void 0 : s.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = (s == null ? void 0 : s.renderBefore) ?? null;
    i._$litPart$ = r = new B(t.insertBefore(R(), n), n, void 0, s ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A = globalThis;
class x extends D {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var s;
    const t = super.createRenderRoot();
    return (s = this.renderOptions).renderBefore ?? (s.renderBefore = t.firstChild), t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Jt(s, this.renderRoot, this.renderOptions);
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
    return M;
  }
}
var vt;
x._$litElement$ = !0, x.finalized = !0, (vt = A.litElementHydrateSupport) == null || vt.call(A, { LitElement: x });
const tt = A.litElementPolyfillSupport;
tt == null || tt({ LitElement: x });
(A.litElementVersions ?? (A.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Kt = { attribute: !0, type: String, converter: G, reflect: !1, hasChanged: rt }, Yt = (e = Kt, t, s) => {
  const { kind: i, metadata: r } = s;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(s.name, e), i === "accessor") {
    const { name: o } = s;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, e, l), l;
    } };
  }
  if (i === "setter") {
    const { name: o } = s;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function F(e) {
  return (t, s) => typeof s == "object" ? Yt(e, t, s) : ((i, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, s);
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
const Qt = (e, t, s) => (s.configurable = !0, s.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, s), s);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Xt(e, t) {
  return (s, i, r) => {
    const n = (o) => {
      var l;
      return ((l = o.renderRoot) == null ? void 0 : l.querySelector(e)) ?? null;
    };
    return Qt(s, i, { get() {
      return n(this);
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
function se(e, t, s, i) {
  const r = (e == null ? void 0 : e.enabled_activities) ?? te, n = (e == null ? void 0 : e.enabled_feeding_methods) ?? ee, o = (a) => a.charAt(0).toUpperCase() + a.slice(1), l = [];
  if (r.includes("diaper") && l.push(
    c`
                <button
                    class="quick"
                    aria-label="Log diaper for ${t}"
                    @click=${() => i("diaper")}
                >
                    Diaper
                </button>
            `
  ), r.includes("feeding"))
    for (const a of n)
      a === "bottle" ? l.push(
        c`
                        <button
                            class="quick"
                            aria-label="Log bottle feeding for ${t}"
                            @click=${() => i("bottle")}
                        >
                            Bottle
                        </button>
                    `
      ) : a === "solids" ? l.push(
        c`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${t}"
                            @click=${() => i("solids")}
                        >
                            Solids
                        </button>
                    `
      ) : (a === "breast_left" || a === "breast_right") && l.push(
        c`
                        <button
                            class="quick"
                            aria-label="Log ${a} feeding for ${t}"
                            @click=${() => i({ activity: "feeding", method: a })}
                        >
                            ${o(a.replace("_", " "))}
                        </button>
                    `
      );
  return r.includes("sleep") && l.push(
    c`
                <button
                    class="quick"
                    aria-label="Log sleep for ${t}"
                    @click=${() => i({ activity: "sleep" })}
                >
                    Sleep
                </button>
            `
  ), r.includes("tummy_time") && l.push(
    c`
                <button
                    class="quick"
                    aria-label="Log tummy time for ${t}"
                    @click=${() => i({ activity: "tummy_time" })}
                >
                    Tummy time
                </button>
            `
  ), r.includes("walk") && l.push(
    c`
                <button
                    class="quick"
                    aria-label="Log walk for ${t}"
                    @click=${() => i({ activity: "walk" })}
                >
                    Walk
                </button>
            `
  ), r.includes("other") && l.push(
    c`
                <button
                    class="quick"
                    aria-label="Log other activity for ${t}"
                    @click=${() => i("other")}
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
function _(e, t, s = "sensor") {
  return `${s}.babytracker_${e}_${t}`;
}
async function ie(e, t, s, i) {
  return e.callService(t, s, i);
}
function re(e, t, s) {
  const i = {};
  return (async () => {
    try {
      const r = await e.connection.subscribeMessage(
        s,
        { type: "babytracker/get_baby_config", baby: t, subscribe: !0 }
      );
      i.current = r;
    } catch (r) {
      console.warn("babytracker: subscribeBabyConfig failed", r);
    }
  })(), () => {
    var r;
    return (r = i.current) == null ? void 0 : r.call(i);
  };
}
function Et(e, t) {
  const s = {};
  return (async () => {
    try {
      const i = await e.connection.subscribeMessage(
        t,
        { type: "babytracker/get_integration_options", subscribe: !0 }
      );
      s.current = i;
    } catch (i) {
      console.warn(
        "babytracker: subscribeIntegrationOptions failed",
        i
      );
    }
  })(), () => {
    var i;
    return (i = s.current) == null ? void 0 : i.call(s);
  };
}
function ne(e, t, s) {
  var a, u, f, d, p, b;
  const i = ((a = e.states[_(t, "sleeping", "binary_sensor")]) == null ? void 0 : a.state) === "on", r = ((u = e.states[_(t, "feeding", "binary_sensor")]) == null ? void 0 : u.state) === "on", n = ((f = e.states[_(t, "tummy_time", "binary_sensor")]) == null ? void 0 : f.state) === "on", o = ((d = e.states[_(t, "walking", "binary_sensor")]) == null ? void 0 : d.state) === "on";
  if (!i && !r && !n && !o) return "";
  const l = [];
  if (i) {
    const h = (p = e.states[_(t, "last_sleep_start")]) == null ? void 0 : p.state;
    l.push(
      c`
                <div class="chip warning" role="status">
                    Sleeping ${h ? c`· started ${$t(h)}` : ""}
                    <button
                        aria-label="End sleep"
                        @click=${(g) => s("end_sleep", { baby: t }, g.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  if (r && l.push(
    c`
                <div class="chip warning" role="status">
                    Feeding
                    <button
                        aria-label="End feeding"
                        @click=${(h) => s("end_feeding", { baby: t }, h.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), n && l.push(
    c`
                <div class="chip warning" role="status">
                    Tummy time
                    <button
                        aria-label="End tummy time"
                        @click=${(h) => s("end_tummy_time", { baby: t }, h.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), o) {
    const h = (b = e.states[_(t, "last_walk_start")]) == null ? void 0 : b.state;
    l.push(
      c`
                <div class="chip warning" role="status">
                    Walking ${h ? c`· started ${$t(h)}` : ""}
                    <button
                        aria-label="End walk"
                        @click=${(g) => s("end_walk", { baby: t }, g.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  return c`<div class="section">${l}</div>`;
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
function P(e) {
  if (!e) return 0;
  const t = Date.parse(e);
  return Number.isNaN(t) ? 0 : t;
}
function oe(e, t = Tt, s = Date.now()) {
  const i = s - t;
  return e.filter((r) => P(r.timestamp) >= i).slice().sort((r, n) => P(n.timestamp) - P(r.timestamp));
}
function ae(e, t = Date.now(), s = Tt) {
  var u, f, d;
  const i = t - s;
  let r = 0, n = 0, o = 0, l = 0, a = 0;
  for (const p of e) {
    const b = P(p.timestamp);
    if (p.type === "sleep") {
      const h = b, g = p.ended_at != null && p.ended_at !== "" ? P(p.ended_at) : t;
      if (h > 0 && g > h && g > i) {
        const $ = Math.max(h, i), lt = Math.min(g, t);
        lt > $ && (a += (lt - $) / 6e4);
      }
      continue;
    }
    if (!(b < i)) {
      if (p.type === "feeding") {
        r += 1;
        const h = Number(((u = p.data) == null ? void 0 : u.amount) ?? 0), g = String(((f = p.data) == null ? void 0 : f.unit) ?? "");
        h > 0 && (l += g === "oz" ? h * Ct : h);
      } else if (p.type === "diaper") {
        const h = String(((d = p.data) == null ? void 0 : d.kind) ?? "");
        h === "wet" ? n += 1 : h === "dirty" ? o += 1 : h === "both" && (n += 1, o += 1);
      }
    }
  }
  return { feedings: r, wetDiapers: n, dirtyDiapers: o, totalVolumeMl: l, sleepMinutes: a };
}
function le(e) {
  if (!Number.isFinite(e) || e <= 0) return "0m";
  if (e < 60) return `${Math.round(e)}m`;
  const t = Math.floor(e / 60), s = Math.round(e % 60);
  return s === 0 ? `${t}h` : `${t}h ${s}m`;
}
function ce(e) {
  if (!Number.isFinite(e) || e <= 0) return "0 oz";
  const t = e / Ct;
  return t >= 1 ? `${t.toFixed(1)} oz` : `${Math.round(e)} ml`;
}
function de(e) {
  const t = P(e);
  return t === 0 ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function ue(e, t, s, i) {
  var l;
  const r = e.states[_(t, "recent_entries")], n = ((l = r == null ? void 0 : r.attributes) == null ? void 0 : l.entries) ?? [], o = oe(n).slice(0, Math.min(i, 50));
  return c`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${o.length === 0 ? c`<p>Nothing logged yet.</p>` : c`
                      <ul class="entries">
                          ${o.map(
    (a) => c`
                                  <li>
                                      <span aria-label="Entry type"
                                          >${he(a)}</span
                                      >
                                      <span class="muted"
                                          >${de(a.timestamp)}</span
                                      >
                                      ${a.photo_path ? c`<span aria-label="Has photo"
                                                >📷</span
                                            >` : ""}
                                      ${a.staff ? c`<span
                                                class="muted"
                                                aria-label="Logged by Procare staff"
                                                >via ${a.staff}</span
                                            >` : ""}
                                      <span class="spacer"></span>
                                      <button
                                          aria-label="Delete entry"
                                          @click=${() => s({
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
  const t = String(e.type ?? ""), s = (e == null ? void 0 : e.data) ?? {}, i = s.name ?? s.method ?? s.kind;
  return i ? t === "feeding" && s.amount != null && s.amount !== "" && s.unit ? `${t} (${i}, ${s.amount} ${s.unit})` : `${t} (${i})` : t;
}
function pe(e, t) {
  var r, n;
  const s = e.states[_(t, "vaccines_due")];
  if (!s || s.state === "unknown") return "";
  const i = ((r = e.states[_(t, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : r.state) === "on";
  return c`
        <div
            class="section chip ${i ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${s.state}</strong>
            ${(n = s.attributes) != null && n.due_on ? c`<span>(${s.attributes.due_on})</span>` : ""}
            ${i ? c`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
        </div>
    `;
}
function Ot(e, t, s, i) {
  var d, p, b, h, g;
  const r = (i == null ? void 0 : i.weight) ?? (s == null ? void 0 : s.weight_unit) ?? "kg", n = (i == null ? void 0 : i.length) ?? (s == null ? void 0 : s.length_unit) ?? "cm", o = ((d = e.states[_(t, "weight")]) == null ? void 0 : d.state) ?? "—", l = ((p = e.states[_(t, "height")]) == null ? void 0 : p.state) ?? "—", a = ((b = e.states[_(t, "head_circumference")]) == null ? void 0 : b.state) ?? "—", u = ((h = e.states[_(t, "weight_percentile")]) == null ? void 0 : h.state) ?? "—", f = ((g = e.states[_(t, "height_percentile")]) == null ? void 0 : g.state) ?? "—";
  return c`
        <div class="section" role="region" aria-label="Growth">
            <h2>Growth</h2>
            <div class="growth-grid">
                <div>
                    <div class="label">Weight</div>
                    <div>${o} ${r} · ${u}p</div>
                </div>
                <div>
                    <div class="label">Height</div>
                    <div>${l} ${n} · ${f}p</div>
                </div>
                <div>
                    <div class="label">Head</div>
                    <div>${a} ${n}</div>
                </div>
            </div>
            ${fe()}
        </div>
    `;
}
function fe(e, t) {
  return c`
        <svg viewBox="0 0 300 120" role="img" aria-label="Growth chart placeholder">
            ${[3, 15, 50, 85, 97].map(
    (i, r) => c`
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
                        p${i}
                    </text>
                `
  )}
        </svg>
    `;
}
function be(e, t) {
  return c`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var a;
    const i = /* @__PURE__ */ new Date(), r = new Date(i.getTime() - 90 * 864e5), n = (u) => u.toISOString().slice(0, 10), o = await e.callService(
      "babytracker",
      "export_report",
      { baby: t, format: "html", start: n(r), end: n(i) },
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
function me(e, t, s) {
  var i;
  return (i = e == null ? void 0 : e.importer) != null && i.source_entity_id ? c`
        <div class="section">
            <button
                aria-label="Resync importers"
                title="Re-read the source sensor's current activities. Already-imported activities are skipped."
                @click=${(r) => s("resync_importers", { baby: t }, r.currentTarget)}
            >
                Sync importers
            </button>
        </div>
    ` : "";
}
function ge(e, t, s) {
  var o, l;
  const i = (o = e.states) == null ? void 0 : o[_(t, "recent_entries")], r = ((l = i == null ? void 0 : i.attributes) == null ? void 0 : l.entries) ?? [], n = ae(r);
  return c`
        <div class="chips" role="list" aria-label="Last 24 hours summary">
            <div class="chip" role="listitem">${n.feedings} feedings</div>
            <div class="chip" role="listitem">
                ${ce(n.totalVolumeMl)} consumed
            </div>
            <div class="chip" role="listitem">${n.wetDiapers} wet</div>
            <div class="chip" role="listitem">${n.dirtyDiapers} dirty</div>
            <div class="chip" role="listitem">
                ${le(n.sleepMinutes)} sleep
            </div>
        </div>
    `;
}
function W() {
  const e = /* @__PURE__ */ new Date(), t = (s) => String(s).padStart(2, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}`;
}
function C(e) {
  if (!e) return;
  const t = Date.parse(e);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
function _e(e, t, s, i, r) {
  let n = m;
  if (e !== null)
    switch (e.kind) {
      case "diaper":
        n = $e(e.baby, s, r);
        break;
      case "bottle":
        n = ve(e.baby, t, s, r);
        break;
      case "solids":
        n = we(e.baby, s, r);
        break;
      case "other":
        n = ke(e.baby, s, r);
        break;
      case "session":
        n = Ae(
          e.baby,
          e.activity,
          e.method,
          s,
          r
        );
        break;
      case "end_sleep_first":
        n = ye(
          e.baby,
          e.label,
          e.then,
          i,
          r
        );
        break;
      case "confirm_delete_imported":
        n = Se(
          e.entryId,
          e.entryType,
          e.source,
          e.staff ?? null,
          s,
          r
        );
        break;
    }
  return c`
        <dialog @cancel=${r} @close=${r}>${n}</dialog>
    `;
}
function ye(e, t, s, i, r) {
  return c`
        <form @submit=${(l) => l.preventDefault()}>
            <h2>End sleep first?</h2>
            <p>${e} is asleep. End the sleep session before ${t}?</p>
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button type="button" @click=${async () => {
    r(), await s();
  }}>Skip, just log</button>
                <button
                    type="button"
                    class="primary"
                    autofocus
                    @click=${async () => {
    try {
      await i("end_sleep", { baby: e });
    } catch (l) {
      console.warn("babytracker: end_sleep failed", l);
    }
    r(), await s();
  }}
                >
                    End sleep &amp; continue
                </button>
            </div>
        </form>
    `;
}
function $e(e, t, s) {
  return c`
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
                <button type="button" @click=${s}>Cancel</button>
            </div>
        </form>
    `;
}
function ve(e, t, s, i) {
  const r = (t == null ? void 0 : t.volume_unit) ?? "oz";
  return c`
        <form @submit=${(o) => {
    o.preventDefault();
    const l = o.currentTarget, a = new FormData(l), u = String(a.get("amount") ?? ""), f = u === "" ? void 0 : Number(u), d = C(String(a.get("started") ?? "")), p = C(String(a.get("ended") ?? "")), b = String(a.get("unit") ?? r), h = String(a.get("notes") ?? "") || void 0;
    if (!p) {
      s("start_feeding", {
        baby: e,
        method: "bottle",
        started_at: d
      });
      return;
    }
    s("log_feeding", {
      baby: e,
      method: "bottle",
      amount: f,
      unit: b,
      started_at: d,
      ended_at: p,
      notes: h
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
                autofocus
            />
            <label for="unit">Unit</label>
            <select id="unit" name="unit">
                <option value="oz" ?selected=${r === "oz"}>oz</option>
                <option value="ml" ?selected=${r === "ml"}>ml</option>
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
                <button type="button" @click=${i}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function we(e, t, s) {
  return c`
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
                .value=${W()}
            />
            <div class="actions">
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function ke(e, t, s) {
  return c`
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
                .value=${W()}
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
function Se(e, t, s, i, r, n) {
  const o = (a) => {
    a.preventDefault(), r("delete_entry", { entry_id: e });
  }, l = i ? `${s} (${i})` : s;
  return c`
        <form @submit=${(a) => a.preventDefault()}>
            <h2>Delete this entry?</h2>
            <p>
                This <strong>${t}</strong> was logged by
                <strong>${l}</strong>, not from this card. Deleting it
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
function Ae(e, t, s, i, r) {
  const n = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: s ? `Log ${s.replace("_", " ")} feeding` : "Log feeding"
  };
  return c`
        <form @submit=${(l) => {
    l.preventDefault();
    const a = l.currentTarget, u = new FormData(a), f = C(String(u.get("started") ?? "")), d = C(String(u.get("ended") ?? "")), p = String(u.get("notes") ?? "") || void 0;
    if (!d) {
      const g = {
        baby: e,
        started_at: f
      };
      let $;
      switch (t) {
        case "sleep":
          $ = "start_sleep";
          break;
        case "tummy_time":
          $ = "start_tummy_time";
          break;
        case "walk":
          $ = "start_walk";
          break;
        case "feeding":
          $ = "start_feeding", g.method = s;
          break;
      }
      i($, g);
      return;
    }
    const b = {
      baby: e,
      started_at: f,
      ended_at: d,
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
        h = "log_feeding", b.method = s;
        break;
    }
    i(h, b);
  }}>
            <h2>${n[t]}</h2>
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
var xe = Object.defineProperty, Ee = Object.getOwnPropertyDescriptor, K = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Ee(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && xe(t, s, r), r;
};
let N = class extends x {
  setConfig(e) {
    if (!(e != null && e.baby))
      throw new Error("babytracker-growth-card: 'baby' is required");
    this._config = { ...e };
  }
  getCardSize() {
    return 3;
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
  render() {
    return !this.hass || !this._config ? c`` : c`
            <ha-card>
                ${Ot(
      this.hass,
      this._config.baby,
      this._options,
      this._config.units
    )}
            </ha-card>
        `;
  }
  static getStubConfig() {
    return { type: "custom:babytracker-growth-card", baby: "ava" };
  }
};
N.styles = it`
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
K([
  F({ attribute: !1 })
], N.prototype, "hass", 2);
K([
  U()
], N.prototype, "_config", 2);
K([
  U()
], N.prototype, "_options", 2);
N = K([
  ot("babytracker-growth-card")
], N);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-growth-card",
  name: "babytracker — growth",
  description: "WHO/CDC growth values and percentiles for one baby."
});
var Ce = Object.defineProperty, Te = Object.getOwnPropertyDescriptor, O = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Te(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && Ce(t, s, r), r;
};
const Oe = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "vaccines",
  "recent",
  "importer_sync",
  "export"
];
let y = class extends x {
  constructor() {
    super(...arguments), this._modal = null, this._handleService = async (e, t, s) => {
      const i = s instanceof HTMLElement && s.classList.contains("quick") ? s : null;
      try {
        const r = await ie(this.hass, "babytracker", e, t);
        return i && (i.classList.add("logged"), setTimeout(() => i.classList.remove("logged"), 700)), this.requestUpdate(), r;
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
          this._modal = { kind: e, baby: t };
        });
        return;
      }
      const s = {
        sleep: "logging another sleep session",
        tummy_time: "starting tummy time",
        walk: "starting a walk",
        feeding: "starting a feeding session"
      }, i = () => {
        this._modal = {
          kind: "session",
          baby: t,
          activity: e.activity,
          method: e.method
        };
      };
      if (e.activity === "sleep") {
        i();
        return;
      }
      this._interceptIfSleeping(s[e.activity], i);
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
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = re(
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
    return ((e = this._config) == null ? void 0 : e.sections) ?? Oe;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(e, t = "sensor") {
    return _(this._baby(), e, t);
  }
  _renderStatus() {
    var o, l, a, u, f, d, p, b, h, g;
    const e = this.hass, t = (l = (o = e.states) == null ? void 0 : o[this._entityId("last_feeding")]) == null ? void 0 : l.state, s = (u = (a = e.states) == null ? void 0 : a[this._entityId("last_diaper")]) == null ? void 0 : u.state, i = ((d = (f = e.states) == null ? void 0 : f[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : d.state) === "on", r = ((b = (p = e.states) == null ? void 0 : p[this._entityId("walking", "binary_sensor")]) == null ? void 0 : b.state) === "on", n = ((g = (h = e.states) == null ? void 0 : h[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : g.state) === "on";
    return c`
            <div class="chips" role="list" aria-label="Status chips">
                <div class="chip" role="listitem">
                    Last feeding: ${this._timeSince(t)}
                </div>
                <div class="chip" role="listitem">
                    Last diaper: ${this._timeSince(s)}
                </div>
                ${i ? c`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
                ${r ? c`<div class="chip warning" role="listitem">On a walk</div>` : ""}
                ${n ? c`<div class="chip warning" role="listitem">At daycare</div>` : ""}
            </div>
        `;
  }
  _timeSince(e) {
    if (!e || e === "unknown" || e === "unavailable") return "—";
    const t = Date.parse(e);
    if (Number.isNaN(t)) return "—";
    const s = Math.floor((Date.now() - t) / 6e4);
    if (s < 1) return "now";
    if (s < 60) return `${s}m`;
    const i = Math.floor(s / 60);
    return i < 24 ? `${i}h ${s % 60}m` : `${Math.floor(i / 24)}d`;
  }
  _isSleeping() {
    var e, t, s;
    return ((s = (t = (e = this.hass) == null ? void 0 : e.states) == null ? void 0 : t[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : s.state) === "on";
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
    if (!this.hass || !this._config) return c``;
    const e = this._sections;
    return c`
            <ha-card>
                <h2>${((t = this._babyConfig) == null ? void 0 : t.name) ?? this._baby()}</h2>
                ${e.includes("status") ? this._renderStatus() : ""}
                ${e.includes("today") ? ge(this.hass, this._baby(), this._babyConfig) : ""}
                ${e.includes("active_session") ? ne(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("quick_log") ? se(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${e.includes("vaccines") ? pe(this.hass, this._baby()) : ""}
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
                ${e.includes("importer_sync") ? me(
      this._babyConfig,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("export") ? be(this.hass, this._baby()) : ""}
            </ha-card>
            ${_e(
      this._modal,
      this._options,
      this._submitModal,
      (s, i) => this._handleService(s, i),
      this._closeModal
    )}
        `;
  }
};
y.styles = it`
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
O([
  F({ attribute: !1 })
], y.prototype, "hass", 2);
O([
  U()
], y.prototype, "_config", 2);
O([
  U()
], y.prototype, "_babyConfig", 2);
O([
  U()
], y.prototype, "_options", 2);
O([
  U()
], y.prototype, "_modal", 2);
O([
  Xt("dialog")
], y.prototype, "_dialog", 2);
y = O([
  ot("babytracker-card")
], y);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => Me);
var De = Object.defineProperty, Pe = Object.getOwnPropertyDescriptor, at = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Pe(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && De(t, s, r), r;
};
let T = class extends x {
  setConfig(e) {
    this._config = { ...e };
  }
  _valueChanged(e, t) {
    const s = { ...this._config, [e]: t };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: s },
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
T.styles = it`
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
at([
  F({ attribute: !1 })
], T.prototype, "hass", 2);
at([
  F({ attribute: !1 })
], T.prototype, "_config", 2);
T = at([
  ot("babytracker-card-editor")
], T);
T.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const Me = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return T;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  y as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
