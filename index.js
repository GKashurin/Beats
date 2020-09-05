let hamburger = document.querySelector('.hamburger');
let overlay = document.querySelector('.overlay');
let body = document.querySelector('body');
let links = document.querySelectorAll('.menu__link');

links.forEach(function (element) {
  element.addEventListener('click', toggleMenu);
})
// крестик закрытие
function toggleMenu() {
  hamburger.classList.toggle('hamburger--active');
  overlay.classList.toggle('overlay--active');
  body.classList.toggle('body--active-menu');
}

hamburger.addEventListener('click', toggleMenu);


//team
const openItem = item /*это название массива*/ => {
  const container = item.closest('.team__item');
  const contentBlock = container.find('.team__content'); //в тим айтем ищем тим контент
  const textBlock = contentBlock.find('.team__content-block');
  const reqHeight = textBlock.height();

  container.addClass('active');
  contentBlock.height(reqHeight); // блоку присваиваю высоту в зависимости от кол-ва текста при открытии
  }

  const closeEveryItem = container => {
    const items = container.find('.team__content');
    const itemContainer = container.find('.team__item');

    itemContainer.removeClass('active');
    items.height(0);
  }

$('.team__present').click(e => {
  const $this = $(e.currentTarget);
  const container = $this.closest('.team');  // closest = ближайший
  const elemContainer = $this.closest('.team__item');

  if (elemContainer.hasClass('active')) {
  closeEveryItem(container);
  } else {
  closeEveryItem(container);
  openItem($this);
  }
});


//slider
$('.products').bxSlider({
  pager:false
});


//reviews
const findBlockByAlias = alias => {
return $('.reviews__item').filter((ndx, item) => {  // item - это переменная
return $(item).attr('data-linked-with') === alias
});
}

$('.reviews__switcher-item-link').click(e => {
  e.preventDefault();
   // из свичера берем значение атр. дата-оупен в переменную таргет. Передаем этот таргет в фильтр findBlockByAlias. 
   //Он сравнивает это значение с data-linked-with в элементе  reviews__item
  const $this = $(e.currentTarget);
  const target = $this.attr('data-open');
  const itemToShow = findBlockByAlias(target);  
  const curItem = $this.closest('.reviews__switcher-item');

  itemToShow
  .addClass('reviews__item--active')
  .siblings()
  .removeClass('reviews__item--active');

  curItem
  .addClass('reviews__switcher-item--active')
  .siblings()
  .removeClass('reviews__switcher-item--active');
});


// Modal
// let btnSubmit = document.getElementById("btnModal");
// btnSubmit.addEventListener('click', toggleMenu);

const validateFields = (form, fieldsArray) => {
  fieldsArray.forEach((field) => {
    field.removeClass("input-error");
    if (field.val().trim() == "") {
      field.addClass("input-error");
    }
  });

  const errorFields = form.find(".input-error");
  return errorFields.length == 0;
}
 

$('.form').submit(e => {
  e.preventDefault();
  
  const form = $(e.currentTarget);
  const name = form.find("[name='name']");
  const phone = form.find("[name='phone']");
  const comment = form.find("[name='comment']");
  const to = form.find("[name='to']");

  const modal = $("#modal");
  const content = modal.find(".modal__content");

  modal.removeClass("error-modal");

  const isValid = validateFields(form, [name, phone, comment, to])

  if (isValid) {
    const request = $.ajax({
      url: "https://webdev-api.loftschool.com/sendmail",
      method: "post",
      data: {
        name: name.val(),
        phone: phone.val(),
        comment: comment.val(),
        to: to.val(),
      },
      
      error: _data => {
        
      }
    });
    request.done(data => {
      content.text(data.message)
      });

    request.fail(data => {
      const message = data.responseJSON.message;
        content.text(message);
        modal.addClass("error-modal"); 
    });

    request.always(() => {
      $.fancybox.open({
        src: "#modal",
        type: "inline",
      });
    })
  }
});

