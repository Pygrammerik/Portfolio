document.addEventListener('DOMContentLoaded', () => {
    const adminPanel = document.getElementById('admin-panel');
    const manageProjectsSection = document.getElementById('manage-projects-section');
    const adminDenied = document.getElementById('admin-denied');
    const addProjectForm = document.getElementById('add-project-form');
    const projectListDiv = document.getElementById('project-list');
    const resetAdminBtn = document.getElementById('reset-admin');

    // Проверяем, установлен ли пароль
    const storedPassword = localStorage.getItem('admin_password');
    const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    
    if (!storedPassword) {
        // Первый вход - устанавливаем пароль
        adminPanel.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h2>First Time Setup</h2>
                <p>Set your admin password:</p>
                <input type="password" id="new-password" placeholder="Enter new password" style="padding: 10px; margin: 10px; width: 200px;">
                <br>
                <input type="password" id="confirm-password" placeholder="Confirm password" style="padding: 10px; margin: 10px; width: 200px;">
                <br>
                <button onclick="setPassword()" style="padding: 10px 20px; margin: 10px;">Set Password</button>
                <p id="password-error" style="color: red; display: none;">Passwords don't match or are too short!</p>
            </div>
        `;
        adminPanel.style.display = 'block';
        manageProjectsSection.style.display = 'none';
        adminDenied.style.display = 'none';
        return;
    }
    
    if (!isAuthenticated) {
        // Показываем форму входа
        adminPanel.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h2>Admin Access Required</h2>
                <p>Enter password to access admin panel:</p>
                <input type="password" id="admin-password" placeholder="Enter password" style="padding: 10px; margin: 10px; width: 200px;">
                <br>
                <button onclick="checkPassword()" style="padding: 10px 20px; margin: 10px;">Login</button>
                <button onclick="resetPassword()" style="padding: 10px 20px; margin: 10px; background-color: #ff6b6b;">Reset Password</button>
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

// Функция установки пароля при первом входе
function setPassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorElement = document.getElementById('password-error');
    
    if (newPassword.length < 6) {
        errorElement.textContent = 'Password must be at least 6 characters long!';
        errorElement.style.display = 'block';
        return;
    }
    
    if (newPassword !== confirmPassword) {
        errorElement.textContent = 'Passwords don\'t match!';
        errorElement.style.display = 'block';
        return;
    }
    
    // Сохраняем пароль в localStorage
    localStorage.setItem('admin_password', newPassword);
    sessionStorage.setItem('admin_authenticated', 'true');
    location.reload();
}

// Функция проверки пароля
function checkPassword() {
    const passwordInput = document.getElementById('admin-password');
    const errorElement = document.getElementById('password-error');
    const storedPassword = localStorage.getItem('admin_password');
    
    if (passwordInput.value === storedPassword) {
        sessionStorage.setItem('admin_authenticated', 'true');
        location.reload(); // Перезагружаем страницу для показа админ панели
    } else {
        errorElement.style.display = 'block';
        passwordInput.value = '';
    }
}

// Функция сброса пароля
function resetPassword() {
    if (confirm('Are you sure you want to reset the admin password? This will require setting a new password.')) {
        localStorage.removeItem('admin_password');
        sessionStorage.removeItem('admin_authenticated');
        location.reload();
    }
}

// Функция выхода из админ панели
function logoutAdmin() {
    sessionStorage.removeItem('admin_authenticated');
    location.reload();
} 