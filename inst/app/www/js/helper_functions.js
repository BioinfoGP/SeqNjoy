'use strict';

/// BEGIN Helper functions

function _$(obj) { return (document.getElementById(obj)); }

//const numberWithCommas = (x) => { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

function basename(path) { return path.replace(/.*\//, ''); }

function dirname(path) { return path.match(/.*\//); }

function trim(text) { return text.replace(/^\s+/,'').replace(/\s+$/,''); }

/// END Helper functions
