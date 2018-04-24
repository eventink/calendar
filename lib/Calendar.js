'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _KeyCode = require('rc-util/lib/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _DateTable = require('./date/DateTable');

var _DateTable2 = _interopRequireDefault(_DateTable);

var _CalendarHeader = require('./calendar/CalendarHeader');

var _CalendarHeader2 = _interopRequireDefault(_CalendarHeader);

var _CalendarFooter = require('./calendar/CalendarFooter');

var _CalendarFooter2 = _interopRequireDefault(_CalendarFooter);

var _CalendarMixin = require('./mixin/CalendarMixin');

var _CalendarMixin2 = _interopRequireDefault(_CalendarMixin);

var _CommonMixin = require('./mixin/CommonMixin');

var _CommonMixin2 = _interopRequireDefault(_CommonMixin);

var _DateInput = require('./date/DateInput');

var _DateInput2 = _interopRequireDefault(_DateInput);

var _DateConstants = require('./date/DateConstants');

var _DateConstants2 = _interopRequireDefault(_DateConstants);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

function goStartMonth() {
  var next = this.state.displayedValue.clone();
  this.setDisplayedValue(next);
}

function goEndMonth() {
  var next = this.state.displayedValue.clone();
  this.setDisplayedValue(next);
}

function goTime(direction, unit) {
  var next = this.state.displayedValue.clone();
  next.add(direction, unit);
  this.setDisplayedValue(next);
}

function goMonth(direction) {
  return goTime.call(this, direction, 'months');
}

function goYear(direction) {
  return goTime.call(this, direction, 'years');
}

function goWeek(direction) {
  return goTime.call(this, direction, 'weeks');
}

function goDay(direction) {
  return goTime.call(this, direction, 'days');
}

