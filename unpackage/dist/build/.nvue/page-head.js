import { f as formatAppLog } from "./uni-app.es.js";
import { resolveComponent, openBlock, createElementBlock, Fragment, createElementVNode, normalizeStyle, createCommentVNode, createVNode, withCtx, toDisplayString } from "vue";
import { _ as _export_sfc } from "./_plugin-vue_export-helper.js";
const _style_0 = { "page-head": { "": { "zIndex": 999 } }, "reserve-seat": { "": { "height": 2.6 } }, "common-page-head": { "": { "display": "flex", "paddingTop": 0, "paddingRight": 0, "paddingBottom": 0, "paddingLeft": 0, "position": "fixed", "top": 0, "width": 100, "backgroundColor": "#ffffff", "zIndex": 999 } }, "common-page-head-back": { ".common-page-head ": { "flex": 1, "position": "relative" } }, "common-page-head-module": { ".common-page-head ": { "flex": 1, "position": "relative" } }, "common-page-head-title": { ".common-page-head ": { "flex": 4, "borderWidth": 0, "color": "#333333" } }, "page-head-back-icon": { ".common-page-head ": { "background": 'url("/static/icons/back_grey.png") no-repeat center / 100% 100%' } }, "page-head-module-icon": { ".common-page-head ": { "width": 2.125, "height": 2.125 } }, "page-loading": { "": { "position": "fixed", "top": 0, "left": 0, "width": 100, "height": 100, "overflow": "hidden", "backgroundColor": "#ffffff", "zIndex": 1e29, "content::before": '""', "width::before": 1, "height::before": 1, "borderRadius::before": 100, "color::before": "rgba(255,206,9,0.4)", "boxShadow::before": "0 -2.5rem rgba(255, 206, 9, 0.9),  2.5rem 0px,  0 2.5rem,  -2.5rem 0 rgba(255, 206, 9, 0.7),  -1.75rem -1.75rem rgba(255, 206, 9, 0.8),  1.75rem -1.75rem #ffce09,  1.75rem 1.75rem,  -1.75rem 1.75rem", "animation::before": "spin 1s steps(8) infinite", "position::before": "absolute", "top::before": 0, "right::before": 0, "bottom::before": 0, "left::before": 0 } }, "@FONT-FACE": [{}] };
const _sfc_main = {
  name: "page-head",
  props: {
    clickModule: {
      type: Function,
      default: () => {
        formatAppLog("log", "at components/page-head/page-head.vue:28", "默认右侧功能区函数");
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
    }
  },
  data() {
    return {
      taskbarHeight: 0
    };
  },
  mounted() {
    this.taskbarHeight = uni.getSystemInfoSync().statusBarHeight / 16 + "rem";
  },
  methods: {
    clickBack() {
      uni.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_viww = resolveComponent("viww");
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
        createVNode(_component_viww, { class: "common-page-head-back" }, {
          default: withCtx(() => [
            $props.isBack ? (openBlock(), createElementBlock("view", {
              key: 0,
              class: "page-head-back-icon",
              onClick: _cache[0] || (_cache[0] = ($event) => $options.clickBack(_ctx.backData))
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createElementVNode("view", { class: "common-page-head-title" }, [
          createElementVNode("u-text", null, toDisplayString($props.title), 1)
        ]),
        createElementVNode("view", { class: "common-page-head-module" }, [
          $props.isModule ? (openBlock(), createElementBlock("u-image", {
            key: 0,
            src: $props.moduleIcon,
            mode: "",
            onClick: _cache[1] || (_cache[1] = (...args) => $props.clickModule && $props.clickModule(...args))
          }, null, 8, ["src"])) : createCommentVNode("", true)
        ])
      ], 4)) : createCommentVNode("", true)
    ], 4),
    _ctx.$store.state.isLoading ? (openBlock(), createElementBlock("view", {
      key: 0,
      class: "page-loading"
    })) : createCommentVNode("", true)
  ], 64);
}
const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]]]);
export {
  __easycom_0 as _
};
