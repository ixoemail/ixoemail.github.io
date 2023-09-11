// bad animation handling. timing is 2x too long
const FIRSTNAMES = [
	'John', 'Steve', 'Marc', 'Franklin', 'Isaac', 'Vincent', 'Edwin',
	'Ashlyn', 'Anthony', 'Alia', 'Abby', 'Francesca'
];

const LASTNAMES = [
	'Shafer', 'Whitetaker', 'Glenn', 'Stephens', 'Sherman', 'Howard',
	'Kent', 'Clay', 'Beck', 'Simmons', 'Briggs', 'Lee', 'Maxwell'
];

const TITLES = [
	'CEO', 'President', 'Vice President', 'Director', 'Manager',
	'Developer'
];

const BTN_WIDTH = 4;

document.addEventListener('DOMContentLoaded', () => {
	initCopies();
	initAutoLimits();
	initAutoIncrements();
	initAutoFirstnames();
	initAutoLastnames();
	initAutoTitles();
	initAutoIntegers();
	initPaginations();
});

function initCopies()
{
	let targets = [...document.querySelectorAll('*[data-copy]')];

	targets.reverse().forEach((original) => {
		let amount = parseInt(original.getAttribute('data-copy'));

		for (let i = 0; i < amount; i++) {
			let copy = original.cloneNode(true);

			original.parentNode.insertBefore(copy, original.nextSibling);
		}
	});
}

function initAutoIncrements()
{
	let autos = document.querySelectorAll('.auto-increment');

	autos.forEach((auto, i) => {
		auto.innerHTML = i + 1;
	});
}

const rand = (a, b) => Math.floor((Math.random() * b) + a);

function initAutoFirstnames()
{
	let autos = document.querySelectorAll('.auto-firstname');

	autos.forEach((auto) => {
		auto.innerHTML = FIRSTNAMES[rand(0, FIRSTNAMES.length)];
	});
}

function initAutoLastnames()
{
	let autos = document.querySelectorAll('.auto-lastname');

	autos.forEach((auto) => {
		auto.innerHTML = LASTNAMES[rand(0, LASTNAMES.length)];
	});
}

function initAutoTitles()
{
	let autos = document.querySelectorAll('.auto-title');

	autos.forEach((auto) => {
		auto.innerHTML = TITLES[rand(0, TITLES.length)];
	});
}

function initAutoIntegers()
{
	let autos = document.querySelectorAll('.auto-integer');

	autos.forEach((auto) => {
		let min = parseInt(auto.getAttribute('min'));
		let max = parseInt(auto.getAttribute('max'));

		auto.innerHTML = rand(min, max);
	});
}

function initPaginations()
{
	let paginations = document.querySelectorAll('.pagination');

	paginations.forEach((pagination) => {
		let table = document.getElementById(pagination.getAttribute('data-table'));

		pagination.setAttribute('data-x', '0');

		if (table !== null && table !== undefined) {
			createPagination(pagination, table);

			pagination.closest('.table-container').addEventListener('wheel', (event) => {
				event.preventDefault();

				scrollPages(
					event.wheelDelta
						? event.wheelDelta > 0
						: event.deltaY < 0, pagination,
					table
				);
			});
		}
	});
}

function createPagination(pagination, table)
{
	let limit = parseInt(table.getAttribute("data-limit"));
	let rows = table.querySelectorAll('.table-row:not(.table-heading)');
	let page_count = Math.ceil(rows.length / limit);

	if (isNaN(limit))
		limit = 10;

	rows.forEach((row, index) => {
		if (index >= limit)
			row.style.display = 'none';
	});

	for (let i = 0; i < page_count; i++) {
		let new_button = document.createElement('li');

		new_button.innerHTML = "<span>" + (i + 1) + "</span>";

		if (i === 0)
			new_button.classList.add('active');

		pagination.appendChild(new_button);

		new_button.addEventListener('click', () => {
			switchPage(pagination, table, i);
		});
	}

	updatePaginationInfos(pagination, table, page_count, 0);
	initPaginationExtremes(pagination, table, page_count);
}

