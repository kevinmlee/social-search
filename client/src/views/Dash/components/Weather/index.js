import React, { Component } from "react";
import moment from "moment";
import axios from "axios";
import $ from "jquery";

import { Paper, Box, Typography } from "@mui/material";

/*
 * perhaps on first load, get recent hot posts from reddit
 * or worldnews
 * or provide option for both
 */

export default class Weather extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterToggle: false,

      recent: false,
      popular: true,

      celsius: true,
      fahrenheit: false,
      kelvin: false,

      latitude: "",
      longitude: "",
    };

    //this.wrapperRef = React.createRef();
    //this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = async () => {
    // ask user for location

    await this.getUserLocation();
    //await this.getGeolocation();
  };

  getUserLocation = () => {
    if (!navigator.geolocation) {
      // console.log("Geolocation is not supported by your browser");
    } else {
      //console.log("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // console.log("Found");
          // console.log("position", position);
          /* await this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          */

          this.getWeather(position.coords.latitude, position.coords.longitude);
          this.getGeolocationData(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        () => {
          //console.log("Unable to retrieve location");
        }
      );
    }
  };

  getGeolocationData = async (lat, lon) => {
    const url =
      "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" +
      lat +
      "&longitude=" +
      lon +
      "&localityLanguage=en";

    fetch(url)
      .then((res) => res.json())
      .then(
        async (result) => {
          await this.props.setAppState("geolocation", result);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  degreeSelector = (event) => {
    const tabs = ["celsius", "fahrenheit", "kelvin"];
    const selectedTab = event.currentTarget.getAttribute("data-degrees");

    tabs.forEach((tab) => {
      if (tab === selectedTab) this.setState({ [tab]: true });
      else this.setState({ [tab]: false });
    });
  };

  getGeolocation = async (lat, lon) => {
    return await axios.get("/get/geolocation", { lat: lat, lon: lon }).then(
      async (response) => {
        await this.props.setAppState("geolocation", response);
        return;
      },
      (error) => {
        console.log(error);
      }
    );
  };

  getWeather = async (lat, lon) => {
    return await axios
      .put("/get/weather", {
        //lat: this.props.state.geolocation.data.latitude,
        //lon: this.props.state.geolocation.data.longitude,
        lat: lat,
        lon: lon,
      })
      .then(
        (response) => {
          this.props.setAppState("weather", response);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  convertDegrees = (temp, unit) => {
    if (this.state.celsius) return temp;
    else if (this.state.fahrenheit) return (temp * 9) / 5 + 32;
    else if (this.state.kelvin) return temp + 273.15;
  };

  render() {
    const geolocation =
      "city" in this.props.state.geolocation && this.props.state.geolocation;

    const current =
      "data" in this.props.state.weather &&
      this.props.state.weather.data.current;

    const daily =
      "data" in this.props.state.weather && this.props.state.weather.data.daily;

    return (
      <Box id="weather" sx={{ paddingTop: 2, paddingBottom: 2 }}>
        <Typography variant="h5">Weather</Typography>

        {"data" in this.props.state.weather && (
          <Paper className="card" sx={{ marginTop: 2 }}>
            <div className="location">
              {geolocation.city}, {geolocation.principalSubdivision}
            </div>

            <Box id="currentConditions">
              <div className="text">
                <div className="status">{current.weather[0].main}</div>
                <div className="temp">
                  {parseInt(this.convertDegrees(current.temp))}°
                </div>
                <div className="humidity">Humidity: {current.humidity}%</div>
              </div>
              <div className="current-icon">
                <i className={"icon wi wi-" + current.weather[0].icon}></i>
              </div>
            </Box>

            <Box id="dailyConditions">
              {daily.map((day, index) => {
                const date = moment.unix(day.dt).format("ddd");
                if (index < 5)
                  return (
                    <div className="day" key={index}>
                      <div className="date">
                        {moment.unix(current.dt).format("ddd") === date
                          ? "Today"
                          : moment.unix(day.dt).format("ddd")}
                      </div>

                      <div className="icon">
                        <i className={"wi wi-" + day.weather[0].icon}></i>
                      </div>

                      <div className="high">
                        {parseInt(this.convertDegrees(day.temp.max))}°
                      </div>
                      <div className="low">
                        {parseInt(this.convertDegrees(day.temp.min))}°
                      </div>
                    </div>
                  );
              })}
            </Box>

            <ul id="degree-selector">
              <li
                className={this.state.celsius ? "active" : ""}
                onClick={this.degreeSelector}
                data-degrees="celsius"
              >
                °C
              </li>
              <li
                className={this.state.fahrenheit ? "active" : ""}
                onClick={this.degreeSelector}
                data-degrees="fahrenheit"
              >
                °F
              </li>
              <li
                className={this.state.kelvin ? "active" : ""}
                onClick={this.degreeSelector}
                data-degrees="kelvin"
              >
                °K
              </li>
            </ul>
          </Paper>
        )}
      </Box>
    );
  }
}
