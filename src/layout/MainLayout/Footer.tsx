// material-ui
import { Link, Grid} from '@mui/material';

const Footer = () => (
  <Grid container 
    sx={{  p: '24px 16px 0px', mt: 'auto', backgroundColor: 'white', marginTop: '3rem'}} 
    rowSpacing={4} 
    columnSpacing={{ xs: 12, sm: 12, md: 12 }} 
    justifyContent="space-between"
    
  >
    <Grid item xs={4}>
      <b>The TORCHLITE Dashboard and the <Link href="https://htrc.atlassian.net/wiki/spaces/COM/pages/43295914/Extracted+Features+v.2.0" target="_blank">Extracted Features Dataset</Link> that powers the Dashboard are products of the <Link href="https://analytics.hathitrust.org/" target="_blank">HathiTrust Research Center</Link>.</b>
    </Grid>
    <Grid item xs={1}></Grid>
    <Grid item xs={3}>
      <Link href="https://analytics.hathitrust.org/" target="_blank">
        <img src='/images/htrc-logo.png' alt="HTRC Logo" style={{ maxWidth: '100%', height: 'auto' }} />
      </Link>
    </Grid>
    <Grid item xs={12}>
      The Tools for Open Research and Computation with HathiTrust: Leveraging Intelligent Text Extraction (TORCHLITE) project is generously funded by the U.S. National Endowment for the Humanities (Grant no. HAA-284850-22).
    </Grid>
  </Grid> 
);

export default Footer;
