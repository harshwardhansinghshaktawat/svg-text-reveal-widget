class SvgTextReveal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isAnimating = false;
  }

  static get observedAttributes() {
    return [
      'text', 'heading-tag', 'fill-color', 'outline-color', 'background-color', 
      'background-opacity', 'font-size', 'font-family', 'animation-duration'
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
    this.handleResize = () => this.render();
    window.addEventListener('resize', this.handleResize);
    this.setupIntersectionObserver();
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.handleResize);
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isAnimating) {
          this.isAnimating = true;
          this.startAnimation();
          observer.unobserve(this);
        }
      });
    }, { threshold: 0.1 });
    this.observer.observe(this);
  }

  startAnimation() {
    const textElement = this.shadowRoot.querySelector('.animated-text');
    textElement.classList.add('animate');
  }

  render() {
    const text = this.getAttribute('text') || 'Creative Spark';
    const headingTag = this.getAttribute('heading-tag') || 'p';
    const fillColor = this.getAttribute('fill-color') || '#00CED1'; // Teal
    const outlineColor = this.getAttribute('outline-color') || '#FFFFFF'; // White
    const backgroundColor = this.getAttribute('background-color') || '#1E1E1E'; // Dark gray
    const backgroundOpacity = parseFloat(this.getAttribute('background-opacity')) || 100; // 0-100
    const bgOpacityValue = backgroundOpacity / 100;
    const bgColorWithOpacity = `${backgroundColor}${Math.round(bgOpacityValue * 255).toString(16).padStart(2, '0')}`;
    const fontSize = parseFloat(this.getAttribute('font-size')) || 10; // In vw
    const fontFamily = this.getAttribute('font-family') || 'Lobster';
    const animationDuration = parseFloat(this.getAttribute('animation-duration')) || 3; // In seconds
    const strokeDasharray = 1360; // Fixed value from original

    this.isAnimating = false;

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');

        :host {
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: ${bgColorWithOpacity};
          overflow: hidden;
        }

        .wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        svg {
          width: 100%;
          max-width: 600px;
          height: auto;
        }

        .animated-text {
          fill: none;
          stroke: ${outlineColor};
          stroke-width: 2px;
          font-size: ${fontSize}vw;
          font-family: ${fontFamily}, cursive;
          stroke-dasharray: 0;
          opacity: 0;
        }

        .animated-text.animate {
          animation: revealText ${animationDuration}s cubic-bezier(0, 0.23, 1, 0.1) forwards;
        }

        @keyframes revealText {
          0% {
            stroke: ${outlineColor};
            stroke-width: 2px;
            opacity: 0;
            fill: none;
            stroke-dasharray: 0;
          }
          30% {
            stroke: ${outlineColor};
            stroke-width: 2px;
            opacity: 1;
            fill: none;
            stroke-dasharray: ${strokeDasharray};
          }
          80% {
            stroke: ${outlineColor};
            stroke-width: 2px;
            fill: rgba(${parseInt(fillColor.slice(1, 3), 16), parseInt(fillColor.slice(3, 5), 16), parseInt(fillColor.slice(5, 7), 16), 0});
          }
          100% {
            opacity: 1;
            fill: ${fillColor};
            stroke: none;
            stroke-dasharray: ${strokeDasharray};
          }
        }
      </style>
      <div class="wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1300 399">
          <${headingTag} class="animated-text" transform="translate(6 271)">
            <tspan x="0" y="0">${text}</tspan>
          </${headingTag}>
        </svg>
      </div>
    `;
  }
}

customElements.define('svg-text-reveal', SvgTextReveal);
