document.addEventListener('DOMContentLoaded', () => {
    // Удаление тестовых проектов (по названию или если их 3 и они стандартные)
    let projects = JSON.parse(localStorage.getItem('projects')) || [];
    // Удаляем тестовые проекты, если они есть
    projects = projects.filter(p => !(
        ["Project 1", "Project 2", "Project 3"].includes(p.title) && p.description.includes("brief description")
    ));
    localStorage.setItem('projects', JSON.stringify(projects));

    // Typewriter effect
    const typewriterElement = document.querySelector('.typewriter h1');
    if (typewriterElement) {
        // Use innerHTML to preserve the <br> tag
        const originalHTML = typewriterElement.innerHTML.replace(/<span class="typewriter-cursor"><\/span>/, '');
        typewriterElement.innerHTML = '';
        let i = 0;
        
        function typeWriter() {
            if (i < originalHTML.length) {
                // Check for <br> tag
                if (originalHTML.substring(i, i + 4) === '<br>') {
                    typewriterElement.innerHTML += '<br>';
                    i += 4;
                } else {
                    typewriterElement.innerHTML += originalHTML.charAt(i);
                    i++;
                }
                setTimeout(typeWriter, 80); // Adjust typing speed here
            } else {
                // Add cursor at the end
                typewriterElement.innerHTML += '<span class="typewriter-cursor"></span>';
            }
        }
        typeWriter();
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Load projects from local storage
    const projectGrid = document.querySelector('.project-grid');
    projects = JSON.parse(localStorage.getItem('projects')) || [];
    projectGrid.innerHTML = ''; // Clear the grid

    if (projects.length > 0) {
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card new-card';
            projectCard.innerHTML = `
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <a href="${project.link}" class="project-link" target="_blank">View Project</a>
                </div>
            `;
            projectGrid.appendChild(projectCard);
        });
    } else {
        const noProjectsMessage = document.createElement('p');
        noProjectsMessage.textContent = 'Your projects will be displayed here. Add some from the admin panel!';
        projectGrid.appendChild(noProjectsMessage);
    }
}); 