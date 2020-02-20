import ReactDOM from "react-dom";
import { history } from "./context";
import { findPage } from "./router";

export async function Run() {
  // 获取初始化页面
  const InitPage = await findPage(history.location.pathname);
  const root = document.getElementById("__clroot");

  ReactDOM.render(InitPage, root);

  // 监听页面变化
  history.listen(locaiton => {
    (async () => {
      const Page = await findPage(locaiton.pathname);
      ReactDOM.render(Page, root);
    })();
  });
}
