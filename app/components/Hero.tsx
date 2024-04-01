export const Hero = () => {
  return (
    <>
      <div
        className="h-screen w-screen hidden md:flex"
        style={{
          backgroundImage: `url('/hero.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
        }}
      >
        <div className="flex h-screen justify-center items-start lg:items-end">
          <div className="lg:ml-16 w-full flex-col space-y-10 lg:mb-12 mt-12 hidden md:flex">
            <h1 className="text-green-50 font-bold lg:text-8xl text-6xl">
              Redefining your soap.
            </h1>
            <p className="font-semibold text-white text-sm">
              Introducing a soap that will take you away from shower gel...
            </p>
          </div>
        </div>
      </div>
      <div
        className="h-screen w-screen md:hidden"
        style={{
          backgroundImage: `url('/mobile-hero.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
        }}
      >
        <div className="flex h-screen justify-center items-start lg:items-end">
          <div className="lg:ml-16 w-full flex-col space-y-10 lg:mb-12 mt-12 hidden md:flex">
            <h1 className="text-green-50 font-bold lg:text-8xl text-6xl">
              Redefining your soap.
            </h1>
            <p className="font-semibold text-white text-sm">
              Introducing a soap that will take you away from shower gel...
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
