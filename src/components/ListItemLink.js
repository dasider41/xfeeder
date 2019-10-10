/*global chrome*/

import React from "react";
import PropTypes from "prop-types";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const ListItemLink = props => {
  const { title, body, url, ...options } = props;
  return (
    <ListItem
      button
      component="a"
      {...options}
      onClick={() =>
        chrome.tabs.create({
          url: url
        })
      }
    >
      <ListItemText primary={title} secondary={body} />
    </ListItem>
  );
};

ListItemLink.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
};

export default ListItemLink;
