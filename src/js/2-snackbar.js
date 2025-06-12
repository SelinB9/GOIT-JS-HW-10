//promisin esas istediği Kullanıcının girdiği delay ve state (fulfilled/rejected) bilgisine göre bir Promise üretmek. Bu Promise, belirtilen delay kadar bekleyecek.

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");

form.addEventListener("submit", (evt) => {
    evt.preventDefault();//syf nın yeni pencerede açılmasını engeller öğrendik artık

    const delay = Number(form.delay.value);
    const state = form.state.value;


    //promise (istek) üreici fonk yazalım
    function createPromise(delay, state) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                state === "fulfilled" ? resolve(delay) : reject(delay);
            }, delay);
        })
    }
    createPromise(delay, state)
    .then((delay) => {
      iziToast.success({
        title: "Success",
        message: ` Fulfilled promise in ${delay}ms`,
      });
    })
    .catch((delay) => {
      iziToast.error({
        title: "Error",
        message: ` Rejected promise in ${delay}ms`,
      });
    });
});





//Promise'ın işlemesi gerekiyor (resolved durumunda) veya reddedilmesi gerekiyor (rejected durumunda), radyo düğmelerinde seçilen seçeneğe bağlı olarak.
// resolve/reject metodlarına argüman olarak iletilen Promise değeri, milisaniye cinsinden gecikme süresi değeri olmalıdır.

/*createPromise adında bir fonksiyon tanımlıyor.
Bu fonksiyon, iki parametre alıyor: delay (milisaniye cinsinden bekleme süresi) ve stay (aslında kullanılmamış, orada hata olabilir, state kullanılmalı).
Fonksiyon, yeni bir Promise yaratıyor.
Promise'in içinde setTimeout ile delay kadar bekliyor.
Süre sonunda state değişkenine göre:
Eğer "fulfilled" ise Promise resolve (başarılı) olarak tamamlanıyor ve delay değeri gönderiliyor.
Değilse reject (hata) ile tamamlanıyor ve yine delay gönderiliyor.

createPromise fonksiyonunu çağırıyor ve kullanıcıdan alınan delay ve state parametrelerini veriyor.
Promise başarılı (resolve) olursa .then bloğu çalışır,
iziToast.success() ile ekranda yeşil başarılı mesaj gösterir. Mesajda gecikme süresi gösterilir.
Promise reddedilirse (reject) .catch bloğu çalışır,
iziToast.error() ile kırmızı hata mesajı gösterir. Yine gecikme süresi mesajda yer alır.
*/ 