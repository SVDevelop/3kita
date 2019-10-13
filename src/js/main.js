$(document).ready(function(){
  $(".owl-carousel").owlCarousel({
  //   loop:true,
  //   margin:10,
  //   responsiveClass:true,
  //   autoWidth:true,
  //   responsive:{
  //       0:{
  //           items:1,
  //           nav:true
  //       },
  //       600:{
  //           items:3,
  //           nav:false
  //       },
  //       1000:{
  //           items:5,
  //           nav:true,
  //           loop:false
  //       }
  //   }
    loop:true, //Зацикливаем слайдер
    margin:10, //Отступ от элемента справа в 50px
    nav:true,   //Отключение навигации
    stafePadding: 20,
    autoWidth:true, 
    autoplay:false, //Автозапуск слайдера
    smartSpeed:1000, //Время движения слайда
    autoplayTimeout:2000, //Время смены слайда
    responsive:{ //Адаптивность. Кол-во выводимых элементов при определенной ширине.
        0:{
            items:1,
            nav:true
        },
        600:{
            items:4,
            nav:true
        },
        1000:{
            items:4,
            nav:false
        }
    }
   });




});

    ymaps.ready(function () {
        var myMap = new ymaps.Map('map', {
                center: [53.241556777181465,34.35385952329106],
                zoom: 15
            }, {
                searchControlProvider: 'yandex#search'
            }),

            // Создаём макет содержимого.
            MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                '<div style="color: #55FFFF; font-weight: bold;">$[properties.iconContent]</div>'
            ),

            myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                hintContent: 'Собственный значок метки',
                balloonContent: 'Это красивая метка'
            }, {
                // Опции.
                // Необходимо указать данный тип макета.
                iconLayout: 'default#image',
                // Своё изображение иконки метки.
                iconImageHref: 'img/icon.png',
                // Размеры метки.
                iconImageSize: [26, 26],
                // Смещение левого верхнего угла иконки относительно
                // её "ножки" (точки привязки).
                iconImageOffset: [-15, -25]
            }

           );

        myMap.geoObjects
            .add(myPlacemark);
    });

// drop menu
  // let el = document.getElementsByClassName('menu-item');
  // // console.log(el[0]);
  // for(let i = 0; i < el.length; i++) {
  //     el[i].addEventListener('mouseenter', showSub, false);
  //     el[i].addEventListener('mouseleave', hideSub, false);
  // }
  // function showSub() {
  //     if(this.children.length > 1) {
  //       this.children[1].style.height = "auto";
  //       this.children[1].style.opacity = "1";
  //       this.children[1].style.overflow = "visible";
  //     }
  //     else {
  //         return false;
  //     }
  // }
  // function hideSub() {
  //     if(this.children.length > 1) {
  //         this.children[1].style.height = "0";
  //         this.children[1].style.opacity = "0";
  //         this.children[1].style.overflow = "hidden";
  //     }
  //     else {
  //         return false;
  //     }
  // }