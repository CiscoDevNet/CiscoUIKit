var iconPanels = [];
var curProgress = 1;

function removeClassWildcard($element, removals) {
    if (removals.indexOf('*') === -1) {
        // Use native jQuery methods if there is no wildcard matching
        $element.removeClass(removals);
        return $element;
    }

    var patt = new RegExp('\\s' +
            removals.replace(/\*/g, '[A-Za-z0-9-_]+').split(' ').join('\\s|\\s') +
            '\\s', 'g');

    $element.each(function (i, it) {
        var cn = ' ' + it.className + ' ';
        while (patt.test(cn)) {
            cn = cn.replace(patt, ' ');
        }
        it.className = $.trim(cn);
    });

    return $element;
}
function addCards(cnt) {
    $('main #grid').empty();
    for (var ii=1;ii<=cnt;ii++) {
        $('main #grid').append('<div class="card"><div class="card__body"><h3 class="text-uppercase base-margin-bottom">Card '+ii+'</h3><div class="flex"><div class="form-group form-group--inline"><div class="form-group__text"><input id="grid-card-cols" type="number" value="1"><label>Columns</label></div></div><div class="form-group form-group--inline"><div class="form-group__text"><input id="grid-card-rows" type="number" value="1"><label>Rows</label></div></div></div></div>');
    }
    wireCards();
}
function wireCards() {
    $('main #grid .card').click(function() {
        if ($(this).parent().hasClass('grid--selectable')) {
            $(this).toggleClass('selected');
        }
    });
    $('main #grid-cards').change(function() {
        addCards($(this).val());
    });
    $('main #grid .card #grid-card-cols').click(function(e) {
        e.stopPropagation();
    });
    $('main #grid .card #grid-card-cols').change(function() {
        removeClassWildcard($(this).closest('.card'), 'card--col-*');
        $(this).closest('.card').addClass('card card--col-'+$(this).val());
    });
    $('main #grid .card #grid-card-rows').click(function(e) {
        e.stopPropagation();
    });
    $('main #grid .card #grid-card-rows').change(function() {
        removeClassWildcard($(this).closest('.card'), 'card--row-*');
        $(this).closest('.card').addClass('card card--row-'+$(this).val());
    });
}
function shouldHideSidebar() {
    if ($(window).width() < 768) {
        $('#styleguideSidebar').addClass('sidebar--hidden');
    } else {
        $('#styleguideSidebar').addClass('sidebar--mini');
        $('#styleguideSidebar').removeClass('sidebar--hidden');
    }
}
function startProgress() {
    setTimeout(function () {
        curProgress += Math.floor(Math.random() * 25);
        if (curProgress >= 100) {
            curProgress = 100;
        }
        $('main #progressbar').attr('data-percentage', curProgress);
        $('main #progressbar').attr('data-balloon', curProgress + '%');
        $('main #progressbar .progressbar__label').html(curProgress + '%');

        if (curProgress == 100) {
            $('main #progressbar .progressbar__label').html('Upload Complete');
            $('main #progressbar').attr('data-balloon', 'Upload Complete');
        } else {
            startProgress();
        }
    }, 1000);
}
function jumpTo(ref) {
    document.location.href = "section-"+ref+".html#"+ref;
}
function doNav(url) {
    shouldHideSidebar();
    document.location.href = url;
}
function updateUrl(ref) {
    var path = window.location.pathname;
    var url = path + '#' + ref;
    history.pushState({ id: url }, 'Cisco UI Kit - ' + ref, url);
}
function checkUrlAndSetupPage(url) {
    if (url.lastIndexOf('#') != -1) {
        var anchor = url.substring(url.lastIndexOf('#') + 1);
        var str = anchor.substring((anchor.lastIndexOf('-')+1), anchor.length);

        var str = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });

        // Remove any existing active classes
        $('#styleguideTabs > li.tab').removeClass('active');
        $('#styleguideTabs-content > .tab-pane').removeClass('active');

        // Add the active class to the appropriate elements
        $('#styleguideTabs #styleguideTabs-'+str).addClass('active');
        $('#styleguideTabs-content #styleguideTabs-'+str+'-content').addClass('active');
    }
    else if (url.indexOf('index.html') !== -1) {
        $('#rootSidebar #section-gettingStarted').addClass('selected');
    }
}
function searchIcons(icon) {
    var ret = [];
    for (var ii=0;ii<iconPanels.length;ii++) {
        if (iconPanels[ii].innerText.indexOf(icon) !== -1) {
            ret.push(iconPanels[ii]);
        }
    }
    return ret;
}
function clearSearch() {
    setIcons(iconPanels);
}
function setActiveSlide(slide, animation) {
    $(slide).siblings().removeClass('active');
    $(slide).parent().parent().find('.carousel__slide').removeClass('active slideInLeftSmall slideInRightSmall fadeIn');
    $(slide).addClass('active');
    $(slide).parent().parent().find('#'+slide.id+'-content').addClass('active '+animation);
}
function setIcons (icons) {
    $('#icon-container').empty();
    $('#icon-container').append(icons);
    $('#icon-count').text(icons.length);
    $('#icon-total-count').text(iconPanels.length);
}
function debounce (func, wait) {
    var timeout;
    var context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        func.apply(context, args);
    }, wait || 0);
}
function openModal (id) {
    $('#modal-backdrop').removeClass('hide');
    $('#'+id).before('<div id="'+id+'-placeholder"></div>').detach().appendTo('body').removeClass('hide');
}
function closeModal (id) {
    $('#'+id).detach().prependTo(('#'+id+'-placeholder')).addClass('hide');
    $('#modal-backdrop').addClass('hide');
}

