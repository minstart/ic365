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
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // vue-ns:vue
  var require_vue = __commonJS({
    "vue-ns:vue"(exports, module) {
      module.exports = Vue;
    }
  });

  // vuex-ns:vuex
  var require_vuex = __commonJS({
    "vuex-ns:vuex"(exports, module) {
      module.exports = uni.Vuex;
    }
  });

  // C:/Users/Administrator/Desktop/ic365/unpackage/dist/dev/.nvue/uni-app.es.js
  var import_vue = __toESM(require_vue());
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

  // C:/Users/Administrator/Desktop/ic365/unpackage/dist/dev/.nvue/page-head.js
  var import_vue2 = __toESM(require_vue());

  // C:/Users/Administrator/Desktop/ic365/unpackage/dist/dev/.nvue/_plugin-vue_export-helper.js
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };

  // C:/Users/Administrator/Desktop/ic365/unpackage/dist/dev/.nvue/page-head.js
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
        }, config), (res2) => {
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
    return $data.isShow ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
      key: 0,
      ref: "ani",
      animation: $data.animationData,
      class: (0, import_vue2.normalizeClass)($props.customClass),
      style: (0, import_vue2.normalizeStyle)($options.transformStyles),
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args)),
      renderWhole: true
    }, [
      (0, import_vue2.renderSlot)(_ctx.$slots, "default")
    ], 14, ["animation"])) : (0, import_vue2.createCommentVNode)("v-if", true);
  }
  var __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "C:/Users/Administrator/Desktop/ic365/uni_modules/uni-transition/components/uni-transition/uni-transition.vue"]]);
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
        let res2 = { backgroundColor: this.bg };
        if (this.borderRadius || "0") {
          res2 = Object.assign(res2, { borderRadius: this.borderRadius });
        }
        return res2;
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
    const _component_uni_transition = resolveEasycom((0, import_vue2.resolveDynamicComponent)("uni-transition"), __easycom_0$2);
    return $data.showPopup ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)(
      "view",
      {
        key: 0,
        class: (0, import_vue2.normalizeClass)(["uni-popup", [$data.popupstyle, $options.isDesktop ? "fixforpc-z-index" : ""]]),
        renderWhole: true
      },
      [
        (0, import_vue2.createElementVNode)(
          "view",
          {
            onTouchstart: _cache[1] || (_cache[1] = (...args) => $options.touchstart && $options.touchstart(...args))
          },
          [
            $data.maskShow ? ((0, import_vue2.openBlock)(), (0, import_vue2.createBlock)(_component_uni_transition, {
              key: "1",
              name: "mask",
              "mode-class": "fade",
              styles: $data.maskClass,
              duration: $data.duration,
              show: $data.showTrans,
              onClick: $options.onTap
            }, null, 8, ["styles", "duration", "show", "onClick"])) : (0, import_vue2.createCommentVNode)("v-if", true),
            (0, import_vue2.createVNode)(_component_uni_transition, {
              key: "2",
              "mode-class": $data.ani,
              name: "content",
              styles: $data.transClass,
              duration: $data.duration,
              show: $data.showTrans,
              onClick: $options.onTap
            }, {
              default: (0, import_vue2.withCtx)(() => [
                (0, import_vue2.createElementVNode)(
                  "view",
                  {
                    class: (0, import_vue2.normalizeClass)(["uni-popup__wrapper", [$data.popupstyle]]),
                    style: (0, import_vue2.normalizeStyle)($options.getStyles),
                    onClick: _cache[0] || (_cache[0] = (...args) => $options.clear && $options.clear(...args))
                  },
                  [
                    (0, import_vue2.renderSlot)(_ctx.$slots, "default")
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
    )) : (0, import_vue2.createCommentVNode)("v-if", true);
  }
  var __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["styles", [_style_0$1]], ["__file", "C:/Users/Administrator/Desktop/ic365/uni_modules/uni-popup/components/uni-popup/uni-popup.vue"]]);
  var _style_0 = { "common-page-head-view": { "": { "position": "relative", "top": 0 } }, "page-head": { "": { "zIndex": 999 } }, "reserve-seat": { "": { "height": "88rpx" } }, "common-page-head": { "": { "display": "flex", "paddingTop": 0, "paddingRight": 0, "paddingBottom": 0, "paddingLeft": 0, "position": "fixed", "top": 0, "width": 100, "backgroundColor": "#ffffff", "zIndex": 99 } }, "common-page-head-back": { ".common-page-head ": { "height": "88rpx", "flex": 1, "position": "relative", "minHeight": "2rpx" } }, "common-page-head-module": { ".common-page-head ": { "flex": 1, "position": "relative", "minHeight": "2rpx" } }, "common-page-head-title": { ".common-page-head ": { "flex": 4, "borderWidth": 0, "color": "#333333", "fontWeight": "700", "fontSize": "44rpx", "paddingBottom": 0.1, "background": 'url("/static/image/title_back.png") no-repeat bottom center / 5.5rem' } }, "standard-title": { ".common-page-head ": { "fontSize": "36rpx", "color": "#000000", "fontWeight": "normal", "backgroundColor": "rgba(0,0,0,0)" } }, "page-head-back-icon": { ".common-page-head ": { "background": 'url("/static/icons/back_orange.png") no-repeat center / 100% 100%' } }, "page-head-module-icon": { ".common-page-head ": { "width": "68rpx", "height": "68rpx" } }, "page-loading": { "": { "position": "fixed", "top": 0, "left": 0, "width": 100, "height": 100, "overflow": "hidden", "backgroundColor": "#ffffff", "zIndex": 1e4 } }, "become-member-window": { "": { "position": "fixed", "top": 0, "left": 0, "width": 100, "height": 100, "backgroundColor": "rgba(0,0,0,0.5)", "zIndex": 1e14 } }, "become-member-wrap": { ".become-member-window ": { "width": "608rpx", "height": "830rpx", "position": "absolute", "top": 0, "left": 0, "right": 0, "bottom": 0, "backgroundColor": "#ffffff", "borderRadius": "20rpx", "textAlign": "center" } }, "title": { ".become-member-window .become-member-wrap ": { "textAlign": "center", "lineHeight": "88rpx", "fontSize": "32rpx", "borderBottomWidth": "2rpx", "borderBottomStyle": "solid", "borderBottomColor": "#dfdfdf" } }, "qr-code": { ".become-member-window .become-member-wrap ": { "width": "400rpx", "height": "400rpx", "marginTop": "60rpx", "marginBottom": "60rpx" } }, "tips": { ".become-member-window .become-member-wrap ": { "fontSize": "30rpx", "color": "#ff0000" } }, "btn-wrap": { ".become-member-window .become-member-wrap ": { "position": "absolute", "bottom": 0, "height": "132rpx", "width": 100, "borderTopWidth": "2rpx", "borderTopStyle": "solid", "borderTopColor": "#dfdfdf" } }, "btn-close": { ".become-member-window .become-member-wrap .btn-wrap ": { "width": "390rpx", "marginTop": "20rpx", "marginBottom": "20rpx" } } };
  var _sfc_main = {
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
      }
    },
    data() {
      return {
        taskbarHeight: 0,
        tipsData: {
          type: "center",
          content: ""
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
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_p = (0, import_vue2.resolveComponent)("p");
    const _component_button = (0, import_vue2.resolveComponent)("button");
    const _component_uni_popup = resolveEasycom((0, import_vue2.resolveDynamicComponent)("uni-popup"), __easycom_0$1);
    return (0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)(
      import_vue2.Fragment,
      null,
      [
        (0, import_vue2.createElementVNode)(
          "view",
          {
            class: "common-page-head-view",
            style: (0, import_vue2.normalizeStyle)({ paddingTop: $data.taskbarHeight })
          },
          [
            !$props.isHide ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
              key: 0,
              class: "reserve-seat"
            })) : (0, import_vue2.createCommentVNode)("v-if", true),
            !$props.isHide ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)(
              "view",
              {
                key: 1,
                class: "common-page-head",
                style: (0, import_vue2.normalizeStyle)({ background: $props.background, paddingTop: $data.taskbarHeight })
              },
              [
                (0, import_vue2.createElementVNode)("view", { class: "common-page-head-back" }, [
                  $props.isBack ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
                    key: 0,
                    class: "page-head-back-icon",
                    onClick: _cache[0] || (_cache[0] = ($event) => $options.clickBack(_ctx.backData))
                  })) : (0, import_vue2.createCommentVNode)("v-if", true)
                ]),
                (0, import_vue2.createElementVNode)(
                  "view",
                  {
                    class: (0, import_vue2.normalizeClass)(["common-page-head-title", $props.standardTitle ? "standard-title" : ""]),
                    style: (0, import_vue2.normalizeStyle)(!$props.title && "height:0;opacity: 0;")
                  },
                  [
                    (0, import_vue2.createElementVNode)(
                      "u-text",
                      null,
                      (0, import_vue2.toDisplayString)($props.title),
                      1
                      /* TEXT */
                    )
                  ],
                  6
                  /* CLASS, STYLE */
                ),
                (0, import_vue2.createElementVNode)(
                  "view",
                  {
                    class: "common-page-head-module",
                    style: (0, import_vue2.normalizeStyle)(!$props.isModule && "height:0;opacity: 0;")
                  },
                  [
                    $props.isModule ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("u-image", {
                      key: 0,
                      src: $props.moduleIcon,
                      mode: "",
                      onClick: _cache[1] || (_cache[1] = (...args) => $props.clickModule && $props.clickModule(...args))
                    }, null, 8, ["src"])) : (0, import_vue2.createCommentVNode)("v-if", true)
                  ],
                  4
                  /* STYLE */
                )
              ],
              4
              /* STYLE */
            )) : (0, import_vue2.createCommentVNode)("v-if", true)
          ],
          4
          /* STYLE */
        ),
        (0, import_vue2.createCommentVNode)(' <view class="become-member-window" @touchstart="touchstart" v-if="$store.state.officialAccountWindow">\n		<view class="become-member-wrap">\n			<view class="title">\u5173\u6CE8\u516C\u4F17\u53F7</view>\n			<image class="qr-code" :src="$store.state.officialAccountQRCode"></image>\n			<p class="tips">\u626B\u7801\u5173\u6CE8 \u201C\u5B66\u517B\u7F51\u201D \u516C\u4F17\u53F7\u5F00\u901A\u4F1A\u5458</p>\n			<view class="btn-wrap">\n				<button class="btn-close" @click.stop="closeBecomeMember">\u5173\u95ED</button>\n			</view>\n		</view>\n	</view> '),
        (0, import_vue2.createVNode)(
          _component_uni_popup,
          {
            ref: "becomeMember",
            "mask-click": false,
            type: "center"
          },
          {
            default: (0, import_vue2.withCtx)(() => [
              (0, import_vue2.createElementVNode)("view", { class: "become-member-window" }, [
                (0, import_vue2.createElementVNode)("view", { class: "become-member-wrap" }, [
                  (0, import_vue2.createElementVNode)("view", { class: "title" }, [
                    (0, import_vue2.createElementVNode)("u-text", null, "\u5173\u6CE8\u516C\u4F17\u53F7")
                  ]),
                  (0, import_vue2.createElementVNode)("u-image", {
                    class: "qr-code",
                    src: _ctx.$store.state.officialAccountQRCode
                  }, null, 8, ["src"]),
                  (0, import_vue2.createVNode)(_component_p, { class: "tips" }, {
                    default: (0, import_vue2.withCtx)(() => [
                      (0, import_vue2.createElementVNode)("u-text", null, "\u626B\u7801\u5173\u6CE8 \u201C\u5B66\u517B\u7F51\u201D \u516C\u4F17\u53F7\u5F00\u901A\u4F1A\u5458")
                    ]),
                    _: 1
                    /* STABLE */
                  }),
                  (0, import_vue2.createElementVNode)("view", { class: "btn-wrap" }, [
                    (0, import_vue2.createVNode)(_component_button, {
                      class: "btn-close",
                      onClick: (0, import_vue2.withModifiers)($options.closeBecomeMember, ["stop"])
                    }, {
                      default: (0, import_vue2.withCtx)(() => [
                        (0, import_vue2.createTextVNode)("\u5173\u95ED")
                      ]),
                      _: 1
                      /* STABLE */
                    }, 8, ["onClick"])
                  ])
                ])
              ])
            ]),
            _: 1
            /* STABLE */
          },
          512
          /* NEED_PATCH */
        ),
        (0, import_vue2.createVNode)(_component_uni_popup, {
          ref: "popup-tips",
          "mask-click": false,
          type: $data.tipsData.type
        }, {
          default: (0, import_vue2.withCtx)(() => [
            (0, import_vue2.createElementVNode)("view", { class: "popup-tips-wrap" }, [
              $data.tipsData.title ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
                key: 0,
                class: "popup-tips-title"
              }, [
                (0, import_vue2.createElementVNode)(
                  "u-text",
                  null,
                  (0, import_vue2.toDisplayString)($data.tipsData.title),
                  1
                  /* TEXT */
                )
              ])) : (0, import_vue2.createCommentVNode)("v-if", true),
              (0, import_vue2.createElementVNode)("view", { class: "popup-tips-content" }, [
                (0, import_vue2.createElementVNode)(
                  "u-text",
                  null,
                  (0, import_vue2.toDisplayString)($data.tipsData.content),
                  1
                  /* TEXT */
                )
              ]),
              (0, import_vue2.createElementVNode)("view", { class: "popup-tips-btn-wrap" }, [
                (0, import_vue2.createElementVNode)("view", { class: "tips-btn" }),
                (0, import_vue2.createElementVNode)("view", { class: "tips-btn" })
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
  var __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]], ["__file", "C:/Users/Administrator/Desktop/ic365/components/page-head/page-head.vue"]]);

  // C:/Users/Administrator/Desktop/ic365/unpackage/dist/dev/.nvue/pages/template/vuex-nvue/vuex-nvue.js
  var import_vue3 = __toESM(require_vue());
  var import_vuex = __toESM(require_vuex());
  var lookup = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    62,
    0,
    62,
    0,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    0,
    0,
    0,
    0,
    63,
    0,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51
  ];
  function base64Decode(source, target) {
    var sourceLength = source.length;
    var paddingLength = source[sourceLength - 2] === "=" ? 2 : source[sourceLength - 1] === "=" ? 1 : 0;
    var tmp;
    var byteIndex = 0;
    var baseLength = sourceLength - paddingLength & 4294967292;
    for (var i = 0; i < baseLength; i += 4) {
      tmp = lookup[source.charCodeAt(i)] << 18 | lookup[source.charCodeAt(i + 1)] << 12 | lookup[source.charCodeAt(i + 2)] << 6 | lookup[source.charCodeAt(i + 3)];
      target[byteIndex++] = tmp >> 16 & 255;
      target[byteIndex++] = tmp >> 8 & 255;
      target[byteIndex++] = tmp & 255;
    }
    if (paddingLength === 1) {
      tmp = lookup[source.charCodeAt(i)] << 10 | lookup[source.charCodeAt(i + 1)] << 4 | lookup[source.charCodeAt(i + 2)] >> 2;
      target[byteIndex++] = tmp >> 8 & 255;
      target[byteIndex++] = tmp & 255;
    }
    if (paddingLength === 2) {
      tmp = lookup[source.charCodeAt(i)] << 2 | lookup[source.charCodeAt(i + 1)] >> 4;
      target[byteIndex++] = tmp & 255;
    }
  }
  var crypto = {
    getRandomValues(arr) {
      if (!(arr instanceof Int8Array || arr instanceof Uint8Array || arr instanceof Int16Array || arr instanceof Uint16Array || arr instanceof Int32Array || arr instanceof Uint32Array || arr instanceof Uint8ClampedArray)) {
        throw new Error("Expected an integer array");
      }
      if (arr.byteLength > 65536) {
        throw new Error("Can only request a maximum of 65536 bytes");
      }
      var crypto2 = requireNativePlugin("DCloud-Crypto");
      base64Decode(crypto2.getRandomValues(arr.byteLength), new Uint8Array(
        arr.buffer,
        arr.byteOffset,
        arr.byteLength
      ));
      return arr;
    }
  };
  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        target[key] = source[key];
      }
    }
    return target;
  }
  var defaultConverter = {
    read: function(value) {
      if (value[0] === '"') {
        value = value.slice(1, -1);
      }
      return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
    },
    write: function(value) {
      return encodeURIComponent(value).replace(
        /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
        decodeURIComponent
      );
    }
  };
  function init(converter, defaultAttributes) {
    function set(name, value, attributes) {
      if (typeof document === "undefined") {
        return;
      }
      attributes = assign({}, defaultAttributes, attributes);
      if (typeof attributes.expires === "number") {
        attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
      }
      if (attributes.expires) {
        attributes.expires = attributes.expires.toUTCString();
      }
      name = encodeURIComponent(name).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
      var stringifiedAttributes = "";
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue;
        }
        stringifiedAttributes += "; " + attributeName;
        if (attributes[attributeName] === true) {
          continue;
        }
        stringifiedAttributes += "=" + attributes[attributeName].split(";")[0];
      }
      return document.cookie = name + "=" + converter.write(value, name) + stringifiedAttributes;
    }
    function get(name) {
      if (typeof document === "undefined" || arguments.length && !name) {
        return;
      }
      var cookies = document.cookie ? document.cookie.split("; ") : [];
      var jar = {};
      for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split("=");
        var value = parts.slice(1).join("=");
        try {
          var found = decodeURIComponent(parts[0]);
          jar[found] = converter.read(value, found);
          if (name === found) {
            break;
          }
        } catch (e) {
        }
      }
      return name ? jar[name] : jar;
    }
    return Object.create(
      {
        set,
        get,
        remove: function(name, attributes) {
          set(
            name,
            "",
            assign({}, attributes, {
              expires: -1
            })
          );
        },
        withAttributes: function(attributes) {
          return init(this.converter, assign({}, this.attributes, attributes));
        },
        withConverter: function(converter2) {
          return init(assign({}, this.converter, converter2), this.attributes);
        }
      },
      {
        attributes: { value: Object.freeze(defaultAttributes) },
        converter: { value: Object.freeze(converter) }
      }
    );
  }
  var api = init(defaultConverter, { path: "/" });
  var configData = {
    staticUrl: "https://ic365.ajulye.com"
    //请求接口地址
  };
  var store = (0, import_vuex.createStore)({
    // 在Vuex中，store的state属性用于存储全局状态数据，通过mutations和actions进行修改
    // State: 驱动应用的单一状态源
    state: {
      // 状态数据
      configData,
      //接口请求路径
      defaultHeadPic: "/static/image/head_pic.png",
      //默认用户头像
      requestHead: {
        Authorization: ""
      },
      userInfo: {
        //储存用户登录信息
        cookieName: "userInfo",
        //用于查询cookie储存的key名称
        token: "",
        //登陆后的token，没有就说明没登录
        info: {}
        //登录用户信息数据存储
      },
      crypto,
      refreshPromise: null,
      encrypt_enabled: process.env.VUE_APP_ENCRYPT_ENABLED === "true",
      formRules: {
        //uni-forms校验必填
        phone: /^1[3456789]\d{9}$/
      },
      baseFontSize: 16,
      isLoading: true,
      //页面是否加载loading样式
      taskbarHeight: "0rpx",
      //任务栏高度，从首页获取
      showRewardPopUp: true,
      //任务奖励、成就奖励弹窗是否显示
      rewardPopUpList: [],
      //任务奖励、成就奖励弹窗列表
      openDebug: true,
      //是否开启调试模式
      officialAccountQRCode: "",
      //公众号二维码地址
      hasLogin: false,
      isUniverifyLogin: false,
      loginProvider: "",
      openid: null,
      testvuex: false,
      colorIndex: 0,
      colorList: ["#FF0000", "#00FF00", "#0000FF"],
      noMatchLeftWindow: true,
      active: "componentPage",
      leftWinActive: "/pages/page/index/index",
      activeOpen: "",
      menu: [],
      univerifyErrorMsg: "",
      // vuex测试例使用
      username: "foo",
      sex: "\u7537",
      age: 10
    },
    // Mutations: 同步修改 State 的方法
    mutations: {
      // 复位crypto
      RESET_CRYPTO: (state) => {
        api.remove("crypto");
        state.crypto = {};
        state.refreshPromise = null;
      },
      // 设置crypto
      SET_CRYPTO: (state, crypto2) => {
        state.crypto = crypto2;
        api.set("crypto", JSON.stringify(crypto2));
      },
      SET_ENCRYPTENABLED: (state, encryptEnabled) => {
        state.encrypt_enabled = encryptEnabled;
      },
      RESET_LOGIN: (state) => {
        state.userInfo.info = {};
        state.userInfo.token = "";
      },
      SET_LOGIN: (state, data) => {
        formatAppLog("log", "at store/index.js:97", "data.token::", data.token);
        state.userInfo.token = data.token;
        state.userInfo.info = data;
      },
      Update_UserInfo: (state, data) => {
        state.userInfo.info = __spreadValues(__spreadValues({}, state.userInfo.info), data);
        uni.setStorage({
          key: state.userInfo.cookieName,
          data: state.userInfo,
          success: function() {
          }
        });
      },
      // 同步方法
      login(state, provider) {
        state.hasLogin = true;
        state.loginProvider = provider;
      },
      logout(state) {
        state.hasLogin = false;
        state.openid = null;
      },
      setOpenid(state, openid) {
        state.openid = openid;
      },
      setTestTrue(state) {
        state.testvuex = true;
      },
      setTestFalse(state) {
        state.testvuex = false;
      },
      setColorIndex(state, index) {
        state.colorIndex = index;
      },
      setMatchLeftWindow(state, matchLeftWindow) {
        state.noMatchLeftWindow = !matchLeftWindow;
      },
      setActive(state, tabPage) {
        state.active = tabPage;
      },
      setLeftWinActive(state, leftWinActive) {
        state.leftWinActive = leftWinActive;
      },
      setActiveOpen(state, activeOpen) {
        state.activeOpen = activeOpen;
      },
      setMenu(state, menu) {
        state.menu = menu;
      },
      setUniverifyLogin(state, payload) {
        typeof payload !== "boolean" ? payload = !!payload : "";
        state.isUniverifyLogin = payload;
      },
      setUniverifyErrorMsg(state, payload = "") {
        state.univerifyErrorMsg = payload;
      },
      // vuex测试例使用
      increment(state) {
        state.age++;
      },
      incrementTen(state, payload) {
        state.age += payload.amount;
      },
      resetAge(state) {
        state.age = 10;
      }
    },
    getters: {
      // 计算属性，用于从state派生出一些状态
      currentColor(state) {
        return state.colorList[state.colorIndex];
      },
      // vuex测试例使用
      doubleAge(state) {
        return state.age * 2;
      }
    },
    // Actions: 处理异步操作并提交 Mutations
    actions: {
      // 异步方法，可以调用mutations或者其他的API调用等
      // vuex测试例使用
      incrementAsync(context, payload) {
        context.commit("incrementTen", payload);
      },
      // lazy loading openid
      getUserOpenId: function(_0) {
        return __async(this, arguments, function* ({
          commit,
          state
        }) {
          return yield new Promise((resolve, reject) => {
            if (state.openid) {
              resolve(state.openid);
            }
          });
        });
      },
      getPhoneNumber: function({
        commit
      }, univerifyInfo) {
        return new Promise((resolve, reject) => {
          uni.request({
            url: "https://97fca9f2-41f6-449f-a35e-3f135d4c3875.bspapp.com/http/univerify-login",
            method: "POST",
            data: univerifyInfo,
            success: (res2) => {
              const data = res2.data;
              if (data.success) {
                resolve(data.phoneNumber);
              } else {
                reject(res2);
              }
            },
            fail: (err) => {
              reject(res);
            }
          });
        });
      }
    },
    modules: {
      // 模块化，可以将公共函数放在模块中
    }
  });
  var _sfc_main2 = {
    data() {
      return {};
    },
    computed: {
      // ...mapState(['age']),
      username() {
        return this.$store.state.username;
      },
      sex() {
        return store.state.sex;
      },
      age() {
        return store.state.age;
      },
      doubleAge() {
        return store.getters.doubleAge;
      }
    },
    methods: {
      addAge() {
        store.commit("increment");
      },
      addAgeTen() {
        store.commit("incrementTen", {
          amount: 10
        });
      },
      addAgeAction() {
        store.dispatch("incrementAsync", {
          amount: 20
        });
      },
      resetAge() {
        store.commit("resetAge");
      }
    }
  };
  function _sfc_render2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_page_head = resolveEasycom((0, import_vue3.resolveDynamicComponent)("page-head"), __easycom_0);
    const _component_button = (0, import_vue3.resolveComponent)("button");
    return (0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)("scroll-view", {
      scrollY: true,
      showScrollbar: true,
      enableBackToTop: true,
      bubble: "true",
      style: { flexDirection: "column" }
    }, [
      (0, import_vue3.createElementVNode)("view", { class: "uni-product" }, [
        (0, import_vue3.createVNode)(_component_page_head, { title: "vuex:nvue\u9875\u9762" }),
        (0, import_vue3.createElementVNode)(
          "u-text",
          { class: "username" },
          "\u7528\u6237\u540D\uFF1A" + (0, import_vue3.toDisplayString)($options.username),
          1
          /* TEXT */
        ),
        (0, import_vue3.createElementVNode)(
          "u-text",
          { class: "sex" },
          "\u6027\u522B\uFF1A" + (0, import_vue3.toDisplayString)($options.sex),
          1
          /* TEXT */
        ),
        (0, import_vue3.createElementVNode)("view", { class: "age" }, [
          (0, import_vue3.createElementVNode)(
            "u-text",
            null,
            "\u5E74\u9F84\uFF1A" + (0, import_vue3.toDisplayString)($options.age),
            1
            /* TEXT */
          )
        ]),
        (0, import_vue3.createElementVNode)("view", { class: "doubleAge" }, [
          (0, import_vue3.createElementVNode)(
            "u-text",
            null,
            "\u5E74\u9F84\u7FFB\u500D\uFF1A" + (0, import_vue3.toDisplayString)($options.doubleAge),
            1
            /* TEXT */
          )
        ]),
        (0, import_vue3.createVNode)(_component_button, { onClick: $options.addAge }, {
          default: (0, import_vue3.withCtx)(() => [
            (0, import_vue3.createTextVNode)("\u589E\u52A01\u5C81")
          ]),
          _: 1
          /* STABLE */
        }, 8, ["onClick"]),
        (0, import_vue3.createVNode)(_component_button, { onClick: $options.addAgeTen }, {
          default: (0, import_vue3.withCtx)(() => [
            (0, import_vue3.createTextVNode)("\u589E\u52A010\u5C81")
          ]),
          _: 1
          /* STABLE */
        }, 8, ["onClick"]),
        (0, import_vue3.createVNode)(_component_button, { onClick: $options.addAgeAction }, {
          default: (0, import_vue3.withCtx)(() => [
            (0, import_vue3.createTextVNode)("\u589E\u52A020\u5C81")
          ]),
          _: 1
          /* STABLE */
        }, 8, ["onClick"]),
        (0, import_vue3.createVNode)(_component_button, { onClick: $options.resetAge }, {
          default: (0, import_vue3.withCtx)(() => [
            (0, import_vue3.createTextVNode)("\u91CD\u7F6E")
          ]),
          _: 1
          /* STABLE */
        }, 8, ["onClick"])
      ])
    ]);
  }
  var vuexNvue = /* @__PURE__ */ _export_sfc(_sfc_main2, [["render", _sfc_render2], ["__file", "C:/Users/Administrator/Desktop/ic365/pages/template/vuex-nvue/vuex-nvue.nvue"]]);

  // <stdin>
  var webview = plus.webview.currentWebview();
  if (webview) {
    const __pageId = parseInt(webview.id);
    const __pagePath = "pages/template/vuex-nvue/vuex-nvue";
    let __pageQuery = {};
    try {
      __pageQuery = JSON.parse(webview.__query__);
    } catch (e) {
    }
    vuexNvue.mpType = "page";
    const app = Vue.createPageApp(vuexNvue, { $store: getApp({ allowDefault: true }).$store, __pageId, __pagePath, __pageQuery });
    app.provide("__globalStyles", Vue.useCssStyles([...__uniConfig.styles, ...vuexNvue.styles || []]));
    app.mount("#root");
  }
})();
/*! js-cookie v3.0.5 | MIT */
