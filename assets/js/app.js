require('../scss/all.scss');
require('bootstrap');
require ("@fortawesome/fontawesome-free/css/all.css");
require('jquery');
require('hammerjs');
require('velocity-animate');


// page init
jQuery(function() {
    initCycleCarousel();
    initBackgroundResize();
    // menu
    menu.init();
    // scroller
    scroller.init();
});

// cycle scroll gallery init
function initCycleCarousel() {
    jQuery('.cycle-gallery').scrollAbsoluteGallery({
        mask: '.mask',
        slider: '.slideset',
        slides: '.slide',
        btnPrev: 'a.btn-prev',
        btnNext: 'a.btn-next',
        pagerLinks: '.pagination li',
        stretchSlideToMask: true,
        pauseOnHover: true,
        maskAutoSize: true,
        autoRotation: false,
        switchTime: 3000,
        animSpeed: 500
    });
}

// stretch background to fill blocks
function initBackgroundResize() {
    jQuery('.visual-area').each(function() {
        ImageStretcher.add({
            container: this,
            image: 'img.bg-stretch'
        });
    });
}

var body = $('body'),
    // menu for mobile view
    menu = {
        config : {
            trigger : jQuery('.nav-opener'),
            open : false
        },
        init : function() {
            this.config.trigger.click(this.toggle.bind(this));
        },
        toggle : function() {
            if(this.config.open) {
                body.removeClass('nav-active');
            }
            else {
                body.addClass('nav-active');
            }
            this.config.open = !this.config.open;
        }
    };

// move some elements on scroll
var scroller = {
        config : {
            docElem : window.document.documentElement,
            // The viewportFactor defines how much of the appearing item has to be visible in order to trigger the animation
            // if we'd use a value of 0, this would mean that it would add the animation class as soon as the item is in the viewport.
            // If we were to use the value of 1, the animation would only be triggered when we see all of the item in the viewport (100% of it)
            viewportFactor : 0,
            elems : '.slide-holder'
        },
        getViewportH : function() {
            var client = this.config.docElem['clientHeight'],
                inner = window['innerHeight'];

            if( client < inner )
                return inner;
            else
                return client;
        },
        scrollY : function() {
            return window.pageYOffset || this.config.docElem.scrollTop;
        },
        getOffset : function(el) {
            var offsetTop = 0, offsetLeft = 0;
            do {
                if ( !isNaN( el.offsetTop ) ) {
                    offsetTop += el.offsetTop;
                }
                if ( !isNaN( el.offsetLeft ) ) {
                    offsetLeft += el.offsetLeft;
                }
            } while( el = el.offsetParent )

            return {
                top : offsetTop,
                left : offsetLeft
            }
        },
        inViewport : function(el, h) {
            var elH = el.offsetHeight,
                scrolled = this.scrollY(),
                viewed = scrolled + this.getViewportH(),
                elTop = this.getOffset(el).top,
                elBottom = elTop + elH,
                // if 0, the element is considered in the viewport as soon as it enters.
                // if 1, the element is considered in the viewport only when it's fully inside
                // value in percentage (1 >= h >= 0)
                h = h || 0;

            return (elTop + elH * h) <= viewed && (elBottom) >= scrolled;
        },
        init : function() {
            this.sections = jQuery(this.config.elems);
            this.didScroll = false;

            var self = this,
                scrollHandler = function() {
                    if( !self.didScroll ) {
                        self.didScroll = true;
                        setTimeout( function() { self.scrollPage(); }, 60 );
                    }
                },
                resizeHandler = function() {
                    function delayed() {
                        self.scrollPage();
                        self.resizeTimeout = null;
                    }
                    if ( self.resizeTimeout ) {
                        clearTimeout( self.resizeTimeout );
                    }
                    self.resizeTimeout = setTimeout( delayed, 200 );
                };

            window.addEventListener( 'scroll', scrollHandler, false );
            window.addEventListener( 'resize', resizeHandler, false );
        },
        scrollPage : function() {
            var self = this;

            this.sections.each(function() {
                if( self.inViewport( this, self.config.viewportFactor ) ) {
                    jQuery(this).addClass('scroll-effect-animate');
                }
                else {
                    // this add class init if it doesn't have it. This will ensure that the items initially in the viewport will also animate on scroll
                    jQuery(this).addClass('scroll-effect-init');
                    jQuery(this).removeClass('scroll-effect-animate');
                }
            });
            this.didScroll = false;
        }
    }

    /*
     * jQuery Cycle Carousel plugin
     */
