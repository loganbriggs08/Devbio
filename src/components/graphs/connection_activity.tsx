import React, { Component } from "react";
import Chart from "react-apexcharts";

interface Props {
  connectionImpressions: number[];
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
      categories: (string | number)[];
    };
    dataLabels: {
      enabled: boolean;
    };
    stroke: {
      curve: "smooth";
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
    tooltip: {
      enabled: false;
    };
  };
  series: {
    name: string;
    data: number[];
    color: string;
  }[];
}

class ConnectionActivityGraph extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      series: [
        {
          name: 'connection_impressions',
          data: props.connectionImpressions,
          color: "#7091F5",
        },
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
            show: true,
          },
        },
        xaxis: {
          labels: {
            show: true,
          },
          type: "datetime",
          categories: this.generateCategories(props.connectionImpressions.length),
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
            left: 10,
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

  generateCategories(length: number): (string | number)[] {
    const categories: (string | number)[] = [];
    const now: any = new Date();

    for (let i = length - 1; i >= 0; i--) {
      const timestamp = new Date(now - i * 24 * 60 * 60 * 1000);
      categories.push(timestamp.toISOString().split("T")[0]);
    }

    return categories;
  }

  render() {
    return (
      <div>
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

export default ConnectionActivityGraph;
