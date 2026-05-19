/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const tt = globalThis, ht = tt.ShadowRoot && (tt.ShadyCSS === void 0 || tt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, bt = Symbol(), yt = /* @__PURE__ */ new WeakMap();
let Lt = class {
  constructor(t, i, n) {
    if (this._$cssResult$ = !0, n !== bt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (ht && t === void 0) {
      const n = i !== void 0 && i.length === 1;
      n && (t = yt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && yt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Vt = (e) => new Lt(typeof e == "string" ? e : e + "", void 0, bt), st = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((n, s, r) => n + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[r + 1], e[0]);
  return new Lt(i, e, bt);
}, Yt = (e, t) => {
  if (ht) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const n = document.createElement("style"), s = tt.litNonce;
    s !== void 0 && n.setAttribute("nonce", s), n.textContent = i.cssText, e.appendChild(n);
  }
}, vt = ht ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const n of t.cssRules) i += n.cssText;
  return Vt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Gt, defineProperty: Zt, getOwnPropertyDescriptor: Xt, getOwnPropertyNames: Kt, getOwnPropertySymbols: Jt, getPrototypeOf: Qt } = Object, E = globalThis, $t = E.trustedTypes, te = $t ? $t.emptyScript : "", at = E.reactiveElementPolyfillSupport, j = (e, t) => e, it = { toAttribute(e, t) {
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
} }, mt = (e, t) => !Gt(e, t), wt = { attribute: !0, type: String, converter: it, reflect: !1, useDefault: !1, hasChanged: mt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), E.litPropertyMetadata ?? (E.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let I = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = wt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const n = Symbol(), s = this.getPropertyDescriptor(t, n, i);
      s !== void 0 && Zt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, i, n) {
    const { get: s, set: r } = Xt(this.prototype, t) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: s, set(o) {
      const a = s == null ? void 0 : s.call(this);
      r == null || r.call(this, o), this.requestUpdate(t, a, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? wt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(j("elementProperties"))) return;
    const t = Qt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(j("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(j("properties"))) {
      const i = this.properties, n = [...Kt(i), ...Jt(i)];
      for (const s of n) this.createProperty(s, i[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [n, s] of i) this.elementProperties.set(n, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, n] of this.elementProperties) {
      const s = this._$Eu(i, n);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const n = new Set(t.flat(1 / 0).reverse());
      for (const s of n) i.unshift(vt(s));
    } else t !== void 0 && i.push(vt(t));
    return i;
  }
  static _$Eu(t, i) {
    const n = i.attribute;
    return n === !1 ? void 0 : typeof n == "string" ? n : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const n of i.keys()) this.hasOwnProperty(n) && (t.set(n, this[n]), delete this[n]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Yt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((i) => {
      var n;
      return (n = i.hostConnected) == null ? void 0 : n.call(i);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var n;
      return (n = i.hostDisconnected) == null ? void 0 : n.call(i);
    });
  }
  attributeChangedCallback(t, i, n) {
    this._$AK(t, n);
  }
  _$ET(t, i) {
    var r;
    const n = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, n);
    if (s !== void 0 && n.reflect === !0) {
      const o = (((r = n.converter) == null ? void 0 : r.toAttribute) !== void 0 ? n.converter : it).toAttribute(i, n.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var r, o;
    const n = this.constructor, s = n._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = n.getPropertyOptions(s), c = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((r = a.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? a.converter : it;
      this._$Em = s;
      const d = c.fromAttribute(i, a.type);
      this[s] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, i, n, s = !1, r) {
    var o;
    if (t !== void 0) {
      const a = this.constructor;
      if (s === !1 && (r = this[t]), n ?? (n = a.getPropertyOptions(t)), !((n.hasChanged ?? mt)(r, i) || n.useDefault && n.reflect && r === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(a._$Eu(t, n)))) return;
      this.C(t, i, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: n, reflect: s, wrapped: r }, o) {
    n && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, o ?? i ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || n || (i = void 0), this._$AL.set(t, i)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
    var n;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: a } = o, c = this[r];
        a !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, o, c);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (n = this._$EO) == null || n.forEach((s) => {
        var r;
        return (r = s.hostUpdate) == null ? void 0 : r.call(s);
      }), this.update(i)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var i;
    (i = this._$EO) == null || i.forEach((n) => {
      var s;
      return (s = n.hostUpdated) == null ? void 0 : s.call(n);
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
I.elementStyles = [], I.shadowRootOptions = { mode: "open" }, I[j("elementProperties")] = /* @__PURE__ */ new Map(), I[j("finalized")] = /* @__PURE__ */ new Map(), at == null || at({ ReactiveElement: I }), (E.reactiveElementVersions ?? (E.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, xt = (e) => e, nt = W.trustedTypes, kt = nt ? nt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Ut = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, zt = "?" + A, ee = `<${zt}>`, P = document, V = () => P.createComment(""), Y = (e) => e === null || typeof e != "object" && typeof e != "function", gt = Array.isArray, ie = (e) => gt(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", lt = `[ 	
\f\r]`, B = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, St = /-->/g, At = />/g, T = RegExp(`>|${lt}(?:([^\\s"'>=/]+)(${lt}*=${lt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Et = /'/g, Ct = /"/g, It = /^(?:script|style|textarea|title)$/i, ne = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), u = ne(1), R = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), Dt = /* @__PURE__ */ new WeakMap(), N = P.createTreeWalker(P, 129);
function Ht(e, t) {
  if (!gt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return kt !== void 0 ? kt.createHTML(t) : t;
}
const se = (e, t) => {
  const i = e.length - 1, n = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = B;
  for (let a = 0; a < i; a++) {
    const c = e[a];
    let d, h, p = -1, b = 0;
    for (; b < c.length && (o.lastIndex = b, h = o.exec(c), h !== null); ) b = o.lastIndex, o === B ? h[1] === "!--" ? o = St : h[1] !== void 0 ? o = At : h[2] !== void 0 ? (It.test(h[2]) && (s = RegExp("</" + h[2], "g")), o = T) : h[3] !== void 0 && (o = T) : o === T ? h[0] === ">" ? (o = s ?? B, p = -1) : h[1] === void 0 ? p = -2 : (p = o.lastIndex - h[2].length, d = h[1], o = h[3] === void 0 ? T : h[3] === '"' ? Ct : Et) : o === Ct || o === Et ? o = T : o === St || o === At ? o = B : (o = T, s = void 0);
    const m = o === T && e[a + 1].startsWith("/>") ? " " : "";
    r += o === B ? c + ee : p >= 0 ? (n.push(d), c.slice(0, p) + Ut + c.slice(p) + A + m) : c + A + (p === -2 ? a : m);
  }
  return [Ht(e, r + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), n];
};
class G {
  constructor({ strings: t, _$litType$: i }, n) {
    let s;
    this.parts = [];
    let r = 0, o = 0;
    const a = t.length - 1, c = this.parts, [d, h] = se(t, i);
    if (this.el = G.createElement(d, n), N.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (s = N.nextNode()) !== null && c.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const p of s.getAttributeNames()) if (p.endsWith(Ut)) {
          const b = h[o++], m = s.getAttribute(p).split(A), l = /([.?@])?(.*)/.exec(b);
          c.push({ type: 1, index: r, name: l[2], strings: m, ctor: l[1] === "." ? oe : l[1] === "?" ? ae : l[1] === "@" ? le : rt }), s.removeAttribute(p);
        } else p.startsWith(A) && (c.push({ type: 6, index: r }), s.removeAttribute(p));
        if (It.test(s.tagName)) {
          const p = s.textContent.split(A), b = p.length - 1;
          if (b > 0) {
            s.textContent = nt ? nt.emptyScript : "";
            for (let m = 0; m < b; m++) s.append(p[m], V()), N.nextNode(), c.push({ type: 2, index: ++r });
            s.append(p[b], V());
          }
        }
      } else if (s.nodeType === 8) if (s.data === zt) c.push({ type: 2, index: r });
      else {
        let p = -1;
        for (; (p = s.data.indexOf(A, p + 1)) !== -1; ) c.push({ type: 7, index: r }), p += A.length - 1;
      }
      r++;
    }
  }
  static createElement(t, i) {
    const n = P.createElement("template");
    return n.innerHTML = t, n;
  }
}
function q(e, t, i = e, n) {
  var o, a;
  if (t === R) return t;
  let s = n !== void 0 ? (o = i._$Co) == null ? void 0 : o[n] : i._$Cl;
  const r = Y(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== r && ((a = s == null ? void 0 : s._$AO) == null || a.call(s, !1), r === void 0 ? s = void 0 : (s = new r(e), s._$AT(e, i, n)), n !== void 0 ? (i._$Co ?? (i._$Co = []))[n] = s : i._$Cl = s), s !== void 0 && (t = q(e, s._$AS(e, t.values), s, n)), t;
}
class re {
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
    const { el: { content: i }, parts: n } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? P).importNode(i, !0);
    N.currentNode = s;
    let r = N.nextNode(), o = 0, a = 0, c = n[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let d;
        c.type === 2 ? d = new X(r, r.nextSibling, this, t) : c.type === 1 ? d = new c.ctor(r, c.name, c.strings, this, t) : c.type === 6 && (d = new ce(r, this, t)), this._$AV.push(d), c = n[++a];
      }
      o !== (c == null ? void 0 : c.index) && (r = N.nextNode(), o++);
    }
    return N.currentNode = P, s;
  }
  p(t) {
    let i = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(t, n, i), i += n.strings.length - 2) : n._$AI(t[i])), i++;
  }
}
class X {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, n, s) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = n, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = q(this, t, i), Y(t) ? t === _ || t == null || t === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : t !== this._$AH && t !== R && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ie(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== _ && Y(this._$AH) ? this._$AA.nextSibling.data = t : this.T(P.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: i, _$litType$: n } = t, s = typeof n == "number" ? this._$AC(t) : (n.el === void 0 && (n.el = G.createElement(Ht(n.h, n.h[0]), this.options)), n);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === s) this._$AH.p(i);
    else {
      const o = new re(s, this), a = o.u(this.options);
      o.p(i), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = Dt.get(t.strings);
    return i === void 0 && Dt.set(t.strings, i = new G(t)), i;
  }
  k(t) {
    gt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let n, s = 0;
    for (const r of t) s === i.length ? i.push(n = new X(this.O(V()), this.O(V()), this, this.options)) : n = i[s], n._$AI(r), s++;
    s < i.length && (this._$AR(n && n._$AB.nextSibling, s), i.length = s);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, i); t !== this._$AB; ) {
      const s = xt(t).nextSibling;
      xt(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class rt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, n, s, r) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = t, this.name = i, this._$AM = s, this.options = r, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = _;
  }
  _$AI(t, i = this, n, s) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = q(this, t, i, 0), o = !Y(t) || t !== this._$AH && t !== R, o && (this._$AH = t);
    else {
      const a = t;
      let c, d;
      for (t = r[0], c = 0; c < r.length - 1; c++) d = q(this, a[n + c], i, c), d === R && (d = this._$AH[c]), o || (o = !Y(d) || d !== this._$AH[c]), d === _ ? t = _ : t !== _ && (t += (d ?? "") + r[c + 1]), this._$AH[c] = d;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class oe extends rt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === _ ? void 0 : t;
  }
}
class ae extends rt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== _);
  }
}
class le extends rt {
  constructor(t, i, n, s, r) {
    super(t, i, n, s, r), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = q(this, t, i, 0) ?? _) === R) return;
    const n = this._$AH, s = t === _ && n !== _ || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive, r = t !== _ && (n === _ || s);
    s && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ce {
  constructor(t, i, n) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    q(this, t);
  }
}
const ct = W.litHtmlPolyfillSupport;
ct == null || ct(G, X), (W.litHtmlVersions ?? (W.litHtmlVersions = [])).push("3.3.3");
const de = (e, t, i) => {
  const n = (i == null ? void 0 : i.renderBefore) ?? t;
  let s = n._$litPart$;
  if (s === void 0) {
    const r = (i == null ? void 0 : i.renderBefore) ?? null;
    n._$litPart$ = s = new X(t.insertBefore(V(), r), r, void 0, i ?? {});
  }
  return s._$AI(e), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis;
class C extends I {
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
    return R;
  }
}
var Ot;
C._$litElement$ = !0, C.finalized = !0, (Ot = M.litElementHydrateSupport) == null || Ot.call(M, { LitElement: C });
const dt = M.litElementPolyfillSupport;
dt == null || dt({ LitElement: C });
(M.litElementVersions ?? (M.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue = { attribute: !0, type: String, converter: it, reflect: !1, hasChanged: mt }, pe = (e = ue, t, i) => {
  const { kind: n, metadata: s } = i;
  let r = globalThis.litPropertyMetadata.get(s);
  if (r === void 0 && globalThis.litPropertyMetadata.set(s, r = /* @__PURE__ */ new Map()), n === "setter" && ((e = Object.create(e)).wrapped = !0), r.set(i.name, e), n === "accessor") {
    const { name: o } = i;
    return { set(a) {
      const c = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(o, c, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(o, void 0, e, a), a;
    } };
  }
  if (n === "setter") {
    const { name: o } = i;
    return function(a) {
      const c = this[o];
      t.call(this, a), this.requestUpdate(o, c, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function F(e) {
  return (t, i) => typeof i == "object" ? pe(e, t, i) : ((n, s, r) => {
    const o = s.hasOwnProperty(r);
    return s.constructor.createProperty(r, n), o ? Object.getOwnPropertyDescriptor(s, r) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function w(e) {
  return F({ ...e, state: !0, attribute: !1 });
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
  return (i, n, s) => {
    const r = (o) => {
      var a;
      return ((a = o.renderRoot) == null ? void 0 : a.querySelector(e)) ?? null;
    };
    return he(i, n, { get() {
      return r(this);
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
], ge = ["bottle", "breast_left", "breast_right", "solids"];
function fe(e, t, i, n) {
  const s = (e == null ? void 0 : e.enabled_activities) ?? me, r = (e == null ? void 0 : e.enabled_feeding_methods) ?? ge, o = (c) => c.charAt(0).toUpperCase() + c.slice(1), a = [];
  if (s.includes("diaper") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log diaper for ${t}"
                    @click=${() => n("diaper")}
                >
                    Diaper
                </button>
            `
  ), s.includes("feeding"))
    for (const c of r)
      c === "bottle" ? a.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log bottle feeding for ${t}"
                            @click=${() => n("bottle")}
                        >
                            Bottle
                        </button>
                    `
      ) : c === "solids" ? a.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${t}"
                            @click=${() => n("solids")}
                        >
                            Solids
                        </button>
                    `
      ) : (c === "breast_left" || c === "breast_right") && a.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log ${c} feeding for ${t}"
                            @click=${() => n({ activity: "feeding", method: c })}
                        >
                            ${o(c.replace("_", " "))}
                        </button>
                    `
      );
  return s.includes("sleep") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log sleep for ${t}"
                    @click=${() => n({ activity: "sleep" })}
                >
                    Sleep
                </button>
            `
  ), s.includes("tummy_time") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log tummy time for ${t}"
                    @click=${() => n({ activity: "tummy_time" })}
                >
                    Tummy time
                </button>
            `
  ), s.includes("walk") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log walk for ${t}"
                    @click=${() => n({ activity: "walk" })}
                >
                    Walk
                </button>
            `
  ), s.includes("other") && a.push(
    u`
                <button
                    class="quick"
                    aria-label="Log other activity for ${t}"
                    @click=${() => n("other")}
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
function v(e, t, i = "sensor") {
  return `${i}.babytracker_${e}_${t}`;
}
async function _e(e, t, i, n) {
  return e.callService(t, i, n);
}
function ye(e, t, i) {
  const n = {};
  return (async () => {
    try {
      const s = await e.connection.subscribeMessage(
        i,
        { type: "babytracker/get_baby_config", baby: t, subscribe: !0 }
      );
      n.current = s;
    } catch (s) {
      console.warn("babytracker: subscribeBabyConfig failed", s);
    }
  })(), () => {
    var s;
    return (s = n.current) == null ? void 0 : s.call(n);
  };
}
function Rt(e, t) {
  const i = {};
  return (async () => {
    try {
      const n = await e.connection.subscribeMessage(
        t,
        { type: "babytracker/get_integration_options", subscribe: !0 }
      );
      i.current = n;
    } catch (n) {
      console.warn(
        "babytracker: subscribeIntegrationOptions failed",
        n
      );
    }
  })(), () => {
    var n;
    return (n = i.current) == null ? void 0 : n.call(i);
  };
}
function ve(e, t, i, n, s) {
  const r = {};
  return (async () => {
    try {
      const o = await e.connection.subscribeMessage(
        s,
        {
          type: "babytracker/list_entries_in_range",
          baby: t,
          start: i,
          end: n,
          subscribe: !0
        }
      );
      r.current = o;
    } catch (o) {
      console.warn(
        "babytracker: subscribeEntriesInRange failed",
        o
      );
    }
  })(), () => {
    var o;
    return (o = r.current) == null ? void 0 : o.call(r);
  };
}
function $e(e, t, i) {
  var c, d, h, p, b, m;
  const n = ((c = e.states[v(t, "sleeping", "binary_sensor")]) == null ? void 0 : c.state) === "on", s = ((d = e.states[v(t, "feeding", "binary_sensor")]) == null ? void 0 : d.state) === "on", r = ((h = e.states[v(t, "tummy_time", "binary_sensor")]) == null ? void 0 : h.state) === "on", o = ((p = e.states[v(t, "walking", "binary_sensor")]) == null ? void 0 : p.state) === "on";
  if (!n && !s && !r && !o) return "";
  const a = [];
  if (n) {
    const l = (b = e.states[v(t, "last_sleep_start")]) == null ? void 0 : b.state;
    a.push(
      u`
                <div class="chip warning" role="status">
                    Sleeping ${l ? u`· started ${Tt(l)}` : ""}
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
  if (s && a.push(
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
  ), r && a.push(
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
    const l = (m = e.states[v(t, "last_walk_start")]) == null ? void 0 : m.state;
    a.push(
      u`
                <div class="chip warning" role="status">
                    Walking ${l ? u`· started ${Tt(l)}` : ""}
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
  return u`<div class="section">${a}</div>`;
}
function Tt(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const qt = 29.5735, Ft = 24 * 60 * 60 * 1e3;
function H(e) {
  if (!e) return 0;
  const t = Date.parse(e);
  return Number.isNaN(t) ? 0 : t;
}
function we(e, t = Ft, i = Date.now()) {
  const n = i - t;
  return e.filter((s) => H(s.timestamp) >= n).slice().sort((s, r) => H(r.timestamp) - H(s.timestamp));
}
function xe(e, t = Date.now(), i = Ft) {
  var d, h, p;
  const n = t - i;
  let s = 0, r = 0, o = 0, a = 0, c = 0;
  for (const b of e) {
    const m = H(b.timestamp);
    if (b.type === "sleep") {
      const l = m, g = b.ended_at != null && b.ended_at !== "" ? H(b.ended_at) : t;
      if (l > 0 && g > l && g > n) {
        const f = Math.max(l, n), $ = Math.min(g, t);
        $ > f && (c += ($ - f) / 6e4);
      }
      continue;
    }
    if (!(m < n)) {
      if (b.type === "feeding") {
        s += 1;
        const l = Number(((d = b.data) == null ? void 0 : d.amount) ?? 0), g = String(((h = b.data) == null ? void 0 : h.unit) ?? "");
        l > 0 && (a += g === "oz" ? l * qt : l);
      } else if (b.type === "diaper") {
        const l = String(((p = b.data) == null ? void 0 : p.kind) ?? "");
        l === "wet" ? r += 1 : l === "dirty" ? o += 1 : l === "both" && (r += 1, o += 1);
      }
    }
  }
  return { feedings: s, wetDiapers: r, dirtyDiapers: o, totalVolumeMl: a, sleepMinutes: c };
}
function ke(e) {
  if (!Number.isFinite(e) || e <= 0) return "0m";
  if (e < 60) return `${Math.round(e)}m`;
  const t = Math.floor(e / 60), i = Math.round(e % 60);
  return i === 0 ? `${t}h` : `${t}h ${i}m`;
}
function Se(e) {
  if (!Number.isFinite(e) || e <= 0) return "0 oz";
  const t = e / qt;
  return t >= 1 ? `${t.toFixed(1)} oz` : `${Math.round(e)} ml`;
}
function Nt(e) {
  const t = H(e);
  return t === 0 ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const Ae = /* @__PURE__ */ new Set(["sleep", "feeding", "tummy_time", "walk"]);
function Bt(e, t, i, n) {
  return u`
        <li
            class="clickable"
            role="button"
            tabindex="0"
            aria-label="Edit entry"
            @click=${() => t(e)}
            @keydown=${(s) => {
    (s.key === "Enter" || s.key === " ") && (s.preventDefault(), t(e));
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
                      @click=${(s) => {
    s.stopPropagation(), n(e.id);
  }}
                      @keydown=${(s) => {
    (s.key === "Enter" || s.key === " ") && (s.preventDefault(), s.stopPropagation(), n(e.id));
  }}
                  >${e.notes}</div>` : ""}
        </li>
    `;
}
function Ee(e) {
  const t = Nt(e.timestamp);
  return Ae.has(String(e.type ?? "")) && e.ended_at && e.ended_at !== e.timestamp ? u`<span class="muted"
            >${t} – ${Nt(e.ended_at)}</span
        >` : u`<span class="muted">${t}</span>`;
}
function Ce(e) {
  const t = String(e.type ?? ""), i = (e == null ? void 0 : e.data) ?? {}, n = i.name ?? i.method ?? i.kind;
  return n ? t === "feeding" && i.amount != null && i.amount !== "" && i.unit ? `${t} (${n}, ${i.amount} ${i.unit})` : `${t} (${n})` : t;
}
function De(e, t, i, n, s = /* @__PURE__ */ new Set(), r = () => {
}) {
  var d;
  const o = e.states[v(t, "recent_entries")], a = ((d = o == null ? void 0 : o.attributes) == null ? void 0 : d.entries) ?? [], c = we(a).slice(0, Math.min(n, 50));
  return u`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${c.length === 0 ? u`<p>Nothing logged yet.</p>` : u`
                      <ul class="entries">
                          ${c.map(
    (h) => Bt(
      h,
      i,
      s,
      r
    )
  )}
                      </ul>
                  `}
        </div>
    `;
}
function jt(e, t, i, n, s) {
  var b, m, l, g, f;
  const r = (n == null ? void 0 : n.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", o = (n == null ? void 0 : n.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", a = ((b = e.states[v(t, "weight")]) == null ? void 0 : b.state) ?? "—", c = ((m = e.states[v(t, "height")]) == null ? void 0 : m.state) ?? "—", d = ((l = e.states[v(t, "head_circumference")]) == null ? void 0 : l.state) ?? "—", h = ((g = e.states[v(t, "weight_percentile")]) == null ? void 0 : g.state) ?? "—", p = ((f = e.states[v(t, "height_percentile")]) == null ? void 0 : f.state) ?? "—";
  return u`
        <div class="section" role="region" aria-label="Growth">
            <div
                style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"
            >
                <h2 style="margin:0;">Growth</h2>
                <span style="flex:1;"></span>
                ${s ? u`<button
                          type="button"
                          class="primary"
                          aria-label="Log a growth measurement"
                          @click=${s}
                      >
                          Log measurement
                      </button>` : ""}
            </div>
            <div class="growth-grid">
                <div>
                    <div class="label">Weight</div>
                    <div>${a} ${r} · ${h}p</div>
                </div>
                <div>
                    <div class="label">Height</div>
                    <div>${c} ${o} · ${p}p</div>
                </div>
                <div>
                    <div class="label">Head</div>
                    <div>${d} ${o}</div>
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
    (n, s) => u`
                    <line
                        x1="0"
                        x2="300"
                        y1="${20 + s * 20}"
                        y2="${20 + s * 20}"
                        stroke="var(--divider-color)"
                        stroke-dasharray="4 4"
                    />
                    <text
                        x="290"
                        y="${20 + s * 20 - 4}"
                        font-size="9"
                        fill="var(--secondary-text-color)"
                        text-anchor="end"
                    >
                        p${n}
                    </text>
                `
  )}
        </svg>
    `;
}
function Wt(e, t) {
  return u`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var c;
    const n = /* @__PURE__ */ new Date(), s = new Date(n.getTime() - 90 * 864e5), r = (d) => d.toISOString().slice(0, 10), o = await e.callService(
      "babytracker",
      "export_report",
      { baby: t, format: "html", start: r(s), end: r(n) },
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
  var n;
  return (n = e == null ? void 0 : e.importer) != null && n.source_entity_id ? u`
        <div class="section">
            <button
                aria-label="Resync importers"
                title="Re-read the source sensor's current activities. Already-imported activities are skipped."
                @click=${(s) => i("resync_importers", { baby: t }, s.currentTarget)}
            >
                Sync importers
            </button>
        </div>
    ` : "";
}
function Me(e, t, i) {
  var o, a;
  const n = (o = e.states) == null ? void 0 : o[v(t, "recent_entries")], s = ((a = n == null ? void 0 : n.attributes) == null ? void 0 : a.entries) ?? [], r = xe(s);
  return u`
        <div class="chips" role="list" aria-label="Last 24 hours summary">
            <div class="chip" role="listitem">${r.feedings} feedings</div>
            <div class="chip" role="listitem">
                ${Se(r.totalVolumeMl)} consumed
            </div>
            <div class="chip" role="listitem">${r.wetDiapers} wet</div>
            <div class="chip" role="listitem">${r.dirtyDiapers} dirty</div>
            <div class="chip" role="listitem">
                ${ke(r.sleepMinutes)} sleep
            </div>
        </div>
    `;
}
function U() {
  const e = /* @__PURE__ */ new Date(), t = (i) => String(i).padStart(2, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}`;
}
function x(e) {
  if (!e) return;
  const t = Date.parse(e);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
function ut(e) {
  if (!e) return "";
  const t = Date.parse(e);
  if (Number.isNaN(t)) return "";
  const i = new Date(t), n = (s) => String(s).padStart(2, "0");
  return `${i.getFullYear()}-${n(i.getMonth() + 1)}-${n(i.getDate())}T${n(i.getHours())}:${n(i.getMinutes())}`;
}
const Pe = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk"
]);
function ft(e, t, i, n, s, r) {
  let o = _;
  if (e !== null)
    switch (e.kind) {
      case "diaper":
        o = Le(e.baby, i, s);
        break;
      case "bottle":
        o = Ue(
          e.baby,
          t,
          e.lastAmount,
          e.lastUnit,
          i,
          s
        );
        break;
      case "solids":
        o = ze(e.baby, i, s);
        break;
      case "other":
        o = Ie(e.baby, i, s);
        break;
      case "session":
        o = Fe(
          e.baby,
          e.activity,
          e.method,
          i,
          s
        );
        break;
      case "end_sleep_first":
        o = Oe(
          e.baby,
          e.label,
          e.then,
          n,
          s
        );
        break;
      case "confirm_delete_imported":
        o = He(
          e.entryId,
          e.entryType,
          e.source,
          e.staff ?? null,
          i,
          s
        );
        break;
      case "edit_entry":
        o = Re(
          e.entry,
          i,
          s,
          r
        );
        break;
      case "log_growth":
        o = Be(e.baby, t, i, s);
        break;
      case "log_vaccine":
        o = je(
          e.baby,
          e.defaultName ?? "",
          e.defaultDose,
          e.scheduleNames ?? [],
          i,
          s
        );
        break;
    }
  return u`
        <dialog @cancel=${s} @close=${s}>${o}</dialog>
    `;
}
function Oe(e, t, i, n, s) {
  return u`
        <form @submit=${(a) => a.preventDefault()}>
            <h2>End sleep first?</h2>
            <p>${e} is asleep. End the sleep session before ${t}?</p>
            <div class="actions">
                <button type="button" @click=${s}>Cancel</button>
                <button type="button" @click=${async () => {
    s(), await i();
  }}>Skip, just log</button>
                <button
                    type="button"
                    class="primary"
                    autofocus
                    @click=${async () => {
    try {
      await n("end_sleep", { baby: e });
    } catch (a) {
      console.warn("babytracker: end_sleep failed", a);
    }
    s(), await i();
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
        <form @submit=${(s) => {
    s.preventDefault();
    const r = s.currentTarget, o = new FormData(r, s.submitter ?? void 0);
    t("log_diaper", {
      baby: e,
      kind: String(o.get("kind") ?? "wet"),
      timestamp: x(String(o.get("when") ?? "")),
      notes: String(o.get("notes") ?? "") || void 0
    });
  }}>
            <h2>Log diaper</h2>
            <label for="when">When</label>
            <input
                id="when"
                name="when"
                type="datetime-local"
                .value=${U()}
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
function Ue(e, t, i, n, s, r) {
  const o = (t == null ? void 0 : t.volume_unit) ?? n ?? "oz", a = typeof i == "number" && Number.isFinite(i) ? String(i) : "";
  return u`
        <form @submit=${(d) => {
    d.preventDefault();
    const h = d.currentTarget, p = new FormData(h), b = String(p.get("amount") ?? ""), m = b === "" ? void 0 : Number(b), l = x(String(p.get("at") ?? "")), g = String(p.get("unit") ?? o), f = String(p.get("notes") ?? "") || void 0;
    s("log_feeding", {
      baby: e,
      method: "bottle",
      amount: m,
      unit: g,
      started_at: l,
      ended_at: l,
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
                .value=${U()}
                required
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
function ze(e, t, i) {
  return u`
        <form @submit=${(s) => {
    s.preventDefault();
    const r = s.currentTarget, o = new FormData(r), a = x(String(o.get("when") ?? ""));
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
                .value=${U()}
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
        <form @submit=${(s) => {
    s.preventDefault();
    const r = s.currentTarget, o = new FormData(r);
    t("log_other", {
      baby: e,
      name: String(o.get("name") ?? ""),
      timestamp: x(String(o.get("when") ?? "")),
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
                .value=${U()}
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
function He(e, t, i, n, s, r) {
  const o = (c) => {
    c.preventDefault(), s("delete_entry", { entry_id: e });
  }, a = n ? `${i} (${n})` : i;
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
                <button type="button" @click=${r} autofocus>Cancel</button>
                <button type="button" class="primary" @click=${o}>
                    Delete anyway
                </button>
            </div>
        </form>
    `;
}
function Re(e, t, i, n) {
  const s = String((e == null ? void 0 : e.type) ?? ""), r = (e == null ? void 0 : e.data) ?? {}, o = s === "feeding" && (r.method === "bottle" || r.method === "solids"), a = Pe.has(s) && !o, c = (p) => {
    p.preventDefault();
    const b = p.currentTarget, m = new FormData(b), l = {}, g = x(String(m.get("started") ?? ""));
    if (g && (l.timestamp = g), a) {
      const y = x(String(m.get("ended") ?? ""));
      l.ended_at = y ?? null;
    } else o && g && (l.ended_at = g);
    const f = String(m.get("notes") ?? "");
    l.notes = f || null;
    const $ = {};
    if (s === "diaper")
      $.kind = String(m.get("kind") ?? r.kind ?? "wet");
    else if (s === "feeding" && r.method === "bottle") {
      const y = String(m.get("amount") ?? ""), J = y === "" ? null : Number(y);
      $.amount = J, $.unit = String(m.get("unit") ?? r.unit ?? "oz");
    } else if (s === "other" || s === "medication") {
      const y = String(m.get("name") ?? "");
      y && ($.name = y);
    }
    Object.keys($).length && (l.data = $), t("edit_entry", { entry_id: e.id, fields: l });
  }, d = () => {
    if (!n) {
      i();
      return;
    }
    !!e.source && e.source !== "user" || i(), n({
      id: e.id,
      type: e.type,
      source: e.source,
      staff: e.staff
    });
  }, h = qe(e);
  return u`
        <form @submit=${c}>
            <h2>${h}</h2>
            ${a ? u`
                      <label for="started">Started</label>
                      <input
                          id="started"
                          name="started"
                          type="datetime-local"
                          .value=${ut(e.timestamp)}
                          required
                      />
                      <label for="ended"
                          >Ended <span class="muted">(blank = ongoing)</span></label
                      >
                      <input
                          id="ended"
                          name="ended"
                          type="datetime-local"
                          .value=${ut(e.ended_at)}
                      />
                  ` : u`
                      <label for="started">Time</label>
                      <input
                          id="started"
                          name="started"
                          type="datetime-local"
                          .value=${ut(e.timestamp)}
                          required
                      />
                  `}
            ${s === "diaper" ? u`
                      <label for="kind">Kind</label>
                      <select id="kind" name="kind">
                          <option value="wet" ?selected=${r.kind === "wet"}>
                              Wet
                          </option>
                          <option
                              value="dirty"
                              ?selected=${r.kind === "dirty"}
                          >
                              Dirty
                          </option>
                          <option value="both" ?selected=${r.kind === "both"}>
                              Both
                          </option>
                      </select>
                  ` : ""}
            ${s === "feeding" && r.method === "bottle" ? u`
                      <label for="amount">Amount</label>
                      <input
                          id="amount"
                          name="amount"
                          type="number"
                          min="0"
                          step="0.5"
                          inputmode="decimal"
                          .value=${r.amount != null ? String(r.amount) : ""}
                      />
                      <label for="unit">Unit</label>
                      <select id="unit" name="unit">
                          <option value="oz" ?selected=${r.unit === "oz"}>
                              oz
                          </option>
                          <option value="ml" ?selected=${r.unit === "ml"}>
                              ml
                          </option>
                      </select>
                  ` : ""}
            ${s === "other" || s === "medication" ? u`
                      <label for="name">Name</label>
                      <input
                          id="name"
                          name="name"
                          type="text"
                          .value=${String(r.name ?? "")}
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
                    @click=${d}
                >
                    Delete
                </button>
                <button type="submit" class="primary">Save</button>
            </div>
        </form>
    `;
}
function qe(e) {
  const t = String((e == null ? void 0 : e.type) ?? "entry"), i = (e == null ? void 0 : e.data) ?? {}, n = i.name ?? i.method ?? i.kind;
  return n ? `Edit ${t} (${n})` : `Edit ${t}`;
}
function Fe(e, t, i, n, s) {
  const r = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: i ? `Log ${i.replace("_", " ")} feeding` : "Log feeding"
  };
  return u`
        <form @submit=${(a) => {
    a.preventDefault();
    const c = a.currentTarget, d = new FormData(c), h = x(String(d.get("started") ?? "")), p = x(String(d.get("ended") ?? "")), b = String(d.get("notes") ?? "") || void 0;
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
      n(f, g);
      return;
    }
    const m = {
      baby: e,
      started_at: h,
      ended_at: p,
      notes: b
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
    n(l, m);
  }}>
            <h2>${r[t]}</h2>
            <label for="started">Started</label>
            <input
                id="started"
                name="started"
                type="datetime-local"
                .value=${U()}
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
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Be(e, t, i, n) {
  const s = (t == null ? void 0 : t.weight_unit) ?? "kg", r = (t == null ? void 0 : t.length_unit) ?? "cm";
  return u`
        <form @submit=${(a) => {
    a.preventDefault();
    const c = a.currentTarget, d = new FormData(c), h = (p) => {
      const b = String(d.get(p) ?? "").trim();
      if (!b) return;
      const m = Number(b);
      return Number.isFinite(m) ? m : void 0;
    };
    i("log_growth", {
      baby: e,
      weight: h("weight"),
      height: h("height"),
      head_circumference: h("head"),
      weight_unit: String(d.get("weight_unit") ?? s),
      length_unit: String(d.get("length_unit") ?? r),
      timestamp: x(String(d.get("when") ?? "")),
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
                        <option value="cm" ?selected=${r === "cm"}>
                            cm
                        </option>
                        <option value="in" ?selected=${r === "in"}>
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
                .value=${U()}
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
function je(e, t, i, n, s, r) {
  const o = [
    "left_thigh",
    "right_thigh",
    "left_arm",
    "right_arm",
    "oral",
    "nasal"
  ], a = (h) => {
    h.preventDefault();
    const p = h.currentTarget, b = new FormData(p), m = String(b.get("name") ?? "").trim();
    if (!m) return;
    const l = String(b.get("dose_number") ?? "").trim(), g = l === "" ? void 0 : Number(l), f = String(b.get("site") ?? "").trim() || void 0, $ = String(b.get("lot_number") ?? "").trim() || void 0, y = String(b.get("provider") ?? "").trim() || void 0;
    s("log_vaccine", {
      baby: e,
      name: m,
      dose_number: g,
      site: f,
      lot_number: $,
      provider: y,
      timestamp: x(String(b.get("when") ?? "")),
      notes: String(b.get("notes") ?? "") || void 0
    });
  }, c = Array.from(
    new Set(
      [t, ...n].filter(
        (h) => !!h && h !== "none"
      )
    )
  ), d = (h) => (p) => {
    var m;
    const b = (m = p.currentTarget.closest("form")) == null ? void 0 : m.querySelector("#vaccine_name");
    b && (b.value = h, b.focus());
  };
  return u`
        <form @submit=${a}>
            <h2>Log vaccine</h2>
            <label for="vaccine_name">Vaccine</label>
            <input
                id="vaccine_name"
                name="name"
                type="text"
                .value=${t && t !== "none" ? t : ""}
                placeholder="e.g. DTaP"
                required
                autofocus
            />
            ${c.length > 0 ? u`<div class="suggest-row" role="group" aria-label="Suggested vaccines">
                      ${c.map(
    (h) => u`<button
                              type="button"
                              class="suggest-chip"
                              @click=${d(h)}
                          >
                              ${h}
                          </button>`
  )}
                  </div>` : ""}
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
            <label for="when">When</label>
            <input
                id="when"
                name="when"
                type="datetime-local"
                .value=${U()}
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
const pt = 24 * 60 * 60 * 1e3, Mt = 29.5735;
function We(e, t, i = 7) {
  var h, p, b, m;
  const n = (h = e == null ? void 0 : e.states) == null ? void 0 : h[v(t, "recent_entries")], s = ((p = n == null ? void 0 : n.attributes) == null ? void 0 : p.entries) ?? [], r = Date.now(), o = new Date(r);
  o.setHours(0, 0, 0, 0);
  const a = [], c = (l) => l.toLocaleDateString([], { weekday: "short" });
  for (let l = i - 1; l >= 0; l--) {
    const g = new Date(o.getTime() - l * pt);
    a.push({
      label: c(g),
      sleepMinutes: 0,
      feedings: 0,
      bottleMl: 0,
      diapers: 0
    });
  }
  const d = o.getTime() - (i - 1) * pt;
  for (const l of s) {
    const g = Date.parse(l == null ? void 0 : l.timestamp);
    if (!Number.isFinite(g)) continue;
    const f = Math.floor((g - d) / pt);
    if (f < 0 || f >= i) continue;
    const $ = a[f];
    if (l.type === "feeding") {
      $.feedings += 1;
      const y = Number(((b = l == null ? void 0 : l.data) == null ? void 0 : b.amount) ?? 0), J = String(((m = l == null ? void 0 : l.data) == null ? void 0 : m.unit) ?? "");
      y > 0 && J === "oz" ? $.bottleMl += y * Mt : y > 0 && J === "ml" && ($.bottleMl += y);
    } else if (l.type === "diaper")
      $.diapers += 1;
    else if (l.type === "sleep") {
      const y = l != null && l.ended_at && l.ended_at !== "" ? Date.parse(l.ended_at) : r;
      Number.isFinite(y) && y > g && ($.sleepMinutes += (y - g) / 6e4);
    }
  }
  return a.every((l) => l.sleepMinutes === 0 && l.feedings === 0 && l.diapers === 0) ? "" : u`
        <div class="section" role="region" aria-label="Trends">
            <h2>Trends · last ${i} days</h2>
            ${Q(
    a.map((l) => ({ label: l.label, value: l.sleepMinutes })),
    "Sleep (min/day)",
    (l) => `${Math.round(l)}`
  )}
            ${Q(
    a.map((l) => ({ label: l.label, value: l.feedings })),
    "Feedings/day",
    (l) => `${l}`
  )}
            ${Q(
    a.map((l) => ({ label: l.label, value: l.bottleMl })),
    "Bottle (oz/day)",
    (l) => (l / Mt).toFixed(1)
  )}
            ${Q(
    a.map((l) => ({ label: l.label, value: l.diapers })),
    "Diapers/day",
    (l) => `${l}`
  )}
        </div>
    `;
}
function Q(e, t, i) {
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
                ${e.map((d, h) => {
    const p = 14 + h * c, b = c * 0.7, m = p + (c - b) / 2, l = Math.max(
      d.value > 0 ? 2 : 0,
      d.value / a * (90 - 24 * 2)
    ), g = 66 - l;
    return u`
                        <rect
                            x=${m}
                            y=${g}
                            width=${b}
                            height=${l}
                            fill="var(--primary-color)"
                            rx="2"
                        ></rect>
                        <text
                            x=${m + b / 2}
                            y=${g - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${d.value > 0 ? i(d.value) : ""}
                        </text>
                        <text
                            x=${m + b / 2}
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
function Ve(e, t, i) {
  var r, o;
  const n = e.states[v(t, "vaccines_due")];
  if (!n || n.state === "unknown") return "";
  const s = ((r = e.states[v(t, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : r.state) === "on";
  return u`
        <div
            class="section chip ${s ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${n.state}</strong>
            ${(o = n.attributes) != null && o.due_on ? u`<span>(${n.attributes.due_on})</span>` : ""}
            ${s ? u`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
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
var Ye = Object.defineProperty, Ge = Object.getOwnPropertyDescriptor, K = (e, t, i, n) => {
  for (var s = n > 1 ? void 0 : n ? Ge(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (s = (n ? o(t, i, s) : o(s)) || s);
  return n && s && Ye(t, i, s), s;
};
const Ze = ["vaccines", "growth", "trends", "export"];
let O = class extends C {
  constructor() {
    super(...arguments), this._modal = null, this._closeModal = () => {
      this._modal = null;
    }, this._submitModal = async (e, t) => {
      await this.hass.callService("babytracker", e, t), this._modal = null;
    }, this._callService = async (e, t) => this.hass.callService("babytracker", e, t), this._requestLogGrowth = () => {
      var e;
      (e = this._config) != null && e.baby && (this._modal = { kind: "log_growth", baby: this._config.baby });
    }, this._requestLogVaccine = () => {
      var o, a, c, d, h;
      if (!((o = this._config) != null && o.baby)) return;
      const e = (c = (a = this.hass) == null ? void 0 : a.states) == null ? void 0 : c[v(this._config.baby, "vaccines_due")], t = e != null && e.state && e.state !== "none" && e.state !== "unknown" ? String(e.state) : "", i = (d = e == null ? void 0 : e.attributes) == null ? void 0 : d.dose_number, n = typeof i == "number" ? i : void 0, r = (Array.isArray((h = e == null ? void 0 : e.attributes) == null ? void 0 : h.upcoming) ? e.attributes.upcoming : []).map((p) => p && typeof p.name == "string" ? p.name : null).filter((p) => !!p);
      this._modal = {
        kind: "log_vaccine",
        baby: this._config.baby,
        defaultName: t,
        defaultDose: n,
        scheduleNames: r
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
    var e;
    (e = this._unsubOptions) == null || e.call(this), this._unsubOptions = void 0, super.disconnectedCallback();
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
    !this.hass || !this._config || this._unsubOptions || (this._unsubOptions = Rt(
      this.hass,
      (e) => {
        this._options = e;
      }
    ));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? Ze;
  }
  render() {
    if (!this.hass || !this._config) return u``;
    const e = this._sections;
    return u`
            <ha-card>
                ${e.includes("vaccines") ? Ve(
      this.hass,
      this._config.baby,
      this._requestLogVaccine
    ) : ""}
                ${e.includes("growth") ? jt(
      this.hass,
      this._config.baby,
      this._options,
      this._config.units,
      this._requestLogGrowth
    ) : ""}
                ${e.includes("trends") ? We(
      this.hass,
      this._config.baby,
      this._config.trend_days ?? 7
    ) : ""}
                ${e.includes("export") ? Wt(this.hass, this._config.baby) : ""}
            </ha-card>
            ${ft(
      this._modal,
      this._options,
      this._submitModal,
      this._callService,
      this._closeModal
    )}
        `;
  }
  static getStubConfig() {
    return { type: "custom:babytracker-summary-card", baby: "ava" };
  }
};
O.styles = st`
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
        dialog .suggest-row {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: -4px;
        }
        dialog .suggest-chip {
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color);
            border-radius: 14px;
            padding: 4px 10px;
            font-size: 0.85rem;
            cursor: pointer;
        }
        dialog .suggest-chip:hover,
        dialog .suggest-chip:focus-visible {
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
            border-color: transparent;
            outline: none;
        }
    `;
K([
  F({ attribute: !1 })
], O.prototype, "hass", 2);
K([
  w()
], O.prototype, "_config", 2);
K([
  w()
], O.prototype, "_options", 2);
K([
  w()
], O.prototype, "_modal", 2);
O = K([
  ot("babytracker-summary-card")
], O);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-summary-card",
  name: "babytracker — summary",
  description: "Vaccines, growth, 7-day trend charts, and pediatrician export for one baby."
});
var Xe = Object.defineProperty, Ke = Object.getOwnPropertyDescriptor, z = (e, t, i, n) => {
  for (var s = n > 1 ? void 0 : n ? Ke(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (s = (n ? o(t, i, s) : o(s)) || s);
  return n && s && Xe(t, i, s), s;
};
function Pt(e) {
  return String(e).padStart(2, "0");
}
function et(e) {
  return `${e.getFullYear()}-${Pt(e.getMonth() + 1)}-${Pt(e.getDate())}`;
}
function Z(e) {
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
  if (!t) return null;
  const i = Number(t[1]), n = Number(t[2]) - 1, s = Number(t[3]), r = new Date(i, n, s, 0, 0, 0, 0);
  return Number.isNaN(r.getTime()) ? null : r;
}
function Je(e) {
  const t = Z(e) ?? /* @__PURE__ */ new Date(), i = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0), n = new Date(
    t.getFullYear(),
    t.getMonth(),
    t.getDate(),
    23,
    59,
    59,
    999
  );
  return { startIso: i.toISOString(), endIso: n.toISOString() };
}
function Qe(e, t) {
  const i = Z(e) ?? /* @__PURE__ */ new Date();
  return i.setDate(i.getDate() + t), et(i);
}
function ti(e) {
  const t = Z(e);
  return t ? t.toLocaleDateString([], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : e;
}
let S = class extends C {
  constructor() {
    super(...arguments), this._date = et(/* @__PURE__ */ new Date()), this._entries = [], this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._today = () => {
      this._date = et(/* @__PURE__ */ new Date());
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
    var i, n;
    if (!this.hass || !((i = this._config) != null && i.baby)) return;
    (n = this._unsubEntries) == null || n.call(this);
    const { startIso: e, endIso: t } = Je(this._date);
    this._unsubEntries = ve(
      this.hass,
      this._config.baby,
      e,
      t,
      (s) => {
        this._entries = Array.isArray(s) ? s : [];
      }
    );
  }
  _go(e) {
    this._date = Qe(this._date, e);
  }
  render() {
    if (!this.hass || !this._config) return u``;
    const e = this._date === et(/* @__PURE__ */ new Date());
    return u`
            <ha-card>
                <h2>History — ${ti(this._date)}</h2>
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
      (t) => Bt(
        t,
        this._requestEdit,
        this._expandedNotes,
        this._toggleNotes
      )
    )}
                          </ul>
                      `}
            </ha-card>
            ${ft(
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
S.styles = st`
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
  F({ attribute: !1 })
], S.prototype, "hass", 2);
z([
  w()
], S.prototype, "_config", 2);
z([
  w()
], S.prototype, "_date", 2);
z([
  w()
], S.prototype, "_entries", 2);
z([
  w()
], S.prototype, "_modal", 2);
z([
  w()
], S.prototype, "_expandedNotes", 2);
S = z([
  ot("babytracker-history-card")
], S);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-history-card",
  name: "babytracker — history",
  description: "Paginate through one baby's entries by calendar day with edit + delete."
});
var ei = Object.defineProperty, ii = Object.getOwnPropertyDescriptor, D = (e, t, i, n) => {
  for (var s = n > 1 ? void 0 : n ? ii(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (s = (n ? o(t, i, s) : o(s)) || s);
  return n && s && ei(t, i, s), s;
};
const ni = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "recent",
  "importer_sync"
];
let k = class extends C {
  constructor() {
    super(...arguments), this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._handleService = async (e, t, i) => {
      const n = i instanceof HTMLElement && i.classList.contains("quick") ? i : null;
      try {
        const s = await _e(this.hass, "babytracker", e, t);
        return n && (n.classList.add("logged"), setTimeout(() => n.classList.remove("logged"), 700)), this.requestUpdate(), s;
      } catch (s) {
        throw console.warn("babytracker: service call failed", e, s), s;
      }
    }, this._requestModal = (e) => {
      const t = this._baby();
      if (typeof e == "string") {
        const s = {
          diaper: "logging a diaper",
          bottle: "logging a bottle",
          solids: "logging solids",
          other: "logging this"
        };
        this._interceptIfSleeping(s[e], () => {
          if (e === "bottle") {
            const r = this._lastBottle();
            this._modal = {
              kind: "bottle",
              baby: t,
              lastAmount: r == null ? void 0 : r.amount,
              lastUnit: r == null ? void 0 : r.unit
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
      }, n = () => {
        this._modal = {
          kind: "session",
          baby: t,
          activity: e.activity,
          method: e.method
        };
      };
      if (e.activity === "sleep") {
        n();
        return;
      }
      this._interceptIfSleeping(i[e.activity], n);
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
    )), this._unsubOptions || (this._unsubOptions = Rt(
      this.hass,
      (e) => {
        this._options = e;
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? ni;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(e, t = "sensor") {
    return v(this._baby(), e, t);
  }
  _renderStatus() {
    var o, a, c, d, h, p, b, m, l, g;
    const e = this.hass, t = (a = (o = e.states) == null ? void 0 : o[this._entityId("last_feeding")]) == null ? void 0 : a.state, i = (d = (c = e.states) == null ? void 0 : c[this._entityId("last_diaper")]) == null ? void 0 : d.state, n = ((p = (h = e.states) == null ? void 0 : h[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : p.state) === "on", s = ((m = (b = e.states) == null ? void 0 : b[this._entityId("walking", "binary_sensor")]) == null ? void 0 : m.state) === "on", r = ((g = (l = e.states) == null ? void 0 : l[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : g.state) === "on";
    return u`
            <div class="chips" role="list" aria-label="Status chips">
                <div class="chip" role="listitem">
                    Last feeding: ${this._timeSince(t)}
                </div>
                <div class="chip" role="listitem">
                    Last diaper: ${this._timeSince(i)}
                </div>
                ${n ? u`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
                ${s ? u`<div class="chip warning" role="listitem">On a walk</div>` : ""}
                ${r ? u`<div class="chip warning" role="listitem">At daycare</div>` : ""}
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
    const n = Math.floor(i / 60);
    return n < 24 ? `${n}h ${i % 60}m` : `${Math.floor(n / 24)}d`;
  }
  _isSleeping() {
    var e, t, i;
    return ((i = (t = (e = this.hass) == null ? void 0 : e.states) == null ? void 0 : t[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : i.state) === "on";
  }
  _lastBottle() {
    var i, n, s, r, o, a, c;
    const e = (n = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : n[this._entityId("recent_entries")], t = ((s = e == null ? void 0 : e.attributes) == null ? void 0 : s.entries) ?? [];
    for (const d of t)
      if ((d == null ? void 0 : d.type) === "feeding" && ((r = d == null ? void 0 : d.data) == null ? void 0 : r.method) === "bottle" && typeof ((o = d == null ? void 0 : d.data) == null ? void 0 : o.amount) == "number" && (((a = d == null ? void 0 : d.data) == null ? void 0 : a.unit) === "ml" || ((c = d == null ? void 0 : d.data) == null ? void 0 : c.unit) === "oz"))
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
                ${e.includes("quick_log") ? fe(
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
                ${e.includes("export") ? Wt(this.hass, this._baby()) : ""}
            </ha-card>
            ${ft(
      this._modal,
      this._options,
      this._submitModal,
      (i, n) => this._handleService(i, n),
      this._closeModal,
      this._requestDelete
    )}
        `;
  }
};
k.styles = st`
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
D([
  F({ attribute: !1 })
], k.prototype, "hass", 2);
D([
  w()
], k.prototype, "_config", 2);
D([
  w()
], k.prototype, "_babyConfig", 2);
D([
  w()
], k.prototype, "_options", 2);
D([
  w()
], k.prototype, "_modal", 2);
D([
  w()
], k.prototype, "_expandedNotes", 2);
D([
  be("dialog")
], k.prototype, "_dialog", 2);
k = D([
  ot("babytracker-card")
], k);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => oi);
var si = Object.defineProperty, ri = Object.getOwnPropertyDescriptor, _t = (e, t, i, n) => {
  for (var s = n > 1 ? void 0 : n ? ri(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (s = (n ? o(t, i, s) : o(s)) || s);
  return n && s && si(t, i, s), s;
};
let L = class extends C {
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
L.styles = st`
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
_t([
  F({ attribute: !1 })
], L.prototype, "hass", 2);
_t([
  F({ attribute: !1 })
], L.prototype, "_config", 2);
L = _t([
  ot("babytracker-card-editor")
], L);
L.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const oi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return L;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  k as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
