;(function() {
    const mesureWidth = item => {
        let reqItemWidth = 0;

        const screenWidth = $(window).width();
        const container = item.closest('.products-menu__list');
        const titlesBlocks = container.find('.product-menu-rotate');
        const titlesWidth = titlesBlocks.width() * titlesBlocks.length;

        const textContainer = item.find('.product-menu__desc p');
        const paddingLeft = parseInt(textContainer.css('padding-left'));
        const paddingRight = parseInt(textContainer.css('padding-right'));

        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (isMobile) {
            reqItemWidth = screenWidth - titlesWidth;
        } else {
            reqItemWidth = 520;
        };

        return {
            container: reqItemWidth,
            textContainer: reqItemWidth - paddingRight - paddingLeft
        };
    };

    const openItem = item => {
        const hiddenContent = item.find('.product-menu__desc');
        const reqWidth = mesureWidth(item);
        const textBlock = item.find('.product-menu__desc p');

        item.addClass('product-menu--active');
        hiddenContent.width(reqWidth.container);
        textBlock.width(reqWidth.textContainer);
    };

    const closeEveryItemInContainer = container => {
        const items = container.find('.product-menu__item');
        const content = container.find('.product-menu__desc');

        items.removeClass('product-menu--active');
        content.width(0);
    };

    $('.product-menu-rotate').on('click', e => {
        e.preventDefault();
        const $this = $(e.currentTarget);
        const item = $this.closest('.product-menu__item');
        const itemOpened = item.hasClass('product-menu--active');
        const container = $this.closest('.products-menu__list');

        if (itemOpened) {
            closeEveryItemInContainer(container);
        } else {
            closeEveryItemInContainer(container);
            openItem(item);
        };

        
    });
})()