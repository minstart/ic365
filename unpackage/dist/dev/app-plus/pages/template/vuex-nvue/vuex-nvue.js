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
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
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
  var _style_0 = { "page-head": { "": { "zIndex": 999 } }, "reserve-seat": { "": { "height": 2.6 } }, "common-page-head": { "": { "display": "flex", "paddingTop": 0, "paddingRight": 0, "paddingBottom": 0, "paddingLeft": 0, "position": "fixed", "top": 0, "width": 100, "backgroundColor": "#ffffff", "zIndex": 999 } }, "common-page-head-back": { ".common-page-head ": { "flex": 1, "position": "relative" } }, "common-page-head-module": { ".common-page-head ": { "flex": 1, "position": "relative" } }, "common-page-head-title": { ".common-page-head ": { "flex": 4, "borderWidth": 0, "color": "#333333" } }, "page-head-back-icon": { ".common-page-head ": { "background": 'url("/static/icons/back_grey.png") no-repeat center / 100% 100%' } }, "page-head-module-icon": { ".common-page-head ": { "width": 2.125, "height": 2.125 } }, "page-loading": { "": { "position": "fixed", "top": 0, "left": 0, "width": 100, "height": 100, "overflow": "hidden", "backgroundColor": "#ffffff", "zIndex": 1e29, "content::before": '""', "width::before": 1, "height::before": 1, "borderRadius::before": 100, "color::before": "rgba(255,206,9,0.4)", "boxShadow::before": "0 -2.5rem rgba(255, 206, 9, 0.9),  2.5rem 0px,  0 2.5rem,  -2.5rem 0 rgba(255, 206, 9, 0.7),  -1.75rem -1.75rem rgba(255, 206, 9, 0.8),  1.75rem -1.75rem #ffce09,  1.75rem 1.75rem,  -1.75rem 1.75rem", "animation::before": "spin 1s steps(8) infinite", "position::before": "absolute", "top::before": 0, "right::before": 0, "bottom::before": 0, "left::before": 0 } }, "@FONT-FACE": [{}] };
  var _sfc_main = {
    name: "page-head",
    props: {
      clickModule: {
        type: Function,
        default: () => {
          formatAppLog("log", "at components/page-head/page-head.vue:28", "\u9ED8\u8BA4\u53F3\u4FA7\u529F\u80FD\u533A\u51FD\u6570");
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
    const _component_viww = (0, import_vue2.resolveComponent)("viww");
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
                (0, import_vue2.createVNode)(_component_viww, { class: "common-page-head-back" }, {
                  default: (0, import_vue2.withCtx)(() => [
                    $props.isBack ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
                      key: 0,
                      class: "page-head-back-icon",
                      onClick: _cache[0] || (_cache[0] = ($event) => $options.clickBack(_ctx.backData))
                    })) : (0, import_vue2.createCommentVNode)("v-if", true)
                  ]),
                  _: 1
                  /* STABLE */
                }),
                (0, import_vue2.createElementVNode)("view", { class: "common-page-head-title" }, [
                  (0, import_vue2.createElementVNode)(
                    "u-text",
                    null,
                    (0, import_vue2.toDisplayString)($props.title),
                    1
                    /* TEXT */
                  )
                ]),
                (0, import_vue2.createElementVNode)("view", { class: "common-page-head-module" }, [
                  $props.isModule ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("u-image", {
                    key: 0,
                    src: $props.moduleIcon,
                    mode: "",
                    onClick: _cache[1] || (_cache[1] = (...args) => $props.clickModule && $props.clickModule(...args))
                  }, null, 8, ["src"])) : (0, import_vue2.createCommentVNode)("v-if", true)
                ])
              ],
              4
              /* STYLE */
            )) : (0, import_vue2.createCommentVNode)("v-if", true)
          ],
          4
          /* STYLE */
        ),
        _ctx.$store.state.isLoading ? ((0, import_vue2.openBlock)(), (0, import_vue2.createElementBlock)("view", {
          key: 0,
          class: "page-loading"
        })) : (0, import_vue2.createCommentVNode)("v-if", true)
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
      sex: "\u7537",
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
