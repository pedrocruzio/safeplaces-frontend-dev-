import React, { useEffect, useRef, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { connect, useDispatch } from 'react-redux';
import { getCurrentPath, getSelectedPointsData } from '../../selectors';
import { Button, TextArea, TextInput } from '@wfp/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams, useHistory } from 'react-router';
import Geocode from 'react-geocode';
import LocationSearchInput from './autoComplete';
import Tooltip from '@tippy.js/react';

import {
  faCrosshairs,
  faMapMarkerQuestion,
  faLocationCircle,
} from '@fortawesome/pro-solid-svg-icons';

import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import DateInput from '../DateInput';
import styles from './styles.module.scss';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import TimeInput from 'components/TimeInput';
import { v4 } from 'uuid';
import ButtonRouter from 'components/ButtonRouter';
import cases from 'ducks/cases';
import Value from '@wfp/ui/lib/components/Value';
// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey(process.env.REACT_APP_GOOGLE_PLACES_KEY);

// set response language. Defaults to english.
Geocode.setLanguage(process.env.REACT_APP_GOOGLE_PLACES_LANGUAGE);

// Enable or disable logs. Its optional.
Geocode.enableDebug();

const EntryForm = ({ initialData, useInline, clickedCoordinate }) => {
  // const [load, setLoad] = useState(false);
  const methods = useForm({
    defaultValues: initialData,
  });
  const usePrevious = value => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
  const {
    control,
    errors,
    getValues,
    setValue,
    reset,
    handleSubmit,
    register,
  } = methods;

  const dispatch = useDispatch();
  const history = useHistory();

  const params = useParams();
  const prevData = usePrevious({ initialData, clickedCoordinate });
  // Get address from latidude & longitude.
  const fromLatLng = useCallback(() => {
    const values = getValues();
    Geocode.fromLatLng(values.latitude, values.longitude).then(
      response => {
        const search = code => {
          const find = components.find(e => e.types.includes(code));
          return find ? find.long_name : '';
        };
        const components = response.results[0].address_components;
        setValue([
          {
            street: `${search('route')} ${search('street_number')}`,
          },
          {
            postal: search('postal_code'),
          },
          { town: search('locality') },
        ]);
      },
      error => {
        console.error(error);
      },
    );
  });
  useEffect(() => {
    var initialDataManipulated = {};

    if (params.action !== 'new' && initialData) {
      initialDataManipulated = JSON.parse(JSON.stringify(initialData));
      initialDataManipulated.date = moment(initialDataManipulated.time).format(
        'YYYY-MM-DD',
      );
      initialDataManipulated.time = moment(initialDataManipulated.time).format(
        'hh:mm',
      );
    }
    if (
      clickedCoordinate !== undefined &&
      clickedCoordinate.length > 0 &&
      prevData !== undefined &&
      prevData.clickedCoordinate !== clickedCoordinate
    ) {
      const value = getValues();
      if (clickedCoordinate !== [value.longitude, value.latitude]) {
        setValue([
          { longitude: clickedCoordinate[0] },
          { latitude: clickedCoordinate[1] },
          {
            street: ``,
          },
          {
            postal: '',
          },
          { town: '' },
        ]);
        if (fromLatLng !== undefined) {
          fromLatLng();
        }
      }
    }
    if (prevData !== undefined && prevData.initialData !== initialData) {
      console.log('prev');
      console.log(prevData.initialData);
      console.log('current');
      console.log(initialData);
      reset(initialDataManipulated);
    }
  }, [
    initialData,
    params.action,
    params.page,
    reset,
    clickedCoordinate,
    prevData,
    getValues,
    setValue,
    fromLatLng,
  ]);

  if (params.page !== 'edit' && !useInline) {
    return null;
  }

  const fromAddress = () => {
    const values = getValues();
    const address = `${values.street} ${values.other} ${values.town} ${values.postal}`;
    Geocode.fromAddress(address).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);

        setValue([
          {
            latitude: lat,
          },
          {
            longitude: lng,
          },
        ]);
      },

      error => {
        console.error(error);
      },
    );
  };

  const onSubmit = values => {
    values.time = moment(`${values.date} ${values.time}`).valueOf();
    values.latitude = parseFloat(values.latitude);
    values.longitude = parseFloat(values.longitude);
    dispatch(
      cases.actions.editEntry({
        values,
        id: params.action === 'new' ? v4() : params.action,
      }),
    );
    history.push(`/${params.patient}`);
  };

  const onAddressReceived = results => {
    const search = code => {
      const find = components.find(e => e.types.includes(code));
      return find ? find.long_name : '';
    };
    const components = results[0].address_components;
    console.log(results[0].address_components);
    setValue([
      {
        street: `${search('route')} ${search('street_number')}`,
      },
      {
        postal: search('postal_code'),
      },
      { town: search('locality') },
    ]);
  };

  const onLatLongReceived = values => {
    setValue([
      {
        latitude: values.lat,
      },
      {
        longitude: values.lng,
      },
    ]);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={useInline ? styles.inlineForm : styles.form}
    >
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          {params.action !== 'new' ? 'Edit point' : 'New point'}
        </div>
        <ButtonRouter
          to={`/${params.patient}`}
          icon={<FontAwesomeIcon icon={faTimes} />}
          className={styles.closeButton}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.dateWrapper}>
          <Controller
            as={<DateInput labelText="Date" />}
            name="date"
            type="date"
            min={null}
            max={null}
            control={control}
          />
          <Controller
            as={<TimeInput time labelText="Time" type="time" />}
            name="time"
            min={null}
            max={null}
            control={control}
          />
        </div>
        <div>
          <LocationSearchInput
            latlongReceived={onLatLongReceived}
            addressReceived={onAddressReceived}
          />
        </div>
        <div className={styles.position}>
          <TextInput
            labelText="Latitude"
            name="latitude"
            invalidText="Invalid latitude"
            invalid={errors.longitude}
            inputRef={register({
              validate: value => {
                const parseValue = parseFloat(value);
                return (
                  !isNaN(parseValue) && parseValue >= -90 && parseValue <= 90
                );
              },
            })}
          />
          <TextInput
            labelText="Longitude"
            name="longitude"
            invalidText="Invalid longitude"
            invalid={errors.longitude}
            inputRef={register({
              validate: value => {
                const parseValue = parseFloat(value);
                return (
                  !isNaN(parseValue) && parseValue >= -180 && parseValue <= 180
                );
              },
            })}
          />

          <Tooltip content="Pick location">
            <span>
              <Button
                onClick={fromLatLng}
                icon={<FontAwesomeIcon icon={faLocationCircle} />}
              ></Button>
            </span>
          </Tooltip>
          <Tooltip content="Get location from coordinates">
            <span tabIndex={0}>
              <Button
                onClick={fromAddress}
                icon={<FontAwesomeIcon icon={faCrosshairs} />}
              ></Button>
            </span>
          </Tooltip>
        </div>
        <div className={styles.positionHelp}>
          Click on map to select coordinates
        </div>
        <div className={styles.address}>
          <div className={styles.streetWrapper}>
            <TextInput labelText="Street" name="street" inputRef={register} />
            <TextInput labelText="Other" name="other" inputRef={register} />
          </div>
          <div className={styles.townWrapper}>
            <TextInput labelText="Town" name="town" inputRef={register} />
            <TextInput
              labelText="Postal code"
              name="postal"
              inputRef={register}
            />
            <Tooltip content="Get location from address">
              <span>
                <Button
                  onClick={fromAddress}
                  icon={<FontAwesomeIcon icon={faMapMarkerQuestion} />}
                ></Button>
              </span>
            </Tooltip>
          </div>
        </div>
        <div className={styles.commentWrapper}>
          <Controller
            as={<TextArea labelText="Comment" />}
            name="comment"
            control={control}
          />
        </div>

        <Button type="submit">
          {params.action !== 'new' ? 'Update' : 'Add to tracks'}
        </Button>
      </div>
    </form>
  );
};

const mapStateToProps = state => {
  return {
    selectedPoints: getSelectedPointsData(state),
    track: getCurrentPath(state),
    clickedCoordinate: state.map.coordinate,
  };
};

const mapDispatchToProps = dispatch => ({
  addPathEntryTrigger: data => dispatch(cases.actions.addPathEntry(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EntryForm);
