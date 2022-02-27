
function initCanvas() {
    "use strict";
    var e, t = {
            screen: {
                elem: null,
                callback: null,
                ctx: null,
                width: 0,
                height: 0,
                left: 0,
                top: 0,
                init: function (e, t, n) {
                    return this.elem = document.getElementById(e), this.callback = t || null, "CANVAS" == this.elem.tagName && (this.ctx = this.elem.getContext("2d")), window.addEventListener("resize", function () {
                        this.resize()
                    }.bind(this), !1), this.elem.onselectstart = function () {
                        return !1
                    }, this.elem.ondrag = function () {
                        return !1
                    }, n && this.resize(), this
                },
                resize: function () {
                    var e = this.elem;
                    for (this.width = e.offsetWidth, this.height = e.offsetHeight, this.left = 0, this.top = 0; null != e; e = e.offsetParent) this.left += e.offsetLeft, this.top += e.offsetTop;
                    this.ctx && (this.elem.width = this.width, this.elem.height = this.height), this.callback && this.callback()
                }
            }
        },
        n = function (e, t) {
            this.x = e, this.y = t, this.magnitude = e * e + t * t, this.computed = 0, this.force = 0
        };
    n.prototype.add = function (e) {
        return new n(this.x + e.x, this.y + e.y)
    };
    var i = function (e) {
        var t = .5,
            i = 1.5,
            r = .5;
        this.vel = new n((Math.random() > .5 ? 1 : -1) * (r * Math.random()), (Math.random() > .5 ? 1 : -1) * (r * Math.random())), this.pos = new n(.2 * e.width + Math.random() * e.width * .6, .2 * e.height + Math.random() * e.height * .6), this.size = e.wh / 15 + (Math.random() * (i - t) + t) * (e.wh / 15), this.width = e.width, this.height = e.height
    };
    i.prototype.move = function () {
        this.pos.x >= this.width - this.size ? (this.vel.x > 0 && (this.vel.x = -this.vel.x), this.pos.x = this.width - this.size) : this.pos.x <= this.size && (this.vel.x < 0 && (this.vel.x = -this.vel.x), this.pos.x = this.size);
        var e = 60;
        this.pos.y >= this.height - this.size - e ? (this.vel.y > 0 && (this.vel.y = -this.vel.y), this.pos.y = this.height - this.size - e) : this.pos.y <= this.size && (this.vel.y < 0 && (this.vel.y = -this.vel.y), this.pos.y = this.size), this.pos = this.pos.add(this.vel)
    };
    var r = function (e, t, r, a, s) {
        this.step = 5, this.width = e, this.height = t, this.wh = Math.min(e, t), this.sx = Math.floor(this.width / this.step), this.sy = Math.floor(this.height / this.step), this.paint = !1, this.metaFill = o(e, t, e, a, s), this.plx = [0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0], this.ply = [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1], this.mscases = [0, 3, 0, 3, 1, 3, 0, 3, 2, 2, 0, 2, 1, 1, 0], this.ix = [1, 0, -1, 0, 0, 1, 0, -1, -1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1], this.grid = [], this.balls = [], this.iter = 0, this.sign = 1;
        for (var l = 0; l < (this.sx + 2) * (this.sy + 2); l++) this.grid[l] = new n(l % (this.sx + 2) * this.step, Math.floor(l / (this.sx + 2)) * this.step);
        for (var u = 0; u < r; u++) this.balls[u] = new i(this)
    };
    r.prototype.computeForce = function (e, t, n) {
        var i, r = n || e + t * (this.sx + 2);
        if (0 === e || 0 === t || e === this.sx || t === this.sy) i = .6 * this.sign;
        else {
            i = 0;
            for (var o, a = this.grid[r], s = 0; o = this.balls[s++];) i += o.size * o.size / (-2 * a.x * o.pos.x - 2 * a.y * o.pos.y + o.pos.magnitude + a.magnitude);
            i *= this.sign
        }
        return this.grid[r].force = i, i
    }, r.prototype.marchingSquares = function (e) {
        var t = e[0],
            n = e[1],
            i = e[2],
            r = t + n * (this.sx + 2);
        if (this.grid[r].computed === this.iter) return !1;
        for (var o, a = 0, s = 0; s < 4; s++) {
            var u = t + this.ix[s + 12] + (n + this.ix[s + 16]) * (this.sx + 2),
                c = this.grid[u].force;
            (c > 0 && this.sign < 0 || c < 0 && this.sign > 0 || !c) && (c = this.computeForce(t + this.ix[s + 12], n + this.ix[s + 16], u)), Math.abs(c) > 1 && (a += Math.pow(2, s))
        }
        if (15 === a) return [t, n - 1, !1];
        5 === a ? o = 2 === i ? 3 : 1 : 10 === a ? o = 3 === i ? 0 : 2 : (o = this.mscases[a], this.grid[r].computed = this.iter);
        var d = this.step / (Math.abs(Math.abs(this.grid[t + this.plx[4 * o + 2] + (n + this.ply[4 * o + 2]) * (this.sx + 2)].force) - 1) / Math.abs(Math.abs(this.grid[t + this.plx[4 * o + 3] + (n + this.ply[4 * o + 3]) * (this.sx + 2)].force) - 1) + 1);
        return l.lineTo(this.grid[t + this.plx[4 * o] + (n + this.ply[4 * o]) * (this.sx + 2)].x + this.ix[o] * d, this.grid[t + this.plx[4 * o + 1] + (n + this.ply[4 * o + 1]) * (this.sx + 2)].y + this.ix[o + 4] * d), this.paint = !0, [t + this.ix[o + 4], n + this.ix[o + 8], o]
    }, r.prototype.renderMetaballs = function () {
        for (var e, t = 0; e = this.balls[t++];) e.move();
        for (this.iter++, this.sign = -this.sign, this.paint = !1, l.fillStyle = this.metaFill, l.beginPath(), t = 0; e = this.balls[t++];) {
            var n = [Math.round(e.pos.x / this.step), Math.round(e.pos.y / this.step), !1];
            do {
                n = this.marchingSquares(n)
            } while (n);
            this.paint && (l.fill(), l.closePath(), l.beginPath(), this.paint = !1)
        }
    };
    var o = function (e, t, n, i, r) {
            var o = l.createRadialGradient(e / 1, t / 1, 0, e / 1, t / 1, n);
            return o.addColorStop(0, i), o.addColorStop(1, r), o
        },
        a = function () {
            requestAnimationFrame(a), l.clearRect(0, 0, s.width, s.height), e.renderMetaballs()
        },
        s = t.screen.init("welcome", null, !0),
        l = s.ctx;
    s.resize();
    var u = $("body").data("color");
    e = new r(s.width, s.height, 6, u[0], u[1]), a()
}! function (e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function (e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function (e, t) {
    function n(e) {
        var t = !!e && "length" in e && e.length,
            n = he.type(e);
        return "function" !== n && !he.isWindow(e) && ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
    }

    function i(e, t, n) {
        if (he.isFunction(t)) return he.grep(e, function (e, i) {
            return !!t.call(e, i, e) !== n
        });
        if (t.nodeType) return he.grep(e, function (e) {
            return e === t !== n
        });
        if ("string" == typeof t) {
            if (Te.test(t)) return he.filter(t, e, n);
            t = he.filter(t, e)
        }
        return he.grep(e, function (e) {
            return he.inArray(e, t) > -1 !== n
        })
    }

    function r(e, t) {
        do {
            e = e[t]
        } while (e && 1 !== e.nodeType);
        return e
    }

    function o(e) {
        var t = {};
        return he.each(e.match(Le) || [], function (e, n) {
            t[n] = !0
        }), t
    }

    function a() {
        ie.addEventListener ? (ie.removeEventListener("DOMContentLoaded", s), e.removeEventListener("load", s)) : (ie.detachEvent("onreadystatechange", s), e.detachEvent("onload", s))
    }

    function s() {
        (ie.addEventListener || "load" === e.event.type || "complete" === ie.readyState) && (a(), he.ready())
    }

    function l(e, t, n) {
        if (n === undefined && 1 === e.nodeType) {
            var i = "data-" + t.replace(Fe, "-$1").toLowerCase();
            if ("string" == typeof (n = e.getAttribute(i))) {
                try {
                    n = "true" === n || "false" !== n && ("null" === n ? null : +n + "" === n ? +n : $e.test(n) ? he.parseJSON(n) : n)
                } catch (r) {}
                he.data(e, t, n)
            } else n = undefined
        }
        return n
    }

    function u(e) {
        var t;
        for (t in e)
            if (("data" !== t || !he.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
        return !0
    }

    function c(e, t, n, i) {
        if (De(e)) {
            var r, o, a = he.expando,
                s = e.nodeType,
                l = s ? he.cache : e,
                u = s ? e[a] : e[a] && a;
            if (u && l[u] && (i || l[u].data) || n !== undefined || "string" != typeof t) return u || (u = s ? e[a] = ne.pop() || he.guid++ : a), l[u] || (l[u] = s ? {} : {
                toJSON: he.noop
            }), "object" != typeof t && "function" != typeof t || (i ? l[u] = he.extend(l[u], t) : l[u].data = he.extend(l[u].data, t)), o = l[u], i || (o.data || (o.data = {}), o = o.data), n !== undefined && (o[he.camelCase(t)] = n), "string" == typeof t ? null == (r = o[t]) && (r = o[he.camelCase(t)]) : r = o, r
        }
    }

    function d(e, t, n) {
        if (De(e)) {
            var i, r, o = e.nodeType,
                a = o ? he.cache : e,
                s = o ? e[he.expando] : he.expando;
            if (a[s]) {
                if (t && (i = n ? a[s] : a[s].data)) {
                    r = (t = he.isArray(t) ? t.concat(he.map(t, he.camelCase)) : t in i ? [t] : (t = he.camelCase(t)) in i ? [t] : t.split(" ")).length;
                    for (; r--;) delete i[t[r]];
                    if (n ? !u(i) : !he.isEmptyObject(i)) return
                }(n || (delete a[s].data, u(a[s]))) && (o ? he.cleanData([e], !0) : de.deleteExpando || a != a.window ? delete a[s] : a[s] = undefined)
            }
        }
    }

    function f(e, t, n, i) {
        var r, o = 1,
            a = 20,
            s = i ? function () {
                return i.cur()
            } : function () {
                return he.css(e, t, "")
            },
            l = s(),
            u = n && n[3] || (he.cssNumber[t] ? "" : "px"),
            c = (he.cssNumber[t] || "px" !== u && +l) && Ie.exec(he.css(e, t));
        if (c && c[3] !== u) {
            u = u || c[3], n = n || [], c = +l || 1;
            do {
                c /= o = o || ".5", he.style(e, t, c + u)
            } while (o !== (o = s() / l) && 1 !== o && --a)
        }
        return n && (c = +c || +l || 0, r = n[1] ? c + (n[1] + 1) * n[2] : +n[2], i && (i.unit = u, i.start = c, i.end = r)), r
    }

    function h(e) {
        var t = Ue.split("|"),
            n = e.createDocumentFragment();
        if (n.createElement)
            for (; t.length;) n.createElement(t.pop());
        return n
    }

    function p(e, t) {
        var n, i, r = 0,
            o = "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t || "*") : "undefined" != typeof e.querySelectorAll ? e.querySelectorAll(t || "*") : undefined;
        if (!o)
            for (o = [], n = e.childNodes || e; null != (i = n[r]); r++) !t || he.nodeName(i, t) ? o.push(i) : he.merge(o, p(i, t));
        return t === undefined || t && he.nodeName(e, t) ? he.merge([e], o) : o
    }

    function m(e, t) {
        for (var n, i = 0; null != (n = e[i]); i++) he._data(n, "globalEval", !t || he._data(t[i], "globalEval"))
    }

    function g(e) {
        Be.test(e.type) && (e.defaultChecked = e.checked)
    }

    function v(e, t, n, i, r) {
        for (var o, a, s, l, u, c, d, f = e.length, v = h(t), y = [], b = 0; b < f; b++)
            if ((a = e[b]) || 0 === a)
                if ("object" === he.type(a)) he.merge(y, a.nodeType ? [a] : a);
                else if (Je.test(a)) {
            for (l = l || v.appendChild(t.createElement("div")), u = (We.exec(a) || ["", ""])[1].toLowerCase(), d = Ge[u] || Ge._default, l.innerHTML = d[1] + he.htmlPrefilter(a) + d[2], o = d[0]; o--;) l = l.lastChild;
            if (!de.leadingWhitespace && Ve.test(a) && y.push(t.createTextNode(Ve.exec(a)[0])), !de.tbody)
                for (o = (a = "table" !== u || Ye.test(a) ? "<table>" !== d[1] || Ye.test(a) ? 0 : l : l.firstChild) && a.childNodes.length; o--;) he.nodeName(c = a.childNodes[o], "tbody") && !c.childNodes.length && a.removeChild(c);
            for (he.merge(y, l.childNodes), l.textContent = ""; l.firstChild;) l.removeChild(l.firstChild);
            l = v.lastChild
        } else y.push(t.createTextNode(a));
        for (l && v.removeChild(l), de.appendChecked || he.grep(p(y, "input"), g), b = 0; a = y[b++];)
            if (i && he.inArray(a, i) > -1) r && r.push(a);
            else if (s = he.contains(a.ownerDocument, a), l = p(v.appendChild(a), "script"), s && m(l), n)
            for (o = 0; a = l[o++];) Xe.test(a.type || "") && n.push(a);
        return l = null, v
    }

    function y() {
        return !0
    }

    function b() {
        return !1
    }

    function x() {
        try {
            return ie.activeElement
        } catch (e) {}
    }

    function w(e, t, n, i, r, o) {
        var a, s;
        if ("object" == typeof t) {
            for (s in "string" != typeof n && (i = i || n, n = undefined), t) w(e, s, n, i, t[s], o);
            return e
        }
        if (null == i && null == r ? (r = n, i = n = undefined) : null == r && ("string" == typeof n ? (r = i, i = undefined) : (r = i, i = n, n = undefined)), !1 === r) r = b;
        else if (!r) return e;
        return 1 === o && (a = r, (r = function (e) {
            return he().off(e), a.apply(this, arguments)
        }).guid = a.guid || (a.guid = he.guid++)), e.each(function () {
            he.event.add(this, t, r, i, n)
        })
    }

    function C(e, t) {
        return he.nodeName(e, "table") && he.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }

    function T(e) {
        return e.type = (null !== he.find.attr(e, "type")) + "/" + e.type, e
    }

    function E(e) {
        var t = st.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function S(e, t) {
        if (1 === t.nodeType && he.hasData(e)) {
            var n, i, r, o = he._data(e),
                a = he._data(t, o),
                s = o.events;
            if (s)
                for (n in delete a.handle, a.events = {}, s)
                    for (i = 0, r = s[n].length; i < r; i++) he.event.add(t, n, s[n][i]);
            a.data && (a.data = he.extend({}, a.data))
        }
    }

    function k(e, t) {
        var n, i, r;
        if (1 === t.nodeType) {
            if (n = t.nodeName.toLowerCase(), !de.noCloneEvent && t[he.expando]) {
                for (i in (r = he._data(t)).events) he.removeEvent(t, i, r.handle);
                t.removeAttribute(he.expando)
            }
            "script" === n && t.text !== e.text ? (T(t).text = e.text, E(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), de.html5Clone && e.innerHTML && !he.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Be.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
        }
    }

    function N(e, t, n, i) {
        t = oe.apply([], t);
        var r, o, a, s, l, u, c = 0,
            d = e.length,
            f = d - 1,
            h = t[0],
            m = he.isFunction(h);
        if (m || d > 1 && "string" == typeof h && !de.checkClone && at.test(h)) return e.each(function (r) {
            var o = e.eq(r);
            m && (t[0] = h.call(this, r, o.html())), N(o, t, n, i)
        });
        if (d && (r = (u = v(t, e[0].ownerDocument, !1, e, i)).firstChild, 1 === u.childNodes.length && (u = r), r || i)) {
            for (a = (s = he.map(p(u, "script"), T)).length; c < d; c++) o = u, c !== f && (o = he.clone(o, !0, !0), a && he.merge(s, p(o, "script"))), n.call(e[c], o, c);
            if (a)
                for (l = s[s.length - 1].ownerDocument, he.map(s, E), c = 0; c < a; c++) o = s[c], Xe.test(o.type || "") && !he._data(o, "globalEval") && he.contains(l, o) && (o.src ? he._evalUrl && he._evalUrl(o.src) : he.globalEval((o.text || o.textContent || o.innerHTML || "").replace(lt, "")));
            u = r = null
        }
        return e
    }

    function j(e, t, n) {
        for (var i, r = t ? he.filter(t, e) : e, o = 0; null != (i = r[o]); o++) n || 1 !== i.nodeType || he.cleanData(p(i)), i.parentNode && (n && he.contains(i.ownerDocument, i) && m(p(i, "script")), i.parentNode.removeChild(i));
        return e
    }

    function A(e, t) {
        var n = he(t.createElement(e)).appendTo(t.body),
            i = he.css(n[0], "display");
        return n.detach(), i
    }

    function L(e) {
        var t = ie,
            n = dt[e];
        return n || ("none" !== (n = A(e, t)) && n || ((t = ((ct = (ct || he("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement))[0].contentWindow || ct[0].contentDocument).document).write(), t.close(), n = A(e, t), ct.detach()), dt[e] = n), n
    }

    function q(e, t) {
        return {
            get: function () {
                if (!e()) return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }

    function D(e) {
        if (e in kt) return e;
        for (var t = e.charAt(0).toUpperCase() + e.slice(1), n = St.length; n--;)
            if ((e = St[n] + t) in kt) return e
    }

    function $(e, t) {
        for (var n, i, r, o = [], a = 0, s = e.length; a < s; a++)(i = e[a]).style && (o[a] = he._data(i, "olddisplay"), n = i.style.display, t ? (o[a] || "none" !== n || (i.style.display = ""), "" === i.style.display && Oe(i) && (o[a] = he._data(i, "olddisplay", L(i.nodeName)))) : (r = Oe(i), (n && "none" !== n || !r) && he._data(i, "olddisplay", r ? n : he.css(i, "display"))));
        for (a = 0; a < s; a++)(i = e[a]).style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? o[a] || "" : "none"));
        return e
    }

    function F(e, t, n) {
        var i = Ct.exec(t);
        return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t
    }

    function M(e, t, n, i, r) {
        for (var o = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; o < 4; o += 2) "margin" === n && (a += he.css(e, n + _e[o], !0, r)), i ? ("content" === n && (a -= he.css(e, "padding" + _e[o], !0, r)), "margin" !== n && (a -= he.css(e, "border" + _e[o] + "Width", !0, r))) : (a += he.css(e, "padding" + _e[o], !0, r), "padding" !== n && (a += he.css(e, "border" + _e[o] + "Width", !0, r)));
        return a
    }

    function H(e, t, n) {
        var i = !0,
            r = "width" === t ? e.offsetWidth : e.offsetHeight,
            o = gt(e),
            a = de.boxSizing && "border-box" === he.css(e, "boxSizing", !1, o);
        if (r <= 0 || null == r) {
            if (((r = vt(e, t, o)) < 0 || null == r) && (r = e.style[t]), ht.test(r)) return r;
            i = a && (de.boxSizingReliable() || r === e.style[t]), r = parseFloat(r) || 0
        }
        return r + M(e, t, n || (a ? "border" : "content"), i, o) + "px"
    }

    function R(e, t, n, i, r) {
        return new R.prototype.init(e, t, n, i, r)
    }

    function P() {
        return e.setTimeout(function () {
            Nt = undefined
        }), Nt = he.now()
    }

    function I(e, t) {
        var n, i = {
                height: e
            },
            r = 0;
        for (t = t ? 1 : 0; r < 4; r += 2 - t) i["margin" + (n = _e[r])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e), i
    }

    function _(e, t, n) {
        for (var i, r = (B.tweeners[t] || []).concat(B.tweeners["*"]), o = 0, a = r.length; o < a; o++)
            if (i = r[o].call(n, t, e)) return i
    }

    function O(e, t, n) {
        var i, r, o, a, s, l, u, c = this,
            d = {},
            f = e.style,
            h = e.nodeType && Oe(e),
            p = he._data(e, "fxshow");
        for (i in n.queue || (null == (s = he._queueHooks(e, "fx")).unqueued && (s.unqueued = 0, l = s.empty.fire, s.empty.fire = function () {
                s.unqueued || l()
            }), s.unqueued++, c.always(function () {
                c.always(function () {
                    s.unqueued--, he.queue(e, "fx").length || s.empty.fire()
                })
            })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [f.overflow, f.overflowX, f.overflowY], "inline" === ("none" === (u = he.css(e, "display")) ? he._data(e, "olddisplay") || L(e.nodeName) : u) && "none" === he.css(e, "float") && (de.inlineBlockNeedsLayout && "inline" !== L(e.nodeName) ? f.zoom = 1 : f.display = "inline-block")), n.overflow && (f.overflow = "hidden", de.shrinkWrapBlocks() || c.always(function () {
                f.overflow = n.overflow[0], f.overflowX = n.overflow[1], f.overflowY = n.overflow[2]
            })), t)
            if (r = t[i], At.exec(r)) {
                if (delete t[i], o = o || "toggle" === r, r === (h ? "hide" : "show")) {
                    if ("show" !== r || !p || p[i] === undefined) continue;
                    h = !0
                }
                d[i] = p && p[i] || he.style(e, i)
            } else u = undefined;
        if (he.isEmptyObject(d)) "inline" === ("none" === u ? L(e.nodeName) : u) && (f.display = u);
        else
            for (i in p ? "hidden" in p && (h = p.hidden) : p = he._data(e, "fxshow", {}), o && (p.hidden = !h), h ? he(e).show() : c.done(function () {
                    he(e).hide()
                }), c.done(function () {
                    var t;
                    for (t in he._removeData(e, "fxshow"), d) he.style(e, t, d[t])
                }), d) a = _(h ? p[i] : 0, i, c), i in p || (p[i] = a.start, h && (a.end = a.start, a.start = "width" === i || "height" === i ? 1 : 0))
    }

    function z(e, t) {
        var n, i, r, o, a;
        for (n in e)
            if (r = t[i = he.camelCase(n)], o = e[n], he.isArray(o) && (r = o[1], o = e[n] = o[0]), n !== i && (e[i] = o, delete e[n]), (a = he.cssHooks[i]) && "expand" in a)
                for (n in o = a.expand(o), delete e[i], o) n in e || (e[n] = o[n], t[n] = r);
            else t[i] = r
    }

    function B(e, t, n) {
        var i, r, o = 0,
            a = B.prefilters.length,
            s = he.Deferred().always(function () {
                delete l.elem
            }),
            l = function () {
                if (r) return !1;
                for (var t = Nt || P(), n = Math.max(0, u.startTime + u.duration - t), i = 1 - (n / u.duration || 0), o = 0, a = u.tweens.length; o < a; o++) u.tweens[o].run(i);
                return s.notifyWith(e, [u, i, n]), i < 1 && a ? n : (s.resolveWith(e, [u]), !1)
            },
            u = s.promise({
                elem: e,
                props: he.extend({}, t),
                opts: he.extend(!0, {
                    specialEasing: {},
                    easing: he.easing._default
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: Nt || P(),
                duration: n.duration,
                tweens: [],
                createTween: function (t, n) {
                    var i = he.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
                    return u.tweens.push(i), i
                },
                stop: function (t) {
                    var n = 0,
                        i = t ? u.tweens.length : 0;
                    if (r) return this;
                    for (r = !0; n < i; n++) u.tweens[n].run(1);
                    return t ? (s.notifyWith(e, [u, 1, 0]), s.resolveWith(e, [u, t])) : s.rejectWith(e, [u, t]), this
                }
            }),
            c = u.props;
        for (z(c, u.opts.specialEasing); o < a; o++)
            if (i = B.prefilters[o].call(u, e, c, u.opts)) return he.isFunction(i.stop) && (he._queueHooks(u.elem, u.opts.queue).stop = he.proxy(i.stop, i)), i;
        return he.map(c, _, u), he.isFunction(u.opts.start) && u.opts.start.call(e, u), he.fx.timer(he.extend(l, {
            elem: e,
            anim: u,
            queue: u.opts.queue
        })), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always)
    }

    function W(e) {
        return he.attr(e, "class") || ""
    }

    function X(e) {
        return function (t, n) {
            "string" != typeof t && (n = t, t = "*");
            var i, r = 0,
                o = t.toLowerCase().match(Le) || [];
            if (he.isFunction(n))
                for (; i = o[r++];) "+" === i.charAt(0) ? (i = i.slice(1) || "*", (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
        }
    }

    function V(e, t, n, i) {
        function r(s) {
            var l;
            return o[s] = !0, he.each(e[s] || [], function (e, s) {
                var u = s(t, n, i);
                return "string" != typeof u || a || o[u] ? a ? !(l = u) : void 0 : (t.dataTypes.unshift(u), r(u), !1)
            }), l
        }
        var o = {},
            a = e === en;
        return r(t.dataTypes[0]) || !o["*"] && r("*")
    }

    function U(e, t) {
        var n, i, r = he.ajaxSettings.flatOptions || {};
        for (i in t) t[i] !== undefined && ((r[i] ? e : n || (n = {}))[i] = t[i]);
        return n && he.extend(!0, e, n), e
    }

    function G(e, t, n) {
        for (var i, r, o, a, s = e.contents, l = e.dataTypes;
            "*" === l[0];) l.shift(), r === undefined && (r = e.mimeType || t.getResponseHeader("Content-Type"));
        if (r)
            for (a in s)
                if (s[a] && s[a].test(r)) {
                    l.unshift(a);
                    break
                } if (l[0] in n) o = l[0];
        else {
            for (a in n) {
                if (!l[0] || e.converters[a + " " + l[0]]) {
                    o = a;
                    break
                }
                i || (i = a)
            }
            o = o || i
        }
        if (o) return o !== l[0] && l.unshift(o), n[o]
    }

    function J(e, t, n, i) {
        var r, o, a, s, l, u = {},
            c = e.dataTypes.slice();
        if (c[1])
            for (a in e.converters) u[a.toLowerCase()] = e.converters[a];
        for (o = c.shift(); o;)
            if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = c.shift())
                if ("*" === o) o = l;
                else if ("*" !== l && l !== o) {
            if (!(a = u[l + " " + o] || u["* " + o]))
                for (r in u)
                    if ((s = r.split(" "))[1] === o && (a = u[l + " " + s[0]] || u["* " + s[0]])) {
                        !0 === a ? a = u[r] : !0 !== u[r] && (o = s[0], c.unshift(s[1]));
                        break
                    } if (!0 !== a)
                if (a && e.throws) t = a(t);
                else try {
                    t = a(t)
                } catch (d) {
                    return {
                        state: "parsererror",
                        error: a ? d : "No conversion from " + l + " to " + o
                    }
                }
        }
        return {
            state: "success",
            data: t
        }
    }

    function Y(e) {
        return e.style && e.style.display || he.css(e, "display")
    }

    function Q(e) {
        if (!he.contains(e.ownerDocument || ie, e)) return !0;
        for (; e && 1 === e.nodeType;) {
            if ("none" === Y(e) || "hidden" === e.type) return !0;
            e = e.parentNode
        }
        return !1
    }

    function K(e, t, n, i) {
        var r;
        if (he.isArray(t)) he.each(t, function (t, r) {
            n || an.test(e) ? i(e, r) : K(e + "[" + ("object" == typeof r && null != r ? t : "") + "]", r, n, i)
        });
        else if (n || "object" !== he.type(t)) i(e, t);
        else
            for (r in t) K(e + "[" + r + "]", t[r], n, i)
    }

    function Z() {
        try {
            return new e.XMLHttpRequest
        } catch (t) {}
    }

    function ee() {
        try {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) {}
    }

    function te(e) {
        return he.isWindow(e) ? e : 9 === e.nodeType && (e.defaultView || e.parentWindow)
    }
    var ne = [],
        ie = e.document,
        re = ne.slice,
        oe = ne.concat,
        ae = ne.push,
        se = ne.indexOf,
        le = {},
        ue = le.toString,
        ce = le.hasOwnProperty,
        de = {},
        fe = "1.12.4",
        he = function (e, t) {
            return new he.fn.init(e, t)
        },
        pe = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        me = /^-ms-/,
        ge = /-([\da-z])/gi,
        ve = function (e, t) {
            return t.toUpperCase()
        };
    he.fn = he.prototype = {
        jquery: fe,
        constructor: he,
        selector: "",
        length: 0,
        toArray: function () {
            return re.call(this)
        },
        get: function (e) {
            return null != e ? e < 0 ? this[e + this.length] : this[e] : re.call(this)
        },
        pushStack: function (e) {
            var t = he.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        },
        each: function (e) {
            return he.each(this, e)
        },
        map: function (e) {
            return this.pushStack(he.map(this, function (t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function () {
            return this.pushStack(re.apply(this, arguments))
        },
        first: function () {
            return this.eq(0)
        },
        last: function () {
            return this.eq(-1)
        },
        eq: function (e) {
            var t = this.length,
                n = +e + (e < 0 ? t : 0);
            return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
        },
        end: function () {
            return this.prevObject || this.constructor()
        },
        push: ae,
        sort: ne.sort,
        splice: ne.splice
    }, he.extend = he.fn.extend = function () {
        var e, t, n, i, r, o, a = arguments[0] || {},
            s = 1,
            l = arguments.length,
            u = !1;
        for ("boolean" == typeof a && (u = a, a = arguments[s] || {}, s++), "object" == typeof a || he.isFunction(a) || (a = {}), s === l && (a = this, s--); s < l; s++)
            if (null != (r = arguments[s]))
                for (i in r) e = a[i], a !== (n = r[i]) && (u && n && (he.isPlainObject(n) || (t = he.isArray(n))) ? (t ? (t = !1, o = e && he.isArray(e) ? e : []) : o = e && he.isPlainObject(e) ? e : {}, a[i] = he.extend(u, o, n)) : n !== undefined && (a[i] = n));
        return a
    }, he.extend({
        expando: "jQuery" + (fe + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function (e) {
            throw new Error(e)
        },
        noop: function () {},
        isFunction: function (e) {
            return "function" === he.type(e)
        },
        isArray: Array.isArray || function (e) {
            return "array" === he.type(e)
        },
        isWindow: function (e) {
            return null != e && e == e.window
        },
        isNumeric: function (e) {
            var t = e && e.toString();
            return !he.isArray(e) && t - parseFloat(t) + 1 >= 0
        },
        isEmptyObject: function (e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        isPlainObject: function (e) {
            var t;
            if (!e || "object" !== he.type(e) || e.nodeType || he.isWindow(e)) return !1;
            try {
                if (e.constructor && !ce.call(e, "constructor") && !ce.call(e.constructor.prototype, "isPrototypeOf")) return !1
            } catch (n) {
                return !1
            }
            if (!de.ownFirst)
                for (t in e) return ce.call(e, t);
            for (t in e);
            return t === undefined || ce.call(e, t)
        },
        type: function (e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? le[ue.call(e)] || "object" : typeof e
        },
        globalEval: function (t) {
            t && he.trim(t) && (e.execScript || function (t) {
                e.eval.call(e, t)
            })(t)
        },
        camelCase: function (e) {
            return e.replace(me, "ms-").replace(ge, ve)
        },
        nodeName: function (e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function (e, t) {
            var i, r = 0;
            if (n(e))
                for (i = e.length; r < i && !1 !== t.call(e[r], r, e[r]); r++);
            else
                for (r in e)
                    if (!1 === t.call(e[r], r, e[r])) break;
            return e
        },
        trim: function (e) {
            return null == e ? "" : (e + "").replace(pe, "")
        },
        makeArray: function (e, t) {
            var i = t || [];
            return null != e && (n(Object(e)) ? he.merge(i, "string" == typeof e ? [e] : e) : ae.call(i, e)), i
        },
        inArray: function (e, t, n) {
            var i;
            if (t) {
                if (se) return se.call(t, e, n);
                for (i = t.length, n = n ? n < 0 ? Math.max(0, i + n) : n : 0; n < i; n++)
                    if (n in t && t[n] === e) return n
            }
            return -1
        },
        merge: function (e, t) {
            for (var n = +t.length, i = 0, r = e.length; i < n;) e[r++] = t[i++];
            if (n != n)
                for (; t[i] !== undefined;) e[r++] = t[i++];
            return e.length = r, e
        },
        grep: function (e, t, n) {
            for (var i = [], r = 0, o = e.length, a = !n; r < o; r++) !t(e[r], r) !== a && i.push(e[r]);
            return i
        },
        map: function (e, t, i) {
            var r, o, a = 0,
                s = [];
            if (n(e))
                for (r = e.length; a < r; a++) null != (o = t(e[a], a, i)) && s.push(o);
            else
                for (a in e) null != (o = t(e[a], a, i)) && s.push(o);
            return oe.apply([], s)
        },
        guid: 1,
        proxy: function (e, t) {
            var n, i, r;
            return "string" == typeof t && (r = e[t], t = e, e = r), he.isFunction(e) ? (n = re.call(arguments, 2), (i = function () {
                return e.apply(t || this, n.concat(re.call(arguments)))
            }).guid = e.guid = e.guid || he.guid++, i) : undefined
        },
        now: function () {
            return +new Date
        },
        support: de
    }), "function" == typeof Symbol && (he.fn[Symbol.iterator] = ne[Symbol.iterator]), he.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (e, t) {
        le["[object " + t + "]"] = t.toLowerCase()
    });
    var ye =
       
        function (e) {
            function t(e, t, n, i) {
                var r, o, a, s, l, u, d, h, p = t && t.ownerDocument,
                    m = t ? t.nodeType : 9;
                if (n = n || [], "string" != typeof e || !e || 1 !== m && 9 !== m && 11 !== m) return n;
                if (!i && ((t ? t.ownerDocument || t : _) !== D && q(t), t = t || D, F)) {
                    if (11 !== m && (u = ve.exec(e)))
                        if (r = u[1]) {
                            if (9 === m) {
                                if (!(a = t.getElementById(r))) return n;
                                if (a.id === r) return n.push(a), n
                            } else if (p && (a = p.getElementById(r)) && P(t, a) && a.id === r) return n.push(a), n
                        } else {
                            if (u[2]) return K.apply(n, t.getElementsByTagName(e)), n;
                            if ((r = u[3]) && w.getElementsByClassName && t.getElementsByClassName) return K.apply(n, t.getElementsByClassName(r)), n
                        } if (w.qsa && !X[e + " "] && (!M || !M.test(e))) {
                        if (1 !== m) p = t, h = e;
                        else if ("object" !== t.nodeName.toLowerCase()) {
                            for ((s = t.getAttribute("id")) ? s = s.replace(be, "\\$&") : t.setAttribute("id", s = I), o = (d = S(e)).length, l = fe.test(s) ? "#" + s : "[id='" + s + "']"; o--;) d[o] = l + " " + f(d[o]);
                            h = d.join(","), p = ye.test(e) && c(t.parentNode) || t
                        }
                        if (h) try {
                            return K.apply(n, p.querySelectorAll(h)), n
                        } catch (g) {} finally {
                            s === I && t.removeAttribute("id")
                        }
                    }
                }
                return N(e.replace(se, "$1"), t, n, i)
            }

            function n() {
                function e(n, i) {
                    return t.push(n + " ") > C.cacheLength && delete e[t.shift()], e[n + " "] = i
                }
                var t = [];
                return e
            }

            function i(e) {
                return e[I] = !0, e
            }

            function r(e) {
                var t = D.createElement("div");
                try {
                    return !!e(t)
                } catch (n) {
                    return !1
                } finally {
                    t.parentNode && t.parentNode.removeChild(t), t = null
                }
            }

            function o(e, t) {
                for (var n = e.split("|"), i = n.length; i--;) C.attrHandle[n[i]] = t
            }

            function a(e, t) {
                var n = t && e,
                    i = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || U) - (~e.sourceIndex || U);
                if (i) return i;
                if (n)
                    for (; n = n.nextSibling;)
                        if (n === t) return -1;
                return e ? 1 : -1
            }

            function s(e) {
                return function (t) {
                    return "input" === t.nodeName.toLowerCase() && t.type === e
                }
            }

            function l(e) {
                return function (t) {
                    var n = t.nodeName.toLowerCase();
                    return ("input" === n || "button" === n) && t.type === e
                }
            }

            function u(e) {
                return i(function (t) {
                    return t = +t, i(function (n, i) {
                        for (var r, o = e([], n.length, t), a = o.length; a--;) n[r = o[a]] && (n[r] = !(i[r] = n[r]))
                    })
                })
            }

            function c(e) {
                return e && "undefined" != typeof e.getElementsByTagName && e
            }

            function d() {}

            function f(e) {
                for (var t = 0, n = e.length, i = ""; t < n; t++) i += e[t].value;
                return i
            }

            function h(e, t, n) {
                var i = t.dir,
                    r = n && "parentNode" === i,
                    o = z++;
                return t.first ? function (t, n, o) {
                    for (; t = t[i];)
                        if (1 === t.nodeType || r) return e(t, n, o)
                } : function (t, n, a) {
                    var s, l, u, c = [O, o];
                    if (a) {
                        for (; t = t[i];)
                            if ((1 === t.nodeType || r) && e(t, n, a)) return !0
                    } else
                        for (; t = t[i];)
                            if (1 === t.nodeType || r) {
                                if ((s = (l = (u = t[I] || (t[I] = {}))[t.uniqueID] || (u[t.uniqueID] = {}))[i]) && s[0] === O && s[1] === o) return c[2] = s[2];
                                if (l[i] = c, c[2] = e(t, n, a)) return !0
                            }
                }
            }

            function p(e) {
                return e.length > 1 ? function (t, n, i) {
                    for (var r = e.length; r--;)
                        if (!e[r](t, n, i)) return !1;
                    return !0
                } : e[0]
            }

            function m(e, n, i) {
                for (var r = 0, o = n.length; r < o; r++) t(e, n[r], i);
                return i
            }

            function g(e, t, n, i, r) {
                for (var o, a = [], s = 0, l = e.length, u = null != t; s < l; s++)(o = e[s]) && (n && !n(o, i, r) || (a.push(o), u && t.push(s)));
                return a
            }

            function v(e, t, n, r, o, a) {
                return r && !r[I] && (r = v(r)), o && !o[I] && (o = v(o, a)), i(function (i, a, s, l) {
                    var u, c, d, f = [],
                        h = [],
                        p = a.length,
                        v = i || m(t || "*", s.nodeType ? [s] : s, []),
                        y = !e || !i && t ? v : g(v, f, e, s, l),
                        b = n ? o || (i ? e : p || r) ? [] : a : y;
                    if (n && n(y, b, s, l), r)
                        for (u = g(b, h), r(u, [], s, l), c = u.length; c--;)(d = u[c]) && (b[h[c]] = !(y[h[c]] = d));
                    if (i) {
                        if (o || e) {
                            if (o) {
                                for (u = [], c = b.length; c--;)(d = b[c]) && u.push(y[c] = d);
                                o(null, b = [], u, l)
                            }
                            for (c = b.length; c--;)(d = b[c]) && (u = o ? ee(i, d) : f[c]) > -1 && (i[u] = !(a[u] = d))
                        }
                    } else b = g(b === a ? b.splice(p, b.length) : b), o ? o(null, a, b, l) : K.apply(a, b)
                })
            }

            function y(e) {
                for (var t, n, i, r = e.length, o = C.relative[e[0].type], a = o || C.relative[" "], s = o ? 1 : 0, l = h(function (e) {
                        return e === t
                    }, a, !0), u = h(function (e) {
                        return ee(t, e) > -1
                    }, a, !0), c = [function (e, n, i) {
                        var r = !o && (i || n !== j) || ((t = n).nodeType ? l(e, n, i) : u(e, n, i));
                        return t = null, r
                    }]; s < r; s++)
                    if (n = C.relative[e[s].type]) c = [h(p(c), n)];
                    else {
                        if ((n = C.filter[e[s].type].apply(null, e[s].matches))[I]) {
                            for (i = ++s; i < r && !C.relative[e[i].type]; i++);
                            return v(s > 1 && p(c), s > 1 && f(e.slice(0, s - 1).concat({
                                value: " " === e[s - 2].type ? "*" : ""
                            })).replace(se, "$1"), n, s < i && y(e.slice(s, i)), i < r && y(e = e.slice(i)), i < r && f(e))
                        }
                        c.push(n)
                    } return p(c)
            }

            function b(e, n) {
                var r = n.length > 0,
                    o = e.length > 0,
                    a = function (i, a, s, l, u) {
                        var c, d, f, h = 0,
                            p = "0",
                            m = i && [],
                            v = [],
                            y = j,
                            b = i || o && C.find.TAG("*", u),
                            x = O += null == y ? 1 : Math.random() || .1,
                            w = b.length;
                        for (u && (j = a === D || a || u); p !== w && null != (c = b[p]); p++) {
                            if (o && c) {
                                for (d = 0, a || c.ownerDocument === D || (q(c), s = !F); f = e[d++];)
                                    if (f(c, a || D, s)) {
                                        l.push(c);
                                        break
                                    } u && (O = x)
                            }
                            r && ((c = !f && c) && h--, i && m.push(c))
                        }
                        if (h += p, r && p !== h) {
                            for (d = 0; f = n[d++];) f(m, v, a, s);
                            if (i) {
                                if (h > 0)
                                    for (; p--;) m[p] || v[p] || (v[p] = Y.call(l));
                                v = g(v)
                            }
                            K.apply(l, v), u && !i && v.length > 0 && h + n.length > 1 && t.uniqueSort(l)
                        }
                        return u && (O = x, j = y), m
                    };
                return r ? i(a) : a
            }
            var x, w, C, T, E, S, k, N, j, A, L, q, D, $, F, M, H, R, P, I = "sizzle" + 1 * new Date,
                _ = e.document,
                O = 0,
                z = 0,
                B = n(),
                W = n(),
                X = n(),
                V = function (e, t) {
                    return e === t && (L = !0), 0
                },
                U = 1 << 31,
                G = {}.hasOwnProperty,
                J = [],
                Y = J.pop,
                Q = J.push,
                K = J.push,
                Z = J.slice,
                ee = function (e, t) {
                    for (var n = 0, i = e.length; n < i; n++)
                        if (e[n] === t) return n;
                    return -1
                },
                te = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                ne = "[\\x20\\t\\r\\n\\f]",
                ie = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                re = "\\[" + ne + "*(" + ie + ")(?:" + ne + "*([*^$|!~]?=)" + ne + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ie + "))|)" + ne + "*\\]",
                oe = ":(" + ie + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + re + ")*)|.*)\\)|)",
                ae = new RegExp(ne + "+", "g"),
                se = new RegExp("^" + ne + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ne + "+$", "g"),
                le = new RegExp("^" + ne + "*," + ne + "*"),
                ue = new RegExp("^" + ne + "*([>+~]|" + ne + ")" + ne + "*"),
                ce = new RegExp("=" + ne + "*([^\\]'\"]*?)" + ne + "*\\]", "g"),
                de = new RegExp(oe),
                fe = new RegExp("^" + ie + "$"),
                he = {
                    ID: new RegExp("^#(" + ie + ")"),
                    CLASS: new RegExp("^\\.(" + ie + ")"),
                    TAG: new RegExp("^(" + ie + "|[*])"),
                    ATTR: new RegExp("^" + re),
                    PSEUDO: new RegExp("^" + oe),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ne + "*(even|odd|(([+-]|)(\\d*)n|)" + ne + "*(?:([+-]|)" + ne + "*(\\d+)|))" + ne + "*\\)|)", "i"),
                    bool: new RegExp("^(?:" + te + ")$", "i"),
                    needsContext: new RegExp("^" + ne + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ne + "*((?:-\\d)?\\d*)" + ne + "*\\)|)(?=[^-]|$)", "i")
                },
                pe = /^(?:input|select|textarea|button)$/i,
                me = /^h\d$/i,
                ge = /^[^{]+\{\s*\[native \w/,
                ve = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                ye = /[+~]/,
                be = /'|\\/g,
                xe = new RegExp("\\\\([\\da-f]{1,6}" + ne + "?|(" + ne + ")|.)", "ig"),
                we = function (e, t, n) {
                    var i = "0x" + t - 65536;
                    return i != i || n ? t : i < 0 ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
                },
                Ce = function () {
                    q()
                };
            try {
                K.apply(J = Z.call(_.childNodes), _.childNodes), J[_.childNodes.length].nodeType
            } catch (Te) {
                K = {
                    apply: J.length ? function (e, t) {
                        Q.apply(e, Z.call(t))
                    } : function (e, t) {
                        for (var n = e.length, i = 0; e[n++] = t[i++];);
                        e.length = n - 1
                    }
                }
            }
            for (x in w = t.support = {}, E = t.isXML = function (e) {
                    var t = e && (e.ownerDocument || e).documentElement;
                    return !!t && "HTML" !== t.nodeName
                }, q = t.setDocument = function (e) {
                    var t, n, i = e ? e.ownerDocument || e : _;
                    return i !== D && 9 === i.nodeType && i.documentElement ? ($ = (D = i).documentElement, F = !E(D), (n = D.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", Ce, !1) : n.attachEvent && n.attachEvent("onunload", Ce)), w.attributes = r(function (e) {
                        return e.className = "i", !e.getAttribute("className")
                    }), w.getElementsByTagName = r(function (e) {
                        return e.appendChild(D.createComment("")), !e.getElementsByTagName("*").length
                    }), w.getElementsByClassName = ge.test(D.getElementsByClassName), w.getById = r(function (e) {
                        return $.appendChild(e).id = I, !D.getElementsByName || !D.getElementsByName(I).length
                    }), w.getById ? (C.find.ID = function (e, t) {
                        if ("undefined" != typeof t.getElementById && F) {
                            var n = t.getElementById(e);
                            return n ? [n] : []
                        }
                    }, C.filter.ID = function (e) {
                        var t = e.replace(xe, we);
                        return function (e) {
                            return e.getAttribute("id") === t
                        }
                    }) : (delete C.find.ID, C.filter.ID = function (e) {
                        var t = e.replace(xe, we);
                        return function (e) {
                            var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                            return n && n.value === t
                        }
                    }), C.find.TAG = w.getElementsByTagName ? function (e, t) {
                        return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : w.qsa ? t.querySelectorAll(e) : void 0
                    } : function (e, t) {
                        var n, i = [],
                            r = 0,
                            o = t.getElementsByTagName(e);
                        if ("*" === e) {
                            for (; n = o[r++];) 1 === n.nodeType && i.push(n);
                            return i
                        }
                        return o
                    }, C.find.CLASS = w.getElementsByClassName && function (e, t) {
                        if ("undefined" != typeof t.getElementsByClassName && F) return t.getElementsByClassName(e)
                    }, H = [], M = [], (w.qsa = ge.test(D.querySelectorAll)) && (r(function (e) {
                        $.appendChild(e).innerHTML = "<a id='" + I + "'></a><select id='" + I + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && M.push("[*^$]=" + ne + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || M.push("\\[" + ne + "*(?:value|" + te + ")"), e.querySelectorAll("[id~=" + I + "-]").length || M.push("~="), e.querySelectorAll(":checked").length || M.push(":checked"), e.querySelectorAll("a#" + I + "+*").length || M.push(".#.+[+~]")
                    }), r(function (e) {
                        var t = D.createElement("input");
                        t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && M.push("name" + ne + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || M.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), M.push(",.*:")
                    })), (w.matchesSelector = ge.test(R = $.matches || $.webkitMatchesSelector || $.mozMatchesSelector || $.oMatchesSelector || $.msMatchesSelector)) && r(function (e) {
                        w.disconnectedMatch = R.call(e, "div"), R.call(e, "[s!='']:x"), H.push("!=", oe)
                    }), M = M.length && new RegExp(M.join("|")), H = H.length && new RegExp(H.join("|")), t = ge.test($.compareDocumentPosition), P = t || ge.test($.contains) ? function (e, t) {
                        var n = 9 === e.nodeType ? e.documentElement : e,
                            i = t && t.parentNode;
                        return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
                    } : function (e, t) {
                        if (t)
                            for (; t = t.parentNode;)
                                if (t === e) return !0;
                        return !1
                    }, V = t ? function (e, t) {
                        if (e === t) return L = !0, 0;
                        var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                        return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !w.sortDetached && t.compareDocumentPosition(e) === n ? e === D || e.ownerDocument === _ && P(_, e) ? -1 : t === D || t.ownerDocument === _ && P(_, t) ? 1 : A ? ee(A, e) - ee(A, t) : 0 : 4 & n ? -1 : 1)
                    } : function (e, t) {
                        if (e === t) return L = !0, 0;
                        var n, i = 0,
                            r = e.parentNode,
                            o = t.parentNode,
                            s = [e],
                            l = [t];
                        if (!r || !o) return e === D ? -1 : t === D ? 1 : r ? -1 : o ? 1 : A ? ee(A, e) - ee(A, t) : 0;
                        if (r === o) return a(e, t);
                        for (n = e; n = n.parentNode;) s.unshift(n);
                        for (n = t; n = n.parentNode;) l.unshift(n);
                        for (; s[i] === l[i];) i++;
                        return i ? a(s[i], l[i]) : s[i] === _ ? -1 : l[i] === _ ? 1 : 0
                    }, D) : D
                }, t.matches = function (e, n) {
                    return t(e, null, null, n)
                }, t.matchesSelector = function (e, n) {
                    if ((e.ownerDocument || e) !== D && q(e), n = n.replace(ce, "='$1']"), w.matchesSelector && F && !X[n + " "] && (!H || !H.test(n)) && (!M || !M.test(n))) try {
                        var i = R.call(e, n);
                        if (i || w.disconnectedMatch || e.document && 11 !== e.document.nodeType) return i
                    } catch (Te) {}
                    return t(n, D, null, [e]).length > 0
                }, t.contains = function (e, t) {
                    return (e.ownerDocument || e) !== D && q(e), P(e, t)
                }, t.attr = function (e, t) {
                    (e.ownerDocument || e) !== D && q(e);
                    var n = C.attrHandle[t.toLowerCase()],
                        i = n && G.call(C.attrHandle, t.toLowerCase()) ? n(e, t, !F) : undefined;
                    return i !== undefined ? i : w.attributes || !F ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
                }, t.error = function (e) {
                    throw new Error("Syntax error, unrecognized expression: " + e)
                }, t.uniqueSort = function (e) {
                    var t, n = [],
                        i = 0,
                        r = 0;
                    if (L = !w.detectDuplicates, A = !w.sortStable && e.slice(0), e.sort(V), L) {
                        for (; t = e[r++];) t === e[r] && (i = n.push(r));
                        for (; i--;) e.splice(n[i], 1)
                    }
                    return A = null, e
                }, T = t.getText = function (e) {
                    var t, n = "",
                        i = 0,
                        r = e.nodeType;
                    if (r) {
                        if (1 === r || 9 === r || 11 === r) {
                            if ("string" == typeof e.textContent) return e.textContent;
                            for (e = e.firstChild; e; e = e.nextSibling) n += T(e)
                        } else if (3 === r || 4 === r) return e.nodeValue
                    } else
                        for (; t = e[i++];) n += T(t);
                    return n
                }, (C = t.selectors = {
                    cacheLength: 50,
                    createPseudo: i,
                    match: he,
                    attrHandle: {},
                    find: {},
                    relative: {
                        ">": {
                            dir: "parentNode",
                            first: !0
                        },
                        " ": {
                            dir: "parentNode"
                        },
                        "+": {
                            dir: "previousSibling",
                            first: !0
                        },
                        "~": {
                            dir: "previousSibling"
                        }
                    },
                    preFilter: {
                        ATTR: function (e) {
                            return e[1] = e[1].replace(xe, we), e[3] = (e[3] || e[4] || e[5] || "").replace(xe, we), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                        },
                        CHILD: function (e) {
                            return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                        },
                        PSEUDO: function (e) {
                            var t, n = !e[6] && e[2];
                            return he.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && de.test(n) && (t = S(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                        }
                    },
                    filter: {
                        TAG: function (e) {
                            var t = e.replace(xe, we).toLowerCase();
                            return "*" === e ? function () {
                                return !0
                            } : function (e) {
                                return e.nodeName && e.nodeName.toLowerCase() === t
                            }
                        },
                        CLASS: function (e) {
                            var t = B[e + " "];
                            return t || (t = new RegExp("(^|" + ne + ")" + e + "(" + ne + "|$)")) && B(e, function (e) {
                                return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                            })
                        },
                        ATTR: function (e, n, i) {
                            return function (r) {
                                var o = t.attr(r, e);
                                return null == o ? "!=" === n : !n || (o += "", "=" === n ? o === i : "!=" === n ? o !== i : "^=" === n ? i && 0 === o.indexOf(i) : "*=" === n ? i && o.indexOf(i) > -1 : "$=" === n ? i && o.slice(-i.length) === i : "~=" === n ? (" " + o.replace(ae, " ") + " ").indexOf(i) > -1 : "|=" === n && (o === i || o.slice(0, i.length + 1) === i + "-"))
                            }
                        },
                        CHILD: function (e, t, n, i, r) {
                            var o = "nth" !== e.slice(0, 3),
                                a = "last" !== e.slice(-4),
                                s = "of-type" === t;
                            return 1 === i && 0 === r ? function (e) {
                                return !!e.parentNode
                            } : function (t, n, l) {
                                var u, c, d, f, h, p, m = o !== a ? "nextSibling" : "previousSibling",
                                    g = t.parentNode,
                                    v = s && t.nodeName.toLowerCase(),
                                    y = !l && !s,
                                    b = !1;
                                if (g) {
                                    if (o) {
                                        for (; m;) {
                                            for (f = t; f = f[m];)
                                                if (s ? f.nodeName.toLowerCase() === v : 1 === f.nodeType) return !1;
                                            p = m = "only" === e && !p && "nextSibling"
                                        }
                                        return !0
                                    }
                                    if (p = [a ? g.firstChild : g.lastChild], a && y) {
                                        for (b = (h = (u = (c = (d = (f = g)[I] || (f[I] = {}))[f.uniqueID] || (d[f.uniqueID] = {}))[e] || [])[0] === O && u[1]) && u[2], f = h && g.childNodes[h]; f = ++h && f && f[m] || (b = h = 0) || p.pop();)
                                            if (1 === f.nodeType && ++b && f === t) {
                                                c[e] = [O, h, b];
                                                break
                                            }
                                    } else if (y && (b = h = (u = (c = (d = (f = t)[I] || (f[I] = {}))[f.uniqueID] || (d[f.uniqueID] = {}))[e] || [])[0] === O && u[1]), !1 === b)
                                        for (;
                                            (f = ++h && f && f[m] || (b = h = 0) || p.pop()) && ((s ? f.nodeName.toLowerCase() !== v : 1 !== f.nodeType) || !++b || (y && ((c = (d = f[I] || (f[I] = {}))[f.uniqueID] || (d[f.uniqueID] = {}))[e] = [O, b]), f !== t)););
                                    return (b -= r) === i || b % i == 0 && b / i >= 0
                                }
                            }
                        },
                        PSEUDO: function (e, n) {
                            var r, o = C.pseudos[e] || C.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                            return o[I] ? o(n) : o.length > 1 ? (r = [e, e, "", n], C.setFilters.hasOwnProperty(e.toLowerCase()) ? i(function (e, t) {
                                for (var i, r = o(e, n), a = r.length; a--;) e[i = ee(e, r[a])] = !(t[i] = r[a])
                            }) : function (e) {
                                return o(e, 0, r)
                            }) : o
                        }
                    },
                    pseudos: {
                        not: i(function (e) {
                            var t = [],
                                n = [],
                                r = k(e.replace(se, "$1"));
                            return r[I] ? i(function (e, t, n, i) {
                                for (var o, a = r(e, null, i, []), s = e.length; s--;)(o = a[s]) && (e[s] = !(t[s] = o))
                            }) : function (e, i, o) {
                                return t[0] = e, r(t, null, o, n), t[0] = null, !n.pop()
                            }
                        }),
                        has: i(function (e) {
                            return function (n) {
                                return t(e, n).length > 0
                            }
                        }),
                        contains: i(function (e) {
                            return e = e.replace(xe, we),
                                function (t) {
                                    return (t.textContent || t.innerText || T(t)).indexOf(e) > -1
                                }
                        }),
                        lang: i(function (e) {
                            return fe.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(xe, we).toLowerCase(),
                                function (t) {
                                    var n;
                                    do {
                                        if (n = F ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
                                    } while ((t = t.parentNode) && 1 === t.nodeType);
                                    return !1
                                }
                        }),
                        target: function (t) {
                            var n = e.location && e.location.hash;
                            return n && n.slice(1) === t.id
                        },
                        root: function (e) {
                            return e === $
                        },
                        focus: function (e) {
                            return e === D.activeElement && (!D.hasFocus || D.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                        },
                        enabled: function (e) {
                            return !1 === e.disabled
                        },
                        disabled: function (e) {
                            return !0 === e.disabled
                        },
                        checked: function (e) {
                            var t = e.nodeName.toLowerCase();
                            return "input" === t && !!e.checked || "option" === t && !!e.selected
                        },
                        selected: function (e) {
                            return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                        },
                        empty: function (e) {
                            for (e = e.firstChild; e; e = e.nextSibling)
                                if (e.nodeType < 6) return !1;
                            return !0
                        },
                        parent: function (e) {
                            return !C.pseudos.empty(e)
                        },
                        header: function (e) {
                            return me.test(e.nodeName)
                        },
                        input: function (e) {
                            return pe.test(e.nodeName)
                        },
                        button: function (e) {
                            var t = e.nodeName.toLowerCase();
                            return "input" === t && "button" === e.type || "button" === t
                        },
                        text: function (e) {
                            var t;
                            return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                        },
                        first: u(function () {
                            return [0]
                        }),
                        last: u(function (e, t) {
                            return [t - 1]
                        }),
                        eq: u(function (e, t, n) {
                            return [n < 0 ? n + t : n]
                        }),
                        even: u(function (e, t) {
                            for (var n = 0; n < t; n += 2) e.push(n);
                            return e
                        }),
                        odd: u(function (e, t) {
                            for (var n = 1; n < t; n += 2) e.push(n);
                            return e
                        }),
                        lt: u(function (e, t, n) {
                            for (var i = n < 0 ? n + t : n; --i >= 0;) e.push(i);
                            return e
                        }),
                        gt: u(function (e, t, n) {
                            for (var i = n < 0 ? n + t : n; ++i < t;) e.push(i);
                            return e
                        })
                    }
                }).pseudos.nth = C.pseudos.eq, {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                }) C.pseudos[x] = s(x);
            for (x in {
                    submit: !0,
                    reset: !0
                }) C.pseudos[x] = l(x);
            return d.prototype = C.filters = C.pseudos, C.setFilters = new d, S = t.tokenize = function (e, n) {
                var i, r, o, a, s, l, u, c = W[e + " "];
                if (c) return n ? 0 : c.slice(0);
                for (s = e, l = [], u = C.preFilter; s;) {
                    for (a in i && !(r = le.exec(s)) || (r && (s = s.slice(r[0].length) || s), l.push(o = [])), i = !1, (r = ue.exec(s)) && (i = r.shift(), o.push({
                            value: i,
                            type: r[0].replace(se, " ")
                        }), s = s.slice(i.length)), C.filter) !(r = he[a].exec(s)) || u[a] && !(r = u[a](r)) || (i = r.shift(), o.push({
                        value: i,
                        type: a,
                        matches: r
                    }), s = s.slice(i.length));
                    if (!i) break
                }
                return n ? s.length : s ? t.error(e) : W(e, l).slice(0)
            }, k = t.compile = function (e, t) {
                var n, i = [],
                    r = [],
                    o = X[e + " "];
                if (!o) {
                    for (t || (t = S(e)), n = t.length; n--;)(o = y(t[n]))[I] ? i.push(o) : r.push(o);
                    (o = X(e, b(r, i))).selector = e
                }
                return o
            }, N = t.select = function (e, t, n, i) {
                var r, o, a, s, l, u = "function" == typeof e && e,
                    d = !i && S(e = u.selector || e);
                if (n = n || [], 1 === d.length) {
                    if ((o = d[0] = d[0].slice(0)).length > 2 && "ID" === (a = o[0]).type && w.getById && 9 === t.nodeType && F && C.relative[o[1].type]) {
                        if (!(t = (C.find.ID(a.matches[0].replace(xe, we), t) || [])[0])) return n;
                        u && (t = t.parentNode), e = e.slice(o.shift().value.length)
                    }
                    for (r = he.needsContext.test(e) ? 0 : o.length; r-- && (a = o[r], !C.relative[s = a.type]);)
                        if ((l = C.find[s]) && (i = l(a.matches[0].replace(xe, we), ye.test(o[0].type) && c(t.parentNode) || t))) {
                            if (o.splice(r, 1), !(e = i.length && f(o))) return K.apply(n, i), n;
                            break
                        }
                }
                return (u || k(e, d))(i, t, !F, n, !t || ye.test(e) && c(t.parentNode) || t), n
            }, w.sortStable = I.split("").sort(V).join("") === I, w.detectDuplicates = !!L, q(), w.sortDetached = r(function (e) {
                return 1 & e.compareDocumentPosition(D.createElement("div"))
            }), r(function (e) {
                return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
            }) || o("type|href|height|width", function (e, t, n) {
                if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
            }), w.attributes && r(function (e) {
                return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
            }) || o("value", function (e, t, n) {
                if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue
            }), r(function (e) {
                return null == e.getAttribute("disabled")
            }) || o(te, function (e, t, n) {
                var i;
                if (!n) return !0 === e[t] ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
            }), t
        }(e);
    he.find = ye, he.expr = ye.selectors, he.expr[":"] = he.expr.pseudos, he.uniqueSort = he.unique = ye.uniqueSort, he.text = ye.getText, he.isXMLDoc = ye.isXML, he.contains = ye.contains;
    var be = function (e, t, n) {
            for (var i = [], r = n !== undefined;
                (e = e[t]) && 9 !== e.nodeType;)
                if (1 === e.nodeType) {
                    if (r && he(e).is(n)) break;
                    i.push(e)
                } return i
        },
        xe = function (e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        },
        we = he.expr.match.needsContext,
        Ce = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
        Te = /^.[^:#\[\.,]*$/;
    he.filter = function (e, t, n) {
        var i = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? he.find.matchesSelector(i, e) ? [i] : [] : he.find.matches(e, he.grep(t, function (e) {
            return 1 === e.nodeType
        }))
    }, he.fn.extend({
        find: function (e) {
            var t, n = [],
                i = this,
                r = i.length;
            if ("string" != typeof e) return this.pushStack(he(e).filter(function () {
                for (t = 0; t < r; t++)
                    if (he.contains(i[t], this)) return !0
            }));
            for (t = 0; t < r; t++) he.find(e, i[t], n);
            return (n = this.pushStack(r > 1 ? he.unique(n) : n)).selector = this.selector ? this.selector + " " + e : e, n
        },
        filter: function (e) {
            return this.pushStack(i(this, e || [], !1))
        },
        not: function (e) {
            return this.pushStack(i(this, e || [], !0))
        },
        is: function (e) {
            return !!i(this, "string" == typeof e && we.test(e) ? he(e) : e || [], !1).length
        }
    });
    var Ee, Se = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
    (he.fn.init = function (e, t, n) {
        var i, r;
        if (!e) return this;
        if (n = n || Ee, "string" == typeof e) {
            if (!(i = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : Se.exec(e)) || !i[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
            if (i[1]) {
                if (t = t instanceof he ? t[0] : t, he.merge(this, he.parseHTML(i[1], t && t.nodeType ? t.ownerDocument || t : ie, !0)), Ce.test(i[1]) && he.isPlainObject(t))
                    for (i in t) he.isFunction(this[i]) ? this[i](t[i]) : this.attr(i, t[i]);
                return this
            }
            if ((r = ie.getElementById(i[2])) && r.parentNode) {
                if (r.id !== i[2]) return Ee.find(e);
                this.length = 1, this[0] = r
            }
            return this.context = ie, this.selector = e, this
        }
        return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : he.isFunction(e) ? "undefined" != typeof n.ready ? n.ready(e) : e(he) : (e.selector !== undefined && (this.selector = e.selector, this.context = e.context), he.makeArray(e, this))
    }).prototype = he.fn, Ee = he(ie);
    var ke = /^(?:parents|prev(?:Until|All))/,
        Ne = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    he.fn.extend({
        has: function (e) {
            var t, n = he(e, this),
                i = n.length;
            return this.filter(function () {
                for (t = 0; t < i; t++)
                    if (he.contains(this, n[t])) return !0
            })
        },
        closest: function (e, t) {
            for (var n, i = 0, r = this.length, o = [], a = we.test(e) || "string" != typeof e ? he(e, t || this.context) : 0; i < r; i++)
                for (n = this[i]; n && n !== t; n = n.parentNode)
                    if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && he.find.matchesSelector(n, e))) {
                        o.push(n);
                        break
                    } return this.pushStack(o.length > 1 ? he.uniqueSort(o) : o)
        },
        index: function (e) {
            return e ? "string" == typeof e ? he.inArray(this[0], he(e)) : he.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function (e, t) {
            return this.pushStack(he.uniqueSort(he.merge(this.get(), he(e, t))))
        },
        addBack: function (e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), he.each({
        parent: function (e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function (e) {
            return be(e, "parentNode")
        },
        parentsUntil: function (e, t, n) {
            return be(e, "parentNode", n)
        },
        next: function (e) {
            return r(e, "nextSibling")
        },
        prev: function (e) {
            return r(e, "previousSibling")
        },
        nextAll: function (e) {
            return be(e, "nextSibling")
        },
        prevAll: function (e) {
            return be(e, "previousSibling")
        },
        nextUntil: function (e, t, n) {
            return be(e, "nextSibling", n)
        },
        prevUntil: function (e, t, n) {
            return be(e, "previousSibling", n)
        },
        siblings: function (e) {
            return xe((e.parentNode || {}).firstChild, e)
        },
        children: function (e) {
            return xe(e.firstChild)
        },
        contents: function (e) {
            return he.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : he.merge([], e.childNodes)
        }
    }, function (e, t) {
        he.fn[e] = function (n, i) {
            var r = he.map(this, t, n);
            return "Until" !== e.slice(-5) && (i = n), i && "string" == typeof i && (r = he.filter(i, r)), this.length > 1 && (Ne[e] || (r = he.uniqueSort(r)), ke.test(e) && (r = r.reverse())), this.pushStack(r)
        }
    });
    var je, Ae, Le = /\S+/g;
    for (Ae in he.Callbacks = function (e) {
            e = "string" == typeof e ? o(e) : he.extend({}, e);
            var t, n, i, r, a = [],
                s = [],
                l = -1,
                u = function () {
                    for (r = e.once, i = t = !0; s.length; l = -1)
                        for (n = s.shift(); ++l < a.length;) !1 === a[l].apply(n[0], n[1]) && e.stopOnFalse && (l = a.length, n = !1);
                    e.memory || (n = !1), t = !1, r && (a = n ? [] : "")
                },
                c = {
                    add: function () {
                        return a && (n && !t && (l = a.length - 1, s.push(n)), function i(t) {
                            he.each(t, function (t, n) {
                                he.isFunction(n) ? e.unique && c.has(n) || a.push(n) : n && n.length && "string" !== he.type(n) && i(n)
                            })
                        }(arguments), n && !t && u()), this
                    },
                    remove: function () {
                        return he.each(arguments, function (e, t) {
                            for (var n;
                                (n = he.inArray(t, a, n)) > -1;) a.splice(n, 1), n <= l && l--
                        }), this
                    },
                    has: function (e) {
                        return e ? he.inArray(e, a) > -1 : a.length > 0
                    },
                    empty: function () {
                        return a && (a = []), this
                    },
                    disable: function () {
                        return r = s = [], a = n = "", this
                    },
                    disabled: function () {
                        return !a
                    },
                    lock: function () {
                        return r = !0, n || c.disable(), this
                    },
                    locked: function () {
                        return !!r
                    },
                    fireWith: function (e, n) {
                        return r || (n = [e, (n = n || []).slice ? n.slice() : n], s.push(n), t || u()), this
                    },
                    fire: function () {
                        return c.fireWith(this, arguments), this
                    },
                    fired: function () {
                        return !!i
                    }
                };
            return c
        }, he.extend({
            Deferred: function (e) {
                var t = [
                        ["resolve", "done", he.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", he.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", he.Callbacks("memory")]
                    ],
                    n = "pending",
                    i = {
                        state: function () {
                            return n
                        },
                        always: function () {
                            return r.done(arguments).fail(arguments), this
                        },
                        then: function () {
                            var e = arguments;
                            return he.Deferred(function (n) {
                                he.each(t, function (t, o) {
                                    var a = he.isFunction(e[t]) && e[t];
                                    r[o[1]](function () {
                                        var e = a && a.apply(this, arguments);
                                        e && he.isFunction(e.promise) ? e.promise().progress(n.notify).done(n.resolve).fail(n.reject) : n[o[0] + "With"](this === i ? n.promise() : this, a ? [e] : arguments)
                                    })
                                }), e = null
                            }).promise()
                        },
                        promise: function (e) {
                            return null != e ? he.extend(e, i) : i
                        }
                    },
                    r = {};
                return i.pipe = i.then, he.each(t, function (e, o) {
                    var a = o[2],
                        s = o[3];
                    i[o[1]] = a.add, s && a.add(function () {
                        n = s
                    }, t[1 ^ e][2].disable, t[2][2].lock), r[o[0]] = function () {
                        return r[o[0] + "With"](this === r ? i : this, arguments), this
                    }, r[o[0] + "With"] = a.fireWith
                }), i.promise(r), e && e.call(r, r), r
            },
            when: function (e) {
                var t, n, i, r = 0,
                    o = re.call(arguments),
                    a = o.length,
                    s = 1 !== a || e && he.isFunction(e.promise) ? a : 0,
                    l = 1 === s ? e : he.Deferred(),
                    u = function (e, n, i) {
                        return function (r) {
                            n[e] = this, i[e] = arguments.length > 1 ? re.call(arguments) : r, i === t ? l.notifyWith(n, i) : --s || l.resolveWith(n, i)
                        }
                    };
                if (a > 1)
                    for (t = new Array(a), n = new Array(a), i = new Array(a); r < a; r++) o[r] && he.isFunction(o[r].promise) ? o[r].promise().progress(u(r, n, t)).done(u(r, i, o)).fail(l.reject) : --s;
                return s || l.resolveWith(i, o), l.promise()
            }
        }), he.fn.ready = function (e) {
            return he.ready.promise().done(e), this
        }, he.extend({
            isReady: !1,
            readyWait: 1,
            holdReady: function (e) {
                e ? he.readyWait++ : he.ready(!0)
            },
            ready: function (e) {
                (!0 === e ? --he.readyWait : he.isReady) || (he.isReady = !0, !0 !== e && --he.readyWait > 0 || (je.resolveWith(ie, [he]), he.fn.triggerHandler && (he(ie).triggerHandler("ready"), he(ie).off("ready"))))
            }
        }), he.ready.promise = function (t) {
            if (!je)
                if (je = he.Deferred(), "complete" === ie.readyState || "loading" !== ie.readyState && !ie.documentElement.doScroll) e.setTimeout(he.ready);
                else if (ie.addEventListener) ie.addEventListener("DOMContentLoaded", s), e.addEventListener("load", s);
            else {
                ie.attachEvent("onreadystatechange", s), e.attachEvent("onload", s);
                var n = !1;
                try {
                    n = null == e.frameElement && ie.documentElement
                } catch (i) {}
                n && n.doScroll && function t() {
                    if (!he.isReady) {
                        try {
                            n.doScroll("left")
                        } catch (i) {
                            return e.setTimeout(t, 50)
                        }
                        a(), he.ready()
                    }
                }()
            }
            return je.promise(t)
        }, he.ready.promise(), he(de)) break;
    de.ownFirst = "0" === Ae, de.inlineBlockNeedsLayout = !1, he(function () {
            var e, t, n, i;
            (n = ie.getElementsByTagName("body")[0]) && n.style && (t = ie.createElement("div"), (i = ie.createElement("div")).style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(t), "undefined" != typeof t.style.zoom && (t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", de.inlineBlockNeedsLayout = e = 3 === t.offsetWidth, e && (n.style.zoom = 1)), n.removeChild(i))
        }),
        function () {
            var e = ie.createElement("div");
            de.deleteExpando = !0;
            try {
                delete e.test
            } catch (t) {
                de.deleteExpando = !1
            }
            e = null
        }();
    var qe, De = function (e) {
            var t = he.noData[(e.nodeName + " ").toLowerCase()],
                n = +e.nodeType || 1;
            return (1 === n || 9 === n) && (!t || !0 !== t && e.getAttribute("classid") === t)
        },
        $e = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Fe = /([A-Z])/g;
    he.extend({
        cache: {},
        noData: {
            "applet ": !0,
            "embed ": !0,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function (e) {
            return !!(e = e.nodeType ? he.cache[e[he.expando]] : e[he.expando]) && !u(e)
        },
        data: function (e, t, n) {
            return c(e, t, n)
        },
        removeData: function (e, t) {
            return d(e, t)
        },
        _data: function (e, t, n) {
            return c(e, t, n, !0)
        },
        _removeData: function (e, t) {
            return d(e, t, !0)
        }
    }), he.fn.extend({
        data: function (e, t) {
            var n, i, r, o = this[0],
                a = o && o.attributes;
            if (e === undefined) {
                if (this.length && (r = he.data(o), 1 === o.nodeType && !he._data(o, "parsedAttrs"))) {
                    for (n = a.length; n--;) a[n] && 0 === (i = a[n].name).indexOf("data-") && l(o, i = he.camelCase(i.slice(5)), r[i]);
                    he._data(o, "parsedAttrs", !0)
                }
                return r
            }
            return "object" == typeof e ? this.each(function () {
                he.data(this, e)
            }) : arguments.length > 1 ? this.each(function () {
                he.data(this, e, t)
            }) : o ? l(o, e, he.data(o, e)) : undefined
        },
        removeData: function (e) {
            return this.each(function () {
                he.removeData(this, e)
            })
        }
    }), he.extend({
        queue: function (e, t, n) {
            var i;
            if (e) return t = (t || "fx") + "queue", i = he._data(e, t), n && (!i || he.isArray(n) ? i = he._data(e, t, he.makeArray(n)) : i.push(n)), i || []
        },
        dequeue: function (e, t) {
            t = t || "fx";
            var n = he.queue(e, t),
                i = n.length,
                r = n.shift(),
                o = he._queueHooks(e, t),
                a = function () {
                    he.dequeue(e, t)
                };
            "inprogress" === r && (r = n.shift(), i--), r && ("fx" === t && n.unshift("inprogress"), delete o.stop, r.call(e, a, o)), !i && o && o.empty.fire()
        },
        _queueHooks: function (e, t) {
            var n = t + "queueHooks";
            return he._data(e, n) || he._data(e, n, {
                empty: he.Callbacks("once memory").add(function () {
                    he._removeData(e, t + "queue"), he._removeData(e, n)
                })
            })
        }
    }), he.fn.extend({
        queue: function (e, t) {
            var n = 2;
            return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? he.queue(this[0], e) : t === undefined ? this : this.each(function () {
                var n = he.queue(this, e, t);
                he._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && he.dequeue(this, e)
            })
        },
        dequeue: function (e) {
            return this.each(function () {
                he.dequeue(this, e)
            })
        },
        clearQueue: function (e) {
            return this.queue(e || "fx", [])
        },
        promise: function (e, t) {
            var n, i = 1,
                r = he.Deferred(),
                o = this,
                a = this.length,
                s = function () {
                    --i || r.resolveWith(o, [o])
                };
            for ("string" != typeof e && (t = e, e = undefined), e = e || "fx"; a--;)(n = he._data(o[a], e + "queueHooks")) && n.empty && (i++, n.empty.add(s));
            return s(), r.promise(t)
        }
    }), de.shrinkWrapBlocks = function () {
        return null != qe ? qe : (qe = !1, (t = ie.getElementsByTagName("body")[0]) && t.style ? (e = ie.createElement("div"), (n = ie.createElement("div")).style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", t.appendChild(n).appendChild(e), "undefined" != typeof e.style.zoom && (e.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", e.appendChild(ie.createElement("div")).style.width = "5px", qe = 3 !== e.offsetWidth), t.removeChild(n), qe) : void 0);
        var e, t, n
    };
    var Me, He, Re, Pe = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        Ie = new RegExp("^(?:([+-])=|)(" + Pe + ")([a-z%]*)$", "i"),
        _e = ["Top", "Right", "Bottom", "Left"],
        Oe = function (e, t) {
            return e = t || e, "none" === he.css(e, "display") || !he.contains(e.ownerDocument, e)
        },
        ze = function (e, t, n, i, r, o, a) {
            var s = 0,
                l = e.length,
                u = null == n;
            if ("object" === he.type(n))
                for (s in r = !0, n) ze(e, t, s, n[s], !0, o, a);
            else if (i !== undefined && (r = !0, he.isFunction(i) || (a = !0), u && (a ? (t.call(e, i), t = null) : (u = t, t = function (e, t, n) {
                    return u.call(he(e), n)
                })), t))
                for (; s < l; s++) t(e[s], n, a ? i : i.call(e[s], s, t(e[s], n)));
            return r ? e : u ? t.call(e) : l ? t(e[0], n) : o
        },
        Be = /^(?:checkbox|radio)$/i,
        We = /<([\w:-]+)/,
        Xe = /^$|\/(?:java|ecma)script/i,
        Ve = /^\s+/,
        Ue = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    Me = ie.createElement("div"), He = ie.createDocumentFragment(), Re = ie.createElement("input"), Me.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", de.leadingWhitespace = 3 === Me.firstChild.nodeType, de.tbody = !Me.getElementsByTagName("tbody").length, de.htmlSerialize = !!Me.getElementsByTagName("link").length, de.html5Clone = "<:nav></:nav>" !== ie.createElement("nav").cloneNode(!0).outerHTML, Re.type = "checkbox", Re.checked = !0, He.appendChild(Re), de.appendChecked = Re.checked, Me.innerHTML = "<textarea>x</textarea>", de.noCloneChecked = !!Me.cloneNode(!0).lastChild.defaultValue, He.appendChild(Me), (Re = ie.createElement("input")).setAttribute("type", "radio"), Re.setAttribute("checked", "checked"), Re.setAttribute("name", "t"), Me.appendChild(Re), de.checkClone = Me.cloneNode(!0).cloneNode(!0).lastChild.checked, de.noCloneEvent = !!Me.addEventListener, Me[he.expando] = 1, de.attributes = !Me.getAttribute(he.expando);
    var Ge = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: de.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    };
    Ge.optgroup = Ge.option, Ge.tbody = Ge.tfoot = Ge.colgroup = Ge.caption = Ge.thead, Ge.th = Ge.td;
    var Je = /<|&#?\w+;/,
        Ye = /<tbody/i;
    ! function () {
        var t, n, i = ie.createElement("div");
        for (t in {
                submit: !0,
                change: !0,
                focusin: !0
            }) n = "on" + t, (de[t] = n in e) || (i.setAttribute(n, "t"), de[t] = !1 === i.attributes[n].expando);
        i = null
    }();
    var Qe = /^(?:input|select|textarea)$/i,
        Ke = /^key/,
        Ze = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        et = /^(?:focusinfocus|focusoutblur)$/,
        tt = /^([^.]*)(?:\.(.+)|)/;
    he.event = {
        global: {},
        add: function (e, t, n, i, r) {
            var o, a, s, l, u, c, d, f, h, p, m, g = he._data(e);
            if (g) {
                for (n.handler && (n = (l = n).handler, r = l.selector), n.guid || (n.guid = he.guid++), (a = g.events) || (a = g.events = {}), (c = g.handle) || ((c = g.handle = function (e) {
                        return void 0 === he || e && he.event.triggered === e.type ? undefined : he.event.dispatch.apply(c.elem, arguments)
                    }).elem = e), s = (t = (t || "").match(Le) || [""]).length; s--;) h = m = (o = tt.exec(t[s]) || [])[1], p = (o[2] || "").split(".").sort(), h && (u = he.event.special[h] || {}, h = (r ? u.delegateType : u.bindType) || h, u = he.event.special[h] || {}, d = he.extend({
                    type: h,
                    origType: m,
                    data: i,
                    handler: n,
                    guid: n.guid,
                    selector: r,
                    needsContext: r && he.expr.match.needsContext.test(r),
                    namespace: p.join(".")
                }, l), (f = a[h]) || ((f = a[h] = []).delegateCount = 0, u.setup && !1 !== u.setup.call(e, i, p, c) || (e.addEventListener ? e.addEventListener(h, c, !1) : e.attachEvent && e.attachEvent("on" + h, c))), u.add && (u.add.call(e, d), d.handler.guid || (d.handler.guid = n.guid)), r ? f.splice(f.delegateCount++, 0, d) : f.push(d), he.event.global[h] = !0);
                e = null
            }
        },
        remove: function (e, t, n, i, r) {
            var o, a, s, l, u, c, d, f, h, p, m, g = he.hasData(e) && he._data(e);
            if (g && (c = g.events)) {
                for (u = (t = (t || "").match(Le) || [""]).length; u--;)
                    if (h = m = (s = tt.exec(t[u]) || [])[1], p = (s[2] || "").split(".").sort(), h) {
                        for (d = he.event.special[h] || {}, f = c[h = (i ? d.delegateType : d.bindType) || h] || [], s = s[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = f.length; o--;) a = f[o], !r && m !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || i && i !== a.selector && ("**" !== i || !a.selector) || (f.splice(o, 1), a.selector && f.delegateCount--, d.remove && d.remove.call(e, a));
                        l && !f.length && (d.teardown && !1 !== d.teardown.call(e, p, g.handle) || he.removeEvent(e, h, g.handle), delete c[h])
                    } else
                        for (h in c) he.event.remove(e, h + t[u], n, i, !0);
                he.isEmptyObject(c) && (delete g.handle, he._removeData(e, "events"))
            }
        },
        trigger: function (t, n, i, r) {
            var o, a, s, l, u, c, d, f = [i || ie],
                h = ce.call(t, "type") ? t.type : t,
                p = ce.call(t, "namespace") ? t.namespace.split(".") : [];
            if (s = c = i = i || ie, 3 !== i.nodeType && 8 !== i.nodeType && !et.test(h + he.event.triggered) && (h.indexOf(".") > -1 && (h = (p = h.split(".")).shift(), p.sort()), a = h.indexOf(":") < 0 && "on" + h, (t = t[he.expando] ? t : new he.Event(h, "object" == typeof t && t)).isTrigger = r ? 2 : 3, t.namespace = p.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = undefined, t.target || (t.target = i), n = null == n ? [t] : he.makeArray(n, [t]), u = he.event.special[h] || {}, r || !u.trigger || !1 !== u.trigger.apply(i, n))) {
                if (!r && !u.noBubble && !he.isWindow(i)) {
                    for (l = u.delegateType || h, et.test(l + h) || (s = s.parentNode); s; s = s.parentNode) f.push(s), c = s;
                    c === (i.ownerDocument || ie) && f.push(c.defaultView || c.parentWindow || e)
                }
                for (d = 0;
                    (s = f[d++]) && !t.isPropagationStopped();) t.type = d > 1 ? l : u.bindType || h, (o = (he._data(s, "events") || {})[t.type] && he._data(s, "handle")) && o.apply(s, n), (o = a && s[a]) && o.apply && De(s) && (t.result = o.apply(s, n), !1 === t.result && t.preventDefault());
                if (t.type = h, !r && !t.isDefaultPrevented() && (!u._default || !1 === u._default.apply(f.pop(), n)) && De(i) && a && i[h] && !he.isWindow(i)) {
                    (c = i[a]) && (i[a] = null), he.event.triggered = h;
                    try {
                        i[h]()
                    } catch (m) {}
                    he.event.triggered = undefined, c && (i[a] = c)
                }
                return t.result
            }
        },
        dispatch: function (e) {
            e = he.event.fix(e);
            var t, n, i, r, o, a = [],
                s = re.call(arguments),
                l = (he._data(this, "events") || {})[e.type] || [],
                u = he.event.special[e.type] || {};
            if (s[0] = e, e.delegateTarget = this, !u.preDispatch || !1 !== u.preDispatch.call(this, e)) {
                for (a = he.event.handlers.call(this, e, l), t = 0;
                    (r = a[t++]) && !e.isPropagationStopped();)
                    for (e.currentTarget = r.elem, n = 0;
                        (o = r.handlers[n++]) && !e.isImmediatePropagationStopped();) e.rnamespace && !e.rnamespace.test(o.namespace) || (e.handleObj = o, e.data = o.data, (i = ((he.event.special[o.origType] || {}).handle || o.handler).apply(r.elem, s)) !== undefined && !1 === (e.result = i) && (e.preventDefault(), e.stopPropagation()));
                return u.postDispatch && u.postDispatch.call(this, e), e.result
            }
        },
        handlers: function (e, t) {
            var n, i, r, o, a = [],
                s = t.delegateCount,
                l = e.target;
            if (s && l.nodeType && ("click" !== e.type || isNaN(e.button) || e.button < 1))
                for (; l != this; l = l.parentNode || this)
                    if (1 === l.nodeType && (!0 !== l.disabled || "click" !== e.type)) {
                        for (i = [], n = 0; n < s; n++) i[r = (o = t[n]).selector + " "] === undefined && (i[r] = o.needsContext ? he(r, this).index(l) > -1 : he.find(r, this, null, [l]).length), i[r] && i.push(o);
                        i.length && a.push({
                            elem: l,
                            handlers: i
                        })
                    } return s < t.length && a.push({
                elem: this,
                handlers: t.slice(s)
            }), a
        },
        fix: function (e) {
            if (e[he.expando]) return e;
            var t, n, i, r = e.type,
                o = e,
                a = this.fixHooks[r];
            for (a || (this.fixHooks[r] = a = Ze.test(r) ? this.mouseHooks : Ke.test(r) ? this.keyHooks : {}), i = a.props ? this.props.concat(a.props) : this.props, e = new he.Event(o), t = i.length; t--;) e[n = i[t]] = o[n];
            return e.target || (e.target = o.srcElement || ie), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, a.filter ? a.filter(e, o) : e
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function (e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (e, t) {
                var n, i, r, o = t.button,
                    a = t.fromElement;
                return null == e.pageX && null != t.clientX && (r = (i = e.target.ownerDocument || ie).documentElement, n = i.body, e.pageX = t.clientX + (r && r.scrollLeft || n && n.scrollLeft || 0) - (r && r.clientLeft || n && n.clientLeft || 0), e.pageY = t.clientY + (r && r.scrollTop || n && n.scrollTop || 0) - (r && r.clientTop || n && n.clientTop || 0)), !e.relatedTarget && a && (e.relatedTarget = a === e.target ? t.toElement : a), e.which || o === undefined || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0), e
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function () {
                    if (this !== x() && this.focus) try {
                        return this.focus(), !1
                    } catch (e) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function () {
                    if (this === x() && this.blur) return this.blur(), !1
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function () {
                    if (he.nodeName(this, "input") && "checkbox" === this.type && this.click) return this.click(), !1
                },
                _default: function (e) {
                    return he.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function (e) {
                    e.result !== undefined && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function (e, t, n) {
            var i = he.extend(new he.Event, n, {
                type: e,
                isSimulated: !0
            });
            he.event.trigger(i, null, t), i.isDefaultPrevented() && n.preventDefault()
        }
    }, he.removeEvent = ie.removeEventListener ? function (e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    } : function (e, t, n) {
        var i = "on" + t;
        e.detachEvent && ("undefined" == typeof e[i] && (e[i] = null), e.detachEvent(i, n))
    }, he.Event = function (e, t) {
        if (!(this instanceof he.Event)) return new he.Event(e, t);
        e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.defaultPrevented === undefined && !1 === e.returnValue ? y : b) : this.type = e, t && he.extend(this, t), this.timeStamp = e && e.timeStamp || he.now(), this[he.expando] = !0
    }, he.Event.prototype = {
        constructor: he.Event,
        isDefaultPrevented: b,
        isPropagationStopped: b,
        isImmediatePropagationStopped: b,
        preventDefault: function () {
            var e = this.originalEvent;
            this.isDefaultPrevented = y, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
        },
        stopPropagation: function () {
            var e = this.originalEvent;
            this.isPropagationStopped = y, e && !this.isSimulated && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
        },
        stopImmediatePropagation: function () {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = y, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, he.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function (e, t) {
        he.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function (e) {
                var n, i = this,
                    r = e.relatedTarget,
                    o = e.handleObj;
                return r && (r === i || he.contains(i, r)) || (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
            }
        }
    }), de.submit || (he.event.special.submit = {
        setup: function () {
            if (he.nodeName(this, "form")) return !1;
            he.event.add(this, "click._submit keypress._submit", function (e) {
                var t = e.target,
                    n = he.nodeName(t, "input") || he.nodeName(t, "button") ? he.prop(t, "form") : undefined;
                n && !he._data(n, "submit") && (he.event.add(n, "submit._submit", function (e) {
                    e._submitBubble = !0
                }), he._data(n, "submit", !0))
            })
        },
        postDispatch: function (e) {
            e._submitBubble && (delete e._submitBubble, this.parentNode && !e.isTrigger && he.event.simulate("submit", this.parentNode, e))
        },
        teardown: function () {
            if (he.nodeName(this, "form")) return !1;
            he.event.remove(this, "._submit")
        }
    }), de.change || (he.event.special.change = {
        setup: function () {
            if (Qe.test(this.nodeName)) return "checkbox" !== this.type && "radio" !== this.type || (he.event.add(this, "propertychange._change", function (e) {
                "checked" === e.originalEvent.propertyName && (this._justChanged = !0)
            }), he.event.add(this, "click._change", function (e) {
                this._justChanged && !e.isTrigger && (this._justChanged = !1), he.event.simulate("change", this, e)
            })), !1;
            he.event.add(this, "beforeactivate._change", function (e) {
                var t = e.target;
                Qe.test(t.nodeName) && !he._data(t, "change") && (he.event.add(t, "change._change", function (e) {
                    !this.parentNode || e.isSimulated || e.isTrigger || he.event.simulate("change", this.parentNode, e)
                }), he._data(t, "change", !0))
            })
        },
        handle: function (e) {
            var t = e.target;
            if (this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type) return e.handleObj.handler.apply(this, arguments)
        },
        teardown: function () {
            return he.event.remove(this, "._change"), !Qe.test(this.nodeName)
        }
    }), de.focusin || he.each({
        focus: "focusin",
        blur: "focusout"
    }, function (e, t) {
        var n = function (e) {
            he.event.simulate(t, e.target, he.event.fix(e))
        };
        he.event.special[t] = {
            setup: function () {
                var i = this.ownerDocument || this,
                    r = he._data(i, t);
                r || i.addEventListener(e, n, !0), he._data(i, t, (r || 0) + 1)
            },
            teardown: function () {
                var i = this.ownerDocument || this,
                    r = he._data(i, t) - 1;
                r ? he._data(i, t, r) : (i.removeEventListener(e, n, !0), he._removeData(i, t))
            }
        }
    }), he.fn.extend({
        on: function (e, t, n, i) {
            return w(this, e, t, n, i)
        },
        one: function (e, t, n, i) {
            return w(this, e, t, n, i, 1)
        },
        off: function (e, t, n) {
            var i, r;
            if (e && e.preventDefault && e.handleObj) return i = e.handleObj, he(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
            if ("object" == typeof e) {
                for (r in e) this.off(r, t, e[r]);
                return this
            }
            return !1 !== t && "function" != typeof t || (n = t, t = undefined), !1 === n && (n = b), this.each(function () {
                he.event.remove(this, e, n, t)
            })
        },
        trigger: function (e, t) {
            return this.each(function () {
                he.event.trigger(e, t, this)
            })
        },
        triggerHandler: function (e, t) {
            var n = this[0];
            if (n) return he.event.trigger(e, t, n, !0)
        }
    });
    var nt = / jQuery\d+="(?:null|\d+)"/g,
        it = new RegExp("<(?:" + Ue + ")[\\s/>]", "i"),
        rt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,
        ot = /<script|<style|<link/i,
        at = /checked\s*(?:[^=]|=\s*.checked.)/i,
        st = /^true\/(.*)/,
        lt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        ut = h(ie).appendChild(ie.createElement("div"));
    he.extend({
        htmlPrefilter: function (e) {
            return e.replace(rt, "<$1></$2>")
        },
        clone: function (e, t, n) {
            var i, r, o, a, s, l = he.contains(e.ownerDocument, e);
            if (de.html5Clone || he.isXMLDoc(e) || !it.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (ut.innerHTML = e.outerHTML, ut.removeChild(o = ut.firstChild)), !(de.noCloneEvent && de.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || he.isXMLDoc(e)))
                for (i = p(o), s = p(e), a = 0; null != (r = s[a]); ++a) i[a] && k(r, i[a]);
            if (t)
                if (n)
                    for (s = s || p(e), i = i || p(o), a = 0; null != (r = s[a]); a++) S(r, i[a]);
                else S(e, o);
            return (i = p(o, "script")).length > 0 && m(i, !l && p(e, "script")), i = s = r = null, o
        },
        cleanData: function (e, t) {
            for (var n, i, r, o, a = 0, s = he.expando, l = he.cache, u = de.attributes, c = he.event.special; null != (n = e[a]); a++)
                if ((t || De(n)) && (o = (r = n[s]) && l[r])) {
                    if (o.events)
                        for (i in o.events) c[i] ? he.event.remove(n, i) : he.removeEvent(n, i, o.handle);
                    l[r] && (delete l[r], u || "undefined" == typeof n.removeAttribute ? n[s] = undefined : n.removeAttribute(s), ne.push(r))
                }
        }
    }), he.fn.extend({
        domManip: N,
        detach: function (e) {
            return j(this, e, !0)
        },
        remove: function (e) {
            return j(this, e)
        },
        text: function (e) {
            return ze(this, function (e) {
                return e === undefined ? he.text(this) : this.empty().append((this[0] && this[0].ownerDocument || ie).createTextNode(e))
            }, null, e, arguments.length)
        },
        append: function () {
            return N(this, arguments, function (e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || C(this, e).appendChild(e)
            })
        },
        prepend: function () {
            return N(this, arguments, function (e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = C(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function () {
            return N(this, arguments, function (e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function () {
            return N(this, arguments, function (e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function () {
            for (var e, t = 0; null != (e = this[t]); t++) {
                for (1 === e.nodeType && he.cleanData(p(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
                e.options && he.nodeName(e, "select") && (e.options.length = 0)
            }
            return this
        },
        clone: function (e, t) {
            return e = null != e && e, t = null == t ? e : t, this.map(function () {
                return he.clone(this, e, t)
            })
        },
        html: function (e) {
            return ze(this, function (e) {
                var t = this[0] || {},
                    n = 0,
                    i = this.length;
                if (e === undefined) return 1 === t.nodeType ? t.innerHTML.replace(nt, "") : undefined;
                if ("string" == typeof e && !ot.test(e) && (de.htmlSerialize || !it.test(e)) && (de.leadingWhitespace || !Ve.test(e)) && !Ge[(We.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = he.htmlPrefilter(e);
                    try {
                        for (; n < i; n++) 1 === (t = this[n] || {}).nodeType && (he.cleanData(p(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (r) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function () {
            var e = [];
            return N(this, arguments, function (t) {
                var n = this.parentNode;
                he.inArray(this, e) < 0 && (he.cleanData(p(this)), n && n.replaceChild(t, this))
            }, e)
        }
    }), he.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (e, t) {
        he.fn[e] = function (e) {
            for (var n, i = 0, r = [], o = he(e), a = o.length - 1; i <= a; i++) n = i === a ? this : this.clone(!0), he(o[i])[t](n), ae.apply(r, n.get());
            return this.pushStack(r)
        }
    });
    var ct, dt = {
            HTML: "block",
            BODY: "block"
        },
        ft = /^margin/,
        ht = new RegExp("^(" + Pe + ")(?!px)[a-z%]+$", "i"),
        pt = function (e, t, n, i) {
            var r, o, a = {};
            for (o in t) a[o] = e.style[o], e.style[o] = t[o];
            for (o in r = n.apply(e, i || []), t) e.style[o] = a[o];
            return r
        },
        mt = ie.documentElement;
    ! function () {
        function t() {
            var t, c, d = ie.documentElement;
            d.appendChild(l), u.style.cssText = "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", n = r = s = !1, i = a = !0, e.getComputedStyle && (c = e.getComputedStyle(u), n = "1%" !== (c || {}).top, s = "2px" === (c || {}).marginLeft, r = "4px" === (c || {
                width: "4px"
            }).width, u.style.marginRight = "50%", i = "4px" === (c || {
                marginRight: "4px"
            }).marginRight, (t = u.appendChild(ie.createElement("div"))).style.cssText = u.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", t.style.marginRight = t.style.width = "0", u.style.width = "1px", a = !parseFloat((e.getComputedStyle(t) || {}).marginRight), u.removeChild(t)), u.style.display = "none", (o = 0 === u.getClientRects().length) && (u.style.display = "", u.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", u.childNodes[0].style.borderCollapse = "separate", (t = u.getElementsByTagName("td"))[0].style.cssText = "margin:0;border:0;padding:0;display:none", (o = 0 === t[0].offsetHeight) && (t[0].style.display = "", t[1].style.display = "none", o = 0 === t[0].offsetHeight)), d.removeChild(l)
        }
        var n, i, r, o, a, s, l = ie.createElement("div"),
            u = ie.createElement("div");
        u.style && (u.style.cssText = "float:left;opacity:.5", de.opacity = "0.5" === u.style.opacity, de.cssFloat = !!u.style.cssFloat, u.style.backgroundClip = "content-box", u.cloneNode(!0).style.backgroundClip = "", de.clearCloneStyle = "content-box" === u.style.backgroundClip, (l = ie.createElement("div")).style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", u.innerHTML = "", l.appendChild(u), de.boxSizing = "" === u.style.boxSizing || "" === u.style.MozBoxSizing || "" === u.style.WebkitBoxSizing, he.extend(de, {
            reliableHiddenOffsets: function () {
                return null == n && t(), o
            },
            boxSizingReliable: function () {
                return null == n && t(), r
            },
            pixelMarginRight: function () {
                return null == n && t(), i
            },
            pixelPosition: function () {
                return null == n && t(), n
            },
            reliableMarginRight: function () {
                return null == n && t(), a
            },
            reliableMarginLeft: function () {
                return null == n && t(), s
            }
        }))
    }();
    var gt, vt, yt = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (gt = function (t) {
        var n = t.ownerDocument.defaultView;
        return n && n.opener || (n = e), n.getComputedStyle(t)
    }, vt = function (e, t, n) {
        var i, r, o, a, s = e.style;
        return "" !== (a = (n = n || gt(e)) ? n.getPropertyValue(t) || n[t] : undefined) && a !== undefined || he.contains(e.ownerDocument, e) || (a = he.style(e, t)), n && !de.pixelMarginRight() && ht.test(a) && ft.test(t) && (i = s.width, r = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = i, s.minWidth = r, s.maxWidth = o), a === undefined ? a : a + ""
    }) : mt.currentStyle && (gt = function (e) {
        return e.currentStyle
    }, vt = function (e, t, n) {
        var i, r, o, a, s = e.style;
        return null == (a = (n = n || gt(e)) ? n[t] : undefined) && s && s[t] && (a = s[t]), ht.test(a) && !yt.test(t) && (i = s.left, (o = (r = e.runtimeStyle) && r.left) && (r.left = e.currentStyle.left), s.left = "fontSize" === t ? "1em" : a, a = s.pixelLeft + "px", s.left = i, o && (r.left = o)), a === undefined ? a : a + "" || "auto"
    });
    var bt = /alpha\([^)]*\)/i,
        xt = /opacity\s*=\s*([^)]*)/i,
        wt = /^(none|table(?!-c[ea]).+)/,
        Ct = new RegExp("^(" + Pe + ")(.*)$", "i"),
        Tt = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        Et = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        St = ["Webkit", "O", "Moz", "ms"],
        kt = ie.createElement("div").style;
    he.extend({
        cssHooks: {
            opacity: {
                get: function (e, t) {
                    if (t) {
                        var n = vt(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            float: de.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function (e, t, n, i) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var r, o, a, s = he.camelCase(t),
                    l = e.style;
                if (t = he.cssProps[s] || (he.cssProps[s] = D(s) || s), a = he.cssHooks[t] || he.cssHooks[s], n === undefined) return a && "get" in a && (r = a.get(e, !1, i)) !== undefined ? r : l[t];
                if ("string" === (o = typeof n) && (r = Ie.exec(n)) && r[1] && (n = f(e, t, r), o = "number"), null != n && n == n && ("number" === o && (n += r && r[3] || (he.cssNumber[s] ? "" : "px")), de.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), !(a && "set" in a && (n = a.set(e, n, i)) === undefined))) try {
                    l[t] = n
                } catch (u) {}
            }
        },
        css: function (e, t, n, i) {
            var r, o, a, s = he.camelCase(t);
            return t = he.cssProps[s] || (he.cssProps[s] = D(s) || s), (a = he.cssHooks[t] || he.cssHooks[s]) && "get" in a && (o = a.get(e, !0, n)), o === undefined && (o = vt(e, t, i)), "normal" === o && t in Et && (o = Et[t]), "" === n || n ? (r = parseFloat(o), !0 === n || isFinite(r) ? r || 0 : o) : o
        }
    }), he.each(["height", "width"], function (e, t) {
        he.cssHooks[t] = {
            get: function (e, n, i) {
                if (n) return wt.test(he.css(e, "display")) && 0 === e.offsetWidth ? pt(e, Tt, function () {
                    return H(e, t, i)
                }) : H(e, t, i)
            },
            set: function (e, n, i) {
                var r = i && gt(e);
                return F(e, n, i ? M(e, t, i, de.boxSizing && "border-box" === he.css(e, "boxSizing", !1, r), r) : 0)
            }
        }
    }), de.opacity || (he.cssHooks.opacity = {
        get: function (e, t) {
            return xt.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        },
        set: function (e, t) {
            var n = e.style,
                i = e.currentStyle,
                r = he.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                o = i && i.filter || n.filter || "";
            n.zoom = 1, (t >= 1 || "" === t) && "" === he.trim(o.replace(bt, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || i && !i.filter) || (n.filter = bt.test(o) ? o.replace(bt, r) : o + " " + r)
        }
    }), he.cssHooks.marginRight = q(de.reliableMarginRight, function (e, t) {
        if (t) return pt(e, {
            display: "inline-block"
        }, vt, [e, "marginRight"])
    }), he.cssHooks.marginLeft = q(de.reliableMarginLeft, function (e, t) {
        if (t) return (parseFloat(vt(e, "marginLeft")) || (he.contains(e.ownerDocument, e) ? e.getBoundingClientRect().left - pt(e, {
            marginLeft: 0
        }, function () {
            return e.getBoundingClientRect().left
        }) : 0)) + "px"
    }), he.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function (e, t) {
        he.cssHooks[e + t] = {
            expand: function (n) {
                for (var i = 0, r = {}, o = "string" == typeof n ? n.split(" ") : [n]; i < 4; i++) r[e + _e[i] + t] = o[i] || o[i - 2] || o[0];
                return r
            }
        }, ft.test(e) || (he.cssHooks[e + t].set = F)
    }), he.fn.extend({
        css: function (e, t) {
            return ze(this, function (e, t, n) {
                var i, r, o = {},
                    a = 0;
                if (he.isArray(t)) {
                    for (i = gt(e), r = t.length; a < r; a++) o[t[a]] = he.css(e, t[a], !1, i);
                    return o
                }
                return n !== undefined ? he.style(e, t, n) : he.css(e, t)
            }, e, t, arguments.length > 1)
        },
        show: function () {
            return $(this, !0)
        },
        hide: function () {
            return $(this)
        },
        toggle: function (e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function () {
                Oe(this) ? he(this).show() : he(this).hide()
            })
        }
    }), he.Tween = R, R.prototype = {
        constructor: R,
        init: function (e, t, n, i, r, o) {
            this.elem = e, this.prop = n, this.easing = r || he.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = o || (he.cssNumber[n] ? "" : "px")
        },
        cur: function () {
            var e = R.propHooks[this.prop];
            return e && e.get ? e.get(this) : R.propHooks._default.get(this)
        },
        run: function (e) {
            var t, n = R.propHooks[this.prop];
            return this.options.duration ? this.pos = t = he.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : R.propHooks._default.set(this), this
        }
    }, R.prototype.init.prototype = R.prototype, R.propHooks = {
        _default: {
            get: function (e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = he.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
            },
            set: function (e) {
                he.fx.step[e.prop] ? he.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[he.cssProps[e.prop]] && !he.cssHooks[e.prop] ? e.elem[e.prop] = e.now : he.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }, R.propHooks.scrollTop = R.propHooks.scrollLeft = {
        set: function (e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, he.easing = {
        linear: function (e) {
            return e
        },
        swing: function (e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    }, he.fx = R.prototype.init, he.fx.step = {};
    var Nt, jt, At = /^(?:toggle|show|hide)$/,
        Lt = /queueHooks$/;
    he.Animation = he.extend(B, {
            tweeners: {
                "*": [function (e, t) {
                    var n = this.createTween(e, t);
                    return f(n.elem, e, Ie.exec(t), n), n
                }]
            },
            tweener: function (e, t) {
                he.isFunction(e) ? (t = e, e = ["*"]) : e = e.match(Le);
                for (var n, i = 0, r = e.length; i < r; i++) n = e[i], B.tweeners[n] = B.tweeners[n] || [], B.tweeners[n].unshift(t)
            },
            prefilters: [O],
            prefilter: function (e, t) {
                t ? B.prefilters.unshift(e) : B.prefilters.push(e)
            }
        }), he.speed = function (e, t, n) {
            var i = e && "object" == typeof e ? he.extend({}, e) : {
                complete: n || !n && t || he.isFunction(e) && e,
                duration: e,
                easing: n && t || t && !he.isFunction(t) && t
            };
            return i.duration = he.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in he.fx.speeds ? he.fx.speeds[i.duration] : he.fx.speeds._default, null != i.queue && !0 !== i.queue || (i.queue = "fx"), i.old = i.complete, i.complete = function () {
                he.isFunction(i.old) && i.old.call(this), i.queue && he.dequeue(this, i.queue)
            }, i
        }, he.fn.extend({
            fadeTo: function (e, t, n, i) {
                return this.filter(Oe).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, n, i)
            },
            animate: function (e, t, n, i) {
                var r = he.isEmptyObject(e),
                    o = he.speed(t, n, i),
                    a = function () {
                        var t = B(this, he.extend({}, e), o);
                        (r || he._data(this, "finish")) && t.stop(!0)
                    };
                return a.finish = a, r || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
            },
            stop: function (e, t, n) {
                var i = function (e) {
                    var t = e.stop;
                    delete e.stop, t(n)
                };
                return "string" != typeof e && (n = t, t = e, e = undefined), t && !1 !== e && this.queue(e || "fx", []), this.each(function () {
                    var t = !0,
                        r = null != e && e + "queueHooks",
                        o = he.timers,
                        a = he._data(this);
                    if (r) a[r] && a[r].stop && i(a[r]);
                    else
                        for (r in a) a[r] && a[r].stop && Lt.test(r) && i(a[r]);
                    for (r = o.length; r--;) o[r].elem !== this || null != e && o[r].queue !== e || (o[r].anim.stop(n), t = !1, o.splice(r, 1));
                    !t && n || he.dequeue(this, e)
                })
            },
            finish: function (e) {
                return !1 !== e && (e = e || "fx"), this.each(function () {
                    var t, n = he._data(this),
                        i = n[e + "queue"],
                        r = n[e + "queueHooks"],
                        o = he.timers,
                        a = i ? i.length : 0;
                    for (n.finish = !0, he.queue(this, e, []), r && r.stop && r.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                    for (t = 0; t < a; t++) i[t] && i[t].finish && i[t].finish.call(this);
                    delete n.finish
                })
            }
        }), he.each(["toggle", "show", "hide"], function (e, t) {
            var n = he.fn[t];
            he.fn[t] = function (e, i, r) {
                return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(I(t, !0), e, i, r)
            }
        }), he.each({
            slideDown: I("show"),
            slideUp: I("hide"),
            slideToggle: I("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function (e, t) {
            he.fn[e] = function (e, n, i) {
                return this.animate(t, e, n, i)
            }
        }), he.timers = [], he.fx.tick = function () {
            var e, t = he.timers,
                n = 0;
            for (Nt = he.now(); n < t.length; n++)(e = t[n])() || t[n] !== e || t.splice(n--, 1);
            t.length || he.fx.stop(), Nt = undefined
        }, he.fx.timer = function (e) {
            he.timers.push(e), e() ? he.fx.start() : he.timers.pop()
        }, he.fx.interval = 13, he.fx.start = function () {
            jt || (jt = e.setInterval(he.fx.tick, he.fx.interval))
        }, he.fx.stop = function () {
            e.clearInterval(jt), jt = null
        }, he.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, he.fn.delay = function (t, n) {
            return t = he.fx && he.fx.speeds[t] || t, n = n || "fx", this.queue(n, function (n, i) {
                var r = e.setTimeout(n, t);
                i.stop = function () {
                    e.clearTimeout(r)
                }
            })
        },
        function () {
            var e, t = ie.createElement("input"),
                n = ie.createElement("div"),
                i = ie.createElement("select"),
                r = i.appendChild(ie.createElement("option"));
            (n = ie.createElement("div")).setAttribute("className", "t"), n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", e = n.getElementsByTagName("a")[0], t.setAttribute("type", "checkbox"), n.appendChild(t), (e = n.getElementsByTagName("a")[0]).style.cssText = "top:1px", de.getSetAttribute = "t" !== n.className, de.style = /top/.test(e.getAttribute("style")), de.hrefNormalized = "/a" === e.getAttribute("href"), de.checkOn = !!t.value, de.optSelected = r.selected, de.enctype = !!ie.createElement("form").enctype, i.disabled = !0, de.optDisabled = !r.disabled, (t = ie.createElement("input")).setAttribute("value", ""), de.input = "" === t.getAttribute("value"), t.value = "t", t.setAttribute("type", "radio"), de.radioValue = "t" === t.value
        }();
    var qt = /\r/g,
        Dt = /[\x20\t\r\n\f]+/g;
    he.fn.extend({
        val: function (e) {
            var t, n, i, r = this[0];
            return arguments.length ? (i = he.isFunction(e), this.each(function (n) {
                var r;
                1 === this.nodeType && (null == (r = i ? e.call(this, n, he(this).val()) : e) ? r = "" : "number" == typeof r ? r += "" : he.isArray(r) && (r = he.map(r, function (e) {
                    return null == e ? "" : e + ""
                })), (t = he.valHooks[this.type] || he.valHooks[this.nodeName.toLowerCase()]) && "set" in t && t.set(this, r, "value") !== undefined || (this.value = r))
            })) : r ? (t = he.valHooks[r.type] || he.valHooks[r.nodeName.toLowerCase()]) && "get" in t && (n = t.get(r, "value")) !== undefined ? n : "string" == typeof (n = r.value) ? n.replace(qt, "") : null == n ? "" : n : void 0
        }
    }), he.extend({
        valHooks: {
            option: {
                get: function (e) {
                    var t = he.find.attr(e, "value");
                    return null != t ? t : he.trim(he.text(e)).replace(Dt, " ")
                }
            },
            select: {
                get: function (e) {
                    for (var t, n, i = e.options, r = e.selectedIndex, o = "select-one" === e.type || r < 0, a = o ? null : [], s = o ? r + 1 : i.length, l = r < 0 ? s : o ? r : 0; l < s; l++)
                        if (((n = i[l]).selected || l === r) && (de.optDisabled ? !n.disabled : null === n.getAttribute("disabled")) && (!n.parentNode.disabled || !he.nodeName(n.parentNode, "optgroup"))) {
                            if (t = he(n).val(), o) return t;
                            a.push(t)
                        } return a
                },
                set: function (e, t) {
                    for (var n, i, r = e.options, o = he.makeArray(t), a = r.length; a--;)
                        if (i = r[a], he.inArray(he.valHooks.option.get(i), o) > -1) try {
                            i.selected = n = !0
                        } catch (s) {
                            i.scrollHeight
                        } else i.selected = !1;
                    return n || (e.selectedIndex = -1), r
                }
            }
        }
    }), he.each(["radio", "checkbox"], function () {
        he.valHooks[this] = {
            set: function (e, t) {
                if (he.isArray(t)) return e.checked = he.inArray(he(e).val(), t) > -1
            }
        }, de.checkOn || (he.valHooks[this].get = function (e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    });
    var $t, Ft, Mt = he.expr.attrHandle,
        Ht = /^(?:checked|selected)$/i,
        Rt = de.getSetAttribute,
        Pt = de.input;
    he.fn.extend({
        attr: function (e, t) {
            return ze(this, he.attr, e, t, arguments.length > 1)
        },
        removeAttr: function (e) {
            return this.each(function () {
                he.removeAttr(this, e)
            })
        }
    }), he.extend({
        attr: function (e, t, n) {
            var i, r, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o) return "undefined" == typeof e.getAttribute ? he.prop(e, t, n) : (1 === o && he.isXMLDoc(e) || (t = t.toLowerCase(), r = he.attrHooks[t] || (he.expr.match.bool.test(t) ? Ft : $t)), n !== undefined ? null === n ? void he.removeAttr(e, t) : r && "set" in r && (i = r.set(e, n, t)) !== undefined ? i : (e.setAttribute(t, n + ""), n) : r && "get" in r && null !== (i = r.get(e, t)) ? i : null == (i = he.find.attr(e, t)) ? undefined : i)
        },
        attrHooks: {
            type: {
                set: function (e, t) {
                    if (!de.radioValue && "radio" === t && he.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        },
        removeAttr: function (e, t) {
            var n, i, r = 0,
                o = t && t.match(Le);
            if (o && 1 === e.nodeType)
                for (; n = o[r++];) i = he.propFix[n] || n, he.expr.match.bool.test(n) ? Pt && Rt || !Ht.test(n) ? e[i] = !1 : e[he.camelCase("default-" + n)] = e[i] = !1 : he.attr(e, n, ""), e.removeAttribute(Rt ? n : i)
        }
    }), Ft = {
        set: function (e, t, n) {
            return !1 === t ? he.removeAttr(e, n) : Pt && Rt || !Ht.test(n) ? e.setAttribute(!Rt && he.propFix[n] || n, n) : e[he.camelCase("default-" + n)] = e[n] = !0, n
        }
    }, he.each(he.expr.match.bool.source.match(/\w+/g), function (e, t) {
        var n = Mt[t] || he.find.attr;
        Pt && Rt || !Ht.test(t) ? Mt[t] = function (e, t, i) {
            var r, o;
            return i || (o = Mt[t], Mt[t] = r, r = null != n(e, t, i) ? t.toLowerCase() : null, Mt[t] = o), r
        } : Mt[t] = function (e, t, n) {
            if (!n) return e[he.camelCase("default-" + t)] ? t.toLowerCase() : null
        }
    }), Pt && Rt || (he.attrHooks.value = {
        set: function (e, t, n) {
            if (!he.nodeName(e, "input")) return $t && $t.set(e, t, n);
            e.defaultValue = t
        }
    }), Rt || ($t = {
        set: function (e, t, n) {
            var i = e.getAttributeNode(n);
            if (i || e.setAttributeNode(i = e.ownerDocument.createAttribute(n)), i.value = t += "", "value" === n || t === e.getAttribute(n)) return t
        }
    }, Mt.id = Mt.name = Mt.coords = function (e, t, n) {
        var i;
        if (!n) return (i = e.getAttributeNode(t)) && "" !== i.value ? i.value : null
    }, he.valHooks.button = {
        get: function (e, t) {
            var n = e.getAttributeNode(t);
            if (n && n.specified) return n.value
        },
        set: $t.set
    }, he.attrHooks.contenteditable = {
        set: function (e, t, n) {
            $t.set(e, "" !== t && t, n)
        }
    }, he.each(["width", "height"], function (e, t) {
        he.attrHooks[t] = {
            set: function (e, n) {
                if ("" === n) return e.setAttribute(t, "auto"), n
            }
        }
    })), de.style || (he.attrHooks.style = {
        get: function (e) {
            return e.style.cssText || undefined
        },
        set: function (e, t) {
            return e.style.cssText = t + ""
        }
    });
    var It = /^(?:input|select|textarea|button|object)$/i,
        _t = /^(?:a|area)$/i;
    he.fn.extend({
        prop: function (e, t) {
            return ze(this, he.prop, e, t, arguments.length > 1)
        },
        removeProp: function (e) {
            return e = he.propFix[e] || e, this.each(function () {
                try {
                    this[e] = undefined, delete this[e]
                } catch (t) {}
            })
        }
    }), he.extend({
        prop: function (e, t, n) {
            var i, r, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o) return 1 === o && he.isXMLDoc(e) || (t = he.propFix[t] || t, r = he.propHooks[t]), n !== undefined ? r && "set" in r && (i = r.set(e, n, t)) !== undefined ? i : e[t] = n : r && "get" in r && null !== (i = r.get(e, t)) ? i : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function (e) {
                    var t = he.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : It.test(e.nodeName) || _t.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }), de.hrefNormalized || he.each(["href", "src"], function (e, t) {
        he.propHooks[t] = {
            get: function (e) {
                return e.getAttribute(t, 4)
            }
        }
    }), de.optSelected || (he.propHooks.selected = {
        get: function (e) {
            var t = e.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        },
        set: function (e) {
            var t = e.parentNode;
            t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
        }
    }), he.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
        he.propFix[this.toLowerCase()] = this
    }), de.enctype || (he.propFix.enctype = "encoding");
    var Ot = /[\t\r\n\f]/g;
    he.fn.extend({
        addClass: function (e) {
            var t, n, i, r, o, a, s, l = 0;
            if (he.isFunction(e)) return this.each(function (t) {
                he(this).addClass(e.call(this, t, W(this)))
            });
            if ("string" == typeof e && e)
                for (t = e.match(Le) || []; n = this[l++];)
                    if (r = W(n), i = 1 === n.nodeType && (" " + r + " ").replace(Ot, " ")) {
                        for (a = 0; o = t[a++];) i.indexOf(" " + o + " ") < 0 && (i += o + " ");
                        r !== (s = he.trim(i)) && he.attr(n, "class", s)
                    } return this
        },
        removeClass: function (e) {
            var t, n, i, r, o, a, s, l = 0;
            if (he.isFunction(e)) return this.each(function (t) {
                he(this).removeClass(e.call(this, t, W(this)))
            });
            if (!arguments.length) return this.attr("class", "");
            if ("string" == typeof e && e)
                for (t = e.match(Le) || []; n = this[l++];)
                    if (r = W(n), i = 1 === n.nodeType && (" " + r + " ").replace(Ot, " ")) {
                        for (a = 0; o = t[a++];)
                            for (; i.indexOf(" " + o + " ") > -1;) i = i.replace(" " + o + " ", " ");
                        r !== (s = he.trim(i)) && he.attr(n, "class", s)
                    } return this
        },
        toggleClass: function (e, t) {
            var n = typeof e;
            return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : he.isFunction(e) ? this.each(function (n) {
                he(this).toggleClass(e.call(this, n, W(this), t), t)
            }) : this.each(function () {
                var t, i, r, o;
                if ("string" === n)
                    for (i = 0, r = he(this), o = e.match(Le) || []; t = o[i++];) r.hasClass(t) ? r.removeClass(t) : r.addClass(t);
                else e !== undefined && "boolean" !== n || ((t = W(this)) && he._data(this, "__className__", t), he.attr(this, "class", t || !1 === e ? "" : he._data(this, "__className__") || ""))
            })
        },
        hasClass: function (e) {
            var t, n, i = 0;
            for (t = " " + e + " "; n = this[i++];)
                if (1 === n.nodeType && (" " + W(n) + " ").replace(Ot, " ").indexOf(t) > -1) return !0;
            return !1
        }
    }), he.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (e, t) {
        he.fn[t] = function (e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), he.fn.extend({
        hover: function (e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    });
    var zt = e.location,
        Bt = he.now(),
        Wt = /\?/,
        Xt = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    he.parseJSON = function (t) {
        if (e.JSON && e.JSON.parse) return e.JSON.parse(t + "");
        var n, i = null,
            r = he.trim(t + "");
        return r && !he.trim(r.replace(Xt, function (e, t, r, o) {
            return n && t && (i = 0), 0 === i ? e : (n = r || t, i += !o - !r, "")
        })) ? Function("return " + r)() : he.error("Invalid JSON: " + t)
    }, he.parseXML = function (t) {
        var n;
        if (!t || "string" != typeof t) return null;
        try {
            e.DOMParser ? n = (new e.DOMParser).parseFromString(t, "text/xml") : ((n = new e.ActiveXObject("Microsoft.XMLDOM")).async = "false", n.loadXML(t))
        } catch (i) {
            n = undefined
        }
        return n && n.documentElement && !n.getElementsByTagName("parsererror").length || he.error("Invalid XML: " + t), n
    };
    var Vt = /#.*$/,
        Ut = /([?&])_=[^&]*/,
        Gt = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        Jt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Yt = /^(?:GET|HEAD)$/,
        Qt = /^\/\//,
        Kt = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        Zt = {},
        en = {},
        tn = "*/".concat("*"),
        nn = zt.href,
        rn = Kt.exec(nn.toLowerCase()) || [];
    he.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: nn,
            type: "GET",
            isLocal: Jt.test(rn[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": tn,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": he.parseJSON,
                "text xml": he.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function (e, t) {
            return t ? U(U(e, he.ajaxSettings), t) : U(he.ajaxSettings, e)
        },
        ajaxPrefilter: X(Zt),
        ajaxTransport: X(en),
        ajax: function (t, n) {
            function i(t, n, i, r) {
                var o, d, y, b, w, T = n;
                2 !== x && (x = 2, l && e.clearTimeout(l), c = undefined, s = r || "", C.readyState = t > 0 ? 4 : 0, o = t >= 200 && t < 300 || 304 === t, i && (b = G(f, C, i)), b = J(f, b, C, o), o ? (f.ifModified && ((w = C.getResponseHeader("Last-Modified")) && (he.lastModified[a] = w), (w = C.getResponseHeader("etag")) && (he.etag[a] = w)), 204 === t || "HEAD" === f.type ? T = "nocontent" : 304 === t ? T = "notmodified" : (T = b.state, d = b.data, o = !(y = b.error))) : (y = T, !t && T || (T = "error", t < 0 && (t = 0))), C.status = t, C.statusText = (n || T) + "", o ? m.resolveWith(h, [d, T, C]) : m.rejectWith(h, [C, T, y]), C.statusCode(v), v = undefined, u && p.trigger(o ? "ajaxSuccess" : "ajaxError", [C, f, o ? d : y]), g.fireWith(h, [C, T]), u && (p.trigger("ajaxComplete", [C, f]), --he.active || he.event.trigger("ajaxStop")))
            }
            "object" == typeof t && (n = t, t = undefined), n = n || {};
            var r, o, a, s, l, u, c, d, f = he.ajaxSetup({}, n),
                h = f.context || f,
                p = f.context && (h.nodeType || h.jquery) ? he(h) : he.event,
                m = he.Deferred(),
                g = he.Callbacks("once memory"),
                v = f.statusCode || {},
                y = {},
                b = {},
                x = 0,
                w = "canceled",
                C = {
                    readyState: 0,
                    getResponseHeader: function (e) {
                        var t;
                        if (2 === x) {
                            if (!d)
                                for (d = {}; t = Gt.exec(s);) d[t[1].toLowerCase()] = t[2];
                            t = d[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function () {
                        return 2 === x ? s : null
                    },
                    setRequestHeader: function (e, t) {
                        var n = e.toLowerCase();
                        return x || (e = b[n] = b[n] || e, y[e] = t), this
                    },
                    overrideMimeType: function (e) {
                        return x || (f.mimeType = e), this
                    },
                    statusCode: function (e) {
                        var t;
                        if (e)
                            if (x < 2)
                                for (t in e) v[t] = [v[t], e[t]];
                            else C.always(e[C.status]);
                        return this
                    },
                    abort: function (e) {
                        var t = e || w;
                        return c && c.abort(t), i(0, t), this
                    }
                };
            if (m.promise(C).complete = g.add, C.success = C.done, C.error = C.fail, f.url = ((t || f.url || nn) + "").replace(Vt, "").replace(Qt, rn[1] + "//"), f.type = n.method || n.type || f.method || f.type, f.dataTypes = he.trim(f.dataType || "*").toLowerCase().match(Le) || [""], null == f.crossDomain && (r = Kt.exec(f.url.toLowerCase()), f.crossDomain = !(!r || r[1] === rn[1] && r[2] === rn[2] && (r[3] || ("http:" === r[1] ? "80" : "443")) === (rn[3] || ("http:" === rn[1] ? "80" : "443")))), f.data && f.processData && "string" != typeof f.data && (f.data = he.param(f.data, f.traditional)), V(Zt, f, n, C), 2 === x) return C;
            for (o in (u = he.event && f.global) && 0 == he.active++ && he.event.trigger("ajaxStart"), f.type = f.type.toUpperCase(), f.hasContent = !Yt.test(f.type), a = f.url, f.hasContent || (f.data && (a = f.url += (Wt.test(a) ? "&" : "?") + f.data, delete f.data), !1 === f.cache && (f.url = Ut.test(a) ? a.replace(Ut, "$1_=" + Bt++) : a + (Wt.test(a) ? "&" : "?") + "_=" + Bt++)), f.ifModified && (he.lastModified[a] && C.setRequestHeader("If-Modified-Since", he.lastModified[a]), he.etag[a] && C.setRequestHeader("If-None-Match", he.etag[a])), (f.data && f.hasContent && !1 !== f.contentType || n.contentType) && C.setRequestHeader("Content-Type", f.contentType), C.setRequestHeader("Accept", f.dataTypes[0] && f.accepts[f.dataTypes[0]] ? f.accepts[f.dataTypes[0]] + ("*" !== f.dataTypes[0] ? ", " + tn + "; q=0.01" : "") : f.accepts["*"]), f.headers) C.setRequestHeader(o, f.headers[o]);
            if (f.beforeSend && (!1 === f.beforeSend.call(h, C, f) || 2 === x)) return C.abort();
            for (o in w = "abort", {
                    success: 1,
                    error: 1,
                    complete: 1
                }) C[o](f[o]);
            if (c = V(en, f, n, C)) {
                if (C.readyState = 1, u && p.trigger("ajaxSend", [C, f]), 2 === x) return C;
                f.async && f.timeout > 0 && (l = e.setTimeout(function () {
                    C.abort("timeout")
                }, f.timeout));
                try {
                    x = 1, c.send(y, i)
                } catch (T) {
                    if (!(x < 2)) throw T;
                    i(-1, T)
                }
            } else i(-1, "No Transport");
            return C
        },
        getJSON: function (e, t, n) {
            return he.get(e, t, n, "json")
        },
        getScript: function (e, t) {
            return he.get(e, undefined, t, "script")
        }
    }), he.each(["get", "post"], function (e, t) {
        he[t] = function (e, n, i, r) {
            return he.isFunction(n) && (r = r || i, i = n, n = undefined), he.ajax(he.extend({
                url: e,
                type: t,
                dataType: r,
                data: n,
                success: i
            }, he.isPlainObject(e) && e))
        }
    }), he._evalUrl = function (e) {
        return he.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            throws: !0
        })
    }, he.fn.extend({
        wrapAll: function (e) {
            if (he.isFunction(e)) return this.each(function (t) {
                he(this).wrapAll(e.call(this, t))
            });
            if (this[0]) {
                var t = he(e, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && t.insertBefore(this[0]), t.map(function () {
                    for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
                    return e
                }).append(this)
            }
            return this
        },
        wrapInner: function (e) {
            return he.isFunction(e) ? this.each(function (t) {
                he(this).wrapInner(e.call(this, t))
            }) : this.each(function () {
                var t = he(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function (e) {
            var t = he.isFunction(e);
            return this.each(function (n) {
                he(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function () {
            return this.parent().each(function () {
                he.nodeName(this, "body") || he(this).replaceWith(this.childNodes)
            }).end()
        }
    }), he.expr.filters.hidden = function (e) {
        return de.reliableHiddenOffsets() ? e.offsetWidth <= 0 && e.offsetHeight <= 0 && !e.getClientRects().length : Q(e)
    }, he.expr.filters.visible = function (e) {
        return !he.expr.filters.hidden(e)
    };
    var on = /%20/g,
        an = /\[\]$/,
        sn = /\r?\n/g,
        ln = /^(?:submit|button|image|reset|file)$/i,
        un = /^(?:input|select|textarea|keygen)/i;
    he.param = function (e, t) {
        var n, i = [],
            r = function (e, t) {
                t = he.isFunction(t) ? t() : null == t ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
        if (t === undefined && (t = he.ajaxSettings && he.ajaxSettings.traditional), he.isArray(e) || e.jquery && !he.isPlainObject(e)) he.each(e, function () {
            r(this.name, this.value)
        });
        else
            for (n in e) K(n, e[n], t, r);
        return i.join("&").replace(on, "+")
    }, he.fn.extend({
        serialize: function () {
            return he.param(this.serializeArray())
        },
        serializeArray: function () {
            return this.map(function () {
                var e = he.prop(this, "elements");
                return e ? he.makeArray(e) : this
            }).filter(function () {
                var e = this.type;
                return this.name && !he(this).is(":disabled") && un.test(this.nodeName) && !ln.test(e) && (this.checked || !Be.test(e))
            }).map(function (e, t) {
                var n = he(this).val();
                return null == n ? null : he.isArray(n) ? he.map(n, function (e) {
                    return {
                        name: t.name,
                        value: e.replace(sn, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(sn, "\r\n")
                }
            }).get()
        }
    }), he.ajaxSettings.xhr = e.ActiveXObject !== undefined ? function () {
        return this.isLocal ? ee() : ie.documentMode > 8 ? Z() : /^(get|post|head|put|delete|options)$/i.test(this.type) && Z() || ee()
    } : Z;
    var cn = 0,
        dn = {},
        fn = he.ajaxSettings.xhr();
    e.attachEvent && e.attachEvent("onunload", function () {
        for (var e in dn) dn[e](undefined, !0)
    }), de.cors = !!fn && "withCredentials" in fn, (fn = de.ajax = !!fn) && he.ajaxTransport(function (t) {
        var n;
        if (!t.crossDomain || de.cors) return {
            send: function (i, r) {
                var o, a = t.xhr(),
                    s = ++cn;
                if (a.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
                    for (o in t.xhrFields) a[o] = t.xhrFields[o];
                for (o in t.mimeType && a.overrideMimeType && a.overrideMimeType(t.mimeType), t.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest"), i) i[o] !== undefined && a.setRequestHeader(o, i[o] + "");
                a.send(t.hasContent && t.data || null), n = function (e, i) {
                    var o, l, u;
                    if (n && (i || 4 === a.readyState))
                        if (delete dn[s], n = undefined, a.onreadystatechange = he.noop, i) 4 !== a.readyState && a.abort();
                        else {
                            u = {}, o = a.status, "string" == typeof a.responseText && (u.text = a.responseText);
                            try {
                                l = a.statusText
                            } catch (c) {
                                l = ""
                            }
                            o || !t.isLocal || t.crossDomain ? 1223 === o && (o = 204) : o = u.text ? 200 : 404
                        } u && r(o, l, u, a.getAllResponseHeaders())
                }, t.async ? 4 === a.readyState ? e.setTimeout(n) : a.onreadystatechange = dn[s] = n : n()
            },
            abort: function () {
                n && n(undefined, !0)
            }
        }
    }), he.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function (e) {
                return he.globalEval(e), e
            }
        }
    }), he.ajaxPrefilter("script", function (e) {
        e.cache === undefined && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), he.ajaxTransport("script", function (e) {
        if (e.crossDomain) {
            var t, n = ie.head || he("head")[0] || ie.documentElement;
            return {
                send: function (i, r) {
                    (t = ie.createElement("script")).async = !0, e.scriptCharset && (t.charset = e.scriptCharset), t.src = e.url, t.onload = t.onreadystatechange = function (e, n) {
                        (n || !t.readyState || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = null, t.parentNode && t.parentNode.removeChild(t), t = null, n || r(200, "success"))
                    }, n.insertBefore(t, n.firstChild)
                },
                abort: function () {
                    t && t.onload(undefined, !0)
                }
            }
        }
    });
    var hn = [],
        pn = /(=)\?(?=&|$)|\?\?/;
    he.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            var e = hn.pop() || he.expando + "_" + Bt++;
            return this[e] = !0, e
        }
    }), he.ajaxPrefilter("json jsonp", function (t, n, i) {
        var r, o, a, s = !1 !== t.jsonp && (pn.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && pn.test(t.data) && "data");
        if (s || "jsonp" === t.dataTypes[0]) return r = t.jsonpCallback = he.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace(pn, "$1" + r) : !1 !== t.jsonp && (t.url += (Wt.test(t.url) ? "&" : "?") + t.jsonp + "=" + r), t.converters["script json"] = function () {
            return a || he.error(r + " was not called"), a[0]
        }, t.dataTypes[0] = "json", o = e[r], e[r] = function () {
            a = arguments
        }, i.always(function () {
            o === undefined ? he(e).removeProp(r) : e[r] = o, t[r] && (t.jsonpCallback = n.jsonpCallback, hn.push(r)), a && he.isFunction(o) && o(a[0]), a = o = undefined
        }), "script"
    }), he.parseHTML = function (e, t, n) {
        if (!e || "string" != typeof e) return null;
        "boolean" == typeof t && (n = t, t = !1), t = t || ie;
        var i = Ce.exec(e),
            r = !n && [];
        return i ? [t.createElement(i[1])] : (i = v([e], t, r), r && r.length && he(r).remove(), he.merge([], i.childNodes))
    };
    var mn = he.fn.load;
    he.fn.load = function (e, t, n) {
        if ("string" != typeof e && mn) return mn.apply(this, arguments);
        var i, r, o, a = this,
            s = e.indexOf(" ");
        return s > -1 && (i = he.trim(e.slice(s, e.length)), e = e.slice(0, s)), he.isFunction(t) ? (n = t, t = undefined) : t && "object" == typeof t && (r = "POST"), a.length > 0 && he.ajax({
            url: e,
            type: r || "GET",
            dataType: "html",
            data: t
        }).done(function (e) {
            o = arguments, a.html(i ? he("<div>").append(he.parseHTML(e)).find(i) : e)
        }).always(n && function (e, t) {
            a.each(function () {
                n.apply(this, o || [e.responseText, t, e])
            })
        }), this
    }, he.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
        he.fn[t] = function (e) {
            return this.on(t, e)
        }
    }), he.expr.filters.animated = function (e) {
        return he.grep(he.timers, function (t) {
            return e === t.elem
        }).length
    }, he.offset = {
        setOffset: function (e, t, n) {
            var i, r, o, a, s, l, u = he.css(e, "position"),
                c = he(e),
                d = {};
            "static" === u && (e.style.position = "relative"), s = c.offset(), o = he.css(e, "top"), l = he.css(e, "left"), ("absolute" === u || "fixed" === u) && he.inArray("auto", [o, l]) > -1 ? (a = (i = c.position()).top, r = i.left) : (a = parseFloat(o) || 0, r = parseFloat(l) || 0), he.isFunction(t) && (t = t.call(e, n, he.extend({}, s))), null != t.top && (d.top = t.top - s.top + a), null != t.left && (d.left = t.left - s.left + r), "using" in t ? t.using.call(e, d) : c.css(d)
        }
    }, he.fn.extend({
        offset: function (e) {
            if (arguments.length) return e === undefined ? this : this.each(function (t) {
                he.offset.setOffset(this, e, t)
            });
            var t, n, i = {
                    top: 0,
                    left: 0
                },
                r = this[0],
                o = r && r.ownerDocument;
            return o ? (t = o.documentElement, he.contains(t, r) ? ("undefined" != typeof r.getBoundingClientRect && (i = r.getBoundingClientRect()), n = te(o), {
                top: i.top + (n.pageYOffset || t.scrollTop) - (t.clientTop || 0),
                left: i.left + (n.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
            }) : i) : void 0
        },
        position: function () {
            if (this[0]) {
                var e, t, n = {
                        top: 0,
                        left: 0
                    },
                    i = this[0];
                return "fixed" === he.css(i, "position") ? t = i.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), he.nodeName(e[0], "html") || (n = e.offset()), n.top += he.css(e[0], "borderTopWidth", !0), n.left += he.css(e[0], "borderLeftWidth", !0)), {
                    top: t.top - n.top - he.css(i, "marginTop", !0),
                    left: t.left - n.left - he.css(i, "marginLeft", !0)
                }
            }
        },
        offsetParent: function () {
            return this.map(function () {
                for (var e = this.offsetParent; e && !he.nodeName(e, "html") && "static" === he.css(e, "position");) e = e.offsetParent;
                return e || mt
            })
        }
    }), he.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function (e, t) {
        var n = /Y/.test(t);
        he.fn[e] = function (i) {
            return ze(this, function (e, i, r) {
                var o = te(e);
                if (r === undefined) return o ? t in o ? o[t] : o.document.documentElement[i] : e[i];
                o ? o.scrollTo(n ? he(o).scrollLeft() : r, n ? r : he(o).scrollTop()) : e[i] = r
            }, e, i, arguments.length, null)
        }
    }), he.each(["top", "left"], function (e, t) {
        he.cssHooks[t] = q(de.pixelPosition, function (e, n) {
            if (n) return n = vt(e, t), ht.test(n) ? he(e).position()[t] + "px" : n
        })
    }), he.each({
        Height: "height",
        Width: "width"
    }, function (e, t) {
        he.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function (n, i) {
            he.fn[i] = function (i, r) {
                var o = arguments.length && (n || "boolean" != typeof i),
                    a = n || (!0 === i || !0 === r ? "margin" : "border");
                return ze(this, function (t, n, i) {
                    var r;
                    return he.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (r = t.documentElement, Math.max(t.body["scroll" + e], r["scroll" + e], t.body["offset" + e], r["offset" + e], r["client" + e])) : i === undefined ? he.css(t, n, a) : he.style(t, n, i, a)
                }, t, o ? i : undefined, o, null)
            }
        })
    }), he.fn.extend({
        bind: function (e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function (e, t) {
            return this.off(e, null, t)
        },
        delegate: function (e, t, n, i) {
            return this.on(t, e, n, i)
        },
        undelegate: function (e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    }), he.fn.size = function () {
        return this.length
    }, he.fn.andSelf = he.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function () {
        return he
    });
    var gn = e.jQuery,
        vn = e.$;
    return he.noConflict = function (t) {
        return e.$ === he && (e.$ = vn), t && e.jQuery === he && (e.jQuery = gn), he
    }, t || (e.jQuery = e.$ = he), he
}),
function (e, t) {
    "use strict";
    var n;
    e.rails !== t && e.error("jquery-ujs has already been loaded!");
    var i = e(document);
    e.rails = n = {
        linkClickSelector: "a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]",
        buttonClickSelector: "button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)",
        inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
        formSubmitSelector: "form",
        formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])",
        disableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled",
        enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled",
        requiredInputSelector: "input[name][required]:not([disabled]), textarea[name][required]:not([disabled])",
        fileInputSelector: "input[name][type=file]:not([disabled])",
        linkDisableSelector: "a[data-disable-with], a[data-disable]",
        buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]",
        csrfToken: function () {
            return e("meta[name=csrf-token]").attr("content")
        },
        csrfParam: function () {
            return e("meta[name=csrf-param]").attr("content")
        },
        CSRFProtection: function (e) {
            var t = n.csrfToken();
            t && e.setRequestHeader("X-CSRF-Token", t)
        },
        refreshCSRFTokens: function () {
            e('form input[name="' + n.csrfParam() + '"]').val(n.csrfToken())
        },
        fire: function (t, n, i) {
            var r = e.Event(n);
            return t.trigger(r, i), !1 !== r.result
        },
        confirm: function (e) {
            return confirm(e)
        },
        ajax: function (t) {
            return e.ajax(t)
        },
        href: function (e) {
            return e[0].href
        },
        isRemote: function (e) {
            return e.data("remote") !== t && !1 !== e.data("remote")
        },
        handleRemote: function (i) {
            var r, o, a, s, l, u;
            if (n.fire(i, "ajax:before")) {
                if (s = i.data("with-credentials") || null, l = i.data("type") || e.ajaxSettings && e.ajaxSettings.dataType, i.is("form")) {
                    r = i.data("ujs:submit-button-formmethod") || i.attr("method"), o = i.data("ujs:submit-button-formaction") || i.attr("action"), a = e(i[0]).serializeArray();
                    var c = i.data("ujs:submit-button");
                    c && (a.push(c), i.data("ujs:submit-button", null)), i.data("ujs:submit-button-formmethod", null), i.data("ujs:submit-button-formaction", null)
                } else i.is(n.inputChangeSelector) ? (r = i.data("method"), o = i.data("url"), a = i.serialize(), i.data("params") && (a = a + "&" + i.data("params"))) : i.is(n.buttonClickSelector) ? (r = i.data("method") || "get", o = i.data("url"), a = i.serialize(), i.data("params") && (a = a + "&" + i.data("params"))) : (r = i.data("method"), o = n.href(i), a = i.data("params") || null);
                return u = {
                    type: r || "GET",
                    data: a,
                    dataType: l,
                    beforeSend: function (e, r) {
                        if (r.dataType === t && e.setRequestHeader("accept", "*/*;q=0.5, " + r.accepts.script), !n.fire(i, "ajax:beforeSend", [e, r])) return !1;
                        i.trigger("ajax:send", e)
                    },
                    success: function (e, t, n) {
                        i.trigger("ajax:success", [e, t, n])
                    },
                    complete: function (e, t) {
                        i.trigger("ajax:complete", [e, t])
                    },
                    error: function (e, t, n) {
                        i.trigger("ajax:error", [e, t, n])
                    },
                    crossDomain: n.isCrossDomain(o)
                }, s && (u.xhrFields = {
                    withCredentials: s
                }), o && (u.url = o), n.ajax(u)
            }
            return !1
        },
        isCrossDomain: function (e) {
            var t = document.createElement("a");
            t.href = location.href;
            var n = document.createElement("a");
            try {
                return n.href = e, n.href = n.href, !((!n.protocol || ":" === n.protocol) && !n.host || t.protocol + "//" + t.host == n.protocol + "//" + n.host)
            } catch (i) {
                return !0
            }
        },
        handleMethod: function (i) {
            var r = n.href(i),
                o = i.data("method"),
                a = i.attr("target"),
                s = n.csrfToken(),
                l = n.csrfParam(),
                u = e('<form method="post" action="' + r + '"></form>'),
                c = '<input name="_method" value="' + o + '" type="hidden" />';
            l === t || s === t || n.isCrossDomain(r) || (c += '<input name="' + l + '" value="' + s + '" type="hidden" />'), a && u.attr("target", a), u.hide().append(c).appendTo("body"), u.submit()
        },
        formElements: function (t, n) {
            return t.is("form") ? e(t[0].elements).filter(n) : t.find(n)
        },
        disableFormElements: function (t) {
            n.formElements(t, n.disableSelector).each(function () {
                n.disableFormElement(e(this))
            })
        },
        disableFormElement: function (e) {
            var n, i;
            n = e.is("button") ? "html" : "val", (i = e.data("disable-with")) !== t && (e.data("ujs:enable-with", e[n]()), e[n](i)), e.prop("disabled", !0), e.data("ujs:disabled", !0)
        },
        enableFormElements: function (t) {
            n.formElements(t, n.enableSelector).each(function () {
                n.enableFormElement(e(this))
            })
        },
        enableFormElement: function (e) {
            var n = e.is("button") ? "html" : "val";
            e.data("ujs:enable-with") !== t && (e[n](e.data("ujs:enable-with")), e.removeData("ujs:enable-with")), e.prop("disabled", !1), e.removeData("ujs:disabled")
        },
        allowAction: function (e) {
            var t, i = e.data("confirm"),
                r = !1;
            if (!i) return !0;
            if (n.fire(e, "confirm")) {
                try {
                    r = n.confirm(i)
                } catch (o) {
                    (console.error || console.log).call(console, o.stack || o)
                }
                t = n.fire(e, "confirm:complete", [r])
            }
            return r && t
        },
        blankInputs: function (t, n, i) {
            var r, o, a, s = e(),
                l = n || "input,textarea",
                u = t.find(l),
                c = {};
            return u.each(function () {
                (r = e(this)).is("input[type=radio]") ? (a = r.attr("name"), c[a] || (0 === t.find('input[type=radio]:checked[name="' + a + '"]').length && (o = t.find('input[type=radio][name="' + a + '"]'), s = s.add(o)), c[a] = a)) : (r.is("input[type=checkbox],input[type=radio]") ? r.is(":checked") : !!r.val()) === i && (s = s.add(r))
            }), !!s.length && s
        },
        nonBlankInputs: function (e, t) {
            return n.blankInputs(e, t, !0)
        },
        stopEverything: function (t) {
            return e(t.target).trigger("ujs:everythingStopped"), t.stopImmediatePropagation(), !1
        },
        disableElement: function (e) {
            var i = e.data("disable-with");
            i !== t && (e.data("ujs:enable-with", e.html()), e.html(i)), e.bind("click.railsDisable", function (e) {
                return n.stopEverything(e)
            }), e.data("ujs:disabled", !0)
        },
        enableElement: function (e) {
            e.data("ujs:enable-with") !== t && (e.html(e.data("ujs:enable-with")), e.removeData("ujs:enable-with")), e.unbind("click.railsDisable"), e.removeData("ujs:disabled")
        }
    }, n.fire(i, "rails:attachBindings") && (e.ajaxPrefilter(function (e, t, i) {
        e.crossDomain || n.CSRFProtection(i)
    }), e(window).on("pageshow.rails", function () {
        e(e.rails.enableSelector).each(function () {
            var t = e(this);
            t.data("ujs:disabled") && e.rails.enableFormElement(t)
        }), e(e.rails.linkDisableSelector).each(function () {
            var t = e(this);
            t.data("ujs:disabled") && e.rails.enableElement(t)
        })
    }), i.on("ajax:complete", n.linkDisableSelector, function () {
        n.enableElement(e(this))
    }), i.on("ajax:complete", n.buttonDisableSelector, function () {
        n.enableFormElement(e(this))
    }), i.on("click.rails", n.linkClickSelector, function (t) {
        var i = e(this),
            r = i.data("method"),
            o = i.data("params"),
            a = t.metaKey || t.ctrlKey;
        if (!n.allowAction(i)) return n.stopEverything(t);
        if (!a && i.is(n.linkDisableSelector) && n.disableElement(i), n.isRemote(i)) {
            if (a && (!r || "GET" === r) && !o) return !0;
            var s = n.handleRemote(i);
            return !1 === s ? n.enableElement(i) : s.fail(function () {
                n.enableElement(i)
            }), !1
        }
        return r ? (n.handleMethod(i), !1) : void 0
    }), i.on("click.rails", n.buttonClickSelector, function (t) {
        var i = e(this);
        if (!n.allowAction(i) || !n.isRemote(i)) return n.stopEverything(t);
        i.is(n.buttonDisableSelector) && n.disableFormElement(i);
        var r = n.handleRemote(i);
        return !1 === r ? n.enableFormElement(i) : r.fail(function () {
            n.enableFormElement(i)
        }), !1
    }), i.on("change.rails", n.inputChangeSelector, function (t) {
        var i = e(this);
        return n.allowAction(i) && n.isRemote(i) ? (n.handleRemote(i), !1) : n.stopEverything(t)
    }), i.on("submit.rails", n.formSubmitSelector, function (i) {
        var r, o, a = e(this),
            s = n.isRemote(a);
        if (!n.allowAction(a)) return n.stopEverything(i);
        if (a.attr("novalidate") === t)
            if (a.data("ujs:formnovalidate-button") === t) {
                if ((r = n.blankInputs(a, n.requiredInputSelector, !1)) && n.fire(a, "ajax:aborted:required", [r])) return n.stopEverything(i)
            } else a.data("ujs:formnovalidate-button", t);
        if (s) {
            if (o = n.nonBlankInputs(a, n.fileInputSelector)) {
                setTimeout(function () {
                    n.disableFormElements(a)
                }, 13);
                var l = n.fire(a, "ajax:aborted:file", [o]);
                return l || setTimeout(function () {
                    n.enableFormElements(a)
                }, 13), l
            }
            return n.handleRemote(a), !1
        }
        setTimeout(function () {
            n.disableFormElements(a)
        }, 13)
    }), i.on("click.rails", n.formInputClickSelector, function (t) {
        var i = e(this);
        if (!n.allowAction(i)) return n.stopEverything(t);
        var r = i.attr("name"),
            o = r ? {
                name: r,
                value: i.val()
            } : null,
            a = i.closest("form");
        0 === a.length && (a = e("#" + i.attr("form"))), a.data("ujs:submit-button", o), a.data("ujs:formnovalidate-button", i.attr("formnovalidate")), a.data("ujs:submit-button-formaction", i.attr("formaction")), a.data("ujs:submit-button-formmethod", i.attr("formmethod"))
    }), i.on("ajax:send.rails", n.formSubmitSelector, function (t) {
        this === t.target && n.disableFormElements(e(this))
    }), i.on("ajax:complete.rails", n.formSubmitSelector, function (t) {
        this === t.target && n.enableFormElements(e(this))
    }), e(function () {
        n.refreshCSRFTokens()
    }))
}(jQuery),
/*!
 * jQuery Validation Plugin v1.16.0
 * Copyright (c) 2016 Jörn Zaefferer
 */
function (e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof module && module.exports ? module.exports = e(require("jquery")) : e(jQuery)
}(function (e) {
    e.extend(e.fn, {
        validate: function (t) {
            if (this.length) {
                var n = e.data(this[0], "validator");
                return n || (this.attr("novalidate", "novalidate"), n = new e.validator(t, this[0]), e.data(this[0], "validator", n), n.settings.onsubmit && (this.on("click.validate", ":submit", function (t) {
                    n.settings.submitHandler && (n.submitButton = t.target), e(this).hasClass("cancel") && (n.cancelSubmit = !0), e(this).attr("formnovalidate") !== undefined && (n.cancelSubmit = !0)
                }), this.on("submit.validate", function (t) {
                    function i() {
                        var i, r;
                        return !n.settings.submitHandler || (n.submitButton && (i = e("<input type='hidden'/>").attr("name", n.submitButton.name).val(e(n.submitButton).val()).appendTo(n.currentForm)), r = n.settings.submitHandler.call(n, n.currentForm, t), n.submitButton && i.remove(), r !== undefined && r)
                    }
                    return n.settings.debug && t.preventDefault(), n.cancelSubmit ? (n.cancelSubmit = !1, i()) : n.form() ? n.pendingRequest ? (n.formSubmitted = !0, !1) : i() : (n.focusInvalid(), !1)
                })), n)
            }
            t && t.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing.")
        },
        valid: function () {
            var t, n, i;
            return e(this[0]).is("form") ? t = this.validate().form() : (i = [], t = !0, n = e(this[0].form).validate(), this.each(function () {
                (t = n.element(this) && t) || (i = i.concat(n.errorList))
            }), n.errorList = i), t
        },
        rules: function (t, n) {
            var i, r, o, a, s, l, u = this[0];
            if (null != u && null != u.form) {
                if (t) switch (r = (i = e.data(u.form, "validator").settings).rules, o = e.validator.staticRules(u), t) {
                    case "add":
                        e.extend(o, e.validator.normalizeRule(n)), delete o.messages, r[u.name] = o, n.messages && (i.messages[u.name] = e.extend(i.messages[u.name], n.messages));
                        break;
                    case "remove":
                        return n ? (l = {}, e.each(n.split(/\s/), function (t, n) {
                            l[n] = o[n], delete o[n], "required" === n && e(u).removeAttr("aria-required")
                        }), l) : (delete r[u.name], o)
                }
                return (a = e.validator.normalizeRules(e.extend({}, e.validator.classRules(u), e.validator.attributeRules(u), e.validator.dataRules(u), e.validator.staticRules(u)), u)).required && (s = a.required, delete a.required, a = e.extend({
                    required: s
                }, a), e(u).attr("aria-required", "true")), a.remote && (s = a.remote, delete a.remote, a = e.extend(a, {
                    remote: s
                })), a
            }
        }
    }), e.extend(e.expr.pseudos || e.expr[":"], {
        blank: function (t) {
            return !e.trim("" + e(t).val())
        },
        filled: function (t) {
            var n = e(t).val();
            return null !== n && !!e.trim("" + n)
        },
        unchecked: function (t) {
            return !e(t).prop("checked")
        }
    }), e.validator = function (t, n) {
        this.settings = e.extend(!0, {}, e.validator.defaults, t), this.currentForm = n, this.init()
    }, e.validator.format = function (t, n) {
        return 1 === arguments.length ? function () {
            var n = e.makeArray(arguments);
            return n.unshift(t), e.validator.format.apply(this, n)
        } : n === undefined ? t : (arguments.length > 2 && n.constructor !== Array && (n = e.makeArray(arguments).slice(1)), n.constructor !== Array && (n = [n]), e.each(n, function (e, n) {
            t = t.replace(new RegExp("\\{" + e + "\\}", "g"), function () {
                return n
            })
        }), t)
    }, e.extend(e.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            pendingClass: "pending",
            validClass: "valid",
            errorElement: "label",
            focusCleanup: !1,
            focusInvalid: !0,
            errorContainer: e([]),
            errorLabelContainer: e([]),
            onsubmit: !0,
            ignore: ":hidden",
            ignoreTitle: !1,
            onfocusin: function (e) {
                this.lastActive = e, this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, e, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(e)))
            },
            onfocusout: function (e) {
                this.checkable(e) || !(e.name in this.submitted) && this.optional(e) || this.element(e)
            },
            onkeyup: function (t, n) {
                var i = [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225];
                9 === n.which && "" === this.elementValue(t) || -1 !== e.inArray(n.keyCode, i) || (t.name in this.submitted || t.name in this.invalid) && this.element(t)
            },
            onclick: function (e) {
                e.name in this.submitted ? this.element(e) : e.parentNode.name in this.submitted && this.element(e.parentNode)
            },
            highlight: function (t, n, i) {
                "radio" === t.type ? this.findByName(t.name).addClass(n).removeClass(i) : e(t).addClass(n).removeClass(i)
            },
            unhighlight: function (t, n, i) {
                "radio" === t.type ? this.findByName(t.name).removeClass(n).addClass(i) : e(t).removeClass(n).addClass(i)
            }
        },
        setDefaults: function (t) {
            e.extend(e.validator.defaults, t)
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            equalTo: "Please enter the same value again.",
            maxlength: e.validator.format("Please enter no more than {0} characters."),
            minlength: e.validator.format("Please enter at least {0} characters."),
            rangelength: e.validator.format("Please enter a value between {0} and {1} characters long."),
            range: e.validator.format("Please enter a value between {0} and {1}."),
            max: e.validator.format("Please enter a value less than or equal to {0}."),
            min: e.validator.format("Please enter a value greater than or equal to {0}."),
            step: e.validator.format("Please enter a multiple of {0}.")
        },
        autoCreateRanges: !1,
        prototype: {
            init: function () {
                function t(t) {
                    !this.form && this.hasAttribute("contenteditable") && (this.form = e(this).closest("form")[0]);
                    var n = e.data(this.form, "validator"),
                        i = "on" + t.type.replace(/^validate/, ""),
                        r = n.settings;
                    r[i] && !e(this).is(r.ignore) && r[i].call(n, this, t)
                }
                this.labelContainer = e(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || e(this.currentForm), this.containers = e(this.settings.errorContainer).add(this.settings.errorLabelContainer), this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, this.invalid = {}, this.reset();
                var n, i = this.groups = {};
                e.each(this.settings.groups, function (t, n) {
                    "string" == typeof n && (n = n.split(/\s/)), e.each(n, function (e, n) {
                        i[n] = t
                    })
                }), n = this.settings.rules, e.each(n, function (t, i) {
                    n[t] = e.validator.normalizeRule(i)
                }), e(this.currentForm).on("focusin.validate focusout.validate keyup.validate", ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox'], [contenteditable], [type='button']", t).on("click.validate", "select, option, [type='radio'], [type='checkbox']", t), this.settings.invalidHandler && e(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler), e(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true")
            },
            form: function () {
                return this.checkForm(), e.extend(this.submitted, this.errorMap), this.invalid = e.extend({}, this.errorMap), this.valid() || e(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid()
            },
            checkForm: function () {
                this.prepareForm();
                for (var e = 0, t = this.currentElements = this.elements(); t[e]; e++) this.check(t[e]);
                return this.valid()
            },
            element: function (t) {
                var n, i, r = this.clean(t),
                    o = this.validationTargetFor(r),
                    a = this,
                    s = !0;
                return o === undefined ? delete this.invalid[r.name] : (this.prepareElement(o), this.currentElements = e(o), (i = this.groups[o.name]) && e.each(this.groups, function (e, t) {
                    t === i && e !== o.name && (r = a.validationTargetFor(a.clean(a.findByName(e)))) && r.name in a.invalid && (a.currentElements.push(r), s = a.check(r) && s)
                }), n = !1 !== this.check(o), s = s && n, this.invalid[o.name] = !n, this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), e(t).attr("aria-invalid", !n)), s
            },
            showErrors: function (t) {
                if (t) {
                    var n = this;
                    e.extend(this.errorMap, t), this.errorList = e.map(this.errorMap, function (e, t) {
                        return {
                            message: e,
                            element: n.findByName(t)[0]
                        }
                    }), this.successList = e.grep(this.successList, function (e) {
                        return !(e.name in t)
                    })
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
            },
            resetForm: function () {
                e.fn.resetForm && e(this.currentForm).resetForm(), this.invalid = {}, this.submitted = {}, this.prepareForm(), this.hideErrors();
                var t = this.elements().removeData("previousValue").removeAttr("aria-invalid");
                this.resetElements(t)
            },
            resetElements: function (e) {
                var t;
                if (this.settings.unhighlight)
                    for (t = 0; e[t]; t++) this.settings.unhighlight.call(this, e[t], this.settings.errorClass, ""), this.findByName(e[t].name).removeClass(this.settings.validClass);
                else e.removeClass(this.settings.errorClass).removeClass(this.settings.validClass)
            },
            numberOfInvalids: function () {
                return this.objectLength(this.invalid)
            },
            objectLength: function (e) {
                var t, n = 0;
                for (t in e) e[t] && n++;
                return n
            },
            hideErrors: function () {
                this.hideThese(this.toHide)
            },
            hideThese: function (e) {
                e.not(this.containers).text(""), this.addWrapper(e).hide()
            },
            valid: function () {
                return 0 === this.size()
            },
            size: function () {
                return this.errorList.length
            },
            focusInvalid: function () {
                if (this.settings.focusInvalid) try {
                    e(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
                } catch (t) {}
            },
            findLastActive: function () {
                var t = this.lastActive;
                return t && 1 === e.grep(this.errorList, function (e) {
                    return e.element.name === t.name
                }).length && t
            },
            elements: function () {
                var t = this,
                    n = {};
                return e(this.currentForm).find("input, select, textarea, [contenteditable]").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function () {
                    var i = this.name || e(this).attr("name");
                    return !i && t.settings.debug && window.console && console.error("%o has no name assigned", this), this.hasAttribute("contenteditable") && (this.form = e(this).closest("form")[0]), !(i in n || !t.objectLength(e(this).rules())) && (n[i] = !0, !0)
                })
            },
            clean: function (t) {
                return e(t)[0]
            },
            errors: function () {
                var t = this.settings.errorClass.split(" ").join(".");
                return e(this.settings.errorElement + "." + t, this.errorContext)
            },
            resetInternals: function () {
                this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = e([]), this.toHide = e([])
            },
            reset: function () {
                this.resetInternals(), this.currentElements = e([])
            },
            prepareForm: function () {
                this.reset(), this.toHide = this.errors().add(this.containers)
            },
            prepareElement: function (e) {
                this.reset(), this.toHide = this.errorsFor(e)
            },
            elementValue: function (t) {
                var n, i, r = e(t),
                    o = t.type;
                return "radio" === o || "checkbox" === o ? this.findByName(t.name).filter(":checked").val() : "number" === o && "undefined" != typeof t.validity ? t.validity.badInput ? "NaN" : r.val() : (n = t.hasAttribute("contenteditable") ? r.text() : r.val(), "file" === o ? "C:\\fakepath\\" === n.substr(0, 12) ? n.substr(12) : (i = n.lastIndexOf("/")) >= 0 ? n.substr(i + 1) : (i = n.lastIndexOf("\\")) >= 0 ? n.substr(i + 1) : n : "string" == typeof n ? n.replace(/\r/g, "") : n)
            },
            check: function (t) {
                t = this.validationTargetFor(this.clean(t));
                var n, i, r, o = e(t).rules(),
                    a = e.map(o, function (e, t) {
                        return t
                    }).length,
                    s = !1,
                    l = this.elementValue(t);
                if ("function" == typeof o.normalizer) {
                    if ("string" != typeof (l = o.normalizer.call(t, l))) throw new TypeError("The normalizer should return a string value.");
                    delete o.normalizer
                }
                for (i in o) {
                    r = {
                        method: i,
                        parameters: o[i]
                    };
                    try {
                        if ("dependency-mismatch" === (n = e.validator.methods[i].call(this, l, t, r.parameters)) && 1 === a) {
                            s = !0;
                            continue
                        }
                        if (s = !1, "pending" === n) return void(this.toHide = this.toHide.not(this.errorsFor(t)));
                        if (!n) return this.formatAndAdd(t, r), !1
                    } catch (u) {
                        throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + t.id + ", check the '" + r.method + "' method.", u), u instanceof TypeError && (u.message += ".  Exception occurred when checking element " + t.id + ", check the '" + r.method + "' method."), u
                    }
                }
                if (!s) return this.objectLength(o) && this.successList.push(t), !0
            },
            customDataMessage: function (t, n) {
                return e(t).data("msg" + n.charAt(0).toUpperCase() + n.substring(1).toLowerCase()) || e(t).data("msg")
            },
            customMessage: function (e, t) {
                var n = this.settings.messages[e];
                return n && (n.constructor === String ? n : n[t])
            },
            findDefined: function () {
                for (var e = 0; e < arguments.length; e++)
                    if (arguments[e] !== undefined) return arguments[e];
                return undefined
            },
            defaultMessage: function (t, n) {
                "string" == typeof n && (n = {
                    method: n
                });
                var i = this.findDefined(this.customMessage(t.name, n.method), this.customDataMessage(t, n.method), !this.settings.ignoreTitle && t.title || undefined, e.validator.messages[n.method], "<strong>Warning: No message defined for " + t.name + "</strong>"),
                    r = /\$?\{(\d+)\}/g;
                return "function" == typeof i ? i = i.call(this, n.parameters, t) : r.test(i) && (i = e.validator.format(i.replace(r, "{$1}"), n.parameters)), i
            },
            formatAndAdd: function (e, t) {
                var n = this.defaultMessage(e, t);
                this.errorList.push({
                    message: n,
                    element: e,
                    method: t.method
                }), this.errorMap[e.name] = n, this.submitted[e.name] = n
            },
            addWrapper: function (e) {
                return this.settings.wrapper && (e = e.add(e.parent(this.settings.wrapper))), e
            },
            defaultShowErrors: function () {
                var e, t, n;
                for (e = 0; this.errorList[e]; e++) n = this.errorList[e], this.settings.highlight && this.settings.highlight.call(this, n.element, this.settings.errorClass, this.settings.validClass), this.showLabel(n.element, n.message);
                if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success)
                    for (e = 0; this.successList[e]; e++) this.showLabel(this.successList[e]);
                if (this.settings.unhighlight)
                    for (e = 0, t = this.validElements(); t[e]; e++) this.settings.unhighlight.call(this, t[e], this.settings.errorClass, this.settings.validClass);
                this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show()
            },
            validElements: function () {
                return this.currentElements.not(this.invalidElements())
            },
            invalidElements: function () {
                return e(this.errorList).map(function () {
                    return this.element
                })
            },
            showLabel: function (t, n) {
                var i, r, o, a, s = this.errorsFor(t),
                    l = this.idOrName(t),
                    u = e(t).attr("aria-describedby");
                s.length ? (s.removeClass(this.settings.validClass).addClass(this.settings.errorClass), s.html(n)) : (i = s = e("<" + this.settings.errorElement + ">").attr("id", l + "-error").addClass(this.settings.errorClass).html(n || ""), this.settings.wrapper && (i = s.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.length ? this.labelContainer.append(i) : this.settings.errorPlacement ? this.settings.errorPlacement.call(this, i, e(t)) : i.insertAfter(t), s.is("label") ? s.attr("for", l) : 0 === s.parents("label[for='" + this.escapeCssMeta(l) + "']").length && (o = s.attr("id"), u ? u.match(new RegExp("\\b" + this.escapeCssMeta(o) + "\\b")) || (u += " " + o) : u = o, e(t).attr("aria-describedby", u), (r = this.groups[t.name]) && (a = this, e.each(a.groups, function (t, n) {
                    n === r && e("[name='" + a.escapeCssMeta(t) + "']", a.currentForm).attr("aria-describedby", s.attr("id"))
                })))), !n && this.settings.success && (s.text(""), "string" == typeof this.settings.success ? s.addClass(this.settings.success) : this.settings.success(s, t)), this.toShow = this.toShow.add(s)
            },
            errorsFor: function (t) {
                var n = this.escapeCssMeta(this.idOrName(t)),
                    i = e(t).attr("aria-describedby"),
                    r = "label[for='" + n + "'], label[for='" + n + "'] *";
                return i && (r = r + ", #" + this.escapeCssMeta(i).replace(/\s+/g, ", #")), this.errors().filter(r)
            },
            escapeCssMeta: function (e) {
                return e.replace(/([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1")
            },
            idOrName: function (e) {
                return this.groups[e.name] || (this.checkable(e) ? e.name : e.id || e.name)
            },
            validationTargetFor: function (t) {
                return this.checkable(t) && (t = this.findByName(t.name)), e(t).not(this.settings.ignore)[0]
            },
            checkable: function (e) {
                return /radio|checkbox/i.test(e.type)
            },
            findByName: function (t) {
                return e(this.currentForm).find("[name='" + this.escapeCssMeta(t) + "']")
            },
            getLength: function (t, n) {
                switch (n.nodeName.toLowerCase()) {
                    case "select":
                        return e("option:selected", n).length;
                    case "input":
                        if (this.checkable(n)) return this.findByName(n.name).filter(":checked").length
                }
                return t.length
            },
            depend: function (e, t) {
                return !this.dependTypes[typeof e] || this.dependTypes[typeof e](e, t)
            },
            dependTypes: {
                boolean: function (e) {
                    return e
                },
                string: function (t, n) {
                    return !!e(t, n.form).length
                },
                "function": function (e, t) {
                    return e(t)
                }
            },
            optional: function (t) {
                var n = this.elementValue(t);
                return !e.validator.methods.required.call(this, n, t) && "dependency-mismatch"
            },
            startRequest: function (t) {
                this.pending[t.name] || (this.pendingRequest++, e(t).addClass(this.settings.pendingClass), this.pending[t.name] = !0)
            },
            stopRequest: function (t, n) {
                this.pendingRequest--, this.pendingRequest < 0 && (this.pendingRequest = 0), delete this.pending[t.name], e(t).removeClass(this.settings.pendingClass), n && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (e(this.currentForm).submit(), this.formSubmitted = !1) : !n && 0 === this.pendingRequest && this.formSubmitted && (e(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
            },
            previousValue: function (t, n) {
                return n = "string" == typeof n && n || "remote", e.data(t, "previousValue") || e.data(t, "previousValue", {
                    old: null,
                    valid: !0,
                    message: this.defaultMessage(t, {
                        method: n
                    })
                })
            },
            destroy: function () {
                this.resetForm(), e(this.currentForm).off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur")
            }
        },
        classRuleSettings: {
            required: {
                required: !0
            },
            email: {
                email: !0
            },
            url: {
                url: !0
            },
            date: {
                date: !0
            },
            dateISO: {
                dateISO: !0
            },
            number: {
                number: !0
            },
            digits: {
                digits: !0
            },
            creditcard: {
                creditcard: !0
            }
        },
        addClassRules: function (t, n) {
            t.constructor === String ? this.classRuleSettings[t] = n : e.extend(this.classRuleSettings, t)
        },
        classRules: function (t) {
            var n = {},
                i = e(t).attr("class");
            return i && e.each(i.split(" "), function () {
                this in e.validator.classRuleSettings && e.extend(n, e.validator.classRuleSettings[this])
            }), n
        },
        normalizeAttributeRule: function (e, t, n, i) {
            /min|max|step/.test(n) && (null === t || /number|range|text/.test(t)) && (i = Number(i), isNaN(i) && (i = undefined)), i || 0 === i ? e[n] = i : t === n && "range" !== t && (e[n] = !0)
        },
        attributeRules: function (t) {
            var n, i, r = {},
                o = e(t),
                a = t.getAttribute("type");
            for (n in e.validator.methods) "required" === n ? ("" === (i = t.getAttribute(n)) && (i = !0), i = !!i) : i = o.attr(n), this.normalizeAttributeRule(r, a, n, i);
            return r.maxlength && /-1|2147483647|524288/.test(r.maxlength) && delete r.maxlength, r
        },
        dataRules: function (t) {
            var n, i, r = {},
                o = e(t),
                a = t.getAttribute("type");
            for (n in e.validator.methods) i = o.data("rule" + n.charAt(0).toUpperCase() + n.substring(1).toLowerCase()), this.normalizeAttributeRule(r, a, n, i);
            return r
        },
        staticRules: function (t) {
            var n = {},
                i = e.data(t.form, "validator");
            return i.settings.rules && (n = e.validator.normalizeRule(i.settings.rules[t.name]) || {}), n
        },
        normalizeRules: function (t, n) {
            return e.each(t, function (i, r) {
                if (!1 !== r) {
                    if (r.param || r.depends) {
                        var o = !0;
                        switch (typeof r.depends) {
                            case "string":
                                o = !!e(r.depends, n.form).length;
                                break;
                            case "function":
                                o = r.depends.call(n, n)
                        }
                        o ? t[i] = r.param === undefined || r.param : (e.data(n.form, "validator").resetElements(e(n)), delete t[i])
                    }
                } else delete t[i]
            }), e.each(t, function (i, r) {
                t[i] = e.isFunction(r) && "normalizer" !== i ? r(n) : r
            }), e.each(["minlength", "maxlength"], function () {
                t[this] && (t[this] = Number(t[this]))
            }), e.each(["rangelength", "range"], function () {
                var n;
                t[this] && (e.isArray(t[this]) ? t[this] = [Number(t[this][0]), Number(t[this][1])] : "string" == typeof t[this] && (n = t[this].replace(/[\[\]]/g, "").split(/[\s,]+/), t[this] = [Number(n[0]), Number(n[1])]))
            }), e.validator.autoCreateRanges && (null != t.min && null != t.max && (t.range = [t.min, t.max], delete t.min, delete t.max), null != t.minlength && null != t.maxlength && (t.rangelength = [t.minlength, t.maxlength], delete t.minlength, delete t.maxlength)), t
        },
        normalizeRule: function (t) {
            if ("string" == typeof t) {
                var n = {};
                e.each(t.split(/\s/), function () {
                    n[this] = !0
                }), t = n
            }
            return t
        },
        addMethod: function (t, n, i) {
            e.validator.methods[t] = n, e.validator.messages[t] = i !== undefined ? i : e.validator.messages[t], n.length < 3 && e.validator.addClassRules(t, e.validator.normalizeRule(t))
        },
        methods: {
            required: function (t, n, i) {
                if (!this.depend(i, n)) return "dependency-mismatch";
                if ("select" === n.nodeName.toLowerCase()) {
                    var r = e(n).val();
                    return r && r.length > 0
                }
                return this.checkable(n) ? this.getLength(t, n) > 0 : t.length > 0
            },
            email: function (e, t) {
                return this.optional(t) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(e)
            },
            url: function (e, t) {
                // Copyright (c) 2010-2013 Diego Perini, MIT licensed
                return this.optional(t) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(e)
            },
            date: function (e, t) {
                return this.optional(t) || !/Invalid|NaN/.test(new Date(e).toString())
            },
            dateISO: function (e, t) {
                return this.optional(t) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(e)
            },
            number: function (e, t) {
                return this.optional(t) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(e)
            },
            digits: function (e, t) {
                return this.optional(t) || /^\d+$/.test(e)
            },
            minlength: function (t, n, i) {
                var r = e.isArray(t) ? t.length : this.getLength(t, n);
                return this.optional(n) || r >= i
            },
            maxlength: function (t, n, i) {
                var r = e.isArray(t) ? t.length : this.getLength(t, n);
                return this.optional(n) || r <= i
            },
            rangelength: function (t, n, i) {
                var r = e.isArray(t) ? t.length : this.getLength(t, n);
                return this.optional(n) || r >= i[0] && r <= i[1]
            },
            min: function (e, t, n) {
                return this.optional(t) || e >= n
            },
            max: function (e, t, n) {
                return this.optional(t) || e <= n
            },
            range: function (e, t, n) {
                return this.optional(t) || e >= n[0] && e <= n[1]
            },
            step: function (t, n, i) {
                var r, o = e(n).attr("type"),
                    a = "Step attribute on input type " + o + " is not supported.",
                    s = ["text", "number", "range"],
                    l = new RegExp("\\b" + o + "\\b"),
                    u = function (e) {
                        var t = ("" + e).match(/(?:\.(\d+))?$/);
                        return t && t[1] ? t[1].length : 0
                    },
                    c = function (e) {
                        return Math.round(e * Math.pow(10, r))
                    },
                    d = !0;
                if (o && !l.test(s.join())) throw new Error(a);
                return r = u(i), (u(t) > r || c(t) % c(i) != 0) && (d = !1), this.optional(n) || d
            },
            equalTo: function (t, n, i) {
                var r = e(i);
                return this.settings.onfocusout && r.not(".validate-equalTo-blur").length && r.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
                    e(n).valid()
                }), t === r.val()
            },
            remote: function (t, n, i, r) {
                if (this.optional(n)) return "dependency-mismatch";
                r = "string" == typeof r && r || "remote";
                var o, a, s, l = this.previousValue(n, r);
                return this.settings.messages[n.name] || (this.settings.messages[n.name] = {}), l.originalMessage = l.originalMessage || this.settings.messages[n.name][r], this.settings.messages[n.name][r] = l.message, i = "string" == typeof i && {
                    url: i
                } || i, s = e.param(e.extend({
                    data: t
                }, i.data)), l.old === s ? l.valid : (l.old = s, o = this, this.startRequest(n), (a = {})[n.name] = t, e.ajax(e.extend(!0, {
                    mode: "abort",
                    port: "validate" + n.name,
                    dataType: "json",
                    data: a,
                    context: o.currentForm,
                    success: function (e) {
                        var i, a, s, u = !0 === e || "true" === e;
                        o.settings.messages[n.name][r] = l.originalMessage, u ? (s = o.formSubmitted, o.resetInternals(), o.toHide = o.errorsFor(n), o.formSubmitted = s, o.successList.push(n), o.invalid[n.name] = !1, o.showErrors()) : (i = {}, a = e || o.defaultMessage(n, {
                            method: r,
                            parameters: t
                        }), i[n.name] = l.message = a, o.invalid[n.name] = !0, o.showErrors(i)), l.valid = u, o.stopRequest(n, u)
                    }
                }, i)), "pending")
            }
        }
    });
    var t, n = {};
    return e.ajaxPrefilter ? e.ajaxPrefilter(function (e, t, i) {
        var r = e.port;
        "abort" === e.mode && (n[r] && n[r].abort(), n[r] = i)
    }) : (t = e.ajax, e.ajax = function (i) {
        var r = ("mode" in i ? i : e.ajaxSettings).mode,
            o = ("port" in i ? i : e.ajaxSettings).port;
        return "abort" === r ? (n[o] && n[o].abort(), n[o] = t.apply(this, arguments), n[o]) : t.apply(this, arguments)
    }), e
});
const spanish = () => {
        $.extend($.validator.messages, {
            required: "Este campo es obligatorio.",
            remote: "Por favor, rellena este campo.",
            email: "Por favor, escribe una direcci\xf3n de correo v\xe1lida.",
            url: "Por favor, escribe una URL v\xe1lida.",
            date: "Por favor, escribe una fecha v\xe1lida.",
            dateISO: "Por favor, escribe una fecha (ISO) v\xe1lida.",
            number: "Por favor, escribe un n\xfamero v\xe1lido.",
            digits: "Por favor, escribe s\xf3lo d\xedgitos.",
            creditcard: "Por favor, escribe un n\xfamero de tarjeta v\xe1lido.",
            equalTo: "Por favor, escribe el mismo valor de nuevo.",
            extension: "Por favor, escribe un valor con una extensi\xf3n aceptada.",
            maxlength: $.validator.format("Por favor, no escribas m\xe1s de {0} caracteres."),
            minlength: $.validator.format("Por favor, no escribas menos de {0} caracteres."),
            rangelength: $.validator.format("Por favor, escribe un valor entre {0} y {1} caracteres."),
            range: $.validator.format("Por favor, escribe un valor entre {0} y {1}."),
            max: $.validator.format("Por favor, escribe un valor menor o igual a {0}."),
            min: $.validator.format("Por favor, escribe un valor mayor o igual a {0}."),
            nifES: "Por favor, escribe un NIF v\xe1lido.",
            nieES: "Por favor, escribe un NIE v\xe1lido.",
            cifES: "Por favor, escribe un CIF v\xe1lido."
        })
    },
    setBackendLang = e => {
        let t = document.querySelector(e);
        if (t) {
            "en" != $(t).data("locale") && spanish()
        }
    },
    validator = e => {
        let t = document.querySelector(e);
        t && $(t).validate()
    };
$(document).ready(() => {
    setBackendLang("#lang"), validator("#new_contact")
}), $(document).ready(function () {
    document.querySelector("section.join-us") && (toggleVacancyType(), memberHover())
}), $(document).ready(function () {
    var e = document.querySelector(".accept-cookies"),
        t = document.querySelector(".input"),
        n = document.querySelector(".toggle-overflow"),
        i = document.querySelector(".multi-icon-wrapper");
    e && acceptCookies(), t && (focusInput(), removeInputFocus()), n && toggleOverflow(), i && serviceIcons()
}), document.addEventListener("DOMContentLoaded", function () {
    lazybg()
}), $(document).ready(function () {
    var e = document.querySelector(".menu-button-wrapper"),
        t = document.querySelector(".toggle-contact"),
        T = document.querySelector(".services-contact"),
        P = document.querySelector(".toggle-about"),
        n = document.querySelector(".top-navbar");
    e && toggleMenu(), t && toggleContact(), P && toggleAbout(), P && toggleContact(),  t && toggleServices(), n && (navbarDefaultColor(!0), scrollNavbarDefaultColor())
}), $(document).ready(function () {
    document.querySelector(".notifications-wrapper") && notificationActions()
});
var interval = null;
$(document).ready(function () {
    document.querySelector(".projects-slider") && (projectSlider(0, !0), changeProject())
});
class TextScramble {
    constructor(e, t, T, P) {
        this.phrases = t, this.el = e, this.chars = "!<>-_\\/[]{}\u2014=+*^?#________", this.update = this.update.bind(this)
    }
    setText(e) {
        const t = this.el.innerText,
            n = Math.max(t.length, e.length),
            i = new Promise(e => this.resolve = e);
        this.queue = [];
        for (let i = 0; i < n; i++) {
            const n = t[i] || "",
                r = e[i] || "",
                o = Math.floor(40 * Math.random()),
                a = o + Math.floor(40 * Math.random());
            this.queue.push({
                from: n,
                to: r,
                start: o,
                end: a
            })
        }
        return cancelAnimationFrame(this.frameRequest), this.frame = 0, this.update(), i
    }
    update() {
        let e = "",
            t = 0;
        for (let n = 0, i = this.queue.length; n < i; n++) {
            let {
                from: i,
                to: r,
                start: o,
                end: a,
                char: s
            } = this.queue[n];
            this.frame >= a ? (t++, e += r) : this.frame >= o ? ((!s || Math.random() < .28) && (s = this.randomChar(), this.queue[n].char = s), e += `<span class="dud">${s}</span>`) : e += i
        }
        this.el.innerHTML = e, t === this.queue.length ? this.resolve() : (this.frameRequest = requestAnimationFrame(this.update), this.frame++)
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)]
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const e = document.querySelector(".title-scramble"),
        t = document.querySelector(".desc-scramble");
    if (null != e) {
        const n = new TextScramble(e, $(e).data("quotes"));
        let i = 0;
        const r = () => {
            $(t).removeClass("fade-in").addClass("fade-out"), $(t).text(n.phrases[i][1]), n.setText(n.phrases[i][0]).then(() => {
                $(t).removeClass("fade-out").addClass("fade-in")
            }), setTimeout(r, 8e3), i = (i + 1) % n.phrases.length
        };
        r()
    }
}), document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#welcome") && initCanvas()
});