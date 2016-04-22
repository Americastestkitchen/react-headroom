'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _shouldUpdate2 = require('./shouldUpdate');

var _shouldUpdate3 = _interopRequireDefault(_shouldUpdate2);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var noop = function noop() {};

var Headroom = function (_Component) {
  _inherits(Headroom, _Component);

  function Headroom(props) {
    _classCallCheck(this, Headroom);

    // Class variables.

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Headroom).call(this, props));

    _this.setHeightOffset = function () {
      _this.setState({
        height: _this.refs.inner.offsetHeight
      });
    };

    _this.getScrollY = function () {
      if (_this.props.parent().pageYOffset !== void 0) {
        return _this.props.parent().pageYOffset;
      } else if (_this.props.parent().scrollTop !== void 0) {
        return _this.props.parent().scrollTop;
      } else {
        return (document.documentElement || document.body.parentNode || document.body).scrollTop;
      }
    };

    _this.handleScroll = function () {
      if (!_this.ticking) {
        _this.ticking = true;
        (0, _raf2.default)(_this.update);
      }
    };

    _this.unpin = function () {
      _this.props.onUnpin();

      _this.setState({
        translateY: '-100%',
        className: 'headroom headroom--unpinned'
      }, function () {
        setTimeout(function () {
          _this.setState({ state: 'unpinned' });
        }, 0);
      });
    };

    _this.pin = function () {
      _this.props.onPin();

      _this.setState({
        translateY: 0,
        className: 'headroom headroom--pinned',
        state: 'pinned'
      });
    };

    _this.unfix = function () {
      _this.props.onUnfix();

      _this.setState({
        translateY: 0,
        className: 'headroom headroom--unfixed',
        state: 'unfixed'
      });
    };

    _this.update = function () {
      _this.currentScrollY = _this.getScrollY();

      var _shouldUpdate = (0, _shouldUpdate3.default)(_this.lastKnownScrollY, _this.currentScrollY, _this.props, _this.state);

      var action = _shouldUpdate.action;


      if (action === 'pin') {
        _this.pin();
      } else if (action === 'unpin') {
        _this.unpin();
      } else if (action === 'unfix') {
        _this.unfix();
      }
      _this.lastKnownScrollY = _this.currentScrollY;
      _this.ticking = false;
    };

    _this.currentScrollY = 0;
    _this.lastKnownScrollY = 0;
    _this.ticking = false;
    _this.state = {
      state: 'unfixed',
      translateY: 0,
      className: 'headroom headroom--unfixed'
    };

    _this.shouldComponentUpdate = _reactAddonsPureRenderMixin2.default.shouldComponentUpdate.bind(_this);
    return _this;
  }

  _createClass(Headroom, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setHeightOffset();
      if (!this.props.disable) {
        this.props.parent().addEventListener('scroll', this.handleScroll);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.disable && !this.props.disable) {
        this.unfix();
        this.props.parent().removeEventListener('scroll', this.handleScroll);
      } else if (!nextProps.disable && this.props.disable) {
        this.props.parent().addEventListener('scroll', this.handleScroll);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      // If children have changed, remeasure height.
      if (prevProps.children !== this.props.children) {
        this.setHeightOffset();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.parent().removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('scroll', this.handleScroll);
    }
  }, {
    key: 'render',
    value: function render() {
      var style = {
        position: this.props.disable || this.state.state === 'unfixed' ? 'relative' : 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        WebkitTransform: 'translateY(' + this.state.translateY + ')',
        MsTransform: 'translateY(' + this.state.translateY + ')',
        transform: 'translateY(' + this.state.translateY + ')'
      };

      // Don't add css transitions until after we've done the initial
      // negative transform when transitioning from 'unfixed' to 'unpinned'.
      // If we don't do this, the header will flash into view temporarily
      // while it transitions from 0 — -100%.
      if (this.state.state !== 'unfixed') {
        style = _extends({}, style, {
          WebkitTransition: 'all .2s ease-in-out',
          MozTransition: 'all .2s ease-in-out',
          OTransition: 'all .2s ease-in-out',
          transition: 'all .2s ease-in-out'
        });
      }

      if (!this.props.disableInlineStyles) {
        style = _extends({}, style, this.props.style);
      } else {
        style = this.props.style;
      }

      var wrapperStyles = _extends({}, this.props.wrapperStyle, {
        height: this.state.height ? this.state.height : void 0
      });

      return _react2.default.createElement(
        'div',
        { style: wrapperStyles, className: 'headroom-wrapper' },
        _react2.default.createElement(
          'div',
          _extends({
            ref: 'inner'
          }, this.props, {
            style: style,
            className: this.state.className
          }),
          this.props.children
        )
      );
    }
  }]);

  return Headroom;
}(_react.Component);

Headroom.propTypes = {
  parent: _react.PropTypes.func,
  children: _react.PropTypes.any.isRequired,
  disableInlineStyles: _react.PropTypes.bool,
  disable: _react.PropTypes.bool,
  upTolerance: _react.PropTypes.number,
  downTolerance: _react.PropTypes.number,
  onPin: _react.PropTypes.func,
  onUnpin: _react.PropTypes.func,
  onUnfix: _react.PropTypes.func,
  wrapperStyle: _react.PropTypes.object,
  pinStart: _react.PropTypes.number,
  style: _react.PropTypes.object
};
Headroom.defaultProps = {
  parent: function parent() {
    return window;
  },
  disableInlineStyles: false,
  disable: false,
  upTolerance: 5,
  downTolerance: 0,
  onPin: noop,
  onUnpin: noop,
  onUnfix: noop,
  wrapperStyle: {},
  pinStart: 0
};
exports.default = Headroom;