import React, { Component } from "react";
import moment from "moment";
import { Grid, Box, Paper, Typography, Radio } from "@mui/material";
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

    let data = {
      labels: [],
      datasets: [
        {
          label: "# of Searches",
          data: [],
          backgroundColor: "rgba(255, 255, 255, 1)",
          borderColor: "rgba(255, 255, 255, 1)",
          borderWidth: 1,
        },
      ],
    };

    return (
      <Box
        className="interest-over-time"
        sx={{ marginTop: 4, marginBottom: 4 }}
      >
        <Line data={data} options={options} />
      </Box>
    );
  };

  getInterestOverTime = async (e) => {
    //console.log(new Date("2010-01-01").toISOString());
    return await axios
      .put("/google/interestOverTime", {
        searchQuery: this.props.state.previousSearchQuery,
        //startTime: new Date("2010-01-01").toISOString(),
        //endTime: new Date(Date.now()),
      })
      .then(
        (response) => {
          //console.log("response", response);
          const timelineData = JSON.parse(response.data).default.timelineData;

          //console.log(timelineData);
          this.props.setAppState("interestOverTime", timelineData);

          let data = {
            labels: this.generateLabels(timelineData),
            //labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [
              {
                label: "# of Searches",
                data: this.generateData(timelineData),
                //data: [0, 0, 5, 2, 15],
                backgroundColor: "rgba(255, 255, 255, 1)",
                borderColor: "rgba(255, 255, 255, 1)",
                borderWidth: 1,
              },
            ],
          };

          this.setState({ iotData: data });
        },
        (error) => {
          console.log(error);
        }
      );
  };

  getRelatedTopics = async (e) => {
    return await axios
      .put("/google/relatedTopics", {
        searchQuery: this.props.state.previousSearchQuery,
      })
      .then(
        (response) => {
          const rankedList = JSON.parse(response.data).default.rankedList;
          this.setState({
            trendingTopics: rankedList[rankedList.length - 1].rankedKeyword,
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
        searchQuery: this.props.state.previousSearchQuery,
      })
      .then(
        (response) => {
          const rankedList = JSON.parse(response.data).default.rankedList;
          this.setState({
            trendingQueries: rankedList[rankedList.length - 1].rankedKeyword,
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
      values.push(item.value);
    });

    return values;
  };

  trendingTopics = () => {
    return (
      <Box className="trending-topics card">
        <Typography variant="h5">Trending Topics</Typography>

        <ul>
          {this.state.trendingTopics.slice(0, 10).map((item, index) => {
            return (
              <li key={index}>
                {index + 1} - {item.topic.title}
              </li>
            );
          })}
        </ul>
      </Box>
    );
  };

  trendingQueries = () => {
    return (
      <Box className="trending-topics card">
        <Typography variant="h5">Trending Queries</Typography>

        <ul>
          {this.state.trendingQueries.slice(0, 10).map((item, index) => {
            return (
              <li key={index}>
                {index + 1} - {item.query}
              </li>
            );
          })}
        </ul>
      </Box>
    );
  };

  render() {
    return (
      <Box sx={{ paddingTop: 4, paddingBottom: 4 }}>
        <h2>Trends</h2>
        {this.filters()}
        {this.interestOverTime()}

        <Grid container spacing={2} sx={{ paddingTop: 2 }}>
          <Grid item xs={6}>
            {this.trendingTopics()}
          </Grid>
          <Grid item xs={6}>
            {this.trendingQueries()}
          </Grid>
        </Grid>
      </Box>
    );
  }
}
