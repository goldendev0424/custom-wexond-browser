/*
    CSS style of the side pane component.
*/
export default `
.wx-d-none {
  display: none!important;
}

#wx_left_side_bar {
  position: absolute;
  height: 100%;
  left: 0px;
  top: 0px;
  display: flex;
  align-items: center;
  font-family: Roboto;
  z-index: 9999999;
}

#wx_left_side_bar * {
  font: normal normal 400 16px/normal sans-serif;
  color: #ffffff;
  letter-spacing: normal;
}

.wx-left-side-pane {
  height: 100%;
  width: 200px;
  position: fixed;
  z-index: 3;
  top: 0;
  left: -200px;
  transition: 0.5s;
}

.wx-left-side-icon {
  position: absolute;
  right: 0;
  left: 0;
  top: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -17px;
  margin-left: 210px;
  background: #000000;
  opacity: 0.8;
  border-radius: 50%;
  cursor: pointer;
}

.wx-left-side-icon:hover {
  opacity: 1;
  background-color: #000000;
  backdrop-filter: none;
}

.wx-left-side-items {
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #d4d4d4;
}

.wx-left-side-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
}

.wx-left-side-item:hover {
  background-color: #33333399;
}

.wx-left-side-item * {
  cursor: pointer;
  padding: 0;
}

.wx-left-side-item *:hover {
  background-color: initial!important;
}

#wx_contents_shrink svg {
  transform: rotate(45deg);
}

.wx-expand-arrow {
  display: none;
}
`;