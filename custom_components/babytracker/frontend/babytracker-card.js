/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const tt = globalThis, bt = tt.ShadowRoot && (tt.ShadyCSS === void 0 || tt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, mt = Symbol(), $t = /* @__PURE__ */ new WeakMap();
let Ut = class {
  constructor(t, i, n) {
    if (this._$cssResult$ = !0, n !== mt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (bt && t === void 0) {
      const n = i !== void 0 && i.length === 1;
      n && (t = $t.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && $t.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Jt = (e) => new Ut(typeof e == "string" ? e : e + "", void 0, mt), st = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((n, s, r) => n + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[r + 1], e[0]);
  return new Ut(i, e, mt);
}, Qt = (e, t) => {
  if (bt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const n = document.createElement("style"), s = tt.litNonce;
    s !== void 0 && n.setAttribute("nonce", s), n.textContent = i.cssText, e.appendChild(n);
  }
}, wt = bt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const n of t.cssRules) i += n.cssText;
  return Jt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: te, defineProperty: ee, getOwnPropertyDescriptor: ie, getOwnPropertyNames: ne, getOwnPropertySymbols: se, getPrototypeOf: re } = Object, E = globalThis, xt = E.trustedTypes, oe = xt ? xt.emptyScript : "", at = E.reactiveElementPolyfillSupport, W = (e, t) => e, it = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? oe : null;
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
} }, gt = (e, t) => !te(e, t), kt = { attribute: !0, type: String, converter: it, reflect: !1, useDefault: !1, hasChanged: gt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), E.litPropertyMetadata ?? (E.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let z = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = kt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const n = Symbol(), s = this.getPropertyDescriptor(t, n, i);
      s !== void 0 && ee(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, i, n) {
    const { get: s, set: r } = ie(this.prototype, t) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: s, set(o) {
      const l = s == null ? void 0 : s.call(this);
      r == null || r.call(this, o), this.requestUpdate(t, l, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? kt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(W("elementProperties"))) return;
    const t = re(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(W("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(W("properties"))) {
      const i = this.properties, n = [...ne(i), ...se(i)];
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
      for (const s of n) i.unshift(wt(s));
    } else t !== void 0 && i.push(wt(t));
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
    return Qt(t, this.constructor.elementStyles), t;
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
      const l = n.getPropertyOptions(s), c = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((r = l.converter) == null ? void 0 : r.fromAttribute) !== void 0 ? l.converter : it;
      this._$Em = s;
      const d = c.fromAttribute(i, l.type);
      this[s] = d ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, i, n, s = !1, r) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (s === !1 && (r = this[t]), n ?? (n = l.getPropertyOptions(t)), !((n.hasChanged ?? gt)(r, i) || n.useDefault && n.reflect && r === ((o = this._$Ej) == null ? void 0 : o.get(t)) && !this.hasAttribute(l._$Eu(t, n)))) return;
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
        const { wrapped: l } = o, c = this[r];
        l !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, o, c);
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
z.elementStyles = [], z.shadowRootOptions = { mode: "open" }, z[W("elementProperties")] = /* @__PURE__ */ new Map(), z[W("finalized")] = /* @__PURE__ */ new Map(), at == null || at({ ReactiveElement: z }), (E.reactiveElementVersions ?? (E.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Y = globalThis, St = (e) => e, nt = Y.trustedTypes, At = nt ? nt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, zt = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, Ht = "?" + A, ae = `<${Ht}>`, L = document, G = () => L.createComment(""), Z = (e) => e === null || typeof e != "object" && typeof e != "function", ft = Array.isArray, le = (e) => ft(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", lt = `[ 	
\f\r]`, j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Et = /-->/g, Ct = />/g, M = RegExp(`>|${lt}(?:([^\\s"'>=/]+)(${lt}*=${lt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Dt = /'/g, Tt = /"/g, Rt = /^(?:script|style|textarea|title)$/i, ce = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), u = ce(1), R = Symbol.for("lit-noChange"), y = Symbol.for("lit-nothing"), Nt = /* @__PURE__ */ new WeakMap(), P = L.createTreeWalker(L, 129);
function qt(e, t) {
  if (!ft(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return At !== void 0 ? At.createHTML(t) : t;
}
const de = (e, t) => {
  const i = e.length - 1, n = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = j;
  for (let l = 0; l < i; l++) {
    const c = e[l];
    let d, h, p = -1, b = 0;
    for (; b < c.length && (o.lastIndex = b, h = o.exec(c), h !== null); ) b = o.lastIndex, o === j ? h[1] === "!--" ? o = Et : h[1] !== void 0 ? o = Ct : h[2] !== void 0 ? (Rt.test(h[2]) && (s = RegExp("</" + h[2], "g")), o = M) : h[3] !== void 0 && (o = M) : o === M ? h[0] === ">" ? (o = s ?? j, p = -1) : h[1] === void 0 ? p = -2 : (p = o.lastIndex - h[2].length, d = h[1], o = h[3] === void 0 ? M : h[3] === '"' ? Tt : Dt) : o === Tt || o === Dt ? o = M : o === Et || o === Ct ? o = j : (o = M, s = void 0);
    const m = o === M && e[l + 1].startsWith("/>") ? " " : "";
    r += o === j ? c + ae : p >= 0 ? (n.push(d), c.slice(0, p) + zt + c.slice(p) + A + m) : c + A + (p === -2 ? l : m);
  }
  return [qt(e, r + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), n];
};
class K {
  constructor({ strings: t, _$litType$: i }, n) {
    let s;
    this.parts = [];
    let r = 0, o = 0;
    const l = t.length - 1, c = this.parts, [d, h] = de(t, i);
    if (this.el = K.createElement(d, n), P.currentNode = this.el.content, i === 2 || i === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (s = P.nextNode()) !== null && c.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const p of s.getAttributeNames()) if (p.endsWith(zt)) {
          const b = h[o++], m = s.getAttribute(p).split(A), a = /([.?@])?(.*)/.exec(b);
          c.push({ type: 1, index: r, name: a[2], strings: m, ctor: a[1] === "." ? pe : a[1] === "?" ? he : a[1] === "@" ? be : rt }), s.removeAttribute(p);
        } else p.startsWith(A) && (c.push({ type: 6, index: r }), s.removeAttribute(p));
        if (Rt.test(s.tagName)) {
          const p = s.textContent.split(A), b = p.length - 1;
          if (b > 0) {
            s.textContent = nt ? nt.emptyScript : "";
            for (let m = 0; m < b; m++) s.append(p[m], G()), P.nextNode(), c.push({ type: 2, index: ++r });
            s.append(p[b], G());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Ht) c.push({ type: 2, index: r });
      else {
        let p = -1;
        for (; (p = s.data.indexOf(A, p + 1)) !== -1; ) c.push({ type: 7, index: r }), p += A.length - 1;
      }
      r++;
    }
  }
  static createElement(t, i) {
    const n = L.createElement("template");
    return n.innerHTML = t, n;
  }
}
function q(e, t, i = e, n) {
  var o, l;
  if (t === R) return t;
  let s = n !== void 0 ? (o = i._$Co) == null ? void 0 : o[n] : i._$Cl;
  const r = Z(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== r && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), r === void 0 ? s = void 0 : (s = new r(e), s._$AT(e, i, n)), n !== void 0 ? (i._$Co ?? (i._$Co = []))[n] = s : i._$Cl = s), s !== void 0 && (t = q(e, s._$AS(e, t.values), s, n)), t;
}
class ue {
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
    const { el: { content: i }, parts: n } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? L).importNode(i, !0);
    P.currentNode = s;
    let r = P.nextNode(), o = 0, l = 0, c = n[0];
    for (; c !== void 0; ) {
      if (o === c.index) {
        let d;
        c.type === 2 ? d = new J(r, r.nextSibling, this, t) : c.type === 1 ? d = new c.ctor(r, c.name, c.strings, this, t) : c.type === 6 && (d = new me(r, this, t)), this._$AV.push(d), c = n[++l];
      }
      o !== (c == null ? void 0 : c.index) && (r = P.nextNode(), o++);
    }
    return P.currentNode = L, s;
  }
  p(t) {
    let i = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(t, n, i), i += n.strings.length - 2) : n._$AI(t[i])), i++;
  }
}
class J {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, n, s) {
    this.type = 2, this._$AH = y, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = n, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
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
    t = q(this, t, i), Z(t) ? t === y || t == null || t === "" ? (this._$AH !== y && this._$AR(), this._$AH = y) : t !== this._$AH && t !== R && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : le(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== y && Z(this._$AH) ? this._$AA.nextSibling.data = t : this.T(L.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var r;
    const { values: i, _$litType$: n } = t, s = typeof n == "number" ? this._$AC(t) : (n.el === void 0 && (n.el = K.createElement(qt(n.h, n.h[0]), this.options)), n);
    if (((r = this._$AH) == null ? void 0 : r._$AD) === s) this._$AH.p(i);
    else {
      const o = new ue(s, this), l = o.u(this.options);
      o.p(i), this.T(l), this._$AH = o;
    }
  }
  _$AC(t) {
    let i = Nt.get(t.strings);
    return i === void 0 && Nt.set(t.strings, i = new K(t)), i;
  }
  k(t) {
    ft(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let n, s = 0;
    for (const r of t) s === i.length ? i.push(n = new J(this.O(G()), this.O(G()), this, this.options)) : n = i[s], n._$AI(r), s++;
    s < i.length && (this._$AR(n && n._$AB.nextSibling, s), i.length = s);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, i); t !== this._$AB; ) {
      const s = St(t).nextSibling;
      St(t).remove(), t = s;
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
    this.type = 1, this._$AH = y, this._$AN = void 0, this.element = t, this.name = i, this._$AM = s, this.options = r, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = y;
  }
  _$AI(t, i = this, n, s) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = q(this, t, i, 0), o = !Z(t) || t !== this._$AH && t !== R, o && (this._$AH = t);
    else {
      const l = t;
      let c, d;
      for (t = r[0], c = 0; c < r.length - 1; c++) d = q(this, l[n + c], i, c), d === R && (d = this._$AH[c]), o || (o = !Z(d) || d !== this._$AH[c]), d === y ? t = y : t !== y && (t += (d ?? "") + r[c + 1]), this._$AH[c] = d;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class pe extends rt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === y ? void 0 : t;
  }
}
class he extends rt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== y);
  }
}
class be extends rt {
  constructor(t, i, n, s, r) {
    super(t, i, n, s, r), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = q(this, t, i, 0) ?? y) === R) return;
    const n = this._$AH, s = t === y && n !== y || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive, r = t !== y && (n === y || s);
    s && this.element.removeEventListener(this.name, this, n), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class me {
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
const ct = Y.litHtmlPolyfillSupport;
ct == null || ct(K, J), (Y.litHtmlVersions ?? (Y.litHtmlVersions = [])).push("3.3.3");
const ge = (e, t, i) => {
  const n = (i == null ? void 0 : i.renderBefore) ?? t;
  let s = n._$litPart$;
  if (s === void 0) {
    const r = (i == null ? void 0 : i.renderBefore) ?? null;
    n._$litPart$ = s = new J(t.insertBefore(G(), r), r, void 0, i ?? {});
  }
  return s._$AI(e), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const O = globalThis;
class C extends z {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ge(i, this.renderRoot, this.renderOptions);
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
var It;
C._$litElement$ = !0, C.finalized = !0, (It = O.litElementHydrateSupport) == null || It.call(O, { LitElement: C });
const dt = O.litElementPolyfillSupport;
dt == null || dt({ LitElement: C });
(O.litElementVersions ?? (O.litElementVersions = [])).push("4.2.2");
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
const fe = { attribute: !0, type: String, converter: it, reflect: !1, hasChanged: gt }, _e = (e = fe, t, i) => {
  const { kind: n, metadata: s } = i;
  let r = globalThis.litPropertyMetadata.get(s);
  if (r === void 0 && globalThis.litPropertyMetadata.set(s, r = /* @__PURE__ */ new Map()), n === "setter" && ((e = Object.create(e)).wrapped = !0), r.set(i.name, e), n === "accessor") {
    const { name: o } = i;
    return { set(l) {
      const c = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, c, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, e, l), l;
    } };
  }
  if (n === "setter") {
    const { name: o } = i;
    return function(l) {
      const c = this[o];
      t.call(this, l), this.requestUpdate(o, c, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function F(e) {
  return (t, i) => typeof i == "object" ? _e(e, t, i) : ((n, s, r) => {
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
const ye = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ve(e, t) {
  return (i, n, s) => {
    const r = (o) => {
      var l;
      return ((l = o.renderRoot) == null ? void 0 : l.querySelector(e)) ?? null;
    };
    return ye(i, n, { get() {
      return r(this);
    } });
  };
}
const $e = [
  "feeding",
  "sleep",
  "tummy_time",
  "diaper",
  "growth",
  "medication",
  "vaccine",
  "walk",
  "other"
], we = ["bottle", "breast_left", "breast_right", "solids"];
function xe(e, t, i, n) {
  const s = (e == null ? void 0 : e.enabled_activities) ?? $e, r = (e == null ? void 0 : e.enabled_feeding_methods) ?? we, o = (c) => c.charAt(0).toUpperCase() + c.slice(1), l = [];
  if (s.includes("diaper") && l.push(
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
      c === "bottle" ? l.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log bottle feeding for ${t}"
                            @click=${() => n("bottle")}
                        >
                            Bottle
                        </button>
                    `
      ) : c === "solids" ? l.push(
        u`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${t}"
                            @click=${() => n("solids")}
                        >
                            Solids
                        </button>
                    `
      ) : (c === "breast_left" || c === "breast_right") && l.push(
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
  return s.includes("sleep") && l.push(
    u`
                <button
                    class="quick"
                    aria-label="Log sleep for ${t}"
                    @click=${() => n({ activity: "sleep" })}
                >
                    Sleep
                </button>
            `
  ), s.includes("tummy_time") && l.push(
    u`
                <button
                    class="quick"
                    aria-label="Log tummy time for ${t}"
                    @click=${() => n({ activity: "tummy_time" })}
                >
                    Tummy time
                </button>
            `
  ), s.includes("walk") && l.push(
    u`
                <button
                    class="quick"
                    aria-label="Log walk for ${t}"
                    @click=${() => n({ activity: "walk" })}
                >
                    Walk
                </button>
            `
  ), s.includes("other") && l.push(
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
            ${l}
        </div>
    `;
}
function $(e, t, i = "sensor") {
  return `${i}.babytracker_${e}_${t}`;
}
async function ke(e, t, i, n) {
  return e.callService(t, i, n);
}
function Se(e, t, i) {
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
function Ft(e, t) {
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
function Ae(e, t, i, n, s) {
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
function Ee(e, t, i) {
  const n = {};
  return (async () => {
    try {
      const s = await e.connection.subscribeMessage(
        i,
        { type: "babytracker/list_vaccines", baby: t, subscribe: !0 }
      );
      n.current = s;
    } catch (s) {
      console.warn("babytracker: subscribeVaccines failed", s);
    }
  })(), () => {
    var s;
    return (s = n.current) == null ? void 0 : s.call(n);
  };
}
function Ce(e, t, i) {
  var c, d, h, p, b, m;
  const n = ((c = e.states[$(t, "sleeping", "binary_sensor")]) == null ? void 0 : c.state) === "on", s = ((d = e.states[$(t, "feeding", "binary_sensor")]) == null ? void 0 : d.state) === "on", r = ((h = e.states[$(t, "tummy_time", "binary_sensor")]) == null ? void 0 : h.state) === "on", o = ((p = e.states[$(t, "walking", "binary_sensor")]) == null ? void 0 : p.state) === "on";
  if (!n && !s && !r && !o) return "";
  const l = [];
  if (n) {
    const a = (b = e.states[$(t, "last_sleep_start")]) == null ? void 0 : b.state;
    l.push(
      u`
                <div class="chip warning" role="status">
                    Sleeping ${a ? u`· started ${Mt(a)}` : ""}
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
  if (s && l.push(
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
  ), r && l.push(
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
    const a = (m = e.states[$(t, "last_walk_start")]) == null ? void 0 : m.state;
    l.push(
      u`
                <div class="chip warning" role="status">
                    Walking ${a ? u`· started ${Mt(a)}` : ""}
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
function Mt(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const Bt = 29.5735, Vt = 24 * 60 * 60 * 1e3;
function H(e) {
  if (!e) return 0;
  const t = Date.parse(e);
  return Number.isNaN(t) ? 0 : t;
}
function De(e, t = Vt, i = Date.now()) {
  const n = i - t;
  return e.filter((s) => H(s.timestamp) >= n).slice().sort((s, r) => H(r.timestamp) - H(s.timestamp));
}
function Te(e, t = Date.now(), i = Vt) {
  var d, h, p;
  const n = t - i;
  let s = 0, r = 0, o = 0, l = 0, c = 0;
  for (const b of e) {
    const m = H(b.timestamp);
    if (b.type === "sleep") {
      const a = m, g = b.ended_at != null && b.ended_at !== "" ? H(b.ended_at) : t;
      if (a > 0 && g > a && g > n) {
        const f = Math.max(a, n), _ = Math.min(g, t);
        _ > f && (c += (_ - f) / 6e4);
      }
      continue;
    }
    if (!(m < n)) {
      if (b.type === "feeding") {
        s += 1;
        const a = Number(((d = b.data) == null ? void 0 : d.amount) ?? 0), g = String(((h = b.data) == null ? void 0 : h.unit) ?? "");
        a > 0 && (l += g === "oz" ? a * Bt : a);
      } else if (b.type === "diaper") {
        const a = String(((p = b.data) == null ? void 0 : p.kind) ?? "");
        a === "wet" ? r += 1 : a === "dirty" ? o += 1 : a === "both" && (r += 1, o += 1);
      }
    }
  }
  return { feedings: s, wetDiapers: r, dirtyDiapers: o, totalVolumeMl: l, sleepMinutes: c };
}
function Ne(e) {
  if (!Number.isFinite(e) || e <= 0) return "0m";
  if (e < 60) return `${Math.round(e)}m`;
  const t = Math.floor(e / 60), i = Math.round(e % 60);
  return i === 0 ? `${t}h` : `${t}h ${i}m`;
}
function Me(e) {
  if (!Number.isFinite(e) || e <= 0) return "0 oz";
  const t = e / Bt;
  return t >= 1 ? `${t.toFixed(1)} oz` : `${Math.round(e)} ml`;
}
function Pt(e) {
  const t = H(e);
  return t === 0 ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const Pe = /* @__PURE__ */ new Set(["sleep", "feeding", "tummy_time", "walk"]);
function jt(e, t, i, n) {
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
                <span aria-label="Entry type">${Le(e)}</span>
                ${Oe(e)}
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
function Oe(e) {
  const t = Pt(e.timestamp);
  return Pe.has(String(e.type ?? "")) && e.ended_at && e.ended_at !== e.timestamp ? u`<span class="muted"
            >${t} – ${Pt(e.ended_at)}</span
        >` : u`<span class="muted">${t}</span>`;
}
function Le(e) {
  const t = String(e.type ?? ""), i = (e == null ? void 0 : e.data) ?? {}, n = i.name ?? i.method ?? i.kind;
  return n ? t === "feeding" && i.amount != null && i.amount !== "" && i.unit ? `${t} (${n}, ${i.amount} ${i.unit})` : `${t} (${n})` : t;
}
function Ie(e, t, i, n, s = /* @__PURE__ */ new Set(), r = () => {
}) {
  var d;
  const o = e.states[$(t, "recent_entries")], l = ((d = o == null ? void 0 : o.attributes) == null ? void 0 : d.entries) ?? [], c = De(l).slice(0, Math.min(n, 50));
  return u`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${c.length === 0 ? u`<p>Nothing logged yet.</p>` : u`
                      <ul class="entries">
                          ${c.map(
    (h) => jt(
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
function Wt(e, t, i, n, s) {
  var b, m, a, g, f;
  const r = (n == null ? void 0 : n.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", o = (n == null ? void 0 : n.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", l = ((b = e.states[$(t, "weight")]) == null ? void 0 : b.state) ?? "—", c = ((m = e.states[$(t, "height")]) == null ? void 0 : m.state) ?? "—", d = ((a = e.states[$(t, "head_circumference")]) == null ? void 0 : a.state) ?? "—", h = ((g = e.states[$(t, "weight_percentile")]) == null ? void 0 : g.state) ?? "—", p = ((f = e.states[$(t, "height_percentile")]) == null ? void 0 : f.state) ?? "—";
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
                    <div>${l} ${r} · ${h}p</div>
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
            ${Ue()}
        </div>
    `;
}
function Ue(e, t) {
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
function Yt(e, t) {
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
    ), l = (c = o == null ? void 0 : o.response) == null ? void 0 : c.url;
    l && window.open(l, "_blank", "noopener");
  }}
            >
                Export for pediatrician
            </button>
        </div>
    `;
}
function ze(e, t, i) {
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
function He(e, t, i) {
  var o, l;
  const n = (o = e.states) == null ? void 0 : o[$(t, "recent_entries")], s = ((l = n == null ? void 0 : n.attributes) == null ? void 0 : l.entries) ?? [], r = Te(s);
  return u`
        <div class="chips" role="list" aria-label="Last 24 hours summary">
            <div class="chip" role="listitem">${r.feedings} feedings</div>
            <div class="chip" role="listitem">
                ${Me(r.totalVolumeMl)} consumed
            </div>
            <div class="chip" role="listitem">${r.wetDiapers} wet</div>
            <div class="chip" role="listitem">${r.dirtyDiapers} dirty</div>
            <div class="chip" role="listitem">
                ${Ne(r.sleepMinutes)} sleep
            </div>
        </div>
    `;
}
function B() {
  const e = /* @__PURE__ */ new Date(), t = (i) => String(i).padStart(2, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}T${t(e.getHours())}:${t(e.getMinutes())}`;
}
function k(e) {
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
function Re() {
  const e = /* @__PURE__ */ new Date(), t = (i) => String(i).padStart(2, "0");
  return `${e.getFullYear()}-${t(e.getMonth() + 1)}-${t(e.getDate())}`;
}
function qe(e) {
  if (!e) return;
  const t = Date.parse(`${e}T12:00`);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
const Fe = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk"
]);
function _t(e, t, i, n, s, r) {
  let o = y;
  if (e !== null)
    switch (e.kind) {
      case "diaper":
        o = Ve(e.baby, i, s);
        break;
      case "bottle":
        o = je(
          e.baby,
          t,
          e.lastAmount,
          e.lastUnit,
          i,
          s
        );
        break;
      case "solids":
        o = We(e.baby, i, s);
        break;
      case "other":
        o = Ye(e.baby, i, s);
        break;
      case "session":
        o = Xe(
          e.baby,
          e.activity,
          e.method,
          i,
          s
        );
        break;
      case "end_sleep_first":
        o = Be(
          e.baby,
          e.label,
          e.then,
          n,
          s
        );
        break;
      case "confirm_delete_imported":
        o = Ge(
          e.entryId,
          e.entryType,
          e.source,
          e.staff ?? null,
          i,
          s
        );
        break;
      case "edit_entry":
        o = Ze(
          e.entry,
          i,
          s,
          r
        );
        break;
      case "log_growth":
        o = Je(e.baby, t, i, s);
        break;
      case "log_vaccine":
        o = ti(
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
function Be(e, t, i, n, s) {
  return u`
        <form @submit=${(l) => l.preventDefault()}>
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
    } catch (l) {
      console.warn("babytracker: end_sleep failed", l);
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
function Ve(e, t, i) {
  return u`
        <form @submit=${(s) => {
    s.preventDefault();
    const r = s.currentTarget, o = new FormData(r, s.submitter ?? void 0);
    t("log_diaper", {
      baby: e,
      kind: String(o.get("kind") ?? "wet"),
      timestamp: k(String(o.get("when") ?? "")),
      notes: String(o.get("notes") ?? "") || void 0
    });
  }}>
            <h2>Log diaper</h2>
            <label for="when">When</label>
            <input
                id="when"
                name="when"
                type="datetime-local"
                .value=${B()}
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
function je(e, t, i, n, s, r) {
  const o = (t == null ? void 0 : t.volume_unit) ?? n ?? "oz", l = typeof i == "number" && Number.isFinite(i) ? String(i) : "";
  return u`
        <form @submit=${(d) => {
    d.preventDefault();
    const h = d.currentTarget, p = new FormData(h), b = String(p.get("amount") ?? ""), m = b === "" ? void 0 : Number(b), a = k(String(p.get("at") ?? "")), g = String(p.get("unit") ?? o), f = String(p.get("notes") ?? "") || void 0;
    s("log_feeding", {
      baby: e,
      method: "bottle",
      amount: m,
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
                .value=${B()}
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
function We(e, t, i) {
  return u`
        <form @submit=${(s) => {
    s.preventDefault();
    const r = s.currentTarget, o = new FormData(r), l = k(String(o.get("when") ?? ""));
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
                .value=${B()}
            />
            <div class="actions">
                <button type="button" @click=${i}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Ye(e, t, i) {
  return u`
        <form @submit=${(s) => {
    s.preventDefault();
    const r = s.currentTarget, o = new FormData(r);
    t("log_other", {
      baby: e,
      name: String(o.get("name") ?? ""),
      timestamp: k(String(o.get("when") ?? "")),
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
                .value=${B()}
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
function Ge(e, t, i, n, s, r) {
  const o = (c) => {
    c.preventDefault(), s("delete_entry", { entry_id: e });
  }, l = n ? `${i} (${n})` : i;
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
                <button type="button" @click=${r} autofocus>Cancel</button>
                <button type="button" class="primary" @click=${o}>
                    Delete anyway
                </button>
            </div>
        </form>
    `;
}
function Ze(e, t, i, n) {
  const s = String((e == null ? void 0 : e.type) ?? ""), r = (e == null ? void 0 : e.data) ?? {}, o = s === "feeding" && (r.method === "bottle" || r.method === "solids"), l = Fe.has(s) && !o, c = (p) => {
    p.preventDefault();
    const b = p.currentTarget, m = new FormData(b), a = {}, g = k(String(m.get("started") ?? ""));
    if (g && (a.timestamp = g), l) {
      const v = k(String(m.get("ended") ?? ""));
      a.ended_at = v ?? null;
    } else o && g && (a.ended_at = g);
    const f = String(m.get("notes") ?? "");
    a.notes = f || null;
    const _ = {};
    if (s === "diaper")
      _.kind = String(m.get("kind") ?? r.kind ?? "wet");
    else if (s === "feeding" && r.method === "bottle") {
      const v = String(m.get("amount") ?? ""), N = v === "" ? null : Number(v);
      _.amount = N, _.unit = String(m.get("unit") ?? r.unit ?? "oz");
    } else if (s === "other" || s === "medication") {
      const v = String(m.get("name") ?? "");
      v && (_.name = v);
    }
    Object.keys(_).length && (a.data = _), t("edit_entry", { entry_id: e.id, fields: a });
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
  }, h = Ke(e);
  return u`
        <form @submit=${c}>
            <h2>${h}</h2>
            ${l ? u`
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
function Ke(e) {
  const t = String((e == null ? void 0 : e.type) ?? "entry"), i = (e == null ? void 0 : e.data) ?? {}, n = i.name ?? i.method ?? i.kind;
  return n ? `Edit ${t} (${n})` : `Edit ${t}`;
}
function Xe(e, t, i, n, s) {
  const r = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: i ? `Log ${i.replace("_", " ")} feeding` : "Log feeding"
  };
  return u`
        <form @submit=${(l) => {
    l.preventDefault();
    const c = l.currentTarget, d = new FormData(c), h = k(String(d.get("started") ?? "")), p = k(String(d.get("ended") ?? "")), b = String(d.get("notes") ?? "") || void 0;
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
        a = "log_feeding", m.method = i;
        break;
    }
    n(a, m);
  }}>
            <h2>${r[t]}</h2>
            <label for="started">Started</label>
            <input
                id="started"
                name="started"
                type="datetime-local"
                .value=${B()}
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
function Je(e, t, i, n) {
  const s = (t == null ? void 0 : t.weight_unit) ?? "kg", r = (t == null ? void 0 : t.length_unit) ?? "cm";
  return u`
        <form @submit=${(l) => {
    l.preventDefault();
    const c = l.currentTarget, d = new FormData(c), h = (p) => {
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
      timestamp: k(String(d.get("when") ?? "")),
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
                .value=${B()}
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
const Qe = [
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
function ti(e, t, i, n, s, r) {
  const o = [
    "left_thigh",
    "right_thigh",
    "left_arm",
    "right_arm",
    "oral",
    "nasal"
  ], l = (a) => {
    a.preventDefault();
    const g = a.currentTarget, f = new FormData(g), _ = String(f.get("vaccine_select") ?? "").trim(), v = String(f.get("vaccine_custom") ?? "").trim(), N = _ === "__other__" ? v : _;
    if (!N) return;
    const vt = String(f.get("dose_number") ?? "").trim(), Gt = vt === "" ? void 0 : Number(vt), Zt = String(f.get("site") ?? "").trim() || void 0, Kt = String(f.get("lot_number") ?? "").trim() || void 0, Xt = String(f.get("provider") ?? "").trim() || void 0;
    s("log_vaccine", {
      baby: e,
      name: N,
      dose_number: Gt,
      site: Zt,
      lot_number: Kt,
      provider: Xt,
      timestamp: qe(String(f.get("when") ?? "")),
      notes: String(f.get("notes") ?? "") || void 0
    });
  }, c = Array.from(
    new Set(
      [...Qe, ...n].filter(
        (a) => !!a && a !== "none"
      )
    )
  ).sort((a, g) => a.localeCompare(g)), d = t && t !== "none" && c.includes(t), h = t && t !== "none" && !d, p = d ? t : h ? "__other__" : "", b = h ? t : "";
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
                .value=${b}
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
                .value=${Re()}
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
const pt = 24 * 60 * 60 * 1e3, Ot = 29.5735;
function ei(e, t, i = 7) {
  var h, p, b, m;
  const n = (h = e == null ? void 0 : e.states) == null ? void 0 : h[$(t, "recent_entries")], s = ((p = n == null ? void 0 : n.attributes) == null ? void 0 : p.entries) ?? [], r = Date.now(), o = new Date(r);
  o.setHours(0, 0, 0, 0);
  const l = [], c = (a) => a.toLocaleDateString([], { weekday: "short" });
  for (let a = i - 1; a >= 0; a--) {
    const g = new Date(o.getTime() - a * pt);
    l.push({
      label: c(g),
      sleepMinutes: 0,
      feedings: 0,
      bottleMl: 0,
      diapers: 0
    });
  }
  const d = o.getTime() - (i - 1) * pt;
  for (const a of s) {
    const g = Date.parse(a == null ? void 0 : a.timestamp);
    if (!Number.isFinite(g)) continue;
    const f = Math.floor((g - d) / pt);
    if (f < 0 || f >= i) continue;
    const _ = l[f];
    if (a.type === "feeding") {
      _.feedings += 1;
      const v = Number(((b = a == null ? void 0 : a.data) == null ? void 0 : b.amount) ?? 0), N = String(((m = a == null ? void 0 : a.data) == null ? void 0 : m.unit) ?? "");
      v > 0 && N === "oz" ? _.bottleMl += v * Ot : v > 0 && N === "ml" && (_.bottleMl += v);
    } else if (a.type === "diaper")
      _.diapers += 1;
    else if (a.type === "sleep") {
      const v = a != null && a.ended_at && a.ended_at !== "" ? Date.parse(a.ended_at) : r;
      Number.isFinite(v) && v > g && (_.sleepMinutes += (v - g) / 6e4);
    }
  }
  return l.every((a) => a.sleepMinutes === 0 && a.feedings === 0 && a.diapers === 0) ? "" : u`
        <div class="section" role="region" aria-label="Trends">
            <h2>Trends · last ${i} days</h2>
            ${Q(
    l.map((a) => ({ label: a.label, value: a.sleepMinutes })),
    "Sleep (min/day)",
    (a) => `${Math.round(a)}`
  )}
            ${Q(
    l.map((a) => ({ label: a.label, value: a.feedings })),
    "Feedings/day",
    (a) => `${a}`
  )}
            ${Q(
    l.map((a) => ({ label: a.label, value: a.bottleMl })),
    "Bottle (oz/day)",
    (a) => (a / Ot).toFixed(1)
  )}
            ${Q(
    l.map((a) => ({ label: a.label, value: a.diapers })),
    "Diapers/day",
    (a) => `${a}`
  )}
        </div>
    `;
}
function Q(e, t, i) {
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
    const p = 14 + h * c, b = c * 0.7, m = p + (c - b) / 2, a = Math.max(
      d.value > 0 ? 2 : 0,
      d.value / l * (90 - 24 * 2)
    ), g = 66 - a;
    return u`
                        <rect
                            x=${m}
                            y=${g}
                            width=${b}
                            height=${a}
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
function ii(e) {
  if (!e) return "—";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "—" : new Date(t).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function ht(e) {
  var n, s;
  const t = String(((n = e == null ? void 0 : e.data) == null ? void 0 : n.name) ?? "vaccine"), i = (s = e == null ? void 0 : e.data) == null ? void 0 : s.dose_number;
  return i != null ? `${t} dose ${i}` : t;
}
function ni(e, t) {
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
      var n;
      return u`<li
                        class=${t ? "clickable" : ""}
                        role=${t ? "button" : "listitem"}
                        tabindex=${t ? "0" : "-1"}
                        aria-label=${t ? `Edit ${ht(i)}` : ht(i)}
                        @click=${t ? () => t(i) : void 0}
                        @keydown=${t ? (s) => {
        (s.key === "Enter" || s.key === " ") && (s.preventDefault(), t(i));
      } : void 0}
                    >
                        <span class="vh-date muted"
                            >${ii(i.timestamp)}</span
                        >
                        <span class="vh-name">${ht(i)}</span>
                        ${(n = i == null ? void 0 : i.data) != null && n.site ? u`<span class="muted">${String(
        i.data.site
      ).replace("_", " ")}</span>` : ""}
                    </li>`;
    }
  )}
            </ul>
        </div>
    `;
}
function si(e, t, i) {
  var r, o;
  const n = e.states[$(t, "vaccines_due")];
  if (!n || n.state === "unknown") return "";
  const s = ((r = e.states[$(t, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : r.state) === "on";
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
var ri = Object.defineProperty, oi = Object.getOwnPropertyDescriptor, V = (e, t, i, n) => {
  for (var s = n > 1 ? void 0 : n ? oi(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (s = (n ? o(t, i, s) : o(s)) || s);
  return n && s && ri(t, i, s), s;
};
const ai = ["vaccines", "growth", "trends", "export"];
let D = class extends C {
  constructor() {
    super(...arguments), this._modal = null, this._vaccines = [], this._closeModal = () => {
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
      const e = (c = (l = this.hass) == null ? void 0 : l.states) == null ? void 0 : c[$(this._config.baby, "vaccines_due")], t = e != null && e.state && e.state !== "none" && e.state !== "unknown" ? String(e.state) : "", i = (d = e == null ? void 0 : e.attributes) == null ? void 0 : d.dose_number, n = typeof i == "number" ? i : void 0, r = (Array.isArray((h = e == null ? void 0 : e.attributes) == null ? void 0 : h.upcoming) ? e.attributes.upcoming : []).map((p) => p && typeof p.name == "string" ? p.name : null).filter((p) => !!p);
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
    var e, t;
    (e = this._unsubOptions) == null || e.call(this), this._unsubOptions = void 0, (t = this._unsubVaccines) == null || t.call(this), this._unsubVaccines = void 0, super.disconnectedCallback();
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
    var e;
    !this.hass || !this._config || (this._unsubOptions || (this._unsubOptions = Ft(
      this.hass,
      (t) => {
        this._options = t;
      }
    )), !this._unsubVaccines && this._sections.includes("vaccines") && ((e = this._config) != null && e.baby) && (this._unsubVaccines = Ee(
      this.hass,
      this._config.baby,
      (t) => {
        this._vaccines = Array.isArray(t) ? t : [];
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? ai;
  }
  render() {
    if (!this.hass || !this._config) return u``;
    const e = this._sections;
    return u`
            <ha-card>
                ${e.includes("vaccines") ? u`
                          ${si(
      this.hass,
      this._config.baby,
      this._requestLogVaccine
    )}
                          ${ni(
      this._vaccines,
      this._requestEditEntry
    )}
                      ` : ""}
                ${e.includes("growth") ? Wt(
      this.hass,
      this._config.baby,
      this._options,
      this._config.units,
      this._requestLogGrowth
    ) : ""}
                ${e.includes("trends") ? ei(
      this.hass,
      this._config.baby,
      this._config.trend_days ?? 7
    ) : ""}
                ${e.includes("export") ? Yt(this.hass, this._config.baby) : ""}
            </ha-card>
            ${_t(
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
D.styles = st`
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
V([
  F({ attribute: !1 })
], D.prototype, "hass", 2);
V([
  w()
], D.prototype, "_config", 2);
V([
  w()
], D.prototype, "_options", 2);
V([
  w()
], D.prototype, "_modal", 2);
V([
  w()
], D.prototype, "_vaccines", 2);
D = V([
  ot("babytracker-summary-card")
], D);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-summary-card",
  name: "babytracker — summary",
  description: "Vaccines, growth, 7-day trend charts, and pediatrician export for one baby."
});
var li = Object.defineProperty, ci = Object.getOwnPropertyDescriptor, U = (e, t, i, n) => {
  for (var s = n > 1 ? void 0 : n ? ci(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (s = (n ? o(t, i, s) : o(s)) || s);
  return n && s && li(t, i, s), s;
};
function Lt(e) {
  return String(e).padStart(2, "0");
}
function et(e) {
  return `${e.getFullYear()}-${Lt(e.getMonth() + 1)}-${Lt(e.getDate())}`;
}
function X(e) {
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
  if (!t) return null;
  const i = Number(t[1]), n = Number(t[2]) - 1, s = Number(t[3]), r = new Date(i, n, s, 0, 0, 0, 0);
  return Number.isNaN(r.getTime()) ? null : r;
}
function di(e) {
  const t = X(e) ?? /* @__PURE__ */ new Date(), i = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0), n = new Date(
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
function ui(e, t) {
  const i = X(e) ?? /* @__PURE__ */ new Date();
  return i.setDate(i.getDate() + t), et(i);
}
function pi(e) {
  const t = X(e);
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
      t && X(t) && (this._date = t);
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
    this._config = { ...e }, e.initial_date && X(e.initial_date) && (this._date = e.initial_date);
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
    const { startIso: e, endIso: t } = di(this._date);
    this._unsubEntries = Ae(
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
    this._date = ui(this._date, e);
  }
  render() {
    if (!this.hass || !this._config) return u``;
    const e = this._date === et(/* @__PURE__ */ new Date());
    return u`
            <ha-card>
                <h2>History — ${pi(this._date)}</h2>
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
      (t) => jt(
        t,
        this._requestEdit,
        this._expandedNotes,
        this._toggleNotes
      )
    )}
                          </ul>
                      `}
            </ha-card>
            ${_t(
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
U([
  F({ attribute: !1 })
], S.prototype, "hass", 2);
U([
  w()
], S.prototype, "_config", 2);
U([
  w()
], S.prototype, "_date", 2);
U([
  w()
], S.prototype, "_entries", 2);
U([
  w()
], S.prototype, "_modal", 2);
U([
  w()
], S.prototype, "_expandedNotes", 2);
S = U([
  ot("babytracker-history-card")
], S);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-history-card",
  name: "babytracker — history",
  description: "Paginate through one baby's entries by calendar day with edit + delete."
});
var hi = Object.defineProperty, bi = Object.getOwnPropertyDescriptor, T = (e, t, i, n) => {
  for (var s = n > 1 ? void 0 : n ? bi(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (s = (n ? o(t, i, s) : o(s)) || s);
  return n && s && hi(t, i, s), s;
};
const mi = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "recent",
  "importer_sync"
];
let x = class extends C {
  constructor() {
    super(...arguments), this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._handleService = async (e, t, i) => {
      const n = i instanceof HTMLElement && i.classList.contains("quick") ? i : null;
      try {
        const s = await ke(this.hass, "babytracker", e, t);
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
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = Se(
      this.hass,
      this._config.baby,
      (e) => {
        this._babyConfig = e;
      }
    )), this._unsubOptions || (this._unsubOptions = Ft(
      this.hass,
      (e) => {
        this._options = e;
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? mi;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(e, t = "sensor") {
    return $(this._baby(), e, t);
  }
  _renderStatus() {
    var o, l, c, d, h, p, b, m, a, g;
    const e = this.hass, t = (l = (o = e.states) == null ? void 0 : o[this._entityId("last_feeding")]) == null ? void 0 : l.state, i = (d = (c = e.states) == null ? void 0 : c[this._entityId("last_diaper")]) == null ? void 0 : d.state, n = ((p = (h = e.states) == null ? void 0 : h[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : p.state) === "on", s = ((m = (b = e.states) == null ? void 0 : b[this._entityId("walking", "binary_sensor")]) == null ? void 0 : m.state) === "on", r = ((g = (a = e.states) == null ? void 0 : a[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : g.state) === "on";
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
    var i, n, s, r, o, l, c;
    const e = (n = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : n[this._entityId("recent_entries")], t = ((s = e == null ? void 0 : e.attributes) == null ? void 0 : s.entries) ?? [];
    for (const d of t)
      if ((d == null ? void 0 : d.type) === "feeding" && ((r = d == null ? void 0 : d.data) == null ? void 0 : r.method) === "bottle" && typeof ((o = d == null ? void 0 : d.data) == null ? void 0 : o.amount) == "number" && (((l = d == null ? void 0 : d.data) == null ? void 0 : l.unit) === "ml" || ((c = d == null ? void 0 : d.data) == null ? void 0 : c.unit) === "oz"))
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
                ${e.includes("today") ? He(this.hass, this._baby(), this._babyConfig) : ""}
                ${e.includes("active_session") ? Ce(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("quick_log") ? xe(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${e.includes("growth") ? Wt(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${e.includes("recent") ? Ie(
      this.hass,
      this._baby(),
      this._requestEdit,
      this._config.recent_limit ?? 50,
      this._expandedNotes,
      this._toggleNotes
    ) : ""}
                ${e.includes("importer_sync") ? ze(
      this._babyConfig,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("export") ? Yt(this.hass, this._baby()) : ""}
            </ha-card>
            ${_t(
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
x.styles = st`
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
T([
  F({ attribute: !1 })
], x.prototype, "hass", 2);
T([
  w()
], x.prototype, "_config", 2);
T([
  w()
], x.prototype, "_babyConfig", 2);
T([
  w()
], x.prototype, "_options", 2);
T([
  w()
], x.prototype, "_modal", 2);
T([
  w()
], x.prototype, "_expandedNotes", 2);
T([
  ve("dialog")
], x.prototype, "_dialog", 2);
x = T([
  ot("babytracker-card")
], x);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => _i);
var gi = Object.defineProperty, fi = Object.getOwnPropertyDescriptor, yt = (e, t, i, n) => {
  for (var s = n > 1 ? void 0 : n ? fi(t, i) : t, r = e.length - 1, o; r >= 0; r--)
    (o = e[r]) && (s = (n ? o(t, i, s) : o(s)) || s);
  return n && s && gi(t, i, s), s;
};
let I = class extends C {
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
I.styles = st`
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
yt([
  F({ attribute: !1 })
], I.prototype, "hass", 2);
yt([
  F({ attribute: !1 })
], I.prototype, "_config", 2);
I = yt([
  ot("babytracker-card-editor")
], I);
I.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const _i = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return I;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  x as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
