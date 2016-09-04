"use strict";

$(document).ready(function () {

    var config = {
        height: 300,
        tabsize: 2,
        minHeight: 100,
        defaultBackColor: '#fff',
        prettifyHtml: false,
        toolbar: [
            ['style', ['style', 'bold', 'italic', 'underline', 'strikethrough', 'clear']],
            ['fonts', ['fontsize', 'fontname']],
            ['color', ['color']],
            ['undo', ['undo', 'redo', 'help']],
            ['ckMedia', ['ckImageUploader', 'ckVideoEmbeeder']],
            ['misc', ['link', 'picture', 'table', 'hr', 'codeview', 'fullscreen']],
            ['para', ['ul', 'ol', 'paragraph', 'leftButton', 'centerButton', 'rightButton', 'justifyButton', 'outdentButton', 'indentButton']],
            ['height', ['lineheight']],
            ['highlight', ['highlight']],
        ]
    };

    $('.content-editor').materialnote(config);

    // content events
    $('.save').on('click', function (e) {
        e.preventDefault();

        $('.show-content').html($('.content-editor').code());
        $('.content-editor').code('');
        prettyPrint();

    });

    // div after header div
    $('.container-body').css('marginTop', $('.header-position').outerHeight(true) + 10 * window.innerHeight / 100);
    $('.container-body').css('marginBottom', $('.footer-position').outerHeight(true) + 15 * window.innerHeight / 100);

    // enable select tag
    $('select').material_select();

    // show tooltips
    $('.tooltipped').tooltip({delay: 50});

});