export const Hero = () => {
  return (
    <div
      className="h-screen w-screen"
      style={{
        backgroundImage: `url('/hero.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 1,
      }}
    >
      <div className="flex h-screen justify-center items-start lg:items-end">
        <div className="lg:ml-16 w-full flex flex-col space-y-10 lg:mb-12 mt-12">
          <h1 className="text-green-50 font-bold lg:text-8xl text-6xl">
            Redefining your soap.
          </h1>
          <p className="font-semibold text-white text-sm">
            Introducing a soap that will take you away from shower gel...
          </p>
        </div>
      </div>
    </div>
  );
};
