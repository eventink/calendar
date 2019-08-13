import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import KeyCode from 'rc-util/lib/KeyCode';
import { polyfill } from 'react-lifecycles-compat';
import moment from 'moment';
import DateTable from './date/DateTable';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarFooter from './calendar/CalendarFooter';
import {
  calendarMixinWrapper,
  calendarMixinPropTypes,
  calendarMixinDefaultProps,
  getNowByCurrentStateValue,
} from './mixin/CalendarMixin';
import { commonMixinWrapper, propType, defaultProp } from './mixin/CommonMixin';
import DateInput from './date/DateInput';
import DateConstants from './date/DateConstants';
import { getTimeConfig, getTodayTime, syncTime } from './util';

function noop() {
}

const getMomentObjectIfValid = (date, multiple) => {
  date = (multiple && date && date.length > 0) ? date[0] : date;
  if (moment.isMoment(date) && date.isValid()) {
    return date;
  }
  return false;
};

function goStartMonth() {
  const next = this.state.displayedValue.clone();
  next.startOf('month');
  this.setDisplayedValue(next);
}

function goEndMonth() {
  const next = this.state.displayedValue.clone();
  next.endOf('month');
  this.setDisplayedValue(next);
}

function goTime(direction, unit) {
  const next = this.state.displayedValue.clone();
  next.add(direction, unit);
  this.setDisplayedValue(next);
}

