'use strict';

const radios = [...document.querySelectorAll('[name="money"]')];
const converterLabel = document.getElementById('money-converter');
const inputRUB = document.getElementById('rub');
const inputMoney = document.getElementById('money');

const APIkey = 'a3589a18347739d821982f28efa1aa2b';
const getData = () => fetch(`http://api.exchangeratesapi.io/v1/latest?access_key=${APIkey}&symbol=USD,RUB`);

const money = {
  usd: {
    text: 'Доллар США (USD)',
  },
  eur: {
    text: 'Евро (EUR)',
  }
};

getData()
  .then(response =>{
    if (response.status !== 200) {
      throw new Error('status network not 200');
    }
    return response.json();
  })
  .then(data => {
    let course = {usd: data.rates.USD, rub: data.rates.RUB};

    const getCheked = () => {
      let result;
      radios.forEach(item => {
        if (item.checked) {
          result = item.id;
        }
      });
      return result;
    };

    const changeMoney = event => {
      const id = event.target.id;
      converterLabel.textContent = money[id].text;
    };

    const getCourse = (id) => {
      let result;
      if (id === 'eur') {
        result = course.rub;
      } else {
        result = course.rub / course.usd;
      }
      return result;
    };

    const getMoneyValue = () => {
      let id = getCheked();
      let course = getCourse(id);
      inputMoney.value = (inputRUB.value / course).toFixed(2);
    };

    const getRUBValue = () => {
      let id = getCheked();
      let course = getCourse(id);
      inputRUB.value = (inputMoney.value * course).toFixed(2);
    };

    inputRUB.addEventListener('input', getMoneyValue);

    inputMoney.addEventListener('input', getRUBValue);

    radios.forEach(item => item.addEventListener('change', (event) => {
      changeMoney(event);
      getMoneyValue();
    }));
  })
  .catch(error => console.error(error));
