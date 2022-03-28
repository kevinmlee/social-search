import React, { Component } from "react";
import moment from "moment";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Radio,
  CircularProgress,
} from "@mui/material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
//import "chartjs-plugin-trendline";

import axios from "axios";

export default class Trends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterToggle: false,

      trendingTopics: [],
      trendingQueries: [],

      iotData: {},

      recent: false,
      popular: true,
    };

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
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
    const tab = event.target.getAttribute("data-tab");

    if (tab === "recent")
      this.setState({ recent: true, popular: false, userTweets: false });
    else if (tab === "popular")
      this.setState({ recent: false, popular: true, userTweets: false });

    this.setState({ filterToggle: false });
  };

  toggle = async (state) => {
    await this.setState({ [state]: !this.state[state] });
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
          {/*<li>All</li>*/}
          <li
            className={this.state.recent ? "active" : ""}
            onClick={this.changeTab}
            data-tab="recent"
          >
            Recent
            <Radio checked={this.state.recent && "checked"} size="small" />
          </li>
          <li
            className={this.state.popular ? "active" : ""}
            onClick={this.changeTab}
            data-tab="popular"
          >
            Hot
            <Radio checked={this.state.popular && "checked"} size="small" />
          </li>
        </ul>
      </Box>
    );
  };

  interestOverTime = () => {
    let options = {
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
          <Line data={this.state.iotData} options={options} />
        </div>
      </Box>
    );
  };

  getInterestOverTime = async (e) => {
    //console.log(new Date("2010-01-01").toISOString());
    return await axios
      .put("/google/interestOverTime", {
        searchQuery: "valkyrae",
        //searchQuery: this.props.state.previousSearchQuery,
        //startTime: new Date("2010-01-01").toISOString(),
        //endTime: new Date(Date.now()),
      })
      .then(
        async (response) => {
          const timelineData = JSON.parse(response.data).default.timelineData;

          let data = {
            labels: await this.generateLabels(timelineData),
            datasets: [
              {
                label: "# of Searches",
                data: await this.generateData(timelineData),
                backgroundColor: "rgba(255, 255, 255, 1)",
                borderColor: "rgba(255, 255, 255, 1)",
                borderWidth: 1,
              },
            ],
          };

          await this.setState({ iotData: data });
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getRelatedTopics = async (e) => {
    return await axios
      .put("/google/relatedTopics", {
        searchQuery: "valkyrae",
        //searchQuery: this.props.state.previousSearchQuery,
      })
      .then(
        (response) => {
          const rankedList = JSON.parse(response.data).default.rankedList;

          this.setState({
            //trendingTopics: rankedList[rankedList.length - 1].rankedKeyword,
            trendingTopics: rankedList[0].rankedKeyword,
          });
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getRelatedQueries = async (e) => {
    return await axios
      .put("/google/relatedQueries", {
        searchQuery: "valkyrae",
        //searchQuery: this.props.state.previousSearchQuery,
      })
      .then(
        (response) => {
          const rankedList = JSON.parse(response.data).default.rankedList;
          this.setState({
            //trendingQueries: rankedList[rankedList.length - 1].rankedKeyword,
            trendingQueries: rankedList[0].rankedKeyword,
          });
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
        <h2>Trends</h2>
        {this.filters()}

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
