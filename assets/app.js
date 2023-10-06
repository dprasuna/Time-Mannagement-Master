const date = new Date();
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let currentDay = date.getDay();
let interval = setInterval(() => location.reload(), 60 * 1000);

$('#currentTime').html(
  `${date.getHours() <= 12 ? date.getHours() : date.getHours() - 12}:${
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  } ${date.getHours() < 12 ? 'AM' : 'PM'}`,
);
$('#currentDay').html(daysOfWeek[currentDay]);

const storedObj = {};
for (day in daysOfWeek) {
  let startTime = 6;
  storedObj[daysOfWeek[day]] = Array.from(new Array(11), (s) => {
    startTime++;
    return {
      time: startTime,
      todo: '',
    };
  });
}

const storedData = JSON.parse(localStorage.getItem('storedData')) || storedObj;
console.log(storedObj);

const printSlots = (currentDay) => {
  $('.container').empty();
  storedData[daysOfWeek[currentDay]].forEach((currentItem) => {
    let inputGroup = $('<div class="input-group mb-3"></div>');
    inputGroup.attr(
      "style",
      `opacity: ${
        currentDay < date.getDay() ? 0.3 : (currentDay === date.getDay() && date.getHours() > currentItem.time)
          ? 0.3 : 1.0 
      }`
    );

    let inputPrepend = $('<div class="input-group-prepend">');
    let inputSpan1 = $('<span class=input-group-text></span>');
    inputSpan1.attr('id', 'inputGroup-sizing-default');
    inputSpan1.attr('style', 'width: 100px');
    inputSpan1.attr('data-time', currentItem.time);
    inputSpan1.html(
      `${currentItem.time < 13 ? currentItem.time : currentItem.time - 12}:00 ${currentItem.time < 12 ? 'am' : 'pm'}`,
    );
    inputPrepend.append(inputSpan1);

    let input = $(
      `<input type="text" style="text-align: center;" class="form-control" ${
        currentDay < date.getDay()
          ? 'disabled'
          : currentDay === date.getDay() && date.getHours() > currentItem.time
          ? 'disabled'
          : null
      }></input>`
    );
    input.val(currentItem.todo);
    input.attr('aria-label', 'Sizing example input');
    input.attr('aria-describedby', 'inputGroup-sizing-default');

    let inputAppend = $('<div class="input-group-append"></div>');
    let inputTxt = $('<div class="input-group-text"></div>');
    let inputSpan2 = $('<span></span>').attr('style', 'margin-right: 8px');
    inputSpan2.text('Save?');
    let inputCheckbox = $(
      `<input type="checkbox" ${
        currentDay < date.getDay()
          ? "disabled"
          : currentDay === date.getDay() && date.getHours() > currentItem.time
          ? "disabled"
          : null
      }></input>`
    );
    inputCheckbox.attr('aria-label', 'Checkbox for following text input');
    inputTxt.append(inputSpan2, inputCheckbox);
    inputAppend.append(inputTxt);

    inputGroup.append(inputPrepend, input, inputAppend);
    $('.container').append(inputGroup);
  });
};

printSlots(currentDay);

$('.container').on('click', 'input[type=checkbox]', (event) => {
  if (event.target.checked) {
    const inputText = event.target.parentNode.parentNode.parentNode.children[1].value;
    const timeInput = event.target.parentNode.parentNode.parentNode.children[0].children[0].getAttribute('data-time');
    storedData[daysOfWeek[currentDay]] = Array.from(storedData[daysOfWeek[currentDay]], (s) => {
      if (s.time === parseInt(timeInput))
        return {
          time: s.time,
          todo: inputText,
        };
      else return s;
    });
    localStorage.setItem('storedData', JSON.stringify(storedData));
  }
});

$('#left').click((event) => {
  if (currentDay != 0) {
    currentDay--;
    $('#currentDay').html(daysOfWeek[currentDay]);
    printSlots(currentDay);
  }
});

$('#right').click((event) => {
  if (currentDay < daysOfWeek.length - 1) {
    currentDay++;
    $('#currentDay').html(daysOfWeek[currentDay]);
    printSlots(currentDay);
  }
});

