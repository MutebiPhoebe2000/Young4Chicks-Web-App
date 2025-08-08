document.addEventListener('DOMContentLoaded', function() {
    const registerBtn = document.getElementById('registerBtn');
    const emailInput = document.getElementById('modal-email');

    registerBtn.addEventListener('click', function() {
        const email = emailInput.ariaValueMax.trim();
        if (email){
            let storedEmails = JSON.parse(localStorage.getItem('newsletterEmails')) || [];
            storedEmails.push(email);
            localStorage.setItem('newsletterEmails', JSON.stringify(storedEmails));

            alert('Thank you for Registering!');
            emailInput.value = "";
        } else {
            alert('Please enter your email address.');
        }
    });
});

      const tooltips = document.querySelectorAll('.tt')
      tooltips.forEach(t => {
        new bootstrap.Tooltip(t)
      });

      document.getElementById('accordion').classList.add('red-background');