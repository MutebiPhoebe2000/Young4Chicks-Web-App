      //sales
  const salesForm = document.getElementById('salesAgentForm');

  salesForm.addEventListener('submit', function (event) {
    const pass = document.getElementById('agentPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (!salesForm.checkValidity() || pass !== confirm) {
      event.preventDefault();
      event.stopPropagation();

      if (pass !== confirm) {
        alert("Passwords do not match!");
      }
    }

    salesForm.classList.add('was-validated');
  });

  


    const chickForm = document.getElementById('chickRequestForm');

    chickForm.addEventListener('submit', function (event) {
      if (!chickForm.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      chickForm.classList.add('was-validated');
    });


  const form = document.getElementById('farmerRegForm');
  form.addEventListener('submit', function (event) {
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (!form.checkValidity() || password !== confirm) {
      event.preventDefault();
      event.stopPropagation();
      if (password !== confirm) {
        alert("Passwords do not match!");
      }
    }
    form.classList.add('was-validated');
  });



    
