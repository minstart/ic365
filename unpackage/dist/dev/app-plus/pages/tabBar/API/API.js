"use weex:vue";

if (typeof Promise !== 'undefined' && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor
    return this.then(
      value => promise.resolve(callback()).then(() => value),
      reason => promise.resolve(callback()).then(() => {
        throw reason
      })
    )
  }
};

if (typeof uni !== 'undefined' && uni && uni.requireGlobal) {
  const global = uni.requireGlobal()
  ArrayBuffer = global.ArrayBuffer
  Int8Array = global.Int8Array
  Uint8Array = global.Uint8Array
  Uint8ClampedArray = global.Uint8ClampedArray
  Int16Array = global.Int16Array
  Uint16Array = global.Uint16Array
  Int32Array = global.Int32Array
  Uint32Array = global.Uint32Array
  Float32Array = global.Float32Array
  Float64Array = global.Float64Array
  BigInt64Array = global.BigInt64Array
  BigUint64Array = global.BigUint64Array
};


(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // vue-ns:vue
  var require_vue = __commonJS({
    "vue-ns:vue"(exports, module) {
      module.exports = Vue;
    }
  });

  // C:/Users/71018/Desktop/ic365/unpackage/dist/dev/.nvue/u-link.js
  var import_vue = __toESM(require_vue());

  // C:/Users/71018/Desktop/ic365/unpackage/dist/dev/.nvue/_plugin-vue_export-helper.js
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };

  // C:/Users/71018/Desktop/ic365/unpackage/dist/dev/.nvue/u-link.js
  var _sfc_main = {
    name: "u-link",
    props: {
      href: {
        type: String,
        default: ""
      },
      text: {
        type: String,
        default: ""
      },
      inWhiteList: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      openURL() {
        plus.runtime.openURL(this.href);
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return (0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("u-text", {
      style: { "text-decoration": "underline" },
      href: $props.href,
      onClick: _cache[0] || (_cache[0] = (...args) => $options.openURL && $options.openURL(...args)),
      inWhiteList: $props.inWhiteList
    }, (0, import_vue.toDisplayString)($props.text), 9, ["href", "inWhiteList"]);
  }
  var __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/71018/Desktop/ic365/components/u-link/u-link.vue"]]);

  // C:/Users/71018/Desktop/ic365/unpackage/dist/dev/.nvue/pages/tabBar/API/API.js
  var import_vue4 = __toESM(require_vue());

  // C:/Users/71018/Desktop/ic365/unpackage/dist/dev/.nvue/uni-app.es.js
  var import_vue2 = __toESM(require_vue());
  function requireNativePlugin(name) {
    return weex.requireModule(name);
  }
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }

  // C:/Users/71018/Desktop/ic365/unpackage/dist/dev/.nvue/page-head.js
  var import_vue3 = __toESM(require_vue());
  var nvueAnimation = requireNativePlugin("animation");
  var MPAnimation = class {
    constructor(options, _this) {
      this.options = options;
      this.animation = uni.createAnimation(__spreadValues({}, options));
      this.currentStepAnimates = {};
      this.next = 0;
      this.$ = _this;
    }
    _nvuePushAnimates(type, args) {
      let aniObj = this.currentStepAnimates[this.next];
      let styles = {};
      if (!aniObj) {
        styles = {
          styles: {},
          config: {}
        };
      } else {
        styles = aniObj;
      }
      if (animateTypes1.includes(type)) {
        if (!styles.styles.transform) {
          styles.styles.transform = "";
        }
        let unit = "";
        if (type === "rotate") {
          unit = "deg";
        }
        styles.styles.transform += `${type}(${args + unit}) `;
      } else {
        styles.styles[type] = `${args}`;
      }
      this.currentStepAnimates[this.next] = styles;
    }
    _animateRun(styles = {}, config = {}) {
      let ref = this.$.$refs["ani"].ref;
      if (!ref)
        return;
      return new Promise((resolve, reject) => {
        nvueAnimation.transition(ref, __spreadValues({
          styles
        }, config), (res) => {
          resolve();
        });
      });
    }
    _nvueNextAnimate(animates, step = 0, fn) {
      let obj = animates[step];
      if (obj) {
        let {
          styles,
          config
        } = obj;
        this._animateRun(styles, config).then(() => {
          step += 1;
          this._nvueNextAnimate(animates, step, fn);
        });
      } else {
        this.currentStepAnimates = {};
        typeof fn === "function" && fn();
        this.isEnd = true;
      }
    }
    step(config = {}) {
      this.currentStepAnimates[this.next].config = Object.assign({}, this.options, config);
      this.currentStepAnimates[this.next].styles.transformOrigin = this.currentStepAnimates[this.next].config.transformOrigin;
      this.next++;
      return this;
    }
    run(fn) {
      this.isEnd = false;
      let ref = this.$.$refs["ani"] && this.$.$refs["ani"].ref;
      if (!ref)
        return;
      this._nvueNextAnimate(this.currentStepAnimates, 0, fn);
      this.next = 0;
    }
  };
  var animateTypes1 = [
    "matrix",
    "matrix3d",
    "rotate",
    "rotate3d",
    "rotateX",
    "rotateY",
    "rotateZ",
    "scale",
    "scale3d",
    "scaleX",
    "scaleY",
    "scaleZ",
    "skew",
    "skewX",
    "skewY",
    "translate",
    "translate3d",
    "translateX",
    "translateY",
    "translateZ"
  ];
  var animateTypes2 = ["opacity", "backgroundColor"];
  var animateTypes3 = ["width", "height", "left", "right", "top", "bottom"];
  animateTypes1.concat(animateTypes2, animateTypes3).forEach((type) => {
    MPAnimation.prototype[type] = function(...args) {
      this._nvuePushAnimates(type, args);
      return this;
    };
  });
  function createAnimation(option, _this) {
    if (!_this)
      return;
    clearTimeout(_this.timer);
    return new MPAnimation(option, _this);
  }
  var _sfc_main$2 = {
    name: "uniTransition",
    emits: ["click", "change"],
    props: {
      show: {
        type: Boolean,
        default: false
      },
      modeClass: {
        type: [Array, String],
        default() {
          return "fade";
        }
      },
      duration: {
        type: Number,
        default: 300
      },
      styles: {
        type: Object,
        default() {
          return {};
        }
      },
      customClass: {
        type: String,
        default: ""
      },
      onceRender: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isShow: false,
        transform: "",
        opacity: 1,
        animationData: {},
        durationTime: 300,
        config: {}
      };
    },
    watch: {
      show: {
        handler(newVal) {
          if (newVal) {
            this.open();
          } else {
            if (this.isShow) {
              this.close();
            }
          }
        },
        immediate: true
      }
    },
    computed: {
      // 生成样式数据
      stylesObject() {
        let styles = __spreadProps(__spreadValues({}, this.styles), {
          "transition-duration": this.duration / 1e3 + "s"
        });
        let transform = "";
        for (let i in styles) {
          let line = this.toLine(i);
          transform += line + ":" + styles[i] + ";";
        }
        return transform;
      },
      // 初始化动画条件
      transformStyles() {
        return "transform:" + this.transform + ";opacity:" + this.opacity + ";" + this.stylesObject;
      }
    },
    created() {
      this.config = {
        duration: this.duration,
        timingFunction: "ease",
        transformOrigin: "50% 50%",
        delay: 0
      };
      this.durationTime = this.duration;
    },
    methods: {
      /**
       *  ref 触发 初始化动画
       */
      init(obj = {}) {
        if (obj.duration) {
          this.durationTime = obj.duration;
        }
        this.animation = createAnimation(Object.assign(this.config, obj), this);
      },
      /**
       * 点击组件触发回调
       */
      onClick() {
        this.$emit("click", {
          detail: this.isShow
        });
      },
      /**
       * ref 触发 动画分组
       * @param {Object} obj
       */
      step(obj, config = {}) {
        if (!this.animation)
          return;
        for (let i in obj) {
          try {
            if (typeof obj[i] === "object") {
              this.animation[i](...obj[i]);
            } else {
              this.animation[i](obj[i]);
            }
          } catch (e) {
            formatAppLog("error", "at uni_modules/uni-transition/components/uni-transition/uni-transition.vue:148", `\u65B9\u6CD5 ${i} \u4E0D\u5B58\u5728`);
          }
        }
        this.animation.step(config);
        return this;
      },
      /**
       *  ref 触发 执行动画
       */
      run(fn) {
        if (!this.animation)
          return;
        this.animation.run(fn);
      },
      // 开始过度动画
      open() {
        clearTimeout(this.timer);
        this.transform = "";
        this.isShow = true;
        let { opacity, transform } = this.styleInit(false);
        if (typeof opacity !== "undefined") {
          this.opacity = opacity;
        }
        this.transform = transform;
        this.$nextTick(() => {
          this.timer = setTimeout(() => {
            this.animation = createAnimation(this.config, this);
            this.tranfromInit(false).step();
            this.animation.run();
            this.$emit("change", {
              detail: this.isShow
            });
          }, 20);
        });
      },
      // 关闭过度动画
      close(type) {
        if (!this.animation)
          return;
        this.tranfromInit(true).step().run(() => {
          this.isShow = false;
          this.animationData = null;
          this.animation = null;
          let { opacity, transform } = this.styleInit(false);
          this.opacity = opacity || 1;
          this.transform = transform;
          this.$emit("change", {
            detail: this.isShow
          });
        });
      },
      // 处理动画开始前的默认样式
      styleInit(type) {
        let styles = {
          transform: ""
        };
        let buildStyle = (type2, mode) => {
          if (mode === "fade") {
            styles.opacity = this.animationType(type2)[mode];
          } else {
            styles.transform += this.animationType(type2)[mode] + " ";
          }
        };
        if (typeof this.modeClass === "string") {
          buildStyle(type, this.modeClass);
        } else {
          this.modeClass.forEach((mode) => {
            buildStyle(type, mode);
          });
        }
        return styles;
      },
      // 处理内置组合动画
      tranfromInit(type) {
        let buildTranfrom = (type2, mode) => {
          let aniNum = null;
          if (mode === "fade") {
            aniNum = type2 ? 0 : 1;
          } else {
            aniNum = type2 ? "-100%" : "0";
            if (mode === "zoom-in") {
              aniNum = type2 ? 0.8 : 1;
            }
            if (mode === "zoom-out") {
              aniNum = type2 ? 1.2 : 1;
            }
            if (mode === "slide-right") {
              aniNum = type2 ? "100%" : "0";
            }
            if (mode === "slide-bottom") {
              aniNum = type2 ? "100%" : "0";
            }
          }
          this.animation[this.animationMode()[mode]](aniNum);
        };
        if (typeof this.modeClass === "string") {
          buildTranfrom(type, this.modeClass);
        } else {
          this.modeClass.forEach((mode) => {
            buildTranfrom(type, mode);
          });
        }
        return this.animation;
      },
      animationType(type) {
        return {
          fade: type ? 0 : 1,
          "slide-top": `translateY(${type ? "0" : "-100%"})`,
          "slide-right": `translateX(${type ? "0" : "100%"})`,
          "slide-bottom": `translateY(${type ? "0" : "100%"})`,
          "slide-left": `translateX(${type ? "0" : "-100%"})`,
          "zoom-in": `scaleX(${type ? 1 : 0.8}) scaleY(${type ? 1 : 0.8})`,
          "zoom-out": `scaleX(${type ? 1 : 1.2}) scaleY(${type ? 1 : 1.2})`
        };
      },
      // 内置动画类型与实际动画对应字典
      animationMode() {
        return {
          fade: "opacity",
          "slide-top": "translateY",
          "slide-right": "translateX",
          "slide-bottom": "translateY",
          "slide-left": "translateX",
          "zoom-in": "scale",
          "zoom-out": "scale"
        };
      },
      // 驼峰转中横线
      toLine(name) {
        return name.replace(/([A-Z])/g, "-$1").toLowerCase();
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.isShow ? ((0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)("view", {
      key: 0,
      ref: "ani",
      animation: $data.animationData,
      class: (0, import_vue3.normalizeClass)($props.customClass),
      style: (0, import_vue3.normalizeStyle)($options.transformStyles),
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args)),
      renderWhole: true
    }, [
      (0, import_vue3.renderSlot)(_ctx.$slots, "default")
    ], 14, ["animation"])) : (0, import_vue3.createCommentVNode)("v-if", true);
  }
  var __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "C:/Users/71018/Desktop/ic365/uni_modules/uni-transition/components/uni-transition/uni-transition.vue"]]);
  var _style_0$1 = { "uni-popup": { "": { "position": "fixed" }, ".top": { "top": 0 }, ".left": { "top": 0 }, ".right": { "top": 0 } }, "uni-popup__wrapper": { ".uni-popup ": { "position": "relative" }, ".uni-popup .left": { "paddingTop": 0, "flex": 1 }, ".uni-popup .right": { "paddingTop": 0, "flex": 1 } }, "fixforpc-top": { "": { "top": 0 } } };
  var _sfc_main$1 = {
    name: "uniPopup",
    components: {},
    emits: ["change", "maskClick"],
    props: {
      // 开启动画
      animation: {
        type: Boolean,
        default: true
      },
      // 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
      // message: 消息提示 ; dialog : 对话框
      type: {
        type: String,
        default: "center"
      },
      // maskClick
      isMaskClick: {
        type: Boolean,
        default: null
      },
      // TODO 2 个版本后废弃属性 ，使用 isMaskClick
      maskClick: {
        type: Boolean,
        default: null
      },
      backgroundColor: {
        type: String,
        default: "none"
      },
      safeArea: {
        type: Boolean,
        default: true
      },
      maskBackgroundColor: {
        type: String,
        default: "rgba(0, 0, 0, 0.4)"
      },
      borderRadius: {
        type: String
      }
    },
    watch: {
      /**
       * 监听type类型
       */
      type: {
        handler: function(type) {
          if (!this.config[type])
            return;
          this[this.config[type]](true);
        },
        immediate: true
      },
      isDesktop: {
        handler: function(newVal) {
          if (!this.config[newVal])
            return;
          this[this.config[this.type]](true);
        },
        immediate: true
      },
      /**
       * 监听遮罩是否可点击
       * @param {Object} val
       */
      maskClick: {
        handler: function(val) {
          this.mkclick = val;
        },
        immediate: true
      },
      isMaskClick: {
        handler: function(val) {
          this.mkclick = val;
        },
        immediate: true
      },
      // H5 下禁止底部滚动
      showPopup(show) {
      }
    },
    data() {
      return {
        duration: 300,
        ani: [],
        showPopup: false,
        showTrans: false,
        popupWidth: 0,
        popupHeight: 0,
        config: {
          top: "top",
          bottom: "bottom",
          center: "center",
          left: "left",
          right: "right",
          message: "top",
          dialog: "center",
          share: "bottom"
        },
        maskClass: {
          position: "fixed",
          bottom: 0,
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)"
        },
        transClass: {
          backgroundColor: "transparent",
          borderRadius: this.borderRadius || "0",
          position: "fixed",
          left: 0,
          right: 0
        },
        maskShow: true,
        mkclick: true,
        popupstyle: "top"
      };
    },
    computed: {
      getStyles() {
        let res = { backgroundColor: this.bg };
        if (this.borderRadius || "0") {
          res = Object.assign(res, { borderRadius: this.borderRadius });
        }
        return res;
      },
      isDesktop() {
        return this.popupWidth >= 500 && this.popupHeight >= 500;
      },
      bg() {
        if (this.backgroundColor === "" || this.backgroundColor === "none") {
          return "transparent";
        }
        return this.backgroundColor;
      }
    },
    mounted() {
      const fixSize = () => {
        const {
          windowWidth,
          windowHeight,
          windowTop,
          safeArea,
          screenHeight,
          safeAreaInsets
        } = uni.getSystemInfoSync();
        this.popupWidth = windowWidth;
        this.popupHeight = windowHeight + (windowTop || 0);
        if (safeArea && this.safeArea) {
          this.safeAreaInsets = safeAreaInsets.bottom;
        } else {
          this.safeAreaInsets = 0;
        }
      };
      fixSize();
    },
    // TODO vue3
    unmounted() {
      this.setH5Visible();
    },
    activated() {
      this.setH5Visible(!this.showPopup);
    },
    deactivated() {
      this.setH5Visible(true);
    },
    created() {
      if (this.isMaskClick === null && this.maskClick === null) {
        this.mkclick = true;
      } else {
        this.mkclick = this.isMaskClick !== null ? this.isMaskClick : this.maskClick;
      }
      if (this.animation) {
        this.duration = 300;
      } else {
        this.duration = 0;
      }
      this.messageChild = null;
      this.clearPropagation = false;
      this.maskClass.backgroundColor = this.maskBackgroundColor;
    },
    methods: {
      setH5Visible(visible = true) {
      },
      /**
       * 公用方法，不显示遮罩层
       */
      closeMask() {
        this.maskShow = false;
      },
      /**
       * 公用方法，遮罩层禁止点击
       */
      disableMask() {
        this.mkclick = false;
      },
      // TODO nvue 取消冒泡
      clear(e) {
        this.clearPropagation = true;
      },
      open(direction) {
        if (this.showPopup) {
          return;
        }
        let innerType = ["top", "center", "bottom", "left", "right", "message", "dialog", "share"];
        if (!(direction && innerType.indexOf(direction) !== -1)) {
          direction = this.type;
        }
        if (!this.config[direction]) {
          formatAppLog("error", "at uni_modules/uni-popup/components/uni-popup/uni-popup.vue:310", "\u7F3A\u5C11\u7C7B\u578B\uFF1A", direction);
          return;
        }
        this[this.config[direction]]();
        this.$emit("change", {
          show: true,
          type: direction
        });
      },
      close(type) {
        this.showTrans = false;
        this.$emit("change", {
          show: false,
          type: this.type
        });
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.showPopup = false;
        }, 300);
      },
      // TODO 处理冒泡事件，头条的冒泡事件有问题 ，先这样兼容
      touchstart() {
        this.clearPropagation = false;
      },
      onTap() {
        if (this.clearPropagation) {
          this.clearPropagation = false;
          return;
        }
        this.$emit("maskClick");
        if (!this.mkclick)
          return;
        this.close();
      },
      /**
       * 顶部弹出样式处理
       */
      top(type) {
        this.popupstyle = this.isDesktop ? "fixforpc-top" : "top";
        this.ani = ["slide-top"];
        this.transClass = {
          position: "fixed",
          left: 0,
          right: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPopup = true;
        this.showTrans = true;
        this.$nextTick(() => {
          this.showPoptrans();
          if (this.messageChild && this.type === "message") {
            this.messageChild.timerClose();
          }
        });
      },
      /**
       * 底部弹出样式处理
       */
      bottom(type) {
        this.popupstyle = "bottom";
        this.ani = ["slide-bottom"];
        this.transClass = {
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: this.safeAreaInsets + "px",
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      /**
       * 中间弹出样式处理
       */
      center(type) {
        this.popupstyle = "center";
        this.ani = ["zoom-out", "fade"];
        this.transClass = {
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      left(type) {
        this.popupstyle = "left";
        this.ani = ["slide-left"];
        this.transClass = {
          position: "fixed",
          left: 0,
          bottom: 0,
          top: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      right(type) {
        this.popupstyle = "right";
        this.ani = ["slide-right"];
        this.transClass = {
          position: "fixed",
          bottom: 0,
          right: 0,
          top: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPoptrans();
      },
      showPoptrans() {
        this.$nextTick(() => {
          this.showPopup = true;
          this.showTrans = true;
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_transition = resolveEasycom((0, import_vue3.resolveDynamicComponent)("uni-transition"), __easycom_0$2);
    return $data.showPopup ? ((0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)(
      "view",
      {
        key: 0,
        class: (0, import_vue3.normalizeClass)(["uni-popup", [$data.popupstyle, $options.isDesktop ? "fixforpc-z-index" : ""]]),
        renderWhole: true
      },
      [
        (0, import_vue3.createElementVNode)(
          "view",
          {
            onTouchstart: _cache[1] || (_cache[1] = (...args) => $options.touchstart && $options.touchstart(...args))
          },
          [
            $data.maskShow ? ((0, import_vue3.openBlock)(), (0, import_vue3.createBlock)(_component_uni_transition, {
              key: "1",
              name: "mask",
              "mode-class": "fade",
              styles: $data.maskClass,
              duration: $data.duration,
              show: $data.showTrans,
              onClick: $options.onTap
            }, null, 8, ["styles", "duration", "show", "onClick"])) : (0, import_vue3.createCommentVNode)("v-if", true),
            (0, import_vue3.createVNode)(_component_uni_transition, {
              key: "2",
              "mode-class": $data.ani,
              name: "content",
              styles: $data.transClass,
              duration: $data.duration,
              show: $data.showTrans,
              onClick: $options.onTap
            }, {
              default: (0, import_vue3.withCtx)(() => [
                (0, import_vue3.createElementVNode)(
                  "view",
                  {
                    class: (0, import_vue3.normalizeClass)(["uni-popup__wrapper", [$data.popupstyle]]),
                    style: (0, import_vue3.normalizeStyle)($options.getStyles),
                    onClick: _cache[0] || (_cache[0] = (...args) => $options.clear && $options.clear(...args))
                  },
                  [
                    (0, import_vue3.renderSlot)(_ctx.$slots, "default")
                  ],
                  6
                  /* CLASS, STYLE */
                )
              ]),
              _: 3
              /* FORWARDED */
            }, 8, ["mode-class", "styles", "duration", "show", "onClick"])
          ],
          32
          /* NEED_HYDRATION */
        )
      ],
      2
      /* CLASS */
    )) : (0, import_vue3.createCommentVNode)("v-if", true);
  }
  var __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["styles", [_style_0$1]], ["__file", "C:/Users/71018/Desktop/ic365/uni_modules/uni-popup/components/uni-popup/uni-popup.vue"]]);
  var _style_0 = { "common-page-head-view": { "": { "position": "relative", "top": 0 } }, "page-head": { "": { "zIndex": 999 } }, "reserve-seat": { "": { "height": "88rpx" } }, "common-page-head": { "": { "display": "flex", "paddingTop": 0, "paddingRight": 0, "paddingBottom": 0, "paddingLeft": 0, "position": "fixed", "top": 0, "width": 100, "backgroundColor": "#ffffff", "zIndex": 99 } }, "common-page-head-back": { ".common-page-head ": { "height": "88rpx", "flex": 1, "position": "relative", "minHeight": "2rpx" } }, "common-page-head-module": { ".common-page-head ": { "flex": 1, "position": "relative", "minHeight": "2rpx" } }, "common-page-head-title": { ".common-page-head ": { "flex": 4, "borderWidth": 0, "color": "#333333", "fontWeight": "700", "fontSize": "44rpx", "paddingBottom": 0.1, "background": 'url("/static/image/title_back.png") no-repeat bottom center/5.5rem' } }, "standard-title": { ".common-page-head ": { "fontSize": "36rpx", "color": "#000000", "fontWeight": "normal", "backgroundColor": "rgba(0,0,0,0)" } }, "page-head-back-icon": { ".common-page-head ": { "background": 'url("/static/icons/back_orange.png") no-repeat center/100% 100%' } }, "page-head-module-icon": { ".common-page-head ": { "width": "68rpx", "height": "68rpx" } }, "page-loading": { "": { "position": "fixed", "top": 0, "left": 0, "width": 100, "height": 100, "overflow": "hidden", "backgroundColor": "#ffffff", "zIndex": 1e4 } }, "become-member-window": { "": { "position": "fixed", "top": 0, "left": 0, "width": 100, "height": 100, "backgroundColor": "rgba(0,0,0,0.5)", "zIndex": 1e14 } }, "become-member-wrap": { ".become-member-window ": { "width": "608rpx", "height": "830rpx", "position": "absolute", "top": 0, "left": 0, "right": 0, "bottom": 0, "backgroundColor": "#ffffff", "borderRadius": "20rpx", "textAlign": "center" } }, "title": { ".become-member-window .become-member-wrap ": { "textAlign": "center", "lineHeight": "88rpx", "fontSize": "32rpx", "borderBottomWidth": "2rpx", "borderBottomStyle": "solid", "borderBottomColor": "#dfdfdf" } }, "qr-code": { ".become-member-window .become-member-wrap ": { "width": "400rpx", "height": "400rpx", "marginTop": "60rpx", "marginBottom": "60rpx" } }, "tips": { ".become-member-window .become-member-wrap ": { "fontSize": "30rpx", "color": "#ff0000" } }, "btn-wrap": { ".become-member-window .become-member-wrap ": { "position": "absolute", "bottom": 0, "height": "132rpx", "width": 100, "borderTopWidth": "2rpx", "borderTopStyle": "solid", "borderTopColor": "#dfdfdf" } }, "btn-close": { ".become-member-window .become-member-wrap .btn-wrap ": { "width": "390rpx", "marginTop": "20rpx", "marginBottom": "20rpx" } }, "popup-tips-wrap": { "": { "width": "610rpx", "backgroundColor": "#FFFFFF", "borderRadius": "12rpx" } }, "popup-tips-title": { ".popup-tips-wrap ": { "textAlign": "center", "fontSize": "32rpx", "color": "#000000", "backgroundColor": "#FFFAEE", "lineHeight": "88rpx" } }, "popup-tips-content": { ".popup-tips-wrap ": { "paddingTop": "62rpx", "paddingRight": "52rpx", "paddingBottom": "62rpx", "paddingLeft": "52rpx", "fontSize": "30rpx", "color": "#000000", "lineHeight": "44rpx" } }, "popup-tips-btn-wrap": { ".popup-tips-wrap ": { "boxShadow": "0px -4px 8px 0px rgba(0, 0, 0, 0.08)", "height": "72rpx", "paddingTop": "30rpx", "paddingRight": "48rpx", "paddingBottom": "30rpx", "paddingLeft": "48rpx", "display": "flex", "alignItems": "center", "justifyContent": "center" } }, "tips-btn": { ".popup-tips-wrap .popup-tips-btn-wrap ": { "verticalAlign": "middle", "flex": 1, "fontSize": "32rpx", "height": "64rpx", "lineHeight": "64rpx", "color": "#000000", "textAlign": "center", "borderRadius": "8rpx" } }, "border": { ".popup-tips-wrap .popup-tips-btn-wrap ": { "verticalAlign": "middle", "height": "46rpx", "width": "2rpx", "marginTop": "0rpx", "marginRight": "32rpx", "marginBottom": "0rpx", "marginLeft": "32rpx", "backgroundColor": "#F2F2F2" } } };
  var _sfc_main2 = {
    name: "page-head",
    props: {
      clickModule: {
        type: Function,
        default: () => {
        }
      },
      isHide: {
        default: false
      },
      title: {
        // type: String,
        default: ""
      },
      background: {
        default: "#fff"
      },
      // 是否显示返回按钮
      isBack: {
        default: false
      },
      // 是否显示最右边功能模块
      isModule: {
        default: false
      },
      moduleIcon: {
        default: "/static/icons/nav-bar.png"
      },
      systemTaskbar: {
        default: true
      },
      standardTitle: {
        default: false
      },
      becomeMemberSize: {
        default: 1
      }
    },
    data() {
      return {
        taskbarHeight: 0,
        tipsData: {
          type: "center",
          title: "\u63D0\u793A",
          content: "",
          success: () => {
            this.closePopupTips();
          }
        }
      };
    },
    mounted() {
      this.systemTaskbar ? this.taskbarHeight = uni.getSystemInfoSync().statusBarHeight * 2 + "rpx" : this.taskbarHeight = "0rem";
    },
    methods: {
      clickBack() {
        this.$store.state.isLoading = true;
        uni.navigateBack({
          animationType: "none",
          animationDuration: 1e3
        });
      },
      openBecomeMember() {
        this.$refs.becomeMember.open();
      },
      closeBecomeMember() {
        this.$store.state.officialAccountWindow = false;
        this.$refs.becomeMember.close();
      },
      openPopupTips(data) {
        this.$refs.popupTips.open();
        formatAppLog("log", "at components/page-head/page-head.vue:137", "\u54A8\u8BE2\u5F39\u7A97\u5E26\u6765\u7684data:", data);
        this.tipsData = {
          type: "center",
          title: "\u63D0\u793A",
          content: "",
          success: () => {
            this.closePopupTips();
          }
        };
        this.tipsData = __spreadValues(__spreadValues({}, this.tipsData), data);
        formatAppLog("log", "at components/page-head/page-head.vue:147", "\u5408\u5E76\u540E\u7684data", this.tipsData);
      },
      closePopupTips() {
        this.$refs.popupTips.close();
      }
    }
  };
  function _sfc_render2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_p = (0, import_vue3.resolveComponent)("p");
    const _component_button = (0, import_vue3.resolveComponent)("button");
    const _component_uni_popup = resolveEasycom((0, import_vue3.resolveDynamicComponent)("uni-popup"), __easycom_0$1);
    return (0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)(
      import_vue3.Fragment,
      null,
      [
        (0, import_vue3.createElementVNode)(
          "view",
          {
            class: "common-page-head-view",
            style: (0, import_vue3.normalizeStyle)({ paddingTop: $data.taskbarHeight })
          },
          [
            !$props.isHide ? ((0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)("view", {
              key: 0,
              class: "reserve-seat"
            })) : (0, import_vue3.createCommentVNode)("v-if", true),
            !$props.isHide ? ((0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)(
              "view",
              {
                key: 1,
                class: "common-page-head",
                style: (0, import_vue3.normalizeStyle)({ background: $props.background, paddingTop: $data.taskbarHeight })
              },
              [
                (0, import_vue3.createElementVNode)("view", { class: "common-page-head-back" }, [
                  $props.isBack ? ((0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)("view", {
                    key: 0,
                    class: "page-head-back-icon",
                    onClick: _cache[0] || (_cache[0] = ($event) => $options.clickBack(_ctx.backData))
                  })) : (0, import_vue3.createCommentVNode)("v-if", true)
                ]),
                (0, import_vue3.createElementVNode)(
                  "view",
                  {
                    class: (0, import_vue3.normalizeClass)(["common-page-head-title", $props.standardTitle ? "standard-title" : ""]),
                    style: (0, import_vue3.normalizeStyle)(!$props.title && "height:0;opacity: 0;")
                  },
                  [
                    (0, import_vue3.createElementVNode)(
                      "u-text",
                      null,
                      (0, import_vue3.toDisplayString)($props.title),
                      1
                      /* TEXT */
                    )
                  ],
                  6
                  /* CLASS, STYLE */
                ),
                (0, import_vue3.createElementVNode)(
                  "view",
                  {
                    class: "common-page-head-module",
                    style: (0, import_vue3.normalizeStyle)(!$props.isModule && "height:0;opacity: 0;")
                  },
                  [
                    $props.isModule ? ((0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)("u-image", {
                      key: 0,
                      src: $props.moduleIcon,
                      mode: "",
                      onClick: _cache[1] || (_cache[1] = (...args) => $props.clickModule && $props.clickModule(...args))
                    }, null, 8, ["src"])) : (0, import_vue3.createCommentVNode)("v-if", true)
                  ],
                  4
                  /* STYLE */
                )
              ],
              4
              /* STYLE */
            )) : (0, import_vue3.createCommentVNode)("v-if", true)
          ],
          4
          /* STYLE */
        ),
        (0, import_vue3.createCommentVNode)(' <view class="become-member-window" @touchstart="touchstart" v-if="$store.state.officialAccountWindow">\n		<view class="become-member-wrap">\n			<view class="title">\u5173\u6CE8\u516C\u4F17\u53F7</view>\n			<image class="qr-code" :src="$store.state.officialAccountQRCode"></image>\n			<p class="tips">\u626B\u7801\u5173\u6CE8 \u201C\u5B66\u517B\u7F51\u201D \u516C\u4F17\u53F7\u5F00\u901A\u4F1A\u5458</p>\n			<view class="btn-wrap">\n				<button class="btn-close" @click.stop="closeBecomeMember">\u5173\u95ED</button>\n			</view>\n		</view>\n	</view> '),
        (0, import_vue3.createVNode)(
          _component_uni_popup,
          {
            ref: "becomeMember",
            "mask-click": false,
            type: "center"
          },
          {
            default: (0, import_vue3.withCtx)(() => [
              (0, import_vue3.createElementVNode)("view", { class: "become-member-window" }, [
                (0, import_vue3.createElementVNode)(
                  "view",
                  {
                    class: "become-member-wrap",
                    style: (0, import_vue3.normalizeStyle)("transform: scale(" + $props.becomeMemberSize + ");")
                  },
                  [
                    (0, import_vue3.createElementVNode)("view", { class: "title" }, [
                      (0, import_vue3.createElementVNode)("u-text", null, "\u5173\u6CE8\u516C\u4F17\u53F7")
                    ]),
                    (0, import_vue3.createElementVNode)("u-image", {
                      class: "qr-code",
                      src: _ctx.$store.state.officialAccountQRCode
                    }, null, 8, ["src"]),
                    (0, import_vue3.createVNode)(_component_p, { class: "tips" }, {
                      default: (0, import_vue3.withCtx)(() => [
                        (0, import_vue3.createElementVNode)("u-text", null, "\u626B\u7801\u5173\u6CE8 \u201C\u5B66\u517B\u7F51\u201D \u516C\u4F17\u53F7\u5F00\u901A\u4F1A\u5458")
                      ]),
                      _: 1
                      /* STABLE */
                    }),
                    (0, import_vue3.createElementVNode)("view", { class: "btn-wrap" }, [
                      (0, import_vue3.createVNode)(_component_button, {
                        class: "btn-close",
                        onClick: (0, import_vue3.withModifiers)($options.closeBecomeMember, ["stop"])
                      }, {
                        default: (0, import_vue3.withCtx)(() => [
                          (0, import_vue3.createTextVNode)("\u5173\u95ED")
                        ]),
                        _: 1
                        /* STABLE */
                      }, 8, ["onClick"])
                    ])
                  ],
                  4
                  /* STYLE */
                )
              ])
            ]),
            _: 1
            /* STABLE */
          },
          512
          /* NEED_PATCH */
        ),
        (0, import_vue3.createCommentVNode)(" \u8BE2\u95EE\u5F39\u7A97 "),
        (0, import_vue3.createCommentVNode)(" tipsDatas\u6570\u636E\u63A7\u5236\uFF0C\u4ECEopenPopupTips\u4F20\u53C2 "),
        (0, import_vue3.createCommentVNode)(" \u5173\u95ED\u9700\u8981\u5728 \u7236\u7EA7\u9875\u9762\u8C03\u7528this.$refs.pageHead.closePopupTips()\u5173\u95ED "),
        (0, import_vue3.createVNode)(_component_uni_popup, {
          ref: "popupTips",
          "mask-click": false,
          type: $data.tipsData.type
        }, {
          default: (0, import_vue3.withCtx)(() => [
            (0, import_vue3.createElementVNode)("view", { class: "popup-tips-wrap" }, [
              $data.tipsData.title ? ((0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)("view", {
                key: 0,
                class: "popup-tips-title"
              }, [
                (0, import_vue3.createElementVNode)(
                  "u-text",
                  null,
                  (0, import_vue3.toDisplayString)($data.tipsData.title),
                  1
                  /* TEXT */
                )
              ])) : (0, import_vue3.createCommentVNode)("v-if", true),
              (0, import_vue3.createElementVNode)("view", { class: "popup-tips-content" }, [
                (0, import_vue3.createElementVNode)(
                  "u-text",
                  null,
                  (0, import_vue3.toDisplayString)($data.tipsData.content),
                  1
                  /* TEXT */
                )
              ]),
              (0, import_vue3.createElementVNode)("view", { class: "popup-tips-btn-wrap" }, [
                (0, import_vue3.createElementVNode)("view", {
                  class: "tips-btn",
                  onClick: _cache[2] || (_cache[2] = (0, import_vue3.withModifiers)((...args) => $options.closePopupTips && $options.closePopupTips(...args), ["stop"]))
                }, [
                  (0, import_vue3.createElementVNode)("u-text", null, "\u53D6\u6D88")
                ]),
                (0, import_vue3.createElementVNode)("view", { class: "border" }),
                (0, import_vue3.createElementVNode)("view", {
                  class: "tips-btn",
                  onClick: _cache[3] || (_cache[3] = (0, import_vue3.withModifiers)((...args) => $data.tipsData.success && $data.tipsData.success(...args), ["stop"]))
                }, [
                  (0, import_vue3.createElementVNode)("u-text", null, "\u786E\u5B9A")
                ])
              ])
            ])
          ]),
          _: 1
          /* STABLE */
        }, 8, ["type"])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  var __easycom_02 = /* @__PURE__ */ _export_sfc(_sfc_main2, [["render", _sfc_render2], ["styles", [_style_0]], ["__file", "C:/Users/71018/Desktop/ic365/components/page-head/page-head.vue"]]);

  // C:/Users/71018/Desktop/ic365/unpackage/dist/dev/.nvue/pages/tabBar/API/API.js
  var _style_0$12 = { "button": { "": { "marginTop": "30rpx", "marginLeft": 0, "marginRight": 0 } }, "btn-area": { "": { "paddingTop": "30rpx" } } };
  var _sfc_main$12 = {
    data() {
      return {
        title: "tababr",
        hasSetTabBarBadge: false,
        hasShownTabBarRedDot: false,
        hasCustomedStyle: false,
        hasCustomedItem: false,
        hasHiddenTabBar: false
      };
    },
    destroyed() {
      if (this.hasSetTabBarBadge) {
        uni.removeTabBarBadge({
          index: 1
        });
      }
      if (this.hasShownTabBarRedDot) {
        uni.hideTabBarRedDot({
          index: 1
        });
      }
      if (this.hasHiddenTabBar) {
        uni.showTabBar();
      }
      if (this.hasCustomedStyle) {
        uni.setTabBarStyle({
          color: "#7A7E83",
          selectedColor: "#007AFF",
          backgroundColor: "#F8F8F8",
          borderStyle: "black"
        });
      }
      if (this.hasCustomedItem) {
        let tabBarOptions = {
          index: 1,
          text: "\u63A5\u53E3",
          iconPath: "/static/api.png",
          selectedIconPath: "/static/apiHL.png"
        };
        uni.setTabBarItem(tabBarOptions);
      }
    },
    methods: {
      navigateBack() {
        this.$emit("unmount");
      },
      setTabBarBadge() {
        if (this.hasShownTabBarRedDot) {
          uni.hideTabBarRedDot({
            index: 1
          });
          this.hasShownTabBarRedDot = !this.hasShownTabBarRedDot;
        }
        if (!this.hasSetTabBarBadge) {
          uni.setTabBarBadge({
            index: 1,
            text: "1"
          });
        } else {
          uni.removeTabBarBadge({
            index: 1
          });
        }
        this.hasSetTabBarBadge = !this.hasSetTabBarBadge;
      },
      showTabBarRedDot() {
        if (this.hasSetTabBarBadge) {
          uni.removeTabBarBadge({
            index: 1
          });
          this.hasSetTabBarBadge = !this.hasSetTabBarBadge;
        }
        if (!this.hasShownTabBarRedDot) {
          uni.showTabBarRedDot({
            index: 1
          });
        } else {
          uni.hideTabBarRedDot({
            index: 1
          });
        }
        this.hasShownTabBarRedDot = !this.hasShownTabBarRedDot;
      },
      hideTabBar() {
        if (!this.hasHiddenTabBar) {
          uni.hideTabBar();
        } else {
          uni.showTabBar();
        }
        this.hasHiddenTabBar = !this.hasHiddenTabBar;
      },
      customStyle() {
        if (this.hasCustomedStyle) {
          uni.setTabBarStyle({
            color: "#7A7E83",
            selectedColor: "#007AFF",
            backgroundColor: "#F8F8F8",
            borderStyle: "black"
          });
        } else {
          uni.setTabBarStyle({
            color: "#FFF",
            selectedColor: "#007AFF",
            backgroundColor: "#000000",
            borderStyle: "black"
          });
        }
        this.hasCustomedStyle = !this.hasCustomedStyle;
      },
      customItem() {
        let tabBarOptions = {
          index: 1,
          text: "\u63A5\u53E3",
          iconPath: "/static/api.png",
          selectedIconPath: "/static/apiHL.png"
        };
        if (this.hasCustomedItem) {
          uni.setTabBarItem(tabBarOptions);
        } else {
          tabBarOptions.text = "API";
          uni.setTabBarItem(tabBarOptions);
        }
        this.hasCustomedItem = !this.hasCustomedItem;
      }
    }
  };
  function _sfc_render$12(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_page_head = resolveEasycom((0, import_vue4.resolveDynamicComponent)("page-head"), __easycom_02);
    const _component_button = (0, import_vue4.resolveComponent)("button");
    return (0, import_vue4.openBlock)(), (0, import_vue4.createElementBlock)("view", {
      class: "uni-padding-wrap",
      renderWhole: true
    }, [
      (0, import_vue4.createVNode)(_component_page_head, { title: $data.title }, null, 8, ["title"]),
      (0, import_vue4.createVNode)(_component_button, {
        class: "button",
        onClick: $options.setTabBarBadge
      }, {
        default: (0, import_vue4.withCtx)(() => [
          (0, import_vue4.createTextVNode)(
            (0, import_vue4.toDisplayString)(!$data.hasSetTabBarBadge ? "\u8BBE\u7F6Etab\u5FBD\u6807" : "\u79FB\u9664tab\u5FBD\u6807"),
            1
            /* TEXT */
          )
        ]),
        _: 1
        /* STABLE */
      }, 8, ["onClick"]),
      (0, import_vue4.createVNode)(_component_button, {
        class: "button",
        onClick: $options.showTabBarRedDot
      }, {
        default: (0, import_vue4.withCtx)(() => [
          (0, import_vue4.createTextVNode)(
            (0, import_vue4.toDisplayString)(!$data.hasShownTabBarRedDot ? "\u663E\u793A\u7EA2\u70B9" : "\u79FB\u9664\u7EA2\u70B9"),
            1
            /* TEXT */
          )
        ]),
        _: 1
        /* STABLE */
      }, 8, ["onClick"]),
      (0, import_vue4.createVNode)(_component_button, {
        class: "button",
        onClick: $options.customStyle
      }, {
        default: (0, import_vue4.withCtx)(() => [
          (0, import_vue4.createTextVNode)(
            (0, import_vue4.toDisplayString)(!$data.hasCustomedStyle ? "\u81EA\u5B9A\u4E49Tab\u6837\u5F0F" : "\u79FB\u9664\u81EA\u5B9A\u4E49\u6837\u5F0F"),
            1
            /* TEXT */
          )
        ]),
        _: 1
        /* STABLE */
      }, 8, ["onClick"]),
      (0, import_vue4.createVNode)(_component_button, {
        class: "button",
        onClick: $options.customItem
      }, {
        default: (0, import_vue4.withCtx)(() => [
          (0, import_vue4.createTextVNode)(
            (0, import_vue4.toDisplayString)(!$data.hasCustomedItem ? "\u81EA\u5B9A\u4E49Tab\u4FE1\u606F" : "\u79FB\u9664\u81EA\u5B9A\u4E49\u4FE1\u606F"),
            1
            /* TEXT */
          )
        ]),
        _: 1
        /* STABLE */
      }, 8, ["onClick"]),
      (0, import_vue4.createVNode)(_component_button, {
        class: "button",
        onClick: $options.hideTabBar
      }, {
        default: (0, import_vue4.withCtx)(() => [
          (0, import_vue4.createTextVNode)(
            (0, import_vue4.toDisplayString)(!$data.hasHiddenTabBar ? "\u9690\u85CFTabBar" : "\u663E\u793ATabBar"),
            1
            /* TEXT */
          )
        ]),
        _: 1
        /* STABLE */
      }, 8, ["onClick"]),
      (0, import_vue4.createElementVNode)("view", { class: "btn-area" }, [
        (0, import_vue4.createVNode)(_component_button, {
          class: "button",
          type: "primary",
          onClick: $options.navigateBack
        }, {
          default: (0, import_vue4.withCtx)(() => [
            (0, import_vue4.createTextVNode)("\u8FD4\u56DE\u4E0A\u4E00\u7EA7")
          ]),
          _: 1
          /* STABLE */
        }, 8, ["onClick"])
      ])
    ]);
  }
  var setTabBar = /* @__PURE__ */ _export_sfc(_sfc_main$12, [["render", _sfc_render$12], ["styles", [_style_0$12]], ["__file", "C:/Users/71018/Desktop/ic365/components/api-set-tabbar.nvue"]]);
  var _imports_0 = "/static/apiIndex.png";
  var _style_02 = { "uni-icon": { "": { "fontFamily": "uniicons", "fontWeight": "normal" } }, "uni-container": { "": { "paddingTop": 15, "paddingRight": 15, "paddingBottom": 15, "paddingLeft": 15, "backgroundColor": "#f8f8f8" } }, "uni-header-logo": { "": { "paddingTop": 15, "paddingRight": 15, "paddingBottom": 15, "paddingLeft": 15, "flexDirection": "column", "justifyContent": "center", "alignItems": "center", "marginTop": "10rpx" } }, "uni-header-image": { "": { "width": 80, "height": 80 } }, "uni-hello-text": { "": { "marginBottom": 20 } }, "hello-text": { "": { "color": "#7A7E83", "fontSize": 14, "lineHeight": 20 } }, "hello-link": { "": { "color": "#7A7E83", "fontSize": 14, "lineHeight": 20 } }, "uni-panel": { "": { "marginBottom": 12 } }, "uni-panel-h": { "": { "backgroundColor": "#ffffff", "!flexDirection": "row", "!alignItems": "center", "paddingTop": 12, "paddingRight": 12, "paddingBottom": 12, "paddingLeft": 12 } }, "uni-panel-h-on": { "": { "backgroundColor": "#f0f0f0" } }, "uni-panel-text": { "": { "flex": 1, "color": "#000000", "fontSize": 14, "fontWeight": "normal" } }, "uni-panel-icon": { "": { "marginLeft": 15, "color": "#999999", "fontSize": 14, "fontWeight": "normal", "transform": "rotate(0deg)", "transitionDuration": 0, "transitionProperty": "transform" } }, "uni-panel-icon-on": { "": { "transform": "rotate(180deg)" } }, "uni-navigate-item": { "": { "flexDirection": "row", "alignItems": "center", "backgroundColor": "#FFFFFF", "borderTopStyle": "solid", "borderTopColor": "#f0f0f0", "borderTopWidth": 1, "paddingTop": 12, "paddingRight": 12, "paddingBottom": 12, "paddingLeft": 12, "backgroundColor:active": "#f8f8f8" } }, "uni-navigate-text": { "": { "flex": 1, "color": "#000000", "fontSize": 14, "fontWeight": "normal" } }, "uni-navigate-icon": { "": { "marginLeft": 15, "color": "#999999", "fontSize": 14, "fontWeight": "normal" } }, "@TRANSITION": { "uni-panel-icon": { "duration": 0, "property": "transform" } } };
  var _sfc_main3 = {
    components: {
      setTabBar
    },
    props: {
      hasLeftWin: {
        type: Boolean
      },
      leftWinActive: {
        type: String
      }
    },
    data() {
      let mediaPages = [
        {
          name: "\u56FE\u7247",
          url: "image"
        },
        {
          name: "\u97F3\u9891",
          url: "inner-audio"
        },
        {
          name: "\u5F55\u97F3",
          url: "voice"
        },
        {
          name: "\u80CC\u666F\u97F3\u9891",
          url: "background-audio"
        },
        {
          name: "\u89C6\u9891",
          url: "video"
        },
        {
          name: "\u6587\u4EF6",
          url: "file"
        },
        {
          name: "\u4FDD\u5B58\u5A92\u4F53\u5230\u672C\u5730",
          url: "save-media"
        }
      ];
      const list = [
        {
          id: "page",
          name: "\u754C\u9762",
          open: false,
          pages: [
            {
              name: "\u8BBE\u7F6E\u5BFC\u822A\u6761",
              url: "set-navigation-bar-title"
            },
            {
              name: "\u539F\u751F\u5B50\u7A97\u4F53",
              url: "subnvue"
            },
            {
              name: "\u9875\u9762\u8DF3\u8F6C",
              url: "navigator"
            },
            {
              name: "\u8BBE\u7F6ETabBar",
              url: "set-tabbar"
            },
            {
              name: "\u4E0B\u62C9\u5237\u65B0",
              url: "pull-down-refresh"
            },
            {
              name: "\u521B\u5EFA\u52A8\u753B",
              url: "animation"
            },
            {
              name: "\u521B\u5EFA\u7ED8\u753B",
              url: "canvas"
            },
            {
              name: "\u8282\u70B9\u4FE1\u606F",
              url: "get-node-info"
            },
            {
              name: "\u8282\u70B9\u5E03\u5C40\u4EA4\u4E92\u72B6\u6001",
              url: "intersection-observer"
            },
            {
              name: "\u663E\u793A\u64CD\u4F5C\u83DC\u5355",
              url: "action-sheet"
            },
            {
              name: "\u663E\u793A\u6A21\u6001\u5F39\u7A97",
              url: "modal"
            },
            {
              name: "\u663E\u793A\u52A0\u8F7D\u63D0\u793A\u6846",
              url: "show-loading"
            },
            {
              name: "\u663E\u793A\u6D88\u606F\u63D0\u793A\u6846",
              url: "toast"
            }
          ]
        },
        {
          id: "device",
          name: "\u8BBE\u5907",
          open: false,
          pages: [
            {
              name: "\u83B7\u53D6\u8BBE\u5907\u7F51\u7EDC\u72B6\u6001",
              url: "get-network-type"
            },
            {
              name: "\u83B7\u53D6\u8BBE\u5907\u7CFB\u7EDF\u4FE1\u606F",
              url: "get-system-info"
            },
            {
              name: "\u6253\u7535\u8BDD",
              url: "make-phone-call"
            },
            {
              name: "\u9707\u52A8",
              url: "vibrate"
            },
            {
              name: "\u6DFB\u52A0\u624B\u673A\u8054\u7CFB\u4EBA",
              url: "add-phone-contact"
            },
            {
              name: "\u626B\u7801",
              url: "scan-code"
            },
            {
              name: "\u526A\u8D34\u677F",
              url: "clipboard"
            },
            {
              name: "\u5C4F\u5E55\u4EAE\u5EA6",
              url: "brightness"
            },
            {
              name: "\u84DD\u7259",
              url: "bluetooth"
            },
            {
              name: "\u751F\u7269\u8BA4\u8BC1",
              url: "soter"
            },
            {
              name: "iBeacon",
              url: "ibeacon"
            },
            {
              name: "\u76D1\u542C\u52A0\u901F\u5EA6\u4F20\u611F\u5668",
              url: "on-accelerometer-change"
            },
            {
              name: "\u76D1\u542C\u7F57\u76D8\u6570\u636E",
              url: "on-compass-change"
            },
            {
              name: "\u76D1\u542C\u8DDD\u79BB\u4F20\u611F\u5668",
              url: "/platforms/app-plus/proximity/proximity"
            },
            {
              name: "\u76D1\u542C\u65B9\u5411\u4F20\u611F\u5668",
              url: "/platforms/app-plus/orientation/orientation"
            }
          ]
        },
        {
          id: "network",
          name: "\u7F51\u7EDC",
          open: false,
          pages: [
            {
              name: "\u53D1\u8D77\u4E00\u4E2A\u8BF7\u6C42",
              url: "request"
            },
            {
              name: "\u4E0A\u4F20\u6587\u4EF6",
              url: "upload-file"
            },
            {
              name: "\u4E0B\u8F7D\u6587\u4EF6",
              url: "download-file"
            }
          ]
        },
        {
          id: "websocket",
          name: "websocket",
          open: false,
          pages: [
            {
              name: "socketTask",
              url: "websocket-socketTask"
            },
            {
              name: "\u5168\u5C40websocket",
              url: "websocket-global"
            }
          ]
        },
        {
          id: "media",
          name: "\u5A92\u4F53",
          open: false,
          pages: mediaPages
        },
        {
          id: "location",
          name: "\u4F4D\u7F6E",
          open: false,
          pages: [
            {
              name: "\u83B7\u53D6\u5F53\u524D\u4F4D\u7F6E",
              url: "get-location"
            },
            {
              name: "\u4F7F\u7528\u5730\u56FE\u67E5\u770B\u4F4D\u7F6E",
              url: "open-location"
            },
            {
              name: "\u4F7F\u7528\u5730\u56FE\u9009\u62E9\u4F4D\u7F6E",
              url: "choose-location"
            },
            {
              name: "\u5730\u56FE\u63A7\u5236",
              url: "map"
            },
            {
              name: "\u5730\u56FE\u641C\u7D22",
              url: "map-search"
            }
          ]
        },
        {
          id: "storage",
          name: "\u6570\u636E",
          open: false,
          pages: [
            {
              name: "\u6570\u636E\u5B58\u50A8\uFF08key-value\uFF09",
              url: "storage"
            },
            {
              name: "SQLite",
              url: "sqlite"
            }
          ]
        },
        {
          url: "rewarded-video-ad",
          name: "\u6FC0\u52B1\u89C6\u9891\u5E7F\u544A",
          open: false
        },
        {
          url: "full-screen-video-ad",
          name: "\u5168\u5C4F\u89C6\u9891\u5E7F\u544A",
          open: false
        },
        {
          id: "login",
          name: "\u767B\u5F55",
          open: false,
          pages: [
            {
              name: "\u767B\u5F55",
              url: "login"
            },
            {
              name: "\u83B7\u53D6\u7528\u6237\u4FE1\u606F",
              url: "get-user-info"
            }
          ]
        },
        {
          id: "share",
          name: "\u5206\u4EAB",
          open: false,
          pages: [{
            name: "\u5206\u4EAB",
            url: "share"
          }]
        },
        {
          id: "payment",
          name: "\u652F\u4ED8",
          open: false,
          pages: [{
            name: "\u53D1\u8D77\u652F\u4ED8",
            url: "request-payment"
          }]
        },
        {
          id: "speech",
          name: "\u8BED\u97F3",
          open: false,
          pages: [{
            name: "\u8BED\u97F3\u8BC6\u522B",
            url: "/platforms/app-plus/speech/speech"
          }]
        },
        {
          id: "push",
          name: "\u63A8\u9001",
          open: false,
          pages: [{
            name: "\u63A8\u9001",
            url: "/platforms/app-plus/push/push"
          }]
        }
      ];
      return {
        showSetTabBarPage: false,
        list,
        notForPc: [{
          name: "\u8BBE\u7F6ETabBar",
          url: "set-tabbar"
        }]
      };
    },
    onShareAppMessage() {
      return {
        title: "\u6B22\u8FCE\u4F53\u9A8Cuni-app",
        path: "/pages/tabBar/API/API"
      };
    },
    onNavigationBarButtonTap(e) {
    },
    onLoad() {
    },
    onReady() {
    },
    onShow() {
      this.navigateFlag = false;
      this.leaveSetTabBarPage();
    },
    onHide() {
      this.leaveSetTabBarPage();
    },
    methods: {
      triggerCollapse(e, id) {
        if (!this.list[e].pages) {
          this.goDetailPage("", this.list[e].url);
          return;
        }
        for (var i = 0; i < this.list.length; ++i) {
          if (e === i) {
            this.list[i].open = !this.list[i].open;
          } else {
            this.list[i].open = false;
          }
        }
      },
      goDetailPage(panel, e) {
        if (e === "set-tabbar") {
          this.showSetTabBarPage = true;
          return;
        }
        let url = ~e.indexOf("platform") ? e : "/pages/API/" + e + "/" + e;
        if (this.hasLeftWin) {
          uni.reLaunch({
            url
          });
        } else {
          uni.navigateTo({
            url
          });
        }
      },
      leaveSetTabBarPage() {
        this.showSetTabBarPage = false;
      }
    }
  };
  function _sfc_render3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_set_tab_bar = (0, import_vue4.resolveComponent)("set-tab-bar");
    const _component_u_link = resolveEasycom((0, import_vue4.resolveDynamicComponent)("u-link"), __easycom_0);
    return (0, import_vue4.openBlock)(), (0, import_vue4.createElementBlock)("scroll-view", {
      scrollY: true,
      showScrollbar: true,
      enableBackToTop: true,
      bubble: "true",
      style: { flexDirection: "column" }
    }, [
      (0, import_vue4.createElementVNode)("view", { class: "uni-container" }, [
        $data.showSetTabBarPage ? ((0, import_vue4.openBlock)(), (0, import_vue4.createBlock)(_component_set_tab_bar, {
          key: 0,
          onUnmount: $options.leaveSetTabBarPage
        }, null, 8, ["onUnmount"])) : ((0, import_vue4.openBlock)(), (0, import_vue4.createElementBlock)(
          import_vue4.Fragment,
          { key: 1 },
          [
            !$props.hasLeftWin ? ((0, import_vue4.openBlock)(), (0, import_vue4.createElementBlock)("view", {
              key: 0,
              class: "uni-header-logo"
            }, [
              (0, import_vue4.createElementVNode)("u-image", {
                class: "uni-header-image",
                src: _imports_0
              })
            ])) : (0, import_vue4.createCommentVNode)("v-if", true),
            !$props.hasLeftWin ? ((0, import_vue4.openBlock)(), (0, import_vue4.createElementBlock)("view", {
              key: 1,
              class: "uni-hello-text"
            }, [
              (0, import_vue4.createElementVNode)("u-text", { class: "hello-text" }, "\u4EE5\u4E0B\u5C06\u6F14\u793Auni-app\u63A5\u53E3\u80FD\u529B\uFF0C\u8BE6\u7EC6\u6587\u6863\u89C1\uFF1A"),
              (0, import_vue4.createVNode)(_component_u_link, {
                class: "hello-link",
                href: "https://uniapp.dcloud.io/api/",
                text: "https://uniapp.dcloud.io/api/",
                inWhiteList: true
              }, null, 8, ["href", "text"])
            ])) : (0, import_vue4.createCommentVNode)("v-if", true),
            ((0, import_vue4.openBlock)(true), (0, import_vue4.createElementBlock)(
              import_vue4.Fragment,
              null,
              (0, import_vue4.renderList)($data.list, (item, index) => {
                return (0, import_vue4.openBlock)(), (0, import_vue4.createElementBlock)("view", {
                  class: "uni-panel",
                  key: item.id
                }, [
                  (0, import_vue4.createElementVNode)("view", {
                    class: (0, import_vue4.normalizeClass)(["uni-panel-h", item.open ? "uni-panel-h-on" : ""]),
                    onClick: ($event) => $options.triggerCollapse(index, item.id)
                  }, [
                    (0, import_vue4.createElementVNode)(
                      "u-text",
                      { class: "uni-panel-text" },
                      (0, import_vue4.toDisplayString)(item.name),
                      1
                      /* TEXT */
                    ),
                    (0, import_vue4.createElementVNode)(
                      "u-text",
                      {
                        class: (0, import_vue4.normalizeClass)(["uni-panel-icon uni-icon", item.open ? "uni-panel-icon-on" : ""])
                      },
                      (0, import_vue4.toDisplayString)(item.pages ? "\uE581" : "\uE470"),
                      3
                      /* TEXT, CLASS */
                    )
                  ], 10, ["onClick"]),
                  item.open ? ((0, import_vue4.openBlock)(), (0, import_vue4.createElementBlock)("view", {
                    key: 0,
                    class: "uni-panel-c"
                  }, [
                    ((0, import_vue4.openBlock)(true), (0, import_vue4.createElementBlock)(
                      import_vue4.Fragment,
                      null,
                      (0, import_vue4.renderList)(item.pages, (item2, key) => {
                        return (0, import_vue4.openBlock)(), (0, import_vue4.createElementBlock)("view", {
                          class: (0, import_vue4.normalizeClass)([{ "left-win-active": $props.leftWinActive === item2.url && $props.hasLeftWin, "pc-hide": item2.name === "\u8BBE\u7F6ETabBar" && $props.hasLeftWin }, "uni-navigate-item"]),
                          key,
                          url: item.url,
                          onClick: ($event) => $options.goDetailPage(item.id, item2.url)
                        }, [
                          (0, import_vue4.createElementVNode)(
                            "u-text",
                            { class: "uni-navigate-text" },
                            (0, import_vue4.toDisplayString)(item2.name ? item2.name : item2),
                            1
                            /* TEXT */
                          ),
                          (0, import_vue4.createElementVNode)("u-text", { class: "uni-navigate-icon uni-icon" }, "\uE470")
                        ], 10, ["url", "onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])) : (0, import_vue4.createCommentVNode)("v-if", true)
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          64
          /* STABLE_FRAGMENT */
        ))
      ])
    ]);
  }
  var API = /* @__PURE__ */ _export_sfc(_sfc_main3, [["render", _sfc_render3], ["styles", [_style_02]], ["__file", "C:/Users/71018/Desktop/ic365/pages/tabBar/API/API.nvue"]]);

  // <stdin>
  var webview = plus.webview.currentWebview();
  if (webview) {
    const __pageId = parseInt(webview.id);
    const __pagePath = "pages/tabBar/API/API";
    let __pageQuery = {};
    try {
      __pageQuery = JSON.parse(webview.__query__);
    } catch (e) {
    }
    API.mpType = "page";
    const app = Vue.createPageApp(API, { $store: getApp({ allowDefault: true }).$store, __pageId, __pagePath, __pageQuery });
    app.provide("__globalStyles", Vue.useCssStyles([...__uniConfig.styles, ...API.styles || []]));
    app.mount("#root");
  }
})();
