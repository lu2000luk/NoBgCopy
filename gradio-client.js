/**
 * Minified by jsDelivr using Terser v5.19.2.
 * Original file: /npm/@gradio/client@1.6.0-beta.3/dist/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var _currentLine,
  __defProp = Object.defineProperty,
  __defNormalProp = (e, t, n) =>
    t in e
      ? __defProp(e, t, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: n,
        })
      : (e[t] = n),
  __publicField = (e, t, n) => (
    __defNormalProp(e, "symbol" != typeof t ? t + "" : t, n), n
  ),
  __accessCheck = (e, t, n) => {
    if (!t.has(e)) throw TypeError("Cannot " + n);
  },
  __privateGet = (e, t, n) => (
    __accessCheck(e, t, "read from private field"), n ? n.call(e) : t.get(e)
  ),
  __privateAdd = (e, t, n) => {
    if (t.has(e))
      throw TypeError("Cannot add the same private member more than once");
    t instanceof WeakSet ? t.add(e) : t.set(e, n);
  },
  __privateSet = (e, t, n, s) => (
    __accessCheck(e, t, "write to private field"),
    s ? s.call(e, n) : t.set(e, n),
    n
  ),
  fn = new Intl.Collator(0, { numeric: 1 }).compare;
function semiver(e, t, n) {
  return (
    (e = e.split(".")),
    (t = t.split(".")),
    fn(e[0], t[0]) ||
      fn(e[1], t[1]) ||
      ((t[2] = t.slice(2).join(".")),
      (n = /[.-]/.test((e[2] = e.slice(2).join(".")))) == /[.-]/.test(t[2])
        ? fn(e[2], t[2])
        : n
        ? -1
        : 1)
  );
}
const HOST_URL = "host",
  SSE_URL = "queue/data",
  SSE_DATA_URL = "queue/join",
  UPLOAD_URL = "upload",
  LOGIN_URL = "login",
  CONFIG_URL = "config",
  API_INFO_URL = "info",
  RUNTIME_URL = "runtime",
  SLEEPTIME_URL = "sleeptime",
  HEARTBEAT_URL = "heartbeat",
  COMPONENT_SERVER_URL = "component_server",
  RESET_URL = "reset",
  CANCEL_URL = "cancel",
  SPACE_FETCHER_URL = "https://gradio-space-api-fetcher-v2.hf.space/api",
  QUEUE_FULL_MSG = "This application is currently busy. Please try again. ",
  BROKEN_CONNECTION_MSG = "Connection errored out. ",
  CONFIG_ERROR_MSG = "Could not resolve app config. ",
  SPACE_STATUS_ERROR_MSG = "Could not get space status. ",
  API_INFO_ERROR_MSG = "Could not get API info. ",
  SPACE_METADATA_ERROR_MSG = "Space metadata could not be loaded. ",
  INVALID_URL_MSG = "Invalid URL. A full URL path is required.",
  UNAUTHORIZED_MSG = "Not authorized to access this space. ",
  INVALID_CREDENTIALS_MSG = "Invalid credentials. Could not login. ",
  MISSING_CREDENTIALS_MSG =
    "Login credentials are required to access this space.",
  NODEJS_FS_ERROR_MSG =
    "File system access is only available in Node.js environments",
  ROOT_URL_ERROR_MSG = "Root URL not found in client config",
  FILE_PROCESSING_ERROR_MSG = "Error uploading file";
function resolve_root(e, t, n) {
  return t.startsWith("http://") || t.startsWith("https://")
    ? n
      ? e
      : t
    : e + t;
}
async function get_jwt(e, t, n) {
  try {
    const s = await fetch(`https://huggingface.co/api/spaces/${e}/jwt`, {
      headers: { Authorization: `Bearer ${t}`, ...(n ? { Cookie: n } : {}) },
    });
    return (await s.json()).token || !1;
  } catch (e) {
    return !1;
  }
}
function map_names_to_ids(e) {
  let t = {};
  return (
    e.forEach(({ api_name: e, id: n }) => {
      e && (t[e] = n);
    }),
    t
  );
}
async function resolve_config(e) {
  var t;
  const n = this.options.hf_token
    ? { Authorization: `Bearer ${this.options.hf_token}` }
    : {};
  if (
    ((n["Content-Type"] = "application/json"),
    "undefined" != typeof window &&
      window.gradio_config &&
      "http://localhost:9876" !== location.origin &&
      !window.gradio_config.dev_mode)
  ) {
    const t = window.gradio_config.root,
      n = window.gradio_config;
    let s = resolve_root(e, n.root, !1);
    return (n.root = s), { ...n, path: t };
  }
  if (e) {
    const s = join_urls(e, "config"),
      i = await this.fetch(s, { headers: n, credentials: "include" });
    if (401 === (null == i ? void 0 : i.status) && !this.options.auth)
      throw new Error(MISSING_CREDENTIALS_MSG);
    if (401 === (null == i ? void 0 : i.status) && this.options.auth)
      throw new Error(INVALID_CREDENTIALS_MSG);
    if (200 === (null == i ? void 0 : i.status)) {
      let n = await i.json();
      return (
        (n.path = n.path ?? ""),
        (n.root = e),
        null == (t = n.dependencies) ||
          t.forEach((e, t) => {
            void 0 === e.id && (e.id = t);
          }),
        n
      );
    }
    if (401 === (null == i ? void 0 : i.status))
      throw new Error(UNAUTHORIZED_MSG);
    throw new Error(CONFIG_ERROR_MSG);
  }
  throw new Error(CONFIG_ERROR_MSG);
}
async function resolve_cookies() {
  const { http_protocol: e, host: t } = await process_endpoint(
    this.app_reference,
    this.options.hf_token
  );
  try {
    if (this.options.auth) {
      const n = await get_cookie_header(
        e,
        t,
        this.options.auth,
        this.fetch,
        this.options.hf_token
      );
      n && this.set_cookies(n);
    }
  } catch (e) {
    throw Error(e.message);
  }
}
async function get_cookie_header(e, t, n, s, i) {
  const a = new FormData();
  a.append("username", null == n ? void 0 : n[0]),
    a.append("password", null == n ? void 0 : n[1]);
  let o = {};
  i && (o.Authorization = `Bearer ${i}`);
  const r = await s(`${e}//${t}/${LOGIN_URL}`, {
    headers: o,
    method: "POST",
    body: a,
    credentials: "include",
  });
  if (200 === r.status) return r.headers.get("set-cookie");
  throw 401 === r.status
    ? new Error(INVALID_CREDENTIALS_MSG)
    : new Error(SPACE_METADATA_ERROR_MSG);
}
function determine_protocol(e) {
  if (e.startsWith("http")) {
    const { protocol: t, host: n, pathname: s } = new URL(e);
    return n.endsWith("hf.space")
      ? { ws_protocol: "wss", host: n, http_protocol: t }
      : {
          ws_protocol: "https:" === t ? "wss" : "ws",
          http_protocol: t,
          host: n + ("/" !== s ? s : ""),
        };
  }
  return e.startsWith("file:")
    ? { ws_protocol: "ws", http_protocol: "http:", host: "lite.local" }
    : { ws_protocol: "wss", http_protocol: "https:", host: new URL(e).host };
}
const parse_and_set_cookies = (e) => {
    let t = [];
    return (
      e.split(/,(?=\s*[^\s=;]+=[^\s=;]+)/).forEach((e) => {
        const [n, s] = e.split(";")[0].split("=");
        n && s && t.push(`${n.trim()}=${s.trim()}`);
      }),
      t
    );
  },
  RE_SPACE_NAME = /^[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+$/,
  RE_SPACE_DOMAIN = /.*hf\.space\/{0,1}$/;
async function process_endpoint(e, t) {
  const n = {};
  t && (n.Authorization = `Bearer ${t}`);
  const s = e.trim().replace(/\/$/, "");
  if (RE_SPACE_NAME.test(s))
    try {
      const t = await fetch(
        `https://huggingface.co/api/spaces/${s}/${HOST_URL}`,
        { headers: n }
      );
      return { space_id: e, ...determine_protocol((await t.json()).host) };
    } catch (e) {
      throw new Error(SPACE_METADATA_ERROR_MSG);
    }
  if (RE_SPACE_DOMAIN.test(s)) {
    const { ws_protocol: e, http_protocol: t, host: n } = determine_protocol(s);
    return {
      space_id: n.replace(".hf.space", ""),
      ws_protocol: e,
      http_protocol: t,
      host: n,
    };
  }
  return { space_id: !1, ...determine_protocol(s) };
}
const join_urls = (...e) => {
  try {
    return e.reduce(
      (e, t) => (
        (e = e.replace(/\/+$/, "")),
        (t = t.replace(/^\/+/, "")),
        new URL(t, e + "/").toString()
      )
    );
  } catch (e) {
    throw new Error(INVALID_URL_MSG);
  }
};
function transform_api_info(e, t, n) {
  const s = { named_endpoints: {}, unnamed_endpoints: {} };
  return (
    Object.keys(e).forEach((i) => {
      ("named_endpoints" !== i && "unnamed_endpoints" !== i) ||
        ((s[i] = {}),
        Object.entries(e[i]).forEach(([e, { parameters: a, returns: o }]) => {
          var r, c, l, d;
          const p =
              (null ==
              (r = t.dependencies.find(
                (t) => t.api_name === e || t.api_name === e.replace("/", "")
              ))
                ? void 0
                : r.id) ||
              n[e.replace("/", "")] ||
              -1,
            u =
              -1 !== p
                ? null == (c = t.dependencies.find((e) => e.id == p))
                  ? void 0
                  : c.types
                : { generator: !1, cancel: !1 };
          if (
            -1 !== p &&
            (null ==
            (d =
              null == (l = t.dependencies.find((e) => e.id == p))
                ? void 0
                : l.inputs)
              ? void 0
              : d.length) !== a.length
          ) {
            const e = t.dependencies
              .find((e) => e.id == p)
              .inputs.map((e) => {
                var n;
                return null == (n = t.components.find((t) => t.id === e))
                  ? void 0
                  : n.type;
              });
            try {
              e.forEach((e, t) => {
                if ("state" === e) {
                  const e = {
                    component: "state",
                    example: null,
                    parameter_default: null,
                    parameter_has_default: !0,
                    parameter_name: null,
                    hidden: !0,
                  };
                  a.splice(t, 0, e);
                }
              });
            } catch (e) {
              console.error(e);
            }
          }
          const _ = (e, t, n, s) => ({
            ...e,
            description: get_description(null == e ? void 0 : e.type, n),
            type: get_type(null == e ? void 0 : e.type, t, n, s) || "",
          });
          s[i][e] = {
            parameters: a.map((e) =>
              _(
                e,
                null == e ? void 0 : e.component,
                null == e ? void 0 : e.serializer,
                "parameter"
              )
            ),
            returns: o.map((e) =>
              _(
                e,
                null == e ? void 0 : e.component,
                null == e ? void 0 : e.serializer,
                "return"
              )
            ),
            type: u,
          };
        }));
    }),
    s
  );
}
function get_type(e, t, n, s) {
  switch (null == e ? void 0 : e.type) {
    case "string":
      return "string";
    case "boolean":
      return "boolean";
    case "number":
      return "number";
  }
  return "JSONSerializable" === n || "StringSerializable" === n
    ? "any"
    : "ListStringSerializable" === n
    ? "string[]"
    : "Image" === t
    ? "parameter" === s
      ? "Blob | File | Buffer"
      : "string"
    : "FileSerializable" === n
    ? "array" === (null == e ? void 0 : e.type)
      ? "parameter" === s
        ? "(Blob | File | Buffer)[]"
        : "{ name: string; data: string; size?: number; is_file?: boolean; orig_name?: string}[]"
      : "parameter" === s
      ? "Blob | File | Buffer"
      : "{ name: string; data: string; size?: number; is_file?: boolean; orig_name?: string}"
    : "GallerySerializable" === n
    ? "parameter" === s
      ? "[(Blob | File | Buffer), (string | null)][]"
      : "[{ name: string; data: string; size?: number; is_file?: boolean; orig_name?: string}, (string | null))][]"
    : void 0;
}
function get_description(e, t) {
  return "GallerySerializable" === t
    ? "array of [file, label] tuples"
    : "ListStringSerializable" === t
    ? "array of strings"
    : "FileSerializable" === t
    ? "array of files or single file"
    : null == e
    ? void 0
    : e.description;
}
function handle_message(e, t) {
  const n = !0;
  switch (e.msg) {
    case "send_data":
      return { type: "data" };
    case "send_hash":
      return { type: "hash" };
    case "queue_full":
      return {
        type: "update",
        status: {
          queue: n,
          message: QUEUE_FULL_MSG,
          stage: "error",
          code: e.code,
          success: e.success,
        },
      };
    case "heartbeat":
      return { type: "heartbeat" };
    case "unexpected_error":
      return {
        type: "unexpected_error",
        status: { queue: n, message: e.message, stage: "error", success: !1 },
      };
    case "estimation":
      return {
        type: "update",
        status: {
          queue: n,
          stage: t || "pending",
          code: e.code,
          size: e.queue_size,
          position: e.rank,
          eta: e.rank_eta,
          success: e.success,
        },
      };
    case "progress":
      return {
        type: "update",
        status: {
          queue: n,
          stage: "pending",
          code: e.code,
          progress_data: e.progress_data,
          success: e.success,
        },
      };
    case "log":
      return { type: "log", data: e };
    case "process_generating":
      return {
        type: "generating",
        status: {
          queue: n,
          message: e.success ? null : e.output.error,
          stage: e.success ? "generating" : "error",
          code: e.code,
          progress_data: e.progress_data,
          eta: e.average_duration,
          changed_state_ids: e.success ? e.output.changed_state_ids : void 0,
        },
        data: e.success ? e.output : null,
      };
    case "process_streaming":
      return {
        type: "streaming",
        status: {
          queue: n,
          message: e.output.error,
          stage: "streaming",
          time_limit: e.time_limit,
          code: e.code,
          progress_data: e.progress_data,
          eta: e.eta,
        },
        data: e.output,
      };
    case "process_completed":
      return "error" in e.output
        ? {
            type: "update",
            status: {
              queue: n,
              message: e.output.error,
              visible: e.output.visible,
              duration: e.output.duration,
              stage: "error",
              code: e.code,
              success: e.success,
            },
          }
        : {
            type: "complete",
            status: {
              queue: n,
              message: e.success ? void 0 : e.output.error,
              stage: e.success ? "complete" : "error",
              code: e.code,
              progress_data: e.progress_data,
              changed_state_ids: e.success
                ? e.output.changed_state_ids
                : void 0,
            },
            data: e.success ? e.output : null,
          };
    case "process_starts":
      return {
        type: "update",
        status: {
          queue: n,
          stage: "pending",
          code: e.code,
          size: e.rank,
          position: 0,
          success: e.success,
          eta: e.eta,
        },
        original_msg: "process_starts",
      };
  }
  return { type: "none", status: { stage: "error", queue: n } };
}
const map_data_to_params = (e = [], t) => {
  const n = t ? t.parameters : [];
  if (Array.isArray(e))
    return (
      e.length > n.length &&
        console.warn("Too many arguments provided for the endpoint."),
      e
    );
  const s = [],
    i = Object.keys(e);
  return (
    n.forEach((t, n) => {
      if (e.hasOwnProperty(t.parameter_name)) s[n] = e[t.parameter_name];
      else {
        if (!t.parameter_has_default)
          throw new Error(
            `No value provided for required parameter: ${t.parameter_name}`
          );
        s[n] = t.parameter_default;
      }
    }),
    i.forEach((e) => {
      if (!n.some((t) => t.parameter_name === e))
        throw new Error(
          `Parameter \`${e}\` is not a valid keyword argument. Please refer to the API for usage.`
        );
    }),
    s.forEach((e, t) => {
      if (void 0 === e && !n[t].parameter_has_default)
        throw new Error(
          `No value provided for required parameter: ${n[t].parameter_name}`
        );
    }),
    s
  );
};
async function view_api() {
  if (this.api_info) return this.api_info;
  const { hf_token: e } = this.options,
    { config: t } = this,
    n = { "Content-Type": "application/json" };
  if ((e && (n.Authorization = `Bearer ${e}`), t))
    try {
      let e, s;
      if ("undefined" != typeof window && window.gradio_api_info)
        s = window.gradio_api_info;
      else {
        if (semiver((null == t ? void 0 : t.version) || "2.0.0", "3.30") < 0)
          e = await this.fetch(SPACE_FETCHER_URL, {
            method: "POST",
            body: JSON.stringify({ serialize: !1, config: JSON.stringify(t) }),
            headers: n,
            credentials: "include",
          });
        else {
          const s = join_urls(t.root, this.api_prefix, "info");
          e = await this.fetch(s, { headers: n, credentials: "include" });
        }
        if (!e.ok) throw new Error(BROKEN_CONNECTION_MSG);
        s = await e.json();
      }
      return (
        "api" in s && (s = s.api),
        s.named_endpoints["/predict"] &&
          !s.unnamed_endpoints[0] &&
          (s.unnamed_endpoints[0] = s.named_endpoints["/predict"]),
        transform_api_info(s, t, this.api_map)
      );
    } catch (e) {
      e.message;
    }
}
async function upload_files(e, t, n) {
  var s;
  const i = {};
  (null == (s = null == this ? void 0 : this.options) ? void 0 : s.hf_token) &&
    (i.Authorization = `Bearer ${this.options.hf_token}`);
  const a = [];
  let o;
  for (let s = 0; s < t.length; s += 1e3) {
    const r = t.slice(s, s + 1e3),
      c = new FormData();
    r.forEach((e) => {
      c.append("files", e);
    });
    try {
      const t = n
        ? `${e}${this.api_prefix}/upload?upload_id=${n}`
        : `${e}${this.api_prefix}/upload`;
      o = await this.fetch(t, {
        method: "POST",
        body: c,
        headers: i,
        credentials: "include",
      });
    } catch (e) {
      throw new Error(BROKEN_CONNECTION_MSG + e.message);
    }
    if (!o.ok) {
      const e = await o.text();
      return { error: `HTTP ${o.status}: ${e}` };
    }
    const l = await o.json();
    l && a.push(...l);
  }
  return { files: a };
}
async function upload(e, t, n, s) {
  let i = (Array.isArray(e) ? e : [e]).map((e) => e.blob);
  const a = i.filter((e) => e.size > (s ?? 1 / 0));
  if (a.length)
    throw new Error(
      `File size exceeds the maximum allowed size of ${s} bytes: ${a
        .map((e) => e.name)
        .join(", ")}`
    );
  return await Promise.all(
    await this.upload_files(t, i, n).then(async (n) => {
      if (n.error) throw new Error(n.error);
      return n.files
        ? n.files.map(
            (n, s) =>
              new FileData({
                ...e[s],
                path: n,
                url: `${t}${this.api_prefix}/file=${n}`,
              })
          )
        : [];
    })
  );
}
async function prepare_files(e, t) {
  return e.map(
    (e) =>
      new FileData({
        path: e.name,
        orig_name: e.name,
        blob: e,
        size: e.size,
        mime_type: e.type,
        is_stream: t,
      })
  );
}
class FileData {
  constructor({
    path: e,
    url: t,
    orig_name: n,
    size: s,
    blob: i,
    is_stream: a,
    mime_type: o,
    alt_text: r,
  }) {
    __publicField(this, "path"),
      __publicField(this, "url"),
      __publicField(this, "orig_name"),
      __publicField(this, "size"),
      __publicField(this, "blob"),
      __publicField(this, "is_stream"),
      __publicField(this, "mime_type"),
      __publicField(this, "alt_text"),
      __publicField(this, "meta", { _type: "gradio.FileData" }),
      (this.path = e),
      (this.url = t),
      (this.orig_name = n),
      (this.size = s),
      (this.blob = t ? void 0 : i),
      (this.is_stream = a),
      (this.mime_type = o),
      (this.alt_text = r);
  }
}
class Command {
  constructor(e, t) {
    __publicField(this, "type"),
      __publicField(this, "command"),
      __publicField(this, "meta"),
      __publicField(this, "fileData"),
      (this.type = "command"),
      (this.command = e),
      (this.meta = t);
  }
}
const is_node =
  "undefined" != typeof process && process.versions && process.versions.node;
function update_object(e, t, n) {
  for (; n.length > 1; ) {
    const t = n.shift();
    if ("string" != typeof t && "number" != typeof t)
      throw new Error("Invalid key type");
    e = e[t];
  }
  const s = n.shift();
  if ("string" != typeof s && "number" != typeof s)
    throw new Error("Invalid key type");
  e[s] = t;
}
async function walk_and_store_blobs(e, t = void 0, n = [], s = !1, i = void 0) {
  if (Array.isArray(e)) {
    let a = [];
    return (
      await Promise.all(
        e.map(async (o, r) => {
          var c;
          let l = n.slice();
          l.push(String(r));
          const d = await walk_and_store_blobs(
            e[r],
            s
              ? (null == (c = null == i ? void 0 : i.parameters[r])
                  ? void 0
                  : c.component) || void 0
              : t,
            l,
            !1,
            i
          );
          a = a.concat(d);
        })
      ),
      a
    );
  }
  if (
    (globalThis.Buffer && e instanceof globalThis.Buffer) ||
    e instanceof Blob
  )
    return [{ path: n, blob: new Blob([e]), type: t }];
  if ("object" == typeof e && null !== e) {
    let t = [];
    for (const s of Object.keys(e)) {
      const a = [...n, s],
        o = e[s];
      t = t.concat(await walk_and_store_blobs(o, void 0, a, !1, i));
    }
    return t;
  }
  return [];
}
function skip_queue(e, t) {
  var n, s;
  let i =
    null ==
    (s =
      null == (n = null == t ? void 0 : t.dependencies)
        ? void 0
        : n.find((t) => t.id == e))
      ? void 0
      : s.queue;
  return null != i ? !i : !t.enable_queue;
}
function post_message(e, t) {
  return new Promise((n, s) => {
    const i = new MessageChannel();
    (i.port1.onmessage = ({ data: e }) => {
      i.port1.close(), n(e);
    }),
      window.parent.postMessage(e, t, [i.port2]);
  });
}
function handle_file(e) {
  if ("string" == typeof e) {
    if (e.startsWith("http://") || e.startsWith("https://"))
      return {
        path: e,
        url: e,
        orig_name: e.split("/").pop() ?? "unknown",
        meta: { _type: "gradio.FileData" },
      };
    if (is_node)
      return new Command("upload_file", { path: e, name: e, orig_path: e });
  } else {
    if ("undefined" != typeof File && e instanceof File) return new Blob([e]);
    if (e instanceof Buffer) return new Blob([e]);
    if (e instanceof Blob) return e;
  }
  throw new Error(
    "Invalid input: must be a URL, File, Blob, or Buffer object."
  );
}
function handle_payload(e, t, n, s, i = !1) {
  if ("input" === s && !i)
    throw new Error("Invalid code path. Cannot skip state inputs for input.");
  if ("output" === s && i) return e;
  let a = [],
    o = 0;
  const r = "input" === s ? t.inputs : t.outputs;
  for (let t = 0; t < r.length; t++) {
    const s = r[t],
      c = n.find((e) => e.id === s);
    if ("state" !== (null == c ? void 0 : c.type)) {
      const t = e[o];
      a.push(t), o++;
    } else {
      if (!i) {
        o++;
        continue;
      }
      if (e.length === r.length) {
        const t = e[o];
        a.push(t), o++;
      } else a.push(null);
    }
  }
  return a;
}
async function handle_blob(e, t, n) {
  const s = this;
  await process_local_file_commands(s, t);
  const i = await walk_and_store_blobs(t, void 0, [], !0, n);
  return (
    (
      await Promise.all(
        i.map(async ({ path: t, blob: n, type: i }) => {
          if (!n) return { path: t, type: i };
          const a = await s.upload_files(e, [n]);
          return {
            path: t,
            file_url: a.files && a.files[0],
            type: i,
            name:
              "undefined" != typeof File && n instanceof File
                ? null == n
                  ? void 0
                  : n.name
                : void 0,
          };
        })
      )
    ).forEach(({ path: e, file_url: n, type: s, name: i }) => {
      if ("Gallery" === s) update_object(t, n, e);
      else if (n) {
        const s = new FileData({ path: n, orig_name: i });
        update_object(t, s, e);
      }
    }),
    t
  );
}
async function process_local_file_commands(e, t) {
  var n, s;
  if (
    !(
      (null == (n = e.config) ? void 0 : n.root) ||
      (null == (s = e.config) ? void 0 : s.root_url)
    )
  )
    throw new Error(ROOT_URL_ERROR_MSG);
  await recursively_process_commands(e, t);
}
async function recursively_process_commands(e, t, n = []) {
  for (const s in t)
    t[s] instanceof Command
      ? await process_single_command(e, t, s)
      : "object" == typeof t[s] &&
        null !== t[s] &&
        (await recursively_process_commands(e, t[s], [...n, s]));
}
async function process_single_command(e, t, n) {
  var s, i;
  let a = t[n];
  const o =
    (null == (s = e.config) ? void 0 : s.root) ||
    (null == (i = e.config) ? void 0 : i.root_url);
  if (!o) throw new Error(ROOT_URL_ERROR_MSG);
  try {
    let s, i;
    if (
      "undefined" == typeof process ||
      !process.versions ||
      !process.versions.node
    )
      throw new Error(NODEJS_FS_ERROR_MSG);
    {
      const e = await import("fs/promises");
      (i = (await import("path")).resolve(process.cwd(), a.meta.path)),
        (s = await e.readFile(i));
    }
    const r = new Blob([s], { type: "application/octet-stream" }),
      c = await e.upload_files(o, [r]),
      l = c.files && c.files[0];
    if (l) {
      const e = new FileData({ path: l, orig_name: a.meta.name || "" });
      t[n] = e;
    }
  } catch (e) {
    console.error(FILE_PROCESSING_ERROR_MSG, e);
  }
}
async function post_data(e, t, n) {
  const s = { "Content-Type": "application/json" };
  this.options.hf_token &&
    (s.Authorization = `Bearer ${this.options.hf_token}`);
  try {
    var i = await this.fetch(e, {
      method: "POST",
      body: JSON.stringify(t),
      headers: { ...s, ...n },
      credentials: "include",
    });
  } catch (e) {
    return [{ error: BROKEN_CONNECTION_MSG }, 500];
  }
  let a, o;
  try {
    (a = await i.json()), (o = i.status);
  } catch (e) {
    (a = { error: `Could not parse server response: ${e}` }), (o = 500);
  }
  return [a, o];
}
async function predict(e, t = {}) {
  let n = !1,
    s = !1;
  if (!this.config) throw new Error("Could not resolve app config");
  if ("number" == typeof e) this.config.dependencies.find((t) => t.id == e);
  else {
    const t = e.replace(/^\//, "");
    this.config.dependencies.find((e) => e.id == this.api_map[t]);
  }
  return new Promise(async (i, a) => {
    const o = this.submit(e, t, null, null, !0);
    let r;
    for await (const e of o)
      "data" === e.type && (s && i(r), (n = !0), (r = e)),
        "status" === e.type &&
          ("error" === e.stage && a(e),
          "complete" === e.stage && ((s = !0), n && i(r)));
  });
}
async function check_space_status(e, t, n) {
  let s,
    i,
    a =
      "subdomain" === t
        ? `https://huggingface.co/api/spaces/by-subdomain/${e}`
        : `https://huggingface.co/api/spaces/${e}`;
  try {
    if (((s = await fetch(a)), (i = s.status), 200 !== i)) throw new Error();
    s = await s.json();
  } catch (e) {
    return void n({
      status: "error",
      load_status: "error",
      message: SPACE_STATUS_ERROR_MSG,
      detail: "NOT_FOUND",
    });
  }
  if (!s || 200 !== i) return;
  const {
    runtime: { stage: o },
    id: r,
  } = s;
  switch (o) {
    case "STOPPED":
    case "SLEEPING":
      n({
        status: "sleeping",
        load_status: "pending",
        message: "Space is asleep. Waking it up...",
        detail: o,
      }),
        setTimeout(() => {
          check_space_status(e, t, n);
        }, 1e3);
      break;
    case "PAUSED":
      n({
        status: "paused",
        load_status: "error",
        message:
          "This space has been paused by the author. If you would like to try this demo, consider duplicating the space.",
        detail: o,
        discussions_enabled: await discussions_enabled(r),
      });
      break;
    case "RUNNING":
    case "RUNNING_BUILDING":
      n({
        status: "running",
        load_status: "complete",
        message: "Space is running.",
        detail: o,
      });
      break;
    case "BUILDING":
      n({
        status: "building",
        load_status: "pending",
        message: "Space is building...",
        detail: o,
      }),
        setTimeout(() => {
          check_space_status(e, t, n);
        }, 1e3);
      break;
    case "APP_STARTING":
      n({
        status: "starting",
        load_status: "pending",
        message: "Space is starting...",
        detail: o,
      }),
        setTimeout(() => {
          check_space_status(e, t, n);
        }, 1e3);
      break;
    default:
      n({
        status: "space_error",
        load_status: "error",
        message: "This space is experiencing an issue.",
        detail: o,
        discussions_enabled: await discussions_enabled(r),
      });
  }
}
const check_and_wake_space = async (e, t) => {
    let n = 0;
    return new Promise((s) => {
      check_space_status(
        e,
        RE_SPACE_NAME.test(e) ? "space_name" : "subdomain",
        (i) => {
          t(i),
            "running" === i.status ||
            "error" === i.status ||
            "paused" === i.status ||
            "space_error" === i.status
              ? s()
              : ("sleeping" !== i.status && "building" !== i.status) ||
                (n < 12
                  ? (n++,
                    setTimeout(() => {
                      check_and_wake_space(e, t).then(s);
                    }, 5e3))
                  : s());
        }
      );
    });
  },
  RE_DISABLED_DISCUSSION =
    /^(?=[^]*\b[dD]iscussions{0,1}\b)(?=[^]*\b[dD]isabled\b)[^]*$/;
async function discussions_enabled(e) {
  try {
    const t = await fetch(
        `https://huggingface.co/api/spaces/${e}/discussions`,
        { method: "HEAD" }
      ),
      n = t.headers.get("x-error-message");
    return !(!t.ok || (n && RE_DISABLED_DISCUSSION.test(n)));
  } catch (e) {
    return !1;
  }
}
async function get_space_hardware(e, t) {
  const n = {};
  t && (n.Authorization = `Bearer ${t}`);
  try {
    const t = await fetch(
      `https://huggingface.co/api/spaces/${e}/${RUNTIME_URL}`,
      { headers: n }
    );
    if (200 !== t.status)
      throw new Error("Space hardware could not be obtained.");
    const { hardware: s } = await t.json();
    return s.current;
  } catch (e) {
    throw new Error(e.message);
  }
}
async function set_space_timeout(e, t, n) {
  const s = {};
  n && (s.Authorization = `Bearer ${n}`);
  const i = { seconds: t };
  try {
    const t = await fetch(
      `https://huggingface.co/api/spaces/${e}/${SLEEPTIME_URL}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...s },
        body: JSON.stringify(i),
      }
    );
    if (200 !== t.status)
      throw new Error(
        "Could not set sleep timeout on duplicated Space. Please visit *ADD HF LINK TO SETTINGS* to set a timeout manually to reduce billing charges."
      );
    return await t.json();
  } catch (e) {
    throw new Error(e.message);
  }
}
const hardware_types = [
  "cpu-basic",
  "cpu-upgrade",
  "cpu-xl",
  "t4-small",
  "t4-medium",
  "a10g-small",
  "a10g-large",
  "a10g-largex2",
  "a10g-largex4",
  "a100-large",
  "zero-a10g",
  "h100",
  "h100x8",
];
async function duplicate(e, t) {
  const { hf_token: n, private: s, hardware: i, timeout: a, auth: o } = t;
  if (i && !hardware_types.includes(i))
    throw new Error(
      `Invalid hardware type provided. Valid types are: ${hardware_types
        .map((e) => `"${e}"`)
        .join(",")}.`
    );
  const { http_protocol: r, host: c } = await process_endpoint(e, n);
  let l = null;
  if (o) {
    const e = await get_cookie_header(r, c, o, fetch);
    e && (l = parse_and_set_cookies(e));
  }
  const d = {
      Authorization: `Bearer ${n}`,
      "Content-Type": "application/json",
      ...(l ? { Cookie: l.join("; ") } : {}),
    },
    p = (
      await (
        await fetch("https://huggingface.co/api/whoami-v2", { headers: d })
      ).json()
    ).name,
    u = e.split("/")[1],
    _ = { repository: `${p}/${u}` };
  let h;
  s && (_.private = !0);
  try {
    i || (h = await get_space_hardware(e, n));
  } catch (e) {
    throw Error(SPACE_METADATA_ERROR_MSG + e.message);
  }
  const f = i || h || "cpu-basic";
  _.hardware = f;
  try {
    const s = await fetch(`https://huggingface.co/api/spaces/${e}/duplicate`, {
      method: "POST",
      headers: d,
      body: JSON.stringify(_),
    });
    if (409 === s.status)
      try {
        return await Client.connect(`${p}/${u}`, t);
      } catch (e) {
        throw (console.error("Failed to connect Client instance:", e), e);
      }
    else if (200 !== s.status) throw new Error(s.statusText);
    const i = await s.json();
    return (
      await set_space_timeout(`${p}/${u}`, a || 300, n),
      await Client.connect(get_space_reference(i.url), t)
    );
  } catch (e) {
    throw new Error(e);
  }
}
function get_space_reference(e) {
  const t = e.match(/https:\/\/huggingface.co\/spaces\/([^/]+\/[^/]+)/);
  if (t) return t[1];
}
class TextLineStream extends TransformStream {
  constructor(e = { allowCR: !1 }) {
    super({
      transform: (t, n) => {
        for (t = __privateGet(this, _currentLine) + t; ; ) {
          const s = t.indexOf("\n"),
            i = e.allowCR ? t.indexOf("\r") : -1;
          if (-1 !== i && i !== t.length - 1 && (-1 === s || s - 1 > i)) {
            n.enqueue(t.slice(0, i)), (t = t.slice(i + 1));
            continue;
          }
          if (-1 === s) break;
          const a = "\r" === t[s - 1] ? s - 1 : s;
          n.enqueue(t.slice(0, a)), (t = t.slice(s + 1));
        }
        __privateSet(this, _currentLine, t);
      },
      flush: (t) => {
        if ("" === __privateGet(this, _currentLine)) return;
        const n =
          e.allowCR && __privateGet(this, _currentLine).endsWith("\r")
            ? __privateGet(this, _currentLine).slice(0, -1)
            : __privateGet(this, _currentLine);
        t.enqueue(n);
      },
    }),
      __privateAdd(this, _currentLine, "");
  }
}
function stream$1(e) {
  let t = new TextDecoderStream(),
    n = new TextLineStream({ allowCR: !0 });
  return e.pipeThrough(t).pipeThrough(n);
}
function split(e) {
  let t = /[:]\s*/.exec(e),
    n = t && t.index;
  if (n) return [e.substring(0, n), e.substring(n + t[0].length)];
}
function fallback(e, t, n) {
  e.get(t) || e.set(t, n);
}
async function* events(e, t) {
  if (!e.body) return;
  let n,
    s,
    i = stream$1(e.body).getReader();
  for (;;) {
    if (t && t.aborted) return i.cancel();
    if (((n = await i.read()), n.done)) return;
    if (!n.value) {
      s && (yield s), (s = void 0);
      continue;
    }
    let [e, a] = split(n.value) || [];
    e &&
      ("data" === e
        ? (s || (s = {}), (s[e] = s[e] ? s[e] + "\n" + a : a))
        : "event" === e
        ? (s || (s = {}), (s[e] = a))
        : "id" === e
        ? (s || (s = {}), (s[e] = +a || a))
        : "retry" === e && (s || (s = {}), (s[e] = +a || void 0)));
  }
}
async function stream(e, t) {
  let n = new Request(e, t);
  fallback(n.headers, "Accept", "text/event-stream"),
    fallback(n.headers, "Content-Type", "application/json");
  let s = await fetch(n);
  if (!s.ok) throw s;
  return events(s, n.signal);
}
async function open_stream() {
  let {
    event_callbacks: e,
    unclosed_events: t,
    pending_stream_messages: n,
    stream_status: s,
    config: i,
    jwt: a,
  } = this;
  const o = this;
  if (!i) throw new Error("Could not resolve app config");
  s.open = !0;
  let r = null,
    c = new URLSearchParams({ session_hash: this.session_hash }).toString(),
    l = new URL(`${i.root}${this.api_prefix}/${SSE_URL}?${c}`);
  a && l.searchParams.set("__sign", a),
    (r = this.stream(l)),
    r
      ? ((r.onmessage = async function (a) {
          let r = JSON.parse(a.data);
          if ("close_stream" === r.msg)
            return void close_stream(s, o.abort_controller);
          const c = r.event_id;
          if (c)
            if (e[c] && i) {
              "process_completed" === r.msg &&
                ["sse", "sse_v1", "sse_v2", "sse_v2.1", "sse_v3"].includes(
                  i.protocol
                ) &&
                t.delete(c);
              let n = e[c];
              "undefined" != typeof window && "undefined" != typeof document
                ? setTimeout(n, 0, r)
                : n(r);
            } else n[c] || (n[c] = []), n[c].push(r);
          else await Promise.all(Object.keys(e).map((t) => e[t](r)));
        }),
        (r.onerror = async function () {
          await Promise.all(
            Object.keys(e).map((t) =>
              e[t]({ msg: "unexpected_error", message: BROKEN_CONNECTION_MSG })
            )
          );
        }))
      : console.warn("Cannot connect to SSE endpoint: " + l.toString());
}
function close_stream(e, t) {
  e && ((e.open = !1), null == t || t.abort());
}
function apply_diff_stream(e, t, n) {
  !e[t]
    ? ((e[t] = []),
      n.data.forEach((n, s) => {
        e[t][s] = n;
      }))
    : n.data.forEach((s, i) => {
        let a = apply_diff(e[t][i], s);
        (e[t][i] = a), (n.data[i] = a);
      });
}
function apply_diff(e, t) {
  return (
    t.forEach(([t, n, s]) => {
      e = apply_edit(e, n, t, s);
    }),
    e
  );
}
function apply_edit(e, t, n, s) {
  if (0 === t.length) {
    if ("replace" === n) return s;
    if ("append" === n) return e + s;
    throw new Error(`Unsupported action: ${n}`);
  }
  let i = e;
  for (let e = 0; e < t.length - 1; e++) i = i[t[e]];
  const a = t[t.length - 1];
  switch (n) {
    case "replace":
      i[a] = s;
      break;
    case "append":
      i[a] += s;
      break;
    case "add":
      Array.isArray(i) ? i.splice(Number(a), 0, s) : (i[a] = s);
      break;
    case "delete":
      Array.isArray(i) ? i.splice(Number(a), 1) : delete i[a];
      break;
    default:
      throw new Error(`Unknown action: ${n}`);
  }
  return e;
}
function readable_stream(e, t = {}) {
  const n = {
    close: () => {
      console.warn("Method not implemented.");
    },
    onerror: null,
    onmessage: null,
    onopen: null,
    readyState: 0,
    url: e.toString(),
    withCredentials: !1,
    CONNECTING: 0,
    OPEN: 1,
    CLOSED: 2,
    addEventListener: () => {
      throw new Error("Method not implemented.");
    },
    dispatchEvent: () => {
      throw new Error("Method not implemented.");
    },
    removeEventListener: () => {
      throw new Error("Method not implemented.");
    },
  };
  return (
    stream(e, t)
      .then(async (e) => {
        n.readyState = n.OPEN;
        try {
          for await (const t of e) n.onmessage && n.onmessage(t);
          n.readyState = n.CLOSED;
        } catch (e) {
          n.onerror && n.onerror(e), (n.readyState = n.CLOSED);
        }
      })
      .catch((e) => {
        console.error(e), n.onerror && n.onerror(e), (n.readyState = n.CLOSED);
      }),
    n
  );
}
function submit(e, t = {}, n, s, i) {
  var a;
  try {
    let r = function (e) {
        (i || z[e.type]) && p(e);
      },
      c = function () {
        for (W = !0; K.length > 0; ) K.shift()({ value: void 0, done: !0 });
      },
      l = function (e) {
        W || (K.length > 0 ? K.shift()(e) : H.push(e));
      },
      d = function (e) {
        l(thenable_reject(e)), c();
      },
      p = function (e) {
        l({ value: e, done: !1 });
      },
      u = function () {
        return H.length > 0
          ? Promise.resolve(H.shift())
          : W
          ? Promise.resolve({ value: void 0, done: !0 })
          : new Promise((e) => K.push(e));
      };
    const { hf_token: _ } = this.options,
      {
        fetch: h,
        app_reference: f,
        config: m,
        session_hash: g,
        api_info: w,
        api_map: y,
        stream_status: b,
        pending_stream_messages: v,
        pending_diff_streams: E,
        event_callbacks: S,
        unclosed_events: R,
        post_data: O,
        options: N,
        api_prefix: C,
      } = this,
      k = this;
    if (!w) throw new Error("No API found");
    if (!m) throw new Error("Could not resolve app config");
    let A,
      T,
      {
        fn_index: $,
        endpoint_info: F,
        dependency: L,
      } = get_endpoint_info(w, e, y, m),
      x = map_data_to_params(t, F),
      I = m.protocol ?? "ws",
      D = "",
      G = () => D;
    const P = "number" == typeof e ? "/predict" : e;
    let U,
      j = null,
      M = !1,
      q = {},
      B =
        "undefined" != typeof window && "undefined" != typeof document
          ? new URLSearchParams(window.location.search).toString()
          : "";
    const z =
      (null == (a = null == N ? void 0 : N.events)
        ? void 0
        : a.reduce((e, t) => ((e[t] = !0), e), {})) || {};
    const J = async (e) => {
      await this._resolve_hearbeat(e);
    };
    async function o(e) {
      if (!m) return;
      let t = e.render_id;
      (m.components = [
        ...m.components.filter((e) => e.props.rendered_in !== t),
        ...e.components,
      ]),
        (m.dependencies = [
          ...m.dependencies.filter((e) => e.rendered_in !== t),
          ...e.dependencies,
        ]);
      const n = m.components.some((e) => "state" === e.type),
        s = m.dependencies.some((e) =>
          e.targets.some((e) => "unload" === e[1])
        );
      (m.connect_heartbeat = n || s),
        await J(m),
        r({ type: "render", data: e, endpoint: P, fn_index: $ });
    }
    this.handle_blob(m.root, x, F).then(async (e) => {
      var t;
      let i = handle_payload(e, L, m.components, "input", !0);
      if (
        ((U = { data: i || [], event_data: n, fn_index: $, trigger_id: s }),
        skip_queue($, m))
      )
        r({
          type: "status",
          endpoint: P,
          stage: "pending",
          queue: !1,
          fn_index: $,
          time: new Date(),
        }),
          O(
            `${m.root}${C}/run${P.startsWith("/") ? P : `/${P}`}${
              B ? "?" + B : ""
            }`,
            { ...U, session_hash: g }
          )
            .then(([e, t]) => {
              const i = e.data;
              200 == t
                ? (r({
                    type: "data",
                    endpoint: P,
                    fn_index: $,
                    data: handle_payload(
                      i,
                      L,
                      m.components,
                      "output",
                      N.with_null_state
                    ),
                    time: new Date(),
                    event_data: n,
                    trigger_id: s,
                  }),
                  e.render_config && o(e.render_config),
                  r({
                    type: "status",
                    endpoint: P,
                    fn_index: $,
                    stage: "complete",
                    eta: e.average_duration,
                    queue: !1,
                    time: new Date(),
                  }))
                : r({
                    type: "status",
                    stage: "error",
                    endpoint: P,
                    fn_index: $,
                    message: e.error,
                    queue: !1,
                    time: new Date(),
                  });
            })
            .catch((e) => {
              r({
                type: "status",
                stage: "error",
                message: e.message,
                endpoint: P,
                fn_index: $,
                queue: !1,
                time: new Date(),
              });
            });
      else if ("ws" == I) {
        const { ws_protocol: e, host: t } = await process_endpoint(f, _);
        r({
          type: "status",
          stage: "pending",
          queue: !0,
          endpoint: P,
          fn_index: $,
          time: new Date(),
        });
        let i = new URL(
          `${e}://${resolve_root(t, m.path, !0)}/queue/join${B ? "?" + B : ""}`
        );
        this.jwt && i.searchParams.set("__sign", this.jwt),
          (A = new WebSocket(i)),
          (A.onclose = (e) => {
            e.wasClean ||
              r({
                type: "status",
                stage: "error",
                broken: !0,
                message: BROKEN_CONNECTION_MSG,
                queue: !0,
                endpoint: P,
                fn_index: $,
                time: new Date(),
              });
          }),
          (A.onmessage = function (e) {
            const t = JSON.parse(e.data),
              { type: i, status: a, data: o } = handle_message(t, q[$]);
            if ("update" === i && a && !M)
              r({
                type: "status",
                endpoint: P,
                fn_index: $,
                time: new Date(),
                ...a,
              }),
                "error" === a.stage && A.close();
            else {
              if ("hash" === i)
                return void A.send(
                  JSON.stringify({ fn_index: $, session_hash: g })
                );
              "data" === i
                ? A.send(JSON.stringify({ ...U, session_hash: g }))
                : "complete" === i
                ? (M = a)
                : "log" === i
                ? r({
                    type: "log",
                    log: o.log,
                    level: o.level,
                    endpoint: P,
                    duration: o.duration,
                    visible: o.visible,
                    fn_index: $,
                  })
                : "generating" === i &&
                  r({
                    type: "status",
                    time: new Date(),
                    ...a,
                    stage: null == a ? void 0 : a.stage,
                    queue: !0,
                    endpoint: P,
                    fn_index: $,
                  });
            }
            o &&
              (r({
                type: "data",
                time: new Date(),
                data: handle_payload(
                  o.data,
                  L,
                  m.components,
                  "output",
                  N.with_null_state
                ),
                endpoint: P,
                fn_index: $,
                event_data: n,
                trigger_id: s,
              }),
              M &&
                (r({
                  type: "status",
                  time: new Date(),
                  ...M,
                  stage: null == a ? void 0 : a.stage,
                  queue: !0,
                  endpoint: P,
                  fn_index: $,
                }),
                A.close()));
          }),
          semiver(m.version || "2.0.0", "3.6") < 0 &&
            addEventListener("open", () => A.send(JSON.stringify({ hash: g })));
      } else if ("sse" == I) {
        r({
          type: "status",
          stage: "pending",
          queue: !0,
          endpoint: P,
          fn_index: $,
          time: new Date(),
        });
        var a = new URLSearchParams({
          fn_index: $.toString(),
          session_hash: g,
        }).toString();
        let e = new URL(`${m.root}${C}/${SSE_URL}?${B ? B + "&" : ""}${a}`);
        if (
          (this.jwt && e.searchParams.set("__sign", this.jwt),
          (T = this.stream(e)),
          !T)
        )
          return Promise.reject(
            new Error("Cannot connect to SSE endpoint: " + e.toString())
          );
        T.onmessage = async function (e) {
          const t = JSON.parse(e.data),
            { type: i, status: a, data: o } = handle_message(t, q[$]);
          if ("update" === i && a && !M)
            r({
              type: "status",
              endpoint: P,
              fn_index: $,
              time: new Date(),
              ...a,
            }),
              "error" === a.stage && (null == T || T.close(), c());
          else if ("data" === i) {
            let [e, t] = await O(`${m.root}${C}/queue/data`, {
              ...U,
              session_hash: g,
              event_id: j,
            });
            200 !== t &&
              (r({
                type: "status",
                stage: "error",
                message: BROKEN_CONNECTION_MSG,
                queue: !0,
                endpoint: P,
                fn_index: $,
                time: new Date(),
              }),
              null == T || T.close(),
              c());
          } else
            "complete" === i
              ? (M = a)
              : "log" === i
              ? r({
                  type: "log",
                  log: o.log,
                  level: o.level,
                  endpoint: P,
                  duration: o.duration,
                  visible: o.visible,
                  fn_index: $,
                })
              : ("generating" !== i && "streaming" !== i) ||
                r({
                  type: "status",
                  time: new Date(),
                  ...a,
                  stage: null == a ? void 0 : a.stage,
                  queue: !0,
                  endpoint: P,
                  fn_index: $,
                });
          o &&
            (r({
              type: "data",
              time: new Date(),
              data: handle_payload(
                o.data,
                L,
                m.components,
                "output",
                N.with_null_state
              ),
              endpoint: P,
              fn_index: $,
              event_data: n,
              trigger_id: s,
            }),
            M &&
              (r({
                type: "status",
                time: new Date(),
                ...M,
                stage: null == a ? void 0 : a.stage,
                queue: !0,
                endpoint: P,
                fn_index: $,
              }),
              null == T || T.close(),
              c()));
        };
      } else if (
        "sse_v1" == I ||
        "sse_v2" == I ||
        "sse_v2.1" == I ||
        "sse_v3" == I
      ) {
        r({
          type: "status",
          stage: "pending",
          queue: !0,
          endpoint: P,
          fn_index: $,
          time: new Date(),
        });
        let e = "";
        "undefined" != typeof window &&
          "undefined" != typeof document &&
          (e =
            null == (t = null == window ? void 0 : window.location)
              ? void 0
              : t.hostname);
        let n = "dev.spaces.huggingface.tech";
        const s = e.includes(".dev.")
            ? `https://moon-${e.split(".")[1]}.${n}`
            : "https://huggingface.co",
          i =
            "undefined" != typeof window &&
            "undefined" != typeof document &&
            window.parent != window,
          a = L.zerogpu && m.space_id;
        (i && a ? post_message("zerogpu-headers", s) : Promise.resolve(null))
          .then((e) =>
            O(`${m.root}${C}/queue/join?${B}`, { ...U, session_hash: g }, e)
          )
          .then(async ([e, t]) => {
            if (503 === t)
              r({
                type: "status",
                stage: "error",
                message: QUEUE_FULL_MSG,
                queue: !0,
                endpoint: P,
                fn_index: $,
                time: new Date(),
              });
            else if (200 !== t)
              r({
                type: "status",
                stage: "error",
                message: BROKEN_CONNECTION_MSG,
                queue: !0,
                endpoint: P,
                fn_index: $,
                time: new Date(),
              });
            else {
              (j = e.event_id), (D = j);
              let t = async function (e) {
                try {
                  const {
                    type: t,
                    status: n,
                    data: s,
                    original_msg: i,
                  } = handle_message(e, q[$]);
                  if ("heartbeat" == t) return;
                  if ("update" === t && n && !M)
                    r({
                      type: "status",
                      endpoint: P,
                      fn_index: $,
                      time: new Date(),
                      original_msg: i,
                      ...n,
                    });
                  else if ("complete" === t) M = n;
                  else if ("unexpected_error" == t)
                    console.error(
                      "Unexpected error",
                      null == n ? void 0 : n.message
                    ),
                      r({
                        type: "status",
                        stage: "error",
                        message:
                          (null == n ? void 0 : n.message) ||
                          "An Unexpected Error Occurred!",
                        queue: !0,
                        endpoint: P,
                        fn_index: $,
                        time: new Date(),
                      });
                  else {
                    if ("log" === t)
                      return void r({
                        type: "log",
                        log: s.log,
                        level: s.level,
                        endpoint: P,
                        duration: s.duration,
                        visible: s.visible,
                        fn_index: $,
                      });
                    ("generating" !== t && "streaming" !== t) ||
                      (r({
                        type: "status",
                        time: new Date(),
                        ...n,
                        stage: null == n ? void 0 : n.stage,
                        queue: !0,
                        endpoint: P,
                        fn_index: $,
                      }),
                      s &&
                        "stream" !== L.connection &&
                        ["sse_v2", "sse_v2.1", "sse_v3"].includes(I) &&
                        apply_diff_stream(E, j, s));
                  }
                  s &&
                    (r({
                      type: "data",
                      time: new Date(),
                      data: handle_payload(
                        s.data,
                        L,
                        m.components,
                        "output",
                        N.with_null_state
                      ),
                      endpoint: P,
                      fn_index: $,
                    }),
                    s.render_config && (await o(s.render_config)),
                    M &&
                      (r({
                        type: "status",
                        time: new Date(),
                        ...M,
                        stage: null == n ? void 0 : n.stage,
                        queue: !0,
                        endpoint: P,
                        fn_index: $,
                      }),
                      c())),
                    ("complete" !== (null == n ? void 0 : n.stage) &&
                      "error" !== (null == n ? void 0 : n.stage)) ||
                      (S[j] && delete S[j], j in E && delete E[j]);
                } catch (e) {
                  console.error("Unexpected client exception", e),
                    r({
                      type: "status",
                      stage: "error",
                      message: "An Unexpected Error Occurred!",
                      queue: !0,
                      endpoint: P,
                      fn_index: $,
                      time: new Date(),
                    }),
                    ["sse_v2", "sse_v2.1", "sse_v3"].includes(I) &&
                      (close_stream(b, k.abort_controller), (b.open = !1), c());
                }
              };
              j in v && (v[j].forEach((e) => t(e)), delete v[j]),
                (S[j] = t),
                R.add(j),
                b.open || (await this.open_stream());
            }
          });
      }
    });
    let W = !1;
    const H = [],
      K = [],
      V = {
        [Symbol.asyncIterator]: () => V,
        next: u,
        throw: async (e) => (d(e), u()),
        return: async () => (c(), u()),
        cancel: async function () {
          const e = { stage: "complete", queue: !1, time: new Date() };
          (M = e), r({ ...e, type: "status", endpoint: P, fn_index: $ });
          let t = {},
            n = {};
          "ws" === I
            ? (A && 0 === A.readyState
                ? A.addEventListener("open", () => {
                    A.close();
                  })
                : A.close(),
              (t = { fn_index: $, session_hash: g }))
            : (close_stream(b, k.abort_controller),
              c(),
              (t = { event_id: j }),
              (n = { event_id: j, session_hash: g, fn_index: $ }));
          try {
            if (!m) throw new Error("Could not resolve app config");
            "event_id" in n &&
              (await h(`${m.root}${C}/cancel`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify(n),
              })),
              await h(`${m.root}${C}/reset`, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify(t),
              });
          } catch (e) {
            console.warn(
              "The `/reset` endpoint could not be called. Subsequent endpoint results may be unreliable."
            );
          }
        },
        event_id: G,
      };
    return V;
  } catch (Z) {
    throw (console.error("Submit function encountered an error:", Z), Z);
  }
}
function thenable_reject(e) {
  return { then: (t, n) => n(e) };
}
function get_endpoint_info(e, t, n, s) {
  let i, a, o;
  if ("number" == typeof t)
    (i = t),
      (a = e.unnamed_endpoints[i]),
      (o = s.dependencies.find((e) => e.id == t));
  else {
    const r = t.replace(/^\//, "");
    (i = n[r]),
      (a = e.named_endpoints[t.trim()]),
      (o = s.dependencies.find((e) => e.id == n[r]));
  }
  if ("number" != typeof i)
    throw new Error(
      "There is no endpoint matching that name of fn_index matching that number."
    );
  return { fn_index: i, endpoint_info: a, dependency: o };
}
_currentLine = new WeakMap();
class Client {
  constructor(e, t = { events: ["data"] }) {
    __publicField(this, "app_reference"),
      __publicField(this, "options"),
      __publicField(this, "config"),
      __publicField(this, "api_prefix", ""),
      __publicField(this, "api_info"),
      __publicField(this, "api_map", {}),
      __publicField(
        this,
        "session_hash",
        Math.random().toString(36).substring(2)
      ),
      __publicField(this, "jwt", !1),
      __publicField(this, "last_status", {}),
      __publicField(this, "cookies", null),
      __publicField(this, "stream_status", { open: !1 }),
      __publicField(this, "pending_stream_messages", {}),
      __publicField(this, "pending_diff_streams", {}),
      __publicField(this, "event_callbacks", {}),
      __publicField(this, "unclosed_events", new Set()),
      __publicField(this, "heartbeat_event", null),
      __publicField(this, "abort_controller", null),
      __publicField(this, "stream_instance", null),
      __publicField(this, "current_payload"),
      __publicField(this, "view_api"),
      __publicField(this, "upload_files"),
      __publicField(this, "upload"),
      __publicField(this, "handle_blob"),
      __publicField(this, "post_data"),
      __publicField(this, "submit"),
      __publicField(this, "predict"),
      __publicField(this, "open_stream"),
      __publicField(this, "resolve_config"),
      __publicField(this, "resolve_cookies"),
      (this.app_reference = e),
      t.events || (t.events = ["data"]),
      (this.options = t),
      (this.current_payload = {}),
      (this.view_api = view_api.bind(this)),
      (this.upload_files = upload_files.bind(this)),
      (this.handle_blob = handle_blob.bind(this)),
      (this.post_data = post_data.bind(this)),
      (this.submit = submit.bind(this)),
      (this.predict = predict.bind(this)),
      (this.open_stream = open_stream.bind(this)),
      (this.resolve_config = resolve_config.bind(this)),
      (this.resolve_cookies = resolve_cookies.bind(this)),
      (this.upload = upload.bind(this)),
      (this.fetch = this.fetch.bind(this)),
      (this.handle_space_success = this.handle_space_success.bind(this)),
      (this.stream = this.stream.bind(this));
  }
  fetch(e, t) {
    const n = new Headers((null == t ? void 0 : t.headers) || {});
    return (
      this && this.cookies && n.append("Cookie", this.cookies),
      fetch(e, { ...t, headers: n })
    );
  }
  stream(e) {
    const t = new Headers();
    return (
      this && this.cookies && t.append("Cookie", this.cookies),
      (this.abort_controller = new AbortController()),
      (this.stream_instance = readable_stream(e.toString(), {
        credentials: "include",
        headers: t,
        signal: this.abort_controller.signal,
      })),
      this.stream_instance
    );
  }
  async init() {
    var e;
    if (
      !(
        ("undefined" != typeof window && "WebSocket" in window) ||
        global.WebSocket
      )
    ) {
      const e = await import("./wrapper-CviSselG.js");
      global.WebSocket = e.WebSocket;
    }
    this.options.auth && (await this.resolve_cookies()),
      await this._resolve_config().then(({ config: e }) =>
        this._resolve_hearbeat(e)
      ),
      (this.api_info = await this.view_api()),
      (this.api_map = map_names_to_ids(
        (null == (e = this.config) ? void 0 : e.dependencies) || []
      ));
  }
  async _resolve_hearbeat(e) {
    if (
      (e &&
        ((this.config = e),
        (this.api_prefix = e.api_prefix || ""),
        this.config &&
          this.config.connect_heartbeat &&
          this.config.space_id &&
          this.options.hf_token &&
          (this.jwt = await get_jwt(
            this.config.space_id,
            this.options.hf_token,
            this.cookies
          ))),
      e.space_id &&
        this.options.hf_token &&
        (this.jwt = await get_jwt(e.space_id, this.options.hf_token)),
      this.config && this.config.connect_heartbeat)
    ) {
      const e = new URL(
        `${this.config.root}${this.api_prefix}/heartbeat/${this.session_hash}`
      );
      this.jwt && e.searchParams.set("__sign", this.jwt),
        this.heartbeat_event || (this.heartbeat_event = this.stream(e));
    }
  }
  static async connect(e, t = { events: ["data"] }) {
    const n = new this(e, t);
    return await n.init(), n;
  }
  close() {
    close_stream(this.stream_status, this.abort_controller);
  }
  set_current_payload(e) {
    this.current_payload = e;
  }
  static async duplicate(e, t = { events: ["data"] }) {
    return duplicate(e, t);
  }
  async _resolve_config() {
    const {
        http_protocol: e,
        host: t,
        space_id: n,
      } = await process_endpoint(this.app_reference, this.options.hf_token),
      { status_callback: s } = this.options;
    let i;
    n && s && (await check_and_wake_space(n, s));
    try {
      if (((i = await this.resolve_config(`${e}//${t}`)), !i))
        throw new Error(CONFIG_ERROR_MSG);
      return this.config_success(i);
    } catch (e) {
      if (!n || !s)
        throw (
          (s &&
            s({
              status: "error",
              message: "Could not load this space.",
              load_status: "error",
              detail: "NOT_FOUND",
            }),
          Error(e))
        );
      check_space_status(
        n,
        RE_SPACE_NAME.test(n) ? "space_name" : "subdomain",
        this.handle_space_success
      );
    }
  }
  async config_success(e) {
    if (
      ((this.config = e),
      (this.api_prefix = e.api_prefix || ""),
      "undefined" != typeof window &&
        "undefined" != typeof document &&
        "https:" === window.location.protocol &&
        (this.config.root = this.config.root.replace("http://", "https://")),
      this.config.auth_required)
    )
      return this.prepare_return_obj();
    try {
      this.api_info = await this.view_api();
    } catch (e) {
      console.error(API_INFO_ERROR_MSG + e.message);
    }
    return this.prepare_return_obj();
  }
  async handle_space_success(e) {
    var t;
    if (!this) throw new Error(CONFIG_ERROR_MSG);
    const { status_callback: n } = this.options;
    if ((n && n(e), "running" === e.status))
      try {
        if (
          ((this.config = await this._resolve_config()),
          (this.api_prefix =
            (null == (t = null == this ? void 0 : this.config)
              ? void 0
              : t.api_prefix) || ""),
          !this.config)
        )
          throw new Error(CONFIG_ERROR_MSG);
        return await this.config_success(this.config);
      } catch (e) {
        throw (
          (n &&
            n({
              status: "error",
              message: "Could not load this space.",
              load_status: "error",
              detail: "NOT_FOUND",
            }),
          e)
        );
      }
  }
  async component_server(e, t, n) {
    var s;
    if (!this.config) throw new Error(CONFIG_ERROR_MSG);
    const i = {},
      { hf_token: a } = this.options,
      { session_hash: o } = this;
    let r;
    a && (i.Authorization = `Bearer ${this.options.hf_token}`);
    let c,
      l = this.config.components.find((t) => t.id === e);
    if (
      ((r = (null == (s = null == l ? void 0 : l.props) ? void 0 : s.root_url)
        ? l.props.root_url
        : this.config.root),
      "binary" in n)
    ) {
      c = new FormData();
      for (const e in n.data) "binary" !== e && c.append(e, n.data[e]);
      c.set("component_id", e.toString()),
        c.set("fn_name", t),
        c.set("session_hash", o);
    } else
      (c = JSON.stringify({
        data: n,
        component_id: e,
        fn_name: t,
        session_hash: o,
      })),
        (i["Content-Type"] = "application/json");
    a && (i.Authorization = `Bearer ${a}`);
    try {
      const e = await this.fetch(`${r}${this.api_prefix}/component_server/`, {
        method: "POST",
        body: c,
        headers: i,
        credentials: "include",
      });
      if (!e.ok)
        throw new Error(
          "Could not connect to component server: " + e.statusText
        );
      return await e.json();
    } catch (e) {
      console.warn(e);
    }
  }
  set_cookies(e) {
    this.cookies = parse_and_set_cookies(e).join("; ");
  }
  prepare_return_obj() {
    return {
      config: this.config,
      predict: this.predict,
      submit: this.submit,
      view_api: this.view_api,
      component_server: this.component_server,
    };
  }
}
async function client(e, t = { events: ["data"] }) {
  return await Client.connect(e, t);
}
async function duplicate_space(e, t) {
  return await Client.duplicate(e, t);
}

//export {
//  Client,
//  FileData,
//  client,
//  duplicate_space as duplicate,
//  handle_file,
//  predict,
//  prepare_files,
//  submit,
//  upload,
//  upload_files,
//};

//# sourceMappingURL=/sm/7f9821638549fabd97d46616d4a9b6d8254e381219091e500a1147d90673368d.map
