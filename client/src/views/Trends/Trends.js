import React, { useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import moment from "moment"
import axios from "axios"

import { Grid, Box, Typography, Radio } from "@mui/material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded"
//import Chart from "chart.js/auto"
import { Line } from "react-chartjs-2"
//import "chartjs-plugin-trendline"
import "./Trends.css"


export default function Trends() {
  const { query } = useParams()
  const ref = useRef(null)
  const [filterToggle, setFilterToggle] = useState(false)
  const [trendingTopics, setTrendingTopics] = useState([])
  const [trendingQueries, setTrendingQueries] = useState([])
  const [iotData, setIotData] = useState({})
  const [twelveMonths, setTwelveMonths] = useState(false)
  const [sixMonths, setSixMonths] = useState(false)
  const [full, setFull] = useState(true)

  const getInterestOverTime = useCallback(async () => {
    await fetch(`/.netlify/functions/interestOverTime`, {
      method: "POST",
      body: JSON.stringify({
        searchQuery: query,
        //startTime: new Date("2010-01-01").toISOString(),
        //endTime: new Date(Date.now()),
        //time: "today 12-m",
        granularTimeResolution: true
      }),
    }).then(response => {
      console.log('getInterestOverTime', response)

      /*
      const timelineData = JSON.parse(response.data).default.timelineData
      //console.log(timelineData);

      let borderColor = ""
      if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        borderColor = "rgba(255, 255, 255, 1)"
      else if (window.matchMedia("(prefers-color-scheme: light)").matches)
        borderColor = "rgba(0, 0, 0, 1)"

      let iotData = {
        labels: generateLabels(timelineData),
        datasets: [
          {
            label: "Peak popularity",
            data: generateData(timelineData),
            //backgroundColor: "rgba(255, 255, 255, 1)",
            borderColor: borderColor,
            //backgroundColor: gradient,
            //pointBackgroundColor: "white",
            //borderWidth: 1,
          }
        ]
      }

      setIotData(iotData)
      */
    })
  }, [query])

  const getRelatedTopics = useCallback(async () => {
    return await axios
      .put("/google/relatedTopics", {
        //searchQuery: "valkyrae",
        searchQuery: query
      })
      .then(
        response => {
          // if response is as expected
          if ("default" in JSON.parse(response.data)) {
            const rankedList = JSON.parse(response.data).default.rankedList
            setTrendingTopics(rankedList[0].rankedKeyword)
          }
        },
        error => console.log(error)
      )
  }, [query])

  const getRelatedQueries = useCallback(async () => {
    return await axios
      .put("/google/relatedQueries", {
        //searchQuery: "valkyrae",
        searchQuery: query,
      })
      .then(
        response => {
          // if response is as expected
          if ("default" in JSON.parse(response.data)) {
            const rankedList = JSON.parse(response.data).default.rankedList
            setTrendingQueries(rankedList[0].rankedKeyword)
          }
        },
        error => console.log(error)
      )
  }, [query])

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)

    getInterestOverTime()
    getRelatedTopics()
    getRelatedQueries()

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [getInterestOverTime, getRelatedTopics, getRelatedQueries])

  const handleClickOutside = (event) => {
    if (ref && !ref.current.contains(event.target)) setFilterToggle(false)
  }

  const changeTab = (event) => {
    /*
    const tabs = ["full, twelveMonths, sixMonths"];
    const selectedTab = event.target.getAttribute("data-tab");

    tabs.forEach((tab) => {
      if (tab === selectedTab) this.setState({ [tab]: true });
      else this.setState({ [tab]: false });
    });

    setFilterToggle(false)
    //this.iotFilter(selectedTab);
    */
  }

 const iotFilter = async (filter) => {
    const currentDay = moment(new Date(Date.now())).format("MMM D YYYY")

    let newIotData = iotData
    let newIotDataset = []

    let filteredLabels = iotData.labels.filter((item, index) => {
      if (moment(currentDay).diff(moment(item), "months", true) < 12)
        newIotDataset.push(iotData.datasets[0].data[index])

      return moment(currentDay).diff(moment(item), "months", true) < 12
    })

    newIotData.labels = filteredLabels
    newIotData.datasets[0].data = newIotDataset

    //console.log("newIotData", iotData);
    setIotData(newIotData)
  };

  const filters = () => {
    return (
      <Box className="filter">
        <div
          className="active-display"
          // onClick={() => this.toggle("filterToggle")}
        >
          <span className="active-filter">Filter</span>
          <TuneRoundedIcon />
        </div>
        <ul className={"filter-options " + (filterToggle && "active")} ref={ref} >
          <li
            className={full ? "active" : ""}
            onClick={() => changeTab}
            data-tab="full"
          >
            2004 - Present
            <Radio checked={full && "checked"} size="small" />
          </li>
          <li
            className={twelveMonths ? "active" : ""}
            onClick={() => changeTab}
            data-tab="twelveMonths"
          >
            Past 12 months
            <Radio checked={twelveMonths && "checked"} size="small" />
          </li>
          <li
            className={sixMonths ? "active" : ""}
            onClick={() => changeTab}
            data-tab="sixMonths"
          >
            Past 6 months
            <Radio checked={sixMonths && "checked"} size="small" />
          </li>
        </ul>
      </Box>
    )
  }

  const interestOverTime = () => {
    let options = {
      plugins: {
        legend: {
          display: false
        }
      },
      elements: {
        point: {
          radius: 0
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }

    return (
      <Box className="interest-over-time" sx={{ paddingTop: 4, paddingBottom: 2 }}>
        <div className="card">
          <Typography variant="h5" sx={{ paddingBottom: 2 }}>Interest over time</Typography>
          <Line id="iot" data={iotData} options={options} />
        </div>
      </Box>
    );
  }

  const generateLabels = data => {
    let labels = []
    data.forEach(item => labels.push(item.formattedAxisTime))
    return labels
  }

  const generateData = data => {
    let values = []
    data.forEach(item => values.push(item.value[0]))
    return values
  }

  return (
    <Box sx={{ paddingTop: 4, paddingBottom: 4 }}>
      {filters()}
      {"datasets" in iotData && interestOverTime()}

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box className="trending-topics card">
            <Typography variant="h5">Related Topics</Typography>

            <ul>
              {trendingTopics.slice(0, 10).map((item, index) => {
                return (
                  <li key={index}>
                    <Grid container spacing={2} sx={{ alignItems: "center" }}>
                      <Grid item xs={1}>{index + 1}</Grid>
                      <Grid item xs={9}>{item.topic.title} ({item.topic.type})</Grid>
                      <Grid item xs={2} sx={{ textAlign: "right" }}>{`${item.value}%`}</Grid>
                    </Grid>
                  </li>
                )
              })}
            </ul>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box className="trending-topics card">
            <Typography variant="h5">Related Queries</Typography>

            <ul>
              {trendingQueries.slice(0, 10).map((item, index) => {
                return (
                  <li key={index}>
                    <Grid container spacing={2} sx={{ alignItems: "center" }}>
                      <Grid item xs={1}>{index + 1}</Grid>
                      <Grid item xs={9}>{item.query}</Grid>
                      <Grid item xs={2} sx={{ textAlign: "right" }}>{`${item.value}%`}</Grid>
                    </Grid>
                  </li>
                )
              })}
            </ul>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}