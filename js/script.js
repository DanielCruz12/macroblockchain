
    /*EMAILJS*/
    const btn = document.getElementById('button');

    document.getElementById('new_contact')
     .addEventListener('submit', function(event) {
       event.preventDefault();
    
       btn.value = 'Enviando...';
    
       const serviceID = 'default_service';
       const templateID = 'template_mxw572p';
     
    
       emailjs.sendForm(serviceID, templateID, this)
        .then(() =>  {
          btn.value = 'ENVIAR';  
          
        }, (err) => {
          btn.value = 'ENVIAR';
          alert(JSON.stringify(err));
          return false;
        });
       
    });
    

/*INICIO SERVICIOS*/
function imgSlider(anything) {
    document.querySelector('.starbucks').src = anything;
}

function focusInput() {
    $(".input input, .input textarea").on("focusin touch", function () {
        $(this).parent().addClass("focus")
    }).focusout(function () {
        removeInputFocus(this)
    })
}

function removeInputFocus(e) {
    "" == $(e).val() && $(e).parent().removeClass("focus")
}

function toggleOverflow() {
    $(".toggle-overflow").on("mouseover touch", function () {
        if ($(window).width() > 800) {
            var e = $(this).find(".content-overflow"),
                t = $(this).siblings(".toggle-overflow.active");
            $(t).removeClass("active"), $(t).find(".content-overflow").css("height", 0), $(this).addClass("active"), e.css("height", e.children().height())
        }
    }).mouseout(function () {
        $(window).width() > 800 && ($(this).find(".content-overflow").css("height", 0), $(this).removeClass("active"))
    })
}


function toggleMenu() {
    $(".menu-button-wrapper").click(function () {
        $(".fixed").hasClass("active") ? ($(".top-navbar").removeClass("white menu-active"), navbarDefaultColor(), $(".fixed").removeClass("active"), $("body").removeClass("no-scroll")) : ($(".top-navbar").addClass("white menu-active"), $(".menu-wrapper").addClass("active"), $("body").addClass(""))
    })
}



function toggleContact() {
    $(".toggle-contact").click(function (e) {
        if (e.preventDefault(), e.stopImmediatePropagation(), $(".menu-wrapper").removeClass("active"), $(".top-navbar").removeClass("white"), $("section.contact").not(".fixed").length > 0) {
            var t = $("section.contact").not(".fixed").offset().top;
            $("body, html").animate({
                scrollTop: t
            }, 1e3, "swing", function () {
                $('section.contact form input[name="name"]').focus()
            })
        } else $(".contact.fixed").addClass("active")
    })
}

function toggleServices() {
    $(".toggle-services").click(function (e) {
        if (e.preventDefault(), e.stopImmediatePropagation(), $(".menu-wrapper").removeClass("active"), $(".top-navbar").removeClass("white"), $("section.services").not("").length > 0) {
            var T = $("section.services").not("").offset().top;
            $("body, html").animate({
                scrollTop: T
            }, 1e3, "swing", function () {
                $('section.services').focus()
            })
        } else $(".services").addClass("active")
    })
}

function toggleAbout() {
    $(".toggle-about").click(function (e) {
        if (e.preventDefault(), e.stopImmediatePropagation(), $(".menu-wrapper").removeClass("active"), $(".top-navbar").removeClass("white"), $("section.about").not("").length > 0) {
            var P = $("section.about").not("").offset().top;
            $("body, html").animate({
                scrollTop: P
            }, 1e3, "swing", function () {
                $('section.about').focus()
            })
        } else $(".about").addClass("active")
    })
}


/*CAMBIAR COLOR DE MENU */
function navbarDefaultColor(e) {
    e ? setTimeout(function () {
        changeNavbarDefaultColor()
    }, 1e3) : changeNavbarDefaultColor()
}

function changeNavbarDefaultColor() {
    var e = $(".top-navbar").data("color");
    $(window).scrollTop() < $(window).height() - 40 ? $(".top-navbar").addClass(e) : $(window).scrollTop() > $(window).height() - 40 && !$(".top-navbar").hasClass("menu-active") && $(".top-navbar").removeClass(e), $(window).scrollTop() < 40 ? $(".bot-navbar").addClass(e) : $(".bot-navbar").removeClass(e)
}

function scrollNavbarDefaultColor() {
    setInterval(function () {
        navbarDefaultColor(!0)
    }, 100)
}


/*INICIO SLIDER PROYECTOS*/
function projectSlider(e, t) {
    t ? projectsInterval(e) : ($(".slider-counter-load").addClass("out"), clearInterval(interval))
}

function projectsInterval(e) {
    var t = $(".slider-counter").children("li").length,
        n = e;
    setCounter(n), setProject(n), $(".slider-counter-load span").addClass("start"), interval = setInterval(function () {
        (n += 1) == t && (n = 0), nextProject(n)
    }, 1e4)
}

function nextProject(e) {
    setProject(e), resetCounter(e)
}

function resetCounter(e) {
    $(".slider-counter-load").removeClass("in").addClass("out"), setTimeout(function () {
        $(".slider-counter-load").remove(), setCounter(e)
    }, 1e3)
}

function setProject(e) {
    var t = '.project-content[data-id="' + e + '"], .project-img[data-id="' + e + '"]';
    $(".project-content.in, .project-img.in").addClass("out").removeClass("in"), $(t).addClass("in").removeClass("out")
}

function setCounter(e) {
    var t = $("<span>", {
            "class": "start"
        }),
        n = $("<div>", {
            "class": "project-colorize slider-counter-load in"
        }),
        i = $(".slider-counter").children("li")[e];
    n.append(t), n.insertAfter(i), $(".slider-counter li.active").removeClass("active"), $(i).addClass("active")
}

function changeProject() {
    $(".slider-counter li").click(function () {
        var e = $(this).data("id");
        projectSlider(e, !1), setTimeout(function () {
            $(".slider-counter-load").remove(), projectSlider(e, !0)
        }, 1e3)
    })
}
/*FIN SLIDER PROYECTOS*/
