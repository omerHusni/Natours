/*eslint-disable*/

/*eslint-disable*/
/* eslint-disable */
const stripe = Stripe(
  'pk_test_51Kdh9vAKk263Csr7OOCGSGU1gUGindrIdImOn4TxXrVNTdrFTmJ3wOXjp8Fo0ppzjw7rn68ZUgkIWupdiL10yVFz00OjjtBwI4'
);

const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

async function login(email, password) {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8080/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in Succefully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8080/api/v1/users/logout',
    });
    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out! Please try again later');
  }
};

// type is either 'password' or 'data'
const upadateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:8080/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:8080/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert(
        'success',
        `${type.toUpperCase()}`,
        'Data updated successfully'
      );
    }
  } catch (err) {
    showAlert('ERROR', err.response.data.message);
  }
};

/*eslint-disable*/

const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoib21lcmgtaHVzbmkiLCJhIjoiY2wwMWN2eTQ4MHNuNzNjdDF5YnhhYWluaiJ9.2Wt2YXLrBPL7szwJ9CET3Q';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/omerh-husni/cl08ayu4i002714mgnof87d9q',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};

// DOM ELEMENTS
const mapBox = document.getElementById('map') || {};
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

//DELEGEATbION

const locations = JSON.parse(mapBox.dataset ? mapBox.dataset.locations : '{}');
if (window.location.pathname !== '/login' && window.location.pathname !== '/')
  displayMap(locations);

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //VALUES
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    upadateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('passwordCurrent').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    await upadateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('passwordCurrent').value = 'empty';
    document.getElementById('password').value = 'empty';
    document.getElementById('passwordConfirm').value = 'empty';
  });
}

const bookTour = async (tourId) => {
  // 1) Get checkout session from API
  // try {
  const session = await axios(
    `http://127.0.0.1:8080/api/v1/bookings/checkout-session/${tourId}`
  );
  // console.log(session);
  // console.log(session.data.session.id);
  // } catch (err) {
  //   showAlert('error', err);
  // }
  // 2) Create the checkout form + charge the credit card
  await stripe.redirectToCheckout({
    sessionId: session.data.session.id,
  });
};

const bookBtn = document.getElementById('book-tour');

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing ...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
