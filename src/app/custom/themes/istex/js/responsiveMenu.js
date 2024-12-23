$(document).ready(function () {
    var maxBreakpoint = 900;
    var minBreakpoint = maxBreakpoint + 1;
    var targetID = 'navigation-main';
    var triggerID = 'toggle-nav';
    var n = document.getElementById(targetID);
    n.classList.add('is-closed');
    /* var freresvoyageurs = $(".contact").siblings();*/

    function navi() {
        if (
            window.matchMedia('(max-width:' + maxBreakpoint + 'px)').matches &&
            document.getElementById(triggerID) == undefined
        ) {
            n.insertAdjacentHTML(
                'afterBegin',
                '<button id=' +
                    triggerID +
                    ' title="afficher le menu" class="nav-button"></button>',
            );
            t = document.getElementById(triggerID);
            t.onclick = function () {
                n.classList.toggle('is-closed');
            };

            /* $('.menu').append(freresvoyageurs);
        $(freresvoyageurs).wrapAll( "<li class='new'></li>" );
        $('.tt').removeClass("tooltipDessous");*/
        }
        if (
            window.matchMedia('(min-width: ' + minBreakpoint + 'px)').matches &&
            document.getElementById(triggerID)
        ) {
            document.getElementById(triggerID).outerHTML = '';
            /* $(freresvoyageurs).unwrap();
        $('.interactions').prepend(freresvoyageurs);
        $('.tt').addClass("tooltipDessous");*/
        }
    }
    navi();
    window.addEventListener('resize', navi);
});
