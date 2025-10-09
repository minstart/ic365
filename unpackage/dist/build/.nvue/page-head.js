import { a as requireNativePlugin, f as formatAppLog, r as resolveEasycom } from "./uni-app.es.js";
import { openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createCommentVNode, resolveDynamicComponent, createElementVNode, createBlock, createVNode, withCtx, resolveComponent, Fragment, toDisplayString, withModifiers, createTextVNode } from "vue";
import { _ as _export_sfc } from "./_plugin-vue_export-helper.js";
const nvueAnimation = requireNativePlugin("animation");
class MPAnimation {
  constructor(options, _this) {
    this.options = options;
    this.animation = uni.createAnimation({
      ...options
    });
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
      nvueAnimation.transition(ref, {
        styles,
        ...config
      }, (res) => {
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
}
const animateTypes1 = [
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
const animateTypes2 = ["opacity", "backgroundColor"];
const animateTypes3 = ["width", "height", "left", "right", "top", "bottom"];
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
const _sfc_main$2 = {
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
      let styles = {
        ...this.styles,
        "transition-duration": this.duration / 1e3 + "s"
      };
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
          formatAppLog("error", "at uni_modules/uni-transition/components/uni-transition/uni-transition.vue:148", `方法 ${i} 不存在`);
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
  return $data.isShow ? (openBlock(), createElementBlock("view", {
    key: 0,
    ref: "ani",
    animation: $data.animationData,
    class: normalizeClass($props.customClass),
    style: normalizeStyle($options.transformStyles),
    onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args)),
    renderWhole: true
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 14, ["animation"])) : createCommentVNode("", true);
}
const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const _style_0$1 = { "uni-popup": { "": { "position": "fixed" }, ".top": { "top": 0 }, ".left": { "top": 0 }, ".right": { "top": 0 } }, "uni-popup__wrapper": { ".uni-popup ": { "position": "relative" }, ".uni-popup .left": { "paddingTop": 0, "flex": 1 }, ".uni-popup .right": { "paddingTop": 0, "flex": 1 } }, "fixforpc-top": { "": { "top": 0 } } };
const _sfc_main$1 = {
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
    },
    style: {
      default: ""
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
        formatAppLog("error", "at uni_modules/uni-popup/components/uni-popup/uni-popup.vue:313", "缺少类型：", direction);
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
  const _component_uni_transition = resolveEasycom(resolveDynamicComponent("uni-transition"), __easycom_0$2);
  return $data.showPopup ? (openBlock(), createElementBlock("view", {
    key: 0,
    class: normalizeClass(["uni-popup", [$data.popupstyle, $options.isDesktop ? "fixforpc-z-index" : ""]]),
    style: normalizeStyle($props.style),
    renderWhole: true
  }, [
    createElementVNode("view", {
      onTouchstart: _cache[1] || (_cache[1] = (...args) => $options.touchstart && $options.touchstart(...args))
    }, [
      $data.maskShow ? (openBlock(), createBlock(_component_uni_transition, {
        key: "1",
        name: "mask",
        "mode-class": "fade",
        styles: $data.maskClass,
        duration: $data.duration,
        show: $data.showTrans,
        onClick: $options.onTap
      }, null, 8, ["styles", "duration", "show", "onClick"])) : createCommentVNode("", true),
      createVNode(_component_uni_transition, {
        key: "2",
        "mode-class": $data.ani,
        name: "content",
        styles: $data.transClass,
        duration: $data.duration,
        show: $data.showTrans,
        onClick: $options.onTap
      }, {
        default: withCtx(() => [
          createElementVNode("view", {
            class: normalizeClass(["uni-popup__wrapper", [$data.popupstyle]]),
            style: normalizeStyle($options.getStyles),
            onClick: _cache[0] || (_cache[0] = (...args) => $options.clear && $options.clear(...args))
          }, [
            renderSlot(_ctx.$slots, "default")
          ], 6)
        ]),
        _: 3
      }, 8, ["mode-class", "styles", "duration", "show", "onClick"])
    ], 32)
  ], 6)) : createCommentVNode("", true);
}
const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["styles", [_style_0$1]]]);
const _style_0 = { "common-page-head-view": { "": { "position": "relative", "top": 0 } }, "page-head": { "": { "zIndex": 999 } }, "reserve-seat": { "": { "height": "88rpx" } }, "common-page-head": { "": { "display": "flex", "paddingTop": 0, "paddingRight": 0, "paddingBottom": 0, "paddingLeft": 0, "position": "fixed", "top": 0, "width": 100, "backgroundColor": "#ffffff", "zIndex": 99 } }, "common-page-head-back": { ".common-page-head ": { "height": "88rpx", "flex": 1, "position": "relative", "minHeight": "2rpx" } }, "common-page-head-module": { ".common-page-head ": { "flex": 1, "position": "relative", "minHeight": "2rpx" } }, "common-page-head-title": { ".common-page-head ": { "flex": 4, "borderWidth": 0, "color": "#333333", "fontWeight": "700", "fontSize": "44rpx", "paddingBottom": 0.1, "background": 'url("/static/image/title_back.png") no-repeat bottom center/5.5rem' } }, "standard-title": { ".common-page-head ": { "fontSize": "36rpx", "color": "#000000", "fontWeight": "normal", "backgroundColor": "rgba(0,0,0,0)" } }, "page-head-back-icon": { ".common-page-head ": { "background": 'url("/static/icons/back_orange.png") no-repeat center/100% 100%' } }, "page-head-module-icon": { ".common-page-head ": { "width": "68rpx", "height": "68rpx" } }, "page-loading": { "": { "position": "fixed", "top": 0, "left": 0, "width": 100, "height": 100, "overflow": "hidden", "backgroundColor": "#ffffff", "zIndex": 1e4 } }, "become-member-window": { "": { "position": "fixed", "top": 0, "left": 0, "width": 100, "height": 100, "backgroundColor": "rgba(0,0,0,0.5)", "zIndex": 1e14 } }, "become-member-wrap": { ".become-member-window ": { "width": "608rpx", "height": "830rpx", "position": "absolute", "top": 0, "left": 0, "right": 0, "bottom": 0, "backgroundColor": "#ffffff", "borderRadius": "20rpx", "textAlign": "center" } }, "title": { ".become-member-window .become-member-wrap ": { "textAlign": "center", "lineHeight": "88rpx", "fontSize": "32rpx", "borderBottomWidth": "2rpx", "borderBottomStyle": "solid", "borderBottomColor": "#dfdfdf" } }, "qr-code": { ".become-member-window .become-member-wrap ": { "width": "400rpx", "height": "400rpx", "marginTop": "60rpx", "marginBottom": "60rpx" } }, "tips": { ".become-member-window .become-member-wrap ": { "fontSize": "30rpx", "color": "#ff0000" } }, "btn-wrap": { ".become-member-window .become-member-wrap ": { "position": "absolute", "bottom": 0, "height": "132rpx", "width": 100, "borderTopWidth": "2rpx", "borderTopStyle": "solid", "borderTopColor": "#dfdfdf" } }, "btn-close": { ".become-member-window .become-member-wrap .btn-wrap ": { "width": "390rpx", "marginTop": "20rpx", "marginBottom": "20rpx" } }, "popup-tips-wrap": { "": { "width": "610rpx", "backgroundColor": "#FFFFFF", "borderRadius": "12rpx" } }, "popup-tips-title": { ".popup-tips-wrap ": { "textAlign": "center", "fontSize": "32rpx", "color": "#000000", "backgroundColor": "#FFFAEE", "lineHeight": "88rpx" } }, "popup-tips-content": { ".popup-tips-wrap ": { "paddingTop": "62rpx", "paddingRight": "52rpx", "paddingBottom": "62rpx", "paddingLeft": "52rpx", "fontSize": "30rpx", "color": "#000000", "lineHeight": "44rpx" } }, "popup-tips-btn-wrap": { ".popup-tips-wrap ": { "boxShadow": "0px -4px 8px 0px rgba(0, 0, 0, 0.08)", "height": "72rpx", "paddingTop": "30rpx", "paddingRight": "48rpx", "paddingBottom": "30rpx", "paddingLeft": "48rpx", "display": "flex", "alignItems": "center", "justifyContent": "center" } }, "tips-btn": { ".popup-tips-wrap .popup-tips-btn-wrap ": { "verticalAlign": "middle", "flex": 1, "fontSize": "32rpx", "height": "64rpx", "lineHeight": "64rpx", "color": "#000000", "textAlign": "center", "borderRadius": "8rpx" }, ".msg-tips-wrap .msg-tips-btn-wrap ": { "textAlign": "center", "width": "260rpx", "fontSize": "32rpx", "height": "64rpx", "lineHeight": "64rpx", "color": "#000000", "borderRadius": "30rpx", "borderWidth": "2rpx", "borderStyle": "solid", "borderColor": "#F5A623", "letterSpacing": "8rpx", "paddingLeft": "8rpx" } }, "border": { ".popup-tips-wrap .popup-tips-btn-wrap ": { "verticalAlign": "middle", "height": "46rpx", "width": "2rpx", "marginTop": "0rpx", "marginRight": "32rpx", "marginBottom": "0rpx", "marginLeft": "32rpx", "backgroundColor": "#F2F2F2" } }, "msg-tips-wrap": { "": { "width": "610rpx", "backgroundColor": "#FFFFFF", "borderRadius": "20rpx", "position": "relative" } }, "msg-tips-icon": { ".msg-tips-wrap ": { "width": "80rpx", "height": "118rpx", "background": 'url("/static/icons/tips.png") no-repeat center/100% 100%', "marginTop": "34rpx", "marginBottom": "34rpx" } }, "msg-tips-content": { ".msg-tips-wrap ": { "paddingTop": 0, "paddingRight": "52rpx", "paddingBottom": "50rpx", "paddingLeft": "52rpx", "fontSize": "30rpx", "color": "#000000", "lineHeight": "44rpx", "position": "relative", "textAlign": "center" } }, "msg-tips-btn-wrap": { ".msg-tips-wrap ": { "paddingTop": 0, "paddingRight": "48rpx", "paddingBottom": "40rpx", "paddingLeft": "48rpx", "display": "flex", "alignItems": "center", "justifyContent": "center" } } };
const _sfc_main = {
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
      tipsData: {},
      //询问弹窗参数对象
      msgData: {}
      //提示弹窗参数对象
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
      this.tipsData = {
        type: "center",
        title: "提示",
        content: "",
        success: () => {
          this.closePopupTips();
        }
      };
      this.tipsData = {
        ...this.tipsData,
        ...data
      };
      formatAppLog("log", "at components/page-head/page-head.vue:157", "合并后的data", this.tipsData);
    },
    closePopupTips() {
      this.$refs.popupTips.close();
    },
    openMsgTips(data) {
      this.$refs.msgTips.open();
      formatAppLog("log", "at components/page-head/page-head.vue:165", "咨询弹窗带来的data:", data);
      this.msgData = {
        type: "center",
        icon: "2",
        content: ""
      };
      this.msgData = {
        ...this.msgData,
        ...data
      };
      formatAppLog("log", "at components/page-head/page-head.vue:175", "合并后的data", this.msgData);
      if (data.time) {
        let _this = this;
        let _time = Number(data.time) - 100 || 0;
        setTimeout(function() {
          _this.closeMsgTips();
        }, _time);
      }
    },
    closeMsgTips() {
      this.$refs.msgTips.close();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_p = resolveComponent("p");
  const _component_button = resolveComponent("button");
  const _component_uni_popup = resolveEasycom(resolveDynamicComponent("uni-popup"), __easycom_0$1);
  return openBlock(), createElementBlock(Fragment, null, [
    createElementVNode("view", {
      class: "common-page-head-view",
      style: normalizeStyle({ paddingTop: $data.taskbarHeight })
    }, [
      !$props.isHide ? (openBlock(), createElementBlock("view", {
        key: 0,
        class: "reserve-seat"
      })) : createCommentVNode("", true),
      !$props.isHide ? (openBlock(), createElementBlock("view", {
        key: 1,
        class: "common-page-head",
        style: normalizeStyle({ background: $props.background, paddingTop: $data.taskbarHeight })
      }, [
        createElementVNode("view", { class: "common-page-head-back" }, [
          $props.isBack ? (openBlock(), createElementBlock("view", {
            key: 0,
            class: "page-head-back-icon",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.clickBack(_ctx.backData))
          })) : createCommentVNode("", true)
        ]),
        createElementVNode("view", {
          class: normalizeClass(["common-page-head-title", $props.standardTitle ? "standard-title" : ""]),
          style: normalizeStyle(!$props.title && "height:0;opacity: 0;")
        }, [
          createElementVNode("u-text", null, toDisplayString($props.title), 1)
        ], 6),
        createElementVNode("view", {
          class: "common-page-head-module",
          style: normalizeStyle(!$props.isModule && "height:0;opacity: 0;")
        }, [
          $props.isModule ? (openBlock(), createElementBlock("u-image", {
            key: 0,
            src: $props.moduleIcon,
            mode: "",
            onClick: _cache[1] || (_cache[1] = (...args) => $props.clickModule && $props.clickModule(...args))
          }, null, 8, ["src"])) : createCommentVNode("", true)
        ], 4)
      ], 4)) : createCommentVNode("", true)
    ], 4),
    createVNode(_component_uni_popup, {
      ref: "becomeMember",
      "mask-click": false,
      type: "center"
    }, {
      default: withCtx(() => [
        createElementVNode("view", { class: "become-member-window" }, [
          createElementVNode("view", {
            class: "become-member-wrap",
            style: normalizeStyle("transform: scale(" + $props.becomeMemberSize + ");")
          }, [
            createElementVNode("view", { class: "title" }, [
              createElementVNode("u-text", null, "关注公众号")
            ]),
            createElementVNode("u-image", {
              class: "qr-code",
              src: _ctx.$store.state.officialAccountQRCode
            }, null, 8, ["src"]),
            createVNode(_component_p, { class: "tips" }, {
              default: withCtx(() => [
                createElementVNode("u-text", null, "扫码关注 “学养网” 公众号开通会员")
              ]),
              _: 1
            }),
            createElementVNode("view", { class: "btn-wrap" }, [
              createVNode(_component_button, {
                class: "btn-close",
                onClick: withModifiers($options.closeBecomeMember, ["stop"])
              }, {
                default: withCtx(() => [
                  createTextVNode("关闭")
                ]),
                _: 1
              }, 8, ["onClick"])
            ])
          ], 4)
        ])
      ]),
      _: 1
    }, 512),
    createVNode(_component_uni_popup, {
      ref: "popupTips",
      "mask-click": false,
      type: $data.tipsData.type
    }, {
      default: withCtx(() => [
        createElementVNode("view", { class: "popup-tips-wrap" }, [
          $data.tipsData.title ? (openBlock(), createElementBlock("view", {
            key: 0,
            class: "popup-tips-title"
          }, [
            createElementVNode("u-text", null, toDisplayString($data.tipsData.title), 1)
          ])) : createCommentVNode("", true),
          createElementVNode("view", {
            class: "popup-tips-content",
            innerHTML: $data.tipsData.content
          }, null, 8, ["innerHTML"]),
          createElementVNode("view", { class: "popup-tips-btn-wrap" }, [
            createElementVNode("view", {
              class: "tips-btn",
              onClick: _cache[2] || (_cache[2] = withModifiers((...args) => $options.closePopupTips && $options.closePopupTips(...args), ["stop"]))
            }, [
              createElementVNode("u-text", null, "取消")
            ]),
            createElementVNode("view", { class: "border" }),
            createElementVNode("view", {
              class: "tips-btn",
              onClick: _cache[3] || (_cache[3] = withModifiers((...args) => $data.tipsData.success && $data.tipsData.success(...args), ["stop"]))
            }, [
              createElementVNode("u-text", null, "确定")
            ])
          ])
        ])
      ]),
      _: 1
    }, 8, ["type"]),
    createVNode(_component_uni_popup, {
      ref: "msgTips",
      "mask-click": false,
      type: $data.msgData.type,
      style: "z-index:100002 !important;"
    }, {
      default: withCtx(() => [
        createElementVNode("view", { class: "msg-tips-wrap" }, [
          createElementVNode("view", {
            class: "msg-tips-icon",
            type: $data.msgData.icon
          }, null, 8, ["type"]),
          createElementVNode("view", {
            class: "msg-tips-content",
            innerHTML: $data.msgData.content
          }, null, 8, ["innerHTML"]),
          $data.msgData.icon == "2" ? (openBlock(), createElementBlock("view", {
            key: 0,
            class: "msg-tips-btn-wrap"
          }, [
            createElementVNode("view", {
              class: "tips-btn",
              onClick: _cache[4] || (_cache[4] = withModifiers((...args) => $options.closeMsgTips && $options.closeMsgTips(...args), ["stop"]))
            }, [
              createElementVNode("u-text", null, "知道了")
            ])
          ])) : createCommentVNode("", true)
        ])
      ]),
      _: 1
    }, 8, ["type"])
  ], 64);
}
const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]]]);
export {
  __easycom_0 as _
};
