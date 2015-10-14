var $j = $j || jQuery;
$j("html").removeClass("no-js");
if (typeof Array.prototype.pushUnique !== "function") {
    Array.prototype.pushUnique = function(a) {
        if (this.indexOf(a) === -1) {
            this.push(a)
        }
    }
}
if (typeof String.prototype.capitalize !== "function") {
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1)
    }
}
if (typeof Object.create !== "function") {
    Object.create = function(b) {
        function a() {}
        a.prototype = b;
        return new a()
    }
}
var vz = vz || (function(a) {
    return {
        globals: {
            win: this
        },
        polyfill: {},
        featDetection: (function() {
            function b(g, f) {
                return f in document.createElement(g)
            }
            var c = null;

            function d() {
                var k = false,
                    f = document.createElement("button"),
                    g = document.createElement("form");
                g.setAttribute("id", "testForm");
                f.setAttribute("type", "submit");
                g.style.display = "none";
                f.style.display = "none";
                try {
                    f.setAttribute("form", "testForm")
                } catch (h) {
                    c = false;
                    return c
                }
                document.body.appendChild(g);
                document.body.appendChild(f);
                $j(g).on("submit", function(m) {
                    m.preventDefault();
                    k = true
                });
                f.click();
                document.body.removeChild(g);
                document.body.removeChild(f);
                c = k;
                return c
            }
            return {
                checkValidity: function() {
                    return b("form", "checkValidity")
                },
                placeholder: function() {
                    return b("input", "placeholder")
                },
                orphanedFormField: function() {
                    return (c !== null) ? c : d()
                },
                onInputEvent: function() {
                    var h = document.createElement("input"),
                        g = "oninput";
                    h.setAttribute(g, "return;");
                    var f = (g in h) && (typeof h[g] ===
                        "function");
                    return f
                }
            }
        })(),
        utils: (function() {
            return {
                instantiate: function(d, b) {
                    if (typeof d === "object") {
                        var c = Object.create(d);
                        c.init(b);
                        return c
                    }
                },
                zeroPad: function(c, b) {
                    var d = c.toString();
                    while (d.length < b) {
                        d = "0" + d
                    }
                    return d
                },
                clamp: function(c, b, d) {
                    return (d > b) ? b : (d < c) ? c : d
                },
                getMonthStr: function(d, c) {
                    var b = ["January", "February", "March",
                        "April", "May", "June", "July",
                        "August", "September",
                        "October", "November",
                        "December"
                    ];
                    var f = b[d];
                    if (c && typeof c === "number") {
                        f = f.substr(0, c)
                    }
                    return f
                },
                camelCase: function(b, c) {
                    if (c) {
                        b = b.toLowerCase()
                    }
                    return b.replace(/-(.)/g, function(f, d) {
                        return d.toUpperCase()
                    })
                },
                markRequiredFields: function(b) {
                    var c = $j(
                        "input[required]:not([type=radio])",
                        b);
                    c.each(function() {
                        $j('label[for="' + this.id +
                            '"]').addClass(
                            "redStar")
                    })
                },
                loader: {
                    defaults: {
                        useDefaultSkin: true,
                        skin: null,
                        show: true,
                        reuse: true
                    },
                    defaultSkin: "spinner",
                    element: null,
                    loader: null,
                    isBody: false,
                    init: function(c, b) {
                        this.element = c;
                        this.options = jQuery.extend({},
                            this.defaults, b);
                        this.isBody = (this.element.get(0) ===
                            window.document.body);
                        this.loader = (this.options.reuse) ?
                            this.getExisting() : this.createLoader();
                        if (this.isBody) {
                            this.loader.css("position",
                                "fixed")
                        }
                        this.element.append(this.loader);
                        if (this.options.show) {
                            this.showMe()
                        }
                    },
                    showMe: function() {
                        this.loader.css("visibility",
                            "visible")
                    },
                    hideMe: function() {
                        this.loader.css("visibility",
                            "hidden")
                    },
                    createLoader: function() {
                        var b = $j("<div/>");
                        if (this.options.useDefaultSkin) {
                            b.addClass(this.defaultSkin)
                        }
                        if (this.options.skin) {
                            b.addClass(this.options.skin)
                        }
                        if (typeof window.onbeforeunload !=
                            "undefined") {
                            window.onbeforeunload =
                                function() {
                                    var c = b.css(
                                        "background-image"
                                    );
                                    b.css(
                                        "background-image",
                                        "none");
                                    b.css(
                                        "background-image",
                                        c)
                                }
                        }
                        return b
                    },
                    getExisting: function() {
                        var b = $j("." + this.defaultSkin).eq(
                            0);
                        if (b.length > 0) {
                            return b
                        } else {
                            return this.createLoader()
                        }
                    }
                }
            }
        })(),
        ui: (function() {
            return {}
        })(),
        store: {
            sessionError: function() {
                if (window.parent.location) {
                    window.parent.location = "/b2c/index.html"
                } else {
                    window.location = "/b2c/index.html"
                }
            }
        },
        console: window.console || (window.console = {
            log: function() {}
        })
    }
})(jQuery);
var sessionError = sessionError || vz.store.sessionError;
vz.utils.merge = function(a, c) {
    var d = null;

    function b(k) {
        for (var h in k) {
            try {
                if (k[h].constructor == Object) {
                    this[h] = k[h];
                    if (h in c) {
                        this[h] = vz.utils.merge(this[h], c[h])
                    }
                } else {
                    if (k[h].constructor == Function) {
                        if ((h in c) && c[h].constructor == Function) {
                            var f = this;
                            (function(n, m) {
                                f[h] = function() {
                                    this._super = m;
                                    return n.apply(this,
                                        arguments)
                                };
                                f[h].sourceCode = n.toString()
                            })(k[h], c[h])
                        } else {
                            this[h] = k[h]
                        }
                    } else {
                        this[h] = k[h]
                    }
                }
            } catch (g) {
                this[h] = k[h]
            }
        }
    }
    b.prototype = c;
    d = new b(a);
    return d
};
vz.polyfill.placeholder = function(c) {
    if (!vz.featDetection.placeholder()) {
        var a = (typeof c !== "undefined");
        var b = (a) ? c : $j("form:has('input[placeholder]')");
        var f = "input[placeholder]";
        var d = (a) ? b.find($j(f)) : $j(f);
        d.each(function() {
            var g = $j(this),
                h = $j.trim(g.val());
            if (g.val() === "") {
                g.val(g.attr("placeholder"));
                g.addClass("grayedOut")
            }
        });
        d.on({
            focus: function(h) {
                var g = $j(this);
                if (g.val() == g.attr("placeholder") || g.val() ===
                    "") {
                    g.val("");
                    g.removeClass("grayedOut")
                }
            },
            blur: function(h) {
                var g = $j(this),
                    k = $j.trim(g.val());
                if (k === "") {
                    g.val(g.attr("placeholder"));
                    g.addClass("grayedOut")
                }
            }
        });
        b.on("submit", function(g) {
            $j(g.currentTarget).clearPlaceholders()
        })
    }
};
vz.polyfill.orphanedSubmit = function() {
    if (!vz.featDetection.orphanedFormField()) {
        $j("button[type=submit][form],input[type=submit][form]").on("click",
            function(c) {
                c.preventDefault();
                var b = $j(this),
                    a = $j("#" + b.attr("form"));
                a.submit()
            })
    }
};
vz.polyfill.validateForm = {
    defaults: {
        includeHiddenFields: true,
        errorContainer: "#setError",
        highlightInvalidFields: false,
        postNoticeAdjacent: false,
        realTimeValidation: false,
        useHTML5: false,
        emailRegExp: new RegExp(
            "^[\\u0020-\\u002D\\u002F-\\u007F]+(\\.[\\u0020-\\u002D\\u002F-\\u007F]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
        ),
        textRegExp: new RegExp("^[\\u0020-\\u007F]+$"),
        urlRegExp: new RegExp(
            "^(ht|f)tp(s?)://(([a-zA-Z0-9-._]+(.[a-zA-Z0-9-._]+)+)|localhost)(/?)([a-zA-Z0-9-.?,'/\\+&amp;%$#_]*)?([\dw./%+-=&amp;?:\\&quot;',|~;]*)$"
        ),
        phoneRegExp: new RegExp(
            "^(\\(\\d{3}\\)|\\d{3})[\\-\\s]?(\\d{3})[\\-\\s]?(\\d{4})$"
        ),
        errorClass: "markedField",
        highlightSkin: "invalid",
        defaultSelectValue: "",
        requiredMessage: function(a) {
            return a.capitalize() + " is a required field."
        },
        requiredSelectionMsg: function(a) {
            return this.requiredMessage(a) +
                " Please make a selection."
        },
        emailMessage: "Please enter a valid email address.",
        textMessage: "This field cannot contain special characters.",
        urlMessage: "Please enter a valid web address.",
        phoneMessage: "Please enter a valid phone number.",
        confirmMessage: "This verification does not match.",
        zipMessage: "Please enter a valid 5 digit Zip Code.",
        numericMessage: "Please enter a number.",
        rangeMessage: function(b, a) {
            return "Please enter a number between " + b + " and " + a
        },
        defaultMessage: "Please enter a valid",
        scrollToErrors: false,
        callback: null
    },
    invalidFields: null,
    invalid: false,
    form: null,
    formFields: null,
    scrollToElement: null,
    init: function(b, a) {
        this.options = $j.extend({}, this.defaults, a);
        var c = this.options;
        this.form = $j(b);
        this.formFields = this.form.find("*").filter(":input");
        vz.utils.markRequiredFields(this.form);
        vz.polyfill.orphanedSubmit();
        this.setupEvents()
    },
    setupEvents: function() {
        var a = this.options;
        this.form.on("submit", {
            self: this
        }, function(d) {
            var b = d.data.self,
                c = b.options;
            b.resetForm();
            b.validate();
            b.scrollErrorsIntoView();
            if (typeof c.callback === "function") {
                if (!$j.proxy(c.callback, b, d)()) {
                    b.invalid = true
                }
            }
            return !b.invalid
        });
        if (a.realTimeValidation) {
            $j(this.form).on("change", {
                self: this
            }, function(c) {
                var b = c.data.self;
                b.clearErrorMessages(c.target);
                b.validate(c.target)
            });
            $j(this.form).on("blur", ":input:not([type=radio])", {
                self: this
            }, function(c) {
                var b = c.data.self;
                b.checkRequiredFields($j(c.target))
            })
        }
        if (vz.featDetection.onInputEvent()) {
            $j(this.form).on("input", "input." + a.errorClass, {
                self: this
            }, this.resetField);
            $j(this.form).on("change", "select." + a.errorClass +
                ", fieldset." + a.errorClass + " :input", {
                    self: this
                }, this.resetField)
        } else {
            $j(this.form).on("change", ":input." + a.errorClass +
                ", fieldset." + a.errorClass + " :input", {
                    self: this
                }, this.resetField)
        }
        $j("input", this.form).on("invalid", {
            self: this
        }, function(f) {
            var d = $j(this),
                b = f.data.self,
                c = b.options;
            if (d.attr("type") != "radio") {
                b.markField(d)
            } else {
                b.markField(d, false, true)
            }
        })
    },
    scrollErrorsIntoView: function() {
        var a = this.options;
        if (a.scrollToErrors) {
            if (this.scrollToElement != null) {
                this.scrollToElement[0].scrollIntoView(true)
            }
        }
    },
    resetForm: function() {
        var c = this.options,
            b = $j("input." + c.errorClass + ", fieldset." + c.errorClass,
                this.form),
            a = null;
        this.invalid = false;
        a = (c.postNoticeAdjacent) ? this.form : $j(c.errorContainer);
        $j("p." + c.highlightSkin + ", span." + c.highlightSkin, a).remove();
        if (c.highlightInvalidFields) {
            b.removeClass(c.highlightSkin)
        }
    },
    validate: function(g) {
        var d = this.options,
            h = true,
            b = null;
        if (d.useHTML5 && vz.featDetection.checkValidity()) {
            e.target.checkValidity()
        }
        b = (g) ? $j(g) : this.formFields;
        if (!this.includeHiddenFields) {
            b = b.filter(function() {
                return $j(this).is(":not(':hidden')")
            })
        }
        this.scrollToElement = null;
        for (var c = 0, a = b.length; c < a; c++) {
            h = true;
            var f = b.eq(c);
            if (f.prop("formNoValidate")) {
                continue
            }
            if (h) {
                h = this.checkRequiredFields(f)
            }
            if (h && !d.useHTML5) {
                h = this.checkEmailFields(f)
            }
            if (h && !d.useHTML5) {
                h = this.checkTextFields(f)
            }
            if (h && !d.useHTML5) {
                h = this.checkURLFields(f)
            }
            if (h) {
                h = this.checkTelFields(f)
            }
            if (h) {
                h = this.checkConfirmFields(f)
            }
            if (h) {
                h = this.checkZipFields(f)
            }
            if (h && !d.useHTML5) {
                h = this.checkNumericFields(f)
            }
            if (h && !d.useHTML5) {
                h = this.checkPatternFields(f)
            }
            if (!h && this.scrollToElement == null) {
                this.scrollToElement = f
            }
            if (h && g) {
                f.trigger({
                    type: "validateField",
                    validator: this,
                    form: this.form,
                    field: f
                })
            }
        }
    },
    checkRequiredFields: function(h) {
        var g = this.options,
            c = h.attr("name"),
            b = "",
            d = "",
            f = "",
            k = false,
            a = false;
        b = h.data("label") || h.attr("title") || "This";
        if (h.is(
            "[required]:not([type=radio]):not([type=checkbox]):not(select)"
        ) && this.isEmpty(h)) {
            d = g.requiredMessage(b);
            k = true
        } else {
            if ((h.is("[type=radio][required]:not(:checked)") && $j(
                    "input[name=" + c + "]:checked", this.form).length ===
                0) || h.is(
                "[type=checkbox][required]:not(:checked)")) {
                d = g.requiredSelectionMsg(b);
                k = true;
                a = true
            } else {
                if (h.is("select[required]") && this.isDefaultValue(h)) {
                    d = g.requiredSelectionMsg(b);
                    k = true;
                    a = false
                }
            }
        } if (k) {
            f = (!h.data("notice")) ? d : h.data("notice");
            this.markField(h, f, a);
            return false
        }
        return true
    },
    checkEmailFields: function(c) {
        var b = this.options,
            a = this;
        if (!this.isEmpty(c) && c.is("[type=email]") && !b.emailRegExp.test(
            $j.trim(c.val()))) {
            message = (!c.data("notice")) ? b.emailMessage : c.data(
                "notice");
            a.markField(c, message);
            return false
        }
        return true
    },
    checkTextFields: function(c) {
        var b = this.options,
            a = this;
        if (!this.isEmpty(c) && c.is("[type=text]") && !b.textRegExp.test(
            $j.trim(c.val()))) {
            message = (!c.data("notice")) ? b.textMessage : c.data(
                "notice");
            a.markField(c, message);
            return false
        }
        return true
    },
    checkURLFields: function(c) {
        var b = this.options,
            a = this;
        if (!this.isEmpty(c) && c.is("[type=url]") && !b.urlRegExp.test(
            $j.trim(c.val()))) {
            message = (!c.data("notice")) ? b.urlMessage : c.data(
                "notice");
            a.markField(c, message);
            return false
        }
        return true
    },
    checkTelFields: function(c) {
        var b = this.options,
            a = this;
        if (!this.isEmpty(c) && c.is("[type=tel]") && !b.phoneRegExp.test(
            $j.trim(c.val()))) {
            message = (!c.data("notice")) ? b.phoneMessage : c.data(
                "notice");
            a.markField(c, message);
            return false
        }
        return true
    },
    checkConfirmFields: function(c) {
        var b = this.options,
            a = this;
        if (!this.isEmpty(c) && c.data("confirm") && (c.val() != $j("#" +
            c.data("confirm")).val())) {
            message = (!c.data("notice")) ? b.confirmMessage : c.data(
                "notice");
            a.markField(c, message);
            return false
        }
        return true
    },
    checkZipFields: function(c) {
        var b = this.options,
            a = this,
            d = $j.trim(c.val());
        if (!this.isEmpty(c) && c.data("zip") && !/^\d{5}$/.test(d)) {
            message = (!c.data("notice")) ? b.zipMessage : c.data(
                "notice");
            a.markField(c, message);
            return false
        }
        return true
    },
    checkNumericFields: function(c) {
        var b = this.options,
            a = this,
            d = $j.trim(c.val());
        if (!this.isEmpty(c) && (c.is("[type=number]") || c.is(
            "[type=range]"))) {
            if (/\D/.test(d)) {
                message = (!c.data("notice")) ? b.numericMessage : c.data(
                    "notice");
                a.markField(c, message);
                return false
            }
            return a.checkRange(c, d)
        }
        return true
    },
    checkPatternFields: function(f) {
        var d = this.options,
            a = this,
            c = null,
            b = null;
        if (!this.isEmpty(f) && f.is("[pattern]") && !new RegExp(f.attr(
            "pattern")).test($j.trim(f.val()))) {
            b = f.data("label") || "value";
            message = (!f.data("notice")) ? d.defaultMessage + " " + b +
                "." : f.data("notice");
            a.markField(f, message);
            return false
        }
        return true
    },
    checkRange: function(f, g) {
        var d = this.options,
            b = -Infinity,
            a = Infinity,
            c = "";
        b = f.attr("min") ? parseInt(f.attr("min"), 10) : b;
        a = f.attr("max") ? parseInt(f.attr("max"), 10) : a;
        if (g > a || g < b) {
            c = (!f.data("notice")) ? d.rangeMessage(b, a) : f.data(
                "notice");
            this.markField(f, c);
            return false
        }
        return true
    },
    markField: function(h, o, a) {
        var c = this.options,
            k = null,
            m = h.closest("fieldset"),
            g = h;
        k = h.data("label") || "value";
        o = (o) ? o : h.data("notice") ? h.data("notice") : c.defaultMessage +
            " " + k + ".";
        if ((a || h.data("useFieldset")) && m.length > 0) {
            g = m
        }
        g.addClass(c.errorClass);
        if (c.highlightInvalidFields) {
            g.addClass(c.highlightSkin)
        }
        if (c.postNoticeAdjacent) {
            var b = null,
                n = false;
            b = g.nextAll("." + c.highlightSkin);
            for (var d = 0, f = b.length; d < f; d++) {
                if (this.checkifMessageExists(b.eq(d), o)) {
                    n = true
                }
            }
            if (!n) {
                g.after(this.buildNotice(o, h))
            }
        } else {
            g = $j(c.errorContainer);
            if (!this.checkifMessageExists(g, o)) {
                g.append(this.buildNotice(o, h))
            }
        }
        this.invalid = true
    },
    checkifMessageExists: function(d, c) {
        var b = new RegExp(a(c));
        return b.test(a(d.text()));

        function a(f) {
            return f.replace(/[^\w\s]/gi, "")
        }
    },
    buildNotice: function(a, c) {
        var b = this.options;
        return $j('<p data-field="' + c.attr("name") + '" class="' + b.highlightSkin +
            '">' + a + "</p>")
    },
    buildError: function(b, d) {
        var c = this.options,
            a = $j(c.errorContainer);
        if (!new RegExp(b).test(a.html())) {
            a.append(this.buildNotice(b, d, true))
        }
    },
    isEmpty: function(a) {
        var b = $j.trim(a.val());
        if (a.data("trim") !== false) {
            a.val(b)
        }
        return (b === "" || b === a.attr("placeholder"))
    },
    isDefaultValue: function(b) {
        var a = this.options,
            c = $j.trim(b.val());
        if (b.data("trim") !== false) {
            b.val(c)
        }
        return (c === a.defaultSelectValue)
    },
    resetField: function(f) {
        var a = f.data.self,
            b = a.options,
            d = $j(this),
            c = null;
        c = (d.is('[type="radio"]') || d.is('[type="checkbox"]') || d.data(
            "useFieldset")) ? d.closest("fieldset") : d;
        c.removeClass(b.errorClass);
        if (b.highlightInvalidFields) {
            c.removeClass(b.highlightSkin)
        }
    },
    clearErrorMessages: function(c) {
        var a = this.options,
            b = $j(c);
        if (a.postNoticeAdjacent) {
            $j("[data-field=" + b.attr("name") + "]", this.form).remove()
        } else {
            $j("[data-field=" + b.attr("name") + "]", a.errorContainer)
                .remove()
        }
    }
};
var isIE = false;
var isIE6 = false;
var isIE7 = false;
var isIE8 = false;
var ieVersion = 0;
var isFF = false;
var FFVersion = 0;
if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
    isIE = true;
    ieVersion = new Number(RegExp.$1);
    if (ieVersion >= 8 && ieVersion < 9) {
        isIE8 = true
    } else {
        if (ieVersion >= 7 && ieVersion < 8) {
            isIE7 = true
        } else {
            if (ieVersion >= 6 && ieVersion < 7) {
                isIE6 = true
            }
        }
    }
}
if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
    isFF = true;
    FFVersion = new Number(RegExp.$1)
}

