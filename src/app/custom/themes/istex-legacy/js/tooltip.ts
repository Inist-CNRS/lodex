$(document).ready(function(){
    function infobulle(){
        $('.tooltipDessus').hide();
        $('.tooltipDessous').hide();
        $('.ttipContainer').hover(function(){
                var tooltipActif = $(this).find('.tooltipDessous');
                $(tooltipActif).toggle();
                var hTooltipActif = $(tooltipActif).innerHeight()+10;
                var widthTooltipActif = $(tooltipActif).outerWidth()-20;
                var positionH = '-'+widthTooltipActif/2 +'px';
                var positionV = '-'+hTooltipActif+'px';
                $(tooltipActif ).css({'bottom' : positionV,'right':positionH});
        });
    }
    infobulle();
});