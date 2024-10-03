import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';

// material-ui
import Grid from '@mui/material/Grid';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import ChartDataMonth from './chart-data/total-order-month-line-chart';

import { gridSpacing } from 'store/constant';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import { Paper } from '@mui/material';
import { Box } from '@mui/system';
import RechargeForm from './recharge';
import { API_BASE_URL } from 'config';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null)
  const [amps, setAmps] = useState([])
  const [charData, setChartData] = useState({});
  
  const dispatch = useDispatch();
  const meter = useSelector((state) => state.meter);
  const auth = useSelector((state) => state.auth);
  
  // on every data change
  useEffect(() => {
    if (data){
      let amp = data?.data?.current || 0
      setAmps([...amps, amp])
    setChartData({
      ...charData,
      series: [
        {
          name: 'Current',
          data: amps
        }
      ]
    })
  } else {
    setAmps([])
  }
}, [data])
useEffect(() => {
  const socket = io(API_BASE_URL); // Replace with your server URL
  setLoading(false);
  setChartData(ChartDataMonth);
  // Handle socket events
  socket.on('connect', () => {
    console.log('Connected to socket server');

    // Identify this client as tenant_1
    socket.emit('identify', auth.user.tenant.tenant_id);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });

  // Listen for messages sent to this specific socket ID
  socket.on('message', (message) => {
    // Handle the message as needed
  });
  socket.on('data', (data) => {
    setData(data)
    dispatch({
      type: 'setMeter',
      payload: data
    })
  })

  // Cleanup on component unmount
  return () => {
    socket.disconnect();
  };
}, []);
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} kwh={(data) ? data.kWh : 0} consumed={(data && data.data) ? data.data.energy_consumed : 0} />
          </Grid>
          {/* <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} data={charData} />
          </Grid> */}
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} status={data ? data.tenant_on : false} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard
                  {...{
                    isLoading: isLoading,
                    total: 203,
                    label: 'PHCN Available',
                    icon: <StorefrontTwoToneIcon fontSize="inherit" />,
                    value: (data) ? data.phcn : false
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} d/>
          </Grid>
          <Grid item xs={12} md={4}>
            {auth.user.tenant?.tenant_id === 'admin_01' && <Paper sx={{ p: 2 }}>
              <RechargeForm />
            </Paper>}
            {/* <PopularCard isLoading={isLoading} /> */}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
