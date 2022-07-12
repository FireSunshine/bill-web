import React from "react";
import Header from "@/components/Header/Header";
import s from './style.module.less'

const About = () => {
  return (
    <>
      <Header title="关于我们" />
      <div className={s.about}>
      <h2>嘿嘿，啥也没有</h2>
      <article>谢谢观看，欢迎交流</article>
    </div>
    </>
  );
};

export default About;
