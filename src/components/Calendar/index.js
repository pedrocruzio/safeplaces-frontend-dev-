import React from 'react';
import Sidebar from '../Sidebar';
import Wrapper from '../Wrapper';
import EntryForm from '../EntryForm';
import { getFilteredTrackPath } from '../../selectors';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import './calendar.scss';
import { tooltipStyle } from '@wfp/ui';
import styles from './styles.module.scss';
import Tippy from '@tippy.js/react';
import { useParams } from 'react-router';
import cases from 'ducks/cases';

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const selectedPointsData = useSelector(state => getFilteredTrackPath(state));
  const dispatch = useDispatch();

  const calendarData = selectedPointsData.map(e => {
    console.log('moment', e[1].time, moment.utc(e[1].date));
    return {
      id: e[1].time,
      title: e[1].time,
      start: moment.utc(e[1].time).toDate(),
      end: moment.utc(e[1].time).add(30, 'minutes').toDate(),
    };
  });

  console.log('calendarData', calendarData);
  const showSelect = e => {
    console.log('handleSelect', e);
  };

  const params = useParams();
  const handleSelect = e => {
    dispatch(
      cases.actions.editEntry({
        case: params.patient,
        values: { latitude: 0, longitude: 0, time: moment(e.start).valueOf() },
      }),
    );
  };

  function Event() {
    return (
      <Tippy
        interactive
        content={
          <div className={styles.settingsList}>
            <EntryForm useInline />
          </div>
        }
        trigger="click"
        {...tooltipStyle}
      >
        <div>Nihau</div>
      </Tippy>
    );
  }

  const components = {
    event: Event, // used by each view (Month, Day, Week)
  };

  return (
    <Wrapper sidebar={<Sidebar />}>
      <div className={styles.calendarWrapper}>
        <Calendar
          components={components}
          selectable
          localizer={localizer}
          events={calendarData}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={showSelect}
          onSelectSlot={handleSelect}
          style={{ height: '100%' }}
        />
      </div>
    </Wrapper>
  );
}
