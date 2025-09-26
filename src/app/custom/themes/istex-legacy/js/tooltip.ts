// @ts-expect-error TS2581
$(document).ready(function () {
    function infobulle() {
        // @ts-expect-error TS2581
        $('.tooltipDessus').hide();
        // @ts-expect-error TS2581
        $('.tooltipDessous').hide();
        // @ts-expect-error TS2581
        $('.ttipContainer').hover(function () {
            // @ts-expect-error TS2581
            var tooltipActif = $(this).find('.tooltipDessous');
            // @ts-expect-error TS2581
            $(tooltipActif).toggle();
            // @ts-expect-error TS2581
            var hTooltipActif = $(tooltipActif).innerHeight() + 10;
            // @ts-expect-error TS2581
            var widthTooltipActif = $(tooltipActif).outerWidth() - 20;
            var positionH = '-' + widthTooltipActif / 2 + 'px';
            var positionV = '-' + hTooltipActif + 'px';
            // @ts-expect-error TS2581
            $(tooltipActif).css({ bottom: positionV, right: positionH });
        });
    }
    infobulle();
});
