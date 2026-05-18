/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, st = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, it = Symbol(), dt = /* @__PURE__ */ new WeakMap();
let St = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== it) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (st && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = dt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && dt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ot = (s) => new St(typeof s == "string" ? s : s + "", void 0, it), rt = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, r, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[o + 1], s[0]);
  return new St(e, s, it);
}, Mt = (s, t) => {
  if (st) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = W.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, s.appendChild(i);
  }
}, ht = st ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Ot(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Dt, defineProperty: Nt, getOwnPropertyDescriptor: Ut, getOwnPropertyNames: Lt, getOwnPropertySymbols: Ht, getPrototypeOf: zt } = Object, S = globalThis, ut = S.trustedTypes, Rt = ut ? ut.emptyScript : "", Q = S.reactiveElementPolyfillSupport, H = (s, t) => s, G = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Rt : null;
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
} }, nt = (s, t) => !Dt(s, t), pt = { attribute: !0, type: String, converter: G, reflect: !1, useDefault: !1, hasChanged: nt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), S.litPropertyMetadata ?? (S.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let O = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = pt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && Nt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: o } = Ut(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: r, set(n) {
      const l = r == null ? void 0 : r.call(this);
      o == null || o.call(this, n), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? pt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(H("elementProperties"))) return;
    const t = zt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(H("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(H("properties"))) {
      const e = this.properties, i = [...Lt(e), ...Ht(e)];
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
      for (const r of i) e.unshift(ht(r));
    } else t !== void 0 && e.push(ht(t));
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
    return Mt(t, this.constructor.elementStyles), t;
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
    var o;
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const n = (((o = i.converter) == null ? void 0 : o.toAttribute) !== void 0 ? i.converter : G).toAttribute(e, i.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var o, n;
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const l = i.getPropertyOptions(r), a = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? l.converter : G;
      this._$Em = r;
      const c = a.fromAttribute(e, l.type);
      this[r] = c ?? ((n = this._$Ej) == null ? void 0 : n.get(r)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, o) {
    var n;
    if (t !== void 0) {
      const l = this.constructor;
      if (r === !1 && (o = this[t]), i ?? (i = l.getPropertyOptions(t)), !((i.hasChanged ?? nt)(o, e) || i.useDefault && i.reflect && o === ((n = this._$Ej) == null ? void 0 : n.get(t)) && !this.hasAttribute(l._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: o }, n) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, n] of r) {
        const { wrapped: l } = n, a = this[o];
        l !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, n, a);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((r) => {
        var o;
        return (o = r.hostUpdate) == null ? void 0 : o.call(r);
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
O.elementStyles = [], O.shadowRootOptions = { mode: "open" }, O[H("elementProperties")] = /* @__PURE__ */ new Map(), O[H("finalized")] = /* @__PURE__ */ new Map(), Q == null || Q({ ReactiveElement: O }), (S.reactiveElementVersions ?? (S.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, ft = (s) => s, Z = z.trustedTypes, bt = Z ? Z.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, At = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, xt = "?" + w, qt = `<${xt}>`, C = document, R = () => C.createComment(""), q = (s) => s === null || typeof s != "object" && typeof s != "function", ot = Array.isArray, It = (s) => ot(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", X = `[ 	
\f\r]`, L = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, gt = /-->/g, _t = />/g, A = RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), mt = /'/g, $t = /"/g, kt = /^(?:script|style|textarea|title)$/i, jt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), d = jt(1), M = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), yt = /* @__PURE__ */ new WeakMap(), x = C.createTreeWalker(C, 129);
function Et(s, t) {
  if (!ot(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return bt !== void 0 ? bt.createHTML(t) : t;
}
const Bt = (s, t) => {
  const e = s.length - 1, i = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = L;
  for (let l = 0; l < e; l++) {
    const a = s[l];
    let c, u, h = -1, f = 0;
    for (; f < a.length && (n.lastIndex = f, u = n.exec(a), u !== null); ) f = n.lastIndex, n === L ? u[1] === "!--" ? n = gt : u[1] !== void 0 ? n = _t : u[2] !== void 0 ? (kt.test(u[2]) && (r = RegExp("</" + u[2], "g")), n = A) : u[3] !== void 0 && (n = A) : n === A ? u[0] === ">" ? (n = r ?? L, h = -1) : u[1] === void 0 ? h = -2 : (h = n.lastIndex - u[2].length, c = u[1], n = u[3] === void 0 ? A : u[3] === '"' ? $t : mt) : n === $t || n === mt ? n = A : n === gt || n === _t ? n = L : (n = A, r = void 0);
    const b = n === A && s[l + 1].startsWith("/>") ? " " : "";
    o += n === L ? a + qt : h >= 0 ? (i.push(c), a.slice(0, h) + At + a.slice(h) + w + b) : a + w + (h === -2 ? l : b);
  }
  return [Et(s, o + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class I {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const l = t.length - 1, a = this.parts, [c, u] = Bt(t, e);
    if (this.el = I.createElement(c, i), x.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = x.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(At)) {
          const f = u[n++], b = r.getAttribute(h).split(w), p = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: o, name: p[2], strings: b, ctor: p[1] === "." ? Wt : p[1] === "?" ? Vt : p[1] === "@" ? Gt : J }), r.removeAttribute(h);
        } else h.startsWith(w) && (a.push({ type: 6, index: o }), r.removeAttribute(h));
        if (kt.test(r.tagName)) {
          const h = r.textContent.split(w), f = h.length - 1;
          if (f > 0) {
            r.textContent = Z ? Z.emptyScript : "";
            for (let b = 0; b < f; b++) r.append(h[b], R()), x.nextNode(), a.push({ type: 2, index: ++o });
            r.append(h[f], R());
          }
        }
      } else if (r.nodeType === 8) if (r.data === xt) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(w, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += w.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = C.createElement("template");
    return i.innerHTML = t, i;
  }
}
function D(s, t, e = s, i) {
  var n, l;
  if (t === M) return t;
  let r = i !== void 0 ? (n = e._$Co) == null ? void 0 : n[i] : e._$Cl;
  const o = q(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== o && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), o === void 0 ? r = void 0 : (r = new o(s), r._$AT(s, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = r : e._$Cl = r), r !== void 0 && (t = D(s, r._$AS(s, t.values), r, i)), t;
}
class Ft {
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
    const { el: { content: e }, parts: i } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? C).importNode(e, !0);
    x.currentNode = r;
    let o = x.nextNode(), n = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let c;
        a.type === 2 ? c = new j(o, o.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (c = new Zt(o, this, t)), this._$AV.push(c), a = i[++l];
      }
      n !== (a == null ? void 0 : a.index) && (o = x.nextNode(), n++);
    }
    return x.currentNode = C, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class j {
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
    t = D(this, t, e), q(t) ? t === g || t == null || t === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : t !== this._$AH && t !== M && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : It(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== g && q(this._$AH) ? this._$AA.nextSibling.data = t : this.T(C.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = I.createElement(Et(i.h, i.h[0]), this.options)), i);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === r) this._$AH.p(e);
    else {
      const n = new Ft(r, this), l = n.u(this.options);
      n.p(e), this.T(l), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = yt.get(t.strings);
    return e === void 0 && yt.set(t.strings, e = new I(t)), e;
  }
  k(t) {
    ot(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const o of t) r === e.length ? e.push(i = new j(this.O(R()), this.O(R()), this, this.options)) : i = e[r], i._$AI(o), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t !== this._$AB; ) {
      const r = ft(t).nextSibling;
      ft(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class J {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, o) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = g;
  }
  _$AI(t, e = this, i, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = D(this, t, e, 0), n = !q(t) || t !== this._$AH && t !== M, n && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = o[0], a = 0; a < o.length - 1; a++) c = D(this, l[i + a], e, a), c === M && (c = this._$AH[a]), n || (n = !q(c) || c !== this._$AH[a]), c === g ? t = g : t !== g && (t += (c ?? "") + o[a + 1]), this._$AH[a] = c;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Wt extends J {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === g ? void 0 : t;
  }
}
class Vt extends J {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== g);
  }
}
class Gt extends J {
  constructor(t, e, i, r, o) {
    super(t, e, i, r, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = D(this, t, e, 0) ?? g) === M) return;
    const i = this._$AH, r = t === g && i !== g || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== g && (i === g || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Zt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    D(this, t);
  }
}
const Y = z.litHtmlPolyfillSupport;
Y == null || Y(I, j), (z.litHtmlVersions ?? (z.litHtmlVersions = [])).push("3.3.3");
const Jt = (s, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = r = new j(t.insertBefore(R(), o), o, void 0, e ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k = globalThis;
class E extends O {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Jt(e, this.renderRoot, this.renderOptions);
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
var wt;
E._$litElement$ = !0, E.finalized = !0, (wt = k.litElementHydrateSupport) == null || wt.call(k, { LitElement: E });
const tt = k.litElementPolyfillSupport;
tt == null || tt({ LitElement: E });
(k.litElementVersions ?? (k.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const at = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Kt = { attribute: !0, type: String, converter: G, reflect: !1, hasChanged: nt }, Qt = (s = Kt, t, e) => {
  const { kind: i, metadata: r } = e;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), o.set(e.name, s), i === "accessor") {
    const { name: n } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(n, a, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, s, l), l;
    } };
  }
  if (i === "setter") {
    const { name: n } = e;
    return function(l) {
      const a = this[n];
      t.call(this, l), this.requestUpdate(n, a, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function B(s) {
  return (t, e) => typeof e == "object" ? Qt(s, t, e) : ((i, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, i), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function U(s) {
  return B({ ...s, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xt = (s, t, e) => (e.configurable = !0, e.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(s, t, e), e);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Yt(s, t) {
  return (e, i, r) => {
    const o = (n) => {
      var l;
      return ((l = n.renderRoot) == null ? void 0 : l.querySelector(s)) ?? null;
    };
    return Xt(e, i, { get() {
      return o(this);
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
  "walk"
], ee = ["bottle", "breast_left", "breast_right", "solids"];
function se(s, t, e, i) {
  const r = (s == null ? void 0 : s.enabled_activities) ?? te, o = (s == null ? void 0 : s.enabled_feeding_methods) ?? ee, n = (a) => a.charAt(0).toUpperCase() + a.slice(1), l = [];
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
    for (const a of o)
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
                            ${n(a.replace("_", " "))}
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
function m(s, t, e = "sensor") {
  return `${e}.babytracker_${s}_${t}`;
}
async function ie(s, t, e, i) {
  return s.callService(t, e, i);
}
function re(s, t, e) {
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
function Ct(s, t) {
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
function ne(s, t, e) {
  var a, c, u, h, f, b;
  const i = ((a = s.states[m(t, "sleeping", "binary_sensor")]) == null ? void 0 : a.state) === "on", r = ((c = s.states[m(t, "feeding", "binary_sensor")]) == null ? void 0 : c.state) === "on", o = ((u = s.states[m(t, "tummy_time", "binary_sensor")]) == null ? void 0 : u.state) === "on", n = ((h = s.states[m(t, "walking", "binary_sensor")]) == null ? void 0 : h.state) === "on";
  if (!i && !r && !o && !n) return "";
  const l = [];
  if (i) {
    const p = (f = s.states[m(t, "last_sleep_start")]) == null ? void 0 : f.state;
    l.push(
      d`
                <div class="chip warning" role="status">
                    Sleeping ${p ? d`· started ${vt(p)}` : ""}
                    <button
                        aria-label="End sleep"
                        @click=${($) => e("end_sleep", { baby: t }, $.currentTarget)}
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
  ), o && l.push(
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
  ), n) {
    const p = (b = s.states[m(t, "last_walk_start")]) == null ? void 0 : b.state;
    l.push(
      d`
                <div class="chip warning" role="status">
                    Walking ${p ? d`· started ${vt(p)}` : ""}
                    <button
                        aria-label="End walk"
                        @click=${($) => e("end_walk", { baby: t }, $.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  return d`<div class="section">${l}</div>`;
}
function vt(s) {
  if (!s) return "";
  const t = Date.parse(s);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function oe(s, t, e, i) {
  var a;
  const r = s.states[m(t, "recent_entries")], o = Date.now() - 24 * 60 * 60 * 1e3, l = (((a = r == null ? void 0 : r.attributes) == null ? void 0 : a.entries) ?? []).filter((c) => V(c.timestamp) >= o).sort((c, u) => V(u.timestamp) - V(c.timestamp)).slice(0, Math.min(i, 50));
  return d`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${l.length === 0 ? d`<p>Nothing logged yet.</p>` : d`
                      <ul class="entries">
                          ${l.map(
    (c) => d`
                                  <li>
                                      <span aria-label="Entry type"
                                          >${le(c)}</span
                                      >
                                      <span class="muted"
                                          >${ae(c.timestamp)}</span
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
function V(s) {
  if (!s) return 0;
  const t = Date.parse(s);
  return Number.isNaN(t) ? 0 : t;
}
function ae(s) {
  if (!s) return "";
  const t = V(s);
  return t === 0 ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function le(s) {
  var i, r;
  const t = String(s.type ?? ""), e = ((i = s == null ? void 0 : s.data) == null ? void 0 : i.method) ?? ((r = s == null ? void 0 : s.data) == null ? void 0 : r.kind);
  return e ? `${t} (${e})` : t;
}
function ce(s, t) {
  var r, o;
  const e = s.states[m(t, "vaccines_due")];
  if (!e || e.state === "unknown") return "";
  const i = ((r = s.states[m(t, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : r.state) === "on";
  return d`
        <div
            class="section chip ${i ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${e.state}</strong>
            ${(o = e.attributes) != null && o.due_on ? d`<span>(${e.attributes.due_on})</span>` : ""}
            ${i ? d`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
        </div>
    `;
}
function Pt(s, t, e, i) {
  var h, f, b, p, $;
  const r = (i == null ? void 0 : i.weight) ?? (e == null ? void 0 : e.weight_unit) ?? "kg", o = (i == null ? void 0 : i.length) ?? (e == null ? void 0 : e.length_unit) ?? "cm", n = ((h = s.states[m(t, "weight")]) == null ? void 0 : h.state) ?? "—", l = ((f = s.states[m(t, "height")]) == null ? void 0 : f.state) ?? "—", a = ((b = s.states[m(t, "head_circumference")]) == null ? void 0 : b.state) ?? "—", c = ((p = s.states[m(t, "weight_percentile")]) == null ? void 0 : p.state) ?? "—", u = (($ = s.states[m(t, "height_percentile")]) == null ? void 0 : $.state) ?? "—";
  return d`
        <div class="section" role="region" aria-label="Growth">
            <h2>Growth</h2>
            <div class="growth-grid">
                <div>
                    <div class="label">Weight</div>
                    <div>${n} ${r} · ${c}p</div>
                </div>
                <div>
                    <div class="label">Height</div>
                    <div>${l} ${o} · ${u}p</div>
                </div>
                <div>
                    <div class="label">Head</div>
                    <div>${a} ${o}</div>
                </div>
            </div>
            ${de()}
        </div>
    `;
}
function de(s, t) {
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
function he(s, t) {
  return d`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var a;
    const i = /* @__PURE__ */ new Date(), r = new Date(i.getTime() - 90 * 864e5), o = (c) => c.toISOString().slice(0, 10), n = await s.callService(
      "babytracker",
      "export_report",
      { baby: t, format: "html", start: o(r), end: o(i) },
      void 0,
      !1,
      !0
      // return_response
    ), l = (a = n == null ? void 0 : n.response) == null ? void 0 : a.url;
    l && window.open(l, "_blank", "noopener");
  }}
            >
                Export for pediatrician
            </button>
        </div>
    `;
}
function ue(s, t, e) {
  var f, b, p, $, ct;
  const i = (f = s.states) == null ? void 0 : f[m(t, "recent_entries")], r = Date.now() - 24 * 60 * 60 * 1e3, o = (((b = i == null ? void 0 : i.attributes) == null ? void 0 : b.entries) ?? []).filter(
    (_) => et(_.timestamp) >= r
  );
  let n = 0, l = 0, a = 0, c = 0, u = 0;
  const h = Date.now();
  for (const _ of o)
    if (_.type === "feeding") {
      n += 1;
      const y = Number(((p = _ == null ? void 0 : _.data) == null ? void 0 : p.amount) ?? 0), F = String((($ = _ == null ? void 0 : _.data) == null ? void 0 : $.unit) ?? "");
      y > 0 && (c += F === "oz" ? y * 29.5735 : y);
    } else if (_.type === "diaper") {
      const y = String(((ct = _ == null ? void 0 : _.data) == null ? void 0 : ct.kind) ?? "");
      y === "wet" ? l += 1 : y === "dirty" ? a += 1 : y === "both" && (l += 1, a += 1);
    } else if (_.type === "sleep") {
      const y = et(_.timestamp), F = _.ended_at != null && _.ended_at !== "" ? et(_.ended_at) : h;
      if (y > 0 && F > y) {
        const Tt = Math.max(y, r);
        u += (F - Tt) / 6e4;
      }
    }
  return d`
        <div class="chips" role="list" aria-label="Last 24 hours summary">
            <div class="chip" role="listitem">${n} feedings</div>
            <div class="chip" role="listitem">
                ${fe(c)} consumed
            </div>
            <div class="chip" role="listitem">${l} wet</div>
            <div class="chip" role="listitem">${a} dirty</div>
            <div class="chip" role="listitem">
                ${pe(u)} sleep
            </div>
        </div>
    `;
}
function et(s) {
  if (!s) return 0;
  const t = Date.parse(s);
  return Number.isNaN(t) ? 0 : t;
}
function pe(s) {
  if (!Number.isFinite(s) || s <= 0) return "0m";
  if (s < 60) return `${Math.round(s)}m`;
  const t = Math.floor(s / 60), e = Math.round(s % 60);
  return e === 0 ? `${t}h` : `${t}h ${e}m`;
}
function fe(s) {
  if (!Number.isFinite(s) || s <= 0) return "0 oz";
  const t = s / 29.5735;
  return t >= 1 ? `${t.toFixed(1)} oz` : `${Math.round(s)} ml`;
}
function be(s, t, e, i, r) {
  return d`
        <dialog @cancel=${r} @close=${r}>
            ${s === null ? g : s.kind === "diaper" ? _e(s.baby, e, r) : s.kind === "bottle" ? me(s.baby, t, e, r) : s.kind === "solids" ? $e(s.baby, e, r) : ge(
    s.baby,
    s.label,
    s.then,
    i,
    r
  )}
        </dialog>
    `;
}
function ge(s, t, e, i, r) {
  return d`
        <form @submit=${(l) => l.preventDefault()}>
            <h2>End sleep first?</h2>
            <p>${s} is asleep. End the sleep session before ${t}?</p>
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button type="button" @click=${async () => {
    r(), await e();
  }}>Skip, just log</button>
                <button
                    type="button"
                    class="primary"
                    autofocus
                    @click=${async () => {
    try {
      await i("end_sleep", { baby: s });
    } catch (l) {
      console.warn("babytracker: end_sleep failed", l);
    }
    r(), await e();
  }}
                >
                    End sleep &amp; continue
                </button>
            </div>
        </form>
    `;
}
function _e(s, t, e) {
  return d`
        <form @submit=${(r) => {
    r.preventDefault();
    const o = r.currentTarget, n = new FormData(o, r.submitter ?? void 0);
    t("log_diaper", {
      baby: s,
      kind: String(n.get("kind") ?? "wet"),
      notes: String(n.get("notes") ?? "") || void 0
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
function me(s, t, e, i) {
  const r = (t == null ? void 0 : t.volume_unit) ?? "oz";
  return d`
        <form @submit=${(n) => {
    n.preventDefault();
    const l = n.currentTarget, a = new FormData(l), c = String(a.get("amount") ?? ""), u = c === "" ? void 0 : Number(c);
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
function $e(s, t, e) {
  return d`
        <form @submit=${(r) => {
    r.preventDefault();
    const o = r.currentTarget, n = new FormData(o);
    t("log_feeding", {
      baby: s,
      method: "solids",
      notes: String(n.get("notes") ?? "") || void 0
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
var ye = Object.defineProperty, ve = Object.getOwnPropertyDescriptor, K = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? ve(t, e) : t, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (r = (i ? n(t, e, r) : n(r)) || r);
  return i && r && ye(t, e, r), r;
};
let N = class extends E {
  setConfig(s) {
    if (!(s != null && s.baby))
      throw new Error("babytracker-growth-card: 'baby' is required");
    this._config = { ...s };
  }
  getCardSize() {
    return 3;
  }
  connectedCallback() {
    super.connectedCallback(), this._maybeSubscribe();
  }
  disconnectedCallback() {
    var s;
    (s = this._unsubOptions) == null || s.call(this), this._unsubOptions = void 0, super.disconnectedCallback();
  }
  updated(s) {
    (s.has("hass") || s.has("_config")) && this._maybeSubscribe();
  }
  _maybeSubscribe() {
    !this.hass || !this._config || this._unsubOptions || (this._unsubOptions = Ct(
      this.hass,
      (s) => {
        this._options = s;
      }
    ));
  }
  render() {
    return !this.hass || !this._config ? d`` : d`
            <ha-card>
                ${Pt(
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
N.styles = rt`
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
  B({ attribute: !1 })
], N.prototype, "hass", 2);
K([
  U()
], N.prototype, "_config", 2);
K([
  U()
], N.prototype, "_options", 2);
N = K([
  at("babytracker-growth-card")
], N);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-growth-card",
  name: "babytracker — growth",
  description: "WHO/CDC growth values and percentiles for one baby."
});
var we = Object.defineProperty, Se = Object.getOwnPropertyDescriptor, T = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? Se(t, e) : t, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (r = (i ? n(t, e, r) : n(r)) || r);
  return i && r && we(t, e, r), r;
};
const Ae = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "vaccines",
  "recent",
  "export"
], xe = {
  log_diaper: "logging a diaper",
  log_feeding: "logging the feeding",
  start_feeding: "starting a feeding session",
  start_tummy_time: "starting tummy time",
  start_walk: "starting a walk"
};
let v = class extends E {
  constructor() {
    super(...arguments), this._modal = null, this._handleService = async (s, t, e) => {
      const i = e instanceof HTMLElement && e.classList.contains("quick") ? e : null;
      try {
        const r = await ie(this.hass, "babytracker", s, t);
        return i && (i.classList.add("logged"), setTimeout(() => i.classList.remove("logged"), 700)), this.requestUpdate(), r;
      } catch (r) {
        throw console.warn("babytracker: service call failed", s, r), r;
      }
    }, this._requestModal = (s) => {
      const t = {
        diaper: "logging a diaper",
        bottle: "logging a bottle",
        solids: "logging solids"
      };
      this._interceptIfSleeping(t[s], () => {
        this._modal = { kind: s, baby: this._baby() };
      });
    }, this._closeModal = () => {
      this._modal = null;
    }, this._submitModal = async (s, t) => {
      await this._handleService(s, t), this._closeModal();
    }, this._quickAction = async (s, t, e) => {
      const i = xe[s] ?? "logging this";
      if (this._isSleeping()) {
        this._modal = {
          kind: "end_sleep_first",
          baby: this._baby(),
          label: i,
          then: () => this._handleService(s, t, e).then(() => {
          })
        };
        return;
      }
      return this._handleService(s, t, e);
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
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = re(
      this.hass,
      this._config.baby,
      (s) => {
        this._babyConfig = s;
      }
    )), this._unsubOptions || (this._unsubOptions = Ct(
      this.hass,
      (s) => {
        this._options = s;
      }
    )));
  }
  get _sections() {
    var s;
    return ((s = this._config) == null ? void 0 : s.sections) ?? Ae;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(s, t = "sensor") {
    return m(this._baby(), s, t);
  }
  _renderStatus() {
    var n, l, a, c, u, h, f, b, p, $;
    const s = this.hass, t = (l = (n = s.states) == null ? void 0 : n[this._entityId("last_feeding")]) == null ? void 0 : l.state, e = (c = (a = s.states) == null ? void 0 : a[this._entityId("last_diaper")]) == null ? void 0 : c.state, i = ((h = (u = s.states) == null ? void 0 : u[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : h.state) === "on", r = ((b = (f = s.states) == null ? void 0 : f[this._entityId("walking", "binary_sensor")]) == null ? void 0 : b.state) === "on", o = (($ = (p = s.states) == null ? void 0 : p[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : $.state) === "on";
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
                ${o ? d`<div class="chip warning" role="listitem">At daycare</div>` : ""}
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
  _interceptIfSleeping(s, t) {
    if (!this._isSleeping()) return t();
    this._modal = {
      kind: "end_sleep_first",
      baby: this._baby(),
      label: s,
      then: t
    };
  }
  render() {
    var t;
    if (!this.hass || !this._config) return d``;
    const s = this._sections;
    return d`
            <ha-card>
                <h2>${((t = this._babyConfig) == null ? void 0 : t.name) ?? this._baby()}</h2>
                ${s.includes("status") ? this._renderStatus() : ""}
                ${s.includes("today") ? ue(this.hass, this._baby(), this._babyConfig) : ""}
                ${s.includes("active_session") ? ne(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${s.includes("quick_log") ? se(
      this._babyConfig,
      this._baby(),
      this._quickAction,
      this._requestModal
    ) : ""}
                ${s.includes("vaccines") ? ce(this.hass, this._baby()) : ""}
                ${s.includes("growth") ? Pt(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${s.includes("recent") ? oe(
      this.hass,
      this._baby(),
      this._handleService,
      this._config.recent_limit ?? 50
    ) : ""}
                ${s.includes("export") ? he(this.hass, this._baby()) : ""}
            </ha-card>
            ${be(
      this._modal,
      this._options,
      this._submitModal,
      (e, i) => this._handleService(e, i),
      this._closeModal
    )}
        `;
  }
};
v.styles = rt`
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
T([
  B({ attribute: !1 })
], v.prototype, "hass", 2);
T([
  U()
], v.prototype, "_config", 2);
T([
  U()
], v.prototype, "_babyConfig", 2);
T([
  U()
], v.prototype, "_options", 2);
T([
  U()
], v.prototype, "_modal", 2);
T([
  Yt("dialog")
], v.prototype, "_dialog", 2);
v = T([
  at("babytracker-card")
], v);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => Ce);
var ke = Object.defineProperty, Ee = Object.getOwnPropertyDescriptor, lt = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? Ee(t, e) : t, o = s.length - 1, n; o >= 0; o--)
    (n = s[o]) && (r = (i ? n(t, e, r) : n(r)) || r);
  return i && r && ke(t, e, r), r;
};
let P = class extends E {
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
P.styles = rt`
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
lt([
  B({ attribute: !1 })
], P.prototype, "hass", 2);
lt([
  B({ attribute: !1 })
], P.prototype, "_config", 2);
P = lt([
  at("babytracker-card-editor")
], P);
P.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const Ce = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return P;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  v as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
