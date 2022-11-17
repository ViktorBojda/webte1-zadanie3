class SliderCounter extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "wrapper");

        const slider = wrapper.appendChild(document.createElement("input"));
        slider.setAttribute("class", "input")
        slider.setAttribute("type", "range")

        const output = wrapper.appendChild(document.createElement("div"));
        output.setAttribute("class", "div");

        let minimum = this.hasAttribute("min-val") ? this.getAttribute("min-val") : 1;
        let maximum = this.hasAttribute("max-val") ? this.getAttribute("max-val") : 10;

        slider.setAttribute("min", minimum);
        slider.setAttribute("max", maximum);
        slider.setAttribute("value", minimum);
        output.innerHTML = minimum;

        const style = document.createElement("style");
        style.textContent = '';

        this.shadowRoot.append(wrapper);

        // this.clickEventFunc = (event) => {
        //     const customEvent = new CustomEvent('btn-click', {
        //         bubbles: true,
        //         composed: true,
        //     });
        //     this.dispatchEvent(customEvent);
        // }

        // this.shadowRoot.querySelector(".button").addEventListener("click", this.clickEventFunc);

        
        // this.inputUpdateFunc = (event) => {
        //     const customEvent = new CustomEvent('input-update', {
        //         bubbles: true,
        //         composed: true,
        //         detail: {value: event.target.value},
        //     });
        //     this.dispatchEvent(customEvent);
        // }

        // this.shadowRoot.querySelector(".input").addEventListener("change", this.inputUpdateFunc);
    }
}

window.customElements.define('slider-counter', SliderCounter);
