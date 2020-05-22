import React from 'react';
import { Popup } from 'react-map-gl';
import styles from './styles.module.scss';

import moment from 'moment';
import { addSelected } from 'ducks/selectedPoints';

import { useSelector, useDispatch } from 'react-redux';
import { getSelectedPointsData } from 'selectors/selectedPoints';

export default function PopupWrapper() {
  const selectedPointsData = useSelector(getSelectedPointsData);
  console.log('selectedPointsData', selectedPointsData);
  const dispatch = useDispatch();
  if (selectedPointsData.length === 1) {
    return (
      <Popup
        tipSize={8}
        anchor="bottom"
        longitude={selectedPointsData[0].longitude}
        latitude={selectedPointsData[0].latitude}
        closeOnClick={false}
        closeButton={false}
        offsetTop={-10}
        onClose={() => dispatch(addSelected([]))}
      >
        <div className={styles.popup}>
          <h3 className={styles.title}>
            {moment.utc(selectedPointsData[0].time).format('YYYY-MM-DD')}
          </h3>
          <p className={styles.time}>
            {moment.utc(selectedPointsData[0].time).format('HH:mm:ss')}
          </p>
        </div>
      </Popup>
    );
  }

  return null;
}
