/**
 * Residential Home Solutions - Project Tracker Module
 * Handles all tracker-related functionality
 */

// Project Tracker Module
const ProjectTracker = (function() {
    // Private variables
    let currentProject = null;
    let notificationTimeout = null;
    
    // Cache DOM elements
    const elements = {
        accessForm: null,
        projectId: null,
        email: null,
        trackerContainer: null,
        accessContainer: null
    };
    
    /**
     * Initialize the tracker module
     */
    function init() {
        cacheElements();
        bindEvents();
        checkForStoredProject();
    }
    
    /**
     * Cache DOM elements
     */
    function cacheElements() {
        elements.accessForm = document.getElementById('trackerAccessForm');
        elements.projectId = document.getElementById('projectId');
        elements.email = document.getElementById('email');
        elements.trackerContainer = document.getElementById('trackerContainer');
        elements.accessContainer = document.getElementById('accessContainer');
    }
    
    /**
     * Bind event listeners
     */
    function bindEvents() {
        if (elements.accessForm) {
            elements.accessForm.addEventListener('submit', handleAccessSubmit);
        }
        
        // Listen for storage events (for cross-tab sync)
        window.addEventListener('storage', handleStorageChange);
    }
    
    /**
     * Check if there's a stored project in sessionStorage
     */
    function checkForStoredProject() {
        const stored = sessionStorage.getItem('activeProject');
        if (stored) {
            try {
                const projectData = JSON.parse(stored);
                // Check if token is still valid (less than 24 hours old)
                if (projectData.timestamp && (Date.now() - projectData.timestamp) < 86400000) {
                    loadProject(projectData.projectId, projectData.email, projectData.token);
                } else {
                    sessionStorage.removeItem('activeProject');
                }
            } catch (e) {
                console.error('Error parsing stored project:', e);
                sessionStorage.removeItem('activeProject');
            }
        }
    }
    
    /**
     * Handle access form submission
     */
    async function handleAccessSubmit(e) {
        e.preventDefault();
        
        const projectId = elements.projectId.value.trim();
        const email = elements.email.value.trim();
        
        if (!projectId || !email) {
            showNotification('Please enter both Project ID and Email', 'error');
            return;
        }
        
        // Show loading state
        showLoading();
        
        try {
            // In a real implementation, this would be an API call to Salesforce
            // For demo purposes, we'll simulate with mock data
            const projectData = await fetchProjectData(projectId, email);
            
            if (projectData) {
                // Store in sessionStorage for persistence
                sessionStorage.setItem('activeProject', JSON.stringify({
                    projectId: projectId,
                    email: email,
                    token: projectData.token,
                    timestamp: Date.now()
                }));
                
                // Load the project
                loadProject(projectId, email, projectData.token);
            } else {
                hideLoading();
                showNotification('Project not found. Please check your credentials.', 'error');
            }
        } catch (error) {
            console.error('Error accessing project:', error);
            hideLoading();
            showNotification('An error occurred. Please try again.', 'error');
        }
    }
    
    /**
     * Fetch project data from Salesforce (simulated)
     */
    async function fetchProjectData(projectId, email) {
        // This is a simulation - in production, this would be a real API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Demo project IDs for testing
                const demoProjects = {
                    'RHS-2024-001': {
                        token: 'demo-token-123',
                        exists: true
                    },
                    'RHS-2024-002': {
                        token: 'demo-token-456',
                        exists: true
                    }
                };
                
                if (demoProjects[projectId]) {
                    resolve(demoProjects[projectId]);
                } else {
                    resolve(null);
                }
            }, 1000);
        });
    }
    
    /**
     * Load a project into the tracker
     */
    async function loadProject(projectId, email, token) {
        try {
            // In production, this would fetch from Salesforce
            // For demo, use mock data
            const projectDetails = await getMockProjectData(projectId);
            
            // Render the tracker
            renderTracker(projectDetails);
            
            // Hide access container, show tracker
            if (elements.accessContainer) {
                elements.accessContainer.style.display = 'none';
            }
            if (elements.trackerContainer) {
                elements.trackerContainer.style.display = 'block';
                // Scroll to tracker
                elements.trackerContainer.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Initialize tracker features
            initializeTrackerFeatures();
            
            // Show success notification
            showNotification(`Welcome back! Your project is ${projectDetails.status}`, 'success');
            
            hideLoading();
            
        } catch (error) {
            console.error('Error loading project:', error);
            hideLoading();
            showNotification('Error loading project data', 'error');
        }
    }
    
    /**
     * Get mock project data for demo
     */
    function getMockProjectData(projectId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockData = {
                    id: projectId,
                    customerName: 'John & Sarah Smith',
                    address: '1234 Maple Street, Spokane Valley, WA 99212',
                    projectType: 'Window Replacement',
                    products: 'Infinity by Marvin Windows (8 units)',
                    status: 'In Progress',
                    progress: 65,
                    startDate: '2024-02-15',
                    estimatedCompletion: '2024-03-10',
                    milestones: [
                        {
                            id: 1,
                            title: 'Initial Consultation',
                            description: 'Met with customer, measured windows, provided quote',
                            date: '2024-02-10',
                            status: 'completed'
                        },
                        {
                            id: 2,
                            title: 'Permits Approved',
                            description: 'City of Spokane Valley permits received',
                            date: '2024-02-14',
                            status: 'completed'
                        },
                        {
                            id: 3,
                            title: 'Materials Ordered',
                            description: 'Infinity windows ordered from manufacturer',
                            date: '2024-02-15',
                            status: 'completed'
                        },
                        {
                            id: 4,
                            title: 'Materials Received',
                            description: 'All windows have arrived at our facility',
                            date: '2024-02-28',
                            status: 'completed'
                        },
                        {
                            id: 5,
                            title: 'Installation - Day 1',
                            description: 'Removing old windows, preparing openings',
                            date: '2024-03-04',
                            status: 'active'
                        },
                        {
                            id: 6,
                            title: 'Installation - Day 2',
                            description: 'Installing new windows, sealing, trim work',
                            date: '2024-03-05',
                            status: 'pending'
                        },
                        {
                            id: 7,
                            title: 'Final Inspection',
                            description: 'Quality check and customer walkthrough',
                            date: '2024-03-06',
                            status: 'pending'
                        }
                    ],
                    photos: [
                        {
                            url: 'images/projects/project1-before.avif',
                            caption: 'Before: Original windows',
                            date: '2024-02-15',
                            type: 'before'
                        },
                        {
                            url: 'images/projects/project1-materials.avif',
                            caption: 'Infinity windows arrived',
                            date: '2024-02-28',
                            type: 'progress'
                        },
                        {
                            url: 'images/projects/project1-day1.avif',
                            caption: 'Day 1: Removal complete',
                            date: '2024-03-04',
                            type: 'progress'
                        }
                    ],
                    teamMembers: [
                        {
                            name: 'Mike Johnson',
                            role: 'Lead Installer',
                            phone: '(509) 555-0123'
                        },
                        {
                            name: 'Dave Wilson',
                            role: 'Installation Assistant',
                            phone: '(509) 555-0124'
                        }
                    ],
                    nextSteps: 'Installation continues tomorrow. We\'ll be installing the remaining 4 windows and starting the trim work.',
                    lastUpdated: '2024-03-04T16:30:00'
                };
                
                resolve(mockData);
            }, 500);
        });
    }
    
    /**
     * Render the tracker with project data
     */
    function renderTracker(project) {
        if (!elements.trackerContainer) return;
        
        const progressPercentage = project.progress;
        const progressStatus = getProgressStatus(progressPercentage);
        
        // Build milestones HTML
        const milestonesHtml = project.milestones.map(milestone => `
            <div class="timeline-item ${milestone.status}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="timeline-date">
                        <i class="far fa-calendar-alt"></i>
                        ${formatDate(milestone.date)}
                    </div>
                    <h4 class="timeline-title">${milestone.title}</h4>
                    <p class="timeline-desc">${milestone.description}</p>
                    <span class="timeline-status status-${milestone.status}">
                        ${milestone.status === 'active' ? 'In Progress' : milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                    </span>
                </div>
            </div>
        `).join('');
        
        // Build photos HTML
        const photosHtml = project.photos.map(photo => `
            <div class="photo-item" onclick="ProjectTracker.openLightbox('${photo.url}', '${photo.caption}')">
                <img src="${photo.url}" alt="${photo.caption}" loading="lazy">
                <div class="photo-overlay">
                    <p class="photo-caption">${photo.caption}</p>
                    <p class="photo-date">${formatDate(photo.date)}</p>
                </div>
            </div>
        `).join('');
        
        // Build team HTML
        const teamHtml = project.teamMembers.map(member => `
            <div class="detail-item">
                <div class="detail-label">
                    <i class="fas fa-user"></i> Team Member
                </div>
                <div class="detail-value">${member.name}</div>
                <div style="color: var(--tracker-gray); font-size: 0.9rem; margin-top: 5px;">
                    ${member.role}
                </div>
                <div style="margin-top: 10px;">
                    <a href="tel:${member.phone}" style="color: var(--tracker-secondary); text-decoration: none;">
                        <i class="fas fa-phone"></i> ${member.phone}
                    </a>
                </div>
            </div>
        `).join('');
        
        const trackerHtml = `
            <div class="tracker-card">
                <div class="tracker-header">
                    <div>
                        <h2>Project #${project.id}</h2>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">
                            <i class="fas fa-map-marker-alt"></i> ${project.address}
                        </p>
                    </div>
                    <span class="tracker-badge">
                        <i class="fas ${getStatusIcon(project.status)}"></i>
                        ${project.status}
                    </span>
                </div>
                
                <div class="tracker-body">
                    <!-- Progress Bar -->
                    <div class="progress-container">
                        <div class="progress-header">
                            <span class="progress-title">Project Progress</span>
                            <span class="progress-percentage">${progressPercentage}% ${progressStatus}</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${progressPercentage}%"></div>
                        </div>
                    </div>
                    
                    <!-- Quick Details Grid -->
                    <div class="details-grid">
                        <div class="detail-item">
                            <div class="detail-label">
                                <i class="far fa-calendar-alt"></i> Started
                            </div>
                            <div class="detail-value">${formatDate(project.startDate)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">
                                <i class="far fa-calendar-check"></i> Est. Completion
                            </div>
                            <div class="detail-value">${formatDate(project.estimatedCompletion)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">
                                <i class="fas fa-tools"></i> Project Type
                            </div>
                            <div class="detail-value">${project.projectType}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">
                                <i class="fas fa-box"></i> Products
                            </div>
                            <div class="detail-value">${project.products}</div>
                        </div>
                    </div>
                    
                    <!-- Timeline -->
                    <h3 style="color: var(--tracker-primary); margin: 40px 0 20px;">
                        <i class="fas fa-clock"></i> Project Timeline
                    </h3>
                    <div class="timeline">
                        ${milestonesHtml}
                    </div>
                    
                    <!-- Photo Gallery -->
                    <h3 style="color: var(--tracker-primary); margin: 40px 0 20px;">
                        <i class="fas fa-camera"></i> Project Photos
                    </h3>
                    <div class="photos-grid">
                        ${photosHtml}
                    </div>
                    
                    <!-- Team & Next Steps -->
                    <div class="details-grid" style="margin-top: 30px;">
                        <div>
                            <h4 style="color: var(--tracker-primary); margin-bottom: 15px;">
                                <i class="fas fa-users"></i> Your Installation Team
                            </h4>
                            <div class="details-grid" style="grid-template-columns: 1fr; gap: 15px;">
                                ${teamHtml}
                            </div>
                        </div>
                        <div>
                            <h4 style="color: var(--tracker-primary); margin-bottom: 15px;">
                                <i class="fas fa-clipboard-list"></i> Next Steps
                            </h4>
                            <div class="detail-item">
                                <p style="margin: 0; color: var(--tracker-gray); line-height: 1.6;">
                                    ${project.nextSteps}
                                </p>
                                <p style="margin-top: 15px; font-size: 0.9rem; color: var(--tracker-gray);">
                                    <i class="far fa-clock"></i> Last updated: ${formatDateTime(project.lastUpdated)}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div style="display: flex; gap: 15px; margin-top: 30px; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="ProjectTracker.contactTeam()">
                            <i class="fas fa-comment"></i> Message Your Team
                        </button>
                        <button class="btn btn-secondary" onclick="ProjectTracker.scheduleCall()">
                            <i class="fas fa-phone"></i> Schedule a Call
                        </button>
                        <button class="btn btn-secondary" onclick="ProjectTracker.refreshProject()">
                            <i class="fas fa-sync-alt"></i> Refresh
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        elements.trackerContainer.innerHTML = trackerHtml;
    }
    
    /**
     * Initialize tracker-specific features
     */
    function initializeTrackerFeatures() {
        // Auto-refresh every 5 minutes
        setInterval(() => {
            if (currentProject) {
                refreshProject();
            }
        }, 300000);
    }
    
    /**
     * Refresh project data
     */
    async function refreshProject() {
        showNotification('Updating project data...', 'info');
        // In production, fetch fresh data from Salesforce
        setTimeout(() => {
            showNotification('Project data updated', 'success');
        }, 1500);
    }
    
    /**
     * Open lightbox for photo viewing
     */
    function openLightbox(imageUrl, caption) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-modal active';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" onclick="this.closest('.lightbox-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
                <img src="${imageUrl}" alt="${caption}" class="lightbox-img">
                <div class="lightbox-caption">
                    <p>${caption}</p>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        // Close on click outside
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.remove();
            }
        });
        
        // Close on escape key
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                lightbox.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
    
    /**
     * Contact team member
     */
    function contactTeam() {
        showNotification('This feature will connect you with your installation team via SMS', 'info');
        // In production, open chat or SMS interface
    }
    
    /**
     * Schedule a call
     */
    function scheduleCall() {
        window.location.href = 'contact.html?schedule=project';
    }
    
    /**
     * Show loading state
     */
    function showLoading() {
        if (elements.accessContainer) {
            elements.accessContainer.innerHTML = `
                <div class="tracker-loading">
                    <div class="tracker-spinner"></div>
                    <p>Accessing your project...</p>
                </div>
            `;
        }
    }
    
    /**
     * Hide loading state
     */
    function hideLoading() {
        // Loading is removed when content renders
    }
    
    /**
     * Show notification
     */
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.tracker-notification');
        if (existing) {
            existing.remove();
        }
        
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        
        const titles = {
            success: 'Success',
            error: 'Error',
            info: 'Notice'
        };
        
        const notification = document.createElement('div');
        notification.className = `tracker-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-icon ${type}">
                <i class="fas ${icons[type]}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${titles[type]}</div>
                <p class="notification-message">${message}</p>
            </div>
            <button class="notification-close" onclick="this.closest('.tracker-notification').remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        notificationTimeout = setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    /**
     * Handle storage changes (for multi-tab sync)
     */
    function handleStorageChange(e) {
        if (e.key === 'activeProject' && !e.newValue) {
            // Project was logged out in another tab
            if (elements.trackerContainer) {
                elements.trackerContainer.style.display = 'none';
            }
            if (elements.accessContainer) {
                elements.accessContainer.style.display = 'block';
            }
        }
    }
    
    /**
     * Format date helper
     */
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    /**
     * Format datetime helper
     */
    function formatDateTime(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    /**
     * Get progress status text
     */
    function getProgressStatus(percentage) {
        if (percentage >= 75) return 'Almost Done';
        if (percentage >= 50) return 'Halfway There';
        if (percentage >= 25) return 'Well Underway';
        return 'Just Started';
    }
    
    /**
     * Get status icon
     */
    function getStatusIcon(status) {
        switch(status) {
            case 'In Progress': return 'fa-spinner fa-pulse';
            case 'Completed': return 'fa-check-circle';
            case 'On Hold': return 'fa-pause-circle';
            default: return 'fa-info-circle';
        }
    }
    
    /**
     * Logout of tracker
     */
    function logout() {
        sessionStorage.removeItem('activeProject');
        if (elements.trackerContainer) {
            elements.trackerContainer.style.display = 'none';
        }
        if (elements.accessContainer) {
            elements.accessContainer.style.display = 'block';
            // Reset form
            if (elements.accessForm) {
                elements.accessForm.reset();
            }
        }
        showNotification('You have been logged out', 'info');
    }
    
    // Public API
    return {
        init: init,
        openLightbox: openLightbox,
        contactTeam: contactTeam,
        scheduleCall: scheduleCall,
        refreshProject: refreshProject,
        logout: logout
    };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.tracker-access') || document.querySelector('.tracker-dashboard')) {
        ProjectTracker.init();
    }
});
