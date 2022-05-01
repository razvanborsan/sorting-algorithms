import * as React from 'react';
import PropTypes from 'prop-types';
import { Flex, Grid, Box } from '@chakra-ui/layout';

import Footer from 'components/Footer';

export default function Layout({ children }) {
  return (
    <Grid h="100vh" templateColumns="1fr" templateRows="auto 1fr auto">
      <Box />
      <Flex marginTop="40px" direction="column" justify="center" align="center">
        <main>{children}</main>
      </Flex>
        <Footer />
    </Grid>
  );
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};
