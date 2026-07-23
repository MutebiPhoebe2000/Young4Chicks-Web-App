
// SIGNUP FORM

const signupForm = document.getElementById('signupForm');

function validateForm() {
  let fullName = document.getElementById('fullName').value.trim();
  let age = document.getElementById('age').value.trim();
  let gender = document.getElementById('gender').value.trim();
  let nin = document.getElementById('nin').value.trim();
  let phone = document.getElementById('phone').value.trim();
  let location = document.getElementById('location').value.trim();
  let email = document.getElementById('email').value.trim();
  let role = document.getElementById('role').value.trim();
  let password = document.getElementById('password').value.trim();
  let confirmPassword = document.getElementById('confirmPassword').value.trim();

  let fullNameErr = document.getElementById('fullNameErr');
  let ageErr = document.getElementById('ageErr');
  let genderErr = document.getElementById('genderErr');
  let ninErr = document.getElementById('ninErr');
  let phoneErr = document.getElementById('phoneErr');
  let locationErr = document.getElementById('locationErr');
  let emailErr = document.getElementById('emailErr');
  let roleErr = document.getElementById('roleErr');
  let passwordErr = document.getElementById('passwordErr');
  let confirmPasswordErr = document.getElementById('confirmPasswordErr');

  let errFlag = false;

  if (fullName === '') {
    fullNameErr.innerHTML = 'Name is Required!';
    errFlag = true;
  } else {
    fullNameErr.innerHTML = '';
  }


  if (age === '' || isNaN(age) || age <= 0) {
    ageErr.innerHTML = 'Enter a valid age!';
    errFlag = true;
  } else {
    ageErr.innerHTML = '';
  }


  if (gender === '') {
    genderErr.innerHTML = 'Select a gender!';
    errFlag = true;
  } else {
    genderErr.innerHTML = "";
  }


  if (nin === '') {
    ninErr.innerHTML = 'NIN is required!';
    errFlag = true;
  } else {
    ninErr.innerHTML = '';
  }



  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === "") {
    emailErr.innerHTML = "Email is required"
  } else if (!emailRegex.test(email)) {
    emailErr.innerHTML = 'Enter Correct Email';
    errFlag = true;
  } else {
    emailErr.innerHTML = '';
  }

  if (phone === '' || isNaN(phone) || phone.length < 10) {
    phoneErr.innerHTML = 'Enter a Valid Phone Number';
    errFlag = true;
  } else {
    phoneErr.innerHTML = '';
  }


  if (location === '') {
    locationErr.innerHTML = 'Location is Required';
    errFlag = true;
  } else {
    locationErr.innerHTML = '';
  }


  if (role === '') {
    roleErr.innerHTML = 'Role is Required!'
    errFlag = true;
  } else {
    roleErr.innerHTML = '';
  }


  if (password.length < 8) {
    passwordErr.innerHTML = 'Password must be at least 8!';
    errFlag = true;
  } else {
    passwordErr.innerHTML = '';
  }


  if (confirmPassword === '' || confirmPassword !== password) {
    confirmPasswordErr.innerHTML = 'Passwords do not match!'
    errFlag = true;
  } else {
    confirmPasswordErr.innerHTML = '';
  }

  if (errFlag) {
    return false;
  }
  return true
}

if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    if (!validateForm()) {
      e.preventDefault();
    }
  });
}

// MANAGER REGISTRATION FORM

