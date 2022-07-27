import React, { Component } from "react";
import moment from "moment";
import { Grid, Box, Typography, Radio } from "@mui/material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

//import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
//import "chartjs-plugin-trendline";

import axios from "axios";

import "./Trends.css";

export default class Trends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterToggle: false,

      trendingTopics: [],
      trendingQueries: [],
      iotData: {},

      full: true,
      twelveMonths: false,
      sixMonths: false,
    };

    // this.wrapperRef = React.createRef();
    //this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = () => {
    document.addEventListener("mousedown", this.handleClickOutside);

    this.getInterestOverTime();
    this.getRelatedTopics();
    this.getRelatedQueries();
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target))
      this.setState({ filterToggle: false });
  };

  changeTab = (event) => {
    const tabs = ["full, twelveMonths, sixMonths"];
    const selectedTab = event.target.getAttribute("data-tab");

    tabs.forEach((tab) => {
      if (tab === selectedTab) this.setState({ [tab]: true });
      else this.setState({ [tab]: false });
    });

    this.setState({ filterToggle: false });
    //this.iotFilter(selectedTab);
  };

  toggle = async (state) => {
    await this.setState({ [state]: !this.state[state] });
  };

  iotFilter = async (filter) => {
    const currentDay = moment(new Date(Date.now())).format("MMM D YYYY");

    let iotData = this.state.iotData;
    let newIotDataset = [];

    let filteredLabels = this.state.iotData.labels.filter((item, index) => {
      if (moment(currentDay).diff(moment(item), "months", true) < 12)
        newIotDataset.push(iotData.datasets[0].data[index]);

      return moment(currentDay).diff(moment(item), "months", true) < 12;
    });

    iotData.labels = filteredLabels;
    iotData.datasets[0].data = newIotDataset;

    //console.log("newIotData", iotData);
    await this.setState({ iotData });
  };

  filters = () => {
    return (
      <Box className="filter">
        <div
          className="active-display"
          onClick={() => this.toggle("filterToggle")}
        >
          <span className="active-filter">Filter</span>
          <TuneRoundedIcon />
        </div>
        <ul
          className={"filter-options " + (this.state.filterToggle && "active")}
          ref={this.wrapperRef}
        >
          <li
            className={this.state.full ? "active" : ""}
            onClick={this.changeTab}
            data-tab="full"
          >
            2004 - Present
            <Radio checked={this.state.full && "checked"} size="small" />
          </li>
          <li
            className={this.state.twelveMonths ? "active" : ""}
            onClick={this.changeTab}
            data-tab="twelveMonths"
          >
            Past 12 months
            <Radio
              checked={this.state.twelveMonths && "checked"}
              size="small"
            />
          </li>
          <li
            className={this.state.sixMonths ? "active" : ""}
            onClick={this.changeTab}
            data-tab="sixMonths"
          >
            Past 6 months
            <Radio checked={this.state.sixMonths && "checked"} size="small" />
          </li>
        </ul>
      </Box>
    );
  };

  interestOverTime = () => {
    let options = {
      plugins: {
        legend: {
          display: false,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    return (
      <Box
        className="interest-over-time"
        sx={{ paddingTop: 4, paddingBottom: 2 }}
      >
        <div className="card">
          <Typography variant="h5" sx={{ paddingBottom: 2 }}>
            Interest over time
          </Typography>
          <Line id="iot" data={this.state.iotData} options={options} />
        </div>
      </Box>
    );
  };

  getInterestOverTime = async (e) => {
    return await axios
      .put("/google/interestOverTime", {
        //searchQuery: "valkyrae",
        searchQuery: this.props.state.previousSearchQuery,
        //startTime: new Date("2010-01-01").toISOString(),
        //endTime: new Date(Date.now()),
        //time: "today 12-m",
        granularTimeResolution: true,
      })
      .then(
        async (response) => {
          const timelineData = JSON.parse(response.data).default.timelineData;
          //console.log(timelineData);

          let borderColor = "";
          if (window.matchMedia("(prefers-color-scheme: dark)").matches)
            borderColor = "rgba(255, 255, 255, 1)";
          else if (window.matchMedia("(prefers-color-scheme: light)").matches)
            borderColor = "rgba(0, 0, 0, 1)";

          let iotData = {
            labels: await this.generateLabels(timelineData),
            datasets: [
              {
                label: "Peak popularity",
                data: await this.generateData(timelineData),
                //backgroundColor: "rgba(255, 255, 255, 1)",
                borderColor: borderColor,
                //backgroundColor: gradient,
                //pointBackgroundColor: "white",
                //borderWidth: 1,
              },
            ],
          };

          await this.setState({ iotData });
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getRelatedTopics = async (e) => {
    return await axios
      .put("/google/relatedTopics", {
        //searchQuery: "valkyrae",
        searchQuery: this.props.state.previousSearchQuery,
      })
      .then(
        (response) => {
          // if response is as expected
          if ("default" in JSON.parse(response.data)) {
            const rankedList = JSON.parse(response.data).default.rankedList;
            this.setState({ trendingTopics: rankedList[0].rankedKeyword });
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getRelatedQueries = async (e) => {
    return await axios
      .put("/google/relatedQueries", {
        //searchQuery: "valkyrae",
        searchQuery: this.props.state.previousSearchQuery,
      })
      .then(
        (response) => {
          // if response is as expected
          if ("default" in JSON.parse(response.data)) {
            const rankedList = JSON.parse(response.data).default.rankedList;
            this.setState({ trendingQueries: rankedList[0].rankedKeyword });
          }
        },
        (error) => {
          console.log(error);
        }
      );
  };

  generateLabels = (data) => {
    let labels = [];

    data.forEach((item) => {
      labels.push(item.formattedAxisTime);
    });

    return labels;
  };

  generateData = (data) => {
    let values = [];

    data.forEach((item) => {
      values.push(item.value[0]);
    });

    return values;
  };

  render() {
    return (
      <Box sx={{ paddingTop: 4, paddingBottom: 4 }}>
        {/*this.filters()*/}

        {"datasets" in this.state.iotData && this.interestOverTime()}

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box className="trending-topics card">
              <Typography variant="h5">Related Topics</Typography>

              <ul>
                {this.state.trendingTopics.slice(0, 10).map((item, index) => {
                  return (
                    <li key={index}>
                      <Grid container spacing={2} sx={{ alignItems: "center" }}>
                        <Grid item xs={1}>
                          {index + 1}
                        </Grid>
                        <Grid item xs={9}>
                          {item.topic.title} ({item.topic.type})
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          sx={{ textAlign: "right" }}
                        >{`${item.value}%`}</Grid>
                      </Grid>
                    </li>
                  );
                })}
              </ul>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box className="trending-topics card">
              <Typography variant="h5">Related Queries</Typography>

              <ul>
                {this.state.trendingQueries.slice(0, 10).map((item, index) => {
                  return (
                    <li key={index}>
                      <Grid container spacing={2} sx={{ alignItems: "center" }}>
                        <Grid item xs={1}>
                          {index + 1}
                        </Grid>
                        <Grid item xs={9}>
                          {item.query}
                        </Grid>
                        <Grid item xs={2} sx={{ textAlign: "right" }}>
                          {`${item.value}%`}
                        </Grid>
                      </Grid>
                    </li>
                  );
                })}
              </ul>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
}