;(function($){
    function ScrollAbsoluteGallery(options) {
        this.options = $.extend({
            activeClass: 'active',
            mask: 'div.slides-mask',
            slider: '>ul',
            slides: '>li',
            btnPrev: '.btn-prev',
            btnNext: '.btn-next',
            pagerLinks: 'ul.pager > li',
            generatePagination: false,
            pagerList: '<ul>',
            pagerListItem: '<li><a href="#"></a></li>',
            pagerListItemText: 'a',
            galleryReadyClass: 'gallery-js-ready',
            currentNumber: 'span.current-num',
            totalNumber: 'span.total-num',
            maskAutoSize: false,
            autoRotation: false,
            pauseOnHover: false,
            stretchSlideToMask: false,
            switchTime: 3000,
            animSpeed: 500,
            handleTouch: true,
            swipeThreshold: 15,
            vertical: false
        }, options);
        this.init();
    }
    ScrollAbsoluteGallery.prototype = {
        init: function() {
            if(this.options.holder) {
                this.findElements();
                this.attachEvents();
                this.makeCallback('onInit', this);
            }
        },
        findElements: function() {
            // find structure elements
            this.holder = $(this.options.holder).addClass(this.options.galleryReadyClass);
            this.mask = this.holder.find(this.options.mask);
            this.slider = this.mask.find(this.options.slider);
            this.slides = this.slider.find(this.options.slides);
            this.btnPrev = this.holder.find(this.options.btnPrev);
            this.btnNext = this.holder.find(this.options.btnNext);

            // slide count display
            this.currentNumber = this.holder.find(this.options.currentNumber);
            this.totalNumber = this.holder.find(this.options.totalNumber);

            // create gallery pagination
            if(typeof this.options.generatePagination === 'string') {
                this.pagerLinks = this.buildPagination();
            } else {
                this.pagerLinks = this.holder.find(this.options.pagerLinks);
            }

            // define index variables
            this.sizeProperty = this.options.vertical ? 'height' : 'width';
            this.positionProperty = this.options.vertical ? 'top' : 'left';
            this.animProperty = this.options.vertical ? 'marginTop' : 'marginLeft';

            this.slideSize = this.slides[this.sizeProperty]();
            this.currentIndex = 0;
            this.prevIndex = 0;

            // reposition elements
            this.options.maskAutoSize = this.options.vertical ? false : this.options.maskAutoSize;
            if(this.options.vertical) {
                this.mask.css({
                    height: this.slides.innerHeight()
                });
            }
            if(this.options.maskAutoSize){
                this.mask.css({
                    height: this.slider.height()
                });
            }
            this.slider.css({
                position: 'relative',
                height: this.options.vertical ? this.slideSize * this.slides.length : '100%'
            });
            this.slides.css({
                position: 'absolute'
            }).css(this.positionProperty, -9999).eq(this.currentIndex).css(this.positionProperty, 0);
            this.refreshState();
        },
        buildPagination: function() {
            var pagerLinks = $();
            if(!this.pagerHolder) {
                this.pagerHolder = this.holder.find(this.options.generatePagination);
            }
            if(this.pagerHolder.length) {
                this.pagerHolder.empty();
                this.pagerList = $(this.options.pagerList).appendTo(this.pagerHolder);
                for(var i = 0; i < this.slides.length; i++) {
                    $(this.options.pagerListItem).appendTo(this.pagerList).find(this.options.pagerListItemText).text(i+1);
                }
                pagerLinks = this.pagerList.children();
            }
            return pagerLinks;
        },
        attachEvents: function() {
            // attach handlers
            var self = this;
            if(this.btnPrev.length) {
                this.btnPrevHandler = function(e) {
                    e.preventDefault();
                    self.prevSlide();
                };
                this.btnPrev.click(this.btnPrevHandler);
            }
            if(this.btnNext.length) {
                this.btnNextHandler = function(e) {
                    e.preventDefault();
                    self.nextSlide();
                };
                this.btnNext.click(this.btnNextHandler);
            }
            if(this.pagerLinks.length) {
                this.pagerLinksHandler = function(e) {
                    e.preventDefault();
                    self.numSlide(self.pagerLinks.index(e.currentTarget));
                };
                this.pagerLinks.click(this.pagerLinksHandler);
            }

            // handle autorotation pause on hover
            if(this.options.pauseOnHover) {
                this.hoverHandler = function() {
                    clearTimeout(self.timer);
                };
                this.leaveHandler = function() {
                    self.autoRotate();
                };
                this.holder.bind({mouseenter: this.hoverHandler, mouseleave: this.leaveHandler});
            }

            // handle holder and slides dimensions
            this.resizeHandler = function() {
                if(!self.animating) {
                    if(self.options.stretchSlideToMask) {
                        self.resizeSlides();
                    }
                    self.resizeHolder();
                    self.setSlidesPosition(self.currentIndex);
                }
            };
            $(window).bind('load resize orientationchange', this.resizeHandler);
            if(self.options.stretchSlideToMask) {
                self.resizeSlides();
            }

            // handle swipe on mobile devices
            if(this.options.handleTouch && window.Hammer && this.mask.length && this.slides.length > 1 && isTouchDevice) {
                this.swipeHandler = new Hammer.Manager(this.mask[0]);
                this.swipeHandler.add(new Hammer.Pan({
                    direction: self.options.vertical ? Hammer.DIRECTION_VERTICAL : Hammer.DIRECTION_HORIZONTAL,
                    threshold: self.options.swipeThreshold
                }));
                
                console.log("Hammer");

                this.swipeHandler.on('panstart', function() {
                    if(self.animating) {
                        self.swipeHandler.stop();
                    } else {
                        clearTimeout(self.timer);
                    }
                }).on('panmove', function(e) {
                    self.swipeOffset = -self.slideSize + e[self.options.vertical ? 'deltaY' : 'deltaX'];
                    self.slider.css(self.animProperty, self.swipeOffset);
                    clearTimeout(self.timer);
                }).on('panend', function(e) {
                    if(e.distance > self.options.swipeThreshold) {
                        if(e.offsetDirection === Hammer.DIRECTION_RIGHT || e.offsetDirection === Hammer.DIRECTION_DOWN) {
                            self.nextSlide();
                        } else {
                            self.prevSlide();
                        }
                    } else {
                        var tmpObj = {};
                        tmpObj[self.animProperty] = -self.slideSize;
                        self.slider.animate(tmpObj, {duration: self.options.animSpeed});
                        self.autoRotate();
                    }
                    self.swipeOffset = 0;
                });
            }

            // start autorotation
            this.autoRotate();
            this.resizeHolder();
            this.setSlidesPosition(this.currentIndex);
        },
        resizeSlides: function() {
            this.slideSize = this.mask[this.options.vertical ? 'height' : 'width']();
            this.slides.css(this.sizeProperty, this.slideSize);
        },
        resizeHolder: function() {
            if(this.options.maskAutoSize) {
                this.mask.css({
                    height: this.slides.eq(this.currentIndex).outerHeight(true)
                });
            }
        },
        prevSlide: function() {
            if(!this.animating && this.slides.length > 1) {
                this.direction = -1;
                this.prevIndex = this.currentIndex;
                if(this.currentIndex > 0) this.currentIndex--;
                else this.currentIndex = this.slides.length - 1;
                this.switchSlide();
            }
        },
        nextSlide: function(fromAutoRotation) {
            if(!this.animating && this.slides.length > 1) {
                this.direction = 1;
                this.prevIndex = this.currentIndex;
                if(this.currentIndex < this.slides.length - 1) this.currentIndex++;
                else this.currentIndex = 0;
                this.switchSlide();
            }
        },
        numSlide: function(c) {
            if(!this.animating && this.currentIndex !== c && this.slides.length > 1) {
                this.direction = c > this.currentIndex ? 1 : -1;
                this.prevIndex = this.currentIndex;
                this.currentIndex = c;
                this.switchSlide();
            }
        },
        preparePosition: function() {
            // prepare slides position before animation
            this.setSlidesPosition(this.prevIndex, this.direction < 0 ? this.currentIndex : null, this.direction > 0 ? this.currentIndex : null, this.direction);
        },
        setSlidesPosition: function(index, slideLeft, slideRight, direction) {
            // reposition holder and nearest slides
            if(this.slides.length > 1) {
                var prevIndex = (typeof slideLeft === 'number' ? slideLeft : index > 0 ? index - 1 : this.slides.length - 1);
                var nextIndex = (typeof slideRight === 'number' ? slideRight : index < this.slides.length - 1 ? index + 1 : 0);

                this.slider.css(this.animProperty, this.swipeOffset ? this.swipeOffset : -this.slideSize);
                this.slides.css(this.positionProperty, -9999).eq(index).css(this.positionProperty, this.slideSize);
                if(prevIndex === nextIndex && typeof direction === 'number') {
                    var calcOffset = direction > 0 ? this.slideSize*2 : 0;
                    this.slides.eq(nextIndex).css(this.positionProperty, calcOffset);
                } else {
                    this.slides.eq(prevIndex).css(this.positionProperty, 0);
                    this.slides.eq(nextIndex).css(this.positionProperty, this.slideSize*2);
                }
            }
        },
        switchSlide: function() {
            // prepare positions and calculate offset
            var self = this;
            var oldSlide = this.slides.eq(this.prevIndex);
            var newSlide = this.slides.eq(this.currentIndex);
            this.animating = true;

            // resize mask to fit slide
            if(this.options.maskAutoSize) {
                this.mask.animate({
                    height: newSlide.outerHeight(true)
                }, {
                    duration: this.options.animSpeed
                });
            }

            // start animation
            var animProps = {};
            animProps[this.animProperty] = this.direction > 0 ? -this.slideSize*2 : 0;
            this.preparePosition();
            this.slider.animate(animProps,{duration:this.options.animSpeed, complete:function() {
                    self.setSlidesPosition(self.currentIndex);

                    // start autorotation
                    self.animating = false;
                    self.autoRotate();

                    // onchange callback
                    self.makeCallback('onChange', self);
                }});

            // refresh classes
            this.refreshState();

            // onchange callback
            this.makeCallback('onBeforeChange', this);
        },
        refreshState: function(initial) {
            // slide change function
            this.slides.removeClass(this.options.activeClass).eq(this.currentIndex).addClass(this.options.activeClass);
            this.pagerLinks.removeClass(this.options.activeClass).eq(this.currentIndex).addClass(this.options.activeClass);

            // display current slide number
            this.currentNumber.html(this.currentIndex + 1);
            this.totalNumber.html(this.slides.length);

            // add class if not enough slides
            this.holder.toggleClass('not-enough-slides', this.slides.length === 1);
        },
        autoRotate: function() {
            var self = this;
            clearTimeout(this.timer);
            if(this.options.autoRotation) {
                this.timer = setTimeout(function() {
                    self.nextSlide();
                }, this.options.switchTime);
            }
        },
        makeCallback: function(name) {
            if(typeof this.options[name] === 'function') {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                this.options[name].apply(this, args);
            }
        },
        destroy: function() {
            // destroy handler
            this.btnPrev.unbind('click', this.btnPrevHandler);
            this.btnNext.unbind('click', this.btnNextHandler);
            this.pagerLinks.unbind('click', this.pagerLinksHandler);
            this.holder.unbind('mouseenter', this.hoverHandler);
            this.holder.unbind('mouseleave', this.leaveHandler);
            $(window).unbind('load resize orientationchange', this.resizeHandler);
            clearTimeout(this.timer);

            // destroy swipe handler
            if(this.swipeHandler) {
                this.swipeHandler.destroy();
            }

            // remove inline styles, classes and pagination
            this.holder.removeClass(this.options.galleryReadyClass);
            this.slider.add(this.slides).removeAttr('style');
            if(typeof this.options.generatePagination === 'string') {
                this.pagerHolder.empty();
            }
        }
    };

    // detect device type
    var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

    // jquery plugin
    $.fn.scrollAbsoluteGallery = function(opt){
        return this.each(function(){
            $(this).data('ScrollAbsoluteGallery', new ScrollAbsoluteGallery($.extend(opt,{holder:this})));
        });
    };
}(jQuery));

