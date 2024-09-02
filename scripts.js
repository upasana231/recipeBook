document.addEventListener('DOMContentLoaded', () => {
    const recipeList = document.getElementById('recipe-list');
    const recipeForm = document.getElementById('recipe-form');
    const searchBar = document.getElementById('search-bar');
    const categoryButtons = document.getElementById('category-buttons');
    const addRecipeBtn = document.getElementById('add-recipe-btn');
    const addRecipeDiv = document.getElementById('add-recipe');
    const categories = ['veg', 'non-veg', 'cake', 'Chinese'];
    
    let editingIndex = null;

    // Load recipes from local storage
    const loadRecipes = () => {
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
        recipeList.innerHTML = '';
        recipes.forEach((recipe, index) => {
            addRecipeToDOM(recipe, index);
        });
    };

    // Add recipe to the DOM
    const addRecipeToDOM = (recipe, index) => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.dataset.category = recipe.category;
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <button class="view-btn" data-index="${index}">View</button>
            <div class="recipe-details" style="display: none;">
                <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            </div>
            <button class="edit-btn" data-index="${index}">Edit</button>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        recipeList.appendChild(recipeCard);
    };

    // Handle recipe form submission
    recipeForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('recipe-name').value;
        const image = document.getElementById('recipe-image').value;
        const category = document.getElementById('recipe-category').value;
        const ingredients = document.getElementById('recipe-ingredients').value;
        const instructions = document.getElementById('recipe-instructions').value;

        const newRecipe = { name, image, category, ingredients, instructions };
        const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

        if (editingIndex !== null) {
            recipes[editingIndex] = newRecipe;
            editingIndex = null;
            document.getElementById('form-title').textContent = 'Add a New Recipe';
        } else {
            recipes.push(newRecipe);
        }

        localStorage.setItem('recipes', JSON.stringify(recipes));
        loadRecipes();
        recipeForm.reset();
        addRecipeDiv.style.display = 'none';
    });

    // Handle click events for editing, removing, and viewing recipes
    recipeList.addEventListener('click', (e) => {
        const target = e.target;

        if (target.classList.contains('edit-btn')) {
            const index = target.dataset.index;
            const recipes = JSON.parse(localStorage.getItem('recipes'));
            const recipe = recipes[index];

            document.getElementById('recipe-name').value = recipe.name;
            document.getElementById('recipe-image').value = recipe.image;
            document.getElementById('recipe-category').value = recipe.category;
            document.getElementById('recipe-ingredients').value = recipe.ingredients;
            document.getElementById('recipe-instructions').value = recipe.instructions;
            document.getElementById('recipe-index').value = index;
            document.getElementById('form-title').textContent = 'Edit Recipe';
            addRecipeDiv.style.display = 'block';
            editingIndex = index;
        } else if (target.classList.contains('remove-btn')) {
            const index = target.dataset.index;
            const recipes = JSON.parse(localStorage.getItem('recipes'));

            recipes.splice(index, 1);
            localStorage.setItem('recipes', JSON.stringify(recipes));
            loadRecipes();
        } else if (target.classList.contains('view-btn')) {
            const details = target.nextElementSibling;
            if (details.style.display === 'none' || details.style.display === '') {
                details.style.display = 'block';
                target.textContent = 'Hide';
            } else {
                details.style.display = 'none';
                target.textContent = 'View';
            }
        }
    });

    // Generate category buttons
    const generateCategoryButtons = () => {
        categories.forEach(category => {
            const button = document.createElement('button');
            button.classList.add('category-btn');
            button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            button.addEventListener('click', () => filterByCategory(category));
            categoryButtons.appendChild(button);
        });

        const allButton = document.createElement('button');
        allButton.classList.add('category-btn');
        allButton.textContent = 'All';
        allButton.addEventListener('click', () => filterByCategory('all'));
        categoryButtons.appendChild(allButton);
    };

    // Filter recipes by category
    const filterByCategory = (category) => {
        const recipeCards = document.querySelectorAll('.recipe-card');
        recipeCards.forEach(card => {
            if (card.dataset.category === category || category === 'all') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // Search recipes
    searchBar.addEventListener('input', (e) => {
        const searchText = e.target.value.toLowerCase();
        const recipeCards = document.querySelectorAll('.recipe-card');
        recipeCards.forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            if (name.includes(searchText)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Show add recipe form
    addRecipeBtn.addEventListener('click', () => {
        addRecipeDiv.style.display = 'block';
        document.getElementById('recipe-form').reset();
        document.getElementById('recipe-index').value = '';
        editingIndex = null;
        document.getElementById('form-title').textContent = 'Add a New Recipe';
    });

    // Initialize
    loadRecipes();
    generateCategoryButtons();
});
