document.addEventListener('DOMContentLoaded', () => {
    const adminPanel = document.getElementById('admin-panel');
    const manageProjectsSection = document.getElementById('manage-projects-section');
    const adminDenied = document.getElementById('admin-denied');
    const addProjectForm = document.getElementById('add-project-form');
    const projectListDiv = document.getElementById('project-list');
    const resetAdminBtn = document.getElementById('reset-admin');

    // Доступ к админ панели - измените на ваш GitHub username если нужно ограничить доступ
    const ALLOWED_USERNAME = null; // Установите ваш GitHub username здесь для ограничения доступа
    const currentUsername = 'Pygrammerik'; // Здесь должен быть ваш реальный username
    
    // Если ALLOWED_USERNAME не задан, доступ разрешен всем
    // Если задан, то только указанному пользователю
    const hasAccess = !ALLOWED_USERNAME || currentUsername === ALLOWED_USERNAME;
    
    if (hasAccess) {
        // Доступ разрешён
        adminPanel.style.display = 'block';
        manageProjectsSection.style.display = 'block';
        adminDenied.style.display = 'none';
        renderProjects();
        console.log('Доступ разрешен для:', currentUsername);
    } else {
        // Доступ запрещён
        adminPanel.style.display = 'none';
        manageProjectsSection.style.display = 'none';
        adminDenied.style.display = 'block';
        console.log('Доступ запрещен для:', currentUsername);
        return;
    }

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