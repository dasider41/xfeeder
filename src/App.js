import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SubjectIcon from "@material-ui/icons/Subject";
import FavoriteIcon from "@material-ui/icons/Favorite";
import SettingIcon from "@material-ui/icons/Settings";
import Badge from "@material-ui/core/Badge";

import TabPanel from "./components/TabPanel";
import Listview from "./components/Listview";
import { dbConn, insertMap, showTable } from "./websql";

let webDB = dbConn();

const favList = [
  { title: "favList 1", body: "Jan 9, 2014" },
  { title: "favList 2", body: "Jan 9, 2014" },
  { title: "favList 3", body: "Jan 9, 2014" },
  { title: "favList 4", body: "Jan 9, 2014" }
];

const articleList = [
  { title: "article 1", body: "Jan 9, 2014" },
  { title: "article 2", body: "Jan 9, 2014" },
  { title: "article 3", body: "Jan 9, 2014" },
  { title: "article 4", body: "Jan 9, 2014" },
  { title: "article 5", body: "Jan 9, 2014" },
  { title: "article 6", body: "Jan 9, 2014" },
  { title: "article 7", body: "Jan 9, 2014" },
  { title: "article 8", body: "Jan 9, 2014" },
  { title: "article 9", body: "Jan 9, 2014" },
  { title: "article 10", body: "Jan 9, 2014" }
];

showTable(webDB, "articles");
// console.log(articleList);

const a11yProps = index => ({
  id: `nav-tab-${index}`,
  "aria-controls": `nav-tabpanel-${index}`
});

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  margin: {
    margin: theme.spacing(2)
  }
}));

const App = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
            icon={
              <Badge
                className={classes.margin}
                badgeContent={favList.length}
                color="secondary"
              >
                <FavoriteIcon />
              </Badge>
            }
            {...a11yProps(0)}
          />
          <Tab
            icon={
              <Badge
                className={classes.margin}
                badgeContent={articleList.length}
                color="secondary"
              >
                <SubjectIcon />
              </Badge>
            }
            {...a11yProps(1)}
          />
          <Tab icon={<SettingIcon />} {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel title="Favorite List" value={value} index={0}>
        <Listview data={favList} />
      </TabPanel>
      <TabPanel title="Articles" value={value} index={1}>
        <Listview data={articleList} />
      </TabPanel>
      <TabPanel title="Setting" value={value} index={2}></TabPanel>
    </div>
  );
};

export default App;
