document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const adminPanel = document.getElementById('admin-panel');
    const loginSection = document.getElementById('login-section');
    const addProjectForm = document.getElementById('add-project-form');
    const manageProjectsSection = document.getElementById('manage-projects-section');
    const projectListDiv = document.getElementById('project-list');

    // Simple, direct password check. Not secure, for functionality only.
    const CORRECT_PASSWORD = 'qwerty1402pygrammer';

    function renderProjects() {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        projectListDiv.innerHTML = ''; // Clear the list before rendering

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
        if (!confirm('Are you sure you want to delete this project?')) {
            return;
        }
        let projects = JSON.parse(localStorage.getItem('projects')) || [];
        projects.splice(index, 1); // Remove the project at the given index
        localStorage.setItem('projects', JSON.stringify(projects));
        renderProjects(); // Re-render the list to show the change
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;

        if (password === CORRECT_PASSWORD) {
            loginSection.style.display = 'none';
            adminPanel.style.display = 'block';
            manageProjectsSection.style.display = 'block';
            sessionStorage.setItem('isAdmin', 'true'); // Keep logged in for the session
            renderProjects();
        } else {
            alert('Incorrect password!');
        }
    });

    addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('project-title').value;
        const description = document.getElementById('project-description').value;
        const link = document.getElementById('project-link').value;

        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        projects.push({ title, description, link });
        localStorage.setItem('projects', JSON.stringify(projects));

        alert('Project added successfully!');
        addProjectForm.reset();
        renderProjects(); // Re-render after adding a new project
    });
    
    // Check if user is already logged in for the session
    if (sessionStorage.getItem('isAdmin') === 'true') {
        loginSection.style.display = 'none';
        adminPanel.style.display = 'block';
        manageProjectsSection.style.display = 'block';
        renderProjects();
    }
}); 