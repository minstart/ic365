import { f as formatAppLog } from "./uni-app.es.js";
import { resolveComponent, openBlock, createElementBlock, normalizeStyle, createCommentVNode, createVNode, withCtx, createElementVNode, toDisplayString } from "vue";
import { _ as _export_sfc } from "./_plugin-vue_export-helper.js";
const _style_0 = { "page-head": { "": { "zIndex": 999 } }, "reserve-seat": { "": { "height": 2.6 } }, "common-page-head": { "": { "display": "flex", "paddingTop": 0, "paddingRight": 0, "paddingBottom": 0, "paddingLeft": 0, "position": "fixed", "top": 0, "width": 100, "backgroundColor": "#ffffff" } }, "common-page-head-back": { ".common-page-head ": { "flex": 1, "position": "relative" } }, "common-page-head-module": { ".common-page-head ": { "flex": 1, "position": "relative" } }, "common-page-head-title": { ".common-page-head ": { "flex": 4, "borderWidth": 0, "color": "#333333" } }, "page-head-back-icon": { ".common-page-head ": { "background": 'url("/static/icons/back_grey.png") no-repeat center / 100% 100%' } }, "page-head-module-icon": { ".common-page-head ": { "width": 2.125, "height": 2.125 } } };
const _sfc_main = {
  name: "page-head",
  props: {
    clickModule: {
      type: Function,
      default: () => {
        formatAppLog("log", "at components/page-head/page-head.vue:27", "默认右侧功能区函数");
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
  return openBlock(), createElementBlock(
    "view",
    {
      class: "common-page-head-view",
      style: normalizeStyle({ paddingTop: $data.taskbarHeight }),
      renderWhole: true
    },
    [
      !$props.isHide ? (openBlock(), createElementBlock("view", {
        key: 0,
        class: "reserve-seat"
      })) : createCommentVNode("v-if", true),
      !$props.isHide ? (openBlock(), createElementBlock(
        "view",
        {
          key: 1,
          class: "common-page-head",
          style: normalizeStyle({ background: $props.background, paddingTop: $data.taskbarHeight })
        },
        [
          createVNode(_component_viww, { class: "common-page-head-back" }, {
            default: withCtx(() => [
              $props.isBack ? (openBlock(), createElementBlock("view", {
                key: 0,
                class: "page-head-back-icon",
                onClick: _cache[0] || (_cache[0] = ($event) => $options.clickBack(_ctx.backData))
              })) : createCommentVNode("v-if", true)
            ]),
            _: 1
            /* STABLE */
          }),
          createElementVNode("view", { class: "common-page-head-title" }, [
            createElementVNode(
              "u-text",
              null,
              toDisplayString($props.title),
              1
              /* TEXT */
            )
          ]),
          createElementVNode("view", { class: "common-page-head-module" }, [
            $props.isModule ? (openBlock(), createElementBlock("u-image", {
              key: 0,
              src: $props.moduleIcon,
              mode: "",
              onClick: _cache[1] || (_cache[1] = (...args) => $props.clickModule && $props.clickModule(...args))
            }, null, 8, ["src"])) : createCommentVNode("v-if", true)
          ])
        ],
        4
        /* STYLE */
      )) : createCommentVNode("v-if", true)
    ],
    4
    /* STYLE */
  );
}
const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]], ["__file", "C:/Users/71018/Desktop/ic365/components/page-head/page-head.vue"]]);
export {
  __easycom_0 as _
};
