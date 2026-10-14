// Car database
let cars = [
  { id: 1, brand: "Toyota", model: "Camry 2020", price: 8500000, location: "Lagos", image: "picture1.jpg", year: 2020, mileage: "15,000 km", transmission: "Automatic", fuel: "Hybrid", description: "Excellent condition, fully serviced" },
  { id: 2, brand: "Mercedes", model: "C300", price: 18000000, location: "Abuja", image: "picture2.jpg", year: 2022, mileage: "8,000 km", transmission: "Automatic", fuel: "Petrol", description: "Luxury sedan, well-maintained" },
  { id: 3, brand: "Toyota", model: "Corolla", price: 4500000, location: "Lagos", image: "picture3.jpg", year: 2018, mileage: "45,000 km", transmission: "Manual", fuel: "Petrol", description: "Reliable and fuel efficient" },
  { id: 4, brand: "BMW", model: "X5", price: 25000000, location: "Lagos", image: "picture1.jpg", year: 2023, mileage: "2,000 km", transmission: "Automatic", fuel: "Petrol", description: "Latest model, premium features" },
  { id: 5, brand: "Honda", model: "Accord", price: 7500000, location: "Abuja", image: "picture2.jpg", year: 2019, mileage: "32,000 km", transmission: "Automatic", fuel: "Petrol", description: "Spacious and comfortable" },
  { id: 6, brand: "Toyota", model: "Highlander", price: 12000000, location: "Lagos", image: "picture3.jpg", year: 2021, mileage: "20,000 km", transmission: "Automatic", fuel: "Petrol", description: "Family SUV, good condition" }
];

const savedMainCars = JSON.parse(localStorage.getItem('mainCars')) || [];
if (savedMainCars.length) {
  cars = savedMainCars;
}

// Pagination state
let currentPage = 1;
const itemsPerPage = 3;

// State management
let favorites = JSON.parse(localStorage.getItem('carhubFavorites')) || [];
let comparisonCars = JSON.parse(localStorage.getItem('comparisonCars')) || [];
let sortBy = 'latest';
let currentFilters = {};

const container = document.getElementById("carContainer");

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

// Display cars with heart icon
function displayCars(filteredCars) {
  removePagination();
  if (filteredCars.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No cars found matching your criteria.</p>';
    return;
  }

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedCars = filteredCars.slice(start, end);

  container.innerHTML = "";
  paginatedCars.forEach(car => {
    const isFavorited = favorites.includes(car.id);
    container.innerHTML += `
      <div class="car-card" data-car-id="${car.id}">
        <div style="position: relative;">
          <img src="${car.image}" alt="${car.brand} ${car.model}">
          <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" onclick="toggleFavorite(${car.id})" title="Add to favorites">
            <i class="fas fa-heart"></i>
          </button>
        </div>
        <div class="car-info">
          <h3>${car.brand} ${car.model}</h3>
          <p><i class="fas fa-map-marker-alt"></i> ${car.location}</p>
          <p style="font-size: 0.9rem; color: #666;">
            <i class="fas fa-calendar"></i> ${car.year} | 
            <i class="fas fa-tachometer-alt"></i> ${car.mileage}
          </p>
          <span class="price">₦${car.price.toLocaleString()}</span>
          <button class="view-details-btn" onclick="viewDetails(${car.id})">View Details</button>
          <button onclick="contactSeller(${car.id})" style="width: 100%; padding: 8px; background: #25d366; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 5px; font-size: 0.9rem;">
            <i class="fab fa-whatsapp"></i> Contact Seller
          </button>
          <button onclick="shareCar(${car.id})" style="width: 100%; padding: 8px; background: #0077ff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 5px; font-size: 0.9rem;">
            <i class="fab fa-whatsapp"></i> Share
          </button>
          <button onclick="addToComparison(${car.id})" style="width: 100%; padding: 10px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 5px; transition: background 0.3s;">
            <i class="fas fa-exchange-alt"></i> Compare
          </button>
        </div>
      </div>
    `;
  });

  createPagination(totalPages, filteredCars);
}

