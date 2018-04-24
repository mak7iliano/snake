$(function() {
    var direction = 'right';
    var step = 20;
    var scoreStep = 10;
    var scoreLevel = 0;

    var wrapL = 0;
    var wrapR = $('.js-main-wrapper').width();
    var wrapT = 0;
    var wrapD = $('.js-main-wrapper').height();

    var tid;

    if (localStorage.getItem("hightScore")) {
        $('.hs-wrap').show();
        $('.hight-score-value').text(localStorage.getItem("hightScore"));
    }

    $('.js-start').click(function(){
        $(this).fadeOut();
        $('.sn-content-score').fadeIn();
        addPart();
        // window.setInterval(function(){
        //     go();
        // }, 500 - scoreLevel*100);
        tid = setInterval(go, 500 - scoreLevel*100);
    });

    $(document).on('keyup', function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 40) {
            if (direction != 'up' ) {
                direction = 'down';
            }
        } else if (code == 38) {
            if (direction != 'down' ) {
                direction = 'up';
            }
        } else if (code == 37) {
            if (direction != 'right' ) {
                direction = 'left';
            }
        } else if (code == 39) {
            if (direction != 'left' ) {
                direction = 'right';
            }
        } else if (code == 32) {
            if ($('body').hasClass('paused') ) {
                $('body').removeClass('paused');
                tid = setInterval(go, 500 - scoreLevel*100);
            } else {
                $('body').addClass('paused');
                clearInterval(tid);
            }
        }
    });

    function go() {
        if($('.sn-element.next').length) {
            $('.sn-element').each(function(){
                $(this).attr('data-top', $(this).position().top);
                $(this).attr('data-left', $(this).position().left);

                if (!$(this).hasClass('start')) {
                    var prevLeft = $(this).prev().attr('data-left');
                    var prevTop = $(this).prev().attr('data-top');
                    $(this).css({
                        'left': prevLeft + 'px',
                        'top': prevTop + 'px'
                    });
                }
            });
        }

        if($('.js-element.start').length) {
            var leftP = $('.js-element.start').position().left;
            var topP = $('.js-element.start').position().top;

            if (direction == 'right') {
                leftP = leftP + step;
            } else if (direction == 'left') {
                leftP = leftP - step;
            } else if (direction == 'up') {
                topP = topP - step;
            } else if (direction == 'down') {
                topP = topP + step;
            }

            $('.js-element.start').css({
                'left' : leftP,
                'top' : topP
            });

            checkFuckUp();
        }
    }

    function checkFuckUp() {
        var headL = $('.js-element.start').position().left;
        var headR = headL + $('.js-element.start').width();
        var headT = $('.js-element.start').position().top;
        var headB = headT + $('.js-element.start').height();

        var partT = $('.sn-part').position().top;
        var partL = $('.sn-part').position().left;

        if (headL < wrapL || headR > wrapR || headT < wrapT || headB > wrapD) {
            gameOver();
        }

        if (partT == headT && partL == headL ) {
            $('.sn-part').removeClass().addClass('sn-element next');
            var currentScore = parseFloat($('.score-value').text());
            var newScore = currentScore + scoreStep;
            var hightScore = parseFloat($('.hight-score-value').text());
            $('.score-value').text(newScore);

            if (newScore > hightScore) {
                localStorage.setItem("hightScore", newScore);
                $('.hight-score-value').text(newScore);
            }

            if (newScore >= 2000) {
                scoreLevel = 5;
                scoreStep = 60;
                clearInterval(tid);
                tid = setInterval(go, 500 - scoreLevel*100);
            } else if (newScore >= 1000) {
                scoreLevel = 4;
                scoreStep = 50;
                clearInterval(tid);
                tid = setInterval(go, 500 - scoreLevel*100);
            } else if (newScore >= 500) {
                scoreLevel = 3;
                scoreStep = 40;
                clearInterval(tid);
                tid = setInterval(go, 500 - scoreLevel*100);
            } else if (newScore >= 250) {
                scoreLevel = 2;
                scoreStep = 30;
                clearInterval(tid);
                tid = setInterval(go, 500 - scoreLevel*100);
            } else if (newScore >= 100) {
                scoreLevel = 1;
                scoreStep = 20;
                clearInterval(tid);
                tid = setInterval(go, 500 - scoreLevel*100);
            }

            $('.score-level').text(scoreLevel);

            addPart();
        } else {
            $('.sn-element').each(function(){
                if (!$(this).hasClass('start')) {
                    var bodyL = $(this).position().left;
                    var bodyT = $(this).position().top;

                    if (headL == bodyL && headT == bodyT) {
                        gameOver();
                    }
                }
            });
        }
    }

    function addPart() {
        xRandom = (Math.floor(Math.random() * wrapR / step) + 1) * step - step;
        yRandom = (Math.floor(Math.random() * wrapD / step) + 1) * step - step;
        $('.js-main-wrapper').append('<div class="sn-part " style="top: '+yRandom+'px; left: '+xRandom+'px"></div>');
    }

    function gameOver() {
        $('.js-main-wrapper').addClass('gameover').html('');
        $('.end-message').fadeIn();
    }
});