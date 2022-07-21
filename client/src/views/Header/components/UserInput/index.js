import React, { Component } from "react";
import validator from "validator";

import { Box, IconButton, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/*
TODO

- implement debounce for search, limit users from making too many requests
- trim excess white space from search query (begining and end of string)
*/

export default class UserInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      searches: [],
    };

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount = async () => {
    document.addEventListener("mousedown", this.handleClickOutside);

    let searches = JSON.parse(localStorage.getItem("searches"));
    if (searches) this.setState({ searches: searches });
    else localStorage.setItem("searches", JSON.stringify([]));
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClickOutside);
  };

  handleClickOutside = (event) => {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target))
      this.setState({ searchFocused: false });
  };

  handleChange = async (event) => {
    const NAME = event.target.name;
    const VALUE = event.target.value;

    if (NAME === "search" && VALUE !== "")
      await this.props.setAppState({ searchQueryBlankError: false });

    await this.setState({ [NAME]: VALUE });
  };

  oneWord = (string) => {
    var regexp = /[a-zA-Z]+\s+[a-zA-Z]+/g;
    if (regexp.test(string)) return false;
    else return true;
  };

  search = async (e) => {
    if (e) e.preventDefault();
    //await this.props.setAppState("loadingBackdrop", true);

    if (!validator.isAlphanumeric(this.state.search))
      this.props.setAppState({ searchQueryBlankError: true });
    else {
      await this.props.reset();
      await this.props.setAppState({ previousSearchQuery: this.state.search });
      this.updateRecentSearches(this.state.search);
      localStorage.setItem("searchQuery", this.state.search);

      this.setState({
        searches: JSON.parse(localStorage.getItem("searches")),
      });
    }

    //await this.props.setAppState("loadingBackdrop", false);
    // switch tab to reddit if on homepage
    if (window.location.pathname === "/") window.location.href = "/reddit";
    else window.location.reload();

    await this.setState({ search: "", searchFocused: false });
  };

  updateRecentSearches = (searchQuery) => {
    let searches = [];

    if (localStorage.getItem("searches"))
      searches = JSON.parse(localStorage.getItem("searches"));

    if (searches.length > 0) {
      // remove queries over 5
      if (searches.length >= 5) searches.pop();

      // if query already exists, move to top / front of array
      if (searches.includes(searchQuery)) {
        searches = searches.filter((item) => item !== searchQuery);
        searches.unshift(searchQuery);
      }
      // if query does not exist, add to front of array
      else searches.unshift(searchQuery);
    } else searches = [searchQuery];

    localStorage.setItem("searches", JSON.stringify(searches));
  };

  clearRecentSearches = () => {
    this.setState({ searches: [], searchFocused: false });
    localStorage.setItem("searches", JSON.stringify([]));
  };

  clearSelectedSearch = (query) => {
    const searches = this.state.searches.filter((e) => e !== query);

    this.setState({ searches, searchFocused: false });
    localStorage.setItem("searches", JSON.stringify(searches));
  };

  selectRecentSearch = async (searchQuery) => {
    await this.setState({ search: searchQuery, searchFocused: false });
    this.search();
  };

  render() {
    const searchQuery = localStorage.getItem("searchQuery");

    return (
      <div className="search-input">
        <Box sx={{}}>
          <form onSubmit={this.search}>
            <TextField
              //label="Search query"
              variant="filled"
              name="search"
              value={this.state.search}
              size="small"
              placeholder={
                searchQuery ? searchQuery : "Search for a person or topic"
              }
              // defaultValue={this.state.search}
              spellCheck="false"
              onChange={this.handleChange}
              onFocus={() =>
                this.setState({ searchFocused: !this.state.searchFocused })
              }
              fullWidth={true}
              ref={this.wrapperRef}
            />
          </form>
        </Box>

        {this.state.searchFocused && this.state.searches.length > 0 && (
          <Box id="recentSearches" ref={this.wrapperRef}>
            <div className="top d-flex">
              <Typography variant="h6">Recent</Typography>
              <Typography
                className="clear"
                onClick={() => this.clearRecentSearches()}
              >
                Clear all
              </Typography>
            </div>

            <ul className="searches">
              {this.state.searches.map((search, index) => {
                return (
                  <li className="recent-item" key={search}>
                    <span
                      className="query"
                      onClick={() => this.selectRecentSearch(search)}
                    >
                      {search}
                    </span>

                    <IconButton
                      aria-label="remove"
                      color="primary"
                      onClick={() => this.clearSelectedSearch(search)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </li>
                );
              })}
            </ul>
          </Box>
        )}
      </div>
    );
  }
}
