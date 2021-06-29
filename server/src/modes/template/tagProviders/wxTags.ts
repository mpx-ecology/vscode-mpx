/* tslint:disable:max-line-length */
import {
  HTMLTagSpecification,
  IHTMLTagProvider,
  collectTagsDefault,
  collectAttributesDefault,
  collectValuesDefault,
  genAttribute,
  AttributeCollector,
  Priority,
  Component,
  ComponentAttrValue,
  ComponentAttr,
  IEventSet,
  ITagSet,
  RelateApi,
  SubAttr,
  Extra
} from "./common";
import wxJson from "./wx";

const u = undefined;

const wxDirectives = [
  genAttribute(
    "wx:ref",
    u,
    "Mpx提供了 wx:ref=xxx 来更方便获取 WXML 节点信息的对象。在JS里只需要通过this.$refs.xxx 即可获取节点。"
  ),
  genAttribute(
    "wx:show",
    u,
    "与 wx:if 所不同的是不会移除节点，而是设置节点的 style 为 display: none。"
  ),
  genAttribute(
    "wx:else",
    "v",
    "也可以用 `wx:elif` 和 `wx:else` 来添加一个 else 块"
  ),
  genAttribute("wx:if", u, "在框架中，使用 `wx:if` 来判断是否需要渲染该代码块"),
  genAttribute(
    "wx:elif",
    u,
    "也可以用 `wx:elif` 和 `wx:else` 来添加一个 else 块"
  ),
  genAttribute(
    "wx:for",
    u,
    "在组件上使用 `wx:for` 控制属性绑定一个数组，即可使用数组中各项的数据重复渲染该组件"
  ),
  genAttribute(
    "wx:for-item",
    u,
    "使用 `wx:for-item` 可以指定数组当前元素的变量名"
  ),
  genAttribute(
    "wx:for-index",
    u,
    "使用 `wx:for-index` 可以指定数组当前下标的变量名"
  ),
  genAttribute(
    "wx:key",
    u,
    "如果列表中项目的位置会动态改变或者有新的项目添加到列表中，并且希望列表中的项目保持自己的特征和状态（如 input 中的输入内容，switch 的选中状态），需要使用 `wx:key` 来指定列表中项目的唯一的标识符"
  ),
  genAttribute(
    "wx:class",
    u,
    "我们可以传给 wx:class 一个对象，以动态地切换 class"
  ),
  genAttribute(
    "wx:style",
    u,
    "我们可以传给 wx:style 一个对象，以动态地切换 style"
  ),
  genAttribute(
    "wx:model",
    u,
    "除了小程序原生指令之外，mpx 基于input事件提供了一个指令 wx:model, 用于双向绑定。"
  ),
  genAttribute(
    "wx:model-prop",
    u,
    "wx:model 默认使用 value 属性传值，使用 wx:model-prop 定义 wx:model 指令对应的属性；"
  ),
  genAttribute(
    "wx:model-event",
    u,
    "wx:model 默认监听 input 事件，可以使用 wx:model-event 定义 wx:model 指令对应的事件；"
  ),
  genAttribute(
    "wx:model-value-path",
    u,
    "指定 wx:model 双向绑定时的取值路径； 并非所有的组件都会按微信的标注格式 event.target.value 来传值，例如 vant 的 input 组件，值是通过抛出 event.target 本身传递的，这时我们可以使用 wx:model-value-path 重新指定取值路径。"
  ),
  genAttribute(
    "wx:model-filter",
    u,
    "在使用 wx:model 时我们可能需要像 Vue 的 .trim 、.lazy 这样的修饰符来对双向数据绑定的数据进行过滤和修饰；Mpx 通过增强指令 wx:model-filter 可以实现这一功能； 该指令可以绑定内建的 filter 或者自定义的 filter 方法，该方法接收过滤前的值，返回过滤操作后的值。"
  )
];

const eventHandlers: IEventSet = {
  touchstart: "手指触摸动作开始",
  touchmove: "手指触摸后移动",
  touchcancel: "手指触摸动作被打断，如来电提醒，弹窗",
  touchend: "手指触摸动作结束",
  tap: "手指触摸后马上离开",
  longpress:
    "手指触摸后，超过350ms再离开，如果指定了事件回调函数并触发了这个事件，tap事件将不被触发",
  longtap: "手指触摸后，超过350ms再离开（推荐使用longpress事件代替）",
  transitionend: "会在 WXSS transition 或 wx.createAnimation 动画结束后触发",
  animationstart: "会在一个 WXSS animation 动画开始时触发",
  animationiteration: "会在一个 WXSS animation 一次迭代结束时触发",
  animationend: "会在一个 WXSS animation 动画完成时触发",
  touchforcechange: "在支持 3D Touch 的 iPhone 设备，重按时会触发"
};

