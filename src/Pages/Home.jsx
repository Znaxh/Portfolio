import Type from "../components/Home/Type";
import Intro from "../components/Home/Intro";
import image from '../assets/back1.jpg'

export default function Home() {
  return (
    <>
      <img className="w-screen " src={image} />
      <div>Hi There!</div>
      <div> I am <Type /> </div>
      <Intro />
    </>
  );
}
