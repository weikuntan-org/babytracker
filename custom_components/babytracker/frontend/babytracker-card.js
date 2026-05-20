/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ct = globalThis, jt = Ct.ShadowRoot && (Ct.ShadyCSS === void 0 || Ct.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Wt = Symbol(), ie = /* @__PURE__ */ new WeakMap();
let Ae = class {
  constructor(t, i, n) {
    if (this._$cssResult$ = !0, n !== Wt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (jt && t === void 0) {
      const n = i !== void 0 && i.length === 1;
      n && (t = ie.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && ie.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ve = (e) => new Ae(typeof e == "string" ? e : e + "", void 0, Wt), B = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((n, r, o) => n + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[o + 1], e[0]);
  return new Ae(i, e, Wt);
}, Fe = (e, t) => {
  if (jt) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const n = document.createElement("style"), r = Ct.litNonce;
    r !== void 0 && n.setAttribute("nonce", r), n.textContent = i.cssText, e.appendChild(n);
  }
}, ne = jt ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const n of t.cssRules) i += n.cssText;
  return Ve(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: qe, defineProperty: je, getOwnPropertyDescriptor: We, getOwnPropertyNames: Ke, getOwnPropertySymbols: Ye, getPrototypeOf: Ge } = Object, j = globalThis, re = j.trustedTypes, Xe = re ? re.emptyScript : "", Nt = j.reactiveElementPolyfillSupport, ft = (e, t) => e, Et = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Xe : null;
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
} }, Kt = (e, t) => !qe(e, t), oe = { attribute: !0, type: String, converter: Et, reflect: !1, useDefault: !1, hasChanged: Kt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), j.litPropertyMetadata ?? (j.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let ct = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = oe) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const n = Symbol(), r = this.getPropertyDescriptor(t, n, i);
      r !== void 0 && je(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, n) {
    const { get: r, set: o } = We(this.prototype, t) ?? { get() {
      return this[i];
    }, set(s) {
      this[i] = s;
    } };
    return { get: r, set(s) {
      const a = r == null ? void 0 : r.call(this);
      o == null || o.call(this, s), this.requestUpdate(t, a, n);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? oe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ft("elementProperties"))) return;
    const t = Ge(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ft("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ft("properties"))) {
      const i = this.properties, n = [...Ke(i), ...Ye(i)];
      for (const r of n) this.createProperty(r, i[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [n, r] of i) this.elementProperties.set(n, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, n] of this.elementProperties) {
      const r = this._$Eu(i, n);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const n = new Set(t.flat(1 / 0).reverse());
      for (const r of n) i.unshift(ne(r));
    } else t !== void 0 && i.push(ne(t));
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
    return Fe(t, this.constructor.elementStyles), t;
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
    var o;
    const n = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, n);
    if (r !== void 0 && n.reflect === !0) {
      const s = (((o = n.converter) == null ? void 0 : o.toAttribute) !== void 0 ? n.converter : Et).toAttribute(i, n.type);
      this._$Em = t, s == null ? this.removeAttribute(r) : this.setAttribute(r, s), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var o, s;
    const n = this.constructor, r = n._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const a = n.getPropertyOptions(r), l = typeof a.converter == "function" ? { fromAttribute: a.converter } : ((o = a.converter) == null ? void 0 : o.fromAttribute) !== void 0 ? a.converter : Et;
      this._$Em = r;
      const d = l.fromAttribute(i, a.type);
      this[r] = d ?? ((s = this._$Ej) == null ? void 0 : s.get(r)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, i, n, r = !1, o) {
    var s;
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (o = this[t]), n ?? (n = a.getPropertyOptions(t)), !((n.hasChanged ?? Kt)(o, i) || n.useDefault && n.reflect && o === ((s = this._$Ej) == null ? void 0 : s.get(t)) && !this.hasAttribute(a._$Eu(t, n)))) return;
      this.C(t, i, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: n, reflect: r, wrapped: o }, s) {
    n && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, s ?? i ?? this[t]), o !== !0 || s !== void 0) || (this._$AL.has(t) || (this.hasUpdated || n || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
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
        for (const [o, s] of this._$Ep) this[o] = s;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [o, s] of r) {
        const { wrapped: a } = s, l = this[o];
        a !== !0 || this._$AL.has(o) || l === void 0 || this.C(o, void 0, s, l);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (n = this._$EO) == null || n.forEach((r) => {
        var o;
        return (o = r.hostUpdate) == null ? void 0 : o.call(r);
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
    (i = this._$EO) == null || i.forEach((n) => {
      var r;
      return (r = n.hostUpdated) == null ? void 0 : r.call(n);
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
ct.elementStyles = [], ct.shadowRootOptions = { mode: "open" }, ct[ft("elementProperties")] = /* @__PURE__ */ new Map(), ct[ft("finalized")] = /* @__PURE__ */ new Map(), Nt == null || Nt({ ReactiveElement: ct }), (j.reactiveElementVersions ?? (j.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const mt = globalThis, se = (e) => e, Dt = mt.trustedTypes, ae = Dt ? Dt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Ee = "$lit$", F = `lit$${Math.random().toFixed(9).slice(2)}$`, De = "?" + F, Ze = `<${De}>`, nt = document, _t = () => nt.createComment(""), yt = (e) => e === null || typeof e != "object" && typeof e != "function", Yt = Array.isArray, Qe = (e) => Yt(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", Ot = `[ 	
\f\r]`, gt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, le = /-->/g, ce = />/g, tt = RegExp(`>|${Ot}(?:([^\\s"'>=/]+)(${Ot}*=${Ot}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), de = /'/g, ue = /"/g, Pe = /^(?:script|style|textarea|title)$/i, Me = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), c = Me(1), L = Me(2), dt = Symbol.for("lit-noChange"), C = Symbol.for("lit-nothing"), pe = /* @__PURE__ */ new WeakMap(), et = nt.createTreeWalker(nt, 129);
function Te(e, t) {
  if (!Yt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ae !== void 0 ? ae.createHTML(t) : t;
}
const Je = (e, t) => {
  const i = e.length - 1, n = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", s = gt;
  for (let a = 0; a < i; a++) {
    const l = e[a];
    let d, b, h = -1, g = 0;
    for (; g < l.length && (s.lastIndex = g, b = s.exec(l), b !== null); ) g = s.lastIndex, s === gt ? b[1] === "!--" ? s = le : b[1] !== void 0 ? s = ce : b[2] !== void 0 ? (Pe.test(b[2]) && (r = RegExp("</" + b[2], "g")), s = tt) : b[3] !== void 0 && (s = tt) : s === tt ? b[0] === ">" ? (s = r ?? gt, h = -1) : b[1] === void 0 ? h = -2 : (h = s.lastIndex - b[2].length, d = b[1], s = b[3] === void 0 ? tt : b[3] === '"' ? ue : de) : s === ue || s === de ? s = tt : s === le || s === ce ? s = gt : (s = tt, r = void 0);
    const m = s === tt && e[a + 1].startsWith("/>") ? " " : "";
    o += s === gt ? l + Ze : h >= 0 ? (n.push(d), l.slice(0, h) + Ee + l.slice(h) + F + m) : l + F + (h === -2 ? a : m);
  }
  return [Te(e, o + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), n];
};
class vt {
  constructor({ strings: t, _$litType$: i }, n) {
    let r;
    this.parts = [];
    let o = 0, s = 0;
    const a = t.length - 1, l = this.parts, [d, b] = Je(t, i);
    if (this.el = vt.createElement(d, n), et.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = et.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(Ee)) {
          const g = b[s++], m = r.getAttribute(h).split(F), f = /([.?@])?(.*)/.exec(g);
          l.push({ type: 1, index: o, name: f[2], strings: m, ctor: f[1] === "." ? ei : f[1] === "?" ? ii : f[1] === "@" ? ni : Mt }), r.removeAttribute(h);
        } else h.startsWith(F) && (l.push({ type: 6, index: o }), r.removeAttribute(h));
        if (Pe.test(r.tagName)) {
          const h = r.textContent.split(F), g = h.length - 1;
          if (g > 0) {
            r.textContent = Dt ? Dt.emptyScript : "";
            for (let m = 0; m < g; m++) r.append(h[m], _t()), et.nextNode(), l.push({ type: 2, index: ++o });
            r.append(h[g], _t());
          }
        }
      } else if (r.nodeType === 8) if (r.data === De) l.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(F, h + 1)) !== -1; ) l.push({ type: 7, index: o }), h += F.length - 1;
      }
      o++;
    }
  }
  static createElement(t, i) {
    const n = nt.createElement("template");
    return n.innerHTML = t, n;
  }
}
function ut(e, t, i = e, n) {
  var s, a;
  if (t === dt) return t;
  let r = n !== void 0 ? (s = i._$Co) == null ? void 0 : s[n] : i._$Cl;
  const o = yt(t) ? void 0 : t._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== o && ((a = r == null ? void 0 : r._$AO) == null || a.call(r, !1), o === void 0 ? r = void 0 : (r = new o(e), r._$AT(e, i, n)), n !== void 0 ? (i._$Co ?? (i._$Co = []))[n] = r : i._$Cl = r), r !== void 0 && (t = ut(e, r._$AS(e, t.values), r, n)), t;
}
class ti {
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
    const { el: { content: i }, parts: n } = this._$AD, r = ((t == null ? void 0 : t.creationScope) ?? nt).importNode(i, !0);
    et.currentNode = r;
    let o = et.nextNode(), s = 0, a = 0, l = n[0];
    for (; l !== void 0; ) {
      if (s === l.index) {
        let d;
        l.type === 2 ? d = new xt(o, o.nextSibling, this, t) : l.type === 1 ? d = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (d = new ri(o, this, t)), this._$AV.push(d), l = n[++a];
      }
      s !== (l == null ? void 0 : l.index) && (o = et.nextNode(), s++);
    }
    return et.currentNode = nt, r;
  }
  p(t) {
    let i = 0;
    for (const n of this._$AV) n !== void 0 && (n.strings !== void 0 ? (n._$AI(t, n, i), i += n.strings.length - 2) : n._$AI(t[i])), i++;
  }
}
class xt {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, n, r) {
    this.type = 2, this._$AH = C, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = n, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
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
    t = ut(this, t, i), yt(t) ? t === C || t == null || t === "" ? (this._$AH !== C && this._$AR(), this._$AH = C) : t !== this._$AH && t !== dt && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Qe(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== C && yt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(nt.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var o;
    const { values: i, _$litType$: n } = t, r = typeof n == "number" ? this._$AC(t) : (n.el === void 0 && (n.el = vt.createElement(Te(n.h, n.h[0]), this.options)), n);
    if (((o = this._$AH) == null ? void 0 : o._$AD) === r) this._$AH.p(i);
    else {
      const s = new ti(r, this), a = s.u(this.options);
      s.p(i), this.T(a), this._$AH = s;
    }
  }
  _$AC(t) {
    let i = pe.get(t.strings);
    return i === void 0 && pe.set(t.strings, i = new vt(t)), i;
  }
  k(t) {
    Yt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let n, r = 0;
    for (const o of t) r === i.length ? i.push(n = new xt(this.O(_t()), this.O(_t()), this, this.options)) : n = i[r], n._$AI(o), r++;
    r < i.length && (this._$AR(n && n._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, i); t !== this._$AB; ) {
      const r = se(t).nextSibling;
      se(t).remove(), t = r;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class Mt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, n, r, o) {
    this.type = 1, this._$AH = C, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = o, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(new String()), this.strings = n) : this._$AH = C;
  }
  _$AI(t, i = this, n, r) {
    const o = this.strings;
    let s = !1;
    if (o === void 0) t = ut(this, t, i, 0), s = !yt(t) || t !== this._$AH && t !== dt, s && (this._$AH = t);
    else {
      const a = t;
      let l, d;
      for (t = o[0], l = 0; l < o.length - 1; l++) d = ut(this, a[n + l], i, l), d === dt && (d = this._$AH[l]), s || (s = !yt(d) || d !== this._$AH[l]), d === C ? t = C : t !== C && (t += (d ?? "") + o[l + 1]), this._$AH[l] = d;
    }
    s && !r && this.j(t);
  }
  j(t) {
    t === C ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ei extends Mt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === C ? void 0 : t;
  }
}
class ii extends Mt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== C);
  }
}
class ni extends Mt {
  constructor(t, i, n, r, o) {
    super(t, i, n, r, o), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = ut(this, t, i, 0) ?? C) === dt) return;
    const n = this._$AH, r = t === C && n !== C || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive, o = t !== C && (n === C || r);
    r && this.element.removeEventListener(this.name, this, n), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ri {
  constructor(t, i, n) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = n;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    ut(this, t);
  }
}
const Rt = mt.litHtmlPolyfillSupport;
Rt == null || Rt(vt, xt), (mt.litHtmlVersions ?? (mt.litHtmlVersions = [])).push("3.3.3");
const oi = (e, t, i) => {
  const n = (i == null ? void 0 : i.renderBefore) ?? t;
  let r = n._$litPart$;
  if (r === void 0) {
    const o = (i == null ? void 0 : i.renderBefore) ?? null;
    n._$litPart$ = r = new xt(t.insertBefore(_t(), o), o, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const it = globalThis;
class N extends ct {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = oi(i, this.renderRoot, this.renderOptions);
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
    return dt;
  }
}
var Ce;
N._$litElement$ = !0, N.finalized = !0, (Ce = it.litElementHydrateSupport) == null || Ce.call(it, { LitElement: N });
const Lt = it.litElementPolyfillSupport;
Lt == null || Lt({ LitElement: N });
(it.litElementVersions ?? (it.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const si = { attribute: !0, type: String, converter: Et, reflect: !1, hasChanged: Kt }, ai = (e = si, t, i) => {
  const { kind: n, metadata: r } = i;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), n === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(i.name, e), n === "accessor") {
    const { name: s } = i;
    return { set(a) {
      const l = t.get.call(this);
      t.set.call(this, a), this.requestUpdate(s, l, e, !0, a);
    }, init(a) {
      return a !== void 0 && this.C(s, void 0, e, a), a;
    } };
  }
  if (n === "setter") {
    const { name: s } = i;
    return function(a) {
      const l = this[s];
      t.call(this, a), this.requestUpdate(s, l, e, !0, a);
    };
  }
  throw Error("Unsupported decorator location: " + n);
};
function M(e) {
  return (t, i) => typeof i == "object" ? ai(e, t, i) : ((n, r, o) => {
    const s = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, n), s ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function k(e) {
  return M({ ...e, state: !0, attribute: !1 });
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const li = (e, t, i) => (i.configurable = !0, i.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, i), i);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ne(e, t) {
  return (i, n, r) => {
    const o = (s) => {
      var a;
      return ((a = s.renderRoot) == null ? void 0 : a.querySelector(e)) ?? null;
    };
    return li(i, n, { get() {
      return o(this);
    } });
  };
}
function A(e, t, i = "sensor") {
  return `${i}.babytracker_${e}_${t}`;
}
function Gt(e) {
  return typeof e != "string" || e.length === 0 ? "" : e.charAt(0).toUpperCase() + e.slice(1);
}
async function ci(e, t, i, n) {
  return e.callService(t, i, n);
}
function kt(e, t, i, n) {
  const r = { cancelled: !1 }, o = async (s) => {
    if (!r.cancelled)
      try {
        const a = await e.connection.subscribeMessage(
          i,
          t
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
        if (console.warn(`babytracker: ${n} failed (attempt ${s + 1})`, a), r.cancelled) return;
        const l = Math.min(3e4, 1e3 * 2 ** s);
        r.timer = setTimeout(() => {
          r.timer = void 0, o(s + 1);
        }, l);
      }
  };
  return o(0), () => {
    var s;
    r.cancelled = !0, r.timer != null && (clearTimeout(r.timer), r.timer = void 0), (s = r.unsub) == null || s.call(r);
  };
}
function di(e, t, i) {
  return kt(
    e,
    { type: "babytracker/get_baby_config", baby: t, subscribe: !0 },
    i,
    "subscribeBabyConfig"
  );
}
function Oe(e, t) {
  return kt(
    e,
    { type: "babytracker/get_integration_options", subscribe: !0 },
    t,
    "subscribeIntegrationOptions"
  );
}
function ui(e, t, i, n, r) {
  return kt(
    e,
    {
      type: "babytracker/list_entries_in_range",
      baby: t,
      start: i,
      end: n,
      subscribe: !0
    },
    r,
    "subscribeEntriesInRange"
  );
}
function pi(e, t, i) {
  return kt(
    e,
    { type: "babytracker/list_vaccines", baby: t, subscribe: !0 },
    i,
    "subscribeVaccines"
  );
}
function hi(e, t, i) {
  return kt(
    e,
    { type: "babytracker/list_growth", baby: t, subscribe: !0 },
    i,
    "subscribeGrowth"
  );
}
function bi(e, t, i, n) {
  if (!e)
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
  const r = e.enabled_activities ?? [], o = e.enabled_feeding_methods ?? [], s = (d) => d.charAt(0).toUpperCase() + d.slice(1), a = Gt(e.name ?? t), l = [];
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
    for (const d of o)
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
                            ${s(d.replace("_", " "))}
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
function gi(e, t, i) {
  var l, d, b, h, g, m;
  const n = ((l = e.states[A(t, "sleeping", "binary_sensor")]) == null ? void 0 : l.state) === "on", r = ((d = e.states[A(t, "feeding", "binary_sensor")]) == null ? void 0 : d.state) === "on", o = ((b = e.states[A(t, "tummy_time", "binary_sensor")]) == null ? void 0 : b.state) === "on", s = ((h = e.states[A(t, "walking", "binary_sensor")]) == null ? void 0 : h.state) === "on";
  if (!n && !r && !o && !s) return "";
  const a = [];
  if (n) {
    const f = (g = e.states[A(t, "last_sleep_start")]) == null ? void 0 : g.state;
    a.push(
      c`
                <div class="chip warning" role="status">
                    Sleeping ${f ? c`· started ${he(f)}` : ""}
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
  if (r && a.push(
    c`
                <div class="chip warning" role="status">
                    Feeding
                    <button
                        aria-label="End feeding"
                        @click=${(f) => i("end_feeding", { baby: t }, f.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), o && a.push(
    c`
                <div class="chip warning" role="status">
                    Tummy time
                    <button
                        aria-label="End tummy time"
                        @click=${(f) => i("end_tummy_time", { baby: t }, f.currentTarget)}
                    >
                        End
                    </button>
                </div>
            `
  ), s) {
    const f = (m = e.states[A(t, "last_walk_start")]) == null ? void 0 : m.state;
    a.push(
      c`
                <div class="chip warning" role="status">
                    Walking ${f ? c`· started ${he(f)}` : ""}
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
  return c`<div class="section">${a}</div>`;
}
function he(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
const Pt = 29.5735, Re = 24 * 60 * 60 * 1e3;
function W(e) {
  if (!e) return 0;
  const t = Date.parse(e);
  return Number.isNaN(t) ? 0 : t;
}
function fi(e, t = Re, i = Date.now()) {
  const n = i - t;
  return e.filter((r) => W(r.timestamp) >= n).slice().sort((r, o) => W(o.timestamp) - W(r.timestamp));
}
function mi(e, t = Date.now(), i = Re) {
  var d, b, h;
  const n = t - i;
  let r = 0, o = 0, s = 0, a = 0, l = 0;
  for (const g of e) {
    const m = W(g.timestamp);
    if (g.type === "sleep") {
      const f = m, y = g.ended_at != null && g.ended_at !== "" ? W(g.ended_at) : t;
      if (f > 0 && y > f && y > n) {
        const p = Math.max(f, n), $ = Math.min(y, t);
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
        f === "wet" ? o += 1 : f === "dirty" ? s += 1 : f === "both" && (o += 1, s += 1);
      }
    }
  }
  return { feedings: r, wetDiapers: o, dirtyDiapers: s, totalVolumeMl: a, sleepMinutes: l };
}
function St(e, t, i) {
  if (e <= 0) return 0;
  const n = t != null && t !== "" ? W(t) : i;
  return n <= e ? 0 : (n - e) / 6e4;
}
function _i(e, t = Date.now()) {
  const i = {
    diapers: 0,
    wet: 0,
    dirty: 0,
    mixed: 0,
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
  for (const n of e) {
    const r = W(n.timestamp), o = n.data ?? {};
    switch (n.type) {
      case "diaper": {
        const s = String(o.kind ?? "");
        s === "wet" ? (i.diapers += 1, i.wet += 1) : s === "dirty" ? (i.diapers += 1, i.dirty += 1) : s === "both" && (i.diapers += 1, i.mixed += 1);
        break;
      }
      case "sleep": {
        const s = St(r, n.ended_at, t);
        i.sleepMinutes += s, s > i.longestSleepMinutes && (i.longestSleepMinutes = s);
        break;
      }
      case "feeding": {
        const s = String(o.method ?? "");
        if (s === "bottle") {
          i.bottleFeeds += 1;
          const a = Number(o.amount ?? 0), l = String(o.unit ?? "");
          a > 0 && (i.bottleVolumeMl += l === "oz" ? a * Pt : a);
        } else if (s === "breast_left" || s === "breast_right") {
          const a = St(r, n.ended_at, t);
          i.nursingMinutes += a, s === "breast_left" ? i.nursingLeftMinutes += a : i.nursingRightMinutes += a;
        } else s === "solids" && (i.solidsCount += 1);
        break;
      }
      case "pumping": {
        const s = Number(o.volume ?? 0), a = String(o.unit ?? "");
        s > 0 && (i.pumpingMl += a === "oz" ? s * Pt : s);
        break;
      }
      case "tummy_time": {
        i.tummyMinutes += St(r, n.ended_at, t);
        break;
      }
      case "walk": {
        i.walkCount += 1, i.walkMinutes += St(r, n.ended_at, t);
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
function yi(e, t = Date.now()) {
  let i = null;
  for (const n of e) {
    if ((n == null ? void 0 : n.type) !== "sleep" || !(n != null && n.ended_at)) continue;
    const r = Date.parse(n.ended_at);
    Number.isFinite(r) && (i === null || r > i) && (i = r);
  }
  return i === null ? null : Math.max(0, (t - i) / 6e4);
}
function R(e) {
  if (!Number.isFinite(e) || e <= 0) return "0m";
  if (e < 60) return `${Math.round(e)}m`;
  const t = Math.floor(e / 60), i = Math.round(e % 60);
  return i === 0 ? `${t}h` : `${t}h ${i}m`;
}
function qt(e) {
  if (!Number.isFinite(e) || e <= 0) return "0 oz";
  const t = e / Pt;
  return t >= 1 ? `${t.toFixed(1)} oz` : `${Math.round(e)} ml`;
}
function vi(e) {
  const t = String((e == null ? void 0 : e.type) ?? ""), i = (e == null ? void 0 : e.data) ?? {};
  if (t === "other") {
    const s = String(i.name ?? "").trim();
    return be(s || Ht(t));
  }
  const n = i.method ?? i.kind, r = n != null && n !== "" ? Ht(String(n)) : null, o = be(Ht(t));
  return r ? t === "feeding" && i.amount != null && i.amount !== "" && i.unit ? `${o} (${r}, ${i.amount} ${i.unit})` : `${o} (${r})` : o;
}
function Ht(e) {
  return e.replace(/_/g, " ");
}
function be(e) {
  return e && e.charAt(0).toUpperCase() + e.slice(1);
}
function ge(e) {
  const t = W(e);
  return t === 0 ? "" : new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}
var $i = Object.defineProperty, wi = Object.getOwnPropertyDescriptor, ot = (e, t, i, n) => {
  for (var r = n > 1 ? void 0 : n ? wi(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (r = (n ? s(t, i, r) : s(r)) || r);
  return n && r && $i(t, i, r), r;
};
let z = class extends N {
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
      const n = i == null ? void 0 : i.url;
      typeof n == "string" && n.length > 0 ? (this._url = n, this._failed = !1) : (console.warn(
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
    if (!this.photoPath) return c``;
    if (this._failed || !this._url)
      return c`<span aria-label="Has photo">📷</span>`;
    const e = `${this.size}px`;
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
                    style="width:${e};height:${e}"
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
                              @click=${(t) => t.stopPropagation()}
                          />
                      </div>
                  ` : ""}
        `;
  }
};
z.styles = B`
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
ot([
  M({ attribute: !1 })
], z.prototype, "hass", 2);
ot([
  M()
], z.prototype, "photoPath", 2);
ot([
  M({ type: Number })
], z.prototype, "size", 2);
ot([
  k()
], z.prototype, "_url", 2);
ot([
  k()
], z.prototype, "_failed", 2);
ot([
  k()
], z.prototype, "_open", 2);
z = ot([
  G("bt-entry-thumbnail")
], z);
const xi = /* @__PURE__ */ new Set(["sleep", "feeding", "tummy_time", "walk"]);
function Le(e, t, i, n, r) {
  return c`
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
                <span aria-label="Entry type">${vi(t)}</span>
                ${ki(t)}
                ${t.staff ? c`<span
                          class="muted"
                          aria-label="Logged by Procare staff"
                          >via ${t.staff}</span
                      >` : ""}
            </div>
            ${t.notes ? c`<div
                      class="entry-notes muted ${n.has(t.id) ? "expanded" : ""}"
                      role="button"
                      tabindex="0"
                      aria-label="Toggle notes"
                      aria-expanded=${n.has(t.id) ? "true" : "false"}
                      title=${t.notes}
                      @click=${(o) => {
    o.stopPropagation(), r(t.id);
  }}
                      @keydown=${(o) => {
    (o.key === "Enter" || o.key === " ") && (o.preventDefault(), o.stopPropagation(), r(t.id));
  }}
                  >${t.notes}</div>` : ""}
            ${t.photo_path ? c`<div class="entry-photo">
                      <bt-entry-thumbnail
                          .hass=${e}
                          .photoPath=${t.photo_path}
                      ></bt-entry-thumbnail>
                  </div>` : ""}
        </li>
    `;
}
function ki(e) {
  const t = ge(e.timestamp);
  return xi.has(String(e.type ?? "")) && e.ended_at && e.ended_at !== e.timestamp ? c`<span class="muted"
            >${t} – ${ge(e.ended_at)}</span
        >` : c`<span class="muted">${t}</span>`;
}
function Si(e, t, i, n, r = /* @__PURE__ */ new Set(), o = () => {
}) {
  var d;
  const s = e.states[A(t, "recent_entries")], a = ((d = s == null ? void 0 : s.attributes) == null ? void 0 : d.entries) ?? [], l = fi(a).slice(0, Math.min(n, 120));
  return c`
        <div class="section" role="region" aria-label="Last 24 hours">
            <h2>Last 24 hours</h2>
            ${l.length === 0 ? c`<p>Nothing logged yet.</p>` : c`
                      <ul class="entries">
                          ${l.map(
    (b) => Le(
      e,
      b,
      i,
      r,
      o
    )
  )}
                      </ul>
                  `}
        </div>
    `;
}
var Ci = Object.defineProperty, Ai = Object.getOwnPropertyDescriptor, Tt = (e, t, i, n) => {
  for (var r = n > 1 ? void 0 : n ? Ai(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (r = (n ? s(t, i, r) : s(r)) || r);
  return n && r && Ci(t, i, r), r;
};
let pt = class extends N {
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
    return c`
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
pt.styles = B`
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
const fe = [
  { key: "weight", label: "Weight", color: "var(--primary-color, #2563eb)" },
  { key: "height", label: "Height", color: "var(--success-color, #16a34a)" },
  { key: "head", label: "Head", color: "var(--warning-color, #ea580c)" }
];
function Ei(e, t) {
  const i = (e == null ? void 0 : e.data) ?? {}, n = t === "weight" ? i.weight_percentile : t === "height" ? i.height_percentile : i.head_percentile;
  if (n == null) return null;
  const r = Number(n);
  return Number.isFinite(r) ? r : null;
}
function zt(e) {
  if (e == null) return "—";
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? String(Math.round(t * 100) / 100) : String(e);
}
function It(e) {
  if (e == null || e === "—") return "—";
  const t = typeof e == "number" ? e : Number(e);
  return Number.isFinite(t) ? `p${Math.round(t)}` : String(e);
}
function Di(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function He(e, t, i, n, r, o, s, a) {
  var v, E, D, S, P, V;
  const l = (o == null ? void 0 : o.data) ?? {}, d = (n == null ? void 0 : n.weight) ?? (i == null ? void 0 : i.weight_unit) ?? "kg", b = (n == null ? void 0 : n.length) ?? (i == null ? void 0 : i.length_unit) ?? "cm", h = l.weight_unit ?? d, g = l.length_unit ?? b, m = l.weight ?? ((v = e.states[A(t, "weight")]) == null ? void 0 : v.state), f = l.height ?? ((E = e.states[A(t, "height")]) == null ? void 0 : E.state), y = l.head_circumference ?? ((D = e.states[A(t, "head_circumference")]) == null ? void 0 : D.state), p = l.weight_percentile ?? ((S = e.states[A(t, "weight_percentile")]) == null ? void 0 : S.state), $ = l.height_percentile ?? ((P = e.states[A(t, "height_percentile")]) == null ? void 0 : P.state), w = l.head_percentile ?? ((V = e.states[A(t, "head_circumference_percentile")]) == null ? void 0 : V.state), x = Di(o == null ? void 0 : o.timestamp), _ = !!(o && s), u = _ ? () => s(o) : void 0;
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
            ${Pi(a)}
        </div>
    `;
}
function Pi(e) {
  return me(e) === "" ? "" : c`
        <bt-chart-lightbox
            label="Percentile over time"
            .renderChart=${() => me(e)}
        ></bt-chart-lightbox>
    `;
}
function me(e) {
  if (!Array.isArray(e) || e.length < 2) return "";
  const t = [...e].filter((_) => Number.isFinite(Date.parse(_ == null ? void 0 : _.timestamp))).sort((_, u) => Date.parse(_.timestamp) - Date.parse(u.timestamp));
  if (t.length < 2) return "";
  const i = Date.parse(t[0].timestamp), n = Date.parse(t[t.length - 1].timestamp), r = Math.max(1, n - i), o = 320, s = 140, a = 22, l = 8, d = 8, b = 20, h = o - a - l, g = s - d - b, m = (_) => a + (_ - i) / r * h, f = (_) => d + (1 - _ / 100) * g, y = fe.map((_) => ({
    ..._,
    points: t.map((u) => {
      const v = Ei(u, _.key);
      return v === null ? null : { ts: Date.parse(u.timestamp), p: v };
    }).filter((u) => u !== null)
  }));
  if (y.reduce(
    (_, u) => _ + u.points.length,
    0
  ) < 2) return "";
  const $ = Ut(t[0].timestamp), w = Ut(t[t.length - 1].timestamp), x = [10, 50, 90];
  return c`
        <div class="growth-trend">
            <div class="label-row">
                <div class="label">Percentile over time</div>
                <div class="legend">
                    ${fe.map(
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
                viewBox="0 0 ${o} ${s}"
                role="img"
                aria-label="Percentile over time"
                style="width:100%;height:${s}px;"
            >
                ${x.map(
    (_) => L`
                        <line
                            x1=${a}
                            x2=${o - l}
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
    if (_.points.length === 0) return L``;
    const u = _.points.map(
      (v, E) => `${E === 0 ? "M" : "L"}${m(v.ts).toFixed(1)},${f(v.p).toFixed(1)}`
    ).join(" ");
    return L`
                        ${_.points.length > 1 ? L`<path
                                d=${u}
                                fill="none"
                                stroke=${_.color}
                                stroke-width="1.6"
                                stroke-linejoin="round"
                                stroke-linecap="round"
                              ></path>` : ""}
                        ${_.points.map(
      (v) => L`
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
function Ut(e) {
  if (!e) return "";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "" : new Date(t).toLocaleDateString([], {
    month: "short",
    day: "numeric"
  });
}
function ze(e, t) {
  return c`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${async () => {
    var l;
    const n = /* @__PURE__ */ new Date(), r = new Date(n.getTime() - 90 * 864e5), o = (d) => d.toISOString().slice(0, 10), s = await e.callService(
      "babytracker",
      "export_report",
      { baby: t, format: "html", start: o(r), end: o(n) },
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
function Mi(e, t, i) {
  var n;
  return (n = e == null ? void 0 : e.importer) != null && n.source_entity_id ? c`
        <div class="section">
            <button
                aria-label="Resync importers"
                title="Re-read the source sensor's current activities. Already-imported activities are skipped."
                @click=${(r) => i("resync_importers", { baby: t }, r.currentTarget)}
            >
                Sync importers
            </button>
        </div>
    ` : "";
}
function Ti(e, t, i) {
  var s, a;
  const n = (s = e.states) == null ? void 0 : s[A(t, "recent_entries")], r = ((a = n == null ? void 0 : n.attributes) == null ? void 0 : a.entries) ?? [], o = mi(r);
  return c`
        <div class="chip" role="listitem">
            ${qt(o.totalVolumeMl)} consumed
        </div>
        <div class="chip" role="listitem">
            ${o.wetDiapers} wet and ${o.dirtyDiapers} dirty
        </div>
        <div class="chip" role="listitem">
            ${R(o.sleepMinutes)} sleep
        </div>
    `;
}
function _e() {
  const e = window;
  return !!(e.SpeechRecognition || e.webkitSpeechRecognition);
}
function Ni(e) {
  var t;
  return !!(e != null && e.connection && typeof navigator < "u" && ((t = navigator.mediaDevices) != null && t.getUserMedia) && window.AudioWorkletNode);
}
async function Oi() {
  const e = window, t = e.SpeechRecognition || e.webkitSpeechRecognition;
  if (!t) throw new Error("SpeechRecognition not supported");
  const i = new t();
  i.continuous = !1, i.interimResults = !1, i.lang = navigator.language || "en-US";
  let n = () => {
  }, r = () => {
  };
  const o = new Promise((a, l) => {
    n = a, r = l;
  });
  let s = !1;
  return i.onresult = (a) => {
    if (s) return;
    s = !0;
    const l = Array.from(a.results).map((d) => {
      var b;
      return ((b = d[0]) == null ? void 0 : b.transcript) ?? "";
    }).join(" ").trim();
    n({ text: l });
  }, i.onerror = (a) => {
    s || (s = !0, r(new Error((a == null ? void 0 : a.error) ?? "speech-recognition error")));
  }, i.onend = () => {
    s || (s = !0, n({ text: "" }));
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
const Ri = `
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
async function Li(e) {
  const t = await navigator.mediaDevices.getUserMedia({ audio: !0 }), i = window.AudioContext || window.webkitAudioContext, n = new i({ sampleRate: 16e3 }), r = URL.createObjectURL(
    new Blob([Ri], { type: "text/javascript" })
  );
  try {
    await n.audioWorklet.addModule(r);
  } finally {
    URL.revokeObjectURL(r);
  }
  const o = n.createMediaStreamSource(t), s = new AudioWorkletNode(n, "bt-pcm-worklet");
  o.connect(s);
  let a, l, d = () => {
  }, b = () => {
  };
  const h = new Promise((p, $) => {
    d = p, b = $;
  });
  let g = !1;
  const m = () => {
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
    l = await e.connection.subscribeMessage(
      (p) => {
        var w, x, _, u, v;
        const $ = p == null ? void 0 : p.type;
        if ($ === "run-start")
          a = (x = (w = p == null ? void 0 : p.data) == null ? void 0 : w.runner_data) == null ? void 0 : x.stt_binary_handler_id, s.port.onmessage = (E) => {
            var P;
            if (a == null || g) return;
            const D = new Uint8Array(E.data), S = new Uint8Array(D.length + 1);
            S[0] = a, S.set(D, 1);
            try {
              (P = e.connection.socket) == null || P.send(S);
            } catch {
            }
          };
        else if ($ === "stt-end") {
          const E = ((u = (_ = p == null ? void 0 : p.data) == null ? void 0 : _.stt_output) == null ? void 0 : u.text) ?? "";
          f(E);
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
      g || (g = !0, m(), d({ text: "" }));
    }
  };
}
var Hi = Object.defineProperty, zi = Object.getOwnPropertyDescriptor, Xt = (e, t, i, n) => {
  for (var r = n > 1 ? void 0 : n ? zi(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (r = (n ? s(t, i, r) : s(r)) || r);
  return n && r && Hi(t, i, r), r;
};
let $t = class extends N {
  constructor() {
    super(...arguments), this._state = "idle", this._onClick = async (e) => {
      e.preventDefault(), e.stopPropagation(), this._state === "idle" ? await this._start() : this._state === "listening" && await this._stop();
    };
  }
  get _supported() {
    return _e() || Ni(this.hass);
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
    const n = i.value.trim();
    i.value = n ? `${n} ${t}` : t, i.dispatchEvent(new Event("input", { bubbles: !0 }));
  }
  async _start() {
    this._state = "listening";
    try {
      this._controller = _e() ? await Oi() : await Li(this.hass);
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
    if (!this._supported) return c``;
    const e = {
      idle: "Voice input",
      listening: "Stop recording",
      transcribing: "Transcribing"
    }, t = {
      idle: "🎤",
      listening: "■",
      transcribing: "…"
    };
    return c`
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
$t.styles = B`
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
Xt([
  M({ attribute: !1 })
], $t.prototype, "hass", 2);
Xt([
  k()
], $t.prototype, "_state", 2);
$t = Xt([
  G("bt-mic-button")
], $t);
const Ii = 5 * 1024 * 1024, Ui = /* @__PURE__ */ new Set([
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
function Bi(e) {
  return new Promise((t, i) => {
    const n = new FileReader();
    n.onload = () => {
      const r = n.result;
      if (typeof r != "string") {
        i(new q("read_failed", "FileReader returned non-string"));
        return;
      }
      const o = r.indexOf(",");
      t(o >= 0 ? r.slice(o + 1) : r);
    }, n.onerror = () => i(new q("read_failed", "FileReader failed")), n.readAsDataURL(e);
  });
}
async function Vi(e, t) {
  if (t.size > Ii)
    throw new q(
      "too_large",
      `Photo is ${Math.round(t.size / (1024 * 1024))} MB; max is 5 MB`
    );
  const i = (t.type || "").toLowerCase();
  if (!Ui.has(i))
    throw new q(
      "unsupported_mime",
      `Unsupported photo type: ${t.type || "unknown"}`
    );
  const n = await Bi(t);
  try {
    const r = await e.connection.sendMessagePromise({
      type: "babytracker/upload_photo",
      data: n,
      mime: i
    }), o = r == null ? void 0 : r.photo_path;
    if (typeof o != "string" || !o)
      throw new q("bad_response", "upload returned no photo_path");
    return { photo_path: o };
  } catch (r) {
    if (r instanceof q) throw r;
    const o = (r == null ? void 0 : r.code) ?? "upload_failed", s = (r == null ? void 0 : r.message) ?? "upload failed";
    throw new q(o, s);
  }
}
var Fi = Object.defineProperty, qi = Object.getOwnPropertyDescriptor, ht = (e, t, i, n) => {
  for (var r = n > 1 ? void 0 : n ? qi(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (r = (n ? s(t, i, r) : s(r)) || r);
  return n && r && Fi(t, i, r), r;
};
let K = class extends N {
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
    var n;
    const t = e.currentTarget, i = (n = t.files) == null ? void 0 : n[0];
    if (t.value = "", !!i) {
      this._busy = !0, this._error = "";
      try {
        const { photo_path: r } = await Vi(this.hass, i);
        this._setValue(r);
      } catch (r) {
        const o = r instanceof q ? r.message : "Photo upload failed";
        this._error = o, console.warn("babytracker: photo upload failed", r);
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
K.styles = B`
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
], K.prototype, "hass", 2);
ht([
  M()
], K.prototype, "value", 2);
ht([
  k()
], K.prototype, "_busy", 2);
ht([
  k()
], K.prototype, "_error", 2);
ht([
  Ne("input[type=file]")
], K.prototype, "_fileInput", 2);
K = ht([
  G("bt-photo-button")
], K);
const ji = /* @__PURE__ */ new Set([
  "sleep",
  "feeding",
  "tummy_time",
  "walk"
]);
function X(e, t = {}) {
  return c`
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
function Z(e, t) {
  return c`
        <label>Photo</label>
        <bt-photo-button
            .hass=${e}
            .value=${t ?? ""}
        ></bt-photo-button>
    `;
}
function Q(e) {
  const t = e.querySelector("bt-photo-button"), i = t == null ? void 0 : t.value;
  return typeof i == "string" && i.length > 0 ? i : void 0;
}
const T = (e) => String(e).padStart(2, "0");
function bt() {
  const e = /* @__PURE__ */ new Date();
  return `${e.getFullYear()}-${T(e.getMonth() + 1)}-${T(e.getDate())}T${T(e.getHours())}:${T(e.getMinutes())}`;
}
function Y(e) {
  if (!e) return;
  const t = Date.parse(e);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
function Bt(e) {
  if (!e) return "";
  const t = Date.parse(e);
  if (Number.isNaN(t)) return "";
  const i = new Date(t);
  return `${i.getFullYear()}-${T(i.getMonth() + 1)}-${T(i.getDate())}T${T(i.getHours())}:${T(i.getMinutes())}`;
}
function Zt() {
  const e = /* @__PURE__ */ new Date();
  return `${e.getFullYear()}-${T(e.getMonth() + 1)}-${T(e.getDate())}`;
}
function Wi(e) {
  if (!e) return "";
  const t = Date.parse(e);
  if (Number.isNaN(t)) return "";
  const i = new Date(t);
  return `${i.getFullYear()}-${T(i.getMonth() + 1)}-${T(i.getDate())}`;
}
function Qt(e) {
  if (!e) return;
  const t = Date.parse(`${e}T12:00`);
  if (!Number.isNaN(t))
    return new Date(t).toISOString();
}
function H(e) {
  const t = (i) => {
    var o;
    const r = (o = i.currentTarget.parentElement) == null ? void 0 : o.querySelector(
      "input"
    );
    r && (r.value = bt(), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })));
  };
  return c`
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
function Jt(e) {
  const t = (i) => {
    var o;
    const r = (o = i.currentTarget.parentElement) == null ? void 0 : o.querySelector(
      "input"
    );
    r && (r.value = Zt(), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })));
  };
  return c`
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
function Ki(e, t, i, n, r, o, s) {
  const a = (i == null ? void 0 : i.volume_unit) ?? r ?? "oz", l = typeof n == "number" && Number.isFinite(n) ? String(n) : "";
  return c`
        <form @submit=${(b) => {
    b.preventDefault();
    const h = b.currentTarget, g = new FormData(h), m = String(g.get("amount") ?? ""), f = m === "" ? void 0 : Number(m), y = Y(String(g.get("at") ?? "")), p = String(g.get("unit") ?? a), $ = String(g.get("notes") ?? "") || void 0;
    o("log_feeding", {
      baby: t,
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
            ${H({
    id: "at",
    value: bt(),
    required: !0
  })}
            <label for="notes">Notes</label>
            ${X(e)}
            ${Z(e)}
            <div class="actions">
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function Yi(e, t, i, n, r, o) {
  const s = (l) => {
    l.preventDefault(), r("delete_entry", { entry_id: e });
  }, a = n ? `${i} (${n})` : i;
  return c`
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
function Gi(e, t, i, n) {
  return c`
        <form @submit=${(o) => {
    o.preventDefault();
    const s = o.currentTarget, a = new FormData(s, o.submitter ?? void 0);
    i("log_diaper", {
      baby: t,
      kind: String(a.get("kind") ?? "wet"),
      timestamp: Y(String(a.get("when") ?? "")),
      notes: String(a.get("notes") ?? "") || void 0,
      photo_path: Q(s)
    });
  }}>
            <h2>Log diaper</h2>
            <label for="when">When</label>
            ${H({ id: "when", value: bt() })}
            <label for="notes">Notes</label>
            ${X(e)}
            ${Z(e)}
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
function Xi(e, t, i, n, r) {
  const o = String((t == null ? void 0 : t.type) ?? ""), s = (t == null ? void 0 : t.data) ?? {}, a = o === "feeding" && (s.method === "bottle" || s.method === "solids"), l = o === "vaccine" || o === "growth", d = ji.has(o) && !a, b = (m) => {
    m.preventDefault();
    const f = m.currentTarget, y = new FormData(f), p = {}, $ = l ? Qt(String(y.get("started") ?? "")) : Y(String(y.get("started") ?? ""));
    if ($ && (p.timestamp = $), d) {
      const u = Y(String(y.get("ended") ?? ""));
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
        const P = y.get(S);
        if (P === null) return;
        const V = String(P).trim();
        if (V === "") return null;
        const lt = Number(V);
        return Number.isFinite(lt) ? lt : void 0;
      }, v = u("weight"), E = u("height"), D = u("head");
      v !== void 0 && (x.weight = v), E !== void 0 && (x.height = E), D !== void 0 && (x.head_circumference = D), x.weight_unit = String(
        y.get("weight_unit") ?? s.weight_unit ?? "kg"
      ), x.length_unit = String(
        y.get("length_unit") ?? s.length_unit ?? "cm"
      );
    }
    Object.keys(x).length && (p.data = x);
    const _ = Q(f);
    p.photo_path = _ ?? null, i("edit_entry", { entry_id: t.id, fields: p });
  }, h = () => {
    if (!r) {
      n();
      return;
    }
    !!t.source && t.source !== "user" || n(), r({
      id: t.id,
      type: t.type,
      source: t.source,
      staff: t.staff
    });
  }, g = Zi(t);
  return c`
        <form @submit=${b}>
            <h2>${g}</h2>
            ${d ? c`
                      <label for="started">Started</label>
                      ${H({
    id: "started",
    value: Bt(t.timestamp),
    required: !0
  })}
                      <label for="ended"
                          >Ended <span class="muted">(blank = ongoing)</span></label
                      >
                      ${H({
    id: "ended",
    value: Bt(t.ended_at)
  })}
                  ` : l ? c`
                      <label for="started">Date</label>
                      ${Jt({
    id: "started",
    value: Wi(t.timestamp),
    required: !0
  })}
                  ` : c`
                      <label for="started">Time</label>
                      ${H({
    id: "started",
    value: Bt(t.timestamp),
    required: !0
  })}
                  `}
            ${o === "diaper" ? c`
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
            ${o === "feeding" && s.method === "bottle" ? c`
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
            ${o === "other" || o === "medication" ? c`
                      <label for="name">Name</label>
                      <input
                          id="name"
                          name="name"
                          type="text"
                          .value=${String(s.name ?? "")}
                      />
                  ` : ""}
            ${o === "growth" ? c`
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
            ${X(e, {
    value: String(t.notes ?? "")
  })}
            ${Z(e, t.photo_path ?? "")}
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
function Zi(e) {
  const t = String((e == null ? void 0 : e.type) ?? "entry"), i = (e == null ? void 0 : e.data) ?? {}, n = i.name ?? i.method ?? i.kind;
  return n ? `Edit ${t} (${n})` : `Edit ${t}`;
}
function Qi(e, t, i, n, r, o) {
  const s = async () => {
    o(), await n();
  }, a = async () => {
    try {
      await r("end_sleep", { baby: e });
    } catch (d) {
      console.warn("babytracker: end_sleep failed", d);
    }
    o(), await n();
  }, l = Gt(t ?? e);
  return c`
        <form @submit=${(d) => d.preventDefault()}>
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
function Ji(e, t, i, n, r) {
  const o = (i == null ? void 0 : i.weight_unit) ?? "kg", s = (i == null ? void 0 : i.length_unit) ?? "cm";
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
      baby: t,
      weight: h("weight"),
      height: h("height"),
      head_circumference: h("head"),
      weight_unit: String(b.get("weight_unit") ?? o),
      length_unit: String(b.get("length_unit") ?? s),
      timestamp: Qt(String(b.get("when") ?? "")),
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
            ${Jt({ id: "when", value: Zt() })}
            <label for="notes">Notes</label>
            ${X(e)}
            ${Z(e)}
            <div class="actions">
                <button type="button" @click=${r}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
const tn = [
  "Bath",
  "Butt wash",
  "Medication",
  "Vitamin",
  "Burp",
  "Spit up",
  "Throw up"
];
function en(e, t, i, n) {
  const r = (s) => {
    s.preventDefault();
    const a = s.currentTarget, l = new FormData(a);
    i("log_other", {
      baby: t,
      name: String(l.get("name") ?? ""),
      timestamp: Y(String(l.get("when") ?? "")),
      notes: String(l.get("notes") ?? "") || void 0,
      photo_path: Q(a)
    });
  }, o = (s) => i("log_other", { baby: t, name: s });
  return c`
        <form @submit=${r}>
            <h2>Log activity</h2>
            <div class="quick-other" role="group" aria-label="Quick activities">
                ${tn.map(
    (s) => c`
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
            ${H({ id: "when", value: bt() })}
            <label for="notes">Notes</label>
            ${X(e)}
            ${Z(e)}
            <div class="actions">
                <button type="button" @click=${n}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function nn(e, t, i, n, r, o) {
  const s = {
    sleep: "Log sleep",
    tummy_time: "Log tummy time",
    walk: "Log walk",
    feeding: n ? `Log ${n.replace("_", " ")} feeding` : "Log feeding"
  };
  return c`
        <form @submit=${(l) => {
    l.preventDefault();
    const d = l.currentTarget, b = new FormData(d), h = Y(String(b.get("started") ?? "")), g = Y(String(b.get("ended") ?? "")), m = String(b.get("notes") ?? "") || void 0, f = Q(d);
    if (!g) {
      const $ = {
        baby: t,
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
      baby: t,
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
            <h2>${s[i]}</h2>
            <label for="started">Started</label>
            ${H({
    id: "started",
    value: bt(),
    required: !0
  })}
            <label for="ended">Ended <span class="muted">(optional)</span></label>
            ${H({
    id: "ended",
    placeholder: "leave blank for an open session"
  })}
            <label for="notes">Notes</label>
            ${X(e)}
            ${Z(e)}
            <div class="actions">
                <button type="button" @click=${o}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function rn(e, t, i, n) {
  return c`
        <form @submit=${(o) => {
    o.preventDefault();
    const s = o.currentTarget, a = new FormData(s), l = Y(String(a.get("when") ?? ""));
    i("log_feeding", {
      baby: t,
      method: "solids",
      started_at: l,
      ended_at: l,
      notes: String(a.get("notes") ?? "") || void 0,
      photo_path: Q(s)
    });
  }}>
            <h2>Log solids</h2>
            <label for="notes"
                >What was fed <span class="muted">(optional)</span></label
            >
            ${X(e, {
    placeholder: "e.g. banana, oatmeal",
    autofocus: !0
  })}
            <label for="when">When</label>
            ${H({ id: "when", value: bt() })}
            ${Z(e)}
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
], sn = {
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
function ye(e) {
  return sn[e] ?? e;
}
function an(e, t, i, n, r, o, s) {
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
    const v = String(w.get("dose_number") ?? "").trim(), E = v === "" ? void 0 : Number(v), D = String(w.get("site") ?? "").trim() || void 0, S = String(w.get("lot_number") ?? "").trim() || void 0, P = String(w.get("provider") ?? "").trim() || void 0;
    o("log_vaccine", {
      baby: t,
      name: u,
      dose_number: E,
      site: D,
      lot_number: S,
      provider: P,
      timestamp: Qt(String(w.get("when") ?? "")),
      notes: String(w.get("notes") ?? "") || void 0,
      photo_path: Q($)
    });
  }, d = Array.from(
    new Set(
      [...on, ...r].filter((p) => !!p && p !== "none").map(ye)
    )
  ).sort((p, $) => p.localeCompare($)), b = i && i !== "none" ? ye(i) : "", h = !!b && d.includes(b), g = !!b && !h, m = h ? b : g ? "__other__" : "", f = g ? b : "";
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
            ${Jt({ id: "when", value: Zt() })}
            <label for="notes">Notes</label>
            ${X(e)}
            ${Z(e)}
            <div class="actions">
                <button type="button" @click=${s}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
function te(e, t, i, n, r, o, s) {
  let a = C;
  if (t !== null)
    switch (t.kind) {
      case "diaper":
        a = Gi(e, t.baby, n, o);
        break;
      case "bottle":
        a = Ki(
          e,
          t.baby,
          i,
          t.lastAmount,
          t.lastUnit,
          n,
          o
        );
        break;
      case "solids":
        a = rn(e, t.baby, n, o);
        break;
      case "other":
        a = en(e, t.baby, n, o);
        break;
      case "session":
        a = nn(
          e,
          t.baby,
          t.activity,
          t.method,
          n,
          o
        );
        break;
      case "end_sleep_first":
        a = Qi(
          t.baby,
          t.babyName,
          t.label,
          t.then,
          r,
          o
        );
        break;
      case "confirm_delete_imported":
        a = Yi(
          t.entryId,
          t.entryType,
          t.source,
          t.staff ?? null,
          n,
          o
        );
        break;
      case "edit_entry":
        a = Xi(
          e,
          t.entry,
          n,
          o,
          s
        );
        break;
      case "log_growth":
        a = Ji(e, t.baby, i, n, o);
        break;
      case "log_vaccine":
        a = an(
          e,
          t.baby,
          t.defaultName ?? "",
          t.defaultDose,
          t.scheduleNames ?? [],
          n,
          o
        );
        break;
    }
  return c`
        <dialog @cancel=${o} @close=${o}>${a}</dialog>
    `;
}
function Ie(e, t) {
  return !e.source || e.source === "user" ? (t(e.id), null) : {
    kind: "confirm_delete_imported",
    entryId: e.id,
    entryType: e.type ?? "entry",
    source: e.source,
    staff: e.staff ?? null
  };
}
function Ue(e, t) {
  const i = e.querySelector("dialog");
  i && (t && !i.open && i.showModal(), !t && i.open && i.close());
}
const Be = B`
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
`, Vt = 24 * 60 * 60 * 1e3, ve = 29.5735, $e = [
  { key: "bottle", label: "Bottle", color: "var(--primary-color, #4a90e2)" },
  { key: "breast", label: "Breast", color: "var(--success-color, #43a047)" },
  { key: "solids", label: "Solids", color: "var(--warning-color, #f5a623)" }
], we = [
  { key: "wet", label: "Wet", color: "var(--info-color, #4fc3f7)" },
  { key: "dirty", label: "Dirty", color: "var(--accent-color, #f57c00)" },
  { key: "both", label: "Both", color: "var(--error-color, #d32f2f)" }
];
function ln(e) {
  return {
    label: e,
    sleepMinutes: 0,
    bottleMl: 0,
    feedingByCategory: { bottle: 0, breast: 0, solids: 0 },
    diaperByCategory: { wet: 0, dirty: 0, both: 0 }
  };
}
function cn(e) {
  return e === "bottle" ? "bottle" : e === "breast_left" || e === "breast_right" ? "breast" : e === "solids" ? "solids" : null;
}
function dn(e) {
  return e === "wet" || e === "dirty" || e === "both" ? e : null;
}
function un(e) {
  return {
    feedings: e.feedingByCategory.bottle + e.feedingByCategory.breast + e.feedingByCategory.solids,
    diapers: e.diaperByCategory.wet + e.diaperByCategory.dirty + e.diaperByCategory.both
  };
}
function pn(e, t, i = 7) {
  var y, p, $, w, x, _;
  const n = (y = e == null ? void 0 : e.states) == null ? void 0 : y[A(t, "recent_entries")], r = ((p = n == null ? void 0 : n.attributes) == null ? void 0 : p.entries) ?? [], o = Date.now(), s = new Date(o);
  s.setHours(0, 0, 0, 0);
  const a = [], l = (u) => u.toLocaleDateString([], { weekday: "short" });
  for (let u = i - 1; u >= 0; u--) {
    const v = new Date(s.getTime() - u * Vt);
    a.push(ln(l(v)));
  }
  const d = s.getTime() - (i - 1) * Vt;
  for (const u of r) {
    const v = Date.parse(u == null ? void 0 : u.timestamp);
    if (!Number.isFinite(v)) continue;
    const E = Math.floor((v - d) / Vt);
    if (E < 0 || E >= i) continue;
    const D = a[E];
    if (u.type === "feeding") {
      const S = cn(String((($ = u == null ? void 0 : u.data) == null ? void 0 : $.method) ?? ""));
      S && (D.feedingByCategory[S] += 1);
      const P = Number(((w = u == null ? void 0 : u.data) == null ? void 0 : w.amount) ?? 0), V = String(((x = u == null ? void 0 : u.data) == null ? void 0 : x.unit) ?? "");
      P > 0 && V === "oz" ? D.bottleMl += P * ve : P > 0 && V === "ml" && (D.bottleMl += P);
    } else if (u.type === "diaper") {
      const S = dn(String(((_ = u == null ? void 0 : u.data) == null ? void 0 : _.kind) ?? ""));
      S && (D.diaperByCategory[S] += 1);
    } else if (u.type === "sleep") {
      const S = u != null && u.ended_at && u.ended_at !== "" ? Date.parse(u.ended_at) : o;
      Number.isFinite(S) && S > v && (D.sleepMinutes += (S - v) / 6e4);
    }
  }
  const b = a.map(un);
  if (a.every(
    (u, v) => u.sleepMinutes === 0 && b[v].feedings === 0 && b[v].diapers === 0
  ))
    return "";
  const h = a.map((u) => ({
    label: u.label,
    value: u.sleepMinutes
  })), g = a.map((u) => ({
    label: u.label,
    parts: $e.map((v) => ({
      ...v,
      value: u.feedingByCategory[v.key]
    }))
  })), m = a.map((u) => ({
    label: u.label,
    value: u.bottleMl
  })), f = a.map((u) => ({
    label: u.label,
    parts: we.map((v) => ({
      ...v,
      value: u.diaperByCategory[v.key]
    }))
  }));
  return c`
        <div class="section" role="region" aria-label="Trends">
            <h2>Trends · last ${i} days</h2>
            <bt-chart-lightbox
                label="Sleep (min/day)"
                .renderChart=${() => xe(
    h,
    "Sleep (min/day)",
    (u) => `${Math.round(u)}`
  )}
            ></bt-chart-lightbox>
            <bt-chart-lightbox
                label="Feedings/day"
                .renderChart=${() => ke(
    g,
    "Feedings/day",
    $e,
    (u) => `${u}`
  )}
            ></bt-chart-lightbox>
            <bt-chart-lightbox
                label="Bottle (oz/day)"
                .renderChart=${() => xe(
    m,
    "Bottle (oz/day)",
    (u) => (u / ve).toFixed(1)
  )}
            ></bt-chart-lightbox>
            <bt-chart-lightbox
                label="Diapers/day"
                .renderChart=${() => ke(
    f,
    "Diapers/day",
    we,
    (u) => `${u}`
  )}
            ></bt-chart-lightbox>
        </div>
    `;
}
function xe(e, t, i) {
  const a = Math.max(1, ...e.map((d) => d.value)), l = (320 - 14 * 2) / e.length;
  return c`
        <div class="trend">
            <div class="label">${t}</div>
            <svg
                viewBox="0 0 ${320} ${90}"
                role="img"
                aria-label=${t}
                style="width:100%;height:${90}px;"
            >
                ${e.map((d, b) => {
    const h = 14 + b * l, g = l * 0.7, m = h + (l - g) / 2, f = Math.max(
      d.value > 0 ? 2 : 0,
      d.value / a * (90 - 24 * 2)
    ), y = 66 - f;
    return L`
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
function ke(e, t, i, n) {
  const l = e.map((h) => h.parts.reduce((g, m) => g + m.value, 0)), d = Math.max(1, ...l), b = (320 - 14 * 2) / e.length;
  return c`
        <div class="trend">
            <div class="label-row">
                <div class="label">${t}</div>
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
                aria-label=${t}
                style="width:100%;height:${90}px;"
            >
                ${e.map((h, g) => {
    const m = 14 + g * b, f = b * 0.7, y = m + (b - f) / 2, p = l[g], $ = Math.max(
      p > 0 ? 2 : 0,
      p / d * (90 - 24 * 2)
    ), w = 66;
    let x = w;
    const _ = h.parts.map((u) => {
      if (u.value <= 0) return L``;
      const v = u.value / p * $;
      return x -= v, L`
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
    return L`
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
function hn(e) {
  if (!e) return "—";
  const t = Date.parse(e);
  return Number.isNaN(t) ? "—" : new Date(t).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function Ft(e) {
  var n, r;
  const t = String(((n = e == null ? void 0 : e.data) == null ? void 0 : n.name) ?? "vaccine"), i = (r = e == null ? void 0 : e.data) == null ? void 0 : r.dose_number;
  return i != null ? `${t} dose ${i}` : t;
}
function bn(e, t) {
  return !e || e.length === 0 ? "" : c`
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
      return c`<li
                        class=${t ? "clickable" : ""}
                        role=${t ? "button" : "listitem"}
                        tabindex=${t ? "0" : "-1"}
                        aria-label=${t ? `Edit ${Ft(i)}` : Ft(i)}
                        @click=${t ? () => t(i) : void 0}
                        @keydown=${t ? (r) => {
        (r.key === "Enter" || r.key === " ") && (r.preventDefault(), t(i));
      } : void 0}
                    >
                        <span class="vh-date muted"
                            >${hn(i.timestamp)}</span
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
function gn(e, t, i) {
  var o, s;
  const n = e.states[A(t, "vaccines_due")];
  if (!n || n.state === "unknown") return "";
  const r = ((o = e.states[A(t, "vaccines_overdue", "binary_sensor")]) == null ? void 0 : o.state) === "on";
  return c`
        <div
            class="section chip ${r ? "warning" : ""}"
            role="status"
            aria-label="Vaccines due"
        >
            <span>Vaccines due:</span>
            <strong>${n.state}</strong>
            ${(s = n.attributes) != null && s.due_on ? c`<span>(${n.attributes.due_on})</span>` : ""}
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
var fn = Object.defineProperty, mn = Object.getOwnPropertyDescriptor, st = (e, t, i, n) => {
  for (var r = n > 1 ? void 0 : n ? mn(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (r = (n ? s(t, i, r) : s(r)) || r);
  return n && r && fn(t, i, r), r;
};
const _n = ["vaccines", "growth", "trends", "export"];
let I = class extends N {
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
      this._modal = Ie(
        e,
        (t) => this.hass.callService("babytracker", "delete_entry", { entry_id: t })
      );
    }, this._requestLogVaccine = () => {
      var s, a, l, d, b;
      if (!((s = this._config) != null && s.baby)) return;
      const e = (l = (a = this.hass) == null ? void 0 : a.states) == null ? void 0 : l[A(this._config.baby, "vaccines_due")], t = e != null && e.state && e.state !== "none" && e.state !== "unknown" ? String(e.state) : "", i = (d = e == null ? void 0 : e.attributes) == null ? void 0 : d.dose_number, n = typeof i == "number" ? i : void 0, o = (Array.isArray((b = e == null ? void 0 : e.attributes) == null ? void 0 : b.upcoming) ? e.attributes.upcoming : []).map((h) => h && typeof h.name == "string" ? h.name : null).filter((h) => !!h);
      this._modal = {
        kind: "log_vaccine",
        baby: this._config.baby,
        defaultName: t,
        defaultDose: n,
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
    (e.has("hass") || e.has("_config")) && this._maybeSubscribe(), e.has("_modal") && Ue(this.renderRoot, this._modal);
  }
  _maybeSubscribe() {
    var e, t;
    !this.hass || !this._config || (this._unsubOptions || (this._unsubOptions = Oe(
      this.hass,
      (i) => {
        this._options = i;
      }
    )), !this._unsubVaccines && this._sections.includes("vaccines") && ((e = this._config) != null && e.baby) && (this._unsubVaccines = pi(
      this.hass,
      this._config.baby,
      (i) => {
        this._vaccines = Array.isArray(i) ? i : [];
      }
    )), !this._unsubGrowth && this._sections.includes("growth") && ((t = this._config) != null && t.baby) && (this._unsubGrowth = hi(
      this.hass,
      this._config.baby,
      (i) => {
        this._growth = Array.isArray(i) ? i : [];
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? _n;
  }
  render() {
    if (!this.hass || !this._config) return c``;
    const e = this._sections;
    return c`
            <ha-card>
                ${e.includes("vaccines") ? c`
                          ${gn(
      this.hass,
      this._config.baby,
      this._requestLogVaccine
    )}
                          ${bn(
      this._vaccines,
      this._requestEditEntry
    )}
                      ` : ""}
                ${e.includes("growth") ? He(
      this.hass,
      this._config.baby,
      this._options,
      this._config.units,
      this._requestLogGrowth,
      this._growth[0],
      this._requestEditEntry,
      this._growth
    ) : ""}
                ${e.includes("trends") ? pn(
      this.hass,
      this._config.baby,
      this._config.trend_days ?? 7
    ) : ""}
                ${e.includes("export") ? ze(this.hass, this._config.baby) : ""}
            </ha-card>
            ${te(
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
I.styles = B`
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
        ${Be}
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
st([
  M({ attribute: !1 })
], I.prototype, "hass", 2);
st([
  k()
], I.prototype, "_config", 2);
st([
  k()
], I.prototype, "_options", 2);
st([
  k()
], I.prototype, "_modal", 2);
st([
  k()
], I.prototype, "_vaccines", 2);
st([
  k()
], I.prototype, "_growth", 2);
I = st([
  G("babytracker-summary-card")
], I);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-summary-card",
  name: "babytracker — summary",
  description: "Vaccines, growth, 7-day trend charts, and pediatrician export for one baby."
});
var yn = Object.defineProperty, vn = Object.getOwnPropertyDescriptor, at = (e, t, i, n) => {
  for (var r = n > 1 ? void 0 : n ? vn(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (r = (n ? s(t, i, r) : s(r)) || r);
  return n && r && yn(t, i, r), r;
};
function Se(e) {
  return String(e).padStart(2, "0");
}
function At(e) {
  return `${e.getFullYear()}-${Se(e.getMonth() + 1)}-${Se(e.getDate())}`;
}
function wt(e) {
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e);
  if (!t) return null;
  const i = Number(t[1]), n = Number(t[2]) - 1, r = Number(t[3]), o = new Date(i, n, r, 0, 0, 0, 0);
  return Number.isNaN(o.getTime()) ? null : o;
}
function $n(e) {
  const t = wt(e) ?? /* @__PURE__ */ new Date(), i = new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, 0, 0, 0), n = new Date(
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
function wn(e, t) {
  const i = wt(e) ?? /* @__PURE__ */ new Date();
  return i.setDate(i.getDate() + t), At(i);
}
function xn(e) {
  const t = wt(e);
  return t ? t.toLocaleDateString([], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : e;
}
let U = class extends N {
  constructor() {
    super(...arguments), this._date = At(/* @__PURE__ */ new Date()), this._entries = [], this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._today = () => {
      this._date = At(/* @__PURE__ */ new Date());
    }, this._onDateChange = (e) => {
      const t = e.currentTarget.value;
      t && wt(t) && (this._date = t);
    }, this._requestEdit = (e) => {
      this._modal = { kind: "edit_entry", entry: e };
    }, this._requestDelete = (e) => {
      this._modal = Ie(
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
    this._config = { ...e }, e.initial_date && wt(e.initial_date) && (this._date = e.initial_date);
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
    (e.has("hass") || e.has("_config") || e.has("_date")) && this._resubscribe(), e.has("_modal") && Ue(this.renderRoot, this._modal);
  }
  _resubscribe() {
    var i, n;
    if (!this.hass || !((i = this._config) != null && i.baby)) return;
    (n = this._unsubEntries) == null || n.call(this);
    const { startIso: e, endIso: t } = $n(this._date);
    this._unsubEntries = ui(
      this.hass,
      this._config.baby,
      e,
      t,
      (r) => {
        this._entries = Array.isArray(r) ? r : [];
      }
    );
  }
  _go(e) {
    this._date = wn(this._date, e);
  }
  _renderChips(e) {
    const t = [], i = [];
    if (e.wet && i.push(`${e.wet}w`), e.dirty && i.push(`${e.dirty}d`), e.mixed && i.push(`${e.mixed}b`), t.push(c`
            <span class="chip"
                ><span class="chip-label">Diapers</span> ${e.diapers}${i.length > 0 ? c` <span class="chip-detail"
                              >(${i.join(" · ")})</span
                          >` : ""}</span
            >
        `), t.push(c`
            <span class="chip"
                ><span class="chip-label">Sleep</span>
                ${R(e.sleepMinutes)}</span
            >
        `), t.push(c`
            <span class="chip"
                ><span class="chip-label">Longest sleep</span>
                ${R(e.longestSleepMinutes)}</span
            >
        `), e.bottleFeeds > 0 && t.push(c`
                <span class="chip"
                    ><span class="chip-label">Feeds</span>
                    ${e.bottleFeeds}
                    <span class="chip-detail"
                        >· ${qt(e.bottleVolumeMl)}</span
                    ></span
                >
            `), e.nursingMinutes > 0) {
      const n = [];
      e.nursingLeftMinutes > 0 && n.push(`L ${R(e.nursingLeftMinutes)}`), e.nursingRightMinutes > 0 && n.push(`R ${R(e.nursingRightMinutes)}`), t.push(c`
                <span class="chip"
                    ><span class="chip-label">Nursing</span>
                    ${R(e.nursingMinutes)}
                    <span class="chip-detail">(${n.join(" · ")})</span></span
                >
            `);
    }
    return e.pumpingMl > 0 && t.push(c`
                <span class="chip"
                    ><span class="chip-label">Pumping</span>
                    ${qt(e.pumpingMl)}</span
                >
            `), e.solidsCount > 0 && t.push(c`
                <span class="chip"
                    ><span class="chip-label">Solids</span>
                    ${e.solidsCount}</span
                >
            `), e.tummyMinutes > 0 && t.push(c`
                <span class="chip"
                    ><span class="chip-label">Tummy time</span>
                    ${R(e.tummyMinutes)}</span
                >
            `), e.walkCount > 0 && t.push(c`
                <span class="chip"
                    ><span class="chip-label">Walks</span> ${e.walkCount}
                    <span class="chip-detail"
                        >· ${R(e.walkMinutes)}</span
                    ></span
                >
            `), e.medCount > 0 && t.push(c`
                <span class="chip"
                    ><span class="chip-label">Meds</span>
                    ${e.medCount}</span
                >
            `), e.vaccineCount > 0 && t.push(c`
                <span class="chip"
                    ><span class="chip-label">Vaccines</span>
                    ${e.vaccineCount}</span
                >
            `), c`<div class="chips" aria-label="Day summary">
            ${t}
        </div>`;
  }
  render() {
    if (!this.hass || !this._config) return c``;
    const e = this._date === At(/* @__PURE__ */ new Date()), t = _i(this._entries);
    return c`
            <ha-card>
                <h2>History — ${xn(this._date)}</h2>
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
                ${this._entries.length === 0 ? c`<p class="empty">Nothing logged on this day.</p>` : c`
                          ${this._renderChips(t)}
                          <ul class="entries">
                              ${this._entries.map(
      (i) => Le(
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
            ${te(
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
U.styles = B`
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
        ${Be}
    `;
at([
  M({ attribute: !1 })
], U.prototype, "hass", 2);
at([
  k()
], U.prototype, "_config", 2);
at([
  k()
], U.prototype, "_date", 2);
at([
  k()
], U.prototype, "_entries", 2);
at([
  k()
], U.prototype, "_modal", 2);
at([
  k()
], U.prototype, "_expandedNotes", 2);
U = at([
  G("babytracker-history-card")
], U);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-history-card",
  name: "babytracker — history",
  description: "Paginate through one baby's entries by calendar day with edit + delete."
});
var kn = Object.defineProperty, Sn = Object.getOwnPropertyDescriptor, J = (e, t, i, n) => {
  for (var r = n > 1 ? void 0 : n ? Sn(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (r = (n ? s(t, i, r) : s(r)) || r);
  return n && r && kn(t, i, r), r;
};
const Cn = [
  "status",
  "today",
  "active_session",
  "quick_log",
  "recent",
  "importer_sync"
];
let O = class extends N {
  constructor() {
    super(...arguments), this._modal = null, this._expandedNotes = /* @__PURE__ */ new Set(), this._handleService = async (e, t, i) => {
      const n = i instanceof HTMLElement && i.classList.contains("quick") ? i : null;
      try {
        const r = await ci(this.hass, "babytracker", e, t);
        return n && (n.classList.add("logged"), setTimeout(() => n.classList.remove("logged"), 700)), this.requestUpdate(), r;
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
    !this.hass || !this._config || (this._unsubBaby || (this._unsubBaby = di(
      this.hass,
      this._config.baby,
      (e) => {
        this._babyConfig = e;
      }
    )), this._unsubOptions || (this._unsubOptions = Oe(
      this.hass,
      (e) => {
        this._options = e;
      }
    )));
  }
  get _sections() {
    var e;
    return ((e = this._config) == null ? void 0 : e.sections) ?? Cn;
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
    var l, d, b, h, g, m, f, y, p, $, w, x, _;
    const e = this.hass, t = (d = (l = e.states) == null ? void 0 : l[this._entityId("last_feeding")]) == null ? void 0 : d.state, i = (h = (b = e.states) == null ? void 0 : b[this._entityId("last_diaper")]) == null ? void 0 : h.state, n = ((m = (g = e.states) == null ? void 0 : g[this._entityId("sleeping", "binary_sensor")]) == null ? void 0 : m.state) === "on", r = ((y = (f = e.states) == null ? void 0 : f[this._entityId("walking", "binary_sensor")]) == null ? void 0 : y.state) === "on", o = (($ = (p = e.states) == null ? void 0 : p[this._entityId("at_daycare", "binary_sensor")]) == null ? void 0 : $.state) === "on", s = ((_ = (x = (w = e.states) == null ? void 0 : w[this._entityId("recent_entries")]) == null ? void 0 : x.attributes) == null ? void 0 : _.entries) ?? [], a = n ? null : yi(s);
    return c`
            <div class="chip" role="listitem">
                Last feed: ${this._timeSince(t)}
            </div>
            <div class="chip" role="listitem">
                Last diaper: ${this._timeSince(i)}
            </div>
            ${a !== null ? c`<div class="chip" role="listitem">
                      Awake for: ${R(a)}
                  </div>` : ""}
            ${n ? c`<div class="chip warning" role="listitem">Sleeping</div>` : ""}
            ${r ? c`<div class="chip warning" role="listitem">On a walk</div>` : ""}
            ${o ? c`<div class="chip warning" role="listitem">At daycare</div>` : ""}
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
    var i, n, r, o, s, a, l;
    const e = (n = (i = this.hass) == null ? void 0 : i.states) == null ? void 0 : n[this._entityId("recent_entries")], t = ((r = e == null ? void 0 : e.attributes) == null ? void 0 : r.entries) ?? [];
    for (const d of t)
      if ((d == null ? void 0 : d.type) === "feeding" && ((o = d == null ? void 0 : d.data) == null ? void 0 : o.method) === "bottle" && typeof ((s = d == null ? void 0 : d.data) == null ? void 0 : s.amount) == "number" && (((a = d == null ? void 0 : d.data) == null ? void 0 : a.unit) === "ml" || ((l = d == null ? void 0 : d.data) == null ? void 0 : l.unit) === "oz"))
        return { amount: d.data.amount, unit: d.data.unit };
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
    var n;
    if (!this.hass || !this._config) return c``;
    const e = this._sections, t = e.includes("status"), i = e.includes("today");
    return c`
            <ha-card>
                <h2>${Gt(((n = this._babyConfig) == null ? void 0 : n.name) ?? this._baby())}</h2>
                ${t || i ? c`<div
                          class="chips"
                          role="list"
                          aria-label="Status and last 24 hours"
                      >
                          ${t ? this._renderStatusChips() : ""}
                          ${i ? Ti(
      this.hass,
      this._baby(),
      this._babyConfig
    ) : ""}
                      </div>` : ""}
                ${e.includes("active_session") ? gi(
      this.hass,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("quick_log") ? bi(
      this._babyConfig,
      this._baby(),
      this._handleService,
      this._requestModal
    ) : ""}
                ${e.includes("growth") ? He(
      this.hass,
      this._baby(),
      this._options,
      this._config.units
    ) : ""}
                ${e.includes("recent") ? Si(
      this.hass,
      this._baby(),
      this._requestEdit,
      this._config.recent_limit ?? 50,
      this._expandedNotes,
      this._toggleNotes
    ) : ""}
                ${e.includes("importer_sync") ? Mi(
      this._babyConfig,
      this._baby(),
      this._handleService
    ) : ""}
                ${e.includes("export") ? ze(this.hass, this._baby()) : ""}
            </ha-card>
            ${te(
      this.hass,
      this._modal,
      this._options,
      this._submitModal,
      (r, o) => this._handleService(r, o),
      this._closeModal,
      this._requestDelete
    )}
        `;
  }
};
O.styles = B`
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
], O.prototype, "hass", 2);
J([
  k()
], O.prototype, "_config", 2);
J([
  k()
], O.prototype, "_babyConfig", 2);
J([
  k()
], O.prototype, "_options", 2);
J([
  k()
], O.prototype, "_modal", 2);
J([
  k()
], O.prototype, "_expandedNotes", 2);
J([
  Ne("dialog")
], O.prototype, "_dialog", 2);
O = J([
  G("babytracker-card")
], O);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "babytracker-card",
  name: "babytracker",
  description: "Track feedings, sleep, diapers, growth, vaccines, and walks."
});
Promise.resolve().then(() => Dn);
var An = Object.defineProperty, En = Object.getOwnPropertyDescriptor, ee = (e, t, i, n) => {
  for (var r = n > 1 ? void 0 : n ? En(t, i) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (r = (n ? s(t, i, r) : s(r)) || r);
  return n && r && An(t, i, r), r;
};
let rt = class extends N {
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
rt.styles = B`
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
ee([
  M({ attribute: !1 })
], rt.prototype, "hass", 2);
ee([
  M({ attribute: !1 })
], rt.prototype, "_config", 2);
rt = ee([
  G("babytracker-card-editor")
], rt);
rt.getConfigElement = function() {
  return document.createElement("babytracker-card-editor");
};
const Dn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get BabytrackerCardEditor() {
    return rt;
  }
}, Symbol.toStringTag, { value: "Module" }));
export {
  O as BabytrackerCard
};
//# sourceMappingURL=babytracker-card.js.map