function addLoadEvent(a) {
    var b = window.onload;
    if (typeof window.onload != "function") {
        window.onload = a
    } else {
        window.onload = function() {
            b();
            a()
        }
    }
}

function getElementsByClass(h, f, a) {
    var d = new Array();
    if (f == null) {
        f = document
    }
    if (a == null) {
        a = "*"
    }
    var c = f.getElementsByTagName(a);
    var b = c.length;
    var g = new RegExp("(^|\\s)" + h + "(\\s|$)");
    for (i = 0, j = 0; i < b; i++) {
        if (g.test(c[i].className)) {
            d[j] = c[i];
            j++
        }
    }
    return d
}

function expand(d, c) {
    var b = document.getElementById(c);
    var a = document.getElementById(d);
    if (b !== null) {
        b.style.display = "block"
    }
    if (a !== null) {
        a.style.display = "none"
    }
}

function collapse(d, c) {
    var b = document.getElementById(c);
    var a = document.getElementById(d);
    if (b !== null) {
        b.style.display = "none"
    }
    if (a !== null) {
        a.style.display = "block"
    }
}

function parseURL() {
    url = location.href;
    url = url.substr(url.indexOf("?") + 1);
    params = url.split("&");
    obj = [];
    for (i in params) {
        if (typeof(params[i]) == "string") {
            param = params[i].split("=");
            obj[param[0]] = param[1]
        }
    }
    return obj
}
var browserHasFlash = true;

function checkForFlash() {
    var a = swfobject.getFlashPlayerVersion();
    if (!(a.major + a.minor + a.release)) {
        browserHasFlash = false
    }
}

function centerOnPage(c) {
    var b = (window.getSize().y - $(c).getSize().y) / 2;
    var a = (window.getSize().x - $(c).getSize().x) / 2;
    b = b < 10 ? 10 : b;
    a = a < 10 ? 10 : a;
    $(c).setStyles({
        left: a,
        top: b
    })
}
var setFocus = {
    self: function(a) {
        try {
            $(a).focus()
        } catch (b) {
            $$(a)[0].focus()
        }
    },
    parent: function(a, c) {
        if (c) {
            try {
                $(a).getParents(c)[0].focus()
            } catch (b) {
                $$(a)[0].getParents(c)[0].focus()
            }
        } else {
            try {
                $(a).getParent().focus()
            } catch (b) {
                $$(a)[0].getParent().focus()
            }
        }
    }
};
vz.utils.console = {
    counter: 0,
    killswitch: 50,
    isError: false,
    tab: "",
    isProd: function() {
        return window.location.host.test("verizonwireless.com")
    },
    log: function(f, d, c) {
        if (!this.isProd() && isFF) {
            this.counter = 0;
            if (c) {
                try {
                    console.clear()
                } catch (b) {}
            }
            switch (d) {
                case undefined:
                    d = f;
                    f = "Log";
                    break;
                default:
            }
            var a = this.check(f, d);
            if (!a) {
                this.error("killswitch", "engaged")
            }
            return a
        } else {
            return false
        }
    },
    error: function(c, b, a) {
        this.isError = true;
        this.log(c, b, a);
        this.isError = false
    },
    check: function(a, b) {
        if (this.counter >= this.killswitch) {
            return false
        }
        try {
            switch (true) {
                case (b instanceof Array):
                    this.output(a, b);
                    this.tabber(true);
                    this.aLoop(a, b);
                    this.tabber(false);
                    break;
                case (b instanceof String):
                case (b instanceof Date):
                case (b instanceof Number):
                case (b instanceof Boolean):
                case (b instanceof Function):
                    this.output(a, b);
                    break;
                case (b instanceof Object):
                    this.output(a, b);
                    this.tabber(true);
                    this.oLoop(a, b);
                    this.tabber(false);
                    break;
                default:
                    this.output(a, b)
            }
            return (!(this.counter >= this.killswitch))
        } catch (c) {
            return false
        }
    },
    aLoop: function(c, b) {
        this.counter++;
        this.output("[Array]", String(c));
        this.output("Length of [" + String(c) + "]", Number(b.length));
        var a = this;
        (function(f) {
            for (len = b.length; f < len; f++) {
                var d = a.check(f, b[f]);
                if (!d) {
                    break
                }
            }
        })(0)
    },
    oLoop: function(c, b) {
        this.counter++;
        for (i in b) {
            if (b.hasOwnProperty(i)) {
                var a = this.check(i, b[i]);
                if (!a) {
                    break
                }
            }
        }
    },
    tabber: function(a) {
        if (this.counter < 1) {
            return
        }
        if (a) {
            this.tab += "   "
        } else {
            if (this.tab.length && this.tab.length >= 3) {
                this.tab = this.tab.substring(0, this.tab.length - 3)
            } else {
                this.tab = ""
            }
        }
    },
    output: function(b, a) {
        a = (typeof a == null || typeof a == "undefined") ? null : a;
        a = (typeof a == "string") ? a.clean() : a;
        if (this.isError) {
            console.log(this.tab + "%c" + b + ": " + a, "color:red;")
        } else {
            console.log(this.tab + b + ": " + a)
        }
    }
};
var flagShip = {
    flag: "flagged",
    eventType: "click",
    removeEvent: null,
    container: ".flagShip",
    parent: null,
    selector: [$$(".flagPole")],
    init: function(b, a, c) {
        if (b) {
            this.flag = b
        }
        if (a) {
            this.eventType = a
        }
        if (c) {
            this.removeEvent = c
        }
        if (this.selector.length > 0) {
            document.body.addEvent(flagShip.eventType +
                ":relay('.flagPole')", function(d) {
                    flagShip.parent = this.getParent(flagShip.container);
                    if (flagShip.parent) {
                        if (!flagShip.removeEvent) {
                            flagShip.parent.getSiblings(flagShip.container)
                                .removeClass(flagShip.flag);
                            flagShip.parent.addClass(flagShip.flag)
                        } else {
                            if (flagShip.removeEvent == flagShip.eventType) {
                                if (flagShip.parent.hasClass(
                                    flagShip.flag)) {
                                    flagShip.parent.removeClass(
                                        flagShip.flag)
                                } else {
                                    flagShip.parent.addClass(
                                        flagShip.flag)
                                }
                            } else {
                                flagShip.parent.addClass(flagShip.flag)
                            }
                        }
                    }
                });
            if (flagShip.removeEvent && (flagShip.removeEvent !=
                flagShip.eventType)) {
                document.body.addEvent(flagShip.removeEvent +
                    ":relay('.flagPole')", function(d) {
                        flagShip.parent = this.getParent(flagShip.container);
                        if (flagShip.parent && flagShip.parent.hasClass(
                            flagShip.flag)) {
                            flagShip.parent.removeClass(flagShip.flag)
                        }
                    })
            }
        }
    }
};

function defined(x) {
    if (eval("typeof(" + x + ")") == "undefined") {
        return null
    } else {
        return eval(x)
    }
}
vz.utils.observer = {
    subscribers: {},
    key: -1,
    init: function() {},
    subscribe: function(a, c, d) {
        if (typeof a !== "string") {
            throw "observer.subscribe failed. the eventName must be a string (param 1)"
        }
        if (!d && typeof c === "function") {
            d = c;
            c = null
        }
        if ((!c && !d) || (typeof d !== "function")) {
            throw "observer.subscribe failed. a callback function is required"
        }
        var b = (++this.key).toString();
        if (!this.subscribers.hasOwnProperty(a)) {
            this.subscribers[a] = []
        }
        this.subscribers[a].push({
            key: b,
            callback: d,
            scope: c
        });
        return b
    },
    unsubscribe: function(b, d) {
        if (!b || !this.subscribers.hasOwnProperty(b)) {
            return false
        } else {
            var c = 0,
                a = 0,
                f = this.subscribers[b];
            if (!d) {
                delete this.subscribers[b];
                return true
            } else {
                if (!f.hasOwnProperty(d)) {
                    return false
                } else {
                    for (a = f.length; c < a; c++) {
                        if (f[c].key === d) {
                            this.subscribers[c].splice(c, 1);
                            break
                        }
                    }
                    return true
                }
            }
        }
    },
    publish: function(a, b) {
        if (this.subscribers.hasOwnProperty(a)) {
            var c = this.subscribers[a];
            for (i in c) {
                if (c.hasOwnProperty(i)) {
                    if (!c[i].scope) {
                        c[i].callback(b)
                    } else {
                        c[i].callback.call(c[i].scope, b)
                    }
                }
            }
        }
    }
};
vz.utils.storeHours = {
    defaults: {
        index: 0,
        skin: "storeHours",
        daySkin: "calendar",
        trimDays: false,
        closedHTML: '<span class="closed">closed</span>',
        combineDays: true,
        dayDelimiter: "-",
        timeDelimiter: "-",
        timeDayDelimiter: ":",
        timeOptions: {}
    },
    element: null,
    days: null,
    container: null,
    lineItems: [],
    today: null,
    storedDay: null,
    counter: 0,
    time: null,
    milTime: null,
    init: function(f, b) {
        this.options = $j.extend({}, this.defaults, b);
        var d = this.options,
            a = 0,
            c = 0;
        if (f.hasOwnProperty("normal")) {
            this.days = f.normal.storeHours
        }
        this.setup();
        this.checkSundayLocation();
        this.buildHours();
        this.container.html("<li>" + this.lineItems.join("</li><li>") +
            "</li>")
    },
    setup: function() {
        var a = this.options;
        this.lineItems = [];
        this.container = $j("#storeHours" + a.index);
        this.container.addClass(a.skin);
        this.time = vz.utils.instantiate(vz.utils.time, a.timeOptions);
        this.milTime = vz.utils.instantiate(vz.utils.time, $j.extend({
            militartyTime: true,
            noTags: true
        }, a.timeOptions))
    },
    checkSundayLocation: function() {
        if (this.days[0].day == "sunday") {
            this.days.push(this.days.shift())
        }
    },
    buildHours: function() {
        var d = this.options;
        var c = 0,
            a = 0,
            g = this.days,
            f = null,
            b = "";
        for (a = g.length; c < a; c++) {
            this.today = g[c];
            if (d.combineDays) {
                if (this.compareDays()) {
                    this.reformatDay();
                    continue
                }
            }
            b = this.generateMicroData();
            this.lineItems.push(b)
        }
    },
    compareDays: function() {
        var a = this.options;
        if (!this.storedDay || this.today.specialHour || this.storedDay
            .specialHour) {
            this.storedDay = this.today;
            return false
        } else {
            if (this.today.open.hour === this.storedDay.open.hour &&
                this.today.open.min === this.storedDay.open.min && this
                .today.close.hour === this.storedDay.close.hour && this
                .today.close.min === this.storedDay.close.min) {
                return true
            } else {
                this.storedDay = this.today;
                return false
            }
        }
    },
    reformatDay: function() {
        var f = this.options,
            c = null;
        if (this.lineItems.length > 0) {
            c = this.lineItems[this.lineItems.length - 1];
            var d = new RegExp(this.storedDay.day.substring(0, 3) +
                "\\s*-*\\s*\\w*:", "gi");
            var b = new RegExp(this.storedDay.day.substring(0, 2) +
                "(\\s,\\w\\w)*\\s", "gi");
            var a = b.exec(c);
            if (c && c.length > 0) {
                c = c.replace(d, this.storedDay.day.substring(0, 3) +
                    " " + f.dayDelimiter + " " + this.today.day.substring(
                        0, 3) + f.timeDayDelimiter);
                if (a) {
                    c = c.replace(a[0], a[0] + "," + this.today.day.substring(
                        0, 2) + " ")
                }
                this.lineItems.pop();
                this.lineItems.push(c)
            }
        }
    },
    generateMicroData: function() {
        var a = this.options;
        if (!this.today.available) {
            return '<time datetime="closed" itemprop="openingHours">' +
                this.highlight() + "</time>"
        }
        return '<time datetime="' + this.today.day.substring(0, 2) +
            " " + this.milTime.formatTime(this.today.open.hour, this.today
                .open.min) + "-" + this.milTime.formatTime(this.today.close
                .hour, this.today.close.min) +
            '" itemprop="openingHours">' + this.highlight() + "</time>"
    },
    highlight: function() {
        var b = this.options,
            a = "";
        if (this.today.specialHour) {
            return '<p class="redText">' + this.getDayAndTime() +
                "</p>"
        } else {
            return this.getDayAndTime()
        }
    },
    getDayAndTime: function() {
        var b = this.options,
            a = "";
        a += this.formatDay();
        if (!this.today.available) {
            a += b.closedHTML
        } else {
            a += this.time.formatTime(this.today.open.hour, this.today.open
                .min);
            a += " " + b.timeDelimiter + " ";
            a += this.time.formatTime(this.today.close.hour, this.today
                .close.min)
        }
        return a
    },
    formatDay: function() {
        var b = this.options,
            a = "";
        a = (b.trimDays) ? this.today.day.substring(0, 3) : this.today.day;
        return '<span class="' + b.daySkin + '">' + a + b.timeDayDelimiter +
            "</span>"
    }
};
vz.utils.time = {
    defaults: {
        militaryTime: false,
        timeSkin: "digital",
        padHours: false,
        amHTML: '<span class="meridiem">am</span>',
        pmHTML: '<span class="meridiem">pm</span>',
        noTags: false
    },
    init: function(a) {
        this.options = $j.extend({}, this.defaults, a)
    },
    formatTime: function(b, d, c) {
        var f = this.options,
            g = "",
            a = "";
        b = (typeof b === "number") ? b : parseInt(b, 10);
        a = (!f.militaryTime && (b > 12)) ? (b - 12) : (b == 0) ? 24 :
            b;
        a = (f.padHours) ? vz.utils.zeroPad(a, 2) : a;
        d = vz.utils.zeroPad(d, 2);
        g = a + ":" + d;
        if (c) {
            g += ":" + vz.utils.zeroPad(c, 2)
        }
        if (f.noTags) {
            return g
        }
        return '<span class="' + f.timeSkin + '">' + g + " " + this.addMeridiem(
            b) + "</span>"
    },
    addMeridiem: function(a) {
        var b = this.options;
        if (a < 12) {
            return b.amHTML
        } else {
            return b.pmHTML
        }
    }
};
vz.utils.specialAnchors = function() {
    $j(document).on("click", "a[rel=popup]", function(b) {
        var a = $j(this).attr("href");
        if (a.length > 0) {
            window.open(a)
        }
        return false
    });
    $j(document).on("click", "a[rel=parent]", function(b) {
        var a = $j(this).attr("href");
        if (a.length > 0) {
            window.open(a, "_parent")
        }
        return false
    })
};
vz.utils.cookies = {
    get: function(a) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(a + "=");
            if (c_start != -1) {
                c_start = c_start + a.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length
                }
                return unescape(document.cookie.substring(c_start,
                    c_end))
            }
        }
        return ""
    },
    set: function(a, b, d) {
        var c = new Date();
        c.setDate(c.getDate() + d);
        document.cookie = a + "=" + b + ((d == null) ? "" : ";expires=" +
            c.toGMTString()) + ";path=/;"
    },
    getParam: function(b, d) {
        var a = new Array();
        a = b.split("&");
        for (t = 0; t < a.length; t++) {
            var c = new Array();
            c = a[t].split("=");
            if (c[0] == d) {
                return c[1]
            }
        }
    }
};

function png_init() {
    var g = navigator.appVersion.split("MSIE");
    var h = parseFloat(g[1]);
    if ((h >= 5.5) && (h < 7) && (document.body.filters)) {
        for (var c = 0; c < document.images.length; c++) {
            var d = document.images[c];
            var m = d.src.toUpperCase();
            if (!(/\bpng\b/.test(d.className)) && !(/\bpngOmit\b/.test(d.className)) &&
                (m.substring(m.length - 3, m.length) == "PNG")) {
                var f = (d.id) ? "id='" + d.id + "' " : "";
                var n = (d.className) ? "class='" + d.className + "' " : "";
                var b = (d.title) ? "title='" + d.title + "' " : "title='" +
                    d.alt + "' ";
                var k = "display:inline-block" + d.style.cssText;
                if (d.align == "left") {
                    k = "float:left;" + k
                }
                if (d.align == "right") {
                    k = "float:right;" + k
                }
                if (d.parentElement.href) {
                    k = "cursor:hand;" + k
                }
                var a = "<span " + f + n + b;
                a += ' style="width:' + $(d).getSize().x + "px; height:" +
                    $(d).getSize().y + "px;" + k + ";";
                a +=
                    "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader";
                a += "(src='" + d.src +
                    "', sizingMethod='scale');\"></span>";
                d.outerHTML = a;
                c = c - 1
            }
        }
    }
}
var tooltips_Init = function() {
    png_init()
};