$(document).ready(function() {

    // Build list of icons
    iconPanels = $('#icon-container .icon-panel');

    // Wire the icon search
    $('#icon-search-input').on('input', function() {
        var searchStr = $('#icon-search-input').val();
        if (searchStr !== '') {
            setIcons(searchIcons(searchStr));
        }
        else {
            clearSearch();
        }
    });

    // Wire the header sidebar toggle button
    $('#sidebar-toggle').click(function() {
        $('#styleguideSidebar').toggleClass('sidebar--mini');
        $('#sidebar-toggle span:first-child').removeClass();
        if ($('#styleguideSidebar').hasClass('sidebar--mini')) {
            $('#sidebar-toggle span:first-child').addClass('icon-list-menu');
        } else {
            $('#sidebar-toggle span:first-child').addClass('icon-toggle-menu');
        }
    });

    $('#mobile-sidebar-toggle').click(function() {
        $('#styleguideSidebar').removeClass('sidebar--mini');
        $('#styleguideSidebar').toggleClass('sidebar--hidden');
    });

    // Wire the sidebar drawer open/close toggles
    $('#styleguideSidebar .sidebar__drawer > a').click(function(e) {
        e.stopPropagation();
        $(this).parent().siblings().removeClass('sidebar__drawer--opened');
        $(this).parent().toggleClass('sidebar__drawer--opened');
    });

    // Wire the sidebar selected item
    $('#styleguideSidebar .sidebar__item > a').click(function() {
        $('#styleguideSidebar .sidebar__item').removeClass('sidebar__item--selected');
        $(this).parent().addClass('sidebar__item--selected');
    });

    // Wire the sidebar examples
    $('main .sidebar__drawer > a').click(function() {
        $(this).parent().toggleClass('sidebar__drawer--opened');
    });
    $('main .sidebar__item > a').click(function() {
        $(this).parent().siblings().removeClass('sidebar__item--selected');
        $(this).parent().addClass('sidebar__item--selected');
    });

    // Wire the button group examples
    $('main .btn-group .btn').click(function() {
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
    });

    // Wire the markup toggles
    $('main .markup').removeClass('active');
    $('main .markup-toggle').click(function() {
        $(this).parent().next().toggleClass('hide');
        $(this).parent().toggleClass('active');

        if ($(this).hasClass('active')) {
            $(this).find('.markup-label').text('Hide code');
        }
        else if (!$(this).hasClass('active')) {
            $(this).find('.markup-label').text('View code');
        }
    });

    // Wire the markup clipboard
    $('main .clipboard-toggle').click(function() {
        clipboard.copy($(this).parent().parent().find('code.code-raw').text());
        $(this).addClass('text-bold').text('Copied!');
    });

    // Wire the tabs
    // Tab ID format
    // tabsv1
    // tabsv1-content
    // tabsv1-1
    // tabsv1-1-content

    $('main li.tab').click(function() {
        $(this).siblings().removeClass('active');
        var tabsId = this.id.substring(0, this.id.indexOf('-'));
        console.log(tabsId);
        $('main #'+tabsId+'-content > .tab-pane').removeClass('active');
        $(this).addClass('active');
        $('main #'+this.id+'-content').addClass('active');
    });

    // Wire closeable alerts
    $('main .alert .alert__close').click(function() {
        $(this).parent().addClass('hide');
    });

    // Wire the gauge example
    $('main #input-gauge-example').bind('keyup mouseup', function() {
        var val = $('#input-gauge-example').val() * 1;
        if (val >= 0 && val <= 100) {
            $('#gauge-example').attr('data-percentage', val);
            $('#gauge-example-value').text(val);
        }
    });

    // Wire the Card pattern examples
    $('main a.card').click(function() {
        $(this).toggleClass('selected');
    });

    // Wire the Advanced Grid example
    $('main #grid-group').click(function() {
        $(this).parent().find('#grid-group').removeClass('selected');
        var cls = 'grid--' + $(this).text();
        $('main .grid').removeClass('grid--3up');
        $('main .grid').removeClass('grid--4up');
        $('main .grid').removeClass('grid--5up');
        $('main .grid').addClass(cls);
        $(this).addClass('selected');
    });

    $('main #grid-cards').change(function() {
        addCards($(this).val());
    });

    $('main #grid-gutters').change(function() {
        $('main #grid').css('gridGap', $(this).val()+'px');
    });

    $('main #grid-selectable').change(function() {
        $('main #grid').toggleClass('grid--selectable');
        $('main .grid .card').removeClass('selected');
    });

    addCards(15);

    // Wire the carousel examples
    $('main .carousel__controls a.dot').click(function() {
        setActiveSlide(this, 'fadeIn');
    });
    $('main .carousel__controls a.back').click(function() {
        var last = $(this).parent().find('a.dot').last();
        var cur = $(this).parent().find('a.dot.active');
        var active = cur.prev();
        if (active[0].id === "") {
            active = last;
        }
        setActiveSlide(active[0], 'slideInLeftSmall');
    });
    $('main .carousel__controls a.next').click(function() {
        var first = $(this).parent().find('a.dot').first();
        var cur = $(this).parent().find('a.dot.active');
        var active = cur.next();
        if (active[0].id === "") {
            active = first;
        }
        setActiveSlide(active[0], 'slideInRightSmall');
    });

    // Wire the progressbar example
    startProgress();

    // Wire the dropdown examples
    $('main .dropdown').click(function(e) {
        e.stopPropagation();
        var el = $(this).find('input');
        if (!el.hasClass('disabled') && !el.attr('disabled') && !el.hasClass('readonly') && !el.attr('readonly')) {
            $(this).toggleClass('active');
        }
    });
    $('main .dropdown .select ~.dropdown__menu a').click(function(e) {
        e.stopPropagation();

        // Check multi-select
        var cb = $(this).find('label.checkbox input');
        if (cb.length) {
            cb.prop('checked', !cb.prop('checked'));
            if (cb[0].id === 'global-animation') {
                $('body').toggleClass('cui--animated');
            }
            else if (cb[0].id === 'global-headermargins') {
                $('body').toggleClass('cui--headermargins');
            }
            else if (cb[0].id === 'global-spacing') {
                $('body').toggleClass('cui--compressed');
            }
            else if (cb[0].id === 'global-wide') {
                $('body').toggleClass('cui--wide');
            }
            else if (cb[0].id === 'global-sticky') {
                $('body').toggleClass('cui--sticky');
            }
        }
        else { // Single select
            e.stopPropagation();
            var origVal = $(this).parent().parent().find('input').val();
            var newVal = $(this).text();

            $(this).parent().find('a').removeClass('selected');
            $(this).addClass('selected');
            $(this).parent().parent().find('input').val($(this).text());
            $(this).parent().parent().removeClass('active');

            var obj = $(this).parent().parent().find('input');
            if (obj[0].id === 'select-change-version') {
                if (origVal !== newVal) {
                    $("#uikit-css").attr('href', $(this).attr('data-value'));
                }
            }
        }
    });
    // Close dropdowns and open sidebar drawers on clicks outside the dropdowns
    $(document).click(function() {
        $('main .dropdown').removeClass('active');
        $('#styleguideSidebar .sidebar__drawer').removeClass('sidebar__drawer--opened');
    });

    // Wire the masonry layout dropdowns
    $('main #masonry-columns-dropdown').change(function() {
        $('main #masonry-columns-example').removeClass();
        $('main #masonry-columns-example').addClass('masonry masonry--cols-' + this.value);
    });
    $('main #masonry-gaps-dropdown').change(function() {
        $('main #masonry-gaps-example').removeClass();
        $('main #masonry-gaps-example').addClass('masonry masonry--gap-' + this.value);
    });

    // Wire the selectable tables
    $('main .table.table--selectable tbody > tr').click(function() {
        $(this).toggleClass('active');
    });

    // Wire the global modifiers
    $('main #global-animation').change(function() {
        $('body').toggleClass('cui--animated');
    });
    $('main #global-headermargins').change(function() {
        $('body').toggleClass('cui--headermargins');
    });
    $('main #global-spacing').change(function() {
        $('body').toggleClass('cui--compressed');
    });
    $('main #global-wide').change(function() {
        $('body').toggleClass('cui--wide');
    });
    $('main #global-sticky').change(function() {
        $('body').toggleClass('cui--sticky');
    });

    // Load the changelog
    $.get('changelog.md', function(markdownContent) {
        var converter = new Markdown.Converter();
        $("#changelog-content").html(converter.makeHtml(markdownContent));
    });

    // Load the broadcast file (if it exists)
    $.getJSON('broadcast.json', function(data) {
        if (data && data.text && data.text.length) {
            $("#broadcast-msg").html(data.text);
            $("#broadcast").toggleClass('hide');
        }
    });

    // Listen for history popstate change events (browser back/forward)
    window.addEventListener('popstate', function (event) {
        if (window.history.state && window.history.state.id) {
            checkUrlAndSetupPage(window.history.state.id);
        }
    }, false);

    /* Check for anchor link in the URL */
    checkUrlAndSetupPage(window.location.href);

    // Listen of window changes and close the sidebar if necessary
    $(window).resize(function() {
        shouldHideSidebar();
    });

    setIcons(iconPanels);
    shouldHideSidebar();
});
