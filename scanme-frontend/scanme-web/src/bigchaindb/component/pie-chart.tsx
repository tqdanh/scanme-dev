import * as React from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import clsx from 'clsx';
import * as PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  chartContainer: {
    position: 'relative',
    height: '300px'
  },
  stats: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center'
  },
  device: {
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  deviceIcon: {
    color: theme.palette.icon
  }
}));

const PieChart = props => {
  const { className, title, data, generateNewColor, ...rest } = props;
  // @ts-ignore
  const classes = useStyles();
  const theme = useTheme();
  const options = {
    legend: {
      display: true,
      position: 'bottom',
      fullWidth: true,
      reverse: false,
      labels: {
        fontColor: '#000',
        background: '#fff'
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      borderWidth: 1,
    }
  };

  return (
    <Card elevation={4}
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={
          <IconButton title='Generate new colors' onClick={props.generateNewColor} size='small'>
            <RefreshIcon />
          </IconButton>
        }
        title={title}
      />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          <Pie
            data={data}
            options={options}
          />
        </div>
      </CardContent>
    </Card>
  );
};

PieChart.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.object,
  generateNewColor: PropTypes.func
};

export default PieChart;
