let chartOptions = {
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
  }
};


let chart = new ApexCharts(document.querySelector("#chart-line-sinecosine"), chartOptions);
chart.render();

let closeButton = document.querySelector('#closeButton');
let source = new EventSource("http://old.iolab.sk/evaluation/sse/sse.php/");
let y1Array = [];
let y2Array = [];

source.onmessage = function (event) {
  let json = JSON.parse(event.data);
  let y1 = {'x': parseFloat(json.x), 'y': parseFloat(json.y1)};
  let y2 = {'x': parseFloat(json.x), 'y': parseFloat(json.y2)};

  y1Array.push(y1);
  y2Array.push(y2);

  chart.appendData([
    { data: [y1] },
    { data: [y2] }
  ]);
};

closeButton.onclick = () => {
  source.close();
}

function checkVisibilitySettings() {
  let y1 = $('#y1-checkbox').prop('checked');
  let y2 = $('#y2-checkbox').prop('checked');

  chart.updateSeries([
    { data: y1Array },
    { data: y2Array }
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
  let $slider = $('#amplitude-slider')[0];
  let $number = $('#amplitude-number')[0];

  let min = parseInt($slider.attr('min-val'));
  let max = parseInt($slider.attr('max-val'));
  let val = parseInt($number.val());

  if (val < min)
    $number.val(min);
  else if (val > max)
    $number.val(max);
  else
    $slider.val(val);
}


function setChartAmplitude(val) {
  y1Array.forEach((elm) => {
    elm.y = elm.y * val;
  });
  y2Array.forEach((elm) => {
    elm.y = elm.y * val;
  });
}


function checkAmplitudeSettings(elm) {
  let $slider = $('#amplitude-slider')[0];
  let $number = $('#amplitude-number');

  if (elm.id == 'amplitude-slider') {
    $number.val($slider.val());
    setChartAmplitude($slider.val());
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
  checkVisibilitySettings();
});
$('#amplitude-number').on('input', function() {
  checkAmplitudeSettings(this);
  checkVisibilitySettings();
});

