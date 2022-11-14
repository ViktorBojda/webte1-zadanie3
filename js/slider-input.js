class SliderInput extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "wrapper");

        const slider = wrapper.appendChild(document.createElement("input"));
        slider.setAttribute("class", "input")
        slider.setAttribute("type", "range")

        const input = wrapper.appendChild(document.createElement("input"));
        input.setAttribute("class", "input");
        input.setAttribute("type", "number");

        let minimum = this.hasAttribute("min-val") ? this.getAttribute("min-val") : 1;
        let maximum = this.hasAttribute("max-val") ? this.getAttribute("max-val") : 10;

        slider.setAttribute("min", minimum);
        slider.setAttribute("max", maximum);
        slider.setAttribute("value", minimum);
        input.setAttribute("min", minimum);
        input.setAttribute("max", maximum);
        input.setAttribute("value", minimum);

        this.shadowRoot.append(wrapper);

        this.clickEventFunc = (event) => {
            const customEvent = new CustomEvent('btn-click', {
                bubbles: true,
                composed: true,
            });
            this.dispatchEvent(customEvent);
        }

        this.shadowRoot.querySelector(".button").addEventListener("click", this.clickEventFunc);

        
        this.inputUpdateFunc = (event) => {
            const customEvent = new CustomEvent('input-update', {
                bubbles: true,
                composed: true,
                detail: {value: event.target.value},
            });
            this.dispatchEvent(customEvent);
        }

        this.shadowRoot.querySelector(".input").addEventListener("change", this.inputUpdateFunc);
    }
}