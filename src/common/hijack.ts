/**
 * 配合simple-http-proxy使用
 *
 * @param targetUrl
 * @param proxyParam
 * @param proxyOrigin
 */

/**
 *
 * @param targetUrl
 * @param proxyParam
 * @param proxyOrigin
 */
export function hijack(
  targetUrl: string,
  proxyParam: string = "__proxy",
  proxyOrigin: string = "http://localhost:4000"
) {
  /**
   * 添加协议头
   */
  if (targetUrl.startsWith("//")) {
    targetUrl = window.location.protocol + ":" + targetUrl;
  }

  /**
   * 如果是相对路径请求URL，则直接返回
   */
  if(/^https?:\/\//.test(targetUrl)) {
    return targetUrl;
  }

  try {
    const proxy = new URL(proxyOrigin);
    proxy.searchParams.set(proxyParam, targetUrl);
    return proxy.href;
  } catch (error) {}

  return targetUrl;
}

/**
 * 全局代理函数
 * @param proxyParam 
 * @param proxyOrigin 
 */
export function hijackGlobally(
  proxyParam: string = "__proxy",
  proxyOrigin: string = "http://localhost:4000"
) {
  // 拦截window.XMLHTTPRequest
  const rawSend = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function(
    method: string,
    url: string,
    async: boolean = true,
    username?: string | null,
    password?: string | null
  ) {
    const proxyUrl = hijack(url, proxyParam, proxyOrigin);
    rawSend.call(this, method, proxyUrl, async, username, password);
  };

  // 拦截window.fetch
  if (typeof window.fetch === "function") {
    const rawFetch = window.fetch;
    window.fetch = function(
      input: RequestInfo,
      init?: RequestInit | undefined
    ): Promise<Response> {
      if (typeof input === "string") {
        const proxyUrl = hijack(input, proxyParam, proxyOrigin);
        return rawFetch(proxyUrl, init);
      }

      if (input instanceof Request) {
        const proxyUrl = hijack(input.url, proxyParam, proxyOrigin);
        return rawFetch(
          new Request(proxyUrl, {
            method: input.method,
            headers: input.headers,
            body: input.body,
            mode: input.mode,
            credentials: input.credentials,
            cache: input.cache,
            redirect: input.redirect,
            referrer: input.referrer,
            integrity: input.integrity
          }),
          init
        );
      }

      return rawFetch(input, init);
    };
  }
}