$(".app-submit-btn").click (e => {
  e.preventDefault();

  $.fancybox.close();
})


//accordion 
//  const mesureWidth = () => {
//   return 500;
//  }

//  //const openItem = item => {
//  const hiddenContent = item.find(".sizes__item-description");
//  const reqWidth = mesureWidth();

//  hiddenContent.width(reqWidth);
//  }

//  $(".sizes__title").on("click", e => {
//  e.preventDefault();

//  const $this = $(e.currentTarget);
//  const item = $this.closest(".sizes__item");

//  openItem(item);
//  });



//player
let player;
const playerContainer = $(".player");
let eventsInit = () => {
  $(".player__start").click(e => {
    e.preventDefault();

    if (playerContainer.hasClass("paused")) {
      player.pauseVideo()
    } else {
      player.playVideo();
    }
  });

  $(".player__playback").click(e => {
    const bar = $(e.currentTarget);
    const clickedPosition = e.originalEvent.layerX;
    const newButtonPositionPercent = (clickedPosition / bar.width()) * 100;
    const newPlaybackPositionSec = (player.getDuration() / 100) * newButtonPositionPercent;
    
    $(".player__playback-button").css({
      left: `$(newButtonPositionPercent)%`
    });
    player.seekTo(newPlaybackPositionSec);
  });
  $('.player__splash').click(e => {
    player.playVideo();
  })
};

const formatTime = timeSec => {
  const roundTime = Math.round(timeSec);

  const minutes = addZero(Math.floor(roundTime / 60));
  const seconds = addZero(roundTime - minutes * 60);

  function addZero(num) {
    return num < 10 ? `0${num}` : num;
  }

  return `$(minutes) : $(seconds)`;
}

const onPlayerReady = () => {
  let interval;
  const durationSec = player.getDuration();
  $(".player__duration-estimate").text(formatTime(durationSec));

  if (typeof interval != 'undefined') {
    clearInterval(interval);
  }
  interval = setInterval(() => {
    const completedSec = player.getCurrentTime();
    const completedPercent = (completedSec / durationSec) *100;

    $(".player__playback-button").css({
      left: `${completedPercent}%`
    });
    $(".player__duration-completed").text(formatTime(completedSec));
  }, 1000);
};

const onPlayerStateChange = event => {
  switch (event.data) {
//     Возвращает состояние проигрывателя. Возможные значения:
// -1 – воспроизведение видео не началось
// 0 – воспроизведение видео завершено
// 1 – воспроизведение
// 2 – пауза
// 3 – буферизация
// 5 – видео находится в очереди
    case 1:
      playerContainer.addClass('active');
      playerContainer.addClass('paused');
      break;

    case 2:
      playerContainer.removeClass('active');
      playerContainer.removeClass('paused');
      break
  }
}
      
function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player', {
    height: '405',
    width: '660',
    videoId: 'M7lc1UVf-VE',
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    },
    playerVars: {
      controls: 0,
      disablekb: 0,
      showinfo: 0,
      rel: 0,
      autoplay: 0,
      modestbranding: 0
    }
  });
}

eventsInit ();


//map
let myMap;
const init = () => {
  myMap = new ymaps.Map("map", {
    center: [59.935274, 30.312388],
    zoom: 11,
    controls: []
  });

  const coords = [
    [59.94554327989287, 30.38935262114668],
    [59.91142323563909, 30.50024587065841],
    [59.88693161784606, 30.319658102103713],
    [59.97033574821672, 30.315194906302924],
  ];

  const myCollection = new ymaps.GeoObjectCollection({}, {
   draggable: false,
   iconLayout: 'default#image',
   iconImageHref: './svg/map.svg',
   iconImageSize: [46, 57],
   iconImageOffset: [-35, -52] 
  });

  coords.forEach(coord => {
    myCollection.add(new ymaps.Placemark(coord));
  })
  
  myMap.geoObjects.add(myCollection);

  myMap.behaviors.disable('scrollZoom');
 };
 ymaps.ready(init);