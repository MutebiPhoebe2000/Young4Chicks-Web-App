const chickRequestForm = document.getElementById('chickRequestForm');

if (chickRequestForm) {
chickRequestForm.addEventListener('submit', (e) => {
    // Get form values inside the event listener
    const farmerName = document.getElementById('farmerName').value.trim();
    const farmerNIN = document.getElementById('farmerNIN').value.trim();
    const numChicks = document.getElementById('numChicks').value.trim();
    const typeChicks = document.getElementById('typeChicks').value.trim();
    const farmerType = document.getElementById('farmerType').value.trim();

    // Get error elements
    const farmerNameErr = document.getElementById('farmerNameErr');
    const farmerNINErr = document.getElementById('farmerNINErr');
    const numChicksErr = document.getElementById('numChicksErr');
    const typeChicksErr = document.getElementById('typeChicksErr');
    const farmerTypeErr = document.getElementById('farmerTypeErr');

    let errFlag = true;

    // Validate farmer name
    if (farmerName === '') {
        farmerNameErr.innerHTML = 'Please enter your name!';
        errFlag = false;
    } else {
        farmerNameErr.innerHTML = '';
    }

    // Validate farmer NIN
    if (farmerNIN === '') {
        farmerNINErr.innerHTML = 'Please enter your NIN number!';
        errFlag = false;
    } else {
        farmerNINErr.innerHTML = '';
    }

    // Validate number of chicks
    if (numChicks === '') {
        numChicksErr.innerHTML = 'Please enter number of chicks!';
        errFlag = false;
    } else if (parseInt(numChicks) < 100 || parseInt(numChicks) > 500) {
        numChicksErr.innerHTML = 'Number of chicks must be between 100 and 500!';
        errFlag = false;
    } else {
        numChicksErr.innerHTML = '';
    }

    // Validate chick type
    if (typeChicks === '') {
        typeChicksErr.innerHTML = 'Please select chick type!';
        errFlag = false;
    } else {
        typeChicksErr.innerHTML = '';
    }

    // Validate farmer type
    if (farmerType === '') {
        farmerTypeErr.innerHTML = 'Please select farmer type!';
        errFlag = false;
    } else {
        farmerTypeErr.innerHTML = '';
    }

    // Prevent form submission if validation fails
    if (!errFlag) {
        e.preventDefault();
    }
});
}


const chickFeedsForm = document.getElementById('chickFeedsForm');

if (chickFeedsForm) {
chickFeedsForm.addEventListener('submit', (e) => {
    // Get form values inside the event listener
    const farmerFName = document.getElementById('farmerFName').value.trim();
    const farmerFNIN = document.getElementById('farmerFNIN').value.trim();
    const feedsFQuantity = document.getElementById('feedsFQuantity').value.trim();
    const typeFFeeds = document.getElementById('typeFChicks').value.trim();
    const farmerFType = document.getElementById('farmerFType').value.trim();

    // Get error elements
    const farmerFNameErr = document.getElementById('farmerFNameErr');
    const farmerFNINErr = document.getElementById('farmerFNINErr');
    const feedsFQuantityErr = document.getElementById('feedsFQuantityErr');
    const typeFFeedsErr = document.getElementById('typeFChicksErr');
    const farmerFTypeErr = document.getElementById('farmerFTypeErr');

    let errFlag = true;

    // Validate farmer name
    if (farmerFName === '') {
        farmerFNameErr.innerHTML = 'Please enter your name!';
        errFlag = false;
    } else {
        farmerFNameErr.innerHTML = '';
    }

    // Validate farmer NIN
    if (farmerFNIN === '') {
        farmerFNINErr.innerHTML = 'Please enter your NIN number!';
        errFlag = false;
    } else {
        farmerFNINErr.innerHTML = '';
    }

    // Validate number of feeds

    if (feedsFQuantity === '') {
        feedsFQuantityErr.innerHTML = 'Please enter Quantity of chicks!';
        errFlag = false;
    } else {
        feedsFQuantityErr.innerHTML = '';
    }

    // Validate chick type
    if (typeFFeeds === '') {
        typeFFeedsErr.innerHTML = 'Please select Feeds type!';
        errFlag = false;
    } else {
        typeFFeedsErr.innerHTML = '';
    }

    // Validate farmer type
    if (farmerFType === '') {
        farmerFTypeErr.innerHTML = 'Please select farmer type!';
        errFlag = false;
    } else {
        farmerFTypeErr.innerHTML = '';
    }

    // Prevent form submission if validation fails
    if (!errFlag) {
        e.preventDefault();
    }
});
}