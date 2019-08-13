'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _KeyCode = require('rc-util/lib/KeyCode');

var _KeyCode2 = _interopRequireDefault(_KeyCode);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _DateTable = require('./date/DateTable');

var _DateTable2 = _interopRequireDefault(_DateTable);

var _CalendarHeader = require('./calendar/CalendarHeader');

var _CalendarHeader2 = _interopRequireDefault(_CalendarHeader);

var _CalendarFooter = require('./calendar/CalendarFooter');

var _CalendarFooter2 = _interopRequireDefault(_CalendarFooter);

var _CalendarMixin = require('./mixin/CalendarMixin');

var _CommonMixin = require('./mixin/CommonMixin');

var _DateInput = require('./date/DateInput');

var _DateInput2 = _interopRequireDefault(_DateInput);

var _DateConstants = require('./date/DateConstants');

var _DateConstants2 = _interopRequireDefault(_DateConstants);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

var getMomentObjectIfValid = function getMomentObjectIfValid(date, multiple) {
  date = multiple && date && date.length > 0 ? date[0] : date;
  if (_moment2['default'].isMoment(date) && date.isValid()) {
    return date;
  }
  return false;
};

function goStartMonth() {
  var next = this.state.displayedValue.clone();
  next.startOf('month');
  this.setDisplayedValue(next);
}

function goEndMonth() {
  var next = this.state.displayedValue.clone();
  next.endOf('month');
  this.setDisplayedValue(next);
}

function goTime(direction, unit) {
  var next = this.state.displayedValue.clone();
  next.add(direction, unit);
  this.setDisplayedValue(next);
}

var Calendar = function (_React$Component) {
  (0, _inherits3['default'])(Calendar, _React$Component);

  function Calendar(props) {
    (0, _classCallCheck3['default'])(this, Calendar);

    var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      mode: _this.props.mode || 'date',
      value: getMomentObjectIfValid(props.value, props.multiple) || getMomentObjectIfValid(props.defaultValue, props.multiple) || (0, _moment2['default'])(),
      selectedValue: props.selectedValue || props.defaultSelectedValue
    };
    return _this;
  }

  Calendar.prototype.componentDidMount = function componentDidMount() {
    if (this.props.showDateInput) {
      this.saveFocusElement(_DateInput2['default'].getInstance());
    }
  };

  Calendar.prototype.getDaysOfMonth = function getDaysOfMonth(month) {
    var firstDayOfMonth = month.clone().startOf('month');
    var lastDayOfMonth = month.clone().endOf('month');

    var selectedDates = [];

    var day = firstDayOfMonth;

    while (day.isBefore(lastDayOfMonth)) {
      if (!this.props.disabledDate(day)) {
        selectedDates.push(day.clone());
      }

      day.add(1, 'day');
    }

    return selectedDates;
  };

  Calendar.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, state) {
    var selectedValue = nextProps.selectedValue;

    var newState = {};

    if ('mode' in nextProps && state.mode !== nextProps.mode) {
      newState = { mode: nextProps.mode };
    }

    if (!state.displayedValue) {
      var value = getMomentObjectIfValid(nextProps.value, nextProps.multiple) || getMomentObjectIfValid(nextProps.defaultValue, nextProps.multiple) || (0, _CalendarMixin.getNowByCurrentStateValue)(state.displayedValue, nextProps.multiple);

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
  };

  Calendar.prototype.getRootDOMNode = function getRootDOMNode() {
    return _reactDom2['default'].findDOMNode(this);
  };

  Calendar.prototype.checkAllSelected = function checkAllSelected(days) {
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
  };

  Calendar.prototype.render = function render() {
    var props = this.props,
        state = this.state;
    var locale = props.locale,
        prefixCls = props.prefixCls,
        disabledDate = props.disabledDate,
        dateInputPlaceholder = props.dateInputPlaceholder,
        timePicker = props.timePicker,
        disabledTime = props.disabledTime,
        clearIcon = props.clearIcon,
        renderFooter = props.renderFooter,
        inputMode = props.inputMode,
        disableMonthsInPast = props.disableMonthsInPast,
        prevMonthIcon = props.prevMonthIcon,
        nextMonthIcon = props.nextMonthIcon,
        prevYearIcon = props.prevYearIcon,
        nextYearIcon = props.nextYearIcon,
        multiple = props.multiple;
    var value = state.value,
        selectedValue = state.selectedValue,
        displayedValue = state.displayedValue,
        hoverValue = state.hoverValue,
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

    var disablePreviousMonth = disableMonthsInPast && displayedValue.clone().startOf('month').valueOf() <= (0, _moment2['default'])().startOf('month').valueOf();

    var disablePreviousYear = disableMonthsInPast && displayedValue.clone().startOf('year').valueOf() <= (0, _moment2['default'])().startOf('year').valueOf();

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
      onSelect: this.onDateInputSelect,
      clearIcon: clearIcon,
      inputMode: inputMode,
      multiple: multiple
    }) : null;

    var children = [];
    if (props.renderSidebar) {
      children.push(props.renderSidebar());
    }
    children.push(_react2['default'].createElement(
      'div',
      { className: prefixCls + '-panel', key: 'panel' },
      dateInputElement,
      _react2['default'].createElement(
        'div',
        {
          tabIndex: this.props.focusablePanel ? 0 : undefined,
          className: prefixCls + '-date-panel'
        },
        _react2['default'].createElement(_CalendarHeader2['default'], {
          locale: locale,
          mode: mode,
          value: value,
          renderFooter: renderFooter,
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
          onMonthSelect: this.props.selectMonths && this.onMonthSelect,
          onMonthMouseEnter: this.props.selectMonths && this.onMonthMouseEnter,
          onMonthMouseLeave: this.props.selectMonths && this.onMouseLeave
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
            hoverValue: hoverValue,
            prefixCls: prefixCls,
            dateRender: props.dateRender,
            onSelect: this.onDateTableSelect,
            disabledDate: disabledDate,
            showWeekNumber: props.showWeekNumber,
            highlightToday: props.highlightToday,
            multiple: multiple,
            onWeekDaysSelect: this.props.selectWeekDays && this.onWeekDaysSelect,
            onWeekDaysMouseEnter: this.props.selectWeekDays && this.onWeekDaysMouseEnter,
            onWeekDaysMouseLeave: this.props.selectWeekDays && this.onMouseLeave
          })
        ),
        _react2['default'].createElement(_CalendarFooter2['default'], {
          showOk: props.showOk,
          mode: mode,
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
          okDisabled: props.showOk !== false && (!selectedValue || !this.isAllowedDate(selectedValue, multiple)),
          onOk: this.onOk,
          onSelect: this.onDateTableSelect,
          onToday: this.onToday,
          onOpenTimePicker: this.openTimePicker,
          onCloseTimePicker: this.closeTimePicker,
          multiple: multiple
        })
      )
    ));

    return this.renderRoot({
      children: children,
      className: props.showWeekNumber ? prefixCls + '-week-number' : ''
    });
  };

  return Calendar;
}(_react2['default'].Component);