// bind catch mut-bind
function generatorEvent(key: string) {
  for (const eventName in eventHandlers) {
    wxDirectives.push(
      genAttribute(`${key}${eventName}`, u, eventHandlers[eventName])
    );
  }
}

generatorEvent("bind");
// generatorEvent('bind:')
generatorEvent("catch");
// generatorEvent('catch:')
generatorEvent("mut-bind");
// generatorEvent('mut-bind:')

const valueSets = {
  transMode: ["out-in", "in-out"],
  transType: ["transition", "animation"],
  b: ["true", "false"]
};

const wxTags: ITagSet = {};

function getComponentMarkdown(c: Component) {
  const rows: string[] = c.desc ? [...c.desc] : [c.name];

  if (c.since) {
    rows.push(since(c.since));
  }
  if (c.authorize) {
    rows.push(field("需要授权", link(c.authorize.name, c.authorize.link)));
  }

  rows.push(...list("Bug", c.bugs));
  rows.push(...list("Tip", c.tips));
  rows.push(...list("Note", c.notices));

  if (c.relateApis) {
    rows.push(
      ...list(
        "相关接口",
        c.relateApis.map((l: RelateApi) => link(l.name, l.link))
      )
    );
  }
  if (c.docLink) {
    rows.push(link("官方文档", c.docLink));
  }

  return rows.join("\n\n");
}

function getComponentAttrMarkdown(a: ComponentAttr) {
  const rows = a.desc ? [...a.desc] : [a.name];
  if (a.type) {
    rows.push(field("类型", a.type.name));
  }
  if (a.since) {
    rows.push(since(a.since));
  }
  if (a.enum) {
    rows.push(...list("可选值", a.enum.map(_formatAttrValue)));
  }
  if (a.subAttrs && !a.enum) {
    rows.push(
      ...list(
        "可选值",
        a.subAttrs.map((s: SubAttr) => _formatAttrValue({ value: s.equal }))
      )
    );
  }
  if (a.extras) {
    rows.push(
      ...a.extras
        .filter((e: Extra) => e.key && e.value)
        .map((e: Extra) => field(e.key, e.value as string))
    );
  }

  return rows.join("\n\n");
}

function getComponentAttrValueMarkdown(v: ComponentAttrValue) {
  const rows = [v.desc || v.value];
  if (v.since) {
    rows.push(since(v.since));
  }
  return rows.join("\n\n");
}

function list(title: string, items?: string[]) {
  if (!items || !items.length) {
    return [];
  }
  if (items.length === 1) {
    return [field(title, items[0])];
  }
  return [field(title, items.map(it => `\n* ${it}`).join(""))];
}

function since(val: string) {
  return field(
    "Since",
    link(
      val,
      "https://mp.weixin.qq.com/debug/wxadoc/dev/framework/compatibility.html"
    )
  );
}

function link(name: string, url: string) {
  return `[${name}](${url})`;
}

function field(title: string, value: string) {
  return `**${title}:** ${value}`;
}

function _formatAttrValue(av: {
  value: string;
  desc?: string;
  since?: string;
}) {
  const rows = [av.value];
  if (av.desc) {
    rows.push(`**${av.desc}**`);
  }
  if (av.since) {
    rows.push(since(av.since));
  }
  if (rows.length > 1) {
    rows[0] += ":";
  }
  return rows.join(" ");
}

(wxJson as Component[]).forEach((comp: Component) => {
  wxTags[comp.name] = new HTMLTagSpecification(
    { kind: "markdown", value: getComponentMarkdown(comp) },
    comp.attrs
      ? comp.attrs.map((t: { name: string; desc?: string[] }) =>
          genAttribute(
            t.name,
            u,
            t.desc
              ? { kind: "markdown", value: getComponentAttrMarkdown(t) }
              : ""
          )
        )
      : []
  );
});

export function getWXMLTagProvider(): IHTMLTagProvider {
  return {
    getId: () => "wxml",
    priority: Priority.Framework,
    collectTags: collector => collectTagsDefault(collector, wxTags),
    collectAttributes: (tag: string, collector: AttributeCollector) => {
      collectAttributesDefault(tag, collector, wxTags, wxDirectives);
    },
    collectValues: (
      tag: string,
      attribute: string,
      collector: (value: string) => void
    ) => {
      collectValuesDefault(
        tag,
        attribute,
        collector,
        wxTags,
        wxDirectives,
        valueSets
      );
    }
  };
}
