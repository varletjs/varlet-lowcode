;(function(){var style=document.createElement('style');style.type='text/css';style.rel='stylesheet';style.appendChild(document.createTextNode(`.varlet-low-code--selector-plugins{position:absolute;top:100%;right:0}
`));var head=document.querySelector('head');head.appendChild(style)})();var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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
import { defineComponent, createVNode, ref, onMounted, onUnmounted, openBlock, createBlock, unref, withCtx } from "vue";
import { pluginsManager, eventsManager } from "@varlet/lowcode-core";
import { Button, Icon, Snackbar } from "@varlet/ui";
var plugin = "";
var PluginRender = defineComponent({
  name: "VarletLowCodeSelectorPluginRender",
  setup() {
    const plugins = pluginsManager.exportSelectorPlugins();
    console.log("plugins", plugins);
    return () => {
      return createVNode("div", {
        "class": "varlet-low-code--selector-plugins"
      }, [plugins.map(({
        component
      }) => {
        const PluginComponent = component;
        return createVNode(PluginComponent, null, null);
      })]);
    };
  }
});
var VarletLowCodeSelector = defineComponent({
  name: "VarletLowCodeSelector",
  setup() {
    const initStyle = {
      border: "2px solid red",
      boxSizing: "border-box",
      position: "absolute",
      pointerEvents: "none"
    };
    const selectorStyles = ref([]);
    function computedSelectorStyles(id) {
      const nodes = document.querySelectorAll(`#${id}`);
      if (nodes && nodes.length > 0) {
        const _nodes = Array.from(nodes);
        selectorStyles.value = _nodes.map((node) => {
          const {
            top,
            left,
            width,
            height
          } = node.getBoundingClientRect();
          const _style = {
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            height: `${height}px`
          };
          return __spreadValues(__spreadValues({}, _style), initStyle);
        });
      }
    }
    onMounted(() => {
      eventsManager.on("schema-click", computedSelectorStyles);
    });
    onUnmounted(() => {
      eventsManager.off("schema-click", computedSelectorStyles);
    });
    return () => {
      return selectorStyles.value && selectorStyles.value.map((style, i) => {
        return createVNode("div", {
          "key": Symbol(style.toString()),
          "style": style
        }, [style && i === selectorStyles.value.length - 1 && createVNode(PluginRender, null, null)]);
      });
    };
  }
});
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  setup(__props) {
    const copyClick = () => {
      Snackbar.success("Successfully ! Let's check it out.");
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Button), {
        onClick: copyClick,
        round: "",
        size: "small",
        type: "success"
      }, {
        default: withCtx(() => [
          createVNode(unref(Icon), { name: "file-document-outline" })
        ]),
        _: 1
      });
    };
  }
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  setup(__props) {
    const trashClick = () => {
      Snackbar.error("Trashed ! This is a dangerous operation.");
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Button), {
        round: "",
        onClick: trashClick,
        size: "small",
        type: "danger"
      }, {
        default: withCtx(() => [
          createVNode(unref(Icon), { name: "trash-can-outline" })
        ]),
        _: 1
      });
    };
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  setup(__props) {
    const copyClick = () => {
      Snackbar.warning("Happy birthday to you");
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(unref(Button), {
        onClick: copyClick,
        round: "",
        size: "small",
        type: "warning"
      }, {
        default: withCtx(() => [
          createVNode(unref(Icon), { name: "cake-variant" })
        ]),
        _: 1
      });
    };
  }
});
pluginsManager.useSelectorPlugin({
  name: "copy",
  component: _sfc_main$2
}).useSelectorPlugin({
  name: "transh",
  component: _sfc_main$1
}).useSelectorPlugin({
  name: "demo",
  component: _sfc_main
});
export { VarletLowCodeSelector as default };