class Calendar extends React.Component {
  static propTypes = {
    ...calendarMixinPropTypes,
    ...propType,
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    defaultValue: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.object),
    ]),
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.object),
    ]),
    selectedValue: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.object),
    ]),
    defaultSelectedValue: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.object),
    ]),
    mode: PropTypes.oneOf(['time', 'date', 'month', 'year', 'decade']),
    locale: PropTypes.object,
    showDateInput: PropTypes.bool,
    showWeekNumber: PropTypes.bool,
    showToday: PropTypes.bool,
    showOk: PropTypes.bool,
    onSelect: PropTypes.func,
    onOk: PropTypes.func,
    onKeyDown: PropTypes.func,
    timePicker: PropTypes.element,
    dateInputPlaceholder: PropTypes.any,
    onClear: PropTypes.func,
    onChange: PropTypes.func,
    onPanelChange: PropTypes.func,
    disabledDate: PropTypes.func,
    disabledTime: PropTypes.any,
    dateRender: PropTypes.func,
    renderFooter: PropTypes.func,
    renderSidebar: PropTypes.func,
    clearIcon: PropTypes.node,
    focusablePanel: PropTypes.bool,
    inputMode: PropTypes.string,
    onBlur: PropTypes.func,
    disableMonthsInPast: PropTypes.bool,
    prevMonthIcon: PropTypes.node,
    nextMonthIcon: PropTypes.node,
    prevYearIcon: PropTypes.node,
    nextYearIcon: PropTypes.node,
    highlightToday: PropTypes.bool,
    multiple: PropTypes.bool,
    selectMonths: PropTypes.bool,
    selectWeekDays: PropTypes.bool,
  }

  static defaultProps = {
    ...calendarMixinDefaultProps,
    ...defaultProp,
    showToday: true,
    showDateInput: true,
    timePicker: null,
    onOk: noop,
    onPanelChange: noop,
    focusablePanel: true,
    highlightToday: true,
  }

  constructor(props) {
    super(props);
    this.state = {
      mode: this.props.mode || 'date',
      value:
          getMomentObjectIfValid(props.value, props.multiple) ||
          getMomentObjectIfValid(props.defaultValue, props.multiple) ||
          moment(),
      selectedValue: props.selectedValue || props.defaultSelectedValue,
    };
  }

  componentDidMount() {
    if (this.props.showDateInput) {
      this.saveFocusElement(DateInput.getInstance());
    }
  }

  onPanelChange = (value, mode) => {
    const { props, state } = this;
    if (!('mode' in props)) {
      this.setState({ mode });
    }
    props.onPanelChange(value || state.value, mode);
  }

  onKeyDown = (event) => {
    if (event.target.nodeName.toLowerCase() === 'input') {
      return undefined;
    }
    const keyCode = event.keyCode;
    // mac
    const ctrlKey = event.ctrlKey || event.metaKey;
    const { disabledDate } = this.props;
    const { displayedValue } = this.state;
    switch (keyCode) {
      case KeyCode.DOWN:
        this.goTime(1, 'weeks');
        event.preventDefault();
        return 1;
      case KeyCode.UP:
        this.goTime(-1, 'weeks');
        event.preventDefault();
        return 1;
      case KeyCode.LEFT:
        if (ctrlKey) {
          this.goTime(-1, 'years');
        } else {
          this.goTime(-1, 'days');
        }
        event.preventDefault();
        return 1;
      case KeyCode.RIGHT:
        if (ctrlKey) {
          this.goTime(1, 'years');
        } else {
          this.goTime(1, 'days');
        }
        event.preventDefault();
        return 1;
      case KeyCode.HOME:
        this.setValue(
          goStartMonth.apply(this),
        );
        event.preventDefault();
        return 1;
      case KeyCode.END:
        this.setValue(
          goEndMonth.apply(this),
        );
        event.preventDefault();
        return 1;
      case KeyCode.PAGE_DOWN:
        this.goTime(1, 'month');
        event.preventDefault();
        return 1;
      case KeyCode.PAGE_UP:
        this.goTime(-1, 'month');
        event.preventDefault();
        return 1;
      case KeyCode.ENTER:
        if (!disabledDate || !disabledDate(displayedValue)) {
          this.onSelect(displayedValue, {
            source: 'keyboard',
          });
        }
        event.preventDefault();
        return 1;
      default:
        this.props.onKeyDown(event);
        return 1;
    }
  }

  onClear = () => {
    this.onSelect(null);
    this.props.onClear();
  }

  onOk = () => {
    const { selectedValue } = this.state;
    if (this.isAllowedDate(selectedValue)) {
      this.props.onOk(selectedValue);
    }
  }

  onDateInputChange = (value) => {
    this.onSelect(value, {
      source: 'dateInput',
    });
  }

  onDateInputSelect = (value) => {
    this.onSelect(value, {
      source: 'dateInputSelect',
    });
  }

  onDateTableSelect = (value, cause) => {
    const { timePicker } = this.props;
    const { selectedValue } = this.state;
    if (!selectedValue && timePicker) {
      const timePickerDefaultValue = timePicker.props.defaultValue;
      if (timePickerDefaultValue) {
        syncTime(timePickerDefaultValue, value);
      }
    }
    this.onSelect(value, cause);
  }

  onToday = () => {
    const { displayedValue } = this.state;
    const now = getTodayTime(displayedValue);
    this.onDateTableSelect(now, {
      source: 'todayButton',
    });
  }

  onBlur = (event) => {
    setTimeout(() => {
      const dateInput = DateInput.getInstance();
      const rootInstance = this.rootInstance;

      if (!rootInstance || rootInstance.contains(document.activeElement) ||
      (dateInput && dateInput.contains(document.activeElement))) {
        // focused element is still part of Calendar
        return;
      }

      if (this.props.onBlur) {
        this.props.onBlur(event);
      }
    }, 0);
  }

  onWeekDaysSelect = ({ month, weekday }) => {
    const days = this.getWeekdaysOfMonth({ month, weekday });

    if (!days.length) return;

    const allSelected = this.checkAllSelected(days);

    let newValue = [];

    if (allSelected) {
      newValue = this.addOrRemoveMultipleValues({ remove: days });
    } else {
      newValue = this.addOrRemoveMultipleValues({ add: days });
    }

    this.setSelectedValue(newValue);
  }

  onWeekDaysMouseEnter = ({ month, weekday }) => {
    const days = this.getWeekdaysOfMonth({ month, weekday });

    this.setState({ hoverValue: days });
  }

  onMonthMouseEnter = (month) => {
    const days = this.getDaysOfMonth(month);

    this.setState({ hoverValue: days });
  }

  onMouseLeave = () => {
    this.setState({ hoverValue: null });
  }

  onMonthSelect = (month) => {
    const days = this.getDaysOfMonth(month);

    const allSelected = this.checkAllSelected(days);

    let newValue = [];

    if (allSelected) {
      newValue = this.addOrRemoveMultipleValues({ remove: days });
    } else {
      newValue = this.addOrRemoveMultipleValues({ add: days });
    }

    this.setSelectedValue(newValue);
  }

  getWeekdaysOfMonth = ({ month, weekday }) => {
    const firstDayOfMonth = month.clone().startOf('month');
    const lastDayOfMonth = month.clone().endOf('month');
    const weekdayOfFirstDayOfMonth = firstDayOfMonth.day();
    const offset = (
      DateConstants.DATE_COL_COUNT + weekday - weekdayOfFirstDayOfMonth
    ) % DateConstants.DATE_COL_COUNT;
    const current = firstDayOfMonth.clone().add(offset, 'days');

    const selectedDates = [];

    do {
      if (!this.props.disabledDate(current)) {
        selectedDates.push(current.clone());
      }
    } while (current.add(7, 'days').isBefore(lastDayOfMonth));

    return selectedDates;
  }

  getDaysOfMonth(month) {
    const firstDayOfMonth = month.clone().startOf('month');
    const lastDayOfMonth = month.clone().endOf('month');

    const selectedDates = [];

    const day = firstDayOfMonth;

    while (day.isBefore(lastDayOfMonth)) {
      if (!this.props.disabledDate(day)) {
        selectedDates.push(day.clone());
      }

      day.add(1, 'day');
    }

    return selectedDates;
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { selectedValue } = nextProps;
    let newState = {};

    if ('mode' in nextProps && state.mode !== nextProps.mode) {
      newState = { mode: nextProps.mode };
    }

    if (!state.displayedValue) {
      const value =
            getMomentObjectIfValid(nextProps.value, nextProps.multiple) ||
            getMomentObjectIfValid(nextProps.defaultValue, nextProps.multiple) ||
            getNowByCurrentStateValue(state.displayedValue, nextProps.multiple);

      if (nextProps.multiple) {
        newState.displayedValue = value[0];
      } else {
        newState.displayedValue = value;
      }
    }

    if ('selectedValue' in nextProps) {
      newState.selectedValue = selectedValue;
    }

    return newState;
  }

  getRootDOMNode() {
    return ReactDOM.findDOMNode(this);
  }

  checkAllSelected(days) {
    const originalValue = this.state.selectedValue || [];
    const originalDayStrings = originalValue.map((day) => day.format('YYYYMMDD'));

    let allSelected = true;
    days.forEach((day) => {
      const dayString = day.format('YYYYMMDD');
      if (!originalDayStrings.includes(dayString)) {
        allSelected = false;
      }
    });

    return allSelected;
  }

  openTimePicker = () => {
    this.onPanelChange(null, 'time');
  }

  closeTimePicker = () => {
    this.onPanelChange(null, 'date');
  }

  goTime = (direction, unit) => {
    this.setValue(
      goTime.apply(this, [direction, unit]),
    );
  }

  render() {
    const { props, state } = this;
    const {
      locale, prefixCls, disabledDate,
      dateInputPlaceholder, timePicker,
      disabledTime, clearIcon, renderFooter, inputMode,
      disableMonthsInPast,
      prevMonthIcon,
      nextMonthIcon,
      prevYearIcon,
      nextYearIcon,
      multiple,
    } = props;
    const { value, selectedValue, displayedValue, hoverValue, mode } = state;
    const showTimePicker = mode === 'time';
    const disabledTimeConfig = showTimePicker && disabledTime && timePicker ?
      getTimeConfig(selectedValue, disabledTime) : null;

    let timePickerEle = null;

    if (timePicker && showTimePicker) {
      const timePickerProps = {
        showHour: true,
        showSecond: true,
        showMinute: true,
        ...timePicker.props,
        ...disabledTimeConfig,
        onChange: this.onDateInputChange,
        value: selectedValue,
        disabledTime,
      };

      if (timePicker.props.defaultValue !== undefined) {
        timePickerProps.defaultOpenValue = timePicker.props.defaultValue;
      }

      timePickerEle = React.cloneElement(timePicker, timePickerProps);
    }

    const disablePreviousMonth = (
      disableMonthsInPast &&
      displayedValue.clone().startOf('month').valueOf() <= moment().startOf('month').valueOf()
    );

    const disablePreviousYear = (
      disableMonthsInPast &&
      displayedValue.clone().startOf('year').valueOf() <= moment().startOf('year').valueOf()
    );

    const dateInputElement = props.showDateInput ? (
      <DateInput
        format={this.getFormat()}
        key="date-input"
        value={value}
        locale={locale}
        placeholder={dateInputPlaceholder}
        showClear
        disabledTime={disabledTime}
        disabledDate={disabledDate}
        onClear={this.onClear}
        prefixCls={prefixCls}
        selectedValue={selectedValue}
        onChange={this.onDateInputChange}
        onSelect={this.onDateInputSelect}
        clearIcon={clearIcon}
        inputMode={inputMode}
        multiple={multiple}
      />
    ) : null;

    const children = [];
    if (props.renderSidebar) {
      children.push(props.renderSidebar());
    }
    children.push(<div className={`${prefixCls}-panel`} key="panel">
      {dateInputElement}
      <div
        tabIndex={this.props.focusablePanel ? 0 : undefined}
        className={`${prefixCls}-date-panel`}
      >
        <CalendarHeader
          locale={locale}
          mode={mode}
          value={value}
          renderFooter={renderFooter}
          displayedValue={displayedValue}
          onValueChange={this.setValue}
          onPanelChange={this.onPanelChange}
          setDisplayedValue={this.setDisplayedValue}
          showTimePicker={showTimePicker}
          prefixCls={prefixCls}
          disablePreviousMonth={disablePreviousMonth}
          disablePreviousYear={disablePreviousYear}
          prevMonthIcon={prevMonthIcon}
          nextMonthIcon={nextMonthIcon}
          prevYearIcon={prevYearIcon}
          nextYearIcon={nextYearIcon}
          multiple={multiple}
          onMonthSelect={this.props.selectMonths && this.onMonthSelect}
          onMonthMouseEnter={this.props.selectMonths && this.onMonthMouseEnter}
          onMonthMouseLeave={this.props.selectMonths && this.onMouseLeave}
        />

        {timePicker && showTimePicker ?
          (<div className={`${prefixCls}-time-picker`}>
            <div className={`${prefixCls}-time-picker-panel`}>
              {timePickerEle}
            </div>
          </div>)
          : null}

        <div className={`${prefixCls}-body`}>
          <DateTable
            locale={locale}
            value={value}
            selectedValue={selectedValue}
            displayedValue={displayedValue}
            hoverValue={hoverValue}
            prefixCls={prefixCls}
            dateRender={props.dateRender}
            onSelect={this.onDateTableSelect}
            disabledDate={disabledDate}
            showWeekNumber={props.showWeekNumber}
            highlightToday={props.highlightToday}
            multiple={multiple}
            onWeekDaysSelect={this.props.selectWeekDays && this.onWeekDaysSelect}
            onWeekDaysMouseEnter={this.props.selectWeekDays && this.onWeekDaysMouseEnter}
            onWeekDaysMouseLeave={this.props.selectWeekDays && this.onMouseLeave}
          />
        </div>

        <CalendarFooter
          showOk={props.showOk}
          mode={mode}
          renderFooter={props.renderFooter}
          locale={locale}
          prefixCls={prefixCls}
          showToday={props.showToday}
          disabledTime={disabledTime}
          showTimePicker={showTimePicker}
          showDateInput={props.showDateInput}
          timePicker={timePicker}
          selectedValue={selectedValue}
          value={value}
          displayedValue={displayedValue}
          disabledDate={disabledDate}
          okDisabled={
            props.showOk !== false && (
              !selectedValue ||
              !this.isAllowedDate(selectedValue, multiple)
            )
          }
          onOk={this.onOk}
          onSelect={this.onDateTableSelect}
          onToday={this.onToday}
          onOpenTimePicker={this.openTimePicker}
          onCloseTimePicker={this.closeTimePicker}
          multiple={multiple}
        />
      </div>
    </div>);

    return this.renderRoot({
      children,
      className: props.showWeekNumber ? `${prefixCls}-week-number` : '',
    });
  }
}

polyfill(Calendar);

export default calendarMixinWrapper(commonMixinWrapper(Calendar));
