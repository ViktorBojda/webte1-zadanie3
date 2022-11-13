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
  title: {
    text: 'Štatistika známok',
    align: 'center'
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
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 650
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        xaxis: {
          title: {
            text: 'Počet študentov'
          }
        },
        yaxis: {
          title: {
            text: ''
          }
        },
        legend: {
          position: 'right',
        }
      }
    }
  ]
};


const pieChartOptions = {
  series: [],
  chart: {
    width: 380,
    type: 'pie',
  },
  labels: [],
  title: {
    text: 'Štatistika známok',
    align: 'center'
  },
  subtitle: {
    text: '',
    align: 'center'
  },
  legend: {
    position: 'bottom'
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


const lineChartOptions = {
  series: [{
    name: "Študentov",
    data: []
  }],
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
    text: 'Úspešnosť absolvovania',
    align: 'left'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5
    },
  },
  xaxis: {
    categories: [],
  },
  yaxis: {
    labels: {
      formatter: (val) => {return val + ' %'}
    }
  }
}


function createGraphs(xmlDoc) {
  let $xml = $(xmlDoc);

  $xml.find('zaznam').each(function () {
    let yearId;

    $(this).children().each(function () {
      if (this.tagName == "rok") {
        colChartOptions.xaxis.categories.unshift(this.textContent);

        pieChartOptions.subtitle.text = this.textContent;
        yearId = this.textContent.slice(-4);

        lineChartOptions.xaxis.categories.unshift(this.textContent);
      }

      else if (this.tagName == "hodnotenie") {
        let totalStudents = 0;
        let failedStudents = 0;

        $(this).children().each(function () {
          let currStudents = parseInt(this.textContent);

          if (this.tagName == 'FX' || this.tagName == 'FN')
            failedStudents += currStudents;

          totalStudents += currStudents;

          pieChartOptions.series.push(currStudents);
          pieChartOptions.labels.push(this.tagName);

          colChartOptions.series.find((o, i) => {
            if (o.name == this.tagName) {
              colChartOptions.series[i].data.unshift(currStudents);
              return;
            }
          })
        });

        lineChartOptions.series[0].data.unshift(+(100 - (failedStudents / totalStudents * 100)).toFixed(2));
      }
    });

    let pieChart = new ApexCharts(document.querySelector("#chart-pie-" + yearId), pieChartOptions);
    pieChart.render();

    pieChartOptions.series = [];
    pieChartOptions.labels = [];
  });

  let colChart = new ApexCharts(document.querySelector("#chart-col"), colChartOptions);
  colChart.render();

  let lineChart = new ApexCharts(document.querySelector("#chart-line"), lineChartOptions);
  lineChart.render();
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
