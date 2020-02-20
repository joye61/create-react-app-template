import "./index.scss";
import { Loader } from "./common/loader";

// 启动App的执行
async function RunApp(){
  const app = await import("./app");
  app.Run();
}

// 如果需要预先展示加载百分比执行此处逻辑
const loader = new Loader();
loader.onProgress(percent => {
  console.log(percent);
});
loader.onEnd(() => {
  console.log("end");
  RunApp();
});


// 如果不需要展示百分比，直接加载
// RunApp();