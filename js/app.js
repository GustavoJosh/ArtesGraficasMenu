document.addEventListener('DOMContentLoaded', () => {
    const categoryButtonsContainer = document.getElementById('category-buttons');
    const menuItemsContainer = document.getElementById('menu-items-container');
    const restaurantTitle = document.getElementById('restaurant-title');
    const restaurantNameHeader = document.getElementById('restaurant-name-header');
    const restaurantNameFooter = document.getElementById('restaurant-name-footer');
    const restaurantLogo = document.getElementById('restaurant-logo');
    const socialMediaContainer = document.getElementById('social-media-links');
    const currentYearSpan = document.getElementById('current-year');

    let menuData = null; // Para almacenar los datos del JSON

    // Cargar datos del menú desde menu.json
    fetch('data/menu.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            menuData = data;
            restaurantTitle.textContent = `Menú - ${data.restaurantName}`;
            restaurantNameHeader.textContent = data.restaurantName;
            restaurantNameFooter.textContent = data.restaurantName;
            if (data.logoPath && restaurantLogo) { // Asumiendo que añades logoPath en tu JSON
                restaurantLogo.src = data.logoPath;
                restaurantLogo.style.display = 'block';
            }
            currentYearSpan.textContent = new Date().getFullYear();
            
            populateCategories(data.categories);
            populateSocialMedia(data.socialMedia);
            // Opcional: Mostrar la primera categoría por defecto
            if (data.categories.length > 0) {
                displayCategoryItems(data.categories[0].id);
                // Marcar el primer botón como activo
                const firstButton = categoryButtonsContainer.querySelector('.category-button');
                if (firstButton) {
                    firstButton.classList.add('active');
                }
            }
        })
        .catch(error => {
            console.error("Error al cargar el menú:", error);
            menuItemsContainer.innerHTML = `<p style="color:red; text-align:center;">Error al cargar el menú. Por favor, inténtalo más tarde.</p>`;
        });

    function populateCategories(categories) {
        categoryButtonsContainer.innerHTML = ''; // Limpiar botones existentes
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-button';
            button.textContent = category.name;
            button.dataset.categoryId = category.id; // Usar un atributo data para identificar la categoría
            button.addEventListener('click', () => {
                displayCategoryItems(category.id);
                // Manejar clase 'active' para el botón presionado
                document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
            categoryButtonsContainer.appendChild(button);
        });
    }

    function displayCategoryItems(categoryId) {
        if (!menuData) return;

        const category = menuData.categories.find(cat => cat.id === categoryId);
        menuItemsContainer.innerHTML = ''; // Limpiar platillos anteriores

        if (category && category.items) {
            category.items.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.className = 'menu-item-card';

                let imageHTML = '';
                if (item.image) {
                    imageHTML = `<img src="${item.image}" alt="${item.name}">`;
                }

                itemCard.innerHTML = `
                    ${imageHTML}
                    <h3>${item.name}</h3>
                    ${item.description ? `<p>${item.description}</p>` : ''}
                    <p class="price">${item.price}</p>
                `;
                menuItemsContainer.appendChild(itemCard);
            });
        } else {
            menuItemsContainer.innerHTML = "<p>No hay platillos en esta categoría.</p>";
        }
    }

    function populateSocialMedia(socialLinks) {
        if (!socialLinks || !socialMediaContainer) return;
        socialMediaContainer.innerHTML = '';
        socialLinks.forEach(link => {
            const anchor = document.createElement('a');
            anchor.href = link.url;
            anchor.target = "_blank"; // Abrir en nueva pestaña
            anchor.rel = "noopener noreferrer";
            anchor.setAttribute('aria-label', link.name); // Para accesibilidad

            if (link.iconClass) { // Si usas clases de Font Awesome u similar
                const icon = document.createElement('i');
                icon.className = link.iconClass;
                anchor.appendChild(icon);
            } else { // Si prefieres texto
                anchor.textContent = link.name;
            }
            socialMediaContainer.appendChild(anchor);
        });
    }
});