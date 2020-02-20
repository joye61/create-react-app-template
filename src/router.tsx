import qs, { ParsedUrlQuery } from "querystring";
import { appConfig } from "./config";
import React from "react";
import { history } from "./context";
import { AppContainer } from "@clxx/adaptive";

/**
 * 获取页面参数
 * @param search
 */
export function getParams(): ParsedUrlQuery {
  return qs.parse(history.location.search.replace(/^\?*/, ""));
}

/**
 * 规范化路径
 * @param path
 */
export function normalize(path: string): string {
  if (!path || typeof path !== "string") {
    return `${appConfig.pageIndex}`;
  }
  path = path.replace(/^\/*|\/*$/, "");
  if (!path) {
    path = `${appConfig.pageIndex}`;
  } else {
    path = `${path}`;
  }
  return path;
}

/**
 * 查找页面
 * @param path
 */
export async function findPage(path: string) {
  path = normalize(path);
  let Page = <></>;
  let Result: React.FunctionComponent<Partial<CommonPageProps>>;
  try {
    Result = (await import(`./pages/${path}/index`)).default;
  } catch (error) {
    Result = (await import(`./pages/${appConfig.page404}/index`)).default;
  }
  Page = <Result history={history} params={getParams()} />;

  return (
    <AppContainer
      designWidth={appConfig.designWidth}
      criticalWidth={appConfig.criticalWidth}
    >
      {Page}
    </AppContainer>
  );
}