function popUp(f, d, a, c) {
    var b = "";
    if (d == "flashPopup") {
        b = "resizable,height=" + a + ",width=" + c
    }
    if (d == "popup") {
        b = "scrollbars,resizable,height=" + a + ",width=" + c
    }
    if (d == "fullScreen") {
        b =
            "scrollbars,location,directories,status,menubar,toolbar,resizable"
    }
    window.open(f, "newWin", b)
}

function setButtons() {
    return false
}
var buttonListFirstList = true;
var buttonListNum = 1;
var buttonListUl;
var buttonListLi;
var buttonListCookie;
var buttonListId;

function scrollButtons() {
    if (buttonListFirstList) {
        $("view_more").getFirst().className = "arrow_left";
        if (buttonListUl.getSize().y > 32) {
            buttonListLi[buttonListNum].setStyle("display", "none");
            buttonListNum++;
            setTimeout("scrollButtons()", 100)
        } else {
            buttonListNum--;
            buttonListFirstList = false;
            buttonListCookie = Cookie.write(buttonListId, 0)
        }
    } else {
        $("view_more").getFirst().className = "arrow_right";
        if (buttonListLi[buttonListNum].getStyle("display") == "none") {
            buttonListLi[buttonListNum].setStyle("display", "block");
            buttonListNum--;
            setTimeout("scrollButtons()", 100)
        } else {
            buttonListFirstList = true;
            buttonListCookie = Cookie.write(buttonListId, 1);
            buttonListNum++
        }
    }
}

