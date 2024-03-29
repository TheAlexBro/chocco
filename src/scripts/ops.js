;(function () {
    const sections = $('section');
    const display = $('.maincontent');
    const sideMenu = $('.fixed-menu');
    const menuItems = $('.fixed-menu__item');

    const mobileDetect = new MobileDetect(window.navigator.userAgent);
    const isMobile = mobileDetect.mobile();

    let inScroll = false;

    const countSectionPosition = sectionEq => {
        const position = sectionEq * -100;

        if (isNaN(position)) {
            console.error('передано неверное значение countSectionPosition');
            return 0;
        };

        return position;
    };

    const changeMenuThemeForSection = sectionEq => {
        const currentSection = sections.eq(sectionEq);
        const menuTheme = currentSection.attr('data-sidemenu-theme');
        const activeClass = 'fixed-menu--shadowed';

        if (menuTheme === 'black') {
            sideMenu.addClass(activeClass);
        } else {
            sideMenu.removeClass(activeClass);
        };
    };

    const resetActiveClassForItem = (items, itemEq, activeClass) => {
        items.eq(itemEq).addClass(activeClass).siblings().removeClass(activeClass);
    };

    const performTransition = sectionEq => {

        if (inScroll) return;

        const transitionOver = 1000;
        const mousInertiaOver = 300; 

        inScroll = true;

        const position = countSectionPosition(sectionEq);

        changeMenuThemeForSection(sectionEq);

        display.css({
            transform: `translateY(${position}%)`
        });
        
        resetActiveClassForItem(sections, sectionEq, 'section--active');

        resetActiveClassForItem(menuItems, sectionEq, 'fixed-menu__item--active');

        setTimeout(() => {
            inScroll = false;
        }, transitionOver + mousInertiaOver);
    };

    sections.first().addClass('section--active');

    const viewportScroller = () => {
        const activeSection = sections.filter('.section--active');
        const nextSection = activeSection.next();
        const prevSection = activeSection.prev();

        return {
            next() {
                if (nextSection.length) {
                    performTransition(nextSection.index())
                };
            },
            prev() {
                if (prevSection.length) {
                    performTransition(prevSection.index())
                };
            }
        };
    };

    $(window).on('wheel', e => {
        const deltaY = e.originalEvent.deltaY;
        const scroller = viewportScroller();

        if (deltaY > 0) {
            scroller.next();
        };

        if (deltaY < 0) {
           scroller.prev();
        }; 
    });

    $(window).on('keydown', e=> {
        const tagName = e.target.tagName.toLowerCase(); //убрать скролл на полях ввода
        const userTypingInInputs = tagName === 'input' || tagName === 'textarea';
        const scroller = viewportScroller();

        if (userTypingInInputs) return; 

        switch (e.keyCode) {
            case 38: //prev
                scroller.prev();
                break;
            case 40: //next
                scroller.next();
                break;
        };   
    });

    $('.wrapper').on('touchmove', e => {
        e.preventDefault();
    });

    $('[data-scroll-to]').on('click', e=> {
        e.preventDefault();

        const $this = $(e.currentTarget);
        const target = $this.attr('data-scroll-to');
        const reqSection = $(`[data-section-id=${target}]`);

        const fMenu = document.querySelector('.fullscreen-menu');
        fMenu.style.top = "-100%";
        fMenu.style.opacity = 0;

        performTransition(reqSection.index());
    });

    if (isMobile) {
        //https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
        $("body").swipe( {
            swipe: function (
                event, 
                direction, 
            ) {
                const scroller = viewportScroller();
                let scrollDirection = "";

                if (direction === 'up') scrollDirection = 'next';
                if (direction === 'down') scrollDirection = 'prev';

                scroller[scrollDirection]();
            }
        });
    }


    
})()
