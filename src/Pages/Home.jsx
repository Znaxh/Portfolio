import Type from "../components/Home/Type";
import Intro from "../components/Home/Intro";
  
// import image from '../assets/back1.jpg'

export default function Home() {
  return (
    <>
      <div className="my-16">
        <div>Hi There!</div>
        <div> I am <Type /> </div>
        <Intro />
      </div>
    </>
  );
}
