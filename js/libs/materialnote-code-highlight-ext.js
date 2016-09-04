/*!
 * summernote highlight plugin
 * http://www.hyl.pw/
 *
 * Released under the MIT license
 */
(function (factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals: jQuery
        factory(window.jQuery);
    }
}(function ($) {

    // Extends plugins for adding highlight.
    //  - plugin is external module for customizing.
    console.log($.materialnote);
    var dom = $.materialnote.core.dom;
    var range = $.materialnote.core.range;
    var list = $.materialnote.core.list;
    var handler = $.materialnote.eventHandler;
    // get template function
    var tmpl = $.materialnote.renderer.getTemplate();

    var createDialog = function (lang, options) {

        var languages = [
            'bsh', 'c', 'cc', 'cpp', 'cs', 'csh', 'cyc', 'cv', 'htm', 'html',
            'java', 'js', 'm', 'mxml', 'perl', 'pl', 'pm', 'py', 'php', 'rb',
            'sh', 'xhtml', 'xml', 'xsl'
        ];

        var body = '<div class="row">' +
            '<div class="input-field col s12">' +
            '<select class="ext-highlight-select gray">' +
            '<option value="" disabled selected>Choose your option</option>';

        for (var i = 0; i < languages.length; i++) {
            body += '<option value="' + languages[i] + '">' + languages[i] + '</option>';
        }

        body +=   '</select>' +
            '<label>Select language</label>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="input-field col s12">' +
            '<textarea class="ext-highlight-code materialize-textarea" type="text" ></textarea>' +
            '<label>Enter the code fragment</label>' +
            '</div>' +
            '</div>';

        var footer = '<div class="waves-effect waves-light btn ext-highlight-btn disabled" disabled>' + 'Insert Code' + '</div>' +
            '<div class="waves-effect waves-light btn btnClose">' + lang.shortcut.close + '</div>';

        // console.log(body,footer);
        
        return tmpl.dialog('ext-highlight-dialog', 'Insert Code', body, footer);
    };

    var createCodeNode = function (code, select) {
        var $code = $('<code>');
        $code.html(code);
        $code.addClass('language-' + select);

        var $pre = $('<pre>');
        $pre.html($code);
        $pre.addClass('prettyprint').addClass('linenums');

        return $pre[0];
    };

    var showHighlightDialog = function (codeInfo, $dialog) {

        return $.Deferred(function (deferred) {
            var $extHighlightDialog = $dialog.find('.ext-highlight-dialog');
            var $extHighlightCode = $extHighlightDialog.find('.ext-highlight-code'),
                $extHighlightCodeLabel = $extHighlightCode.next('label'),
                $extHighlightBtn = $extHighlightDialog.find('.ext-highlight-btn'),
                $extHighlightSelect = $extHighlightDialog.find('.ext-highlight-select'),
                $closeBtn = $extHighlightDialog.find('.btnClose');

            var data = "";

            /**
             * toggle button status
             *
             * @private
             * @param {jQuery} $btn
             * @param {Boolean} isEnable
             */
            var toggleBtn = function($btn, isEnable) {
                $btn.toggleClass('disabled', !isEnable);
                $btn.attr('disabled', !isEnable);
            };

            /**
             * bind enter key
             *
             * @private
             * @param {jQuery} $input
             * @param {jQuery} $btn
             */
            var bindEnterKey = function($input, $btn) {
                $input.on('keypress', function(event) {
                    event.preventDefault();
                    if (event.keyCode === 13) {
                        $btn.trigger('click');
                    }
                });
            };
            
            $extHighlightDialog.openModal();
            toggleBtn($extHighlightBtn, false);
            $extHighlightSelect.material_select('destroy');
            $extHighlightSelect.material_select();
            $extHighlightCode.val(codeInfo.text);
            if (codeInfo.text.length > 0) $extHighlightCodeLabel.addClass('active');


            $closeBtn.click(function(event) {
                event.preventDefault();
                $extHighlightDialog.closeModal();
            });

            // $extHighlightSelect.on('change', function() {
            //     event.preventDefault();
            //     var val = $(this).find('option:selected').text();
            // });

            $extHighlightCode.on('keyup paste', function(event) {
                event.preventDefault();
                if (event.type === 'paste') {
                    data = event.originalEvent.clipboardData.getData('text');
                } else {
                    data = $extHighlightCode.val();
                }
                data = createCodeNode(data, $extHighlightSelect.find('option:selected').text());
                toggleBtn($extHighlightBtn, true);
            });

            //bindEnterKey($extHighlightCode, $extHighlightBtn);

            $extHighlightBtn.click(function(event) {
                event.preventDefault();
                console.log(data);
                deferred.resolve({
                    text: data,
                    range: codeInfo.range
                });
                $('.ext-highlight-code').val('');
                $('.ext-highlight-code').next('label').removeClass("active");
                $extHighlightDialog.closeModal();
                // deferred.resolve();
            });

        }).promise();
    };

    var getCodeInfo = function ($editable) {
        var text = handler.invoke('editor.getLinkInfo', $editable);
        return text || '';
    };

    var insertCode = function(value, $editable, codeInfo) {
        var text = codeInfo.text;
        var rng = codeInfo.range;
        var isTextChanged = (rng) ? (rng.toString() !== text) : true;

        value.beforeCommand($editable);

        var anchors = [];
        if (isTextChanged) {
            var anchor = rng.insertNode(text);
            anchors.push(anchor);

            var startRange = range.createFromNodeBefore(list.head(anchors));
            var startPoint = startRange.getStartPoint();
            var endRange = range.createFromNodeAfter(list.last(anchors));
            var endPoint = endRange.getEndPoint();

            range.create(
                startPoint.node,
                startPoint.offset,
                endPoint.node,
                endPoint.offset
            ).select();
        }

        value.afterCommand($editable);

    };

    // // This methods will be called when editor is destroyed by $('..').summernote('destroy');
    // // You should remove elements on `initialize`.
    // var destroy = function ($dialog) {
    //     $dialog.closeModal();
    //     this.$dialog.remove();
    // };

    $.materialnote.addPlugin({
        buttons: {
            'highlight': function (lang, options) {
                // make icon button by template function

                return tmpl.iconButton("developer_mode", {
                    // callback function name when button clicked
                    event: 'click',
                    // set data-value property
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

                var $editable = $target.editable(),
                    $dialog = $target.dialog();

                var codeInfo = getCodeInfo($editable);

                handler.invoke('editor.saveRange', $editable);
                showHighlightDialog(codeInfo, $dialog).then(function (data) {
                    
                    handler.invoke('editor.restoreRange', $editable);
                    insertCode(value, $editable, data);

                }).fail(function() {
                    handler.invoke('editor.restoreRange', $editable);
                });

            }

        },

        langs: {},

        options: {}

    });

}));
