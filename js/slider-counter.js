class SliderCounter extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});

        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "wrapper");

        const slider = wrapper.appendChild(document.createElement("input"));
        slider.setAttribute("class", "slider");
        slider.setAttribute("type", "range");

        const label = wrapper.appendChild(document.createElement("div"));
        label.setAttribute("class", "label");

        let minimum = this.hasAttribute("min-val") ? this.getAttribute("min-val") : 1;
        let maximum = this.hasAttribute("max-val") ? this.getAttribute("max-val") : 10;

        if (minimum >= maximum)
            throw new RangeError('min-val must be smaller than max-val');

        slider.setAttribute("min", minimum);
        slider.setAttribute("max", maximum);
        slider.setAttribute("value", minimum);
        label.innerHTML = minimum;

        const style = document.createElement("style");
        style.textContent = `
            .wrapper {
                position: relative;
                width: 100%;
                height: 100%;
            }
            
            .slider {
                -webkit-appearance: none;
                appearance: none;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                margin: auto;
                width: 100%;
                height: 15px;
                background: rgb(45, 57, 83);
            }
            
            .slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 50px;
                height: 30px;
                opacity: 0;
                cursor: pointer;
            }
            
            .slider::-moz-range-thumb {
                width: 50px;
                height: 30px;
                opacity: 0;
                cursor: pointer;
            }
            
            .label {
                position: relative;
                left: 0px;
                pointer-events: none;
                width: 50px;
                height: 30px;
                color: white;
                background-color: rgb(104, 135, 202);
                text-align: center;
                font-weight: bolder;
                line-height: 30px;
                border-radius: 10%;
            }
        `;

        this.shadowRoot.append(style, wrapper);

        let thumbWidth = 50;
        let offset = (slider.clientWidth - thumbWidth) / (maximum - minimum);

        window.addEventListener('resize', function() {
            offset = (slider.clientWidth - thumbWidth) / (maximum - minimum);
            let px = ((slider.valueAsNumber - minimum) * offset) - (label.clientWidth / 2) + (thumbWidth / 2);
            label.style.left = px + 'px';
        });

        this.shadowRoot.addEventListener('input', function() {
            let px = ((slider.valueAsNumber - minimum) * offset) - (label.clientWidth / 2) + (thumbWidth / 2);
            label.innerHTML = slider.value;
            label.style.left = px + 'px';
        });
    }

    getSliderValue() {
        return this.shadowRoot.querySelector('.slider').valueAsNumber;
    }

    setSliderValue(val) {
        this.shadowRoot.querySelector('.slider').value = val;
    }

    triggerInput() {
        this.shadowRoot.dispatchEvent(new Event('input'));
    }
}

window.customElements.define('slider-counter', SliderCounter);