function scrollButtonsInit() {
    buttonListUl = $("button_list");
    buttonListLi = $("button_list").getChildren("li");
    buttonListId = $("button_list").getParent().id;
    $("view_more").getFirst().className = "arrow_right";
    $("view_more").addEvent("click", scrollButtons);
    buttonListCookie = Cookie.read(buttonListId);
    if (buttonListCookie == 0) {
        buttonListFirstList = true;
        scrollButtons()
    } else {
        for (i = 0; i < buttonListLi.length; i++) {
            if (i == 0) {
                baseline = buttonListLi[i].getPosition().y
            }
            if (buttonListLi[i].getPosition().y > baseline && buttonListLi[
                i].getFirst().className == "active") {
                scrollButtons();
                break
            }
        }
    }
}
var dropShade = {
    init: function() {
        $(document.body).getElements("a.launchDropShade").addEvent(
            "click", function() {
                dropShade.drop(this)
            })
    },
    drop: function(b) {
        var c = 10;
        var d = $("dropShadeDiv");
        if (!d) {
            d = document.createElement("div");
            d.setAttribute("id", "dropShadeDiv");
            d.innerHTML =
                '<div id="expando"><div id="top-left"></div><div id="top-right"></div><div id="dropShadeContent"></div></div><div class="relative"><div id="bot-left"></div><div id="bot-right"></div></div>';
            document.body.appendChild(d);
            var a = $("dropShade").innerHTML;
            $("dropShadeContent").innerHTML = a;
            $("dropShade").innerHTML = "";
            d.style.width = $("dropShade").getStyle("width");
            $("dropShadeContent").style.width = $("dropShade").getStyle(
                "width").toInt() - 29 + "px"
        }
        if (b) {
            d.style.top = b.getPosition().y + "px";
            d.style.left = b.getPosition().x + "px";
            d.style.display = "block";
            $("expando").style.height = 0
        }
        if ($("expando").getSize().y < $("dropShadeContent").getSize().y -
            c) {
            $("expando").style.height = $("expando").getSize().y + c +
                "px";
            $("top-right").style.height = $("expando").getSize().y + 2 +
                "px";
            if ($(d).getCoordinates().bottom > (window.getScroll().y +
                window.getSize().y)) {
                $(d).style.top = $(d).getPosition().y - c + "px"
            }
            setTimeout("dropShade.drop()", 1)
        } else {
            $("expando").style.height = $("dropShadeContent").getSize()
                .y + "px";
            $("top-right").style.height = $("expando").getSize().y + 2 +
                "px"
        }
    },
    reset: function() {
        $("dropShadeDiv").style.display = "none"
    }
};
var frameSize = null;
var overlay = {
    loadingURL: "/loading.html",
    tries: 0,
    cover: null,
    color: "#000",
    coverOpacity: 0.75,
    noCoverOpacity: 0.25,
    opacity: 0,
    zIndex: 10000,
    windowW: 0,
    windowH: 0,
    marginY: 100,
    initialFrameSize: {
        x: 220,
        y: 53
    },
    currentFrameSize: {
        x: 0,
        y: 0
    },
    finalFrameSize: {
        x: 0,
        y: 0
    },
    maxFrameSize: {
        x: 1100,
        y: 800
    },
    minFrameSize: {
        x: 500,
        y: 200
    },
    containerSize: {
        x: 0,
        y: 0
    },
    bodySize: {
        x: 0,
        y: 0
    },
    containerBodyDif: 0,
    inFrame: true,
    frameSizePassed: false,
    href: "",
    winResizing: false,
    polling: null,
    failsafe: null,
    failsafeTimeout: 5000,
    persistedEvent: null,
    coverBackground: true,
    init: function() {
        this.cover = $j("<div />").css({
            position: "absolute",
            top: 0,
            left: 0,
            "background-color": this.color,
            opacity: this.coverOpacity,
            filter: "alpha(opacity=" + (this.coverOpacity * 100) +
                ")",
            "z-index": this.zIndex,
            display: "none",
            width: "100%",
            height: "100%",
            overflow: "hidden"
        });
        $j(document.body).append(this.cover);
        this.frame = $j("<iframe />").attr({
            id: "overlayFrame",
            frameborder: 0,
            scrolling: "no",
            allowTransparency: true,
            src: this.loadingURL
        }).css({
            "z-index": this.zIndex + 1,
            width: this.initialFrameSize.x + "px",
            height: this.initialFrameSize.y + "px"
        }).load(function() {
            this.contentWindow.document.body.style.background =
                "none"
        });
        $j(document.body).on({
            click: function(a) {
                if (a.which !== 3) {
                    overlay.launch($j(this).attr("href"))
                }
                return false
            },
            keypress: function(a) {
                if (a.which === 32) {
                    location.href = overlay.processHREF($j(
                        this).attr("href"))
                }
            }
        }, "a.launchOverlay");
        $j(document.body).on({
            click: function(a) {
                if (a.which !== 3) {
                    overlay.launch($j(this).attr("href"),
                        "noCover")
                }
                return false
            },
            keypress: function(a) {
                if (a.which === 32) {
                    location.href = overlay.processHREF($j(
                        this).attr("href"))
                }
            }
        }, "a.launchOverlayNoCover")
    },
    processHREF: function(a) {
        return a
    },
    launch: function(a, c) {
        this.coverBackground = (c) ? false : true;
        $j(document.body).append(this.frame);
        this.href = this.processHREF(a);
        var b = $j(window);
        this.windowW = b.outerWidth();
        this.windowH = b.outerHeight();
        this.cover.css({
            height: $j(document.body).outerHeight(),
            display: "block"
        });
        if (this.coverBackground) {
            this.cover.css({
                opacity: this.coverOpacity,
                filter: "alpha(opacity=" + (this.coverOpacity *
                    100) + ")"
            })
        } else {
            this.cover.css({
                opacity: this.noCoverOpacity,
                filter: "alpha(opacity=" + (this.noCoverOpacity *
                    100) + ")"
            })
        }
        this.frame.attr("src", this.href);
        if ($j(this.frame).css("position") == "absolute") {
            $j(window).scrollTop(0)
        }
        this.frame.css({
            width: this.initialFrameSize.x,
            height: this.initialFrameSize.y,
            left: (this.windowW - this.initialFrameSize.x) / 2,
            top: this.marginY,
            display: "block"
        });
        this.frameSizePassed = false;
        this.failsafe = setTimeout("overlay.failed()", overlay.failsafeTimeout);
        this.currentFrameSize.x = this.initialFrameSize.x;
        this.currentFrameSize.y = this.initialFrameSize.y
    },
    failed: function() {
        try {
            if (this.frame[0].contentWindow.document.getElementById(
                "globalNavId")) {
                location.reload()
            } else {
                if (!overlay.frameSizePassed) {
                    overlay.failsafe = setTimeout("overlay.failed()",
                        overlay.failsafeTimeout)
                }
            }
        } catch (a) {
            location.reload()
        }
    },
    close: function() {
        if (location.href == parent.location.href) {
            window.close()
        } else {
            parent.overlay.closeIt()
        }
    },
    closeIt: function() {
        this.frame.css({
            width: this.initialFrameSize.x,
            height: this.initialFrameSize.y,
            display: "none"
        });
        this.frame.attr("src", "");
        this.cover.hide();
        this.opacity = 0;
        this.frameSize = {
            x: 0,
            y: 0
        };
        clearInterval(this.polling);
        this.polling = null
    },
    showIt: function(a) {
        var c = ($j(window).outerWidth() - this.finalFrameSize.x) / 2;
        a.style.overflowY = (this.finalFrameSize.y - this.containerBodyDif <
            this.bodySize.y) ? "scroll" : "auto";
        this.frame.animate({
            width: this.finalFrameSize.x,
            height: this.finalFrameSize.y,
            left: c
        }, b);

        function b() {
            this.polling = setInterval(function() {
                overlay.poller()
            }, 400)
        }
    },
    sizeIt: function() {
        clearInterval(this.polling);
        this.polling = null;
        this.finalFrameSize.x = vz.utils.clamp(this.minFrameSize.x,
            this.maxFrameSize.x, this.containerSize.x);
        this.finalFrameSize.y = vz.utils.clamp(this.minFrameSize.y,
            this.maxFrameSize.y, this.containerSize.y);
        var c = $j(window).outerHeight();
        var a = this.marginY;
        if (c < this.containerSize.y + a * 2) {
            a /= 2;
            if (this.finalFrameSize.y > c - a * 2) {
                this.finalFrameSize.y = c - a * 2
            }
        }
        this.frame.css("top", a + "px");
        var b = this.finalFrameSize.y - this.containerBodyDif - 10;
        frameSize = this.frame[0].contentWindow.document.getElementById(
            "overlayBody");
        frameSize.style.height = (b < this.bodySize.y) ? b + "px" :
            this.bodySize.y + "px";
        this.showIt(frameSize)
    },
    passFrameSize: function() {
        var c = $j("#overlayContainer");
        var b = $j("#overlayBody");
        var a = {
            x: b.outerWidth(),
            y: b.outerHeight()
        };
        if (parent.frames.length) {
            clearTimeout(parent.overlay.failsafe);
            parent.overlay.failsafe = null;
            parent.overlay.frameSizePassed = true;
            parent.overlay.href = location.href;
            overlay.inFrame = true;
            parent.overlay.containerSize.x = a.x;
            parent.overlay.containerSize.y = c.outerHeight();
            parent.overlay.bodySize = a;
            parent.overlay.containerBodyDif = parent.overlay.containerSize
                .y - parent.overlay.bodySize.y;
            parent.overlay.sizeIt()
        } else {
            overlay.inFrame = false;
            $j("a").first().hide();
            c.css("width", a.x + "px")
        }
    },
    poller: function() {
        var a = {
            x: $j(window).outerWidth(),
            y: $j(window).outerHeight()
        };
        if (this.windowW + this.windowH != a.x + a.y) {
            this.winResizing = true;
            this.windowH = a.y;
            this.windowW = a.x
        } else {
            if (this.winResizing == true) {
                this.winResizing = false;
                this.sizeIt()
            }
        }
    },
    persistEvent: function(a) {
        a = a || window.event;
        this.persistedEvent = (new Event(a));
        this.persistedEvent.stopPropagation();
        this.persistedEvent.preventDefault()
    },
    specialLaunchGrid: function(f, g, b, c) {
        var c = c || null;
        var d;
        if (overlay.persistedEvent) {
            d = overlay.persistedEvent
        } else {
            d = f || window.event;
            d = new Event(d)
        }
        var g = $j(g);
        b = b || g.attr("href") || this.parseClass(g.attr("class"));
        this.persistedEvent = false;
        var a = c === null ? b : c;
        this.launch(a);
        return false
    },
    specialLaunch: function(f, g, b, c) {
        var c = c || null;
        var d;
        if (overlay.persistedEvent) {
            d = overlay.persistedEvent
        } else {
            d = f || window.event
        }
        var g = $j(g);
        b = b || g.attr("href") || this.parseClass(g.attr("class"));
        this.persistedEvent = false;
        if (!f || (d.which === 1 || d.which === 2)) {
            f = window.event;
            var a = c === null ? b : c;
            this.launch(a);
            return false
        } else {
            if (!f || (d.which === 3)) {
                window.location = b;
                return true
            }
        }
    }
};
var viewBy = {
    view: null,
    init: function() {
        $$("#viewBy a").addEvents({
            mouseover: function(a) {
                $("changeView").innerHTML = this.getProperty(
                    "rel")
            },
            mouseout: function(a) {
                $("changeView").innerHTML = "View By"
            },
            click: function(a) {
                if (!this.hasClass("Selected")) {
                    this.getSiblings().removeClass(
                        "Selected");
                    this.addClass("Selected");
                    this.view = this.getProperty("rel").toLowerCase();
                    changeView(this.getProperty("rel").toLowerCase())
                }
            },
            focus: function(a) {
                $("changeView").innerHTML = this.getProperty(
                    "rel")
            },
            blur: function(a) {
                $("changeView").innerHTML = "View By"
            }
        });
        if (this.view) {
            $$("#viewBy a." + this.view).fireEvent("click")
        }
    },
    highlight: function(a) {
        a = a.toLowerCase();
        $$("#viewBy a").removeClass("Selected");
        $("viewBy").getElement("." + a).addClass("Selected")
    }
};
var filterMenu = {
    counter: 0,
    to: null,
    ms: 50,
    menus: "",
    dropDowns: "",
    actDiv: "",
    menuLists: "",
    activeHead: null,
    subhead: null,
    moreOnly: true,
    originalLetterSpacing: 0,
    letterSpacingExceptions: [
        ["mobile broadband capable"],
        [-0.2]
    ],
    menuContainers: [],
    facetMenu: "",
    columnWidth: 179,
    MAX_ITEMS_PER_ACTIVE_COLUMN: 10,
    MAX_ITEMS_PER_INACTIVE_COLUMN: 7,
    ACTIVE_COLUMN_CLASS: "filterMenuActiveColumn",
    INACTIVE_COLUMN_CLASS: "filterMenuInactiveColumn",
    PRIMARY_COMPARE_BUTTON: "primaryCompare",
    LIST_ITEM: "a",
    LIST_MORE_ITEM: "a.more",
    MORE_CLASS: "more",
    MORE_BUTTON_CLASS: "moreButton",
    ParentInfo: function(b, a) {
        this.parentContainer = b;
        this.defaultZIndex = a
    },
    showAll: function() {
        submitDWRClearAll(true)
    },
    clearAll: function() {
        submitDWRClearAll(false)
    },
    clear: function(b) {
        var a = b.getParent(".filterMenuList");
        a.getElements(".filterMenuList a").removeClass("checkMark").addClass(
            "checkBox");
        try {
            a.getElement(".joe").innerHTML = "All";
            a.getElement(".joe").getNext("a").setStyle("display",
                "none")
        } catch (c) {}
    },
    show: function(a, c) {
        var d = a.parentInfo.parentContainer;
        if (!c) {
            for (var b = 0; b < filterMenu.menuContainers.length; b++) {
                filterMenu.menuContainers[b].parentContainer.setStyle(
                    "z-index", filterMenu.menuContainers[b].defaultZIndex
                )
            }
            d.setStyle("z-index", "200");
            a.setStyle("display", "block")
        } else {
            d.setStyle("z-index", a.parentInfo.defaultZIndex);
            a.setStyle("display", "none")
        }
    },
    adjustFocus: function(a) {
        var b = $(a);
        b.getParent(".dropDown").setStyle("display", "block");
        b.focus()
    },
    updateFullMenu: function(a) {
        filterMenu.resetMenu(a.disArray);
        filterMenu.updateMenuHeader(a.filtersArray);
        filterMenu.updateContractCompare(a.results, a.hideContract, a.hideCompare);
        filterMenu.updateRows(a.itemArray, a.divName, a.content)
    },
    resetMenu: function(a) {
        $$(filterMenu.facetMenu + " .filterMenu").each(function(b) {
            b.getElements(".filterMenuList a").removeClass(
                "disabled")
        });
        for (j = 0; j < a.length; j++) {
            $(a[j]).addClass("disabled")
        }
    },
    updateMenuHeader: function(a) {
        for (l = 0; l < a.length; l++) {
            var b = $(a[l].name + "menu");
            if ($chk(b)) {
                filterMenu.activeHead = b.getElement(".filterMenuHead");
                filterMenu.subhead = (a[l].subhead.length > 0) ? a[l].subhead :
                    "All";
                filterMenu.subhead = filterMenu.subhead.trim().truncate(
                    21, "...");
                filterMenu.activeHead.getLast("span").set("text",
                    filterMenu.subhead);
                if (a[l].disabled) {
                    filterMenu.activeHead.addClass("filterDisabled")
                }
            }
        }
    },
    updateContractCompare: function(b, c, a) {
        $$(filterMenu.facetMenu + " .filterResults").each(function(g) {
            var h = g.get("text").substring(g.get("text").indexOf(
                " "));
            g.set("text", b + " " + h)
        });
        var d = $("CONTRACTmenu");
        if (c) {
            d.setStyle("display", "none");
            d.getPrevious(".filterMenuSide").getChildren("span").setStyle(
                "display", "inline")
        } else {
            d.setStyle("display", "block");
            d.getPrevious(".filterMenuSide").getChildren("span").setStyle(
                "display", "none")
        }
        var f = a ? "none" : "block";
        $("primaryCompare").setStyle("display", f);
        $("secondaryCompare").setStyle("display", f)
    },
    updateRows: function(b, d, c) {
        if (b.length > 0) {
            var a = $(d).getElement("form");
            a.getChildren("div").setStyle("display", "none");
            for (i = 0; i < b.length; i++) {
                a.getElement("#phoneItem_" + b[i]).setStyle("display",
                    "block")
            }
        } else {
            $(d).innerHTML = c
        }
    },
    setSubheads: function(b, g) {
        var h;
        var c;
        var a;
        var f;

        function d(k) {
            return k + " Selected"
        }
        if (b.hasClass("multi")) {
            h = b.getElement(".joe").innerHTML;
            a = b.getElement(".colOne").getElements("a.checkMark");
            f = a.length;
            switch (f) {
                case 0:
                    filterMenu.subhead = "All";
                    b.getElement(".joe").innerHTML = "All";
                    b.getElement(".joe").getNext("a").setStyle(
                        "display", "none");
                    break;
                case 1:
                    filterMenu.subhead = a[0].get("text");
                    filterMenu.updateJoe(b.getElement(".joe"), f +
                        " Selected", "inline");
                    break;
                default:
                    filterMenu.subhead = d(f);
                    filterMenu.updateJoe(b.getElement(".joe"), f +
                        " Selected", "inline")
            }
        } else {
            h = b.getElement("a");
            c = b.getElements("a");
            a = b.getElements(".checkMark");
            f = a ? a.length : 0;
            if (f > 0) {
                if (f > 1) {
                    filterMenu.subhead = d(f)
                } else {
                    filterMenu.subhead = a[0].get("text")
                }
            } else {
                if (h) {
                    firstLinkText = h.get("text");
                    filterMenu.subhead = firstLinkText;
                    if (firstLinkText.toLowerCase() == "all") {
                        h.addClass("checkMark")
                    }
                } else {
                    filterMenu.subhead = "All"
                }
            }
        }
        filterMenu.subhead = filterMenu.subhead.trim().truncate(21,
            "...");
        g.set("text", filterMenu.subhead.trim());
        if (isIE) {
            g.setStyle("height", 15)
        }
    },
    updateJoe: function(b, a, d) {
        try {
            b.innerHTML = a;
            b.getNext("a").setStyle("display", d)
        } catch (c) {}
    },
    checkExceptions: function(b, c) {
        for (i = 0; i < filterMenu.letterSpacingExceptions[0].length; i++) {
            var a = b.get("text");
            a = a.clean().toLowerCase();
            if (a.test(filterMenu.letterSpacingExceptions[0][i])) {
                if (c) {
                    filterMenu.originalLetterSpacing = b.getStyle(
                        "letterSpacing");
                    b.setStyle("letterSpacing", filterMenu.letterSpacingExceptions[
                        1][i] + "px")
                } else {
                    b.setStyle("letterSpacing", filterMenu.originalLetterSpacing)
                }
            }
        }
    },
    checkDropDownBounds: function(g, b) {
        var f = 10;
        var k;
        var d;
        var a;
        b.measure(function() {
            return g.measure(function() {
                var m = {};
                k = this.getPosition(b);
                d = this.getWidth();
                a = b.getWidth();
                return m
            })
        });
        var h = k.x + d - a;
        var c = (h > f) ? h - f : f;
        k.x = -c;
        g.setPosition(k)
    },
    injectDropShadow: function(d, f) {
        var g, c, h, a, b;
        g = new Element("div");
        g.className = "lft";
        c = new Element("div");
        c.className = "rght";
        h = new Element("div", {
            html: "<div></div><span></span>"
        });
        h.className = "top";
        a = new Element("div", {
            html: "<div></div><span></span>"
        });
        a.className = "bottom";
        b = new Element("div");
        b.className = "middle";
        b.wraps(d);
        g.inject(b, "top");
        c.inject(b, "bottom");
        h.inject(f, "top");
        a.inject(f, "bottom")
    },
    generateColumns: function(h, f) {
        var b = h.getElements(f);
        var g = h.hasClass(filterMenu.ACTIVE_COLUMN_CLASS) ? filterMenu
            .MAX_ITEMS_PER_ACTIVE_COLUMN : filterMenu.MAX_ITEMS_PER_INACTIVE_COLUMN;
        h.empty();
        var c;
        var m;
        var a = 0;
        var k = 0;
        for (var d = 0; d < b.length; d++) {
            m = b[d];
            if (m.isDisplayed() || a === 0) {
                if (a % g === 0) {
                    c = new Element("div");
                    c.inject(h);
                    k += 1
                }
                a += 1
            }
            m.inject(c)
        }
        return k
    },
    more: function(a) {
        var c = a.getParent(".filterMenuList");
        var f = c.getParent(".dropDown");
        var d = c.getParent(".filterBar");
        var b = c.getElements(filterMenu.LIST_MORE_ITEM);
        b.each(function(g) {
            if (g.hasClass(filterMenu.MORE_CLASS)) {
                g.setStyle("display", "block")
            }
        });
        a.setStyle("display", "none");
        filterMenu.generatePopupLayout(c, f, d)
    },
    generatePopupLayout: function(k, g, f) {
        var h;
        var a = k.getElements(".filterMenuColumn");
        if (a.length > 0) {
            var c = 0;
            var b = 0;
            a.each(function(m) {
                b = filterMenu.generateColumns(m, filterMenu.LIST_ITEM);
                c = (b > c) ? b : c
            });
            h = c * filterMenu.columnWidth;
            g.setStyles({
                top: "-44px",
                left: "0px"
            });
            k.setStyle("width", h);
            if (isIE) {
                g.setStyle("width", h + 20)
            }
            filterMenu.checkDropDownBounds(g, f)
        } else {
            var d = k.measure(function() {
                return this.getSize().x
            });
            h = d + 45;
            if (isIE) {
                g.setStyle("width", h + 45)
            } else {
                k.setStyle("width", h)
            }
        }
    },
    init: function() {
        filterMenu.facetMenu = $("facetMenu") ? "#facetMenu" : "";
        if (isIE) {
            this.ms = 150
        }
        filterMenu.dropDowns = $$(filterMenu.facetMenu + " .dropDown");
        if (filterMenu.dropDowns.length === 0) {
            return
        }
        filterMenu.dropDowns.setStyles({
            display: "block",
            visibility: "hidden"
        });
        var k;
        filterMenu.menuContainers = [];
        var h;
        var g;
        var a;
        var d;
        var f;
        var c;
        var b;
        $$(filterMenu.facetMenu + " .filterMenuList").each(function(n,
            m) {
            d = n.getParent(".dropDown");
            f = n.getParent(".filterMenu").getElement(
                "a.filterMenuHead");
            c = n.getElement("." + filterMenu.MORE_BUTTON_CLASS);
            b = n.getElements(".more");
            if (b.length > 0) {
                b.each(function(o) {
                    o.setStyle("display", "none")
                })
            } else {
                c && c.setStyle("display", "none")
            }
            filterMenu.injectDropShadow(n, d);
            if (n.getElements("a:not('.disabled')").length < 1) {
                f.addClass("filterDisabled")
            }
            k = 100 - m;
            a = f.getParent();
            a.setStyle("zIndex", k);
            d.parentInfo = new filterMenu.ParentInfo(a, k);
            filterMenu.menuContainers.push(d.parentInfo);
            f.getFirst("span").set("class", "top");
            h = n.getParent(".filterMenu");
            g = f.getLast("span");
            if (!h.hasClass("go") && !h.hasClass("defaultSub")) {
                filterMenu.setSubheads(n, g)
            } else {
                if (h.hasClass("defaultSub") && filterMenu.counter >
                    0) {
                    filterMenu.setSubheads(n, g)
                }
            }
            filterMenu.generatePopupLayout(n, d, f.getParent(
                ".filterBar"))
        });
        filterMenu.dropDowns.setStyles({
            display: "none",
            visibility: "visible"
        });
        filterMenu.setupEventHandlers();
        if (this.counter > 0 && $("clearAll")) {
            setFocus.self("clearAll")
        }
        this.counter++;
        if (typeof viewState !== "undefined" && viewState.compareList) {
            filterMenu.enableCompareButton(viewState.compareList.length)
        }
    },
    enableCompareButton: function(f) {
        var b = $(filterMenu.PRIMARY_COMPARE_BUTTON);
        if (!b) {
            return
        }
        var c = "enabled";
        var a = "active";
        var d = "tooltip";
        if (f === 1) {
            if (!b.hasClass(a)) {
                b.addClass(a)
            }
            if (b.hasClass(c)) {
                b.removeClass(c)
            }
        } else {
            if (f > 1) {
                if (!b.hasClass(c)) {
                    b.addClass(c)
                }
            } else {
                if (b.hasClass(c)) {
                    b.removeClass(c)
                }
                if (b.hasClass(a)) {
                    b.removeClass(a)
                }
            }
        }
    },
    setupEventHandlers: function() {
        filterMenu.dropDowns.addEvents({
            mouseleave: function() {
                if (isIE) {
                    filterMenu.to = setTimeout(function() {
                        filterMenu.show(filterMenu.actDiv,
                            true)
                    }, filterMenu.ms)
                } else {
                    filterMenu.show(filterMenu.actDiv, true)
                }
            },
            blur: function() {
                filterMenu.show(filterMenu.actDiv, true)
            }
        });
        $$(filterMenu.facetMenu + " a.filterMenuHead").addEvents({
            mouseenter: function() {
                if (isIE) {
                    clearTimeout(filterMenu.to)
                }
                if (this.hasClass("filterDisabled")) {
                    return
                }
                filterMenu.dropDowns.setStyle("display",
                    "none");
                filterMenu.actDiv = this.getNext(
                    ".dropDown");
                filterMenu.show(filterMenu.actDiv)
            },
            focus: function() {
                if (this.hasClass("filterDisabled")) {
                    return
                }
                clearTimeout(filterMenu.to);
                filterMenu.dropDowns.setStyle("display",
                    "none");
                filterMenu.actDiv = this.getNext(
                    ".dropDown");
                filterMenu.show(filterMenu.actDiv)
            }
        });
        $$(filterMenu.facetMenu + " .filterMenuList a.disabled").addEvent(
            "focus", function() {
                clearTimeout(filterMenu.to);
                if (this.getNext("a:not('.disabled')")) {
                    this.getNext("a:not('.disabled')").focus()
                } else {
                    if (this.getParent("div").getParents(".colOne")
                        .length > 0) {
                        if (this.getParent().getNext(
                            "div a:not('.disabled')")) {
                            this.getParent().getNext(
                                "div a:not('.disabled')").getElement(
                                "a").focus()
                        } else {
                            var a = this.getParent().getAllNext(
                                "div a:not('.moreButton')");
                            node = (a.length > 0) ? a.length - 1 :
                                0;
                            try {
                                a[node].getElement("a").focus()
                            } catch (b) {}
                        }
                    } else {
                        var a = this.getAllNext("a");
                        a[a.length - 1].focus()
                    }
                }
            });
        $$(filterMenu.facetMenu + " .filterMenuList a.moreButton").addEvents({
            mouseover: function() {
                if (isIE) {
                    clearTimeout(filterMenu.to)
                }
            },
            focus: function() {
                clearTimeout(filterMenu.to)
            },
            blur: function() {
                filterMenu.to = setTimeout(function() {
                    filterMenu.show(filterMenu.actDiv,
                        true)
                }, filterMenu.ms)
            }
        });
        $$(filterMenu.facetMenu + " .filterMenuList a").addEvents({
            mouseover: function() {
                if (this.hasClass("moreButton") || this.hasClass(
                    "disabled")) {
                    return
                }
                if (isIE) {
                    clearTimeout(filterMenu.to)
                }
                this.setStyle("background-color", "#ddd")
            },
            mouseout: function() {
                if (this.hasClass("moreButton") || this.hasClass(
                    "disabled")) {
                    return
                }
                this.setStyle("background-color", "")
            },
            focus: function() {
                if (this.hasClass("moreButton") || this.hasClass(
                    "disabled")) {
                    return
                }
                clearTimeout(filterMenu.to);
                this.setStyle("background-color", "#ddd")
            },
            blur: function() {
                if (this.hasClass("moreButton") || this.hasClass(
                    "disabled")) {
                    return
                }
                this.setStyle("background-color", "#fff");
                filterMenu.to = setTimeout(function() {
                    filterMenu.show(filterMenu.actDiv,
                        true)
                }, filterMenu.ms)
            },
            click: function() {
                var f;
                if (this.hasClass(filterMenu.MORE_BUTTON_CLASS)) {
                    filterMenu.more(this);
                    return
                }
                if (this.hasClass("disabled") || this.hasClass(
                    "noClick")) {
                    return
                }
                if (this.hasClass("checkMark") && this.getParent(
                    ".filterMenu").hasClass(
                    "noDeselect")) {
                    return
                }
                var b = this.get("id");
                var d = false;
                var a = this.getParent(".filterMenuList");
                if (a.hasClass("multi") || a.hasClass(
                    "multiSelect")) {
                    if (this.hasClass("checkMark")) {
                        this.removeClass("checkMark");
                        this.addClass("checkBox")
                    } else {
                        this.removeClass("checkBox");
                        this.addClass("checkMark");
                        d = true
                    }
                    var c = a.getElements("a.checkMark").length;
                    if (c > 0) {
                        filterMenu.updateJoe(a.getElement(
                                ".joe"), c +
                            " Selected", "inline")
                    } else {
                        filterMenu.updateJoe(a.getElement(
                            ".joe"), "All", "none")
                    }
                } else {
                    if (this.hasClass("checkMark")) {
                        this.removeClass("checkMark")
                    } else {
                        this.getSiblings("a").removeClass(
                            "checkMark");
                        this.addClass("checkMark");
                        d = true
                    }
                }
                f = this.getParent(".filterMenu");
                if (f.hasClass("go") || f.hasClass(
                    "defaultSub")) {
                    filterMenu.setSubheads(a, f.getElement(
                        ".filterMenuHead").getLast(
                        "span"))
                }
                filterMenu.show(this.getParent(".dropDown"),
                    true);
                submitDWR(b, d)
            }
        })
    }
};
var Scroller = new Class({
    instance: null,
    initialize: function(d, a, b) {
        var c = this;
        this.motion = b;
        this.autoInterval = null;
        this.slideIncrement = 10;
        this.containerDiv = $(d);
        this.infoDiv = this.containerDiv.getElement(".infoDiv");
        this.slides = this.containerDiv.getElement(".slideDiv").getChildren(
            "div");
        this.divWidth = this.containerDiv.getElement(".slideDiv").getParent()
            .getSize().x;
        this.slideDiv = this.containerDiv.getElement("div.slideDiv");
        this.slideDiv.setStyle("left", 0);
        this.slideWidth = this.slides[0].getSize().x;
        this.visibleSlides = parseInt(this.divWidth / this.slideWidth);
        this.length = this.slides.length;
        this.center = parseInt(this.visibleSlides / 2);
        this.index = this.center;
        this.prev = this.containerDiv.getElement("div.prev");
        this.prev.addEvents({
            mouseover: function() {
                this.addClass("prevHover")
            },
            mouseout: function() {
                this.removeClass("prevHover")
            },
            click: function() {
                c.scroll(-1, c);
                clearInterval(c.autoInterval);
                c.autoInterval = null
            }
        });
        this.next = this.containerDiv.getElement("div.next");
        this.next.addEvents({
            mouseover: function() {
                this.addClass("nextHover")
            },
            mouseout: function() {
                this.removeClass("nextHover")
            },
            click: function() {
                c.scroll(1, c);
                clearInterval(c.autoInterval);
                c.autoInterval = null
            }
        });
        this.selectorDiv = this.containerDiv.getElement(
            "div.selectorDiv");
        for (i = 0; i < this.length; i++) {
            selector = new Element("div", {
                html: "&#160;",
                events: {
                    mouseover: function() {
                        this.addClass("hover")
                    },
                    mouseout: function() {
                        this.removeClass("hover")
                    },
                    click: function() {
                        c.show(this.index, c);
                        clearInterval(c.autoInterval);
                        c.autoInterval = null
                    }
                }
            });
            selector.index = i;
            selector.inject(this.selectorDiv)
        }
        this.selectors = this.selectorDiv.getElements("div");
        w = ((parseInt(this.selectors[0].getStyle("margin-left")) *
            2) + this.selectors[0].getSize().x) * this.length;
        this.selectorDiv.setStyle("width", w);
        if ($chk(this.selectorDiv.getParent(".arrows"))) {
            this.selectorDiv.getParent(".arrows").setStyle("width",
                w)
        }
        if (this.length <= this.visibleSlides) {
            this.prev.style.display = "none";
            this.next.style.display = "none";
            this.selectorDiv.style.display = "none"
        } else {
            this.selectors[this.center].addClass("selected");
            this.slides[this.center].addClass("selected")
        }
    },
    show: function(b, a) {
        instance = a;
        a.index = b;
        for (i = 0; i < a.length; i++) {
            if (i == b) {
                a.selectors[i].addClass("selected");
                a.slides[i].addClass("selected")
            } else {
                a.selectors[i].removeClass("selected");
                a.slides[i].removeClass("selected")
            }
        }
        a.newLeft = (b * a.slideWidth * -1) + a.slideWidth * a.center;
        if (a.motion) {
            a.jump()
        } else {
            a.slide()
        } if (defined("scrollerArrowFunc")) {
            scrollerArrowFunc()
        }
    },
    scroll: function(b, a) {
        b = b + a.index;
        if (b >= a.length) {
            b = 0
        } else {
            if (b < 0) {
                b = a.length - 1
            }
        }
        a.show(b, a)
    },
    slide: function() {
        oldLeft = parseInt(this.slideDiv.style.left);
        diff = oldLeft - this.newLeft;
        if (diff < 0) {
            diff *= -1;
            mult = -1
        } else {
            mult = 1
        } if (diff < this.slideIncrement) {
            this.slideDiv.setStyle("left", this.newLeft)
        } else {
            mult = oldLeft > this.newLeft ? -1 : 1;
            inc = diff / 5;
            nextLeft = parseInt(oldLeft + inc * mult);
            this.slideDiv.setStyle("left", nextLeft);
            setTimeout("instance.slide()", 5)
        }
    },
    jump: function() {
        this.slideDiv.setStyle("left", this.newLeft)
    }
});