// Create pagination controls
function createPagination(totalPages, filteredCars) {
  const paginationDiv = document.createElement('div');
  paginationDiv.className = 'pagination';
  paginationDiv.id = 'pagination';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '← Previous';
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      displayCars(filteredCars);
    }
  };
  paginationDiv.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.className = currentPage === i ? 'active' : '';
    pageBtn.onclick = () => {
      currentPage = i;
      displayCars(filteredCars);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    paginationDiv.appendChild(pageBtn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next →';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayCars(filteredCars);
    }
  };
  paginationDiv.appendChild(nextBtn);

  container.parentElement.appendChild(paginationDiv);
}

function removePagination() {
  const pagination = document.getElementById('pagination');
  if (pagination) pagination.remove();
}

// Toggle favorite
function toggleFavorite(carId) {
  const index = favorites.indexOf(carId);
  if (index > -1) {
    favorites.splice(index, 1);
    showToast('Removed from favorites', 'info');
  } else {
    favorites.push(carId);
    showToast('Added to favorites!', 'success');
  }
  localStorage.setItem('carhubFavorites', JSON.stringify(favorites));
  const filteredCars = applyFilters();
  currentPage = 1;
  displayCars(filteredCars);
}

// View car details
function viewDetails(carId) {
  const car = cars.find(c => c.id === carId);
  if (car) {
    localStorage.setItem('selectedCar', JSON.stringify(car));
    showCarModal(car);
  }
}

