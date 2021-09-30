/*!***************************************************
* mark.js v8.11.1
* https://markjs.io/
* Copyright (c) 2014–2018, Julian Kühnel
* Released under the MIT license https://git.io/vwTVl
*****************************************************/

import Mark from './mark';
import $ from 'jquery';

$.fn.mark = function(sv, opt) {
  new Mark(this.get()).mark(sv, opt);
  return this;
};
$.fn.markRegExp = function(regexp, opt) {
  new Mark(this.get()).markRegExp(regexp, opt);
  return this;
};
$.fn.markRanges = function(ranges, opt) {
  new Mark(this.get()).markRanges(ranges, opt);
  return this;
};
$.fn.unmark = function(opt) {
  new Mark(this.get()).unmark(opt);
  return this;
};

export default $;