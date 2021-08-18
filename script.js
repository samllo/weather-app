const form = document.querySelector(".banner form");
const input = document.querySelector(".banner input");
const msg = document.querySelector(".banner .msg");
const apiKey = "aee969eab04b4ce4a8d873be08bacd6d";
const list = document.querySelector(".card-section .cities");
/*
form.addEventListener("submit", e => {
  e.preventDefault(); // stops form from reloading page
  const inputVal = input.value; // takes input value
});
*/


form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  const listItems = list.querySelectorAll(".card-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      //athens,gr
      if (inputVal.includes(",")) {
        //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //athens
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector(".city-name span").textContent
      }.`;
      form.reset();
      input.focus();
      return;
    }
  }

  //ajax request & Icon retrieval
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  $.ajax({
    url: url,
    type: "GET",
    dataType: "jsonp",
    success: function(data){
      const { main, name, sys, weather } = data;
      const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
        weather[0]["icon"]
      }.svg`;
      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${weather[0]["description"]}</figcaption>
        </figure>`;
      li.innerHTML = markup;
      list.appendChild(li);
    },
    error: function(xhr, textStatus, errorThrown){
      msg.textContent = "Please search for a valid city 😩";
    }
  });
  msg.textContent = "";
  form.reset();
  input.focus();
});