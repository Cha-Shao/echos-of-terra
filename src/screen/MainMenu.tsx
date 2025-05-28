const MainMenu = ({
  onStart
}: {
  onStart: () => void
}) => {
  const footerCountries = Object.entries(
    import.meta.glob(
      "../assets/images/footer/*.png",
      { eager: true }
    )
  ).map(([, value]) => (value as { default: string }).default)

  return (
    <div className="h-full relative">
      <div className="pt-40 px-16">

      </div>
      <footer
        className="h-64 bg-[url(./assets/images/bg.0ee5cc.jpg)] *:opacity-50 flex flex-col justify-center"
      >
        <div className="flex justify-center space-x-3.5 mb-4">
          {footerCountries.map((image, i) => (
            <img
              key={i}
              src={image}
              alt=""
              className="h-9"
            />
          ))}
        </div>
        <p className="text-center text-white font-[Bender-Regular] tracking-[2.5rem] text-xs">ARKNIGHTS</p>
      </footer>
    </div>
  )
}

export default MainMenu
