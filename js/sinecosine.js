const chartOptions = {
  series: [
    { name: "y1", data: [] },
    { name: "y2", data: [] },
  ],
  chart: {
    height: 350,
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight'
  },
  title: {
    text: 'Zašumený sínus a kosínus',
    align: 'left'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  xaxis: {
    type: 'numeric',
  },
  yaxis: {
    decimalsInFloat: 3
  }
};


function checkVisibilitySettings() {
  let y1 = $('#y1-checkbox').prop('checked');
  let y2 = $('#y2-checkbox').prop('checked');

  chart.updateSeries([
    { data: y1NewArray },
    { data: y2NewArray }
  ]);

  if (!y1 && !y2) {
    chart.hideSeries('y1');
    chart.hideSeries('y2');
  }
  else if (!y1 && y2) {
    chart.hideSeries('y1');
    chart.showSeries('y2');
  }
  else if (y1 && !y2) {
    chart.hideSeries('y2');
    chart.showSeries('y1');
  }
  else {
    chart.showSeries('y1');
    chart.showSeries('y2');
  }
}

$('#y1-checkbox').on('change', function() {
  checkVisibilitySettings();
});
$('#y2-checkbox').on('change', function() {
  checkVisibilitySettings();
});

$('#slider-checkbox').on('change', function() {
  let $slider = $('#amplitude-slider');
  if ($(this).prop('checked'))
    $slider.css('visibility', 'visible');
  else
    $slider.css('visibility', 'hidden');
});

$('#number-checkbox').on('change', function() {
  let $number = $('#amplitude-number');
  if ($(this).prop('checked'))
    $number.css('visibility', 'visible');
  else
    $number.css('visibility', 'hidden');
});


function validateInputNumber() {
  let $slider = $('#amplitude-slider');
  let $number = $('#amplitude-number');

  let min = parseInt($slider.attr('min-val'));
  let max = parseInt($slider.attr('max-val'));
  let val = parseInt($number.val());

  if (Number.isNaN(val))
    return;
  else {
    if (val < min) {
      $number.val(min);
      $slider[0].setSliderValue(min);
    }
    else if (val > max) {
      $number.val(max);
      $slider[0].setSliderValue(max);
    }
    else
      $slider[0].setSliderValue(val);

    $slider[0].triggerInput();
  }
}


function setChartAmplitude(val) {
  y1NewArray = structuredClone(y1Array);
  y2NewArray = structuredClone(y2Array);

  y1NewArray.forEach((elm) => {
    elm.y = elm.y * val;
  });
  y2NewArray.forEach((elm) => {
    elm.y = elm.y * val;
  });

  amplitude = val;
  checkVisibilitySettings();
}


function checkAmplitudeSettings(elm) {
  let $slider = $('#amplitude-slider')[0];
  let $number = $('#amplitude-number');

  if (elm.id == 'amplitude-slider') {
    $number.val($slider.getSliderValue());
    setChartAmplitude($slider.getSliderValue());
  }
  else if (elm.id == 'amplitude-number') {
    validateInputNumber();
    setChartAmplitude($number.val());
  }
  else {
    console.error('Error: Invalid argument in checkAmplitudeSettings function');
  }
}


$('#amplitude-slider').on('input', function() {
  checkAmplitudeSettings(this);
});
$('#amplitude-number').on('input', function() {
  checkAmplitudeSettings(this);
});


let chart = new ApexCharts(document.querySelector("#chart-line-sinecosine"), chartOptions);
chart.render();

let closeButton = document.querySelector('#closeButton');
let source = new EventSource("http://old.iolab.sk/evaluation/sse/sse.php/");
let y1Array = [];
let y2Array = [];
let y1NewArray = [];
let y2NewArray = [];
let amplitude;

checkAmplitudeSettings(document.getElementById('amplitude-slider'));

source.onmessage = function (event) {
  let json = JSON.parse(event.data);
  let y1 = {'x': parseFloat(json.x), 'y': parseFloat(json.y1)};
  let y2 = {'x': parseFloat(json.x), 'y': parseFloat(json.y2)};

  y1Array.push(y1);
  y2Array.push(y2);

  let y1New = structuredClone(y1);
  y1New.y *= amplitude;
  let y2New = structuredClone(y2);
  y2New.y *= amplitude;

  y1NewArray.push(y1New);
  y2NewArray.push(y2New);

  chart.appendData([
    { data: [y1New] },
    { data: [y2New] }
  ]);
};

closeButton.onclick = () => {
  source.close();
  
  chart.updateOptions({
    chart: {
      zoom: {
        enabled: true
      }
    }
  })
}

