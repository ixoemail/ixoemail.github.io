

class Slideshow extends React.Component {
  constructor() {
    super();

    this.state = {
      loaded: false,
      animating: false,
      animationDirection: "",
      animationDuration: 300,
      currentSlide: 0,
      slides: [
      {
        title: "Selecciona",
        imageUrl:
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/36124/plant1.png",
        description: "Una increíble planta para tu habitación",
        details: {
          temperature: "25 grados C día 13 grados C nohe",
          water: "Verano: 2 litros Invierno: 1 litros",
          nutrition: "Garden loam, perlite, peat moss" } },


      {
        title: "Cultiva",
        imageUrl:
        "ixo.png",
        description: "Monitorea y cuida tu planta desde tu email.",
        details: {
          temperature: "35 grados C día 23 grados C noche",
          water: "Verano: 3 litros Inverno: 1.5 litros",
          nutrition: "En buen estado, buen química, bien" } }] };






    this.changeSlide = this.changeSlide.bind(this);
  }

  fireAnims(duration) {
    this.setState({
      animating: true,
      animationDirection: "out" });

    // halfway
    setTimeout(() => {
      this.setState({
        animating: true,
        animationDirection: "in" });

    }, duration / 2);
    // done
    setTimeout(() => {
      this.setState({
        animating: false,
        animationDirection: "" });

    }, duration);
  }

  changeSlide(dir) {
    const currentSlide = this.state.currentSlide;
    const slides = this.state.slides;

    if (dir === "right") {
      if (currentSlide < slides.length - 1) {
        this.fireAnims(this.state.animationDuration * 2);
        window.setTimeout(() => {
          this.setState({
            currentSlide: currentSlide + 1 });

        }, this.state.animationDuration);
      }
    } else {
      if (currentSlide > 0) {
        this.fireAnims(this.state.animationDuration * 2);
        window.setTimeout(() => {
          this.setState({
            currentSlide: currentSlide - 1 });

        }, this.state.animationDuration);
      }
    }
  }

  determineDir(delta) {
    if (delta > 0) {
      return "right";
    } else {
      return "left";
    }
  }

  componentDidMount() {
    this.setState({
      loaded: true });

  }
  render() {
    let classes = ["slideshow"];
    if (this.state.animating) {
      classes.push(
      "slideshow--animated slideshow--" + this.state.animationDirection);

    } else {
      classes = ["slideshow"];
    }
    return /*#__PURE__*/(
      React.createElement("div", { className: classes.join(" ") }, /*#__PURE__*/
      React.createElement(Slide, {
        title: this.state.slides[this.state.currentSlide].title,
        image: this.state.slides[this.state.currentSlide].imageUrl,
        description: this.state.slides[this.state.currentSlide].description,
        details: this.state.slides[this.state.currentSlide].details,
        count: this.state.currentSlide + 1,
        changeSlide: this.changeSlide,
        slideLength: this.state.slides.length })));



  }}


class Slide extends React.Component {
  constructor() {
    super();

    this.state = {};
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "slide" }, /*#__PURE__*/
      React.createElement("div", { className: "slide__decorative-sidebar" }, /*#__PURE__*/
      React.createElement("img", { src: this.props.image })), /*#__PURE__*/


      React.createElement("div", { className: "slide__info" }, /*#__PURE__*/
      React.createElement("div", { className: "slide__info__text" }, /*#__PURE__*/
      React.createElement("h1", { className: "slide__info__title" }, this.props.title), /*#__PURE__*/
      React.createElement("p", { className: "slide__info__description" }, this.props.description)), /*#__PURE__*/

      React.createElement("img", {
        src: this.props.image,
        alt: this.props.title,
        className: "slide__info__image" }), /*#__PURE__*/

      React.createElement("div", { className: "slide__arrows" }, /*#__PURE__*/
      React.createElement("a", {
        className:
        this.props.count > 1 ?
        `slide__arrows__arrow` :
        `slide__arrows__arrow slide__arrows__arrow--disabled`,

        onClick: e => this.props.changeSlide("left") },

      `<`), /*#__PURE__*/


      React.createElement("a", {
        className:
        this.props.count < this.props.slideLength ?
        `slide__arrows__arrow` :
        `slide__arrows__arrow slide__arrows__arrow--disabled`,

        onClick: e => this.props.changeSlide("right") }, ">"))), /*#__PURE__*/






      React.createElement("div", { className: "slide__next" }, /*#__PURE__*/
      React.createElement("span", null, "Monitoreo Remoto")), /*#__PURE__*/


      React.createElement("div", { className: "slide__details" }, /*#__PURE__*/
      React.createElement("div", { className: "slide__details__title" }, "$890 MXN X CADA PLANTA + DISPOSITIVO"), /*#__PURE__*/

      React.createElement("div", { className: "slide__details__block slide__details__block--temp" }, /*#__PURE__*/
      React.createElement("h3", { className: "slide__details__subtitle" }, "Temperature"), /*#__PURE__*/
      React.createElement("p", { className: "slide__details__block__description" },
      this.props.details.temperature)), /*#__PURE__*/



      React.createElement("div", { className: "slide__details__block slide__details__block--water" }, /*#__PURE__*/
      React.createElement("h3", { className: "slide__details__subtitle" }, "Water"), /*#__PURE__*/
      React.createElement("p", { className: "slide__details__block__description" },
      this.props.details.water)), /*#__PURE__*/



      React.createElement("div", { className: "slide__details__block slide__details__block--nutrition" }, /*#__PURE__*/
      React.createElement("h3", { className: "slide__details__subtitle" }, "Nutrition"), /*#__PURE__*/
      React.createElement("p", { className: "slide__details__block__description" },
      this.props.details.nutrition))), /*#__PURE__*/




      React.createElement("div", { className: "slide__count" }, /*#__PURE__*/
      React.createElement("p", { className: "slide__count__title" }, "Growner x email en 2 pasos"), /*#__PURE__*/
      React.createElement("span", { className: "slide__count__count" }, "0", /*#__PURE__*/
      React.createElement("span", null, this.props.count)))));




  }}


// RENDER

ReactDOM.render( /*#__PURE__*/React.createElement(Slideshow, null), document.getElementById("root"));



