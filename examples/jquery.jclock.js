/*
 * jQuery jclock - Clock plugin - v 2.0.0
 * http://plugins.jquery.com/project/jclock
 *
 * Copyright (c) 2007-2009 Doug Sparling <http://www.dougsparling.com>
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */
(function($) {

  $.fn.jclock = function(options) {
    var version = '2.0.0';

    // options
    var opts = $.extend({}, $.fn.jclock.defaults, options);
         
    return this.each(function() {
      $this = $(this);
      $this.timerID = null;
      $this.running = false;

      var o = $.meta ? $.extend({}, opts, $this.data()) : opts;

      $this.format = o.format;
      $this.utc = o.utc;
      $this.utc_offset = o.utc_offset;

      $this.css({
        fontFamily: o.fontFamily,
        fontSize: o.fontSize,
        backgroundColor: o.background,
        color: o.foreground
      });

      $.fn.jclock.startClock($this);

    });
  };
       
  $.fn.jclock.startClock = function(el) {
    $.fn.jclock.stopClock(el);
    $.fn.jclock.displayTime(el);
  }

  $.fn.jclock.stopClock = function(el) {
    if(el.running) {
      clearTimeout(el.timerID);
    }
    el.running = false;
  }

  $.fn.jclock.displayTime = function(el) {
    var time = $.fn.jclock.getTime(el);
    el.html(time);
    el.timerID = setTimeout(function(){$.fn.jclock.displayTime(el)},1000);
  }

  $.fn.jclock.getTime = function(el) {
    var now = new Date();
    var hours, minutes, seconds;

    if(el.utc == true) {
      var localTime = now.getTime();
      var localOffset = now.getTimezoneOffset() * 60000;
      var utc = localTime + localOffset;
      var utcTime = utc + (3600000 * el.utc_offset);
      now = new Date(utcTime);
    }

    var timeNow = "";
    var i = 0;
    var index = 0;
    while ((index = el.format.indexOf("%", i)) != -1) {
      timeNow += el.format.substring(i, index);
      index++;

      // modifier flag
      //switch (el.format.charAt(index++)) {
      //}
      
      var property = $.fn.jclock.getProperty(now, el.format.charAt(index));
      index++;
      
      //switch (switchCase) {
      //}

      timeNow += property;
      i = index
    }

    timeNow += el.format.substring(i);
    return timeNow;
  };

  $.fn.jclock.getProperty = function(dateObject, property) {

    switch (property) {
      case "H": // hour as a decimal number using a 24-hour clock (range 00 to 23)
          return ((dateObject.getHours() <  10) ? "0" : "") + dateObject.getHours();
      case "I": // hour as a decimal number using a 12-hour clock (range 01 to 12)
          //return ( ((dateObject.getHours() % 12 || 12) < 10) ? "0" : "") + dateObject.getHours();
          return (dateObject.getHours() % 12 || 12);
      case "M": // minute as a decimal number
          return ((dateObject.getMinutes() <  10) ? "0" : "") + dateObject.getMinutes();
      case "p": // either `am' or `pm' according to the given time value,
		// or the corresponding strings for the current locale
          return (dateObject.getHours() < 12 ? "am" : "pm");
      case "S": // second as a decimal number
          return ((dateObject.getSeconds() <  10) ? "0" : "") + dateObject.getSeconds();
      case "%":
          return "%";
    }

  }
       
  // plugin defaults (24-hour)
  $.fn.jclock.defaults = {
    format: '%H:%M:%S', 
    utc_offset: 0,
    utc: false,
    fontFamily: '',
    fontSize: '',
    foreground: '',
    background: ''
  };

})(jQuery);
