import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Flex } from '@chakra-ui/layout';

import SortAnimation from 'components/SortAnimation';
import PlayerButtonsContainer from './PlayerButtonsContainer';

import { BAR_NUMBER_ACTIONS } from './constants';
import { getRandomValues } from './variables';

import * as styles from './SortPlayer.module.scss';

export default function SortPlayer({ algorithm }) {
  const [startSorting, setStartSorting] = useState(false);
  const [isSortFinished, setIsSortFinished] = useState(false);
  const [numberOfValues, setNumberOfValues] = useState(3);
  const [values, setValues] = useState([]);
  const [previousValues, setPreviousValues] = useState([]);

  useEffect(() => {
    setPreviousValues(values?.map((entry) => ({ ...entry, value: 0 })));
    setValues(getRandomValues(numberOfValues));
  }, [numberOfValues]);

  const [variables, setVariables] = useState({
    isSortFinished,
    startSorting,
    values,
  });
  const handleSortFinish = (sortStatus) => {
    setIsSortFinished(sortStatus);
  };

  const handleValues = (newValues) => {
    setValues(newValues);
  };

  const handlePreviousValues = (previous) => {
    setPreviousValues(previous);
  };

  const handleStartSorting = (action) => {
    setStartSorting(action);
  };

  const handleNumberOfValues = (type) => {
    switch (type) {
      case BAR_NUMBER_ACTIONS.INCREASE:
        setNumberOfValues(numberOfValues + 1);
        break;

      case BAR_NUMBER_ACTIONS.DECREASE:
        setNumberOfValues(numberOfValues - 1);
        break;

      default:
        break;
    }
  };

  const handlers = {
    handleValues,
    handlePreviousValues,
    handleStartSorting,
    handleNumberOfValues,
  };

  useEffect(() => {
    setVariables({
      isSortFinished,
      startSorting,
      values,
    });
  }, [isSortFinished, startSorting, values]);

  useEffect(() => {
    if (startSorting) {
      setStartSorting(false);
    }
  }, [algorithm, values]);
  return (
    <>
      <Box className={styles.cardContainer}>
        <Box className={styles.animationContainer}>
          <SortAnimation
            algorithm={algorithm}
            startSorting={startSorting}
            initialValues={values}
            previousValues={previousValues}
            handleSortFinish={handleSortFinish}
          />
        </Box>

        <Flex justify="center" align="center" height='150px'>
          <PlayerButtonsContainer
            variables={variables}
            handlers={handlers}
            numberOfValues={numberOfValues}
          />
          <Box className={styles.legendContainer}>
            <Box fontWeight="semibold" as="h4" isTruncated>
              Legend
            </Box>
            {algorithm.legend.map((entry) => (
              <Flex key={entry.color} justify="flex-start" align="center">
                <Box
                  style={{
                    backgroundColor: entry.color,
                  }}
                  className={styles.colorPreview}
                />
                {entry.message}
              </Flex>
            ))}
          </Box>
        </Flex>
      </Box>
    </>
  );
}

SortPlayer.propTypes = {
  algorithm: PropTypes.shape({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    legend: PropTypes.arrayOf(
      PropTypes.shape({
        color: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
};