Calendar.propTypes = (0, _extends3['default'])({}, _CalendarMixin.calendarMixinPropTypes, _CommonMixin.propType, {
  prefixCls: _propTypes2['default'].string,
  className: _propTypes2['default'].string,
  style: _propTypes2['default'].object,
  defaultValue: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
  value: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
  selectedValue: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
  defaultSelectedValue: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
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
  dateRender: _propTypes2['default'].func,
  renderFooter: _propTypes2['default'].func,
  renderSidebar: _propTypes2['default'].func,
  clearIcon: _propTypes2['default'].node,
  focusablePanel: _propTypes2['default'].bool,
  inputMode: _propTypes2['default'].string,
  onBlur: _propTypes2['default'].func,
  disableMonthsInPast: _propTypes2['default'].bool,
  prevMonthIcon: _propTypes2['default'].node,
  nextMonthIcon: _propTypes2['default'].node,
  prevYearIcon: _propTypes2['default'].node,
  nextYearIcon: _propTypes2['default'].node,
  highlightToday: _propTypes2['default'].bool,
  multiple: _propTypes2['default'].bool,
  selectMonths: _propTypes2['default'].bool,
  selectWeekDays: _propTypes2['default'].bool
});
Calendar.defaultProps = (0, _extends3['default'])({}, _CalendarMixin.calendarMixinDefaultProps, _CommonMixin.defaultProp, {
  showToday: true,
  showDateInput: true,
  timePicker: null,
  onOk: noop,
  onPanelChange: noop,
  focusablePanel: true,
  highlightToday: true
});

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.onPanelChange = function (value, mode) {
    var props = _this2.props,
        state = _this2.state;

    if (!('mode' in props)) {
      _this2.setState({ mode: mode });
    }
    props.onPanelChange(value || state.value, mode);
  };

  this.onKeyDown = function (event) {
    if (event.target.nodeName.toLowerCase() === 'input') {
      return undefined;
    }
    var keyCode = event.keyCode;
    // mac
    var ctrlKey = event.ctrlKey || event.metaKey;
    var disabledDate = _this2.props.disabledDate;
    var displayedValue = _this2.state.displayedValue;

    switch (keyCode) {
      case _KeyCode2['default'].DOWN:
        _this2.goTime(1, 'weeks');
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].UP:
        _this2.goTime(-1, 'weeks');
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].LEFT:
        if (ctrlKey) {
          _this2.goTime(-1, 'years');
        } else {
          _this2.goTime(-1, 'days');
        }
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].RIGHT:
        if (ctrlKey) {
          _this2.goTime(1, 'years');
        } else {
          _this2.goTime(1, 'days');
        }
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].HOME:
        _this2.setValue(goStartMonth.apply(_this2));
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].END:
        _this2.setValue(goEndMonth.apply(_this2));
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].PAGE_DOWN:
        _this2.goTime(1, 'month');
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].PAGE_UP:
        _this2.goTime(-1, 'month');
        event.preventDefault();
        return 1;
      case _KeyCode2['default'].ENTER:
        if (!disabledDate || !disabledDate(displayedValue)) {
          _this2.onSelect(displayedValue, {
            source: 'keyboard'
          });
        }
        event.preventDefault();
        return 1;
      default:
        _this2.props.onKeyDown(event);
        return 1;
    }
  };

  this.onClear = function () {
    _this2.onSelect(null);
    _this2.props.onClear();
  };

  this.onOk = function () {
    var selectedValue = _this2.state.selectedValue;

    if (_this2.isAllowedDate(selectedValue)) {
      _this2.props.onOk(selectedValue);
    }
  };

  this.onDateInputChange = function (value) {
    _this2.onSelect(value, {
      source: 'dateInput'
    });
  };

  this.onDateInputSelect = function (value) {
    _this2.onSelect(value, {
      source: 'dateInputSelect'
    });
  };

  this.onDateTableSelect = function (value, cause) {
    var timePicker = _this2.props.timePicker;
    var selectedValue = _this2.state.selectedValue;

    if (!selectedValue && timePicker) {
      var timePickerDefaultValue = timePicker.props.defaultValue;
      if (timePickerDefaultValue) {
        (0, _util.syncTime)(timePickerDefaultValue, value);
      }
    }
    _this2.onSelect(value, cause);
  };

  this.onToday = function () {
    var displayedValue = _this2.state.displayedValue;

    var now = (0, _util.getTodayTime)(displayedValue);
    _this2.onDateTableSelect(now, {
      source: 'todayButton'
    });
  };

  this.onBlur = function (event) {
    setTimeout(function () {
      var dateInput = _DateInput2['default'].getInstance();
      var rootInstance = _this2.rootInstance;

      if (!rootInstance || rootInstance.contains(document.activeElement) || dateInput && dateInput.contains(document.activeElement)) {
        // focused element is still part of Calendar
        return;
      }

      if (_this2.props.onBlur) {
        _this2.props.onBlur(event);
      }
    }, 0);
  };

  this.onWeekDaysSelect = function (_ref) {
    var month = _ref.month,
        weekday = _ref.weekday;

    var days = _this2.getWeekdaysOfMonth({ month: month, weekday: weekday });

    if (!days.length) return;

    var allSelected = _this2.checkAllSelected(days);

    var newValue = [];

    if (allSelected) {
      newValue = _this2.addOrRemoveMultipleValues({ remove: days });
    } else {
      newValue = _this2.addOrRemoveMultipleValues({ add: days });
    }

    _this2.setSelectedValue(newValue);
  };

  this.onWeekDaysMouseEnter = function (_ref2) {
    var month = _ref2.month,
        weekday = _ref2.weekday;

    var days = _this2.getWeekdaysOfMonth({ month: month, weekday: weekday });

    _this2.setState({ hoverValue: days });
  };

  this.onMonthMouseEnter = function (month) {
    var days = _this2.getDaysOfMonth(month);

    _this2.setState({ hoverValue: days });
  };

  this.onMouseLeave = function () {
    _this2.setState({ hoverValue: null });
  };

  this.onMonthSelect = function (month) {
    var days = _this2.getDaysOfMonth(month);

    var allSelected = _this2.checkAllSelected(days);

    var newValue = [];

    if (allSelected) {
      newValue = _this2.addOrRemoveMultipleValues({ remove: days });
    } else {
      newValue = _this2.addOrRemoveMultipleValues({ add: days });
    }

    _this2.setSelectedValue(newValue);
  };

  this.getWeekdaysOfMonth = function (_ref3) {
    var month = _ref3.month,
        weekday = _ref3.weekday;

    var firstDayOfMonth = month.clone().startOf('month');
    var lastDayOfMonth = month.clone().endOf('month');
    var weekdayOfFirstDayOfMonth = firstDayOfMonth.day();
    var offset = (_DateConstants2['default'].DATE_COL_COUNT + weekday - weekdayOfFirstDayOfMonth) % _DateConstants2['default'].DATE_COL_COUNT;
    var current = firstDayOfMonth.clone().add(offset, 'days');

    var selectedDates = [];

    do {
      if (!_this2.props.disabledDate(current)) {
        selectedDates.push(current.clone());
      }
    } while (current.add(7, 'days').isBefore(lastDayOfMonth));

    return selectedDates;
  };

  this.openTimePicker = function () {
    _this2.onPanelChange(null, 'time');
  };

  this.closeTimePicker = function () {
    _this2.onPanelChange(null, 'date');
  };

  this.goTime = function (direction, unit) {
    _this2.setValue(goTime.apply(_this2, [direction, unit]));
  };
};

(0, _reactLifecyclesCompat.polyfill)(Calendar);

exports['default'] = (0, _CalendarMixin.calendarMixinWrapper)((0, _CommonMixin.commonMixinWrapper)(Calendar));
module.exports = exports['default'];