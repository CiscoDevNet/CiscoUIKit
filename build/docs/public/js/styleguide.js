function shouldHideSidebar() {
    if ($(window).width() < 992) {
        $('#styleguideSidebar').addClass('sidebar--hidden');
    }
}
function doNav(url) {
    shouldHideSidebar();
    document.location.href = url;
}

$(document).ready(function() {

    // Wire the header sidebar toggle button
    $('#styleguideHeader .toggle-menu').click(function() {
        $('#styleguideSidebar').toggleClass('sidebar--hidden');
    });

    // Wire the sidebar drawer open/close toggles
    $('#styleguideSidebar .sidebar__drawer > a').click(function() {
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
    $('main .markup-chevron').removeClass('icon-chevron-up').addClass('icon-chevron-down');
    $('main .markup-toggle').click(function() {
        $(this).parent().next().toggleClass('hide');
        $(this).next().toggleClass('hide').removeClass('text-blue').text('Copy'); // Toggle the clipboard copy. Should only display when code is viewable
        $(this).toggleClass('toggled');

        if ($(this).hasClass('toggled')) {
            $(this).find('.markup-chevron').removeClass('icon-chevron-down').addClass('icon-chevron-up');
            $(this).find('.markup-label').text('Hide Source ');
        }
        else if (!$(this).hasClass('toggled')) {
            $(this).find('.markup-chevron').removeClass('icon-chevron-up').addClass('icon-chevron-down');
            $(this).find('.markup-label').text('View Source ');
        }
    });

    // Wire the markup clipboard
    $('main .clipboard-toggle').click(function() {
        clipboard.copy($(this).parent().parent().find('code.code-raw').text());
        $(this).addClass('text-blue').text('Copied!');
    });

    // Wire the tabs
    $('main li.tab').click(function() {
        $(this).siblings().removeClass('active');
        $(this).parent().parent().find('.tab-pane').removeClass('active');
        $(this).addClass('active');
        $(this).parent().parent().find('#'+this.id + '-content').addClass('active');
    });

    // Check for anchor link in the URL
    var url = window.location.href;
    if (url.lastIndexOf('#') != -1) {
        var anchor = url.substring(url.lastIndexOf('#') + 1);
        $('#rootDrawer').addClass('sidebar__drawer--opened');
        $('#section-' + anchor).addClass('sidebar__item--selected').ScrollTo();
        $('#' + anchor).ScrollTo();
    }
    else if (url.indexOf('index.html') != -1) {
        $('#section-gettingStarted').addClass('sidebar__item--selected');
    }

    // Wire the dropdown examples
    $('main .dropdown .btn').click(function(e) {
        e.stopPropagation();
        $(this).parent().toggleClass('active');
    });
    // Close dropdowns on clicks outside the dropdowns
    $(document).click(function() {
        $('main .dropdown').removeClass('active');
    });

    // Wire the modal examples
    $('main #modal-feedback-open').click(function() {
        $('.modal-backdrop').removeClass('hide');
        $('#modal-feedback').removeClass('hide');
    });
    $('main #modal-feedback-close').click(function() {
        $('.modal-backdrop').addClass('hide');
        $('#modal-feedback').addClass('hide');
    });
    $('main #modal-login-open').click(function() {
        $('.modal-backdrop').removeClass('hide');
        $('#modal-login').removeClass('hide');
    });

    $('.modal__close').click(function() {
        $('.modal-backdrop').addClass('hide');
        $('.modal').addClass('hide');
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

    // Listen of window changes and close the sidebar if necessary
    $(window).resize(function() {
        shouldHideSidebar();
    });

    shouldHideSidebar();
});
