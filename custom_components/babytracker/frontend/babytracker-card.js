/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const B = globalThis, tt = B.ShadowRoot && (B.ShadyCSS === void 0 || B.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, et = Symbol(), ct = /* @__PURE__ */ new WeakMap();
let wt = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== et) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (tt && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = ct.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && ct.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Pt = (e) => new wt(typeof e == "string" ? e : e + "", void 0, et), it = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new wt(i, e, et);
}, Dt = (e, t) => {
  if (tt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), r = B.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, e.appendChild(s);
  }
}, dt = tt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return Pt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Mt, defineProperty: Nt, getOwnPropertyDescriptor: Ut, getOwnPropertyNames: Lt, getOwnPropertySymbols: Ht, getPrototypeOf: It } = Object, v = globalThis, ut = v.trustedTypes, zt = ut ? ut.emptyScript : "", K = v.reactiveElementPolyfillSupport, L = (e, t) => e, F = { toAttribute(e, t) {
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
} }, st = (e, t) => !Mt(e, t), ht = { attribute: !0, type: String, converter: F, reflect: !1, useDefault: !1, hasChanged: st };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), v.litPropertyMetadata ?? (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let T = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = ht) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, i);
      r !== void 0 && Nt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    const { get: r, set: n } = Ut(this.prototype, t) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: r, set(o) {
      const l = r == null ? void 0 : r.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ht;
  }
  static _$Ei() {
    if (this.hasOwnProperty(L("elementProperties"))) return;
    const t = It(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(L("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(L("properties"))) {
      const i = this.properties, s = [...Lt(i), ...Ht(i)];
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
      for (const r of s) i.unshift(dt(r));
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
    return Dt(t, this.constructor.elementStyles), t;
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
      const o = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : F).toAttribute(i, s.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var n, o;
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const l = s.getPropertyOptions(r), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : F;
      this._$Em = r;
      const d = a.fromAttribute(i, l.type);
      this[r] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, r = !1, n) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (r === !1 && (n = this[t]), s ?? (s = l.getPropertyOptions(t)), !((s.hasChanged ?? st)(n, i) || s.useDefault && s.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, s)))) return;
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
        const { wrapped: l } = o, a = this[n];
        l !== !0 || this._$AL.has(n) || a === void 0 || this.C(n, void 0, o, a);
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
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[L("elementProperties")] = /* @__PURE__ */ new Map(), T[L("finalized")] = /* @__PURE__ */ new Map(), K == null || K({ ReactiveElement: T }), (v.reactiveElementVersions ?? (v.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, pt = (e) => e, W = H.trustedTypes, ft = W ? W.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, St = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, kt = "?" + y, Rt = `<${kt}>`, x = document, I = () => x.createComment(""), z = (e) => e === null || typeof e != "object" && typeof e != "function", rt = Array.isArray, qt = (e) => rt(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", Y = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, bt = /-->/g, gt = />/g, w = RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), mt = /'/g, _t = /"/g, At = /^(?:script|style|textarea|title)$/i, jt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), c = jt(1), P = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), $t = /* @__PURE__ */ new WeakMap(), S = x.createTreeWalker(x, 129);
function xt(e, t) {
  if (!rt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ft !== void 0 ? ft.createHTML(t) : t;
}
const Bt = (e, t) => {
  const i = e.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = U;
  for (let l = 0; l < i; l++) {
    const a = e[l];
    let d, p, u = -1, f = 0;
    for (; f < a.length && (o.lastIndex = f, p = o.exec(a), p !== null); ) f = o.lastIndex, o === U ? p[1] === "!--" ? o = bt : p[1] !== void 0 ? o = gt : p[2] !== void 0 ? (At.test(p[2]) && (r = RegExp("</" + p[2], "g")), o = w) : p[3] !== void 0 && (o = w) : o === w ? p[0] === ">" ? (o = r ?? U, u = -1) : p[1] === void 0 ? u = -2 : (u = o.lastIndex - p[2].length, d = p[1], o = p[3] === void 0 ? w : p[3] === '"' ? _t : mt) : o === _t || o === mt ? o = w : o === bt || o === gt ? o = U : (o = w, r = void 0);
    const b = o === w && e[l + 1].startsWith("/>") ? " " : "";
    n += o === U ? a + Rt : u >= 0 ? (s.push(d), a.slice(0, u) + St + a.slice(u) + y + b) : a + y + (u === -2 ? l : b);
  }
  return [xt(e, n + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class R {
  constructor({ strings: t, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [d, p] = Bt(t, i);
    if (this.el = R.createElement(d, s), S.currentNode = this.el.content, i === 2 || i === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (r = S.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const u of r.getAttributeNames()) if (u.endsWith(St)) {
          const f = p[o++], b = r.getAttribute(u).split(y), h = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: n, name: h[2], strings: b, ctor: h[1] === "." ? Wt : h[1] === "?" ? Vt : h[1] === "@" ? Gt : V }), r.removeAttribute(u);
        } else u.startsWith(y) && (a.push({ type: 6, index: n }), r.removeAttribute(u));
        if (At.test(r.tagName)) {
          const u = r.textContent.split(y), f = u.length - 1;
          if (f > 0) {
            r.textContent = W ? W.emptyScript : "";
            for (let b = 0; b < f; b++) r.append(u[b], I()), S.nextNode(), a.push({ type: 2, index: ++n });
            r.append(u[f], I());
          }
        }
      } else if (r.nodeType === 8) if (r.data === kt) a.push({ type: 2, index: n });
      else {
        let u = -1;
        for (; (u = r.data.indexOf(y, u + 1)) !== -1; ) a.push({ type: 7, index: n }), u += y.length - 1;
      }
      n++;
    }
  }
  static createElement(t, i) {
    const s = x.createElement("template");
    return s.innerHTML = t, s;
  }
}
function D(e, t, i = e, s) {
  var o, l;
  if (t === P) return t;
  let r = s !== void 0 ? (o = i._$Co) == null ? void 0 : o[s] : i._$Cl;
  const n = z(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, i, s)), s !== void 0 ? (i._$Co ?? (i._$Co = []))[s] = r : i._$Cl = r), r !== void 0 && (t = D(e, r._$AS(e, t.values), r, s)), t;
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
    const { el: { content: i }, parts: s } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? x).importNode(i, !0);
    S.currentNode = r;
    let n = S.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let d;
        a.type === 2 ? d = new q(n, n.nextSibling, this, t) : a.type === 1 ? d = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (d = new Zt(n, this, t)), this._$AV.push(d), a = s[++l];
      }
      o !== (a == null ? void 0 : a.index) && (n = S.nextNode(), o++);
    }
    return S.currentNode = x, r;
  }
  p(t) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class q {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, s, r) {
    this.type = 2, this._$AH = g, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    t = D(this, t, i), z(t) ? t === g || t == null || t === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : t !== this._$AH && t !== P && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : qt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== g && z(this._$AH) ? this._$AA.nextSibling.data = t : this.T(x.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: i, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = R.createElement(xt(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(i);
    else {
      const o = new Ft(r, this), l = o.u(this.options);
      o.p(i), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = $t.get(t.strings);
    return i === void 0 && $t.set(t.strings, i = new R(t)), i;
  }
  k(t) {
    rt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const n of t) r === i.length ? i.push(s = new q(this.O(I()), this.O(I()), this, this.options)) : s = i[r], s._$AI(n), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, i); t !== this._$AB; ) {
      const r = pt(t).nextSibling;
      pt(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class V {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, r, n) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = g;
  }
  _$AI(t, i = this, s, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = D(this, t, i, 0), o = !z(t) || t !== this._$AH && t !== P, o && (this._$AH = t);
    else {
      const l = t;
      let a, d;
      for (t = n[0], a = 0; a < n.length - 1; a++) d = D(this, l[s + a], i, a), d === P && (d = this._$AH[a]), o || (o = !z(d) || d !== this._$AH[a]), d === g ? t = g : t !== g && (t += (d ?? "") + n[a + 1]), this._$AH[a] = d;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Wt extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === g ? void 0 : t;
  }
}
class Vt extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== g);
  }
}
class Gt extends V {
  constructor(t, i, s, r, n) {
    super(t, i, s, r, n), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = D(this, t, i, 0) ?? g) === P) return;
    const s = this._$AH, r = t === g && s !== g || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== g && (s === g || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Zt {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    D(this, t);
  }
}
const Q = H.litHtmlPolyfillSupport;
Q == null || Q(R, q), (H.litHtmlVersions ?? (H.litHtmlVersions = [])).push("3.3.3");
const Jt = (e, t, i) => {
  const s = (i == null ? void 0 : i.renderBefore) ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = (i == null ? void 0 : i.renderBefore) ?? null;
    s._$litPart$ = r = new q(t.insertBefore(I(), n), n, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis;
class A extends T {
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
    return P;
  }
}
var vt;
A._$litElement$ = !0, A.finalized = !0, (vt = k.litElementHydrateSupport) == null || vt.call(k, { LitElement: A });
const X = k.litElementPolyfillSupport;
X == null || X({ LitElement: A });
(k.litElementVersions ?? (k.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Kt = { attribute: !0, type: String, converter: F, reflect: !1, hasChanged: st }, Yt = (e = Kt, t, i) => {
  const { kind: s, metadata: r } = i;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(i.name, e), s === "accessor") {
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
function j(e) {
  return (t, i) => typeof i == "object" ? Yt(e, t, i) : ((s, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function N(e) {
  return j({ ...e, state: !0, attribute: !1 });
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
  return (i, s, r) => {
    const n = (o) => {
      var l;
      return ((l = o.renderRoot) == null ? void 0 : l.querySelector(e)) ?? null;
    };
    return Qt(i, s, { get() {
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
function ie(e, t, i, s) {
  const r = (e == null ? void 0 : e.enabled_activities) ?? te, n = (e == null ? void 0 : e.enabled_feeding_methods) ?? ee, o = (a) => a.charAt(0).toUpperCase() + a.slice(1), l = [];
  if (r.includes("diaper") && l.push(
    c`
                <button
                    class="quick"
                    aria-label="Log diaper for ${t}"
                    @click=${() => s("diaper")}
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
                            @click=${() => s("bottle")}
                        >
                            Bottle
                        </button>
                    `
      ) : a === "solids" ? l.push(
        c`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${t}"
                            @click=${() => s("solids")}
                        >
                            Solids
                        </button>
                    `
      ) : l.push(
        c`
                        <button
                            class="quick"
                            aria-label="Start ${a} feeding for ${t}"
                            @click=${(d) => i(
          "start_feeding",
          { baby: t, method: a },
          d.currentTarget
        )}
                        >
                            ${o(a.replace("_", " "))}
                        </button>
                    `
      );
  return r.includes("sleep") && l.push(
    c`
                <button
                    class="quick"
                    aria-label="Start sleep for ${t}"
                    @click=${(a) => i("start_sleep", { baby: t }, a.currentTarget)}
                >
                    Start sleep
                </button>
            `
  ), r.includes("tummy_time") && l.push(
    c`
                <button
                    class="quick"
                    aria-label="Start tummy time for ${t}"
                    @click=${(a) => i("start_tummy_time", { baby: t }, a.currentTarget)}
                >
                    Tummy time
                </button>
            `
  ), r.includes("walk") && l.push(
    c`
                <button
                    class="quick"
                    aria-label="Start walk for ${t}"
                    @click=${(a) => i("start_walk", { baby: t }, a.currentTarget)}
                >
                    Start walk
                </button>
            `
  ), r.includes("other") && l.push(
    c`
                <button
                    class="quick"
                    aria-label="Log other activity for ${t}"
                    @click=${() => s("other")}
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
function m(e, t, i = "sensor") {
  return `${i}.babytracker_${e}_${t}`;
}
async function se(e, t, i, s) {
  return e.callService(t, i, s);
}
function re(e, t, i) {
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
function ne(e, t, i) {
  var a, d, p, u, f, b;
  const s = ((a = e.states[m(t, "sleeping", "binary_sensor")]) == null ? void 0 : a.state) === "on", r = ((d = e.states[m(t, "feeding", "binary_sensor")]) == null ? void 0 : d.state) === "on", n = ((p = e.states[m(t, "tummy_time", "binary_sensor")]) == null ? void 0 : p.state) === "on", o = ((u = e.states[m(t, "walking", "binary_sensor")]) == null ? void 0 : u.state) === "on";
  if (!s && !r && !n && !o) return "";
  const l = [];
  if (s) {
    const h = (f = e.states[m(t, "last_sleep_start")]) == null ? void 0 : f.state;
    l.push(
      c`
                <div class="chip warning" role="status">
                    Sleeping ${h ? c`· started ${yt(h)}` : ""}
                    <button
                        aria-label="End sleep"
                        @click=${(_) => i("end_sleep", { baby: t }, _.currentTarget)}
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
                        @click=${(h) => i("end_feeding", { baby: t }, h.currentTarget)}
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
                        @click=${(h) => i("end_tummy_time", { baby: t }, h.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), o) {
    const h = (b = e.states[m(t, "last_walk_start")]) == null ? void 0 : b.state;
    l.push(
      c`
                <div class="chip warning" role="status">
                    Walking ${h ? c`· started ${yt(h)}` : ""}
                    <button
                        aria-label="End walk"
                        @click=${(_) => i("end_walk", { baby: t }, _.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  return c`<div class="section">${l}</div>`;
}
function yt(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const Ct = 29.5735, Tt = 24 * 60 * 60 * 1e3;
function O(e) {
  if (!e) return 0;
  const t = Date.parse(e);
  return Number.isNaN(t) ? 0 : t;
}
function oe(e, t = Tt, i = Date.now()) {
  const s = i - t;
  return e.filter((r) => O(r.timestamp) >= s).slice().sort((r, n) => O(n.timestamp) - O(r.timestamp));
}
function ae(e, t = Date.now(), i = Tt) {
  var d, p, u;
  const s = t - i;
  let r = 0, n = 0, o = 0, l = 0, a = 0;
  for (const f of e) {
    const b = O(f.timestamp);
    if (f.type === "sleep") {
      const h = b, _ = f.ended_at != null && f.ended_at !== "" ? O(f.ended_at) : t;
      if (h > 0 && _ > h && _ > s) {
        const at = Math.max(h, s), lt = Math.min(_, t);
        lt > at && (a += (lt - at) / 6e4);
      }
      continue;
    }
    if (!(b < s)) {
      if (f.type === "feeding") {
        r += 1;
        const h = Number(((d = f.data) == null ? void 0 : d.amount) ?? 0), _ = String(((p = f.data) == null ? void 0 : p.unit) ?? "");
        h > 0 && (l += _ === "oz" ? h * Ct : h);
      } else if (f.type === "diaper") {
        const h = String(((u = f.data) == null ? void 0 : u.kind) ?? "");
        h === "wet" ? n += 1 : h === "dirty" ? o += 1 : h === "both" && (n += 1, o += 1);
      }
    }
  }
  return { feedings: r, wetDiapers: n, dirtyDiapers: o, totalVolumeMl: l, sleepMinutes: a };
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
  const t = O(e);
  return t === 0 ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function ue(e, t, i, s) {
  var l;
  const r = e.states[m(t, "recent_entries")], n = ((l = r == null ? void 0 : r.attributes) == null ? void 0 : l.entries) ?? [], o = oe(n).slice(0, Math.min(s, 50));
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
  var s, r, n;
  const t = String(e.type ?? ""), i = ((s = e == null ? void 0 : e.data) == null ? void 0 : s.name) ?? ((r = e == null ? void 0 : e.data) == null ? void 0 : r.method) ?? ((n = e == null ? void 0 : e.data) == null ? void 0 : n.kind);
  return i ? `${t} (${i})` : t;
}
function pe(e, t) {
  var r, n;
  const i = e.states[m(t, "vaccines_due")];
  if (!i || i.state === "unknown") return "";
  const s = ((r = e.states[m(t, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : r.state) === "on";
  return c`
        <div
            class="section chip ${s ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${i.state}</strong>
            ${(n = i.attributes) != null && n.due_on ? c`<span>(${i.attributes.due_on})</span>` : ""}
            ${s ? c`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
        </div>
    `;
}
function Ot(e, t, i, s) {
  var u, f, b, h, _;
  const r = (s == null ? void 0 : s.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", n = (s == null ? void 0 : s.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", o = ((u = e.states[m(t, "weight")]) == null ? void 0 : u.state) ?? "—", l = ((f = e.states[m(t, "height")]) == null ? void 0 : f.state) ?? "—", a = ((b = e.states[m(t, "head_circumference")]) == null ? void 0 : b.state) ?? "—", d = ((h = e.states[m(t, "weight_percentile")]) == null ? void 0 : h.state) ?? "—", p = ((_ = e.states[m(t, "height_percentile")]) == null ? void 0 : _.state) ?? "—";
  return c`
        <div class="section" role="region" aria-label="Growth">
            <h2>Growth</h2>
            <div class="growth-grid">
                <div>
                    <div class="label">Weight</div>
                    <div>${o} ${r} · ${d}p</div>
                </div>
                <div>
                    <div class="label">Height</div>
                    <div>${l} ${n} · ${p}p</div>
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
    (s, r) => c`
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
function be(e, t) {
  return c`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var a;
    const s = /* @__PURE__ */ new Date(), r = new Date(s.getTime() - 90 * 864e5), n = (d) => d.toISOString().slice(0, 10), o = await e.callService(
      "babytracker",
      "export_report",
      { baby: t, format: "html", start: n(r), end: n(s) },
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
function ge(e, t, i) {
  var o, l;
  const s = (o = e.states) == null ? void 0 : o[m(t, "recent_entries")], r = ((l = s == null ? void 0 : s.attributes) == null ? void 0 : l.entries) ?? [], n = ae(r);
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
function G() {
  const e = /* @__PURE__ */ new Date(), t = (i) => String(i).padStart(2, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}`;
}
function Z(e) {
  if (!e) return;
  const t = Date.parse(e);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
function me(e, t, i, s, r) {
  let n = g;
  if (e !== null)
    switch (e.kind) {
      case "diaper":
        n = $e(e.baby, i, r);
        break;
      case "bottle":
        n = ye(e.baby, t, i, r);
        break;
      case "solids":
        n = ve(e.baby, i, r);
        break;
      case "other":
        n = we(e.baby, i, r);
        break;
      case "end_sleep_first":
        n = _e(
          e.baby,
          e.label,
          e.then,
          s,
          r
        );
        break;
      case "confirm_delete_imported":
        n = Se(
          e.entryId,
          e.entryType,
          e.source,
          e.staff ?? null,
          i,
          r
        );
        break;
    }
  return c`
        <dialog @cancel=${r} @close=${r}>${n}</dialog>
    `;
}
function _e(e, t, i, s, r) {
  return c`
        <form @submit=${(l) => l.preventDefault()}>
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
    } catch (l) {
      console.warn("babytracker: end_sleep failed", l);
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
function $e(e, t, i) {
  return c`
        <form @submit=${(r) => {
    r.preventDefault();
    const n = r.currentTarget, o = new FormData(n, r.submitter ?? void 0);
    t("log_diaper", {
      baby: e,
      kind: String(o.get("kind") ?? "wet"),
      timestamp: Z(String(o.get("when") ?? "")),
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
function ye(e, t, i, s) {
  const r = (t == null ? void 0 : t.volume_unit) ?? "oz";
  return c`
        <form @submit=${(o) => {
    o.preventDefault();
    const l = o.currentTarget, a = new FormData(l), d = String(a.get("amount") ?? ""), p = d === "" ? void 0 : Number(d);
    i("log_feeding", {
      baby: e,
      method: "bottle",
      amount: p,
      unit: String(a.get("unit") ?? r),
      // log_feeding uses started_at (not timestamp) as the entry's "when"
      started_at: Z(String(a.get("when") ?? "")),
      notes: String(a.get("notes") ?? "") || void 0
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
                required
            />
            <label for="unit">Unit</label>
            <select id="unit" name="unit">
                <option value="oz" ?selected=${r === "oz"}>oz</option>
                <option value="ml" ?selected=${r === "ml"}>ml</option>
            </select>
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
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function ve(e, t, i) {
  return c`
        <form @submit=${(r) => {
    r.preventDefault();
    const n = r.currentTarget, o = new FormData(n);
    t("log_feeding", {
      baby: e,
      method: "solids",
      started_at: Z(String(o.get("when") ?? "")),
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
function we(e, t, i) {
  return c`
        <form @submit=${(r) => {
    r.preventDefault();
    const n = r.currentTarget, o = new FormData(n);
    t("log_other", {
      baby: e,
      name: String(o.get("name") ?? ""),
      timestamp: Z(String(o.get("when") ?? "")),
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
function Se(e, t, i, s, r, n) {
  const o = (a) => {
    a.preventDefault(), r("delete_entry", { entry_id: e });
  }, l = s ? `${i} (${s})` : i;
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
var ke = Object.defineProperty, Ae = Object.getOwnPropertyDescriptor, J = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ae(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && ke(t, i, r), r;
};
let M = class extends A {
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
M.styles = it`
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
J([
  j({ attribute: !1 })
], M.prototype, "hass", 2);
J([
  N()
], M.prototype, "_config", 2);
J([
  N()
], M.prototype, "_options", 2);
M = J([
  nt("babytracker-growth-card")
], M);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-growth-card",
  name: "babytracker — growth",
  description: "WHO/CDC growth values and percentiles for one baby."
});
var xe = Object.defineProperty, Ee = Object.getOwnPropertyDescriptor, C = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ee(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && xe(t, i, r), r;
};
const Ce = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "vaccines",
  "recent",
  "export"
], Te = {
  log_diaper: "logging a diaper",
  log_feeding: "logging the feeding",
  start_feeding: "starting a feeding session",
  start_tummy_time: "starting tummy time",
  start_walk: "starting a walk"
};
let $ = class extends A {
  constructor() {
    super(...arguments), this._modal = null, this._handleService = async (e, t, i) => {
      const s = i instanceof HTMLElement && i.classList.contains("quick") ? i : null;
      try {
        const r = await se(this.hass, "babytracker", e, t);
        return s && (s.classList.add("logged"), setTimeout(() => s.classList.remove("logged"), 700)), this.requestUpdate(), r;
      } catch (r) {
        throw console.warn("babytracker: service call failed", e, r), r;
      }
    }, this._requestModal = (e) => {
      const t = {
        diaper: "logging a diaper",
        bottle: "logging a bottle",
        solids: "logging solids",
        other: "logging this"
      };
      this._interceptIfSleeping(t[e], () => {
        this._modal = { kind: e, baby: this._baby() };
      });
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
    }, this._quickAction = async (e, t, i) => {
      const s = Te[e] ?? "logging this";
      if (this._isSleeping()) {
        this._modal = {
          kind: "end_sleep_first",
          baby: this._baby(),
          label: s,
          then: () => this._handleService(e, t, i).then(() => {
          })
        };
        return;
      }
      return this._handleService(e, t, i);
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
    return ((e = this._config) == null ? void 0 : e.sections) ?? Ce;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(e, t = "sensor") {
    return m(this._baby(), e, t);
  }
  _renderStatus() {
    var o, l, a, d, p, u, f, b, h, _;
    const e = this.hass, t = (l = (o = e.states) == null ? void 0 : o[this._entityId("last_feeding")]) == null ? void 0 : l.state, i = (d = (a = e.states) == null ? void 0 : a[this._entityId("last_diaper")]) == null ? void 0 : d.state, s = ((u = (p = e.states) == null ? void 0 : p[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : u.state) === "on", r = ((b = (f = e.states) == null ? void 0 : f[this._entityId("walking", "binary_sensor")]) == null ? void 0 : b.state) === "on", n = ((_ = (h = e.states) == null ? void 0 : h[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : _.state) === "on";
    return c`
            <div class="chips" role="list" aria-label="Status chips">
                <div class="chip" role="listitem">
                    Last feeding: ${this._timeSince(t)}
                </div>
                <div class="chip" role="listitem">
                    Last diaper: ${this._timeSince(i)}
                </div>
                ${s ? c`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
                ${r ? c`<div class="chip warning" role="listitem">On a walk</div>` : ""}
                ${n ? c`<div class="chip warning" role="listitem">At daycare</div>` : ""}
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
                ${e.includes("quick_log") ? ie(
      this._babyConfig,
      this._baby(),
      this._quickAction,
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
                ${e.includes("export") ? be(this.hass, this._baby()) : ""}
            </ha-card>
            ${me(
      this._modal,
      this._options,
      this._submitModal,
      (i, s) => this._handleService(i, s),
      this._closeModal
    )}
        `;
  }
};
$.styles = it`
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
C([
  j({ attribute: !1 })
], $.prototype, "hass", 2);
C([
  N()
], $.prototype, "_config", 2);
C([
  N()
], $.prototype, "_babyConfig", 2);
C([
  N()
], $.prototype, "_options", 2);
C([
  N()
], $.prototype, "_modal", 2);
C([
  Xt("dialog")
], $.prototype, "_dialog", 2);
$ = C([
  nt("babytracker-card")
], $);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => De);
var Oe = Object.defineProperty, Pe = Object.getOwnPropertyDescriptor, ot = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Pe(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && Oe(t, i, r), r;
};
let E = class extends A {
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
E.styles = it`
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
ot([
  j({ attribute: !1 })
], E.prototype, "hass", 2);
ot([
  j({ attribute: !1 })
], E.prototype, "_config", 2);
E = ot([
  nt("babytracker-card-editor")
], E);
E.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const De = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return E;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  $ as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
