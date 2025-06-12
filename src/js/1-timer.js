
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector('[data-start]');
const dateTimePicker = document.getElementById('datetime-picker');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let timerInterval = null; //bu değişken setInterval tarafından döbdürülecek olan ıd yi saklar başlangıçta null tabi. setInterval() fonksiyonu, bir zamanlayıcı başlatır ve bir ID döndürür.
//clearInterval(timerInterval) satırıyla geri sayım bittiğinde sayacı durduruyoruz. Eğer timerInterval'ı saklamazsak, bu zamanlayıcıyı durduramayız
let userSelectedDate = null;
startBtn.disabled = true;


const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
  onClose(selectedDates) {
      
    const selectedDate = selectedDates[0];// selectedDate dizisinde tek bir tarih verildiği için [0] yaptık
    const now = new Date();               //! selectedDates Flatpickr tarafından gönderilen tarih dizisidir.

    if (selectedDate <= now) {
        window.alert("Please choose a date in the future");
        startBtn.disabled = true;
        userSelectedDate = null;
    } else {
        userSelectedDate = selectedDate;
        startBtn.disabled = false;
    }
}
};
    
flatpickr("#datetime-picker", options);
  
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}


// Gün sayısı 2 veya daha fazla rakam olabilir. Onun dışındakiler 2 basamaklı olmalı.
function addLeadingZero(value) {
  return String(value).padStart(2, '0');//padstart metodu 2 karakterden kısa ise başına sıfır ekle demek burda
}

//şimdi zamanlayıcının görünen kısmını güncelliyelim xx:xx:xx:xx olsun isteniyo ödevde
function updateTimerDisplay({ days, hours, minutes, seconds }) { //parametreler convertMs fonksiyonunda gelen geri sayım verissidir.
  daysEl.textContent = days; //günler çift rakam zorunlu değil serbest
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

startBtn.addEventListener('click', () => {
  if (!userSelectedDate) {
    // Eğer kullanıcı tarih seçmemişse buraya girer
    iziToast.error({
      title: 'Hata',
      message: 'Lütfen önce bir tarih seçin.',
    });
  } else {
    // Geçerli tarih varsa buraya girer
    iziToast.info({
      title: 'The countdown has begun',
      message: `userSelectedDate: ${userSelectedDate.toLocaleString()}`,
    });

    startBtn.disabled = true; //bu kodu tekrar buraya yazmamızın nedeni start a basıp sayaç başlatıldığında start butonunu devre dışı bırakmak tekrar basılamasın
    dateTimePicker.disabled = true;//yine aynı durum sayaç başladığında yeni bir tarih seçimine izin vermez devredışı;

    timerInterval = setInterval(() => {
      const now = new Date();//Her saniye, şu anki tarihi ve saati alıyoruz. now değişkeni o anki anlık zamanı temsil eder.
      const diff = userSelectedDate - now;//diff — hedef tarihe kalan süre, milisaniye olarak.

      if (diff <= 0) {
        clearInterval(timerInterval);
        updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        iziToast.success({
          title: 'time is up!',
          message: 'countdown complete.',
        });
        return;
      }

      const time = convertMs(diff); //Eğer geri sayım bitmemişse, kalan milisaniyeyi convertMs fonksiyonuna gönderir.convertMs fonksiyonu milisaniyeyi gün, saat, dakika ve saniye olarak parçalara ayırır ve obje olarak döner.
      updateTimerDisplay(time);//her saniye azalışını ekranda göstermek için aslında
    }, 1000);
  }
});
