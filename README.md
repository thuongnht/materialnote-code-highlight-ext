# MaterialNote Code Highlight Plugin
 * [Live demo](http://practice.htdev.ga/materialnote/codehighlight/)
 * Based on [summernote-ext-highlight](https://github.com/heyanlong/summernote-ext-highlight/) and the [materialNote](http://www.web-forge.info/projects/materialNote)
 * Add plugin mechanism of materialNote
```javascript
$.materialnote.addPlugin = function(plugin) {
    // save plugin list
    $.materialnote.plugins.push(plugin);
    if (plugin.buttons) {
      $.each(plugin.buttons, function(name, button) {
        renderer.addButtonInfo(name, button);
      });
    }
    if (plugin.dialogs) {
      $.each(plugin.dialogs, function(name, dialog) {
        renderer.addDialogInfo(name, dialog);
      });
    }
    if (plugin.events) {
      $.each(plugin.events, function(name, event) {
        $.materialnote.pluginEvents[name] = event;
      });
    }
    if (plugin.langs) {
      $.each(plugin.langs, function(locale, lang) {
        if ($.materialnote.lang[locale]) {
          $.extend($.materialnote.lang[locale], lang);
        }
      });
    }
    if (plugin.options) {
      $.extend($.materialnote.options, plugin.options);
    }
};
```
 * Structure of plugin [Source](https://github.com/thuongnht/materialnote-code-highlight-ext/blob/master/js/libs/materialnote-code-highlight-ext.js)
```javascript
\\ ...

$.materialnote.addPlugin({
    buttons: {
            'highlight': function (lang, options) {
                return tmpl.iconButton("developer_mode", {
                    event: 'click',
                    title: 'highlight',
                    hide: false
                });
            }
    },
    dialogs: {
            'highlight': function (lang, options) {
                return createDialog(lang, options);
            }
    },
    events: {
            'click': function (layoutInfo, value, $target) {
            }
    },
    langs: {},
    options: {}
});
```

## Setup
 * Include [Materialize css](http://materializecss.com/getting-started.html)
 * Include [Google code-prettify](https://github.com/google/code-prettify)
 * Include [CodeMirror](https://github.com/Cerealkillerway/materialNote) (optional)
 * Include [Font Awesome](http://fontawesome.io/)
 * Include [materialNote](http://www.web-forge.info/projects/materialNote)
 * Include [material code-highlight plugin](https://github.com/thuongnht/materialnote-code-highlight-ext)
```HTML
<script src="http://your domain/materialnote-code-highlight-ext.js"></script>
```

## Usage (using jQuery for demo)
 * Configuration plugin
```javascript
var config = {
     height: 300,
     tabsize: 2,
     minHeight: 100,
     defaultBackColor: '#fff',
     prettifyHtml: false,
     toolbar: [
     //    ...
         ['highlight', ['highlight']],
     ]
};
```
 * Call material note and plugin
```javascript
$('.[class_name]').materialnote(config);
```
 * Preview
```javascript
$('.[preview_class_name]').html($.trim(($('.[class_name]').code()).replace(/(\r\n|\n|\r)/gm, "")));
$('.[class_name]').code('');
prettyPrint();
```

## Contacts
* Email: info@huuthuong.com
* Website: http://www.huuthuong.com/

## License
 * MaterialNote Code Highlight Plugin is free, but the references to Materialize CSS, MaterialNote, ... shown by owner