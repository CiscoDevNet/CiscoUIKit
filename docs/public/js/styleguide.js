function doNav(url) {
    if ($(window).width() < 768) {
        $('#styleguideSidebar').addClass('sidebar--hidden');
    }
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
        $(this).next().slideToggle(100).toggleClass('hidden');
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

    // Wire the tabs
    $('main .tab-heading').parent().parent().click(function() {
        $(this).siblings().removeClass('active');
        $(this).parent().siblings().find('.tab-pane').removeClass('active');
        $(this).addClass('active');
        $(this).parent().next().find('#'+this.id + '-content').addClass('active');
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

    if ($(window).width() < 768) {
        $('#styleguideSidebar').addClass('sidebar--hidden');
    }

    // Load the changelog
    $.get('changelog.md', function(markdownContent) {
        var converter = new Markdown.Converter();
        var htmlContent = converter.makeHtml(markdownContent);
        $("#changelog-content").html(htmlContent);
    });
});
