import React from "react";
import style from "./index.module.scss";

export default function() {
  console.log(style);
  return (
    <div className={style.container}>
      <h1 className={style.title}>404</h1>
      <p className={style.content}>很抱歉，页面找不到了</p>
    </div>
  );
}
