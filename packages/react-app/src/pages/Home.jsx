import React from "react";
import Skill from "../components/Skill";

const Home = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 p-6">
      <Skill src={"/metamask.svg"} alt={"skill"} label={"Metamask"} />
      <Skill src={"/metamask.svg"} alt={"skill"} label={"Metamask"} />
      <Skill src={"/metamask.svg"} alt={"skill"} label={"Metamask"} />
      <Skill src={"/metamask.svg"} alt={"skill"} label={"Metamask"} />
      <Skill src={"/metamask.svg"} alt={"skill"} label={"Metamask"} />
      <Skill src={"/metamask.svg"} alt={"skill"} label={"Metamask"} />
      <Skill src={"/metamask.svg"} alt={"skill"} label={"Metamask"} />
      <Skill src={"/metamask.svg"} alt={"skill"} label={"Metamask"} />
      <Skill src={"/metamask.svg"} alt={"skill"} label={"Metamask"} />
    </div>
  );
};

export default Home;
