import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SubjectIcon from "@material-ui/icons/Subject";
import FavoriteIcon from "@material-ui/icons/Favorite";
import SettingIcon from "@material-ui/icons/Settings";

import BadgeIcon from "./components/BadgeIcon";
import TabPanel from "./components/TabPanel";
import Listview from "./components/Listview";

import { dbConn, showTable } from "./websql";

const webDB = dbConn();

const a11yProps = index => ({
  id: `nav-tab-${index}`,
  "aria-controls": `nav-tabpanel-${index}`
});

const FavoriteBadgeIcon = props => {
  const { count } = props;
  return <BadgeIcon count={count} icon={<FavoriteIcon />} />;
};

const ArticleBadgeIcon = props => {
  const { count } = props;
  return <BadgeIcon count={count} icon={<SubjectIcon />} />;
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
}));

const App = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [articles, setArticlse] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    loadFavotites();
    loadArticlse();
  });

  const loadFavotites = () => {
    showTable(webDB, "subscription").then(res => {
      setFavorites(res);
    });
  };

  const loadArticlse = () => {
    showTable(webDB, "articles").then(res => {
      setArticlse(res);
    });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
        >
          <Tab
            icon={<FavoriteBadgeIcon count={favorites.length || 0} />}
            {...a11yProps(0)}
          />
          <Tab
            icon={<ArticleBadgeIcon count={articles.length || 0} />}
            {...a11yProps(1)}
          />
          <Tab icon={<SettingIcon />} {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel title="Favorite List" value={value} index={0}>
        <Listview data={favorites} />
      </TabPanel>
      <TabPanel title="Articles" value={value} index={1}>
        <Listview data={articles} />
      </TabPanel>
      <TabPanel title="Setting" value={value} index={2}></TabPanel>
    </div>
  );
};

export default App;
