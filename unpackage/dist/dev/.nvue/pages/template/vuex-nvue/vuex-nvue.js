import { _ as __easycom_0 } from "../../../page-head.js";
import { resolveDynamicComponent, resolveComponent, openBlock, createElementBlock, createElementVNode, createVNode, toDisplayString, withCtx, createTextVNode } from "vue";
import { a as requireNativePlugin, f as formatAppLog, r as resolveEasycom } from "../../../uni-app.es.js";
import { createStore } from "vuex";
import { _ as _export_sfc } from "../../../_plugin-vue_export-helper.js";
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
const crypto = {
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
/*! js-cookie v3.0.5 | MIT */
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
const configData = {
  staticUrl: "https://ic365.ajulye.com"
  //请求接口地址
};
const store = createStore({
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
    encrypt_enabled: process.env.VUE_APP_ENCRYPT_ENABLED === "true",
    formRules: {
      //uni-forms校验必填
      phone: /^1[3456789]\d{9}$/
    },
    baseFontSize: 16,
    isLoading: true,
    //页面是否加载loading样式
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
    sex: "男",
    age: 10
  },
  // Mutations: 同步修改 State 的方法
  mutations: {
    // 复位crypto
    RESET_CRYPTO: (state) => {
      api.remove("crypto");
      state.crypto = {
        sessionKey: "",
        aesKey: "",
        expireTime: 0
      };
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
      formatAppLog("log", "at store/index.js:95", "data.token::", data.token);
      state.userInfo.token = data.token;
      state.userInfo.info = data;
    },
    Update_UserInfo: (state, data) => {
      state.userInfo.info = {
        ...state.userInfo.info,
        ...data
      };
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
    getUserOpenId: async function({
      commit,
      state
    }) {
      return await new Promise((resolve, reject) => {
        if (state.openid) {
          resolve(state.openid);
        }
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
const _sfc_main = {
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_page_head = resolveEasycom(resolveDynamicComponent("page-head"), __easycom_0);
  const _component_button = resolveComponent("button");
  return openBlock(), createElementBlock("scroll-view", {
    scrollY: true,
    showScrollbar: true,
    enableBackToTop: true,
    bubble: "true",
    style: { flexDirection: "column" }
  }, [
    createElementVNode("view", { class: "uni-product" }, [
      createVNode(_component_page_head, { title: "vuex:nvue页面" }),
      createElementVNode(
        "u-text",
        { class: "username" },
        "用户名：" + toDisplayString($options.username),
        1
        /* TEXT */
      ),
      createElementVNode(
        "u-text",
        { class: "sex" },
        "性别：" + toDisplayString($options.sex),
        1
        /* TEXT */
      ),
      createElementVNode("view", { class: "age" }, [
        createElementVNode(
          "u-text",
          null,
          "年龄：" + toDisplayString($options.age),
          1
          /* TEXT */
        )
      ]),
      createElementVNode("view", { class: "doubleAge" }, [
        createElementVNode(
          "u-text",
          null,
          "年龄翻倍：" + toDisplayString($options.doubleAge),
          1
          /* TEXT */
        )
      ]),
      createVNode(_component_button, { onClick: $options.addAge }, {
        default: withCtx(() => [
          createTextVNode("增加1岁")
        ]),
        _: 1
        /* STABLE */
      }, 8, ["onClick"]),
      createVNode(_component_button, { onClick: $options.addAgeTen }, {
        default: withCtx(() => [
          createTextVNode("增加10岁")
        ]),
        _: 1
        /* STABLE */
      }, 8, ["onClick"]),
      createVNode(_component_button, { onClick: $options.addAgeAction }, {
        default: withCtx(() => [
          createTextVNode("增加20岁")
        ]),
        _: 1
        /* STABLE */
      }, 8, ["onClick"]),
      createVNode(_component_button, { onClick: $options.resetAge }, {
        default: withCtx(() => [
          createTextVNode("重置")
        ]),
        _: 1
        /* STABLE */
      }, 8, ["onClick"])
    ])
  ]);
}
const vuexNvue = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "C:/Users/Administrator/Desktop/ic365/pages/template/vuex-nvue/vuex-nvue.nvue"]]);
export {
  vuexNvue as default
};
