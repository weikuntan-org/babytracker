/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Dt = globalThis, Xt = Dt.ShadowRoot && (Dt.ShadyCSS === void 0 || Dt.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Zt = Symbol(), se = /* @__PURE__ */ new WeakMap();
let Te = class {
  constructor(e, i, n) {
    if (this._$cssResult$ = !0, n !== Zt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (Xt && e === void 0) {
      const n = i !== void 0 && i.length === 1;
      n && (e = se.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && se.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ze = (t) => new Te(typeof t == "string" ? t : t + "", void 0, Zt), K = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((n, o, a) => n + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + t[a + 1], t[0]);
  return new Te(i, t, Zt);
}, Qe = (t, e) => {
  if (Xt) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const n = document.createElement("style"), o = Dt.litNonce;
    o !== void 0 && n.setAttribute("nonce", o), n.textContent = i.cssText, t.appendChild(n);
  }
}, le = Xt ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const n of e.cssRules) i += n.cssText;
  return Ze(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Je, defineProperty: ti, getOwnPropertyDescriptor: ei, getOwnPropertyNames: ii, getOwnPropertySymbols: ni, getPrototypeOf: oi } = Object, Z = globalThis, ce = Z.trustedTypes, ri = ce ? ce.emptyScript : "", zt = Z.reactiveElementPolyfillSupport, vt = (t, e) => t, Mt = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? ri : null;
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
} }, Qt = (t, e) => !Je(t, e), de = { attribute: !0, type: String, converter: Mt, reflect: !1, useDefault: !1, hasChanged: Qt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), Z.litPropertyMetadata ?? (Z.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let ut = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = de) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const n = Symbol(), o = this.getPropertyDescriptor(e, n, i);
      o !== void 0 && ti(this.prototype, e, o);
    }
  }
  static getPropertyDescriptor(e, i, n) {
    const { get: o, set: a } = ei(this.prototype, e) ?? { get() {
      return this[i];
    }, set(r) {
      this[i] = r;
    } };
    return { get: o, set(r) {
      const s = o == null ? void 0 : o.call(this);
      a == null || a.call(this, r), this.requestUpdate(e, s, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? de;
  }
  static _$Ei() {
    if (this.hasOwnProperty(vt("elementProperties"))) return;
    const e = oi(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(vt("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(vt("properties"))) {
      const i = this.properties, n = [...ii(i), ...ni(i)];
      for (const o of n) this.createProperty(o, i[o]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [n, o] of i) this.elementProperties.set(n, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, n] of this.elementProperties) {
      const o = this._$Eu(i, n);
      o !== void 0 && this._$Eh.set(o, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const o of n) i.unshift(le(o));
    } else e !== void 0 && i.push(le(e));
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
    return Qe(e, this.constructor.elementStyles), e;
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
    var a;
    const n = this.constructor.elementProperties.get(e), o = this.constructor._$Eu(e, n);
    if (o !== void 0 && n.reflect === !0) {
      const r = (((a = n.converter) == null ? void 0 : a.toAttribute) !== void 0 ? n.converter : Mt).toAttribute(i, n.type);
      this._$Em = e, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(e, i) {
    var a, r;
    const n = this.constructor, o = n._$Eh.get(e);
    if (o !== void 0 && this._$Em !== o) {
      const s = n.getPropertyOptions(o), l = typeof s.converter == "function" ? { fromAttribute: s.converter } : ((a = s.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? s.converter : Mt;
      this._$Em = o;
      const c = l.fromAttribute(i, s.type);
      this[o] = c ?? ((r = this._$Ej) == null ? void 0 : r.get(o)) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, i, n, o = !1, a) {
    var r;
    if (e !== void 0) {
      const s = this.constructor;
      if (o === !1 && (a = this[e]), n ?? (n = s.getPropertyOptions(e)), !((n.hasChanged ?? Qt)(a, i) || n.useDefault && n.reflect && a === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(s._$Eu(e, n)))) return;
      this.C(e, i, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: n, reflect: o, wrapped: a }, r) {
    n && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? i ?? this[e]), a !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (i = void 0), this._$AL.set(e, i)), o === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [a, r] of this._$Ep) this[a] = r;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0) for (const [a, r] of o) {
        const { wrapped: s } = r, l = this[a];
        s !== !0 || this._$AL.has(a) || l === void 0 || this.C(a, void 0, r, l);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (n = this._$EO) == null || n.forEach((o) => {
        var a;
        return (a = o.hostUpdate) == null ? void 0 : a.call(o);
      }), this.update(i)) : this._$EM();
    } catch (o) {
      throw e = !1, this._$EM(), o;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var i;
    (i = this._$EO) == null || i.forEach((n) => {
      var o;
      return (o = n.hostUpdated) == null ? void 0 : o.call(n);
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
ut.elementStyles = [], ut.shadowRootOptions = { mode: "open" }, ut[vt("elementProperties")] = /* @__PURE__ */ new Map(), ut[vt("finalized")] = /* @__PURE__ */ new Map(), zt == null || zt({ ReactiveElement: ut }), (Z.reactiveElementVersions ?? (Z.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const yt = globalThis, ue = (t) => t, Tt = yt.trustedTypes, pe = Tt ? Tt.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ne = "$lit$", G = `lit$${Math.random().toFixed(9).slice(2)}$`, Re = "?" + G, ai = `<${Re}>`, st = document, $t = () => st.createComment(""), wt = (t) => t === null || typeof t != "object" && typeof t != "function", Jt = Array.isArray, si = (t) => Jt(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", Ut = `[ 	
\f\r]`, ft = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, he = /-->/g, be = />/g, ot = RegExp(`>|${Ut}(?:([^\\s"'>=/]+)(${Ut}*=${Ut}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), me = /'/g, ge = /"/g, Oe = /^(?:script|style|textarea|title)$/i, Le = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), d = Le(1), q = Le(2), pt = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), fe = /* @__PURE__ */ new WeakMap(), rt = st.createTreeWalker(st, 129);
function ze(t, e) {
  if (!Jt(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return pe !== void 0 ? pe.createHTML(e) : e;
}
const li = (t, e) => {
  const i = t.length - 1, n = [];
  let o, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = ft;
  for (let s = 0; s < i; s++) {
    const l = t[s];
    let c, b, u = -1, g = 0;
    for (; g < l.length && (r.lastIndex = g, b = r.exec(l), b !== null); ) g = r.lastIndex, r === ft ? b[1] === "!--" ? r = he : b[1] !== void 0 ? r = be : b[2] !== void 0 ? (Oe.test(b[2]) && (o = RegExp("</" + b[2], "g")), r = ot) : b[3] !== void 0 && (r = ot) : r === ot ? b[0] === ">" ? (r = o ?? ft, u = -1) : b[1] === void 0 ? u = -2 : (u = r.lastIndex - b[2].length, c = b[1], r = b[3] === void 0 ? ot : b[3] === '"' ? ge : me) : r === ge || r === me ? r = ot : r === he || r === be ? r = ft : (r = ot, o = void 0);
    const _ = r === ot && t[s + 1].startsWith("/>") ? " " : "";
    a += r === ft ? l + ai : u >= 0 ? (n.push(c), l.slice(0, u) + Ne + l.slice(u) + G + _) : l + G + (u === -2 ? s : _);
  }
  return [ze(t, a + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), n];
};
class xt {
  constructor({ strings: e, _$litType$: i }, n) {
    let o;
    this.parts = [];
    let a = 0, r = 0;
    const s = e.length - 1, l = this.parts, [c, b] = li(e, i);
    if (this.el = xt.createElement(c, n), rt.currentNode = this.el.content, i === 2 || i === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (o = rt.nextNode()) !== null && l.length < s; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const u of o.getAttributeNames()) if (u.endsWith(Ne)) {
          const g = b[r++], _ = o.getAttribute(u).split(G), f = /([.?@])?(.*)/.exec(g);
          l.push({ type: 1, index: a, name: f[2], strings: _, ctor: f[1] === "." ? di : f[1] === "?" ? ui : f[1] === "@" ? pi : Ot }), o.removeAttribute(u);
        } else u.startsWith(G) && (l.push({ type: 6, index: a }), o.removeAttribute(u));
        if (Oe.test(o.tagName)) {
          const u = o.textContent.split(G), g = u.length - 1;
          if (g > 0) {
            o.textContent = Tt ? Tt.emptyScript : "";
            for (let _ = 0; _ < g; _++) o.append(u[_], $t()), rt.nextNode(), l.push({ type: 2, index: ++a });
            o.append(u[g], $t());
          }
        }
      } else if (o.nodeType === 8) if (o.data === Re) l.push({ type: 2, index: a });
      else {
        let u = -1;
        for (; (u = o.data.indexOf(G, u + 1)) !== -1; ) l.push({ type: 7, index: a }), u += G.length - 1;
      }
      a++;
    }
  }
  static createElement(e, i) {
    const n = st.createElement("template");
    return n.innerHTML = e, n;
  }
}
function ht(t, e, i = t, n) {
  var r, s;
  if (e === pt) return e;
  let o = n !== void 0 ? (r = i._$Co) == null ? void 0 : r[n] : i._$Cl;
  const a = wt(e) ? void 0 : e._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== a && ((s = o == null ? void 0 : o._$AO) == null || s.call(o, !1), a === void 0 ? o = void 0 : (o = new a(t), o._$AT(t, i, n)), n !== void 0 ? (i._$Co ?? (i._$Co = []))[n] = o : i._$Cl = o), o !== void 0 && (e = ht(t, o._$AS(t, e.values), o, n)), e;
}
class ci {
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
    const { el: { content: i }, parts: n } = this._$AD, o = ((e == null ? void 0 : e.creationScope) ?? st).importNode(i, !0);
    rt.currentNode = o;
    let a = rt.nextNode(), r = 0, s = 0, l = n[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let c;
        l.type === 2 ? c = new Ct(a, a.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(a, l.name, l.strings, this, e) : l.type === 6 && (c = new hi(a, this, e)), this._$AV.push(c), l = n[++s];
      }
      r !== (l == null ? void 0 : l.index) && (a = rt.nextNode(), r++);
    }
    return rt.currentNode = st, o;
  }
  p(e) {
    let i = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, i), i += n.strings.length - 2) : n._$AI(e[i])), i++;
  }
}
class Ct {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, i, n, o) {
    this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = n, this.options = o, this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0;
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
    e = ht(this, e, i), wt(e) ? e === E || e == null || e === "" ? (this._$AH !== E && this._$AR(), this._$AH = E) : e !== this._$AH && e !== pt && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : si(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== E && wt(this._$AH) ? this._$AA.nextSibling.data = e : this.T(st.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var a;
    const { values: i, _$litType$: n } = e, o = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = xt.createElement(ze(n.h, n.h[0]), this.options)), n);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === o) this._$AH.p(i);
    else {
      const r = new ci(o, this), s = r.u(this.options);
      r.p(i), this.T(s), this._$AH = r;
    }
  }
  _$AC(e) {
    let i = fe.get(e.strings);
    return i === void 0 && fe.set(e.strings, i = new xt(e)), i;
  }
  k(e) {
    Jt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let n, o = 0;
    for (const a of e) o === i.length ? i.push(n = new Ct(this.O($t()), this.O($t()), this, this.options)) : n = i[o], n._$AI(a), o++;
    o < i.length && (this._$AR(n && n._$AB.nextSibling, o), i.length = o);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, i); e !== this._$AB; ) {
      const o = ue(e).nextSibling;
      ue(e).remove(), e = o;
    }
  }
  setConnected(e) {
    var i;
    this._$AM === void 0 && (this._$Cv = e, (i = this._$AP) == null || i.call(this, e));
  }
}
class Ot {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, n, o, a) {
    this.type = 1, this._$AH = E, this._$AN = void 0, this.element = e, this.name = i, this._$AM = o, this.options = a, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = E;
  }
  _$AI(e, i = this, n, o) {
    const a = this.strings;
    let r = !1;
    if (a === void 0) e = ht(this, e, i, 0), r = !wt(e) || e !== this._$AH && e !== pt, r && (this._$AH = e);
    else {
      const s = e;
      let l, c;
      for (e = a[0], l = 0; l < a.length - 1; l++) c = ht(this, s[n + l], i, l), c === pt && (c = this._$AH[l]), r || (r = !wt(c) || c !== this._$AH[l]), c === E ? e = E : e !== E && (e += (c ?? "") + a[l + 1]), this._$AH[l] = c;
    }
    r && !o && this.j(e);
  }
  j(e) {
    e === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class di extends Ot {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === E ? void 0 : e;
  }
}
class ui extends Ot {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== E);
  }
}
class pi extends Ot {
  constructor(e, i, n, o, a) {
    super(e, i, n, o, a), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = ht(this, e, i, 0) ?? E) === pt) return;
    const n = this._$AH, o = e === E && n !== E || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, a = e !== E && (n === E || o);
    o && this.element.removeEventListener(this.name, this, n), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class hi {
  constructor(e, i, n) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ht(this, e);
  }
}
const Ht = yt.litHtmlPolyfillSupport;
Ht == null || Ht(xt, Ct), (yt.litHtmlVersions ?? (yt.litHtmlVersions = [])).push("3.3.3");
const bi = (t, e, i) => {
  const n = (i == null ? void 0 : i.renderBefore) ?? e;
  let o = n._$litPart$;
  if (o === void 0) {
    const a = (i == null ? void 0 : i.renderBefore) ?? null;
    n._$litPart$ = o = new Ct(e.insertBefore($t(), a), a, void 0, i ?? {});
  }
  return o._$AI(t), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const at = globalThis;
class O extends ut {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = bi(i, this.renderRoot, this.renderOptions);
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
    return pt;
  }
}
var Me;
O._$litElement$ = !0, O.finalized = !0, (Me = at.litElementHydrateSupport) == null || Me.call(at, { LitElement: O });
const It = at.litElementPolyfillSupport;
It == null || It({ LitElement: O });
(at.litElementVersions ?? (at.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mi = { attribute: !0, type: String, converter: Mt, reflect: !1, hasChanged: Qt }, gi = (t = mi, e, i) => {
  const { kind: n, metadata: o } = i;
  let a = globalThis.litPropertyMetadata.get(o);
  if (a === void 0 && globalThis.litPropertyMetadata.set(o, a = /* @__PURE__ */ new Map()), n === "setter" && ((t = Object.create(t)).wrapped = !0), a.set(i.name, t), n === "accessor") {
    const { name: r } = i;
    return { set(s) {
      const l = e.get.call(this);
      e.set.call(this, s), this.requestUpdate(r, l, t, !0, s);
    }, init(s) {
      return s !== void 0 && this.C(r, void 0, t, s), s;
    } };
  }
  if (n === "setter") {
    const { name: r } = i;
    return function(s) {
      const l = this[r];
      e.call(this, s), this.requestUpdate(r, l, t, !0, s);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function N(t) {
  return (e, i) => typeof i == "object" ? gi(t, e, i) : ((n, o, a) => {
    const r = o.hasOwnProperty(a);
    return o.constructor.createProperty(a, n), r ? Object.getOwnPropertyDescriptor(o, a) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function A(t) {
  return N({ ...t, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fi = (t, e, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(t, e, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ue(t, e) {
  return (i, n, o) => {
    const a = (r) => {
      var s;
      return ((s = r.renderRoot) == null ? void 0 : s.querySelector(t)) ?? null;
    };
    return fi(i, n, { get() {
      return a(this);
    } });
  };
}
function D(t) {
  const e = t.warning ? "chip warning" : "chip";
  return d`
        <span
            class=${e}
            role="listitem"
            title=${t.label}
            aria-label=${t.label}
        >
            <ha-icon class="chip-icon" icon=${t.icon}></ha-icon>
            ${t.value ? d`<span class="chip-value">${t.value}</span>` : ""}
            ${t.detail ? d`<span class="chip-detail">${t.detail}</span>` : ""}
        </span>
    `;
}
function M(t, e, i = "sensor") {
  return `${i}.babytracker_${t}_${e}`;
}
function He(t) {
  return typeof t != "string" || t.length === 0 ? "" : t.charAt(0).toUpperCase() + t.slice(1);
}
async function _i(t, e, i, n) {
  return t.callService(e, i, n);
}
function At(t, e, i, n) {
  const o = { cancelled: !1 }, a = async (r) => {
    if (!o.cancelled)
      try {
        const s = await t.connection.subscribeMessage(
          i,
          e
        );
        if (o.cancelled) {
          try {
            s();
          } catch {
          }
          return;
        }
        o.unsub = s;
      } catch (s) {
        if (console.warn(`babytracker: ${n} failed (attempt ${r + 1})`, s), o.cancelled) return;
        const l = Math.min(3e4, 1e3 * 2 ** r);
        o.timer = setTimeout(() => {
          o.timer = void 0, a(r + 1);
        }, l);
      }
  };
  return a(0), () => {
    var r;
    o.cancelled = !0, o.timer != null && (clearTimeout(o.timer), o.timer = void 0), (r = o.unsub) == null || r.call(o);
  };
}
function vi(t, e, i) {
  return At(
    t,
    { type: "babytracker/get_baby_config", baby: e, subscribe: !0 },
    i,
    "subscribeBabyConfig"
  );
}
function Ie(t, e) {
  return At(
    t,
    { type: "babytracker/get_integration_options", subscribe: !0 },
    e,
    "subscribeIntegrationOptions"
  );
}
function yi(t, e, i, n, o) {
  return At(
    t,
    {
      type: "babytracker/list_entries_in_range",
      baby: e,
      start: i,
      end: n,
      subscribe: !0
    },
    o,
    "subscribeEntriesInRange"
  );
}
function $i(t, e, i) {
  return At(
    t,
    { type: "babytracker/list_vaccines", baby: e, subscribe: !0 },
    i,
    "subscribeVaccines"
  );
}
function wi(t, e, i) {
  return At(
    t,
    { type: "babytracker/list_growth", baby: e, subscribe: !0 },
    i,
    "subscribeGrowth"
  );
}
function xi(t, e, i, n) {
  if (!t)
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
  const o = t.enabled_activities ?? [], a = t.enabled_feeding_methods ?? [], r = (c) => c.charAt(0).toUpperCase() + c.slice(1), s = He(t.name ?? e), l = [];
  if (o.includes("diaper") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log diaper for ${s}"
                    @click=${() => n("diaper")}
                >
                    <ha-icon icon="mdi:human-baby-changing-table"></ha-icon>
                    Diaper
                </button>
            `
  ), o.includes("feeding"))
    for (const c of a)
      c === "bottle" ? l.push(
        d`
                        <button
                            class="quick"
                            aria-label="Log bottle feeding for ${s}"
                            @click=${() => n("bottle")}
                        >
                            <ha-icon icon="mdi:baby-bottle-outline"></ha-icon>
                            Bottle
                        </button>
                    `
      ) : c === "solids" ? l.push(
        d`
                        <button
                            class="quick"
                            aria-label="Log solids feeding for ${s}"
                            @click=${() => n("solids")}
                        >
                            <ha-icon icon="mdi:silverware-spoon"></ha-icon>
                            Solids
                        </button>
                    `
      ) : (c === "breast_left" || c === "breast_right") && l.push(
        d`
                        <button
                            class="quick"
                            aria-label="Log ${c} feeding for ${s}"
                            @click=${() => n({ activity: "feeding", method: c })}
                        >
                            <ha-icon icon="mdi:mother-nurse"></ha-icon>
                            ${r(c.replace("_", " "))}
                        </button>
                    `
      );
  return o.includes("sleep") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log sleep for ${s}"
                    @click=${() => n({ activity: "sleep" })}
                >
                    <ha-icon icon="mdi:bed"></ha-icon>
                    Sleep
                </button>
            `
  ), o.includes("tummy_time") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log tummy time for ${s}"
                    @click=${() => n({ activity: "tummy_time" })}
                >
                    <ha-icon icon="mdi:human-handsup"></ha-icon>
                    Tummy time
                </button>
            `
  ), o.includes("walk") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log walk for ${s}"
                    @click=${() => n({ activity: "walk" })}
                >
                    <ha-icon icon="mdi:walk"></ha-icon>
                    Walk
                </button>
            `
  ), o.includes("other") && l.push(
    d`
                <button
                    class="quick"
                    aria-label="Log other activity for ${s}"
                    @click=${() => n("other")}
                >
                    <ha-icon icon="mdi:dots-horizontal"></ha-icon>
                    Other
                </button>
            `
  ), d`
        <div class="section grid" role="group" aria-label="Quick log">
            ${l}
        </div>
    `;
}
const Nt = 29.5735, Be = 24 * 60 * 60 * 1e3;
function F(t) {
  if (!t) return 0;
  const e = Date.parse(t);
  return Number.isNaN(e) ? 0 : e;
}
function ki(t, e = Be, i = Date.now()) {
  const n = i - e;
  return t.filter((o) => F(o.timestamp) >= n).slice().sort((o, a) => F(a.timestamp) - F(o.timestamp));
}
function Si(t, e = Date.now(), i = Be) {
  var u, g, _, f;
  const n = e - i;
  let o = 0, a = 0, r = 0, s = 0, l = 0, c = 0, b = 0;
  for (const w of t) {
    const p = F(w.timestamp);
    if (w.type === "sleep") {
      const y = p, $ = w.ended_at != null && w.ended_at !== "" ? F(w.ended_at) : e;
      if (y > 0 && $ > y && $ > n) {
        const k = Math.max(y, n), m = Math.min($, e);
        m > k && (c += (m - k) / 6e4);
      }
      continue;
    }
    if (!(p < n)) {
      if (w.type === "feeding") {
        o += 1, String(((u = w.data) == null ? void 0 : u.method) ?? "") === "solids" && (b += 1);
        const y = Number(((g = w.data) == null ? void 0 : g.amount) ?? 0), $ = String(((_ = w.data) == null ? void 0 : _.unit) ?? "");
        y > 0 && (l += $ === "oz" ? y * Nt : y);
      } else if (w.type === "diaper") {
        const y = String(((f = w.data) == null ? void 0 : f.kind) ?? "");
        y === "wet" ? (a += 1, r += 1) : y === "dirty" ? (a += 1, s += 1) : y === "both" && (a += 1, r += 1, s += 1);
      }
    }
  }
  return {
    feedings: o,
    diapers: a,
    wetDiapers: r,
    dirtyDiapers: s,
    totalVolumeMl: l,
    sleepMinutes: c,
    solidsCount: b
  };
}
function _t(t, e, i) {
  if (t <= 0) return 0;
  const n = e != null && e !== "" ? F(e) : i;
  return n <= t ? 0 : (n - t) / 6e4;
}
function Yt(t, e, i = Date.now()) {
  return _t(F(t), e, i);
}
function Ci(t, e = Date.now()) {
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
    const o = F(n.timestamp), a = n.data ?? {};
    switch (n.type) {
      case "diaper": {
        const r = String(a.kind ?? "");
        r === "wet" ? (i.diapers += 1, i.wet += 1) : r === "dirty" ? (i.diapers += 1, i.dirty += 1) : r === "both" && (i.diapers += 1, i.wet += 1, i.dirty += 1);
        break;
      }
      case "sleep": {
        const r = _t(o, n.ended_at, e);
        i.sleepMinutes += r, r > i.longestSleepMinutes && (i.longestSleepMinutes = r);
        break;
      }
      case "feeding": {
        const r = String(a.method ?? "");
        if (r === "bottle") {
          i.bottleFeeds += 1;
          const s = Number(a.amount ?? 0), l = String(a.unit ?? "");
          s > 0 && (i.bottleVolumeMl += l === "oz" ? s * Nt : s);
        } else if (r === "breast_left" || r === "breast_right") {
          const s = _t(o, n.ended_at, e);
          i.nursingMinutes += s, r === "breast_left" ? i.nursingLeftMinutes += s : i.nursingRightMinutes += s;
        } else r === "solids" && (i.solidsCount += 1);
        break;
      }
      case "pumping": {
        const r = Number(a.volume ?? 0), s = String(a.unit ?? "");
        r > 0 && (i.pumpingMl += s === "oz" ? r * Nt : r);
        break;
      }
      case "tummy_time": {
        i.tummyMinutes += _t(o, n.ended_at, e);
        break;
      }
      case "walk": {
        i.walkCount += 1, i.walkMinutes += _t(o, n.ended_at, e);
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
function Ai(t, e = Date.now()) {
  let i = null;
  for (const n of t) {
    if ((n == null ? void 0 : n.type) !== "sleep" || !(n != null && n.ended_at)) continue;
    const o = Date.parse(n.ended_at);
    Number.isFinite(o) && (i === null || o > i) && (i = o);
  }
  return i === null ? null : Math.max(0, (e - i) / 6e4);
}
function U(t) {
  if (!Number.isFinite(t) || t <= 0) return "0m";
  if (t < 60) return `${Math.round(t)}m`;
  const e = Math.floor(t / 60), i = Math.round(t % 60);
  return i === 0 ? `${e}h` : `${e}h ${i}m`;
}
function Gt(t) {
  if (!Number.isFinite(t) || t <= 0) return "0 oz";
  const e = t / Nt;
  return e >= 1 ? `${e.toFixed(1)} oz` : `${Math.round(t)} ml`;
}
function Pi(t) {
  const e = String((t == null ? void 0 : t.type) ?? ""), i = (t == null ? void 0 : t.data) ?? {};
  if (e === "other") {
    const r = String(i.name ?? "").trim();
    return _e(r || Bt(e));
  }
  const n = i.method ?? i.kind, o = n != null && n !== "" ? Bt(String(n)) : null, a = _e(Bt(e));
  return o ? e === "feeding" && i.amount != null && i.amount !== "" && i.unit ? `${a} (${o}, ${i.amount} ${i.unit})` : `${a} (${o})` : a;
}
function Bt(t) {
  return t.replace(/_/g, " ");
}
function _e(t) {
  return t && t.charAt(0).toUpperCase() + t.slice(1);
}
function Rt(t) {
  const e = F(t);
  return e === 0 ? "" : new Date(e).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: !0
  });
}
function Di(t, e, i) {
  var l, c, b, u, g, _;
  const n = ((l = t.states[M(e, "sleeping", "binary_sensor")]) == null ? void 0 : l.state) === "on", o = ((c = t.states[M(e, "feeding", "binary_sensor")]) == null ? void 0 : c.state) === "on", a = ((b = t.states[M(e, "tummy_time", "binary_sensor")]) == null ? void 0 : b.state) === "on", r = ((u = t.states[M(e, "walking", "binary_sensor")]) == null ? void 0 : u.state) === "on";
  if (!n && !o && !a && !r) return "";
  const s = [];
  if (n) {
    const f = (g = t.states[M(e, "last_sleep_start")]) == null ? void 0 : g.state, w = f ? Yt(f, null) : 0;
    s.push(
      d`
                <div class="chip warning" role="status">
                    Sleeping${f ? d` · started ${Rt(f)} ·
                          ${U(w)}` : ""}
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
  if (o && s.push(
    d`
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
  ), a && s.push(
    d`
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
  ), r) {
    const f = (_ = t.states[M(e, "last_walk_start")]) == null ? void 0 : _.state;
    s.push(
      d`
                <div class="chip warning" role="status">
                    Walking ${f ? d`· started ${Rt(f)}` : ""}
                    <button
                        aria-label="End walk"
                        @click=${(w) => i("end_walk", { baby: e }, w.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
    );
  }
  return d`<div class="section">${s}</div>`;
}
var Ei = Object.defineProperty, Mi = Object.getOwnPropertyDescriptor, Y = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Mi(e, i) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && Ei(e, i, o), o;
};
let I = class extends O {
  constructor() {
    super(...arguments), this.photoPath = "", this.videoPath = "", this.size = 128, this._url = "", this._videoUrl = "", this._failed = !1, this._open = !1, this._lastResolved = "", this._lastVideoResolved = "", this._resolveToken = 0, this._videoResolveToken = 0, this._onKeydown = (t) => {
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
    (t.has("hass") || t.has("photoPath")) && this._maybeResolve(), (t.has("hass") || t.has("videoPath")) && this._maybeResolveVideo();
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
  async _maybeResolveVideo() {
    var e;
    if (!((e = this.hass) != null && e.connection) || !this.videoPath) {
      this._videoUrl = "";
      return;
    }
    if (this._lastVideoResolved === this.videoPath && this._videoUrl)
      return;
    this._lastVideoResolved = this.videoPath;
    const t = ++this._videoResolveToken;
    try {
      const i = await this.hass.callWS({
        type: "media_source/resolve_media",
        media_content_id: this.videoPath
      });
      if (t !== this._videoResolveToken) return;
      const n = i == null ? void 0 : i.url;
      typeof n == "string" && n.length > 0 ? this._videoUrl = n : console.warn(
        "babytracker: resolve video returned no url",
        this.videoPath,
        i
      );
    } catch (i) {
      if (t !== this._videoResolveToken) return;
      console.warn(
        "babytracker: resolve video failed",
        this.videoPath,
        i
      );
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
    const t = !!this.videoPath;
    if (this._failed || !this._url)
      return d`<span aria-label=${t ? "Has video" : "Has photo"}
                >${t ? "🎬" : "📷"}</span
            >`;
    const e = `${this.size}px`, i = t ? "Play video" : "View photo";
    return d`
            <button
                class="thumb-btn"
                type="button"
                aria-label=${i}
                title=${i}
                @click=${this._open_lightbox}
            >
                <img
                    class="thumb"
                    src=${this._url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style="max-width:${e};max-height:${e}"
                    @error=${this._onImgError}
                />
                ${t ? d`<span class="play-overlay" aria-hidden="true">▶</span>` : ""}
            </button>
            ${this._open ? d`
                      <div
                          class="lightbox"
                          role="dialog"
                          aria-modal="true"
                          aria-label=${t ? "Entry video" : "Entry photo"}
                          @click=${this._close_lightbox}
                      >
                          <button
                              type="button"
                              class="close"
                              aria-label=${t ? "Close video viewer" : "Close photo viewer"}
                              @click=${this._close_lightbox}
                          >
                              ✕
                          </button>
                          ${t && this._videoUrl ? d`
                                    <video
                                        class="full"
                                        src=${this._videoUrl}
                                        poster=${this._url}
                                        controls
                                        autoplay
                                        playsinline
                                        @click=${(n) => n.stopPropagation()}
                                    ></video>
                                ` : d`
                                    <img
                                        class="full"
                                        src=${this._url}
                                        alt=${t ? "Entry video poster" : "Entry photo"}
                                        @click=${(n) => n.stopPropagation()}
                                    />
                                `}
                      </div>
                  ` : ""}
        `;
  }
};
I.styles = K`
        :host {
            display: inline-flex;
            align-items: center;
        }
        .thumb-btn {
            position: relative;
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
        .play-overlay {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.6rem;
            color: #fff;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
            background: linear-gradient(
                rgba(0, 0, 0, 0.08),
                rgba(0, 0, 0, 0.32)
            );
            border-radius: 4px;
            pointer-events: none;
        }
        video.full {
            background: #000;
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
Y([
  N({ attribute: !1 })
], I.prototype, "hass", 2);
Y([
  N()
], I.prototype, "photoPath", 2);
Y([
  N()
], I.prototype, "videoPath", 2);
Y([
  N({ type: Number })
], I.prototype, "size", 2);
Y([
  A()
], I.prototype, "_url", 2);
Y([
  A()
], I.prototype, "_videoUrl", 2);
Y([
  A()
], I.prototype, "_failed", 2);
Y([
  A()
], I.prototype, "_open", 2);
I = Y([
  J("bt-entry-thumbnail")
], I);
const Ti = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk",
  "other"
]);
function Ve(t, e, i, n, o) {
  return d`
        <li
            class="clickable"
            role="button"
            tabindex="0"
            aria-label="Edit entry"
            @click=${() => i(e)}
            @keydown=${(a) => {
    (a.key === "Enter" || a.key === " ") && (a.preventDefault(), i(e));
  }}
        >
            <div class="entry-row">
                <span aria-label="Entry type">${Pi(e)}</span>
                ${Ni(e)}
                ${e.staff ? d`<span
                          class="muted"
                          aria-label="Logged by Procare staff"
                          >via ${e.staff}</span
                      >` : ""}
            </div>
            ${e.notes ? d`<div
                      class="entry-notes muted ${n.has(e.id) ? "expanded" : ""}"
                      role="button"
                      tabindex="0"
                      aria-label="Toggle notes"
                      aria-expanded=${n.has(e.id) ? "true" : "false"}
                      title=${e.notes}
                      @click=${(a) => {
    a.stopPropagation(), o(e.id);
  }}
                      @keydown=${(a) => {
    (a.key === "Enter" || a.key === " ") && (a.preventDefault(), a.stopPropagation(), o(e.id));
  }}
                  >${e.notes}</div>` : ""}
            ${e.photo_path ? d`<div class="entry-photo">
                      <bt-entry-thumbnail
                          .hass=${t}
                          .photoPath=${e.photo_path}
                          .videoPath=${e.video_path ?? ""}
                      ></bt-entry-thumbnail>
                  </div>` : ""}
        </li>
    `;
}
function Ni(t) {
  const e = Rt(t.timestamp), i = t.type === "sleep", n = Ti.has(String(t.type ?? ""));
  if (i && (!t.ended_at || t.ended_at === t.timestamp)) {
    const o = Yt(t.timestamp, t.ended_at);
    return d`<span class="muted"
            >${e} (${U(o)}, ongoing)</span
        >`;
  }
  if (n && t.ended_at && t.ended_at !== t.timestamp) {
    const o = Rt(t.ended_at);
    if (i) {
      const a = Yt(
        t.timestamp,
        t.ended_at
      );
      return d`<span class="muted"
                >${e} – ${o} (${U(a)})</span
            >`;
    }
    return d`<span class="muted">${e} – ${o}</span>`;
  }
  return d`<span class="muted">${e}</span>`;
}
function Ri(t, e, i, n, o = /* @__PURE__ */ new Set(), a = () => {
}) {
  var c;
  const r = t.states[M(e, "recent_entries")], s = ((c = r == null ? void 0 : r.attributes) == null ? void 0 : c.entries) ?? [], l = ki(s).slice(0, Math.min(n, 120));
  return d`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${l.length === 0 ? d`<p>Nothing logged yet.</p>` : d`
                      <ul class="entries">
                          ${l.map(
    (b) => Ve(
      t,
      b,
      i,
      o,
      a
    )
  )}
                      </ul>
                  `}
        </div>
    `;
}
var Oi = Object.defineProperty, Li = Object.getOwnPropertyDescriptor, Lt = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Li(e, i) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && Oi(e, i, o), o;
};
let bt = class extends O {
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
    return d`
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
bt.styles = K`
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
Lt([
  N()
], bt.prototype, "label", 2);
Lt([
  N({ attribute: !1 })
], bt.prototype, "renderChart", 2);
Lt([
  A()
], bt.prototype, "_open", 2);
bt = Lt([
  J("bt-chart-lightbox")
], bt);
const ve = [
  { key: "weight", label: "Weight", color: "var(--primary-color, #2563eb)" },
  { key: "height", label: "Height", color: "var(--success-color, #16a34a)" },
  { key: "head", label: "Head", color: "var(--warning-color, #ea580c)" }
];
function zi(t, e) {
  const i = (t == null ? void 0 : t.data) ?? {}, n = e === "weight" ? i.weight_percentile : e === "height" ? i.height_percentile : i.head_percentile;
  if (n == null) return null;
  const o = Number(n);
  return Number.isFinite(o) ? o : null;
}
function Vt(t) {
  if (t == null) return "—";
  const e = typeof t == "number" ? t : Number(t);
  return Number.isFinite(e) ? String(Math.round(e * 100) / 100) : String(t);
}
function qt(t) {
  if (t == null || t === "—") return "—";
  const e = typeof t == "number" ? t : Number(t);
  return Number.isFinite(e) ? `p${Math.round(e)}` : String(t);
}
function Ui(t) {
  if (!t) return "";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "" : new Date(e).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function qe(t, e, i, n, o, a, r, s) {
  var v, S, P, C, T, L;
  const l = (a == null ? void 0 : a.data) ?? {}, c = (n == null ? void 0 : n.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", b = (n == null ? void 0 : n.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", u = l.weight_unit ?? c, g = l.length_unit ?? b, _ = l.weight ?? ((v = t.states[M(e, "weight")]) == null ? void 0 : v.state), f = l.height ?? ((S = t.states[M(e, "height")]) == null ? void 0 : S.state), w = l.head_circumference ?? ((P = t.states[M(e, "head_circumference")]) == null ? void 0 : P.state), p = l.weight_percentile ?? ((C = t.states[M(e, "weight_percentile")]) == null ? void 0 : C.state), y = l.height_percentile ?? ((T = t.states[M(e, "height_percentile")]) == null ? void 0 : T.state), $ = l.head_percentile ?? ((L = t.states[M(e, "head_circumference_percentile")]) == null ? void 0 : L.state), k = Ui(a == null ? void 0 : a.timestamp), m = !!(a && r), h = m ? () => r(a) : void 0;
  return d`
        <div class="section" role="region" aria-label="Growth">
            <div
                style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"
            >
                <h2 style="margin:0;">Growth</h2>
                <span style="flex:1;"></span>
                ${o ? d`<button
                          type="button"
                          class="primary"
                          aria-label="Log a growth measurement"
                          @click=${o}
                      >
                          Log measurement
                      </button>` : ""}
            </div>
            <div
                class=${m ? "growth-summary clickable" : "growth-summary"}
                role=${m ? "button" : "group"}
                tabindex=${m ? "0" : "-1"}
                aria-label=${m ? "Edit latest growth measurement" : "Latest growth measurement"}
                @click=${h}
                @keydown=${m ? (x) => {
    (x.key === "Enter" || x.key === " ") && (x.preventDefault(), h == null || h());
  } : void 0}
            >
                ${k ? d`<div class="growth-date muted">
                          Measured ${k}
                      </div>` : ""}
                <div class="growth-grid">
                    <div>
                        <div class="label">Weight</div>
                        <div>${Vt(_)} ${u} · ${qt(p)}</div>
                    </div>
                    <div>
                        <div class="label">Height</div>
                        <div>${Vt(f)} ${g} · ${qt(y)}</div>
                    </div>
                    <div>
                        <div class="label">Head</div>
                        <div>${Vt(w)} ${g} · ${qt($)}</div>
                    </div>
                </div>
            </div>
            ${Hi(s)}
        </div>
    `;
}
function Hi(t) {
  return ye(t) === "" ? "" : d`
        <bt-chart-lightbox
            label="Percentile over time"
            .renderChart=${() => ye(t)}
        ></bt-chart-lightbox>
    `;
}
function ye(t) {
  if (!Array.isArray(t) || t.length < 2) return "";
  const e = [...t].filter((m) => Number.isFinite(Date.parse(m == null ? void 0 : m.timestamp))).sort((m, h) => Date.parse(m.timestamp) - Date.parse(h.timestamp));
  if (e.length < 2) return "";
  const i = Date.parse(e[0].timestamp), n = Date.parse(e[e.length - 1].timestamp), o = Math.max(1, n - i), a = 320, r = 140, s = 22, l = 8, c = 8, b = 20, u = a - s - l, g = r - c - b, _ = (m) => s + (m - i) / o * u, f = (m) => c + (1 - m / 100) * g, w = ve.map((m) => ({
    ...m,
    points: e.map((h) => {
      const v = zi(h, m.key);
      return v === null ? null : { ts: Date.parse(h.timestamp), p: v };
    }).filter((h) => h !== null)
  }));
  if (w.reduce(
    (m, h) => m + h.points.length,
    0
  ) < 2) return "";
  const y = Ft(e[0].timestamp), $ = Ft(e[e.length - 1].timestamp), k = [10, 50, 90];
  return d`
        <div class="growth-trend">
            <div class="label-row">
                <div class="label">Percentile over time</div>
                <div class="legend">
                    ${ve.map(
    (m) => d`
                            <span class="legend-item">
                                <span
                                    class="swatch"
                                    style=${`background:${m.color}`}
                                ></span>
                                ${m.label}
                            </span>
                        `
  )}
                </div>
            </div>
            <svg
                viewBox="0 0 ${a} ${r}"
                role="img"
                aria-label="Percentile over time"
                style="width:100%;height:${r}px;"
            >
                ${k.map(
    (m) => q`
                        <line
                            x1=${s}
                            x2=${a - l}
                            y1=${f(m)}
                            y2=${f(m)}
                            stroke="var(--divider-color, #888)"
                            stroke-dasharray=${m === 50 ? "" : "2 2"}
                            stroke-width="1"
                        ></line>
                        <text
                            x=${s - 4}
                            y=${f(m) + 3}
                            font-size="8"
                            text-anchor="end"
                            fill="var(--secondary-text-color)"
                        >
                            p${m}
                        </text>
                    `
  )}
                ${w.map((m) => {
    if (m.points.length === 0) return q``;
    const h = m.points.map(
      (v, S) => `${S === 0 ? "M" : "L"}${_(v.ts).toFixed(1)},${f(v.p).toFixed(1)}`
    ).join(" ");
    return q`
                        ${m.points.length > 1 ? q`<path
                                d=${h}
                                fill="none"
                                stroke=${m.color}
                                stroke-width="1.6"
                                stroke-linejoin="round"
                                stroke-linecap="round"
                              ></path>` : ""}
                        ${m.points.map(
      (v) => q`
                                <circle
                                    cx=${_(v.ts)}
                                    cy=${f(v.p)}
                                    r="2.5"
                                    fill=${m.color}
                                >
                                    <title>${m.label} ${Ft(new Date(v.ts).toISOString())}: p${Math.round(v.p)}</title>
                                </circle>
                            `
    )}
                    `;
  })}
                <text
                    x=${s}
                    y=${r - 4}
                    font-size="9"
                    fill="var(--secondary-text-color)"
                >
                    ${y}
                </text>
                <text
                    x=${a - l}
                    y=${r - 4}
                    font-size="9"
                    text-anchor="end"
                    fill="var(--secondary-text-color)"
                >
                    ${$}
                </text>
            </svg>
        </div>
    `;
}
function Ft(t) {
  if (!t) return "";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "" : new Date(e).toLocaleDateString([], {
    month: "short",
    day: "numeric"
  });
}
function Fe(t, e) {
  return d`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var l;
    const n = /* @__PURE__ */ new Date(), o = new Date(n.getTime() - 90 * 864e5), a = (c) => c.toISOString().slice(0, 10), r = await t.callService(
      "babytracker",
      "export_report",
      { baby: e, format: "html", start: a(o), end: a(n) },
      void 0,
      !1,
      !0
      // return_response
    ), s = (l = r == null ? void 0 : r.response) == null ? void 0 : l.url;
    s && window.open(s, "_blank", "noopener");
  }}
            >
                Export for pediatrician
            </button>
        </div>
    `;
}
function Ii(t, e, i) {
  var n;
  return (n = t == null ? void 0 : t.importer) != null && n.source_entity_id ? d`
        <div class="section">
            <button
                aria-label="Resync importers"
                title="Re-read the source sensor's current activities. Already-imported activities are skipped."
                @click=${(o) => i("resync_importers", { baby: e }, o.currentTarget)}
            >
                Sync importers
            </button>
        </div>
    ` : "";
}
function $e() {
  const t = window;
  return !!(t.SpeechRecognition || t.webkitSpeechRecognition);
}
function Bi(t) {
  var e;
  return !!(t != null && t.connection && typeof navigator < "u" && ((e = navigator.mediaDevices) != null && e.getUserMedia) && window.AudioWorkletNode);
}
async function Vi() {
  const t = window, e = t.SpeechRecognition || t.webkitSpeechRecognition;
  if (!e) throw new Error("SpeechRecognition not supported");
  const i = new e();
  i.continuous = !1, i.interimResults = !1, i.lang = navigator.language || "en-US";
  let n = () => {
  }, o = () => {
  };
  const a = new Promise((s, l) => {
    n = s, o = l;
  });
  let r = !1;
  return i.onresult = (s) => {
    if (r) return;
    r = !0;
    const l = Array.from(s.results).map((c) => {
      var b;
      return ((b = c[0]) == null ? void 0 : b.transcript) ?? "";
    }).join(" ").trim();
    n({ text: l });
  }, i.onerror = (s) => {
    r || (r = !0, o(new Error((s == null ? void 0 : s.error) ?? "speech-recognition error")));
  }, i.onend = () => {
    r || (r = !0, n({ text: "" }));
  }, i.start(), {
    stop: async () => {
      try {
        i.stop();
      } catch {
      }
      return a;
    },
    abort: () => {
      try {
        i.abort();
      } catch {
      }
    }
  };
}
const qi = `
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
async function Fi(t) {
  const e = await navigator.mediaDevices.getUserMedia({ audio: !0 }), i = window.AudioContext || window.webkitAudioContext, n = new i({ sampleRate: 16e3 }), o = URL.createObjectURL(
    new Blob([qi], { type: "text/javascript" })
  );
  try {
    await n.audioWorklet.addModule(o);
  } finally {
    URL.revokeObjectURL(o);
  }
  const a = n.createMediaStreamSource(e), r = new AudioWorkletNode(n, "bt-pcm-worklet");
  a.connect(r);
  let s, l, c = () => {
  }, b = () => {
  };
  const u = new Promise((p, y) => {
    c = p, b = y;
  });
  let g = !1;
  const _ = () => {
    try {
      r.port.onmessage = null;
    } catch {
    }
    try {
      r.disconnect();
    } catch {
    }
    try {
      a.disconnect();
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
    g || (g = !0, _(), c({ text: p }));
  }, w = (p) => {
    g || (g = !0, _(), b(p));
  };
  try {
    l = await t.connection.subscribeMessage(
      (p) => {
        var $, k, m, h, v;
        const y = p == null ? void 0 : p.type;
        if (y === "run-start")
          s = (k = ($ = p == null ? void 0 : p.data) == null ? void 0 : $.runner_data) == null ? void 0 : k.stt_binary_handler_id, r.port.onmessage = (S) => {
            var T;
            if (s == null || g) return;
            const P = new Uint8Array(S.data), C = new Uint8Array(P.length + 1);
            C[0] = s, C.set(P, 1);
            try {
              (T = t.connection.socket) == null || T.send(C);
            } catch {
            }
          };
        else if (y === "stt-end") {
          const S = ((h = (m = p == null ? void 0 : p.data) == null ? void 0 : m.stt_output) == null ? void 0 : h.text) ?? "";
          f(S);
        } else y === "error" && w(
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
    throw _(), p;
  }
  return {
    stop: async () => {
      var p;
      if (s == null && !g)
        return f(""), u;
      if (s != null && !g)
        try {
          (p = t.connection.socket) == null || p.send(new Uint8Array([s]));
        } catch {
        }
      try {
        r.port.onmessage = null;
      } catch {
      }
      try {
        e.getTracks().forEach((y) => y.stop());
      } catch {
      }
      return u;
    },
    abort: () => {
      g || (g = !0, _(), c({ text: "" }));
    }
  };
}
var ji = Object.defineProperty, Wi = Object.getOwnPropertyDescriptor, te = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Wi(e, i) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && ji(e, i, o), o;
};
let kt = class extends O {
  constructor() {
    super(...arguments), this._state = "idle", this._onClick = async (t) => {
      t.preventDefault(), t.stopPropagation(), this._state === "idle" ? await this._start() : this._state === "listening" && await this._stop();
    };
  }
  get _supported() {
    return $e() || Bi(this.hass);
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
      this._controller = $e() ? await Vi() : await Fi(this.hass);
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
    if (!this._supported) return d``;
    const t = {
      idle: "Voice input",
      listening: "Stop recording",
      transcribing: "Transcribing"
    }, e = {
      idle: "🎤",
      listening: "■",
      transcribing: "…"
    };
    return d`
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
kt.styles = K`
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
te([
  N({ attribute: !1 })
], kt.prototype, "hass", 2);
te([
  A()
], kt.prototype, "_state", 2);
kt = te([
  J("bt-mic-button")
], kt);
const Ki = 5 * 1024 * 1024, Yi = /* @__PURE__ */ new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif"
]);
class X extends Error {
  constructor(e, i) {
    super(i), this.code = e;
  }
}
function Gi(t) {
  return new Promise((e, i) => {
    const n = new FileReader();
    n.onload = () => {
      const o = n.result;
      if (typeof o != "string") {
        i(new X("read_failed", "FileReader returned non-string"));
        return;
      }
      const a = o.indexOf(",");
      e(a >= 0 ? o.slice(a + 1) : o);
    }, n.onerror = () => i(new X("read_failed", "FileReader failed")), n.readAsDataURL(t);
  });
}
async function Xi(t, e) {
  if (e.size > Ki)
    throw new X(
      "too_large",
      `Photo is ${Math.round(e.size / (1024 * 1024))} MB; max is 5 MB`
    );
  const i = (e.type || "").toLowerCase();
  if (!Yi.has(i))
    throw new X(
      "unsupported_mime",
      `Unsupported photo type: ${e.type || "unknown"}`
    );
  const n = await Gi(e);
  try {
    const o = await t.connection.sendMessagePromise({
      type: "babytracker/upload_photo",
      data: n,
      mime: i
    }), a = o == null ? void 0 : o.photo_path;
    if (typeof a != "string" || !a)
      throw new X("bad_response", "upload returned no photo_path");
    return { photo_path: a };
  } catch (o) {
    if (o instanceof X) throw o;
    const a = (o == null ? void 0 : o.code) ?? "upload_failed", r = (o == null ? void 0 : o.message) ?? "upload failed";
    throw new X(a, r);
  }
}
var Zi = Object.defineProperty, Qi = Object.getOwnPropertyDescriptor, mt = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Qi(e, i) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && Zi(e, i, o), o;
};
let Q = class extends O {
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
        const { photo_path: o } = await Xi(this.hass, i);
        this._setValue(o);
      } catch (o) {
        const a = o instanceof X ? o.message : "Photo upload failed";
        this._error = a, console.warn("babytracker: photo upload failed", o);
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
Q.styles = K`
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
mt([
  N({ attribute: !1 })
], Q.prototype, "hass", 2);
mt([
  N()
], Q.prototype, "value", 2);
mt([
  A()
], Q.prototype, "_busy", 2);
mt([
  A()
], Q.prototype, "_error", 2);
mt([
  Ue("input[type=file]")
], Q.prototype, "_fileInput", 2);
Q = mt([
  J("bt-photo-button")
], Q);
const Ji = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk",
  "other"
]);
function tt(t, e = {}) {
  return d`
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
function et(t, e) {
  return d`
        <label>Photo</label>
        <bt-photo-button
            .hass=${t}
            .value=${e ?? ""}
        ></bt-photo-button>
    `;
}
function it(t) {
  const e = t.querySelector("bt-photo-button"), i = e == null ? void 0 : e.value;
  return typeof i == "string" && i.length > 0 ? i : void 0;
}
const R = (t) => String(t).padStart(2, "0");
function gt() {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${R(t.getMonth() + 1)}-${R(t.getDate())}T${R(t.getHours())}:${R(t.getMinutes())}`;
}
function H(t) {
  if (!t) return;
  const e = Date.parse(t);
  if (!Number.isNaN(e))
    return new Date(e).toISOString();
}
function jt(t) {
  if (!t) return "";
  const e = Date.parse(t);
  if (Number.isNaN(e)) return "";
  const i = new Date(e);
  return `${i.getFullYear()}-${R(i.getMonth() + 1)}-${R(i.getDate())}T${R(i.getHours())}:${R(i.getMinutes())}`;
}
function ee() {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${R(t.getMonth() + 1)}-${R(t.getDate())}`;
}
function tn(t) {
  if (!t) return "";
  const e = Date.parse(t);
  if (Number.isNaN(e)) return "";
  const i = new Date(e);
  return `${i.getFullYear()}-${R(i.getMonth() + 1)}-${R(i.getDate())}`;
}
function ie(t) {
  if (!t) return;
  const e = Date.parse(`${t}T00:00`);
  if (!Number.isNaN(e))
    return new Date(e).toISOString();
}
function B(t) {
  const e = (i) => {
    var a;
    const o = (a = i.currentTarget.parentElement) == null ? void 0 : a.querySelector(
      "input"
    );
    o && (o.value = gt(), o.dispatchEvent(new Event("input", { bubbles: !0 })), o.dispatchEvent(new Event("change", { bubbles: !0 })));
  };
  return d`
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
const Pt = 8, we = 0.5, xe = 4;
function je(t) {
  const e = t.initialUnit === "ml" ? "ml" : "oz", n = typeof t.initialAmount == "number" && Number.isFinite(t.initialAmount) ? t.initialAmount : void 0, o = n != null ? String(n) : "", a = Math.max(
    0,
    Math.min(Pt, n ?? xe)
  ), r = (l) => {
    var u;
    const c = l.currentTarget;
    if (c.type !== "range") return;
    const b = (u = c.form) == null ? void 0 : u.querySelector(
      "#amount-readout"
    );
    b && (b.textContent = `${c.value} oz`);
  }, s = (l) => {
    const c = l.currentTarget, b = c.form;
    if (!b) return;
    const u = b.querySelector(
      'input[name="amount"]'
    ), g = b.querySelector("#amount-readout");
    if (u)
      if (c.value === "oz") {
        u.type = "range", u.min = "0", u.max = String(Pt), u.step = String(we), u.removeAttribute("inputmode");
        const _ = Number(u.value), f = Number.isFinite(_) ? Math.max(0, Math.min(Pt, _)) : xe;
        u.value = String(f), g && (g.style.display = "", g.textContent = `${u.value} oz`);
      } else
        u.type = "number", u.min = "0", u.step = "1", u.removeAttribute("max"), u.inputMode = "decimal", g && (g.style.display = "none");
  };
  return d`
        <label for="amount">Amount</label>
        <div style="display:flex;gap:8px;align-items:center;">
            ${e === "oz" ? d`
                      <input
                          id="amount"
                          name="amount"
                          type="range"
                          min="0"
                          max=${Pt}
                          step=${we}
                          .value=${String(a)}
                          @input=${r}
                          style="flex:1;min-width:0;"
                          ?autofocus=${t.autofocus ?? !1}
                      />
                      <span
                          id="amount-readout"
                          class="muted"
                          style="min-width:4ch;text-align:right;"
                          >${a} oz</span
                      >
                  ` : d`
                      <input
                          id="amount"
                          name="amount"
                          type="number"
                          min="0"
                          step="1"
                          inputmode="decimal"
                          .value=${o}
                          style="flex:1;min-width:0;"
                          ?autofocus=${t.autofocus ?? !1}
                      />
                      <span
                          id="amount-readout"
                          class="muted"
                          style="display:none;"
                      ></span>
                  `}
        </div>
        <label for="unit">Unit</label>
        <select id="unit" name="unit" @change=${s}>
            <option value="oz" ?selected=${e === "oz"}>oz</option>
            <option value="ml" ?selected=${e === "ml"}>ml</option>
        </select>
    `;
}
function We(t) {
  const e = t.initialWeightUnit === "lb" ? "lb" : "kg", i = t.initialLengthUnit === "in" ? "in" : "cm", n = (o) => typeof o == "number" && Number.isFinite(o) ? String(o) : "";
  return d`
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
                    .value=${n(t.initialWeight)}
                    ?autofocus=${t.autofocusWeight ?? !1}
                />
            </div>
            <div>
                <label for="weight_unit">Unit</label>
                <select id="weight_unit" name="weight_unit">
                    <option value="kg" ?selected=${e === "kg"}>
                        kg
                    </option>
                    <option value="lb" ?selected=${e === "lb"}>
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
                    .value=${n(t.initialHeight)}
                />
            </div>
            <div>
                <label for="length_unit">Unit</label>
                <select id="length_unit" name="length_unit">
                    <option value="cm" ?selected=${i === "cm"}>
                        cm
                    </option>
                    <option value="in" ?selected=${i === "in"}>
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
                    .value=${n(t.initialHead)}
                />
                <span class="muted">(uses the length unit above)</span>
            </div>
        </div>
    `;
}
function ne(t) {
  const e = (i) => {
    var a;
    const o = (a = i.currentTarget.parentElement) == null ? void 0 : a.querySelector(
      "input"
    );
    o && (o.value = ee(), o.dispatchEvent(new Event("input", { bubbles: !0 })), o.dispatchEvent(new Event("change", { bubbles: !0 })));
  };
  return d`
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
function en(t, e, i, n, o, a, r) {
  const s = (i == null ? void 0 : i.volume_unit) ?? o ?? "oz";
  return d`
        <form @submit=${(c) => {
    c.preventDefault();
    const b = c.currentTarget, u = new FormData(b), g = String(u.get("amount") ?? ""), _ = g === "" ? void 0 : Number(g), f = H(String(u.get("at") ?? "")), w = String(u.get("unit") ?? s), p = String(u.get("notes") ?? "") || void 0;
    a("log_feeding", {
      baby: e,
      method: "bottle",
      amount: _,
      unit: w,
      started_at: f,
      ended_at: f,
      notes: p,
      photo_path: it(b)
    });
  }}>
            <h2>Log bottle</h2>
            ${je({
    initialAmount: n,
    initialUnit: s,
    autofocus: !0
  })}
            <label for="at">Time</label>
            ${B({
    id: "at",
    value: gt(),
    required: !0
  })}
            <label for="notes">Notes</label>
            ${tt(t)}
            ${et(t)}
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function nn(t, e, i, n, o, a) {
  const r = (l) => {
    l.preventDefault(), o("delete_entry", { entry_id: t });
  }, s = n ? `${i} (${n})` : i;
  return d`
        <form @submit=${(l) => l.preventDefault()}>
            <h2>Delete this entry?</h2>
            <p>
                This <strong>${e}</strong> was logged by
                <strong>${s}</strong>, not from this card. Deleting it
                here only removes it from babytracker — the upstream record is
                not affected.
            </p>
            <div class="actions">
                <button type="button" @click=${a} autofocus>Cancel</button>
                <button type="button" class="primary" @click=${r}>
                    Delete anyway
                </button>
            </div>
        </form>
    `;
}
function on(t, e, i, n) {
  return d`
        <form @submit=${(a) => {
    a.preventDefault();
    const r = a.currentTarget, s = new FormData(r, a.submitter ?? void 0);
    i("log_diaper", {
      baby: e,
      kind: String(s.get("kind") ?? "wet"),
      timestamp: H(String(s.get("when") ?? "")),
      notes: String(s.get("notes") ?? "") || void 0,
      photo_path: it(r)
    });
  }}>
            <h2>Log diaper</h2>
            <label for="when">Time</label>
            ${B({
    id: "when",
    value: gt(),
    required: !0
  })}
            <label for="notes">Notes</label>
            ${tt(t)}
            ${et(t)}
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
const rn = [
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
function ke(t) {
  return an[t] ?? t;
}
const Ke = [
  "left_thigh",
  "right_thigh",
  "left_arm",
  "right_arm",
  "oral",
  "nasal"
];
function sn(t, e, i, n, o, a, r) {
  const s = Ke, l = (p) => {
    p.preventDefault();
    const y = p.currentTarget, $ = new FormData(y), k = String($.get("vaccine_select") ?? "").trim(), m = String($.get("vaccine_custom") ?? "").trim(), h = k === "__other__" ? m : k;
    if (!h) return;
    const v = String($.get("dose_number") ?? "").trim(), S = v === "" ? void 0 : Number(v), P = String($.get("site") ?? "").trim() || void 0, C = String($.get("lot_number") ?? "").trim() || void 0, T = String($.get("provider") ?? "").trim() || void 0;
    a("log_vaccine", {
      baby: e,
      name: h,
      dose_number: S,
      site: P,
      lot_number: C,
      provider: T,
      timestamp: ie(String($.get("when") ?? "")),
      notes: String($.get("notes") ?? "") || void 0,
      photo_path: it(y)
    });
  }, c = Array.from(
    new Set(
      [...rn, ...o].filter((p) => !!p && p !== "none").map(ke)
    )
  ).sort((p, y) => p.localeCompare(y)), b = i && i !== "none" ? ke(i) : "", u = !!b && c.includes(b), g = !!b && !u, _ = u ? b : g ? "__other__" : "", f = g ? b : "";
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
    var k;
    const y = p.currentTarget, $ = (k = y.closest("form")) == null ? void 0 : k.querySelector("#vaccine_custom");
    $ && (y.value === "__other__" ? ($.hidden = !1, $.required = !0, $.focus()) : ($.hidden = !0, $.required = !1, $.value = ""));
  }}
            >
                <option value="" disabled ?selected=${_ === ""}>
                    (pick one)
                </option>
                ${c.map(
    (p) => d`<option
                        value=${p}
                        ?selected=${_ === p}
                    >
                        ${p}
                    </option>`
  )}
                <option
                    value="__other__"
                    ?selected=${_ === "__other__"}
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
                ?hidden=${_ !== "__other__"}
                ?required=${_ === "__other__"}
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
                ${s.map(
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
            ${ne({
    id: "when",
    value: ee(),
    required: !0
  })}
            <label for="notes">Notes</label>
            ${tt(t)}
            ${et(t)}
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function ln(t, e, i, n, o) {
  const a = String((e == null ? void 0 : e.type) ?? ""), r = (e == null ? void 0 : e.data) ?? {}, s = a === "feeding" && (r.method === "bottle" || r.method === "solids"), l = a === "feeding" && r.method === "solids", c = a === "vaccine" || a === "growth", b = Ji.has(a) && !s, u = (f) => {
    f.preventDefault();
    const w = f.currentTarget, p = new FormData(w), y = {}, $ = c ? ie(String(p.get("started") ?? "")) : H(String(p.get("started") ?? ""));
    if ($ && (y.timestamp = $), b) {
      const v = H(String(p.get("ended") ?? ""));
      y.ended_at = v ?? null;
    } else s && $ && (y.ended_at = $);
    const k = String(p.get("notes") ?? "");
    y.notes = k || null;
    const m = {};
    if (a === "diaper")
      m.kind = String(p.get("kind") ?? r.kind ?? "wet");
    else if (a === "feeding" && r.method === "bottle") {
      const v = String(p.get("amount") ?? ""), S = v === "" ? null : Number(v);
      m.amount = S, m.unit = String(p.get("unit") ?? r.unit ?? "oz");
    } else if (a === "other" || a === "medication") {
      const v = String(p.get("name") ?? "");
      v && (m.name = v);
    } else if (a === "vaccine") {
      const v = String(p.get("name") ?? "").trim();
      v && (m.name = v);
      const S = String(p.get("dose_number") ?? "").trim();
      if (S === "")
        m.dose_number = null;
      else {
        const P = Number(S);
        Number.isFinite(P) && (m.dose_number = P);
      }
      m.site = String(p.get("site") ?? "").trim() || null, m.lot_number = String(p.get("lot_number") ?? "").trim() || null, m.provider = String(p.get("provider") ?? "").trim() || null;
    } else if (a === "growth") {
      const v = (T) => {
        const L = p.get(T);
        if (L === null) return;
        const x = String(L).trim();
        if (x === "") return null;
        const z = Number(x);
        return Number.isFinite(z) ? z : void 0;
      }, S = v("weight"), P = v("height"), C = v("head");
      S !== void 0 && (m.weight = S), P !== void 0 && (m.height = P), C !== void 0 && (m.head_circumference = C), m.weight_unit = String(
        p.get("weight_unit") ?? r.weight_unit ?? "kg"
      ), m.length_unit = String(
        p.get("length_unit") ?? r.length_unit ?? "cm"
      );
    }
    Object.keys(m).length && (y.data = m);
    const h = it(w);
    y.photo_path = h ?? null, i("edit_entry", { entry_id: e.id, fields: y });
  }, g = () => {
    if (!o) {
      n();
      return;
    }
    !!e.source && e.source !== "user" || n(), o({
      id: e.id,
      type: e.type,
      source: e.source,
      staff: e.staff
    });
  }, _ = cn(e);
  return d`
        <form @submit=${u}>
            <h2>${_}</h2>
            ${b ? d`
                      <label for="started">Started</label>
                      ${B({
    id: "started",
    value: jt(e.timestamp),
    required: !0
  })}
                      <label for="ended"
                          >Ended <span class="muted">(blank = ongoing)</span></label
                      >
                      ${B({
    id: "ended",
    value: jt(e.ended_at)
  })}
                  ` : c ? d`
                      <label for="started">Date</label>
                      ${ne({
    id: "started",
    value: tn(e.timestamp),
    required: !0
  })}
                  ` : d`
                      <label for="started">Time</label>
                      ${B({
    id: "started",
    value: jt(e.timestamp),
    required: !0
  })}
                  `}
            ${a === "diaper" ? d`
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
            ${a === "feeding" && r.method === "bottle" ? je({
    initialAmount: typeof r.amount == "number" ? r.amount : void 0,
    initialUnit: r.unit ?? "oz"
  }) : ""}
            ${a === "other" || a === "medication" ? d`
                      <label for="name">Name</label>
                      <input
                          id="name"
                          name="name"
                          type="text"
                          .value=${String(r.name ?? "")}
                      />
                  ` : ""}
            ${a === "growth" ? We({
    initialWeight: typeof r.weight == "number" ? r.weight : void 0,
    initialHeight: typeof r.height == "number" ? r.height : void 0,
    initialHead: typeof r.head_circumference == "number" ? r.head_circumference : void 0,
    initialWeightUnit: r.weight_unit ?? "kg",
    initialLengthUnit: r.length_unit ?? "cm"
  }) : ""}
            ${a === "vaccine" ? d`
                      <label for="name">Vaccine</label>
                      <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          .value=${String(r.name ?? "")}
                      />
                      <label for="dose_number">Dose number</label>
                      <input
                          id="dose_number"
                          name="dose_number"
                          type="number"
                          min="1"
                          max="20"
                          step="1"
                          inputmode="numeric"
                          .value=${r.dose_number != null ? String(r.dose_number) : ""}
                      />
                      <label for="site">Site</label>
                      <select id="site" name="site">
                          <option value="" ?selected=${!r.site}>
                              (unspecified)
                          </option>
                          ${Ke.map(
    (f) => d`<option
                                  value=${f}
                                  ?selected=${r.site === f}
                              >
                                  ${f.replace("_", " ")}
                              </option>`
  )}
                      </select>
                      <label for="lot_number">Lot number</label>
                      <input
                          id="lot_number"
                          name="lot_number"
                          type="text"
                          placeholder="optional"
                          .value=${String(r.lot_number ?? "")}
                      />
                      <label for="provider">Provider</label>
                      <input
                          id="provider"
                          name="provider"
                          type="text"
                          placeholder="optional"
                          .value=${String(r.provider ?? "")}
                      />
                  ` : ""}
            <label for="notes"
                >${l ? d`What was fed <span class="muted">(optional)</span>` : "Notes"}</label
            >
            ${tt(t, {
    value: String(e.notes ?? ""),
    placeholder: l ? "e.g. banana, oatmeal" : void 0
  })}
            ${et(t, e.photo_path ?? "")}
            <div class="actions">
                <button type="button" @click=${n}>Cancel</button>
                <button
                    type="button"
                    class="danger"
                    aria-label="Delete entry"
                    @click=${g}
                >
                    Delete
                </button>
                <button type="submit" class="primary">Save</button>
            </div>
        </form>
    `;
}
function cn(t) {
  const e = String((t == null ? void 0 : t.type) ?? "entry"), i = (t == null ? void 0 : t.data) ?? {}, n = i.name ?? i.method ?? i.kind;
  return n ? `Edit ${e} (${n})` : `Edit ${e}`;
}
function dn(t, e, i, n, o) {
  const a = (i == null ? void 0 : i.weight_unit) ?? "kg", r = (i == null ? void 0 : i.length_unit) ?? "cm";
  return d`
        <form @submit=${(l) => {
    l.preventDefault();
    const c = l.currentTarget, b = new FormData(c), u = (g) => {
      const _ = String(b.get(g) ?? "").trim();
      if (!_) return;
      const f = Number(_);
      return Number.isFinite(f) ? f : void 0;
    };
    n("log_growth", {
      baby: e,
      weight: u("weight"),
      height: u("height"),
      head_circumference: u("head"),
      weight_unit: String(b.get("weight_unit") ?? a),
      length_unit: String(b.get("length_unit") ?? r),
      timestamp: ie(String(b.get("when") ?? "")),
      notes: String(b.get("notes") ?? "") || void 0,
      photo_path: it(c)
    });
  }}>
            <h2>Log growth measurement</h2>
            ${We({
    initialWeightUnit: a,
    initialLengthUnit: r,
    autofocusWeight: !0
  })}
            <label for="when">Date</label>
            ${ne({
    id: "when",
    value: ee(),
    required: !0
  })}
            <label for="notes">Notes</label>
            ${tt(t)}
            ${et(t)}
            <div class="actions">
                <button type="button" @click=${o}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
const un = [
  "Bath",
  "Butt wash",
  "Diaper free time",
  "Medication",
  "Vitamin",
  "Burp",
  "Spit up",
  "Throw up"
];
function pn(t, e, i, n) {
  const o = (r) => {
    r.preventDefault();
    const s = r.currentTarget, l = new FormData(s);
    i("log_other", {
      baby: e,
      name: String(l.get("name") ?? ""),
      timestamp: H(String(l.get("started") ?? "")),
      ended_at: H(String(l.get("ended") ?? "")) || void 0,
      notes: String(l.get("notes") ?? "") || void 0,
      photo_path: it(s)
    });
  }, a = (r, s) => {
    const l = r.currentTarget.form, c = { baby: e, name: s };
    if (l) {
      const b = new FormData(l), u = H(String(b.get("started") ?? "")), g = H(String(b.get("ended") ?? ""));
      u && (c.timestamp = u), g && (c.ended_at = g);
    }
    i("log_other", c);
  };
  return d`
        <form @submit=${o}>
            <h2>Log activity</h2>
            <label for="started">Started</label>
            ${B({
    id: "started",
    value: gt(),
    required: !0
  })}
            <label for="ended"
                >Ended <span class="muted">(optional)</span></label
            >
            ${B({
    id: "ended",
    placeholder: "leave blank for a point-in-time event"
  })}
            <div class="quick-other" role="group" aria-label="Quick activities">
                ${un.map(
    (r) => d`
                        <button
                            type="button"
                            class="quick"
                            @click=${(s) => a(s, r)}
                        >
                            ${r}
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
            ${tt(t)}
            ${et(t)}
            <div class="actions">
                <button type="button" @click=${n}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function hn(t, e, i, n, o, a) {
  const r = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: n ? `Log ${n.replace("_", " ")} feeding` : "Log feeding"
  };
  return d`
        <form @submit=${(l) => {
    l.preventDefault();
    const c = l.currentTarget, b = new FormData(c), u = H(String(b.get("started") ?? "")), g = H(String(b.get("ended") ?? "")), _ = String(b.get("notes") ?? "") || void 0, f = it(c);
    if (!g) {
      const y = {
        baby: e,
        started_at: u,
        photo_path: f
      };
      let $;
      switch (i) {
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
          $ = "start_feeding", y.method = n;
          break;
      }
      o($, y);
      return;
    }
    const w = {
      baby: e,
      started_at: u,
      ended_at: g,
      notes: _,
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
        p = "log_feeding", w.method = n;
        break;
    }
    o(p, w);
  }}>
            <h2>${r[i]}</h2>
            <label for="started">Started</label>
            ${B({
    id: "started",
    value: gt(),
    required: !0
  })}
            <label for="ended">Ended <span class="muted">(optional)</span></label>
            ${B({
    id: "ended",
    placeholder: "leave blank for an open session"
  })}
            <label for="notes">Notes</label>
            ${tt(t)}
            ${et(t)}
            <div class="actions">
                <button type="button" @click=${a}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function bn(t, e, i, n) {
  return d`
        <form @submit=${(a) => {
    a.preventDefault();
    const r = a.currentTarget, s = new FormData(r), l = H(String(s.get("when") ?? ""));
    i("log_feeding", {
      baby: e,
      method: "solids",
      started_at: l,
      ended_at: l,
      notes: String(s.get("notes") ?? "") || void 0,
      photo_path: it(r)
    });
  }}>
            <h2>Log solids</h2>
            <label for="notes"
                >What was fed <span class="muted">(optional)</span></label
            >
            ${tt(t, {
    placeholder: "e.g. banana, oatmeal",
    autofocus: !0
  })}
            <label for="when">Time</label>
            ${B({
    id: "when",
    value: gt(),
    required: !0
  })}
            ${et(t)}
            <div class="actions">
                <button type="button" @click=${n}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function oe(t, e, i, n, o, a) {
  let r = E;
  if (e !== null)
    switch (e.kind) {
      case "diaper":
        r = on(t, e.baby, n, o);
        break;
      case "bottle":
        r = en(
          t,
          e.baby,
          i,
          e.lastAmount,
          e.lastUnit,
          n,
          o
        );
        break;
      case "solids":
        r = bn(t, e.baby, n, o);
        break;
      case "other":
        r = pn(t, e.baby, n, o);
        break;
      case "session":
        r = hn(
          t,
          e.baby,
          e.activity,
          e.method,
          n,
          o
        );
        break;
      case "confirm_delete_imported":
        r = nn(
          e.entryId,
          e.entryType,
          e.source,
          e.staff ?? null,
          n,
          o
        );
        break;
      case "edit_entry":
        r = ln(
          t,
          e.entry,
          n,
          o,
          a
        );
        break;
      case "log_growth":
        r = dn(t, e.baby, i, n, o);
        break;
      case "log_vaccine":
        r = sn(
          t,
          e.baby,
          e.defaultName ?? "",
          e.defaultDose,
          e.scheduleNames ?? [],
          n,
          o
        );
        break;
    }
  return d`
        <dialog @cancel=${o} @close=${o}>${r}</dialog>
    `;
}
function Ye(t, e) {
  return !t.source || t.source === "user" ? (e(t.id), null) : {
    kind: "confirm_delete_imported",
    entryId: t.id,
    entryType: t.type ?? "entry",
    source: t.source,
    staff: t.staff ?? null
  };
}
function Ge(t, e) {
  const i = t.querySelector("dialog");
  i && (e && !i.open && i.showModal(), !e && i.open && i.close());
}
const Xe = K`
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
`, Wt = 24 * 60 * 60 * 1e3, Se = 29.5735, Ce = [
  { key: "bottle", label: "Bottle", color: "var(--primary-color, #4a90e2)" },
  { key: "breast", label: "Breast", color: "var(--success-color, #43a047)" },
  { key: "solids", label: "Solids", color: "var(--warning-color, #f5a623)" }
], Ae = [
  { key: "wet", label: "Wet", color: "var(--info-color, #4fc3f7)" },
  { key: "dirty", label: "Dirty", color: "var(--accent-color, #f57c00)" },
  { key: "both", label: "Both", color: "var(--error-color, #d32f2f)" }
];
function mn(t) {
  return {
    label: t,
    sleepMinutes: 0,
    bottleMl: 0,
    feedingByCategory: { bottle: 0, breast: 0, solids: 0 },
    diaperByCategory: { wet: 0, dirty: 0, both: 0 }
  };
}
function gn(t) {
  return t === "bottle" ? "bottle" : t === "breast_left" || t === "breast_right" ? "breast" : t === "solids" ? "solids" : null;
}
function fn(t) {
  return t === "wet" || t === "dirty" || t === "both" ? t : null;
}
function _n(t) {
  return {
    feedings: t.feedingByCategory.bottle + t.feedingByCategory.breast + t.feedingByCategory.solids,
    diapers: t.diaperByCategory.wet + t.diaperByCategory.dirty + t.diaperByCategory.both
  };
}
function vn(t, e, i = 7) {
  var w, p, y, $, k, m;
  const n = (w = t == null ? void 0 : t.states) == null ? void 0 : w[M(e, "recent_entries")], o = ((p = n == null ? void 0 : n.attributes) == null ? void 0 : p.entries) ?? [], a = Date.now(), r = new Date(a);
  r.setHours(0, 0, 0, 0);
  const s = [], l = (h) => h.toLocaleDateString([], { weekday: "short" });
  for (let h = i - 1; h >= 0; h--) {
    const v = new Date(r.getTime() - h * Wt);
    s.push(mn(l(v)));
  }
  const c = r.getTime() - (i - 1) * Wt;
  for (const h of o) {
    const v = Date.parse(h == null ? void 0 : h.timestamp);
    if (!Number.isFinite(v)) continue;
    const S = Math.floor((v - c) / Wt);
    if (S < 0 || S >= i) continue;
    const P = s[S];
    if (h.type === "feeding") {
      const C = gn(String(((y = h == null ? void 0 : h.data) == null ? void 0 : y.method) ?? ""));
      C && (P.feedingByCategory[C] += 1);
      const T = Number((($ = h == null ? void 0 : h.data) == null ? void 0 : $.amount) ?? 0), L = String(((k = h == null ? void 0 : h.data) == null ? void 0 : k.unit) ?? "");
      T > 0 && L === "oz" ? P.bottleMl += T * Se : T > 0 && L === "ml" && (P.bottleMl += T);
    } else if (h.type === "diaper") {
      const C = fn(String(((m = h == null ? void 0 : h.data) == null ? void 0 : m.kind) ?? ""));
      C && (P.diaperByCategory[C] += 1);
    } else if (h.type === "sleep") {
      const C = h != null && h.ended_at && h.ended_at !== "" ? Date.parse(h.ended_at) : a;
      Number.isFinite(C) && C > v && (P.sleepMinutes += (C - v) / 6e4);
    }
  }
  const b = s.map(_n);
  if (s.every(
    (h, v) => h.sleepMinutes === 0 && b[v].feedings === 0 && b[v].diapers === 0
  ))
    return "";
  const u = s.map((h) => ({
    label: h.label,
    value: h.sleepMinutes
  })), g = s.map((h) => ({
    label: h.label,
    parts: Ce.map((v) => ({
      ...v,
      value: h.feedingByCategory[v.key]
    }))
  })), _ = s.map((h) => ({
    label: h.label,
    value: h.bottleMl
  })), f = s.map((h) => ({
    label: h.label,
    parts: Ae.map((v) => ({
      ...v,
      value: h.diaperByCategory[v.key]
    }))
  }));
  return d`
        <div class="section" role="region" aria-label="Trends">
            <h2>Trends · last ${i} days</h2>
            <bt-chart-lightbox
                label="Sleep (min/day)"
                .renderChart=${() => Pe(
    u,
    "Sleep (min/day)",
    (h) => `${Math.round(h)}`
  )}
            ></bt-chart-lightbox>
            <bt-chart-lightbox
                label="Feedings/day"
                .renderChart=${() => De(
    g,
    "Feedings/day",
    Ce,
    (h) => `${h}`
  )}
            ></bt-chart-lightbox>
            <bt-chart-lightbox
                label="Bottle (oz/day)"
                .renderChart=${() => Pe(
    _,
    "Bottle (oz/day)",
    (h) => (h / Se).toFixed(1)
  )}
            ></bt-chart-lightbox>
            <bt-chart-lightbox
                label="Diapers/day"
                .renderChart=${() => De(
    f,
    "Diapers/day",
    Ae,
    (h) => `${h}`
  )}
            ></bt-chart-lightbox>
        </div>
    `;
}
function Pe(t, e, i) {
  const s = Math.max(1, ...t.map((c) => c.value)), l = (320 - 14 * 2) / t.length;
  return d`
        <div class="trend">
            <div class="label">${e}</div>
            <svg
                viewBox="0 0 ${320} ${90}"
                role="img"
                aria-label=${e}
                style="width:100%;height:${90}px;"
            >
                ${t.map((c, b) => {
    const u = 14 + b * l, g = l * 0.7, _ = u + (l - g) / 2, f = Math.max(
      c.value > 0 ? 2 : 0,
      c.value / s * (90 - 24 * 2)
    ), w = 66 - f;
    return q`
                        <rect
                            x=${_}
                            y=${w}
                            width=${g}
                            height=${f}
                            fill="var(--primary-color)"
                            rx="2"
                        ></rect>
                        <text
                            x=${_ + g / 2}
                            y=${w - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${c.value > 0 ? i(c.value) : ""}
                        </text>
                        <text
                            x=${_ + g / 2}
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
function De(t, e, i, n) {
  const l = t.map((u) => u.parts.reduce((g, _) => g + _.value, 0)), c = Math.max(1, ...l), b = (320 - 14 * 2) / t.length;
  return d`
        <div class="trend">
            <div class="label-row">
                <div class="label">${e}</div>
                <div class="legend">
                    ${i.map(
    (u) => d`
                            <span class="legend-item">
                                <span
                                    class="swatch"
                                    style=${`background:${u.color}`}
                                ></span>
                                ${u.label}
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
                ${t.map((u, g) => {
    const _ = 14 + g * b, f = b * 0.7, w = _ + (b - f) / 2, p = l[g], y = Math.max(
      p > 0 ? 2 : 0,
      p / c * (90 - 24 * 2)
    ), $ = 66;
    let k = $;
    const m = u.parts.map((h) => {
      if (h.value <= 0) return q``;
      const v = h.value / p * y;
      return k -= v, q`
                            <rect
                                x=${w}
                                y=${k}
                                width=${f}
                                height=${v}
                                fill=${h.color}
                            >
                                <title>${h.label}: ${h.value}</title>
                            </rect>
                        `;
    });
    return q`
                        ${m}
                        <text
                            x=${w + f / 2}
                            y=${$ - y - 4}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${p > 0 ? n(p) : ""}
                        </text>
                        <text
                            x=${w + f / 2}
                            y=${84}
                            font-size="9"
                            text-anchor="middle"
                            fill="var(--secondary-text-color)"
                        >
                            ${u.label}
                        </text>
                    `;
  })}
            </svg>
        </div>
    `;
}
function yn(t) {
  if (!t) return "—";
  const e = Date.parse(t);
  return Number.isNaN(e) ? "—" : new Date(e).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function Kt(t) {
  var n, o;
  const e = String(((n = t == null ? void 0 : t.data) == null ? void 0 : n.name) ?? "vaccine"), i = (o = t == null ? void 0 : t.data) == null ? void 0 : o.dose_number;
  return i != null ? `${e} dose ${i}` : e;
}
function $n(t, e) {
  return !t || t.length === 0 ? "" : d`
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
      return d`<li
                        class=${e ? "clickable" : ""}
                        role=${e ? "button" : "listitem"}
                        tabindex=${e ? "0" : "-1"}
                        aria-label=${e ? `Edit ${Kt(i)}` : Kt(i)}
                        @click=${e ? () => e(i) : void 0}
                        @keydown=${e ? (o) => {
        (o.key === "Enter" || o.key === " ") && (o.preventDefault(), e(i));
      } : void 0}
                    >
                        <span class="vh-date muted"
                            >${yn(i.timestamp)}</span
                        >
                        <span class="vh-name">${Kt(i)}</span>
                        ${(n = i == null ? void 0 : i.data) != null && n.site ? d`<span class="muted">${String(
        i.data.site
      ).replace("_", " ")}</span>` : ""}
                    </li>`;
    }
  )}
            </ul>
        </div>
    `;
}
function wn(t, e, i) {
  var a, r;
  const n = t.states[M(e, "vaccines_due")];
  if (!n || n.state === "unknown") return "";
  const o = ((a = t.states[M(e, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : a.state) === "on";
  return d`
        <div
            class="section chip ${o ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${n.state}</strong>
            ${(r = n.attributes) != null && r.due_on ? d`<span>(${n.attributes.due_on})</span>` : ""}
            ${o ? d`<span aria-label="Overdue">⚠️ overdue</span>` : ""}
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
var xn = Object.defineProperty, kn = Object.getOwnPropertyDescriptor, ct = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? kn(e, i) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && xn(e, i, o), o;
};
const Sn = ["vaccines", "growth", "trends", "export"];
let j = class extends O {
  constructor() {
    super(...arguments), this._modal = null, this._vaccines = [], this._growth = [], this._closeModal = () => {
      this._modal = null;
    }, this._submitModal = async (t, e) => {
      await this.hass.callService("babytracker", t, e), this._modal = null;
    }, this._requestLogGrowth = () => {
      var t;
      (t = this._config) != null && t.baby && (this._modal = { kind: "log_growth", baby: this._config.baby });
    }, this._requestEditEntry = (t) => {
      this._modal = { kind: "edit_entry", entry: t };
    }, this._requestDelete = (t) => {
      this._modal = Ye(
        t,
        (e) => this.hass.callService("babytracker", "delete_entry", { entry_id: e })
      );
    }, this._requestLogVaccine = () => {
      var r, s, l, c, b;
      if (!((r = this._config) != null && r.baby)) return;
      const t = (l = (s = this.hass) == null ? void 0 : s.states) == null ? void 0 : l[M(this._config.baby, "vaccines_due")], e = t != null && t.state && t.state !== "none" && t.state !== "unknown" ? String(t.state) : "", i = (c = t == null ? void 0 : t.attributes) == null ? void 0 : c.dose_number, n = typeof i == "number" ? i : void 0, a = (Array.isArray((b = t == null ? void 0 : t.attributes) == null ? void 0 : b.upcoming) ? t.attributes.upcoming : []).map((u) => u && typeof u.name == "string" ? u.name : null).filter((u) => !!u);
      this._modal = {
        kind: "log_vaccine",
        baby: this._config.baby,
        defaultName: e,
        defaultDose: n,
        scheduleNames: a
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
    (t.has("hass") || t.has("_config")) && this._maybeSubscribe(), t.has("_modal") && Ge(this.renderRoot, this._modal);
  }
  _maybeSubscribe() {
    var t, e;
    !this.hass || !this._config || (this._unsubOptions || (this._unsubOptions = Ie(
      this.hass,
      (i) => {
        this._options = i;
      }
    )), !this._unsubVaccines && this._sections.includes("vaccines") && ((t = this._config) != null && t.baby) && (this._unsubVaccines = $i(
      this.hass,
      this._config.baby,
      (i) => {
        this._vaccines = Array.isArray(i) ? i : [];
      }
    )), !this._unsubGrowth && this._sections.includes("growth") && ((e = this._config) != null && e.baby) && (this._unsubGrowth = wi(
      this.hass,
      this._config.baby,
      (i) => {
        this._growth = Array.isArray(i) ? i : [];
      }
    )));
  }
  get _sections() {
    var t;
    return ((t = this._config) == null ? void 0 : t.sections) ?? Sn;
  }
  render() {
    if (!this.hass || !this._config) return d``;
    const t = this._sections;
    return d`
            <ha-card>
                ${t.includes("vaccines") ? d`
                          ${wn(
      this.hass,
      this._config.baby,
      this._requestLogVaccine
    )}
                          ${$n(
      this._vaccines,
      this._requestEditEntry
    )}
                      ` : ""}
                ${t.includes("growth") ? qe(
      this.hass,
      this._config.baby,
      this._options,
      this._config.units,
      this._requestLogGrowth,
      this._growth[0],
      this._requestEditEntry,
      this._growth
    ) : ""}
                ${t.includes("trends") ? vn(
      this.hass,
      this._config.baby,
      this._config.trend_days ?? 7
    ) : ""}
                ${t.includes("export") ? Fe(this.hass, this._config.baby) : ""}
            </ha-card>
            ${oe(
      this.hass,
      this._modal,
      this._options,
      this._submitModal,
      this._closeModal,
      this._requestDelete
    )}
        `;
  }
  static getStubConfig() {
    return { type: "custom:babytracker-summary-card", baby: "ava" };
  }
};
j.styles = K`
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
        ${Xe}
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
ct([
  N({ attribute: !1 })
], j.prototype, "hass", 2);
ct([
  A()
], j.prototype, "_config", 2);
ct([
  A()
], j.prototype, "_options", 2);
ct([
  A()
], j.prototype, "_modal", 2);
ct([
  A()
], j.prototype, "_vaccines", 2);
ct([
  A()
], j.prototype, "_growth", 2);
j = ct([
  J("babytracker-summary-card")
], j);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-summary-card",
  name: "babytracker — summary",
  description: "Vaccines, growth, 7-day trend charts, and pediatrician export for one baby."
});
var Cn = Object.defineProperty, An = Object.getOwnPropertyDescriptor, dt = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? An(e, i) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && Cn(e, i, o), o;
};
function Ee(t) {
  return String(t).padStart(2, "0");
}
function Et(t) {
  return `${t.getFullYear()}-${Ee(t.getMonth() + 1)}-${Ee(t.getDate())}`;
}
function St(t) {
  const e = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (!e) return null;
  const i = Number(e[1]), n = Number(e[2]) - 1, o = Number(e[3]), a = new Date(i, n, o, 0, 0, 0, 0);
  return Number.isNaN(a.getTime()) ? null : a;
}
function Pn(t) {
  const e = St(t) ?? /* @__PURE__ */ new Date(), i = new Date(e.getFullYear(), e.getMonth(), e.getDate(), 0, 0, 0, 0), n = new Date(
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
function Dn(t, e) {
  const i = St(t) ?? /* @__PURE__ */ new Date();
  return i.setDate(i.getDate() + e), Et(i);
}
function En(t) {
  const e = St(t);
  return e ? e.toLocaleDateString([], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : t;
}
let W = class extends O {
  constructor() {
    super(...arguments), this._date = Et(/* @__PURE__ */ new Date()), this._entries = [], this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._today = () => {
      this._date = Et(/* @__PURE__ */ new Date());
    }, this._onDateChange = (t) => {
      const e = t.currentTarget.value;
      e && St(e) && (this._date = e);
    }, this._requestEdit = (t) => {
      this._modal = { kind: "edit_entry", entry: t };
    }, this._requestDelete = (t) => {
      this._modal = Ye(
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
    };
  }
  setConfig(t) {
    if (!(t != null && t.baby))
      throw new Error("babytracker-history-card: 'baby' is required");
    this._config = { ...t }, t.initial_date && St(t.initial_date) && (this._date = t.initial_date);
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
    (t.has("hass") || t.has("_config") || t.has("_date")) && this._resubscribe(), t.has("_modal") && Ge(this.renderRoot, this._modal);
  }
  _resubscribe() {
    var i, n;
    if (!this.hass || !((i = this._config) != null && i.baby)) return;
    (n = this._unsubEntries) == null || n.call(this);
    const { startIso: t, endIso: e } = Pn(this._date);
    this._unsubEntries = yi(
      this.hass,
      this._config.baby,
      t,
      e,
      (o) => {
        this._entries = Array.isArray(o) ? o : [];
      }
    );
  }
  _go(t) {
    this._date = Dn(this._date, t);
  }
  _renderChips(t) {
    const e = [];
    if (t.bottleFeeds > 0 && e.push(
      D({
        icon: "mdi:baby-bottle-outline",
        label: "Bottle feeds",
        value: String(t.bottleFeeds),
        detail: `· ${Gt(t.bottleVolumeMl)}`
      })
    ), t.nursingMinutes > 0) {
      const n = [];
      t.nursingLeftMinutes > 0 && n.push(`L ${U(t.nursingLeftMinutes)}`), t.nursingRightMinutes > 0 && n.push(`R ${U(t.nursingRightMinutes)}`), e.push(
        D({
          icon: "mdi:mother-nurse",
          label: "Nursing",
          value: U(t.nursingMinutes),
          detail: `(${n.join(" · ")})`
        })
      );
    }
    t.pumpingMl > 0 && e.push(
      D({
        icon: "mdi:water-pump",
        label: "Pumping",
        value: Gt(t.pumpingMl)
      })
    ), t.solidsCount > 0 && e.push(
      D({
        icon: "mdi:silverware-spoon",
        label: "Solids",
        value: String(t.solidsCount)
      })
    );
    const i = [];
    return t.wet && i.push(`${t.wet}W`), t.dirty && i.push(`${t.dirty}D`), e.push(
      D({
        icon: "mdi:human-baby-changing-table",
        label: "Diapers",
        value: String(t.diapers),
        detail: i.length > 0 ? `(${i.join(" · ")})` : void 0
      })
    ), e.push(
      D({
        icon: "mdi:bed",
        label: "Total sleep",
        value: U(t.sleepMinutes)
      })
    ), e.push(
      D({
        icon: "mdi:bed-clock",
        label: "Longest sleep",
        value: U(t.longestSleepMinutes)
      })
    ), t.tummyMinutes > 0 && e.push(
      D({
        icon: "mdi:human-handsup",
        label: "Tummy time",
        value: U(t.tummyMinutes)
      })
    ), t.walkCount > 0 && e.push(
      D({
        icon: "mdi:walk",
        label: "Walks",
        value: String(t.walkCount),
        detail: `· ${U(t.walkMinutes)}`
      })
    ), t.medCount > 0 && e.push(
      D({
        icon: "mdi:pill",
        label: "Medications",
        value: String(t.medCount)
      })
    ), t.vaccineCount > 0 && e.push(
      D({
        icon: "mdi:needle",
        label: "Vaccines",
        value: String(t.vaccineCount)
      })
    ), d`<div class="chips" aria-label="Day summary">
            ${e}
        </div>`;
  }
  render() {
    if (!this.hass || !this._config) return d``;
    const t = this._date === Et(/* @__PURE__ */ new Date()), e = Ci(this._entries);
    return d`
            <ha-card>
                <h2>History — ${En(this._date)}</h2>
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
                ${this._entries.length === 0 ? d`<p class="empty">Nothing logged on this day.</p>` : d`
                          ${this._renderChips(e)}
                          <ul class="entries">
                              ${this._entries.map(
      (i) => Ve(
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
            ${oe(
      this.hass,
      this._modal,
      void 0,
      this._submitModal,
      this._closeModal,
      this._requestDelete
    )}
        `;
  }
  static getStubConfig() {
    return { type: "custom:babytracker-history-card", baby: "ava" };
  }
};
W.styles = K`
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
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 999px;
            background: var(--secondary-background-color);
            border: 1px solid var(--divider-color);
            font-size: 0.85rem;
            line-height: 1.2;
            color: var(--primary-text-color);
        }
        .chip .chip-icon {
            color: var(--secondary-text-color);
            --mdc-icon-size: 16px;
            width: 16px;
            height: 16px;
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
        ${Xe}
    `;
dt([
  N({ attribute: !1 })
], W.prototype, "hass", 2);
dt([
  A()
], W.prototype, "_config", 2);
dt([
  A()
], W.prototype, "_date", 2);
dt([
  A()
], W.prototype, "_entries", 2);
dt([
  A()
], W.prototype, "_modal", 2);
dt([
  A()
], W.prototype, "_expandedNotes", 2);
W = dt([
  J("babytracker-history-card")
], W);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-history-card",
  name: "babytracker — history",
  description: "Paginate through one baby's entries by calendar day with edit + delete."
});
var Mn = Object.defineProperty, Tn = Object.getOwnPropertyDescriptor, nt = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Tn(e, i) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && Mn(e, i, o), o;
};
const Nn = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "recent",
  "importer_sync"
];
let V = class extends O {
  constructor() {
    super(...arguments), this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._handleService = async (t, e, i) => {
      const n = i instanceof HTMLElement && i.classList.contains("quick") ? i : null;
      try {
        const o = await _i(this.hass, "babytracker", t, e);
        return n && (n.classList.add("logged"), setTimeout(() => n.classList.remove("logged"), 700)), this.requestUpdate(), o;
      } catch (o) {
        throw console.warn("babytracker: service call failed", t, o), o;
      }
    }, this._requestModal = (t) => {
      const e = this._baby();
      if (typeof t == "string") {
        if (t === "bottle") {
          const i = this._lastBottle();
          this._modal = {
            kind: "bottle",
            baby: e,
            lastAmount: i == null ? void 0 : i.amount,
            lastUnit: i == null ? void 0 : i.unit
          };
        } else
          this._modal = { kind: t, baby: e };
        return;
      }
      this._modal = {
        kind: "session",
        baby: e,
        activity: t.activity,
        method: t.method
      };
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
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = vi(
      this.hass,
      this._config.baby,
      (t) => {
        this._babyConfig = t;
      }
    )), this._unsubOptions || (this._unsubOptions = Ie(
      this.hass,
      (t) => {
        this._options = t;
      }
    )));
  }
  get _sections() {
    var t;
    return ((t = this._config) == null ? void 0 : t.sections) ?? Nn;
  }
  _baby() {
    return this._config.baby;
  }
  _entityId(t, e = "sensor") {
    return M(this._baby(), t, e);
  }
  /** Chip fragments (no wrapper). Current-state chips
   *  (sleeping / on a walk / at daycare / awake-for) lead so the
   *  user's first glance lands on what's happening right now;
   *  the activity groups (bottle, solids, diaper, each with its
   *  "Last …" and "… (last 24h)" side by side) follow.
   */
  _renderChips(t, e) {
    var f, w, p, y, $, k, m, h, v, S, P, C, T, L;
    const i = this.hass, n = ((p = (w = (f = i.states) == null ? void 0 : f[this._entityId("recent_entries")]) == null ? void 0 : w.attributes) == null ? void 0 : p.entries) ?? [], o = e ? Si(n) : null, a = t ? (y = n.find(
      (x) => {
        var z;
        return (x == null ? void 0 : x.type) === "feeding" && ((z = x == null ? void 0 : x.data) == null ? void 0 : z.method) === "bottle";
      }
    )) == null ? void 0 : y.timestamp : void 0, r = t ? ($ = n.find(
      (x) => {
        var z;
        return (x == null ? void 0 : x.type) === "feeding" && ((z = x == null ? void 0 : x.data) == null ? void 0 : z.method) === "solids";
      }
    )) == null ? void 0 : $.timestamp : void 0, s = t ? (m = (k = i.states) == null ? void 0 : k[this._entityId("last_diaper")]) == null ? void 0 : m.state : void 0, l = t ? (h = n.find(
      (x) => {
        var z, ae;
        return (x == null ? void 0 : x.type) === "diaper" && (((z = x == null ? void 0 : x.data) == null ? void 0 : z.kind) === "dirty" || ((ae = x == null ? void 0 : x.data) == null ? void 0 : ae.kind) === "both");
      }
    )) == null ? void 0 : h.timestamp : void 0, c = t && ((S = (v = i.states) == null ? void 0 : v[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : S.state) === "on", b = t && ((C = (P = i.states) == null ? void 0 : P[this._entityId("walking", "binary_sensor")]) == null ? void 0 : C.state) === "on", u = t && ((L = (T = i.states) == null ? void 0 : T[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : L.state) === "on", g = t && !c ? Ai(n) : null, _ = [];
    return o != null && o.wetDiapers && _.push(`${o.wetDiapers}W`), o != null && o.dirtyDiapers && _.push(`${o.dirtyDiapers}D`), d`
            ${c ? D({
      icon: "mdi:bed",
      label: "Sleeping",
      value: "Sleeping",
      warning: !0
    }) : ""}
            ${b ? D({
      icon: "mdi:walk",
      label: "On a walk",
      value: "On a walk",
      warning: !0
    }) : ""}
            ${u ? D({
      icon: "mdi:school-outline",
      label: "At daycare",
      value: "At daycare",
      warning: !0
    }) : ""}
            ${g !== null ? D({
      icon: "mdi:weather-sunny",
      label: "Awake for",
      value: U(g)
    }) : ""}
            ${t ? D({
      icon: "mdi:baby-bottle-outline",
      label: "Last bottle",
      value: this._timeSince(a)
    }) : ""}
            ${o ? D({
      icon: "mdi:baby-bottle-outline",
      label: "Consumed (last 24h)",
      value: Gt(o.totalVolumeMl)
    }) : ""}
            ${t ? D({
      icon: "mdi:silverware-spoon",
      label: "Last solids",
      value: this._timeSince(r)
    }) : ""}
            ${o ? D({
      icon: "mdi:silverware-spoon",
      label: "Solids (last 24h)",
      value: String(o.solidsCount)
    }) : ""}
            ${t ? D({
      icon: "mdi:human-baby-changing-table",
      label: "Last diaper",
      value: this._timeSince(s)
    }) : ""}
            ${t ? D({
      icon: "mdi:emoticon-poop",
      label: "Last poop",
      value: this._timeSince(l)
    }) : ""}
            ${o ? D({
      icon: "mdi:human-baby-changing-table",
      label: "Diapers (last 24h)",
      value: String(o.diapers),
      detail: _.length > 0 ? `(${_.join(" · ")})` : void 0
    }) : ""}
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
  _lastBottle() {
    var i, n, o, a, r, s, l;
    const t = (n = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : n[this._entityId("recent_entries")], e = ((o = t == null ? void 0 : t.attributes) == null ? void 0 : o.entries) ?? [];
    for (const c of e)
      if ((c == null ? void 0 : c.type) === "feeding" && ((a = c == null ? void 0 : c.data) == null ? void 0 : a.method) === "bottle" && typeof ((r = c == null ? void 0 : c.data) == null ? void 0 : r.amount) == "number" && (((s = c == null ? void 0 : c.data) == null ? void 0 : s.unit) === "ml" || ((l = c == null ? void 0 : c.data) == null ? void 0 : l.unit) === "oz"))
        return { amount: c.data.amount, unit: c.data.unit };
  }
  render() {
    var n;
    if (!this.hass || !this._config) return d``;
    const t = this._sections, e = t.includes("status"), i = t.includes("today");
    return d`
            <ha-card>
                <h2>${He(((n = this._babyConfig) == null ? void 0 : n.name) ?? this._baby())}</h2>
                ${e || i ? d`<div
                          class="chips"
                          role="list"
                          aria-label="Status and last 24 hours"
                      >
                          ${this._renderChips(e, i)}
                      </div>` : ""}
                ${t.includes("active_session") ? Di(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${t.includes("quick_log") ? xi(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${t.includes("growth") ? qe(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${t.includes("recent") ? Ri(
      this.hass,
      this._baby(),
      this._requestEdit,
      this._config.recent_limit ?? 50,
      this._expandedNotes,
      this._toggleNotes
    ) : ""}
                ${t.includes("importer_sync") ? Ii(
      this._babyConfig,
      this._baby(),
      this._handleService
    ) : ""}
                ${t.includes("export") ? Fe(this.hass, this._baby()) : ""}
            </ha-card>
            ${oe(
      this.hass,
      this._modal,
      this._options,
      this._submitModal,
      this._closeModal,
      this._requestDelete
    )}
        `;
  }
};
V.styles = K`
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
        .chip .chip-icon {
            color: var(--secondary-text-color);
            --mdc-icon-size: 16px;
            width: 16px;
            height: 16px;
        }
        .chip.warning .chip-icon {
            color: inherit;
        }
        .chip .chip-detail {
            color: var(--secondary-text-color);
            font-size: 0.78rem;
        }
        .chip.warning .chip-detail {
            color: inherit;
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
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        button.quick ha-icon {
            --mdc-icon-size: 18px;
            color: var(--secondary-text-color);
            flex-shrink: 0;
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
nt([
  N({ attribute: !1 })
], V.prototype, "hass", 2);
nt([
  A()
], V.prototype, "_config", 2);
nt([
  A()
], V.prototype, "_babyConfig", 2);
nt([
  A()
], V.prototype, "_options", 2);
nt([
  A()
], V.prototype, "_modal", 2);
nt([
  A()
], V.prototype, "_expandedNotes", 2);
nt([
  Ue("dialog")
], V.prototype, "_dialog", 2);
V = nt([
  J("babytracker-card")
], V);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => Ln);
var Rn = Object.defineProperty, On = Object.getOwnPropertyDescriptor, re = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? On(e, i) : e, a = t.length - 1, r; a >= 0; a--)
    (r = t[a]) && (o = (n ? r(e, i, o) : r(o)) || o);
  return n && o && Rn(e, i, o), o;
};
let lt = class extends O {
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
    return d`
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
lt.styles = K`
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
re([
  N({ attribute: !1 })
], lt.prototype, "hass", 2);
re([
  N({ attribute: !1 })
], lt.prototype, "_config", 2);
lt = re([
  J("babytracker-card-editor")
], lt);
lt.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const Ln = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return lt;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  V as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