// Modal system
function showCarModal(car) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
      <img src="${car.image}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px;">
      <h2>${car.brand} ${car.model}</h2>
      <p><strong>Price:</strong> ₦${car.price.toLocaleString()}</p>
      <p><strong>Location:</strong> ${car.location}</p>
      <p><strong>Year:</strong> ${car.year}</p>
      <p><strong>Mileage:</strong> ${car.mileage}</p>
      <p><strong>Transmission:</strong> ${car.transmission}</p>
      <p><strong>Fuel Type:</strong> ${car.fuel}</p>
      <p><strong>Description:</strong> ${car.description}</p>
      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button onclick="contactSeller(${car.id})" style="background: #25d366; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; flex: 1;">
          <i class="fab fa-whatsapp"></i> Contact via WhatsApp
        </button>
        <button onclick="shareCar(${car.id})" style="background: #0077ff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; flex: 1;">
          <i class="fab fa-whatsapp"></i> Share via WhatsApp
        </button>
      </div>
      <button onclick="this.closest('.modal').remove()" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-top: 10px; width: 100%;">Close</button>
    </div>
  `;
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  `;
  modal.querySelector('.modal-content').style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  `;
  modal.querySelector('.close').style.cssText = `
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    color: #999;
  `;
  modal.querySelectorAll('button').forEach(btn => {
    btn.style.cssText = `
      background: #0077ff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
      margin-right: 10px;
    `;
  });
  document.body.appendChild(modal);
}

const WHATSAPP_NUMBER = '2348110597222';

// Contact seller
function contactSeller(carId) {
  const car = cars.find(c => c.id === carId);
  const buyerName = localStorage.getItem('sellerName') || 'Anonymous';
  const buyerEmail = localStorage.getItem('sellerEmail') || 'buyer@example.com';

  // Use seller's contact info if available, otherwise use default
  const sellerEmail = car.sellerEmail || 'seller@carhub.com';
  const sellerPhone = car.sellerPhone || WHATSAPP_NUMBER;

  // Send email notification
  fetch('http://localhost:3001/api/car-inquiry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      carId,
      buyerName,
      buyerEmail,
      sellerEmail,
      sellerPhone,
      carDetails: car
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showToast('Inquiry sent! Check your email for confirmation.', 'success');
    } else {
      showToast('Failed to send inquiry. Please try again.', 'error');
    }
  })
  .catch(error => {
    console.error('Car inquiry error:', error);
    // Fallback to WhatsApp with seller's phone if available
    const message = `Hi! I'm interested in your ${car.brand} ${car.model} (${car.year}) priced at ₦${car.price.toLocaleString()}. Can we discuss?`;
    const whatsappUrl = `https://wa.me/${sellerPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    showToast('Inquiry sent via WhatsApp.', 'success');
  });
}

// Share car via WhatsApp
function shareCar(carId) {
  const car = cars.find(c => c.id === carId);
  const message = `Check out this ${car.brand} ${car.model} (${car.year}) for ₦${car.price.toLocaleString()} on Carhub!`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

// Apply filters and sort
function applyFilters() {
  let filtered = [...cars];

  // Search filter
  const search = document.getElementById("search")?.value.toLowerCase() || '';
  if (search) {
    filtered = filtered.filter(car => 
      car.brand.toLowerCase().includes(search) || 
      car.model.toLowerCase().includes(search)
    );
  }

  // Price filter
  const price = document.getElementById("priceFilter")?.value;
  if (price) {
    filtered = filtered.filter(car => car.price <= parseInt(price));
  }

  // Brand filter
  const brand = document.getElementById("brandFilter")?.value;
  if (brand) {
    filtered = filtered.filter(car => car.brand === brand);
  }

  // Location filter
  const location = document.getElementById("locationFilter")?.value;
  if (location) {
    filtered = filtered.filter(car => car.location === location);
  }

  // Apply sort
  const sortValue = document.getElementById("sortBy")?.value || 'latest';
  if (sortValue === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortValue === 'latest') {
    filtered.sort((a, b) => b.year - a.year);
  }

  return filtered;
}

// Filter cars function
function filterCars() {
  currentPage = 1;
  const filtered = applyFilters();
  displayCars(filtered);
  showToast(`Showing ${filtered.length} cars`, 'info', 2000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const filtered = applyFilters();
  displayCars(filtered);
  
  // Add event listeners
  document.getElementById("search")?.addEventListener("keyup", filterCars);
  document.getElementById("priceFilter")?.addEventListener("change", filterCars);
  document.getElementById("brandFilter")?.addEventListener("change", filterCars);
  document.getElementById("locationFilter")?.addEventListener("change", filterCars);
  document.getElementById("sortBy")?.addEventListener("change", filterCars);
  
  loadDarkMode();
});

// Compare functionality
function addToComparison(carId) {
  if (!comparisonCars.includes(carId)) {
    if (comparisonCars.length < 3) {
      comparisonCars.push(carId);
      localStorage.setItem('comparisonCars', JSON.stringify(comparisonCars));
      updateCompareButton();
      showToast('Added to comparison', 'success');
    } else {
      showToast('You can compare up to 3 cars', 'error');
    }
  }
}

function removeFromComparison(carId) {
  comparisonCars = comparisonCars.filter(id => id !== carId);
  localStorage.setItem('comparisonCars', JSON.stringify(comparisonCars));
  updateCompareButton();
  showComparison();
}

function updateCompareButton() {
  const compareCount = document.getElementById('compareCount');
  if (compareCount) {
    compareCount.textContent = comparisonCars.length;
  }
}

function showComparison() {
  if (comparisonCars.length === 0) {
    showToast('Add cars to comparison', 'info');
    return;
  }

  const modal = document.getElementById('comparisonModal');
  const comparisonCarsDiv = document.getElementById('comparisonCars');
  
  comparisonCarsDiv.innerHTML = '<div class="comparison-cars">';
  
  comparisonCars.forEach(carId => {
    const car = cars.find(c => c.id === carId);
    if (car) {
      comparisonCarsDiv.innerHTML += `
        <div class="comparison-car">
          <img src="${car.image}" alt="${car.brand} ${car.model}">
          <h4>${car.brand} ${car.model}</h4>
          <p><strong>Price:</strong> ₦${car.price.toLocaleString()}</p>
          <p><strong>Year:</strong> ${car.year}</p>
          <p><strong>Mileage:</strong> ${car.mileage}</p>
          <p><strong>Transmission:</strong> ${car.transmission}</p>
          <p><strong>Fuel:</strong> ${car.fuel}</p>
          <p><strong>Location:</strong> ${car.location}</p>
          <button onclick="removeFromComparison(${car.id})" style="background: #ff4444; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; width: 100%;">Remove</button>
        </div>
      `;
    }
  });
  
  comparisonCarsDiv.innerHTML += '</div>';
  modal.style.display = 'flex';
}

function hideComparison() {
  document.getElementById('comparisonModal').style.display = 'none';
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('carhubDarkMode', isDarkMode);
}

// Load dark mode preference
function loadDarkMode() {
  const isDarkMode = localStorage.getItem('carhubDarkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }
  updateCompareButton();
}