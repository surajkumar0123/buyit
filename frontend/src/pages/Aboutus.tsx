import shirt from "../assets/shirt.jpg";
import tshirt2 from "../assets/tshirt2.jpg";
import tshirt3 from "../assets/tshirt3.jpg";
import logo from "../assets/logo.png";
import { LiaInstagram, LiaYoutube, LiaDiscord } from "react-icons/lia";

const AboutUs = () => {
  return (
    <div className="bg-black text-white">
      <div className="flex flex-col items-center text-center py-10">
        <h2 className="text-[#6C5DD3] text-2xl font-medium">About Us</h2>
        <div className="bg-[#6C5DD3] w-16 h-1 my-2"></div>
        <h1 className="text-4xl md:text-7xl font-extrabold mt-4">Who we are</h1>
        <p className="text-lg md:text-2xl max-w-8xl mx-auto mt-5 px-5">
          Buyit isn’t just fashion—it’s a movement. Designed for Gen Z and
          college trendsetters, we fuse bold streetwear with trippy aesthetics
          to create statement pieces that defy the ordinary. Inspired by
          psychedelic art, underground culture, and urban street vibes, our
          designs turn every outfit into a canvas for self-expression. We stand
          for fearless individuality, limited drops, and a community-driven
          fashion revolution. Whether you're hitting the streets or making waves
          at a festival, Buyit keeps you wild, vibrant, and unapologetically
          you. Welcome to the future of street fashion. Stay wavy. Stay wild.
        </p>
        <button className="bg-[#6C5DD3] px-6 py-2 rounded-xl mt-5 text-lg font-medium hover:bg-[#5a4bc4] cursor-pointer">
          More +
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center py-10">
        <div className="md:w-1/2 px-5 text-center md:text-left">
          <h2 className="text-4xl font-extrabold">What We Do</h2>
          <p className="text-lg mt-4">
            At buyit, we create trippy, street-style fashion for Gen Z. Our
            bold, psychedelic designs blend art, culture, and self-expression,
            delivering limited drops and statement pieces that stand out.
          </p>
          <button className="bg-[#6C5DD3] px-6 py-2 rounded-xl mt-5 text-lg font-medium hover:bg-[#5a4bc4] cursor-pointer">
            More +
          </button>
        </div>
        <div className="relative flex items-center justify-center mt-10 md:mt-1">
          <img
            src={shirt}
            alt="shirt"
            className="absolute h-60 w-48 rounded-3xl translate-x-10 translate-y-10 shadow-lg z-10"
          />
          <img
            src={tshirt2}
            alt="shirt"
            className="absolute h-60 w-48 rounded-xl shadow-lg transform translate-x-5 translate-y-5 z-20"
          />
          <img
            src={tshirt3}
            alt="shirt"
            className="relative h-60 w-48 rounded-xl shadow-2xl z-30"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center py-10 ">
        <div className="relative flex items-center justify-center md:w-1/2 px-5">
          <img
            src={tshirt2}
            alt="shirt"
            className="absolute h-60 w-48 rounded-xl shadow-lg transform translate-x-5 translate-y-5 z-20"
          />
          <img
            src={tshirt3}
            alt="shirt"
            className="relative h-60 w-48 rounded-xl shadow-2xl z-30"
          />
        </div>
        <div className=" mt-5 md:w-1/2 px-5 text-center md:text-left">
          <h2 className="text-4xl font-extrabold ">When We Started</h2>
          <p className="text-lg mt-4">
            Founded in 2024, buyit emerged as a bold fusion of trippy aesthetics
            and street fashion, crafted for Gen Z and college trendsetters. We
            set out to break the norm, designing vibrant, statement pieces that
            reflect individuality and self-expression.
          </p>
          <button className="bg-[#6C5DD3] px-6 py-2 rounded-xl mt-5 text-lg font-medium hover:bg-[#5a4bc4] cursor-pointer">
            More +
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#671AE4] to-[#B75CFF] text-white py-10 px-5 text-center rounded-2xl w-[90%] mx-auto ">
        <h2 className="text-4xl font-bold">Highest Quality Collection</h2>
        <button className="bg-[#6C5DD3] px-6 py-2 rounded-xl mt-5 text-lg font-medium hover:bg-[#5a4bc4] cursor-pointer">
          Get Started
        </button>
      </div>

      <footer className="grid grid-cols-1 md:grid-cols-4 gap-6 p-10">
        <div>
          <img src={logo} className="h-20 mx-auto md:mx-0" alt="logo" />
          <p className="text-lg text-center md:text-left">
            At buyit, we create trippy, street-style fashion for Gen Z. Our
            bold, psychedelic designs blend art, culture, and self-expression.
          </p>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold">About</h3>
          <ul className="mt-3 space-y-2 text-gray-400">
            <li>Sale</li>
            <li>Showcase</li>
            <li>Feedback</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold">Company</h3>
          <ul className="mt-3 space-y-2 text-gray-400">
            <li>Our Team</li>
            <li>Partner With Us</li>
            <li>Privacy & Policy</li>
            <li>Features</li>
          </ul>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold ">Contact</h3>
          <p className="mt-3 text-gray-400">+91 8447973193</p>
          <p className="text-gray-400">buyit.fashion@gmail.com</p>
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <LiaYoutube size={30} className="cursor-pointer" />
            <LiaDiscord size={30} className="cursor-pointer" />
            <LiaInstagram size={30} className="cursor-pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
