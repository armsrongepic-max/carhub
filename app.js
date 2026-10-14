
function initScrollAnimation() {
  const cards = document.querySelectorAll('.car-card');
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
}


function searchCars() {
  const searchInput = document.getElementById('searchHome')?.value.toLowerCase() || '';
  const priceFilter = document.getElementById('priceFilterHome')?.value || '';

  if (!searchInput && !priceFilter) {
    alert('Please enter a search term or select a price range');
    return;
  }

  console.log('Searching for:', { searchInput, priceFilter });
  alert(`Redirecting to listings for: ${searchInput || 'all cars'} - Price: ${priceFilter || 'any'}`);
}


document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimation();
  setupNavigation();
  setupContactForm();
  loadDarkMode();
  updateNavbar();

  document.addEventListener('keydown', (e) => {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');

    if (e.key === 'Escape') {
      if (loginModal && loginModal.style.display === 'flex') closeLoginModal();
      if (signupModal && signupModal.style.display === 'flex') closeSignupModal();
    }

    if (e.key === 'Enter') {
      if (loginModal && loginModal.style.display === 'flex') confirmLogin();
      if (signupModal && signupModal.style.display === 'flex') confirmSignup();
    }
  });
});


function setupNavigation() {
  const homeLink = document.getElementById('homeLink');
  const listingsLink = document.getElementById('listingsLink');
  const signupLink = document.getElementById('signupLink');
  const loginLink = document.getElementById('loginLink');
  const logoutLink = document.getElementById('logoutLink');
  const dashboardLink = document.getElementById('dashboardLink');
  const ctaBtn = document.querySelector('.cta button');

  if (homeLink) {
    homeLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'index.html';
    });
  }

  if (listingsLink) {
    listingsLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'listings.html';
    });
  }

  if (signupLink) {
    signupLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('signupModal').style.display = 'flex';
    });
  }

  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginSeller();
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }

  if (dashboardLink) {
    dashboardLink.addEventListener('click', (e) => {
      e.preventDefault();
      const sellerName = localStorage.getItem('sellerName');
      if (sellerName) {
        window.location.href = 'seller-dashboard.html';
      }
    });
  }

  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      const sellerName = localStorage.getItem('sellerName');
      if (sellerName) {
        window.location.href = 'seller-dashboard.html';
      } else {
        loginSeller();
      }
    });
  }


  updateNavbar();
}


function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const message = document.getElementById('contactMessage').value;

  if (!name || !email || !message) {
    alert('Please fill in all fields.');
    return;
  }


  fetch('http://localhost:3001/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, message })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showToast('Message sent successfully! Check your email for confirmation.', 'success');
      document.getElementById('contactForm').reset();
    } else {
      showToast('Failed to send message. Please try again.', 'error');
    }
  })
  .catch(error => {
    console.error('Contact form error:', error);
   
    const whatsappMessage = `Hi! I'm ${name} (${email}). ${message}`;
    const whatsappUrl = `https://wa.me/2348110597222?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    const subject = encodeURIComponent('Carhub Inquiry from ' + name);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
    const mailtoUrl = `mailto:carhub@example.com?subject=${subject}&body=${body}`;
    window.open(mailtoUrl, '_blank');

    showToast('Message sent via WhatsApp and email fallback.', 'success');
    document.getElementById('contactForm').reset();
  });
}


function setupContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
}


function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('carhubDarkMode', isDarkMode);
}


function loadDarkMode() {
  const isDarkMode = localStorage.getItem('carhubDarkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }
}


function loginSeller() {
  const sellerName = localStorage.getItem('sellerName');
  if (sellerName) {
    window.location.href = 'seller-dashboard.html';
  } else {
    document.getElementById('loginModal').style.display = 'flex';
  }
}

function closeLoginModal() {
  document.getElementById('loginModal').style.display = 'none';
}

function closeSignupModal() {
  document.getElementById('signupModal').style.display = 'none';
}

function confirmLogin() {
  const email = document.getElementById('loginName').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }

  const accounts = JSON.parse(localStorage.getItem('carhubAccounts') || '[]');
  const account = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());

  if (!account) {
    alert('No account found. Please sign up first.');
    return;
  }

  if (account.password !== password) {
    alert('Incorrect password.');
    return;
  }

  localStorage.setItem('sellerName', account.name);
  localStorage.setItem('sellerEmail', account.email);

  document.getElementById('loginName').value = '';
  document.getElementById('loginPassword').value = '';
  closeLoginModal();
  updateNavbar();
  window.location.href = 'seller-dashboard.html';
}

function confirmSignup() {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const phone = document.getElementById('signupPhone').value.trim();
  const password = document.getElementById('signupPassword').value.trim();

  if (!name || !email || !phone || !password) {
    alert('Please fill in all fields.');
    return;
  }

  let accounts = JSON.parse(localStorage.getItem('carhubAccounts') || '[]');
  if (accounts.some(acc => acc.email.toLowerCase() === email.toLowerCase())) {
    alert('An account with this email already exists. Please login.');
    return;
  }

  accounts.push({ name, email, phone, password });
  localStorage.setItem('carhubAccounts', JSON.stringify(accounts));
  localStorage.setItem('sellerName', name);
  localStorage.setItem('sellerEmail', email);
  localStorage.setItem('sellerPhone', phone);

  document.getElementById('signupName').value = '';
  document.getElementById('signupEmail').value = '';
  document.getElementById('signupPhone').value = '';
  document.getElementById('signupPassword').value = '';

  closeSignupModal();
  updateNavbar();
  window.location.href = 'seller-dashboard.html';
}

function loginAdmin() {
  const password = prompt('Enter admin password:');
  if (password === 'admin123') {
    localStorage.setItem('adminUser', 'Admin');
    window.location.href = 'admin.html';
  } else if (password !== null) {
    alert('Incorrect password');
  }
}

const WHATSAPP_NUMBER = '2348110597222';

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    padding: 16px 24px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Add styles for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Logout function
function logout() {
  localStorage.removeItem('sellerName');
  localStorage.removeItem('sellerEmail');
  localStorage.removeItem('sellerPhone');
  updateNavbar();
  showToast('Logged out successfully', 'success');
}

// Update navbar based on login status
function updateNavbar() {
  const sellerName = localStorage.getItem('sellerName');
  const authButtons = document.getElementById('authButtons');
  const userMenu = document.getElementById('userMenu');
  const userGreeting = document.getElementById('userGreeting');

  if (sellerName) {
    // User is logged in
    if (authButtons) authButtons.style.display = 'none';
    if (userMenu) userMenu.style.display = 'block';
    if (userGreeting) userGreeting.textContent = `Hi, ${sellerName}!`;
  } else {
    // User is not logged in
    if (authButtons) authButtons.style.display = 'block';
    if (userMenu) userMenu.style.display = 'none';
  }
}