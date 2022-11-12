const colChartOptions = {
  series: [
    { name: 'A', data: [] }, 
    { name: 'B', data: [] }, 
    { name: 'C', data: [] },
    { name: 'D', data: [] },
    { name: 'E', data: [] },
    { name: 'FX', data: [] },
    { name: 'FN', data: [] }
  ],
  xaxis: {
    categories: [],
  },
  yaxis: {
    title: {
      text: 'Počet študentov'
    }
  },
  chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val) {
        if (val == 1)
          return val + " študent"
        else if (val == 2 || val == 3 || val == 4)
          return val + " študenti"
        else
          return val + " študentov"
      }
    }
  }
};


const pieChartOptions = {
  series: [],
  chart: {
    width: 380,
    type: 'pie',
  },
  labels: [],
  title: {
    text: 'Počet študentov'
  },
  subtitle: {
    text: ''
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
};


function createGraphs(xmlDoc) {
  let $xml = $(xmlDoc);

  $xml.find('zaznam').each(function () {
    let yearId;

    $(this).children().each(function () {
      if (this.tagName == "rok") {
        colChartOptions.xaxis.categories.unshift(this.textContent);
        pieChartOptions.subtitle.text = this.textContent;
        yearId = this.textContent.slice(-4);
      }

      else if (this.tagName == "hodnotenie") {
        $(this).children().each(function () {
          pieChartOptions.series.push(parseInt(this.textContent));
          pieChartOptions.labels.push(this.tagName);

          colChartOptions.series.find((o, i) => {
            if (o.name == this.tagName) {
              colChartOptions.series[i].data.unshift(parseInt(this.textContent));
              return;
            }
          })
        });
      }
    });

    let pieChart = new ApexCharts(document.querySelector("#chart-pie-" + yearId), pieChartOptions);
    pieChart.render();

    pieChartOptions.series = [];
    pieChartOptions.labels = [];
  });

  let colChart = new ApexCharts(document.querySelector("#chart-col"), colChartOptions);
  colChart.render();
}


$(window).on('load', function () {
  $.ajax({
    url: 'z03.xml',
    dataType: 'xml',
    success: function (xmlDoc) {
      createGraphs(xmlDoc);
    },
    error: function () {
      console.log('Failed to load xml data.');
    }
  });
});
