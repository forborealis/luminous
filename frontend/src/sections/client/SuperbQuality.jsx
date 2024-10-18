import { makeup4 } from "../../assets/images";
import { Button } from "../../components/client";

const SuperQuality = () => {
  return (
    <section
      id="about-us"
      className="flex justify-between items-center max-lg:flex-col gap-10 w-full max-container"
    >
      <div className="flex flex-1 flex-col">
        <h2 className="font-palanquin capitalize text-4xl lg:max-w-lg font-bold">
          We Provide
          <span className="text-coral-red"> Top </span>
          <span className="text-coral-red">Quality </span> Makeup Products
        </h2>
        <p className="mt-4 lg:max-w-lg info-text">
        Each product is crafted with care to deliver long-lasting wear and radiant results.
        Perfect for every skin tone, our makeup line offers something for every cosmetics lover.
        </p>
        <div className="mt-11">
          <Button label="View details" />
        </div>
      </div>
      <div className="flex flex-1 justify-center items-center">
        <img
          src={makeup4}
          alt="Top Quality Makeup"
          className="h-120 rounded-lg object-contain" 
        />
      </div>
    </section>
  );
};

export default SuperQuality;