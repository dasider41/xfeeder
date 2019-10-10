import React from 'react';
import PropTypes from 'prop-types';
import Badge from '@material-ui/core/Badge';
import { makeStyles } from '@material-ui/core/styles';

const BadgeIcon = props => {
  const useStyles = makeStyles(theme => ({
    margin: {
      margin: theme.spacing(2),
    },
  }));

  const classes = useStyles();
  const { icon, count } = props;

  return (
    <Badge className={classes.margin} badgeContent={count} color="secondary">
      {icon}
    </Badge>
  );
};

BadgeIcon.propTypes = {
  icon: PropTypes.any.isRequired,
  count: PropTypes.number.isRequired,
};

export default BadgeIcon;
