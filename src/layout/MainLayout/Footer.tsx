// material-ui
import { Link, /*Stack,*/ Grid, Typography } from '@mui/material';

const Footer = () => (
  /*<Grid direction="column" justifyContent="space-between" alignItems="left" sx={{ p: '24px 16px 0px', mt: 'auto'}}>*/
  <Grid container sx={{ p: '24px 16px 0px', mt: 'auto'}}>
    <Grid item xs={3}>
      <b>The TORCHLITE Dashboard and the <Link href="https://htrc.atlassian.net/wiki/spaces/COM/pages/43295914/Extracted+Features+v.2.0" target="_blank">Extracted Features Dataset</Link> that powers the Dashboard are products of the <Link href="https://analytics.hathitrust.org/" target="_blank">HathiTrust Research Center</Link>.</b>
    </Grid>
    {/*<Typography variant="caption">The TORCHLITE Dashboard and the Extracted Features Dataset that powers the Dashboard are products of the HathiTrust Research Center.</Typography>*/}
    {/*<Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="right">
      <Link href="#" target="_blank" variant="caption" color="textPrimary">
        About us
      </Link>
      <Link href="#" target="_blank" variant="caption" color="textPrimary">
        Privacy
      </Link>
      <Link href="#" target="_blank" variant="caption" color="textPrimary">
        Terms
      </Link>
</Stack>*/}
  </Grid>

  //Using Grid for new footer instead of Stack, since we need more chunks of text at different widths.
 

);

export default Footer;
