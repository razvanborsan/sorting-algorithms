import { Button } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import * as styles from './PlayerButton.module.scss';

function PlayerButton(icon, handleOnClick) {
    return (
        <Button
        className={styles.playerButton}
        onClick={handleOnClick}
        colorScheme="teal"
        >
            <FontAwesomeIcon icon={icon} />
        </Button>
    )
}

export default PlayerButton;