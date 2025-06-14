// Variable para almacenar los datos del menú una vez cargados
let menuData;
// Variable para el idioma actual
let currentLanguage = 'es';

// 1. Esperar a que todo el contenido del HTML esté listo
document.addEventListener('DOMContentLoaded', () => {
    // 2. Usar fetch para cargar el archivo JSON
    fetch('menu.json') // Asegúrate de que la ruta a 'menu.json' es correcta
        .then(response => {
            // Convertir la respuesta a formato JSON
            if (!response.ok) {
                throw new Error('La respuesta de la red no fue exitosa: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // 3. Una vez cargados los datos, asignarlos a nuestra variable
            menuData = data;
            
            // 4. Ahora que tenemos los datos, ejecutamos las funciones de inicialización
            initializeRestaurant();
            setupSmoothScrolling();
            initializeImageLoading(); // Se inicializa la carga de imágenes
        })
        .catch(error => {
            // Manejar errores en caso de que el archivo no se encuentre o sea inválido
            console.error('Error al cargar el menú:', error);
            document.body.innerHTML = '<p style="text-align:center; padding: 2rem; color: white;">Error al cargar el menú. Por favor, intenta más tarde.</p>';
        });
});

/**
 * Inicializa la información principal del restaurante en la página.
 */
function initializeRestaurant() {
    // Set restaurant info
    document.getElementById('restaurant-title').textContent = `Menú - ${menuData.restaurantName}`;
    document.getElementById('hero-restaurant-name').textContent = menuData.restaurantName;
    document.getElementById('restaurant-name-header').textContent = menuData.restaurantName;
    document.getElementById('restaurant-name-footer').textContent = menuData.restaurantName;
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Set logos
    const logos = document.querySelectorAll('#restaurant-logo, .hero-logo');
    logos.forEach(logo => {
        if (menuData.logoPath) {
            logo.src = menuData.logoPath;
            logo.style.display = 'block';
        }
    });
    
    // Populate categories
    populateCategories(menuData.categories);
    
    // Populate social media
    populateSocialMedia(menuData.socialMedia);
    
    // Show first category by default
    if (menuData.categories.length > 0) {
        displayCategoryItems(menuData.categories[0].id);
        // Asegurarse que el botón exista antes de agregar la clase
        const firstButton = document.querySelector('.category-button');
        if (firstButton) {
            firstButton.classList.add('active');
        }
    }
    
    // Update times
    updateRestaurantTimes();
}

/**
 * Crea y muestra los botones de cada categoría.
 * @param {Array} categories - El arreglo de categorías del menú.
 */
function populateCategories(categories) {
    const container = document.getElementById('category-buttons');
    container.innerHTML = '';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-button';
        button.textContent = category.name[currentLanguage];
        button.dataset.categoryId = category.id;
        button.addEventListener('click', () => {
            displayCategoryItems(category.id);
            document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
        container.appendChild(button);
    });
}

/**
 * Muestra los platillos de una categoría específica.
 * @param {string} categoryId - El ID de la categoría a mostrar.
 */
function displayCategoryItems(categoryId) {
    const category = menuData.categories.find(cat => cat.id === categoryId);
    const container = document.getElementById('menu-items-container');
    container.innerHTML = '';
    
    if (category && category.items) {
        category.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-item-card';
            
            let imageHTML = '';
            if (item.image) {
                imageHTML = `<img src="${item.image}" alt="${item.name[currentLanguage]}" style="opacity:0;">`; // Opacidad inicial en 0
            }
            
            let promoHTML = '';
            if (item.promo) {
                promoHTML = `<span class="promo-badge">${item.promo}</span>`;
            }
            
            card.innerHTML = `
                ${imageHTML}
                ${promoHTML}
                <div class="menu-item-content">
                    <h3>${item.name[currentLanguage]}</h3>
                    ${item.description ? `<p>${item.description[currentLanguage]}</p>` : ''}
                    <span class="price">${item.price}</span>
                </div>
            `;
            container.appendChild(card);
        });
        // Una vez que las tarjetas están en el DOM, inicializar la carga de sus imágenes
        initializeImageLoading();
    }
}

/**
 * Crea y muestra los enlaces a redes sociales.
 * @param {Array} socialLinks - El arreglo de enlaces de redes sociales.
 */
function populateSocialMedia(socialLinks) {
    const container = document.getElementById('social-media-links');
    if (!socialLinks || !container) return;
    
    container.innerHTML = '';
    socialLinks.forEach(link => {
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        anchor.setAttribute('aria-label', link.name);
        
        if (link.iconClass) {
            const icon = document.createElement('i');
            icon.className = link.iconClass;
            anchor.appendChild(icon);
        }
        container.appendChild(anchor);
    });
}

/**
 * Cambia el idioma de la página y actualiza el contenido.
 * @param {string} lang - El idioma a cambiar ('es' o 'en').
 */
function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update active button
    document.getElementById('lang-es').classList.toggle('active', lang === 'es');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    
    // Update all elements with data attributes
    document.querySelectorAll('[data-es][data-en]').forEach(element => {
        element.textContent = element.getAttribute(`data-${lang}`);
    });
    
    // Update categories and redisplay items
    populateCategories(menuData.categories);
    const activeButton = document.querySelector('.category-button[data-category-id]');
    if (activeButton) {
        // Mantenemos la categoría activa
        const activeId = activeButton.dataset.categoryId;
        displayCategoryItems(activeId);
        // Volvemos a marcar el botón como activo
        document.querySelector(`.category-button[data-category-id='${activeId}']`).classList.add('active');
    }
    
    // Update times
    updateRestaurantTimes();
}

/**
 * Actualiza los textos de horarios en la página.
 */
function updateRestaurantTimes() {
    const timesElement = document.getElementById('restaurantTimes');
    const heroHours = document.getElementById('hero-hours');
    const locationHours = document.getElementById('location-hours');
    
    const times = menuData.restaurantTimes[currentLanguage];
    if (timesElement) timesElement.textContent = times;
    if (heroHours) heroHours.innerHTML = times.replace(/\|/g, '<br>');
    if (locationHours) locationHours.textContent = times;
}

/**
 * Configura el desplazamiento suave para los enlaces internos.
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Agrega una animación de carga para las imágenes.
 */
function initializeImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Solo aplicar a imágenes que no han sido procesadas
      if (img.style.opacity !== '1') {
          img.style.transition = 'opacity 0.4s ease-in-out';
          
          if (img.complete) {
              img.style.opacity = '1';
          } else {
              img.addEventListener('load', function() {
                  this.style.opacity = '1';
              }, { once: true }); // El listener se ejecuta solo una vez
              
              img.addEventListener('error', function() {
                  this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23999"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                  this.style.opacity = '1';
              }, { once: true });
          }
      }
    });
}