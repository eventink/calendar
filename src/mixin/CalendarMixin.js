import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import { isAllowedDate, getTodayTime } from '../util/index';

function noop() {
}

function getNow() {
  return moment();
}

function getNowByCurrentStateValue(displayedValue, multiple) {
  let ret;
  if (displayedValue) {
    ret = getTodayTime(displayedValue);
  } else {
    ret = moment();
  }
  return multiple ? [ret] : ret;
}

export const calendarMixinPropTypes = {
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  onKeyDown: PropTypes.func,
}

export const calendarMixinDefaultProps = {
  onKeyDown: noop,
};

export const calendarMixinWrapper = ComposeComponent => class extends ComposeComponent {
  static displayName = 'CalendarMixinWrapper';
  static defaultProps = ComposeComponent.defaultProps;

  static getDerivedStateFromProps(nextProps, prevState) {
    // Use origin function if provided
    if (ComposeComponent.getDerivedStateFromProps) {
      return ComposeComponent.getDerivedStateFromProps(nextProps, prevState);
    }
    
    const { value, selectedValue } = nextProps;
    const newState = {};

    if (nextProps.multiple) {
      newState.displayedValue = value[0];
    } else {
      newState.displayedValue = value;
    }

    if ('value' in nextProps) {
      value =
        value ||
        nextProps.defaultValue ||
        getNowByCurrentStateValue(this.state.displayedValue, this.props.multiple);
    }

    if ('selectedValue' in nextProps) {
      newState.selectedValue = selectedValue;
    } else if ('defaultSelectedValue' in nextProps) {
      newState.selectedValue = defaultSelectedValue;
    }

    return newState;
  }

  onSelect = (value, cause) => {
    let newValue = value;

    if (value) {
      if (this.props.multiple) {
        newValue = this.updateMultiSelectValue(value);
      } else {
        this.setValue(value);
      }

      this.setDisplayedValue(value);
    }

    this.setSelectedValue(newValue, cause);
  }

  renderRoot = (newProps) => {
    const props = this.props;
    const prefixCls = props.prefixCls;

    const className = {
      [prefixCls]: 1,
      [`${prefixCls}-hidden`]: !props.visible,
      [props.className]: !!props.className,
      [newProps.className]: !!newProps.className,
    };

    return (
      <div
        ref={this.saveRoot}
        className={`${classnames(className)}`}
        style={this.props.style}
        tabIndex="0"
        onKeyDown={this.onKeyDown}
        onBlur={this.onBlur}
      >
        {newProps.children}
      </div>
    );
  }

  setSelectedValue = (selectedValue, cause) => {
    // if (this.isAllowedDate(selectedValue)) {
    if (!('selectedValue' in this.props)) {
      this.setState({
        selectedValue,
      });
    }
    if (this.props.onSelect) {
      this.props.onSelect(selectedValue, cause);
    }
    // }
  }

  setValue = (value) => {
    const originalValue = this.state.value;
    if (!('value' in this.props)) {
      this.setState({
        value,
      });
    }
    if (
      originalValue && value && !originalValue.isSame(value) ||
      (!originalValue && value) ||
      (originalValue && !value)
    ) {
      this.props.onChange(value);
    }
  }

  setDisplayedValue(value) {
    this.setState({
      displayedValue: value,
    });
  }

  sortValues(values) {
    if (values && values.length) {
      values.sort((a, b) => a - b);
    }
  }

  updateMultiSelectValue(value) {
    const originalValue = this.state.selectedValue || [];
    let newValue = originalValue.slice(0);
    let foundIndex;

    originalValue.forEach((singleValue, index) => {
      if (singleValue.isSame(value, 'day')) {
        foundIndex = index;
      }
    });

    if (foundIndex !== undefined) {
      newValue.splice(foundIndex, 1);
    } else {
      newValue.push(value);
    }

    if (newValue.length) {
      this.sortValues(newValue);
    } else {
      newValue = null;
    }

    this.props.onChange(newValue);
    return newValue;
  }

  addOrRemoveMultipleValues(values) {
    const originalValue = this.state.selectedValue || [];
    let newValue = originalValue.slice(0);

    if (values.add) {
      const originalDayStrings = originalValue.map((day) => day.format('YYYYMMDD'));

      values.add.forEach((day) => {
        const dayString = day.format('YYYYMMDD');
        if (!originalDayStrings.includes(dayString)) {
          newValue.push(day);
        }
      });
    }

    if (values.remove) {
      const removeDaysStrings = values.remove.map((day) => day.format('YYYYMMDD'));

      newValue = newValue.filter((day) => {
        return !removeDaysStrings.includes(day.format('YYYYMMDD'));
      });
    }

    if (newValue.length) {
      this.sortValues(newValue);
    } else {
      newValue = null;
    }

    this.props.onChange(newValue);
    return newValue;
  }

  isAllowedDate(value, multiple) {
    const disabledDate = this.props.disabledDate;
    const disabledTime = this.props.disabledTime;

    if (multiple && value && value.length) {
      value.forEach((singleValue) => {
        if (!isAllowedDate(singleValue, disabledDate, disabledTime)) {
          return false;
        }
      });

      return true;
    }

    return isAllowedDate(value, disabledDate, disabledTime);
  }
};
