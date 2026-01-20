import Image from "next/image";
import aboutImage from "../../public/about.png";
const AboutSection = () => {
  return (
    <section id="about" className="pb-20">
      <div className="container mx-auto px-4">
        <div className="flex md:flex-row flex-col justify-center items-center ">
          <div className="md:w-[50%] w-full">
            <Image src={aboutImage} alt={"about"}
            width={999}
            height={999} 
            priority/>
          </div>
         <div className="md:w-[50%] w-full">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-6">
              About FuelFlow
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              FuelFlow is designed specifically for petrol pump owners and
              managers. Our platform brings together robust features and an
              intuitive interface, allowing you to effortlessly manage sales,
              track inventory, monitor staff attendance, and generate insightful
              reports—all from a single dashboard. Whether you run a single
              station or oversee multiple locations, FuelFlow grows with your
              business, helping you operate smarter and more efficiently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