function ajaxOnRequest() {
    var a = $("disabledImageZone");
    if (!a) {
        a = document.createElement("div");
        a.setAttribute("id", "disabledImageZone");
        a.style.position = "absolute";
        a.style.zIndex = "100000";
        a.style.width = "100%";
        a.style.left = "0px";
        a.style.height = window.getCoordinates().height + "px";
        a.style.top = window.getScroll().y + "px";
        var b = document.createElement("img");
        b.setAttribute("id", "imageZone");
        b.setAttribute("src",
            "/images_b2c/shared/elements/vzw_spinner_whiteBg.gif");
        a.appendChild(b);
        document.body.appendChild(a);
        b.style.position = "absolute";
        centerOnPage("imageZone")
    } else {
        a.style.height = window.getCoordinates().height + "px";
        a.style.top = window.getScroll().y + "px";
        a.style.visibility = "visible"
    }
}

function ajaxOnComplete(a) {
    $("disabledImageZone").style.visibility = "hidden"
}
var tip = {
    to: null,
    hideTo: null,
    link: null,
    offset: 0,
    pointerSize: 12,
    content: null,
    anchorTop: 0,
    anchorLeft: 0,
    anchorRight: 0,
    anchorBottom: 0,
    tooltip: null,
    tooltipWidth: 0,
    tooltipHeight: 0,
    tooltipPointer: null,
    windowSize: null,
    windowScroll: null,
    windowBottom: 0,
    newLeft: 0,
    newTop: 0,
    orientation: "",
    counter: 0,
    init: function() {
        var a = this;
        if (this.counter > 0) {
            return
        }
        this.offset = (isIE && ieVersion < 9) ? 10 : 0;
        var c = new Element("div#tooltip");
        var d = new Element("div#tooltipPointer");
        var b = new Element("div#tooltipShadow");
        $(document.body).adopt(c, d, b);
        this.tooltip = $("tooltip");
        this.tooltipPointer = $("tooltipPointer");
        $(document.body).addEvents({
            "mouseenter:relay('.tooltip')": function() {
                a.toggle(this)
            },
            "mouseleave:relay('.tooltip')": function() {
                a.toggle()
            },
            "mouseenter:relay('#tooltip')": function() {
                clearTimeout(a.hideTo)
            },
            "mouseleave:relay('#tooltip')": function() {
                a.toggle()
            }
        });
        this.counter++
    },
    toggle: function(b) {
        var a = this;
        if (b) {
            clearTimeout(this.hideTo);
            this.link = $(b);
            this.to = setTimeout(function() {
                a.show()
            }, 500)
        } else {
            clearTimeout(this.to);
            this.hideTo = setTimeout(function() {
                a.hide()
            }, 200)
        }
    },
    getPosition: function() {
        var a = this.link.getPosition();
        this.anchorLeft = a.x;
        this.anchorTop = a.y;
        this.anchorRight = this.anchorLeft + this.link.offsetWidth;
        this.anchorBottom = this.anchorTop + this.link.offsetHeight
    },
    getTip: function() {
        var b = this.link.id + "_text";
        this.content = document.getElementById(b);
        if (!this.content) {
            this.content = this.link.getNext(".tip");
            var a = this.link;
            while (a != document.body && this.content == null) {
                a = a.getParent();
                this.content = a.getNext("div.tip")
            }
        }
    },
    calculateWidth: function() {
        if (!this.content) {
            return
        }
        this.content.setStyle("display", "block");
        this.tooltipWidth = this.content.offsetWidth;
        this.content.setStyle("display", "none");
        this.tooltip.innerHTML = this.content.innerHTML;
        this.tooltip.setStyles({
            width: this.tooltipWidth,
            height: "auto",
            display: "block"
        });
        this.tooltipWidth = this.tooltip.offsetWidth
    },
    getPlacement: function() {
        var b = this.anchorRight + this.pointerSize + 4;
        var f = this.anchorTop - this.tooltipHeight / 2 + this.pointerSize /
            2;
        var a = b + this.tooltipWidth < this.windowSize.x;
        var d = f + this.tooltipHeight < this.windowBottom;
        var c = f > this.windowScroll.y;
        if (a && c && d) {
            this.orientation = "right";
            this.newLeft = b;
            this.newTop = f
        }
    },
    topOrBottom: function() {
        var a = this.anchorTop - this.windowScroll.y;
        var b = this.windowBottom - this.anchorBottom;
        if (a > b) {
            var c = a;
            this.orientation = "top"
        } else {
            var c = b;
            this.orientation = "bottom"
        }
        c -= 20;
        this.heightAdjustment(c)
    },
    heightAdjustment: function(b) {
        if (b < this.tooltipHeight) {
            var a = false;
            while (b < this.tooltipHeight) {
                this.tooltipWidth = this.tooltip.offsetWidth;
                if (this.tooltipWidth > this.windowSize.x - 70) {
                    this.tooltipWidth = this.windowSize.x - 70;
                    a = true
                }
                this.tooltip.setStyle("width", this.tooltipWidth);
                this.tooltipHeight = this.tooltip.offsetHeight;
                if (a) {
                    break
                }
            }
            this.tooltipWidth += 50
        }
    },
    show: function() {
        var b = 0,
            a = 0;
        this.orientation = "";
        this.getPosition();
        this.getTip();
        if (this.content === null) {
            this.hide();
            return
        }
        this.calculateWidth();
        this.windowSize = window.getSize();
        this.windowScroll = window.getScroll();
        this.tooltipHeight = this.tooltip.offsetHeight;
        this.windowBottom = this.windowScroll.y + this.windowSize.y;
        if (!this.link.getParent(".planBar")) {
            this.getPlacement()
        }
        if (this.orientation == "right") {
            b = this.anchorRight;
            a = this.anchorTop - 2;
            this.tooltipPointer.setStyles({
                backgroundPosition: "left center",
                width: 16,
                height: 20
            })
        } else {
            this.topOrBottom()
        } if (this.orientation == "top" || this.orientation == "bottom") {
            if (this.link.hasClass("centerTip")) {
                this.newLeft = (this.anchorLeft + (this.anchorRight -
                    this.anchorLeft) / 2) - this.tooltipWidth / 2;
                b = (this.anchorLeft + (this.anchorRight - this.anchorLeft) /
                    2) - this.pointerSize / 2
            } else {
                this.newLeft = this.anchorRight - this.tooltipWidth / 2;
                b = this.anchorRight - this.pointerSize - 3
            } if (this.orientation == "top") {
                this.newTop = this.anchorTop - this.tooltipHeight -
                    this.pointerSize;
                a = this.anchorTop - this.pointerSize;
                this.tooltipPointer.setStyles({
                    backgroundPosition: "bottom center",
                    width: 20,
                    height: 16
                })
            } else {
                if (this.orientation == "bottom") {
                    this.newTop = this.anchorBottom + this.pointerSize;
                    a = this.anchorBottom - 4;
                    this.tooltipPointer.setStyles({
                        backgroundPosition: "top center",
                        width: 20,
                        height: 16
                    })
                }
            }
        }
        this.newLeft = this.newLeft > this.windowScroll.x ? this.newLeft :
            this.windowScroll.x + 10;
        this.newLeft = this.newLeft + this.tooltipWidth < this.windowSize
            .x ? this.newLeft : this.windowSize.x - this.tooltipWidth -
            10;
        b = b < this.newLeft + this.tooltipWidth - 25 ? b : this.newLeft +
            this.tooltipWidth - 25;
        this.tooltip.setStyles({
            left: this.newLeft,
            top: this.newTop
        });
        $("tooltipShadow").setStyles({
            left: this.newLeft - this.offset,
            top: this.newTop - this.offset,
            width: this.tooltipWidth,
            height: this.tooltipHeight,
            display: "block"
        });
        this.tooltipPointer.setStyles({
            left: b,
            top: a,
            display: "block"
        })
    },
    hide: function() {
        $("tooltip").setStyle("display", "none");
        $("tooltipShadow").setStyle("display", "none");
        $("tooltipPointer").setStyle("display", "none")
    }
};
vz.ui.component = (function() {
    var a = {
        onclick: function(f) {
            var b = f.data.me,
                c = b.options,
                d = $j(f.currentTarget);
            if (c.preventDefaults) {
                f.preventDefault()
            }
            if (c.activeState) {
                d.toggleClass(c.active)
            }
        },
        onmouseenter: function(f) {
            var b = f.data.me,
                c = b.options,
                d = $j(f.currentTarget);
            if (c.hoverState) {
                d.addClass(c.highlight)
            }
        },
        onmouseleave: function(f) {
            var b = f.data.me,
                c = b.options,
                d = $j(f.currentTarget);
            if (c.hoverState) {
                d.removeClass(c.highlight)
            }
        },
        onfocusin: function(f) {
            var b = f.data.me,
                c = b.options,
                d = $j(f.currentTarget);
            if (c.preventDefaults) {
                f.preventDefault()
            }
            if (c.tagOnFocus) {
                d.addClass(c.highlight)
            }
        },
        onfocusout: function(f) {
            var b = f.data.me,
                c = b.options,
                d = $j(f.currentTarget);
            if (c.preventDefaults) {
                f.preventDefault()
            }
            if (c.tagOnFocus) {
                d.removeClass(c.highlight)
            }
        },
        onkeypress: function(f) {
            var b = f.data.me,
                c = b.options,
                d = $j(f.currentTarget);
            if (f.which == 13) {
                if (c.preventDefaults) {
                    f.preventDefault()
                }
                if (c.activeState) {
                    d.toggleClass(c.active)
                }
            }
        }
    };
    return {
        defaults: {
            skin: null,
            highlight: "highlight",
            active: "active",
            withdraw: "disabled",
            hoverState: false,
            tagOnFocus: false,
            activeState: false,
            disabled: false,
            delegateEvents: false,
            preventDefaults: true,
            container: $j(document),
            methods: {}
        },
        init: function(d, c) {
            this.options = $j.extend({}, this.defaults, c);
            var g = d,
                f = this.options,
                b = null;
            f.methods = vz.utils.merge(f.methods, a);
            if (f.skin) {
                g.addClass(f.skin)
            }
            if (f.disabled) {
                g.addClass(f.withdraw)
            }
            b = this.buildEventsMap();
            if (f.delegateEvents) {
                f.container.on(b, f.selector, {
                    me: this
                })
            } else {
                g.on(b, {
                    me: this
                })
            }
        },
        buildEventsMap: function() {
            var d = this.options,
                b = {},
                c;
            for (c in d.methods) {
                if (/^on/.exec(c) && typeof d.methods[c] ===
                    "function") {
                    var f = c.replace("on", "");
                    b[f] = function(g) {
                        d.methods["on" + g.type](g)
                    }
                }
            }
            return b
        }
    }
})();
vz.ui.componentClan = {
    defaults: {
        targets: null,
        componentOptions: {}
    },
    element: null,
    targets: null,
    init: function(b, a) {
        this.options = $j.extend({}, this.defaults, a);
        var c = this.options;
        this.element = b;
        this.setTarget();
        this.setComponentDefaults();
        this.addHandlers();
        this.targets.component(this.componentOptions)
    },
    setTarget: function() {
        var a = this.options;
        if (typeof a.targets !== "string") {
            $j.error('invalid option "' + a.targets +
                '" set to componentClan.options.targets. targets is required and must be a valid jQuery selector'
            )
        }
        this.targets = this.element.find(a.targets);
        if (this.targets.length === 0) {
            $j.error("componentClan failed. There were no " + a.targets +
                " found within " + a.selector)
        }
    },
    setComponentDefaults: function() {
        var a = this.options;
        this.componentOptions = $j.extend({
            activeState: true,
            delegateEvents: true,
            container: this.element
        }, a.componentOptions)
    },
    addHandlers: function() {
        var a = this,
            c = this.options;
        var b = (typeof this.componentOptions.active != "undefined") ?
            this.componentOptions.active : vz.ui.component.defaults.active;
        this.element.on({
            click: function(d) {
                a.targets.removeClass(b)
            },
            keypress: function(d) {
                if (d.which == 13) {
                    a.targets.removeClass(b)
                }
            }
        }, c.targets)
    }
};
vz.ui.dropdown = {
    defaults: {
        skin: "dropdown",
        disabledSkin: "disabled",
        groupSkin: "group",
        ms: 50,
        width: 0,
        height: 0,
        arrowBtn: '<span class="arrow"><em>&nbsp;</em></span>',
        title: "",
        hasTitle: false,
        highlight: "highlight",
        toggleTime: 250
    },
    count: {
        i: 0
    },
    id: "",
    items: [],
    selected: null,
    timeout: null,
    isOpen: true,
    container: null,
    list: null,
    hasFocus: false,
    selectMenu: null,
    selectElement: null,
    parentForm: null,
    childFocus: false,
    mouseIn: false,
    mouseInSelector: false,
    events: {
        focusin: "dropdown.focusin",
        focusout: "dropdown.focusout",
        click: "dropdown.click"
    },
    init: function(b, a) {
        this.options = $j.extend({}, this.defaults, a);
        this.selectMenu = b;
        this.defineElements();
        this.defineResources();
        this.selectElement.parentNode.insertBefore(this.buildDefinitionsList(),
            this.selectElement);
        this.container = $j("#" + this.id);
        this.list = this.container.find("dd ul");
        this.setWidth();
        this.setupEvents();
        this.selectMenu.hide()
    },
    defineElements: function() {
        this.selectElement = this.selectMenu.get(0);
        this.parentForm = this.selectMenu.closest("form");
        this.count.i++;
        if (!this.selectMenu.attr("id")) {
            this.selectMenu.attr("id", "selectMenu" + this.count.i)
        }
        this.id = this.selectMenu.attr("id") + "Dropdown"
    },
    defineResources: function() {
        this.items = this.selectMenu.children();
        this.selected = (this.selectMenu.find("option:selected").length >
                0) ? this.selectMenu.find("option:selected").get(0) :
            this.selectMenu.find("option:first").get(0)
    },
    buildDefinitionsList: function() {
        var d = this.options,
            c = "",
            b = document.createElement("dl"),
            a = "";
        b.setAttribute("id", this.id);
        a = (this.selectMenu.prop("disabled")) ? d.skin + " " + d.disabledSkin :
            d.skin;
        if (isIE && ieVersion < 8) {
            b.setAttribute("className", a)
        } else {
            b.setAttribute("class", a)
        }
        b.setAttribute("data-dropdown", "true");
        c += (d.hasTitle) ? '<dt title="' + d.title + '">' + this.setInitialSelection() +
            "</dt>" : "<dt>" + this.setInitialSelection() + "</dt>";
        c += "<dd><ul>" + this.buildItemsList() + "</ul></dd>";
        b.innerHTML = c;
        return b
    },
    setInitialSelection: function() {
        var b = this.options,
            a = "";
        a += '<a href="#" rel="' + this.selected.value + '"';
        a += (this.selected.className) ? 'class="' + this.selected.className +
            '">' : ">";
        a += '<span class="label">';
        if (b.hasTitle) {
            a += "<strong>" + b.title + "</strong>"
        }
        a += this.selected.innerHTML + "</span></a>";
        return a
    },
    buildItemsList: function() {
        var g = this.options,
            d = "",
            h = null,
            b = null,
            f = null;
        for (var c = 0, a = this.items.length; c < a; c++) {
            h = this.items.eq(c);
            b = h[0];
            if (b.tagName === "OPTGROUP") {
                if (h.attr("label") !== undefined) {
                    d += '<li class="' + g.groupSkin + '">';
                    d += '<span class="label">' + h.attr("label") +
                        "</span>";
                    d += "</li>"
                }
                f = h.children();
                for (j = 0, len2 = f.length; j < len2; j++) {
                    d += this.createList(f[j])
                }
            } else {
                d += this.createList(b)
            }
        }
        return d
    },
    createList: function(b) {
        var a = "";
        a += '<li><a href="#" rel="' + b.value + '"';
        a += (b.className) ? 'class="' + b.className + '">' : ">";
        a += '<span class="label">' + b.innerHTML + "</span>";
        a += "</a></li>";
        return a
    },
    setWidth: function() {
        var d = this.options,
            a = this.container.find("dt a"),
            c = a.get(0),
            b = 0;
        d.width = (!this.selectElement.style.width) ? this.selectMenu.css(
            "width") : this.selectElement.style.width;
        d.width = parseInt(d.width, 10);
        b = d.width - (parseInt(a.css("paddingRight"), 10) + parseInt(a
            .css("marginRight"), 10) + parseInt(a.css(
            "marginLeft"), 10));
        this.container.get(0).style.width = d.width + "px";
        b = (b < 6) ? 6 : b;
        c.style.width = b + "px"
    },
    setupEvents: function() {
        var a = this.parentForm.data("events");
        if (!a || typeof a.reset === "undefined") {
            this.parentForm.on("reset", function() {
                vz.utils.observer.publish("formReset", {
                    form: this
                })
            })
        }
        vz.utils.observer.subscribe("formReset", this, function(b) {
            if (b.form === this.parentForm.get(0)) {
                this.resetting = true;
                this.resetSelection(this.container.find(
                    "dd a[rel=" + this.selected.value +
                    "]"));
                this.resetting = false
            }
        });
        this.list.on({
            focus: function(f) {
                var d = $j(this),
                    b = f.data.self,
                    c = b.options;
                clearTimeout(b.timeout);
                b.childFocus = true
            },
            mouseenter: function(c) {
                var b = c.data.self;
                b.mouseIn = true
            },
            mouseleave: function(c) {
                var b = c.data.self;
                b.mouseIn = false
            }
        }, {
            self: this
        });
        this.container.on({
            mouseenter: function(d) {
                var c = $j(d.currentTarget),
                    b = d.data.self;
                if (c.parent("dt").length > 0) {
                    b.mouseInSelector = true
                }
            },
            mouseleave: function(d) {
                var c = $j(d.currentTarget),
                    b = d.data.self;
                if (c.parent("dt").length > 0) {
                    b.mouseInSelector = false
                }
            },
            keydown: this.onPress,
            click: function(f) {
                var d = $j(f.currentTarget),
                    b = f.data.self,
                    c = b.options;
                b.container.trigger(b.events.click);
                f.preventDefault();
                if (b.selectMenu.prop("disabled")) {
                    return
                }
                if (d.parent("dt").length > 0) {
                    d.parents("dl").find("ul").slideToggle(
                        c.toggleTime);
                    return false
                } else {
                    if (f.which === 3) {
                        return false
                    }
                    b.resetSelection(d);
                    return false
                }
            },
            focusin: function(f) {
                var d = $j(f.currentTarget),
                    b = f.data.self,
                    c = b.options;
                b.container.trigger(b.events.focusin);
                if (b.selectMenu.prop("disabled")) {
                    return
                }
                if (d.parent("dt").length > 0) {
                    b.childFocus = false;
                    if (!b.mouseInSelector) {
                        d.parents("dl").find("ul").slideDown(
                            c.toggleTime)
                    }
                } else {
                    d.parent("li").addClass(c.highlight);
                    b.childFocus = true
                }
                clearTimeout(b.timeout)
            },
            focusout: function(g) {
                var f = $j(g.currentTarget),
                    b = g.data.self,
                    d = b.options,
                    c = null;
                b.container.trigger(b.events.focusout);
                var h = isIE || ("ActiveXObject" in window);
                if (f.parent("dt").length > 0) {
                    c = function(k) {
                        if (!b.childFocus && (!h || !b.mouseIn)) {
                            k.parents("dl").find("ul").slideUp(
                                d.toggleTime)
                        } else {
                            if (h && ieVersion < 9) {
                                k.focus()
                            }
                        }
                    }
                } else {
                    f.parent("li").removeClass(d.highlight);
                    b.childFocus = false;
                    c = function(k) {
                        k.parents("dl").find("ul").slideUp(
                            d.toggleTime)
                    }
                }
                b.timeout = setTimeout(function() {
                    c(f)
                }, d.ms)
            }
        }, "a", {
            self: this
        })
    },
    onPress: function(g) {
        var f = $j(g.currentTarget),
            a = g.data.self,
            d = a.options;
        if (f.parent("dt").length > 0) {
            return
        }
        if (g.which === 13) {
            g.preventDefault();
            a.resetSelection(f)
        } else {
            if (g.which == 38) {
                g.preventDefault();
                var c = f.parent("li").prev("li");
                if (c.length > 0) {
                    if (!isIE) {
                        f.blur()
                    }
                    c.find("a").focus()
                }
            } else {
                if (g.which == 40) {
                    g.preventDefault();
                    var b = f.parent("li").next("li");
                    if (b.length > 0) {
                        if (!isIE) {
                            f.blur()
                        }
                        b.find("a").focus()
                    }
                }
            }
        }
    },
    resetSelection: function(g) {
        var f = this.options,
            a = g.parents("dl"),
            d = g.attr("rel"),
            c = a.find("dt"),
            b = c.find("a");
        a.find("ul").slideUp();
        if (b.attr("rel") != d) {
            b.attr("rel", d).html(g.html());
            if (g.attr("class")) {
                b.attr("class", g.attr("class"))
            }
            if (g.attr("title")) {
                b.attr("title", g.attr("title"))
            }
            if (c.attr("title")) {
                b.find("span.label").prepend($j("<strong>" + c.attr(
                    "title") + "</strong>"))
            }
            this.selectMenu.find('option[value="' + d + '"]').prop(
                "selected", true);
            if (!this.resetting) {
                this.selectMenu.trigger("change", [d])
            }
        }
    }
};
vz.ui.roboDropdown = {
    events: {
        setSelection: "dropdown.setSelection",
        update: "dropdown.update",
        toggleDisable: "dropdown.toggleDisable"
    },
    setupEvents: function() {
        this.container.on(this.events.setSelection, $j.proxy(this.handleSetSelection,
            this));
        this.container.on(this.events.update, $j.proxy(this.update,
            this));
        this.container.on(this.events.toggleDisable, $j.proxy(this.toggleDisable,
            this));
        this._super.apply(this, arguments)
    },
    handleSetSelection: function(b, d, c) {
        var a = this.container.find('a[rel="' + d + '"]');
        this.resetting = (c) ? true : false;
        this.resetSelection(a);
        this.resetting = false
    },
    update: function(b, a) {
        this.defineResources();
        this.list.html(this.buildItemsList());
        if (a) {
            this.container.trigger(this.events.setSelection, [this.selected
                .value, true
            ])
        }
    },
    toggleDisable: function(d, a) {
        var c = this.options;
        this.selectMenu.prop("disabled", a);
        var b = (a) ? this.container.addClass : this.container.removeClass;
        b.call(this.container, c.disabledSkin)
    }
};
vz.ui.roboDropdown = vz.utils.merge(vz.ui.roboDropdown, vz.ui.dropdown);
vz.ui.colorDropdown = {
    defaults: {
        skin: "color dropdown"
    },
    setInitialSelection: function() {
        var c = this.options,
            b = "",
            a = "FFFFFFF";
        a = (this.selected.dataset) ? this.selected.dataset.color :
            this.selected.getAttribute("data-color");
        b += '<a href="#" rel="' + this.selected.value + '" title="' +
            this.selected.innerHTML + '"';
        b += (this.selected.className) ? 'class="' + this.selected.className +
            '">' : ">";
        b += '<span class="swatch" style="background-color:#' + a +
            '">&#160;</span>';
        b += "</a>";
        return b
    },
    createList: function(c) {
        var b = "",
            a = "FFFFFFF";
        a = (c.dataset) ? c.dataset.color : c.getAttribute("data-color");
        b += '<li><a href="#" rel="' + c.value + '" title="' + c.innerHTML +
            '"';
        b += (c.className) ? 'class="' + c.className + '">' : ">";
        b += '<span class="swatch" style="background-color:#' + a +
            '">&#160;</span>';
        b += "</a></li>";
        return b
    }
};
vz.ui.colorDropdown = vz.utils.merge(vz.ui.colorDropdown, vz.ui.roboDropdown);
vz.ui.carousel = {
    defaults: {
        dispItems: 1,
        steps: 1,
        slideDuration: 500,
        autoSlide: false,
        autoSlideDelay: 5000,
        loop: true,
        direction: "left",
        nextBtn: '<a href="" class="next"><span>Next</span></a>',
        prevBtn: '<a href="" class="prev"><span>Prev</span></a>',
        pauseBtn: '<a href=""><span>Pause</span></a>',
        pauseEnabled: false,
        pauseSkin: "pause",
        pipeIcon: '<span class="pipe"></span>',
        btnSkin: "control",
        btnDisabledSkin: "disabled",
        btnNoScrollSkin: "nonScrolling",
        pipeSkin: "pipe",
        buttonOrientation: "sides",
        pagination: false,
        pageOrientation: "center",
        pageBtn: "bullet",
        useDefaultSkin: true,
        skin: null,
        wSkin: "wrapper",
        slideContSkin: "slideContainer",
        slideSkin: "slide",
        pageSkin: "controls",
        slideWidth: 0,
        noScroll: false,
        adjustSlideHeight: true,
        adjustElementWidth: true
    },
    element: null,
    defaultSkin: "carousel",
    wrapper: null,
    ul: null,
    ulWidth: 0,
    items: [],
    itemWidth: 0,
    maxHeight: 0,
    controls: null,
    pagination: null,
    pages: 0,
    gotoPage: 1,
    next: null,
    prev: null,
    interval: null,
    slideAmount: 0,
    duration: 0,
    init: function(b, a) {
        this.options = $j.extend({}, this.defaults, a);
        var c = this.options;
        this.element = b;
        this.validateOptions();
        this.setup();
        this.calculateDimensions();
        this.addElements();
        this.setupEvents();
        if (c.autoSlide) {
            this.startSliding()
        } else {
            c.pauseEnabled = false
        }
    },
    validateOptions: function() {
        var a = this.options;
        if (!a.direction.test(/^left$|^right$/)) {
            b("direction", a.direction, '"left", "right"')
        }
        if (!a.buttonOrientation.test(/^sides$|^bottom$/)) {
            b("buttonOrientation", a.buttonOrientation,
                '"sides", "bottom"')
        }
        if (!a.pageOrientation.test(/^left$|^right$|^center$/)) {
            b("pageOrientation", a.pageOrientation,
                '"left", "right", "center"')
        }
        if (!a.pageBtn.test(/^bullet$|^number$/)) {
            b("pageBtn", a.pageBtn, '"bullet", "number"')
        }

        function b(d, f, c) {
            $j.error('invalid option "' + f +
                '" set to carousel.options.' + d +
                ". Valid values: " + c + ".")
        }
    },
    setup: function() {
        var a = this.options;
        if (a.useDefaultSkin) {
            this.element.addClass(this.defaultSkin)
        }
        if (a.skin) {
            this.element.addClass(a.skin)
        }
        this.defineObjects();
        this.determineStatus();
        if (a.pagination || a.buttonOrientation === "bottom") {
            this.buildControls()
        }
        if (a.pagination) {
            this.pagination = this.buildPagination()
        }
        if (a.slideWidth) {
            this.itemWidth = a.slideWidth
        }
    },
    defineObjects: function() {
        var a = this.options;
        this.ul = this.element.children("ul").addClass(a.slideContSkin +
            " clearfix");
        this.ul.css({
            margin: 0,
            padding: 0
        });
        this.ul.get(0).style[a.direction] = "0px";
        this.items = this.ul.children("li");
        this.pages = Math.ceil(this.items.length / a.steps);
        this.wrapper = $j("<div/>").addClass(a.wSkin);
        this.prev = $j(a.prevBtn).addClass(a.btnSkin);
        this.pause = $j(a.pauseBtn).addClass(a.btnSkin + " " + a.pauseSkin);
        this.next = $j(a.nextBtn).addClass(a.btnSkin);
        this.pipe = $j(a.pipeIcon).addClass(a.pipeSkin);
        this.duration = a.slideDuration
    },
    determineStatus: function() {
        var a = this.options;
        if (a.noScroll || (this.items.length <= a.dispItems)) {
            this.prev.addClass(a.btnNoScrollSkin);
            this.next.addClass(a.btnNoScrollSkin)
        }
        if (!a.loop) {
            if (a.direction === "left") {
                this.prev.addClass(a.btnDisabledSkin)
            } else {
                this.next.addClass(a.btnDisabledSkin)
            }
        }
    },
    buildControls: function() {
        var a = this.options;
        this.controls = $j("<div/>");
        this.controls.addClass(a.pageSkin);
        this.controls.css("textAlign", a.pageOrientation)
    },
    buildPagination: function() {
        var d = this.options,
            c = 1;
        var b = $j("<ul/>").attr("class", "horizontalList"),
            a = "";
        while (c <= (this.pages - (d.dispItems - d.steps))) {
            a += '<li class="' + d.pageBtn + '">';
            a += '<a href=""';
            if ((d.direction === "left" && c === 1) || (d.direction ===
                "right" && c === this.pages)) {
                a += 'class="active"'
            }
            a += ' rel="' + c + '">';
            a += (d.pageBtn === "number") ? c : "&nbsp";
            a += "</a></li>";
            c++
        }
        b.html(a);
        return b
    },
    calculateDimensions: function() {
        var a = this.options,
            d = this,
            b = {};
        this.items.addClass(a.slideSkin);
        if (a.dispItems === 1) {
            this.items.css("margin", 0)
        }
        if (this.itemWidth === 0) {
            this.itemWidth = this.items.first().outerWidth(true)
        }
        if (a.adjustSlideHeight) {
            this.items.heightAdjust();
            this.maxHeight = this.items.first().outerHeight(true)
        } else {
            this.items.each(function(c) {
                var f = d.options,
                    g = $j(this);
                d.maxHeight = Math.max(d.maxHeight, g.outerHeight(
                    true))
            })
        }
        this.items.css("float", a.direction);
        this.wrapper.css({
            width: this.itemWidth * a.dispItems,
            height: this.maxHeight
        });
        this.ul.css("width", this.itemWidth * this.items.length)
    },
    addElements: function() {
        var a = this.options;
        this.wrapper = this.ul.wrap(this.wrapper).parent();
        if (a.buttonOrientation === "sides") {
            this.element.prepend(this.prev);
            this.element.append(this.next);
            if (a.adjustElementWidth) {
                this.element.css("width", this.wrapper.outerWidth(true) +
                    this.prev.outerWidth(true) + this.next.outerWidth(
                        true))
            }
            if (a.pagination) {
                this.controls.append(this.pagination);
                this.element.append(this.controls)
            }
        } else {
            if (a.buttonOrientation === "bottom") {
                if (a.adjustElementWidth) {
                    this.element.css("width", this.wrapper.width())
                }
                this.controls.append(this.prev);
                if (a.pauseEnabled) {
                    this.controls.append(this.pause);
                    this.controls.append(this.next);
                    this.controls.append(this.pipe);
                    this.controls.append(this.pagination)
                } else {
                    this.controls.append(this.pagination);
                    this.controls.append(this.next)
                }
                this.element.append(this.controls)
            }
        }
    },
    setupEvents: function() {
        var a = this.options;
        this.element.on("click", "." + a.btnSkin + ":not(." + a.pauseSkin +
            ")", {
                self: this
            }, this.controlHandler);
        this.element.on("click", "." + a.pageSkin + " li a", {
            self: this
        }, this.pageHandler);
        this.element.on("click", "." + a.pauseSkin, {
            self: this
        }, this.pauseHandler)
    },
    controlHandler: function(c) {
        var a = c.data.self,
            b = a.options;
        a.stopSliding();
        c.preventDefault();
        if (this.hasClass(b.btnDisabledSkin) || this.hasClass(b.btnNoScrollSkin)) {
            return
        }
        if (b.direction === "left") {
            if (this.hasClass("prev")) {
                a.gotoPage--
            } else {
                a.gotoPage++
            }
        } else {
            if (this.hasClass("prev")) {
                a.gotoPage++
            } else {
                a.gotoPage--
            }
        }
        a.onDeck()
    },
    pageHandler: function(d) {
        var a = d.data.self,
            c = $j(this),
            b = a.options;
        a.stopSliding();
        d.preventDefault();
        if (b.direction === "left") {
            a.gotoPage = c.attr("rel")
        } else {
            a.gotoPage = a.pages - (b.dispItems - b.steps) - (c.attr(
                "rel") - 1)
        }
        a.onDeck(true)
    },
    pauseHandler: function(b) {
        var a = b.data.self;
        a.stopSliding();
        b.preventDefault()
    },
    onDeck: function(a) {
        if (!a) {
            this.checkPage()
        }
        this.updateButtons();
        this.slide()
    },
    checkPage: function() {
        var a = this.options;
        if (this.gotoPage == 0) {
            if (a.loop) {
                this.gotoPage = this.pages - (a.dispItems - a.steps)
            } else {
                clearInterval(this.interval);
                return
            }
        } else {
            if (this.gotoPage > this.pages) {
                if (a.loop) {
                    this.gotoPage = 1
                } else {
                    clearInterval(this.interval);
                    return
                }
            } else {
                if (this.truePage() > this.pages) {
                    if (a.loop) {
                        this.gotoPage = 1
                    } else {
                        this.gotoPage = this.pages - (a.dispItems - a.steps)
                    }
                }
            }
        }
    },
    updateButtons: function() {
        var c = this.options;
        if (!c.loop) {
            var b = (c.direction === "left") ? this.prev : this.next;
            var a = (c.direction === "left") ? this.next : this.prev;
            if (this.gotoPage == 1) {
                b.addClass(c.btnDisabledSkin)
            } else {
                b.removeClass(c.btnDisabledSkin)
            } if (this.truePage() == this.pages) {
                a.addClass(c.btnDisabledSkin)
            } else {
                a.removeClass(c.btnDisabledSkin)
            }
        }
    },
    slide: function(d, f) {
        var c = this.options,
            b = this;
        if (d && typeof d === "number") {
            this.gotoPage = d
        }
        if (typeof f === "number") {
            this.duration = f
        }
        this.slideAmount = this.getSlideAmount();
        var a = {};
        a[c.direction] = this.slideAmount;
        this.ul.animate(a, this.duration, function() {
            b.callback()
        })
    },
    callback: function() {
        var b = this.options;
        if (b.pagination) {
            var a = this.controls.find("li a");
            a.removeClass("active");
            var c = (b.direction === "left") ? a.get(this.gotoPage - 1) :
                a.get(this.pages - this.truePage());
            $j(c).addClass("active")
        }
        this.duration = b.slideDuration
    },
    truePage: function() {
        var a = this.options;
        return parseInt(this.gotoPage, 10) + (a.dispItems - a.steps)
    },
    getSlideAmount: function() {
        var a = this.options;
        return -(this.itemWidth * a.steps * (this.gotoPage - 1))
    },
    startSliding: function(a) {
        var d = this,
            b = d.options;
        if (a && typeof a === "number") {
            b.autoSlideDelay = a
        }
        this.interval = setInterval(function() {
            d.gotoPage++;
            d.onDeck()
        }, b.autoSlideDelay)
    },
    stopSliding: function() {
        clearInterval(this.interval)
    },
    update: function() {
        var a = this.options;
        this.items = this.ul.children("li");
        this.items.addClass(a.slideSkin);
        if (this.items.length <= a.dispItems) {
            this.prev.addClass(a.btnNoScrollSkin);
            this.next.addClass(a.btnNoScrollSkin)
        } else {
            if (!a.noScroll) {
                this.prev.removeClass(a.btnNoScrollSkin);
                this.next.removeClass(a.btnNoScrollSkin)
            }
        } if (a.dispItems === 1) {
            this.items.css("margin", 0)
        }
        this.items.css("float", a.direction);
        this.pages = Math.ceil(this.items.length / a.steps);
        this.ul.css("width", this.itemWidth * this.items.length);
        if (a.pagination) {
            var b = this.buildPagination();
            this.pagination.replaceWith(b);
            this.pagination = b
        }
        this.slide(1, 0);
        this.updateButtons()
    }
};
vz.ui.revolvingCarousel = {
    init: function(b, a) {
        this._super.apply(this, arguments);
        this.slide(2, 0);
        this.items.show()
    },
    overrideDefaults: function() {
        var a = this.options;
        a.dispItems = 1;
        a.steps = 1;
        this._super.apply(this, arguments)
    },
    setup: function() {
        this._super.apply(this, arguments);
        this.hidePages()
    },
    hidePages: function() {
        var a = this.options;
        if (a.pagination) {
            this.pagination.children("li:first").hide();
            this.pagination.children("li:eq(1)").css("marginLeft", 0);
            this.pagination.children("li:last").hide()
        }
    },
    defineObjects: function() {
        this._super.apply(this, arguments);
        var c = this.ul.children("li:first").get(0);
        var b = this.ul.children("li:last").hide().get(0);
        var a = $j(this.ul).get(0);
        a.insertBefore(b.cloneNode(true), a.firstChild);
        a.appendChild(c.cloneNode(true));
        this.items = this.ul.children("li");
        this.pages += 2
    },
    callback: function() {
        var a = false;
        this._super.apply(this, arguments);
        if (this.gotoPage == 1) {
            this.gotoPage = this.pages - 1;
            a = true
        } else {
            if (this.gotoPage == this.pages) {
                this.gotoPage = 2;
                a = true
            }
        } if (a) {
            this.slide(this.gotoPage, 0)
        }
    }
};
vz.ui.revolvingCarousel = vz.utils.merge(vz.ui.revolvingCarousel, vz.ui.carousel);
vz.ui.flyout = {
    defaults: {
        launcher: "launchpad",
        stage: "stage",
        openBtn: "open",
        closeBtn: "close",
        badgeSkin: "badge",
        labelSkin: "label",
        title: "launcherTitle",
        subhead: "launcherSubhead",
        stageSubhead: "stageSubhead",
        doneBtnText: "Done",
        skin: "flyout",
        id: ""
    },
    firstLauncherTop: -1,
    launcherZ: 0,
    title: null,
    subhead: null,
    stageSubhead: null,
    init: function(c, b) {
        this.options = $j.extend({}, this.defaults, b);
        var a = this,
            d = a.options,
            f = c;
        f.addClass(d.skin);
        f.children("li").each(function(g) {
            var h = $j(this);
            a.title = null;
            a.subhead = null;
            a.stageSubhead = null;
            if (h.find("." + d.title).length > 0) {
                a.title = h.find("." + d.title);
                a.title.remove().removeClass(d.title)
            }
            if (h.find("." + d.subhead).length > 0) {
                a.subhead = h.find("." + d.subhead);
                a.subhead.remove().removeClass(d.subhead)
            }
            if (h.find("." + d.stageSubhead).length > 0) {
                a.stageSubhead = h.find("." + d.stageSubhead);
                a.stageSubhead.remove().removeClass(d.stageSubhead)
            }
            a.buildStage(h);
            a.buildLauncher(h);
            if (g === 0) {
                a.launcherZ = h.css("zIndex")
            }
        });
        this.setupEvents(f)
    },
    buildStage: function(f) {
        var c = this.options;
        var a = $j("<div/>").attr("class", c.stage);
        var d = f.children(":first");
        this.id = d.attr("id");
        d.wrap(a);
        var b = d.parent();
        if (this.stageSubhead) {
            b.prepend(this.stageSubhead.clone(true))
        }
        b.prepend('<hr class="divider" />');
        b.prepend(this.buildLabel(true));
        b.prepend(this.buildBadge(false));
        b.append(this.buildDoneBtn())
    },
    buildLauncher: function(b) {
        var a = this.options;
        b.addClass(a.launcher);
        b.attr("data-id", this.id);
        b.prepend(this.buildLabel(false));
        b.prepend(this.buildBadge(true))
    },
    buildLabel: function(c) {
        var b = this.options;
        var a = $j("<div/>").attr("class", b.labelSkin);
        a.append(this.title.clone(true));
        if (!c && this.subhead) {
            a.append(this.subhead.clone(true))
        }
        return a
    },
    buildBadge: function(b) {
        var c = this.options;
        var a = (b) ? c.openBtn : c.closeBtn;
        return $j('<a href="#" />').attr("class", c.badgeSkin + " " + a)
            .attr("title", this.title.text()).html(
                "<span>&nbsp;</span>")
    },
    buildDoneBtn: function() {
        var c = this.options;
        var b = $j("<div/>").attr("class", "callToAction clearfix").html(
            "<fieldset></fieldset>");
        var a = $j('<button type="button" />').attr("title", c.doneBtnText)
            .attr("title", c.doneBtnText).html("<span><span>" + c.doneBtnText +
                "</span></span>").attr("name", "normal").attr("class",
                "redButton " + c.doneBtnText);
        b.find("fieldset").append(a);
        return b
    },
    setupEvents: function(b) {
        var a = this.options;
        b.find("." + a.badgeSkin).on("click", {
            self: this
        }, function(g) {
            var p = g.data.self,
                c = p.options,
                h = $j(this),
                f = false,
                d = h.parents("li"),
                o = "",
                k = null;
            g.preventDefault();
            g.stopPropagation();
            o = h.attr("title");
            if (o.length > 0) {
                o = o.replace(/\&/, "and")
            }
            if ($j(g.currentTarget).hasClass(c.openBtn)) {
                if (p.firstLauncherTop < 0) {
                    p.firstLauncherTop = d.parent("ul").find(
                        "li:first").offset().top
                }
                var m = d.offset().top;
                newTop = p.firstLauncherTop - m;
                if (isIE) {
                    d.css("zIndex", p.launcherZ + 1)
                }
                var n = "/prepay/review shopping cart/" + o;
                if (typeof vzwSc != "undefined") {
                    vzwSc.submitDataAsync(n, "store", "/store",
                        false)
                }
            } else {
                if ($j(g.currentTarget).hasClass(c.closeBtn)) {
                    newTop = 0;
                    f = true
                }
            }
            p.toggleStage(p, d, newTop, f);
            k = o.toLowerCase().match(
                /accessories|features|plan|money/);
            k = (!k) ? "unknown" : k[0];
            vz.utils.observer.publish("toggleFlyout", {
                closing: f,
                type: k
            });
            return false
        });
        b.on("click", "." + a.launcher, {
            self: this
        }, function(c) {
            $j(this).children(".badge").trigger("click")
        });
        $j("." + a.stage).on("click", {
            self: this
        }, function(c) {
            if ($j(c.target).parent("." + a.badgeSkin).length ==
                0) {
                c.stopPropagation();
                return false
            }
        });
        $j("." + a.stage).on("click", "." + a.doneBtnText, {
            self: this
        }, function(c) {
            $j(this).parents("." + a.launcher).find(
                ".badge.close").trigger("click");
            c.stopPropagation();
            return false
        })
    },
    open: function(b) {
        var a = this.options;
        var c = $j("." + a.launcher + '[data-id="' + b + '"]');
        if ((c.length > 0) && (c.find(".stage").filter(":visible").length <
            1)) {
            c.children(".badge.open").trigger("click")
        }
    },
    close: function(b) {
        var a = this.options;
        var c = $j("." + a.launcher + '[data-id="' + b + '"]');
        if ((c.length > 0) && (c.find(".stage").filter(":visible").length >
            0)) {
            c.find(".badge.close").trigger("click")
        }
    },
    toggle: function(b) {
        var a = this.options;
        var d = $j("." + a.launcher + '[data-id="' + b + '"]');
        if (d.length > 0) {
            var c = d.find(".stage").filter(":visible").length;
            if (c) {
                d.find(".badge.close").trigger("click")
            } else {
                d.children(".badge.open").trigger("click")
            }
        }
    },
    toggleStage: function(b, f, a, c) {
        var d = this.options;
        f.find("." + d.stage).animate({
            width: "toggle",
            height: "toggle",
            opacity: "toggle",
            top: a
        }, 250, function() {
            if (c) {
                f.css("zIndex", b.launcherZ)
            }
        })
    }
};
vz.ui.accordion = {
    defaults: {
        skin: "accordion clearfix",
        headerClass: "accordionHeader",
        headerOpenClass: "accordionHeaderOpen",
        contentClass: "accordionContent",
        elementClass: "accordionElement",
        horizontalSkin: "horizontal",
        wrapperSkin: "wrapper",
        addHandle: false,
        handle: {
            html: '<a href="javascript:void(0);"><span></span></a>',
            skin: "handle",
            alignment: "left"
        },
        header: {
            componentOptions: {
                activeState: true
            }
        },
        panelIsOpen: "panel-is-open",
        defaultPanel: "open-on-load",
        isVertical: true,
        autoClose: true,
        alwaysOpen: true,
        opacityAnimation: true,
        paddingAnimation: true,
        animationOptions: {
            queue: false,
            duration: 300
        },
        animationSettings: {}
    },
    element: null,
    wrappers: null,
    headers: null,
    containers: null,
    init: function(b, a) {
        this.options = jQuery.extend(true, {}, this.defaults, a);
        this.element = b;
        this.element.addClass(this.options.skin);
        this.defineElements();
        this.resetOptions();
        if (!this.options.isVertical) {
            this.element.addClass(this.options.horizontalSkin)
        }
        this.setupContainers();
        this.setupHeaders();
        this.setupHandle();
        this.showDefault()
    },
    defineElements: function() {
        this.headers = $j("." + this.options.headerClass, this.element);
        this.containers = $j("." + this.options.contentClass, this.element)
    },
    resetOptions: function() {
        var a = {
            show: {
                height: "toggle",
                opacity: "toggle",
                paddingTop: "toggle",
                paddingBottom: "toggle"
            },
            hide: {
                height: "toggle",
                opacity: "toggle",
                paddingTop: "toggle",
                paddingBottom: "toggle"
            }
        };
        var b = {
            show: {
                width: "toggle",
                opacity: "toggle",
                paddingLeft: "toggle",
                paddingRight: "toggle"
            },
            hide: {
                width: "toggle",
                opacity: "toggle",
                paddingLeft: "toggle",
                paddingRight: "toggle"
            }
        };
        this.animationSettings = jQuery.extend(true, (this.options.isVertical) ?
            a : b, this.options.animationSettings);
        if (!this.options.paddingAnimation) {
            delete this.animationSettings.show.paddingLeft;
            delete this.animationSettings.hide.paddingLeft;
            delete this.animationSettings.show.paddingRight;
            delete this.animationSettings.hide.paddingRight;
            delete this.animationSettings.show.paddingTop;
            delete this.animationSettings.hide.paddingTop;
            delete this.animationSettings.show.paddingBottom;
            delete this.animationSettings.hide.paddingBottom
        }
        if (!this.options.opacityAnimation) {
            delete this.animationSettings.show.opacity;
            delete this.animationSettings.hide.opacity
        }
    },
    setupHandle: function() {
        var b = null,
            a = this.options.handle;
        if (this.options.addHandle) {
            b = $j(a.html).addClass(a.skin);
            this.headers.prepend(b.clone())
        }
    },
    setupContainers: function() {
        var a = this,
            b = null;
        this.containers.each(function() {
            var c = $j(this);
            c.css({
                height: c.height(),
                width: c.width()
            });
            if (!a.options.isVertical) {
                b = $j("<div></div>").addClass(a.options.wrapperSkin);
                c.children().wrapAll(b);
                b = c.children("." + a.options.wrapperSkin);
                b.css({
                    height: b.height(),
                    width: b.width()
                })
            }
            c.animate(a.animationSettings.hide, 0);
            c.data(vz.utils.camelCase(a.options.panelIsOpen),
                false)
        })
    },
    setupHeaders: function() {
        var a = this,
            b = {};
        b.methods = {
            onclick: function(c) {
                this._super.apply(this, arguments);
                a.headerHandler(c)
            },
            onkeypress: function(c) {
                this._super.apply(this, arguments);
                if (c.which == 13) {
                    a.headerHandler(c)
                }
            }
        };
        $j.extend(true, b, this.options.header.componentOptions);
        if (this.options.autoClose) {
            this.element.componentClan({
                targets: "." + this.options.headerClass,
                componentOptions: b
            })
        } else {
            b.delegateEvents = true;
            b.container = this.element;
            this.headers.component(b)
        }
    },
    headerHandler: function(b) {
        var c = $j(b.currentTarget);
        var a = c.next("." + this.options.contentClass);
        this.toggleDisplay(a)
    },
    toggleDisplay: function(a) {
        if (a.data(vz.utils.camelCase(this.options.panelIsOpen))) {
            this.hide(a)
        } else {
            this.show(a)
        }
    },
    show: function(a) {
        if (this.options.autoClose) {
            this.closeAll()
        }
        this.openContainer(a, true)
    },
    closeAll: function() {
        var a = this;
        this.getOpenContainers().each(function() {
            a.openContainer($j(this), false)
        })
    },
    hide: function(a) {
        if (this.options.alwaysOpen && this.getOpenContainers().length ==
            1) {
            return false
        }
        this.openContainer(a, false)
    },
    openContainer: function(d, a) {
        var b = (a) ? "accordion.openStart" : "accordion.hideStart";
        var c = (a) ? this.animationSettings.show : this.animationSettings
            .hide;
        var f = d.prev("." + this.options.headerClass);
        (a) ? f.addClass(this.options.headerOpenClass): f.removeClass(
            this.options.headerOpenClass);
        d.data(vz.utils.camelCase(this.options.panelIsOpen), a);
        d.stop(true, true).animate(c, this.options.animationOptions);
        vz.utils.observer.publish(b, {
            accordion: this.element,
            container: d,
            index: this.containers.index(d),
            show: a
        })
    },
    showDefault: function() {
        var a = this.getDefaultContainer();
        if (a.length > 0) {
            this.show(a)
        }
    },
    getOpenContainers: function() {
        var a = this;
        return this.containers.filter(function() {
            return $j(this).data(vz.utils.camelCase(a.options.panelIsOpen))
        })
    },
    getDefaultContainer: function() {
        return $j("." + this.options.contentClass + "[data-" + this.options
            .defaultPanel + "]", this.element)
    },
    refresh: function() {
        var a = this;
        if (a.options.isVertical) {
            this.containers.each(function(c, d) {
                var b = $j(d);
                if (b.data(vz.utils.camelCase(a.options.panelIsOpen))) {
                    b.slideUp(0).css("height", "auto").slideDown(
                        0)
                } else {
                    b.css("height", "auto")
                }
            })
        }
    }
};
vz.ui.classyAccordion = {
    defaults: {
        headerAnimationSettings: {
            show: {},
            hide: {}
        },
        headerAnimationOptions: {
            show: {},
            hide: {}
        }
    },
    setupHeaders: function() {
        var a = this,
            b = null;
        this._super.apply(this, arguments);
        this.headers.each(function() {
            var c = $j(this);
            if (!a.options.isVertical) {
                b = $j("<div></div>").addClass(a.options.wrapperSkin);
                c.children().wrapAll(b);
                b = c.children("." + a.options.wrapperSkin);
                b.css({
                    height: b.height(),
                    width: b.width()
                })
            }
            a.headerAnimation(c, false)
        })
    },
    show: function(a) {
        this._super.apply(this, arguments);
        this.headerAnimation(a, true)
    },
    hide: function(a) {
        this._super.apply(this, arguments);
        this.headerAnimation(a, false)
    },
    closeAll: function() {
        var b = this,
            a = this.getOpenContainers();
        this._super.apply(this, arguments);
        a.each(function() {
            b.headerAnimation($j(this), false)
        })
    },
    headerAnimation: function(g, a) {
        var f = $j(g).prev("." + this.options.headerClass);
        var b = this;
        var d = (a) ? this.options.headerAnimationSettings.show : this.options
            .headerAnimationSettings.hide;
        var c = (a) ? this.options.headerAnimationOptions.show : this.options
            .headerAnimationOptions.hide;
        $j.extend(c, this.options.animationOptions, {
            complete: function() {
                vz.utils.observer.publish(
                    "accordionHeaderAnimation", {
                        accordion: b.element,
                        header: f,
                        index: b.headers.index(f),
                        show: a
                    })
            }
        });
        if (!$j(".simple-plan-choice").length) {
            f.stop(true, true).animate(d, c)
        }
    }
};
vz.ui.classyAccordion = vz.utils.merge(vz.ui.classyAccordion, vz.ui.accordion);
vz.ui.styledRadioGroup = {
    defaults: {
        groupName: "radioGroup",
        container: "label",
        selected: "selected",
        radioImg: "radioImg",
        hideInput: "styledInput"
    },
    init: function(b, a) {
        this.options = $j.extend({}, this.defaults, a);
        this.element = b;
        this.radioButtons = jQuery(':radio[name="' + this.options.groupName +
            '"]', this.element);
        this.radioButtons.on("change", jQuery.proxy(this.changeHandler,
            this));
        this.radioButtons.addClass(this.options.hideInput).closest(this
            .options.container);
        var c = jQuery("<span></span>");
        c.addClass(this.options.radioImg);
        this.radioButtons.after(c);
        this.highlightChecked()
    },
    changeHandler: function() {
        this.highlightChecked()
    },
    highlightChecked: function() {
        this.radioButtons.closest(this.options.container).removeClass(
            this.options.selected);
        jQuery(":radio[name=" + this.options.groupName + "]:checked",
            this.element).closest(this.options.container).addClass(
            this.options.selected)
    }
};
vz.ui.slideshow = {
    defaults: {
        nextButton: "",
        prevButton: "",
        pageNumber: "",
        showPageNumbers: true,
        slide: ".slide",
        slideWidth: 500,
        slideStrip: ".slideStrip",
        slideChangeEvent: "slideshow.slideChange",
        selectedPageNumber: "selectedPageNumber",
        disabled: "disabled",
        scrollBySlide: false,
        loop: false,
        animationOptions: {
            queue: false,
            duration: 300
        },
        pageNumbers: [],
        pageIndexes: [],
        currentPageIndex: 0,
        controlsContainer: "",
        controls: {},
        cacheMeasurements: true,
        hasControls: true
    },
    innerWidth: 0,
    init: function(b, a) {
        this.options = jQuery.extend(true, {}, this.defaults, a);
        this.element = b;
        this.setupElement();
        this.slides = jQuery(this.options.slide, this.element);
        this.totalSlides = this.slides.length;
        this.slideStrip = jQuery(this.options.slideStrip, this.element);
        this.setSlideWidth(this.options.slideWidth);
        this.setupControls();
        this.showSlide(0)
    },
    setupElement: function() {
        this.element.css("overflow", "hidden");
        this.element.on(this.options.slideChangeEvent, jQuery.proxy(
            this.slideChangeHandler, this));
        if (this.options.cacheMeasurements) {
            this.innerWidth = this.element.innerWidth()
        }
    },
    setupControls: function() {
        var f;
        var b = (this.options.scrollBySlide) ? this.totalSlides : this.getTotalPages();
        this.options.controls = (this.options.controlsContainer === "") ?
            this.element : jQuery(this.options.controlsContainer);
        var a = this.options.controls;
        var d = this.getMaxSlideIndex();
        this.options.pageIndexes = [];
        this.options.pageNumbers = [];
        if (b === 1) {
            this.options.hasControls = false;
            return
        } else {
            this.options.hasControls = true
        }
        this.nextButton = jQuery(this.options.nextButton);
        this.prevButton = jQuery(this.options.prevButton);
        a.append(this.prevButton);
        for (var c = 0; c < b; c++) {
            if (this.options.scrollBySlide) {
                f = vz.utils.clamp(0, this.getMaxSlideIndex(), c)
            } else {
                f = (d > this.getSlideIndexByPage(c)) ? this.getSlideIndexByPage(
                    c) : d
            } if (this.options.showPageNumbers) {
                this.createPageNumber(c, a)
            }
            this.options.pageIndexes.push(f)
        }
        a.append(this.nextButton);
        this.prevButton.on("click", jQuery.proxy(this.prevPage, this));
        this.nextButton.on("click", jQuery.proxy(this.nextPage, this))
    },
    destroyControls: function() {
        if (this.options.hasControls) {
            this.prevButton.remove();
            for (var a = 0; a < this.options.pageNumbers.length; ++a) {
                this.options.pageNumbers[a].remove()
            }
            this.nextButton.remove()
        }
    },
    createPageNumber: function(a, b) {
        var d = jQuery(this.options.pageNumber);
        var c;
        c = d.clone();
        c.html(a + 1);
        b.append(c);
        c.on("click", {
            pageIndex: a
        }, jQuery.proxy(this.pageClickHandler, this));
        this.options.pageNumbers.push(c)
    },
    prevPage: function() {
        if (this.hasPrev()) {
            this.showSlide(this.options.pageIndexes[--this.options.currentPageIndex])
        } else {
            if (this.options.loop) {
                this.options.currentPageIndex = this.options.pageIndexes
                    .length - 1;
                this.showSlide(this.options.pageIndexes[this.options.currentPageIndex])
            }
        }
    },
    nextPage: function() {
        if (this.hasNext()) {
            this.showSlide(this.options.pageIndexes[++this.options.currentPageIndex])
        } else {
            if (this.options.loop) {
                this.options.currentPageIndex = 0;
                this.showSlide(this.options.pageIndexes[this.options.currentPageIndex])
            }
        }
    },
    hasPrev: function() {
        return this.options.currentPageIndex > 0
    },
    hasNext: function() {
        return this.options.currentPageIndex < this.options.pageIndexes
            .length - 1
    },
    recalculateIndexes: function(a) {
        this.slideStrip.stop(true, true);
        this.destroyControls();
        this.setupControls();
        if (!this.options.hasControls && (parseInt(this.slideStrip.css(
            "left"), 10) < 0)) {
            this.slideStrip.css("left", 0)
        }
        if (typeof a !== "undefined") {
            this.gotoSlide(a)
        }
    },
    gotoSlide: function(a) {
        if (this.options.hasControls) {
            this.options.currentPageIndex = (this.options.scrollBySlide) ?
                vz.utils.clamp(0, this.getMaxSlideIndex(), a) : this.getPageIndexBySlide(
                    a);
            this.showSlide(this.options.pageIndexes[this.options.currentPageIndex])
        }
    },
    showSlide: function(a) {
        var b = -a * this.options.slideWidth;
        var c = {
            left: b
        };
        this.slideStrip.animate(c, this.options.animationOptions);
        this.element.trigger(this.options.slideChangeEvent, a)
    },
    slideChangeHandler: function(c) {
        var b = this;
        if (this.options.hasControls) {
            if (!this.options.loop) {
                this.hasPrev() ? this.prevButton.removeClass(this.options
                    .disabled) : this.prevButton.addClass(this.options
                    .disabled);
                this.hasNext() ? this.nextButton.removeClass(this.options
                    .disabled) : this.nextButton.addClass(this.options
                    .disabled)
            }
            jQuery(this.options.pageNumbers).each(function(d, f) {
                jQuery(f).removeClass(b.options.selectedPageNumber)
            });
            var a = jQuery(this.options.pageNumbers[this.options.currentPageIndex],
                this.options.controls);
            a.addClass(this.options.selectedPageNumber)
        }
    },
    pageClickHandler: function(a) {
        this.options.currentPageIndex = a.data.pageIndex;
        this.showSlide(this.options.pageIndexes[this.options.currentPageIndex])
    },
    setSlideWidth: function(a) {
        if (this.options.slideWidth !== a) {
            this.options.slideWidth = a;
            this.recalculateIndexes()
        }
        this.totalSlideWidth = this.totalSlides * this.options.slideWidth
    },
    getMaxScroll: function() {
        var a = this.totalSlideWidth - this.getInnerWidth();
        return (a < 0) ? 0 : a
    },
    getMaxSlideIndex: function() {
        return Math.round(this.getMaxScroll() / this.options.slideWidth)
    },
    getTotalPages: function() {
        return Math.ceil(this.totalSlideWidth / this.getInnerWidth())
    },
    getSlideIndexByPage: function(a) {
        return Math.round(a * this.totalSlides / this.getTotalPages())
    },
    getPageIndexBySlide: function(a) {
        return Math.floor(a / this.getSlidesPerPage())
    },
    getSlidesPerPage: function() {
        return Math.floor(this.getInnerWidth() / this.options.slideWidth)
    },
    getInnerWidth: function() {
        return (this.options.cacheMeasurements) ? this.innerWidth :
            this.element.innerWidth()
    }
};
vz.ui.navigationTabs = {
    selectedHeader: 0,
    defaults: {
        tabHeaderClass: "tabHeader",
        tabContentClass: "tabContent",
        active: "active",
        resizeHeightToFit: false,
        defaultTabIndex: 0
    },
    init: function(b, a) {
        this.options = $j.extend({}, this.defaults, a);
        this.element = b;
        this.setupHeaders()
    },
    setupHeaders: function() {
        var a = this;
        this.getHeaders().each(function(d, c) {
            var b = $j(c);
            b.component({
                activeState: true,
                active: a.options.active,
                hoverState: true
            });
            b.on({
                click: $j.proxy(a.headerClickHandler, a),
                keypress: $j.proxy(a.headerEnterPressHandler,
                    a)
            });
            if (d == a.options.defaultTabIndex) {
                a.showTab(b)
            }
        })
    },
    headerEnterPressHandler: function(a) {
        if (a.which == 13) {
            var b = $j(a.currentTarget);
            this.showTab(b)
        }
    },
    headerClickHandler: function(a) {
        var b = $j(a.currentTarget);
        this.showTab(b)
    },
    hideTabs: function() {
        this.getTabContents().hide();
        this.getHeaders().removeClass(this.options.active)
    },
    showTab: function(b) {
        this.selectedHeader = b;
        this.hideTabs();
        this.refreshHeight();
        b.addClass(this.options.active);
        var a = $j("." + this.options.tabContentClass, this.selectedHeader[
            0].parentNode);
        a.show()
    },
    refreshHeight: function() {
        var a;
        if (this.options.resizeHeightToFit) {
            if (this.selectedHeader.length > 0) {
                a = $j("." + this.options.tabContentClass, this.selectedHeader[
                    0].parentNode);
                a.show();
                this.element.css("height", a.outerHeight() + this.selectedHeader
                    .height())
            } else {
                this.element.css("height", this.getHeaders().height())
            }
        }
    },
    getHeaders: function() {
        return $j("." + this.options.tabHeaderClass, this.element)
    },
    getTabContents: function() {
        return $j("." + this.options.tabContentClass, this.element)
    }
};
vz.ui.droplist = {
    defaults: {
        header: "p",
        headerHighlight: "mOver",
        listContainer: "div",
        listItem: "a",
        openState: "dropped",
        dropParent: "dropParent",
        disabled: "disabled"
    },
    header: {},
    listContainer: {},
    listItems: {},
    init: function(b, a) {
        this.element = b;
        this.options = jQuery.extend({}, this.defaults, a);
        this.listContainer = jQuery(this.options.listContainer, this.element);
        this.listItems = jQuery(this.options.listItem, this.element);
        this.header = jQuery(this.options.header, this.element);
        this.parentNode = jQuery(this.element[0].parentNode);
        this.initSelected();
        this.addHeaderHandlers();
        this.addEventHandlers()
    },
    addHeaderHandlers: function() {
        this.header.on({
            mouseenter: jQuery.proxy(this.headerEnterHandler,
                this),
            click: jQuery.proxy(this.headerClickHandler, this)
        })
    },
    removeHeaderHandlers: function() {
        this.header.off({
            mouseenter: jQuery.proxy(this.headerEnterHandler,
                this),
            click: jQuery.proxy(this.headerClickHandler, this)
        })
    },
    addEventHandlers: function() {
        this.element.on({
            mouseleave: jQuery.proxy(this.elementMouseLeaveHandler,
                this),
            "droplist.setListItem": jQuery.proxy(this.elementSetListItemHandler,
                this),
            "droplist.disable": jQuery.proxy(this.elementDisableHandler,
                this),
            "droplist.enable": jQuery.proxy(this.elementEnableHandler,
                this)
        });
        this.listContainer.on({
            mouseLeave: jQuery.proxy(this.listContainerLeaveHandler,
                this)
        });
        this.listItems.on({
            click: jQuery.proxy(this.listItemClickHandler, this)
        })
    },
    open: function() {
        this.element.addClass(this.options.openState);
        this.parentNode.addClass(this.options.dropParent)
    },
    close: function() {
        this.element.removeClass(this.options.openState);
        this.parentNode.removeClass(this.options.dropParent)
    },
    initSelected: function() {
        var a;
        var b = this.element.find("a[data-selected]");
        if (b.length > 0) {
            a = this.listItems.index(b);
            this.setListItem(a)
        }
    },
    setSelected: function(a) {
        var b = this.setListItem(a);
        jQuery(this.element).trigger("droplist.change", {
            value: b.data("value"),
            index: a
        })
    },
    setListItem: function(a) {
        var b = jQuery(this.listItems.get(a));
        this.header.html(b.html());
        this.element.data("value", b.data("value"));
        this.listItems.data("selected", false);
        b.data("selected", true);
        return b
    },
    elementDisableHandler: function(a) {
        this.removeHeaderHandlers();
        this.element.addClass(this.options.disabled);
        a.stopPropagation()
    },
    elementEnableHandler: function(a) {
        this.addHeaderHandlers();
        this.element.removeClass(this.options.disabled);
        a.stopPropagation()
    },
    elementSetListItemHandler: function(b, a) {
        this.setListItem(a);
        b.stopPropagation()
    },
    elementMouseLeaveHandler: function(a) {
        this.header.removeClass(this.options.headerHighlight);
        this.close()
    },
    headerEnterHandler: function(a) {
        this.header.addClass(this.options.headerHighlight)
    },
    headerClickHandler: function(a) {
        this.open()
    },
    listContainerLeaveHandler: function(a) {
        this.close()
    },
    listItemClickHandler: function(b) {
        var a = b.currentTarget;
        this.setSelected(jQuery(this.listItems).index(a));
        this.close()
    }
};
vz.ui.usageBar = {
    defaults: {
        overage: "overage",
        current: "current",
        recommended: "recommended",
        displayText: "displayText",
        barSpacing: 2,
        textSpacing: 5,
        minEnd: 12,
        minTickSpacing: 75,
        currentPlanAmount: 0,
        overageAmount: 0,
        recommendedAmount: 0,
        recommendedText: "+2GB",
        currentWidth: 0,
        overageWidth: 0,
        recommendedWidth: 0,
        dataUnits: "GB"
    },
    init: function(b, a) {
        this.options = {};
        this.element = $j(b);
        $j.extend(true, this.options, this.defaults, a);
        this.draw(this.options.currentPlanAmount, this.options.overageAmount,
            this.options.recommendedAmount)
    },
    draw: function(k, c, b) {
        this.element.empty();
        var a = this.setRanges(k, b);
        var h = "";
        var f = (!c) ? k + " " + this.options.dataUnits : "";
        var d = "";
        var g;
        h += this.createDataBar(a, this.options.recommended, b, this.options
            .recommendedText);
        if (this.options.overage) {
            g = Math.round((k + c) * 10) / 10;
            d = g + " " + this.options.dataUnits;
            h += this.createDataBar(a, this.options.overage, k + c, d)
        }
        h += this.createDataBar(a, this.options.current, k, f);
        h += this.drawTicks(a.start, a.end);
        this.element.html(h);
        this.checkTextSpacing()
    },
    setRanges: function(c, b) {
        var d = ((c - this.options.barSpacing) > 0) ? (c - this.options
            .barSpacing) : 0;
        var a = b + this.options.barSpacing;
        a = (a < this.options.minEnd) ? this.options.minEnd : a;
        this.elementWidth = this.element.width();
        return {
            start: d,
            end: a
        }
    },
    createDataBar: function(f, k, d, m) {
        var b = f.start,
            c = f.end,
            g, h, a;
        h = (d - b) / (c - b);
        a = Math.round(h * this.elementWidth);
        m = m || "";
        g = '<div class="' + k + ' bar" style="width: ' + a +
            'px;" title="' + m + '">';
        if (m) {
            g += '<div class="displayText centerVertically">' + m +
                '</div><div class="verticalCenterSliver centerVertically"></div>'
        }
        g += "</div>";
        return g
    },
    checkTextSpacing: function() {
        var f = this.element.find("." + this.options.current);
        var a = this.element.find("." + this.options.overage);
        var b = this.element.find("." + this.options.recommended);
        var k = f.outerWidth(true) - this.options.textSpacing;
        var c = a.outerWidth(true) - f.outerWidth(true) - this.options.textSpacing;
        var m = b.outerWidth(true) - a.outerWidth(true) - this.options.textSpacing;
        var g = f.find("." + this.options.displayText);
        var d = a.find("." + this.options.displayText);
        var h = b.find("." + this.options.displayText);
        if (g.outerWidth(true) > k) {
            g.hide()
        }
        if (d.outerWidth(true) > c) {
            d.hide()
        }
        if (h.outerWidth(true) > m) {
            h.hide()
        }
    },
    drawTicks: function(b, c) {
        var f, n, m, k = 100,
            h = -k,
            a = 0,
            g = "";
        for (var d = b; d <= c; d++) {
            m = (d - b) / (c - b);
            a = Math.round(m * this.elementWidth);
            if (a - this.options.minTickSpacing > h) {
                if (d !== b) {
                    n = '<div class="tick value" style="left: ' + a +
                        'px;">' + d + " " + this.options.dataUnits +
                        "</div>";
                    f = '<div class="tick marker" style="left: ' + a +
                        'px;"></div>';
                    g += n + f
                }
                h = a
            }
        }
        return g
    }
};
(function(a) {
    a.fn.dropdown = function(b) {
        return this.each(function() {
            var c = Object.create(vz.ui.dropdown);
            c.init(a(this), b)
        })
    };
    a.fn.roboDropdown = function(b) {
        return this.each(function() {
            var c = Object.create(vz.ui.roboDropdown);
            c.init(a(this), b)
        })
    };
    a.fn.colorDropdown = function(b) {
        return this.each(function() {
            var c = Object.create(vz.ui.colorDropdown);
            c.init(a(this), b)
        })
    };
    a.fn.droplist = function(b) {
        return this.each(function() {
            var c = Object.create(vz.ui.droplist);
            c.init(a(this), b)
        })
    };
    a.fn.carousel = function(b) {
        if (a(this).length > 0) {
            var c = Object.create(vz.ui.carousel);
            c.init(a(this), b);
            return c
        }
    };
    a.fn.revolvingCarousel = function(b) {
        if (a(this).length > 0) {
            var c = Object.create(vz.ui.revolvingCarousel);
            c.init(a(this), b);
            return c
        }
    };
    a.fn.flyout = function(b) {
        return this.each(function() {
            vz.ui.flyout.init(a(this), b)
        })
    };
    a.fn.validateForm = function(b) {
        if (a(this).length > 0) {
            var c = Object.create(vz.polyfill.validateForm);
            c.init(a(this), b);
            return c
        }
    };
    a.fn.accordion = function(b) {
        if (a(this).length > 0) {
            var c = Object.create(vz.ui.accordion);
            c.init(a(this), b);
            return c
        }
    };
    a.fn.classyAccordion = function(b) {
        if (a(this).length > 0) {
            var c = Object.create(vz.ui.classyAccordion);
            c.init(a(this), b);
            return c
        }
    };
    a.fn.styledRadioGroup = function(b) {
        if (a(this).length > 0) {
            var c = Object.create(vz.ui.styledRadioGroup);
            c.init(a(this), b);
            return a(this)
        }
    };
    a.fn.slideshow = function(b) {
        if (a(this).length > 0) {
            var c = Object.create(vz.ui.slideshow);
            c.init(a(this), b);
            return c
        }
    };
    a.fn.navigationTabs = function(b) {
        if (a(this).length > 0) {
            var c = Object.create(vz.ui.navigationTabs);
            c.init(a(this), b);
            return c
        }
    };
    a.fn.component = function(b) {
        if (!b) {
            b = {
                selector: this.selector
            }
        } else {
            a.extend(b, {
                selector: this.selector
            })
        } if (a(this).length > 0) {
            var c = Object.create(vz.ui.component);
            c.init(a(this), b);
            return c
        }
    };
    a.fn.componentClan = function(b) {
        if (!b) {
            b = {
                selector: this.selector
            }
        } else {
            a.extend(b, {
                selector: this.selector
            })
        }
        return this.each(function() {
            var c = Object.create(vz.ui.componentClan);
            c.init(a(this), b)
        })
    };
    a.fn.heightAdjust = function(b) {
        var d = {
            tallest: true,
            shortest: false,
            forceHeight: false,
            height: 0
        };
        var b = a.extend({}, d, b);
        if (!b.tallest && !b.shortest && !b.forceHeight) {
            a.error(
                'heightAdjust requires one of the following options to be true: "tallest", "shortest" or "forceHeight".'
            )
        }
        var c = 0;
        if (b.forceHeight) {
            c = b.height
        } else {
            this.each(function() {
                var f = a(this);
                if (b.shortest) {
                    c = (c === 0) ? f.height() : Math.min(c, f.height())
                } else {
                    if (b.tallest) {
                        c = Math.max(c, f.height())
                    }
                }
            })
        }
        return this.each(function() {
            var f = a(this);
            f.height(c);
            if (b.forceHeight) {
                f.css("overflow", "hidden")
            }
        })
    };
    a.fn.loader = function(b) {
        if (a(this).length > 0) {
            var c = Object.create(vz.utils.loader);
            c.init(a(this), b);
            return c
        }
    };
    a.fn.switchClass = a.fn.switchClass || function(c, b) {
        return this.each(function() {
            var d = a(this);
            d.addClass(c);
            d.removeClass(b)
        })
    };
    a.fn.clearPlaceholders = function() {
        var b = null;
        if (this.get(0).tagName !== "FORM") {
            a.error(
                "clearPlaceholders failed. This method can only be called on a form element. Supplied target: " +
                this.get(0).tagName);
            return false
        }
        return this.each(function() {
            b = $j("input[placeholder]", $j(this));
            b.each(function() {
                var c = $j(this);
                if (c.val() == c.attr("placeholder")) {
                    c.val("")
                }
            })
        })
    }
})(jQuery);
jQuery(document).ready(function() {
    dropShade.init();
    overlay.init();
    if (typeof(waitForFilterInit) == "undefined" || !waitForFilterInit) {
        filterMenu.init()
    }
    tip.init();
    vz.utils.specialAnchors();
    vz.polyfill.placeholder()
});