/*
 * Image Stretch module
 */
var ImageStretcher = {
    getDimensions: function(data) {
        // calculate element coords to fit in mask
        var ratio = data.imageRatio || (data.imageWidth / data.imageHeight),
            slideWidth = data.maskWidth,
            slideHeight = slideWidth / ratio;

        if(slideHeight < data.maskHeight) {
            slideHeight = data.maskHeight;
            slideWidth = slideHeight * ratio;
        }
        return {
            width: slideWidth,
            height: slideHeight,
            top: (data.maskHeight - slideHeight) / 2,
            left: (data.maskWidth - slideWidth) / 2
        };
    },
    getRatio: function(image) {
        if(image.prop('naturalWidth')) {
            return image.prop('naturalWidth') / image.prop('naturalHeight');
        } else {
            var img = new Image();
            img.src = image.prop('src');
            return img.width / img.height;
        }
    },
    imageLoaded: function(image, callback) {
        var self = this;
        var loadHandler = function() {
            callback.call(self);
        };
        if(image.prop('complete')) {
            loadHandler();
        } else {
            image.one('load', loadHandler);
        }
    },
    resizeHandler: function() {
        var self = this;
        jQuery.each(this.imgList, function(index, item) {
            if(item.image.prop('complete')) {
                self.resizeImage(item.image, item.container);
            }
        });
    },
    resizeImage: function(image, container) {
        this.imageLoaded(image, function() {
            var styles = this.getDimensions({
                imageRatio: this.getRatio(image),
                maskWidth: container.width(),
                maskHeight: container.height()
            });
            image.css({
                width: styles.width,
                height: styles.height,
                marginTop: styles.top,
                marginLeft: styles.left
            });
        });
    },
    add: function(options) {
        var container = jQuery(options.container ? options.container : window),
            image = typeof options.image === 'string' ? container.find(options.image) : jQuery(options.image);

        // resize image
        this.resizeImage(image, container);

        // add resize handler once if needed
        if(!this.win) {
            this.resizeHandler = jQuery.proxy(this.resizeHandler, this);
            this.imgList = [];
            this.win = jQuery(window);
            this.win.on('resize orientationchange', this.resizeHandler);
        }

        // store item in collection
        this.imgList.push({
            container: container,
            image: image
        });
    }
};
