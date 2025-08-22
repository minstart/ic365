import { openBlock, createElementBlock, normalizeStyle, createCommentVNode, createElementVNode, toDisplayString } from "vue";
import { _ as _export_sfc } from "./_plugin-vue_export-helper.js";
const _style_0 = { "common-page-head-view": { "": { "position": "relative", "top": 0 } }, "page-head": { "": { "zIndex": 999 } }, "reserve-seat": { "": { "height": "88rpx" } }, "common-page-head": { "": { "display": "flex", "paddingTop": 0, "paddingRight": 0, "paddingBottom": 0, "paddingLeft": 0, "position": "fixed", "top": 0, "width": 100, "backgroundColor": "#ffffff", "zIndex": 99 } }, "common-page-head-back": { ".common-page-head ": { "height": "88rpx", "flex": 1, "position": "relative" } }, "common-page-head-module": { ".common-page-head ": { "flex": 1, "position": "relative" } }, "common-page-head-title": { ".common-page-head ": { "flex": 4, "borderWidth": 0, "color": "#333333", "fontWeight": "700", "fontSize": "44rpx", "paddingBottom": 0.1, "background": 'url("/static/image/title_back.png") no-repeat bottom center / 5.5rem' } }, "page-head-back-icon": { ".common-page-head ": { "background": 'url("/static/icons/back_orange.png") no-repeat center / 100% 100%' } }, "page-head-module-icon": { ".common-page-head ": { "width": "68rpx", "height": "68rpx" } }, "page-loading": { "": { "position": "fixed", "top": 0, "left": 0, "width": 100, "height": 100, "overflow": "hidden", "backgroundColor": "#ffffff", "zIndex": 1e29 } }, "@FONT-FACE": [{}] };
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
    }
  },
  data() {
    return {
      taskbarHeight: 0
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
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("view", {
    class: "common-page-head-view",
    style: normalizeStyle({ paddingTop: $data.taskbarHeight }),
    renderWhole: true
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
        class: "common-page-head-title",
        style: normalizeStyle(!$props.title && "height:0;")
      }, [
        createElementVNode("u-text", null, toDisplayString($props.title), 1)
      ], 4),
      createElementVNode("view", {
        class: "common-page-head-module",
        style: normalizeStyle(!$props.isModule && "height:0;")
      }, [
        $props.isModule ? (openBlock(), createElementBlock("u-image", {
          key: 0,
          src: $props.moduleIcon,
          mode: "",
          onClick: _cache[1] || (_cache[1] = (...args) => $props.clickModule && $props.clickModule(...args))
        }, null, 8, ["src"])) : createCommentVNode("", true)
      ], 4)
    ], 4)) : createCommentVNode("", true)
  ], 4);
}
const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]]]);
export {
  __easycom_0 as _
};
