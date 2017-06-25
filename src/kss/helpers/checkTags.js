module.exports.register = function(handlebars) {

    handlebars.registerHelper('removeIgnore', function(arg1, arg2, options) {
        return arg1.replace(/^.*IGNORE.*$/mg, "");
    });

    handlebars.registerHelper('extractParent', function(arg1, arg2, options) {
        return arg1.split('-')[1];
    });

    handlebars.registerHelper('checkTemplate', function(arg1, arg2, options) {
        var ret = arg1;
        var allowedTemplates = [{
                name: 'sketch',
                label: 'Sketch Template',
                url: 'public/documents/sketch/'
            }
        ];
        for (var ii=0; ii<allowedTemplates.length; ii++) {
            var template = allowedTemplates[ii];
            if (arg1.indexOf(template.name) !== -1) {
                var pattern = arg2.split('-')[1];
                var url = template.url + pattern + '.sketch';
                ret = ret.replace(template.name, ''); // Remove the template name from the description
                ret += '<div class="text-right"><a class="btn btn--small btn--white-ghost" href="' + url + '" download="' + url + '">' + template.label + '<span class="qtr-margin-left icon-download"></span></a></div>';
            }
        }
        return new handlebars.SafeString(ret);
    });

    handlebars.registerHelper('checkTags', function(arg1, arg2, options) {
        var ret = arg1;
        var allowedTags = [{
                name: 'deprecated',
                label: 'deprecated',
                labelClass: 'label--warning label--bordered'
            },{
                name: 'new',
                label: 'new',
                labelClass: 'label--success label--bordered'
            },{
                name: 'updated',
                label: 'updated',
                labelClass: 'label--ghost'
            }
        ];
        for (var ii=0; ii<allowedTags.length; ii++) {
            var tag = allowedTags[ii];
            if (arg1.indexOf(tag.name) !== -1) {
                ret = arg1.substring(0, arg1.indexOf(tag.name)) +
                    ' <span class="label label--tiny ' + tag.labelClass +
                    ' qtr-margin-left">' + tag.label + '</span>';
            }
        }
        return new handlebars.SafeString(ret);
    });
};
