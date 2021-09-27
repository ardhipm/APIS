import { black } from '@material-ui/core/colors';
import {createTheme} from '@material-ui/core/styles';

const theme = createTheme({
    overrides:{
      MuiTypography:{
          fontFamily: 'Roboto'
      }  
    },
    palette:{
        primary: {
            main: '#000000'
        },
        secondary: {
            main: '#423F3E'
        },
    },
    custom:{
        selectedTab:{
            borderLeft: '4px solid #3EDBF0'
        }
    }
});

export default theme;