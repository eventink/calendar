import React from 'react';
import PropTypes from 'prop-types';
import toFragment from 'rc-util/lib/Children/mapSelf';
import MonthPanel from '../month/MonthPanel';
import YearPanel from '../year/YearPanel';
import DecadePanel from '../decade/DecadePanel';

function goMonth(direction) {
  const next = this.props.displayedValue.clone();
  next.add(direction, 'months');
  this.props.setDisplayedValue(next);
}

function goYear(direction) {
  const next = this.props.displayedValue.clone();
  next.add(direction, 'years');
  this.props.setDisplayedValue(next);
}

function showIf(condition, el) {
  return condition ? el : null;
}

export default class CalendarHeader extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    displayedValue: PropTypes.object,
    onValueChange: PropTypes.func,
    showTimePicker: PropTypes.bool,
    onPanelChange: PropTypes.func,
    locale: PropTypes.object,
    enablePrev: PropTypes.any,
    enableNext: PropTypes.any,
    disabledMonth: PropTypes.func,
    renderFooter: PropTypes.func,
    onMonthSelect: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    disablePreviousMonth: PropTypes.bool,
    disablePreviousYear: PropTypes.bool,
    prevMonthIcon: PropTypes.node,
    nextMonthIcon: PropTypes.node,
    prevYearIcon: PropTypes.node,
    nextYearIcon: PropTypes.node,
    multiple: PropTypes.bool,
    setDisplayedValue: PropTypes.func,
  }

  static defaultProps = {
    enableNext: 1,
    enablePrev: 1,
    onPanelChange() { },
    onValueChange() { },
  }

  constructor(props) {
    super(props);
    this.nextMonth = goMonth.bind(this, 1);
    this.previousMonth = goMonth.bind(this, -1);
    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);

    this.state = { yearPanelReferer: null };
  }

  onMonthSelect = (value) => {
    this.props.onPanelChange(value, 'date');
    if (this.props.onMonthSelect) {
      this.props.onMonthSelect(value);
    } else {
      this.props.setDisplayedValue(value);
    }
  }

  onYearSelect = (value) => {
    const referer = this.state.yearPanelReferer;
    this.setState({ yearPanelReferer: null });
    this.props.onPanelChange(value, referer);
    this.props.setDisplayedValue(value);
  }

  onDecadeSelect = (value) => {
    this.props.onPanelChange(value, 'year');
    this.props.setDisplayedValue(value);
  }

  changeYear = (direction) => {
    if (direction > 0) {
      this.nextYear();
    } else {
      this.previousYear();
    }
  }

  monthYearElement = (showTimePicker) => {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const locale = props.locale;
    const displayedValue = props.displayedValue;
    const localeData = displayedValue.localeData();
    const monthBeforeYear = locale.monthBeforeYear;
    const selectClassName = `${prefixCls}-${monthBeforeYear ? 'my-select' : 'ym-select'}`;
    const timeClassName = showTimePicker ? ` ${prefixCls}-time-status` : '';

    if (props.onMonthSelect) {
      return (
        <a
          className={`${prefixCls}-month-select`}
          onClick={() => {
            props.onMonthSelect(displayedValue);
          }}
          onMouseEnter={() => {
            props.onMonthMouseEnter(displayedValue);
          }}
          onMouseLeave={props.onMonthMouseLeave}
        >
          {localeData.months(displayedValue)} {displayedValue.format(locale.yearFormat)}
        </a>
      );
    }

    const year = (<a
      className={`${prefixCls}-year-select${timeClassName}`}
      role="button"
      onClick={showTimePicker ? null : () => this.showYearPanel('date')}
      title={showTimePicker ? null : locale.yearSelect}
    >
      {displayedValue.format(locale.yearFormat)}
    </a>);
    const month = (<a
      className={`${prefixCls}-month-select${timeClassName}`}
      role="button"
      onClick={showTimePicker ? null : this.showMonthPanel}
      title={showTimePicker ? null : locale.monthSelect}
    >
      {locale.monthFormat ?
        displayedValue.format(locale.monthFormat) : localeData.monthsShort(displayedValue)}
    </a>);
    let day;
    if (showTimePicker) {
      day = (<a
        className={`${prefixCls}-day-select${timeClassName}`}
        role="button"
      >
        {displayedValue.format(locale.dayFormat)}
      </a>);
    }
    let my = [];
    if (monthBeforeYear) {
      my = [month, day, year];
    } else {
      my = [year, month, day];
    }
    return (
      <span className={selectClassName}>
        {toFragment(my)}
      </span>
    );
  }

  showMonthPanel = () => {
    // null means that users' interaction doesn't change value
    this.props.onPanelChange(null, 'month');
  }

  showYearPanel = (referer) => {
    this.setState({ yearPanelReferer: referer });
    this.props.onPanelChange(null, 'year');
  }

  showDecadePanel = () => {
    this.props.onPanelChange(null, 'decade');
  }

  render() {
    const { props } = this;
    const {
      prefixCls,
      locale,
      mode,
      value,
      displayedValue,
      showTimePicker,
      enableNext,
      enablePrev,
      disabledMonth,
      renderFooter,
      disablePreviousMonth,
      disablePreviousYear,
      prevMonthIcon,
      nextMonthIcon,
      prevYearIcon,
      nextYearIcon,
    } = props;

    let panel = null;
    if (mode === 'month') {
      panel = (
        <MonthPanel
          locale={locale}
          value={value}
          defaultValue={value}
          displayedValue={displayedValue}
          rootPrefixCls={prefixCls}
          onSelect={this.onMonthSelect}
          onYearPanelShow={() => this.showYearPanel('month')}
          disabledDate={disabledMonth}
          cellRender={props.monthCellRender}
          contentRender={props.monthCellContentRender}
          renderFooter={renderFooter}
          changeYear={this.changeYear}
          setDisplayedValue={props.setDisplayedValue}
        />
      );
    }
    if (mode === 'year') {
      panel = (
        <YearPanel
          locale={locale}
          defaultValue={value}
          displayedValue={displayedValue}
          rootPrefixCls={prefixCls}
          onSelect={this.onYearSelect}
          onDecadePanelShow={this.showDecadePanel}
          renderFooter={renderFooter}
          setDisplayedValue={props.setDisplayedValue}
        />
      );
    }
    if (mode === 'decade') {
      panel = (
        <DecadePanel
          locale={locale}
          defaultValue={value}
          displayedValue={displayedValue}
          rootPrefixCls={prefixCls}
          onSelect={this.onDecadeSelect}
          renderFooter={renderFooter}
          setDisplayedValue={props.setDisplayedValue}
        />
      );
    }

    return (<div className={`${prefixCls}-header`}>
      <div style={{ position: 'relative' }}>
        {showIf(enablePrev && !showTimePicker,
          disablePreviousYear ? (
            <span className={`${prefixCls}-prev-year-btn disabled`}>
              {prevYearIcon}
            </span>
          ) : (
            <a
              className={`${prefixCls}-prev-year-btn`}
              role="button"
              onClick={this.previousYear}
              title={locale.previousYear}
            >
              {prevYearIcon}
            </a>
          )
        )}
        {showIf(enablePrev && !showTimePicker,
          disablePreviousMonth ? (
            <span className={`${prefixCls}-prev-month-btn disabled`}>
              {prevMonthIcon}
            </span>
          ) : (
            <a
              className={`${prefixCls}-prev-month-btn`}
              role="button"
              onClick={this.previousMonth}
              title={locale.previousMonth}
            >
              {prevMonthIcon}
            </a>
          )
        )}
        {this.monthYearElement(showTimePicker)}
        {showIf(enableNext && !showTimePicker,
          <a
            className={`${prefixCls}-next-month-btn`}
            onClick={this.nextMonth}
            title={locale.nextMonth}
          >
            {nextMonthIcon}
          </a>
        )}
        {showIf(enableNext && !showTimePicker,
          <a
            className={`${prefixCls}-next-year-btn`}
            onClick={this.nextYear}
            title={locale.nextYear}
          >
            {nextYearIcon}
          </a>
        )}
      </div>
      {panel}
    </div>);
  }
}
