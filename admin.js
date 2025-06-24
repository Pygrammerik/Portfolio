document.addEventListener('DOMContentLoaded', () => {
    const adminPanel = document.getElementById('admin-panel');
    const manageProjectsSection = document.getElementById('manage-projects-section');
    const adminDenied = document.getElementById('admin-denied');
    const addProjectForm = document.getElementById('add-project-form');
    const projectListDiv = document.getElementById('project-list');
    const resetAdminBtn = document.getElementById('reset-admin');

    // Защита админ панели паролем
    const ADMIN_PASSWORD = 'Pygrammerik2024!'; // Измените на свой пароль
    const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    
    if (!isAuthenticated) {
        // Показываем форму входа
        adminPanel.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h2>Admin Access Required</h2>
                <p>Enter password to access admin panel:</p>
                <input type="password" id="admin-password" placeholder="Enter password" style="padding: 10px; margin: 10px; width: 200px;">
                <br>
                <button onclick="checkPassword()" style="padding: 10px 20px; margin: 10px;">Login</button>
                <p id="password-error" style="color: red; display: none;">Incorrect password!</p>
            </div>
        `;
        adminPanel.style.display = 'block';
        manageProjectsSection.style.display = 'none';
        adminDenied.style.display = 'none';
        return;
    }
    
    // Доступ разрешён после успешной аутентификации
    adminPanel.style.display = 'block';
    manageProjectsSection.style.display = 'block';
    adminDenied.style.display = 'none';
    renderProjects();
    console.log('Доступ разрешен после аутентификации');

    if (resetAdminBtn) {
        resetAdminBtn.onclick = () => {
            // Очищаем только проекты, не токены
            localStorage.removeItem('projects');
            location.reload();
        };
    }

    function renderProjects() {
        console.log('renderProjects вызвана');
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        console.log('Текущие проекты:', projects);
        projectListDiv.innerHTML = '';
        if (projects.length === 0) {
            projectListDiv.innerHTML = '<p>No projects to display.</p>';
            return;
        }
        projects.forEach((project, index) => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            const title = document.createElement('p');
            title.textContent = project.title;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                deleteProject(index);
            });
            projectItem.appendChild(title);
            projectItem.appendChild(deleteButton);
            projectListDiv.appendChild(projectItem);
        });
    }

    function deleteProject(index) {
        if (!confirm('Are you sure you want to delete this project?')) return;
        let projects = JSON.parse(localStorage.getItem('projects')) || [];
        projects.splice(index, 1);
        localStorage.setItem('projects', JSON.stringify(projects));
        renderProjects();
    }

    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Форма отправлена');
        
        const title = document.getElementById('project-title').value;
        const description = document.getElementById('project-description').value;
        const link = document.getElementById('project-link').value;
        
        console.log('Данные формы:', { title, description, link });
        
        if (!title || !description || !link) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }
        
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        console.log('Проекты до добавления:', projects);
        
        projects.push({ title, description, link });
        localStorage.setItem('projects', JSON.stringify(projects));
        
        console.log('Проект добавлен:', { title, description, link });
        console.log('Проекты после добавления:', projects);
        
        alert('Project added successfully!');
        addProjectForm.reset();
        renderProjects();
    });
});

// Функция проверки пароля
function checkPassword() {
    const passwordInput = document.getElementById('admin-password');
    const errorElement = document.getElementById('password-error');
    const ADMIN_PASSWORD = 'Pygrammerik2024!'; // Должен совпадать с паролем выше
    
    if (passwordInput.value === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_authenticated', 'true');
        location.reload(); // Перезагружаем страницу для показа админ панели
    } else {
        errorElement.style.display = 'block';
        passwordInput.value = '';
    }
}

// Функция выхода из админ панели
function logoutAdmin() {
    sessionStorage.removeItem('admin_authenticated');
    location.reload();
} 