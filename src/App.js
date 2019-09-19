import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SubjectIcon from "@material-ui/icons/Subject";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PersonPinIcon from "@material-ui/icons/PersonPin";

import TabPanel from "./components/TabPanel";

const a11yProps = index => ({
  id: `nav-tab-${index}`,
  "aria-controls": `nav-tabpanel-${index}`
});

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
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
          <Tab icon={<FavoriteIcon />} {...a11yProps(0)} />
          <Tab icon={<SubjectIcon />} {...a11yProps(1)} />
          <Tab icon={<PersonPinIcon />} {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        Favorite List
      </TabPanel>
      <TabPanel value={value} index={1}>
        Articles
      </TabPanel>
      <TabPanel value={value} index={2}>
        User setting
      </TabPanel>
    </div>
  );
};

export default App;
