/*
    HTML Structure of the Highlighter component.
*/
export default `
<div id="wx_highlight">
  <div id="wx_highlight_toolbar">
    <div class="wx-highlight-controls">
      <button id="wx_apply_highlight">Apply</button>
      <button id="wx_clear_all_highlight">Clear All</button>
    </div>
  </div>

  <div id="wx_highlight_update_toolbar">
    <div class="wx-highlight-controls">
      <button id="wx_update_highlight">Update</button>
      <button id="wx_clear_highlight">Clear</button>
    </div>
  </div>

  <div id="wx_highlight_color">
		<div id="wx_selected_highlight_color">
			<div class="wx-highlight-color wx-highlight-red"></div>
		</div>
		<div id="wx_highlight_color_list">
			<div class="wx-highlight-color wx-highlight-red"></div>
			<div class="wx-highlight-color wx-highlight-orange"></div>
			<div class="wx-highlight-color wx-highlight-yellow"></div>
			<div class="wx-highlight-color wx-highlight-green"></div>
			<div class="wx-highlight-color wx-highlight-blue"></div>
		</div>
	</div>
</div>
`;