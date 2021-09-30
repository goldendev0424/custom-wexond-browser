/*
    CSS style of the Highlighter component.
*/
export default `
.wx-highlight {
  display: inline;
  position: relative;
  cursor: pointer;
  background-color: #f7ccd7;
}

#wx_highlight_toolbar {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #12121299;
  font-size: 12px !important;
  font-weight: 500;
  margin: 0;
  padding: 10px;
  border-radius: 5px;
  z-index: 999999999;
}

#wx_highlight_toolbar button:first-child {
  margin-right: 5px;
}

#wx_highlight_update_toolbar {
  display: none;
  position: absolute;
  background-color: #12121299;
  font-size: 12px !important;
  font-weight: 500;
  margin: 0;
  padding: 10px;
  border-radius: 5px;
  z-index: 999999999;
}

.wx-highlight-controls {
  display: flex;
  justify-content: space-between;
}

#wx_highlight_color {
  display: none;
  position: relative;
  margin-right: 5px;
}

#wx_highlight_color_list {
  display: none;
  position: absolute;
  margin-top: 10px;
  background: #12121299;
  padding: 3px;
  left: -3px;
}

.wx-highlight-color {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-bottom: 3px;
}

.wx-highlight-red {
  background-color: #f7ccd7;
}

.wx-highlight-orange {
  background-color: #fbdd80;
}

.wx-highlight-yellow {
  background-color: #fff98b;
}

.wx-highlight-green {
  background-color: #dbfc79;
}

.wx-highlight-blue {
  background-color: #c3fdec;
}
`;