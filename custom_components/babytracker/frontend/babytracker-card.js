/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis, Y = I.ShadowRoot && (I.ShadyCSS === void 0 || I.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, tt = Symbol(), nt = /* @__PURE__ */ new WeakMap();
let mt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== tt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Y && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = nt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && nt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const kt = (s) => new mt(typeof s == "string" ? s : s + "", void 0, tt), $t = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, r, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[n + 1], s[0]);
  return new mt(e, s, tt);
}, Et = (s, t) => {
  if (Y) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = I.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, s.appendChild(i);
  }
}, ot = Y ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return kt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ct, defineProperty: Tt, getOwnPropertyDescriptor: Pt, getOwnPropertyNames: Mt, getOwnPropertySymbols: Ot, getPrototypeOf: Nt } = Object, w = globalThis, at = w.trustedTypes, Ut = at ? at.emptyScript : "", Z = w.reactiveElementPolyfillSupport, U = (s, t) => s, B = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Ut : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, et = (s, t) => !Ct(s, t), lt = { attribute: !0, type: String, converter: B, reflect: !1, useDefault: !1, hasChanged: et };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), w.litPropertyMetadata ?? (w.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let T = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = lt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && Tt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: n } = Pt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const l = r == null ? void 0 : r.call(this);
      n == null || n.call(this, o), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? lt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(U("elementProperties"))) return;
    const t = Nt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(U("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(U("properties"))) {
      const e = this.properties, i = [...Mt(e), ...Ot(e)];
      for (const r of i) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, r] of e) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const r = this._$Eu(e, i);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) e.unshift(ot(r));
    } else t !== void 0 && e.push(ot(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Et(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    var n;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : B).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, o;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const l = i.getPropertyOptions(r), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : B;
      this._$Em = r;
      const c = a.fromAttribute(e, l.type);
      this[r] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, n) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (r === !1 && (n = this[t]), i ?? (i = l.getPropertyOptions(t)), !((i.hasChanged ?? et)(n, e) || i.useDefault && i.reflect && n === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: n }, o) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
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
    (e = this._$EO) == null || e.forEach((i) => {
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
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[U("elementProperties")] = /* @__PURE__ */ new Map(), T[U("finalized")] = /* @__PURE__ */ new Map(), Z == null || Z({ ReactiveElement: T }), (w.reactiveElementVersions ?? (w.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, ct = (s) => s, F = D.trustedTypes, dt = F ? F.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, vt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, yt = "?" + y, Dt = `<${yt}>`, k = document, L = () => k.createComment(""), H = (s) => s === null || typeof s != "object" && typeof s != "function", st = Array.isArray, Lt = (s) => st(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", J = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ht = /-->/g, ut = />/g, A = RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pt = /'/g, ft = /"/g, wt = /^(?:script|style|textarea|title)$/i, Ht = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), d = Ht(1), M = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), _t = /* @__PURE__ */ new WeakMap(), S = k.createTreeWalker(k, 129);
function At(s, t) {
  if (!st(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return dt !== void 0 ? dt.createHTML(t) : t;
}
const Rt = (s, t) => {
  const e = s.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = N;
  for (let l = 0; l < e; l++) {
    const a = s[l];
    let c, u, h = -1, f = 0;
    for (; f < a.length && (o.lastIndex = f, u = o.exec(a), u !== null); ) f = o.lastIndex, o === N ? u[1] === "!--" ? o = ht : u[1] !== void 0 ? o = ut : u[2] !== void 0 ? (wt.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = A) : u[3] !== void 0 && (o = A) : o === A ? u[0] === ">" ? (o = r ?? N, h = -1) : u[1] === void 0 ? h = -2 : (h = o.lastIndex - u[2].length, c = u[1], o = u[3] === void 0 ? A : u[3] === '"' ? ft : pt) : o === ft || o === pt ? o = A : o === ht || o === ut ? o = N : (o = A, r = void 0);
    const _ = o === A && s[l + 1].startsWith("/>") ? " " : "";
    n += o === N ? a + Dt : h >= 0 ? (i.push(c), a.slice(0, h) + vt + a.slice(h) + y + _) : a + y + (h === -2 ? l : _);
  }
  return [At(s, n + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class R {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [c, u] = Rt(t, e);
    if (this.el = R.createElement(c, i), S.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = S.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(vt)) {
          const f = u[o++], _ = r.getAttribute(h).split(y), p = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: n, name: p[2], strings: _, ctor: p[1] === "." ? qt : p[1] === "?" ? It : p[1] === "@" ? jt : V }), r.removeAttribute(h);
        } else h.startsWith(y) && (a.push({ type: 6, index: n }), r.removeAttribute(h));
        if (wt.test(r.tagName)) {
          const h = r.textContent.split(y), f = h.length - 1;
          if (f > 0) {
            r.textContent = F ? F.emptyScript : "";
            for (let _ = 0; _ < f; _++) r.append(h[_], L()), S.nextNode(), a.push({ type: 2, index: ++n });
            r.append(h[f], L());
          }
        }
      } else if (r.nodeType === 8) if (r.data === yt) a.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(y, h + 1)) !== -1; ) a.push({ type: 7, index: n }), h += y.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const i = k.createElement("template");
    return i.innerHTML = t, i;
  }
}
function O(s, t, e = s, i) {
  var o, l;
  if (t === M) return t;
  let r = i !== void 0 ? (o = e._$Co) == null ? void 0 : o[i] : e._$Cl;
  const n = H(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), n === void 0 ? r = void 0 : (r = new n(s), r._$AT(s, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = O(s, r._$AS(s, t.values), r, i)), t;
}
class zt {
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
    const { el: { content: e }, parts: i } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? k).importNode(e, !0);
    S.currentNode = r;
    let n = S.nextNode(), o = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new z(n, n.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (c = new Bt(n, this, t)), this._$AV.push(c), a = i[++l];
      }
      o !== (a == null ? void 0 : a.index) && (n = S.nextNode(), o++);
    }
    return S.currentNode = k, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class z {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = g, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    t = O(this, t, e), H(t) ? t === g || t == null || t === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : t !== this._$AH && t !== M && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Lt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== g && H(this._$AH) ? this._$AA.nextSibling.data = t : this.T(k.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = R.createElement(At(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(e);
    else {
      const o = new zt(r, this), l = o.u(this.options);
      o.p(e), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = _t.get(t.strings);
    return e === void 0 && _t.set(t.strings, e = new R(t)), e;
  }
  k(t) {
    st(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const n of t) r === e.length ? e.push(i = new z(this.O(L()), this.O(L()), this, this.options)) : i = e[r], i._$AI(n), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = ct(t).nextSibling;
      ct(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class V {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, n) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = g;
  }
  _$AI(t, e = this, i, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = O(this, t, e, 0), o = !H(t) || t !== this._$AH && t !== M, o && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = n[0], a = 0; a < n.length - 1; a++) c = O(this, l[i + a], e, a), c === M && (c = this._$AH[a]), o || (o = !H(c) || c !== this._$AH[a]), c === g ? t = g : t !== g && (t += (c ?? "") + n[a + 1]), this._$AH[a] = c;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class qt extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === g ? void 0 : t;
  }
}
class It extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== g);
  }
}
class jt extends V {
  constructor(t, e, i, r, n) {
    super(t, e, i, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = O(this, t, e, 0) ?? g) === M) return;
    const i = this._$AH, r = t === g && i !== g || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== g && (i === g || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Bt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    O(this, t);
  }
}
const K = D.litHtmlPolyfillSupport;
K == null || K(R, z), (D.litHtmlVersions ?? (D.litHtmlVersions = [])).push("3.3.3");
const Ft = (s, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = r = new z(t.insertBefore(L(), n), n, void 0, e ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis;
class P extends T {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ft(e, this.renderRoot, this.renderOptions);
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
var bt;
P._$litElement$ = !0, P.finalized = !0, (bt = x.litElementHydrateSupport) == null || bt.call(x, { LitElement: P });
const Q = x.litElementPolyfillSupport;
Q == null || Q({ LitElement: P });
(x.litElementVersions ?? (x.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const St = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Vt = { attribute: !0, type: String, converter: B, reflect: !1, hasChanged: et }, Wt = (s = Vt, t, e) => {
  const { kind: i, metadata: r } = e;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), n.set(e.name, s), i === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, s, l), l;
    } };
  }
  if (i === "setter") {
    const { name: o } = e;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function W(s) {
  return (t, e) => typeof e == "object" ? Wt(s, t, e) : ((i, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function G(s) {
  return W({ ...s, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Gt = (s, t, e) => (e.configurable = !0, e.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(s, t, e), e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Zt(s, t) {
  return (e, i, r) => {
    const n = (o) => {
      var l;
      return ((l = o.renderRoot) == null ? void 0 : l.querySelector(s)) ?? null;
    };
    return Gt(e, i, { get() {
      return n(this);
    } });
  };
}
const Jt = [
  "feeding",
  "sleep",
  "tummy_time",
  "diaper",
  "growth",
  "medication",
  "vaccine",
  "walk"
], Kt = ["bottle", "breast_left", "breast_right", "solids"];
function Qt(s, t, e, i) {
  const r = (s == null ? void 0 : s.enabled_activities) ?? Jt, n = (s == null ? void 0 : s.enabled_feeding_methods) ?? Kt, o = (a) => a.charAt(0).toUpperCase() + a.slice(1), l = [];
  if (r.includes("diaper") && l.push(
    d`
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
        d`
                        <button
                            class="quick"
                            aria-label="Log bottle feeding for ${t}"
                            @click=${() => i("bottle")}
                        >
                            Bottle
                        </button>
                    `
      ) : a === "solids" ? l.push(
        d`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${t}"
                            @click=${() => i("solids")}
                        >
                            Solids
                        </button>
                    `
      ) : l.push(
        d`
                        <button
                            class="quick"
                            aria-label="Start ${a} feeding for ${t}"
                            @click=${(c) => e(
          "start_feeding",
          { baby: t, method: a },
          c.currentTarget
        )}
                        >
                            ${o(a.replace("_", " "))}
                        </button>
                    `
      );
  return r.includes("sleep") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Start sleep for ${t}"
                    @click=${(a) => e("start_sleep", { baby: t }, a.currentTarget)}
                >
                    Start sleep
                </button>
            `
  ), r.includes("tummy_time") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Start tummy time for ${t}"
                    @click=${(a) => e("start_tummy_time", { baby: t }, a.currentTarget)}
                >
                    Tummy time
                </button>
            `
  ), r.includes("walk") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Start walk for ${t}"
                    @click=${(a) => e("start_walk", { baby: t }, a.currentTarget)}
                >
                    Start walk
                </button>
            `
  ), d`
        <div class="section grid" role="group" aria-label="Quick log">
            ${l}
        </div>
    `;
}
function Xt(s, t, e) {
  var a, c, u, h, f, _;
  const i = ((a = s.states[`binary_sensor.${t}_sleeping`]) == null ? void 0 : a.state) === "on", r = ((c = s.states[`binary_sensor.${t}_feeding`]) == null ? void 0 : c.state) === "on", n = ((u = s.states[`binary_sensor.${t}_tummy_time`]) == null ? void 0 : u.state) === "on", o = ((h = s.states[`binary_sensor.${t}_walking`]) == null ? void 0 : h.state) === "on";
  if (!i && !r && !n && !o) return "";
  const l = [];
  if (i) {
    const p = (f = s.states[`sensor.${t}_last_sleep_start`]) == null ? void 0 : f.state;
    l.push(
      d`
                <div class="chip warning" role="status">
                    Sleeping ${p ? d`· started ${gt(p)}` : ""}
                    <button
                        aria-label="End sleep"
                        @click=${(m) => e("end_sleep", { baby: t }, m.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  if (r && l.push(
    d`
                <div class="chip warning" role="status">
                    Feeding
                    <button
                        aria-label="End feeding"
                        @click=${(p) => e("end_feeding", { baby: t }, p.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), n && l.push(
    d`
                <div class="chip warning" role="status">
                    Tummy time
                    <button
                        aria-label="End tummy time"
                        @click=${(p) => e("end_tummy_time", { baby: t }, p.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), o) {
    const p = (_ = s.states[`sensor.${t}_last_walk_start`]) == null ? void 0 : _.state;
    l.push(
      d`
                <div class="chip warning" role="status">
                    Walking ${p ? d`· started ${gt(p)}` : ""}
                    <button
                        aria-label="End walk"
                        @click=${(m) => e("end_walk", { baby: t }, m.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  return d`<div class="section">${l}</div>`;
}
function gt(s) {
  if (!s) return "";
  const t = Date.parse(s);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function Yt(s, t, e, i) {
  var a;
  const r = s.states[`sensor.${t}_recent_entries`], n = Date.now() - 24 * 60 * 60 * 1e3, l = (((a = r == null ? void 0 : r.attributes) == null ? void 0 : a.entries) ?? []).filter((c) => j(c.timestamp) >= n).sort((c, u) => j(u.timestamp) - j(c.timestamp)).slice(0, Math.min(i, 50));
  return d`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${l.length === 0 ? d`<p>Nothing logged yet.</p>` : d`
                      <ul class="entries">
                          ${l.map(
    (c) => d`
                                  <li>
                                      <span aria-label="Entry type"
                                          >${ee(c)}</span
                                      >
                                      <span class="muted"
                                          >${te(c.timestamp)}</span
                                      >
                                      ${c.photo_path ? d`<span aria-label="Has photo"
                                                >📷</span
                                            >` : ""}
                                      ${c.staff ? d`<span
                                                class="muted"
                                                aria-label="Logged by Procare staff"
                                                >via ${c.staff}</span
                                            >` : ""}
                                      <span class="spacer"></span>
                                      <button
                                          aria-label="Delete entry"
                                          @click=${(u) => e(
      "delete_entry",
      { entry_id: c.id },
      u.currentTarget
    )}
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
function j(s) {
  if (!s) return 0;
  const t = Date.parse(s);
  return Number.isNaN(t) ? 0 : t;
}
function te(s) {
  if (!s) return "";
  const t = j(s);
  return t === 0 ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function ee(s) {
  var i, r;
  const t = String(s.type ?? ""), e = ((i = s == null ? void 0 : s.data) == null ? void 0 : i.method) ?? ((r = s == null ? void 0 : s.data) == null ? void 0 : r.kind);
  return e ? `${t} (${e})` : t;
}
function se(s, t) {
  var r, n;
  const e = s.states[`sensor.${t}_vaccines_due`];
  if (!e || e.state === "unknown") return "";
  const i = ((r = s.states[`binary_sensor.${t}_vaccines_overdue`]) == null ? void 0 : r.state) === "on";
  return d`
        <div
            class="section chip ${i ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${e.state}</strong>
            ${(n = e.attributes) != null && n.due_on ? d`<span>(${e.attributes.due_on})</span>` : ""}
            ${i ? d`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
        </div>
    `;
}
function ie(s, t, e, i) {
  var h, f, _, p, m;
  const r = (i == null ? void 0 : i.weight) ?? (e == null ? void 0 : e.weight_unit) ?? "kg", n = (i == null ? void 0 : i.length) ?? (e == null ? void 0 : e.length_unit) ?? "cm", o = ((h = s.states[`sensor.${t}_weight`]) == null ? void 0 : h.state) ?? "—", l = ((f = s.states[`sensor.${t}_height`]) == null ? void 0 : f.state) ?? "—", a = ((_ = s.states[`sensor.${t}_head_circumference`]) == null ? void 0 : _.state) ?? "—", c = ((p = s.states[`sensor.${t}_weight_percentile`]) == null ? void 0 : p.state) ?? "—", u = ((m = s.states[`sensor.${t}_height_percentile`]) == null ? void 0 : m.state) ?? "—";
  return d`
        <div class="section" role="region" aria-label="Growth">
            <h2>Growth</h2>
            <div class="growth-grid">
                <div>
                    <div class="label">Weight</div>
                    <div>${o} ${r} · ${c}p</div>
                </div>
                <div>
                    <div class="label">Height</div>
                    <div>${l} ${n} · ${u}p</div>
                </div>
                <div>
                    <div class="label">Head</div>
                    <div>${a} ${n}</div>
                </div>
            </div>
            ${re()}
        </div>
    `;
}
function re(s, t) {
  return d`
        <svg viewBox="0 0 300 120" role="img" aria-label="Growth chart placeholder">
            ${[3, 15, 50, 85, 97].map(
    (i, r) => d`
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
function ne(s, t) {
  return d`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var a;
    const i = /* @__PURE__ */ new Date(), r = new Date(i.getTime() - 90 * 864e5), n = (c) => c.toISOString().slice(0, 10), o = await s.callService(
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
function oe(s, t, e) {
  var f, _, p, m, rt;
  const i = (f = s.states) == null ? void 0 : f[`sensor.${t}_recent_entries`], r = Date.now() - 24 * 60 * 60 * 1e3, n = (((_ = i == null ? void 0 : i.attributes) == null ? void 0 : _.entries) ?? []).filter(
    (b) => X(b.timestamp) >= r
  );
  let o = 0, l = 0, a = 0, c = 0, u = 0;
  const h = Date.now();
  for (const b of n)
    if (b.type === "feeding") {
      o += 1;
      const $ = Number(((p = b == null ? void 0 : b.data) == null ? void 0 : p.amount) ?? 0), q = String(((m = b == null ? void 0 : b.data) == null ? void 0 : m.unit) ?? "");
      $ > 0 && (c += q === "oz" ? $ * 29.5735 : $);
    } else if (b.type === "diaper") {
      const $ = String(((rt = b == null ? void 0 : b.data) == null ? void 0 : rt.kind) ?? "");
      $ === "wet" ? l += 1 : $ === "dirty" ? a += 1 : $ === "both" && (l += 1, a += 1);
    } else if (b.type === "sleep") {
      const $ = X(b.timestamp), q = b.ended_at != null && b.ended_at !== "" ? X(b.ended_at) : h;
      if ($ > 0 && q > $) {
        const xt = Math.max($, r);
        u += (q - xt) / 6e4;
      }
    }
  return d`
        <div class="chips" role="list" aria-label="Last 24 hours summary">
            <div class="chip" role="listitem">${o} feedings</div>
            <div class="chip" role="listitem">
                ${le(c)} consumed
            </div>
            <div class="chip" role="listitem">${l} wet</div>
            <div class="chip" role="listitem">${a} dirty</div>
            <div class="chip" role="listitem">
                ${ae(u)} sleep
            </div>
        </div>
    `;
}
function X(s) {
  if (!s) return 0;
  const t = Date.parse(s);
  return Number.isNaN(t) ? 0 : t;
}
function ae(s) {
  if (!Number.isFinite(s) || s <= 0) return "0m";
  if (s < 60) return `${Math.round(s)}m`;
  const t = Math.floor(s / 60), e = Math.round(s % 60);
  return e === 0 ? `${t}h` : `${t}h ${e}m`;
}
function le(s) {
  if (!Number.isFinite(s) || s <= 0) return "0 oz";
  const t = s / 29.5735;
  return t >= 1 ? `${t.toFixed(1)} oz` : `${Math.round(s)} ml`;
}
function ce(s, t, e, i, r, n) {
  return d`
        <dialog @cancel=${n} @close=${n}>
            ${s === null ? g : s.kind === "diaper" ? he(s.baby, e, n) : s.kind === "bottle" ? ue(s.baby, t, e, n) : s.kind === "solids" ? pe(s.baby, e, n) : de(
    s.baby,
    s.then,
    i,
    r,
    n
  )}
        </dialog>
    `;
}
function de(s, t, e, i, r) {
  const n = {
    diaper: "logging a diaper",
    bottle: "logging a bottle",
    solids: "logging solids"
  }, o = async () => {
    try {
      await i("end_sleep", { baby: s });
    } catch (l) {
      console.warn("babytracker: end_sleep failed", l);
    }
    e(t);
  };
  return d`
        <form @submit=${(l) => l.preventDefault()}>
            <h2>End sleep first?</h2>
            <p>${s} is asleep. End the sleep session before ${n[t]}?</p>
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button type="button" @click=${() => e(t)}>
                    Skip, just log
                </button>
                <button
                    type="button"
                    class="primary"
                    autofocus
                    @click=${o}
                >
                    End sleep &amp; continue
                </button>
            </div>
        </form>
    `;
}
function he(s, t, e) {
  return d`
        <form @submit=${(r) => {
    r.preventDefault();
    const n = r.currentTarget, o = new FormData(n, r.submitter ?? void 0);
    t("log_diaper", {
      baby: s,
      kind: String(o.get("kind") ?? "wet"),
      notes: String(o.get("notes") ?? "") || void 0
    });
  }}>
            <h2>Log diaper</h2>
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
                <button type="button" @click=${e}>Cancel</button>
            </div>
        </form>
    `;
}
function ue(s, t, e, i) {
  const r = (t == null ? void 0 : t.volume_unit) ?? "oz";
  return d`
        <form @submit=${(o) => {
    o.preventDefault();
    const l = o.currentTarget, a = new FormData(l), c = String(a.get("amount") ?? ""), u = c === "" ? void 0 : Number(c);
    e("log_feeding", {
      baby: s,
      method: "bottle",
      amount: u,
      unit: String(a.get("unit") ?? r),
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
            <label for="notes">Notes</label>
            <input id="notes" name="notes" type="text" placeholder="optional" />
            <div class="actions">
                <button type="button" @click=${i}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function pe(s, t, e) {
  return d`
        <form @submit=${(r) => {
    r.preventDefault();
    const n = r.currentTarget, o = new FormData(n);
    t("log_feeding", {
      baby: s,
      method: "solids",
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
            <div class="actions">
                <button type="button" @click=${e}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
async function fe(s, t, e, i) {
  return s.callService(t, e, i);
}
function _e(s, t, e) {
  const i = {};
  return (async () => {
    try {
      const r = await s.connection.subscribeMessage(
        e,
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
function ge(s, t) {
  const e = {};
  return (async () => {
    try {
      const i = await s.connection.subscribeMessage(
        t,
        { type: "babytracker/get_integration_options", subscribe: !0 }
      );
      e.current = i;
    } catch (i) {
      console.warn(
        "babytracker: subscribeIntegrationOptions failed",
        i
      );
    }
  })(), () => {
    var i;
    return (i = e.current) == null ? void 0 : i.call(e);
  };
}
var be = Object.defineProperty, me = Object.getOwnPropertyDescriptor, C = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? me(t, e) : t, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && be(t, e, r), r;
};
const $e = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "vaccines",
  "growth",
  "recent",
  "export"
];
let v = class extends P {
  constructor() {
    super(...arguments), this._modal = null, this._handleService = async (s, t, e) => {
      const i = e instanceof HTMLElement && e.classList.contains("quick") ? e : null;
      try {
        const r = await fe(this.hass, "babytracker", s, t);
        return i && (i.classList.add("logged"), setTimeout(() => i.classList.remove("logged"), 700)), this.requestUpdate(), r;
      } catch (r) {
        throw console.warn("babytracker: service call failed", s, r), r;
      }
    }, this._requestModal = (s) => {
      this._isSleeping() ? this._modal = {
        kind: "end_sleep_first",
        baby: this._baby(),
        then: s
      } : this._modal = { kind: s, baby: this._baby() };
    }, this._swapModal = (s) => {
      this._modal = { kind: s, baby: this._baby() };
    }, this._closeModal = () => {
      this._modal = null;
    }, this._submitModal = async (s, t) => {
      await this._handleService(s, t), this._closeModal();
    };
  }
  setConfig(s) {
    if (!(s != null && s.baby)) throw new Error("babytracker-card: 'baby' is required");
    this._config = { ...s };
  }
  getCardSize() {
    return 6;
  }
  connectedCallback() {
    super.connectedCallback(), this._maybeSubscribe();
  }
  disconnectedCallback() {
    var s, t;
    (s = this._unsubBaby) == null || s.call(this), (t = this._unsubOptions) == null || t.call(this), this._unsubBaby = void 0, this._unsubOptions = void 0, super.disconnectedCallback();
  }
  updated(s) {
    var t;
    (s.has("hass") || s.has("_config")) && this._maybeSubscribe(), s.has("_modal") && (this._modal && this._dialog && !this._dialog.open ? this._dialog.showModal() : !this._modal && ((t = this._dialog) != null && t.open) && this._dialog.close());
  }
  _maybeSubscribe() {
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = _e(
      this.hass,
      this._config.baby,
      (s) => {
        this._babyConfig = s;
      }
    )), this._unsubOptions || (this._unsubOptions = ge(
      this.hass,
      (s) => {
        this._options = s;
      }
    )));
  }
  get _sections() {
    var s;
    return ((s = this._config) == null ? void 0 : s.sections) ?? $e;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(s, t = "sensor") {
    return `${t}.${this._baby()}_${s}`;
  }
  _renderStatus() {
    var o, l, a, c, u, h, f, _, p, m;
    const s = this.hass, t = (l = (o = s.states) == null ? void 0 : o[this._entityId("last_feeding")]) == null ? void 0 : l.state, e = (c = (a = s.states) == null ? void 0 : a[this._entityId("last_diaper")]) == null ? void 0 : c.state, i = ((h = (u = s.states) == null ? void 0 : u[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : h.state) === "on", r = ((_ = (f = s.states) == null ? void 0 : f[this._entityId("walking", "binary_sensor")]) == null ? void 0 : _.state) === "on", n = ((m = (p = s.states) == null ? void 0 : p[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : m.state) === "on";
    return d`
            <div class="chips" role="list" aria-label="Status chips">
                <div class="chip" role="listitem">
                    Last feeding: ${this._timeSince(t)}
                </div>
                <div class="chip" role="listitem">
                    Last diaper: ${this._timeSince(e)}
                </div>
                ${i ? d`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
                ${r ? d`<div class="chip warning" role="listitem">On a walk</div>` : ""}
                ${n ? d`<div class="chip warning" role="listitem">At daycare</div>` : ""}
            </div>
        `;
  }
  _timeSince(s) {
    if (!s || s === "unknown" || s === "unavailable") return "—";
    const t = Date.parse(s);
    if (Number.isNaN(t)) return "—";
    const e = Math.floor((Date.now() - t) / 6e4);
    if (e < 1) return "now";
    if (e < 60) return `${e}m`;
    const i = Math.floor(e / 60);
    return i < 24 ? `${i}h ${e % 60}m` : `${Math.floor(i / 24)}d`;
  }
  _isSleeping() {
    var s, t, e;
    return ((e = (t = (s = this.hass) == null ? void 0 : s.states) == null ? void 0 : t[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : e.state) === "on";
  }
  render() {
    var t;
    if (!this.hass || !this._config) return d``;
    const s = this._sections;
    return d`
            <ha-card>
                <h2>${((t = this._babyConfig) == null ? void 0 : t.name) ?? this._baby()}</h2>
                ${s.includes("status") ? this._renderStatus() : ""}
                ${s.includes("today") ? oe(this.hass, this._baby(), this._babyConfig) : ""}
                ${s.includes("active_session") ? Xt(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${s.includes("quick_log") ? Qt(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${s.includes("vaccines") ? se(this.hass, this._baby()) : ""}
                ${s.includes("growth") ? ie(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${s.includes("recent") ? Yt(
      this.hass,
      this._baby(),
      this._handleService,
      this._config.recent_limit ?? 50
    ) : ""}
                ${s.includes("export") ? ne(this.hass, this._baby()) : ""}
            </ha-card>
            ${ce(
      this._modal,
      this._options,
      this._submitModal,
      this._swapModal,
      (e, i) => this._handleService(e, i),
      this._closeModal
    )}
        `;
  }
};
v.styles = $t`
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
  W({ attribute: !1 })
], v.prototype, "hass", 2);
C([
  G()
], v.prototype, "_config", 2);
C([
  G()
], v.prototype, "_babyConfig", 2);
C([
  G()
], v.prototype, "_options", 2);
C([
  G()
], v.prototype, "_modal", 2);
C([
  Zt("dialog")
], v.prototype, "_dialog", 2);
v = C([
  St("babytracker-card")
], v);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => we);
var ve = Object.defineProperty, ye = Object.getOwnPropertyDescriptor, it = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? ye(t, e) : t, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (r = (i ? o(t, e, r) : o(r)) || r);
  return i && r && ve(t, e, r), r;
};
let E = class extends P {
  setConfig(s) {
    this._config = { ...s };
  }
  _valueChanged(s, t) {
    const e = { ...this._config, [s]: t };
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
                @change=${(s) => this._valueChanged(
      "baby",
      s.target.value
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
                @change=${(s) => this._valueChanged(
      "recent_limit",
      Number(s.target.value)
    )}
            />
        `;
  }
};
E.styles = $t`
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
it([
  W({ attribute: !1 })
], E.prototype, "hass", 2);
it([
  W({ attribute: !1 })
], E.prototype, "_config", 2);
E = it([
  St("babytracker-card-editor")
], E);
E.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const we = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return E;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  v as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
