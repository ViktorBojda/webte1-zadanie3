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


$(window).on('load', function () {
  let chart = new ApexCharts(document.querySelector("#chart-line-sinecosine"), chartOptions);
  chart.render();

  let closeButton = document.querySelector('#closeButton');
  let source = new EventSource("http://old.iolab.sk/evaluation/sse/sse.php/");
  let y1Array = [];
  let y2Array = [];

  source.onmessage = function (event) {
    let json = JSON.parse(event.data);
    let y1 = {'x': parseFloat(json.x), 'y': parseFloat(json.y1)};
    y1Array.push(y1);
    let y2 = {'x': parseFloat(json.x), 'y': parseFloat(json.y2)};
    y2Array.push(y2);

    chart.appendData([
      { data: [y1] },
      { data: [y2] }
    ]);
  };

  closeButton.onclick = () => {
    source.close();
  }
});
