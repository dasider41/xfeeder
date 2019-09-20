import React from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItemLink from "./ListItemLink";

const Listview = props => {
  const { data } = props;
  return (
    <List component="nav" aria-label="list">
      {data.map((item, idx) => (
        <ListItemLink key={idx} title={item.title} body={item.body} />
      ))}
    </List>
  );
};

Listview.propTypes = {
  data: PropTypes.array
};

export default Listview;
