// document.addEventListener("DOMContentLoaded", () => {
//     // Load and compile the header template
//     function loadHeader() {
//         fetch('templates/header.hbs')
//             .then(response => response.text())
//             .then(templateContent => {
//                 const headerTemplate = Handlebars.compile(templateContent);
//                 document.getElementById('header').innerHTML = headerTemplate();
//                 attachNavigationListeners();
//             })
//             .catch(error => console.error('Error loading header template:', error));
//     }

//     // Load and compile a content template
//     function loadContent(templateName) {
//         fetch(`templates/${templateName}.hbs`)
//             .then(response => response.text())
//             .then(templateContent => {
//                 const template = Handlebars.compile(templateContent);
//                 document.getElementById('content').innerHTML = template();

//                 // Update URL
//                 if (history.pushState) {
//                     history.pushState(null, '', `#${templateName}`);
//                 }
//             })
//             .catch(error => console.error(`Error loading template ${templateName}:`, error));
//     }

//     // Attach event listeners for navigation links
//     function attachNavigationListeners() {
//         const navLinks = document.querySelectorAll('nav a');
//         navLinks.forEach(link => {
//             link.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 const contentId = e.target.getAttribute('data-content');
//                 loadContent(contentId);
//             });
//         });
//     }

//     // Load initial content based on URL hash or default to home
//     function loadContentFromHash() {
//         const hash = window.location.hash.substring(1) || 'home';
//         loadContent(hash);
//     }

//     // Load header and initial content
//     loadHeader();
//     loadContentFromHash();

//     // Handle browser back/forward navigation
//     window.addEventListener('popstate', loadContentFromHash);
// });