function scrollPages(direction, pagination, table)
{
	let last_active = pagination.querySelector('li.active');
	let buttons = pagination.querySelectorAll('li');
	let last_index = Array.from(buttons).indexOf(last_active);
	let scroll_index = null;

	if (direction && last_index > 0) {
		scroll_index = last_index - 1;
	} else if (!direction && last_index < buttons.length - 1) {
		scroll_index = last_index + 1;
	}

	if (scroll_index !== null)
		switchPage(pagination, table, scroll_index);
}

function switchPage(pagination, table, index, bypass = -1)
{
	let limit = parseInt(table.getAttribute("data-limit"));
	let rows = table.querySelectorAll('.table-row:not(.table-heading)');
	let buttons = pagination.querySelectorAll('li');
	let last_active = pagination.querySelector('li.active');
	let x_pos = parseInt(pagination.getAttribute('data-x'));
	let x_shift = 0;
	let target_pos = (-index + 2) * BTN_WIDTH;
	let page_count = Math.ceil(rows.length / limit);

	if (bypass !== -1) {
		x_shift = (-bypass + 2) * BTN_WIDTH;
	} else {
		if (index > 1 && index < buttons.length - 2) {
			x_shift = target_pos;
		} else if (index === 1) {
			x_shift = 0;
		} else if (index === page_count - 2) {
			x_shift = (-page_count + 5) * BTN_WIDTH;
		} else {
			x_shift = x_pos;
		}
	}

	rows.forEach((row, row_index) => {
		if (row_index < index * limit || row_index >= (index * limit) + limit) {
			row.style.display = 'none';
		} else {
			row.style.display = 'flex';
			row.style.opacity = '0';

			setTimeout(() => {
				row.style.opacity = '1';
			}, 50);
		}
	});

	last_active.classList.remove('active');
	buttons[index].classList.add('active');
	pagination.style.transform = 'translateX(' + x_shift + 'rem)';
	pagination.setAttribute('data-x', x_shift);

	updatePaginationInfos(pagination, table, page_count, index);
	updatePaginationProgress(pagination, index, page_count - 1);
}

function updatePaginationInfos(pagination, table, page_count, index)
{
	let info = pagination.closest('.pagination-container').querySelector('.pagination-info');

	if (info === null || info === undefined)
		return;

	let from = 0, to = 0;
	let rows = table.querySelectorAll('.table-row:not(.table-heading)');
	let started = false;

	for (let i = 1; i < rows.length; i++) {
		let display = rows[i - 1].style.display;

		if (display !== 'none' && !started) {
			started = true;
			from = i;
		} else if ((display === 'none' && started) || i == rows.length - 1) {
			to = i == rows.length - 1 ? rows.length : i - 1;
			break;
		}
	}

	info.innerHTML = 'Displaying ' + from + '-' + to + ' on page ' + (index + 1) + '/' + page_count;
}

function initPaginationExtremes(pagination, table, max)
{
	let container = pagination.closest('.pagination-container');
	let left = container.querySelector('.pagination-left');
	let right = container.querySelector('.pagination-right');

	if (left !== null && left !== undefined) {
		left.addEventListener('click', () => {
			switchPage(pagination, table, 0, Math.min(2, max - 1));
		});
	}

	if (right !== null && right !== undefined) {
		right.addEventListener('click', () => {
			switchPage(pagination, table, max - 1, Math.max(0, max - 3));
		});
	}

	initPaginationSteppedExtremes(pagination, table, container, max);
}

function initPaginationSteppedExtremes(pagination, table, container, max)
{
	let left = container.querySelector('.pagination-left-one');
	let right = container.querySelector('.pagination-right-one');

	if (left !== null && left !== undefined) {
		left.addEventListener('click', () => {
			let last_active = pagination.querySelector('li.active');
			let buttons = pagination.querySelectorAll('li');
			let last_index = Array.from(buttons).indexOf(last_active);

			if (last_index > 0)
				switchPage(pagination, table, last_index - 1);
		});
	}

	if (right !== null && right !== undefined) {
		right.addEventListener('click', () => {
			let last_active = pagination.querySelector('li.active');
			let buttons = pagination.querySelectorAll('li');
			let last_index = Array.from(buttons).indexOf(last_active);

			if (last_index < max - 1)
				switchPage(pagination, table, last_index + 1);
		});
	}
}

