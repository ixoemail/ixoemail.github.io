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

import { particlesCursor } from 'https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js'

const pc = particlesCursor({
  el: document.getElementById('app'),
  gpgpuSize: 512,
  colors: [0x00ff00, 0x0000ff],
  color: 0xff0000,
  coordScale: 0.5,
  noiseIntensity: 0.001,
  noiseTimeCoef: 0.0001,
  pointSize: 5,
  pointDecay: 0.0025,
  sleepRadiusX: 250,
  sleepRadiusY: 250,
  sleepTimeCoefX: 0.001,
  sleepTimeCoefY: 0.002
})

document.body.addEventListener('click', () => {
  pc.uniforms.uColor.value.set(Math.random() * 0xffffff)
  pc.uniforms.uCoordScale.value = 0.001 + Math.random() * 2
  pc.uniforms.uNoiseIntensity.value = 0.0001 + Math.random() * 0.001
  pc.uniforms.uPointSize.value = 1 + Math.random() * 10
})