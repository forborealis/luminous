import { useState } from "react";
import { statistics } from "../../constants";
import { Button } from "../../components/client";
import { makeup1 } from "../../assets/images";
import { arrowRight } from "../../assets/icons";

const Hero = () => {
  return (
    <section
      id="home"
      className="w-full flex xl:flex-row flex-col justify-center min-h-screen gap-10 bg-hero bg-cover bg-center mt-16" // Added mt-16 for margin-top
    >
      <div className="relative xl:w-2/5 flex flex-col justify-center items-start w-full px-10 pt-28">
        <h1 className="mt-10 font-palanquin text-8xl max-sm:text-[72px] max-sm:leading-[82px] font-bold">
          <span className="xl:whitespace-nowrap relative z-10 pr-10">
            Beauty That
          </span>
          <br />
          <span className="text-coral-red inline-block mt-3">Glows</span>
        </h1>
        <p className="font-montserrat text-slate-gray text-lg leading-8 mt-6 mb-14 sm:max-w-sm">
          From soft hues to bold statements, our products will help you bloom.
        </p>
        <Button label="Shop now" iconURL={arrowRight} />
      </div>
      <div className="relative flex-1 flex justify-center items-center xl:min-h-screen max-xl:py-40">
        <img
          src={makeup1}
          alt="makeup collection"
          width={610}
          height={502}
          className="object-contain relative z-10"
        />
      </div>
    </section>
  );
};

export default Hero;