

const About1 = () => {
  return (
    <>
<section className="overflow-hidden pt-10 pb-6 lg:pt-24 lg:pb-16  dark:bg-dark">
  <div className="container mx-auto">
    <div className="flex flex-wrap items-center justify-between -mx-4 pl-12">
      <div className="w-full  lg:w-3/6">
        <div className="flex items-center -mx-3 sm:-mx-4">
          <div className="w-full px-3 sm:px-4 xl:w-1/2">
            <div className="py-2 sm:py-3">
              <img
                src="https://i.ibb.co/gFb3ns6/image-1.jpg"
                alt=""
                className="w-full rounded-2xl"
              />
            </div>
            <div className="py-2 sm:py-3">
              <img
                src="https://i.ibb.co/rfHFq15/image-2.jpg"
                alt=""
                className="w-full rounded-2xl"
              />
            </div>
          </div>
          <div className="w-full px-3 sm:px-4 xl:w-1/2">
            <div className="relative z-10 my-2">
              <img
                src="https://i.ibb.co/9y7nYCD/image-3.jpg"
                alt=""
                className="w-full rounded-2xl"
              />
              <span className="absolute -right-7 -bottom-7 z-[-1]">
                <svg
                  width={67}
                  height={53}
                  viewBox="0 0 67 53"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG content remains the same */}
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-4 lg:w-1/2 xl:w-6/12 pr-16">
        <div className="mt-6 lg:mt-0">
          <span className="block mb-2 text-3xl text-black font-bold text-primary">
            Why Choose Us
          </span>
          <h2 className="mb-3  text-2xl font-semibold text-dark dark:text-gray-700 ">
            Make your customers happy by giving services.
          </h2>
          <p className="mb-3 text-md text-body-color dark:text-dark-6">
           
Welcome to our pharmacy application, your trusted partner in managing and accessing healthcare solutions effortlessly. We are dedicated to transforming the way you experience pharmacy services by integrating advanced technology with personalized care. Our platform is designed to provide you with a seamless and convenient way to search for, compare, and purchase medications and healthcare products from trusted pharmacies in your area.

Our mission is to prioritize your health and convenience by offering a comprehensive and user-friendly application that meets all your pharmaceutical needs. 
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

    </>
  );
};

export default About1;