/* eslint-disable react/jsx-key */
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContexts";

export default function Cart() {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("token"); // Get the token from local storage

      if (!user.id) {
        alert("User ID not found");
        return;
      }

      const response = await fetch(
        `http://localhost:8081/payment/get-cart`, // Simplified URL, as userId is derived from the token
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token, // Include the token in the request headers
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCartItems(data); // Set the cart items

        // Calculate total number of items
        const totalItems = data.length;
        setTotalItems(totalItems);

        // Calculate total price
        const totalPrice = data.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        setTotalPrice(totalPrice);
      } else {
        alert("An error occurred while fetching the cart items");
      }
    };

    fetchCartItems();
  }, [user.id]);

  return (
    <section className="relative z-10 after:contents-[''] after:absolute after:z-0 after:h-full xl:after:w-1/3 after:top-0 after:right-0 after:bg-gray-50">
      <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto relative z-10">
        <div className="grid grid-cols-12">
          <div className="col-span-12 xl:col-span-8 lg:pr-8 pt-14 pb-8 lg:py-24 w-full max-xl:max-w-3xl max-xl:mx-auto">
            <div className="flex items-center justify-between pb-8 border-b border-gray-300">
              <h2 className="font-manrope font-bold text-3xl leading-10 text-black">
                Shopping Cart
              </h2>
              <h2 className="font-manrope font-bold text-xl leading-8 text-gray-600">
                {totalItems} Items
              </h2>
            </div>
            <div className="grid grid-cols-12 mt-8 max-md:hidden pb-6 border-b border-gray-200">
              <div className="col-span-12 md:col-span-7">
                <p className="font-normal text-lg leading-8 text-gray-400">
                  Product Details
                </p>
              </div>
              <div className="col-span-12 md:col-span-5">
                <div className="grid grid-cols-5">
                  <div className="col-span-3">
                    <p className="font-normal text-lg leading-8 text-gray-400 text-center">
                      Quantity
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-normal text-lg leading-8 text-gray-400 text-center">
                      Total
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {cartItems.map((item) => (
              <div className="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-5 py-6 border-b border-gray-200 group">
                <div className="w-full md:max-w-[126px]">
                  <img
                    src="https://pagedone.io/asset/uploads/1701162850.png"
                    alt="perfume bottle image"
                    className="mx-auto"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 w-full">
                  <div className="md:col-span-2">
                    <div className="flex flex-col max-[500px]:items-center gap-3">
                      <h6 className="font-semibold text-base leading-7 text-black">
                        {item.name}
                      </h6>
                      <h6 className="font-normal text-base leading-7 text-gray-500">
                        {item.produced}
                      </h6>
                      <h6 className="font-medium text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-indigo-600">
                        {item.price}€
                      </h6>
                    </div>
                  </div>
                  <div className="flex items-center max-[500px]:justify-center h-full max-md:mt-3">
                    <div className="flex items-center h-full">
                      <button className="group rounded-l-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300">
                        <svg
                          className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                        >
                          <path d="M16.5 11H5.5" stroke="" />
                          <path d="M16.5 11H5.5" />
                          <path d="M16.5 11H5.5" />
                        </svg>
                      </button>
                      <input
                        type="text"
                        className="border-y border-gray-200 outline-none text-gray-900 font-semibold text-lg w-full max-w-[73px] min-w-[60px] placeholder:text-gray-900 py-[15px] text-center bg-transparent"
                        placeholder={item.quantity}
                      />
                      <button className="group rounded-r-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300">
                        <svg
                          className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                        >
                          <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" />
                          <path d="M11 5.5V16.5M16.5 11H5.5" />
                          <path d="M11 5.5V16.5M16.5 11H5.5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center max-[500px]:justify-center md:justify-end max-md:mt-3 h-full">
                    <p className="font-bold text-lg leading-8 text-gray-600 text-center transition-all duration-300 group-hover:text-indigo-600">
                      {item.price}€
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-span-12 xl:col-span-4 bg-gray-50 w-full max-xl:px-6 max-w-3xl xl:max-w-lg mx-auto lg:pl-8 py-24">
            <h2 className="font-manrope font-bold text-3xl leading-10 text-black pb-8 border-b border-gray-300">
              Order Summary
            </h2>

            <div className="flex flex-col max-w-md p-6 space-y-4">
              {cartItems.map((item) => (
                <ul className="flex flex-col pt-4 space-y-2">
                  <li className="flex items-start justify-between">
                    <h3>
                      {item.name}
                      <span className="text-sm dark:text-violet-400">
                        {" "}
                        x{item.quantity}
                      </span>
                    </h3>
                    <div className="text-right">
                      <span className="block">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <span className="text-sm dark:text-gray-400">
                      PPU ${item.price}
                      </span>
                    </div>
                  </li>
                </ul>
              ))}

              <div className="pt-4 space-y-2">
                <div className="space-y-6">
                  <a href="">{totalItems} Items</a>
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-semibold">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="w-full py-2 font-semibold border rounded dark:bg-indigo-600 dark:text-white dark:border-violet-400"
                  >
                    Go to checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
