'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelector('.start-button');
const btnOptions = document.querySelectorAll('.option_1');
let subArray = [];

const uniqueSubarrayFun = function (arr, n) {
  let newArr = [];
  for (let i = 0; i < n; i++) {
    let item = arr.splice(Math.floor(Math.random() * arr.length), 1);

    newArr.push(item);
  }

  newArr = newArr.flat();
  return newArr;
};

const generateOptions = function (data, objData) {
  const subOptions = uniqueSubarrayFun(data, 4);
  let i = 0;
  btnOptions.forEach(btn => {
    btn.textContent = subOptions[i].name.common;
    i++;
  });
  if (subOptions.includes(objData)) return subOptions.indexOf(objData);
  const random = Math.floor(Math.random() * 4); //0 to 3
  btnOptions[random].textContent = objData.name.common;
  return random;
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  document.querySelectorAll('.endtext').forEach(end => {
    end.classList.add('hidden');
  });
  location.reload();
};
const requestData = function () {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/all`);
  request.send();
  request.addEventListener('load', function () {
    const data = JSON.parse(this.responseText);
    //console.log(data);
    subArray = uniqueSubarrayFun(data, 20);
  });
};
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
  document.querySelector('.country').classList.remove('hidden');

  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/all`);
  request.send();
  request.addEventListener('load', function () {
    const data = JSON.parse(this.responseText);
    //console.log(data);
    subArray = uniqueSubarrayFun(data, 20);
    let count = 1;
    let correctOption = 0;
    let wrong = '';
    document.querySelector('.country__img').src = subArray[count - 1].flags.png;
    correctOption = generateOptions(data, subArray[count - 1]);

    document.querySelector('.number').textContent = count;
    console.log(subArray[count - 1].name.common);

    document
      .querySelector('.country__data')
      .addEventListener('click', function (e) {
        if (!e.target.classList.contains('button')) return;
        if (e.target.textContent === subArray[count - 1].name.common) {
          correctOption++;
        } else {
          wrong+=subArray[count - 1].flag+ ' : '+subArray[count - 1].name.common+', ';
        }
        if (count === 20) {
          //closeModal();
          document.querySelector('.country').classList.add('hidden');
          const endText = `<div class="endtext"><div>You got ${correctOption} questions correct!</div>
          <div>You got the following wrong->${wrong}</div>
          <div> Press ESC to Restart!</div></div>`;
          document
            .querySelector('.modal')
            .insertAdjacentHTML('beforeend', endText);
          correctOption = 0;
          count = 0;
          return;
        }

        count++;
        //e.target.
        document.querySelector('.number').textContent = count;
        document.querySelector('.country__img').src =
          subArray[count - 1].flags.png;
        correctOption = generateOptions(data, subArray[count - 1]);
        console.log(subArray[count - 1].name.common);
      });
  });
};

btnsOpenModal.addEventListener('click', openModal);

overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  // console.log(e.key);

  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