function updatePaginationProgress(pagination, index, total)
{
	let dot = pagination.closest('.table-container').querySelector('.progress-point');

	dot.style.left = ((index / total) * 100) + '%';
}

function initAutoLimits()
{
	let table_containers = document.querySelectorAll('.table-container');
	let limit = window.innerHeight / 70;

	table_containers.forEach((container) => {
		let table = container.querySelector('.table');

		container.setAttribute('style', '--data-limit: ' + limit);
		table.setAttribute('data-limit', limit);
	});
}
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
      React.createElement("span", null, "Next: Factors")), /*#__PURE__*/


      React.createElement("div", { className: "slide__details" }, /*#__PURE__*/
      React.createElement("div", { className: "slide__details__title" }, "Discover the details"), /*#__PURE__*/

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


gsap.registerPlugin(ScrollTrigger);

gsap.to('.hero', {
  scrollTrigger: {
    trigger: '.get-gradient',
    start: 'top top-=10%',
		scrub: true
  },
	background: 'linear-gradient(to bottom right, rgb(110, 189, 74), rgb(206, 240, 165))'
});

gsap.to('.info__copy', {
  scrollTrigger: {
    trigger: '.font-change',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	fontFamily: 'var(--font-title)',
	textTransform: 'uppercase',
	letterSpacing: '0.1rem'
});


gsap.to('body', {
  scrollTrigger: {
    trigger: '.font-change',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	fontFamily: 'var(--font-text)',
});

gsap.to('.selection__item', {
  scrollTrigger: {
    trigger: '.add-colors',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	background: '#fff'
});



gsap.to('.info__copy', {
  scrollTrigger: {
    trigger: '.add-colors',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	color: '#fff',
	textShadow: '0 2px 10px rgba(0,0,0,0.15)',
});

gsap.to('.container', {
  scrollTrigger: {
    trigger: '.add-colors',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	background: '#F9FBE7',
	border: 'none'
});


gsap.to('.selection__more', {
  scrollTrigger: {
    trigger: '.add-colors',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	background: 'rgb(110, 189, 74)'
});


gsap.to('.selection__more svg', {
  scrollTrigger: {
    trigger: '.add-colors',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	fill: '#fff'
});


gsap.to('.selection__item img.placeholder', {
  scrollTrigger: {
    trigger: '.source-images',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	visibility : 'hidden',
});


gsap.to('.img-woman', {
  scrollTrigger: {
    trigger: '.source-images',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	opacity : 1,
});



gsap.to('.selection__item img:nth-child(1)', {
  scrollTrigger: {
    trigger: '.source-images',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	visibility : 'visible',
	opacity: 1
});




gsap.to('.container', {
  scrollTrigger: {
    trigger: '.add-border-radius',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	borderRadius: '2rem'
});

gsap.to('.hero', {
  scrollTrigger: {
    trigger: '.add-border-radius',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	borderRadius: '1.8rem 1.8rem 0 0'
});



gsap.to('.selection__item', {
  scrollTrigger: {
    trigger: '.add-border-radius',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	borderRadius: '1rem'
});
gsap.to('.selection__item', {
  scrollTrigger: {
    trigger: '.drop-shadow',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	boxShadow: '4px 5px 20px rgba(0,0,0,0.2)'

});

gsap.to('.container', {
  scrollTrigger: {
    trigger: '.drop-shadow',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	boxShadow: '15px 20px 24px rgba(119, 125, 68, 0.22)'
});

gsap.to('.selection__item.extra', {
  scrollTrigger: {
    trigger: '.overflow-element',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	duration: 1,
	scale: 1,
	translateX: '-115%',
	translateY: '',
	opacity: 1,
	ease: "power2"
});


gsap.to('.container', {
  scrollTrigger: {
    trigger: '.overflow-element',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	overflow: 'visible'
});


gsap.to('.change-bg', {
  scrollTrigger: {
    trigger: '.change-bg',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	background: '#f4f19c',
});

gsap.to('.change-bg .helper-text', {
  scrollTrigger: {
    trigger: '.change-bg',
    start: 'top top-=10%',
		end: '+=150',
		scrub: true
  },
	color: '#333'
});
