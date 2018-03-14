### Change Log
All notable changes to this project will be documented in this file with the most recent releases at the top

#### 1.2.2
- [Issue-65](https://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/65) Add broken link icon to kit
- [Issue-64](https://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/64) Fix table cell tooltip clipping (discovered by Didier Colens)
- [Issue-63](https://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/63) Add new darkgreen color to kit for file names and URL addresses
- [Issue-62](https://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/62) Add light gray sidebar variation to kit
- [Issue-61](https://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/61) Add clipboard icon to kit

<br><br>

#### 1.2.1
- [Issue-58](https://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/58) Add example for Tab pattern (Noted by Vinh Phan)
- Add cui-resource-path variable (merge request from mratnaya)

<br><br>

#### 1.2.0
- [Issue-52](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/52) Select label and value not vertically aligned (discovered by Kim Mayton)
- [Issue-12](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/12) Add dropdown pattern to kit
- [Issue-51](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/51) Alert pattern link hover color is not correct
- [Issue-50](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/50) Add Modal pattern to the kit
- [Issue-55](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/55) Add contract login icons for the Software Download team
- [Issue-57](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/57) Add software-related icons for the Software Download team
- Added 3 icons (cpu-chip, memory-ram, and virtual-machine)
- Fixed Panel example tetration analysis link to Cisco.com had typo
- Fixed sidebar margin issue causing the content to not be centered (Discovered by George English)
- Updated Table pattern selection modifier allowing for selectable rows with highlighting
- Added better filter icon

<br><br>

#### 1.1.0
- [Issue-15](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/15) Added Tooltip pattern to the UI kit. CSS-only solution so HTML not supported
- [Issue-39](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/39) Add Carousel pattern to kit
- [Issue-41](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/41) Cosmetic UI issue on download tab
- [Issue-42](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/42) Add view disabled icon (requested by Stephanie Mattern)
- [Issue-43](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/43) Update the Alert Pattern. Change Alert pattern (first variation) to be the default and deprecate the others
- [Issue-44](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/44) Add Divider pattern to kit
- [Issue-46](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/46) Add Timeline pattern to kit
- [Issue-47](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/47) Add Basic CDC templates (guest, entitled, employee) to kit
- [Issue-48](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/48) .header-toolbar * + * is too generic
- Added several modifiers to the Timeline pattern (block display and centered alignment)
- Added additional Panel pattern border options (border top, right, bottom, left)
- Add new Panel color (gray-ghost)
- Modified Tab pattern to underline selected tab to same width as tab text
- Fixed indentation issue with Breadcrumb pattern
- Added new Loader pattern loading-spinner
- Added three new icons(view-split, show-editor and hide-editor)
- Added cart icon for software download team
- Added alternative variation to Rating pattern
- Fixed typo in sidebar css (weigth to weight). Spotted by Charlie Munro

<br><br>

#### 1.0.5
- Cosmetic UI issues. Fixed dark input values and lowered the raised panels
- [Issue-13](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/13) Added Semicolon in the main variables file
- [Issue-17](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/17) Fixed invalid nested lists HTML in the Pattern Library markup
- [Issue-20](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/20) Broken link for List pattern
- [Issue-21](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/21) HTML error in standard.html template file
- [Issue-22](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/22) Enable text select on radio button and checkbox labels
- [Issue-24](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/24) Sidebar does not work unless nav tag is used
- [Issue-25](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/25) Modal open broken by new CUI namespace
- [Issue-26](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/26) Search pattern example in kit is wrong
- [Issue-27](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/27) Disabled form fields are too faint to see
- [Issue-29](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/29) Add table-layout fixed to Table pattern
- [Issue-32](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/32) Remove unnecessary font files (reduced files from 48 to 14)
- [Issue-34](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/34) Add new Indigo color to core set (Panel, Label, Hero, Color Swatches)
- [Issue-37](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/37) Fixed Windows 10 builds. Now the UI Kit build works on both Linux and Windows
- New sidebar colors - blue (default), dark gray, and indigo
- Base spacing changed from 21px to 20px as the odd number caused some icons to get clipped at certain sizes
- Migrated from Bootstrap 3 Grid and breakpoints to Bootstrap 4 Grid and breakpoints
- Two icons are added in the icon library for Mary Specht (request came from Shanaz)
- Fixed performance issue in the Styleguide docs causing general page slowness
- Revamped Footer pattern html and css. Old footer still works but is deprecated

<br><br>

#### 1.0.4
- Added CiscoUI icons sketch template and sketchpalette (thanks to [Jeannette Lee](http://wwwin-tools.cisco.com/dir/reports/jeannlee))
- Rebrand from Atlantic UI to Cisco UI
- Moved repository from internal GitHub to external (Cisco) GitLab for open source governance
- Added new Loader pattern
- Updated Sidebar pattern. Old sidebar markup will still work but new markup is more BEM-compliant
- Fixed circle button subtext space / position based on different button sizes
- Fixed expand arrows on the UI Kit View Source link
- Added padding on heading tabs
- Removed unused .svg references
- Added several new svg icons
- AP-4230 / Fix circle button subtext. Not spaced properly when using different size buttons (discovered by [Chris Mangum](http://wwwin-tools.cisco.com/dir/reports/cmagnum))
- AP-4234 / Added new gray ghost button under the button menu (suggested by [George English](http://wwwin-tools.cisco.com/dir/reports/genglish))
- AP-4363 / Add both woff2 and svg output formats for the generated icon font
- Internal name change from icon-font to cui-font to address 3rd party tool naming conflicts (noted by [Stephanie Mattern](http://wwwin-tools.cisco.com/dir/reports/stcravat))
- [Issue-1](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/1) Converted pill-shaped tags to square tags to better distinguish from buttons
- [Issue-2](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/2) Readonly attribute does not affect element style
- [Issue-3](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/3) Add latest CiscoSans font to the UI Kit
- [Issue-4](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/4) selects are missing labels
- [Issue-5](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/5) Extra click regions on some elements
- [Issue-6](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/6) .btns .btn doesn't vertical align if its not a button element
- [Issue-7](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/7) Should .help-block be grouped in with the input's form-group instead of outside it?
- [Issue-8](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/8) Add padding on heading tabs
- [Issue-9](http://wwwin-gitlab-sjc.cisco.com/cisco-ui/pattern-library/issues/9) select multiple currently unstyled

<br><br>

#### 1.0.3
- AP-4132 / Added filters to Hero pattern
- AP-4151 / Added vertical tabs to Tab pattern
- AP-4250 / Added new Badge pattern
- AP-4154 / Re-enable text-select for links (discovered by [Kevin McCabe](http://wwwin-tools.cisco.com/dir/reports/kmccabe2))
- AP-4156 / Add support for small labels and circle labels
- AP-4169 / Added new horizontal divider pattern
- AP-4169 / Added alternative alert background colors
- AP-4169 / Add new, updated, and deprecated tags in sidebar
- AP-4177 / Add minimum width to small buttons (discovered by [Anna Talis](http://wwwin-tools.cisco.com/dir/reports/atalis))
- AP-4209 / Adjust mobile title width (discovered by [Carl Lindner](http://wwwin-tools.cisco.com/dir/reports/clindner))
- AP-4210 / Add back radio--inline CSS class. Missing in latest version (discovered by [Josh Slaughter](http://wwwin-tools.cisco.com/dir/reports/joslaugh))
- Add new success button and fix for vertical alignment issue on anchor button icons  

<br><br>

#### 1.0.2
- Added basic, sticky footer, and dashboard sample pages in the sidebar
- Added access to older versions in the sidebar
- Added link to Jive FAQ page
- Repurposed the old Gallery tab to What's New
- AP-4008 / Added icon labels and fixed issue with the gulp icon build process
- AP-4009 / Added xlarge thumbnail size (96px)
- AP-4009 / Added 1px margin to labels so wrapped labels don't bleed into each other
- AP-4009 / Added new section container pattern
- AP-4009 / Reduced alert margin top from $base-spacing to 0
- AP-4009 / Changed checkboxes and radios to use flex for layout
- AP-4009 / Added new helper classes (flex and nudge)
- AP-4009 / Added new ghost links (for use on dark backgrounds)
- AP-4009 / Revamped footer pattern layout
- AP-4070 / Support Input Tabbing (discovered by [Taylor Deckard](http://wwwin-tools.cisco.com/dir/reports/tadeckar))
- AP-4077 / Table pattern striping off at certain resolutions (discovered by [Taylor Deckard](http://wwwin-tools.cisco.com/dir/reports/tadeckar))
- AP-4078 / Update toggle switches to better render state  

<br><br>

#### 1.0.1
- Updated font mappings. Removed CiscoSansThin to improve h1 legibility
- Added new Toast pattern
- Added Tab pattern back (missing from 1.0)
- Added more (and consistent) documentation
- Added alternative background for pattern Alert
- Fixed Table pattern weirdness at smaller breakpoints
- Fixed Activity pattern padding issues
- Fixed exposed parent references in aui-button module (discovered by [Ramkumar Chidambaram](http://wwwin-tools.cisco.com/dir/reports/ramkchid))
- Fixed missing semicolons in variables file (discovered by [Ramkumar Chidambaram](http://wwwin-tools.cisco.com/dir/reports/ramkchid))
- Changed container max width from 1200px to 1440px to match move made by cisco.com
- Removed trademark (tm) text from Cisco logo icon per Branding request
- Updated Resources Jive Home link text to Atlantic Home Page  

<br><br>

#### 1.0.0
- Initial Release
