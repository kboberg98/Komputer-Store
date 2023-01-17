let balance = 200;
let loan = 0;
let paySalary = 100;
let isLoanActive = false;
let currentLaptop;

const balanceElement = document.getElementById("balance-value");
const loanValueElement = document.getElementById("loan-value");
const loanTxtElement = document.getElementById("loan-txt");
const paySaleryElement = document.getElementById("pay-value");
const repayBtn = document.getElementById("repay-btn");

balanceElement.innerHTML = `${balance}kr`;

const updateBalance = (balance) => {
  balanceElement.innerHTML = `${balance}kr`;
}

const updateLoan = (loan) => {
  loanTxtElement.innerHTML = `Outstanding loan`;
  loanValueElement.innerHTML = `${loan}kr`;
  isLoanActive = true;
  repayBtn.style.display = "block";
}

const removeLoan = () => {
  isLoanActive = false;
  repayBtn.style.display = "none";
  document.getElementById("loan-txt").innerHTML = ``;
  document.getElementById("loan-value").innerHTML = ``;
}

const updatePaySalery = (salery) => {
  paySaleryElement.innerHTML = `${salery}kr`;
}

const getLoanInput = () => {
  let userInput = prompt("How much loan would you like?");
  let loanNumber = parseInt(userInput);
  if(isNaN(loanNumber)){
    alert("Invalid input");
  } else {
      if(loanNumber > balance*2){
        alert("Sorry, we don't trust you to loan this much");
      } else if(isLoanActive == true){
          alert("You already have a loan, repay before getting a new loan");
      } else {
          loan = loanNumber;
          balance += loan;
          updateBalance(balance);
          updateLoan(loan);
      }
    }
}

const work = () => {
  paySalary += 100;
  updatePaySalery(paySalary);
}

const bank = () => {
  if(isLoanActive == true){
    let saleryDeduct = paySalary * 0.10;
    if(loan - saleryDeduct <= 0){
        removeLoan();
        paySalary -= saleryDeduct;
        balance += paySalary;
        paySalary = 0;
        updatePaySalery(paySalary);
        updateBalance(balance);
    } else {
        loan -= saleryDeduct;
        paySalary -= saleryDeduct;
        balance += paySalary;
        paySalary = 0;
        updatePaySalery(paySalary);
        updateLoan(loan);
        updateBalance(balance);
    }
  } else {
      balance += paySalary;
      paySalary = 0;
      updateBalance(balance);
      updatePaySalery(paySalary);
  }
}

const repayLoan = () => {
  if(loan - paySalary <= 0){
    balance = paySalary - loan + balance;
    paySalary = 0;
    removeLoan();
    updatePaySalery(paySalary);
    updateBalance(balance);
  } else {
    loan = loan - paySalary;
    paySalary = 0;
    updateLoan(loan);
    updatePaySalery(paySalary);
  }
}

const buyNow = () => {
  if(currentLaptop.price > balance) {
    alert("You can't afford the laptop: " + currentLaptop.title);
  } else {
    balance = balance - currentLaptop.price;
    updateBalance(balance);
    alert("Congratulations! You are the new owner of the laptop: " + currentLaptop.title);
  }
}

let baseUrl = "https://hickory-quilled-actress.glitch.me/";
      fetch(baseUrl + 'computers')
        .then(response => response.json())
        .then(data => {
          // Get the select and info elements
          let select = document.getElementById("laptop-dropdown");
          let image = document.getElementById("laptop-image");
          let name = document.getElementById("laptop-name");
          let description = document.getElementById("laptop-description");
          let price = document.getElementById("laptop-price");
          let specs = document.getElementById("laptop-specs");
          let firstLaptop = data[0];

          // Iterate through the laptops and create options
          data.forEach(laptop => {
            let option = document.createElement("option");
            option.value = laptop.id;
            option.text = laptop.title;
            select.appendChild(option);
          });
          // setting the first laptop as default
          select.value = firstLaptop.id;
          image.src = baseUrl + firstLaptop.image;
          name.innerHTML = firstLaptop.title;
          description.innerHTML = firstLaptop.description;
          currentLaptop = firstLaptop;
          price.innerHTML = firstLaptop.price + " NOK";
          specs.innerHTML = ""; // clear the ul
            if(firstLaptop && firstLaptop.specs) {
              let maxItems = Math.min(3, firstLaptop.specs.length); // get the first 3 specs or the total number of specs if it's less than 3
              for (let i = 0; i < maxItems; i++) {
                let li = document.createElement("li");
                li.innerHTML = firstLaptop.specs[i];
                specs.appendChild(li);
              }
            }else{
              let li = document.createElement("li");
              li.innerHTML = "No specs available for this laptop";
              specs.appendChild(li);
            }
          // call the change event to show the first laptop
          select.dispatchEvent(new Event("change"));

          // Add event listener to select element to update info on change
          select.addEventListener("change", (event) => {
            let chosenId = event.target.value;
            let chosenLaptop = data.find(laptop => laptop.id === parseInt(chosenId));
            if(chosenLaptop) {
              if(chosenLaptop.image) {
                let imageUrl = baseUrl + chosenLaptop.image;
                fetch(imageUrl)
                  .then(response => {
                    if(response.ok) {
                      image.src = imageUrl;
                    } else {
                      let newImageUrl = imageUrl.replace(".jpg", ".png");
                      fetch(newImageUrl)
                      .then(response => {
                        if(response.ok) {
                           image.src = newImageUrl;
                        } else {
                           image.src = "";
                        }
                      });
                    }
                  });
              } else {
                image.src = "";
              }
              name.innerHTML = chosenLaptop.title;
              description.innerHTML = chosenLaptop.description;
              price.innerHTML = chosenLaptop.price + " NOK";
              currentLaptop = chosenLaptop;
              specs.innerHTML = "";
              if(chosenLaptop.specs) {
                let specsList = chosenLaptop.specs.slice(0,3);
                specsList.forEach(spec => {
                  let li = document.createElement("li");
                  li.innerHTML = spec;
                  specs.appendChild(li);
                });
              }
            }else{
              image.src = "";
              name.innerHTML = "No Laptop selected";
              description.innerHTML = "";
              price.innerHTML = "";
              specs.innerHTML = "";
            }
          });
        });