### Change Log
All notable changes to this project will be documented in this file with the most recent releases at the top

<br><br>

- [Issue-13] Added Semicolon in the File - utilities/_variable.scss
- [Issue-17] Fixed invalid nested lists HTML in the Pattern Library markup

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
- [Issue-1](http://gitlab.cisco.com/cisco-ui/pattern-library/issues/1) Converted pill-shaped tags to square tags to better distinguish from buttons
- [Issue-2](http://gitlab.cisco.com/cisco-ui/pattern-library/issues/2) Readonly attribute does not affect element style
- [Issue-3](http://gitlab.cisco.com/cisco-ui/pattern-library/issues/3) Add latest CiscoSans font to the UI Kit
- [Issue-4](http://gitlab.cisco.com/cisco-ui/pattern-library/issues/4) selects are missing labels
- [Issue-5](http://gitlab.cisco.com/cisco-ui/pattern-library/issues/5) Extra click regions on some elements
- [Issue-6](http://gitlab.cisco.com/cisco-ui/pattern-library/issues/6) .btns .btn doesn't vertical align if its not a button element
- [Issue-7](http://gitlab.cisco.com/cisco-ui/pattern-library/issues/7) Should .help-block be grouped in with the input's form-group instead of outside it?
- [Issue-8](http://gitlab.cisco.com/cisco-ui/pattern-library/issues/8) Add padding on heading tabs
- [Issue-9](http://gitlab.cisco.com/cisco-ui/pattern-library/issues/9) select multiple currently unstyled

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
