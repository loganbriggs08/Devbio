import React, { Component } from "react";
import Chart from "react-apexcharts";

interface Props {
  views: number[];
}

interface State {
  options: {
    chart: {
      id: string;
      type: "area";
      height: number;
      toolbar: {
        show: boolean;
      };
    };
    yaxis: {
      labels: {
        show: boolean;
      };
    };
    xaxis: {
      labels: {
        show: boolean;
      };
      type: "datetime";
      categories: string[];
    };
    dataLabels: {
      enabled: boolean;
    };
    stroke: {
      curve: "smooth" | "straight" | "stepline";
    };
    legend: {
      show: boolean;
    };
    grid: {
      padding: {
        left: number;
        right: number;
      };
      xaxis: {
        lines: {
          show: boolean;  
        };
      };
      yaxis: {
        lines: {
          show: boolean;
        };
      };
    };
    tooltip: {};
  };
  series: {
    name: string;
    data: number[];
    color: string;
  }[];
}

class ViewsGraph extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const categories: string[] = [];
    const now: any = new Date();

    const startDate = new Date(now - props.views.length * 24 * 60 * 60 * 1000);

    for (let i = 0; i < props.views.length; i++) {
      const timestamp = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      categories.push(timestamp.toISOString().split('T')[0]);
    }

    this.state = {
      series: [
        {
          name: 'views',
          data: props.views,
          color: "#7091F5"
        }
      ],
      options: {
        chart: {
          id: "basic-bar",
          type: "area",
          height: 280,
          toolbar: {
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
        xaxis: {
          labels: {
            show: true,
          },
          type: "datetime",
          categories: categories,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        legend: {
          show: false,
        },
        grid: {
          padding: {
            left: -25,
            right: 0,
          },
          xaxis: {
            lines: {
              show: false,
            },
          },
          yaxis: {
            lines: {
              show: false,
            },
          },
        },
        tooltip: {
          enabled: false,
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type={this.state.options.chart.type}
          height={this.state.options.chart.height}
        />
      </div>
    );
  }
}

export default ViewsGraph;