var Calendar = (0, _createReactClass2['default'])({
  displayName: 'Calendar',

  propTypes: {
    prefixCls: _propTypes2['default'].string,
    className: _propTypes2['default'].string,
    style: _propTypes2['default'].object,
    defaultValue: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
    value: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
    selectedValue: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
    mode: _propTypes2['default'].oneOf(['time', 'date', 'month', 'year', 'decade']),
    locale: _propTypes2['default'].object,
    showDateInput: _propTypes2['default'].bool,
    showWeekNumber: _propTypes2['default'].bool,
    showToday: _propTypes2['default'].bool,
    showOk: _propTypes2['default'].bool,
    onSelect: _propTypes2['default'].func,
    onOk: _propTypes2['default'].func,
    onKeyDown: _propTypes2['default'].func,
    timePicker: _propTypes2['default'].element,
    dateInputPlaceholder: _propTypes2['default'].any,
    onClear: _propTypes2['default'].func,
    onChange: _propTypes2['default'].func,
    onPanelChange: _propTypes2['default'].func,
    disabledDate: _propTypes2['default'].func,
    disabledTime: _propTypes2['default'].any,
    renderFooter: _propTypes2['default'].func,
    renderSidebar: _propTypes2['default'].func,
    disableMonthsInPast: _propTypes2['default'].bool,
    prevMonthIcon: _propTypes2['default'].node,
    nextMonthIcon: _propTypes2['default'].node,
    prevYearIcon: _propTypes2['default'].node,
    nextYearIcon: _propTypes2['default'].node,
    highlightToday: _propTypes2['default'].bool,
    multiple: _propTypes2['default'].bool
  },

  mixins: [_CommonMixin2['default'], _CalendarMixin2['default']],

  getDefaultProps: function getDefaultProps() {
    return {
      showToday: true,
      showDateInput: true,
      timePicker: null,
      onOk: noop,
      onPanelChange: noop,
      highlightToday: true
    };
  },
  getInitialState: function getInitialState() {
    return {
      mode: this.props.mode || 'date'
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if ('mode' in nextProps && this.state.mode !== nextProps.mode) {
      this.setState({ mode: nextProps.mode });
    }
  },
  onKeyDown: function onKeyDown(event) {
    if (event.target.nodeName.toLowerCase() === 'input') {
      return undefined;
    }
    var keyCode = event.keyCode;
    // mac
    var ctrlKey = event.ctrlKey || event.metaKey;
    var disabledDate = this.props.disabledDate;
    var value = this.state.value;

    switch (keyCode) {
      case _KeyCode2['default'].DOWN:
        goWeek.call(this, 1);
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].UP:
        goWeek.call(this, -1);
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].LEFT:
        if (ctrlKey) {
          goYear.call(this, -1);
        } else {
          goDay.call(this, -1);
        }
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].RIGHT:
        if (ctrlKey) {
          goYear.call(this, 1);
        } else {
          goDay.call(this, 1);
        }
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].HOME:
        goStartMonth.call(this);
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].END:
        goEndMonth.call(this);
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].PAGE_DOWN:
        goMonth.call(this, 1);
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].PAGE_UP:
        goMonth.call(this, -1);
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].ENTER:
        if (!disabledDate || !disabledDate(value)) {
          this.onSelect(value, {
            source: 'keyboard'
          });
        }
        event.preventDefault();
        return 1;
      default:
        this.props.onKeyDown(event);
        return 1;
    }
  },
  onClear: function onClear() {
    this.onSelect(null);
    this.props.onClear();
  },
  onOk: function onOk() {
    var selectedValue = this.state.selectedValue;

    if (this.isAllowedDate(selectedValue)) {
      this.props.onOk(selectedValue);
    }
  },
  onDateInputChange: function onDateInputChange(value) {
    this.onSelect(value, {
      source: 'dateInput'
    });
  },
  onDateTableSelect: function onDateTableSelect(value, cause) {
    var timePicker = this.props.timePicker;
    var selectedValue = this.state.selectedValue;

    if (!selectedValue && timePicker) {
      var timePickerDefaultValue = timePicker.props.defaultValue;
      if (timePickerDefaultValue) {
        (0, _util.syncTime)(timePickerDefaultValue, value);
      }
    }
    this.onSelect(value, cause);
  },
  onToday: function onToday() {
    var displayedValue = this.state.displayedValue;

    var now = (0, _util.getTodayTime)(displayedValue);
    this.onDateTableSelect(now, {
      source: 'todayButton'
    });
  },
  onPanelChange: function onPanelChange(value, mode) {
    var props = this.props,
        state = this.state;

    if (!('mode' in props)) {
      this.setState({ mode: mode });
    }
    props.onPanelChange(value || state.value, mode);
  },
  onWeekSelect: function onWeekSelect(_ref) {
    var month = _ref.month,
        weekday = _ref.weekday;

    var days = this.getWeekdaysOfMonth({ month: month, weekday: weekday });

    if (!days.length) return;

    var allSelected = this.checkAllSelected(days);

    var newValue = [];

    if (allSelected) {
      newValue = this.addOrRemoveMultipleValues({ remove: days });
    } else {
      newValue = this.addOrRemoveMultipleValues({ add: days });
    }

    this.setSelectedValue(newValue.length ? newValue : null);
  },
  onMonthSelect: function onMonthSelect(month) {
    var days = this.getDaysOfMonth(month);

    var allSelected = this.checkAllSelected(days);

    var newValue = [];

    if (allSelected) {
      newValue = this.addOrRemoveMultipleValues({ remove: days });
    } else {
      newValue = this.addOrRemoveMultipleValues({ add: days });
    }

    this.setSelectedValue(newValue.length ? newValue : null);
  },
  getWeekdaysOfMonth: function getWeekdaysOfMonth(_ref2) {
    var month = _ref2.month,
        weekday = _ref2.weekday;

    var firstDayOfMonth = month.clone().startOf('month');
    var lastDayOfMonth = month.clone().endOf('month');
    var weekdayOfFirstDayOfMonth = firstDayOfMonth.day();
    var offset = (_DateConstants2['default'].DATE_COL_COUNT + weekday - weekdayOfFirstDayOfMonth) % _DateConstants2['default'].DATE_COL_COUNT;
    var current = firstDayOfMonth.clone().add(offset, 'days');

    var selectedDates = [];

    do {
      if (!this.props.disabledDate(current)) {
        selectedDates.push(current.clone());
      }
    } while (current.add(7, 'days').isBefore(lastDayOfMonth));

    return selectedDates;
  },
  getDaysOfMonth: function getDaysOfMonth(month) {
    var firstDayOfMonth = month.clone().startOf('month');
    var lastDayOfMonth = month.clone().endOf('month');

    var selectedDates = [];

    var day = firstDayOfMonth;

    while (day.isBefore(lastDayOfMonth)) {
      selectedDates.push(day.clone());
      day.add(1, 'day');
    }

    return selectedDates;
  },
  checkAllSelected: function checkAllSelected(days) {
    var originalValue = this.state.selectedValue || [];
    var originalDayStrings = originalValue.map(function (day) {
      return day.format('YYYYMMDD');
    });

    var allSelected = true;
    days.forEach(function (day) {
      var dayString = day.format('YYYYMMDD');
      if (!originalDayStrings.includes(dayString)) {
        allSelected = false;
      }
    });

    return allSelected;
  },
  getRootDOMNode: function getRootDOMNode() {
    return _reactDom2['default'].findDOMNode(this);
  },
  openTimePicker: function openTimePicker() {
    this.onPanelChange(null, 'time');
  },
  closeTimePicker: function closeTimePicker() {
    this.onPanelChange(null, 'date');
  },
  render: function render() {
    var props = this.props,
        state = this.state;
    var locale = props.locale,
        prefixCls = props.prefixCls,
        disabledDate = props.disabledDate,
        dateInputPlaceholder = props.dateInputPlaceholder,
        timePicker = props.timePicker,
        disabledTime = props.disabledTime,
        disableMonthsInPast = props.disableMonthsInPast,
        prevMonthIcon = props.prevMonthIcon,
        nextMonthIcon = props.nextMonthIcon,
        prevYearIcon = props.prevYearIcon,
        nextYearIcon = props.nextYearIcon,
        multiple = props.multiple;
    var value = state.value,
        selectedValue = state.selectedValue,
        displayedValue = state.displayedValue,
        mode = state.mode;

    var showTimePicker = mode === 'time';
    var disabledTimeConfig = showTimePicker && disabledTime && timePicker ? (0, _util.getTimeConfig)(selectedValue, disabledTime) : null;

    var timePickerEle = null;

    if (timePicker && showTimePicker) {
      var timePickerProps = (0, _extends3['default'])({
        showHour: true,
        showSecond: true,
        showMinute: true
      }, timePicker.props, disabledTimeConfig, {
        onChange: this.onDateInputChange,
        value: selectedValue,
        disabledTime: disabledTime
      });

      if (timePicker.props.defaultValue !== undefined) {
        timePickerProps.defaultOpenValue = timePicker.props.defaultValue;
      }

      timePickerEle = _react2['default'].cloneElement(timePicker, timePickerProps);
    }

    var disablePreviousMonth = disableMonthsInPast && value.clone().startOf('month').valueOf() <= (0, _moment2['default'])().startOf('month').valueOf();

    var disablePreviousYear = disableMonthsInPast && value.clone().startOf('year').valueOf() <= (0, _moment2['default'])().startOf('year').valueOf();

    var dateInputElement = props.showDateInput ? _react2['default'].createElement(_DateInput2['default'], {
      format: this.getFormat(),
      key: 'date-input',
      value: value,
      locale: locale,
      placeholder: dateInputPlaceholder,
      showClear: true,
      disabledTime: disabledTime,
      disabledDate: disabledDate,
      onClear: this.onClear,
      prefixCls: prefixCls,
      selectedValue: selectedValue,
      onChange: this.onDateInputChange,
      multiple: multiple
    }) : null;
    var children = [props.renderSidebar(), _react2['default'].createElement(
      'div',
      { className: prefixCls + '-panel', key: 'panel' },
      dateInputElement,
      _react2['default'].createElement(
        'div',
        { className: prefixCls + '-date-panel' },
        _react2['default'].createElement(_CalendarHeader2['default'], {
          locale: locale,
          mode: mode,
          value: value,
          displayedValue: displayedValue,
          onValueChange: this.setValue,
          onPanelChange: this.onPanelChange,
          setDisplayedValue: this.setDisplayedValue,
          showTimePicker: showTimePicker,
          prefixCls: prefixCls,
          disablePreviousMonth: disablePreviousMonth,
          disablePreviousYear: disablePreviousYear,
          prevMonthIcon: prevMonthIcon,
          nextMonthIcon: nextMonthIcon,
          prevYearIcon: prevYearIcon,
          nextYearIcon: nextYearIcon,
          multiple: multiple,
          onMonthSelect: this.props.selectMonths && this.onMonthSelect
        }),
        timePicker && showTimePicker ? _react2['default'].createElement(
          'div',
          { className: prefixCls + '-time-picker' },
          _react2['default'].createElement(
            'div',
            { className: prefixCls + '-time-picker-panel' },
            timePickerEle
          )
        ) : null,
        _react2['default'].createElement(
          'div',
          { className: prefixCls + '-body' },
          _react2['default'].createElement(_DateTable2['default'], {
            locale: locale,
            value: value,
            selectedValue: selectedValue,
            displayedValue: displayedValue,
            prefixCls: prefixCls,
            dateRender: props.dateRender,
            onSelect: this.onDateTableSelect,
            disabledDate: disabledDate,
            showWeekNumber: props.showWeekNumber,
            highlightToday: props.highlightToday,
            multiple: multiple,
            onWeekSelect: this.props.selectWeeks && this.onWeekSelect
          })
        ),
        _react2['default'].createElement(_CalendarFooter2['default'], {
          showOk: props.showOk,
          renderFooter: props.renderFooter,
          locale: locale,
          prefixCls: prefixCls,
          showToday: props.showToday,
          disabledTime: disabledTime,
          showTimePicker: showTimePicker,
          showDateInput: props.showDateInput,
          timePicker: timePicker,
          selectedValue: selectedValue,
          value: value,
          displayedValue: displayedValue,
          disabledDate: disabledDate,
          okDisabled: !this.isAllowedDate(selectedValue, multiple),
          onOk: this.onOk,
          onSelect: this.onDateTableSelect,
          onToday: this.onToday,
          onOpenTimePicker: this.openTimePicker,
          onCloseTimePicker: this.closeTimePicker,
          multiple: multiple
        })
      )
    )];

    return this.renderRoot({
      children: children,
      className: props.showWeekNumber ? prefixCls + '-week-number' : ''
    });
  }
});

exports['default'] = Calendar;
module.exports = exports['default'];